# Perfil general del cliente de clínica veterinaria (Lima, NSE A/B, 5 distritos)

Fecha de corte: 24-sep-2026. Complementa `mercado_persona.md`, que tiene las 3 personas. Este documento describe al dueño **en conjunto**, no por persona.

Convenciones: **[R]** = cifra publicada por la fuente. **[E]** = estimado nuestro (reponderado, interpolado o construido con supuestos, y explicado en la fila). **[P]** = dato propio, calculado sobre `data/dashboard.json`.

Aviso de representatividad: casi ningún estudio público recorta a "NSE A/B de Miraflores, San Isidro, San Borja, Surco y La Molina". La fuente más cercana es la **encuesta de tesis de ESAN (2021)**: n = 384 personas de NSE A/B de 21 a 59 años en las zonas APEIM 6, 7 y 8. La zona 7 son exactamente nuestros 5 distritos y aporta el 37% de la muestra. Todo lo demás es Lima Metropolitana o Perú, y se ajusta como [E].

---

## 1. Edad y quién decide

### 1.1 Datos de fuente

| Fuente | Ámbito / muestra | Tramos publicados | Tipo |
|---|---|---|---|
| ESAN 2021, tesis "Plan de negocio para atención de mascotas a domicilio" (Tabla 4.15, casos por edad) | NSE A/B, zonas 6-7-8 de Lima, 21 a 59 años, n = 384 | 21–25: 33 · 26–30: 67 · 31–35: 101 · 36–40: 68 · 41–45: 52 · 46–50: 23 · 51–55: 26 · 55+: 14 | R |
| CCR Cuore, "Tenencia de mascotas en el Perú" (nov-dic 2021) | Perú (58% Lima), mayores de 18, n = 365 | 16–24: 8% · 25–40: 44% · 41–56: 26% · 57–77: 22% | R |
| Clientes Anónimos (ene-2026, vía Gestión) | Lima, 18 a 65 años, n = 403 | La mayor parte de las mascotas está en hogares de 25 a 44 años (sin %) | R (cualitativo) |
| Arellano, vía Petfood LatAm | Perú urbano | Dueño típico de 25 a 45 años | R (cualitativo) |

### 1.2 Distribución para graficar [E]

Método: se pasa cada fuente a los tramos pedidos repartiendo cada tramo original en proporción a los años que cubre. Después se promedia ESAN y CCR al 50/50. ESAN representa bien el NSE A/B, pero corta a los 59 años. CCR sí incluye a mayores de 57.

| Tramo | ESAN reponderado | CCR reponderado | **Mix final [E]** |
|---|---|---|---|
| 18–24 | 6.9% | 8.0% | **7%** |
| 25–34 | 40.2% | 27.5% | **34%** |
| 35–44 | 33.8% | 23.0% | **28%** |
| 45–54 | 14.1% | 16.3% | **16%** |
| 55+ | 5.0% | 25.3% | **15%** |

### 1.3 Quién decide o paga

No encontramos ningún estudio peruano que mida quién decide la compra de servicios para la mascota. Hay dos aproximaciones:

| Indicador | Mujer | Hombre | Fuente | Tipo |
|---|---|---|---|---|
| Sexo de quien responde, dueños NSE A/B | 58.3% | 41.7% | ESAN 2021, p. 35 | R |
| Sexo de quien responde, Perú | 49% | 50% | CCR Cuore 2021, p. 4 | R |
| Dueños con 3 o más mascotas | 15% de las mujeres | 9% de los hombres | ESAN 2021, Tabla 4.13 | R |
| **Proxy de decisor** | **58%** | **42%** | Se usa el dato de ESAN (A/B) | **E** |

Contexto cualitativo: en las entrevistas de ESAN, la familia comparte el gasto. La afirmación "Necesito compartir los gastos con otros miembros de mi familia" obtuvo 2.89 sobre 5. Kantar detecta que la tenencia crece en hogares sin hijos, en hogares con niños menores de 5 años y en hogares con ama de casa mayor de 55 años.

---

## 2. Gasto mensual

### 2.1 Promedios publicados

| Indicador | Valor | Ámbito | Fuente | Tipo |
|---|---|---|---|---|
| Gasto promedio mensual en mascotas | **S/ 314** | Lima, 2026 | GRM y VPG, vía El Comercio | R |
| Rango de gasto mensual | **74%** gasta entre S/ 100 y 400 | Lima, ene-2026, n = 403 | Clientes Anónimos, vía Gestión | R |
| Aumentó su gasto en el último año | 53% (y 45% lo mantuvo) | Lima 2026 | Clientes Anónimos | R |
| Gasto de hogares A/B | S/ 88.1 (veterinaria S/ 34.5) | Perú, ENAHO 2025, todos los hogares A/B que gastan | INEI, vía Infobae | R |
| Gasto de la última visita veterinaria | 0–50: 16% · 51–100: 36% · 101–150: 26% · 151–200: 13% · >200: 10% | NSE A/B, zonas 6-7-8 | ESAN 2021, Tabla 4.15 | R |
| Gasto por mascota según la industria | S/ 350–500 | Lima 2025 | Arellano, vía Petfood LatAm | R |

La ENAHO promedia todos los hogares, incluidos los que dan comida casera, y queda muy por debajo de las cifras de la industria. Para el cliente de clínica A/B usamos como referencia GRM (S/ 314) y Arellano.

### 2.2 Tramos de gasto, dueño A/B de los 5 distritos [E]

Construcción: se parte del 74% en S/ 100–400 de Lima (Clientes Anónimos). La curva se desplaza hacia arriba por el NSE A/B, que en la ENAHO gasta 1.5 veces el promedio nacional. Se calibra para que la media quede cerca de S/ 350, entre GRM (S/ 314) y el punto medio de Arellano (S/ 425).

| Tramo | % de dueños [E] |
|---|---|
| < S/ 100 | 8% |
| S/ 100–200 | 24% |
| S/ 200–400 | 38% |
| S/ 400–700 | 20% |
| > S/ 700 | 10% |

Resultado: el 62% gasta entre S/ 100 y 400, frente al 74% de Lima en general. La media implícita es de unos S/ 355.

### 2.3 En qué se va el gasto

| Rubro | Lima general [R] (Clientes Anónimos 2026) | Perú [R] (ENAHO 2025) | **A/B 5 distritos [E]** | Cómo se construyó el [E] |
|---|---|---|---|---|
| Alimento | 85% | 89% | **55%** | Balanceado premium, ~S/ 180 al mes |
| Veterinaria y medicinas | 12% | 11% | **22%** | ~S/ 70 al mes. En Lima Centro la veterinaria ya es el 25% del gasto (Clientes Anónimos) |
| Grooming | incluido en el 3% de servicios y accesorios | – | **12%** | CPI 2018: el 49% de los hogares limeños con perro paga S/ 53 al mes |
| Accesorios y juguetes | incluido en el 3% | – | **6%** | ~S/ 20 al mes |
| Otros (paseo, hotel, seguro) | – | – | **5%** | ~S/ 15 al mes |

Penetración por rubro (GRM 2026, Lima, % de dueños que gasta en cada uno) [R]: alimento 93%, salud o veterinaria 63%, grooming 42%, accesorios 17%, paseador 4%.

---

## 3. La mascota

| Indicador | Valor | Ámbito | Fuente | Tipo |
|---|---|---|---|---|
| Hogares con mascota que tienen perro | 86.6% | Lima A/B, 2018 | CPI Market Report N°08 | R |
| Hogares con mascota que tienen gato | 23.9% | Lima A/B, 2018 | CPI 2018 | R |
| Mascota preferida del hogar | perro 65%, gato 25%, aves 4%, conejo 2%, tortuga 1%, otros 2% | NSE A/B, 2021 | ESAN 2021, Fig. 4.2 | R |
| Perro y gato (mención múltiple) | perro 88%, gato 38% | Perú 2023 | Ipsos "Entre patas" | R |
| Composición del parque de mascotas | perro 56.5%, gato 36.2% | Perú, ENAHO 2025 | INEI, vía Infobae | R |
| Crecimiento de la tenencia | gatos +59%, perros +30% | Perú | Kantar | R |
| Mascotas por hogar | 1: 60% · 2: 27% · 3 o más: 13%, **media ≈ 1.6** | NSE A/B | ESAN 2021, Tabla 4.13 | R (media E) |
| Perros por hogar | 1.5 en hogares de mayor ingreso, 1.8 en el promedio nacional | Perú, ENAHO 2025 | INEI, vía Swissinfo | R |
| La considera "parte de la familia" | **87%** | Lima 2026 | GRM y VPG, vía El Comercio | R |
| La considera "su hijo" | 56% | Lima 2026 | GRM y VPG | R |
| La ve como familia (Arellano) | 73% | Perú | Arellano, vía Petfood LatAm | R |
| Alguna vez contrató seguro para la mascota | 1% en Perú, 2% en Lima | 2021 | CCR Cuore, p. 8 | R |
| **Con seguro o plan de salud, A/B 2026** | **3%** | 5 distritos | Base CCR 2021 ajustada por la llegada de Pacífico PET, Rímac y Mapfre y por el perfil A/B. BanBif proyectaba 1,000 pólizas en 2024 | **E** |
| Reseñas que mencionan perro / gato | 29.3% / 13.4% | 1,161 reseñas | `dashboard.json` | P |

**Tipo de mascota, categorías excluyentes, A/B [E]**: solo perro **68%**, solo gato **14%**, perro y gato **13%**, otros **5%**. Con esto, el total con perro es 81% (CPI A/B: 86.6%; CCR Lima: 79%) y el total con gato es 27% (CPI: 23.9%, con tendencia al alza según Kantar). En CCR Lima, el 68% de quienes tienen perro no tiene otra mascota. En nuestras reseñas con especie identificable, el reparto es solo perro 67%, solo gato 27% y ambos 7% [P].

---

## 4. Qué valoran y de qué se quejan

### 4.1 Qué valoran al elegir veterinaria

| Atributo | Evidencia [R] | Fuente |
|---|---|---|
| Médico confiable | 9.69 sobre 10 (el atributo mejor puntuado) | Arellano, vía El Comercio |
| Trato cálido | 8.96 sobre 10 | Arellano |
| Calidad médica | 8.86 sobre 10 | Arellano |
| Disponibilidad para emergencias | 8.46 sobre 10 | Arellano |
| Personal calificado / limpieza / puntualidad / amabilidad / recomendación de amigos | 32% / 18% / 17% / 17% / 15% (atributos que dan confianza, servicio a domicilio) | ESAN 2021, Fig. 4.6 |
| "Quiero que me reconozcan como cliente frecuente" | 4.32 sobre 5 | ESAN 2021, Tabla 4.17 |
| "Cambiaría de veterinaria por una más económica" | 3.05 sobre 5 (el precio pesa, pero no es decisivo) | ESAN 2021 |
| "Prefiero una veterinaria cerca aunque no conozca el servicio" | 2.65 sobre 5 (la cercanía sola no basta) | ESAN 2021 |
| "Tomaría una promoción aunque no traten bien a mi mascota" | 1.74 sobre 5 | ESAN 2021 |
| "Mi veterinaria está preparada para emergencias 24 h" | 3.38 sobre 5 (hay una brecha percibida) | ESAN 2021 |

**Ranking para graficar [E]**: participación estimada como primer criterio de elección. Se sintetizó a partir de los puntajes de Arellano, las escalas de ESAN y el volumen de menciones en nuestras reseñas (trato: 663 menciones de tema; recomendación: 413).

| Atributo | % [E] |
|---|---|
| Confianza en el médico | 28 |
| Trato y amabilidad | 17 |
| Precio | 13 |
| Cercanía | 11 |
| Horario / 24 h | 10 |
| Recomendación | 9 |
| Instalaciones y limpieza | 7 |
| Especialidades | 5 |

### 4.2 Quejas en nuestras reseñas [P]

Base: `global.themes` de `data/dashboard.json`, que clasifica menciones positivas y negativas por tema en 1,161 reseñas de Google de 264 fichas. La columna de % negativas es neg / (pos + neg).

| Tema | Pos | Neg | Menciones | **% negativas** |
|---|---|---|---|---|
| Espera / demora | 37 | 57 | 94 | **60.6%** |
| Emergencias 24h | 40 | 53 | 93 | **57.0%** |
| Diagnóstico / negligencia | 51 | 42 | 93 | 45.2% |
| Grooming / baño | 84 | 58 | 142 | 40.8% |
| Cirugía / hospitalización | 49 | 30 | 79 | 38.0% |
| Limpieza / instalaciones | 83 | 42 | 125 | 33.6% |
| Estacionamiento / acceso | 8 | 4 | 12 | 33.3% (muestra baja) |
| Precio | 94 | 43 | 137 | 31.4% |
| Trato / atención | 531 | 132 | 663 | 19.9% |
| Recomendación | 354 | 59 | 413 | 14.3% |

**Frecuencia de palabras clave** (regex sobre el texto de las 1,161 reseñas; una reseña puede caer en varias categorías) [P]:

| Palabra clave | Reseñas | % | Rating medio | % de 1–2★ |
|---|---|---|---|---|
| Perro (perro, perrito, cachorro, can) | 340 | 29.3% | 3.55 | 35% |
| Gato (gato, gatito, michi, felino) | 155 | 13.4% | 3.59 | 34% |
| Precio (precio, costo, cobro, caro, soles) | 206 | 17.7% | 3.35 | 39% |
| Emergencia (emergencia, urgencia, 24 h, madrugada) | 84 | 7.2% | **2.71** | **55%** |
| Espera (espera, demora, tarda) | 87 | 7.5% | **2.53** | **60%** |
| Diagnóstico / negligencia | 84 | 7.2% | 3.63 | 32% |
| Grooming (baño, corte) | 142 | 12.2% | 3.39 | 39% |
| Trato / amabilidad / cariño | 305 | 26.3% | 4.34 | 15% |
| Recomienda | 157 | 13.5% | 4.50 | 12% |
| WhatsApp | 23 | 2.0% | 2.61 | 61% |
| Total de reseñas | 1,161 | – | – | 24.5% |

Lectura: el precio aparece mucho, pero solo el 31% de sus menciones es negativo. **Espera y emergencias son las quejas más intensas**: más de la mitad de sus menciones son negativas y sus ratings están por debajo de 2.8. Encaja con el 3.38 sobre 5 de ESAN ("mi veterinaria está preparada para emergencias"). Nota: las regex de este documento difieren un poco de las de `mercado_persona.md` (perro 340 frente a 352), porque no incluyen algunas variantes.

Quejas cualitativas externas (ESAN 2021): precios entre medio y alto, sobre todo en las cadenas; horario que choca con el horario laboral; citas perdidas porque nadie responde el WhatsApp o el teléfono; miedo a dejar a la mascota sola en la clínica.

---

## 5. Canales y visitas

### 5.1 Cómo encuentran veterinaria

No existe un % publicado para Lima. La evidencia disponible:
- Los dueños de veterinarias entrevistados dicen que "la mayoría de los clientes llega por recomendación boca a boca" (ESAN 2021) [R, cualitativo].
- Arellano: la confianza y la recomendación pesan más que la publicidad [R, cualitativo].
- Medio preferido para recibir publicidad veterinaria: redes sociales 63.5%, e-mail 16.3%, eventos 9.9%, anuncios web 9.9%, WhatsApp 0.5% (ESAN 2021, Fig. 4.7) [R].
- Nuestras reseñas son de Google Maps, que funciona como canal de validación. Menos del 1% menciona Instagram o Facebook [P].

| Canal de descubrimiento | % [E] |
|---|---|
| Recomendación (familia, amigos, vecinos) | 40 |
| Google Maps / búsqueda | 27 |
| Instagram / Facebook | 15 |
| Cercanía (vio el local) | 13 |
| Otros (apps, grupos de WhatsApp) | 5 |

**Canal de contacto y reserva** [R] (ESAN 2021, Tabla 4.16, NSE A/B): WhatsApp **63.8%**, llamada 25.0%, redes sociales 6.3%, app 4.2%, otros 0.7%. Entre los mayores de 51 años, llamada y WhatsApp están empatados.

### 5.2 Frecuencia y motivo de visita

| Indicador | Valor | Fuente | Tipo |
|---|---|---|---|
| Visitas a la veterinaria en los últimos 3 meses | 1: 38% · 2–3: 40% · 4 o más: 14% · ninguna: 8% (media ≈ 2 por trimestre, incluye baño) | ESAN 2021, Tabla 4.14 | R |
| Hogares limeños con perro que van al vet al menos 1 vez al año | 91% (gato: 58.7%) | CPI 2018 | R |
| Hogares con perro que van a control al menos 1 vez al año (Perú) | 76% | CPI 2018, vía Perú Retail | R |
| Hogares con todas sus mascotas vacunadas contra la rabia en los últimos 12 meses | 74.8% | ENAHO 2025, vía Swissinfo | R |
| Servicios más solicitados | baño y peluquería 26%, vacunas 23%, alimentos 17%, consulta 12%, accesorios 8%, delivery 4%, emergencia 4%, domicilio 3% | ESAN 2021, Fig. 4.3 | R |
| **Visitas clínicas al año (sin grooming)** | **4** | ESAN implica unas 8 al año si se incluye el baño. Descontando ~40% de grooming quedan ~4–5 | **E** |

**Motivo de visita [E]** (servicios de ESAN que implican ir a la clínica, re-normalizados a 100): Baño/grooming 40%, Vacunas 35%, Control/consulta 19%, Emergencia 6%.

---

## 6. Resumen del perfil

Dueño o dueña de 25 a 44 años (62%), con una ligera mayoría femenina (58% [E]). Tiene 1.6 mascotas, sobre todo perro (81% tiene perro), aunque el gato es lo que más crece. El 87% la trata como familia y el 56% como hijo. Gasta entre S/ 300 y 350 al mes, del que solo alrededor de un quinto va a la veterinaria. Elige por la confianza en el médico y el trato, más que por precio o cercanía. Llega por recomendación, valida en Google Maps y agenda por WhatsApp. Casi nadie tiene seguro (alrededor del 3%). Donde más se queja es en la espera y la atención de emergencias.

---

```json client_profile
{
  "age_bands": [
    {"label": "18–24", "pct": 7},
    {"label": "25–34", "pct": 34},
    {"label": "35–44", "pct": 28},
    {"label": "45–54", "pct": 16},
    {"label": "55+", "pct": 15}
  ],
  "gender_decider": {"female_pct": 58, "male_pct": 42},
  "spend_bands": [
    {"label": "< S/ 100", "pct": 8},
    {"label": "S/ 100–200", "pct": 24},
    {"label": "S/ 200–400", "pct": 38},
    {"label": "S/ 400–700", "pct": 20},
    {"label": "> S/ 700", "pct": 10}
  ],
  "spend_mix": [
    {"label": "Alimento", "pct": 55},
    {"label": "Veterinaria", "pct": 22},
    {"label": "Grooming", "pct": 12},
    {"label": "Accesorios / juguetes", "pct": 6},
    {"label": "Otros", "pct": 5}
  ],
  "pet_type": [
    {"label": "Perro", "pct": 68},
    {"label": "Gato", "pct": 14},
    {"label": "Ambos", "pct": 13},
    {"label": "Otros", "pct": 5}
  ],
  "pets_per_household": 1.6,
  "family_member_pct": 87,
  "insured_pct": 3,
  "values": [
    {"label": "Confianza en el médico", "pct": 28},
    {"label": "Trato / amabilidad", "pct": 17},
    {"label": "Precio", "pct": 13},
    {"label": "Cercanía", "pct": 11},
    {"label": "Horario / 24h", "pct": 10},
    {"label": "Recomendación", "pct": 9},
    {"label": "Instalaciones / limpieza", "pct": 7},
    {"label": "Especialidades", "pct": 5}
  ],
  "complaints": [
    {"label": "Espera / demora", "neg_pct": 60.6, "mentions": 94, "source": "reseñas"},
    {"label": "Emergencias 24h", "neg_pct": 57.0, "mentions": 93, "source": "reseñas"},
    {"label": "Diagnóstico / negligencia", "neg_pct": 45.2, "mentions": 93, "source": "reseñas"},
    {"label": "Grooming / baño", "neg_pct": 40.8, "mentions": 142, "source": "reseñas"},
    {"label": "Cirugía / hospitalización", "neg_pct": 38.0, "mentions": 79, "source": "reseñas"},
    {"label": "Limpieza / instalaciones", "neg_pct": 33.6, "mentions": 125, "source": "reseñas"},
    {"label": "Estacionamiento / acceso", "neg_pct": 33.3, "mentions": 12, "source": "reseñas"},
    {"label": "Precio", "neg_pct": 31.4, "mentions": 137, "source": "reseñas"},
    {"label": "Trato / atención", "neg_pct": 19.9, "mentions": 663, "source": "reseñas"},
    {"label": "Recomendación", "neg_pct": 14.3, "mentions": 413, "source": "reseñas"}
  ],
  "channels": [
    {"label": "Recomendación", "pct": 40},
    {"label": "Google Maps", "pct": 27},
    {"label": "Instagram / Facebook", "pct": 15},
    {"label": "Cercanía (vio el local)", "pct": 13},
    {"label": "Otros (apps, grupos WhatsApp)", "pct": 5}
  ],
  "visits_per_year": 4,
  "visit_reasons": [
    {"label": "Baño / grooming", "pct": 40},
    {"label": "Vacunas", "pct": 35},
    {"label": "Control / consulta", "pct": 19},
    {"label": "Emergencia", "pct": 6}
  ],
  "avg_spend_monthly_soles": 314,
  "sources": [
    {"id": "esan2021", "title": "Plan de negocio para atención de mascotas a domicilio en Lima Metropolitana (tesis ESAN; encuesta NSE A/B zonas 6-7-8, n=384)", "url": "https://repositorio.esan.edu.pe/server/api/core/bitstreams/962e92f8-74b0-497a-bc23-151e09b0d471/content", "year": 2021},
    {"id": "ccr2021", "title": "CCR Cuore - Tenencia de mascotas en el Perú (n=365)", "url": "https://www.ccrlatam.com.pe/themes/ccr_cuore/pdf/tenencia-de-mascotas-en-el-peru.pdf", "year": 2021},
    {"id": "grm2026", "title": "GRM y VPG - Limeños destinan en promedio S/314 mensuales en sus mascotas (El Comercio)", "url": "https://elcomercio.pe/economia/limenos-destinan-en-promedio-s314-mensuales-en-sus-mascotas-seguros-de-salud-alimentos-y-asi-evoluciona-este-mercado-hoy-en-dia-noticia/", "year": 2026},
    {"id": "clientesanonimos2026", "title": "Clientes Anónimos - Gasto en mascotas en Lima crece (Gestión; n=403)", "url": "https://gestion.pe/economia/empresas/gasto-en-mascotas-en-lima-crece-mas-del-50-aumento-su-presupuesto-anual-noticia/", "year": 2026},
    {"id": "enaho2025_nse", "title": "INEI ENAHO 2025 - Gasto en mascotas según NSE (Infobae)", "url": "https://www.infobae.com/peru/2026/09/09/cuanto-gastan-los-peruanos-en-sus-mascotas-al-mes-inei-revela-las-cifras-segun-nivel-socioeconomico/", "year": 2026},
    {"id": "enaho2025_tenencia", "title": "INEI ENAHO 2025 - 6 de cada 10 hogares convive con animales (Infobae)", "url": "https://www.infobae.com/peru/2026/09/08/mas-mascotas-nuevos-compromisos-6-de-cada-10-hogares-en-peru-convive-con-animales-y-destina-52-de-su-presupuesto-a-cuidarlos/", "year": 2026},
    {"id": "enaho2025_swissinfo", "title": "Más del 50% de los hogares peruanos tiene al menos un perro y la mayoría están vacunados (Swissinfo/EFE)", "url": "https://www.swissinfo.ch/spa/m%C3%A1s-del-50-%25-de-los-hogares-peruanos-tiene-al-menos-un-perro-y-la-mayor%C3%ADa-est%C3%A1n-vacunados/89575391", "year": 2026},
    {"id": "cpi2018", "title": "CPI Market Report N°08 - Mascotas", "url": "https://cpi.pe/images/upload/paginaweb/archivo/26/mr_mascotas_201808.pdf", "year": 2018},
    {"id": "arellano_vet", "title": "Del veterinario de barrio a las clínicas especializadas (Arellano vía El Comercio)", "url": "https://elcomercio.pe/economia/dia-1/del-veterinario-de-barrio-a-las-clinicas-especializadas-asi-crece-el-mercado-de-salud-para-mascotas-en-el-peru-cadenas-veterinarias-noticia/", "year": null},
    {"id": "arellano_petfood", "title": "Mascotas: cuánto gastan los peruanos (Petfood Latinoamérica)", "url": "https://petfoodlatinoamerica.com/2025/05/02/mascotas-cuanto-gastan-los-peruanos-en-sus-cuidados-y-cuales-son-los-nuevos-servicios-creados-para-ellas/", "year": 2025},
    {"id": "ipsos2023", "title": "Ipsos Perú - Entre patas", "url": "https://www.ipsos.com/es-pe/entre-patas", "year": 2023},
    {"id": "ipsos2024", "title": "Ipsos Perú - Cuando el cliente ladra", "url": "https://www.ipsos.com/es-pe/cuando-el-cliente-ladra-marcas-exitosas-en-el-creciente-mercado-de-mascotas", "year": 2024},
    {"id": "kantar", "title": "Kantar - Casi la mitad de hogares peruanos tienen una mascota", "url": "https://www.kantar.com/latin-america/inspiracion/consumo-masivo/hogares-con-mascotas", "year": null},
    {"id": "peruretail_cpi", "title": "Día del perro: hogares peruanos gastan hasta S/300 mensuales (Perú Retail)", "url": "https://www.peru-retail.com/dia-del-perro-hogares-peruanos-gastan-hasta-s-300-mensuales-en-sus-mascotas/", "year": null},
    {"id": "resenas", "title": "Reseñas Google de 264 fichas (1,161 reseñas) - data/dashboard.json", "url": "data/dashboard.json", "year": 2026}
  ],
  "estimated_fields": ["age_bands", "gender_decider", "spend_bands", "spend_mix", "pet_type", "pets_per_household", "insured_pct", "values", "channels", "visits_per_year", "visit_reasons"],
  "notes": "Segmento objetivo NSE A/B de Miraflores, San Isidro, San Borja, Surco y La Molina; no hay estudio público con ese recorte exacto. Fuente más cercana: encuesta ESAN 2021 (NSE A/B, zonas APEIM 6-7-8, zona 7 = los 5 distritos). age_bands = ESAN y CCR 2021 reponderados a tramos de 10 años y promediados 50/50. gender_decider = sexo de quien responde en ESAN, usado como proxy: no hay dato publicado de quién decide o paga. spend_bands = curva construida desde el 74% en S/100-400 de Clientes Anónimos 2026, desplazada por NSE A/B (media implícita ~S/355). avg_spend_monthly_soles = GRM/VPG 2026 Lima [R]. spend_mix = supuesto A/B (Lima general reportada: 85% alimento, 12% vet, 3% servicios y accesorios). pet_type excluyente, calibrado con CPI A/B (86.6% perro, 23.9% gato) y CCR Lima. pets_per_household = media de la distribución ESAN 60/27/13. family_member_pct = GRM 2026 Lima [R]. insured_pct = CCR 2021 (2% Lima alguna vez) ajustado. values y channels = síntesis de escalas Arellano/ESAN y reseñas propias; no son % publicados. visits_per_year = visitas clínicas sin grooming (ESAN implica ~8 al año con baño). visit_reasons = servicios ESAN re-normalizados. complaints = global.themes de dashboard.json, neg_pct = neg/(pos+neg). Canal de reserva [R, ESAN]: WhatsApp 63.8%, llamada 25%, redes 6.3%, app 4.2%."
}
```
