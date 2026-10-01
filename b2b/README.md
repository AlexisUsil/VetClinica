# B2B – firmographics, technographics e intención (minería, pesca, agroexportación)

La página se publica desde un repo aparte para que el link no diga VetClinica: `../b2b/index.html` (github.com/AlexisUsil/b2b)
→ https://alexisusil.github.io/b2b/ (sin enlace desde la página de veterinarias y con `noindex`; solo se llega con el link).

## Pipeline
1. **Investigación** (agentes, ver `BRIEF.md`) → `data/<industria>_<a|b>.json`, 15 empresas por archivo, cada dato con su fuente.
2. `python b2b/enrich.py [paso…]` → `data/auto.json` (con cache; borrar la clave o el archivo para refrescar):
   - `padron`: valida/completa el RUC contra el padrón reducido SUNAT (`data/sunat/padron_reducido_ruc.zip`).
   - `sunat`: ficha SUNAT en datosperu.org (CIIU, planilla mensual, establecimientos anexos).
   - `sitio`: web de las empresas sin web conocida (Google Places).
   - `web`: tecnología visible en el sitio y en los registros MX/TXT del dominio.
   - `subdom`: tecnología delatada por nombres de subdominio en certificados TLS públicos (Cert Spotter ~10 consultas/hora, luego crt.sh, lento: correrlo varias veces).
   - `news` / `tech`: titulares de Google News (pulso mensual, señales, marcas citadas).
   - `geo`: coordenadas de plantas (Google Places Text Search, ~300 llamadas en total: dentro del cupo gratuito).
3. `cd b2b && python build.py` → une todo en `../b2b/index.html`; luego commit + push en ese repo (un solo archivo; Leaflet por CDN).

## Límites conocidos
- Intención = señales públicas (proyectos, permisos, contratos, contrataciones, prensa). No hay datos de pago tipo Bombora/6sense.
- La investigación web se quedó sin cupo de búsquedas (200 por sesión): ERP/CRM identificados en pocas empresas; «s/d» = sin dato público.
- Facturación: ventas reportadas donde existen; en pesca y agro suele ser exportación FOB (ver `tipo` y `nota` de cada empresa).
- Planilla SUNAT es estacional en pesca y agro.
