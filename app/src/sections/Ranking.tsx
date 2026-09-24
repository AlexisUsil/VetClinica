import type * as React from 'react'
import { ArrowDown, ArrowUp, Info } from 'lucide-react'
import { Tooltip as UiTip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { RANK, byName, rankOf } from '@/data/dash'
import type { District } from '@/data/types'
import { fmtN, fmtPct, fmtSoles, isNum, nums, shortD } from '@/lib/format'
import { COMP, FRIC_SCORE, legalStatus, strengths, type Scope } from '@/lib/logic'
import { setDistrict } from '@/lib/store'
import { CardHead, Insight, LegalPill, Panel, Pill, Reveal, Rich, Section } from '@/components/common/common'

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
  return (
    <Section id="ranking" n="02" eyebrow="Ranking de oportunidad" title="¿Qué distrito ofrece la mejor oportunidad?"
      insight={first && <Insight><Rich text={`**${first.district}** lidera con ${fmtN(first.score)}/100, impulsado por ${s1 ? COMP[s1.k].name.toLowerCase() : '—'}. ${last && last !== first ? `${last.district} queda último (${fmtN(last.score)}) por ${sl ? COMP[sl.k].name.toLowerCase() : 'varios factores'}: ${fmtN(first.score - last.score)} pts de brecha.` : ''}`} /></Insight>}>
      <Reveal><CompareTable sel={S.district} /></Reveal>
    </Section>
  )
}
