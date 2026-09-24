import * as React from 'react'
import { Bar, CartesianGrid, Cell as CellFill, ComposedChart, LabelList, Line, ReferenceArea, Tooltip, XAxis, YAxis } from 'recharts'
import { Building2, CalendarClock, Cat, Dog, FileSearch, Heart, Info, MapPin, TrendingUp, Wallet } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DASH } from '@/data/dash'
import type { MarketYear, Persona } from '@/data/types'
import { fmtN, fmtPct, host, isNum, maxBy, sum, trunc, ANIM } from '@/lib/format'
import { COLORS } from '@/lib/logic'
import { ChartContainer } from '@/components/ui/chart'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CardHead, Empty, Insight, Panel, Pill, Reveal, Rich, Section, Stars, TipCard } from '@/components/common/common'
import { KpiCard } from '@/components/common/kpi'

const M = DASH.market || {}
const SERIES: MarketYear[] = (Array.isArray(M.series) ? M.series : []).filter(s => s && isNum(s.year)).slice().sort((a, b) => a.year - b.year)
const PERSONAS: Persona[] = Array.isArray(DASH.personas) ? DASH.personas.filter(p => p && p.id) : []

const CATS = [
  { k: 'food', l: 'Alimento', c: COLORS.primaryDark },
  { k: 'products', l: 'Productos', c: '#5EEAD4' },
  { k: 'vet', l: 'Veterinaria', c: '#475569' },
  { k: 'other', l: 'Otros', c: COLORS.slate2 },
] as const
type CatK = (typeof CATS)[number]['k']
const KEYS = CATS.filter(c => SERIES.some(s => isNum(s[c.k])))

const totalOf = (s: MarketYear | undefined) => !s ? null : isNum(s.total) ? s.total : (KEYS.some(c => isNum(s[c.k])) ? sum(KEYS.map(c => s[c.k])) : null)
const emOf = (s: MarketYear | undefined) => !s ? null : isNum(s.euromonitor_pet_care) ? s.euromonitor_pet_care : totalOf(s)
const cagr = (a: number | null, b: number | null, n: number) => isNum(a) && isNum(b) && a > 0 && n > 0 ? (Math.pow(b / a, 1 / n) - 1) * 100 : null
const byYear = (y: number | null | undefined) => SERIES.find(s => s.year === y)

/** Último año "real": dato no estimado seguido de un año estimado (fin de la serie observada) */
const CUT: number | null = (() => {
  for (let i = SERIES.length - 2; i >= 0; i--) if (!SERIES[i].estimated && SERIES[i + 1].estimated) return SERIES[i].year
  const r = SERIES.filter(s => !s.estimated); return r.length ? r[r.length - 1].year : null
})()
const FIRST = SERIES[0]?.year ?? null
const LAST = SERIES[SERIES.length - 1]?.year ?? null
const FIRST_REAL = SERIES.find(s => !s.estimated)?.year ?? FIRST

function splitSource(src?: string | null) {
  const s = String(src || '').trim(); if (!s) return null
  const m = s.match(/^(.*?)(?:\s*-\s*)?(https?:\/\/\S+)\s*$/)
  return m ? { text: m[1].trim(), url: m[2] } : { text: s, url: null }
}

function useNarrow(q = '(max-width: 640px)') {
  const [n, setN] = React.useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches)
  React.useEffect(() => {
    const m = window.matchMedia(q); const f = () => setN(m.matches)
    m.addEventListener('change', f); return () => m.removeEventListener('change', f)
  }, [q])
  return n
}

type Row = { year: number; lbl: string; est: boolean; total: number | null; g: number | null; src: string | null } & Partial<Record<CatK, number | null>>

function MarketChart() {
  const narrow = useNarrow()
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, '')
  if (!SERIES.length || !KEYS.length) return <div className="px-5 pb-5"><Empty msg="Aún no hay serie de mercado." /></div>
  const data: Row[] = SERIES.map((s, i) => {
    const t = totalOf(s), p = i > 0 ? totalOf(SERIES[i - 1]) : null
    const row: Row = { year: s.year, lbl: narrow ? `'${String(s.year).slice(2)}` : String(s.year), est: !!s.estimated, total: t, g: isNum(t) && isNum(p) && p > 0 ? (t / p - 1) * 100 : null, src: s.source || null }
    KEYS.forEach(c => { row[c.k] = isNum(s[c.k]) ? (s[c.k] as number) : null })
    return row
  })
  const maxT = Math.max(1, ...data.map(d => d.total).filter(isNum))
  const yTop = Math.ceil(maxT * 1.15)
  const gs = data.map(d => d.g).filter(isNum)
  const gMin = gs.length ? Math.min(...gs) : 0, gMax = gs.length ? Math.max(...gs) : 10
  // franja propia para el crecimiento, encima de las barras (mismo eje X y anchos de eje => puntos alineados)
  const gLo = Math.min(-5, Math.floor(gMin - 5)), gHi = Math.max(35, Math.ceil(gMax * 1.15))
  const gTicks = [0, 10, 20, 30, 40, 50, 60].filter(t => t >= gLo && t <= gHi)
  const projIdx = CUT != null ? data.findIndex(d => d.year > CUT) : -1
  const lastKey = KEYS[KEYS.length - 1].k
  const fill = (k: string, est: boolean) => est ? `url(#${uid}-${k})` : CATS.find(c => c.k === k)!.c
  const LW = narrow ? 38 : 44, RW = narrow ? 0 : 34
  const margin = { right: narrow ? 0 : 6, left: 0 }
  const gap = narrow ? '14%' : '22%'
  const proj = (label: boolean) => projIdx > 0 && (
    <ReferenceArea yAxisId={label ? 'r' : 'v'} x1={data[projIdx].lbl} x2={data[data.length - 1].lbl} ifOverflow="visible"
      shape={(p: { x?: number; y?: number; width?: number; height?: number }) => {
        const x = (p.x ?? 0) - 2, y = p.y ?? 0, w = p.width ?? 0, h = p.height ?? 0
        return (
          <g>
            <rect x={x} y={y} width={w + 2} height={h} fill="#F8FAFC" />
            <line x1={x} x2={x} y1={label ? y - 14 : y} y2={y + h} stroke="#64748B" strokeDasharray="4 4" strokeWidth={1.2} />
            {label && <text x={x + 6} y={y - 4} fontSize={narrow ? 10 : 11} fill="#475569" fontWeight={600}>{narrow ? 'proyección →' : 'proyección Euromonitor →'}</text>}
          </g>
        )
      }} />
  )

  return (
    <div className="px-2 pb-4 sm:px-3">
      <ChartContainer config={{ g: { label: 'Crec. a/a', color: COLORS.accent } }} className="aspect-auto h-[84px] w-full sm:h-[96px]">
        <ComposedChart data={data} syncId={uid} margin={{ ...margin, top: 22, bottom: 0 }} barCategoryGap={gap}>
          <XAxis dataKey="lbl" hide scale="band" />
          <YAxis yAxisId="l" width={LW} tick={false} tickLine={false} axisLine={false} />
          <YAxis yAxisId="r" orientation="right" domain={[gLo, gHi]} ticks={gTicks} hide={narrow} tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: COLORS.accentInk }} width={RW} tickFormatter={(v: number) => `${v}%`} />
          {proj(true)}
          <Tooltip cursor={{ fill: 'rgba(13,148,136,0.06)' }} content={() => null} />
          <Line yAxisId="r" dataKey="g" type="linear" stroke={COLORS.accent} strokeWidth={2} connectNulls isAnimationActive={ANIM}
            dot={{ r: 3, fill: '#fff', stroke: COLORS.accent, strokeWidth: 1.8 }} activeDot={{ r: 4.5, fill: COLORS.accent }}>
            <LabelList dataKey="g" position="top" offset={6} fontSize={narrow ? 9 : 10} fill={COLORS.accentInk} fontWeight={600} formatter={(v: unknown) => (isNum(v) ? `${v >= 0 ? '+' : ''}${fmtN(v)}%` : '')} />
          </Line>
        </ComposedChart>
      </ChartContainer>
      <ChartContainer config={{ total: { label: 'Total', color: COLORS.primary } }} className="aspect-auto h-[260px] w-full sm:h-[300px]">
        <ComposedChart data={data} syncId={uid} margin={{ ...margin, top: 18, bottom: 0 }} barCategoryGap={gap}>
          <defs>
            {KEYS.map(c => (
              <pattern key={c.k} id={`${uid}-${c.k}`} patternUnits="userSpaceOnUse" width={6} height={6} patternTransform="rotate(45)">
                <rect width={6} height={6} fill={c.c} fillOpacity={0.3} />
                <line x1={0} y1={0} x2={0} y2={6} stroke={c.c} strokeWidth={2.4} strokeOpacity={0.85} />
              </pattern>
            ))}
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#EEF2F6" />
          <XAxis dataKey="lbl" tickLine={false} axisLine={false} tick={{ fontSize: narrow ? 10 : 11 }} interval={0} />
          <YAxis yAxisId="v" domain={[0, yTop]} tickLine={false} axisLine={false} tick={{ fontSize: 10 }} width={LW} tickFormatter={(v: number) => fmtN(v)} allowDecimals={false} />
          <YAxis yAxisId="r" orientation="right" hide={narrow} width={RW} tick={false} tickLine={false} axisLine={false} />
          {proj(false)}
          <Tooltip cursor={{ fill: 'rgba(13,148,136,0.06)' }} content={({ active, payload }) => {
            if (!active || !payload?.length) return null
            const d = payload[0].payload as Row; const src = splitSource(d.src)
            return <TipCard title={<span className="flex items-center gap-2">{d.year}<Pill tone={d.est ? 'mid' : CUT != null && d.year > CUT ? 'teal' : 'good'}>{d.est ? 'estimado' : CUT != null && d.year > CUT ? 'proyección' : 'dato publicado'}</Pill></span>}
              rows={[...KEYS.slice().reverse().map(c => ({ k: c.l, v: isNum(d[c.k]) ? `US$ ${fmtN(d[c.k], 1)} M` : '—', color: c.c })), { k: 'Total', v: isNum(d.total) ? `US$ ${fmtN(d.total, 1)} M` : '—', strong: true }, { k: 'Crec. a/a', v: isNum(d.g) ? `${d.g >= 0 ? '+' : ''}${fmtN(d.g, 1)}%` : '—', color: COLORS.accent }]}
              foot={src ? <span>{trunc(src.text, 110)}{src.url && <> · <span className="text-foreground">{host(src.url)}</span></>}</span> : undefined} />
          }} />
          {KEYS.map((c, i) => (
            <Bar key={c.k} yAxisId="v" dataKey={c.k} name={c.l} stackId="m" isAnimationActive={ANIM} animationDuration={700 + i * 80} radius={c.k === lastKey ? [3, 3, 0, 0] : 0} stroke="#fff" strokeWidth={0.6}>
              {data.map(d => <CellFill key={d.year} fill={fill(c.k, d.est)} />)}
              {c.k === lastKey && <LabelList dataKey="total" position="top" offset={4} className="fill-foreground font-semibold tabular-nums" fontSize={narrow ? 9 : 11} formatter={(v: unknown) => (isNum(v) ? fmtN(v) : '')} />}
            </Bar>
          ))}
        </ComposedChart>
      </ChartContainer>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 px-2 text-xs text-muted-foreground">
        {KEYS.slice().reverse().map(c => <span key={c.k} className="inline-flex items-center gap-1.5"><i className="inline-block size-2.5 rounded-[3px]" style={{ background: c.c }} />{c.l}</span>)}
        <span className="inline-flex items-center gap-1.5"><svg width="10" height="10" aria-hidden><rect width="10" height="10" rx="2" fill={`url(#${uid}-${KEYS[0].k})`} /></svg>estimado</span>
        <span className="inline-flex items-center gap-1.5"><i className="inline-block h-0.5 w-4" style={{ background: COLORS.accent }} />crec. a/a (%)</span>
      </div>
    </div>
  )
}

function MarketKpis() {
  const cut = byYear(CUT), prev = CUT != null ? byYear(CUT - 1) : undefined
  const tCut = totalOf(cut), tPrev = totalOf(prev)
  const cA = FIRST != null && CUT != null ? cagr(emOf(byYear(FIRST)), emOf(cut), CUT - FIRST) : null
  const cB = LAST != null && CUT != null ? cagr(emOf(cut), emOf(byYear(LAST)), LAST - CUT) : null
  const L = M.lima
  const hh = (Array.isArray(M.spend_per_household_month_soles) ? M.spend_per_household_month_soles : []).filter(p => p && isNum(p.value) && !/NSE/i.test(p.basis || ''))
  const hLast = hh[hh.length - 1], hPrev = hh.length > 1 ? hh[hh.length - 2] : null
  const hDelta = hLast && hPrev && isNum(hPrev.value) && hPrev.value > 0 ? (100 * ((hLast.value as number) - hPrev.value)) / hPrev.value : null
  const f1 = { maximumFractionDigits: 1, minimumFractionDigits: 1 }
  return (
    <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Reveal className="h-full"><KpiCard icon={<Wallet />} label={`Mercado ${CUT ?? ''}`} value={isNum(tCut) ? Math.round(tCut) : null} prefix="US$" suffix="M"
        delta={isNum(tCut) && isNum(tPrev) && tPrev > 0 ? { v: (tCut / tPrev - 1) * 100, label: `vs. ${CUT! - 1}`, fmt: v => fmtN(v, 1) + '%' } : undefined}
        sub="pet care + vet." /></Reveal>
      <Reveal delay={0.06} className="h-full"><KpiCard icon={<TrendingUp />} label={`CAGR ${FIRST ?? ''}–${CUT ?? ''}`} value={cA} suffix="%" format={f1} sub="Euromonitor pet care" /></Reveal>
      <Reveal delay={0.12} className="h-full"><KpiCard icon={<CalendarClock />} label={`CAGR ${CUT ?? ''}–${LAST ?? ''}`} value={cB} suffix="%" format={f1} tag={<Pill tone="teal">proyección</Pill>} sub="se desacelera" /></Reveal>
      <Reveal delay={0.18} className="h-full">
        {L && isNum(L.share_of_national_household_spend_pct)
          ? <KpiCard icon={<Building2 />} label="Peso de Lima" value={L.share_of_national_household_spend_pct} suffix="%" format={f1} tag={L.estimated ? <Pill tone="mid">estimado</Pill> : undefined}
              sub={<span className="grid gap-0.5">
                <span>{[isNum(L.household_spend_2025_soles_m_year) ? `S/ ${fmtN(L.household_spend_2025_soles_m_year)} M/año` : null, isNum(L.vet_2025_soles_m_year) ? `vet. S/ ${fmtN(L.vet_2025_soles_m_year)} M` : null].filter(Boolean).join(' · ') || 'del gasto nacional'}</span>
                {isNum(hDelta) && hPrev && <span className={cn('font-medium', hDelta < 0 ? 'text-bad-ink' : 'text-good-ink')} title={hLast?.basis || undefined}>gasto mascotas/hogar {hDelta < 0 ? '−' : '+'}{fmtN(Math.abs(hDelta), 0)}% {hPrev.year}→{hLast!.year} (ENAHO)</span>}
              </span>} />
          : <KpiCard icon={<Wallet />} label="Gasto por hogar/mes" value={hLast && isNum(hLast.value) ? hLast.value : null} prefix="S/" format={f1}
              delta={isNum(hDelta) ? { v: hDelta, label: `vs. ${hPrev?.year}`, fmt: v => fmtN(v, 1) + '%' } : undefined} sub={hLast ? `ENAHO ${hLast.year}` : undefined} />}
      </Reveal>
    </div>
  )
}

/* ---------------- Buyer persona ---------------- */
const PERSONA_COLORS = [COLORS.primaryDark, COLORS.primary, '#5EEAD4', '#94A3B8']
const petIcon = (pet?: string | null) => /gat|michi|felin/i.test(pet || '') ? <Cat /> : /perr|can/i.test(pet || '') ? <Dog /> : <Heart />
const list = (a?: string[] | null) => (Array.isArray(a) ? a.filter(x => typeof x === 'string' && x.trim()) : [])

function Chips({ label, items, tone }: { label: string; items: string[]; tone: 'teal' | 'bad' | 'gray' | 'opp' }) {
  if (!items.length) return null
  const cls = { teal: 'bg-teal-soft text-[#0F766E] ring-primary/20', bad: 'bg-bad-soft text-bad-ink ring-bad/20', gray: 'bg-muted text-slate-700 ring-slate-300/60', opp: 'bg-opp-soft text-opp-ink ring-opp/25' }[tone]
  return (
    <div>
      <div className="mb-1 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">{label}</div>
      <div className="flex flex-wrap gap-1">{items.map(t => <span key={t} className={cn('rounded-md px-1.5 py-0.5 text-xs leading-snug ring-1 ring-inset', cls)}>{t}</span>)}</div>
    </div>
  )
}

function PersonaCard({ p, top }: { p: Persona; top: boolean }) {
  const q = (Array.isArray(p.quotes) ? p.quotes : []).find(x => x && x.text)
  const meta = [isNum(p.age) ? `${p.age} años` : null, p.district].filter(Boolean).join(' · ')
  return (
    <Panel className={cn('relative flex h-full flex-col gap-4 overflow-visible p-5', top && 'border-opp/60 ring-2 ring-opp/40')}>
      {top && <span className="absolute -top-2.5 left-5 rounded-full bg-opp px-2 py-0.5 text-[11px] font-semibold text-white shadow-sm">Perfil principal</span>}
      <div className="flex items-start gap-3">
        <span className={cn('grid size-11 shrink-0 place-items-center rounded-full [&>svg]:size-5', top ? 'bg-opp-soft text-opp-ink' : 'bg-teal-soft text-[#0F766E]')}>{petIcon(p.pet)}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-base leading-tight font-semibold">{p.name || '—'}</h4>
            {isNum(p.share_pct) && <span className={cn('shrink-0 rounded-md px-1.5 py-0.5 text-xs font-semibold tabular-nums', top ? 'bg-opp text-white' : 'bg-ink text-white')} title="Share estimado de clientes">≈{fmtN(p.share_pct)}%</span>}
          </div>
          {meta && <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="size-3 shrink-0" /><span className="min-w-0">{meta}</span></div>}
          <div className="mt-1.5 flex flex-wrap gap-1">
            {p.nse && <Pill tone="gray">NSE {p.nse}</Pill>}
          </div>
          {p.pet && <p className="mt-1.5 text-[13px] leading-snug text-slate-700">{p.pet}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-muted/60 p-2.5"><div className="text-[11px] text-muted-foreground">Gasto mensual</div><div className="text-lg font-semibold tabular-nums">{isNum(p.spend_monthly_soles) ? `S/ ${fmtN(p.spend_monthly_soles)}` : '—'}</div></div>
        <div className="rounded-lg bg-muted/60 p-2.5"><div className="text-[11px] text-muted-foreground">Visitas al año</div><div className="text-lg font-semibold tabular-nums">{fmtN(p.visits_per_year)}</div></div>
      </div>
      <div className="grid gap-2.5">
        <Chips label="Valora" items={list(p.values)} tone="teal" />
        <Chips label="Le molesta" items={list(p.pains)} tone="bad" />
        <Chips label="Canales" items={list(p.channels)} tone="gray" />
        <Chips label="Compra además" items={list(p.extras)} tone="gray" />
      </div>
      <div className="mt-auto grid gap-3">
        {q && (
          <figure className="rounded-lg border-l-2 border-primary/50 bg-teal-soft/50 px-3 py-2">
            <blockquote className="text-[13px] leading-snug text-slate-700 italic">“{trunc(q.text, 140)}”</blockquote>
            <figcaption className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
              {isNum(q.rating) && <Stars r={q.rating} size={11} showValue={false} />}
              {q.clinic && <span className="min-w-0">{trunc(q.clinic, 60)}</span>}
            </figcaption>
          </figure>
        )}
        {p.evidence && (
          <Popover>
            <PopoverTrigger asChild>
              <button type="button" className="inline-flex w-fit items-center gap-1 rounded-md text-xs font-medium text-primary underline-offset-2 hover:underline"><FileSearch className="size-3.5" />evidencia</button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[min(20rem,calc(100vw-2rem))] text-xs leading-relaxed">
              <div className="mb-1 font-semibold text-foreground">Evidencia · reseñas y fuentes</div>
              <p className="text-slate-700">{p.evidence}</p>
              {list(p.sources).length > 0 && (
                <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 border-t pt-2">
                  {list(p.sources).map(u => <a key={u} href={u} target="_blank" rel="noreferrer" className="text-primary hover:underline">{host(u)}</a>)}
                </div>
              )}
            </PopoverContent>
          </Popover>
        )}
      </div>
    </Panel>
  )
}

function ShareBar({ top }: { top: Persona | null }) {
  const ps = PERSONAS.filter(p => isNum(p.share_pct) && (p.share_pct as number) > 0)
  if (!ps.length) return null
  const tot = sum(ps.map(p => p.share_pct))
  const rest = Math.max(0, 100 - tot)
  const segs = [...ps.map((p, i) => ({ k: p.id, l: p.name || '—', v: p.share_pct as number, c: p === top ? COLORS.accent : PERSONA_COLORS[i % PERSONA_COLORS.length], dark: p === top || i < 2 })), ...(rest > 0.5 ? [{ k: 'otros', l: 'Otros', v: rest, c: '#E2E8F0', dark: false }] : [])]
  const base = Math.max(100, tot)
  return (
    <Panel className="p-4 sm:p-5">
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <h4 className="text-sm font-semibold">Peso de cada perfil en la clientela</h4>
        <span className="text-xs text-muted-foreground">share estimado</span>
      </div>
      <div className="flex h-9 w-full overflow-hidden rounded-lg text-[11px] font-semibold sm:text-xs" role="img" aria-label={segs.map(s => `${s.l} ${fmtPct(s.v)}`).join(', ')}>
        {segs.map(s => {
          const w = (100 * s.v) / base
          return (
            <div key={s.k} title={`${s.l}: ${fmtPct(s.v)}`} className={cn('flex min-w-0 items-center justify-center gap-1 overflow-hidden px-1.5 whitespace-nowrap', s.dark ? 'text-white' : 'text-slate-700')} style={{ width: `${w}%`, background: s.c }}>
              {w >= 12 && <span className="hidden truncate sm:inline">{s.l.split(' ')[0]}</span>}
              {w >= 7 && <span className="tabular-nums">{fmtPct(s.v)}</span>}
            </div>
          )
        })}
      </div>
    </Panel>
  )
}

function Notes() {
  const n = String(M.notes || '')
  const lines = [
    /excluye servicios|no incluye/i.test(n) || /vet/i.test(n) ? 'Euromonitor mide alimento + productos: la veterinaria se suma como estimado propio con ENAHO (INEI).' : null,
    /80\/20/.test(n) ? 'El reparto 80/20 alimento/productos es un supuesto del analista.' : null,
  ].filter(Boolean) as string[]
  if (!lines.length && !n) return null
  return (
    <div className="mt-3 flex gap-2 px-1 text-[11px] leading-snug text-muted-foreground">
      <Info className="mt-0.5 size-3.5 shrink-0" />
      <div className="min-w-0">
        {(lines.length ? lines : [trunc(n, 180)]).map(l => <p key={l}>{l}</p>)}
      </div>
    </div>
  )
}

export function Market() {
  const t0 = totalOf(byYear(FIRST_REAL)), t1 = totalOf(byYear(CUT)), tL = totalOf(byYear(LAST))
  const cReal = FIRST_REAL != null && CUT != null ? cagr(t0, t1, CUT - FIRST_REAL) : null
  const cProj = LAST != null && CUT != null ? cagr(emOf(byYear(CUT)), emOf(byYear(LAST)), LAST - CUT) : null
  const txt = isNum(t0) && isNum(t1)
    ? `El mercado pet care de Perú pasó de **US$ ${fmtN(t0)} M** (${FIRST_REAL}) a **US$ ${fmtN(t1)} M** (${CUT}): CAGR ${fmtPct(cReal)}${isNum(tL) && LAST !== CUT ? `; Euromonitor proyecta **US$ ${fmtN(tL)} M** en ${LAST} (${fmtPct(cProj, 1)})` : ''}.`
    : 'Aún no hay datos de tamaño de mercado.'
  const top = maxBy(PERSONAS, p => p.share_pct)
  return (
    <Section id="mercado" n="03" eyebrow="Mercado y cliente" title="¿Cuánto vale el mercado y quién es el cliente?"
      insight={<Insight><Rich text={txt} /></Insight>}>
      <MarketKpis />
      <Reveal className="mt-4">
        <Panel>
          <CardHead title="Mercado pet care en Perú" sub="US$ millones por año · alimento, productos y veterinaria" action={SERIES.some(s => s.estimated) ? <Pill tone="mid">incluye estimados</Pill> : undefined} />
          <div className="pt-3"><MarketChart /></div>
        </Panel>
        <Notes />
      </Reveal>

      <div className="mt-10 mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-lg font-semibold tracking-tight">Buyer persona</h3>
        <span className="text-xs text-muted-foreground">NSE A/B · 5 distritos · share estimado</span>
      </div>
      {PERSONAS.length ? (
        <>
          <div className="grid gap-5 pt-1 md:grid-cols-2 lg:grid-cols-3">
            {PERSONAS.map((p, i) => <Reveal key={p.id} delay={i * 0.06} className="h-full"><PersonaCard p={p} top={p === top} /></Reveal>)}
          </div>
          <Reveal className="mt-4"><ShareBar top={top} /></Reveal>
        </>
      ) : <Empty msg="Aún no hay perfiles de cliente." />}
    </Section>
  )
}
