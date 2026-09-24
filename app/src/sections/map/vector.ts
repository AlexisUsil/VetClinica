// Fondo vectorial OpenFreeMap (sin API key) montado dentro de Leaflet con maplibre-gl-leaflet.
// Se carga con import() dinámico: si algo falla, BaseLayer cae al raster de Esri.
import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { maplibreGL } from '@maplibre/maplibre-gl-leaflet'
// Worker de MapLibre empaquetado e inline (blob) para que funcione también desde file:// en el build de un solo archivo.
import InlineWorker from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&inline'

let workerReady = false
function ensureWorker() {
  if (workerReady) return
  const Orig = window.Worker
  let url: string | null = null
  try {
    // Captura la URL blob que genera el wrapper de Vite sin arrancar un worker real.
    ;(window as unknown as { Worker: unknown }).Worker = function (u: string | URL) {
      url = String(u)
      return { addEventListener() {}, removeEventListener() {}, terminate() {}, postMessage() {} }
    }
    new (InlineWorker as unknown as new () => unknown)()
  } catch (e) {
    console.warn('[map] no se pudo preparar el worker inline', e)
  } finally {
    window.Worker = Orig
  }
  // El sufijo '#….cjs' hace que MapLibre lo arranque como worker clásico (el bundle de Vite es IIFE),
  // lo que sí funciona desde file:// (los module workers con blob fallan con origen null).
  if (url) maplibregl.setWorkerUrl(String(url).startsWith('blob:') ? `${url}#maplibre-worker.cjs` : url)
  workerReady = true
}

export const OPENFREEMAP_STYLE = 'https://tiles.openfreemap.org/styles/positron'

export function makeVectorLayer() {
  ensureWorker()
  const lyr = maplibreGL({
    style: OPENFREEMAP_STYLE,
    attributionControl: false,
    interactive: false,
  })
  return lyr
}
