import * as React from 'react'
import { Clock, Home, MessageSquare, Moon, ShieldAlert, Target, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { RANK, byName } from '@/data/dash'
import { fmtN } from '@/lib/format'
import { buildRules, legalStatus, ruleBody, type Rule, type Scope } from '@/lib/logic'
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

  return (
    <Section id="huecos" n="04" eyebrow="Huecos y oportunidades" title="¿Dónde están los huecos?"
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
    </Section>
  )
}
