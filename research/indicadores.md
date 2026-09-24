# Indicadores de decisión: ¿en qué distrito de Lima abrir una clínica veterinaria?

Distritos comparados: **Miraflores, San Isidro, San Borja, Santiago de Surco y La Molina**.
Fecha de la investigación: 23-sep-2026. Moneda: soles (S/) salvo que se indique USD.

> Rigor: cada cifra lleva su fuente. Lo que se calculó o se aproximó aparece como **estimado**, con el método. Si no encontré un dato a nivel distrital, lo digo. No hay ninguna fuente pública que publique la tenencia de mascotas **por distrito**, y el NSE APEIM se publica **por zona**, no por distrito (ver notas).

---

## 1. Tabla comparativa por distrito

| Indicador | Miraflores | San Isidro | San Borja | Santiago de Surco | La Molina | Fuente |
|---|---|---|---|---|---|---|
| Población 2025 (miles) | 122.2 | 75.0 | 138.8 | 398.5 | 170.3 | [CPI, Market Report "Perú: Población 2025", cuadro 9](https://cpi.pe/wp-content/uploads/2025/11/CPI-Market-Report-Proyecciones-Poblacionales-2025.pdf) (proyección CPI basada en el Censo 2017) |
| Población 2025, fuente alternativa | 126,049 | 73,401 | 126,125 | 401,980 (INEI: **437,028**) | 151,360 | [citypopulation.de](https://www.citypopulation.de/en/peru/lima/admin/) (estimación basada en INEI). Surco según INEI: [nota de prensa INEI 17-ene-2025](https://www.gob.pe/institucion/inei/noticias/1092367-lima-supera-los-10-millones-400-mil-habitantes) |
| Población Censo 2017 | 103,090 | 65,333 | 121,793 | 378,978 | 153,614 | [citypopulation.de](https://www.citypopulation.de/en/peru/lima/admin/) (serie censal INEI) |
| Hogares 2025 (miles) | 43.6 | 24.5 | 40.3 | 114.5 | 45.8 | [CPI 2025, cuadro 9](https://cpi.pe/wp-content/uploads/2025/11/CPI-Market-Report-Proyecciones-Poblacionales-2025.pdf) |
| Personas por hogar (estimado) | 2.80 | 3.06 | 3.44 | 3.48 | 3.72 | **Estimado**: población CPI ÷ hogares CPI |
| Hogares en estrato de ingreso **Alto** (%) | 100% | 100% | 94.0% | 65.0% | 87.8% | [INEI, Planos Estratificados de Lima Metropolitana a nivel de manzana 2020](https://www.inei.gob.pe/media/MenuRecursivo/publicaciones_digitales/Est/Lib1744/libro.pdf) (Censo 2017 + ENAHO), cuadro resumen de cada plano distrital |
| Hogares en estrato **Alto + Medio alto** (%), proxy de NSE A/B | 100% | 100% | 99.8% | 95.3% | 96.3% | Misma fuente. Cálculo: (hogares alto + medio alto) ÷ total. SB: 32,666+1,993 de 34,736; Surco: 65,237+30,435 de 100,374; LM: 35,107+3,382 de 39,966; Miraflores 37,536/37,536; San Isidro 21,045/21,045 |
| Ingreso familiar mensual promedio | S/ 8,258 (zonal) | S/ 8,258 (zonal) | S/ 8,258 (zonal) | S/ 8,258 (zonal) | S/ 8,258 (zonal) | [Ipsos, "Las 6 caras de Lima Metropolitana 2025"](https://www.ipsos.com/sites/default/files/ct/publication/documents/2025-09/Perfiles%20Zonales%202025_V3.pdf), zona "Lima Oeste" (12 distritos, incluye los 5). **No hay dato distrital publicado** |
| Hogares con mascota (%) | 59.6% (Lima Met.) | 59.6% | 59.6% | 59.6% | 59.6% | [INEI vía El Peruano, 08-sep-2026](https://elperuano.pe/noticia/304297-inei-el-64-de-los-hogares-peruanos-tiene-mascota-perro-o-gato-cual-tienes-en-casa). **Solo existe el dato de Lima Metropolitana, no por distrito** |
| Hogares con mascota (estimado) | ~26,000 | ~14,600 | ~24,000 | ~68,200 | ~27,300 | **Estimado**: hogares CPI 2025 × 59.6% |
| Mascotas (estimado) | ~46,800 | ~26,300 | ~43,200 | ~122,800 | ~49,100 | **Estimado**: hogares con mascota × 1.8 mascotas/hogar NSE AB ([CPI Market Report N°08, 2018](https://cpi.pe/images/upload/paginaweb/archivo/26/mr_mascotas_201808.pdf)) |
| Veterinarias mapeadas en OpenStreetMap | 19 | 3 | 5 | 26 | 8 | **Estimado, cota inferior**: consulta Overpass API `amenity=veterinary` dentro del límite distrital, snapshot OSM 22-sep-2026 ([overpass-api.de](https://overpass-api.de/)). OSM tiene subregistro fuerte |
| Veterinarias OSM por 10,000 hab. (estimado) | 1.55 | 0.40 | 0.36 | 0.65 | 0.47 | **Estimado**: conteo OSM ÷ población CPI 2025 |
| Hogares con mascota por veterinaria OSM (estimado) | ~1,370 | ~4,870 | ~4,800 | ~2,620 | ~3,410 | **Estimado**. Úsalo solo para comparar distritos entre sí, no como valor absoluto |
| Alquiler local comercial, mediana USD/m²/mes (estimado) | 20.1 (p25–p75: 15.1–29.6; n=86) | 20.2 (10.3–24.8; n=82) | 16.0 (10.8–23.2; n=27) | 18.3 (9.9–28.2; n=68) | 14.6 (9.3–20.8; n=28) | **Estimado**: mediana de precio ÷ m² construidos de los avisos activos en [InfoCasas](https://www.infocasas.com.pe/alquiler/locales-comerciales/lima/miraflores) (hasta 5 páginas por distrito, 23-sep-2026, avisos ≥20 m²). Son precios pedidos, no de cierre |
| Referencias de alquiler de corredoras | Tarifas entre las más altas de Lima | Locales en edificios: US$14–30/m² (Empresarial 19.67; Financiero 28); vacancia 10.9% | Sin dato | Zona muy demandada para formatos <250 m² | Sin dato | [Binswanger, ago-2025 (San Isidro)](https://binswanger.com.pe/tendencias/edificios-de-san-isidro-con-23-locales-comerciales-libres/); [Binswanger, ene-2025, puerta a calle](https://binswanger.com.pe/tendencias/el-comercio-puerta-a-calle-crece-en-lima-nuevos-proyectos-impulsan-su-expansion-y-dinamismo/): Lima en rango US$11.83–43.75/m², vacancia 1.58%, promedio US$20.8/m² ([Binswanger, oct-2024](https://binswanger.com.pe/tendencias/cinco-nuevos-corredores-comerciale-se-generarian-en-lima-en-que-zonas/)) |

### Notas sobre la tabla
- **Discrepancia de población**: el INEI proyecta 437,028 habitantes en Surco para 2025, mientras que el CPI proyecta 398.5 mil. Ambas parten del Censo 2017 con metodologías distintas. Para el dashboard recomiendo usar **CPI**, que es la única fuente que publica **población y hogares** de los 43 distritos con el mismo método. El INEI publica el archivo "Población total proyectada al 30 de junio, 2018-2026, por distrito" en [gob.pe](https://www.gob.pe/institucion/inei/informes-publicaciones/6894980-peru-poblacion-total-proyectada-al-30-de-junio-de-cada-ano-segun-departamento-provincia-y-distrito-2018-2026), pero el portal bloqueó la descarga automática (HTTP 418). Vale la pena bajarlo a mano para cruzar cifras.
- La edición CPI de marzo-2026 ([PDF](https://cpi.pe/wp-content/uploads/2026/03/CPI_Market-Report-N%C2%B0003-Proyecciones-Poblacionales-2025.pdf)) da, para 2026, Surco 403.4 mil y Miraflores 123.9 mil. El resto de la tabla tiene una maquetación que no se pudo extraer de forma confiable, así que no la uso.
- **NSE**: APEIM publica la distribución por NSE de Lima Metropolitana (2025: A 2.6%, B 18.4%, C 45.5%, D 26.9%, E 6.6%; [Síntesis APEIM 2025](https://apeim.com.pe/wp-content/uploads/2025/12/Sintesis-Niveles-socioeconomicos-2025.pdf)). La distribución por **zona APEIM** (la "Zona 7" agrupa Miraflores, San Isidro, San Borja, Surco y La Molina) solo aparece en el informe completo para asociados, no en los PDFs públicos. Por eso uso como proxy los **estratos de ingreso per cápita del INEI** (Alto: ≥ S/2,412.45 per cápita al mes; Medio alto: S/1,449.72 a 2,412.44). Esos estratos **no equivalen** a los NSE APEIM.
- **Ingreso por NSE, Lima Metropolitana** ([APEIM 2024, data ENAHO 2023, p. 51](https://apeim.com.pe/wp-content/uploads/2025/03/2023-2024-Version-WEB.pdf.pdf)): ingreso familiar mensual NSE A S/13,923, NSE B S/7,545, promedio Lima S/4,501. Gasto mensual NSE A S/8,109, NSE B S/4,905. Gasto en salud (humana) NSE A S/665 y NSE B S/446.
- **Veterinarias**: no existe un conteo oficial por distrito. Se reportan unas 650 clínicas veterinarias en Lima en 2023 ([veterinariasperu.net](https://veterinariasperu.net/cuantas-veterinarias-hay-en-lima/), directorio privado; la metodología no está clara). El Colegio Médico Veterinario Departamental de Lima dice tener más de 2,500 colegiados ([cmvdlima.org](https://cmvdlima.org/)). Para un conteo serio conviene usar Google Places API o la búsqueda por CIIU 7500 "Actividades veterinarias" en SUNAT/SIGEP (ejemplos de RUC en Surco: [datosperu.org](https://www.datosperu.org/empresa-hospital-veterinario-24-horas-animal-surco-eirl-20606977698.php)).

---

## 2. Mercado de mascotas en Perú y Lima

| Dato | Valor | Fuente |
|---|---|---|
| Hogares con al menos una mascota, Perú | 64% (urbano 61.8%, rural 72.7%) | INEI (módulo de mascotas de la ENAHO, más de 37 mil hogares), vía [El Peruano, 08-sep-2026](https://elperuano.pe/noticia/304297-inei-el-64-de-los-hogares-peruanos-tiene-mascota-perro-o-gato-cual-tienes-en-casa) y [Forbes Perú, 09-sep-2026](https://forbes.pe/actualidad/2026-09-09/el-64-de-peruanos-tiene-mascota-en-casa-y-los-perros-son-los-mas-populares) |
| Hogares con mascota, Lima Metropolitana | 59.6% | Ídem |
| Perros / gatos (Perú, % de hogares) | 52% / 33% | Ídem |
| Perro por "compañía o afecto", Lima Met. y Callao | 85.5% | Ídem (indicador de humanización) |
| Hogares con mascota según presencia de menores de 18 | 68.5% (con menores) vs 59.8% (solo adultos) | Ídem |
| Hogares con perro por nivel de ingreso (Enapres 2024) | 52.9% ingresos bajos vs 43.7% ingresos altos | INEI Enapres 2024, vía [Infobae, 24-jun-2025](https://www.infobae.com/peru/2025/06/24/perros-gatos-y-hasta-conejos-en-encuesta-del-inei-sobre-hogares-estudio-buscara-conocer-sus-condiciones-de-vida/) |
| Gasto mensual total de los hogares en mascotas, Perú | S/298.6 millones (2025) vs S/260 millones (2023); 89% alimento, 11% veterinaria | INEI ENAHO vía [El Comercio / ECData](https://elcomercio.pe/ecdata/veterinaria-inei-cuanto-gastan-los-peruanos-en-sus-mascotas-mercado-de-mascotas-en-peru-perros-y-gatos-keiko-fujimori-noticia/) |
| Gasto mensual, Lima Metropolitana | Veterinaria S/15 millones (13%), alimento S/103 millones (87%) | Ídem |
| Gasto mensual por hogar en mascotas | S/100–150 (Ipsos); ~S/300 (Gestión/HeyVet, 60% alimento y 40% salud); S/350–500 por mascota (El Comercio/Arellano) | [Ipsos "Entre patas"](https://www.ipsos.com/es-pe/entre-patas); [Gestión](https://gestion.pe/economia/empresas/el-negocio-detras-del-boom-petcare-en-que-invierten-mas-los-duenos-de-mascotas-noticia/); [Petfood Latinoamérica, may-2025](https://petfoodlatinoamerica.com/2025/05/02/mascotas-cuanto-gastan-los-peruanos-en-sus-cuidados-y-cuales-son-los-nuevos-servicios-creados-para-ellas/). Las cifras varían mucho según la metodología |
| Gasto veterinario mensual promedio (2018) | Perro S/62, gato S/32 | [CPI Market Report N°08, oct-2018](https://cpi.pe/images/upload/paginaweb/archivo/26/mr_mascotas_201808.pdf) |
| Dueños de perros que van al veterinario ≥1 vez/año | 76% nacional urbano; **91% en Lima**. Gatos: 41% | Ídem |
| Mascotas por hogar | 2.2 en total; **1.8 en NSE AB**; 2.4 en CDE | Ídem |
| Perro en hogares NSE AB (Perú urbano) | 86.6% de los hogares con mascota tiene perro; 23.9% tiene gato | Ídem |
| Alimento solo balanceado, NSE AB | 48.7% (proxy de gasto premium) | Ídem |
| Mercado pet care Perú | US$507 millones (2024), proyección US$708 millones al 2029 | Euromonitor vía [Petfood Latinoamérica](https://petfoodlatinoamerica.com/2025/05/02/mascotas-cuanto-gastan-los-peruanos-en-sus-cuidados-y-cuales-son-los-nuevos-servicios-creados-para-ellas/); ficha: [Euromonitor](https://www.euromonitor.com/pet-care-in-peru/report) |
| Mercado pet care (otra estimación) | ~US$800 millones al año, ~25% servicios veterinarios (~US$200 millones) | [AmericaRetail](https://americaretail-malls.com/paises/peru/boom-pet-lover-impulsa-mercado-peruano-veterinario/) (declaración de HeyVet, no es un estudio auditado) |
| Crecimiento del mercado de salud de mascotas | ~8% anual | [Gestión, LatamVet](https://gestion.pe/economia/empresas/latamvet-proyecta-ingresar-a-peru-con-plan-para-expandir-red-de-clinicas-veterinarias-noticia/) y [Gestión, HeyVet](https://gestion.pe/economia/empresas/el-negocio-detras-del-boom-petcare-en-que-invierten-mas-los-duenos-de-mascotas-noticia/) |

---

## 3. Ticket por servicio en Lima (soles, 2025-2026)

| Servicio | Rango general Lima | Rango en clínicas premium (Miraflores, San Isidro, La Molina, etc.) | Fuentes |
|---|---|---|---|
| Consulta general | S/30–100 | S/80–150 (promedio citado: S/150 con examen) | [cuantomecuesta.com (abr-2026)](https://cuantomecuesta.com/pe/veterinario/); [mundomascotita.com](https://www.mundomascotita.com/cuanto-cuesta-consulta-veterinaria-peru/); [Petfood Latinoamérica / El Comercio](https://petfoodlatinoamerica.com/2025/05/02/mascotas-cuanto-gastan-los-peruanos-en-sus-cuidados-y-cuales-son-los-nuevos-servicios-creados-para-ellas/) |
| Consulta con especialista | S/80–150 (en otra fuente, S/150–300) | S/150–300 | Ídem |
| Vacuna (por dosis) | S/40–120; séxtuple S/60–120; antirrábica S/30–60 | Pack anual S/120–250 | Ídem |
| Desparasitación | S/20–80 | n.d. | [cuantomecuesta.com](https://cuantomecuesta.com/pe/veterinario/) |
| Consulta de emergencia | S/100–250 | Recargo nocturno de S/80–200 sobre el servicio; un tratamiento de S/200 de día puede costar S/400–500 de noche | [mundomascotita.com](https://www.mundomascotita.com/cuanto-cuesta-consulta-veterinaria-peru/); [paseadores.pe](https://paseadores.pe/blog/veterinarias-economicas-lima-precio-promedio) (según el resumen del buscador; la página devolvió HTTP 402 al consultarla) |
| Esterilización / castración | Gato S/150–300; gata S/200–400; perro pequeño S/250–500; perra pequeña S/350–700; perros grandes S/500–1,000 | Parte alta del rango | [mundomascotita.com](https://www.mundomascotita.com/cuanto-cuesta-consulta-veterinaria-peru/); [cuantomecuesta.com](https://cuantomecuesta.com/pe/veterinario/) |
| Cirugía mayor | Abdominal S/600–2,000; ortopédica S/800–3,000 | Parte alta del rango | [cuantomecuesta.com](https://cuantomecuesta.com/pe/veterinario/) |
| Hospitalización (por noche) | S/80–200 | n.d. | Ídem |
| Laboratorio (hemograma/perfil) | S/80–300 | n.d. | Ídem y mundomascotita |
| Ecografía | S/120–400 | n.d. | Ídem |
| Radiografía (por placa) | S/80–200 | n.d. | Ídem |
| Membresía o plan de salud | Ej.: S/220 al año con consultas ilimitadas (Groomers) | HeyVet: más de 1,000 membresías activas | [Gestión 2023](https://gestion.pe/tendencias/seguro-de-mascotas-la-oferta-de-las-veterinarias-ante-silencio-de-las-aseguradoras-la-positiva-pacifico-pacifico-rimac-apeseg-perros-gatos-noticia/); [Gestión](https://gestion.pe/economia/empresas/el-negocio-detras-del-boom-petcare-en-que-invierten-mas-los-duenos-de-mascotas-noticia/) |

Advertencia: estos rangos vienen de portales de consumo que agregan precios, no de una encuesta formal de precios. Para el dashboard conviene levantar precios reales (mystery shopping por teléfono o WhatsApp) de 10 a 15 clínicas por distrito.

---

## 4. Indicadores de decisión priorizados, con peso sugerido para el score de oportunidad

| # | Indicador (métrica) | Peso | Justificación |
|---|---|---|---|
| 1 | **Demanda potencial**: hogares con mascota estimados en el distrito o en el radio de captación (10–15 min en auto) | 15% | Es el volumen de clientes posibles. Surco tiene ~2.5 veces más hogares que cualquiera de los otros cuatro. En EE. UU. se usan de 1,900 a 2,000 fichas activas por veterinario a tiempo completo (dvm360, según el resumen del buscador; la página devolvió 403 y no pude verificarla) |
| 2 | **Saturación competitiva**: hogares con mascota por clínica, clínicas por 10 mil habitantes y presencia de cadenas | 15% | Mide cuánta demanda queda libre. En Lima la referencia sería ~2,400 hogares con mascota por clínica (1.56 millones de hogares con mascota ÷ ~650 clínicas, **estimado**). Un distrito por debajo de esa cifra (Miraflores, según OSM) está más saturado |
| 3 | **Poder adquisitivo**: % de hogares en estrato alto o NSE A/B e ingreso familiar | 15% | Determina el ticket y la disposición a pagar cirugía, imágenes o 24 h. En NSE A el gasto en salud humana es S/665 al mes, frente a S/306 en NSE C (APEIM) |
| 4 | **Costo de ocupación**: alquiler USD/m² × m² necesarios ÷ ingresos proyectados | 10% | Una clínica necesita de 100 a 250 m² (Pet Center franquicia su formato de 100 m² con una inversión de US$70 mil; [Gestión](https://gestion.pe/economia/empresas/pet-center-apuesta-por-tener-100-clinicas-veterinarias-en-los-proximos-10-anos-ncze-noticia/)). La diferencia de mediana entre La Molina (14.6) y San Isidro (20.2) es de ~38% |
| 5 | **Accesibilidad y estacionamiento**: frente a avenida, parqueo propio o cercano, tiempo de viaje | 10% | El dueño llega en auto con un animal enfermo. El estudio de accesibilidad de Inglaterra y Gales usa 30 minutos en auto como umbral máximo ([Clark et al., 2026](https://pmc.ncbi.nlm.nih.gov/articles/PMC12895197/)) |
| 6 | **Brecha de servicio diferencial**: disponibilidad de atención 24 h, emergencias, especialidades e imágenes en el radio | 10% | La emergencia nocturna cuesta de 2 a 2.5 veces más y fideliza al cliente. Los operadores que crecen apuestan por hospitales 24 h de referencia (PetExperts 24h en Lince, Grupo Pancho Cavero; [Gestión, jul-2026](https://gestion.pe/economia/empresas/grupo-pancho-cavero-proyecta-seis-clinicas-en-lima-y-evalua-franquicias-noticia/)) |
| 7 | **Reputación de la competencia**: rating promedio en Google y volumen de reseñas de las clínicas del radio | 10% | Una competencia con rating bajo (<4.3) y pocas reseñas se puede desplazar. Con rating alto y miles de reseñas, entrar cuesta mucho más en marketing |
| 8 | **Perfil del hogar**: personas por hogar, casas frente a departamentos, familias con hijos | 5% | Los hogares con menores tienen más mascotas (68.5% frente a 59.8%, INEI). La Molina y Surco tienen hogares más grandes (3.7 y 3.5 personas) que Miraflores (2.8) |
| 9 | **Crecimiento de demanda**: variación de población y hogares y nuevos proyectos inmobiliarios | 5% | Muestra hacia dónde se mueve la demanda. En Miraflores se certificaron 5,426 nacimientos en 2024, un indicador de hogares jóvenes ([INEI](https://www.gob.pe/institucion/inei/noticias/1092367-lima-supera-los-10-millones-400-mil-habitantes)) |
| 10 | **Disponibilidad de local apto**: vacancia, zonificación compatible y licencia municipal, primer piso | 5% | En puerta a calle la vacancia es de solo 1.58% (Binswanger), y conseguir local puede ser el cuello de botella |
| | **Total** | **100%** | |

Fórmula sugerida: normalizar cada indicador de 0 a 1 entre los 5 distritos (min-max; invertir los de costo y saturación) y calcular `score = Σ peso_i × valor_normalizado_i`. Como los datos distritales son débiles, conviene calcular el score por **radio de captación alrededor de locales candidatos** y no por distrito, porque los límites distritales no marcan el comportamiento del cliente.

---

## 5. Tendencias relevantes

- **Humanización**: en Lima Metropolitana y Callao, el 85.5% de los hogares con perro lo tiene por "compañía o afecto" (INEI 2026). Además, el 48.7% de los hogares AB alimenta solo con balanceado (CPI 2018). Crece la demanda de medicina preventiva, rehabilitación y fisioterapia (Grupo Pancho Cavero abre un centro de fisioterapia en Miraflores, [Gestión jul-2026](https://gestion.pe/economia/empresas/grupo-pancho-cavero-proyecta-seis-clinicas-en-lima-y-evalua-franquicias-noticia/)).
- **Seguros para mascotas**: el mercado es incipiente e inestable. La Positiva lanzó un seguro en 2020 y lo retiró, Rímac lo dejó en stand-by y Pacífico solo lo ofrece como asistencia dentro del seguro de hogar. Hubo planes de Chubb/BanBif (S/29 al mes) e Iglu (S/28–70 al mes) ([Gestión, may-2023](https://gestion.pe/tendencias/seguro-de-mascotas-la-oferta-de-las-veterinarias-ante-silencio-de-las-aseguradoras-la-positiva-pacifico-pacifico-rimac-apeseg-perros-gatos-noticia/)). Hoy MAPFRE comercializa un seguro con Pet Seguro bajo modelo de reembolso ([MAPFRE](https://www.mapfre.com.pe/seguro-mascotas/)). **No encontré cifras de penetración.** En la práctica, las **membresías o planes de salud de las propias clínicas** reemplazan al seguro.
- **Cadenas y consolidación**:
  - **Pet Center**: primera cadena del país, con 15 sedes en Lima en 2021 y la meta de 100 clínicas franquiciadas en 10 años (US$70 mil por local de 100 m², canon de US$20 mil, recupero en 1.5 a 2 años) ([Gestión, mar-2021](https://gestion.pe/economia/empresas/pet-center-apuesta-por-tener-100-clinicas-veterinarias-en-los-proximos-10-anos-ncze-noticia/)). Tiene sedes en Surco (El Polo, Casuarinas, El Trigal, Jockey Plaza) y Miraflores.
  - **Grupo Pancho Cavero**: PetExperts 24h (Lince) y Clínica Mora (límite Miraflores/San Isidro); planea de 5 a 6 clínicas más en Lima en 2026 y evalúa franquicias ([Gestión, jul-2026](https://gestion.pe/economia/empresas/grupo-pancho-cavero-proyecta-seis-clinicas-en-lima-y-evalua-franquicias-noticia/)).
  - **HeyVet**: sedes en Miraflores y Surco, modelo de membresía (más de 1,000 activas) y meta de 6 locales a fines de 2026 ([Gestión](https://gestion.pe/economia/empresas/el-negocio-detras-del-boom-petcare-en-que-invierten-mas-los-duenos-de-mascotas-noticia/)).
  - **LatamVet** (Chile): entraría a Perú en 2027 comprando clínicas existentes, con US$27.5 millones para llegar a ~56 a 60 centros entre Perú y Colombia ([Gestión](https://gestion.pe/economia/empresas/latamvet-proyecta-ingresar-a-peru-con-plan-para-expandir-red-de-clinicas-veterinarias-noticia/); [Petfood Latinoamérica, sep-2026](https://petfoodlatinoamerica.com/2026/09/17/latamvet-contempla-la-adquisicion-de-50-clinicas-en-peru-y-colombia/)). Esto sugiere una **salida por venta** para clínicas independientes bien gestionadas.
  - **Vet Place**: no encontré información verificable sobre su expansión.

---

## 6. Preguntas de negocio que el dashboard debe responder antes de decidir

1. ¿Cuántos hogares con perro o gato hay dentro de 10 y 15 minutos en auto de cada local candidato, y cuántos son NSE A/B?
2. ¿Cuántas clínicas veterinarias (y cuántas 24 h) hay en ese radio, y cuántos hogares con mascota le tocan a cada una comparado con el promedio de Lima (~2,400)?
3. ¿Qué rating y volumen de reseñas en Google tienen los 5 competidores más cercanos? ¿Hay un líder difícil de desplazar?
4. ¿Qué ticket promedio y qué mezcla de servicios (consulta, vacuna, cirugía, emergencia, hospitalización) necesito para cubrir alquiler, planilla y equipos? ¿Es realista en ese distrito?
5. ¿Cuál es el costo de ocupación total (alquiler USD/m² × m², más mantenimiento) como % de los ingresos proyectados en cada distrito? ¿Queda por debajo del 8 al 12%?
6. ¿Cuántas consultas al día necesito para llegar al punto de equilibrio y en cuántos meses lo alcanzo en cada escenario de distrito?
7. ¿Existe una brecha de atención 24 h o de emergencias en el radio? ¿A qué distancia está el hospital veterinario 24 h más cercano?
8. ¿Hay locales disponibles de 100 a 250 m² en primer piso, con estacionamiento y zonificación compatible, en los corredores de mayor tráfico del distrito?
9. ¿Cómo cambia el ranking de distritos si modifico los pesos (por ejemplo, más peso a la competencia o al alquiler)? ¿La decisión aguanta ese análisis de sensibilidad?
10. ¿Qué cadenas (Pet Center, HeyVet, Pancho Cavero, LatamVet desde 2027) están presentes o planean entrar al radio, y qué propuesta me diferencia de ellas (membresía, 24 h, especialidad, felinos, exóticos)?

---

## 7. Vacíos de información (qué no encontré)

- Tenencia de mascotas **por distrito**: no está publicada. El microdato del módulo de mascotas de la ENAHO 2025 podría permitir estimarla por conglomerado, pero el tamaño de muestra distrital sería pequeño.
- NSE APEIM **por zona o distrito**: está en el informe completo para asociados, no en los PDFs públicos.
- Ingreso promedio **por distrito**: no hay publicación oficial. Uso el promedio zonal de Ipsos (S/8,258) y los estratos per cápita del INEI.
- Número oficial de veterinarias por distrito: no existe. El conteo de OSM es una cota inferior.
- Alquiler comercial por distrito en reportes de Colliers o Binswanger: solo encontré rangos de Lima y datos de San Isidro. Las medianas de la tabla son **estimaciones propias** hechas con avisos de InfoCasas.
- Penetración de seguros para mascotas en Perú: no encontré cifras.

---

## 8. district_stats

```json
{
  "district_stats": {
    "_meta": {
      "generated": "2026-09-23",
      "units": {
        "population": "personas (proyección 2025)",
        "households": "hogares (proyección 2025)",
        "nse_ab_pct": "% hogares en estrato de ingreso INEI Alto + Medio alto (proxy de NSE A/B; NO es NSE APEIM)",
        "avg_income_soles": "ingreso familiar mensual promedio en soles",
        "rent_usd_m2": "mediana de alquiler de local comercial, USD/m2/mes",
        "pet_households_pct": "% hogares con al menos una mascota"
      },
      "notes": "Los valores con estimated=true son cálculos o aproximaciones; ver research/indicadores.md."
    },
    "Miraflores": {
      "population": {"value": 122200, "source": "CPI Market Report Población 2025, cuadro 9 - https://cpi.pe/wp-content/uploads/2025/11/CPI-Market-Report-Proyecciones-Poblacionales-2025.pdf", "estimated": false},
      "households": {"value": 43600, "source": "CPI Market Report Población 2025, cuadro 9", "estimated": false},
      "nse_ab_pct": {"value": 100.0, "source": "INEI Planos Estratificados Lima Metropolitana 2020 (Censo 2017) - https://www.inei.gob.pe/media/MenuRecursivo/publicaciones_digitales/Est/Lib1744/libro.pdf ; 37,536 de 37,536 hogares en estrato Alto", "estimated": true},
      "avg_income_soles": {"value": 8258, "source": "Ipsos Las 6 caras de Lima 2025, zona Lima Oeste (valor zonal, no distrital) - https://www.ipsos.com/sites/default/files/ct/publication/documents/2025-09/Perfiles%20Zonales%202025_V3.pdf", "estimated": true},
      "rent_usd_m2": {"value": 20.1, "source": "Mediana de 86 avisos InfoCasas al 23-sep-2026 (precio pedido / m2 construidos) - https://www.infocasas.com.pe/alquiler/locales-comerciales/lima/miraflores", "estimated": true},
      "pet_households_pct": {"value": 59.6, "source": "INEI ENAHO, valor de Lima Metropolitana (no distrital) - https://elperuano.pe/noticia/304297-inei-el-64-de-los-hogares-peruanos-tiene-mascota-perro-o-gato-cual-tienes-en-casa", "estimated": true},
      "vets_osm": {"value": 19, "source": "OpenStreetMap amenity=veterinary vía Overpass API, snapshot 2026-09-22 (cota inferior)", "estimated": true}
    },
    "San Isidro": {
      "population": {"value": 75000, "source": "CPI Market Report Población 2025, cuadro 9", "estimated": false},
      "households": {"value": 24500, "source": "CPI Market Report Población 2025, cuadro 9", "estimated": false},
      "nse_ab_pct": {"value": 100.0, "source": "INEI Planos Estratificados 2020; 21,045 de 21,045 hogares en estrato Alto", "estimated": true},
      "avg_income_soles": {"value": 8258, "source": "Ipsos 2025, zona Lima Oeste (valor zonal)", "estimated": true},
      "rent_usd_m2": {"value": 20.2, "source": "Mediana de 82 avisos InfoCasas al 23-sep-2026; Binswanger ago-2025 reporta US$14-30/m2 en locales de edificios - https://binswanger.com.pe/tendencias/edificios-de-san-isidro-con-23-locales-comerciales-libres/", "estimated": true},
      "pet_households_pct": {"value": 59.6, "source": "INEI ENAHO, valor de Lima Metropolitana (no distrital)", "estimated": true},
      "vets_osm": {"value": 3, "source": "OpenStreetMap vía Overpass API, snapshot 2026-09-22 (cota inferior)", "estimated": true}
    },
    "San Borja": {
      "population": {"value": 138800, "source": "CPI Market Report Población 2025, cuadro 9", "estimated": false},
      "households": {"value": 40300, "source": "CPI Market Report Población 2025, cuadro 9", "estimated": false},
      "nse_ab_pct": {"value": 99.8, "source": "INEI Planos Estratificados 2020; (32,666 Alto + 1,993 Medio alto) / 34,736 hogares", "estimated": true},
      "avg_income_soles": {"value": 8258, "source": "Ipsos 2025, zona Lima Oeste (valor zonal)", "estimated": true},
      "rent_usd_m2": {"value": 16.0, "source": "Mediana de 27 avisos InfoCasas al 23-sep-2026 - https://www.infocasas.com.pe/alquiler/locales-comerciales/lima/san-borja", "estimated": true},
      "pet_households_pct": {"value": 59.6, "source": "INEI ENAHO, valor de Lima Metropolitana (no distrital)", "estimated": true},
      "vets_osm": {"value": 5, "source": "OpenStreetMap vía Overpass API, snapshot 2026-09-22 (cota inferior)", "estimated": true}
    },
    "Santiago de Surco": {
      "population": {"value": 398500, "source": "CPI Market Report Población 2025, cuadro 9 (INEI proyecta 437,028 al 30-jun-2025: https://www.gob.pe/institucion/inei/noticias/1092367-lima-supera-los-10-millones-400-mil-habitantes)", "estimated": false},
      "households": {"value": 114500, "source": "CPI Market Report Población 2025, cuadro 9", "estimated": false},
      "nse_ab_pct": {"value": 95.3, "source": "INEI Planos Estratificados 2020; (65,237 Alto + 30,435 Medio alto) / 100,374 hogares", "estimated": true},
      "avg_income_soles": {"value": 8258, "source": "Ipsos 2025, zona Lima Oeste (valor zonal)", "estimated": true},
      "rent_usd_m2": {"value": 18.3, "source": "Mediana de 68 avisos InfoCasas al 23-sep-2026 - https://www.infocasas.com.pe/alquiler/locales-comerciales/lima/santiago-de-surco", "estimated": true},
      "pet_households_pct": {"value": 59.6, "source": "INEI ENAHO, valor de Lima Metropolitana (no distrital)", "estimated": true},
      "vets_osm": {"value": 26, "source": "OpenStreetMap vía Overpass API, snapshot 2026-09-22 (cota inferior)", "estimated": true}
    },
    "La Molina": {
      "population": {"value": 170300, "source": "CPI Market Report Población 2025, cuadro 9", "estimated": false},
      "households": {"value": 45800, "source": "CPI Market Report Población 2025, cuadro 9", "estimated": false},
      "nse_ab_pct": {"value": 96.3, "source": "INEI Planos Estratificados 2020; (35,107 Alto + 3,382 Medio alto) / 39,966 hogares", "estimated": true},
      "avg_income_soles": {"value": 8258, "source": "Ipsos 2025, zona Lima Oeste (valor zonal)", "estimated": true},
      "rent_usd_m2": {"value": 14.6, "source": "Mediana de 28 avisos InfoCasas al 23-sep-2026 - https://www.infocasas.com.pe/alquiler/locales-comerciales/lima/la-molina", "estimated": true},
      "pet_households_pct": {"value": 59.6, "source": "INEI ENAHO, valor de Lima Metropolitana (no distrital)", "estimated": true},
      "vets_osm": {"value": 8, "source": "OpenStreetMap vía Overpass API, snapshot 2026-09-22 (cota inferior)", "estimated": true}
    }
  }
}
```
