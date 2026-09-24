import * as React from 'react'
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis, Tooltip } from 'recharts'
import { ArrowDown, ArrowUp, ChevronDown, Info } from 'lucide-react'
import { ChartContainer, type ChartConfig } from '@/components/ui/chart'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Tooltip as UiTip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { DIST, RANK, WEIGHTS, byName, rankOf } from '@/data/dash'
import type { District } from '@/data/types'
import { fmtN, fmtPct, fmtSoles, isNum, mean, nums, shortD, ANIM } from '@/lib/format'
import { COLORS, COMP, COMP_KEYS, FRIC_SCORE, componentsPending, legalStatus, strengths, wEff, type Scope } from '@/lib/logic'
import { setDistrict } from '@/lib/store'
import { CardHead, Insight, LegalPill, Legend, Panel, Pill, Reveal, Rich, Section, TipCard } from '@/components/common/common'

const cfg = { score: { label: 'Score', color: 'var(--chart-4)' } } satisfies ChartConfig

function ScoreBars({ sel }: { sel: string }) {
  const data = RANK.map(n => byName(n)!).map((d, i) => ({ name: `${shortD(d.district)}`, full: d.district, score: d.score, label: d.score_label || '', i }))
  const avg = mean(data.map(d => d.score))
  return (
    <ChartContainer config={cfg} className="aspect-auto h-[250px] w-full">
      <BarChart data={data} layout="vertical" margin={{ left: 4, right: 40, top: 4, bottom: 4 }} barCategoryGap={10}>
        <XAxis type="number" hide domain={[0, 100]} />
        <YAxis type="category" dataKey="name" width={96} tickLine={false} axisLine={false} tick={{ fill: 'var(--foreground)', fontSize: 13, fontWeight: 500 }} />
        <Tooltip cursor={{ fill: 'var(--muted)' }} content={({ active, payload }) => {
          if (!active || !payload?.length) return null
          const d = payload[0].payload as (typeof data)[number]
          return <TipCard title={`#${d.i + 1} ${d.full}`} rows={[{ k: 'Score', v: `${fmtN(d.score)}/100`, strong: true }, { k: 'Lectura', v: d.label }, { k: 'vs. promedio', v: `${d.score - (avg || 0) >= 0 ? '+' : '−'}${fmtN(Math.abs(d.score - (avg || 0)))} pts` }]} foot="Clic para ver este distrito" />
        }} />
        <Bar isAnimationActive={ANIM} dataKey="score" radius={6} barSize={28} animationDuration={900} onClick={(e: { payload?: { full?: string } }) => e?.payload?.full && setDistrict(e.payload.full)} className="cursor-pointer">
          {data.map(d => <Cell key={d.full} fill={d.i === 0 ? COLORS.accent : '#94A3B8'} fillOpacity={sel !== 'all' && sel !== d.full ? 0.35 : 1} />)}
          <LabelList dataKey="score" position="right" className="fill-foreground text-[13px] font-semibold tabular-nums" formatter={(v: unknown) => fmtN(v)} />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}

function CompBars({ sel }: { sel: string }) {
  const ds = RANK.map(n => byName(n)!)
  const data = ds.map(d => {
    const o: Record<string, number | string | null> = { name: shortD(d.district), full: d.district }
    COMP_KEYS.forEach(k => { const r = d.score_components?.[k]; o[k] = isNum(r) ? Math.round(r * wEff(k) * 10) / 10 : null })
    return o
  })
  const config = Object.fromEntries(COMP_KEYS.map(k => [k, { label: COMP[k].name, color: COMP[k].color }])) as ChartConfig
  return (
    <>
      <ChartContainer config={config} className="aspect-auto h-[250px] w-full">
        <BarChart data={data} layout="vertical" margin={{ left: 4, right: 12, top: 4, bottom: 4 }} barCategoryGap={10}>
          <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis type="number" domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="name" width={96} tickLine={false} axisLine={false} tick={{ fill: 'var(--foreground)', fontSize: 13, fontWeight: 500 }} />
          <Tooltip cursor={{ fill: 'var(--muted)' }} content={({ active, payload }) => {
            if (!active || !payload?.length) return null
            const full = (payload[0].payload as { full: string }).full; const d = byName(full)!
            return <TipCard title={`${full} · ${fmtN(d.score)} pts`} rows={COMP_KEYS.map(k => ({ k: COMP[k].short, v: `${fmtN(d.score_components?.[k])} × ${fmtN(wEff(k) * 100)}% = ${fmtN((d.score_components?.[k] || 0) * wEff(k), 1)}`, color: COMP[k].color }))} />
          }} />
          {COMP_KEYS.map((k, i) => (
            <Bar isAnimationActive={ANIM} key={k} dataKey={k} stackId="s" fill={COMP[k].color} stroke="#fff" strokeWidth={1} barSize={28} animationDuration={700 + i * 80}
              radius={i === COMP_KEYS.length - 1 ? [0, 6, 6, 0] : i === 0 ? [6, 0, 0, 6] : 0} onClick={(e: { payload?: { full?: string } }) => e?.payload?.full && setDistrict(e.payload.full)} className="cursor-pointer">
              {data.map(d => <Cell key={String(d.full)} fill={COMP[k].color} fillOpacity={sel !== 'all' && sel !== d.full ? 0.35 : 1} />)}
            </Bar>
          ))}
        </BarChart>
      </ChartContainer>
      <Legend className="mt-2 px-1" items={COMP_KEYS.map(k => ({ color: COMP[k].color, label: `${COMP[k].short} ${fmtN((WEIGHTS[k] || 0) * 100)}%` }))} />
    </>
  )
}

type Row = { l: string; n: string; g: (d: District) => number | null | undefined; f: (v: number, d: District) => React.ReactNode; better: 'high' | 'low' | null; src?: string }
const ROWS: Row[] = [
  { l: 'Score de oportunidad', n: 'factores de 20 a 100', g: d => d.score, f: v => <b className="font-semibold">{fmtN(v)}</b>, better: 'high' },
  { l: 'Población', n: 'habitantes 2025', g: d => d.population, f: v => fmtN(v), better: null, src: 'population' },
  { l: 'Clínicas', n: 'competidores mapeados', g: d => d.count, f: v => fmtN(v), better: 'low' },
  { l: 'Clínicas por 10 mil hab.', n: 'densidad de oferta', g: d => d.clinics_per_10k, f: v => fmtN(v, 2), better: 'low', src: 'population' },
  { l: 'Hogares por clínica', n: 'demanda por competidor', g: d => d.households_per_clinic, f: v => fmtN(v), better: 'high', src: 'households' },
  { l: '% clínicas 24h', n: 'menos = más hueco nocturno', g: d => d.pct_24h, f: v => fmtPct(v), better: 'low' },
  { l: 'Rating promedio', n: 'más bajo = rival más débil', g: d => d.avg_rating, f: v => fmtN(v, 2), better: 'low' },
  { l: 'Ticket promedio', n: 'estimado · por visita', g: d => d.avg_ticket, f: (v, d) => <>{fmtSoles(v)}{d.ticket_n ? <span className="ml-1 text-[11px] text-muted-foreground">n={fmtN(d.ticket_n)}</span> : null}</>, better: 'high' },
  { l: 'Alquiler USD/m²', n: 'local comercial', g: d => d.rent_usd_m2, f: v => 'US$ ' + fmtN(v, 1), better: 'low', src: 'rent_usd_m2' },
  { l: 'NSE A/B', n: '% de hogares', g: d => d.nse_ab_pct, f: v => fmtPct(v), better: 'high', src: 'nse_ab_pct' },
  { l: 'Fricción regulatoria', n: 'licencia y zonificación', g: d => FRIC_SCORE[d.regulation?.friction || ''] ?? null, f: (_v, d) => { const f = d.regulation?.friction; return <Pill tone={f === 'Baja' ? 'good' : f === 'Alta' ? 'bad' : 'mid'}>{f ? `Fricción ${f.toLowerCase()}` : 'en curso'}</Pill> }, better: null },
  { l: 'Clínica permitida en', n: 'n.º de zonas', g: d => { const L = legalStatus(d); return L.lvl === 'na' ? null : L.zones == null ? -1 : L.zones }, f: (_v, d) => <LegalPill d={d} />, better: null },
]

function SrcMark({ d, field }: { d: District; field?: string }) {
  if (!field) return null
  const src = d.stats_sources?.[field], est = d.stats_estimated?.[field] === true
  if (!src && !est) return null
  return (
    <UiTip>
      <TooltipTrigger asChild><button type="button" className="ml-1 inline-flex align-middle text-muted-foreground hover:text-foreground" aria-label="Ver fuente">{est ? <span className="rounded bg-mid-soft px-1 text-[10px] font-medium text-mid-ink">est.</span> : <Info className="size-3.5" />}</button></TooltipTrigger>
      <TooltipContent className="max-w-72 text-xs">{est ? 'Valor estimado. ' : ''}{src || ''}</TooltipContent>
    </UiTip>
  )
}

function CompareTable({ sel }: { sel: string }) {
  const ds = RANK.map(n => byName(n)!)
  return (
    <Panel>
      <CardHead title="Comparativa lado a lado" sub="Verde = mejor valor para abrir; rojo = peor. Clic en un distrito para seleccionarlo." />
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-[13px]">
          <caption className="sr-only">Comparativa de indicadores por distrito</caption>
          <thead>
            <tr className="border-y bg-muted/50">
              <th scope="col" className="sticky left-0 z-10 bg-slate-50 px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Indicador</th>
              {ds.map(d => (
                <th key={d.district} scope="col" className={cn('px-3 py-2.5 text-right text-xs font-semibold', sel === d.district && 'bg-teal-soft')}>
                  <button type="button" onClick={() => setDistrict(d.district)} className="inline-flex items-center gap-1 rounded px-1 hover:text-primary">
                    <span className={cn('font-mono text-[10px]', rankOf(d.district) === 1 ? 'text-opp-ink' : 'text-muted-foreground')}>#{rankOf(d.district)}</span>{shortD(d.district)}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map(r => {
              const vals = ds.map(r.g); const valid = nums(vals)
              const can = r.better && valid.length >= 2 && Math.max(...valid) !== Math.min(...valid)
              const best = can ? (r.better === 'high' ? Math.max(...valid) : Math.min(...valid)) : null
              const worst = can ? (r.better === 'high' ? Math.min(...valid) : Math.max(...valid)) : null
              return (
                <tr key={r.l} className="border-b last:border-0 hover:bg-muted/40">
                  <th scope="row" className="sticky left-0 z-10 bg-white px-4 py-2.5 text-left font-medium">{r.l}<div className="text-[11px] font-normal text-muted-foreground">{r.n}</div></th>
                  {ds.map((d, i) => {
                    const v = vals[i]; const sc = sel === d.district ? 'bg-teal-soft/60' : ''
                    if (!isNum(v)) return <td key={d.district} className={cn('px-3 py-2.5 text-right text-muted-foreground italic', sc)}>pendiente</td>
                    const isB = r.better && v === best, isW = r.better && v === worst
                    return (
                      <td key={d.district} className={cn('px-3 py-2.5 text-right tabular-nums', sc)}>
                        <span className={cn('inline-flex items-center justify-end gap-1 rounded-md px-1.5 py-0.5', isB && 'bg-good-soft text-good-ink font-semibold', isW && 'bg-bad-soft text-bad-ink')}>
                          {isB && <ArrowUp className="size-3" aria-label="mejor" />}{isW && <ArrowDown className="size-3" aria-label="peor" />}{r.f(v, d)}
                        </span>
                        <SrcMark d={d} field={r.src} />
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}

export function Ranking({ S }: { S: Scope }) {
  const ds = RANK.map(byName).filter(Boolean) as District[]
  const first = ds[0], last = ds[ds.length - 1]
  const s1 = first ? strengths(first)[0] : null
  const sl = last ? strengths(last).slice().reverse()[0] : null
  const pend = componentsPending()
  const [open, setOpen] = React.useState(false)
  return (
    <Section id="ranking" n="02" eyebrow="Ranking de oportunidad" title="¿Qué distrito ofrece la mejor oportunidad?"
      insight={first && <Insight><Rich text={`**${first.district}** lidera con ${fmtN(first.score)}/100, impulsado por ${s1 ? COMP[s1.k].name.toLowerCase() : '—'}. ${last && last !== first ? `${last.district} queda último (${fmtN(last.score)}) por ${sl ? COMP[sl.k].name.toLowerCase() : 'varios factores'}: ${fmtN(first.score - last.score)} pts de brecha.` : ''}`} /></Insight>}>
      <div className="grid gap-4 lg:grid-cols-2">
        <Reveal><Panel className="h-full pb-4"><CardHead title="Score de oportunidad" sub="0–100 · más alto = mejor para abrir" action={<Pill tone="opp">#1 recomendado</Pill>} /><div className="px-3 pt-2"><ScoreBars sel={S.district} /></div></Panel></Reveal>
        <Reveal delay={0.08}><Panel className="h-full pb-4"><CardHead title="¿De qué se compone cada score?" sub="Puntos que aporta cada factor (peso × valor)" /><div className="px-3 pt-2"><CompBars sel={S.district} /></div></Panel></Reveal>
      </div>
      <Reveal className="mt-4">
        <Collapsible open={open} onOpenChange={setOpen}>
          <Panel>
            <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 px-5 py-3.5 text-left text-sm font-medium hover:bg-muted/50">
              <span className="flex items-center gap-2"><Info className="size-4 text-primary" />Cómo se calcula el score</span>
              <ChevronDown className={cn('size-4 transition-transform duration-200', open && 'rotate-180')} />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="grid gap-3 border-t p-5 sm:grid-cols-2 lg:grid-cols-3">
                {COMP_KEYS.map(k => (
                  <div key={k} className="flex gap-3">
                    <i className="mt-1 size-3 shrink-0 rounded-[3px]" style={{ background: COMP[k].color }} />
                    <div className="min-w-0 text-[13px]">
                      <div className="flex flex-wrap items-center gap-2 font-semibold">{COMP[k].name}<span className="rounded bg-muted px-1.5 font-mono text-[11px] tabular-nums">{fmtN((WEIGHTS[k] || 0) * 100)}%</span>{pend[k] && <Pill tone="gray">neutro 50</Pill>}</div>
                      <p className="text-muted-foreground">{COMP[k].desc}</p>
                    </div>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground sm:col-span-2 lg:col-span-3">Cada factor se normaliza entre los {DIST.length} distritos: 20 = peor, 100 = mejor. Los factores sin datos toman 50.</p>
              </div>
            </CollapsibleContent>
          </Panel>
        </Collapsible>
      </Reveal>
      <Reveal className="mt-4"><CompareTable sel={S.district} /></Reveal>
    </Section>
  )
}
