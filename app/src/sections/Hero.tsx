import { motion } from 'motion/react'
import { Award, Check, Clock, Coins, Layers, MapPin, Moon, ShieldCheck, Star, TriangleAlert, ArrowRight } from 'lucide-react'
import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from 'recharts'
import { cn } from '@/lib/utils'
import { DIST, G, GENERATED, NON_CLINICS, PLACES, RANK, byName, rankOf } from '@/data/dash'
import { fmtN, isNum, joinY, shortD, ANIM } from '@/lib/format'
import { COMP, componentsPending, isEnriched, labelTone, legalStatus, LEGAL_LABEL, strengths, ticketBasis, type Scope } from '@/lib/logic'
import { setDistrict, scrollToId } from '@/lib/store'
import { LEGAL_ICON, Panel, Pill, Reveal, Rich } from '@/components/common/common'
import { KpiCard } from '@/components/common/kpi'

function ScoreGauge({ score }: { score: number }) {
  return (
    <div className="relative size-28 shrink-0 sm:size-32">
      <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 128, height: 128 }}>
        <RadialBarChart innerRadius="78%" outerRadius="100%" data={[{ v: score }]} startAngle={90} endAngle={-270}>
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
          <RadialBar isAnimationActive={ANIM} dataKey="v" cornerRadius={8} fill="var(--opp)" background={{ fill: '#F1F5F9' }} animationDuration={1100} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="text-[34px] leading-none font-semibold tracking-tight tabular-nums">{fmtN(score)}</div>
          <div className="mt-0.5 text-[11px] text-muted-foreground">de 100</div>
        </div>
      </div>
    </div>
  )
}

function Verdict({ district }: { district: string }) {
  const top = byName(RANK[0])
  if (!top) return <Panel className="p-6"><p className="text-muted-foreground">Sin datos de ranking todavía.</p></Panel>
  const st = strengths(top).filter(s => s.raw > 50).slice(0, 2)
  const L = legalStatus(top)
  const goods = DIST.filter(d => legalStatus(d).lvl === 'good')
  const bads = DIST.filter(d => legalStatus(d).lvl === 'bad').map(d => d.district)
  const nP = Object.values(componentsPending()).filter(Boolean).length
  return (
    <Panel className="relative h-full overflow-hidden p-5 sm:p-6">
      <div className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-opp/10 blur-3xl" />
      <div className="relative flex items-center gap-2 text-xs font-semibold tracking-wide text-opp-ink uppercase"><Award className="size-4" />Veredicto · distrito recomendado</div>
      <div className="relative mt-3 flex items-center gap-4 sm:gap-5">
        <ScoreGauge score={top.score} />
        <div className="min-w-0">
          <div className="text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">{top.district}</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Pill tone={labelTone(top.score_label)}>{top.score_label || '—'}</Pill>
            <Pill tone={L.lvl === 'na' ? 'gray' : L.lvl} icon={LEGAL_ICON[L.lvl]}>{goods.length === 1 && L.lvl === 'good' ? 'Única vía legal clara' : L.short}</Pill>
          </div>
        </div>
      </div>
      {st.length > 0 && (
        <div className="relative mt-5 grid gap-2.5">
          {st.map(s => (
            <div key={s.k}>
              <div className="mb-1 flex justify-between text-xs"><span className="font-medium text-slate-700">{COMP[s.k].name}</span><span className="tabular-nums text-muted-foreground">{fmtN(s.raw)}/100</span></div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100"><motion.div className="h-full rounded-full bg-primary" initial={{ width: 0 }} animate={{ width: `${s.raw}%` }} transition={{ duration: 0.9, delay: 0.2 }} /></div>
            </div>
          ))}
        </div>
      )}
      <p className="relative mt-4 flex gap-2 text-[13px] leading-snug text-slate-600">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-good-ink" />
        <span>
          {L.lvl === 'good' ? <Rich text={`${L.txt}.`} /> : <Rich text={`**Atención:** ${L.txt.toLowerCase()}.`} />}
          {bads.length > 0 && <> En {joinY(bads.map(shortD))} solo cabe consultorio.</>}
          {nP > 0 && <> Score preliminar: {nP} de 6 factores con valor neutro.</>}
        </span>
      </p>
      <div className="relative mt-5 border-t pt-4">
        <div className="mb-2 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">Resto del ranking</div>
        <div className="grid gap-1.5">
          {RANK.slice(1).map(n => {
            const d = byName(n)!; const lvl = legalStatus(d).lvl
            return (
              <button key={n} type="button" onClick={() => { setDistrict(n); scrollToId('mapa') }}
                className={cn('group grid grid-cols-[28px_1fr_auto] items-center gap-2 rounded-md px-1.5 py-1 text-left text-[13px] transition-colors hover:bg-muted', district === n && 'bg-muted')}>
                <span className="font-mono text-[11px] text-muted-foreground tabular-nums">#{rankOf(n)}</span>
                <span className="flex min-w-0 items-center gap-2">
                  <span className="truncate font-medium">{n}</span>
                  <span className={cn('size-1.5 shrink-0 rounded-full', lvl === 'good' ? 'bg-good' : lvl === 'mid' ? 'bg-mid' : lvl === 'bad' ? 'bg-bad' : 'bg-slate-300')} />
                  <span className="hidden h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100 sm:block"><span className="block h-full rounded-full bg-slate-400" style={{ width: `${d.score}%` }} /></span>
                </span>
                <span className="w-8 text-right font-semibold tabular-nums">{fmtN(d.score)}</span>
              </button>
            )
          })}
        </div>
      </div>
    </Panel>
  )
}

export function Hero({ S }: { S: Scope }) {
  const TB = ticketBasis(S.P)
  const districtIdx = S.all ? null : RANK.indexOf(S.district)
  const byRank = RANK.map(byName)
  const enriched = PLACES.filter(isEnriched).length
  const pend = componentsPending()
  const avgPct24 = G.count ? (100 * (G.count_24h || 0)) / G.count : null
  const months = Object.entries(G.activity?.by_month || {}).sort(([a], [b]) => a.localeCompare(b)).map(([, v]) => v)
  const scopeTxt = S.all ? 'en los 5 distritos' : `de ${fmtN(PLACES.length)} en total`

  return (
    <section id="hero" className="scroll-mt-32 pt-8 pb-6 md:pt-12" aria-labelledby="hero-h">
      <Reveal>
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          <span className="rounded-md bg-primary px-1.5 py-0.5 text-[11px] text-white">Resumen</span>Decisión de apertura · Lima
        </div>
        <h1 id="hero-h" className="mt-3 max-w-3xl text-[32px] leading-[1.1] font-semibold tracking-[-0.025em] text-balance sm:text-5xl">
          ¿Dónde abrir la <span className="text-primary">clínica veterinaria</span>?
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] text-muted-foreground">
          5 distritos comparados · {fmtN(PLACES.length)} clínicas · datos al <span className="font-medium text-foreground tabular-nums">{GENERATED}</span>
        </p>
      </Reveal>

      <div className="mt-8 grid gap-4 lg:grid-cols-12">
        <Reveal className="lg:col-span-5"><Verdict district={S.district} /></Reveal>
        <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:col-span-7">
          <Reveal delay={0.06} className="h-full">
            <KpiCard icon={<MapPin />} label="Clínicas mapeadas" value={S.count} sub={scopeTxt}
              spark={{ type: 'bar', data: byRank.map(d => d?.count || 0), highlight: districtIdx }}
              tag={<span className="text-[11px] text-muted-foreground">por distrito</span>} />
          </Reveal>
          <Reveal delay={0.12} className="h-full">
            <KpiCard icon={<Moon />} label="Atienden 24 horas" value={S.pct24} suffix="%" format={{ maximumFractionDigits: 0 }}
              delta={!S.all && isNum(S.pct24) && isNum(avgPct24) ? { v: S.pct24 - avgPct24, label: 'vs. total', goodWhen: 'down', fmt: v => fmtN(v, 0) + ' pp' } : { v: null, label: `${fmtN(S.n24)} clínicas con guardia` }}
              spark={{ type: 'bar', data: byRank.map(d => d?.pct_24h || 0), highlight: districtIdx }} />
          </Reveal>
          <Reveal delay={0.18} className="h-full">
            <KpiCard icon={<Star />} label="Rating promedio" value={S.avgRating} format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
              delta={!S.all && isNum(S.avgRating) && isNum(G.avg_rating) ? { v: S.avgRating - G.avg_rating, label: 'vs. total', goodWhen: 'none', fmt: v => fmtN(v, 2) } : { v: null, label: `${fmtN(S.totalRev)} reseñas` }}
              spark={{ type: 'area', data: months }}
              tag={<span className="text-[11px] text-muted-foreground">reseñas/mes</span>} />
          </Reveal>
          <Reveal delay={0.24} className="h-full">
            <KpiCard icon={<Coins />} label="Ticket promedio" value={S.tickets.length ? Math.round(S.avgTicket as number) : null} prefix="S/" soft="En estimación"
              tag={<Pill tone="mid">estimado</Pill>}
              sub={TB.pub ? `solo ${fmtN(TB.pub)} precio${TB.pub === 1 ? '' : 's'} publicado${TB.pub === 1 ? '' : 's'}` : 'ningún precio publicado'}
              spark={{ type: 'bar', data: byRank.map(d => d?.avg_ticket || 0), highlight: districtIdx }} />
          </Reveal>
        </div>
      </div>

      {/* Semáforo legal */}
      <Reveal delay={0.1} className="mt-4">
        <Panel className="p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="flex items-center gap-2 text-[15px] font-semibold"><ShieldCheck className="size-4 text-primary" />Semáforo legal: ¿se puede abrir una clínica nueva?</h3>
            <span className="text-xs text-muted-foreground">según índice de usos municipal</span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {RANK.map(n => {
              const d = byName(n)!; const L = legalStatus(d); const sel = S.district === n
              const col = L.lvl === 'good' ? 'var(--good)' : L.lvl === 'mid' ? 'var(--mid)' : L.lvl === 'bad' ? 'var(--bad)' : '#94A3B8'
              return (
                <button key={n} type="button" onClick={() => setDistrict(n)} aria-pressed={sel}
                  className={cn('flex min-w-0 flex-col items-start gap-1.5 rounded-lg border border-t-4 bg-white p-3 text-left transition-all duration-200 hover:-translate-y-px hover:shadow-md', sel && 'ring-2 ring-ink/80')}
                  style={{ borderTopColor: col }}>
                  <Pill tone={L.lvl === 'na' ? 'gray' : L.lvl} icon={LEGAL_ICON[L.lvl]}>{LEGAL_LABEL[L.lvl]}</Pill>
                  <span className="text-sm font-semibold">{n}</span>
                  <span className="line-clamp-2 text-xs text-muted-foreground">{L.short === '1 eje' ? 'Solo 1 eje comercial' : L.short}</span>
                </button>
              )
            })}
          </div>
        </Panel>
      </Reveal>

      {/* Completitud */}
      <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <span className="mr-1 font-medium">Completitud de datos</span>
        <Pill tone="good" icon={<Check />}>{fmtN(PLACES.length)} clínicas Google Places</Pill>
        {NON_CLINICS > 0 && <Pill tone="gray" icon={<TriangleAlert />}>{fmtN(NON_CLINICS)} petshops/otros excluidos</Pill>}
        <Pill tone={enriched ? 'good' : 'gray'} icon={enriched ? <Check /> : <Clock />}>{fmtN(enriched)}/{fmtN(PLACES.length)} enriquecidas con web/redes</Pill>
        <Pill tone={pend.demand ? 'gray' : 'good'} icon={pend.demand ? <Clock /> : <Check />}>{pend.demand ? 'Demografía pendiente' : 'Demografía'}</Pill>
        <Pill tone={pend.rent ? 'gray' : 'good'} icon={pend.rent ? <Clock /> : <Check />}>{pend.rent ? 'Alquileres pendientes' : 'Alquileres'}</Pill>
        <Pill tone={pend.regulation ? 'gray' : 'good'} icon={pend.regulation ? <Clock /> : <Check />}>{pend.regulation ? 'Regulación en curso' : 'Regulación'}</Pill>
        {!S.all && (
          <button type="button" onClick={() => setDistrict('all')} className="ml-auto inline-flex items-center gap-1 rounded-md px-2 py-1 font-medium text-primary hover:bg-teal-soft">
            <Layers className="size-3.5" />Ver todos los distritos<ArrowRight className="size-3.5" />
          </button>
        )}
      </div>
    </section>
  )
}
