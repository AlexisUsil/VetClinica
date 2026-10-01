"""Enriquecimiento determinista de b2b/data/<industria>_<x>.json -> b2b/data/auto.json (con cache; borrar auto.json para refrescar).
  padron : valida el RUC contra el padrón reducido SUNAT (data/sunat/padron_reducido_ruc.zip)
  sitio  : sitio web de las empresas sin web conocida (Google Places Text Search)
  web    : huella tecnológica del sitio (HTML + cabeceras) y del dominio (registros MX/TXT públicos)
  subdom : tecnologías delatadas por nombres de subdominio en certificados TLS públicos (Cert Spotter)
  news   : titulares de Google News RSS (pulso mensual + señales por palabra clave)
  sunat  : ficha SUNAT publicada en datosperu.org (CIIU, inicio de actividades, planilla mensual, establecimientos anexos)
  tech   : menciones de marcas/tecnologías en titulares de prensa (Google News RSS)
  geo    : coordenadas de plantas con Google Places Text Search (clave en .env)
Uso: python b2b/enrich.py [padron] [sunat] [sitio] [web] [subdom] [news] [tech] [geo]   (sin argumentos = todo)"""
import json, re, sys, time, html as htmllib, zipfile, pathlib, unicodedata, urllib.request, urllib.parse, urllib.error, collections
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime

ROOT = pathlib.Path(__file__).parent.parent
OUT = ROOT / 'b2b/data/auto.json'
UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36'}
DEP = {'01':'Amazonas','02':'Áncash','03':'Apurímac','04':'Arequipa','05':'Ayacucho','06':'Cajamarca','07':'Callao','08':'Cusco','09':'Huancavelica',
       '10':'Huánuco','11':'Ica','12':'Junín','13':'La Libertad','14':'Lambayeque','15':'Lima','16':'Loreto','17':'Madre de Dios','18':'Moquegua',
       '19':'Pasco','20':'Piura','21':'Puno','22':'San Martín','23':'Tacna','24':'Tumbes','25':'Ucayali'}
# centroides aproximados por región: respaldo cuando Places no ubica la planta
CENTRO = {'Amazonas':(-5.9,-78.1),'Áncash':(-9.4,-77.6),'Apurímac':(-14.0,-72.9),'Arequipa':(-15.9,-72.3),'Ayacucho':(-13.9,-74.2),'Cajamarca':(-6.6,-78.7),
          'Callao':(-12.02,-77.12),'Cusco':(-13.9,-71.9),'Huancavelica':(-12.9,-75.0),'Huánuco':(-9.6,-76.1),'Ica':(-14.1,-75.6),'Junín':(-11.6,-75.4),
          'La Libertad':(-8.0,-78.5),'Lambayeque':(-6.4,-79.9),'Lima':(-11.9,-76.8),'Loreto':(-4.5,-74.5),'Madre de Dios':(-11.9,-70.6),'Moquegua':(-16.9,-70.8),
          'Pasco':(-10.6,-75.9),'Piura':(-5.0,-80.4),'Puno':(-15.2,-70.0),'San Martín':(-7.2,-76.7),'Tacna':(-17.6,-70.3),'Tumbes':(-3.8,-80.5),'Ucayali':(-9.6,-73.5)}

def norm(s): return re.sub(r'[^A-Z0-9]+', ' ', unicodedata.normalize('NFKD', s or '').encode('ascii', 'ignore').decode().upper()).strip()
def fetch(url, headers=UA, timeout=25, data=None):
    return urllib.request.urlopen(urllib.request.Request(url, headers=headers, data=data), timeout=timeout)
def empresas():
    out = []
    for f in sorted((ROOT / 'b2b/data').glob('*_[ab].json')):
        d = json.loads(f.read_text(encoding='utf-8'))
        for e in d['empresas']: out.append((d['industria'], e))
    return out

# ---------- padrón SUNAT ----------
def padron(emp, auto):
    rucs = {e['ruc']: e['id'] for _, e in emp if e.get('ruc')}
    names = {norm(e['razon_social']): e['id'] for _, e in emp if e.get('razon_social')}
    with zipfile.ZipFile(ROOT / 'data/sunat/padron_reducido_ruc.zip') as z, z.open(z.namelist()[0]) as fh:
        for raw in fh:
            if not raw.startswith(b'20'): continue      # personas jurídicas
            r = raw.decode('latin-1').rstrip('\r\n').split('|')
            eid = rucs.get(r[0]); how = 'ruc'
            if not eid:
                eid = names.get(norm(r[1])); how = 'razón social'
                if not eid or auto.get(eid, {}).get('padron', {}).get('how') == 'ruc': continue
            auto.setdefault(eid, {})['padron'] = {'ruc': r[0], 'razon': r[1].strip(), 'estado': r[2], 'condicion': r[3], 'region': DEP.get(r[4][:2]),
                'dir': ' '.join(x for x in (r[5], r[6], r[9]) if x and x != '-'), 'how': how}
    ok = sum('padron' in auto.get(e['id'], {}) for _, e in emp)
    print(f'padrón: {ok}/{len(emp)} empresas encontradas')

# ---------- ficha SUNAT (datosperu.org) ----------
def sunat(emp, auto):
    for _, e in emp:
        a = auto.setdefault(e['id'], {}); ruc = (a.get('padron') or {}).get('ruc') or e.get('ruc')
        if 'sunat' in a or not ruc: continue
        url = f'https://www.datosperu.org/empresa-x-{ruc}.php'     # el slug es libre: la página resuelve por RUC
        try: raw = fetch(url).read().decode('utf-8', 'ignore')
        except Exception as ex: print('  sunat falló', e['id'], str(ex)[:60]); continue
        t = re.sub(r'<script.*?</script>|<style.*?</style>', '', raw, flags=re.S)
        t = re.sub(r'[|\s]*\|[|\s]*', ' | ', htmllib.unescape(re.sub(r'<[^>]+>', '|', t)))
        if f'RUC: {ruc}' not in t: print('  sunat sin ficha', e['id']); continue
        ci = re.search(r'CIIU: (\d+) \| Principal \| ([^|]+)', t); ini = re.search(r'Fecha Inicio Actividades \| ([^|]+)', t)
        trab = sorted((m[0], int(m[1])) for m in re.findall(r'\| (20\d\d-\d\d) \| (\d+) \| \d+ \| \d+', t))
        anx = re.search(r'ESTABLECIMIENTOS ANEXOS \| Direcci.n \| Tipo Establecimiento \| (.*?)(?= \| [A-ZÁÉÍÓÚ ]{12,} \| (?![A-Z]{2}\. ))', t)
        anexos = [{'dir': d.strip(), 'ubi': u.strip().title(), 'tipo': tp.strip()} for d, u, tp in
                  re.findall(r'([^|/]+) / ([^|]+?) \| [A-Z]{2}\.\s+([^|]+?) \|', (anx.group(1) + ' |') if anx else '')]
        a['sunat'] = {'url': f'https://www.datosperu.org/empresa-x-{ruc}.php', 'ciiu': {'codigo': ci.group(1), 'desc': ci.group(2).strip().capitalize()} if ci else None,
                      'inicio': ini.group(1).strip() if ini else None, 'trab': trab, 'anexos': anexos}
        print(f"  {e['id']}: CIIU {ci.group(1) if ci else '-'} · {trab[-1][1] if trab else '-'} trabajadores · {len(anexos)} anexos"); time.sleep(1)

# ---------- huella tecnológica ----------
HTML_SIG = [  # (categoría, producto, regex sobre el HTML de la home)
    ('Web', 'WordPress', r'wp-content|wp-includes'), ('Web', 'Drupal', r'drupal-settings-json|/sites/default/files'), ('Web', 'Wix', r'static\.wixstatic\.com'),
    ('Web', 'Webflow', r'assets\.website-files\.com|webflow\.js'), ('Web', 'Next.js', r'/_next/static'), ('Web', 'Elementor', r'elementor'),
    ('Web', 'Adobe Experience Manager', r'/etc\.clientlibs/|/content/dam/'), ('Web', 'Sitecore', r'/-/media/|sitecore'),
    ('Marketing', 'Google Tag Manager', r'googletagmanager\.com/gtm'), ('Marketing', 'Google Analytics', r'gtag/js|google-analytics\.com'),
    ('Marketing', 'Meta Pixel', r'connect\.facebook\.net'), ('Marketing', 'LinkedIn Insight Tag', r'snap\.licdn\.com'),
    ('Marketing', 'Hotjar', r'static\.hotjar\.com'), ('Marketing', 'Microsoft Clarity', r'clarity\.ms'),
    ('CRM', 'HubSpot', r'js\.hs-scripts\.com|hsforms|hs-analytics'), ('CRM', 'Salesforce', r'pardot\.com|force\.com|salesforce\.com'),
    ('CRM', 'Zoho', r'zoho\.com|salesiq'), ('CRM', 'Zendesk', r'zdassets\.com|zendesk'),
    ('RR. HH.', 'SAP SuccessFactors', r'successfactors'), ('RR. HH.', 'Workday', r'myworkdayjobs'), ('RR. HH.', 'Oracle Taleo', r'taleo\.net'),
    ('RR. HH.', 'Buk', r'buk\.(pe|cl)'), ('RR. HH.', 'Bumeran (portal propio)', r'bumeran\.com'), ('RR. HH.', 'Krowdy', r'krowdy'),
    ('Cumplimiento', 'OneTrust', r'onetrust|cookielaw\.org'), ('Cumplimiento', 'Canal ético EthicsPoint/NAVEX', r'ethicspoint|navex'),
]
HDR_SIG = [('Nube', 'Cloudflare', r'cloudflare'), ('Nube', 'Amazon CloudFront (AWS)', r'cloudfront|x-amz-'), ('Nube', 'Microsoft Azure', r'x-azure|azurewebsites|x-ms-|x-msedge'),
           ('Nube', 'Akamai', r'akamai'), ('Nube', 'Vercel', r'vercel'), ('Nube', 'Google Cloud', r'x-goog-|via: 1\.1 google|server: gws|google frontend'),
           ('Web', 'Microsoft IIS / ASP.NET', r'microsoft-iis|x-aspnet|x-powered-by: asp'), ('Web', 'Nginx', r'server: nginx'), ('Web', 'Apache', r'server: apache'),
           ('Web', 'LiteSpeed', r'litespeed'), ('Web', 'PHP', r'x-powered-by: php')]
MX_SIG = [('Correo', 'Microsoft 365', r'outlook\.com|protection\.outlook'), ('Correo', 'Google Workspace', r'google\.com|googlemail'),
          ('Seguridad', 'Proofpoint', r'pphosted|ppe-hosted'), ('Seguridad', 'Mimecast', r'mimecast'), ('Seguridad', 'Barracuda', r'barracuda'),
          ('Seguridad', 'Cisco Secure Email', r'iphmx'), ('Seguridad', 'Trend Micro Email Security', r'trendmicro|tmes'), ('Seguridad', 'Symantec Email Security', r'messagelabs'),
          ('Seguridad', 'Sophos Email', r'sophos'), ('Seguridad', 'Fortinet FortiMail', r'fortimail'), ('Seguridad', 'Trellix / FireEye', r'fireeyecloud|trellix'),
          ('Correo', 'Zoho Mail', r'zoho')]
TXT_SIG = [('Correo', 'Microsoft 365', r'spf\.protection\.outlook|^"?MS=ms'), ('Correo', 'Google Workspace', r'_spf\.google\.com'),
           ('CRM', 'Salesforce', r'salesforce\.com|exacttarget|pardot|SFMC'), ('CRM', 'HubSpot', r'hubspot'), ('CRM', 'Microsoft Dynamics 365', r'dynamics|d365'),
           ('CRM', 'Zendesk', r'zendesk'), ('CRM', 'Freshworks', r'freshdesk|freshworks|freshservice'), ('CRM', 'Zoho', r'zoho'),
           ('Marketing', 'Mailchimp', r'mcsv\.net|mailchimp|mandrill'), ('Marketing', 'SendGrid', r'sendgrid'), ('Marketing', 'Marketo', r'mktomail|marketo'),
           ('Marketing', 'Oracle Eloqua', r'eloqua'), ('Marketing', 'Brevo', r'sendinblue|brevo'), ('Nube', 'Amazon SES (AWS)', r'amazonses'),
           ('ERP', 'SAP (servicios en la nube)', r'\bsap\b|successfactors|ariba|sapsf|concur'), ('ERP', 'Oracle Cloud', r'oraclecloud|oracle\.com|netsuite'),
           ('Colaboración', 'Atlassian', r'atlassian'), ('Colaboración', 'Slack', r'slack-domain'), ('Colaboración', 'Zoom', r'zoom'),
           ('Colaboración', 'Cisco Webex', r'cisco-ci-domain|webex'), ('Colaboración', 'Miro', r'miro-verification'), ('Colaboración', 'Smartsheet', r'smartsheet'),
           ('Colaboración', 'DocuSign', r'docusign'), ('Colaboración', 'Adobe', r'adobe-idp|adobe-sign'), ('Colaboración', 'Dropbox', r'dropbox'),
           ('Colaboración', 'Box', r'box-domain'), ('Colaboración', 'Workplace (Meta)', r'workplace-domain'), ('Colaboración', 'Notion', r'notion-domain'),
           ('TI', 'ServiceNow', r'servicenow|service-now'), ('TI', 'Apple Business Manager', r'apple-domain'), ('TI', 'TeamViewer', r'teamviewer'),
           ('TI', 'Citrix', r'citrix'), ('Seguridad', 'KnowBe4', r'knowbe4'), ('Seguridad', 'Proofpoint', r'pphosted|proofpoint'),
           ('Seguridad', 'Mimecast', r'mimecast'), ('Seguridad', 'Cisco Duo', r'duo_sso'), ('Seguridad', 'Okta', r'okta'),
           ('Datos/BI', 'Tableau', r'tableau'), ('Datos/BI', 'MongoDB Atlas', r'mongodb'), ('Datos/BI', 'Autodesk', r'autodesk'),
           ('Nube', 'Amazon Web Services', r'amazonaws|aws-'), ('Marketing', 'Meta Business', r'facebook-domain-verification'),
           ('Marketing', 'Google Search Console', r'google-site-verification')]

def dns(name, typ):
    try:
        d = json.load(fetch(f'https://dns.google/resolve?name={urllib.parse.quote(name)}&type={typ}', timeout=15))
        return [a.get('data', '') for a in d.get('Answer', [])]
    except Exception: return []
def web(emp, auto):
    for _, e in emp:
        a = auto.setdefault(e['id'], {})
        url = e.get('web') or a.get('sitio')
        if 'web' in a or not url: continue
        url = url if url.startswith('http') else 'https://' + url
        dom = re.sub(r'^www\.', '', urllib.parse.urlparse(url).netloc.lower())
        hits = {}   # producto -> (cat, evidencia)
        try:
            r = fetch(url); html = r.read(600_000).decode('utf-8', 'ignore'); hdr = '\n'.join(f'{k}: {v}' for k, v in r.headers.items()).lower()
            for cat, prod, rx in HTML_SIG:
                if re.search(rx, html, re.I): hits.setdefault(prod, (cat, 'código del sitio web'))
            for cat, prod, rx in HDR_SIG:
                if re.search(rx, hdr): hits.setdefault(prod, (cat, 'cabeceras del servidor web'))
            ok = True
        except Exception as ex: ok = False; print('  web falló', e['id'], str(ex)[:60])
        for cat, prod, rx in MX_SIG:
            if any(re.search(rx, x, re.I) for x in dns(dom, 'MX')): hits.setdefault(prod, (cat, 'registro MX del dominio'))
        txt = dns(dom, 'TXT')
        for cat, prod, rx in TXT_SIG:
            if any(re.search(rx, x, re.I) for x in txt): hits.setdefault(prod, (cat, 'registro TXT del dominio'))
        a['web'] = {'dominio': dom, 'ok': ok, 'tech': [{'cat': c, 'producto': p, 'evidencia': ev} for p, (c, ev) in hits.items()]}
        print(f"  {e['id']}: {len(hits)} tecnologías"); time.sleep(.3)

# ---------- subdominios en certificados públicos ----------
SUB_SIG = [('ERP', 'SAP', r'(^|[.-])sap|fiori|s4hana|hana|saprouter|netweaver|ariba'), ('ERP', 'Oracle', r'(^|[.-])(oracle|ebs|jde|peoplesoft|hyperion)'),
           ('ERP', 'Microsoft Dynamics', r'dynamics|d365|navision|axapta'), ('ERP', 'Odoo', r'odoo'), ('ERP', 'Nisira', r'nisira'),
           ('Automatización', 'Ellipse EAM (ABB/Hitachi)', r'ellipse|(^|[.-])ell(prd|tst|dev|qa)'), ('Automatización', 'IBM Maximo', r'maximo'),
           ('Automatización', 'SCADA / historiador de planta', r'scada|pivision|piweb|osisoft|historian'), ('Automatización', 'Gestión de flota minera', r'dispatch|minestar|jigsaw|wenco|minecare'),
           ('Datos/BI', 'Tableau', r'tableau'), ('Datos/BI', 'Power BI', r'powerbi|(^|[.-])pbi'), ('Datos/BI', 'Qlik', r'qlik'), ('Datos/BI', 'Esri ArcGIS', r'arcgis|(^|[.-])gis|geoportal'),
           ('TI', 'Citrix', r'citrix|sharefile|netscaler|storefront|xenapp'), ('TI', 'Escritorios virtuales (VDI)', r'(^|[.-])vdi|horizon|workspaceone|airwatch'),
           ('TI', 'Mesa de ayuda', r'servicedesk|helpdesk|mesadeayuda|glpi|otrs'), ('TI', 'Gestión de dispositivos móviles', r'(^|[.-])mdm|intune|mobileiron'),
           ('Colaboración', 'Telefonía Cisco', r'cucm|expressway|(^|[.-])expe'), ('Colaboración', 'Atlassian', r'jira|confluence'),
           ('Colaboración', 'SharePoint / intranet', r'sharepoint|intranet|(^|[.-])sp(prd|qa)'), ('Correo', 'Microsoft Exchange', r'autodiscover|(^|[.-])owa|lyncdiscover|adfs'),
           ('Seguridad', 'Fortinet', r'forti'), ('Seguridad', 'Palo Alto GlobalProtect', r'globalprotect|(^|[.-])gp\.'), ('Seguridad', 'VPN corporativa', r'vpn'),
           ('RR. HH.', 'Aula virtual / e-learning', r'moodle|elearning|(^|[.-])aula|campus|capacita'), ('RR. HH.', 'Portal de RR. HH.', r'rrhh|talento|ofiplan|adryan|successfactors'),
           ('Otros', 'Portal de proveedores', r'proveedor|supplier|(^|[.-])srm'), ('Otros', 'WMS / TMS logístico', r'(^|[.-])(wms|tms)'), ('Otros', 'Gestor documental', r'alfresco|docuware|laserfiche|onbase')]
def subdom(emp, auto):
    lento = False
    for _, e in emp:
        a = auto.setdefault(e['id'], {}); dom = (a.get('web') or {}).get('dominio')
        if 'subdom' in a or not dom: continue
        # ponytail: Cert Spotter sin clave (rápido, pero ~10 consultas/hora y solo certificados vigentes); al toparse el límite se sigue con crt.sh (lento, 1 intento)
        try:
            if lento: hosts = {n.lower() for r in json.load(fetch(f'https://crt.sh/?q=%25.{dom}&output=json', timeout=45)) for n in r['name_value'].split()}
            else: hosts = {n.lower() for r in json.load(fetch(f'https://api.certspotter.com/v1/issuances?domain={dom}&include_subdomains=true&expand=dns_names', timeout=40)) for n in r['dns_names']}
        except urllib.error.HTTPError as ex:
            if ex.code == 429: lento = True
            print('  subdom falló', e['id'], ex.code); continue
        except Exception as ex: print('  subdom falló', e['id'], str(ex)[:60]); continue
        subs = [h[:-len(dom) - 1] for h in hosts if h.endswith('.' + dom)]
        # no se guarda el nombre del host (no aporta al lector y evita publicar un inventario de servidores)
        a['subdom'] = {'n': len(subs), 'tech': [{'cat': c, 'producto': p, 'evidencia': f'nombre de subdominio de {dom} en certificados TLS públicos'}
                                                 for c, p, rx in SUB_SIG if any(re.search(rx, h) for h in subs)]}
        print(f"  {e['id']}: {len(subs)} subdominios -> {', '.join(t['producto'] for t in a['subdom']['tech']) or '-'}"); time.sleep(2)
        OUT.write_text(json.dumps(auto, ensure_ascii=False, indent=1), encoding='utf-8')     # paso lento: se guarda tras cada empresa

# ---------- Google News ----------
CTX = {'mineria': 'minera OR minería', 'pesca': 'pesquera OR pesca OR pesquería', 'agro': 'agrícola OR agroexportadora OR agro OR exportación'}
KW = [('inversión', r'invers|invertir|capex|millones'), ('ampliación', r'ampliaci|expansi|nueva planta|nueva mina|crecer'), ('proyecto', r'proyecto|construcci|pondr[áa] en marcha'),
      ('permiso', r'\bEIA\b|\bMEIA\b|\bITS\b|senace|autoriza|aprueba'), ('adquisición', r'adquisi|adquiere|compra de|compra a|fusi[óo]n|venta de'),
      ('tecnología', r'tecnolog|digital|automatiz|aut[óo]nom|inteligencia artificial|\bIA\b|SAP|el[ée]ctric|renovable|solar|hidr[óo]geno'),
      ('contratación', r'contratar|convocatoria|puestos de trabajo|empleos'), ('financiamiento', r'financiamiento|bonos|pr[ée]stamo|cr[ée]dito')]
NEG = re.compile(r'beca|escolar|educa|catedral|j[óo]venes|donaci|comunidad|obras por impuestos|campaña|voluntari|navidad|salud|deport|festival', re.I)
GEN = set('COMPANIA MINERA MINAS SOCIEDAD PESQUERA AGRICOLA AGROINDUSTRIAL AGROINDUSTRIAS COMPLEJO CORPORACION GROUP GRUPO PERU INVERSIONES EMPRESA SA SAC SAA DE DEL LA EL LOS LAS Y INC '
          'RESOURCES MINING CORPORATION CONSORCIO MINERO PRODUCTORA EXPORTADORA INTERNATIONAL'.split())
def clave(nombre):
    """Palabras distintivas del nombre ('Compañía Minera Poderosa' -> ['PODEROSA']): así se busca y se filtra en prensa."""
    t = [w for w in norm(nombre).split() if w not in GEN]
    return t or norm(nombre).split()
def en_titulo(t, need):
    # ponytail: exige las palabras distintivas del nombre escritas con mayúscula inicial ("Poderosa" sí, "más poderosa" no); homónimos aún pueden colarse
    caps = {norm(w) for w in re.findall(r'\w+', t) if w[0].isupper()}
    return all(w in caps for w in need)
def news(emp, auto):
    for ind, e in emp:
        a = auto.setdefault(e['id'], {})
        if 'news' in a: continue
        cl = clave(e['nombre']); need = [w for w in cl if len(w) >= 4] or cl
        q = f'"{" ".join(cl).title()}" ({CTX[ind]}) after:2025-10-01'
        url = 'https://news.google.com/rss/search?' + urllib.parse.urlencode({'q': q, 'hl': 'es-419', 'gl': 'PE', 'ceid': 'PE:es-419'})
        try: items = ET.fromstring(fetch(url).read()).findall('.//item')
        except Exception as ex: print('  news falló', e['id'], str(ex)[:60]); continue
        meses = collections.Counter(); tit = []
        for it in items:
            try: f = parsedate_to_datetime(it.findtext('pubDate')).strftime('%Y-%m-%d')
            except Exception: continue
            t = it.findtext('title') or ''
            if not en_titulo(t, need): continue
            meses[f[:7]] += 1
            tema = None if NEG.search(t) else next((k for k, rx in KW if re.search(rx, t, re.I)), None)
            if tema: tit.append({'fecha': f, 'tema': tema, 'titulo': t.rsplit(' - ', 1)[0][:140], 'medio': it.findtext('source') or '', 'url': it.findtext('link')})
        tit.sort(key=lambda x: x['fecha'], reverse=True)
        a['news'] = {'total': sum(meses.values()), 'meses': dict(sorted(meses.items())), 'titulares': tit[:6]}
        print(f"  {e['id']}: {a['news']['total']} noticias, {len(tit)} con señal"); time.sleep(.5)

# ---------- tecnología en prensa ----------
TECH = [('ERP', 'SAP', r'SAP|S/4 ?HANA'), ('ERP', 'Oracle', r'Oracle'), ('ERP', 'Microsoft Dynamics', r'Dynamics 365'), ('CRM', 'Salesforce', r'Salesforce'),
        ('Nube', 'AWS', r'AWS|Amazon Web Services'), ('Nube', 'Microsoft Azure', r'Azure'), ('Nube', 'Google Cloud', r'Google Cloud'), ('Otros', 'Microsoft', r'Microsoft'),
        ('Automatización', 'Siemens', r'Siemens'), ('Automatización', 'ABB', r'ABB'), ('Automatización', 'Rockwell Automation', r'Rockwell'), ('Automatización', 'Schneider Electric', r'Schneider'),
        ('Automatización', 'Honeywell', r'Honeywell'), ('Automatización', 'Emerson', r'Emerson'), ('Automatización', 'Hexagon', r'Hexagon'),
        ('Automatización', 'Camiones autónomos', r'cami[óo]n(es)? aut[óo]nom|acarreo aut[óo]nom|flota aut[óo]noma'), ('Automatización', 'Centro de operaciones remotas', r'operaciones? remotas?|centro integrado de operaciones'),
        ('Equipos', 'Caterpillar', r'Caterpillar|CAT|Ferreyros'), ('Equipos', 'Komatsu', r'Komatsu'), ('Equipos', 'Liebherr', r'Liebherr'), ('Equipos', 'Sandvik', r'Sandvik'), ('Equipos', 'Epiroc', r'Epiroc'),
        ('Equipos', 'Hitachi', r'Hitachi'), ('Equipos', 'Metso', r'Metso'), ('Equipos', 'FLSmidth', r'FLSmidth'), ('Equipos', 'Scania', r'Scania'), ('Equipos', 'Volvo', r'Volvo'),
        ('Equipos', 'Vehículos eléctricos', r'(cami[óo]n|bus|veh[íi]culo|equipo)s? el[ée]ctric'), ('Equipos', 'Drones', r'dron(es)?'),
        ('Datos/BI', 'Inteligencia artificial', r'inteligencia artificial|IA|machine learning'), ('Datos/BI', 'Gemelo digital', r'gemelo digital'), ('Datos/BI', 'Power BI', r'Power BI'),
        ('Otros', 'Red privada LTE/5G', r'5G|LTE'), ('Otros', 'Starlink', r'Starlink'), ('Otros', 'Energía solar', r'solar|fotovoltaic'), ('Otros', 'Hidrógeno verde', r'hidr[óo]geno'),
        ('Otros', 'Desalinización', r'desalin|desaladora'), ('Otros', 'Blockchain / trazabilidad', r'blockchain|trazabilidad')]
def tech(emp, auto):
    q2 = '(SAP OR Oracle OR Siemens OR ABB OR Caterpillar OR Komatsu OR autónomos OR automatización OR digital OR "inteligencia artificial" OR tecnología OR eléctricos OR solar OR 5G)'
    for ind, e in emp:
        a = auto.setdefault(e['id'], {})
        if 'technews' in a: continue
        cl = clave(e['nombre']); need = [w for w in cl if len(w) >= 4] or cl
        url = 'https://news.google.com/rss/search?' + urllib.parse.urlencode({'q': f'"{" ".join(cl).title()}" ({CTX[ind]}) {q2} after:2023-01-01', 'hl': 'es-419', 'gl': 'PE', 'ceid': 'PE:es-419'})
        try: items = ET.fromstring(fetch(url).read()).findall('.//item')
        except Exception as ex: print('  tech falló', e['id'], str(ex)[:60]); continue
        hits = {}
        for it in items:
            t = (it.findtext('title') or '').rsplit(' - ', 1)[0]
            if not en_titulo(t, need): continue
            try: anio = parsedate_to_datetime(it.findtext('pubDate')).year
            except Exception: continue
            for cat, prod, rx in TECH:
                if re.search(rx, t) and (prod not in hits or anio > hits[prod]['anio']):
                    hits[prod] = {'cat': cat, 'producto': prod, 'evidencia': f'«{t[:150]}» ({it.findtext("source") or "prensa"})', 'anio': anio, 'fuente': it.findtext('link')}
        a['technews'] = list(hits.values())
        print(f"  {e['id']}: {', '.join(hits) or '-'}"); time.sleep(.5)

# ---------- Google Places (coordenadas de plantas) ----------
def places(body, mask):
    key = next(l.split('=', 1)[1].strip() for l in (ROOT / '.env').read_text().splitlines() if l.startswith('GOOGLE_PLACES_API_KEY='))
    try:
        return json.load(fetch('https://places.googleapis.com/v1/places:searchText', data=json.dumps({**body, 'languageCode': 'es', 'regionCode': 'PE'}).encode(),
            headers={'Content-Type': 'application/json', 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': mask})).get('places') or []
    except urllib.error.HTTPError as ex: raise SystemExit(f'Places HTTP {ex.code}: {ex.read().decode()[:300]}')
def sitio(emp, auto):
    for _, e in emp:
        a = auto.setdefault(e['id'], {})
        if e.get('web') or 'sitio' in a: continue
        need = clave(e['nombre']); a['sitio'] = None
        for pl in places({'textQuery': f"{e.get('razon_social') or e['nombre']} Perú", 'pageSize': 5}, 'places.displayName,places.websiteUri'):
            w = pl.get('websiteUri', '')
            # solo si el nombre del lugar contiene el nombre de la empresa y la web no es una red social
            if w and all(x in norm(pl['displayName']['text']).split() for x in need) and not re.search(r'facebook|instagram|linkedin|wa\.me|linktr', w):
                a['sitio'] = re.sub(r'\?.*$', '', w); break
        print(f"  {e['id']}: {a['sitio']}")
def geo(emp, auto):
    calls = 0
    for _, e in emp:
        a = auto.setdefault(e['id'], {}); g = a.setdefault('geo', {})
        pls = e['firmo'].get('plantas') or [{'nombre': 'Sede productiva · ' + u.split(' - ')[-1], 'localidad': ', '.join(reversed(u.split(' - ')))}     # mismo respaldo que build.py
              for u in dict.fromkeys(x['ubi'] for x in (a.get('sunat') or {}).get('anexos', []) if 'PRODUCTIVA' in x['tipo'])][:6]
        for p in pls:
            if p.get('tipo') in ('oficina', 'flota') or p['nombre'] in g: continue
            body = {'textQuery': ' '.join(x for x in (p['nombre'] if 'Sede productiva' not in p['nombre'] else '', e['nombre'], p.get('localidad'), p.get('region'), 'Perú') if x), 'pageSize': 1}
            pl = (places(body, 'places.displayName,places.formattedAddress,places.location') or [None])[0]; calls += 1
            # se acepta solo si cae dentro de Perú; si no, queda el centroide de la región
            if pl and -18.5 < pl['location']['latitude'] < 0 and -81.5 < pl['location']['longitude'] < -68.5:
                g[p['nombre']] = {'lat': round(pl['location']['latitude'], 4), 'lon': round(pl['location']['longitude'], 4), 'lugar': pl['displayName']['text'], 'dir': pl.get('formattedAddress', '')}
            else: g[p['nombre']] = None
    print(f'geo: {calls} llamadas a Places Text Search')

if __name__ == '__main__':
    emp = empresas()
    auto = json.loads(OUT.read_text(encoding='utf-8')) if OUT.exists() else {}
    steps = sys.argv[1:] or ['padron', 'sunat', 'sitio', 'web', 'subdom', 'news', 'tech', 'geo']
    for s in steps:
        print('==', s); {'padron': padron, 'sunat': sunat, 'sitio': sitio, 'web': web, 'subdom': subdom, 'news': news, 'tech': tech, 'geo': geo}[s](emp, auto)
        OUT.write_text(json.dumps(auto, ensure_ascii=False, indent=1), encoding='utf-8')
