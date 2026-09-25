# Perfil general del cliente de clínica veterinaria (Lima, NSE A/B, 5 distritos)

Fecha de corte: 25-sep-2026 (revisado con el informe técnico del INEI "Tenencia y crianza de mascotas, 2025"; ver `perfil_cliente_fuentes2025.md`). Complementa `mercado_persona.md`, que tiene las 3 personas. Este documento describe al dueño **en conjunto**, no por persona.

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
| Nestlé Purina, vía Petfood LatAm (may-2025) | Perú urbano | Dueño típico de 25 a 45 años. (Antes se atribuía a Arellano por error) | R (cualitativo) |
| INEI, Tenencia y crianza de mascotas 2025 | Perú | **No publica edad ni sexo del jefe de hogar o del dueño** | – |
| **Tesis ULima 2025, "Paws & Fur"** (plan de negocio, tienda premium con servicio veterinario en Surco) | NSE A/B de los 5 distritos, n = 201 | 25–35: 31% · 36–45: 29% · 46–55: 29% · 56–65: 8% (el ~3% restante se asume 18–24) | R |

### 1.2 Distribución para graficar [E]

Método (revisado sep-2026): se pasa cada fuente a los tramos pedidos repartiendo cada tramo original en proporción a los años que cubre. Después se promedia ULima 2025 (peso 65%: es la más nueva y recorta exactamente NSE A/B de los 5 distritos) con ESAN 2021 (peso 35%: A/B zonas 6-7-8). CCR 2021 (Perú, todos los NSE) sale de la mezcla y queda solo como referencia. Ojo: ULima corta a los 65 años y ESAN a los 59, así que 55+ puede estar subestimado.

| Tramo | ESAN 2021 reponderado | ULima 2025 reponderado | CCR 2021 (referencia) | **Mix final [E]** | Versión anterior |
|---|---|---|---|---|---|
| 18–24 | 6.9% | 3.0% | 8.0% | **4%** | 7% |
| 25–34 | 40.2% | 28.2% | 27.5% | **32%** | 34% |
| 35–44 | 33.8% | 28.9% | 23.0% | **31%** | 28% |
| 45–54 | 14.1% | 29.0% | 16.3% | **24%** | 16% |
| 55+ | 5.0% | 10.9% | 25.3% | **9%** | 15% |

### 1.3 Quién decide o paga

Dos tesis de la Universidad de Lima encuestan a dueños A/B de la zona; ninguna mide al decisor con una pregunta explícita, pero ambas filtran a quien lleva a la mascota o decide la compra:

| Indicador | Mujer | Hombre | Fuente | Tipo |
|---|---|---|---|---|
| Decisores de compra, NSE A/B de los 5 distritos (n = 201) | 59% | 41% | Tesis ULima 2025 "Paws & Fur" | R |
| Clientes de veterinarias, zonas 7 y 8 (n = 384) | 73% | 27% | Tesis ULima 2024 (Carpio y Pizan) | R |
| Sexo de quien responde, dueños NSE A/B | 58.3% | 41.7% | ESAN 2021, p. 35 | R |
| Sexo de quien responde, Perú | 49% | 50% | CCR Cuore 2021, p. 4 | R |
| Dueños con 3 o más mascotas | 15% de las mujeres | 9% de los hombres | ESAN 2021, Tabla 4.13 | R |
| **Decisor, valor del perfil** | **63%** | **37%** | 70% ULima 2025 + 30% ULima 2024 (más peso a la más nueva y centrada en el decisor A/B). Antes: 58/42 de ESAN | R (ponderación nuestra) |

Contexto cualitativo: en las entrevistas de ESAN, la familia comparte el gasto. La afirmación "Necesito compartir los gastos con otros miembros de mi familia" obtuvo 2.89 sobre 5. Kantar detecta que la tenencia crece en hogares sin hijos, en hogares con niños menores de 5 años y en hogares con ama de casa mayor de 55 años.

---

## 2. Gasto mensual

### 2.1 Promedios publicados

| Indicador | Valor | Ámbito | Fuente | Tipo |
|---|---|---|---|---|
| Gasto promedio mensual en mascotas | **S/ 314** | Lima, 2026 | GRM y VPG, vía El Comercio | R |
| Rango de gasto mensual | **74%** gasta entre S/ 100 y 400 | Lima, ene-2026, n = 403 | Clientes Anónimos, vía Gestión | R |
| Aumentó su gasto en el último año | 53% (y 45% lo mantuvo) | Lima 2026 | Clientes Anónimos | R |
| Gasto de hogares A/B | "más de S/ 350 al mes" | Lima/Callao y provincias, mar-abr 2025, n = 400 | GRM/VPG 2025, vía [Gestión, 19-jun-2025](https://gestion.pe/economia/empresas/superpet-veterinarias-o-supermercados-donde-compran-y-cuanto-gastan-los-duenos-de-mascotas-noticia/) | R |
| Tramos de gasto mensual | **43%** gasta S/ 100–200 y **7%** más de S/ 400 (se deduce ~19% bajo S/ 100 y ~31% en S/ 200–400) | Lima, ene-2026, n = 403 | Clientes Anónimos (reporte ampliado, vía América TV y blog propio) | R |
| Gasto de hogares A/B | S/ 88.1 al mes (2024: S/ 102.3, **-13.9%**). Veterinaria S/ 34.5 (2024: S/ 44.3, **-22%**) | Perú, ENAHO 2025, estrato A/B, promedio entre los hogares que gastan | INEI, informe técnico 2025, anexo | R |
| Gasto de hogares Lima + Callao | S/ 62.9 al mes | ENAHO 2025 | INEI, informe técnico 2025 | R |
| Gasto de la última visita veterinaria | 0–50: 16% · 51–100: 36% · 101–150: 26% · 151–200: 13% · >200: 10% | NSE A/B, zonas 6-7-8 | ESAN 2021, Tabla 4.15 | R |
| Gasto por mascota según la industria | S/ 350–500 | Lima 2025 | **Nestlé Purina**, vía Petfood LatAm (antes atribuido a Arellano por error) | R |

La ENAHO mide el gasto del hogar con períodos de recordación de 15 días (alimento) y 12 meses (veterinaria), promedia solo entre los hogares que gastan en cada rubro y el propio INEI advierte que queda por debajo de las encuestas de la industria. Para el nivel del cliente de clínica A/B usamos GRM (S/ 314) y Nestlé Purina. Del INEI tomamos la **dirección**: el gasto real del A/B cayó 13.9% entre 2024 y 2025, y el veterinario 22% (campo `spend_trend`).

### 2.2 Tramos de gasto, dueño A/B de los 5 distritos [E]

Construcción (revisada sep-2026): se parte de la curva de Lima de Clientes Anónimos (ene-2026, n = 403): ~19% bajo S/ 100, **43% en S/ 100–200**, ~31% en S/ 200–400 y **7% sobre S/ 400**. Con puntos medios de S/ 70 / 150 / 300 / 700, esa curva da una media de ~S/ 220. En la ENAHO 2025 el estrato A/B gasta 1.4 veces lo que gasta Lima + Callao (S/ 88.1 frente a S/ 62.9), y 1.4 × 220 ≈ S/ 308, que calza con los S/ 314 de GRM. La curva se desplaza hacia arriba hasta que la media queda en ~S/ 314 y el tramo sobre S/ 400 queda en 18% (2.5 veces el 7% de Lima; la versión anterior tenía 30%, 4 veces Lima, y no se podía justificar).

| Tramo | Lima general [R] | % de dueños A/B [E] | Punto medio usado |
|---|---|---|---|
| < S/ 100 | ~19% | 7% | S/ 70 |
| S/ 100–200 | 43% | 28% | S/ 150 |
| S/ 200–400 | ~31% | 47% | S/ 300 |
| S/ 400–700 | 7% (todo > S/ 400) | 12% | S/ 550 |
| > S/ 700 | | 6% | S/ 1,000 |

Resultado: el 75% gasta entre S/ 100 y 400 (Lima: 74%) y el 18% más de S/ 400 (Lima: 7%). La media implícita es de ~S/ 314 (0.07×70 + 0.28×150 + 0.47×300 + 0.12×550 + 0.06×1,000). Si el tramo superior se valora en S/ 1,500, la media sube a ~S/ 344: el rango razonable es **S/ 314–345**.

### 2.3 En qué se va el gasto

| Rubro | Lima general [R] (Clientes Anónimos 2026) | Perú / Lima + Callao [R] (INEI 2025) | **Estrato A/B [R] (INEI 2025)** | **A/B 5 distritos, cliente de clínica [E]** | Soles al mes sobre S/ 314 |
|---|---|---|---|---|---|
| Alimento | 85% | 89% / 87% | **79%** | **62%** | ~S/ 195 |
| Veterinaria y medicinas | 12% | 11% / 13% (incluye baño y corte) | **21%** (incluye baño y corte) | **20%** | ~S/ 63 |
| Grooming | incluido en el 3% de servicios y accesorios | dentro de veterinaria | dentro de veterinaria | **9%** | ~S/ 28 |
| Accesorios y juguetes | incluido en el 3% | ~0% ("otros") | ~0% | **5%** | ~S/ 16 |
| Otros (paseo, hotel, seguro) | – | – | – | **4%** | ~S/ 13 |

Penetración por rubro (GRM 2026, Lima, % de dueños que gasta en cada uno) [R]: alimento 93%, salud o veterinaria 63%, grooming 42%, accesorios 17%, paseador 4%.

Cómo se construyó el [E] (revisado sep-2026; la versión anterior era 55 / 22 / 12 / 6 / 5):
1. **Ancla oficial**: en el estrato A/B el INEI reparte el gasto total en 79% alimento y 21% veterinaria (el rubro veterinario de la ENAHO incluye baño y corte, pregunta 611-04). "Otros" sale en ~0% porque la ENAHO casi no capta accesorios ni servicios como paseo u hotel.
2. **Rubros que la ENAHO no ve**: con la penetración de GRM (accesorios 17%, paseador 4%, más seguro y hotel) se asigna ~9 puntos a accesorios (5) y otros (4), que salen del alimento.
3. **Cliente de clínica**: nuestro cliente, por definición, sí va al veterinario. En el A/B solo el 26.7% de los hogares declara gasto veterinario en 12 meses, así que el 21% del INEI está diluido por los que no van. Se trasladan ~8 puntos más del alimento a veterinaria + grooming, que suman 29% (20 + 9). El reparto entre ambos sigue la penetración de GRM (salud 63% frente a grooming 42%) y el menor ticket del grooming.
4. Control: S/ 63 al mes de veterinaria son ~S/ 750 al año, unas 4–5 visitas de S/ 150–180, en línea con `visits_per_year` = 4.

---

## 3. La mascota

| Indicador | Valor | Ámbito | Fuente | Tipo |
|---|---|---|---|---|
| Hogares con al menos una mascota | **55.4%** (IC 52.3–58.5) · Lima Metro 59.6% · Perú 64.0% | Estrato A/B, 2025 | INEI, informe técnico 2025 | R |
| Hogares con mascota que tienen perro | **79.1%** (43.8% del total de hogares A/B ÷ 55.4%) · Lima Metro 80.5% | Estrato A/B, 2025 | INEI 2025 (cociente nuestro) | R (cociente E) |
| Hogares con mascota que tienen gato | **34.3%** (19.0% ÷ 55.4%) · Lima Metro 43.3% | Estrato A/B, 2025 | INEI 2025 (cociente nuestro) | R (cociente E) |
| Hogares con mascota que tienen otra especie | 6.9% (3.8% ÷ 55.4%) | Estrato A/B, 2025 | INEI 2025 | R (cociente E) |
| Referencia anterior: perro / gato entre hogares con mascota | 86.6% / 23.9% | Lima A/B, 2018 | CPI Market Report N°08 (reemplazado por el INEI 2025) | R |
| Mascota preferida del hogar | perro 65%, gato 25%, aves 4%, conejo 2%, tortuga 1%, otros 2% | NSE A/B, 2021 | ESAN 2021, Fig. 4.2 | R |
| Perro y gato (mención múltiple) | perro 88%, gato 38% | Perú 2023 | Ipsos "Entre patas" | R |
| ~~Composición del parque: perro 56.5%, gato 36.2%~~ | **No verificado**: circula en prensa (Infobae, Correo) atribuido al INEI, pero no aparece en el informe técnico. No se usa | – | Prensa | – |
| Crecimiento de la tenencia | gatos +59%, perros +30% | Perú | Kantar | R |
| Mascotas por hogar | 1: 54.6% · 2: 22.7% · 3: 9.3% · 4 o más: 13.4%, **media ≈ 1.9** | Estrato A/B, 2025 | INEI 2025, anexo | R (media E, con 4.5 para "4 o más") |
| Referencia anterior: mascotas por hogar | 1: 60% · 2: 27% · 3 o más: 13%, media ≈ 1.6 | NSE A/B, zonas 6-7-8, 2021 | ESAN 2021, Tabla 4.13 | R |
| Perros por hogar (hogares con perro) | 1: 68.8% · 2: 20.5% · 3: 6.2% · 4 o más: 4.5% (media ≈ 1.5) | Estrato A/B, 2025 | INEI 2025, anexo | R (media E) |
| Tiene la mascota por compañía o afecto | perro **87.8%**, gato 87.1% | Estrato A/B, 2025 | INEI 2025 | R |
| La considera "parte de la familia" | **87%** | Lima 2026 | GRM y VPG, vía El Comercio | R |
| La considera "su hijo" | 56% | Lima 2026 | GRM y VPG | R |
| La ve como familia (Arellano) | 70–73% | Perú | Arellano, vía Petfood LatAm (2025: 73%) y APESEG (jul-2026: 70%) | R |
| Alguna vez contrató seguro para la mascota | 1% en Perú, 2% en Lima | 2021 | CCR Cuore, p. 8 | R |
| **Con seguro o plan de salud, A/B 2026** | **3%** | 5 distritos | Base CCR 2021 ajustada por la llegada de Pacífico PET (feb-2026, primas de S/ 24.90–44.90 al mes; 78% de lo asegurado son perros), Rímac y Mapfre, y por el perfil A/B. BanBif proyectaba 1,000 pólizas en 2024. No hay penetración publicada | **E** |
| Reseñas que mencionan perro / gato | 29.3% / 13.4% | 1,161 reseñas | `dashboard.json` | P |

**Tipo de mascota, categorías excluyentes, A/B [E]** (revisado sep-2026; antes 68 / 14 / 13 / 5 calibrado con CPI 2018): solo perro **62%**, solo gato **17%**, perro y gato **17%**, solo otras especies **4%**.

Cálculo: entre los hogares A/B con mascota, el INEI da P(perro) = 79.1%, P(gato) = 34.3% y P(otra) = 6.9%. Si "otros" es el grupo que no tiene ni perro ni gato, las cuatro categorías suman 100 cuando **ambos = perro + gato + otros − 100**. Se supone que ~4 de los 6.9 puntos de "otra especie" son hogares sin perro ni gato (el resto convive con perro o gato). Entonces ambos = 79.1 + 34.3 + 4 − 100 = 17.4; solo perro = 79.1 − 17.4 = 61.7; solo gato = 34.3 − 17.4 = 16.9. Redondeado: 62 / 17 / 17 / 4. Las cotas son: ambos entre 13.4% (si nadie tiene solo "otros") y 20.3% (si los 6.9 puntos son solo "otros"). En nuestras reseñas con especie identificable el reparto es solo perro 67%, solo gato 27% y ambos 7% [P].

**Cuidado preventivo, estrato A/B (INEI 2025) [R]**: el 86.2% vacuna al perro contra la rabia cada año, el 89.7% lo desparasita y el 44.3% esteriliza al menos a un perro. En gatos: 48.0% / 75.2% / 68.0%. Lima Metro, perros: 84.7% / 84.8% / 42.0%. Se preguntó desde agosto de 2025.

---

## 4. Qué valoran y de qué se quejan

### 4.1 Qué valoran al elegir veterinaria

| Atributo | Evidencia [R] | Fuente |
|---|---|---|
| Médico confiable | 9.69 sobre 10 (el atributo mejor puntuado) | Arellano 2026, vía El Comercio |
| Trato cálido | 8.96 sobre 10 | Arellano 2026 |
| Calidad médica | 8.86 sobre 10 | Arellano 2026 |
| Disponibilidad para emergencias | 8.46 sobre 10 | Arellano 2026 |
| Satisfacción y tiempos de espera como los puntos críticos | cualitativo, n = 384 | Tesis ULima 2024 (zonas 7 y 8) |
| Personal calificado / limpieza / puntualidad / amabilidad / recomendación de amigos | 32% / 18% / 17% / 17% / 15% (atributos que dan confianza, servicio a domicilio) | ESAN 2021, Fig. 4.6 |
| "Quiero que me reconozcan como cliente frecuente" | 4.32 sobre 5 | ESAN 2021, Tabla 4.17 |
| "Cambiaría de veterinaria por una más económica" | 3.05 sobre 5 (el precio pesa, pero no es decisivo) | ESAN 2021 |
| "Prefiero una veterinaria cerca aunque no conozca el servicio" | 2.65 sobre 5 (la cercanía sola no basta) | ESAN 2021 |
| "Tomaría una promoción aunque no traten bien a mi mascota" | 1.74 sobre 5 | ESAN 2021 |
| "Mi veterinaria está preparada para emergencias 24 h" | 3.38 sobre 5 (hay una brecha percibida) | ESAN 2021 |

**Ranking para graficar [E]**: participación estimada como primer criterio de elección. Se sintetizó a partir de los puntajes de Arellano 2026 (el orden confianza > trato > calidad > emergencias coincide con el ranking y lo respalda), las escalas de ESAN y el volumen de menciones en nuestras reseñas (trato: 663 menciones de tema; recomendación: 413). No hay un % publicado por atributo, así que el reparto sigue siendo estimado y no cambia.

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

**Canal de contacto y reserva** [R] (ESAN 2021, Tabla 4.16, NSE A/B): WhatsApp **63.8%**, llamada 25.0%, redes sociales 6.3%, app 4.2%, otros 0.7%. Entre los mayores de 51 años, llamada y WhatsApp están empatados. Más reciente: el **85%** de los clientes de veterinarias de las zonas 7 y 8 agenda por WhatsApp, Instagram o Facebook (tesis ULima 2024, n = 384) [R]. Ese dato es de **reserva**, no de descubrimiento: el reparto de descubrimiento de arriba sigue siendo [E].

### 5.2 Frecuencia y motivo de visita

| Indicador | Valor | Fuente | Tipo |
|---|---|---|---|
| Visitas a la veterinaria en los últimos 3 meses | 1: 38% · 2–3: 40% · 4 o más: 14% · ninguna: 8% (media ≈ 2 por trimestre, incluye baño) | ESAN 2021, Tabla 4.14 | R |
| Hogares limeños con perro que van al vet al menos 1 vez al año | 91% (gato: 58.7%) | CPI 2018 | R |
| Hogares con perro que van a control al menos 1 vez al año (Perú) | 76% | CPI 2018, vía Perú Retail | R |
| Vacuna al perro contra la rabia cada año / lo desparasita / esteriliza al menos uno | **86.2% / 89.7% / 44.3%** (Perú: 75.8 / 69.8 / 26.7) | INEI 2025, estrato A/B (reemplaza el 74.8% "ENAHO vía Swissinfo") | R |
| Gasto veterinario A/B (incluye baño y corte) | S/ 34.5 al mes entre quienes gastan ≈ S/ 414 al año (≈ 3–4 visitas de S/ 100–150). Solo el 26.7% de los hogares A/B declara gasto veterinario en 12 meses | INEI 2025 | R (anualización E) |
| Servicios más solicitados | baño y peluquería 26%, vacunas 23%, alimentos 17%, consulta 12%, accesorios 8%, delivery 4%, emergencia 4%, domicilio 3% | ESAN 2021, Fig. 4.3 | R |
| Frecuencia de visita a la veterinaria | mensual 46% · trimestral 13% · resto (41%) semestral o menos | NSE A/B de los 5 distritos, n = 201. Tesis ULima 2025 "Paws & Fur" | R |
| Gasto veterinario mensual | S/ 101–200: 62% · más de S/ 200: 25% | Tesis ULima 2025 | R |
| **Visitas clínicas al año** | **6** (antes 4) | ULima 2025: 0.46 × 12 + 0.13 × 4 + 0.41 × 1.5 ≈ 6.6 visitas al año. Se redondea a 6 porque la visita mensual puede incluir algún baño o compra en la veterinaria. ESAN 2021 daba ~8 con baño y ~4–5 sin él. El gasto veterinario del INEI A/B (~S/ 414 al año entre quienes gastan) queda por debajo, pero la ENAHO subestima | **E** |

**Motivo de visita [E]** (servicios de ESAN que implican ir a la clínica, re-normalizados a 100): Baño/grooming 40%, Vacunas 35%, Control/consulta 19%, Emergencia 6%.

---

## 6. Resumen del perfil

Dueño o dueña de 25 a 54 años (87%), sobre todo mujer (63%, tesis ULima 2024 y 2025). Tiene 1.9 mascotas, sobre todo perro (79% tiene perro y 34% gato, INEI 2025 A/B), aunque el gato es lo que más crece. El 87% la trata como familia y el 56% como hijo. La cuida bien: el 86% vacuna al perro cada año y el 44% lo esteriliza. Gasta unos S/ 314 al mes, de los que alrededor de un quinto va a la veterinaria, pero el gasto real del A/B cayó 14% entre 2024 y 2025 (veterinaria: -22%). Elige por la confianza en el médico y el trato, más que por precio o cercanía. Llega por recomendación, valida en Google Maps y agenda por WhatsApp. Casi nadie tiene seguro (alrededor del 3%). Donde más se queja es en la espera y la atención de emergencias.

---

```json client_profile
{
  "age_bands": [
    {"label": "18–24", "pct": 4},
    {"label": "25–34", "pct": 32},
    {"label": "35–44", "pct": 31},
    {"label": "45–54", "pct": 24},
    {"label": "55+", "pct": 9}
  ],
  "gender_decider": {"female_pct": 63, "male_pct": 37},
  "spend_bands": [
    {"label": "< S/ 100", "pct": 7},
    {"label": "S/ 100–200", "pct": 28},
    {"label": "S/ 200–400", "pct": 47},
    {"label": "S/ 400–700", "pct": 12},
    {"label": "> S/ 700", "pct": 6}
  ],
  "spend_mix": [
    {"label": "Alimento", "pct": 62},
    {"label": "Veterinaria", "pct": 20},
    {"label": "Grooming", "pct": 9},
    {"label": "Accesorios / juguetes", "pct": 5},
    {"label": "Otros", "pct": 4}
  ],
  "pet_type": [
    {"label": "Perro", "pct": 62},
    {"label": "Gato", "pct": 17},
    {"label": "Ambos", "pct": 17},
    {"label": "Otros", "pct": 4}
  ],
  "pets_per_household": 1.9,
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
  "visits_per_year": 6,
  "visit_reasons": [
    {"label": "Baño / grooming", "pct": 40},
    {"label": "Vacunas", "pct": 35},
    {"label": "Control / consulta", "pct": 19},
    {"label": "Emergencia", "pct": 6}
  ],
  "avg_spend_monthly_soles": 314,
  "care": {"vaccinated_pct": 86, "dewormed_pct": 90, "sterilized_pct": 44, "source": "INEI 2025, perros, estrato A/B"},
  "spend_trend": {"total_real_change_pct": -14, "vet_real_change_pct": -22, "period": "2024→2025", "source": "INEI ENAHO"},
  "sources": [
    {"id": "inei2025", "title": "INEI - Informe técnico: Tenencia y crianza de mascotas, 2025 (ENAHO, módulo jul-dic 2025; anexo con estrato A/B y Lima Metropolitana)", "url": "https://www.gob.pe/institucion/inei/informes-publicaciones/8570625-informe-tecnico-tenencia-y-crianza-de-mascotas-2025", "year": 2026},
    {"id": "inei2025_nota", "title": "INEI - Nota de prensa: 64,0% de los hogares del Perú tiene mascotas (8-sep-2026)", "url": "https://www.gob.pe/institucion/inei/noticias/1441066-inei-64-0-de-los-hogares-del-peru-tiene-mascotas", "year": 2026},
    {"id": "esan2021", "title": "Plan de negocio para atención de mascotas a domicilio en Lima Metropolitana (tesis ESAN; encuesta NSE A/B zonas 6-7-8, n=384)", "url": "https://repositorio.esan.edu.pe/server/api/core/bitstreams/962e92f8-74b0-497a-bc23-151e09b0d471/content", "year": 2021},
    {"id": "ulima2025", "title": "Plan de negocios para la implementación de una tienda premium para mascotas en Santiago de Surco - Paws & Fur (tesis ULima; encuesta NSE A/B 5 distritos, n=201)", "url": "https://repositorio.ulima.edu.pe/handle/20.500.12724/23566", "year": 2025},
    {"id": "ulima2024", "title": "Veterinarias de las zonas 7 y 8 de Lima: satisfacción y digitalización (tesis ULima, Carpio y Pizan; n=384 dueños, 31 administradores)", "url": "https://repositorio.ulima.edu.pe/handle/20.500.12724/22656", "year": 2024},
    {"id": "ccr2021", "title": "CCR Cuore - Tenencia de mascotas en el Perú (n=365)", "url": "https://www.ccrlatam.com.pe/themes/ccr_cuore/pdf/tenencia-de-mascotas-en-el-peru.pdf", "year": 2021},
    {"id": "grm2026", "title": "GRM y VPG - Limeños destinan en promedio S/314 mensuales en sus mascotas (El Comercio)", "url": "https://elcomercio.pe/economia/limenos-destinan-en-promedio-s314-mensuales-en-sus-mascotas-seguros-de-salud-alimentos-y-asi-evoluciona-este-mercado-hoy-en-dia-noticia/", "year": 2026},
    {"id": "clientesanonimos2026", "title": "Clientes Anónimos - Gasto en mascotas en Lima crece (Gestión; n=403)", "url": "https://gestion.pe/economia/empresas/gasto-en-mascotas-en-lima-crece-mas-del-50-aumento-su-presupuesto-anual-noticia/", "year": 2026},
    {"id": "clientesanonimos2026_detalle", "title": "Clientes Anónimos - El boom del mercado de mascotas en Lima (43% gasta S/100-200, 7% más de S/400; n=403)", "url": "https://www.clientesanonimos.com/post/el-boom-del-mercado-de-mascotas-en-lima-lo-que-los-datos-revelan-y-lo-que-las-marcas-a%C3%BAn-no-est%C3%A1n", "year": 2026},
    {"id": "grm2026_seguros", "title": "Revolución de cuatro patas: seguros para mascotas, Pacífico PET (El Comercio / GRM-VPG)", "url": "https://elcomercio.pe/economia/dia-1/revolucion-de-cuatro-patas-asi-crece-el-mercado-de-seguros-para-mascotas-lugares-pet-friendly-y-la-nueva-logica-pet-en-inmobiliarias-noticia/", "year": 2026},
    {"id": "apeseg2026", "title": "APESEG - El vínculo con las mascotas crece (Arellano: 70% la considera familia)", "url": "https://www.apeseg.org.pe/2026/07/el-vinculo-con-las-mascotas-crece-como-cuidar-su-salud-y-prevenir-gastos-inesperados/", "year": 2026},
    {"id": "cpi2018", "title": "CPI Market Report N°08 - Mascotas", "url": "https://cpi.pe/images/upload/paginaweb/archivo/26/mr_mascotas_201808.pdf", "year": 2018},
    {"id": "arellano_vet", "title": "Del veterinario de barrio a las clínicas especializadas (Arellano vía El Comercio)", "url": "https://elcomercio.pe/economia/dia-1/del-veterinario-de-barrio-a-las-clinicas-especializadas-asi-crece-el-mercado-de-salud-para-mascotas-en-el-peru-cadenas-veterinarias-noticia/", "year": null},
    {"id": "arellano_petfood", "title": "Mascotas: cuánto gastan los peruanos (Petfood Latinoamérica; Arellano: 73% familia; Nestlé Purina: S/350-500 por mascota y dueño de 25-45 años)", "url": "https://petfoodlatinoamerica.com/2025/05/02/mascotas-cuanto-gastan-los-peruanos-en-sus-cuidados-y-cuales-son-los-nuevos-servicios-creados-para-ellas/", "year": 2025},
    {"id": "ipsos2023", "title": "Ipsos Perú - Entre patas", "url": "https://www.ipsos.com/es-pe/entre-patas", "year": 2023},
    {"id": "ipsos2024", "title": "Ipsos Perú - Cuando el cliente ladra", "url": "https://www.ipsos.com/es-pe/cuando-el-cliente-ladra-marcas-exitosas-en-el-creciente-mercado-de-mascotas", "year": 2024},
    {"id": "kantar", "title": "Kantar - Casi la mitad de hogares peruanos tienen una mascota", "url": "https://www.kantar.com/latin-america/inspiracion/consumo-masivo/hogares-con-mascotas", "year": null},
    {"id": "peruretail_cpi", "title": "Día del perro: hogares peruanos gastan hasta S/300 mensuales (Perú Retail)", "url": "https://www.peru-retail.com/dia-del-perro-hogares-peruanos-gastan-hasta-s-300-mensuales-en-sus-mascotas/", "year": null},
    {"id": "resenas", "title": "Reseñas Google de 264 fichas (1,161 reseñas) - data/dashboard.json", "url": "data/dashboard.json", "year": 2026}
  ],
  "estimated_fields": ["age_bands", "spend_bands", "spend_mix", "pet_type", "pets_per_household", "insured_pct", "values", "channels", "visits_per_year", "visit_reasons"],
  "notes": "Segmento objetivo NSE A/B de Miraflores, San Isidro, San Borja, Surco y La Molina; no hay estudio público con ese recorte exacto. Fuente más cercana: encuesta ESAN 2021 (NSE A/B, zonas APEIM 6-7-8, zona 7 = los 5 distritos). age_bands = ULima 2025 (n=201, NSE A/B 5 distritos; peso 65%) y ESAN 2021 (peso 35%) reponderados a tramos de 10 años; CCR 2021 queda como referencia; 55+ puede estar subestimado (ULima corta a 65, ESAN a 59). gender_decider = 70% ULima 2025 (decisores A/B: 59/41) + 30% ULima 2024 (zonas 7-8, n=384: 73/27) = 63/37. spend_bands = curva de Lima de Clientes Anónimos ene-2026 (19/43/31/7, con 7% sobre S/400) desplazada por el factor A/B vs Lima+Callao del INEI 2025 (1.4x); >S/400 = 18% y media implícita ~S/314 (S/314-345 según el valor del tramo superior). avg_spend_monthly_soles = GRM/VPG 2026 Lima [R]. spend_mix = ancla INEI 2025 estrato A/B (79% alimento / 21% veterinaria, que incluye baño y corte) + ~9 pts a accesorios y otros que la ENAHO no capta (penetración GRM: accesorios 17%, paseador 4%) + ~8 pts de alimento a vet+grooming por ser cliente de clínica. pet_type excluyente reconstruido del INEI 2025 A/B (entre hogares con mascota: 79.1% perro, 34.3% gato, 6.9% otra): ambos = 79.1+34.3+4-100 = 17, suponiendo ~4% solo otras especies; el 56.5%/36.2% atribuido al INEI en prensa no está en el informe y no se usa. pets_per_household = media de la distribución INEI 2025 A/B 54.6/22.7/9.3/13.4 (4+ = 4.5). care = INEI 2025 estrato A/B, perros [R] (gatos: 48/75/68). spend_trend = INEI ENAHO, cambio real 2024-2025 del gasto mensual A/B (S/102.3 -> 88.1) y del veterinario (S/44.3 -> 34.5). El INEI es estrato A/B nacional (no Lima x A/B) y la ENAHO subestima el nivel de gasto frente a la industria. family_member_pct = GRM 2026 Lima [R] (INEI A/B: 87.8% tiene perro por compañía o afecto). insured_pct = CCR 2021 (2% Lima alguna vez) ajustado; no hay penetración publicada (Pacífico PET feb-2026: primas S/24.90-44.90, 78% perros). Edad: el '25-45 años' es de Nestlé Purina (no Arellano); el INEI no publica edad ni sexo del jefe de hogar. values y channels = síntesis de escalas Arellano 2026 (confiable 9.69, trato 8.96, calidad 8.86, emergencias 8.46)/ESAN y reseñas propias; no son % publicados. channels es descubrimiento [E]; para reserva, ULima 2024: 85% agenda por WhatsApp/Instagram/Facebook. visits_per_year = ULima 2025 (46% mensual, 13% trimestral, 41% semestral o menos: ~6.6 al año), redondeado a 6 por posible baño/compra en la visita (antes 4, desde ESAN 2021). visit_reasons = servicios ESAN re-normalizados. complaints = global.themes de dashboard.json, neg_pct = neg/(pos+neg). Canal de reserva [R, ESAN]: WhatsApp 63.8%, llamada 25%, redes 6.3%, app 4.2%."
}
```
