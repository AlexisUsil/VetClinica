// Lógica de negocio portada desde index.html (funciones puras). Textos con **negrita** se renderizan con <Rich/>.
import { ALL_CELLS, ALL_PLACES, BE, DIST, G, GEO, GEO_PLACES, GRID, PLACES, POIS, WEIGHTS, byName } from '@/data/dash'
import type { District, Place, Themes } from '@/data/types'
import { fmtN, fmtPct, hh, isNum, joinY, maxBy, mean, minBy, nums, pct, pctRank, shortChain, sum } from './format'

export const COLORS = {
  primary: '#0D9488', primaryDark: '#0F766E', primarySoft: '#99F6E4', accent: '#EA580C', accentInk: '#C2410C',
  good: '#16A34A', mid: '#F59E0B', bad: '#DC2626', muted: '#64748B', border: '#E2E8F0', fg: '#0F172A', gray: '#94A3B8', slate2: '#CBD5E1',
}

export const COMP: Record<string, { name: string; short: string; desc: string; color: string }> = {
  demand:      { name: 'Demanda potencial',       short: 'Demanda',      desc: 'Hogares × % NSE A/B × % hogares con mascota.', color: '#0F766E' },
  saturation:  { name: 'Baja saturación',         short: 'Saturación',   desc: 'Menos clínicas por cada 10 mil habitantes.', color: '#14B8A6' },
  quality_gap: { name: 'Competencia mejorable',   short: 'Calidad rival', desc: 'Rating promedio más bajo: clientes menos satisfechos que se pueden captar.', color: '#5EEAD4' },
  gap_24h:     { name: 'Hueco 24h',               short: 'Hueco 24h',    desc: 'Menor % de clínicas que atienden 24 horas.', color: '#475569' },
  rent:        { name: 'Alquiler accesible',      short: 'Alquiler',     desc: 'Menor costo de alquiler comercial (USD/m²).', color: '#94A3B8' },
  regulation:  { name: 'Trámite municipal fácil', short: 'Trámite',      desc: 'Menor fricción para licencia y zonificación.', color: '#CBD5E1' },
}
export const COMP_KEYS = Object.keys(COMP).filter(k => k in WEIGHTS)
export const FRIC_SCORE: Record<string, number> = { Baja: 100, Media: 60, Alta: 20 }
export const DAY_G = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
export const DAY_PY = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
export const HEAT_ORDER = [1, 2, 3, 4, 5, 6, 0]
export const VULN_R = 4.3, VULN_N = 50

const wSum = () => sum(Object.values(WEIGHTS))
export const wEff = (k: string) => { const t = wSum(); return t > 0 ? (WEIGHTS[k] || 0) / t : 0 }

export const ratingColor = (r: unknown) => (!isNum(r) ? COLORS.gray : r < 4 ? COLORS.bad : r < 4.5 ? COLORS.mid : COLORS.good)
export const labelTone = (l?: string | null): Tone => (/alta/i.test(l || '') ? 'good' : /baja/i.test(l || '') ? 'bad' : /media/i.test(l || '') ? 'mid' : 'gray')
export type Tone = 'good' | 'mid' | 'bad' | 'gray' | 'teal' | 'opp'
export const toneColor = (t: Tone) => ({ good: COLORS.good, mid: COLORS.mid, bad: COLORS.bad, gray: COLORS.gray, teal: COLORS.primary, opp: COLORS.accent }[t])

export function isEnriched(p: Place) { return !!((p.social_reputation && p.social_reputation !== 'Sin datos') || p.segment || (p.services || []).length || (p.sources || []).length) }
export function isEstTicket(p: Place) { return /segment/i.test(String(p.ticket_basis || '')) }
export const isVuln = (p: Place) => isNum(p.rating) && p.rating < VULN_R && (p.reviews_count || 0) >= VULN_N

export function hav(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371.0088, r = Math.PI / 180, dp = (lat2 - lat1) * r, dl = (lng2 - lng1) * r
  const a = Math.sin(dp / 2) ** 2 + Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin(dl / 2) ** 2
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)))
}
function pipRing(x: number, y: number, ring: number[][]) {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1], xj = ring[j][0], yj = ring[j][1]
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}
export function districtAt(lat: number, lng: number): string | null {
  for (const f of GEO) {
    const g = f.geometry
    const polys = (g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : []) as number[][][][]
    if (polys.some(poly => poly && poly[0] && pipRing(lng, lat, poly[0]) && !poly.slice(1).some(h => pipRing(lng, lat, h)))) return f.properties?.district || null
  }
  return null
}

/* ---------- viabilidad legal ---------- */
export type LegalLvl = 'good' | 'mid' | 'bad' | 'na'
export interface Legal { lvl: LegalLvl; short: string; txt: string; zones?: number | null }
export function legalStatus(d: District | null | undefined): Legal {
  const r = d?.regulation || {}
  if (!Object.keys(r).length) return { lvl: 'na', short: 'En investigación', txt: 'Zonificación en investigación' }
  const z = Array.isArray(r.zoning_allowed) ? r.zoning_allowed.filter(Boolean) : []
  if (r.cap_exists === true) return { lvl: 'bad', short: 'Solo consultorio', txt: 'No se pueden abrir clínicas nuevas: solo consultorio', zones: 0 }
  if (r.cap_exists === 'unknown') return { lvl: 'mid', short: 'No verificado', txt: 'Zonificación no verificada', zones: null }
  if (!z.length) return { lvl: 'bad', short: 'Solo consultorio', txt: 'Clínica no permitida en ninguna zona: solo consultorio', zones: 0 }
  if (z.length === 1) return { lvl: 'mid', short: '1 eje', txt: `Clínica solo en 1 zona: ${z[0]}`, zones: 1 }
  return { lvl: 'good', short: 'Clínica permitida', txt: `Clínica permitida en ${z.length} zonas`, zones: z.length }
}
export const LEGAL_LABEL: Record<LegalLvl, string> = { good: 'Verde', mid: 'Ámbar', bad: 'Rojo', na: 'Pendiente' }
export const legalTone = (l: LegalLvl): Tone => (l === 'na' ? 'gray' : l)
export const greenDistricts = () => DIST.filter(d => legalStatus(d).lvl === 'good').map(d => d.district)
export const badDistricts = () => DIST.filter(d => legalStatus(d).lvl === 'bad').map(d => d.district)

export function componentsPending() {
  return {
    demand: DIST.every(d => !isNum(d.households)),
    saturation: DIST.every(d => !isNum(d.population)),
    rent: DIST.every(d => !isNum(d.rent_usd_m2)),
    regulation: DIST.every(d => !(d.regulation && d.regulation.friction)),
  } as Record<string, boolean>
}
export function strengths(d: District) {
  const sc = d.score_components || {}
  return Object.keys(COMP).filter(k => isNum(sc[k])).map(k => ({ k, raw: sc[k], pts: sc[k] * wEff(k) })).sort((a, b) => b.pts - a.pts)
}
export function ticketBasis(P: Place[]) {
  const o = { pub: 0, rev: 0, seg: 0, other: 0, n: 0 }
  P.forEach(p => {
    if (!isNum(p.ticket)) return; o.n++; const b = String(p.ticket_basis || '').toLowerCase()
    if (b.includes('public')) o.pub++; else if (b.includes('rese')) o.rev++; else if (b.includes('segment')) o.seg++; else o.other++
  })
  return o
}

/* ---------- competencia ---------- */
export function lorenz(P: Place[]) {
  const r = P.map(p => p.reviews_count || 0).sort((a, b) => a - b); const T = sum(r)
  if (!r.length || !T) return null
  return { hhi: sum(r.map(v => ((v / T) * 100) ** 2)), top3: (sum(r.slice(-3)) / T) * 100, n: r.length }
}
export const hhiLabel = (h: unknown) => (!isNum(h) ? '—' : h > 2500 ? 'Muy concentrado' : h >= 1500 ? 'Moderado' : 'Repartido')
export const hhiTone = (h: unknown): Tone => (!isNum(h) ? 'gray' : h > 2500 ? 'bad' : h >= 1500 ? 'mid' : 'good')
export function topNegThemes(p: Place, n = 2) {
  return Object.entries(p.themes || {}).map(([k, v]) => ({ k, neg: v?.neg || 0 })).filter(t => t.neg > 0).sort((a, b) => b.neg - a.neg).slice(0, n).map(t => t.k)
}
export const MARGIN: Record<string, string> = { laboratorio: 'Alto', 'ecografía': 'Alto', 'rayos X': 'Alto', 'cirugía': 'Alto', 'hospitalización': 'Medio', vacunas: 'Medio', farmacia: 'Bajo', petshop: 'Bajo', grooming: 'Bajo' }
export const MARGIN_W: Record<string, number> = { Alto: 3, Medio: 2, Bajo: 1, 'Sin dato': 1 }

/* ---------- horarios ---------- */
export function validGrid(g: unknown): g is number[][] { return Array.isArray(g) && g.length === 7 && g.every(r => Array.isArray(r) && r.length === 24) }
export function demandSupply(src: { activity?: { by_hour?: number[] }; coverage?: number[][] | null } | null | undefined) {
  const A = src?.activity?.by_hour; const cov = validGrid(src?.coverage) ? src!.coverage! : null
  if (!Array.isArray(A) || A.length !== 24 || !sum(A) || !cov) return null
  let a = A.map(v => (isNum(v) ? v : 0)); const nRev = sum(a)
  const smooth = nRev < 100
  if (smooth) { const b = a.slice(); a = b.map((v, h) => (b[(h + 23) % 24] + v + b[(h + 1) % 24]) / 3) }
  const Cs = Array.from({ length: 24 }, (_, h) => sum(cov.map(r => r[h])))
  const sa = sum(a), sc = sum(Cs)
  const dem = a.map(v => (sa ? (100 * v) / sa : null)), sup = Cs.map(v => (sc ? (100 * v) / sc : null))
  const idx = dem.map((v, h) => (isNum(v) && isNum(sup[h]) && (sup[h] as number) > 0 ? v / (sup[h] as number) : null))
  return { dem, sup, idx, nRev, smooth }
}
export function peakRun(idx: (number | null)[], thr: number) {
  let best: { s: number; e: number } | null = null, cur: { s: number; e: number } | null = null
  idx.forEach((v, h) => {
    if (isNum(v) && v >= thr) {
      if (cur && cur.e === h - 1) cur.e = h; else cur = { s: h, e: h }
      if (!best || cur.e - cur.s > best.e - best.s) best = { s: cur.s, e: cur.e }
    } else cur = null
  })
  const b = best as { s: number; e: number } | null
  return b ? { s: b.s, e: b.e, avg: mean(idx.slice(b.s, b.e + 1)) } : null
}
export function coverageAnalysis(grid: number[][] | null, total: number) {
  if (!grid) return null
  const flat = grid.flat(); const mn = Math.min(...flat), mx = Math.max(...flat)
  const thr = mn + 0.1 * (mx - mn)
  const avgH = Array.from({ length: 24 }, (_, h) => mean(grid.map(r => r[h])) as number)
  const lowH = avgH.map((v, h) => (v <= thr + 0.5 ? h : -1)).filter(h => h >= 0)
  const ranges: [number, number][] = []
  lowH.forEach(h => { const last = ranges[ranges.length - 1]; if (last && last[1] === h - 1) last[1] = h; else ranges.push([h, h]) })
  if (ranges.length > 1 && ranges[0][0] === 0 && ranges[ranges.length - 1][1] === 23) { const l = ranges.pop()!; ranges[0] = [l[0], ranges[0][1]] }
  const main = ranges.slice().sort((a, b) => ((b[1] - b[0] + 24) % 24) - ((a[1] - a[0] + 24) % 24))[0]
  const rangeTxt = main ? `${hh(main[0])}–${hh((main[1] + 1) % 24)}` : null
  const lowAvg = lowH.length ? (mean(lowH.map(h => avgH[h])) as number) : mn
  const dayTot = grid.map(r => sum(r)); const wd = dayTot.indexOf(Math.min(...dayTot))
  let peakH = 0; avgH.forEach((v, h) => { if (v > avgH[peakH]) peakH = h })
  return { mn, mx, thr, lowH, rangeTxt, lowAvg, lowPct: pct(lowAvg, total), weakDay: DAY_G[wd], peakH, peakV: avgH[peakH], avgH }
}

/* ---------- escucha social ---------- */
export function themeStats(themes: Themes | null | undefined) {
  return Object.entries(themes || {}).map(([name, v]) => ({ name, pos: v?.pos || 0, neg: v?.neg || 0 }))
    .map(t => ({ ...t, total: t.pos + t.neg, negPct: pct(t.neg, t.pos + t.neg) })).filter(t => t.total > 0).sort((a, b) => b.total - a.total)
}
export function worstTheme(themes: Themes | null | undefined) {
  const T = themeStats(themes); if (!T.length) return null
  const minVol = Math.max(5, 0.03 * sum(T.map(t => t.total)))
  return maxBy(T.filter(t => t.total >= minVol), t => t.negPct) || maxBy(T, t => t.negPct)
}

/* ---------- simulador ---------- */
export function staffMonthly(o: { vets?: number; overhead?: number } = {}) {
  const s = BE.staff || {}
  const vets = isNum(o.vets) ? o.vets : s.vets, ov = isNum(o.overhead) ? o.overhead : s.labor_overhead_pct
  if ([vets, s.vet_gross_soles, s.assistants, s.assistant_gross_soles, ov].every(isNum))
    return ((vets as number) * s.vet_gross_soles! + s.assistants! * s.assistant_gross_soles!) * (1 + (ov as number) / 100)
  return isNum(BE.staff_monthly_soles) ? BE.staff_monthly_soles : null
}
export interface SimOpts { m2?: number | null; ticket?: number | null; rentMul?: number; supplies?: number; vets?: number; overhead?: number }
export type Sim = NonNullable<ReturnType<typeof simulate>>
export function simulate(d: District | null, o: SimOpts = {}) {
  if (!d) return null
  const m2 = isNum(o.m2) ? o.m2 : BE.local_m2
  const usd = BE.usd_pen, days = BE.working_days_month
  const rentM2 = isNum(d.rent_usd_m2) ? d.rent_usd_m2 * (isNum(o.rentMul) ? o.rentMul : 1) : null
  const ticket = isNum(o.ticket) ? o.ticket : BE.ticket_default_soles
  const sup = (isNum(o.supplies) ? o.supplies : isNum(BE.supplies_pct) ? BE.supplies_pct : 0) / 100
  const igv = BE.ticket_includes_igv === false ? 0 : (isNum(BE.igv_pct) ? BE.igv_pct : 0) / 100
  const staff = staffMonthly(o)
  const vets = isNum(o.vets) ? o.vets : BE.staff?.vets
  const other = isNum(BE.other_fixed_monthly_soles) ? BE.other_fixed_monthly_soles : null
  if (!isNum(m2) || !isNum(usd) || !isNum(days) || !isNum(rentM2) || !isNum(ticket) || !isNum(staff) || !isNum(other)) return null
  const rent = rentM2 * m2 * usd
  const fixed = rent + staff + other
  const net = ticket / (1 + igv)
  const contrib = net * (1 - sup)
  const be = contrib > 0 ? fixed / contrib / days : null
  const mt = (isNum(BE.margin_target_pct) ? BE.margin_target_pct : 0) / 100
  const target = net * (1 - sup - mt) > 0 ? fixed / (net * (1 - sup - mt)) / days : null
  const capex = isNum(BE.capex_usd_100m2) ? BE.capex_usd_100m2 * (BE.capex_scale_with_m2 === false ? 1 : m2 / 100) * usd : null
  const profit = (v: number) => v * days * contrib - fixed
  const capacity = isNum(vets) && isNum(BE.visits_per_vet_day_capacity) ? vets * BE.visits_per_vet_day_capacity : null
  const fs = BE.fair_share || {}
  let fair: number | null = null, multiple: number | null = null
  if ([d.households, fs.pet_households_pct, fs.vet_visit_rate, fs.visits_per_household_year, fs.open_days_year, d.count].every(isNum) && fs.open_days_year! > 0) {
    fair = ((((d.households! * fs.pet_households_pct!) / 100) * fs.vet_visit_rate! * fs.visits_per_household_year!) / (d.count + 1)) / fs.open_days_year!
    multiple = isNum(be) && fair > 0 ? be / fair : null
  }
  return {
    d, m2, ticket, rent, staff, fixed, net, contrib, be, target, capex, profit, capacity, days, fair, multiple,
    rentPct: (v: number) => (v > 0 ? (100 * rent) / (v * days * net) : null),
    payback: (v: number) => { const p = profit(v); return p > 0 && isNum(capex) ? capex / p : null },
  }
}

/* ---------- alcance (distrito o todos) ---------- */
export type Scope = ReturnType<typeof makeScope>
export function makeScope(district: string) {
  const all = district === 'all'
  const d = all ? null : byName(district)
  const P = all ? PLACES : PLACES.filter(p => p.district === district)
  const Pall = all ? ALL_PLACES : ALL_PLACES.filter(p => p.district === district)
  const ratings = nums(P.map(p => p.rating))
  const tickets = nums(P.map(p => p.ticket))
  const n24 = P.filter(p => p.is_24h).length
  const totalRev = sum(P.map(p => p.reviews_count || 0))
  const dist: Record<string, number> = { '<3.5': 0, '3.5-3.9': 0, '4.0-4.4': 0, '4.5+': 0 }
  ratings.forEach(r => { dist[r < 3.5 ? '<3.5' : r < 4 ? '3.5-3.9' : r < 4.5 ? '4.0-4.4' : '4.5+']++ })
  const top = P.slice().sort((a, b) => (b.reviews_count || 0) - (a.reviews_count || 0)).slice(0, 8)
    .map(p => ({ p, name: p.name, rating: p.rating, reviews: p.reviews_count || 0, share: totalRev ? (100 * (p.reviews_count || 0)) / totalRev : null, is_24h: !!p.is_24h, chain: shortChain(p.chain) }))
  const src = all ? G : d || {}
  return {
    all, d, P, Pall, district, name: all ? 'Todos los distritos' : district, label: all ? 'los 5 distritos' : district,
    count: P.length, n24, pct24: pct(n24, P.length), avgRating: mean(ratings), ratings, totalRev,
    tickets, avgTicket: mean(tickets), ratingDist: dist, lowRated: ratings.filter(r => r < 4).length, top,
    themes: (src as { themes?: Themes }).themes || {}, coverage: validGrid((src as { coverage?: unknown }).coverage) ? ((src as { coverage: number[][] }).coverage) : null,
    activity: (src as { activity?: District['activity'] }).activity || {},
  }
}

/* ---------- explorar ---------- */
export function analyze(lat: number, lng: number, rkm: 1 | 2) {
  const withD = GEO_PLACES.map(p => ({ p, d: hav(lat, lng, p.lat, p.lng) }))
  const in1 = withD.filter(x => x.d <= 1), in2 = withD.filter(x => x.d <= 2)
  const inR = rkm === 2 ? in2 : in1
  const revR = sum(inR.map(x => x.p.reviews_count || 0))
  const near24 = withD.filter(x => x.p.is_24h).sort((a, b) => a.d - b.d)[0] || null
  const tk = inR.filter(x => isNum(x.p.ticket))
  const poiCount = (k: string) => POIS.filter(q => (k === 'park' ? q.kind === 'park' || q.kind === 'dog_park' : q.kind === k) && hav(lat, lng, q.lat, q.lng) <= 0.5).length
  let cell = null as (typeof ALL_CELLS)[number] | null, cd = Infinity
  ALL_CELLS.forEach(c => { const dd = hav(lat, lng, c.lat, c.lng); if (dd < cd) { cd = dd; cell = c } })
  if (cd > 0.35) cell = null
  const c = cell as (typeof ALL_CELLS)[number] | null
  return {
    n1: in1.length, n2: in2.length, rkm, district: districtAt(lat, lng), cell: c,
    cellPct: c ? pctRank(c.score, (GRID[c.district || ''] || []).map(x => x && x.score)) : null,
    avgRating: mean(inR.map(x => x.p.rating)), near24, revR,
    share: inR.map(x => ({ name: x.p.name, is24: !!x.p.is_24h, pct: revR ? (100 * (x.p.reviews_count || 0)) / revR : 0 })).sort((a, b) => b.pct - a.pct).slice(0, 4),
    avgTicket: mean(tk.map(x => x.p.ticket)), tEst: tk.filter(x => isEstTicket(x.p)).length,
    parks: poiCount('park'), pets: poiCount('pet_shop'), sups: poiCount('supermarket'),
    inSet: new Set(inR.map(x => x.p.id)),
  }
}
export type Analysis = ReturnType<typeof analyze>

/* ---------- huecos y recomendaciones ---------- */
export interface Rule { ic: string; d?: string | null; t: string; b: string; night?: boolean; bStat?: string; pending?: boolean; metric?: { v: string; l: string } }
function demandInGap(A: NonNullable<ReturnType<typeof coverageAnalysis>>) {
  const bh = G.activity?.by_hour; if (!A || !Array.isArray(bh) || bh.length !== 24 || !sum(bh)) return ''
  let pk = 0; bh.forEach((v, h) => { if (v > bh[pk]) pk = h })
  const inGap = sum(A.lowH.map(h => bh[h]))
  return ` Las reseñas tienen su pico a las ${hh(pk)}, pero ${fmtPct(pct(inGap, sum(bh)))} se escriben en esta franja.`
}
export function buildRules(): Rule[] {
  const R: Rule[] = []
  const bad = badDistricts()
  const good = DIST.filter(d => legalStatus(d).lvl === 'good')
  if (bad.length) R.push({ ic: 'shield', d: good.length === 1 ? good[0].district : null, t: 'La zonificación manda, no un tope numérico',
    metric: { v: `${bad.length}/${DIST.length}`, l: 'distritos solo consultorio' },
    b: `En ${joinY(bad)} el índice de usos no permite clínicas nuevas: solo consultorio.${good.length ? ` ${joinY(good.map(d => d.district))} ${good.length > 1 ? 'permiten' : 'permite'} clínica en ${good.map(d => legalStatus(d).zones).join('/')} zonas.` : ''}` })
  const d24 = minBy(DIST, d => d.pct_24h)
  if (d24) R.push({ ic: 'moon', night: true, d: d24.district, t: `Hueco nocturno en ${d24.district}`,
    metric: { v: fmtPct(d24.pct_24h), l: 'de clínicas atiende 24h' },
    b: `Solo ${fmtN(d24.count_24h)} de ${fmtN(d24.count)} clínicas atiende 24 horas, el menor porcentaje de los 5 distritos. Una guardia nocturna tendría poca competencia.`,
    bStat: `Solo ${fmtN(d24.count_24h)} de ${fmtN(d24.count)} clínicas atiende 24 horas, el menor porcentaje de los 5 distritos.` })
  const A = coverageAnalysis(validGrid(G.coverage) ? G.coverage : null, G.count || PLACES.length)
  if (A && A.rangeTxt) R.push({ ic: 'clock', t: `Franja desatendida ${A.rangeTxt}`,
    metric: { v: fmtPct(A.lowPct), l: 'de clínicas abiertas' },
    b: `Abren en promedio ${fmtN(A.lowAvg)} de ${fmtN(G.count || PLACES.length)} clínicas; el ${A.weakDay.toLowerCase()} es el día más flojo.${demandInGap(A)}` })
  const w = worstTheme(G.themes)
  if (w) R.push({ ic: 'message', t: `Diferenciarse en “${w.name}”`, metric: { v: fmtPct(w.negPct), l: 'de menciones negativas' },
    b: `Es el tema con mayor proporción de quejas (${fmtN(w.neg)} de ${fmtN(w.total)} menciones). Convertirlo en promesa medible ataca el principal dolor del cliente.` })
  const lr = maxBy(DIST, d => pct(d.low_rated, d.count))
  if (lr) R.push({ ic: 'target', d: lr.district, t: `Competencia débil en ${lr.district}`, metric: { v: fmtPct(pct(lr.low_rated, lr.count)), l: 'con rating bajo 4.0' },
    b: `${fmtN(lr.low_rated)} de ${fmtN(lr.count)} clínicas tienen rating menor a 4.0, la proporción más alta. Sus clientes insatisfechos son captables.` })
  const hp = maxBy(DIST, d => d.households_per_clinic)
  if (hp) R.push({ ic: 'home', d: hp.district, t: `Demanda menos atendida en ${hp.district}`, metric: { v: fmtN(hp.households_per_clinic), l: 'hogares por clínica' }, b: `El mayor ratio de hogares por clínica de los 5 distritos.` })
  else R.push({ ic: 'home', t: 'Demanda por hogar: pendiente', pending: true, b: 'Cuando lleguen población y hogares por distrito se calculará qué zona tiene más hogares por clínica.' })
  return R
}
export function ruleBody(r: Rule) {
  if (r.night && r.d && legalStatus(byName(r.d)).lvl === 'bad') {
    const g = greenDistricts()
    return `${r.bStat} No aprovechable con clínica nueva (el índice de usos no lo permite); alternativa: ${g.length ? joinY(g) : 'un distrito con zonificación permitida'}.`
  }
  return r.b || ''
}

export function sumDist(ds: District[]) { const o: Record<string, number> = {}; ds.forEach(d => Object.entries(d.rating_dist || {}).forEach(([k, v]) => { o[k] = (o[k] || 0) + (v || 0) })); return o }
