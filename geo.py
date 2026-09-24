"""Descarga polígonos de los 5 distritos desde Nominatim (OSM) -> data/districts.geojson (cache)."""
import json, urllib.request, urllib.parse, time, pathlib
OUT = pathlib.Path(__file__).parent / "data" / "districts.geojson"
NAMES = ["Miraflores", "San Isidro", "San Borja", "Santiago de Surco", "La Molina"]
feats = []
for n in NAMES:
    q = urllib.parse.urlencode({"q": f"{n}, Lima, Peru", "format": "jsonv2", "polygon_geojson": 1, "limit": 5})
    req = urllib.request.Request(f"https://nominatim.openstreetmap.org/search?{q}", headers={"User-Agent": "VetClinica/1.0 (site-selection study)"})
    res = json.load(urllib.request.urlopen(req, timeout=30))
    cand = [r for r in res if r.get("osm_type") == "relation" and r.get("geojson", {}).get("type") in ("Polygon", "MultiPolygon") and "boundary" in r.get("category", r.get("class", ""))]
    if not cand: cand = [r for r in res if r.get("geojson", {}).get("type") in ("Polygon", "MultiPolygon")]
    if not cand: print("!! sin polígono", n, [r.get("display_name") for r in res]); continue
    r = cand[0]
    feats.append({"type": "Feature", "properties": {"district": n, "osm_id": r["osm_id"], "name": r["display_name"]}, "geometry": r["geojson"]})
    print(n, r["osm_id"], r["display_name"][:60], r["geojson"]["type"])
    time.sleep(1.2)
OUT.write_text(json.dumps({"type": "FeatureCollection", "features": feats}, ensure_ascii=False), encoding="utf-8")
print("features:", len(feats), OUT.stat().st_size, "bytes")
