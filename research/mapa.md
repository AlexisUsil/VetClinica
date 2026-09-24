# Mapa de site selection: propuesta de rediseño

Investigado y verificado el 23-sep-2026. Todas las URLs de este documento se probaron con `curl` ese día y respondieron HTTP 200, salvo las marcadas.

Objetivo: que el mapa deje de describir la competencia y responda **"¿dónde abro?"**. Hoy muestra pines por rating, tamaño por reseñas y borde para 24h, o sea, un inventario. Para decidir faltan tres cosas: **límites de distrito**, **demanda no atendida** (huecos) y **qué pasa alrededor de un punto candidato** (radio de captación).

---

## 1. Recomendaciones priorizadas

### Imprescindible (P0)

| # | Qué | Por qué | Coste |
|---|-----|---------|-------|
| 1 | **Polígonos reales de los 5 distritos** (OSM): borde fino, relleno casi transparente, distrito activo resaltado | Sin límites el mapa no se lee como site selection. También recortan la grilla y el Voronoi | Bajo (GeoJSON de ~19 KB) |
| 2 | **Grilla de 400 m con "score de celda"** precalculada en `build_data.py` (clínicas a 1 km, hogares estimados, distancia al 24h más cercano), pintada como coropleta | Es la capa que muestra los huecos. Todo el cálculo se hace en Python, sin backend | Medio |
| 3 | **Modo "Explorar ubicación"**: un click coloca el pin candidato con anillos de 1 y 2 km y abre un panel de métricas | Es la interacción que vuelve el mapa una herramienta (mismo patrón que FoodPicker) | Medio (~150 líneas JS, haversine en cliente) |
| 4 | **Botón "Ubicación sugerida"**: 3 mejores celdas por distrito (precalculadas) como estrellas numeradas | Da al dueño una respuesta directa | Bajo si ya viene en el JSON |
| 5 | **Control de capas propio** (chips en una barra sobre el mapa, no `L.control.layers`) con leyenda que cambia según la capa activa | El control default queda escondido, no explica nada y no combina con el dashboard | Bajo |
| 6 | **Tooltip al pasar el cursor** (nombre, rating, 24h) y **mini tarjeta al hacer click** en lugar del popup largo | Se revisa rápido sin tener que abrir popups | Bajo |
| 7 | **Móvil**: altura `min(70vh, 640px)` con mínimo de 360 px; `leaflet-gesture-handling` (1 dedo hace scroll de la página, 2 dedos mueven el mapa); el panel Explorar se vuelve *bottom sheet* | Hoy el usuario puede quedar "atrapado" dentro del mapa en el celular | Bajo |

### Deseable (P1)

| # | Qué | Nota |
|---|-----|------|
| 8 | **Heatmap de densidad** (leaflet.heat) ponderado por reseñas | Vistoso, pero repite información de la grilla. Útil como primera impresión. Apagado por defecto |
| 9 | **Voronoi de competidores** (d3-delaunay) recortado al distrito | Área de influencia teórica de cada clínica. Si se colorea cada celda por hogares/clínica se ve qué clínicas cubren demasiado territorio |
| 10 | **Distancia al 24h más cercano** como modo de color de la grilla (en lugar de isolíneas) | Con celdas de 400 m ya se lee como una isócrona. Las isolíneas exigirían *marching squares* y no suman nada |
| 11 | **Capa de parques, dog parks y pet shops** (Overpass, precalculada) | Sirve de proxy de demanda (paseo de perros). En los 5 distritos hay 1031 parques, 3 dog parks y 22 pet shops (consulta del 23-sep-2026) |
| 12 | **Pin en la URL** (`#pin=-12.1102,-77.0318`) | Sirve para compartir un candidato. Son coordenadas del local, no datos personales |
| 13 | Comparar 2 pines lado a lado | Solo cuando el P0 ya esté funcionando |

### Descartado o de bajo valor
- **Clustering (markercluster)**: con 264 puntos no aporta. Agrupar oculta justo la densidad que queremos ver. Solo tendría algún sentido con zoom ≤ 12 y los 5 distritos a la vez, y ahí el heatmap lo resuelve mejor. Lo dejaría como opción apagada.
- **H3 (h3-js)**: es elegante, pero pesa 216 KB, y una grilla cuadrada de 400 m hecha en Python es más fácil de explicar ("cuadras de 400 m").
- **Isócronas reales de tráfico**: necesitan un servicio de ruteo (OSRM/ORS, con key). No se pueden hacer sin backend.

---

## 2. Librerías (CDN verificado)

Tomé la versión de `https://data.jsdelivr.com/v1/packages/npm/<pkg>/resolved` (última estable) y comprobé que cada archivo responde 200.

| Librería | Versión | URL | Uso | Prioridad |
|---|---|---|---|---|
| Leaflet | 1.9.4 | `https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js` y `.../dist/leaflet.css` | ya en uso | - |
| leaflet-gesture-handling | 1.2.2 | `https://cdn.jsdelivr.net/npm/leaflet-gesture-handling@1.2.2/dist/leaflet-gesture-handling.min.js` y `.../dist/leaflet-gesture-handling.min.css` | scroll en móvil | P0 |
| leaflet.heat | 0.2.0 | `https://cdn.jsdelivr.net/npm/leaflet.heat@0.2.0/dist/leaflet-heat.js` (espejo: `https://cdnjs.cloudflare.com/ajax/libs/leaflet.heat/0.2.0/leaflet-heat.js`) | heatmap | P1 |
| d3-delaunay | 6.0.4 | `https://cdn.jsdelivr.net/npm/d3-delaunay@6.0.4/dist/d3-delaunay.min.js` (19 KB, expone `d3.Delaunay`) | Voronoi | P1 |
| leaflet.markercluster | 1.5.3 | `https://cdn.jsdelivr.net/npm/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js` + `MarkerCluster.css` + `MarkerCluster.Default.css` (misma carpeta). Espejo: `https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/leaflet.markercluster.js` | clustering | opcional |
| @turf/turf | 7.4.0 | `https://cdn.jsdelivr.net/npm/@turf/turf@7.4.0/turf.min.js` (547 KB) | **No recomendado**. Solo haría falta para recortar el Voronoi en el cliente; es mejor recortarlo en Python (shapely) o dibujarlo sin recorte debajo de la máscara del distrito | evitar |
| h3-js | 4.5.0 | `https://cdn.jsdelivr.net/npm/h3-js@4.5.0/dist/h3-js.umd.js` | hexágonos | descartado |

Ninguna necesita key. Chart.js 4.4.1 ya está cargado.

Para los opcionales conviene la carga perezosa: insertar un `<script>` dinámico la primera vez que el usuario activa la capa.

---

## 3. Basemaps (estado a sep-2026)

Probé un tile z13 en Lima con cada proveedor:

| Basemap | URL template | ¿Key? | Estado | Veredicto |
|---|---|---|---|---|
| **Esri World Light Gray** (base + reference) | `https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}` y `.../Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}` | No (endpoint legacy) | 200 | **Mantener como default**. Es el más neutro y deja resaltar los colores de datos. Esri exige cuenta ArcGIS para uso comercial o monetizado; en un dashboard interno sin monetizar y con atribución visible es práctica común. `maxZoom: 16` |
| **Esri World Imagery** | `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}` | No | 200 | **Añadir como opción "Satélite"**. Ayuda a ver si una esquina es comercial, si hay parque cerca, el tamaño de los locales. Muy útil para site selection |
| **OpenStreetMap estándar** | `https://tile.openstreetmap.org/{z}/{x}/{y}.png` | No | 200 | Opción "Calles": nombres de calles y comercios hasta z19. Política de uso: atribución visible "© OpenStreetMap contributors", sin prefetch ni modo offline, Referer normal. Con uso bajo no hay problema |
| CARTO Positron / Voyager | `https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png`, `https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png` | El README oficial (CartoDB/basemap-styles) dice que **ahora requiere key** (gratis: no comercial hasta 5M req/mes, comercial hasta 1M) | Hoy responde 200 sin key | No depender de él: puede dejar de funcionar sin aviso |
| Stadia (Alidade Smooth) | `https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.png` | Sin key solo en `localhost`/`127.0.0.1`; en producción hay que registrar el dominio (cuenta gratis) o usar key | **401** fuera de localhost | Descartado para un HTML que se abre desde disco o se publica sin registrar el dominio |
| OSM France HOT | `https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png` | - | **404** en la prueba | Descartado |

**Tiles de parques o uso comercial:** no encontré ningún tile gratuito sin key para eso. La alternativa es una capa vectorial propia, precalculada con Overpass (probado, 200):

```
[out:json][timeout:60];
(relation(1944770);relation(1944812);relation(1944802);relation(1944844);relation(1944745););
map_to_area->.a;
( nwr(area.a)[leisure=park]; nwr(area.a)[leisure=dog_park];
  nwr(area.a)[shop=pet];     nwr(area.a)[landuse=commercial]; );
out center tags;
```
Se envía por POST a `https://overpass-api.de/api/interpreter` con `data=<query>`. `out center` devuelve puntos. Si se necesitan polígonos (por ejemplo para excluir parques de la demanda), usar `out geom`. Leer la respuesta con `encoding="utf-8"`.

Selector de basemap: 3 botones chicos en una esquina ("Gris · Calles · Satélite"), no el control default.

---

## 4. GeoJSON de los 5 distritos (verificado)

### Fuente principal: OpenStreetMap vía Nominatim

| Distrito | OSM relation | UBIGEO (`pe:ubigeo`) | Wikidata | Población en OSM (2025) | Área calculada |
|---|---|---|---|---|---|
| Miraflores | **1944770** | 150122 | Q1026229 | 126 049 | 9.42 km² |
| San Isidro | **1944812** | 150131 | Q2632912 | 73 401 | 9.73 km² |
| San Borja | **1944802** | 150130 | Q2566267 | 126 125 | 10.39 km² |
| Santiago de Surco | **1944844** | 150140 | Q427011 | 401 980 | 34.63 km² |
| La Molina | **1944745** | 150114 | Q3303762 | 151 360 | 49.00 km² |

Las cinco relaciones son `boundary=administrative`, `admin_level=8`, y la geometría es un `Polygon` simple. Cuidado: hay otro "Miraflores" en Yauyos (relation 1944771), que no es el que buscamos.

Para población y hogares hay que usar los del dashboard (CPI 2025, ya en `districts[].population` y `households`). Los valores de OSM sirven solo para contrastar.

**Descarga en Python (una sola llamada, ~19 KB):**

```python
import json, urllib.request
IDS = {"Miraflores": 1944770, "San Isidro": 1944812, "San Borja": 1944802,
       "Santiago de Surco": 1944844, "La Molina": 1944745}
url = ("https://nominatim.openstreetmap.org/lookup?osm_ids="
       + ",".join(f"R{i}" for i in IDS.values())
       + "&format=geojson&polygon_geojson=1&polygon_threshold=0.0001&extratags=1")
req = urllib.request.Request(url, headers={"User-Agent": "VetClinica-dashboard/1.0 (uso interno)"})
gj = json.load(urllib.request.urlopen(req, timeout=60))
for f in gj["features"]:
    t = f["properties"].get("extratags") or {}
    f["properties"] = {"district": f["properties"]["name"],
                       "osm_id": f["properties"]["osm_id"],
                       "ubigeo": t.get("pe:ubigeo")}
with open("data/districts.geojson", "w", encoding="utf-8") as fh:
    json.dump(gj, fh, ensure_ascii=False)
```
- `polygon_threshold=0.0001` (~11 m) simplifica sin deformar la forma. Si se quiere la geometría completa, basta con quitarlo.
- Nominatim pide un User-Agent identificable y como máximo 1 req/s. **Guardar el archivo en `data/` y descargarlo solo si no existe**, no en cada build.

**Alternativa por relación (geometría completa sin simplificar):** `https://polygons.openstreetmap.fr/get_geojson.py?id=1944770&params=0` (una URL por distrito cambiando el id; probado con 1944770 y 1944745, ambos 200).

### Fuente de respaldo: IGN en GitHub
- `https://raw.githubusercontent.com/joseluisq/peru-geojson-datasets/master/lima_callao_distritos.geojson`: 1.7 MB, 50 distritos. El campo `distrito2` trae el nombre en formato normal ("San Borja") y `institucion` = IGN. Filtrar con `distrito2 in IDS`.
- `https://raw.githubusercontent.com/juaneladio/peru-geojson/master/peru_distrital_simple.geojson`: 1.9 MB, todo el Perú. Campos `NOMBDIST` (en mayúsculas) e `IDDIST` (ubigeo INEI).

IGN y OSM pueden diferir por algunos metros en los bordes (por ejemplo Surco/San Borja), lo cual no importa aquí. Prefiero OSM: pesa menos y ya trae el ubigeo.

**Importante para el HTML:** el dashboard carga los datos con `<script src="data/dashboard.js">`, que funciona abriendo el archivo con `file://`. **No usar `fetch("data/districts.geojson")`**, porque falla con `file://`. `build_data.py` tiene que meter el GeoJSON dentro de `dashboard.js` (clave `geo.districts`), con las coordenadas redondeadas a 5 decimales (~1 m).

---

## 5. Datos derivados en `build_data.py`

### 5.1 Estructura nueva en `dashboard.json`

```jsonc
{
  "places": [ { "...": "...", "near24_m": 640, "near24_name": "SOS Veterinaria",
                "comp_1km": 7, "comp_2km": 19 } ],
  "geo": {
    "districts": { /* FeatureCollection, 5 polígonos */ },
    "grid": {
      "cell_m": 400,
      "cols": ["lat","lng","district","hh","hh1","comp1","rev1","avg_rating1","d24",
               "s_sat","s_dem","s_24","s_qual","score"],
      "rows": [[-12.1204,-77.0301,"Miraflores",410,6100,6,812,4.3,380,0.41,0.72,0.0,0.5,48], "..."]
    },
    "suggested": { "Miraflores": [ {"rank":1,"lat":-12.1,"lng":-77.0,"score":78,
                    "why":"0 clínicas a 1 km · 24h a 1.9 km · ~1 900 hogares con mascota a 1 km"} ] },
    "pois": { "parks": [[-12.1,-77.0]], "dog_parks": [], "pet_shops": [] }
  }
}
```
Guardar la grilla en formato columnar (`cols` + `rows`) la hace unas 3 veces más chica que una lista de objetos. Estimo ~700 celdas × 14 campos, unos 50 KB. Los componentes `s_*` van por celda para que el cliente pueda recalcular el score si cambian los pesos.

### 5.2 Pseudocódigo

```python
import math
R = 6371008.8  # radio terrestre medio, m

def haversine(lat1, lng1, lat2, lng2):
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp, dl = p2 - p1, math.radians(lng2 - lng1)
    a = math.sin(dp/2)**2 + math.cos(p1) * math.cos(p2) * math.sin(dl/2)**2
    return 2 * R * math.asin(math.sqrt(a))

# --- área esférica de un anillo (km²); da MIR 9.42, SI 9.73, SB 10.39, SUR 34.63, LM 49.00 ---
def ring_area_km2(ring):
    Rk, s = 6371.0088, 0.0
    for (x1, y1), (x2, y2) in zip(ring, ring[1:]):
        s += math.radians(x2 - x1) * (2 + math.sin(math.radians(y1)) + math.sin(math.radians(y2)))
    return abs(s * Rk * Rk / 2)

# --- point in polygon (ray casting). Soporta Polygon/MultiPolygon con huecos ---
def pip_ring(x, y, ring):              # ring = [[lng, lat], ...]
    inside, j = False, len(ring) - 1
    for i in range(len(ring)):
        xi, yi = ring[i]; xj, yj = ring[j]
        if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi) + xi:
            inside = not inside
        j = i
    return inside

def pip(lng, lat, geom):
    polys = [geom["coordinates"]] if geom["type"] == "Polygon" else geom["coordinates"]
    return any(pip_ring(lng, lat, poly[0]) and not any(pip_ring(lng, lat, h) for h in poly[1:])
               for poly in polys)

# --- 1) métricas por place ---
h24 = [p for p in places if p["is_24h"]]
for p in places:
    cand = [(haversine(p["lat"], p["lng"], q["lat"], q["lng"]), q) for q in h24 if q is not p]
    d, q = min(cand, key=lambda t: t[0]) if cand else (None, None)
    p["near24_m"]    = round(d) if d is not None else None
    p["near24_name"] = q["name"] if q else None
    ds = [haversine(p["lat"], p["lng"], o["lat"], o["lng"]) for o in places if o is not p]
    p["comp_1km"] = sum(x <= 1000 for x in ds)
    p["comp_2km"] = sum(x <= 2000 for x in ds)
# 264² ≈ 70k haversines: instantáneo, no hace falta índice espacial.

# --- 2) grilla de 400 m anclada a un origen global (las celdas de distritos vecinos quedan alineadas) ---
CELL = 400
DLAT = CELL / 111_320
DLNG = CELL / (111_320 * math.cos(math.radians(-12.1)))
SUB  = 4                                # 4x4 subpuntos para estimar qué fracción de la celda cae en el distrito

cells = []
for feat in districts["features"]:
    name, geom = feat["properties"]["district"], feat["geometry"]
    xs = [pt[0] for pt in geom["coordinates"][0]]; ys = [pt[1] for pt in geom["coordinates"][0]]
    y = math.floor(min(ys) / DLAT) * DLAT
    while y < max(ys):
        x = math.floor(min(xs) / DLNG) * DLNG
        while x < max(xs):
            frac = sum(pip(x + (i + .5) * DLNG / SUB, y + (j + .5) * DLAT / SUB, geom)
                       for i in range(SUB) for j in range(SUB)) / SUB**2
            if frac >= 0.25:           # se descartan celdas de borde casi vacías
                cells.append({"lat": y + DLAT/2, "lng": x + DLNG/2, "district": name, "frac": frac})
            x += DLNG
        y += DLAT

# --- 3) demanda: hogares proporcionales al área ---
area = {f["properties"]["district"]: ring_area_km2(f["geometry"]["coordinates"][0]) for f in districts["features"]}
CELL_KM2 = (CELL / 1000) ** 2           # 0.16
for c in cells:
    D = dist_stats[c["district"]]       # districts[] del dashboard (CPI 2025)
    c["hh"]     = D["households"] / area[c["district"]] * CELL_KM2 * c["frac"]
    c["hh_pet"] = c["hh"] * (D["pet_households_pct"] or 60) / 100

# --- 4) competencia, 24h y captación por celda ---
for c in cells:
    near = [(haversine(c["lat"], c["lng"], p["lat"], p["lng"]), p) for p in places]
    in1  = [p for d, p in near if d <= 1000]
    c["comp1"] = len(in1)
    c["rev1"]  = sum(p.get("reviews_count") or 0 for p in in1)
    rs = [p["rating"] for p in in1 if p.get("rating")]
    c["avg_rating1"] = round(sum(rs) / len(rs), 2) if rs else None
    c["d24"] = round(min(d for d, p in near if p["is_24h"]))
for c in cells:                          # hogares con mascota a 1 km (incluye celdas de otros distritos)
    c["hh1"] = sum(o["hh_pet"] for o in cells
                   if abs(o["lat"] - c["lat"]) < 0.01 and haversine(c["lat"], c["lng"], o["lat"], o["lng"]) <= 1000)
# el prefiltro |Δlat| < 0.01 (~1.1 km) reduce ~700² a unos pocos miles de haversines.

# --- 5) score de celda (0-100) ---
def norm(v, lo, hi): return 0.0 if hi <= lo else max(0.0, min(1.0, (v - lo) / (hi - lo)))
def pct(vals, q):    s = sorted(vals); return s[int(q / 100 * (len(s) - 1))]

sat_raw = [c["hh1"] / (c["comp1"] + 1) for c in cells]    # hogares por clínica, contando la nuestra (+1)
P95_HH, P95_SAT = pct([c["hh1"] for c in cells], 95), pct(sat_raw, 95)
W = weights.get("cell", {"sat": .35, "dem": .30, "24h": .20, "qual": .15})
for c, sr in zip(cells, sat_raw):
    c["s_sat"]  = norm(sr, 0, P95_SAT)                        # poca competencia por hogar
    c["s_dem"]  = norm(c["hh1"], 0, P95_HH)                   # mucha demanda
    c["s_24"]   = norm(c["d24"], 500, 3000)                   # lejos de un 24h = hueco de urgencias
    c["s_qual"] = 1 - norm(c["avg_rating1"] or 4.8, 3.8, 4.8) # competencia mal calificada = oportunidad
    c["score"]  = round(100 * (W["sat"]*c["s_sat"] + W["dem"]*c["s_dem"] + W["24h"]*c["s_24"] + W["qual"]*c["s_qual"]))

# --- 6) top 3 por distrito con separación mínima (non-max suppression) ---
suggested = {}
for d in area:
    chosen = []
    for c in sorted((c for c in cells if c["district"] == d), key=lambda c: -c["score"]):
        if all(haversine(c["lat"], c["lng"], o["lat"], o["lng"]) >= 1200 for o in chosen):
            chosen.append(c)
        if len(chosen) == 3:
            break
    suggested[d] = [{"rank": i + 1, "lat": round(c["lat"], 5), "lng": round(c["lng"], 5),
                     "score": c["score"],
                     "why": f'{c["comp1"]} clínicas a 1 km · 24h a {c["d24"]/1000:.1f} km · '
                            f'~{round(c["hh1"], -2):,.0f} hogares con mascota a 1 km'}
                    for i, c in enumerate(chosen)]
```

**Supuestos que la UI debe explicar (tooltip "¿cómo se calcula?"):**
- Los hogares se reparten **de manera uniforme dentro de cada distrito**. Eso sobreestima los cerros de La Molina y Surco y los parques grandes. Una mejora barata es anular las celdas cuyo centro cae dentro de un `leisure=park` grande o de un `landuse` no residencial (Overpass con `out geom`). Si no se aplica, hay que avisarlo en la leyenda.
- `pet_households_pct` es un dato de Lima Metropolitana, no distrital. Multiplica a todas las celdas por igual, así que no altera el orden dentro de un distrito.
- El radio de 1 km cruza límites distritales. Los competidores y hogares del otro lado **sí se cuentan**, porque los clientes no ven la frontera. Solo la celda "pertenece" a un distrito.
- Los pesos de celda (0.35/0.30/0.20/0.15) tienen que ir en `weights` junto con los que ya existen, para que el panel de pesos los muestre y se puedan ajustar.

---

## 6. Diseño visual y capas

### 6.1 Control de capas propio (barra sobre el mapa)

```
[ Clínicas ]  [ Oportunidad ]  [ Densidad ]  [ Áreas de influencia ]  [ Parques ]
Color de celdas: (Score) (Competidores 1 km) (Distancia 24h)        Mapa: Gris · Calles · Satélite
```
- Chips con `aria-pressed` y un ícono SVG inline cada uno. Los polígonos de distrito se muestran siempre, sin toggle.
- **Por defecto: Clínicas + Oportunidad (score).** Densidad y Voronoi arrancan apagados.
- El selector "Color de celdas" aparece solo si Oportunidad está activa.
- La leyenda (abajo a la izquierda, dentro del mapa) **cambia con las capas visibles**: un bloque por capa.

### 6.2 Paletas accesibles (sin depender de rojo/verde)
- **Score de celda (secuencial)**: viridis en 5 clases `#440154 #3b528b #21918c #5ec962 #fde725`, opacidad 0.45 para que el basemap siga visible. Clases por quintiles, no lineales. Una alternativa más sobria es una rampa de un solo tono azul.
- **Competidores a 1 km**: rampa naranja-marrón `#fff5eb #fdbe85 #fd8d3c #d94701 #7f2704` (más oscuro = más saturado).
- **Distancia al 24h**: 4 clases fijas con etiqueta legible: `<1 km`, `1–2 km`, `2–3 km`, `>3 km` (la última, la de mayor oportunidad, con el color más intenso).
- **Heatmap** (`L.heatLayer`): `gradient: {0.2:'#440154', 0.4:'#3b528b', 0.6:'#21918c', 0.8:'#5ec962', 1:'#fde725'}`, `radius: 25`, `blur: 20`, `minOpacity: 0.3`, peso = `log10(1 + reviews)`, `max` en el percentil 95 del peso. leaflet.heat no ajusta el radio al zoom, así que conviene fijar `maxZoom: 15` en la capa.
- **Pines por rating**: mantener la escala actual, pero comprobar que no dependa solo de rojo/verde. Para 24h, además del color, usar **anillo exterior doble**.
- **Estrellas sugeridas**: `L.divIcon` con estrella SVG de 28 px, relleno ámbar `#f59e0b`, borde oscuro y el número 1/2/3 dentro. `zIndexOffset: 1000`.
- **Polígonos de distrito**: borde `#334155` de 1.5 px, `fillOpacity: 0.03`. El distrito activo lleva borde de 3 px y los demás bajan a `opacity: 0.4`. Opcionalmente, una *máscara* inversa (rectángulo mundial con el distrito como hueco, blanco al 50 %) para atenuar lo que queda fuera.

### 6.3 Marcadores
- `circleMarker` con radio mínimo de **6 px** y máximo de 16 px: `r = 6 + 10*sqrt(reviews / maxReviews)` (la raíz hace que el área, no el radio, sea proporcional).
- Área táctil: `L.map(..., {preferCanvas: true, renderer: L.canvas({tolerance: 8})})`. La tolerancia agranda la zona de click sin cambiar el dibujo, y es lo más simple para el celular.
- Dibujar primero los pines grandes (ordenar por reseñas de mayor a menor) para que los chicos queden encima.

### 6.4 Rendimiento
- 264 pines, ~700 rectángulos y 264 polígonos de Voronoi son una carga trivial con canvas. Usar **un único** `L.canvas()` compartido.
- La grilla se dibuja con un solo `L.geoJSON` o con `L.rectangle`. Para recolorearla al cambiar el modo o los pesos se usa `setStyle()`, sin recrear capas.
- Los plugins opcionales (heat, delaunay) se cargan de forma perezosa.

### 6.5 Móvil
- `#map { height: min(70vh, 640px); min-height: 360px }`.
- `gestureHandling: true` (el plugin muestra el aviso "usa dos dedos para mover el mapa").
- El panel Explorar se muestra como *bottom sheet* de 40vh: arriba los 3 KPIs y el resto con scroll.
- La barra de capas usa scroll horizontal (`overflow-x: auto`) o se colapsa en un botón "Capas".
- En táctil no existe hover: el tooltip aparece al tocar y la tarjeta con un segundo toque o con el botón "Ver más".

---

## 7. Interacción

### 7.1 Modo Explorar (patrón FoodPicker)
1. El botón **"Explorar ubicación"** activa el modo: cursor `crosshair` y el aviso "Haz click donde abrirías el local".
2. Al hacer click se crea un `L.marker` arrastrable, un `L.circle` de 1 km (línea continua) y otro de 2 km (línea punteada), con relleno de 5 % o sin relleno.
3. En `dragend` (con debounce de 100 ms) las métricas se recalculan **en el cliente**: haversine contra 264 places y ~700 celdas, menos de 1 000 operaciones.
4. Las clínicas a 1 km se resaltan y el resto baja al 30 % de opacidad. Una polyline punteada une el pin con el 24h más cercano, con la etiqueta "1.4 km".
5. `Esc` o "×" cierran el modo. La URL guarda `#pin=lat,lng`.

**Métricas por radio (JS):**
```js
function analyze(lat, lng, radius = 1000) {
  const withD = places.map(p => ({ p, d: hav(lat, lng, p.lat, p.lng) }));
  const inR   = withD.filter(x => x.d <= radius);
  const n2    = withD.filter(x => x.d <= 2000).length;
  const revR  = inR.reduce((s, x) => s + (x.p.reviews_count || 0), 0);
  const near24 = withD.filter(x => x.p.is_24h).sort((a, b) => a.d - b.d)[0];
  const hhPet  = grid.filter(c => hav(lat, lng, c.lat, c.lng) <= radius)
                     .reduce((s, c) => s + c.hh * petPct(c.district), 0);
  const cell   = nearestCell(lat, lng);                // score de la celda bajo el pin
  return {
    n: inR.length, n2,
    avgRating: mean(inR.map(x => x.p.rating).filter(Boolean)),
    weak: inR.filter(x => x.p.rating && x.p.rating < 4.0).length,
    n24: inR.filter(x => x.p.is_24h).length,
    near24: near24 && { name: near24.p.name, d: near24.d },
    hhPet, hhPerClinic: hhPet / (inR.length + 1),
    share: inR.map(x => ({ name: x.p.name, rating: x.p.rating, is24: x.p.is_24h,
                            pct: revR ? 100 * (x.p.reviews_count || 0) / revR : 0 }))
              .sort((a, b) => b.pct - a.pct).slice(0, 5),      // top 5 + "otros"
    segments: countBy(inR, x => x.p.segment),
    chains: countBy(inR.filter(x => x.p.chain), x => x.p.chain),
    avgTicket: mean(inR.map(x => x.p.ticket).filter(Boolean)),
    score: cell?.score,
    pctRank: cell && pctRank(cell.score, gridScores(cell.district)),
    district: districtAt(lat, lng)                   // pip contra geo.districts
  };
}
```

### 7.2 Mockup textual del panel "Explorar ubicación"

```
+------------------------------------------------+
| Ubicación candidata                          x |
| Santiago de Surco  ·  -12.1391, -76.9921       |
|                                  [Copiar link] |
+------------------------------------------------+
| SCORE DE ZONA            72 / 100              |
| [##################--------]  top 15% del dist.|
+----------------+----------------+--------------+
| Competidores   | Hogares c/     | 24h más      |
| a 1 km         | mascota por    | cercano      |
|      3         | clínica        |   1.8 km     |
| (12 a 2 km)    |    2 140       | Groomers     |
|                | distrito: 980  | Surco        |
+----------------+----------------+--------------+
| Radio:  (o) 1 km   ( ) 2 km                    |
| Rating promedio de la competencia   4.1 (n=3)  |
| Competidores con rating < 4.0       1          |
| Ticket promedio                     S/ 115     |
| Segmentos   Premium 1 · Medio 2 · Económico 0  |
| Cadenas     Pet's Place (1)                    |
| Hogares con mascota en el radio     ~6 400     |
+------------------------------------------------+
| Share de reseñas en 1 km (total 612)           |
| Vet Surco Norte  ###########  48%  4.3  24h    |
| Pet's Place      ######       27%  4.0         |
| Clínica Patitas  ####         25%  3.7         |
+------------------------------------------------+
| Lectura rápida                                 |
| [+] Poca competencia y ningún 24h a < 1 km     |
| [+] 1 competidor mal calificado (3.7)          |
| [!] Revisar zonificación antes de alquilar     |
+------------------------------------------------+
| [Ver estas clínicas en la tabla] [Comparar ★1] |
+------------------------------------------------+
```
(Nombres y cifras ilustrativos. En la implementación, los marcadores [+]/[!] se dibujan con íconos SVG.)
- "Lectura rápida" sale de reglas simples: umbrales sobre `n`, `near24.d`, `weak` y el `regulation.friction`/`zoning_allowed_consultorio` del distrito. Así el dueño ve conclusiones y no solo cifras.
- El selector de radio (1 o 2 km) recalcula todo el panel.
- Cada estrella sugerida muestra estas mismas métricas en su popup (radio de 1 km), con un botón "Explorar aquí" que coloca el pin en ese punto.

### 7.3 Tooltip y mini tarjeta
- **Hover sobre un pin** (`bindTooltip`, `direction: 'top'`): `Nombre · 4.5 ★ (199) · 24h`.
- **Click en un pin**: mini tarjeta (máximo 260 px) con nombre, rating y reseñas, segmento y ticket, badge 24h, "competidores a 1 km: 7", "24h más cercano: 640 m" y los enlaces "Ver en tabla" y "Explorar desde aquí".
- **Hover sobre una celda**: `Score 72 · 3 clínicas a 1 km · 24h a 1.8 km · ~2 100 hogares/clínica`.

### 7.4 Botón "Ubicación sugerida"
- Lee `geo.suggested[distrito]` (los 5 distritos si el filtro está en "Todos"), dibuja las estrellas 1-2-3 y hace `fitBounds` sobre ellas.
- Muestra una lista lateral con el `why` de cada sugerencia. Al hacer click en una, `flyTo` y se abre el panel Explorar en ese punto.
- El texto debe aclarar que se sugiere **una zona de 400 m**, no una dirección exacta.

### 7.5 Sincronización con el resto del dashboard
- **Filtro de distrito**: resalta el polígono y hace `fitBounds(polígono.getBounds())`, no sobre los pines, para que se vea el distrito completo con sus huecos. Además filtra las celdas.
- **Tabla y mapa**: el hover en una fila agranda el pin; el click en una fila hace `flyTo` y abre la mini tarjeta; el click en un pin resalta su fila y hace scroll hasta ella.
- **Ranking de distritos**: el click en una tarjeta centra el mapa en ese distrito y muestra sus sugerencias.
- **Pesos**: cuando el usuario cambia los pesos, el cliente recalcula el `score` de cada celda con los `s_*` que vienen en el JSON, recolorea con `setStyle` y reordena el top 3 (misma supresión de 1.2 km, en JS).
- Estado del mapa en la URL (`#d=Surco&layers=pins,grid&pin=...`) para poder compartirlo.

---

## 8. Orden de implementación sugerido

1. `build_data.py`: descargar y cachear `data/districts.geojson`; calcular métricas por place, grilla, score y sugerencias; meter todo en `dashboard.js`.
2. `index.html`: polígonos y máscara de distrito, `preferCanvas` con tolerancia, marcadores con tamaño mínimo, tooltip y mini tarjeta.
3. Capa Oportunidad (grilla) con leyenda dinámica y el control de capas propio.
4. Modo Explorar: panel y hash en la URL.
5. Estrellas sugeridas.
6. Móvil: gesture handling y bottom sheet.
7. P1: basemaps Satélite y Calles, heatmap, Voronoi, parques.

## Fuentes consultadas
- Versiones en jsDelivr: `https://data.jsdelivr.com/v1/packages/npm/<paquete>/resolved`
- Nominatim lookup (relations, extratags con ubigeo y población): `https://nominatim.openstreetmap.org/lookup`
- Polígonos OSM France: `https://polygons.openstreetmap.fr/get_geojson.py?id=<relation>&params=0`
- Datos IGN en GitHub: https://github.com/joseluisq/peru-geojson-datasets · https://github.com/juaneladio/peru-geojson
- Overpass API: `https://overpass-api.de/api/interpreter`
- Política de tiles de OSM: https://operations.osmfoundation.org/policies/tiles/
- Autenticación de Stadia Maps: https://docs.stadiamaps.com/authentication/
- CARTO basemaps (key y límites): https://github.com/CartoDB/basemap-styles (remite a https://carto.com/legal/basemap-terms/)
- Uso de tiles de Esri en Leaflet: https://community.esri.com/t5/arcgis-online-questions/terms-of-use-for-http-services-arcgisonline-com/td-p/601874
