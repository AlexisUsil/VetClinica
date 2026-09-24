export const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v)
export const nums = (arr: unknown[] | null | undefined): number[] => (arr || []).filter(isNum)
export const sum = (arr: unknown[] | null | undefined) => nums(arr).reduce((a, b) => a + b, 0)
export const mean = (arr: unknown[] | null | undefined) => { const x = nums(arr); return x.length ? sum(x) / x.length : null }
export const median = (arr: unknown[] | null | undefined) => {
  const x = nums(arr).sort((a, b) => a - b); if (!x.length) return null
  const m = Math.floor(x.length / 2); return x.length % 2 ? x[m] : (x[m - 1] + x[m]) / 2
}
export const pct = (a: unknown, b: unknown) => (isNum(a) && isNum(b) && b > 0 ? (100 * a) / b : null)
export function quantile(arr: unknown[], q: number) {
  const x = nums(arr).sort((a, b) => a - b); if (!x.length) return null
  const i = (x.length - 1) * q; const lo = Math.floor(i), hi = Math.ceil(i)
  return x[lo] + (x[hi] - x[lo]) * (i - lo)
}
export function pctRank(v: unknown, arr: unknown[]) { const x = nums(arr); if (!x.length || !isNum(v)) return null; return (100 * x.filter(a => a <= v).length) / x.length }
export function minBy<T>(arr: T[], f: (x: T) => unknown): T | null { let best: T | null = null, bv = Infinity; arr.forEach(x => { const v = f(x); if (isNum(v) && v < bv) { bv = v; best = x } }); return best }
export function maxBy<T>(arr: T[], f: (x: T) => unknown): T | null { let best: T | null = null, bv = -Infinity; arr.forEach(x => { const v = f(x); if (isNum(v) && v > bv) { bv = v; best = x } }); return best }

export const DASH_ = '—'
export function fmtN(v: unknown, dec = 0) { return isNum(v) ? v.toLocaleString('es-PE', { minimumFractionDigits: dec, maximumFractionDigits: dec }) : DASH_ }
export function fmtPct(v: unknown, dec = 0) { return isNum(v) ? fmtN(v, dec) + '%' : DASH_ }
export function fmtSoles(v: unknown) { return isNum(v) ? 'S/ ' + fmtN(Math.round(v)) : DASH_ }
export function fmtSolesSigned(v: unknown) { return isNum(v) ? (v < 0 ? '−' : '') + 'S/ ' + fmtN(Math.abs(Math.round(v))) : DASH_ }
export function fmtK(v: unknown) { if (v === 0) return 'S/ 0'; return isNum(v) ? (v < 0 ? '−' : '') + 'S/ ' + fmtN(Math.abs(v) / 1000, Math.abs(v) >= 10000 ? 0 : 1) + 'k' : DASH_ }
export function fmtKm(v: unknown) { return isNum(v) ? fmtN(v, v < 10 ? 1 : 0) + ' km' : DASH_ }
export function fmtX(v: unknown) { return isNum(v) ? fmtN(v, 1) + '×' : DASH_ }
export function hh(h: number) { return String(h).padStart(2, '0') + ':00' }
export function plural(n: number, s: string, p?: string) { return n === 1 ? s : p || s + 's' }
export function trunc(s: unknown, n: number) { const t = String(s ?? '').replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n - 1).trimEnd() + '…' : t }
export function slug(s: unknown) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }
export function shortD(n: string | null | undefined) { return n === 'Santiago de Surco' ? 'Surco' : n || '' }
export function shortChain(c: string | null | undefined) { return c ? String(c).split(' (')[0].trim() : null }
export function joinY(a: string[]) { return a.length <= 1 ? a[0] || '' : a.slice(0, -1).join(', ') + ' y ' + a[a.length - 1] }
export function cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1) }
export function host(u: string) { try { return new URL(u).hostname.replace(/^www\./, '') } catch { return 'fuente' } }

/** Animaciones de gráficos activas salvo prefers-reduced-motion */
export const ANIM = typeof window === 'undefined' || !window.matchMedia('(prefers-reduced-motion: reduce)').matches
