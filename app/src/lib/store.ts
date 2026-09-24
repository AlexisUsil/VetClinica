import { useSyncExternalStore } from 'react'
import { DNAMES } from '@/data/dash'
import { slug } from './format'

/** Distrito seleccionado ('all' | nombre). Vive en el hash de la URL: #todos, #santiago-de-surco … */
export function districtFromHash(h: string): string | null {
  const sl = h.replace(/^#/, '')
  if (!sl) return null
  if (sl === 'todos') return 'all'
  return DNAMES.find(d => slug(d) === sl || slug(d).endsWith('-' + sl)) || null
}
let current = districtFromHash(typeof location !== 'undefined' ? location.hash : '') || 'all'
const subs = new Set<() => void>()
const emit = () => subs.forEach(f => f())
if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', () => {
    const d = districtFromHash(location.hash)
    if (d && d !== current) { current = d; emit() }
  })
}
export function setDistrict(d: string) {
  const next = d && DNAMES.includes(d) ? d : 'all'
  if (next === current) return
  current = next
  const h = next === 'all' ? '#todos' : '#' + slug(next)
  if (location.hash !== h) history.replaceState(null, '', h)
  emit()
}
export function useDistrict() {
  return useSyncExternalStore(cb => { subs.add(cb); return () => subs.delete(cb) }, () => current, () => current)
}

/* --- canal simple para pedir "explorar aquí" al mapa desde otras secciones --- */
type ExploreReq = { lat: number; lng: number; t: number }
let exploreReq: ExploreReq | null = null
const exSubs = new Set<() => void>()
export function requestExplore(lat: number, lng: number) {
  exploreReq = { lat, lng, t: Date.now() }
  exSubs.forEach(f => f())
  document.getElementById('mapa')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
}
export function useExploreRequest() {
  return useSyncExternalStore(cb => { exSubs.add(cb); return () => exSubs.delete(cb) }, () => exploreReq, () => exploreReq)
}

export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
}
