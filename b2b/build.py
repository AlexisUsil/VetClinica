"""Une b2b/data/<industria>_<a|b>.json (investigación) + b2b/data/auto.json (enrich.py) y genera ../b2b/index.html (repo AlexisUsil/b2b, GitHub Pages).
Uso: python b2b/build.py"""
import json, re, pathlib, datetime, unicodedata, hashlib
from enrich import CENTRO, ROOT

IND = [('mineria', 'Minería'), ('pesca', 'Pesca'), ('agro', 'Agroexportación')]
MARCAS = [('SAP', r'\bSAP\b|successfactors|ariba|hana'), ('Oracle', r'oracle|jd ?edwards|peoplesoft|netsuite|primavera'), ('Microsoft Dynamics', r'dynamics|navision|\bAX\b'),
          ('Microsoft 365', r'microsoft 365|office 365|\bM365\b|sharepoint|teams'), ('Microsoft Azure', r'azure'), ('Power BI', r'power ?bi'), ('AWS', r'\bAWS\b|amazon'),
          ('Google Cloud', r'google cloud|\bGCP\b|bigquery'), ('Google Workspace', r'google workspace|g suite'), ('Salesforce', r'salesforce'),
          ('Caterpillar', r'caterpillar|\bCAT\b|minestar|ferreyros'), ('Komatsu', r'komatsu|modular mining|dispatch'), ('Hexagon', r'hexagon|minesight|jigsaw'),
          ('Siemens', r'siemens'), ('ABB', r'\bABB\b'), ('Rockwell', r'rockwell|allen.bradley'), ('Schneider Electric', r'schneider|aveva|wonderware'), ('Honeywell', r'honeywell'),
          ('Emerson', r'emerson|deltav'), ('Sandvik', r'sandvik'), ('Epiroc', r'epiroc'), ('Liebherr', r'liebherr'), ('Hitachi', r'hitachi|wenco'), ('Metso', r'metso|outotec'),
          ('FLSmidth', r'flsmidth'), ('OSIsoft PI', r'osisoft|\bPI System\b|aveva pi'), ('Starlink', r'starlink'), ('IBM', r'\bIBM\b|maximo'), ('Infor', r'\binfor\b'),
          ('Tableau', r'tableau'), ('Netafim', r'netafim'), ('Tomra', r'tomra'), ('Unitec', r'unitec'), ('Marel', r'marel'), ('GEA', r'\bGEA\b'), ('Haarslev', r'haarslev'),
          ('Camiones / equipos autónomos', r'aut[óo]nom'), ('Centro integrado de operaciones', r'centro (integrado|de control|de operaciones)|operaciones? (remotas?|digitales)|IOC|DOC|CIO'),
          ('Inteligencia artificial', r'inteligencia artificial|IA|machine learning|anal[íi]tica avanzada'), ('Gemelo digital', r'gemelo'), ('Relaves filtrados / en pasta', r'relave'),
          ('Energía solar', r'solar|fotovolt'), ('Energía renovable', r'renovable|e[óo]lic'), ('Desalinización', r'desalin|desaladora|[óo]smosis'), ('Riego tecnificado', r'riego|fertirri'),
          ('Red privada LTE/5G', r'5G|LTE'), ('Ore sorting', r'ore sorting'), ('Drones', r'dron'), ('Vehículos eléctricos', r'el[ée]ctric[oa]s?.*(cami|bus|veh|equipo)|(cami|bus|veh|equipo).*el[ée]ctric'),
          ('Trazabilidad', r'trazabilidad|blockchain'), ('Cisco', r'cisco'), ('Telefónica / Movistar', r'telef[óo]nica|movistar'), ('Claro', r'claro'), ('Cummins', r'cummins'),
          ('Selección óptica / calibrado', r'selecci[óo]n [óo]ptica|calibrad|sorting|clasificaci[óo]n autom'), ('Certificaciones BRC/HACCP', r'BRC|HACCP|BAP|MSC|GlobalG'),
          ('Proofpoint', r'proofpoint'), ('Atlassian', r'atlassian|jira'), ('Buk', r'\bbuk\b'), ('Ofisis', r'ofisis'), ('Spring ERP', r'spring'), ('Nisira', r'nisira')]
ERP_FAM = [('SAP', r'\bSAP\b|hana'), ('Oracle', r'oracle|jd ?edwards|netsuite|peoplesoft'), ('Microsoft Dynamics', r'dynamics|navision'), ('Infor', r'\binfor\b'), ('Nisira', r'nisira')]

def marca(prod): return next((m for m, rx in MARCAS if re.search(rx, prod, re.I)), prod)
def flat(s): return unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower()

REG = {flat(k): k for k in CENTRO}
REG['prov. const. del callao'] = 'Callao'

def main():
    auto = json.loads((ROOT / 'b2b/data/auto.json').read_text(encoding='utf-8'))
    hoy = datetime.date.today()
    meses = [f'{y}-{m:02d}' for y, m in sorted({((hoy.year * 12 + hoy.month - 1 - i) // 12, (hoy.year * 12 + hoy.month - 1 - i) % 12 + 1) for i in range(12)})]
    out = {'generado': hoy.strftime('%d/%m/%Y'), 'meses': meses, 'industrias': []}
    for ind, nombre in IND:
        emps = []
        for f in sorted((ROOT / 'b2b/data').glob(f'{ind}_[ab].json')):
            emps += json.loads(f.read_text(encoding='utf-8'))['empresas']
        for e in emps:
            a = auto.get(e['id'], {})
            e['firmo'] = e.get('firmo') or {}; e['tecno'] = e.get('tecno') or []
            e['intencion'] = e.get('intencion') or {}; e['intencion'].setdefault('senales', []); e['intencion']['senales'] = [x for x in e['intencion']['senales'] or [] if (x.get('fecha') or '') >= '2025-04']     # ventana de 18 meses
            e['web'] = e.get('web') or a.get('sitio')
            p = a.get('padron')
            if p:   # el padrón manda: si el RUC investigado no coincide con el oficial, se corrige
                if e.get('ruc') != p['ruc']: print(f"  RUC corregido {e['id']}: {e.get('ruc')} -> {p['ruc']} ({p['how']})")
                e['ruc'] = p['ruc']; e['padron'] = p
            elif e.get('ruc'): print(f"  ! RUC {e['ruc']} de {e['id']} no está en el padrón")
            ya = {marca(t['producto']) for t in e['tecno']} | {t['producto'] for t in e['tecno']}
            for t in (a.get('web') or {}).get('tech', []) + (a.get('subdom') or {}).get('tech', []):
                if t['producto'] in ya or marca(t['producto']) in ya and t['cat'] == 'ERP': continue
                e['tecno'].append({**t, 'confianza': 'alta', 'auto': True}); ya.add(t['producto']); ya.add(marca(t['producto']))
            for t in a.get('technews') or []:     # marcas citadas en titulares de prensa
                if marca(t['producto']) not in ya and t['producto'] not in ya: e['tecno'].append({**t, 'confianza': 'media'})
            for t in e['tecno']: t['marca'] = marca(t['producto'])
            su = a.get('sunat') or {}
            if su.get('ciiu') and not (e['firmo'].get('ciiu') or {}).get('codigo'): e['firmo']['ciiu'] = {**su['ciiu'], 'fuente': su['url']}
            if su.get('trab'):
                (p0, n0), (p1, n1) = su['trab'][0], su['trab'][-1]
                e['planilla'] = {'n': n1, 'periodo': p1, 'var': round((n1 / n0 - 1) * 100) if n0 and p0 != p1 else None, 'desde': p0, 'fuente': su['url']}
                if (e['firmo'].get('empleados') or {}).get('n') is None:
                    e['firmo']['empleados'] = {'n': n1, 'anio': p1, 'nota': 'planilla declarada a SUNAT', 'fuente': su['url']}
                if ind == 'mineria' and e['planilla']['var'] is not None and e['planilla']['var'] >= 10 and n1 - n0 >= 30:     # en pesca y agro la planilla es estacional: no es señal
                    e['intencion']['senales'].append({'fecha': p1, 'tipo': 'contratación', 'tema': 'crecimiento de planilla', 'titulo': f"Planilla +{e['planilla']['var']} % entre {p0} y {p1} ({n0:,} → {n1:,})",
                        'detalle': 'Trabajadores declarados a SUNAT.', 'fuente': su['url']})
            if not e['firmo'].get('plantas'):     # respaldo: sedes productivas declaradas a SUNAT (una por distrito)
                vistos = {}
                for x in su.get('anexos') or []:
                    if 'PRODUCTIVA' in x['tipo']: vistos.setdefault(x['ubi'], x)
                e['firmo']['plantas'] = [{'nombre': 'Sede productiva · ' + u.split(' - ')[-1], 'tipo': 'planta', 'region': REG.get(flat(u.split(' - ')[0]), u.split(' - ')[0]), 'localidad': u.split(' - ')[-1], 'sunat': True}
                                         for u in list(vistos)[:6]]
            erp = [t['producto'] for t in e['tecno'] if t['cat'] == 'ERP' and not re.search(r'no revelad|no identificad', t['producto'], re.I)]
            e['erp'] = next((fam for p_ in erp for fam, rx in ERP_FAM if re.search(rx, p_, re.I)), erp[0] if erp else None)
            e['news'] = a.get('news')
            geo = a.get('geo', {}); pl = []
            for x in e['firmo'].pop('plantas', None) or []:
                g = geo.get(x['nombre'])
                if g: x.update(lat=g['lat'], lon=g['lon'])
                elif x.get('tipo') not in ('oficina', 'flota') and x.get('region') in CENTRO:   # respaldo: centroide regional con desplazamiento fijo por nombre
                    h = hashlib.md5(x['nombre'].encode()).digest(); c = CENTRO[x['region']]
                    x.update(lat=round(c[0] + (h[0] - 128) / 400, 4), lon=round(c[1] + (h[1] - 128) / 400, 4), aprox=True)
                pl.append(x)
            e['plantas'] = pl
            e['busca'] = flat(' '.join([e['nombre'], e.get('razon_social') or '', e.get('subsector') or '', e.get('ruc') or ''] + [t['producto'] for t in e['tecno']] + [x.get('region') or '' for x in pl]))
        assert len({e['id'] for e in emps}) == len(emps), f'ids repetidos en {ind}'
        out['industrias'].append({'id': ind, 'nombre': nombre, 'empresas': emps})
        f = [e for e in emps if (e['firmo'].get('facturacion') or {}).get('usd_m') is not None]
        print(f"{nombre}: {len(emps)} empresas · facturación {len(f)} · empleados {sum((e['firmo'].get('empleados') or {}).get('n') is not None for e in emps)} · "
              f"ERP {sum(bool(e['erp']) for e in emps)} · señales {sum(len(e['intencion']['senales']) for e in emps)}")
    html = (ROOT / 'b2b/page.html').read_text(encoding='utf-8').replace('/*DATA*/null', json.dumps(out, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/'))
    # repo aparte (github.com/AlexisUsil/b2b) para que el link no diga VetClinica
    dst = ROOT.parent / 'b2b/index.html'; dst.write_text(html, encoding='utf-8')
    print('->', dst, f'{len(html) / 1024:.0f} KB')

if __name__ == '__main__': main()
