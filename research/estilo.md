# Guía de restyling: de "dashboard hecho por IA" a informe editorial

Fecha: 2026-09-23 · Aplica a `index.html` (un solo archivo, Chart.js 4.4.1 + Leaflet con teselas Esri Light Gray).

Resumen en una línea: el problema no es un color ni una fuente. Es que **todo tiene el mismo peso**: 32 `.card`, 53 llamadas a `icon()`, 29 usos de `badge`, 8 cajas `.insight` naranjas idénticas, 8 eyebrows numerados y 8 títulos-pregunta. El lector no sabe qué importa porque la página no lo decide. Un informe editorial elige: una frase manda, un color señala, el resto es gris.

---

## 0. Diagnóstico del archivo actual

Revisé el CSS (líneas 13-336), el HTML de secciones (370-520) y el texto renderizado en `http://localhost:8765/index.html`.

| Rasgo en `index.html` | Dónde | Por qué suena a IA (ver §1) |
|---|---|---|
| Eyebrow con pastilla numerada `01 MAPA DE LA COMPETENCIA` sobre cada H2 | `.eyebrow .n`, 8 secciones + hero | "Badge above H1", all-caps labels |
| Título en forma de pregunta genérica ("¿Qué tan fuerte es la competencia?") | `h2.q` ×8 | Titular sin postura, podría ser de cualquier informe |
| Caja naranja con borde izquierdo de 6px + ícono bombilla + kicker "INSIGHT" | `.insight`, `insightHTML()` l.662 | "Colored left borders" = tell n.º 1 citado; repetido 8 veces |
| Tarjeta blanca, radio 14px, sombra suave, borde gris para todo | `.card`, `.kpi`, `.legal-it`, `.quote`, `.steps li`, `.table-wrap`, `#map` | "Cards for every block of info" |
| 4 KPI tiles idénticos con ícono teal | `.kpis`/`.kpi` | "Stat banner rows" |
| Veredicto con gradiente naranja 135° y glow `rgba(234,88,12,.25)` | `.verdict` | Gradientes + sombras de color |
| Badges verde/ámbar/rojo/teal/gris/negro/naranja (7 variantes) | `.b-*` | "Status dots that don't mean anything", paleta sin jerarquía |
| Dos acentos (teal + naranja) + 3 semánticos (verde, ámbar, rojo) | `:root` | "Neon palettes that refuse to prioritize" |
| Íconos de línea en cada KPI, regla, Q&A, título legal, pregunta | `svg.i` | "Thin, interchangeable line icons" |
| Fade-up de 18px en cada sección | `.reveal` | "Identical fade-in effects across all interactions" |
| Pasos numerados en círculos, reglas con ícono en cuadrado | `.steps li::before`, `.rule .ri` | "Numbered sequences", "identical feature cards" |
| Microcopy tipo coach: "Ojo con Google:", "Lo que más molesta en…", "ahí está el hueco" | `renderHours`, `renderSocial` | Voz de plantilla, no de analista |
| Fira Sans 800 en todo, títulos en 38px de peso extra | `body`, `h2.q` | Una sola voz tipográfica, jerarquía por cajas y no por tipo |

Lo que ya está bien y se conserva: el mapa base Esri World Light Gray (ya es monocromo), `tabular-nums`, el contenido y los datos (son buenos y específicos), el foco accesible, la impresión.

---

## 1. Qué hace que una web o un dashboard "parezca hecho por IA"

### 1.1 Lo que dice la gente (escucha social)

**Hacker News**

- Hilo sobre el artículo de The New Yorker "The A.I.-Design Aesthetic That's Taking over the Internet" (https://news.ycombinator.com/item?id=48671684). El usuario *c-hendricks* resume el look: "Numbers in a monospaced font, headings in an italics serif font, blue / purple / green / lots of glow". *bensyverson*: la misma estructura de startup "and shadcn for years".
- "The AI Aesthetic", de Jim Nielsen (https://news.ycombinator.com/item?id=49117099, artículo: https://blog.jim-nielsen.com/2026/ai-aesthetic/). *lynndotpy*: "Everything comes in punchy threes". *gentoo*: no hay sensación de elección, "deliberately breaking from convention or leaving things out". *TheOtherHobbes*: mucho detalle que es "decoration for the sake of distraction". *jjcm*: los LLM escriben código que converge en "a generic mean". Nielsen añade a la lista paletas beige/crema con acento naranja, serifs e íconos finos y pequeños.
- "Slightly reducing the sloppiness of AI generated front end" (https://news.ycombinator.com/item?id=48504912). *LZ_Khan*: "rounded corner cards with slight shadow, and sans serif font", y mayúsculas "on text that doesn't need it". *leptons* propone una prueba: entrecierra los ojos, "Can you still perceive hierarchy?".
- "Why AI Sucks at Front End" (https://news.ycombinator.com/item?id=47738864). *pants2*: "lots of cards and random icons and rounded corners, looks like a few messages in to a Claude code session". *camillomiller*: la paleta se parece a los colores base de Bootstrap.

**X / Twitter**

- Adam Wathan (creador de Tailwind), agosto de 2025, más de un millón de vistas: pidió perdón por haber puesto `bg-indigo-500` en todos los botones de Tailwind UI, lo que terminó en que toda UI generada por IA sea índigo. https://x.com/adamwathan/status/1953510802159219096. Explicación de la cadena causal en https://dev.to/alanwest/why-every-ai-built-website-looks-the-same-blame-tailwinds-indigo-500-3h2p

**Blogs de diseño 2025-2026**

- Developers Digest, "16 patterns that out your app as vibe-coded" (https://www.developersdigest.tech/blog/ai-design-slop-and-how-to-spot-it). Los que aplican a este archivo: badge encima del H1 (eyebrow), bordes de color en tarjetas ("almost as reliable a sign of AI-generated design as em-dashes"), tarjetas idénticas con ícono arriba, secuencias numeradas 1-2-3, filas de KPI, etiquetas en mayúsculas, glows de color. También marca como tell los combos Space Grotesk / Instrument Serif / Geist y la palabra suelta en serif cursiva.
- The Fountain Institute, "7 Signs a UI Has Been Vibe Coded" (https://www.thefountaininstitute.com/blog/signs-vibe-coded-ui): tarjetas para cada bloque ("Everything is equally contained and nothing reads as more important"), pestañas laterales de colores ("Nothing is emphasized when everything is emphasized"), puntos de estado sin significado ("Decoration that looks like data is actively harmful"), emojis como íconos.
- Mania Design, "Spot the Slop" (https://www.mania.design/blog/spot-the-slop-a-ui-designers-guide-to-fixing-ai-defaults/): uniformidad de padding, radio y alto de tarjetas; titulares genéricos; el mismo fade-in en todo. Remedio: "Break the uniformity on purpose. Make the primary thing bigger, closer, heavier." y "Use colour semantically, not decoratively."
- 925 Studios, "AI Slop Fonts and Gradients" (https://www.925studios.co/blog/ai-slop-design-tells): Inter sin elegir, gradientes índigo-violeta, fila de tres tarjetas "rounded corners, soft shadow", copy sin peso e íconos de línea intercambiables.
- Anthropic, "Improving frontend design through Skills" (https://claude.com/blog/improving-frontend-design-through-skills): lo llama *distributional convergence*. Sin dirección, el modelo muestrea el centro estadístico (Inter, gradientes violeta sobre blanco, layouts predecibles).
- Code My Spec, "Why Vibe Coded Websites All Look the Same" (https://codemyspec.com/blog/vibe-coded-websites-look-the-same): se parecen porque nadie decidió cómo debía verse cada sitio. Cinco decisiones tomadas una sola vez lo arreglan.
- The Purple Gradient Problem (https://dev.to/james_anderson_h/the-purple-gradient-problem-why-ai-ui-all-looks-alike-and-how-to-fix-it-3j65) y prg.sh (https://prg.sh/ramblings/Why-Your-AI-Keeps-Building-the-Same-Purple-Gradient-Website).

(Reddit bloquea el acceso automático desde esta herramienta, así que no pude citar hilos de r/web_design ni r/UI_Design. Las citas de HN y de los blogs recogen el mismo consenso.)

### 1.2 Lista de tells consolidada, ordenada por cuánto pesa en este archivo

1. **Cajas para todo**: tarjeta + borde + radio + sombra en cada bloque. La jerarquía la dan los contenedores y no la tipografía.
2. **Borde izquierdo de color** en callouts (`.insight`, `.quote`, `.f24`). Es el tell más citado.
3. **Eyebrow/badge sobre el H1** y etiquetas en MAYÚSCULAS con tracking.
4. **Ícono de línea en cada título, KPI y regla**, elegido por asociación genérica (bombilla = insight, trofeo = veredicto).
5. **Fila de KPI tiles idénticos** con número grande y subtítulo gris.
6. **Badges y puntos de colores** que no codifican una variable consistente.
7. **Gradiente + glow de color** en el bloque "héroe".
8. **Dos o más acentos saturados** compitiendo (teal + naranja + verde + ámbar + rojo).
9. **Titulares que son preguntas o etiquetas** en vez de afirmaciones.
10. **Microcopy de plantilla**: "Insight", "Ojo con…", "Lo que más molesta", "ahí está el hueco", "Conclusión".
11. **Animación fade-up idéntica** en cada sección.
12. **Simetría total**: rejillas 2×2, 3 y 4 columnas iguales, todo alineado igual.
13. **Una sola tipografía sans en pesos 700-800** para todo.

Ojo con sobrecorregir. Los mismos hilos ya marcan como tell 2026 el "kit anti-IA": serif cursiva en una palabra del H1, números en monoespaciada, fondo crema con acento naranja, Instrument Serif / Fraunces / Space Grotesk / Geist. **No cambies un uniforme por otro.** La salida no es otra estética de moda; es la de un medio de datos real: fondo blanco, texto casi negro, grises, un acento y jerarquía por tamaño.

---

## 2. Qué hacen los reportes de datos que se sienten humanos y editoriales

### 2.1 Principios, con su fuente

**A. El titular afirma el hallazgo.** Consultoría: el "action title" es una oración completa, de máximo dos líneas, que dice el "so what". Si lees solo los títulos, entiendes el argumento completo (Slideworks, https://slideworks.io/resources/how-mckinsey-consultants-make-presentations; SlideScience, https://slidescience.co/action-titles/). Datawrapper pide lenguaje coloquial en el texto que se lee primero y deja la precisión para la bajada o la nota: "Move that precision to a less prominent text element" (https://www.datawrapper.de/blog/text-in-data-visualizations).

**B. La anotación es el producto.** Amanda Cox (ex-NYT Graphics/Upshot): "The annotation layer is the most important thing we do", porque si no, es "here it is, you go figure it out" (citado en https://data.europa.eu/apps/data-visualisation-guide/visual-annotations-introduction y https://www.softwareandart.com/amanda-cox-making-illustrations-better-with-an-annotation-layer/). Datawrapper: los gráficos explicativos "will likely be better with annotations"; etiqueta directo sobre los datos en lugar de leyenda (mismo artículo). Urban Institute, "Three Ways to Annotate Your Graphs": https://medium.com/@urban_institute/three-ways-to-annotate-your-graphs-d140e04e48ec

**C. Gris por defecto, un color para lo que importa.** Lisa Charlotte Muth (Datawrapper): "Gray is a storytelling tool: Against gray elements, colored ones will stick out." Para lo secundario, no uses otro tono: desatura el mismo ("Don't use a separate hue for de-emphasized data"). https://www.datawrapper.de/blog/emphasize-with-color-in-data-visualizations

**D. Un rojo, gris para la retícula, una idea por gráfico.** The Economist: rejilla solo horizontal y clara, línea base oscura, sin eje Y dibujado, rojo de marca (#E3120B) solo para la serie principal y grises o rojos lavados para el resto. Fuente siempre al pie. Guía de estilo visual: https://sa.ipaa.org.au/wp-content/uploads/2026/02/Economist-CHARTstyleguide_20170505.pdf (resumen en https://fountn.design/resource/the-economist-visual-style-guide/). Su post "Mistakes, we've drawn a few" clasifica los errores en engañosos, confusos y "failing to make a point" (https://www.niemanlab.org/reading/mistakes-weve-drawn-a-few-learning-from-our-errors-in-data-visualization/).

**E. Elegir la forma por la relación, no por costumbre.** FT Visual Vocabulary: ranking, desviación, parte-todo, espacial, etc. (https://github.com/Financial-Times/chart-doctor/tree/main/visual-vocabulary). Para "qué distrito es mejor" corresponde un ranking con barras ordenadas o un dot plot, no un radar ni tiles.

**F. Quitar píxeles que no son datos.** Stephen Few (heredero del data-ink de Tufte): eliminar bordes, rellenos, degradados sin significado y rejillas no esenciales, y "de-emphasizing and regularizing those that remain" (https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf, https://www.bpminstitute.org/resources/articles/dashboard-design).

**G. Jerarquía de texto en 2-3 tamaños.** Título > bajada > anotaciones > ejes > fuente. "The biggest and boldest text... should be reserved for the most important information" (Datawrapper, artículo de texto). Guía de Hands-On Data Visualization: https://handsondataviz.org/chart-design.html

**H. Tipografía al servicio de la jerarquía.** Cox: la tipografía y el diseño bien hechos "are really about hierarchy and clarity, and not just about making things cute" (https://dailynorthwestern.com/2017/05/03/campus/new-york-times-upshot-editor-discusses-data-visualization-storytelling/).

**I. Fuentes y metodología visibles.** OWID pone definición y fuente en cada gráfico (https://ourworldindata.org/redesigning-our-interactive-data-visualizations). McKinsey: fuente al pie de cada lámina.

### 2.2 Cómo se traduce a la forma de la página

- **Sin tarjetas.** Las secciones se separan con una regla fina de 1px a todo el ancho y aire (72-96px). Cada gráfico es un `<figure>`: titular-hallazgo, bajada gris, gráfico, fuente. Ni borde ni sombra.
- **Rejilla asimétrica.** Columna de lectura de ~680-720px para prosa, y gráficos y mapa que la rompen hasta ~1100px. Datos secundarios (perfil de distrito, top 5) en una columna estrecha al margen, estilo "sidenote".
- **Números grandes dentro de una frase.** "95 de las 256 clínicas están en Surco" en vez de un tile con "256" y la etiqueta "Clínicas mapeadas".
- **Small multiples** para comparar distritos: 5 mini-gráficos con la misma escala (horas de cobertura, distribución de ratings) en vez de un selector que cambia un solo gráfico.
- **Tablas editoriales:** solo líneas horizontales finas, cabecera en versalitas pequeñas o en gris normal, números alineados a la derecha con `tabular-nums`, la fila recomendada con fondo tenue del acento y nada más.
- **Mapa editorial:** base gris sin etiquetas, límites distritales en gris medio, clínicas como puntos grises pequeños y solo lo que importa en color (las celdas de oportunidad y las 24h reales).
- **Voz del analista:** primera persona del plural o impersonal sobria ("Recomendamos Surco…", "Contamos 256 clínicas…"), con fecha y método.

---

## 3. Guía de restyling aplicable a `index.html`

### 3.1 Paleta: 1 acento + grises + 1 semántico

Se elimina el naranja. El teal se queda como único acento, pero más oscuro y menos "SaaS". Verde y ámbar desaparecen; rojo solo para riesgo real.

| Token | Valor | Uso |
|---|---|---|
| `--paper` | `#FFFFFF` | Fondo. Blanco, no crema (el crema es otro tell) |
| `--ink` | `#1B1B1B` | Texto principal, titulares, línea base de gráficos |
| `--ink-2` | `#4A4A4A` | Cuerpo secundario, bajadas |
| `--ink-3` | `#767676` | Ejes, fuentes, notas (AA sobre blanco: 4.54:1) |
| `--rule` | `#D6D6D6` | Reglas entre secciones, bordes de tabla |
| `--grid` | `#EBEBEB` | Rejilla de gráficos |
| `--mute-data` | `#B8B8B8` | Serie de contexto en gráficos, puntos del mapa |
| `--accent` | `#0B6B63` | Solo: distrito recomendado, serie principal, enlaces |
| `--accent-wash` | `#E6F0EF` | Fondo de la fila o celda destacada; banda de franja horaria |
| `--risk` | `#B3261E` | Solo: "no permitido" en zonificación, falsos 24h, ratings < 4.0 |

Reglas:
- Si un color no codifica una variable (recomendado / riesgo), va en gris.
- El semáforo verde/ámbar/rojo de regulación pasa a texto: "Permitido", "Solo consultorio", "Sin verificar", en negrita/normal/cursiva. Si hace falta color, rojo solo para "Solo consultorio" y el resto en tinta.
- Heatmap de horarios: escala secuencial de un solo tono (`#F2F2F2` → `#0B6B63`). La franja baja se marca con un contorno de 1px `--ink` y una etiqueta al lado, no con naranja.
- Estrellas: grises; el valor numérico al lado. Nada de ámbar.

### 3.2 Tipografía: dos combos verificados en Google Fonts

Los dos cargan con HTTP 200 (verificado el 2026-09-23 contra `fonts.googleapis.com/css2`). Ninguno está en las listas de tells (Inter, Space Grotesk, Instrument Serif, Geist, Fraunces, Poppins).

**Combo A (recomendado): Source Serif 4 + Libre Franklin**
- Titulares-hallazgo y lede: *Source Serif 4* (óptico, 600 para titulares y 400 para el lede). Es una serif de texto sobria, sin el dramatismo de las display de moda.
- Datos, UI, ejes, tablas, notas: *Libre Franklin* 400/500/600. Es una grotesca de tradición periodística (familia Franklin Gothic) con tabular figures.
```html
<link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=Libre+Franklin:wght@400;500;600&display=swap" rel="stylesheet">
```

**Combo B: Newsreader + IBM Plex Sans**
- *Newsreader* (diseñada para lectura en pantalla de noticias, eje óptico 6-72) para titulares y lede.
- *IBM Plex Sans* para datos y UI, con números tabulares.
```html
<link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,600&family=IBM+Plex+Sans:wght@400;500;600&display=swap" rel="stylesheet">
```

Reglas tipográficas:
- Titulares en serif **peso 600, sin cursivas decorativas** y sin colorear una palabra (fuera `.hero h1 em`).
- Tamaños: H1 40-44px · H2-hallazgo 28px · titular de figura 19px serif 600 · cuerpo 18px serif (lede) / 16px sans (UI) · anotaciones 13px sans · fuentes 12px sans `--ink-3`. Nada de 800.
- Sin MAYÚSCULAS con tracking salvo, como mucho, la cabecera de tabla en 12px.
- Números siempre en la sans con `font-variant-numeric: tabular-nums`. Nada de monoespaciada.
- Chart.js: `Chart.defaults.font.family = "'Libre Franklin', sans-serif"`, tamaño 12, color `#767676`.

### 3.3 Qué eliminar

1. `.eyebrow` y `.eyebrow .n` (las pastillas "01", "RESUMEN"). Se sustituyen por un número pequeño en gris en el margen (ver 3.4).
2. `.insight` completo, `insightHTML()` con bombilla y kicker "Insight"/"Conclusión". El texto se reescribe como bajada del titular o párrafo del lede.
3. `svg.i` en títulos, KPI, reglas, Q&A, `.legal-h h3`, `.toplist`. Se mantienen solo los íconos funcionales: redes en el directorio, expandir fila, imprimir.
4. `.card` como contenedor por defecto: border, radius 14px, `--shadow`. Se queda `.card` solo para el panel de controles de pesos, si hace falta.
5. `.kpi` / `.kpis` (4 tiles). Pasan a una frase-resumen con números en negrita o a una "tabla de hechos" de 4 filas.
6. `.verdict` con `linear-gradient` naranja y `box-shadow` de color.
7. Las 7 variantes `.badge .b-*`, `.est-tag`, `.est`, `.chip .rk`. "Estimado" pasa a superíndice o asterisco con nota al pie: "S/ 124*".
8. `.reveal` (fade-up) y `.heat .c:hover{transform:scale}`. Sin animación de entrada; hover solo con cambio de color o tooltip.
9. `.rule .ri`, `.steps li::before` (círculos numerados), `.quote` con borde izquierdo rojo, `.f24` con borde izquierdo rojo, `.legal-it` con `border-top:5px`, `.reg-card.l-*`.
10. `h2.q` en forma de pregunta.
11. Microcopy: "Ojo con Google:", "Lo que más molesta en", "ahí está el hueco", "es el mínimo que hay que igualar", "Candidatas a perder clientes", "Recomendación:" como prefijo.
12. `.chip` con píldoras de 999px en la barra: se cambian por un control segmentado sobrio (texto con subrayado del acento en el activo).
13. `.empty` con borde discontinuo e ícono: basta una línea en gris "Sin datos de horarios para San Borja."

### 3.4 Qué poner en su lugar

**Estructura de cada sección**
```html
<section class="chapter" id="mapa">
  <p class="kicker">1 · Competencia</p>            <!-- 13px, gris, sin fondo -->
  <h2>Surco concentra 37% de las clínicas, pero también 43% de los hogares</h2>
  <p class="dek">Contamos 256 clínicas en los cinco distritos. San Isidro tiene 13 y la menor oferta nocturna: una sola atiende 24 horas.</p>
  <figure class="wide">
    <div id="map"></div>
    <figcaption>
      <span class="src">Fuente: Google Places (sep. 2026), límites de OSM. Mapa base © Esri.</span>
    </figcaption>
  </figure>
</section>
```

**Lede de apertura (sustituye hero + veredicto + KPIs).** Dos o tres párrafos en serif a 19-20px, en la columna de lectura:

> Recomendamos abrir en **Santiago de Surco**. De los cinco distritos que estudiamos es el único donde la zonificación permite una clínica veterinaria con hospitalización (en ocho tipos de zona), y el que tiene más hogares por atender: unos 114 500.
>
> La competencia es alta en números (95 clínicas, el 37% del total) pero dispersa: ninguna concentra más del 10% de las reseñas y 14 tienen rating por debajo de 4.0. El hueco más claro es la noche. Entre las 21:00 y las 08:00 abren, en promedio, 45 de 256 clínicas, y siete de las que Google marca como "24 horas" no lo son.
>
> En Miraflores y San Isidro, la norma solo permite consultorio. Antes de firmar un alquiler en cualquier distrito hay que pedir el Certificado de Zonificación y Vías del local.

Debajo, el ranking como **un gráfico de barras horizontales ordenado** (Surco en acento, resto en `--mute-data`) con la puntuación escrita al final de cada barra. Eso sustituye al veredicto naranja y a los tiles.

**Anotaciones en Chart.js.** Añadir después de Chart.js:
```html
<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-annotation@3.1.0/dist/chartjs-plugin-annotation.min.js"></script>
```
(Se registra solo vía CDN. Docs: https://www.chartjs.org/chartjs-plugin-annotation/latest/)

Ejemplo, cobertura por hora con la franja nocturna marcada:
```js
plugins: {
  legend: { display: false },
  annotation: { annotations: {
    noche: { type: 'box', xMin: 21, xMax: 23.5, backgroundColor: 'rgba(11,107,99,.08)', borderWidth: 0 },
    madrugada: { type: 'box', xMin: -0.5, xMax: 8, backgroundColor: 'rgba(11,107,99,.08)', borderWidth: 0 },
    txt: { type: 'label', xValue: 3, yValue: 120, content: ['De 21:00 a 08:00 abren', '45 de 256 clínicas en promedio'],
           font: { family: 'Libre Franklin', size: 12 }, color: '#1B1B1B', textAlign: 'left' },
    pico: { type: 'label', xValue: 11, yValue: 215, content: '207 a las 11:00', color: '#767676', font: { size: 12 } }
  }}
}
```
Reglas para todos los gráficos: `legend.display:false` y etiqueta directa al final de la serie; `grid.color:'#EBEBEB'` solo en Y; `border.display:false` en Y; barras sin `borderRadius`; la serie o barra protagonista en `--accent` y el resto en `#B8B8B8`; tooltip blanco con borde `#D6D6D6` y texto `--ink`, sin el tooltip negro con radio 8.

**Temas de reseñas (escucha social).** Barras divergentes en gris; solo "Espera / demora" en `--risk` con una etiqueta: "61% negativas, el peor balance". Las citas de clientes se muestran como `<blockquote>` en serif cursiva de 17px, sin caja ni borde de color, con la atribución en sans gris.

**Small multiples.** Una fila de 5 mini-gráficos (160-200px de ancho) con la misma escala Y:
- Cobertura por hora de cada distrito (línea), con la franja nocturna sombreada.
- Distribución de ratings (<3.5 / 3.5-3.9 / 4.0-4.4 / 4.5+) por distrito.
El distrito recomendado en acento y los demás en gris. Sustituye al selector que redibuja un único gráfico. El selector puede quedarse para el mapa y el directorio.

**Regulación como tabla, no como 5 tarjetas.**

| Distrito | ¿Clínica nueva? | Dónde | Licencia | Norma |
|---|---|---|---|---|
| **Santiago de Surco** | Sí | CZ, CM y ejes comerciales (8 zonas) | S/ 166 | Ord. 1216-MML, 933-MML |
| La Molina | Solo en un eje | Av. Los Constructores | S/ 316 | Ord. 1661-MML |
| San Borja | Sin verificar | Índice de usos no publicado | S/ 300 | Ord. 1429-MML |
| Miraflores | No, solo consultorio | — | S/ 285 | Ord. 1012-MML |
| San Isidro | No, solo las existentes | — | S/ 252 | Ord. 1328-MML |

Con reglas horizontales finas y la fila de Surco con fondo `--accent-wash`. "No" en `--risk`.

**Recomendaciones.** Una lista numerada normal en prosa (`<ol>` con números en la serif), cada punto de una o dos frases, sin tarjeta, ícono ni badge "Aplica a tu selección".

**Notas y fuentes.** Cada `figure` cierra con `Fuente:` en 12px gris. Al final de la página, una sección "Método y limitaciones" en columna de lectura: tope de 60 resultados de Google Places en Surco, tickets estimados (6 publicados, 30 de reseñas y 170 por segmento), hogares estimados. Es lo que ya dice `.disclaimer`, pero sin caja gris.

**Mapa.** Mantener Esri `World_Light_Gray_Base` y **quitar** la capa `World_Light_Gray_Reference` (etiquetas), o dejarla con opacidad 0.5. Clínicas: `circleMarker` radio 3, `#8C8C8C`, sin borde blanco. 24h reales: radio 4, `--ink`. Celdas de oportunidad: relleno `--accent` con opacidad proporcional al score. Límite del distrito seleccionado: 1.5px `--ink`; el resto 0.75px `#B8B8B8`. Leyenda como texto bajo el mapa, no como caja flotante con sombra. Etiquetas directas con `L.tooltip({permanent:true, direction:'right', className:'map-label'})` para 3-4 lugares clave ("SOS Veterinaria, 35% de las reseñas de Miraflores"). Si algún día se usa CARTO Positron, requiere API key gratuita y atribución visible (https://docs.carto.com/faqs/carto-basemaps); Esri no la pide, así que conviene quedarse con Esri.

### 3.5 Layout

- Contenedor general 1100px. Columna de lectura `max-width: 42rem` (~680px) alineada a la izquierda del contenedor, no centrada. La asimetría se nota.
- `figure.wide` ocupa los 1100px. `figure` normal ocupa la columna de lectura.
- Perfil del distrito y top 5 del mapa: columna lateral de 280px sin fondo, separada por una regla vertical de 1px.
- Secciones: `border-top: 1px solid var(--rule)`, `padding-top: 56px`, `margin-top: 80px`.
- Nav: fondo blanco sólido, sin blur, links en sans 14px gris; el activo en `--ink` con subrayado de 2px del acento.
- Móvil: todo a una columna, gutter de 16px; los small multiples se vuelven un scroll horizontal de 2,5 gráficos visibles o se apilan.

### 3.6 Microcopy: voz del analista

| Antes | Después |
|---|---|
| "Ojo con Google: 7 “24h” no lo son." | "Siete clínicas figuran como 24 horas en Google, pero sus propios canales publican otro horario." |
| "Lo que más molesta en los 5 distritos: Espera / demora" | "La espera es la queja que más se repite: 61% de las menciones son negativas." |
| "Lo más valorado es “Recomendación” (86% positivas): es el mínimo que hay que igualar." | "El 86% de las menciones de recomendación son positivas. El listón de servicio ya está alto." |
| "El domingo es el día con menos cobertura: ahí está el hueco." | "El domingo es el día con menos clínicas abiertas." |
| "Candidatas a perder clientes: Veterinaria Animal Surco (3.7★ con 800 reseñas)…" | "Algunas clínicas grandes tienen clientes descontentos. Veterinaria Animal Surco suma 800 reseñas y un 3,7 de promedio." |
| "Recomendación: Santiago de Surco (79/100) · clínica permitida en 8 zonas." | "Recomendamos Surco. Obtiene 79 de 100 puntos y es el único distrito con vía legal clara para una clínica." |
| KPI "Clínicas mapeadas 256 en los 5 distritos" | "Contamos 256 clínicas en los cinco distritos." |
| "Insight", "Conclusión", "Veredicto · distrito recomendado" | Eliminar. El titular ya es la conclusión. |

Criterios: frases completas y declarativas, sin dos puntos dramáticos ni exclamaciones; cifras exactas con su denominador ("45 de 256"); decimales con coma si el público es peruano (`toLocaleString('es-PE')`); nada de "hueco", "ojo", "clave" como muletillas.

### 3.7 Cinco titulares-hallazgo reescritos desde los insights actuales

Datos tomados del texto renderizado en la página y de `data/dashboard.json`.

1. **Mapa** (antes "¿Dónde está hoy la competencia?")
   → **"Surco reúne 95 de las 256 clínicas, pero también tiene 1.200 hogares por clínica, más que Miraflores"**
   Bajada: "San Isidro es el menos atendido en números absolutos (13 clínicas) y en horario nocturno: una sola abre 24 horas."
   (Hogares por clínica: Surco 114 500 / 95 ≈ 1 205; Miraflores 43 600 / 41 ≈ 1 063; San Isidro ≈ 1 885; San Borja ≈ 806; La Molina ≈ 804.)

2. **Ranking** (antes "¿Qué distrito ofrece la mejor oportunidad?")
   → **"Surco saca 30 puntos de ventaja al segundo distrito; Miraflores queda último por la zonificación"**
   Bajada: "Surco obtiene 79/100, sobre todo por demanda potencial. Le siguen La Molina (49), San Isidro (48) y San Borja (47). Miraflores cierra con 40."

3. **Horarios** (antes "¿Cuándo hay menos clínicas abiertas…?")
   → **"De noche abre una de cada seis clínicas, y siete de las que dicen ser 24 horas no lo son"**
   Bajada: "Entre las 21:00 y las 08:00 hay en promedio 45 clínicas abiertas, frente a 207 a las 11:00. El domingo es el día con menos oferta."

4. **Escucha social** (antes "¿Qué dicen los clientes…?")
   → **"La espera es la queja más frecuente: 6 de cada 10 menciones son negativas"**
   Bajada: "En el trato pasa lo contrario: 531 menciones positivas contra 132 negativas. Competir con buen trato no basta; hay que ganar en tiempos."

5. **Regulación** (antes "¿Qué tan difícil es abrir en cada municipio?")
   → **"En Miraflores y San Isidro no se puede abrir una clínica nueva; el límite no es un tope sino la zonificación"**
   Bajada: "Ningún distrito fija un número máximo de veterinarias. En Miraflores la norma solo admite consultorio; en San Isidro, solo las clínicas que ya existen. Surco la permite en ocho tipos de zona."

Extra, para Competencia: **"Ninguna clínica domina: las tres más reseñadas suman solo 15% de las opiniones"**. Y para el Directorio: **"37 clínicas tienen menos de 4 estrellas; ocho de ellas con mucho volumen de reseñas"**.

### 3.8 CSS base (sustituye `:root` y la tipografía; unas 80 líneas)

```css
/* ---- Tokens ---- */
:root{
  --paper:#FFFFFF; --ink:#1B1B1B; --ink-2:#4A4A4A; --ink-3:#767676;
  --rule:#D6D6D6; --grid:#EBEBEB; --mute-data:#B8B8B8;
  --accent:#0B6B63; --accent-wash:#E6F0EF; --risk:#B3261E;
  --serif:'Source Serif 4', Georgia, 'Times New Roman', serif;
  --sans:'Libre Franklin', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --measure:42rem; --wide:1100px;
}
*{box-sizing:border-box}
body{margin:0;background:var(--paper);color:var(--ink);
  font:16px/1.55 var(--sans);-webkit-font-smoothing:antialiased}
.num,table,figcaption{font-variant-numeric:tabular-nums lining-nums}
a{color:var(--accent);text-decoration-thickness:1px;text-underline-offset:2px}

/* ---- Layout ---- */
.page{max-width:var(--wide);margin:0 auto;padding:0 24px}
.chapter{border-top:1px solid var(--rule);margin-top:80px;padding-top:48px}
.chapter > p, .chapter > h2, .chapter > .dek, .prose{max-width:var(--measure)}
@media (max-width:767px){.page{padding:0 16px}.chapter{margin-top:56px;padding-top:32px}}

/* ---- Tipografía ---- */
h1,h2,h3{font-family:var(--serif);font-weight:600;color:var(--ink);margin:0;
  letter-spacing:-.005em;text-wrap:balance}
h1{font-size:clamp(32px,4.2vw,44px);line-height:1.1}
h2{font-size:clamp(24px,2.8vw,30px);line-height:1.18;margin-bottom:10px}
h3{font-size:19px;line-height:1.25}
.kicker{font:500 13px/1.4 var(--sans);color:var(--ink-3);margin:0 0 8px}
.dek{font:400 18px/1.5 var(--serif);color:var(--ink-2);margin:0 0 28px}
.lede p{font:400 19px/1.6 var(--serif);margin:0 0 1em;max-width:var(--measure)}
.lede b,.dek b{font-weight:600;color:var(--ink)}
blockquote{margin:0 0 20px;font:italic 400 17px/1.5 var(--serif);color:var(--ink)}
blockquote cite{display:block;margin-top:4px;font:normal 12px var(--sans);color:var(--ink-3)}

/* ---- Figuras ---- */
figure{margin:0 0 40px}
figure.wide{max-width:var(--wide)}
figure > h3{margin-bottom:4px}
figure > .fig-dek{font-size:14px;color:var(--ink-2);margin:0 0 14px;max-width:var(--measure)}
.chart-box{position:relative;height:300px}
figcaption{margin-top:10px;font-size:12px;line-height:1.45;color:var(--ink-3)}
figcaption .src::before{content:"Fuente: ";font-weight:600}
.note-mark{font-size:.75em;vertical-align:super;color:var(--ink-3)}
.multiples{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:24px}
.multiples h4{font:600 13px var(--sans);margin:0 0 6px}
.multiples .is-pick h4{color:var(--accent)}
@media (max-width:767px){.multiples{grid-template-columns:repeat(2,minmax(0,1fr))}}

/* ---- Tablas ---- */
table{border-collapse:collapse;width:100%;font-size:14px}
thead th{font:600 12px/1.3 var(--sans);color:var(--ink-3);text-align:left;
  padding:0 12px 8px 0;border-bottom:1px solid var(--ink);vertical-align:bottom}
tbody td,tbody th{padding:10px 12px 10px 0;border-bottom:1px solid var(--grid);
  text-align:left;font-weight:400;vertical-align:top}
td.n,th.n{text-align:right}
tbody tr.pick{background:var(--accent-wash)}
tbody tr.pick th{font-weight:600}
.risk{color:var(--risk);font-weight:600}
tbody tr:last-child td,tbody tr:last-child th{border-bottom:1px solid var(--rule)}

/* ---- Controles sobrios ---- */
.seg{display:flex;gap:20px;border-bottom:1px solid var(--rule)}
.seg button{background:none;border:0;padding:10px 0;min-height:44px;font:500 14px var(--sans);
  color:var(--ink-3);border-bottom:2px solid transparent;margin-bottom:-1px}
.seg button[aria-pressed="true"]{color:var(--ink);border-bottom-color:var(--accent)}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
```

JS correspondiente para Chart.js:
```js
Chart.defaults.font.family = "'Libre Franklin', sans-serif";
Chart.defaults.font.size = 12;
Chart.defaults.color = '#767676';
Chart.defaults.borderColor = '#EBEBEB';
Chart.defaults.plugins.legend.display = false;
Object.assign(Chart.defaults.plugins.tooltip, {
  backgroundColor:'#FFFFFF', titleColor:'#1B1B1B', bodyColor:'#1B1B1B',
  borderColor:'#D6D6D6', borderWidth:1, cornerRadius:0, padding:8, displayColors:false });
Chart.defaults.elements.bar.borderRadius = 0;
```

### 3.9 Orden de trabajo sugerido (de más a menos impacto)

1. Tokens + fuentes + quitar `.reveal`, sombras y radios (solo CSS; el cambio de sensación es grande).
2. Borrar `.insight` y eyebrows; reescribir los 8 `h2` como titulares-hallazgo generados desde los datos (las plantillas de `render*` ya tienen las cifras).
3. Hero: sustituir veredicto + KPIs por el lede + gráfico de ranking con etiqueta directa.
4. Gráficos: paleta gris + acento, plugin de anotación, leyendas fuera.
5. Regulación y recomendaciones a tabla y lista en prosa; quitar badges.
6. Mapa: puntos grises, acento solo en oportunidad, leyenda como texto.
7. Small multiples de horarios y ratings.
8. Pasada de microcopy con la tabla de 3.6.

Prueba final (la de *leptons* en HN): entrecierra los ojos frente a la pantalla. Solo deberían destacar el titular de cada sección, la barra de Surco y la franja nocturna.
