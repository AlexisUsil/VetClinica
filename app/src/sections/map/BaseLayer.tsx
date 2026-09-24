import * as React from 'react'
import L from 'leaflet'
import { useMap } from 'react-leaflet'

const ESRI = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/'
const ESRI_ATTR = 'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap'
const OFM_ATTR = '&copy; <a href="https://openfreemap.org" target="_blank" rel="noopener">OpenFreeMap</a> &copy; <a href="https://www.openmaptiles.org/" target="_blank" rel="noopener">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'

function hasWebGL() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')) } catch { return false }
}

/** Fondo del mapa: vector OpenFreeMap (positron); si falla WebGL, la red o el worker, raster Esri World Light Gray. */
export function BaseLayer({ onMode }: { onMode?: (m: 'vector' | 'raster') => void }) {
  const map = useMap()
  React.useEffect(() => {
    let cancelled = false
    map.attributionControl.setPrefix('<a href="https://leafletjs.com" target="_blank" rel="noopener">Leaflet</a>')
    let vec: L.Layer | null = null
    const rasters: L.TileLayer[] = []
    let timer: number | undefined
    const useRaster = (why: string) => {
      if (cancelled || rasters.length) return
      if (why) console.info('[map] usando fondo raster Esri:', why)
      if (vec) { try { map.removeLayer(vec) } catch { /* ya removida */ } vec = null }
      rasters.push(L.tileLayer(ESRI + 'World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', { maxZoom: 16, attribution: ESRI_ATTR }).addTo(map))
      rasters.push(L.tileLayer(ESRI + 'World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}', { maxZoom: 16 }).addTo(map))
      rasters.forEach(r => r.bringToBack())
      onMode?.('raster')
    }
    const forced = /[?&]raster\b/.test(location.search)
    if (forced || !hasWebGL()) useRaster(forced ? '' : 'WebGL no disponible')
    else {
      import('./vector').then(({ makeVectorLayer }) => {
        if (cancelled) return
        try {
          const lyr = makeVectorLayer()
          vec = lyr
          lyr.addTo(map)
          map.attributionControl.addAttribution(OFM_ATTR)
          const ml = lyr.getMaplibreMap()
          if (import.meta.env.DEV) (window as unknown as { __ml: unknown }).__ml = ml
          let loaded = false
          ml.once('load', () => { loaded = true; if (!cancelled && !rasters.length) onMode?.('vector') })
          ml.on('error', (e: { error?: { message?: string } }) => { if (!loaded) useRaster(e?.error?.message || 'error de estilo') })
          // Si en 12 s (con la pestaña visible) no cargó, pasamos al raster.
          let waited = 0
          const tick = () => {
            if (loaded || cancelled) return
            if (document.visibilityState === 'visible') waited += 1000
            if (waited >= 12000) useRaster('timeout del fondo vectorial')
            else timer = window.setTimeout(tick, 1000)
          }
          timer = window.setTimeout(tick, 1000)
        } catch (e) { useRaster(String(e)) }
      }).catch(e => useRaster(String(e)))
    }
    return () => {
      cancelled = true
      window.clearTimeout(timer)
      if (vec) { try { map.removeLayer(vec) } catch { /* noop */ } }
      rasters.forEach(r => map.removeLayer(r))
      try { map.attributionControl.removeAttribution(OFM_ATTR) } catch { /* noop */ }
    }
  }, [map, onMode])
  return null
}
