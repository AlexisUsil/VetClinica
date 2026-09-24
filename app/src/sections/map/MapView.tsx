import * as React from 'react'
import L from 'leaflet'
import { Circle, CircleMarker, GeoJSON, MapContainer, Marker, Pane, Polyline, Popup, Rectangle, Tooltip, useMap, useMapEvents } from 'react-leaflet'
import { ExternalLink, Phone, Target } from 'lucide-react'
import { ALL_CELLS, DIST, GEO, GEO_PLACES, POIS, byName, cellHigh, cellMax, isHighCell } from '@/data/dash'
import type { Cell, Place } from '@/data/types'
import { fmtKm, fmtN, fmtSoles, isNum, shortD } from '@/lib/format'
import { COLORS, ratingColor, type Analysis } from '@/lib/logic'
import { Pill, Stars } from '@/components/common/common'
import { BaseLayer } from './BaseLayer'

export type LayerKey = 'pins' | 'h24' | 'grid' | 'stars' | 'park' | 'pet_shop' | 'supermarket' | 'poly'
export const LAYER_DEF: { k: LayerKey; l: string; on: boolean }[] = [
  { k: 'pins', l: 'Clínicas', on: true },
  { k: 'h24', l: 'Clínicas 24h', on: true },
  { k: 'grid', l: 'Celdas de oportunidad', on: true },
  { k: 'stars', l: 'Zonas sugeridas', on: true },
  { k: 'poly', l: 'Límites distritales', on: true },
  { k: 'park', l: 'Parques', on: false },
  { k: 'pet_shop', l: 'Petshops', on: false },
  { k: 'supermarket', l: 'Supermercados', on: false },
]
const CELL_KM = 0.4

export function starSVG(n: number | string, size = 26) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true"><polygon points="12 1.5 15.2 8.1 22.4 9.1 17.2 14.1 18.5 21.3 12 17.9 5.5 21.3 6.8 14.1 1.6 9.1 8.8 8.1" fill="${COLORS.accent}" stroke="#fff" stroke-width="1.4"/><text x="12" y="15.6" text-anchor="middle" font-size="8.5" font-weight="700" font-family="Geist Variable, sans-serif" fill="#fff">${n}</text></svg>`
}
const starIcons = [1, 2, 3].map(n => L.divIcon({ className: 'star-ic', html: starSVG(n), iconSize: [26, 26], iconAnchor: [13, 13] }))
const pinIcon = L.divIcon({ className: 'pin-ic', html: `<svg width="30" height="38" viewBox="0 0 28 36" aria-hidden="true"><path d="M14 1C7 1 1.5 6.4 1.5 13.3 1.5 22.5 14 35 14 35s12.5-12.5 12.5-21.7C26.5 6.4 21 1 14 1z" fill="${COLORS.primaryDark}" stroke="#fff" stroke-width="2"/><circle cx="14" cy="13" r="4.5" fill="#fff"/></svg>`, iconSize: [30, 38], iconAnchor: [15, 37] })

function markerStyle(p: Place, active: boolean): L.PathOptions & { radius: number } {
  return {
    radius: 4 + 2.6 * Math.log10(1 + (p.reviews_count || 0)),
    fillColor: ratingColor(p.rating), fillOpacity: active ? 0.88 : 0.12,
    color: p.is_24h ? '#0F172A' : '#FFFFFF', weight: p.is_24h ? 2.5 : 1, opacity: active ? 1 : 0.15,
  }
}
function cellStyle(c: Cell): L.PathOptions {
  const thr = cellHigh[c.district || ''], mx = cellMax[c.district || '']
  if (isHighCell(c)) return { stroke: true, color: '#fff', weight: 0.5, fillColor: COLORS.primary, fillOpacity: 0.22 + 0.36 * (isNum(mx) && isNum(thr) && mx > thr ? ((c.score as number) - thr) / (mx - thr) : 1) }
  return { stroke: true, color: '#fff', weight: 0.5, fillColor: COLORS.muted, fillOpacity: 0.03 + 0.07 * (isNum(c.score) ? c.score / 100 : 0) }
}
function cellBounds(c: Cell): L.LatLngBoundsExpression {
  const dlat = CELL_KM / 110.57 / 2, dlng = CELL_KM / (111.32 * Math.cos((c.lat * Math.PI) / 180)) / 2
  return [[c.lat - dlat, c.lng - dlng], [c.lat + dlat, c.lng + dlng]]
}
const CELL_BOUNDS = ALL_CELLS.map(cellBounds)
const GEO_BOUNDS: Record<string, L.LatLngBounds> = {}
GEO.forEach(f => { const n = f.properties?.district; if (n) { try { GEO_BOUNDS[n] = L.geoJSON(f as unknown as GeoJSON.Feature).getBounds() } catch { /* geometría inválida */ } } })

function FitScope({ district, pinned }: { district: string; pinned: boolean }) {
  const map = useMap()
  const first = React.useRef(true)
  React.useEffect(() => {
    if (pinned) return
    const lays = district === 'all' ? Object.values(GEO_BOUNDS) : [GEO_BOUNDS[district]].filter(Boolean)
    let b: L.LatLngBounds | null = null
    lays.forEach(x => { if (x && x.isValid()) b = b ? b.extend(x) : L.latLngBounds(x.getSouthWest(), x.getNorthEast()) })
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (b) map.fitBounds(b, { padding: [16, 16], maxZoom: 15, animate: !first.current && !reduce })
    first.current = false
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [district, map])
  return null
}

function ClickLayer({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  const map = useMapEvents({
    click(e) { map.scrollWheelZoom.enable(); onClick(e.latlng.lat, e.latlng.lng) },
    mouseout() { map.scrollWheelZoom.disable() },
  })
  return null
}

function InvalidateOnResize() {
  const map = useMap()
  React.useEffect(() => {
    const el = map.getContainer()
    const ro = new ResizeObserver(() => map.invalidateSize())
    ro.observe(el)
    return () => ro.disconnect()
  }, [map])
  return null
}

function PlacePopup({ p, onExplore }: { p: Place & { lat: number; lng: number }; onExplore: (lat: number, lng: number) => void }) {
  return (
    <div className="grid min-w-52 gap-1.5 font-sans">
      <div className="text-[14px] leading-snug font-semibold text-foreground">{p.name}</div>
      <div className="flex items-center gap-2"><Stars r={p.rating} size={12} /><span className="text-xs text-muted-foreground">({fmtN(p.reviews_count)} reseñas)</span></div>
      <div className="flex flex-wrap gap-1">
        {p.is_24h ? <Pill tone="teal">24h confirmado</Pill> : p.is_24h_google ? <Pill tone="mid">24h solo en Google</Pill> : <Pill>Horario regular</Pill>}
        <Pill tone="gray">{shortD(p.district)}</Pill>
      </div>
      <div className="text-xs">Ticket <b className="tabular-nums">{fmtSoles(p.ticket)}</b>{isNum(p.consult_price) && <> · Consulta <b className="tabular-nums">{fmtSoles(p.consult_price)}</b></>}</div>
      {p.phone && <a className="inline-flex items-center gap-1 text-xs" href={`tel:${String(p.phone).replace(/\s+/g, '')}`}><Phone className="size-3" />{p.phone}</a>}
      {p.address && <div className="text-xs text-muted-foreground">{p.address}</div>}
      <div className="mt-1 flex flex-wrap gap-3 text-xs">
        {p.maps_url && <a href={p.maps_url} target="_blank" rel="noopener" className="inline-flex items-center gap-1 font-medium">Google Maps<ExternalLink className="size-3" /></a>}
        <button type="button" className="inline-flex items-center gap-1 font-medium text-[#0F766E] hover:underline" onClick={() => onExplore(p.lat, p.lng)}><Target className="size-3" />Explorar desde aquí</button>
      </div>
    </div>
  )
}

export interface MapViewProps {
  district: string
  layers: Record<LayerKey, boolean>
  exploring: boolean
  pin: { lat: number; lng: number } | null
  radius: 1 | 2
  analysis: Analysis | null
  onMapClick: (lat: number, lng: number) => void
  onPinMove: (lat: number, lng: number) => void
  onExplore: (lat: number, lng: number) => void
  onPlaceClick: (p: Place) => void
  onBaseMode?: (m: 'vector' | 'raster') => void
}

export function MapView(props: MapViewProps) {
  const { district, layers, pin, radius, analysis } = props
  const all = district === 'all'
  const raf = React.useRef(0)
  const polyStyle = React.useCallback((n: string): L.PathOptions => all ? { color: COLORS.primaryDark, weight: 1.4, opacity: 0.7, fill: false }
    : n === district ? { color: COLORS.primaryDark, weight: 2.6, opacity: 1, fill: false } : { color: COLORS.gray, weight: 0.8, opacity: 0.5, fill: false }, [all, district])
  const inSet = analysis?.inSet
  const near = analysis?.near24

  return (
    <MapContainer center={[-12.1, -77.0]} zoom={12} scrollWheelZoom={false} preferCanvas className="h-full w-full" attributionControl zoomControl>
      <BaseLayer onMode={props.onBaseMode} />
      <FitScope district={district} pinned={!!pin} />
      <ClickLayer onClick={props.onMapClick} />
      <InvalidateOnResize />

      <Pane name="grid" style={{ zIndex: 350 }}>
        {layers.grid && ALL_CELLS.map((c, i) => (all || c.district === district) ? (
          <Rectangle key={i} bounds={CELL_BOUNDS[i]} pathOptions={cellStyle(c)} pane="grid">
            <Tooltip sticky direction="top">
              <div className="text-xs"><b>Celda 400 m · score {fmtN(c.score)}</b>{isHighCell(c) && <span className="ml-1 text-[#0F766E]">· top 20%</span>}
                <div className="text-muted-foreground">{fmtN(c.clinics_1km)} clínicas a 1 km · 24h a {fmtKm(c.nearest_24h_km)}</div>
                <div className="text-muted-foreground">{fmtN(c.pois_500m)} parques/petshops/súper cerca</div></div>
            </Tooltip>
          </Rectangle>
        ) : null)}
      </Pane>
      <Pane name="bounds" style={{ zIndex: 360, pointerEvents: 'none' }}>
        {layers.poly && GEO.map(f => { const n = f.properties?.district || ''; return <GeoJSON key={n + district} data={f as unknown as GeoJSON.Feature} style={() => polyStyle(n)} interactive={false} pane="bounds" /> })}
      </Pane>
      <Pane name="pois" style={{ zIndex: 380 }}>
        {POIS.map((q, i) => {
          const k = q.kind === 'dog_park' ? 'park' : q.kind
          if (!(layers as Record<string, boolean>)[k]) return null
          const lbl = ({ park: 'Parque', dog_park: 'Parque canino', pet_shop: 'Petshop', supermarket: 'Supermercado' } as Record<string, string>)[q.kind] || q.kind
          const style: L.PathOptions & { radius: number } = q.kind === 'park' ? { radius: 3, fillColor: COLORS.good, fillOpacity: 0.55, weight: 0, color: COLORS.good }
            : q.kind === 'dog_park' ? { radius: 5, fillColor: COLORS.good, fillOpacity: 0.6, weight: 1.5, color: '#0F172A' }
            : q.kind === 'pet_shop' ? { radius: 3.5, fillColor: '#fff', fillOpacity: 1, weight: 1.6, color: '#334155' }
            : { radius: 3.5, fillColor: '#475569', fillOpacity: 0.9, weight: 0, color: '#475569' }
          return <CircleMarker key={i} center={[q.lat, q.lng]} pathOptions={style} radius={style.radius} pane="pois"><Tooltip direction="top">{lbl}{q.name ? `: ${q.name}` : ''}</Tooltip></CircleMarker>
        })}
      </Pane>
      <Pane name="pins" style={{ zIndex: 420 }}>
        {GEO_PLACES.filter(p => p.is_24h ? layers.h24 : layers.pins).sort((a, b) => Number(!!a.is_24h) - Number(!!b.is_24h)).map(p => {
          const inScope = all || p.district === district
          const on = pin && inSet ? inSet.has(p.id) : inScope
          const st = markerStyle(p, on)
          return (
            <CircleMarker key={p.id} center={[p.lat, p.lng]} radius={st.radius} pathOptions={st} pane="pins" bubblingMouseEvents={false}
              eventHandlers={{ click: () => props.onPlaceClick(p) }}>
              <Tooltip direction="top" offset={[0, -6]}>{p.name}</Tooltip>
              <Popup maxWidth={300}><PlacePopup p={p} onExplore={props.onExplore} /></Popup>
            </CircleMarker>
          )
        })}
      </Pane>
      {layers.stars && (all ? DIST : [byName(district)]).filter(Boolean).flatMap(d => (d!.best_cells || []).map((b, i) => (b && isNum(b.lat) && isNum(b.lng)) ? (
        <Marker key={`${d!.district}-${i}`} position={[b.lat, b.lng]} icon={starIcons[i] || starIcons[2]} zIndexOffset={1000} title={`Zona sugerida ${i + 1} · ${d!.district}`}
          eventHandlers={{ click: () => props.onExplore(b.lat, b.lng) }}>
          <Tooltip direction="top" offset={[0, -10]}><div className="text-xs"><b>Zona {i + 1} · {shortD(d!.district)} · score {fmtN(b.score)}</b><div className="text-muted-foreground">{fmtN(b.clinics_1km)} clínicas a 1 km · 24h a {fmtKm(b.nearest_24h_km)}</div><div className="text-[#0F766E]">Clic para explorar</div></div></Tooltip>
        </Marker>
      ) : null))}

      {pin && (
        <>
          <Circle center={[pin.lat, pin.lng]} radius={1000} pathOptions={{ color: COLORS.primaryDark, weight: radius === 1 ? 2.2 : 1.2, fillColor: COLORS.primary, fillOpacity: radius === 1 ? 0.07 : 0.03 }} interactive={false} />
          <Circle center={[pin.lat, pin.lng]} radius={2000} pathOptions={{ color: COLORS.primaryDark, weight: radius === 2 ? 2 : 1.2, dashArray: '6 6', fill: radius === 2, fillColor: COLORS.primary, fillOpacity: 0.04 }} interactive={false} />
          {near && (
            <>
              <Polyline positions={[[pin.lat, pin.lng], [near.p.lat, near.p.lng]]} pathOptions={{ color: '#0F172A', weight: 1.5, dashArray: '4 5' }} interactive={false} />
              <CircleMarker center={[near.p.lat, near.p.lng]} radius={9} pathOptions={{ color: '#0F172A', weight: 2, fill: false }} interactive={false}>
                <Tooltip permanent direction="right" offset={[10, 0]} className="map-label">24h a {fmtKm(near.d)}</Tooltip>
              </CircleMarker>
            </>
          )}
          <Marker position={[pin.lat, pin.lng]} icon={pinIcon} draggable zIndexOffset={2000} keyboard title="Ubicación candidata (arrastrable)"
            eventHandlers={{
              drag: e => { const ll = (e.target as L.Marker).getLatLng(); cancelAnimationFrame(raf.current); raf.current = requestAnimationFrame(() => props.onPinMove(ll.lat, ll.lng)) },
              dragend: e => { const ll = (e.target as L.Marker).getLatLng(); props.onPinMove(ll.lat, ll.lng) },
            }} />
        </>
      )}
    </MapContainer>
  )
}
