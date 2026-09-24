"""Puntos de interés OSM (parques, dog parks, petshops, supermercados) en los 5 distritos -> data/pois.json"""
import json, urllib.request, urllib.parse, pathlib
D = pathlib.Path(__file__).parent / "data"
bbox = "-12.19,-77.07,-12.03,-76.86"  # S,W,N,E
q = f"""[out:json][timeout:60];
(
  node["leisure"="dog_park"]({bbox}); way["leisure"="dog_park"]({bbox});
  node["leisure"="park"]({bbox}); way["leisure"="park"]({bbox});
  node["shop"="pet"]({bbox}); way["shop"="pet"]({bbox});
  node["shop"="supermarket"]({bbox}); way["shop"="supermarket"]({bbox});
);
out center tags;"""
req = urllib.request.Request("https://overpass-api.de/api/interpreter", data=urllib.parse.urlencode({"data": q}).encode(), headers={"User-Agent": "VetClinica/1.0"})
res = json.load(urllib.request.urlopen(req, timeout=120))
pois = []
for el in res["elements"]:
    lat = el.get("lat") or el.get("center", {}).get("lat"); lng = el.get("lon") or el.get("center", {}).get("lon")
    if not lat: continue
    t = el.get("tags", {})
    kind = "dog_park" if t.get("leisure") == "dog_park" else "park" if t.get("leisure") == "park" else "pet_shop" if t.get("shop") == "pet" else "supermarket"
    pois.append({"kind": kind, "name": t.get("name"), "lat": round(lat, 5), "lng": round(lng, 5)})
(D / "pois.json").write_text(json.dumps(pois, ensure_ascii=False), encoding="utf-8")
from collections import Counter; print(Counter(p["kind"] for p in pois))
