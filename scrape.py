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
}
QUERIES = ["clínica veterinaria", "veterinaria", "veterinaria 24 horas", "hospital veterinario", "consultorio veterinario"]

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

def search(district, query):
    d = DISTRICTS[district]
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
    """Distrito por el componente 'locality' de Google; si dice 'Lima' (ambiguo) cae a la caja geográfica.
    Si nombra otro distrito (Lince, Surquillo, Ate...) se descarta."""
    comps = details.get("addressComponents", [])
    loc = next((c.get("longText", "") for c in comps if "locality" in c.get("types", []) and "sublocality" not in c.get("types", [])), "")
    for name, d in DISTRICTS.items():
        if loc.strip().lower() in d["alias"]: return name
    if loc and loc.lower() != "lima": return None
    ll = details.get("location", {}); lat, lng = ll.get("latitude"), ll.get("longitude")
    for name, d in DISTRICTS.items():
        if lat and d["low"][0] <= lat <= d["high"][0] and d["low"][1] <= lng <= d["high"][1]: return name
    return None

def is_24h(details):
    oh = details.get("regularOpeningHours") or {}
    periods = oh.get("periods") or []
    if len(periods) == 1 and "close" not in periods[0]: return True
    txt = " ".join(oh.get("weekdayDescriptions", [])).lower()
    return "abierto las 24 horas" in txt and txt.count("abierto las 24 horas") >= 7

def normalize(p, district):
    oh = p.get("regularOpeningHours") or {}
    reviews = [{
        "rating": r.get("rating"), "text": (r.get("text") or {}).get("text", ""),
        "time": r.get("publishTime"), "relative": r.get("relativePublishTimeDescription"),
        "author": (r.get("authorAttribution") or {}).get("displayName"),
    } for r in p.get("reviews", [])]
    return {
        "id": p["id"], "name": p["displayName"]["text"], "district": district,
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
        if not district:
            print(f"  ~ fuera de distritos: {det['displayName']['text']} | {det.get('formattedAddress')}"); continue
        places.append(normalize(det, district))
        if i % 25 == 0: print(f"  detalles {i}/{len(ids)}")

    places.sort(key=lambda x: (x["district"], -(x["reviews_count"] or 0)))
    (ROOT / "data" / "places.json").write_text(json.dumps(places, ensure_ascii=False, indent=1), encoding="utf-8")
    from collections import Counter
    print("por distrito:", Counter(p["district"] for p in places))
    print("24h:", sum(p["is_24h"] for p in places), "| total:", len(places))
