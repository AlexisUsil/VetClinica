import * as React from 'react'
import { ChevronLeft, ChevronRight, Crosshair, Layers, Target, X } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { DIST, PLACES, RANK, byName, rankOf } from '@/data/dash'
import type { Place } from '@/data/types'
import { fmtKm, fmtN, fmtPct, isNum, maxBy, minBy, pct, shortD } from '@/lib/format'
import { COLORS, analyze, labelTone, legalStatus, type Scope } from '@/lib/logic'
import { setDistrict, useExploreRequest } from '@/lib/store'
import { Insight, LegalDot, LegalPill, Panel, Pill, Reveal, Rich, Section, Stars, CardHead } from '@/components/common/common'
import { LAYER_DEF, MapView, starSVG, type LayerKey } from './map/MapView'
import { ExplorePanel } from './map/ExplorePanel'

function useMedia(q: string) {
  const [m, setM] = React.useState(() => typeof window !== 'undefined' && matchMedia(q).matches)
  React.useEffect(() => { const mq = matchMedia(q); const f = () => setM(mq.matches); mq.addEventListener('change', f); return () => mq.removeEventListener('change', f) }, [q])
  return m
}

function MapLegend({ layers, pinned }: { layers: Record<LayerKey, boolean>; pinned: boolean }) {
  const dot = (c: string, ring = false) => <i className="inline-block size-2.5 rounded-full" style={{ background: ring ? '#fff' : c, boxShadow: ring ? 'inset 0 0 0 2px #0F172A' : undefined }} />
  return (
    <div className="pointer-events-auto grid gap-1 rounded-lg border bg-white/95 px-3 py-2 text-[11px] shadow-md backdrop-blur">
      {(layers.pins || layers.h24) && <>
        <b className="text-[11px] font-semibold">Rating</b>
        <span className="flex items-center gap-1.5">{dot(COLORS.good)}4.5 o más</span>
        <span className="flex items-center gap-1.5">{dot(COLORS.mid)}4.0 – 4.4</span>
        <span className="flex items-center gap-1.5">{dot(COLORS.bad)}Menos de 4.0</span>
        <span className="flex items-center gap-1.5">{dot('#0F172A', true)}Atiende 24h</span>
      </>}
      {(layers.grid || layers.stars || pinned) && <b className="mt-1 text-[11px] font-semibold">Oportunidad</b>}
      {layers.grid && <span className="flex items-center gap-1.5"><i className="inline-block size-2.5 rounded-[2px]" style={{ background: 'rgba(13,148,136,.5)' }} />Celda top 20%</span>}
      {layers.stars && <span className="flex items-center gap-1.5"><span dangerouslySetInnerHTML={{ __html: starSVG('', 13) }} />Zona sugerida</span>}
      {pinned && <span className="flex items-center gap-1.5"><i className="inline-block size-2.5 rounded-full border-2 border-[#0F766E]" />Radio 1 · 2 km</span>}
    </div>
  )
}

function Profile({ S }: { S: Scope }) {
  if (S.all) {
    return (
      <Panel className="h-full p-5">
        <div className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">Perfil</div>
        <div className="text-lg font-semibold">Todos los distritos</div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {[['Clínicas', fmtN(S.count)], ['24 horas', `${fmtN(S.n24)} · ${fmtPct(S.pct24)}`], ['Rating prom.', fmtN(S.avgRating, 2)], ['Reseñas', fmtN(S.totalRev)]].map(([l, v]) => (
            <div key={l} className="rounded-lg bg-muted/60 p-2.5"><div className="text-[11px] text-muted-foreground">{l}</div><div className="text-lg font-semibold tabular-nums">{v}</div></div>
          ))}
        </div>
        <div className="mt-4 text-xs font-semibold">Ranking de oportunidad</div>
        <ol className="mt-2 grid gap-1">
          {RANK.map(n => { const d = byName(n)!; return (
            <li key={n}>
              <button type="button" onClick={() => setDistrict(n)} className="grid w-full grid-cols-[22px_1fr_auto] items-center gap-2 rounded-md px-1.5 py-1.5 text-left text-[13px] hover:bg-muted">
                <span className={cn('grid size-5 place-items-center rounded-full text-[10px] font-semibold tabular-nums', rankOf(n) === 1 ? 'bg-opp text-white' : 'bg-muted text-muted-foreground')}>{rankOf(n)}</span>
                <span className="flex min-w-0 items-center gap-1.5"><LegalDot lvl={legalStatus(d).lvl} /><span className="truncate font-medium">{n}</span></span>
                <span className="text-xs text-muted-foreground tabular-nums">{fmtN(d.count)} · <b className="text-foreground">{fmtN(d.score)}</b></span>
              </button>
            </li>) })}
        </ol>
        <p className="mt-3 text-xs text-muted-foreground">Elige un distrito arriba o haz clic en un pin.</p>
      </Panel>
    )
  }
  const d = S.d!
  return (
    <Panel className="h-full p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">Perfil · #{rankOf(d.district)} del ranking</div>
          <div className="text-lg font-semibold">{d.district}</div>
        </div>
        <Pill tone={labelTone(d.score_label)}>{fmtN(d.score)} · {d.score_label || '—'}</Pill>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {[['Clínicas', fmtN(S.count)], ['24 horas', `${fmtN(S.n24)} · ${fmtPct(S.pct24)}`], ['Rating prom.', fmtN(S.avgRating, 2)], ['Hogares/clínica', fmtN(d.households_per_clinic)], ['Alquiler USD/m²', isNum(d.rent_usd_m2) ? 'US$ ' + fmtN(d.rent_usd_m2, 1) : '—'], ['Competid. a 1 km', fmtN(d.avg_competitors_1km, 1)]].map(([l, v]) => (
          <div key={l} className="rounded-lg bg-muted/60 p-2.5"><div className="text-[11px] text-muted-foreground">{l}</div><div className="text-lg font-semibold tabular-nums">{v}</div></div>
        ))}
      </div>
      <div className="mt-3"><LegalPill d={d} long /></div>
      <div className="mt-4 text-xs font-semibold">Top 3 por reseñas</div>
      <ol className="mt-2 grid gap-2">
        {S.top.slice(0, 3).map((t, i) => (
          <li key={t.p.id} className="flex items-start gap-2 text-[13px]">
            <span className="grid size-5 shrink-0 place-items-center rounded-full bg-muted text-[10px] font-semibold">{i + 1}</span>
            <div className="min-w-0"><div className="truncate font-medium">{t.name}</div><div className="flex items-center gap-2 text-xs text-muted-foreground"><Stars r={t.rating} size={10} />{fmtN(t.reviews)} reseñas{t.is_24h ? ' · 24h' : ''}</div></div>
          </li>
        ))}
      </ol>
      <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => setDistrict('all')}><Layers />Ver todos los distritos</Button>
    </Panel>
  )
}

function ZoneBadge({ n }: { n: number }) {
  return <span className="inline-grid size-6 place-items-center rounded-full bg-opp text-[11px] font-semibold text-white tabular-nums shadow-sm">{n}</span>
}
function BestZones({ S, onExplore }: { S: Scope; onExplore: (lat: number, lng: number) => void }) {
  const PAGE = 5
  const [page, setPage] = React.useState(0)
  const ds = S.all ? RANK.map(byName).filter(Boolean) : [S.d].filter(Boolean)
  const all = ds.flatMap(d => (d!.best_cells || []).map((b, i) => ({ d: d!, b, i }))).filter(x => x.b)
  const pages = Math.max(1, Math.ceil(all.length / PAGE))
  React.useEffect(() => { setPage(0) }, [S.district])
  const pg = Math.min(page, pages - 1)
  const rows = all.slice(pg * PAGE, pg * PAGE + PAGE)
  return (
    <Panel>
      <CardHead title={S.all ? 'Las 3 mejores zonas de cada distrito' : `Las 3 mejores zonas de ${S.name}`} sub="Celdas de 400 m · score 0–100 · clic en Explorar para analizar el entorno" />
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[620px] text-[13px]">
          <thead><tr className="border-y bg-muted/50 text-xs text-muted-foreground">
            <th className="px-5 py-2 text-left font-medium">Distrito</th><th className="px-3 py-2 text-center font-medium">Zona</th><th className="px-3 py-2 text-left font-medium">Score</th>
            <th className="px-3 py-2 text-right font-medium">Clínicas 1 km</th><th className="px-3 py-2 text-right font-medium">24h más cercano</th><th className="px-3 py-2 text-right font-medium">Actividad cerca</th><th className="px-5 py-2"><span className="sr-only">Acción</span></th>
          </tr></thead>
          <tbody>
            {rows.map(({ d, b, i }) => (
              <tr key={`${d.district}-${i}`} className="border-b last:border-0 hover:bg-muted/40">
                <td className="px-5 py-2"><span className="flex items-center gap-1.5 font-medium"><LegalDot lvl={legalStatus(d).lvl} />{shortD(d.district)}</span></td>
                <td className="px-3 py-2 text-center"><ZoneBadge n={i + 1} /></td>
                <td className="px-3 py-2"><span className="flex items-center gap-2"><b className="w-6 tabular-nums">{fmtN(b.score)}</b><span className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100"><span className="block h-full rounded-full bg-primary" style={{ width: `${b.score || 0}%` }} /></span></span></td>
                <td className="px-3 py-2 text-right tabular-nums">{fmtN(b.clinics_1km)}</td>
                <td className="px-3 py-2 text-right tabular-nums">{fmtKm(b.nearest_24h_km)}</td>
                <td className="px-3 py-2 text-right tabular-nums">{fmtN(b.pois_500m)}</td>
                <td className="px-5 py-2 text-right">{isNum(b.lat) && isNum(b.lng) && <Button size="xs" variant="ghost" className="text-[#0F766E]" onClick={() => onExplore(b.lat, b.lng)}><Crosshair />Explorar</Button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t px-5 py-3 text-[13px]">
          <span className="text-muted-foreground">Mostrando <b className="text-foreground tabular-nums">{fmtN(pg * PAGE + 1)}–{fmtN(Math.min(all.length, (pg + 1) * PAGE))}</b> de <b className="text-foreground tabular-nums">{fmtN(all.length)}</b></span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage(Math.max(0, pg - 1))} disabled={pg === 0} aria-label="Página anterior"><ChevronLeft />Anterior</Button>
            <span className="tabular-nums text-muted-foreground">{fmtN(pg + 1)} de {fmtN(pages)}</span>
            <Button variant="outline" size="sm" onClick={() => setPage(Math.min(pages - 1, pg + 1))} disabled={pg >= pages - 1} aria-label="Página siguiente">Siguiente<ChevronRight /></Button>
          </div>
        </div>
      )}
    </Panel>
  )
}

export function MapSection({ S }: { S: Scope }) {
  const [layers, setLayers] = React.useState<Record<LayerKey, boolean>>(() => Object.fromEntries(LAYER_DEF.map(x => [x.k, x.on])) as Record<LayerKey, boolean>)
  const [exploring, setExploring] = React.useState(false)
  const [pin, setPin] = React.useState<{ lat: number; lng: number } | null>(null)
  const [radius, setRadius] = React.useState<1 | 2>(1)
  const [baseMode, setBaseMode] = React.useState<'vector' | 'raster' | null>(null)
  const desktop = useMedia('(min-width: 1024px)')
  const analysis = React.useMemo(() => (pin ? analyze(pin.lat, pin.lng, radius) : null), [pin, radius])
  const req = useExploreRequest()

  const placePin = React.useCallback((lat: number, lng: number) => { if (isNum(lat) && isNum(lng)) { setPin({ lat, lng }); setExploring(true) } }, [])
  const clear = React.useCallback(() => { setPin(null); setExploring(false) }, [])
  React.useEffect(() => { if (req) placePin(req.lat, req.lng) }, [req, placePin])
  React.useEffect(() => {
    const f = (e: KeyboardEvent) => { if (e.key === 'Escape' && (exploring || pin)) clear() }
    window.addEventListener('keydown', f); return () => window.removeEventListener('keydown', f)
  }, [exploring, pin, clear])

  const onMapClick = React.useCallback((lat: number, lng: number) => { if (exploring) placePin(lat, lng) }, [exploring, placePin])
  const onPlaceClick = React.useCallback((p: Place) => { if (!exploring && !pin && S.district !== p.district) setDistrict(p.district) }, [exploring, pin, S.district])

  let txt: string
  if (S.all) {
    const most = maxBy(DIST, d => d.count), least = minBy(DIST, d => d.count)
    txt = most && least ? `**${most.district}** concentra ${fmtN(most.count)} de ${fmtN(PLACES.length)} clínicas (${fmtPct(pct(most.count, PLACES.length))}); **${least.district}** es el que menos competidores tiene (${fmtN(least.count)}). Solo ${fmtPct(S.pct24)} atiende 24 horas.` : 'Aún no hay datos de distritos.'
  } else {
    const t = S.top[0]
    txt = `${S.name} tiene **${fmtN(S.count)} clínicas**, ${fmtN(S.n24)} de ellas 24h (${fmtPct(S.pct24)}).` + (t ? ` La más reseñada, **${t.name}**, reúne ${fmtPct(t.share, 1)} de las reseñas del distrito.` : '')
  }

  return (
    <Section id="mapa" n="01" eyebrow="Mapa de la competencia" title="¿Dónde está hoy la competencia?" insight={<Insight><Rich text={txt} /></Insight>}>
      <Reveal>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Button onClick={() => (exploring || pin ? clear() : setExploring(true))} className={cn('h-9', exploring || pin ? 'bg-ink hover:bg-ink/90' : '')} aria-pressed={exploring || !!pin}>
            {exploring || pin ? <><X />Salir de Explorar</> : <><Target />Explorar una ubicación</>}
          </Button>
          <span className="text-[13px] text-muted-foreground" aria-live="polite">{exploring && !pin ? 'Haz clic en el mapa donde abrirías el local' : pin ? 'Arrastra el pin para moverlo' : 'Clic en una estrella naranja para ver una zona sugerida'}</span>
          <Popover>
            <PopoverTrigger asChild><Button variant="outline" className="ml-auto h-9"><Layers />Capas</Button></PopoverTrigger>
            <PopoverContent align="end" className="z-[1150] w-56 p-3">
              <div className="mb-2 text-xs font-semibold">Capas del mapa</div>
              <div className="grid gap-2">
                {LAYER_DEF.map(x => (
                  <label key={x.k} className="flex cursor-pointer items-center gap-2 text-[13px]">
                    <Checkbox checked={layers[x.k]} onCheckedChange={v => setLayers(l => ({ ...l, [x.k]: v === true }))} />{x.l}
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </Reveal>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Reveal>
          <Panel className={cn('relative isolate h-[440px] sm:h-[520px] lg:h-[600px]', exploring && 'map-exploring')}>
            <MapView district={S.district} layers={layers} exploring={exploring} pin={pin} radius={radius} analysis={analysis}
              onMapClick={onMapClick} onPinMove={(lat, lng) => setPin({ lat, lng })} onExplore={placePin} onPlaceClick={onPlaceClick} onBaseMode={setBaseMode} />
            <div className="pointer-events-none absolute bottom-6 left-2 z-[500] hidden sm:block"><MapLegend layers={layers} pinned={!!pin} /></div>
            {baseMode === 'raster' && <span className="pointer-events-none absolute top-2 left-14 z-[500] rounded bg-white/90 px-1.5 py-0.5 text-[10px] text-muted-foreground shadow">fondo raster</span>}
          </Panel>
        </Reveal>
        <Reveal delay={0.06}><Profile S={S} /></Reveal>
      </div>
      <Reveal className="mt-4"><BestZones S={S} onExplore={placePin} /></Reveal>

      <Sheet modal={false} open={!!pin && !!analysis} onOpenChange={o => { if (!o) clear() }}>
        <SheetContent side={desktop ? 'right' : 'bottom'} showCloseButton={false}
          onInteractOutside={e => e.preventDefault()} onOpenAutoFocus={e => e.preventDefault()}
          className={cn('z-[1200] gap-0 bg-background p-0 shadow-2xl', desktop ? 'w-[380px] sm:max-w-[380px]' : 'max-h-[58vh] rounded-t-2xl')}>
          <SheetTitle className="sr-only">Explorar ubicación</SheetTitle>
          <SheetDescription className="sr-only">Métricas del entorno del punto elegido en el mapa</SheetDescription>
          {!desktop && <div className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-slate-300" aria-hidden />}
          {pin && analysis && <ExplorePanel A={analysis} lat={pin.lat} lng={pin.lng} radius={radius} onRadius={setRadius} onClose={clear} />}
        </SheetContent>
      </Sheet>
    </Section>
  )
}
