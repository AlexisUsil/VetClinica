import * as React from 'react'
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Line, LineChart, ReferenceDot, ReferenceLine, Tooltip, XAxis, YAxis } from 'recharts'
import { ChevronDown, Clock, Coins, Home, Info, Target, SlidersHorizontal } from 'lucide-react'
import { ChartContainer } from '@/components/ui/chart'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import { BE, RANK, byName } from '@/data/dash'
import type { District } from '@/data/types'
import { fmtK, fmtN, fmtPct, fmtSoles, fmtSolesSigned, host, isNum, pct, shortD, ANIM } from '@/lib/format'
import { COLORS, badDistricts, simulate, type Scope, type Sim, type SimOpts } from '@/lib/logic'
import { CardHead, Insight, Legend, Panel, Reveal, Rich, Section, TipCard } from '@/components/common/common'
import { KpiCard } from '@/components/common/kpi'
import { joinY } from '@/lib/format'

type Extra = SimOpts & { ticketMul?: number }

export function Numbers({ S }: { S: Scope }) {
  const [pick, setPick] = React.useState<string>(RANK[0])
  const [m2, setM2] = React.useState<number>(isNum(BE.local_m2) ? BE.local_m2 : 120)
  const [ticket, setTicket] = React.useState<number>(isNum(BE.ticket_default_soles) ? BE.ticket_default_soles : 120)
  const [useDist, setUseDist] = React.useState(false)
  const [visits, setVisits] = React.useState(20)
  const [openS, setOpenS] = React.useState(false)
  React.useEffect(() => { if (S.district !== 'all') setPick(S.district) }, [S.district])
  const d = byName(pick)

  const simFor = React.useCallback((dd: District, extra: Extra = {}): Sim | null => {
    const o: SimOpts = { m2, ticket: useDist ? null : ticket, ...extra }
    if (useDist && isNum(dd.avg_ticket)) o.ticket = dd.avg_ticket * (extra.ticketMul || 1)
    else if (extra.ticketMul) o.ticket = ticket * extra.ticketMul
    return simulate(dd, o)
  }, [m2, ticket, useDist])

  const R = d ? simFor(d) : null
  const sims = RANK.map(n => simFor(byName(n)!)).filter(Boolean) as Sim[]
  const data = React.useMemo(() => Array.from({ length: 41 }, (_, x) => {
    const o: Record<string, number> = { x }
    sims.forEach(s => { o[s.d.district] = Math.round(s.profit(x)) })
    return o
  }), [sims])

  if (!d || !R) {
    return <Section id="numeros" n="06" eyebrow="Punto de equilibrio" title="¿Cierran los números?" insight={<Insight>Faltan supuestos (alquiler o costos) para simular.</Insight>}><div /></Section>
  }
  const prof = R.profit(visits), pb = R.payback(visits), util = isNum(R.capacity) && isNum(R.be) ? pct(R.be, R.capacity) : null
  const rp = R.rentPct(visits)
  const s = BE.staff || {}
  const scen = [
    { l: 'Supuestos actuales', o: {} },
    { l: 'Régimen MYPE (sobrecosto 10%)', o: { overhead: 10 } },
    { l: `${fmtN((s.vets || 0) + 1)} veterinarios`, o: { vets: (s.vets || 0) + 1 } },
    { l: 'Ticket +15%', o: { ticketMul: 1.15 } },
    { l: 'Ticket −15%', o: { ticketMul: 0.85 } },
    { l: 'Alquiler +20%', o: { rentMul: 1.2 } },
  ].map(x => ({ l: x.l, r: simFor(d, x.o) }))
  const b0 = scen[0].r?.be ?? null
  const sens = scen.slice(1).map(x => ({ l: x.l, dv: x.r && isNum(x.r.be) && isNum(b0) ? Math.round((x.r.be - b0) * 10) / 10 : 0 }))
  const fs = BE.fair_share || {}
  const srcOf = (f: string) => (BE.sources || []).filter(x => x && (x.field === f || String(x.field).startsWith(f + '.')))
  const A: [string, string, string | null][] = [
    ['Local', `${fmtN(BE.local_m2)} m²`, 'local_m2'],
    ['Inversión', `US$ ${fmtN(BE.capex_usd_100m2)} / 100 m²`, 'capex_usd_100m2'],
    ['Veterinarios', `${fmtN(s.vets)} × ${fmtSoles(s.vet_gross_soles)}`, 'staff.vet_gross_soles'],
    ['Asistentes', `${fmtN(s.assistants)} × ${fmtSoles(s.assistant_gross_soles)}`, 'staff.assistant_gross_soles'],
    ['Sobrecosto laboral', fmtPct(s.labor_overhead_pct), 'staff.labor_overhead_pct'],
    ['Insumos', `${fmtPct(BE.supplies_pct)} de ingresos`, 'supplies_pct'],
    ['Otros fijos', `${fmtSoles(BE.other_fixed_monthly_soles)}/mes${BE.other_fixed_is_estimate ? ' (est.)' : ''}`, null],
    ['Ticket base', `${fmtSoles(BE.ticket_default_soles)} con IGV ${fmtPct(BE.igv_pct)}`, 'ticket_default_soles'],
    ['Tipo de cambio', `S/ ${fmtN(BE.usd_pen, 2)}`, 'usd_pen'],
    ['Días/mes', fmtN(BE.working_days_month), null],
    ['Capacidad', `${fmtN(BE.visits_per_vet_day_capacity)} visitas/vet/día`, 'visits_per_vet_day_capacity'],
    ['Cuota justa', `${fmtN(fs.pet_households_pct, 1)}% hogares con mascota × ${fmtPct((fs.vet_visit_rate || 0) * 100)} van al vet × ${fmtN(fs.visits_per_household_year)} visitas/año`, 'fair_share.vet_visit_rate'],
  ]
  const bad = badDistricts()

  return (
    <Section id="numeros" n="06" eyebrow="Punto de equilibrio" title="¿Cierran los números?"
      insight={<Insight kicker="Punto de equilibrio"><Rich text={`En **${d.district}** necesitas **${fmtN(R.be, 1)} visitas/día** para cubrir costos${isNum(util) ? ` (${fmtPct(util)} de la capacidad)` : ''}.${bad.includes(d.district) ? ' Ojo: la zonificación solo permite consultorio.' : ''}`} /></Insight>}>
      <Reveal>
        <Panel className="p-5">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold"><SlidersHorizontal className="size-4 text-primary" />Simulador</div>
          <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="grid gap-2">
              <label className="text-xs font-medium text-muted-foreground" htmlFor="sim-d">Distrito</label>
              <Select value={pick} onValueChange={setPick}>
                <SelectTrigger id="sim-d" className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent className="z-[1150]">{RANK.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <div className="flex justify-between text-xs font-medium text-muted-foreground"><span id="sim-m2">Local</span><b className="text-foreground tabular-nums">{fmtN(m2)} m²</b></div>
              <Slider aria-labelledby="sim-m2" min={40} max={300} step={10} value={[m2]} onValueChange={v => setM2(v[0])} className="py-2" />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between gap-2 text-xs font-medium text-muted-foreground">
                <label htmlFor="sim-t">Ticket S/</label>
                <label className="flex cursor-pointer items-center gap-1.5"><Switch checked={useDist} onCheckedChange={setUseDist} aria-label="Usar ticket del distrito" />del distrito ({fmtSoles(d.avg_ticket)})</label>
              </div>
              <Input id="sim-t" type="number" inputMode="numeric" min={30} max={600} step={5} value={useDist && isNum(d.avg_ticket) ? Math.round(d.avg_ticket) : ticket} disabled={useDist}
                onChange={e => { const v = Number(e.target.value); if (isNum(v) && v > 0) setTicket(v) }} className="tabular-nums" />
            </div>
            <div className="grid gap-2">
              <div className="flex justify-between text-xs font-medium text-muted-foreground"><span id="sim-v">Visitas por día</span><b className="text-foreground tabular-nums">{fmtN(visits)}</b></div>
              <Slider aria-labelledby="sim-v" min={1} max={40} step={1} value={[visits]} onValueChange={v => setVisits(v[0])} className="py-2" />
            </div>
          </div>
        </Panel>
      </Reveal>

      <div className="mt-4 grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Reveal className="h-full"><KpiCard icon={<Target />} label="Equilibrio" value={isNum(R.be) ? Math.round(R.be * 10) / 10 : null} format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }} suffix="visitas/día"
          sub={isNum(util) ? <span className="flex items-center gap-2">{fmtPct(util)} de la capacidad <span className="inline-block h-1.5 w-16 overflow-hidden rounded-full bg-slate-100"><span className="block h-full rounded-full" style={{ width: `${Math.min(100, util)}%`, background: util > 80 ? COLORS.bad : util > 60 ? COLORS.mid : COLORS.good }} /></span></span> : undefined} /></Reveal>
        <Reveal delay={0.06} className="h-full"><KpiCard icon={<Home />} label="Alquiler / ingresos" value={isNum(rp) ? Math.round(rp * 10) / 10 : null} suffix="%" format={{ maximumFractionDigits: 1 }} tone={isNum(rp) && rp > 10 ? 'neg' : undefined} sub={`con ${fmtN(visits)} visitas · sano 4–6%`} /></Reveal>
        <Reveal delay={0.12} className="h-full"><KpiCard icon={<Coins />} label={`Utilidad/mes · ${fmtN(visits)} visitas`} value={Math.round(prof)} prefix="S/" tone={prof < 0 ? 'neg' : 'pos'} sub={`fijos ${fmtSoles(R.fixed)}/mes`} /></Reveal>
        <Reveal delay={0.18} className="h-full"><KpiCard icon={<Clock />} label="Payback" value={isNum(pb) ? Math.round(pb * 10) / 10 : null} format={{ maximumFractionDigits: 1 }} suffix="meses" soft="No se recupera" tone={isNum(pb) ? undefined : 'neg'} sub={`inversión ${fmtSoles(R.capex)}`} /></Reveal>
      </div>

      <Reveal className="mt-4">
        <Panel>
          <CardHead title="Utilidad mensual según visitas por día" sub={`Cada visita diaria extra suma ${fmtSoles(R.contrib * R.days)}/mes · ${shortD(d.district)} vs. otros distritos`} />
          <div className="px-2 pt-3 pb-2 sm:px-4">
            <ChartContainer config={{}} className="aspect-auto h-[320px] w-full">
              <LineChart data={data} margin={{ top: 24, right: 20, left: 8, bottom: 8 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="x" type="number" domain={[0, 40]} ticks={[0, 5, 10, 15, 20, 25, 30, 35, 40]} tickLine={false} axisLine={false} label={{ value: 'Visitas por día', position: 'insideBottom', offset: -4, fontSize: 11, fill: '#5B6B7F' }} />
                <YAxis tickLine={false} axisLine={false} width={64} tickFormatter={v => fmtK(v)} />
                <ReferenceLine y={0} stroke="#0F172A" strokeWidth={1} />
                <ReferenceLine x={visits} stroke="#94A3B8" strokeDasharray="4 4" label={{ value: `${visits} visitas`, position: 'top', fontSize: 11, fill: '#0F172A' }} />
                <Tooltip content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null
                  const rows = [...payload].sort((a, b) => Number(b.value) - Number(a.value)).map(p => ({ k: shortD(String(p.dataKey)), v: fmtSolesSigned(p.value), color: p.dataKey === d.district ? COLORS.accent : '#CBD5E1', strong: p.dataKey === d.district }))
                  return <TipCard title={`${label} visitas/día`} rows={rows} />
                }} />
                {sims.filter(x => x.d.district !== d.district).map(x => <Line key={x.d.district} dataKey={x.d.district} stroke="#CBD5E1" strokeWidth={1.5} dot={false} isAnimationActive={false} />)}
                <Line isAnimationActive={ANIM} dataKey={d.district} stroke={COLORS.accent} strokeWidth={3} dot={false} animationDuration={700} />
                {isNum(R.be) && R.be <= 40 && <ReferenceDot x={Math.round(R.be * 10) / 10} y={0} r={6} fill={COLORS.accent} stroke="#fff" strokeWidth={2} label={{ value: `Equilibrio ${fmtN(R.be, 1)}`, position: 'top', offset: 10, fontSize: 12, fontWeight: 700, fill: COLORS.accentInk }} />}
              </LineChart>
            </ChartContainer>
            <Legend className="px-3 pb-2" items={[{ color: COLORS.accent, label: d.district, line: true }, { color: '#CBD5E1', label: 'Otros distritos', line: true }, { color: '#0F172A', label: 'Utilidad 0', line: true }]} />
          </div>
        </Panel>
      </Reveal>

      <Reveal className="mt-4">
        <Collapsible open={openS} onOpenChange={setOpenS}>
          <Panel>
            <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 px-5 py-3.5 text-left text-sm font-medium hover:bg-muted/50">
              <span className="flex items-center gap-2"><Info className="size-4 text-primary" />Sensibilidad y supuestos</span>
              <ChevronDown className={cn('size-4 transition-transform duration-200', openS && 'rotate-180')} />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="grid gap-6 border-t p-5 lg:grid-cols-2">
                <div>
                  <div className="text-sm font-semibold">¿Qué mueve el equilibrio?</div>
                  <p className="text-xs text-muted-foreground">Cambio en visitas/día vs. {fmtN(b0, 1)} actuales · verde = baja el equilibrio</p>
                  <ChartContainer config={{}} className="mt-2 aspect-auto h-[220px] w-full">
                    <BarChart data={sens} layout="vertical" margin={{ left: 4, right: 40, top: 4, bottom: 4 }}>
                      <XAxis type="number" hide domain={['dataMin - 1', 'dataMax + 1']} />
                      <YAxis type="category" dataKey="l" width={150} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: 'var(--foreground)' }} />
                      <ReferenceLine x={0} stroke="#94A3B8" />
                      <Tooltip cursor={{ fill: 'var(--muted)' }} content={({ active, payload }) => active && payload?.length ? <TipCard title={String((payload[0].payload as { l: string }).l)} rows={[{ k: 'Cambio', v: `${Number(payload[0].value) >= 0 ? '+' : '−'}${fmtN(Math.abs(Number(payload[0].value)), 1)} visitas/día`, strong: true }]} /> : null} />
                      <Bar isAnimationActive={ANIM} dataKey="dv" radius={4} barSize={18}>
                        {sens.map(x => <Cell key={x.l} fill={x.dv > 0.05 ? COLORS.bad : x.dv < -0.05 ? COLORS.good : '#94A3B8'} />)}
                        <LabelList dataKey="dv" position="right" className="fill-foreground text-[11px] font-semibold tabular-nums" formatter={(v: unknown) => `${Number(v) >= 0 ? '+' : '−'}${fmtN(Math.abs(Number(v)), 1)}`} />
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                </div>
                <div className="min-w-0">
                  <div className="mb-2 text-sm font-semibold">Supuestos</div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[12px]">
                      <tbody>
                        {A.map(([l, v, f]) => { const src = f ? srcOf(f) : []; return (
                          <tr key={l} className="border-b last:border-0">
                            <th scope="row" className="py-1.5 pr-3 text-left font-medium whitespace-nowrap">{l}</th>
                            <td className="py-1.5 pr-3 tabular-nums">{v}</td>
                            <td className="py-1.5 text-right">{f ? (src.length ? src.slice(0, 2).map((x, i) => /^https?:/.test(x.url) ? <a key={i} href={x.url} target="_blank" rel="noopener" className="ml-2 text-[#0F766E] hover:underline">{host(x.url)}</a> : <span key={i} className="ml-2 text-muted-foreground">dato propio</span>) : '—') : <span className="text-muted-foreground">propio</span>}</td>
                          </tr>
                        ) })}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-3 text-[11px] text-muted-foreground">{bad.length ? `En ${joinY(bad.map(shortD))} la zonificación solo permite consultorio: estos números asumen clínica. ` : ''}Antes de impuestos, sin curva de arranque.</p>
                </div>
              </div>
            </CollapsibleContent>
          </Panel>
        </Collapsible>
      </Reveal>
    </Section>
  )
}
