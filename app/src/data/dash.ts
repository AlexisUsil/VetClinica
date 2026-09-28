// Carga y normaliza dashboard.json. Todo lo derivado se porta 1:1 desde index.html (raiz).
import raw from './dashboard.json?raw'
import type { Cell, Dash, District, GeoFeature, Place, Poi } from './types'
import { isNum, quantile, nums } from '@/lib/format'

let parsed: Dash = {}
try { parsed = JSON.parse(raw) as Dash } catch (e) { console.error('[data] dashboard.json inválido', e) }

export const DASH = parsed
export const G = DASH.global || {}
export const DIST: District[] = Array.isArray(DASH.districts) ? DASH.districts : []
export const WEIGHTS: Record<string, number> = { ...(DASH.weights || {}) }
export const DNAMES = DIST.map(d => d.district)
const RAW_PLACES: Place[] = Array.isArray(DASH.places) ? DASH.places : []
const cleanD = (s: unknown) => String(s || '').replace(/^\d+\s*/, '').replace(/^Distrito de /, '').trim() || '—'
/** Zona core: dentro de los distritos analizados. Las vecinas (buffer) nunca entran en KPIs/rankings/gráficos. */
export const isCore = (p: Place) => p.zone !== 'buffer' && DNAMES.includes(p.district)
export const isBuffer = (p: Place) => p.zone === 'buffer'
/** Todo lo mapeado en los distritos analizados (incluye petshops/kennels, solo para el directorio) */
export const ALL_PLACES = RAW_PLACES.filter(isCore)
/** Solo clínicas veterinarias reales: KPIs, mapa y gráficos */
export const PLACES = ALL_PLACES.filter(p => p.is_clinic !== false)
export const NON_CLINICS = isNum(G.excluded_not_clinic) ? G.excluded_not_clinic : ALL_PLACES.length - PLACES.length
/** Vecinas a ≤ buffer_km del límite (todas, incluye no clínicas: solo directorio) */
export const BUFFER_ALL: Place[] = RAW_PLACES.filter(p => isBuffer(p) && DNAMES.includes(p.near_district || '')).map(p => ({ ...p, district: cleanD(p.district) }))
/** Vecinas que son clínicas: solo mapa, Explorar y directorio (si se activa) */
export const BUFFER = BUFFER_ALL.filter(p => p.is_clinic !== false)
export const GEO_BUFFER = BUFFER.filter(p => isNum(p.lat) && isNum(p.lng)) as (Place & { lat: number; lng: number })[]
export const BUFFER_KM = isNum(G.buffer_km) ? G.buffer_km : 1.5
export const BUFFER_N = isNum(G.buffer_count) ? G.buffer_count : BUFFER.length
export const BUFFER_N24 = isNum(G.buffer_count_24h) ? G.buffer_count_24h : BUFFER.filter(p => p.is_24h).length
export const bufferOf = (district: string) => { const B = BUFFER.filter(p => p.near_district === district); return { n: B.length, n24: B.filter(p => p.is_24h).length } }
export const byName = (n: string | null | undefined) => DIST.find(d => d.district === n) || null
export const RANK: string[] = ((Array.isArray(DASH.ranking) && DASH.ranking.length) ? DASH.ranking
  : DIST.slice().sort((a, b) => (b.score || 0) - (a.score || 0)).map(d => d.district)).filter(n => byName(n))
export const rankOf = (n: string) => RANK.indexOf(n) + 1
export const BE = DASH.breakeven?.breakeven_assumptions || {}
export const GRID: Record<string, Cell[]> = DASH.grid && typeof DASH.grid === 'object' ? DASH.grid : {}
export const GEO: GeoFeature[] = Array.isArray(DASH.districts_geojson?.features) ? DASH.districts_geojson!.features : []
export const POIS: Poi[] = Array.isArray(DASH.pois) ? DASH.pois.filter(q => q && isNum(q.lat) && isNum(q.lng)) : []
export const GEO_PLACES = PLACES.filter(p => isNum(p.lat) && isNum(p.lng)) as (Place & { lat: number; lng: number })[]
export const ALL_CELLS: Cell[] = []
Object.keys(GRID).forEach(d => (Array.isArray(GRID[d]) ? GRID[d] : []).forEach(c => {
  if (c && isNum(c.lat) && isNum(c.lng)) ALL_CELLS.push({ district: d, ...c })
}))
export const cellHigh: Record<string, number | null> = {}
export const cellMax: Record<string, number | null> = {}
Object.keys(GRID).forEach(d => {
  const x = nums((GRID[d] || []).map(c => c && c.score))
  cellHigh[d] = quantile(x, 0.8)
  cellMax[d] = x.length ? Math.max(...x) : null
})
export const isHighCell = (c: Cell) => { const t = cellHigh[c.district || '']; return isNum(t) && isNum(c.score) && c.score >= t }
export const GENERATED = DASH.generated_at || '—'
