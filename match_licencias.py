"""Cruza places con licencias municipales (San Borja, La Molina, Miraflores, Lima MML). Salida: data/licencias/lic_match.json"""
import json, csv, re, glob, openpyxl, collections
from match_ruc import norm, toks, street, parse_addr   # reutiliza normalizadores
P = json.load(open('data/places.json', encoding='utf-8'))
M = json.load(open('data/sunat/ruc_match.json', encoding='utf-8'))
ruc_of = {k: v['ruc'] for k, v in M.items() if v['conf'] == 'alta'}
def d8(v): v=str(v or ''); return f"{v[:4]}-{v[4:6]}-{v[6:8]}" if len(v)>=8 else v
lic = collections.defaultdict(list)   # district -> [{ruc,nombre,dir,giro,area,fecha,fuente}]
for r in list(openpyxl.load_workbook('data/licencias/san_borja_2023.xlsx', read_only=True).worksheets[0].iter_rows(values_only=True))[1:]:
    if r[6]: lic['San Borja'].append(dict(ruc=str(r[6]), nombre='', dir=r[14] or '', giro=r[7] or '', area=r[8], fecha=d8(r[12]), fuente='MSB 2023'))
for r in list(openpyxl.load_workbook('data/licencias/la_molina_2025.xlsx', read_only=True).worksheets[0].iter_rows(values_only=True))[1:]:
    if r[4]: lic['La Molina'].append(dict(ruc='', nombre=r[4], dir=r[5] or '', giro=r[6] or '', area=None, fecha=str(r[3])[:10], fuente='MDLM 2025'))
for f in glob.glob('data/licencias/miraflores/lic_*.xlsx'):
    for r in list(openpyxl.load_workbook(f, read_only=True).worksheets[0].iter_rows(values_only=True))[1:]:
        if r[6]: lic['Miraflores'].append(dict(ruc='', nombre='', dir=str(r[5] or ''), giro=r[6], area=None, fecha=d8(r[7]), fuente='MDM 2020-22'))
for r in list(csv.reader(open('data/licencias/lima_mml_2024_2026.csv', encoding='latin-1'), delimiter=';'))[1:]:
    lic['Lima'].append(dict(ruc=r[8], nombre='', dir='', giro='', area=r[9], fecha=d8(r[6]), fuente='MML 2024-26'))
VET = re.compile(r'VETERINAR|MASCOT|PET ?SHOP|ANIMAL')
out = {}
for p in P:
    d = re.sub(r'^\d+', '', p['district']); rows = lic.get(d, [])
    if not rows: continue
    ruc = ruc_of.get(p['id']); st, num = parse_addr(p['address']); nt = toks(p['name'])
    hits = []
    for L in rows:
        by_ruc = ruc and L['ruc'] == ruc
        ls = street(L['dir']); lnum = re.search(r'(?:N[°º]?|NRO\.?)?\s*(\d{2,5})\b', L['dir'] or '')
        by_addr = bool(st & ls) and num and lnum and lnum.group(1) == num
        by_name = bool(nt & toks(L['nombre'])) if L['nombre'] else False
        vet = bool(VET.search(norm(L['giro'])))
        if by_ruc or (by_addr and (vet or by_name)) or (by_name and vet):
            hits.append(dict(L, how='ruc' if by_ruc else 'direccion' if by_addr else 'nombre'))
    if hits:
        hits.sort(key=lambda h: h['fecha'] or '', reverse=True)   # ponytail: nos quedamos con la más reciente
        out[p['id']] = hits[0] | {'n_licencias': len(hits)}
json.dump(out, open('data/licencias/lic_match.json', 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
print({d: len(v) for d, v in lic.items()}, '->', len(out), 'locales con licencia', collections.Counter(v['how'] for v in out.values()))
for k, v in list(out.items())[:12]: print(' ', v['fuente'], v['how'], '|', v['giro'][:40], '|', v['area'], v['fecha'])
