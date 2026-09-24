# VetClinica – Plan general

**Objetivo:** una página estática (index.html) que le permita al dueño decidir en qué distrito
(Miraflores, San Isidro, San Borja, Surco, La Molina) abrir una clínica veterinaria.

## Pipeline de datos
1. `scrape.py` → Google Places API (New): text search × 5 distritos × 5 queries, detalles por lugar → `data/places.json`
2. Agente Opus "enriquecimiento": por cada lugar, web search (Instagram/Facebook/TikTok, web, 24h real, servicios, precios publicados) → `data/enrichment.json`
3. Agente Opus "indicadores": población, NSE, alquiler, tenencia de mascotas, ticket promedio → `research/indicadores.md` + `data/district_stats.json`
4. Agente Opus "municipalidad": licencia, zonificación, cap por zona → `research/municipalidad.md` + `data/regulation.json`
5. `build_data.py` → junta todo, calcula score de oportunidad por distrito (idea de FoodPicker), horas pico desde horarios y timestamps de reseñas, ticket estimado → `data/dashboard.json`
6. Agente Opus "página": `index.html` (Leaflet + Chart.js, single file) → loop de revisión hasta que quede presentable.

## Estructura de la página (storytelling por scroll, nav sticky)
1. **Hero / pregunta:** "¿Dónde abrir?" + veredicto (distrito recomendado, score) + 4 KPIs globales.
2. **Mapa:** pines por clínica (color = rating, tamaño = reseñas, borde = 24h). Chips de distrito + "Todos". Panel lateral con insights del distrito seleccionado.
3. **Comparativa de distritos:** score de oportunidad (barra ordenada), densidad clínicas/10k hab, rating promedio, % 24h, alquiler, NSE. Ranking con color guía (verde = oportunidad).
4. **Competencia:** distribución de ratings, top players por reseñas, share estimado, ticket promedio, horas/días más recurrentes (heatmap).
5. **Escucha social:** temas más mencionados en reseñas (precio, trato, urgencia, espera), presencia en redes.
6. **Regulación:** fricción por distrito, cap, licencias.
7. **Lista completa:** tabla filtrable (distrito, 24h, rating mín, reseñas, ticket) + export CSV.
8. **Huecos y recomendaciones** + preguntas de negocio respondidas.

## Versión 4 (React, entregable para presentación)
`app/` = Vite 8 + React 19 + Tailwind 4 + shadcn/ui + Recharts (ECharts para heatmap y burbujas) + react-leaflet con mapa vectorial OpenFreeMap (fallback Esri raster).
Mismo contenido y datos que la v3 HTML, con diseño más pulido (KPIs con count-up, tooltips, Sheet lateral para Explorar, motion).
Comandos (desde app/): `npm install`, `npm run dev`, `npm run build` (genera app/dist/index.html en UN solo archivo que abre con doble click), `npm run data` (regenera datos).
Copia del entregable: `VetClinica_dashboard.html` en la raíz. Investigación del stack en research/stack.md; sistema de diseño en design-system/vetclinica/.

## Versión 3 (HTML, respaldo aprobado): diseño v1 + mapa Explorar + simulador + gráficos nuevos
El dueño rechazó la versión editorial (demasiado texto). `index.html` vuelve al diseño v1 (tarjetas, KPIs, insights cortos)
e integra: mapa con polígonos, grilla de celdas, zonas sugeridas, capas y modo Explorar; sección "¿Cierran los números?" (simulador);
burbujas vulnerables, HHI, servicios×distrito, demanda vs oferta por hora; tabla de 25 preguntas plegada. La editorial quedó en `index_v2_editorial.html`.

## Versión 2 (estilo editorial, descartada)
Tras la revisión del dueño ("se ve muy IA", sliders rotos, mapa mejorable) se rehizo `index.html` como informe largo
siguiendo `research/estilo.md` (1 acento + grises, Source Serif 4 + Libre Franklin, titulares-hallazgo, sin tarjetas ni badges),
`research/preguntas_decisivas.md` (25 preguntas, 6 gráficos nuevos: grilla 24h, burbujas vulnerables, Lorenz/HHI, servicios×distrito,
simulador de punto de equilibrio, demanda vs oferta por hora) y `research/mapa.md` (polígonos OSM, grilla 400 m, zonas sugeridas,
modo Explorar con radios 1/2 km, capas de parques/petshops/supermercados). La v1 quedó en `index_v1_backup.html`.
Scripts nuevos: `geo.py` (polígonos Nominatim → data/districts.geojson) y `pois.py` (Overpass → data/pois.json); `build_data.py` calcula
distancias, competidores a 1 km, grilla y mejores celdas. Los sliders de pesos se eliminaron (pesos fijos).

## Cómo correrlo
```bash
python scrape.py        # solo si quieres refrescar Google Places (usa cache en data/raw/)
python geo.py           # polígonos de distrito (solo una vez)
python pois.py          # parques/petshops/supermercados OSM (solo una vez)
python build_data.py    # regenera data/dashboard.json y data/dashboard.js
```
Abrir `index.html` con doble click (no necesita servidor; Chart.js/Leaflet/tiles cargan por CDN).

## Hallazgo clave
No existe un tope numérico de veterinarias por zona. El tope real es la zonificación (índices de usos):
Miraflores = clínica no permitida en ninguna zona (solo consultorio); San Isidro = "conforme solo en los existentes";
La Molina = solo Av. Los Constructores; San Borja = índice no verificado; Surco = permitida en CZ/CM y ejes viales.

## Score de oportunidad (por distrito)
demanda potencial (hogares × NSE AB × tenencia) 30% · baja saturación (clínicas/10k hab) 25% ·
calidad de competencia (inverso rating prom.) 15% · hueco 24h 10% · alquiler 10% · fricción regulatoria 10%.
Cada factor se normaliza entre distritos a 20-100 (fricción: Baja 100 / Media 60 / Alta 20). Los pesos se pueden ajustar con sliders en la página.

## Limitaciones
- Ticket promedio: solo 6 precios publicados; 30 de reseñas; 170 asignados por segmento por el agente (validar con mystery shopping).
- Google Places devuelve máx. 60 resultados por búsqueda; Surco llegó al tope en todas, puede haber más clínicas.
- El enriquecimiento web se quedó sin cupo de búsquedas en ~45 lugares de Surco y ~30 de La Molina (los de menos reseñas).
- Población/hogares: CPI 2025; NSE = proxy INEI estratos de ingreso; alquiler = mediana de avisos InfoCasas; 59.6% hogares con mascota (Lima, INEI) aplicado a todos.
