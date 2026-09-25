# Tamaño del mercado pet care y buyer persona (Lima, 5 distritos)

Fecha de corte: 24-sep-2026. Convenciones: **[R]** = cifra publicada; **[E]** = estimado nuestro (interpolado, retroproyectado o por supuesto). Tipo de cambio usado para convertir soles a US$ en 2025: **S/ 3.70** (aprox., promedio anual; [BCRP](https://estadisticas.bcrp.gob.pe/estadisticas/series/)).

---

## 1. Tamaño del mercado anual

### 1.1 Qué mide cada fuente (importante)

- **Euromonitor "Pet Care in Peru"** = **alimento + productos** (arena, antiparasitarios/OTC, accesorios, juguetes). **No incluye servicios veterinarios, grooming ni hotel**, según la ficha del informe (edición mayo 2026): [euromonitor.com/pet-care-in-peru/report](https://www.euromonitor.com/pet-care-in-peru/report).
- Algunos medios llaman "mercado de alimento" al mismo total (p. ej., US$ 456 M en 2023, [El Comercio, feb-2025](https://elcomercio.pe/economia/peru/mercado-de-alimento-para-mascotas-en-peru-proyecta-alcanzar-los-us680-millones-en-2028-i-ultimas-noticia/)), mientras que [Forbes Perú, abr-2024](https://forbes.pe/negocios/2024-04-29/el-mercado-de-mascotas-en-peru-facturaria-us680-millones-hacia-el-2028-estas-son-las-razones-de-su-continuo-crecimiento/) lo presenta como el total de pet care. Lo tomo como **pet care total (alimento + productos)**.
- **Servicios veterinarios**: no hay serie pública. Los anclo en la **ENAHO 2025 del INEI**: los hogares gastan S/ 298.6 M **al mes** en mascotas, 89% en alimento y **11% (S/ 32.8 M al mes) en veterinaria** ([El Comercio / ECData](https://elcomercio.pe/ecdata/veterinaria-inei-cuanto-gastan-los-peruanos-en-sus-mascotas-mercado-de-mascotas-en-peru-perros-y-gatos-keiko-fujimori-noticia/)). Eso da S/ 394 M al año, unos **US$ 106 M en 2025 [E]**. HeyVet habla de **~US$ 200 M** (25% de un mercado de ~US$ 800 M), pero es una declaración de la empresa, no un estudio ([AmericaRetail](https://americaretail-malls.com/paises/peru/boom-pet-lover-impulsa-mercado-peruano-veterinario/)). Para los demás años extiendo el ancla con un crecimiento del **8% anual**, que es la tasa del mercado de salud animal citada en [Gestión (LatamVet)](https://gestion.pe/economia/empresas/latamvet-proyecta-ingresar-a-peru-con-plan-para-expandir-red-de-clinicas-veterinarias-noticia/).
- **Alimento frente a productos**: no encontré el desglose público. Uso un **supuesto de 80/20 [E]** (alimento/productos). Es un supuesto del analista, no una cifra de fuente.
- **Grooming, hotel y otros servicios**: no hay dato de mercado. Queda en `null`. Referencia de 2018 para Lima: el 49% de los hogares con perro usa baño o corte, con un gasto de S/ 53 al mes; en hogares con gato es el 12.7% y S/ 28 al mes ([CPI Market Report N°08, p. 4](https://cpi.pe/images/upload/paginaweb/archivo/26/mr_mascotas_201808.pdf)).

### 1.2 Serie anual Perú (US$ millones)

| Año | Pet care Euromonitor (alim.+prod.) | Tipo | Alimento [E 80%] | Productos [E 20%] | Veterinaria [E] | Total c/ vet [E] | Crec. a/a pet care | Fuente de la cifra Euromonitor |
|---|---|---|---|---|---|---|---|---|
| 2018 | 243.1 | E (retroproyección: 2019 ÷ 1.08) | 194.5 | 48.6 | 62.1 | 305.2 | – | Supuesto: crecimiento del 8%, igual al de 2020 |
| 2019 | 262.6 | R | 210.1 | 52.5 | 67.1 | 329.7 | 8.0% [E] | [Forbes Perú, abr-2024](https://forbes.pe/negocios/2024-04-29/el-mercado-de-mascotas-en-peru-facturaria-us680-millones-hacia-el-2028-estas-son-las-razones-de-su-continuo-crecimiento/) (otra edición: US$ 270 M, [El Comercio](https://elcomercio.pe/respuestas/como/pet-lover-peru-quiero-adoptar-una-mascota-por-que-los-peruanos-estan-invirtiendo-mas-en-sus-mascotas-y-que-significa-para-tu-bolsillo-mercado-pet-care-noticia/)) |
| 2020 | 283.9 | E (2019 × 1.081) | 227.1 | 56.8 | 72.4 | 356.3 | 8.1% (R) | Crecimiento del 8.1% según Euromonitor, vía [Forbes Perú, ago-2022](https://forbes.pe/negocios/2022-08-22/asi-es-como-el-mercado-de-mascotas-en-peru-moveria-us429-millones-este-ano) |
| 2021 | 375.1 | R | 300.1 | 75.0 | 78.2 | 453.3 | 32.1% (Euromonitor reporta 29.1%) | [Forbes Perú, abr-2024](https://forbes.pe/negocios/2024-04-29/el-mercado-de-mascotas-en-peru-facturaria-us680-millones-hacia-el-2028-estas-son-las-razones-de-su-continuo-crecimiento/) |
| 2022 | 422.6 | E (2023 ÷ 1.079) | 338.1 | 84.5 | 84.5 | 507.1 | 12.7% | Deducido del +7.9% de 2023. Forbes, ago-2022, publicó **US$ 429.6 M** como proyección del año ([link](https://forbes.pe/negocios/2022-08-22/asi-es-como-el-mercado-de-mascotas-en-peru-moveria-us429-millones-este-ano)) |
| 2023 | 456.0 | R | 364.8 | 91.2 | 91.2 | 547.2 | 7.9% (R) | [Forbes Perú, abr-2024](https://forbes.pe/negocios/2024-04-29/el-mercado-de-mascotas-en-peru-facturaria-us680-millones-hacia-el-2028-estas-son-las-razones-de-su-continuo-crecimiento/); [El Comercio, feb-2025](https://elcomercio.pe/economia/peru/mercado-de-alimento-para-mascotas-en-peru-proyecta-alcanzar-los-us680-millones-en-2028-i-ultimas-noticia/) |
| 2024 | 507.0 | R | 405.6 | 101.4 | 98.5 | 605.5 | 11.2% | Euromonitor vía [Petfood Latinoamérica / El Comercio, may-2025](https://petfoodlatinoamerica.com/2025/05/02/mascotas-cuanto-gastan-los-peruanos-en-sus-cuidados-y-cuales-son-los-nuevos-servicios-creados-para-ellas/) |
| 2025 | 542.0 | E (interpolado, CAGR 6.9%) | 433.6 | 108.4 | 106.4 (ancla ENAHO) | 648.4 | 6.9% | Interpolación entre 2024 y 2029 |
| 2026p | 579.5 | E (interpolado) | 463.6 | 115.9 | 114.9 | 694.4 | 6.9% | Ídem |
| 2027p | 619.5 | E (interpolado) | 495.6 | 123.9 | 124.1 | 743.6 | 6.9% | Ídem |
| 2028p | 662.3 | E (interpolado) | 529.8 | 132.5 | 134.0 | 796.3 | 6.9% | Una edición anterior de Euromonitor daba **US$ 680 M** ([Forbes 2024](https://forbes.pe/negocios/2024-04-29/el-mercado-de-mascotas-en-peru-facturaria-us680-millones-hacia-el-2028-estas-son-las-razones-de-su-continuo-crecimiento/)) |
| 2029p | 708.0 | R (proyección) | 566.4 | 141.6 | 144.8 | 852.8 | 6.9% | Euromonitor vía [Petfood Latinoamérica](https://petfoodlatinoamerica.com/2025/05/02/mascotas-cuanto-gastan-los-peruanos-en-sus-cuidados-y-cuales-son-los-nuevos-servicios-creados-para-ellas/) |

**Crecimiento**
- CAGR 2018–2024, pet care: **13.0%** [E, porque 2018 está retroproyectado]. Con los puntos reales 2019–2024: **14.1%**.
- CAGR 2024–2029, pet care: **6.9%** (507 → 708, ambas cifras de Euromonitor).
- Con veterinaria incluida: 12.1% (2018–24) y 7.1% (2024–29) [E].
- Lectura: el salto de 2021 (+29–32%) es el efecto pandemia/adopción. Desde entonces el mercado crece a un dígito alto y Euromonitor proyecta una desaceleración a ~7%.
- Alerta: según la ENAHO, el **gasto veterinario por hogar bajó de S/ 14.9 a S/ 12.1 al mes entre 2024 y 2025 (-18.3%)**, mientras que la proporción de hogares que gasta en mascotas subió del 44.0% al 48.3% ([Infobae, 08-sep-2026](https://www.infobae.com/peru/2026/09/08/economia-peruana-golpea-a-perros-y-gatos-ahora-se-gasta-menos-en-mascotas/)). Más hogares gastan, pero con menos ticket promedio: el promedio se diluye.

### 1.3 Lima Metropolitana [E]

No existe una serie de Euromonitor para Lima. Según la ENAHO 2025, Lima Metropolitana gasta **S/ 118 M al mes** (alimento S/ 103 M y veterinaria S/ 15 M), el **39.5%** del gasto nacional de los hogares en mascotas ([El Comercio / ECData](https://elcomercio.pe/ecdata/veterinaria-inei-cuanto-gastan-los-peruanos-en-sus-mascotas-mercado-de-mascotas-en-peru-perros-y-gatos-keiko-fujimori-noticia/)). En el año son S/ 1,416 M (unos US$ 383 M), de los cuales **la veterinaria suma S/ 180 M (unos US$ 49 M) [E]**. Si se aplica el 39.5% a la serie de Euromonitor, Lima ≈ US$ 200 M en 2024 y US$ 280 M en 2029 [E]. Nota: las cifras de la ENAHO (autodeclaradas por los hogares, incluyen comida a granel y casera) no son comparables en nivel con Euromonitor (ventas retail).

### 1.4 Gasto mensual (soles)

| Año | Indicador | Valor | Fuente |
|---|---|---|---|
| 2018 | Gasto por consulta veterinaria, perro, Lima Met. | S/ 85 (91% de los hogares con perro va al vet. al menos 1 vez/año) | [CPI MR N°08, p. 4](https://cpi.pe/images/upload/paginaweb/archivo/26/mr_mascotas_201808.pdf) |
| 2018 | Gasto por consulta veterinaria, gato, Lima Met. | S/ 39 (58.7% va al menos 1 vez/año) | Ídem |
| 2018 | Grooming mensual, perro, Lima Met. | S/ 53 | Ídem |
| 2018 | "Gasto veterinario mensual", total Perú urbano (según el texto del informe) | Perro S/ 62, gato S/ 32 | [CPI MR N°08, p. 3](https://cpi.pe/images/upload/paginaweb/archivo/26/mr_mascotas_201808.pdf). **Ojo**: la tabla de la p. 4 rotula la misma cifra como "por consulta". `indicadores.md` la cita como mensual; conviene corregirlo |
| 2023–24 | Gasto mensual por hogar | S/ 100–150 (Ipsos); ~S/ 300 (HeyVet) | [Ipsos "Entre patas"](https://www.ipsos.com/es-pe/entre-patas); [Gestión](https://gestion.pe/economia/empresas/el-negocio-detras-del-boom-petcare-en-que-invierten-mas-los-duenos-de-mascotas-noticia/) |
| 2024 | Gasto mensual, hogares que gastan (Perú) | S/ 62.9 | INEI ENAHO vía [Infobae](https://www.infobae.com/peru/2026/09/08/economia-peruana-golpea-a-perros-y-gatos-ahora-se-gasta-menos-en-mascotas/) |
| 2025 | Gasto por mascota (industria, Lima) | S/ 350–500 al mes | Nestlé Purina (no Arellano, como se decía antes) / El Comercio vía [Petfood LatAm](https://petfoodlatinoamerica.com/2025/05/02/mascotas-cuanto-gastan-los-peruanos-en-sus-cuidados-y-cuales-son-los-nuevos-servicios-creados-para-ellas/) |
| 2025 | Gasto mensual, hogares que gastan (Perú) | S/ 57.7; NSE A/B S/ 88.1 (veterinaria A/B S/ 34.5) | [INEI, Informe técnico: Tenencia y crianza de mascotas 2025](https://www.gob.pe/institucion/inei/informes-publicaciones/8570625-informe-tecnico-tenencia-y-crianza-de-mascotas-2025) (antes citado vía Infobae) |
| 2025 | Gasto per cápita en mascotas | S/ 51.2 al mes (5.2% del presupuesto familiar) | **No verificado**: circula en prensa ([Rankia](https://www.rankia.pe/blog/bvl-mercado-al-dia/6844120-invertir-mercado-mascotas), Infobae) atribuido al INEI, pero no aparece en el informe técnico |
| 2025 | Gasto anual por hogar, perro vs. gato | S/ 255 vs. S/ 155 (Kantar) | [Andina](https://andina.pe/agencia/noticia-perros-vs-gatos-mascota-demanda-un-mayor-gasto-a-los-peruanos-1024695.aspx) |

Hay una brecha de 5 a 8 veces entre la ENAHO (promedio de todos los hogares, incluidos los de comida casera) y las cifras de la industria (dueños urbanos que compran alimento balanceado). Para NSE A/B de los 5 distritos, **S/ 250–500 al mes por hogar** es el rango razonable [E].

### 1.5 Gráfico sugerido

- **Tipo**: barras apiladas por año (alimento, productos, veterinaria), con 2025–2029 en trama rayada o con opacidad del 50% para marcar la proyección. Encima, una línea con el crecimiento a/a en el eje secundario.
- **Ejes**: X = año 2018–2029; Y izquierdo = US$ M; Y derecho = % a/a.
- **Anotaciones**: "+29–32%: pandemia y adopción (2021)"; "Euromonitor: 507 → 708, CAGR 6.9%"; un marcador hueco en los años [E] (2018, 2020, 2022, 2025–28); una nota al pie: "Veterinaria = estimado ENAHO 2025 ± 8%/año; Euromonitor no incluye servicios".
- Opcional: un KPI "Lima ≈ 40% del gasto nacional (ENAHO 2025)".

---

## 2. Buyer persona (NSE A/B, Miraflores, San Isidro, San Borja, Surco, La Molina)

### 2.1 Evidencia de nuestras reseñas (`data/dashboard.json`)

Base: **1,161 reseñas** de Google en 264 fichas (256 clínicas), de las cuales 1,109 tienen texto. Conteo por regex sobre el texto (una reseña puede caer en varias categorías):

| Tema | Reseñas | % | Rating medio |
|---|---|---|---|
| Menciona perro | 352 | 30.3% | 3.54 |
| Menciona gato | 155 | 13.4% | 3.59 |
| (solo gato / solo perro / ambos) | 124 / 310 / 31 | – | – |
| Trato, amabilidad, cariño | 337 | 29.0% | **4.41** |
| "Recomiendo/recomendado" | 288 | 24.8% | 4.02 |
| Precio, costo, cobro | 188 | 16.2% | 3.25 |
| "Caro", abusivo | 29 | 2.5% | 2.52 |
| Grooming (baño/corte) | 144 | 12.4% | 3.39 |
| Emergencia, 24 h, noche | 95 | 8.2% | **2.76** |
| Emergencia, estricto (sin "noche") | 84 | 7.2% | 52% son de 1★ |
| Espera, demora | 89 | 7.7% | **2.53** |
| "Mi bebé/hijo/engreído/peque/familia" | 87 | 7.5% | **4.29** |
| Cirugía, esterilización | 84 | 7.2% | 3.55 |
| Especialista, ecografía, rayos | 67 | 5.8% | 3.58 |
| Mascota senior o edad (≥10 años) | 24 | 2.1% | 3.83 |
| Fallecimiento, eutanasia | 21 | 1.8% | **1.33** |
| Lealtad ("desde hace X años") | 20 | 1.7% | 18 de 20 son 5★ |
| WhatsApp / Instagram | 23 / 3 | 2.0% / 0.3% | 2.65 / 2.33 |

- **Por distrito** (% de reseñas): gato San Isidro **17%**, Miraflores 15%, Surco 14%, San Borja y La Molina 12%. Precio: Surco **19%**, Miraflores 16%. Espera: Miraflores **14%** (el doble que el resto). Emergencia: Miraflores **12%**. Especialista: San Borja **9%**. Senior: San Isidro **5%**.
- **Temas pos/neg** (campo `themes`): Miraflores es el único distrito con Precio neto negativo (7 pos / 11 neg) y el peor en Espera (11/16) y Emergencias (8/15). La Molina tiene Precio muy positivo (24/6). En los 5 distritos, "Emergencias 24h" (40/55) y "Espera" (37/59) tienen más negativas que positivas.
- **Horas de publicación** (hora de Lima): el pico es de 10 a 17 h. El **12.2%** de las reseñas (142) se publica entre las 22 y las 6 h, y el 26% de esas es de 1★ (22% en el total). El domingo es el día con menos reseñas (116 frente a ~180 de lunes a miércoles).
- **Oferta**: hay 10 fichas con foco felino (Gattos ×4, Gatuario ×2, Gatópolis, etc.) y 44 clínicas con atención 24 h (Surco 17, San Isidro 1).

Limitaciones: Google devuelve un máximo de ~5 reseñas por ficha (sesgo a lo reciente y lo "relevante"). Las regex no distinguen, por ejemplo, "buenas noches". El 58% de las reseñas es de 2025–2026.

### 2.2 Fuentes externas clave

- En NSE A/B, **el 86.6% de los hogares con mascota tiene perro y el 23.9% tiene gato**. En A/B, el 39.2% de los gatos se adopta y el 31.8% de los perros se compra ([CPI 2018, p. 2](https://cpi.pe/images/upload/paginaweb/archivo/26/mr_mascotas_201808.pdf)).
- El 48.7% de los hogares A/B alimenta solo con balanceado ([CPI 2018, p. 3](https://cpi.pe/images/upload/paginaweb/archivo/26/mr_mascotas_201808.pdf)).
- El gato es la categoría de mayor crecimiento ([Euromonitor 2026](https://www.euromonitor.com/pet-care-in-peru/report)). La tenencia de gatos creció 59% frente al 30% de los perros ([Kantar](https://www.kantar.com/latin-america/inspiracion/consumo-masivo/hogares-con-mascotas)).
- El dueño típico tiene entre 25 y 45 años y vive en zona urbana (Nestlé Purina). El 73% ve a su mascota como familia (Arellano). Ambos datos vienen de la misma nota ([Petfood LatAm](https://petfoodlatinoamerica.com/2025/05/02/mascotas-cuanto-gastan-los-peruanos-en-sus-cuidados-y-cuales-son-los-nuevos-servicios-creados-para-ellas/)). Son mayormente millennials, "perrhijos/gathijos" ([Ipsos](https://www.ipsos.com/es-pe/cuando-el-cliente-ladra-marcas-exitosas-en-el-creciente-mercado-de-mascotas)).
- Lo que se valora en una veterinaria (escala /10): médico confiable **9.69**, trato cálido 8.96, calidad médica 8.86, disponibilidad para emergencias 8.46. Pesan más la confianza y el boca a boca que la publicidad ([Arellano vía El Comercio](https://elcomercio.pe/economia/dia-1/del-veterinario-de-barrio-a-las-clinicas-especializadas-asi-crece-el-mercado-de-salud-para-mascotas-en-el-peru-cadenas-veterinarias-noticia/)).
- En Lima Metropolitana y Callao, el 85.5% tiene perro por compañía o afecto (INEI 2026, ver `indicadores.md`).
- En Rappi, el 72% de las ventas pet es alimento/insumos para perro y el 16% son medicamentos. El ticket por delivery es de S/ 35 para perro y S/ 22–30 para gato ([Andina](https://andina.pe/agencia/noticia-perros-vs-gatos-mascota-demanda-un-mayor-gasto-a-los-peruanos-1024695.aspx)).

### 2.3 Fichas

#### P1: "Valeria, gatera millennial en depa" (≈25% de los clientes [E])
| Campo | Detalle |
|---|---|
| Edad / distrito / NSE | 31 años · Miraflores o San Isidro · B (sin hijos, trabaja en oficina o remoto) |
| Mascota | 2 gatos adoptados, de interior |
| Gasto mensual | **S/ 220** [E]: alimento premium S/ 70–80 por gato + arena S/ 33–70 + snacks ([El Comercio](https://elcomercio.pe/respuestas/como/pet-lover-peru-quiero-adoptar-una-mascota-por-que-los-peruanos-estan-invirtiendo-mas-en-sus-mascotas-y-que-significa-para-tu-bolsillo-mercado-pet-care-noticia/)) + prorrateo de vacunas y controles |
| Visitas/año | 2–3 (control, vacunas, algún cuadro urinario o de emergencia) |
| Valora | Manejo *cat-friendly* (sin perros en sala), especialista felino, cita puntual, que le expliquen |
| Le molesta | Espera con el gato estresado en el transportador, WhatsApp lento, trato brusco |
| Canales | Instagram (descubre), Google Maps y reseñas (valida), WhatsApp (agenda), grupos de adopción |
| Momento de decisión | Tras adoptar (primer control y esterilización) o ante una emergencia (deja de comer u orinar), de noche |
| Extras | Alimento premium y húmedo, arena, delivery de farmacia, telemedicina |
| Evidencia propia | Gato aparece en el 17% de las reseñas de San Isidro y el 15% de Miraflores (13.4% en el total). Hay 10 fichas especializadas en felinos. En Miraflores la espera es un tema de queja (14%) |

Citas: "La doctora Hurtado trata con mucho cariño y cuidado a los michis" (5★, Gattos Miraflores). "Mi gatito entró por emergencia, muy buena la atención, fue inmediata" (5★, Gattos Benavides).

#### P2: "Familia Rodríguez, perro grande en casa" (≈45–50% [E])
| Campo | Detalle |
|---|---|
| Edad / distrito / NSE | 42 años (pareja con hijos en edad escolar) · Surco o La Molina · A/B |
| Mascota | Perro mediano o grande (labrador, golden), a veces 2 perros |
| Gasto mensual | **S/ 450** [E]: alimento balanceado S/ 110–200, baño y corte S/ 60–120, antipulgas, vet prorrateado. Nestlé Purina estima S/ 350–500 por mascota |
| Visitas/año | 4 clínicas + ~10 de grooming (el 49% de los hogares limeños con perro usa grooming, [CPI 2018](https://cpi.pe/images/upload/paginaweb/archivo/26/mr_mascotas_201808.pdf)) |
| Valora | Todo en un lugar (consulta, baño, petshop), precio claro, estacionamiento, cercanía a casa, tener un 24 h de respaldo |
| Le molesta | Recargos (baño "al doble por perro grande"), cortes mal hechos, cobros extra en la cuenta |
| Canales | Recomendación de vecinos y del colegio, Google Maps, WhatsApp para citas de baño |
| Momento de decisión | Fin de semana (baño) o al mudarse; cambia de clínica tras un mal grooming |
| Extras | Alimento premium por saco, grooming mensual, hospedaje en vacaciones, membresía o plan de salud |
| Evidencia propia | Perro en el 30.3% de las reseñas (el doble que gato). Grooming 12.4%, con rating de 3.39 y tema 85 pos / 59 neg. Precio mencionado en el 19% de las reseñas de Surco. En La Molina Precio es positivo (24/6) |

Citas: "Tratan súper bien a mi perrito, va ahí por baño y corte desde hace años" (5★, Family Pets, Surco). "me llaman a decir que va a costad el doble porq es un perro grande" (2★, Pet Center Miraflores).

#### P3: "Carmen, adulta mayor con perro senior" (≈15% de los clientes, pero de alto ticket [E])
| Campo | Detalle |
|---|---|
| Edad / distrito / NSE | 64 años (hijos fuera de casa) · San Borja o San Isidro · A |
| Mascota | Perro pequeño de 12 a 15 años (chihuahua, schnauzer) con enfermedad crónica |
| Gasto mensual | **S/ 400** [E]: medicación crónica, análisis y ecografías, dieta de prescripción |
| Visitas/año | 6–10 (controles, exámenes, especialistas, emergencias) |
| Valora | Médico de confianza de años, diagnóstico acertado, que le expliquen con paciencia, especialistas (cardio, derma, onco), 24 h cerca |
| Le molesta | Diagnóstico errado, que el teléfono de emergencia no conteste, cobros nocturnos, mal manejo del final de vida |
| Canales | Recomendación del veterinario de siempre o de amistades, llamada telefónica más que Instagram. Google para buscar un 24 h |
| Momento de decisión | Crisis nocturna o derivación a especialista. Luego es muy leal |
| Extras | Farmacia, laboratorio e imágenes, dieta de prescripción, visita a domicilio, cremación |
| Evidencia propia | Lealtad: 18 de 20 reseñas de "desde hace X años" son 5★. En emergencias, el 52% de las reseñas es de 1★. Fallecimiento: rating de 1.33. Especialista 9% en San Borja, senior 5% en San Isidro |

Citas: "atiende a Osita desde el mes y medio de nacida y ya tiene 12 años" (5★, Veterinaria Engreidos, Surco). "chihuahua 13 años, lo mal diagnostico" (1★, Fido's Vet, San Borja).

**Qué implica para la clínica**: (1) la sala o el horario felino son un diferenciador en Miraflores y San Isidro; (2) grooming con precio transparente por talla genera recurrencia en Surco y La Molina; (3) una emergencia nocturna bien atendida (teléfono que conteste, presupuesto claro) ataca el tema peor calificado del mercado y fideliza a P3.

---

## 3. Bloques de datos

```json
{
  "market": {
    "unit": "USD_M",
    "scope": "Peru. total = euromonitor_pet_care (alimento+productos) + vet (estimado). 'estimated' se refiere al valor Euromonitor del año; food/products/vet siempre son estimados.",
    "series": [
      {"year": 2018, "euromonitor_pet_care": 243.1, "total": 305.2, "food": 194.5, "vet": 62.1, "products": 48.6, "other": null, "estimated": true, "source": "Retroproyección: 2019 (262.6) / 1.08. Supuesto de analista"},
      {"year": 2019, "euromonitor_pet_care": 262.6, "total": 329.7, "food": 210.1, "vet": 67.1, "products": 52.5, "other": null, "estimated": false, "source": "Euromonitor vía Forbes Perú 2024 - https://forbes.pe/negocios/2024-04-29/el-mercado-de-mascotas-en-peru-facturaria-us680-millones-hacia-el-2028-estas-son-las-razones-de-su-continuo-crecimiento/"},
      {"year": 2020, "euromonitor_pet_care": 283.9, "total": 356.3, "food": 227.1, "vet": 72.4, "products": 56.8, "other": null, "estimated": true, "source": "2019 x 1.081 (crecimiento 8.1% Euromonitor vía Forbes Perú 2022) - https://forbes.pe/negocios/2022-08-22/asi-es-como-el-mercado-de-mascotas-en-peru-moveria-us429-millones-este-ano"},
      {"year": 2021, "euromonitor_pet_care": 375.1, "total": 453.3, "food": 300.1, "vet": 78.2, "products": 75.0, "other": null, "estimated": false, "source": "Euromonitor vía Forbes Perú 2024 - https://forbes.pe/negocios/2024-04-29/el-mercado-de-mascotas-en-peru-facturaria-us680-millones-hacia-el-2028-estas-son-las-razones-de-su-continuo-crecimiento/"},
      {"year": 2022, "euromonitor_pet_care": 422.6, "total": 507.1, "food": 338.1, "vet": 84.5, "products": 84.5, "other": null, "estimated": true, "source": "2023 / 1.079; Forbes ago-2022 publicó 429.6 como proyección - https://forbes.pe/negocios/2022-08-22/asi-es-como-el-mercado-de-mascotas-en-peru-moveria-us429-millones-este-ano"},
      {"year": 2023, "euromonitor_pet_care": 456.0, "total": 547.2, "food": 364.8, "vet": 91.2, "products": 91.2, "other": null, "estimated": false, "source": "Euromonitor vía Forbes Perú 2024 y El Comercio feb-2025 - https://elcomercio.pe/economia/peru/mercado-de-alimento-para-mascotas-en-peru-proyecta-alcanzar-los-us680-millones-en-2028-i-ultimas-noticia/"},
      {"year": 2024, "euromonitor_pet_care": 507.0, "total": 605.5, "food": 405.6, "vet": 98.5, "products": 101.4, "other": null, "estimated": false, "source": "Euromonitor vía Petfood Latinoamérica may-2025 - https://petfoodlatinoamerica.com/2025/05/02/mascotas-cuanto-gastan-los-peruanos-en-sus-cuidados-y-cuales-son-los-nuevos-servicios-creados-para-ellas/"},
      {"year": 2025, "euromonitor_pet_care": 542.0, "total": 648.4, "food": 433.6, "vet": 106.4, "products": 108.4, "other": null, "estimated": true, "source": "Interpolado CAGR 6.9% 2024-2029; vet = ENAHO 2025 S/32.8M/mes x12 / 3.70 - https://elcomercio.pe/ecdata/veterinaria-inei-cuanto-gastan-los-peruanos-en-sus-mascotas-mercado-de-mascotas-en-peru-perros-y-gatos-keiko-fujimori-noticia/"},
      {"year": 2026, "euromonitor_pet_care": 579.5, "total": 694.4, "food": 463.6, "vet": 114.9, "products": 115.9, "other": null, "estimated": true, "source": "Interpolado CAGR 6.9% entre Euromonitor 2024 y 2029"},
      {"year": 2027, "euromonitor_pet_care": 619.5, "total": 743.6, "food": 495.6, "vet": 124.1, "products": 123.9, "other": null, "estimated": true, "source": "Interpolado CAGR 6.9% entre Euromonitor 2024 y 2029"},
      {"year": 2028, "euromonitor_pet_care": 662.3, "total": 796.3, "food": 529.8, "vet": 134.0, "products": 132.5, "other": null, "estimated": true, "source": "Interpolado; edición previa Euromonitor daba 680 (Forbes 2024)"},
      {"year": 2029, "euromonitor_pet_care": 708.0, "total": 852.8, "food": 566.4, "vet": 144.8, "products": 141.6, "other": null, "estimated": false, "source": "Proyección Euromonitor vía Petfood Latinoamérica - https://petfoodlatinoamerica.com/2025/05/02/mascotas-cuanto-gastan-los-peruanos-en-sus-cuidados-y-cuales-son-los-nuevos-servicios-creados-para-ellas/"}
    ],
    "cagr_2018_2024": 13.0,
    "cagr_2019_2024_real_points": 14.1,
    "cagr_2024_2029": 6.9,
    "lima": {"share_of_national_household_spend_pct": 39.5, "household_spend_2025_soles_m_year": 1416, "vet_2025_soles_m_year": 180, "estimated": true, "source": "INEI ENAHO 2025 vía El Comercio ECData - https://elcomercio.pe/ecdata/veterinaria-inei-cuanto-gastan-los-peruanos-en-sus-mascotas-mercado-de-mascotas-en-peru-perros-y-gatos-keiko-fujimori-noticia/"},
    "spend_per_pet_month_soles": [
      {"year": 2018, "value": 85, "basis": "gasto por consulta veterinaria, perro, Lima Met.", "source": "CPI Market Report N°08 p.4 - https://cpi.pe/images/upload/paginaweb/archivo/26/mr_mascotas_201808.pdf"},
      {"year": 2018, "value": 39, "basis": "gasto por consulta veterinaria, gato, Lima Met.", "source": "CPI Market Report N°08 p.4 - https://cpi.pe/images/upload/paginaweb/archivo/26/mr_mascotas_201808.pdf"},
      {"year": 2018, "value": 53, "basis": "grooming mensual, perro, Lima Met.", "source": "CPI Market Report N°08 p.4 - https://cpi.pe/images/upload/paginaweb/archivo/26/mr_mascotas_201808.pdf"},
      {"year": 2025, "value": 425, "basis": "punto medio de S/350-500 por mascota al mes (industria, Lima)", "source": "Nestlé Purina/El Comercio vía Petfood LatAm - https://petfoodlatinoamerica.com/2025/05/02/mascotas-cuanto-gastan-los-peruanos-en-sus-cuidados-y-cuales-son-los-nuevos-servicios-creados-para-ellas/"}
    ],
    "spend_per_household_month_soles": [
      {"year": 2024, "value": 62.9, "basis": "hogares que gastan, Perú (ENAHO)", "source": "https://www.infobae.com/peru/2026/09/08/economia-peruana-golpea-a-perros-y-gatos-ahora-se-gasta-menos-en-mascotas/"},
      {"year": 2025, "value": 57.7, "basis": "hogares que gastan, Perú (ENAHO)", "source": "INEI Informe técnico Tenencia y crianza de mascotas 2025 - https://www.gob.pe/institucion/inei/informes-publicaciones/8570625-informe-tecnico-tenencia-y-crianza-de-mascotas-2025"},
      {"year": 2025, "value": 88.1, "basis": "hogares NSE A/B (ENAHO)", "source": "INEI Informe técnico Tenencia y crianza de mascotas 2025 - https://www.gob.pe/institucion/inei/informes-publicaciones/8570625-informe-tecnico-tenencia-y-crianza-de-mascotas-2025"}
    ],
    "notes": "Euromonitor Pet Care = alimento + productos; excluye servicios (ficha may-2026 https://www.euromonitor.com/pet-care-in-peru/report). Split 80/20 alimento/productos es supuesto del analista. Vet anclado en ENAHO 2025 (US$106M) y extendido a 8%/año (Gestión); HeyVet estima ~US$200M (AmericaRetail). Grooming/otros sin dato de mercado (null). Crec. 2021 calculado 32.1% vs 29.1% reportado por Euromonitor: diferencia entre ediciones. ENAHO y Euromonitor no son comparables en nivel. TC 2025 = 3.70 aprox."
  }
}
```

```json
{
  "personas": [
    {
      "id": "gatera_millennial_depa",
      "name": "Valeria",
      "age": 31,
      "district": "Miraflores / San Isidro",
      "nse": "B",
      "pet": "2 gatos adoptados, de interior",
      "share_pct": 25,
      "spend_monthly_soles": 220,
      "visits_per_year": 3,
      "values": ["manejo cat-friendly / especialista felino", "cita puntual sin espera", "explicación clara", "trato cariñoso"],
      "pains": ["espera con el gato estresado", "WhatsApp lento", "sala compartida con perros", "trato brusco"],
      "channels": ["Instagram", "Google Maps y reseñas", "WhatsApp", "grupos de adopción"],
      "extras": ["alimento premium y húmedo", "arena", "delivery de farmacia", "telemedicina"],
      "quotes": [
        {"text": "La doctora Hurtado trata con mucho cariño y cuidado a los michis", "rating": 5, "clinic": "Gattos Clinica Especializada en Medicina Felina Miraflores"},
        {"text": "Mi gatito entró por emergencia, muy buena la atención, fue inmediata", "rating": 5, "clinic": "Gattos Clinica Especializada en Medicina Felina - Benavides"}
      ],
      "evidence": "Gato en 13.4% de 1,161 reseñas (17% San Isidro, 15% Miraflores); 124 reseñas solo gato vs 310 solo perro; 10 fichas con foco felino; espera 14% de reseñas en Miraflores.",
      "sources": ["https://www.euromonitor.com/pet-care-in-peru/report", "https://www.kantar.com/latin-america/inspiracion/consumo-masivo/hogares-con-mascotas", "https://cpi.pe/images/upload/paginaweb/archivo/26/mr_mascotas_201808.pdf", "https://elcomercio.pe/respuestas/como/pet-lover-peru-quiero-adoptar-una-mascota-por-que-los-peruanos-estan-invirtiendo-mas-en-sus-mascotas-y-que-significa-para-tu-bolsillo-mercado-pet-care-noticia/"]
    },
    {
      "id": "familia_perro_grande",
      "name": "Familia Rodríguez",
      "age": 42,
      "district": "Santiago de Surco / La Molina",
      "nse": "A/B",
      "pet": "perro mediano o grande (labrador/golden), a veces 2",
      "share_pct": 47,
      "spend_monthly_soles": 450,
      "visits_per_year": 4,
      "values": ["todo en un lugar (consulta + baño + petshop)", "precio claro por talla", "estacionamiento y cercanía", "24h de respaldo"],
      "pains": ["recargo por perro grande", "grooming mal hecho", "cobros extra no avisados"],
      "channels": ["recomendación de vecinos/colegio", "Google Maps", "WhatsApp"],
      "extras": ["alimento premium por saco", "grooming mensual", "hospedaje", "plan de salud / membresía"],
      "quotes": [
        {"text": "Tratan súper bien a mi perrito, va ahí por baño y corte desde hace años", "rating": 5, "clinic": "Clínica Veterinaria Family Pets (Surco)"},
        {"text": "me llaman a decir que va a costad el doble porq es un perro grande", "rating": 2, "clinic": "Clínica Veterinaria Pet Center - Miraflores"}
      ],
      "evidence": "Perro en 30.3% de reseñas; grooming 12.4% (rating 3.39; tema 85 pos/59 neg); precio en 19% de reseñas de Surco; La Molina precio 24 pos/6 neg; CPI: 86.6% de hogares AB con mascota tienen perro y 49% de hogares limeños con perro usa grooming (S/53/mes).",
      "sources": ["https://cpi.pe/images/upload/paginaweb/archivo/26/mr_mascotas_201808.pdf", "https://petfoodlatinoamerica.com/2025/05/02/mascotas-cuanto-gastan-los-peruanos-en-sus-cuidados-y-cuales-son-los-nuevos-servicios-creados-para-ellas/", "https://andina.pe/agencia/noticia-perros-vs-gatos-mascota-demanda-un-mayor-gasto-a-los-peruanos-1024695.aspx"]
    },
    {
      "id": "adulta_mayor_perro_senior",
      "name": "Carmen",
      "age": 64,
      "district": "San Borja / San Isidro",
      "nse": "A",
      "pet": "perro pequeño de 12-15 años con condición crónica",
      "share_pct": 15,
      "spend_monthly_soles": 400,
      "visits_per_year": 8,
      "values": ["médico de confianza de años", "diagnóstico acertado", "paciencia para explicar", "especialistas e imágenes", "emergencia 24h cercana"],
      "pains": ["diagnóstico errado", "teléfono de emergencia no contesta", "cobros nocturnos", "mal manejo del final de vida"],
      "channels": ["recomendación boca a boca", "teléfono", "Google Maps (para buscar 24h)"],
      "extras": ["farmacia", "laboratorio y ecografía", "dieta de prescripción", "visita a domicilio", "cremación"],
      "quotes": [
        {"text": "atiende a Osita desde el mes y medio de nacida y ya tiene 12 años", "rating": 5, "clinic": "Veterinaria Engreidos (Surco)"},
        {"text": "chihuahua 13 años, lo mal diagnostico", "rating": 1, "clinic": "Veterinaria Fido's Vet (San Borja)"}
      ],
      "evidence": "Lealtad: 18 de 20 reseñas 'desde hace X años' son 5 estrellas; emergencias: 52% de 84 reseñas son 1 estrella; fallecimiento: rating 1.33; especialista 9% de reseñas en San Borja; senior 5% en San Isidro; 12.2% de reseñas se publican entre 22h y 6h.",
      "sources": ["https://elcomercio.pe/economia/dia-1/del-veterinario-de-barrio-a-las-clinicas-especializadas-asi-crece-el-mercado-de-salud-para-mascotas-en-el-peru-cadenas-veterinarias-noticia/", "https://www.gob.pe/institucion/inei/informes-publicaciones/8570625-informe-tecnico-tenencia-y-crianza-de-mascotas-2025", "https://apeim.com.pe/wp-content/uploads/2025/03/2023-2024-Version-WEB.pdf.pdf"]
    }
  ]
}
```
