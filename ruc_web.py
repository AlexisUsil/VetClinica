"""Busca RUC (10|20 + 9 dígitos) en la web de cada local. Salida: data/sunat/ruc_web.json"""
import json, re, concurrent.futures as cf, urllib.request, ssl
RUC = re.compile(r'\b(?:10|20)\d{9}\b')
ctx = ssl.create_default_context(); ctx.check_hostname = False; ctx.verify_mode = ssl.CERT_NONE
def fetch(url):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        return urllib.request.urlopen(req, timeout=15, context=ctx).read(400000).decode('utf-8', 'ignore')
    except Exception:
        return ''
def probe(p):
    base = p['website'].rstrip('/')
    found = set()
    for u in (base, base + '/libro-de-reclamaciones', base + '/contacto'):
        found |= set(RUC.findall(fetch(u)))
        if found: break
    return p['id'], sorted(found)
places = [p for p in json.load(open('data/places.json', encoding='utf-8')) if p.get('website')]
with cf.ThreadPoolExecutor(16) as ex:
    out = {pid: r for pid, r in ex.map(probe, places) if r}
json.dump(out, open('data/sunat/ruc_web.json', 'w'), indent=1)
print(len(places), 'webs ->', len(out), 'con RUC')
