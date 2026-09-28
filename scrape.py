"""Scrapea clínicas veterinarias de 5 distritos de Lima con Google Places API (New).
Uso: python scrape.py  -> data/places.json (+ cache crudo en data/raw/)
"""
import json, os, time, urllib.request, urllib.error, pathlib, re

ROOT = pathlib.Path(__file__).parent
KEY = None
for line in (ROOT / ".env").read_text().splitlines():
    if line.startswith("GOOGLE_PLACES_API_KEY="):
        KEY = line.split("=", 1)[1].strip().strip('"').strip("'")
assert KEY, "Pega la clave en .env: GOOGLE_PLACES_API_KEY=..."

# Rectángulos aproximados por distrito (lat/lng) para sesgar la búsqueda
DISTRICTS = {
    "Miraflores":       {"low": (-12.1370, -77.0600), "high": (-12.1050, -77.0150), "alias": ["miraflores"]},
    "San Isidro":       {"low": (-12.1150, -77.0600), "high": (-12.0850, -77.0150), "alias": ["san isidro"]},
    "San Borja":        {"low": (-12.1150, -77.0150), "high": (-12.0800, -76.9800), "alias": ["san borja"]},
    "Santiago de Surco":{"low": (-12.1700, -77.0250), "high": (-12.0850, -76.9500), "alias": ["santiago de surco", "surco", "santiago de durco"]},
    "La Molina":        {"low": (-12.1150, -76.9800), "high": (-12.0400, -76.8700), "alias": ["la molina"]},
    "Jesús María":      {"low": (-12.0900, -77.0650), "high": (-12.0550, -77.0300), "alias": ["jesús maría", "jesus maria"]},
    "Surquillo":        {"low": (-12.1300, -77.0300), "high": (-12.0950, -76.9950), "alias": ["surquillo", "137surquillo", "1848surquillo"]},
    "Magdalena del Mar":{"low": (-12.1050, -77.0850), "high": (-12.0800, -77.0550), "alias": ["magdalena del mar", "magdalena"]},
}
QUERIES = ["clínica veterinaria", "veterinaria", "veterinaria 24 horas", "hospital veterinario", "consultorio veterinario"]
# Anillo de "ayuda": distritos vecinos; sus clínicas cuentan como competencia cerca del borde (zone = buffer)
NEIGHBOR_BOXES = {
    "Lince / Jesús María / Magdalena": {"low": (-12.1100, -77.0800), "high": (-12.0700, -77.0350)},
    "Surquillo / Barranco":            {"low": (-12.1550, -77.0350), "high": (-12.1050, -77.0000)},
    "La Victoria / San Luis":          {"low": (-12.0950, -77.0300), "high": (-12.0550, -76.9800)},
    "Ate / Santa Anita":               {"low": (-12.0650, -76.9900), "high": (-12.0200, -76.8900)},
    "Chorrillos / SJM / Villa María":  {"low": (-12.2100, -77.0400), "high": (-12.1600, -76.9300)},
}
BUFFER_KM = 1.5

SEARCH_FIELDS = "places.id,places.displayName,places.formattedAddress,places.location,places.types,places.primaryType,places.businessStatus,nextPageToken"
DETAIL_FIELDS = ",".join([
    "id","displayName","formattedAddress","shortFormattedAddress","addressComponents","location","types","primaryType",
    "businessStatus","rating","userRatingCount","priceLevel","regularOpeningHours","currentOpeningHours",
    "websiteUri","nationalPhoneNumber","internationalPhoneNumber","googleMapsUri","editorialSummary","reviews",
    "goodForChildren","accessibilityOptions","paymentOptions","parkingOptions","photos",
])

def post(url, body, mask):
    req = urllib.request.Request(url, data=json.dumps(body).encode(), headers={
        "Content-Type": "application/json", "X-Goog-Api-Key": KEY, "X-Goog-FieldMask": mask})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            msg = e.read().decode()
            if e.code == 429 or e.code >= 500:
                time.sleep(2 * (attempt + 1)); continue
            raise SystemExit(f"HTTP {e.code}: {msg}")
    raise SystemExit("Demasiados reintentos")

def get(url, mask):
    req = urllib.request.Request(url, headers={"X-Goog-Api-Key": KEY, "X-Goog-FieldMask": mask})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            msg = e.read().decode()
            if e.code == 429 or e.code >= 500:
                time.sleep(2 * (attempt + 1)); continue
            print("  ! detalle falló", e.code, msg[:200]); return None
    return None

def search(district, query, box=None):
    d = box or DISTRICTS[district]
    body = {
        "textQuery": f"{query} {district} Lima",
        "includedType": "veterinary_care",
        "languageCode": "es", "regionCode": "PE", "pageSize": 20,
        "locationRestriction": {"rectangle": {
            "low": {"latitude": d["low"][0], "longitude": d["low"][1]},
            "high": {"latitude": d["high"][0], "longitude": d["high"][1]}}},
    }
    out = []
    token = None
    for _ in range(3):
        if token: body["pageToken"] = token
        res = post("https://places.googleapis.com/v1/places:searchText", body, SEARCH_FIELDS)
        out += res.get("places", [])
        token = res.get("nextPageToken")
        if not token: break
        time.sleep(1.5)
    return out

def district_of(details):
    """Distrito por el componente 'locality' de Google; si dice 'Lima' (ambiguo) o no viene, se usa el polígono real (point-in-polygon)."""
    comps = details.get("addressComponents", [])
    loc = next((c.get("longText", "") for c in comps if "locality" in c.get("types", []) and "sublocality" not in c.get("types", [])), "")
    for name, d in DISTRICTS.items():
        if loc.strip().lower() in d["alias"]: return name
    if loc and loc.lower() != "lima": return None
    ll = details.get("location", {}); lat, lng = ll.get("latitude"), ll.get("longitude")
    if lat is None: return None
    for f in _geo()["features"]:
        if _point_in_geom(lat, lng, f["geometry"]): return f["properties"]["district"]
    return None

def _point_in_ring(lat, lng, ring):
    inside = False; n = len(ring)
    for i in range(n):
        x1, y1 = ring[i][0], ring[i][1]; x2, y2 = ring[(i + 1) % n][0], ring[(i + 1) % n][1]
        if (y1 > lat) != (y2 > lat):
            x = (x2 - x1) * (lat - y1) / (y2 - y1 + 1e-12) + x1
            if lng < x: inside = not inside
    return inside

def _point_in_geom(lat, lng, geom):
    polys = [geom["coordinates"]] if geom["type"] == "Polygon" else geom["coordinates"]
    return any(_point_in_ring(lat, lng, poly[0]) and not any(_point_in_ring(lat, lng, h) for h in poly[1:]) for poly in polys)

import math
_GEO = None
def _geo():
    global _GEO
    if _GEO is None:
        gp = ROOT / "data" / "districts.geojson"
        _GEO = json.loads(gp.read_text(encoding="utf-8")) if gp.exists() else {"features": []}
    return _GEO

def _seg_km(lat, lng, a, b):
    kx = 111.32 * math.cos(math.radians(lat)); ky = 110.57
    px, py = lng * kx, lat * ky; ax, ay = a[0] * kx, a[1] * ky; bx, by = b[0] * kx, b[1] * ky
    dx, dy = bx - ax, by - ay
    t = 0 if dx == dy == 0 else max(0, min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)))
    return math.hypot(px - (ax + t * dx), py - (ay + t * dy))

def buffer_of(details):
    """Si el lugar está fuera de los 5 distritos pero a <= BUFFER_KM del borde, devuelve (distrito más cercano, km)."""
    loc = details.get("location", {}); lat, lng = loc.get("latitude"), loc.get("longitude")
    if lat is None: return None
    best = (None, 9e9)
    for f in _geo()["features"]:
        g = f["geometry"]; polys = [g["coordinates"]] if g["type"] == "Polygon" else g["coordinates"]
        for poly in polys:
            ring = poly[0]
            for i in range(len(ring)):
                d = _seg_km(lat, lng, ring[i], ring[(i + 1) % len(ring)])
                if d < best[1]: best = (f["properties"]["district"], d)
    return best if best[0] and best[1] <= BUFFER_KM else None

def locality_of(details):
    return next((c.get("longText", "") for c in details.get("addressComponents", []) if "locality" in c.get("types", []) and "sublocality" not in c.get("types", [])), "")

def is_24h(details):
    oh = details.get("regularOpeningHours") or {}
    periods = oh.get("periods") or []
    if len(periods) == 1 and "close" not in periods[0]: return True
    txt = " ".join(oh.get("weekdayDescriptions", [])).lower()
    return "abierto las 24 horas" in txt and txt.count("abierto las 24 horas") >= 7

def normalize(p, district, zone="core", near_district=None, border_km=None):
    oh = p.get("regularOpeningHours") or {}
    reviews = [{
        "rating": r.get("rating"), "text": (r.get("text") or {}).get("text", ""),
        "time": r.get("publishTime"), "relative": r.get("relativePublishTimeDescription"),
        "author": (r.get("authorAttribution") or {}).get("displayName"),
    } for r in p.get("reviews", [])]
    return {
        "id": p["id"], "name": p["displayName"]["text"], "district": district,
        "zone": zone, "near_district": near_district, "border_km": round(border_km, 2) if border_km is not None else None,
        "address": p.get("formattedAddress"), "lat": p["location"]["latitude"], "lng": p["location"]["longitude"],
        "rating": p.get("rating"), "reviews_count": p.get("userRatingCount", 0),
        "price_level": p.get("priceLevel"), "types": p.get("types", []), "primary_type": p.get("primaryType"),
        "status": p.get("businessStatus"), "is_24h": is_24h(p),
        "hours": oh.get("weekdayDescriptions", []), "periods": oh.get("periods", []),
        "website": p.get("websiteUri"), "phone": p.get("nationalPhoneNumber"), "maps_url": p.get("googleMapsUri"),
        "summary": (p.get("editorialSummary") or {}).get("text"),
        "photos_count": len(p.get("photos", [])),
        "reviews": reviews,
    }

if __name__ == "__main__":
    ids = {}
    for district in DISTRICTS:
        for q in QUERIES:
            res = search(district, q)
            print(f"{district:20s} {q:26s} -> {len(res)}")
            for p in res:
                ids.setdefault(p["id"], set()).add(district)
    for name, box in NEIGHBOR_BOXES.items():
        for q in ["clínica veterinaria", "veterinaria"]:
            res = search(name, f"{q} {name.split(' / ')[0]}", box=box)
            print(f"{name:34s} {q:20s} -> {len(res)}")
            for p in res:
                ids.setdefault(p["id"], set()).add("buffer")
    print("únicos:", len(ids))

    places = []
    for i, (pid, hint) in enumerate(ids.items(), 1):
        cache = ROOT / "data" / "raw" / f"{pid}.json"
        if cache.exists():
            det = json.loads(cache.read_text(encoding="utf-8"))
        else:
            det = get(f"https://places.googleapis.com/v1/places/{pid}?languageCode=es&regionCode=PE", DETAIL_FIELDS)
            if not det: continue
            cache.write_text(json.dumps(det, ensure_ascii=False, indent=1), encoding="utf-8")
            time.sleep(0.15)
        district = district_of(det)
        if district:
            places.append(normalize(det, district))
        else:
            b = buffer_of(det)
            if not b: continue
            places.append(normalize(det, locality_of(det) or "Vecino", zone="buffer", near_district=b[0], border_km=b[1]))
        if i % 25 == 0: print(f"  detalles {i}/{len(ids)}")

    places.sort(key=lambda x: (x["district"], -(x["reviews_count"] or 0)))
    (ROOT / "data" / "places.json").write_text(json.dumps(places, ensure_ascii=False, indent=1), encoding="utf-8")
    from collections import Counter
    print("por distrito:", Counter(p["district"] for p in places if p["zone"] == "core"))
    print("buffer (<= %.1f km del borde):" % BUFFER_KM, Counter(p["district"] for p in places if p["zone"] == "buffer"))
    print("24h:", sum(p["is_24h"] for p in places), "| total:", len(places))
