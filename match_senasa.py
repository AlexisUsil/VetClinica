"""Cruza places con establecimientos SENASA (expendio de productos veterinarios). Salida: data/senasa/senasa_match.json"""
import json, re, collections
from match_ruc import norm, toks, street, parse_addr, UBI
P = json.load(open('data/places.json', encoding='utf-8'))
M = json.load(open('data/sunat/ruc_match.json', encoding='utf-8'))
S = json.load(open('data/senasa/lima_expendio.json', encoding='utf-8'))
by_ruc = {s['rucemprvet']: s for s in S}
out = {}
for p in P:
    r = M.get(p['id']); ruc = r['ruc'] if r and r['conf'] == 'alta' else None
    d = re.sub(r'^\d+', '', p['district']); ubi = UBI.get(d)
    hit, how = None, None
    if ruc and ruc in by_ruc: hit, how = by_ruc[ruc], 'ruc'
    else:
        st, num = parse_addr(p['address']); nt = toks(p['name'])
        for s in S:
            if ubi and s['ubigeo'] != ubi: continue
            ss = street(s['direccionestablecimiento']); m = re.search(r'N[°º]?\s*(\d{1,5})\b|\b(\d{2,5})\b', s['direccionestablecimiento'])
            snum = (m.group(1) or m.group(2)) if m else None
            if (st & ss) and num and snum == num: hit, how = s, 'direccion'; break
            if ubi and len(nt & toks(s['razosocivet'])) >= (1 if len(nt) == 1 else 2): hit, how = s, 'nombre'; break   # ponytail: nombre solo dentro del mismo distrito
    if hit:
        out[p['id']] = dict(ruc=hit['rucemprvet'], razon=hit['razosocivet'].strip(), regente=hit['vcprofesionalresp'].strip(),
                            fecha=hit['fechregiemp'], dir=hit['direccionestablecimiento'], how=how)
json.dump(out, open('data/senasa/senasa_match.json', 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
print(len(S), 'establecimientos SENASA ->', len(out), 'locales', collections.Counter(v['how'] for v in out.values()))
