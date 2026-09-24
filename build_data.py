"""Consolida places.json + enrichment_*.json + research/*.md (bloques json) -> data/dashboard.json"""
import json, re, glob, statistics as st, pathlib, datetime as dt
from collections import Counter

ROOT = pathlib.Path(__file__).parent
D = ROOT / "data"
DISTRICTS = ["Miraflores", "San Isidro", "San Borja", "Santiago de Surco", "La Molina"]


def json_block(md_path, name):
    if not md_path.exists():
        return {}
    txt = md_path.read_text(encoding="utf-8")
    start = txt.find(name) if name in txt else 0
    m = re.search(r"```json[^\n]*\n(.*?)```", txt[start:], re.S) or re.search(r"```json[^\n]*\n(.*?)```", txt, re.S)
    if not m:
        return {}
    try:
        return json.loads(m.group(1))
    except Exception as e:
        print("! json block", md_path.name, e)
        return {}


places = json.loads((D / "places.json").read_text(encoding="utf-8"))
enrich = {}
for f in glob.glob(str(D / "enrichment_*.json")):
    try:
        for e in json.loads(pathlib.Path(f).read_text(encoding="utf-8")):
            enrich[e["id"]] = e
    except Exception as e:
        print("! enrichment", f, e)


def by_district(raw):
    src = raw
    if isinstance(raw, dict):
        for key in ("district_stats", "regulation"):
            if key in raw:
                src = raw[key]
    if isinstance(src, list):
        src = {(x.get("district") or x.get("name")): x for x in src}
    out = {}
    if not isinstance(src, dict):
        return out
    for d in DISTRICTS:
        for k, v in src.items():
            if k and not k.startswith("_") and isinstance(v, dict) and (k.lower() in d.lower() or d.lower().split()[-1] in k.lower()):
                out[d] = v
    return out


stats = by_district(json_block(ROOT / "research" / "indicadores.md", "district_stats"))
reg = by_district(json_block(ROOT / "research" / "municipalidad.md", "regulation"))

# ---------- escucha social: temas en reseñas ----------
THEMES = {
    "Precio": r"\b(precio|caro|costos|cobran|tarifa|econ[oó]mic)",
    "Trato / atención": r"\b(amable|trato|atenci[oó]n|cari[ñn]o|paciencia|empat)",
    "Espera / demora": r"\b(espera|demora|tard[oó]|lento|cita)",
    "Emergencias 24h": r"\b(emergencia|urgencia|madrugada|24 ?h|noche)",
    "Diagnóstico / negligencia": r"\b(diagn[oó]stico|negligen|muri[oó]|falleci|error|mala? praxis)",
    "Limpieza / instalaciones": r"\b(limpi|instalaci|local|equipo|moderno)",
    "Cirugía / hospitalización": r"\b(cirug|oper|hospitaliz|internad)",
    "Grooming / baño": r"\b(ba[ñn]o|grooming|corte|peluquer)",
    "Estacionamiento / acceso": r"\b(estacionamiento|parqueo|ubicaci[oó]n)",
    "Recomendación": r"\b(recomiendo|recomendable|confianza|excelente)",
}


def themes_for(reviews):
    out = {}
    for t, rx in THEMES.items():
        pos = neg = 0
        for r in reviews:
            if re.search(rx, (r.get("text") or "").lower()):
                if (r.get("rating") or 0) >= 4:
                    pos += 1
                else:
                    neg += 1
        out[t] = {"pos": pos, "neg": neg}
    return out


def price_mentions(reviews):
    vals = []
    for r in reviews:
        for m in re.findall(r"s/\.?\s?(\d{2,4})", (r.get("text") or "").lower()):
            v = int(m)
            if 20 <= v <= 3000:
                vals.append(v)
    return vals


# ---------- cobertura horaria: cuántas clínicas están abiertas por día×hora ----------
def coverage(plist):
    grid = [[0] * 24 for _ in range(7)]
    for p in plist:
        if p["is_24h"]:
            for d in range(7):
                for h in range(24):
                    grid[d][h] += 1
            continue
        for per in p.get("periods", []):
            o, c = per.get("open"), per.get("close")
            if not o or not c:
                continue
            d, h = o["day"], o.get("hour", 0)
            end = c.get("hour", 24) if c["day"] == d else 24
            for hh in range(h, end):
                grid[d][hh] += 1
    return grid


# ---------- reseñas por día/hora (proxy de actividad) ----------
def review_activity(plist):
    dow = [0] * 7
    hours = [0] * 24
    months = Counter()
    for p in plist:
        for r in p["reviews"]:
            t = r.get("time")
            if not t:
                continue
            try:
                ts = dt.datetime.fromisoformat(t.replace("Z", "+00:00")) - dt.timedelta(hours=5)  # Lima UTC-5
            except Exception:
                continue
            dow[ts.weekday()] += 1
            hours[ts.hour] += 1
            months[ts.strftime("%Y-%m")] += 1
    return {"by_weekday": dow, "by_hour": hours, "by_month": dict(sorted(months.items())[-24:])}


# Reseñas que claramente son de otro negocio (bar/restaurante) publicadas por error en la ficha de la veterinaria
OFFTOPIC = re.compile(r"\b(tragos|cerveza|platos|comida|mozo|restaurante|pizza|ceviche|hamburguesa)\b")
ONTOPIC = re.compile(r"mascota|perr|gat|veterinari|doctor|dra\b|dr\b|vacuna|cachorr")
def is_offtopic(r):
    t = (r.get("text") or "").lower()
    return bool(OFFTOPIC.search(t)) and not ONTOPIC.search(t)

# ---------- merge por lugar ----------
# Reportados por los agentes de enriquecimiento como NO clínicas (tienda, distribuidor, guardería, café, equipos médicos)
NOT_CLINIC = ["animal club", "p&g", "gama medical", "petland", "soluciones veterinarias", "balto", "petmarket", "petshop duke", "master kennel", "unove"]
merged = []
for p in places:
    e = enrich.get(p["id"], {})
    p["reviews"] = [r for r in p["reviews"] if not is_offtopic(r)]
    prices = price_mentions(p["reviews"])
    ticket = e.get("ticket_estimate_soles") or (round(st.median(prices)) if prices else None)
    is24 = p["is_24h"] if e.get("is_24h_confirmed") is None else bool(e["is_24h_confirmed"])
    rec = {k: v for k, v in p.items() if k != "periods"}
    rec["periods"] = p.get("periods", [])
    rec["is_clinic"] = not any(n in p["name"].lower() for n in NOT_CLINIC) and bool(e.get("is_clinic", True)) and (p.get("primary_type") == "veterinary_care" or bool(re.search(r"vet|cl[ií]nica|hospital|consultorio", p["name"].lower())))
    rec.update({
        "is_24h_google": p["is_24h"], "is_24h": is24,
        "emergency": e.get("emergency"), "instagram": e.get("instagram"), "instagram_followers": e.get("instagram_followers"),
        "facebook": e.get("facebook"), "tiktok": e.get("tiktok"), "social_reputation": e.get("social_reputation") or "Sin datos",
        "services": e.get("services") or [], "specialties": e.get("specialties") or [],
        "consult_price": e.get("consult_price_soles"), "price_notes": e.get("price_notes"),
        "ticket": ticket, "ticket_basis": e.get("ticket_basis") or ("reseñas" if prices else None),
        "segment": e.get("segment"), "chain": e.get("chain"), "founded_year": e.get("founded_year"),
        "notes": e.get("notes"), "review_prices": prices, "themes": themes_for(p["reviews"]),
        "sources": e.get("sources") or [],
    })
    merged.append(rec)



# ---------- geoespacial: distancias, competidores en radio, grilla de huecos ----------
import math
def hav(lat1, lng1, lat2, lng2):
    R = 6371.0
    a = math.sin(math.radians(lat2 - lat1) / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(math.radians(lng2 - lng1) / 2) ** 2
    return 2 * R * math.asin(math.sqrt(a))

def point_in_ring(lat, lng, ring):
    inside = False
    n = len(ring)
    for i in range(n):
        x1, y1 = ring[i][0], ring[i][1]; x2, y2 = ring[(i + 1) % n][0], ring[(i + 1) % n][1]
        if (y1 > lat) != (y2 > lat):
            x = (x2 - x1) * (lat - y1) / (y2 - y1 + 1e-12) + x1
            if lng < x: inside = not inside
    return inside

def point_in_geom(lat, lng, geom):
    polys = [geom["coordinates"]] if geom["type"] == "Polygon" else geom["coordinates"]
    for poly in polys:
        if point_in_ring(lat, lng, poly[0]) and not any(point_in_ring(lat, lng, h) for h in poly[1:]): return True
    return False

def ring_area_km2(ring):
    # área aproximada (shoelace en km sobre proyección local)
    lat0 = sum(c[1] for c in ring) / len(ring)
    kx = 111.32 * math.cos(math.radians(lat0)); ky = 110.57
    a = 0
    for i in range(len(ring)):
        x1, y1 = ring[i][0] * kx, ring[i][1] * ky; x2, y2 = ring[(i + 1) % len(ring)][0] * kx, ring[(i + 1) % len(ring)][1] * ky
        a += x1 * y2 - x2 * y1
    return abs(a) / 2

GEO = json.loads((D / "districts.geojson").read_text(encoding="utf-8")) if (D / "districts.geojson").exists() else {"features": []}
GEOM = {f["properties"]["district"]: f["geometry"] for f in GEO["features"]}
AREA = {}
for dname, g in GEOM.items():
    polys = [g["coordinates"]] if g["type"] == "Polygon" else g["coordinates"]
    AREA[dname] = sum(ring_area_km2(poly[0]) for poly in polys)

POIS_ALL = json.loads((D / "pois.json").read_text(encoding="utf-8")) if (D / "pois.json").exists() else []
POIS = [q for q in POIS_ALL if any(point_in_geom(q["lat"], q["lng"], g) for g in GEOM.values())]
clinics_geo = [p for p in merged if p["is_clinic"]]
h24 = [p for p in clinics_geo if p["is_24h"]]
for p in clinics_geo:
    p["competitors_1km"] = sum(1 for q in clinics_geo if q is not p and hav(p["lat"], p["lng"], q["lat"], q["lng"]) <= 1.0)
    others24 = [hav(p["lat"], p["lng"], q["lat"], q["lng"]) for q in h24 if q is not p]
    p["nearest_24h_km"] = round(min(others24), 2) if others24 else None
    nn = [hav(p["lat"], p["lng"], q["lat"], q["lng"]) for q in clinics_geo if q is not p]
    p["nearest_clinic_km"] = round(min(nn), 2) if nn else None

def grid_for(dname, step_km=0.4):
    g = GEOM.get(dname)
    if not g: return []
    s_ = stats.get(dname, {}); pop = s_.get("population", {}); pop = pop.get("value") if isinstance(pop, dict) else pop
    hh = s_.get("households", {}); hh = hh.get("value") if isinstance(hh, dict) else hh
    coords = [c for poly in ([g["coordinates"]] if g["type"] == "Polygon" else g["coordinates"]) for c in poly[0]]
    lats = [c[1] for c in coords]; lngs = [c[0] for c in coords]
    dlat = step_km / 110.57; dlng = step_km / (111.32 * math.cos(math.radians(sum(lats) / len(lats))))
    cells = []
    lat = min(lats) + dlat / 2
    while lat < max(lats):
        lng = min(lngs) + dlng / 2
        while lng < max(lngs):
            if point_in_geom(lat, lng, g):
                n1 = sum(1 for q in clinics_geo if hav(lat, lng, q["lat"], q["lng"]) <= 1.0)
                d24 = min((hav(lat, lng, q["lat"], q["lng"]) for q in h24), default=None)
                dn = min((hav(lat, lng, q["lat"], q["lng"]) for q in clinics_geo), default=None)
                npoi = sum(1 for q in POIS if q["kind"] != "park" and hav(lat, lng, q["lat"], q["lng"]) <= 0.5) + sum(1 for q in POIS if q["kind"] == "park" and hav(lat, lng, q["lat"], q["lng"]) <= 0.3)
                cells.append({"lat": round(lat, 5), "lng": round(lng, 5), "clinics_1km": n1, "pois_500m": npoi, "nearest_24h_km": round(d24, 2) if d24 is not None else None, "nearest_clinic_km": round(dn, 2) if dn is not None else None})
            lng += dlng
        lat += dlat
    area = AREA.get(dname) or 1
    cell_hh = (hh or 0) * (step_km ** 2) / area  # hogares por celda (uniforme; ponytail: sin densidad real por manzana)
    for c in cells:
        c["households_est"] = round(cell_hh)
        # score de celda: pocos competidores en 1 km y lejos del 24h más cercano (ambos normalizados dentro del distrito)
    if cells:
        mx = max(c["clinics_1km"] for c in cells) or 1; mxd = max((c["nearest_24h_km"] or 0) for c in cells) or 1; mxp = max(c["pois_500m"] for c in cells) or 1
        for c in cells:
            # ponytail: score de celda = 50% poca competencia a 1 km + 25% lejos del 24h + 25% actividad (parques/petshops/supermercados cerca)
            c["score"] = round(100 * (0.5 * (1 - c["clinics_1km"] / mx) + 0.25 * min(1, (c["nearest_24h_km"] or 0) / mxd) + 0.25 * min(1, c["pois_500m"] / mxp)))
    return cells

GRID = {}
BEST_CELLS = {}
for dname in DISTRICTS:
    cells = grid_for(dname)
    GRID[dname] = cells
    # mejores celdas: score alto, pero con al menos 1 clínica a 1.5 km (evitar zonas sin actividad: parques, cerros)
    cand = [c for c in cells if (c["nearest_clinic_km"] or 99) <= 1.5]
    cand.sort(key=lambda c: -c["score"])
    picked = []
    for c in cand:
        if all(hav(c["lat"], c["lng"], q["lat"], q["lng"]) > 1.0 for q in picked): picked.append(c)
        if len(picked) == 3: break
    BEST_CELLS[dname] = picked
    print(f"grid {dname}: {len(cells)} celdas, área {AREA.get(dname, 0):.1f} km², mejores: {[(c['lat'], c['lng'], c['score']) for c in picked]}")

# ---------- agregados por distrito ----------
def agg(plist, name):
    ratings = [p["rating"] for p in plist if p["rating"]]
    revs = [p["reviews_count"] for p in plist]
    tickets = [p["ticket"] for p in plist if p["ticket"]]
    allrev = [r for p in plist for r in p["reviews"]]
    s = {k: (v.get("value") if isinstance(v, dict) and "value" in v else v) for k, v in stats.get(name, {}).items()}
    s_src = {k: v.get("source") for k, v in stats.get(name, {}).items() if isinstance(v, dict) and v.get("source")}
    s_est = {k: bool(v.get("estimated")) for k, v in stats.get(name, {}).items() if isinstance(v, dict)}
    rg = reg.get(name, {})
    pop = s.get("population")
    hh = s.get("households")
    top = sorted(plist, key=lambda x: -x["reviews_count"])[:8]
    tot_rev = sum(revs) or 1
    n24 = sum(1 for p in plist if p["is_24h"])
    return {
        "district": name, "count": len(plist),
        "count_24h": n24, "pct_24h": round(100 * n24 / max(1, len(plist))),
        "avg_rating": round(st.mean(ratings), 2) if ratings else None,
        "median_reviews": st.median(revs) if revs else 0, "total_reviews": sum(revs),
        "rating_dist": {
            "<3.5": sum(1 for r in ratings if r < 3.5),
            "3.5-3.9": sum(1 for r in ratings if 3.5 <= r < 4.0),
            "4.0-4.4": sum(1 for r in ratings if 4.0 <= r < 4.5),
            "4.5+": sum(1 for r in ratings if r >= 4.5),
        },
        "low_rated": sum(1 for r in ratings if r < 4.0),
        "avg_ticket": round(st.mean(tickets)) if tickets else None, "ticket_n": len(tickets),
        "chains": Counter(p["chain"] for p in plist if p.get("chain")).most_common(6),
        "with_web": sum(1 for p in plist if p["website"]), "with_instagram": sum(1 for p in plist if p.get("instagram")),
        "segments": dict(Counter(p["segment"] for p in plist if p.get("segment"))),
        "top": [{"name": p["name"], "rating": p["rating"], "reviews": p["reviews_count"],
                 "share_pct": round(100 * p["reviews_count"] / tot_rev, 1), "is_24h": p["is_24h"], "ticket": p["ticket"]} for p in top],
        "themes": themes_for(allrev), "coverage": coverage(plist), "activity": review_activity(plist),
        "population": pop, "households": hh, "nse_ab_pct": s.get("nse_ab_pct"), "rent_usd_m2": s.get("rent_usd_m2"),
        "pet_households_pct": s.get("pet_households_pct"), "avg_income": s.get("avg_income_soles"),
        "clinics_per_10k": round(len(plist) / pop * 10000, 2) if pop else None,
        "households_per_clinic": round(hh / len(plist)) if hh else None,
        "regulation": rg, "stats_sources": s_src, "stats_estimated": s_est,
        "area_km2": round(AREA.get(name, 0), 2), "best_cells": BEST_CELLS.get(name, []),
        "avg_nearest_clinic_km": round(st.mean([p["nearest_clinic_km"] for p in plist if p.get("nearest_clinic_km") is not None]), 2) if any(p.get("nearest_clinic_km") is not None for p in plist) else None,
        "avg_competitors_1km": round(st.mean([p["competitors_1km"] for p in plist if p.get("competitors_1km") is not None]), 1) if any(p.get("competitors_1km") is not None for p in plist) else None,
        "median_nearest_24h_km": round(st.median([p["nearest_24h_km"] for p in plist if p.get("nearest_24h_km") is not None]), 2) if any(p.get("nearest_24h_km") is not None for p in plist) else None,
    }


districts = [agg([p for p in merged if p["district"] == d and p["is_clinic"]], d) for d in DISTRICTS]


# ---------- score de oportunidad (0-100) ----------
def norm(vals, invert=False):
    xs = [v for v in vals if v is not None]
    if not xs or max(xs) == min(xs):
        return [50 for _ in vals]
    out = []
    for v in vals:
        if v is None:
            out.append(50)
            continue
        # ponytail: min-max entre 5 distritos exagera extremos; se mapea a 20-100 para que el peor no quede en 0
        t = 20 + (v - min(xs)) / (max(xs) - min(xs)) * 80
        out.append(round(120 - t if invert else t))
    return out


FRICTION = {"Baja": 100, "Media": 60, "Alta": 20}  # misma escala 20-100 que el resto
W = {"demand": .30, "saturation": .25, "quality_gap": .15, "gap_24h": .10, "rent": .10, "regulation": .10}
demand = [((d["households"] or 0) * ((d["nse_ab_pct"] or 50) / 100) * ((d["pet_households_pct"] or 50) / 100)) or None for d in districts]
comps = {
    "demand": norm(demand),
    "saturation": norm([d["clinics_per_10k"] if d["clinics_per_10k"] is not None else d["count"] for d in districts], invert=True),
    "quality_gap": norm([d["avg_rating"] for d in districts], invert=True),
    "gap_24h": norm([d["pct_24h"] for d in districts], invert=True),
    "rent": norm([d["rent_usd_m2"] for d in districts], invert=True),
    "regulation": [FRICTION.get((d["regulation"] or {}).get("friction"), 50) for d in districts],
}
for i, d in enumerate(districts):
    d["score_components"] = {k: comps[k][i] for k in W}
    d["score"] = round(sum(comps[k][i] * W[k] for k in W))
    d["score_label"] = "Alta oportunidad" if d["score"] >= 65 else "Oportunidad media" if d["score"] >= 45 else "Baja oportunidad"

ranking = sorted(districts, key=lambda d: -d["score"])
clinics = [p for p in merged if p["is_clinic"]]
allrev = [r for p in clinics for r in p["reviews"]]
tickets_all = [p["ticket"] for p in clinics if p["ticket"]]
out = {
    "generated_at": dt.date.today().isoformat(),
    "weights": W,
    "districts": districts,
    "ranking": [d["district"] for d in ranking],
    "global": {
        "raw_places": len(list((D / "raw").glob("*.json"))),
        "excluded_neighbors": len(list((D / "raw").glob("*.json"))) - len(merged),
        "excluded_not_clinic": len(merged) - len(clinics),
        "search_cap_note": "Google Places devuelve máx. 60 resultados por búsqueda; en Santiago de Surco las 5 búsquedas llegaron al tope, su conteo real puede ser mayor.",
        "count": len(clinics), "count_24h": sum(1 for p in clinics if p["is_24h"]),
        "avg_rating": round(st.mean([p["rating"] for p in clinics if p["rating"]]), 2),
        "total_reviews": sum(p["reviews_count"] for p in clinics),
        "avg_ticket": round(st.mean(tickets_all)) if tickets_all else None,
        "themes": themes_for(allrev), "coverage": coverage(clinics), "activity": review_activity(clinics),
        "enriched": sum(1 for p in merged if p["id"] in enrich),
    },
    "places": merged,
    "grid": GRID,
    "breakeven": json_block(ROOT / "research" / "preguntas_decisivas.md", "breakeven_assumptions"),
    "districts_geojson": GEO,
    "pois": POIS,
}
(D / "dashboard.json").write_text(json.dumps(out, ensure_ascii=False), encoding="utf-8")
(D / "dashboard.js").write_text("window.DASH = " + json.dumps(out, ensure_ascii=False) + ";", encoding="utf-8")  # para abrir index.html sin servidor
for d in ranking:
    print(f"{d['district']:20s} score={d['score']:3d} n={d['count']:3d} 24h={d['pct_24h']:2d}% rating={d['avg_rating']} ticket={d['avg_ticket']} per10k={d['clinics_per_10k']} rent={d['rent_usd_m2']}")
print("enriched:", out["global"]["enriched"], "| stats:", list(stats), "| reg:", list(reg))
