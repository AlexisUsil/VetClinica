# Brief de investigación B2B (firmographics · technographics · intención)

Hoy es 2026-09-30. Investigas empresas peruanas de UNA industria para una página de inteligencia comercial B2B.
Por cada empresa hay que llenar tres dimensiones con datos públicos verificables (WebSearch + WebFetch):

1. **Firmographics — ¿quién es la empresa?** RUC, razón social, CIIU, facturación (ventas o exportaciones FOB, último año disponible),
   n.º de empleados, plantas/unidades y su región, sede, estructura corporativa (grupo, accionistas, si cotiza en BVL/otra bolsa), etapa de crecimiento.
2. **Technographics — ¿con qué tecnología opera?** ERP (SAP, Oracle, Dynamics…), CRM, automatización/control (SCADA, PLC, DCS, despacho de flota,
   marcas tipo Siemens/Rockwell/ABB/Schneider/Honeywell), nube (AWS/Azure/GCP), parque de equipos y marcas (Caterpillar, Komatsu, flota pesquera,
   líneas de packing, riego, etc.), otros sistemas relevantes (BI, SSOMA, trazabilidad, IoT, IA).
3. **Datos de intención — ¿qué está investigando/comprando ahora?** No hay Bombora/6sense; se usan señales públicas de los últimos ~18 meses
   (2025-04 a 2026-09): proyectos y ampliaciones anunciados, capex aprobado, permisos ambientales (EIA/MEIA/ITS en SENACE, PRODUCE), licitaciones o
   concursos, contratos adjudicados a proveedores, picos de contratación (avisos en LinkedIn/Bumeran/Computrabajo, sobre todo perfiles de TI,
   proyectos, automatización), adquisiciones, financiamiento, participación en ferias (Perumin, Expomina, Expo Pesca, Fruit Logistica), pilotos tecnológicos.

## Dónde buscar (sugerencias)
- RUC/CIIU/empleados: páginas espejo de SUNAT (datosperu.org, universidadperu.com/empresas, compuempresa.com, rucperu, e-consultaruc), memoria anual, LinkedIn (rango de empleados).
- Facturación: SMV/BVL (estados financieros de emisoras), memoria anual o reporte de sostenibilidad, ranking Perú Top 10 000, exportaciones FOB por empresa
  (ADEX Data Trade, Agrodata Perú, SUNAT aduanas, Veritrade/notas de prensa), reportes del grupo matriz (20-F, annual report).
- Plantas: MINEM (unidades mineras), PRODUCE (plantas con licencia), webs corporativas, reportes de sostenibilidad.
- Tecnología: avisos de empleo ("SAP", "Oracle", "SCADA", "Power BI"), casos de éxito de proveedores (SAP, Seidor, Oracle, Microsoft, AWS, Siemens, ABB,
  Rockwell, Hexagon, Modular Mining, Wenco, Ferreyros, Komatsu-Mitsui, Marco Peruana…), notas de prensa (Rumbo Minero, Tecnología Minera, IIMP, Gestión, Agraria.pe,
  Agronoticias, Redagrícola, Mundo Acuícola, Aqua, SNP), ponencias, LinkedIn de empleados.
- Intención: Google News, ProActivo, Rumbo Minero, BNamericas (titulares), cartera de proyectos MINEM, SENACE, Gestión, Agraria.pe, Fresh Plaza, Portal Frutícola, Undercurrent News/SeafoodSource.

## Reglas
- **No inventes.** Si un dato no aparece tras buscar razonablemente, usa `null` (o lista vacía). Un `null` honesto vale más que un número dudoso.
- Cada dato lleva `fuente` (URL real que abriste o que salió en resultados de búsqueda) y, cuando aplique, `anio`.
- En technographics marca `confianza`: "alta" (lo dice la empresa o el proveedor), "media" (aviso de empleo / perfil LinkedIn / nota de terceros), "baja" (indicio indirecto).
- Señales de intención: cada una con `fecha` (AAAA-MM), `tipo`, `tema`, `titulo` (≤ 90 caracteres), `detalle` (1 frase) y `fuente`. Entre 2 y 6 por empresa si existen.
- `intencion.nivel`: "alto" = ≥ 2 señales fuertes en los últimos 6 meses (capex aprobado, obra/ampliación en curso, licitación o compra anunciada, pico de contratación);
  "medio" = alguna señal en 18 meses; "bajo" = sin señales relevantes.
- Textos en español, cortos (la página es visual, casi sin prosa). Montos en millones de USD (convierte PEN con el tipo de cambio del año e indícalo en `nota`).
- Valida la lista candidata: si una empresa no existe, se fusionó o ya no opera, reemplázala por otra relevante de la industria que NO esté en la lista del otro agente. Deben quedar exactamente 15.
- Presupuesto orientativo: ~8-12 búsquedas por empresa. Prioriza cubrir las 15 empresas completas antes que perfeccionar una.

## Salida
Escribe UN archivo JSON válido (UTF-8) en la ruta indicada, con este esquema exacto (las claves no cambian):

```json
{
  "industria": "mineria | pesca | agro",
  "empresas": [
    {
      "id": "slug-en-minusculas",
      "nombre": "Nombre comercial corto",
      "razon_social": "RAZÓN SOCIAL S.A.",
      "ruc": "20XXXXXXXXX",
      "subsector": "p. ej. Cobre · gran minería | Harina y aceite de pescado | Arándano y palta",
      "web": "https://…",
      "linkedin": "https://www.linkedin.com/company/… | null",
      "firmo": {
        "ciiu": {"codigo": "0729", "desc": "Extracción de otros minerales metalíferos no ferrosos", "fuente": "url"},
        "facturacion": {"usd_m": 1234.5, "anio": 2025, "tipo": "ventas | exportaciones FOB | estimado", "nota": "…", "fuente": "url"},
        "empleados": {"n": 3200, "anio": 2025, "nota": "propios; ~X contratistas / pico de campaña", "fuente": "url"},
        "sede": "San Isidro, Lima",
        "plantas": [{"nombre": "Mina Antamina", "tipo": "mina | planta | fundo | packing | puerto | flota | oficina", "region": "Áncash", "localidad": "San Marcos, Huari"}],
        "estructura": {"grupo": "…", "accionistas": "BHP 33.75 %, Glencore 33.75 %, …", "bolsa": "BVL: XXXX | NYSE: … | null", "fuente": "url"},
        "etapa": {"valor": "expansión | estable | contracción | reestructuración | nuevo proyecto", "evidencia": "1 frase", "fuente": "url"}
      },
      "tecno": [
        {"cat": "ERP | CRM | Automatización | Nube | Equipos | Datos/BI | Otros", "producto": "SAP S/4HANA", "evidencia": "1 frase", "anio": 2024, "confianza": "alta | media | baja", "fuente": "url"}
      ],
      "intencion": {
        "nivel": "alto | medio | bajo",
        "temas": ["automatización", "energía renovable"],
        "senales": [
          {"fecha": "2026-07", "tipo": "proyecto | inversión | permiso | licitación | contrato | contratación | adquisición | financiamiento | evento | piloto", "tema": "ampliación de planta", "titulo": "…", "detalle": "…", "fuente": "url"}
        ]
      }
    }
  ]
}
```

Al terminar: valida con `python -c "import json;d=json.load(open(RUTA,encoding='utf-8'));print(len(d['empresas']))"` y responde solo con un resumen de 5 líneas
(cuántas empresas, cobertura de cada dimensión, reemplazos hechos, vacíos notables).
