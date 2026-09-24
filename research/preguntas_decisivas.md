# Preguntas decisivas antes de abrir una clínica veterinaria (Lima: Miraflores, San Isidro, San Borja, Surco, La Molina)

> Fecha: 23-sep-2026. Complementa `research/indicadores.md` y `research/municipalidad.md`.
> Las cifras de este documento son de tres tipos: **[fuente]** (con URL), **[dashboard]** (calculadas hoy con `data/dashboard.json`) y **[estimado]** (supuesto propio, marcado como tal).
> Nota de verificación: varias páginas de AVMA y dvm360 devolvieron 403 o una página vacía al abrirlas con WebFetch. Cuando una cifra viene del resumen del buscador y no de la lectura directa de la página, lo marco con **(vía buscador)**.

---

## 0. Lo que cambia para la decisión (resumen)

1. **El punto de equilibrio es parecido en los 5 distritos**: entre **11 y 13 visitas/día** con el ticket promedio del dashboard, 120 m² y una planilla de 2 veterinarios + 2 asistentes (sección 3). El alquiler mueve el equilibrio en apenas ±1 visita/día. **Lo que decide es si puedes capturar esas visitas**, no el costo del local.
2. **Cuota de mercado mínima (estimada)**: si repartimos las visitas del distrito entre todas las clínicas, a cada una le tocan de **2.7 a 6.1 visitas/día**. Para llegar al equilibrio una clínica nueva necesita **de 2 a 4 veces esa cuota "justa"**: tiene que diferenciarse (24 h, especialidad, felinos, membresía) o captar clientes de otros distritos. San Isidro sale con la menor exigencia (2.0×) porque tiene pocas clínicas, pero su zonificación solo permite clínicas "existentes" (ver `municipalidad.md`).
3. **Casi nadie está a más de 1.5 km de una clínica 24 h** [dashboard]. La mediana de distancia de cada clínica al 24 h más cercano va de 0.34 km (Miraflores) a 0.82 km (San Isidro). La única excepción es La Molina, con un máximo de **5.6 km** (zona este). El hueco 24 h es **local**, no distrital, y hay que medirlo con una grilla.
4. **Hay concentración muy distinta entre distritos** [dashboard]: en San Isidro las 3 clínicas con más reseñas tienen el 88% de las reseñas (HHI 3,882, mercado concentrado). En La Molina, solo el 17% (HHI 345, mercado fragmentado). Fragmentado significa que nadie domina y es más fácil hacerse un nombre.
5. **Horario desatendido** [dashboard]: entre las **20:00 y las 23:00** la proporción de reseñas publicadas (demanda aproximada) es **2.4 a 2.5 veces** la proporción de clínicas abiertas (oferta). En La Molina a las 21:00 la relación llega a 5.4×. Un horario extendido hasta las 23:00, sin llegar a 24 h, podría capturar esa demanda con menos costo que un hospital 24 h. Ojo: el sesgo es alto, porque la hora en que se publica una reseña no es la hora de la visita.
6. **El alquiler pesa demasiado a bajo volumen**: en el equilibrio, el alquiler representa entre el **19% y el 24% de los ingresos**, contra un benchmark de **4–6%** si se alquila ([Today's Veterinary Business](https://todaysveterinarybusiness.com/a-balancing-act/), vía buscador). Para bajar a ~10% se necesitan ~30 visitas/día. Conviene **negociar meses de gracia** o empezar con menos m².

---

## 1. Tabla de preguntas decisivas

Leyenda. **Nivel**: D = distrito, L = local/cuadra, N = negocio. **¿Dashboard hoy?**: Sí / Parcial / No. **Derivable**: ✔ = se calcula con los campos actuales de `dashboard.json`; ✖ = requiere dato externo. **Prioridad**: A (bloquea la decisión), B (afina la decisión), C (deseable).

| # | Nivel | Pregunta decisiva | Benchmark / por qué importa (fuente) | ¿Dashboard hoy? | Dato o cálculo faltante | Derivable | Prio |
|---|---|---|---|---|---|---|---|
| 1 | D/L | ¿Cuántos hogares con mascota hay en un radio de 1–2 km del local candidato? | Regla de consultoría: se necesitan de **1,900 a 2,000 fichas activas por veterinario a tiempo completo** (Opperman, en [dvm360](https://www.dvm360.com/view/qa-research-you-build-veterinary-practice), vía buscador). AVMA reporta **1,499 clientes activos por veterinario** en 2024 ([AVMA](https://www.avma.org/news/benchmarking-data-plus-elevating-efficiency-equals-practice-productivity), vía buscador) | Parcial: solo a nivel distrito (`households`, `pet_households_pct`) | Hogares por manzana o radio (INEI, Planos Estratificados por manzana 2020) → densidad por celda | ✖ (externo) | A |
| 2 | D/L | ¿Tienen poder adquisitivo para pagar el ticket? | NSE AB y gasto en salud. El 91% de los dueños de perro en Lima lleva a su mascota al veterinario al menos una vez al año ([CPI 2018](https://cpi.pe/images/upload/paginaweb/archivo/26/mr_mascotas_201808.pdf)) | Parcial: `nse_ab_pct`, `avg_income` (este último es un valor zonal de Ipsos, igual en los 5 distritos) | NSE por manzana (INEI) | ✖ | B |
| 3 | D | ¿Cuántas clínicas compiten por hogar? | Guías de apertura en EE. UU. consideran un mercado sensible al precio cuando hay más de 2.5 clínicas por cada 10k mascotas (regla de blog, sin estudio que la respalde; vía buscador, [VettoCRM](https://vettocrm.com/en/blog/starting-a-vet-clinic-checklist)) | **Sí**: `clinics_per_10k`, `households_per_clinic` | Clínicas por 10k **mascotas** = count ÷ (households × 0.596 × 1.8) × 10k | ✔ | A |
| 4 | L | ¿Cuántos competidores hay a 1 km de la cuadra y qué tan cerca está el más próximo? | Si el local está demasiado cerca de una práctica establecida, capta menos pacientes ([Bank of America](https://business.bankofamerica.com/en/resources/location-for-first-veterinary-clinic), vía buscador) | No (solo mapa de pines) | Grilla de 250 m: n.º de clínicas en ≤1 km y distancia al vecino más cercano (haversine sobre `lat`/`lng`) | ✔ | A |
| 5 | L | ¿A qué distancia está el 24 h más cercano? ¿Hay un hueco? | En emergencias el cliente elige por cercanía. El estudio de Inglaterra y Gales usa 30 min en auto como umbral ([Clark et al. 2026](https://pmc.ncbi.nlm.nih.gov/articles/PMC12895197/)) | Parcial: `pct_24h` por distrito, pines con borde 24 h | Distancia de cada celda al 24 h más cercano (`is_24h`) | ✔ | A |
| 6 | D/L | ¿Qué tan buena es la competencia? ¿Hay líderes débiles que pueda desplazar? | Un rating <4.3 con volumen de reseñas indica clientes insatisfechos disponibles (criterio de `indicadores.md`) | Parcial: `avg_rating`, `rating_dist`, `low_rated`, `top` | Cuadrante "vulnerables": rating <4.3 y ≥50 reseñas, por radio | ✔ | A |
| 7 | D | ¿Algún competidor domina el mercado? | HHI >2,500 = mercado concentrado (umbral de las guías de fusiones de EE. UU., DOJ/FTC 2023) | Parcial: `top[].share_pct` | Curva de Lorenz y HHI de `reviews_count` por distrito | ✔ | B |
| 8 | L | ¿Canibalizo mi propia red o una sede de la cadena con la que quiero diferenciarme? | Tiene sentido si luego habrá una segunda sede, o si la salida es vender a una cadena (LatamVet compra clínicas desde 2027: [Gestión](https://gestion.pe/economia/empresas/latamvet-proyecta-ingresar-a-peru-con-plan-para-expandir-red-de-clinicas-veterinarias-noticia/), [Petfood LatAm](https://petfoodlatinoamerica.com/2026/09/17/latamvet-contempla-la-adquisicion-de-50-clinicas-en-peru-y-colombia/)) | No | Polígonos de Voronoi o áreas de influencia por clínica. Área y "hogares" de cada celda de Voronoi | ✔ (área); ✖ (hogares) | C |
| 9 | L | ¿Cuánto cuesta el m² en la cuadra y cuánto pesa en el P&L? | Alquiler de 4–6% de los ingresos si se alquila ([Today's Vet Business](https://todaysveterinarybusiness.com/a-balancing-act/), vía buscador); "facility" de 10–11% en el ejercicio de los 100 centavos ([FVMA/EquiManagement 2024](https://fvma.org/understanding-practice-expenses-with-the-100-penny-exercise/), ojo: práctica equina). Puerta a calle en Lima: US$11.8–43.8/m², promedio US$20.8, vacancia 1.58% ([Binswanger](https://binswanger.com.pe/tendencias/cinco-nuevos-corredores-comerciale-se-generarian-en-lima-en-que-zonas/)) | Parcial: `rent_usd_m2` (mediana distrital de avisos, **estimado**) | Alquiler % de ingresos en el simulador; avisos geolocalizados por cuadra | ✔ (simulador); ✖ (por cuadra) | A |
| 10 | L | ¿Tiene visibilidad, frente a avenida y estacionamiento? | 5–7 estacionamientos por consultorio más los del personal ([LaunchAdvisor](https://www.launchadvisor.co/guides/veterinary-practice-location-site-selection-veterinary-practice)). En reseñas: "Estacionamiento / acceso" 8 pos / 4 neg [dashboard] | Parcial: tema `Estacionamiento / acceso` en reseñas | Tipo de vía (OSM `highway=primary/secondary`), conteo de tráfico, parqueo | ✖ | B |
| 11 | L | ¿Hay generadores de tráfico cerca (parques caninos, petshops, supermercados, colegios)? | Coubicación con flujo de dueños de mascotas (criterio cualitativo de las guías) | Parcial: `regulation.dog_parks` (solo Miraflores 10 y San Isidro 3) | POIs OSM: `leisure=dog_park`, `shop=pet`, `shop=supermarket` → conteo a ≤500 m | ✖ (OSM, gratis) | B |
| 12 | L | ¿Hay edificios multifamiliares nuevos (demanda futura)? | Hogares jóvenes y departamentos, más perros pequeños y gatos (INEI: 68.5% de hogares con menores tiene mascota) | No | Licencias de edificación municipales / listados de proyectos inmobiliarios nuevos | ✖ | C |
| 13 | L | ¿La zona es segura para operar de noche? | Relevante si se evalúa horario extendido o 24 h | No | Mapa del delito (PNP / observatorios municipales) | ✖ | C |
| 14 | L | ¿La zonificación permite **clínica** (no solo consultorio) en esa cuadra? | Miraflores: solo consultorio. San Isidro: "solo existentes". La Molina: solo Av. Los Constructores. Surco: CZ/CM y ejes ([municipalidad.md](municipalidad.md)) | **Sí** (por distrito): `regulation.*` | Capa de zonificación sobre el mapa (planos de las ordenanzas) | ✖ | A |
| 15 | N | ¿Cuántas visitas/día necesito para cubrir costos (break-even)? | Un veterinario ve ~15 pacientes/día (AVMA 2024, vía buscador). dvm360 cita 15–20 citas/día | No | Simulador (sección 3) con `rent_usd_m2`, `avg_ticket` | ✔ | A |
| 16 | N | ¿Cuánto capex necesito y en cuánto tiempo lo recupero? | Pet Center: **US$70k por 100 m²**, canon de US$20k, recupero en 1.5–2 años ([Gestión 2021](https://gestion.pe/economia/empresas/pet-center-apuesta-por-tener-100-clinicas-veterinarias-en-los-proximos-10-anos-ncze-noticia/)) | No | Payback = capex ÷ utilidad mensual a N visitas/día | ✔ | A |
| 17 | N | ¿Qué mix de servicios deja más margen? | Diagnóstico e imágenes con margen de 75–85%, cirugía y dental 65–75%, farmacia 45–55% ([BizMetricsHQ](https://www.bizmetricshq.com/industries/healthcare/veterinary-clinic/), fuente divulgativa y de baja confiabilidad). Mix típico en EE. UU.: farmacia 13.6%, laboratorio 12.2%, vacunas 12%, cirugía 11.9%, imágenes 7%, dental 6.3% ([DVM Elite](https://www.dvmelite.com/veterinary-clinic-revenue-breakdown-the-complete-guide), vía buscador) | Parcial: `services[]` por clínica (no hay precios por servicio) | Heatmap servicio × distrito (% que lo ofrece) para encontrar servicios de alto margen con poca oferta | ✔ | A |
| 18 | N | ¿Qué ticket puedo cobrar? ¿Hay sensibilidad al precio? | Ticket del dashboard: S/124 en promedio, pero 170 de 206 tickets son **estimados por segmento** [dashboard] | **Sí** (con baja calidad): `ticket`, `ticket_basis`, tema `Precio` | Ratio de quejas de precio vs ticket; mystery shopping | ✔ / ✖ | A |
| 19 | N | ¿En qué horario hay demanda sin oferta? | — | Parcial: `coverage` 7×24 y `activity.by_hour` por separado | Índice demanda/oferta por hora = %reseñas(h) ÷ %clínicas abiertas(h) | ✔ | B |
| 20 | N | ¿Hay estacionalidad (meses fuertes y débiles) para planear el flujo de caja? | En EE. UU. el volumen se concentra en el 4T ([Vetsource](https://veterinaryanalytics.com/blog/veterinary-industry-summary-july-13-19-2025/), vía buscador). 2025: visitas −3%, ingresos +2.5% ([AVMA](https://www.avma.org/news/less-foot-traffic-veterinary-practices-spells-declining-revenue), vía buscador) | Parcial: `activity.by_month` (reseñas, con tendencia de crecimiento de Google mezclada) | Índice estacional = reseñas del mes ÷ media móvil de 12 meses | ✔ (débil) | C |
| 21 | D | ¿Qué cadenas están o llegarán (LatamVet 2027, Pancho Cavero, Pet Center, HeyVet)? | Pancho Cavero proyecta 5–6 clínicas en Lima en 2026 ([Gestión jul-2026](https://gestion.pe/economia/empresas/grupo-pancho-cavero-proyecta-seis-clinicas-en-lima-y-evalua-franquicias-noticia/)); LatamVet, US$27.5 M para ~56–60 centros entre Perú y Colombia | Parcial: `chains` por distrito | Capa de sedes de cadenas y distancia a la sede más cercana; ficha de amenazas | ✔ / ✖ | B |
| 22 | N | ¿Qué tan fuerte es la marca digital de los competidores? | — | Parcial: `with_web`, `with_instagram`, `social_reputation` | "Share of voice" por distrito: `instagram_followers` (solo 33 clínicas con dato) → poco robusto | ✔ (débil) | C |
| 23 | N | ¿La antigüedad protege al incumbente? | — | No | `founded_year` vs rating: **solo 20 de 256 clínicas tienen el dato** → no es graficable con rigor | ✔ (n muy chico) | C |
| 24 | N | ¿Consigo veterinarios? ¿Cuánto cuestan? | Veterinario en Lima: S/1,824–2,117 promedio ([Indeed](https://pe.indeed.com/career/veterinario/salaries/Lima--Lima)); Perú S/2,693 ([Computrabajo](https://pe.computrabajo.com/salarios/medico-veterinario)). Sobrecosto del régimen general ≈ +45% ([Krowdy](https://blog.krowdy.com/blog/cuanto-cuesta-un-trabajador-en-planilla-peru/)) | No | Supuesto en el simulador | — | B |
| 25 | N | ¿Qué tan rápido llego a la madurez (ramp-up)? | Consultorio: equilibrio en 6–12 meses; clínica completa: 12–24 meses ([guía española de costos, CambiaSeguro](https://cambiaseguro.es/herramientas/coste-clinica-veterinaria), referencia débil, otro mercado) | No | Curva de ramp-up en el simulador (supuesto) | ✔ | B |

**Balance**: de las 25 preguntas, el dashboard responde **3 completas** (#3, #14 por distrito, #18 con baja calidad), **13 parcialmente** y **9 no**. **12 se pueden derivar** con la data que ya está en `dashboard.json` (sobre todo con cálculos geoespaciales sobre `lat`/`lng` y el simulador). Las que exigen datos externos son hogares y NSE por manzana, tráfico y estacionamiento, POIs de OSM, seguridad y proyectos inmobiliarios.

---

## 2. Gráficos propuestos

### 2.1 Lista corta (12 candidatos)

| # | Título (pregunta) | Tipo | Responde | ¿Elegido? |
|---|---|---|---|---|
| G1 | ¿Dónde queda lejos una clínica 24 h y hay pocos competidores? | Mapa Leaflet: grilla de 250 m coloreada (2 capas) + histograma | #4, #5 | **Sí** |
| G2 | ¿Qué competidores son vulnerables? | Bubble: rating × reseñas (log) × ticket | #6, #18 | **Sí** |
| G3 | ¿El mercado está dominado por pocos? | Curva de Lorenz de reseñas por distrito + HHI | #7 | **Sí** |
| G4 | ¿Qué servicios de alto margen faltan en cada distrito? | Heatmap servicio × distrito | #17 | **Sí** |
| G5 | ¿Cuántas visitas/día necesito y cuándo recupero la inversión? | Simulador: líneas de utilidad vs visitas/día + sliders | #15, #16, #9 | **Sí** |
| G6 | ¿A qué hora hay demanda sin oferta? | Línea doble: %demanda vs %oferta por hora + barra del índice | #19 | **Sí** |
| G7 | Perfil de los 6 factores del score por distrito | Radar (`score_components`) | #1–#3, #9, #14 | No: repite la barra de score existente |
| G8 | Distancia al competidor más cercano | Boxplot simulado (min/p25/mediana/p75/max) por distrito | #4 | No: G1 lo cubre con más detalle espacial |
| G9 | Mezcla de segmentos por distrito | Barra apilada 100% (Premium/Medio/Económico) | #18 | No: 48 clínicas sin segmento y el segmento es juicio del agente |
| G10 | ¿La queja de precio sube con el ticket? | Scatter: ticket × % de menciones negativas de "Precio" | #18 | No: pocas menciones por clínica (ruido) |
| G11 | ¿La antigüedad da mejor rating? | Scatter `founded_year` × rating | #23 | No: n=20 |
| G12 | Share of voice en redes | Barra: Σ `instagram_followers` por distrito | #22 | No: n=33, sesgo |

### 2.2 Los 6 elegidos: especificación detallada

Convenciones del pseudocódigo: `D = dashboard.json`; `P = [p for p in D.places if p.is_clinic]` (256 clínicas); `hav(a,b)` = distancia haversine en km; `DIST = [d.district for d in D.districts]`.

---

#### G1. "¿En qué cuadras el 24 h más cercano queda lejos y hay pocos competidores?" (mapa de oportunidad local)

- **Tipo**: capa de grilla sobre el mapa Leaflet existente (rectángulos `L.rectangle` de ~250 m) con un selector de dos capas, más un histograma Chart.js (barras) de la distancia al 24 h por distrito.
- **Capas**:
  - Capa A, "Distancia al 24 h más cercano (km)": escala secuencial de 0 a ≥2 km.
  - Capa B, "Competidores a ≤1 km": escala secuencial invertida (menos es mejor).
  - Capa combinada "hueco": celdas con dist24 > 1.0 km **y** comp1km ≤ 3, marcadas con borde.
- **Cálculo**:
  ```
  H24 = [p for p in P if p.is_24h]
  bbox = min/max de lat,lng de P por distrito, + 0.005° de margen
  step = 0.00225°  # ≈250 m de latitud
  for cell in grid(bbox, step):
      c = centro(cell)
      cell.district = P[argmin(hav(c,p))].district          # asignación aproximada (no hay polígonos)
      cell.dist24   = min(hav(c,h) for h in H24)
      cell.comp1km  = count(p in P if hav(c,p) <= 1.0)
      cell.nn       = min(hav(c,p) for p in P)
  descartar celdas con nn > 1.5 km (fuera de la zona urbana muestreada)
  hist[d] = bins [0-0.5,0.5-1,1-1.5,1.5-2,>2] de cell.dist24 para cells del distrito d
  ```
- **Lo que ya muestra la data** [dashboard]: la mediana de distancia de las clínicas al 24 h más cercano es 0.34 km en Miraflores, 0.55 en Surco, 0.58 en La Molina, 0.79 en San Borja y 0.82 en San Isidro. El máximo es 5.6 km en La Molina, un indicio de un hueco en el este del distrito. La mediana de competidores a ≤1 km de cada clínica va de 5 (La Molina) a 14 (Surco).
- **Por qué sirve**: el score actual es distrital. Esta capa lleva la decisión a nivel de cuadra y muestra dónde un 24 h o un horario extendido tendría menos rivales directos. Limitación: la asignación de celdas a distritos es aproximada, y Google Places topó en 60 resultados en Surco, así que puede haber más competidores.

---

#### G2. "¿Qué competidores son vulnerables (mucho volumen, rating bajo)?"

- **Tipo**: Chart.js `bubble`. Un dataset por distrito (colores del dashboard) y un filtro por chip.
- **Ejes**: X = `rating` (3.0–5.0); Y = `reviews_count` en escala logarítmica (proxy de volumen de clientes); radio = `ticket` (r = √ticket/2; gris si `ticket_basis == 'estimado por segmento'`, sólido si es publicado o viene de reseñas); borde grueso si `is_24h`.
- **Anotaciones**: línea vertical en 4.3 y horizontal en 50 reseñas. Cuadrante inferior derecho = "líderes" (rating ≥4.3, ≥50 reseñas); cuadrante izquierdo superior = **"vulnerables"** (rating <4.3, ≥50 reseñas).
- **Cálculo**:
  ```
  pts = [{x:p.rating, y:max(p.reviews_count,1), r:sqrt(p.ticket or 120)/2,
          d:p.district, est:p.ticket_basis=='estimado por segmento', name:p.name}
         for p in P if p.rating]
  vulnerables[d] = [p for p in pts if p.x<4.3 and p.y>=50 and p.d==d]
  KPI bajo el gráfico: n vulnerables y Σ reseñas vulnerables / Σ reseñas del distrito
  ```
- **Lo que ya muestra la data** [dashboard]: hay 6 vulnerables en Miraflores, 0 en San Isidro, 10 en San Borja, 13 en Surco y 10 en La Molina.
- **Por qué sirve**: identifica a quién quitarle clientes. Las reseñas negativas de esos competidores (campo `themes`) dicen qué prometer: trato, tiempos de espera, emergencias. Tooltip: nombre, rating, reseñas, ticket y los 2 temas negativos más frecuentes.

---

#### G3. "¿El mercado de cada distrito está dominado por pocos jugadores?" (Lorenz + HHI)

- **Tipo**: Chart.js `line` (una curva por distrito) con la diagonal de igualdad punteada. Leyenda con el HHI y el Top 3 %.
- **Ejes**: X = % acumulado de clínicas (ordenadas de menos a más reseñas); Y = % acumulado de reseñas.
- **Cálculo**:
  ```
  for d in DIST:
      r = sorted([p.reviews_count or 0 for p in P if p.district==d])   # ascendente
      T = sum(r); cum = 0; pts=[(0,0)]
      for i,v in enumerate(r): cum += v; pts.append(((i+1)/len(r)*100, cum/T*100))
      gini = 1 - sum((x_i - x_{i-1})*(y_i + y_{i-1}) for consecutive pts)/100/100
      hhi  = sum((v/T*100)**2 for v in r)
      top3 = sum(sorted(r)[-3:])/T*100
  ```
- **Lo que ya muestra la data** [dashboard]: San Isidro tiene HHI 3,882 y Top 3 de 88% (concentrado). Miraflores, 1,467 y 48% (lo domina SOS Veterinaria con 35% de las reseñas). San Borja, 720 y 36%. Surco, 440 y 27%. La Molina, 345 y 17% (fragmentado).
- **Por qué sirve**: un mercado fragmentado (La Molina, Surco) no tiene un líder con miles de reseñas que bloquee la entrada, y la reputación se construye más rápido. En un mercado concentrado hay que competir contra un líder o especializarse. Advertencia: las reseñas son un proxy de clientes acumulados, y sesgan a favor de las clínicas antiguas y las 24 h.

---

#### G4. "¿Qué servicios de alto margen faltan en cada distrito?" (heatmap servicios × distrito)

- **Tipo**: tabla HTML con celdas coloreadas (Chart.js no trae heatmap nativo; la otra opción es el plugin `chartjs-chart-matrix` desde jsDelivr). Filas = servicios ordenados por margen típico. Columnas = 5 distritos.
- **Valor de la celda**: % de clínicas del distrito que ofrecen el servicio. Una columna extra con la etiqueta de margen: Alto (laboratorio, ecografía, rayos X, cirugía), Medio (hospitalización, vacunas), Bajo (petshop, farmacia, grooming), según [BizMetricsHQ](https://www.bizmetricshq.com/industries/healthcare/veterinary-clinic/), fuente débil. Una fila extra con las especialidades (`specialties`: dermatología, cardiología, medicina felina, etc.).
- **Cálculo**:
  ```
  SERV = ['laboratorio','ecografía','rayos X','cirugía','hospitalización','vacunas',
          'delivery/domicilio','telemedicina','exóticos','farmacia','petshop','grooming']
  for d in DIST:
      ps = [p for p in P if p.district==d]; n_known = count(p in ps if p.services)
      cell[s][d] = 100 * count(s in p.services for p in ps) / n_known
  oportunidad[s][d] = margen_peso[s] * (1 - cell[s][d]/100)     # resaltar top 3
  ```
- **Lo que ya muestra la data** [dashboard] (% sobre el total de clínicas): rayos X, 9% en Surco y 10% en San Borja. Ecografía, 12% en Surco. Hospitalización, 9% en La Molina. Laboratorio, 15% en San Isidro. Telemedicina, ~0% fuera de Miraflores. Exóticos, ≤5% en todos.
- **Por qué sirve**: define el mix de servicios y el equipamiento del capex. Un servicio de alto margen con poca oferta en el radio es una diferenciación rentable. Limitación: los `services` vienen de la web o redes de cada clínica. Que no aparezcan no prueba que no los ofrezcan (18 clínicas no tienen dato).

---

#### G5. "¿Cuántas visitas/día necesito en cada distrito y en cuántos meses recupero la inversión?" (simulador)

- **Tipo**: Chart.js `line`, una línea por distrito. X = visitas/día (0–35); Y = utilidad operativa mensual (S/). Línea horizontal en 0 y marcador en el cruce (equilibrio). Debajo, una tabla por distrito: equilibrio en visitas/día, visitas para margen objetivo, payback a N visitas y alquiler como % de los ingresos. Sliders: m², ticket (o "usar ticket del distrito"), número de veterinarios y asistentes, sueldos, % insumos, otros fijos, visitas/día supuestas, capex.
- **Cálculo**: ver la sección 3 (mismas fórmulas; los supuestos se leen del bloque JSON `breakeven_assumptions`).
- **Por qué sirve**: traduce el score en plata. Muestra que el alquiler cambia poco el equilibrio (±1 visita/día entre distritos) y que la clave es la captación. Un segundo panel cruza el equilibrio con la "cuota justa" de visitas por clínica del distrito (sección 3.4) para decir cuántas veces la cuota promedio hay que capturar.

---

#### G6. "¿A qué hora hay demanda sin oferta?" (índice demanda/oferta por hora)

- **Tipo**: Chart.js combinado. Barras = índice demanda/oferta por hora (eje derecho; línea de referencia en 1.0). Dos líneas = % de demanda y % de oferta por hora (eje izquierdo). Selector de distrito.
- **Cálculo**:
  ```
  for d in DIST + ['global']:
      A = d.activity.by_hour                      # reseñas por hora local (UTC-5, ver build_data.py:126)
      C = [sum(d.coverage[w][h] for w in 0..6) for h in 0..23]   # clínicas abiertas por hora (suma de la semana)
      dem[h] = A[h]/sum(A); sup[h] = C[h]/sum(C)
      idx[h] = dem[h]/sup[h]      # >1 = más demanda relativa que oferta
  suavizar A con media móvil de 3 h si sum(A) < 100 (San Isidro: n=57)
  ```
- **Lo que ya muestra la data** [dashboard]: en el total, el índice llega a 2.4–2.5 entre las 20:00 y las 22:00. En La Molina, 5.4 a las 21:00; en Surco, 2.6 a las 21:00; en San Borja, 2.8 a las 20:00. En San Isidro sale 6.1 a las 20:00, pero con solo 57 reseñas (poco confiable).
- **Por qué sirve**: sugiere un **horario extendido (por ejemplo, 8:00–23:00)** como alternativa barata al 24 h, que exige 3 turnos de planilla. Advertencia fuerte: la hora de la reseña no es la hora de la visita (la gente escribe de noche). Hay que validarlo con llamadas o con los datos de reservas de alguna plataforma.

---

## 3. Simulador de punto de equilibrio

### 3.1 Supuestos (Perú, sep-2026)

| Parámetro | Valor | Fuente / tipo |
|---|---|---|
| Local | **120 m²** | [estimado]. Pet Center franquicia un formato de 100 m² ([Gestión](https://gestion.pe/economia/empresas/pet-center-apuesta-por-tener-100-clinicas-veterinarias-en-los-proximos-10-anos-ncze-noticia/)); una clínica con quirófano y hospitalización requiere 100–250 m² (`indicadores.md`) |
| Alquiler USD/m²/mes | `rent_usd_m2` del distrito: 20.1 Miraflores, 20.2 San Isidro, 16.0 San Borja, 18.3 Surco, 14.6 La Molina | [dashboard, **estimado**]: mediana de avisos de InfoCasas (precios pedidos, no de cierre; no está claro si incluyen IGV). Referencia de Binswanger: promedio US$20.8/m² en puerta a calle ([Binswanger](https://binswanger.com.pe/tendencias/cinco-nuevos-corredores-comerciale-se-generarian-en-lima-en-que-zonas/)) |
| Tipo de cambio | **S/3.39 por US$** | BCRP vía [RPP, 23-sep-2026](https://rpp.pe/economia/economia/precio-del-dolar-peru-y-tipo-de-cambio-hoy-23-de-septiembre-del-2026-noticia-1708906) |
| Veterinario (sueldo bruto) | **S/3,000/mes** × 2 | [estimado, por encima del promedio de mercado para una clínica AB]. Promedio en Lima: S/2,117 ([Indeed, may-2026](https://pe.indeed.com/career/veterinario/salaries/Lima--Lima)); Perú: S/2,693 ([Computrabajo 2026](https://pe.computrabajo.com/salarios/medico-veterinario)) |
| Asistente / recepción | **S/1,500/mes** × 2 | [estimado]. RMV S/1,130 vigente desde el 1-ene-2025 ([Infobae, may-2026](https://www.infobae.com/peru/2026/05/13/cuanto-es-el-sueldo-minimo-en-peru-2026-conoce-el-monto-en-soles-dolares-y-euros/)); hay un anuncio de subirla a S/1,300 que aún no está vigente ([El Comercio](https://elcomercio.pe/respuestas/cuanto/aumento-del-sueldo-minimo-2026-en-el-peru-cuanto-es-el-nuevo-monto-y-que-otros-anuncios-hizo-keiko-fujimori-salario-minimo-vital-1300-soles-tdpe-noticia/)) |
| Sobrecosto laboral | **+45%** (régimen general: EsSalud 9%, gratificaciones, CTS, vacaciones) | [Krowdy 2026](https://blog.krowdy.com/blog/cuanto-cuesta-un-trabajador-en-planilla-peru/): un bruto de S/3,000 cuesta ~S/4,357. En el régimen de microempresa (REMYPE) el sobrecosto baja mucho ([FacturaSimple](https://facturasimple.com/pe/blog/pe-costo-laboral-empleado-regimen-mype)); uso el general por conservadurismo |
| **Planilla total** | (2×3,000 + 2×1,500) × 1.45 = **S/13,050/mes** | cálculo |
| Insumos / costo de ventas | **27%** de los ingresos netos | Benchmark de COGS 23–27% en EE. UU. ([dvm360](https://www.dvm360.com/view/understanding-cogs-in-a-veterinary-hospital), vía buscador; 23% en [FVMA](https://fvma.org/understanding-practice-expenses-with-the-100-penny-exercise/)). Tomo el extremo alto porque en Perú los fármacos y vacunas son importados [estimado] |
| Otros fijos | **S/4,000/mes** (luz, agua, internet, software, contador, marketing digital, mantenimiento de equipos, seguros, residuos biocontaminados) | [estimado, sin fuente peruana]. Validar con cotizaciones |
| Ticket | Por defecto **S/120** (con IGV); alternativa: `avg_ticket` del distrito (115–141) | [dashboard]: promedio global S/124, pero **170 de 206 tickets son estimados por segmento** |
| IGV | 18%: ingreso neto = ticket ÷ 1.18 | Régimen general / RMT |
| Días laborables | **26/mes** (lunes a sábado) | [estimado] |
| Capacidad | 2 veterinarios × 15 pacientes/día = **30 visitas/día** | AVMA: 15 pacientes/día por veterinario en 2024 ([AVMA](https://www.avma.org/news/benchmarking-data-plus-elevating-efficiency-equals-practice-productivity), vía buscador) |
| Capex | **US$70,000 por 100 m²** (≈ S/237,300); ×1.2 si son 120 m² | [Gestión, Pet Center 2021](https://gestion.pe/economia/empresas/pet-center-apuesta-por-tener-100-clinicas-veterinarias-en-los-proximos-10-anos-ncze-noticia/). No incluye canon de franquicia (US$20k) ni capital de trabajo |
| Margen objetivo | **15%** operativo | El margen neto de una clínica bien gestionada es de 15–25% (referencia de España, [CambiaSeguro](https://cambiaseguro.es/herramientas/coste-clinica-veterinaria)); 12% de utilidad en el ejercicio FVMA |

### 3.2 Fórmulas

```
rent_m     = rent_usd_m2[d] * local_m2 * usd_pen
fixed_m    = rent_m + staff_monthly_soles + other_fixed_monthly_soles
ticket_net = ticket / (1 + igv_pct)
contrib    = ticket_net * (1 - supplies_pct)                      # contribución por visita
BE_visits_day      = fixed_m / contrib / working_days_month
target_visits_day  = fixed_m / (ticket_net * (1 - supplies_pct - margin_target_pct)) / working_days_month
profit_m(v)        = v * working_days_month * contrib - fixed_m
payback_months(v)  = capex_soles / profit_m(v)                     # antes de impuestos, sin ramp-up
rent_pct_rev(v)    = rent_m / (v * working_days_month * ticket_net)
utilización(v)     = v / (n_vets * 15)
```

### 3.3 Resultados por distrito (supuestos de 3.1)

| Distrito | Alquiler S/mes | Fijos S/mes | Equilibrio visitas/día (ticket S/120) | Equilibrio visitas/día (ticket del distrito) | Visitas/día para margen de 15% (ticket del distrito) | Utilidad/mes a 20 visitas (ticket del distrito) | Payback a 20 visitas (capex US$70k) | Alquiler % ingresos en el equilibrio |
|---|---|---|---|---|---|---|---|---|
| Miraflores | 8,177 | 25,227 | 13.1 | 12.4 (S/126) | 15.7 | 15,307 | 15.5 meses | 23.7% |
| San Isidro | 8,217 | 25,267 | 13.1 | 12.5 (S/126) | 15.7 | 15,266 | 15.5 meses | 23.7% |
| San Borja | 6,509 | 23,559 | 12.2 | **10.4** (S/141) | 13.1 | **21,800** | **10.9 meses** | 20.2% |
| Santiago de Surco | 7,444 | 24,494 | 12.7 | 13.2 (S/115) | 16.7 | 12,500 | 19.0 meses | 22.2% |
| La Molina | **5,939** | **22,989** | **11.9** | 11.1 (S/129) | 13.9 | 18,509 | 12.8 meses | **18.9%** |

Lectura:
- **El equilibrio necesita ~40% de la capacidad** de 2 veterinarios (12 de 30 visitas/día). Es alcanzable, pero no desde el primer mes. Con un ramp-up típico de 12 a 24 meses para una clínica completa (referencia de España, débil), el payback real se parece más a los **1.5–2 años** que declara Pet Center.
- **El ticket pesa más que el alquiler.** Pasar de S/115 (Surco) a S/141 (San Borja) baja el equilibrio en ~2.8 visitas/día. La diferencia de alquiler entre el distrito más caro y el más barato vale apenas ~1.2 visitas/día. Por eso validar el ticket real con mystery shopping es la tarea más valiosa pendiente.
- **Surco sale último en el simulador** pese a ser #1 en el score, porque su ticket promedio estimado es el más bajo (tiene muchas clínicas "Económico"). Si el local apunta al segmento Premium de Surco (ticket ~S/150–180 según los cuartiles del dashboard), el equilibrio cae a ~9–10 visitas/día.
- **Miraflores y San Isidro**: el modelo supone una clínica, pero la zonificación solo permite consultorio en Miraflores y "solo existentes" en San Isidro. El formato real sería más chico (sin hospitalización ni quirófano), con otros fijos y otro capex.

### 3.4 Chequeo de mercado: ¿cuántas veces la "cuota justa" debo capturar?

```
visitas_distrito_año = households * 0.596 (hogares con mascota, Lima) * 0.91 (van al vet ≥1/año, CPI 2018) * 2 visitas/año [estimado]
cuota_justa_día      = visitas_distrito_año / (count + 1) / 312 días
multiplo             = BE_visits_day / cuota_justa_día
```

| Distrito | Cuota justa (visitas/día por clínica) | Equilibrio ÷ cuota justa |
|---|---|---|
| Miraflores | 3.6 | 3.4× |
| San Isidro | 6.1 | **2.0×** |
| San Borja | 2.7 | 3.8× |
| Santiago de Surco | 4.1 | 3.2× |
| La Molina | 2.7 | 4.0× |

**[estimado]** Las 2 visitas por año son un supuesto y además ignoran a los clientes que vienen de otros distritos (por ejemplo, Lince o Surquillo hacia San Isidro y Miraflores). El conteo de clínicas también incluye consultorios muy pequeños. Aun así, el mensaje no cambia: **ninguna clínica nueva llega al equilibrio con una cuota promedio**. Necesita un diferenciador o un imán de clientes (24 h o nocturno, especialidad, membresía, precio).

### 3.5 Sensibilidades rápidas (Surco, ticket S/120)

- Régimen MYPE (sobrecosto ~10% en vez de 45%) [estimado]: planilla ≈ S/9,900 → equilibrio ≈ 11.1 visitas/día (−1.6).
- 3 veterinarios en lugar de 2 (+S/4,350): equilibrio ≈ 15.0 visitas/día.
- Insumos al 23% en lugar de 27%: equilibrio ≈ 12.0 visitas/día.
- Local de 90 m² en lugar de 120: equilibrio ≈ 11.7 visitas/día.

(Valores calculados con las fórmulas de 3.2; redondeados.)

---

## 4. Qué implementar primero (orden sugerido)

1. **G5, el simulador**: responde las preguntas #15, #16 y #9 (prioridad A) y solo usa campos que ya existen.
2. **G1, el mapa de huecos**: responde #4 y #5 (A) y convierte el análisis distrital en análisis por cuadra.
3. **G2, los vulnerables**, y **G4, los servicios faltantes**: responden #6 y #17 (A).
4. **G3, Lorenz/HHI**, y **G6, el índice por hora**: afinan la decisión (B).
5. **Datos externos de mayor valor por costo**: (a) mystery shopping de precios en 10–15 clínicas por distrito, (b) POIs de OSM (parques caninos, petshops, supermercados) con Overpass, que es gratis, (c) hogares y NSE por manzana del INEI.

---

## 5. Fuentes

- AVMA, benchmarking 2024 (15 pacientes/día, 1,499 clientes activos por veterinario, US$554,982 por veterinario), vía buscador: https://www.avma.org/news/benchmarking-data-plus-elevating-efficiency-equals-practice-productivity
- AVMA, visitas −3% e ingresos +2.5% en 2025, vía buscador: https://www.avma.org/news/less-foot-traffic-veterinary-practices-spells-declining-revenue
- Vetsource Veterinary Analytics, estacionalidad, vía buscador: https://veterinaryanalytics.com/blog/veterinary-industry-summary-july-13-19-2025/
- dvm360, fichas activas por veterinario (Opperman), vía buscador: https://www.dvm360.com/view/qa-research-you-build-veterinary-practice
- dvm360, COGS, vía buscador: https://www.dvm360.com/view/understanding-cogs-in-a-veterinary-hospital
- FVMA / EquiManagement 2024, ejercicio de los 100 centavos (leído directamente): https://fvma.org/understanding-practice-expenses-with-the-100-penny-exercise/
- Today's Veterinary Business, alquiler 4–6%, vía buscador: https://todaysveterinarybusiness.com/a-balancing-act/
- LaunchAdvisor, estacionamiento y contratos de alquiler (leído directamente): https://www.launchadvisor.co/guides/veterinary-practice-location-site-selection-veterinary-practice
- DVM Elite, mix de ingresos, vía buscador: https://www.dvmelite.com/veterinary-clinic-revenue-breakdown-the-complete-guide
- BizMetricsHQ, márgenes por servicio (baja confiabilidad), vía buscador: https://www.bizmetricshq.com/industries/healthcare/veterinary-clinic/
- Gestión, Pet Center (US$70k por 100 m², payback 1.5–2 años; leído directamente): https://gestion.pe/economia/empresas/pet-center-apuesta-por-tener-100-clinicas-veterinarias-en-los-proximos-10-anos-ncze-noticia/
- Gestión, LatamVet: https://gestion.pe/economia/empresas/latamvet-proyecta-ingresar-a-peru-con-plan-para-expandir-red-de-clinicas-veterinarias-noticia/ · Petfood LatAm, sep-2026: https://petfoodlatinoamerica.com/2026/09/17/latamvet-contempla-la-adquisicion-de-50-clinicas-en-peru-y-colombia/
- Gestión, Grupo Pancho Cavero, jul-2026: https://gestion.pe/economia/empresas/grupo-pancho-cavero-proyecta-seis-clinicas-en-lima-y-evalua-franquicias-noticia/
- Binswanger, puerta a calle: https://binswanger.com.pe/tendencias/cinco-nuevos-corredores-comerciale-se-generarian-en-lima-en-que-zonas/
- Indeed, sueldo de veterinario en Lima: https://pe.indeed.com/career/veterinario/salaries/Lima--Lima · Computrabajo: https://pe.computrabajo.com/salarios/medico-veterinario
- Krowdy, costo de un trabajador en planilla (2026): https://blog.krowdy.com/blog/cuanto-cuesta-un-trabajador-en-planilla-peru/
- Infobae, RMV S/1,130 (may-2026): https://www.infobae.com/peru/2026/05/13/cuanto-es-el-sueldo-minimo-en-peru-2026-conoce-el-monto-en-soles-dolares-y-euros/
- RPP / BCRP, tipo de cambio del 23-sep-2026: https://rpp.pe/economia/economia/precio-del-dolar-peru-y-tipo-de-cambio-hoy-23-de-septiembre-del-2026-noticia-1708906
- CPI Market Report Mascotas 2018: https://cpi.pe/images/upload/paginaweb/archivo/26/mr_mascotas_201808.pdf
- Clark et al. 2026, accesibilidad veterinaria: https://pmc.ncbi.nlm.nih.gov/articles/PMC12895197/
- CambiaSeguro, costos y ramp-up (España, referencia débil): https://cambiaseguro.es/herramientas/coste-clinica-veterinaria

---

## 6. Bloque de supuestos (para el simulador)

`breakeven_assumptions`

```json
{
  "breakeven_assumptions": {
    "capex_usd_100m2": 70000,
    "capex_scale_with_m2": true,
    "local_m2": 120,
    "staff": {
      "vets": 2, "vet_gross_soles": 3000,
      "assistants": 2, "assistant_gross_soles": 1500,
      "labor_overhead_pct": 45,
      "note": "Sueldos estimados; sobrecosto régimen general (Krowdy 2026). En REMYPE el sobrecosto es mucho menor."
    },
    "staff_monthly_soles": 13050,
    "supplies_pct": 27,
    "other_fixed_monthly_soles": 4000,
    "other_fixed_is_estimate": true,
    "ticket_default_soles": 120,
    "ticket_includes_igv": true,
    "igv_pct": 18,
    "margin_target_pct": 15,
    "usd_pen": 3.39,
    "working_days_month": 26,
    "visits_per_vet_day_capacity": 15,
    "rent_source_field": "districts[].rent_usd_m2",
    "fair_share": {
      "pet_households_pct": 59.6,
      "vet_visit_rate": 0.91,
      "visits_per_household_year": 2,
      "visits_per_household_year_is_estimate": true,
      "open_days_year": 312
    },
    "sources": [
      {"field": "capex_usd_100m2", "url": "https://gestion.pe/economia/empresas/pet-center-apuesta-por-tener-100-clinicas-veterinarias-en-los-proximos-10-anos-ncze-noticia/"},
      {"field": "local_m2", "url": "https://gestion.pe/economia/empresas/pet-center-apuesta-por-tener-100-clinicas-veterinarias-en-los-proximos-10-anos-ncze-noticia/", "note": "estimado a partir del formato de 100 m²"},
      {"field": "staff.vet_gross_soles", "url": "https://pe.indeed.com/career/veterinario/salaries/Lima--Lima", "note": "promedio Lima S/2,117; se usa S/3,000 (estimado)"},
      {"field": "staff.vet_gross_soles", "url": "https://pe.computrabajo.com/salarios/medico-veterinario"},
      {"field": "staff.assistant_gross_soles", "url": "https://www.infobae.com/peru/2026/05/13/cuanto-es-el-sueldo-minimo-en-peru-2026-conoce-el-monto-en-soles-dolares-y-euros/", "note": "RMV S/1,130; asistente S/1,500 estimado"},
      {"field": "staff.labor_overhead_pct", "url": "https://blog.krowdy.com/blog/cuanto-cuesta-un-trabajador-en-planilla-peru/"},
      {"field": "supplies_pct", "url": "https://www.dvm360.com/view/understanding-cogs-in-a-veterinary-hospital", "note": "COGS 23-27% (EE. UU.)"},
      {"field": "supplies_pct", "url": "https://fvma.org/understanding-practice-expenses-with-the-100-penny-exercise/", "note": "COGS 23%"},
      {"field": "ticket_default_soles", "url": "data/dashboard.json#global.avg_ticket", "note": "S/124; mayoría estimado por segmento"},
      {"field": "margin_target_pct", "url": "https://fvma.org/understanding-practice-expenses-with-the-100-penny-exercise/", "note": "utilidad 12%; 15-25% en referencias de España"},
      {"field": "usd_pen", "url": "https://rpp.pe/economia/economia/precio-del-dolar-peru-y-tipo-de-cambio-hoy-23-de-septiembre-del-2026-noticia-1708906"},
      {"field": "visits_per_vet_day_capacity", "url": "https://www.avma.org/news/benchmarking-data-plus-elevating-efficiency-equals-practice-productivity", "note": "vía buscador"},
      {"field": "fair_share.vet_visit_rate", "url": "https://cpi.pe/images/upload/paginaweb/archivo/26/mr_mascotas_201808.pdf"},
      {"field": "rent_benchmark_pct_revenue", "url": "https://todaysveterinarybusiness.com/a-balancing-act/", "note": "4-6% si se alquila; vía buscador"}
    ]
  }
}
```
