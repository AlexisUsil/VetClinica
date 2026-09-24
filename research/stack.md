# Stack para rehacer el dashboard VetClínica (versión ejecutiva)

Fecha: 2026-09-23. Versiones verificadas con `npm view` ese mismo día.

## 0. Respuesta corta

Sí. Si se rehace en React, el acabado **se nota**: tarjetas y tooltips consistentes, animación de entrada, KPIs que cuentan hasta su valor y un mapa vectorial más limpio. Chart.js no es lo que impide eso; lo que falta es un **sistema de diseño** (tokens, componentes, espaciado). React + shadcn/ui lo da armado.

**Decisión:** Vite + React 19 + TypeScript 5.9 + Tailwind 4 + shadcn/ui, con **Recharts 3 (vía shadcn charts)** como librería principal y **ECharts 6** solo para el heatmap 7×24 y las burbujas con cuadrantes. El mapa se hace con **react-leaflet 5**, sobre un fondo vectorial de **OpenFreeMap** (sin API key). Es el mismo stack que FoodPicker, así que ya está probado en esta máquina.

---

## 1. Stack: Vite+React vs Next.js vs Astro

| | Vite + React | Next.js 16 | Astro 7 |
|---|---|---|---|
| Encaje con "1 JSON, sin backend" | Total: es una SPA estática | Sobra: SSR/RSC y el router no aportan nada | Bueno para contenido, pero todo aquí es interactivo, así que serían islas por todos lados |
| Leaflet/ECharts (usan `window`) | Funcionan directo | Obliga a `dynamic(..., {ssr:false})` en cada mapa o chart | Obliga a `client:only` |
| Build que abre con doble click | Sí, con `vite-plugin-singlefile` | No (`output: export` sigue generando rutas absolutas `/_next/...`) | Difícil |
| Deploy gratis | Vercel, Netlify, GitHub Pages | Vercel (ideal) | Todos |
| Riesgo | Bajo, igual que FoodPicker | Medio | Medio |

**Elegido: Vite 8.** Next y Astro no suman nada visible para el jefe y agregan puntos de falla.

### `file://` y cómo entregar
Chrome bloquea `<script type="module">` en `file://` por CORS, y un build normal de Vite (`dist/index.html` + `assets/*.js`) se queda en blanco con doble click. Hay tres salidas, y conviene tener las tres:

1. **Archivo único (doble click):** `vite-plugin-singlefile@2.3.3` mete JS, CSS, fuentes y el JSON dentro de un solo `index.html` (unos 3-4 MB). Se abre desde USB o por correo. Los tiles del mapa sí necesitan internet.
2. **Servir en 1 comando:** `npm run preview` (http://localhost:4173) o, sin el repo, `npx serve dist`.
3. **URL pública:** deploy en Vercel (`npx vercel --prod`) o GitHub Pages. Así se abre desde cualquier laptop o celular.

---

## 2. Librerías de gráficos

| Librería | Acabado de fábrica | Animación | Tooltips | Barras H + etiquetas | Burbujas + cuadrantes/anotaciones | Heatmap 7×24 | Lorenz | Divergentes | Small multiples | KPI + sparkline | Veredicto |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Recharts 3.10** | Medio; alto con shadcn | Sí (entrada suave) | Custom en JSX | Sí (`layout="vertical"` + `LabelList`) | Scatter + `ReferenceArea/Line/Label`: se puede, pero con esfuerzo | No nativo | Sí (Line/Area + diagonal) | Sí (valores ±, `Cell`) | Sí (map de charts) | Sí | **Principal** |
| **shadcn charts** | Alto, coherente con el UI | Recharts | `ChartTooltipContent` muy pulido | Sí | = Recharts | No | Sí | Sí | Sí | Sí | **Envoltura de Recharts: usar** |
| Tremor Raw (tremor.so, Vercel, Tailwind 4) | Alto | Recharts | Bueno | `BarList` excelente | Limitado | No | Sí | Sí | Sí | `SparkAreaChart`, `CategoryBar` | Solo copiar 2-3 piezas. El paquete npm `@tremor/react` 3.18.7 pide React 18 y Tailwind 3: **no usar** |
| **ECharts 6.1** | Alto | La mejor (morphing, entrada) | Ricos | Sí | **Excelente** (`markArea`, `markLine`, `label`, `visualMap`) | **Nativo** | Sí | Sí | Sí (grids) | Gauge nativo | **Auxiliar** |
| Nivo 0.99 | Alto | Sí (react-spring) | Buenos | Sí | Sí | Nativo | Sí | Sí | Sí | Medio | Sigue en 0.x, pesado y con otro look: descartado |
| visx 4 | El que uno construya | Manual | Manual | Manual | Manual | Manual | Manual | Manual | Manual | Manual | Demasiado trabajo |
| Plotly 4 | Estilo "científico" | Poca | Buenos | Sí | Sí | Sí | Sí | Sí | Sí | No | Unos 3 MB y look de notebook: descartado |

**Principal:** Recharts 3 usado a través del componente `chart` de shadcn (`ChartContainer`, `ChartTooltipContent`, `ChartConfig`). Toma las variables CSS del tema y queda al mismo nivel que el resto del UI.
**Auxiliar:** ECharts 6 con import modular (`echarts/core` + `echarts-for-react/lib/core`) para el heatmap 7×24, las burbujas con cuadrantes etiquetados y el gauge del punto de equilibrio. El tema de ECharts se arma con los mismos tokens para que no se note el cambio de librería.

---

## 3. Sistema de diseño

- **UI kit:** shadcn/ui (CLI `shadcn@4.21`, primitivas Radix). Componentes: `card`, `tabs`, `tooltip`, `sheet` (panel lateral de Explorar en el mapa), `badge`, `table` + `@tanstack/react-table@8.21.3` (el directorio), `select`, `slider` (simulador), `toggle-group` (Explorar/Grilla/Zonas), `chart`, `separator`, `scroll-area`, `sonner` (aviso de "CSV descargado").
  Ojo: TanStack Table ya va por la v9 (9.2.4), pero los ejemplos de shadcn `data-table` están escritos para la v8. **Fijar v8.**
- **Tipografía:** **Geist Variable** para UI y títulos, **Geist Mono Variable** para cifras de tablas. Ambas se sirven locales con `@fontsource-variable/*`, así que funcionan offline y quedan dentro del single-file. En todo número va `font-variant-numeric: tabular-nums` (clase `tabular-nums`). Escala: KPI 36/40 semibold con tracking -0.02em; H2 24; cuerpo 14; etiquetas 12 en muted.
  Alternativa si se quiere algo más cálido: Inter Variable.
- **Paleta:** se mantienen el teal y el naranja, pero con **más neutro y menos color**. Teal es la marca y la serie principal. Naranja se reserva para *la oportunidad* (el distrito recomendado, los huecos, las anotaciones clave). El resto de series van en slate. Semáforo solo para good/mid/bad.
- **Animación:** `motion@13` (`import { motion } from "motion/react"`), con fade + 12px de subida al entrar en viewport (`whileInView`, `once: true`) y stagger de 60 ms en las tarjetas. Count-up de KPIs con `@number-flow/react@0.6.2`. Se respeta `prefers-reduced-motion`.
- **Scroll-storytelling:** una página larga con 9 secciones, cada una titulada con su pregunta (como ahora). Nav sticky arriba con los nombres de sección (IntersectionObserver marca la activa) y una barra de progreso de 2 px (`useScroll` de motion → `scaleX`). Hero con 4 KPIs y la conclusión en una frase.
- **Layout:** `max-w-7xl`, grid de 12 columnas. Tarjetas `rounded-xl border bg-card shadow-sm` con padding 24. En mobile todo pasa a 1 columna y la nav se vuelve un scroll horizontal.
- **Dark mode:** opcional, con clase `.dark` y un toggle. Para presentar con proyector conviene **light**.

---

## 4. Mapa

- **Elegido:** `react-leaflet@5.0.0` + `leaflet@1.9.4`. Es lo mismo de FoodPicker y la lógica actual de grilla, zonas y pines se reescribe casi igual.
- **Fondo moderno sin key:** OpenFreeMap (`https://tiles.openfreemap.org/styles/positron`; también hay `liberty`, `bright` y `dark`). No pide API key, cuenta ni tiene límites. Se monta dentro de Leaflet con `@maplibre/maplibre-gl-leaflet@0.1.4` + `maplibre-gl@6` (su peer dependency acepta la 6).
  **Fallback** en un `LayersControl`: el raster Esri World Light Gray que ya usa el dashboard.
  **No usar CARTO** `basemaps.cartocdn.com`: desde 2026 devuelve tiles con la marca de agua "API KEY REQUIRED" si no hay key.
- **Descartado: MapLibre puro** (`react-map-gl/maplibre`). Se ve un poco mejor, pero obliga a reescribir grilla y zonas como capas GeoJSON con expresiones de estilo, y en eso hay más riesgo.
- **Dibujo en react-leaflet:**
  - Distritos (`districts_geojson`): `<GeoJSON data style={f=>({color:'var(--ink-3)',weight:1,fillOpacity:0})} />`.
  - Grilla/celdas: `<Rectangle bounds={[[s,w],[n,e]]} pathOptions={{fillColor: scale(score), fillOpacity:.55, weight:0}} eventHandlers={{click:()=>setCell(c)}} />`. Si son más de 2000 celdas, usar `<Pane>` + `preferCanvas` en `MapContainer`.
  - Zonas: `<Polygon positions pathOptions={{color:'var(--accent)', dashArray:'4 4'}} />`.
  - Pines: `<CircleMarker radius={4+rating} />`, que es más limpio que el ícono default y no necesita PNGs. Tooltip con `<Tooltip direction="top">`.
  - Explorar: el click abre el `Sheet` de shadcn a la derecha con el detalle de la celda o la clínica.

---

## 5. Referencias visuales y reglas

Referencias:
- Tremor, bloques y plantillas: https://tremor.so/ (Dashboard y KPI cards) y https://blocks.tremor.so/
- shadcn dashboard: https://ui.shadcn.com/examples/dashboard; charts: https://ui.shadcn.com/charts
- Vercel Web Analytics (tarjetas con sparkline, BarList de "top pages"): https://vercel.com/docs/analytics
- Linear Insights (densidad, neutros, un solo color de acento): https://linear.app/insights
- Stripe Dashboard (KPI + delta + sparkline; tablas sobrias): https://stripe.com/payments/features y https://docs.stripe.com/dashboard/basics
- ECharts, ejemplos de heatmap y scatter: https://echarts.apache.org/examples/en/index.html#chart-type-heatmap

Reglas:
1. **Titular = conclusión**, no nombre del gráfico ("Surco tiene 3× menos clínicas 24h por habitante", no "Clínicas 24h por distrito").
2. **Un solo color de énfasis por gráfico.** Todo va en slate y lo que importa en naranja o teal.
3. **Etiquetas directas** en las barras en vez de ejes y leyendas cuando haya pocas categorías (5 distritos). Se elimina la leyenda siempre que se pueda.
4. **Anotar en el gráfico** (línea de mediana, cuadrante "zona de oportunidad", punto de equilibrio). El jefe no debe tener que interpretar.
5. **KPI = valor + unidad + delta/contexto + sparkline.** Máximo 4 por fila.
6. **Números tabulares, alineados a la derecha y con formato local** (`Intl.NumberFormat('es-PE')`, S/ con 0 decimales).
7. **Densidad controlada:** 1 idea por tarjeta y como máximo 2 gráficos por fila en desktop. Espacio en blanco generoso (gap 24).
8. **Gridlines tenues** (`stroke: var(--border)`, dashed) o ninguna. Sin bordes en las barras y con radios de 4 px.
9. **Tooltips con contexto** (valor, ranking y comparación con el promedio), no solo el número.
10. **Orden por valor**, nunca alfabético. El recomendado siempre arriba o a la izquierda.

---

## 6. Plan técnico

### Versiones (npm, 2026-09-23)
| Paquete | Versión |
|---|---|
| vite / @vitejs/plugin-react | 8.3.0 / 6.1.1 |
| react / react-dom | 19.3.0 |
| typescript | **5.9.3** (no la 7.x: el compilador nativo nuevo es muy reciente, así que sin riesgos) |
| tailwindcss / @tailwindcss/vite | 4.3.3 |
| shadcn (CLI) | 4.21.0 |
| recharts | 3.10.1 |
| echarts / echarts-for-react | 6.1.0 / 3.0.6 (peer dependency acepta echarts ^6) |
| react-leaflet / leaflet / @types/leaflet | 5.0.0 / 1.9.4 / ^1.9 |
| maplibre-gl / @maplibre/maplibre-gl-leaflet | 6.11.1 / 0.1.4 |
| motion | 13.4.2 |
| @number-flow/react | 0.6.2 |
| @tanstack/react-table | **8.21.3** |
| @phosphor-icons/react | 2.1.10 (como FoodPicker; shadcn trae lucide-react 1.47 y conviven sin problema) |
| @fontsource-variable/geist / geist-mono | 5.3.0 |
| vite-plugin-singlefile | 2.3.3 |

### Scaffolding (PowerShell, desde `VetClinica/`)
```powershell
npm create vite@latest app -- --template react-ts
cd app
npm i -D typescript@~5.9.3 tailwindcss@^4.3 @tailwindcss/vite@^4.3 @types/node @types/leaflet vite-plugin-singlefile@^2.3
npm i recharts@^3.10 echarts@^6.1 echarts-for-react@^3.0.6 react-leaflet@^5 leaflet@^1.9.4 maplibre-gl@^6 @maplibre/maplibre-gl-leaflet@^0.1.4 motion@^13 @number-flow/react@^0.6 @tanstack/react-table@^8.21 @phosphor-icons/react @fontsource-variable/geist @fontsource-variable/geist-mono
```
Luego:
1. `src/index.css`: dejar solo `@import "tailwindcss";`.
2. `vite.config.ts`: agregar `tailwindcss()` y el alias `@` → `./src`.
3. En `tsconfig.json` y `tsconfig.app.json`: `"baseUrl": ".", "paths": {"@/*": ["./src/*"]}`.
4. Correr shadcn:
```powershell
npx shadcn@latest init          # Base color: Neutral (o Slate), CSS variables: sí
npx shadcn@latest add card tabs tooltip sheet badge table select slider toggle-group chart separator scroll-area sonner button
```

`vite.config.ts`:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import path from 'node:path'

export default defineConfig(({ mode }) => ({
  base: './',                                   // rutas relativas: sirve en Pages y en subcarpetas
  plugins: [react(), tailwindcss(), ...(mode === 'single' ? [viteSingleFile()] : [])],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  build: { outDir: mode === 'single' ? 'dist-single' : 'dist', chunkSizeWarningLimit: 4000 },
}))
```
Scripts en `package.json`:
```json
"dev": "vite",
"build": "tsc -b && vite build",
"build:single": "tsc -b && vite build --mode single",
"preview": "vite preview",
"data": "python ../build_data.py && copy ..\\data\\dashboard.json src\\data\\dashboard.json"
```
**Datos:** `build_data.py` ya genera `data/dashboard.json`. Se copia a `app/src/data/` y se importa con `import DASH from '@/data/dashboard.json'` (entra tipado y queda inlineado en el single-file). Los tipos van en `src/data/types.ts`: `District`, `Place`, `GridCell`, `Poi`, etc.

### Estructura
```
app/src/
  main.tsx  App.tsx  index.css           # tokens + @theme
  data/     dashboard.json  types.ts  selectors.ts   # derivados: HHI, Lorenz, cuadrantes, etc. (puros, testeables)
  lib/      format.ts (Intl es-PE)  echarts.ts (registro modular + tema)  colors.ts
  components/
    ui/       (shadcn generados)
    layout/   StickyNav.tsx  ScrollProgress.tsx  Section.tsx (título-pregunta + reveal)
    kpi/      KpiCard.tsx (NumberFlow + sparkline)  KpiRow.tsx
    charts/   HBar.tsx  Divergent.tsx  Lorenz.tsx  Bubble.tsx(ECharts)  Heatmap.tsx(ECharts)  Gauge.tsx(ECharts)  Spark.tsx
  sections/
    Hero.tsx  MapSection/ (MapView.tsx, GridLayer.tsx, ZonesLayer.tsx, PinsLayer.tsx, ExploreSheet.tsx)
    Ranking.tsx  Gaps.tsx  Competition.tsx  Breakeven.tsx  Hours.tsx  Social.tsx  Regulation.tsx  Directory.tsx
```

### Sección → componentes/charts
| Sección | Componentes | Librería |
|---|---|---|
| Hero | 4 `KpiCard` (clínicas, % 24h, rating promedio, reseñas) + conclusión | NumberFlow + Recharts spark |
| 1. Mapa (Explorar/Grilla/Zonas) | `ToggleGroup` + `MapView` + `Sheet` de detalle + leyenda de escala | react-leaflet + OpenFreeMap |
| 2. Ranking | Barras horizontales apiladas por componente de score (pesos) + tabla top 5 con badges | Recharts (`layout="vertical"`, `LabelList`) |
| 3. Huecos + primeros pasos | Tarjetas por hueco (distrito, métrica, "por qué") + checklist numerado | shadcn Card/Badge |
| 4. Competencia | Top players (BarList), cadenas (barra 100% apilada), ticket (dot plot/rango), **burbujas con cuadrantes**, HHI (barra con umbrales 1500/2500), **Lorenz**, servicios × distrito (tabla-heatmap) | Recharts + ECharts (burbujas) |
| 5. Punto de equilibrio | `Slider`s → recálculo en vivo; gauge "mes de equilibrio"; área de flujo acumulado con `ReferenceLine` en 0 | ECharts gauge + Recharts Area |
| 6. Horarios | **Heatmap 7×24** + oferta vs demanda (línea + área) | ECharts + Recharts |
| 7. Escucha social | Barras divergentes (+/− por tema) + citas en tarjetas | Recharts |
| 8. Regulación | `Table` con badges de dificultad y costos alineados a la derecha | shadcn Table |
| 9. Directorio | DataTable (TanStack v8): búsqueda, filtros por distrito/24h, orden, paginación, botón CSV | shadcn + TanStack |

### Tokens (en `src/index.css`, después del bloque que genera shadcn)
```css
@import "tailwindcss";
@import "@fontsource-variable/geist";
@import "@fontsource-variable/geist-mono";

:root {
  --background: oklch(0.985 0.002 247);   /* #F8FAFC */
  --card: oklch(1 0 0);
  --foreground: oklch(0.21 0.034 265);    /* slate-900 */
  --muted-foreground: oklch(0.55 0.027 257);
  --border: oklch(0.93 0.01 256);
  --primary: oklch(0.51 0.09 186);        /* teal-700 #0F766E */
  --primary-soft: oklch(0.98 0.014 181);
  --accent-opp: oklch(0.65 0.2 45);       /* orange-600: SOLO oportunidad */
  --accent-opp-soft: oklch(0.98 0.016 73);
  --good: oklch(0.63 0.17 149); --mid: oklch(0.77 0.16 70); --bad: oklch(0.58 0.22 27);
  --chart-1: var(--primary); --chart-2: var(--accent-opp);
  --chart-3: oklch(0.55 0.027 257); --chart-4: oklch(0.71 0.02 261); --chart-5: oklch(0.87 0.01 258);
  --radius: 0.75rem;
}
.dark { --background: oklch(0.16 0.02 265); --card: oklch(0.21 0.02 265); --foreground: oklch(0.97 0 0);
        --border: oklch(0.3 0.02 265); --primary: oklch(0.7 0.12 182); }
@theme inline {
  --font-sans: "Geist Variable", ui-sans-serif, system-ui;
  --font-mono: "Geist Mono Variable", ui-monospace;
  --color-opp: var(--accent-opp); --color-opp-soft: var(--accent-opp-soft);
  --color-good: var(--good); --color-mid: var(--mid); --color-bad: var(--bad);
}
body { font-feature-settings: "tnum" 1, "cv11" 1; }
```

### Ejemplo 1: Ranking en barras horizontales (shadcn + Recharts)
```tsx
import { Bar, BarChart, LabelList, XAxis, YAxis, Cell } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import DASH from '@/data/dashboard.json'

const config = { score: { label: 'Score de oportunidad', color: 'var(--chart-3)' } } satisfies ChartConfig

export function RankingBars() {
  const data = [...DASH.ranking].sort((a, b) => b.score - a.score)
  return (
    <ChartContainer config={config} className="h-[260px] w-full">
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 48 }}>
        <XAxis type="number" hide domain={[0, 100]} />
        <YAxis type="category" dataKey="district" width={120} tickLine={false} axisLine={false} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
        <Bar dataKey="score" radius={4} barSize={28} animationDuration={900}>
          {data.map((d, i) => <Cell key={d.district} fill={i === 0 ? 'var(--accent-opp)' : 'var(--chart-4)'} />)}
          <LabelList dataKey="score" position="right" className="fill-foreground tabular-nums" formatter={(v: number) => v.toFixed(0)} />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
```
(Ajustar `score`/`district` a los nombres reales de `DASH.ranking`.)

### Ejemplo 2: Heatmap 7×24 (ECharts modular)
```tsx
// lib/echarts.ts
import * as echarts from 'echarts/core'
import { HeatmapChart, ScatterChart, GaugeChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, VisualMapComponent, MarkAreaComponent, MarkLineComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
echarts.use([HeatmapChart, ScatterChart, GaugeChart, GridComponent, TooltipComponent, VisualMapComponent, MarkAreaComponent, MarkLineComponent, CanvasRenderer])
export { echarts }

// components/charts/Heatmap.tsx
import ReactECharts from 'echarts-for-react/lib/core'
import { echarts } from '@/lib/echarts'
const DAYS = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom']
const css = (v: string) => getComputedStyle(document.documentElement).getPropertyValue(v).trim()

export function OpenHeatmap({ matrix }: { matrix: number[][] }) {   // matrix[día][hora] = clínicas abiertas
  const data = matrix.flatMap((row, d) => row.map((v, h) => [h, d, v]))
  const option = {
    textStyle: { fontFamily: 'Geist Variable' },
    grid: { left: 44, right: 16, top: 8, bottom: 56 },
    tooltip: { formatter: (p: any) => `${DAYS[p.value[1]]} ${p.value[0]}:00 · <b>${p.value[2]}</b> abiertas` },
    xAxis: { type: 'category', data: [...Array(24).keys()].map(h => `${h}h`), splitArea: { show: false }, axisTick: { show: false } },
    yAxis: { type: 'category', data: DAYS, inverse: true, axisTick: { show: false }, axisLine: { show: false } },
    visualMap: { min: 0, max: Math.max(...data.map(d => d[2])), orient: 'horizontal', left: 'center', bottom: 0,
                 inRange: { color: [css('--accent-opp-soft'), css('--primary')] }, itemHeight: 160 },
    series: [{ type: 'heatmap', data, itemStyle: { borderColor: css('--card'), borderWidth: 2, borderRadius: 3 },
               emphasis: { itemStyle: { borderColor: css('--foreground') } }, animationDuration: 800 }],
  }
  return <ReactECharts echarts={echarts} option={option} style={{ height: 300 }} notMerge />
}
```
Las burbujas usan el mismo patrón: `type:'scatter'`, `symbolSize: d => Math.sqrt(d[2])*k`, `markLine` en las medianas X/Y y `markArea` con `label` "Zona de oportunidad" en el cuadrante bueno.

### Entrega
1. `npm run dev` para iterar. Migrar sección por sección, empezando por Hero, Ranking y Mapa (lo que más impacto da).
2. `npm run build` + `npm run preview` → http://localhost:4173.
3. `npm run build:single` → `app/dist-single/index.html`: se copia a USB o al escritorio y se abre con doble click (el mapa necesita internet).
4. Deploy opcional gratis:
   - **Vercel:** `npx vercel` (root `app`, build `npm run build`, output `dist`).
   - **GitHub Pages:** workflow `actions/deploy-pages` subiendo `app/dist`. `base: './'` ya lo deja listo.
   - Antes de publicar, confirmar con el dueño que los datos (nombres de clínicas, reseñas) pueden ser públicos; si no, usar un link de Vercel con protección o solo el single-file.
5. Mantener `index.html` actual como respaldo en la reunión.

### Riesgos y mitigación
| Riesgo | Mitigación |
|---|---|
| Sin internet en la sala: no hay tiles | Single-file ya trae datos, fuentes y JS. Llevar además una captura del mapa; los gráficos no dependen de la red |
| maplibre-gl dentro de Leaflet falla (WebGL apagado, worker en `file://`) | `LayersControl` con fallback a raster Esri; probar el single-file en la laptop de la presentación |
| Tiempo de reescritura (9 secciones, ~1.4 MB de datos) | Migrar por prioridad; `selectors.ts` porta la lógica actual de cálculo 1:1 desde `index.html` |
| Bundle pesado (ECharts + MapLibre ~1.5 MB) | Import modular de ECharts; `React.lazy` para Mapa y Directorio en el build normal |
| Versiones muy nuevas (TS 7, TanStack 9, Recharts 3.x) | Fijar TS 5.9 y TanStack 8; `package-lock.json` en el repo; no correr `npm update` antes de la reunión |
| Dos librerías de charts se ven distintas | Tema ECharts con los mismos tokens, fuente y radios; tooltips con el mismo estilo de card |
| CARTO con marca de agua | No usarlo (ver §4) |
| Proyector lava colores | Presentar en light, contraste AA, naranja solo para énfasis |

Fuentes: [OpenFreeMap](https://openfreemap.org/), [CARTO watermark PR](https://github.com/ryannzander/CLEAR25/pull/37), [shadcn Chart](https://ui.shadcn.com/docs/components/base/chart), [shadcn charts + Recharts 3](https://www.shadcndesign.com/blog/shadcn-ui-charts), [Tremor](https://www.tremor.so/), [Vercel adquiere Tremor](https://vercel.com/blog/vercel-acquires-tremor), [Tremor instalación (Tailwind 4)](https://tremor.so/docs/getting-started/installation), [vite-plugin-singlefile](https://github.com/richardtallent/vite-plugin-singlefile).
