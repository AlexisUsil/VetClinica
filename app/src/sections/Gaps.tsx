import * as React from 'react'
import { Check, ChevronDown, CircleHelp, Clock, Home, MessageSquare, Moon, ShieldAlert, Target, ArrowRight, Flag } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import { PLACES, RANK, byName } from '@/data/dash'
import { fmtN, fmtSoles, isNum } from '@/lib/format'
import { buildRules, legalStatus, questions, ruleBody, simulate, type Rule, type Scope } from '@/lib/logic'
import { setDistrict, scrollToId } from '@/lib/store'
import { Insight, LEGAL_ICON, Panel, Pill, Reveal, Rich, Section } from '@/components/common/common'

const ICON: Record<string, React.ReactNode> = { shield: <ShieldAlert />, moon: <Moon />, clock: <Clock />, message: <MessageSquare />, target: <Target />, home: <Home /> }

function RuleCard({ r, hot, sel }: { r: Rule; hot: boolean; sel: string }) {
  const L = r.d ? legalStatus(byName(r.d)) : null
  return (
    <Panel className={cn('flex h-full flex-col p-5 transition-shadow duration-200 hover:shadow-md', hot && 'border-opp/50 ring-1 ring-opp/30')}>
      <div className="flex items-start justify-between gap-3">
        <span className={cn('grid size-9 shrink-0 place-items-center rounded-lg [&>svg]:size-[18px]', hot ? 'bg-opp text-white' : 'bg-teal-soft text-[#0F766E]')}>{ICON[r.ic] || <Target />}</span>
        {r.metric && (
          <div className="text-right">
            <div className={cn('text-2xl leading-none font-semibold tracking-tight tabular-nums', hot ? 'text-opp-ink' : 'text-foreground')}>{r.metric.v}</div>
            <div className="mt-1 text-[11px] text-muted-foreground">{r.metric.l}</div>
          </div>
        )}
      </div>
      <h3 className="mt-4 text-[15px] leading-snug font-semibold">{r.t}</h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{ruleBody(r)}</p>
      <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-3">
        {L && (L.lvl === 'bad' || L.lvl === 'mid') && <Pill tone={L.lvl} icon={LEGAL_ICON[L.lvl]}>{L.lvl === 'bad' ? 'Solo consultorio' : 'Zonificación restringida'}</Pill>}
        {r.pending && <Pill icon={<Clock />}>dato pendiente</Pill>}
        {hot && <Pill tone="opp" icon={<Target />}>Aplica a tu selección</Pill>}
        {r.d && r.d !== sel && <button type="button" onClick={() => setDistrict(r.d!)} className="ml-auto inline-flex items-center gap-1 rounded px-1 text-xs font-medium text-[#0F766E] hover:underline">Ver {r.d}<ArrowRight className="size-3" /></button>}
      </div>
    </Panel>
  )
}

export function Gaps({ S }: { S: Scope }) {
  const sel = S.district
  const top = byName(RANK[0])
  const R = React.useMemo(() => buildRules().slice(0, 5), [])
  const rel = R.filter(r => r.d && r.d === (sel === 'all' ? top?.district : sel))
  const Q = React.useMemo(() => questions(sel !== 'all' ? sel : RANK[0]), [sel])
  const n = (st: string) => Q.filter(q => q.st === st).length
  const [open, setOpen] = React.useState(false)

  const steps = React.useMemo(() => {
    if (!top) return []
    const r = top.regulation || {}; const L = legalStatus(top); const zs = (r.zoning_allowed || []).filter(Boolean)
    const cells = top.best_cells || []
    const t3 = PLACES.filter(p => p.district === top.district).sort((a, b) => (b.reviews_count || 0) - (a.reviews_count || 0)).slice(0, 3).map(p => p.name)
    const sim = simulate(top, {})
    return [
      { t: 'Elegir la zona', b: `Empezar por las ${fmtN(cells.length)} zonas sugeridas del mapa${cells[0] ? `; la mejor tiene ${fmtN(cells[0].clinics_1km)} clínica${cells[0].clinics_1km === 1 ? '' : 's'} a 1 km y el 24h a ${fmtN(cells[0].nearest_24h_km, 1)} km` : ''}. Local con frente a avenida${zs.length ? ` (${zs.slice(0, 3).join(', ')})` : ''}.`, go: 'mapa' },
      { t: 'Confirmar zonificación', b: `Pedir el Certificado de Zonificación y Vías antes de firmar: ${L.txt.toLowerCase()}.`, go: 'regulacion' },
      { t: 'Espiar a los 3 más fuertes', b: `${t3.length ? t3.join(', ') + ': ' : ''}precio de consulta, espera, servicios y horario nocturno.`, go: 'competencia' },
      { t: 'Cerrar los números', b: `Con 120 m² y 2 veterinarios el equilibrio está en ${sim && isNum(sim.be) ? fmtN(sim.be, 1) : '—'} visitas/día; validar alquiler en 3–5 locales.`, go: 'numeros' },
      { t: 'Licencia de funcionamiento', b: `Riesgo medio ${fmtSoles(r.license_cost_soles)} (${isNum(r.license_days) ? fmtN(r.license_days) + ' días hábiles' : 'plazo por confirmar'}); riesgo alto ${fmtSoles(r.license_cost_high_risk_soles)} si hay rayos X o quirófano. Más CMVP, SENASA y residuos.`, go: 'regulacion' },
      { t: 'Diferenciarse donde duele', b: 'Horario hasta las 23:00 (la franja 20–23h tiene más demanda que oferta) y promesa medible de tiempo de espera.', go: 'horarios' },
    ]
  }, [top])

  const ORDER = { 'Sí': 0, Parcial: 1, No: 2 } as const
  const SEC: Record<string, string> = { mapa: 'Mapa', ranking: 'Ranking', competencia: 'Competencia', horarios: 'Horarios', social: 'Escucha social', regulacion: 'Regulación', numeros: 'Números' }

  return (
    <Section id="huecos" n="03" eyebrow="Huecos y oportunidades" title="¿Dónde están los huecos?"
      insight={top && <Insight kicker="Conclusión" tone="opp"><Rich text={`Recomendación: **${top.district}** (${fmtN(top.score)}/100) · ${legalStatus(top).txt.toLowerCase()}.${rel.length ? ` Aplican: ${rel.map(r => r.t.charAt(0).toLowerCase() + r.t.slice(1)).join('; ')}.` : ''}`} /></Insight>}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {R.map((r, i) => {
          const hot = !!r.d && (sel === 'all' ? r.d === top?.district : r.d === sel)
          return <Reveal key={r.t} delay={i * 0.06} className="h-full"><RuleCard r={r} hot={hot} sel={sel} /></Reveal>
        })}
        {top && (
          <Reveal delay={0.3} className="h-full">
            <Panel className="flex h-full flex-col justify-between bg-ink p-5 text-white">
              <div>
                <div className="text-[11px] font-semibold tracking-wide text-white/60 uppercase">Siguiente paso</div>
                <div className="mt-2 text-lg leading-snug font-semibold">Validar en campo las 3 zonas sugeridas de {top.district}</div>
              </div>
              <button type="button" onClick={() => { setDistrict(top.district); scrollToId('mapa') }} className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-lg bg-opp px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-opp-ink">
                Ver en el mapa<ArrowRight className="size-4" />
              </button>
            </Panel>
          </Reveal>
        )}
      </div>

      {top && (
        <Reveal className="mt-4">
          <Panel className="p-5 sm:p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="flex items-center gap-2 text-[15px] font-semibold"><Flag className="size-4 text-opp" />Primeros pasos para abrir en {top.district}</h3>
              <span className="text-xs text-muted-foreground">en orden</span>
            </div>
            <ol className="mt-5 grid gap-x-6 gap-y-5 md:grid-cols-2 lg:grid-cols-3">
              {steps.map((s, i) => (
                <li key={s.t} className="relative flex gap-3">
                  <span className={cn('grid size-8 shrink-0 place-items-center rounded-full text-sm font-semibold tabular-nums', i === 0 ? 'bg-opp text-white' : 'bg-teal-soft text-[#0F766E] ring-1 ring-primary/20')}>{i + 1}</span>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold">{s.t}</div>
                    <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">{s.b}</p>
                    <button type="button" onClick={() => scrollToId(s.go)} className="mt-1 text-xs font-medium text-[#0F766E] hover:underline">Ver {SEC[s.go]}</button>
                  </div>
                </li>
              ))}
            </ol>
          </Panel>
        </Reveal>
      )}

      <Reveal className="mt-4">
        <Collapsible open={open} onOpenChange={setOpen}>
          <Panel>
            <CollapsibleTrigger className="flex w-full flex-wrap items-center gap-3 px-5 py-4 text-left hover:bg-muted/40">
              <CircleHelp className="size-4 text-primary" />
              <span className="text-sm font-semibold">Preguntas decisivas</span>
              <span className="flex h-2 min-w-40 flex-1 overflow-hidden rounded-full bg-muted sm:max-w-72" aria-hidden>
                <span className="bg-good" style={{ width: `${(100 * n('Sí')) / Q.length}%` }} />
                <span className="bg-mid" style={{ width: `${(100 * n('Parcial')) / Q.length}%` }} />
                <span className="bg-slate-300" style={{ width: `${(100 * n('No')) / Q.length}%` }} />
              </span>
              <span className="flex flex-wrap gap-1.5">
                <Pill tone="good" icon={<Check />}>{n('Sí')} respondidas</Pill><Pill tone="mid" icon={<Target />}>{n('Parcial')} parciales</Pill><Pill icon={<Clock />}>{n('No')} pendientes</Pill>
              </span>
              <ChevronDown className={cn('ml-auto size-4 transition-transform duration-200', open && 'rotate-180')} />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="overflow-x-auto border-t">
                <table className="w-full min-w-[640px] text-[13px]">
                  <thead><tr className="bg-muted/50 text-xs text-muted-foreground"><th className="px-5 py-2 text-left font-medium">Pregunta</th><th className="px-3 py-2 text-left font-medium">¿Responde?</th><th className="px-3 py-2 text-left font-medium">Dato</th><th className="px-5 py-2 text-left font-medium">Ancla</th></tr></thead>
                  <tbody>
                    {Q.map((q, i) => ({ q, i })).sort((a, b) => ORDER[a.q.st] - ORDER[b.q.st] || a.i - b.i).map(({ q }) => (
                      <tr key={q.q} className="border-t align-top hover:bg-muted/30">
                        <th scope="row" className="px-5 py-2.5 text-left font-medium">{q.q}</th>
                        <td className="px-3 py-2.5"><Pill tone={q.st === 'Sí' ? 'good' : q.st === 'Parcial' ? 'mid' : 'gray'}>{q.st === 'No' ? 'Pendiente' : q.st}</Pill></td>
                        <td className="px-3 py-2.5 text-muted-foreground">{q.a || '—'}</td>
                        <td className="px-5 py-2.5">{q.sec ? <button type="button" onClick={() => scrollToId(q.sec!)} className="font-medium whitespace-nowrap text-[#0F766E] hover:underline">{SEC[q.sec] || q.sec}</button> : <span className="text-muted-foreground">—</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CollapsibleContent>
          </Panel>
        </Collapsible>
      </Reveal>
    </Section>
  )
}
