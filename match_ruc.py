"""Cruza data/places.json con el padrón SUNAT (data/sunat/padron_lima.txt) por nombre + dirección.
Salida: data/sunat/ruc_match.json  {place_id: {ruc, razon, estado, condicion, conf, how}}"""
import json, re, unicodedata, collections
UBI = {'Santiago de Surco':'150140','La Molina':'150114','San Borja':'150130','Miraflores':'150122','Surquillo':'150141',
       'Lince':'150116','San Luis':'150134','Ate':'150103','San Isidro':'150131','La Victoria':'150115','Chorrillos':'150108',
       'Lima':None,'Distrito de Lima':'150101','Barranco':'150104','Magdalena del Mar':'150120','Jesús María':'150113',
       'Santa Anita':'150137','San Juan de Miraflores':'150133','San Miguel':'150136','Pueblo Libre':'150121','Breña':'150105'}
STOP = {'VETERINARIA','VETERINARIO','VETERINARIOS','VETERINARIAS','CLINICA','CLINICAS','CENTRO','CONSULTORIO','HOSPITAL','PET','PETS','VET','VETS',
        'SHOP','GROOMING','SPA','SEDE','LIMA','PERU','SAC','EIRL','SRL','SA','SCRL','DE','DEL','LA','EL','LOS','LAS','Y','E','AND','THE','MI','TU',
        'MASCOTA','MASCOTAS','ANIMAL','ANIMALES','CANINA','CANINO','FELINA','SERVICIOS','INVERSIONES','GRUPO','CORPORACION','NEGOCIOS','MEDICO','MEDICA',
        'INTEGRAL','SALUD','CARE','STORE','TIENDA','24','HORAS','HRS','SEDE','SUCURSAL','SURCO','MOLINA','BORJA','MIRAFLORES','SURQUILLO','LINCE','LUIS',
        'ATE','ISIDRO','CENTER','VETERINARY','COMPANIA','HOUSE','MARKET','SHOPPING','FOOD','RETAIL','HORAS','GRANDES','PEQUENAS','CLINIC','CLINICS','EMERGENCIAS','URGENCIAS','MEDICAL','ANIMALS','FRIENDS','FRIEND','MEDICINA','MEDICINAS','ESPECIALIZADA','ESPECIALIZADO','SERVICIO','GENERAL','GENERALES','MULTISERVICIOS','SUCESION','INDIVISA','SOCIEDAD','ANONIMA','CERRADA','PERUANA','PERUANAS','PERUANO','VICTORIA','CHORRILLOS','BARRANCO','MAGDALENA','JESUS','MARIA','SANTA','ANITA','SAN','SANTIAGO','AV','AVENIDA','CALLE','JR','JIRON'}
VETKW = re.compile(r'VET|PET|MASCOT|ANIMAL|CANIN|FELIN|DOG|CAT\b|GAT[OI]|PERR|HUELL|PATA|PATIT|HAPPY|GROOM|ZOO|KENNEL|HOSPITAL|CLINIC')
def norm(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii','ignore').decode().upper()
    return re.sub(r'[^A-Z0-9 ]+',' ', s)
def toks(s): return {t for t in norm(s).split() if len(t)>=4 and t not in STOP}
def street(s):
    s = norm(s)
    s = re.sub(r'\b(AV|AVENIDA|CALLE|CAL|JR|JIRON|PSJE|PJ|PASAJE|C|CA|CDRA|MZ|MZA|LT|LOTE|URB|PROLONG|PROLONGACION|ALAMEDA|ALM|PRO)\b',' ',s)
    return {t for t in s.split() if len(t)>=4 and t not in {'ESTE','OESTE','NORTE','SUR'}}
def parse_addr(a):
    left = a.rsplit(',',1)[0] if ',' in a else a
    m = re.search(r'\b(\d{1,5})\b', left) or re.search(r'(\d{1,5})(?=[A-Za-z])', a)   # ponytail: "137Surquillo" bug
    return street(left), (m.group(1) if m else None)

if __name__ == '__main__':
    rows = [l.rstrip('\n').split('|') for l in open('data/sunat/padron_lima.txt', encoding='latin-1')][1:]
    by_ubi = collections.defaultdict(list)
    for r in rows: by_ubi[r[4]].append(r)
    for r in rows:   # precomputo por fila: el cruce pasa de minutos a segundos
        rn = norm(r[1]); r.append(toks(r[1])); r.append(street(r[6])); r.append(bool(VETKW.search(rn)))
    places = json.load(open('data/places.json', encoding='utf-8'))
    web = json.load(open('data/sunat/ruc_web.json'))
    byruc = {r[0]: r for r in rows}
    out = {}
    def rec(r, conf, how): return {'ruc':r[0],'razon':r[1],'estado':r[2],'condicion':r[3],'ubigeo':r[4],
        'dir':' '.join(x for x in (r[5],r[6],r[9]) if x!='-'),'conf':conf,'how':how}
    for p in places:
        d = re.sub(r'^\d+','',p['district'])
        ubi = UBI.get(d)
        if p['id'] in web and web[p['id']][0] in byruc:
            out[p['id']] = rec(byruc[web[p['id']][0]], 'alta', 'web'); continue
        nt = toks(p['name']); st, num = parse_addr(p['address'])
        cands = by_ubi[ubi] if ubi else rows
        best = None
        for r in cands:
            name_hit = len(nt & r[-3])
            addr_hit = bool(st & r[-2]) and num is not None and r[9] == num
            kw = r[-1]
            score = (2 if name_hit else 0) + (2 if addr_hit else 0) + (1 if kw else 0) + (1 if r[2]=='ACTIVO' else 0)
            if score >= 3 and (name_hit or addr_hit) and (best is None or score > best[0]):
                best = (score, r, name_hit, addr_hit, kw)
        if best:
            s, r, nh, ah, kw = best
            conf = 'alta' if (nh and (ah or kw)) or (ah and kw) else 'revisar'
            out[p['id']] = rec(r, conf, f"{'nombre' if nh else ''}{'+' if nh and ah else ''}{'direccion' if ah else ''}{'+kw' if kw else ''}")
    json.dump(out, open('data/sunat/ruc_match.json','w',encoding='utf-8'), indent=1, ensure_ascii=False)
    c = collections.Counter(v['conf'] for v in out.values()); e = collections.Counter(v['estado'] for v in out.values())
    print(len(places),'locales ->',len(out),'con RUC', dict(c)); print(dict(e))
    print('RUC repetidos (cadenas):', {k:v for k,v in collections.Counter(v['ruc'] for v in out.values()).items() if v>1})
