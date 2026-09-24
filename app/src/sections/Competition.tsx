import { Bar, BarChart, Cell, LabelList, ReferenceLine, Tooltip, XAxis, YAxis } from 'recharts'
import { TriangleAlert, Moon } from 'lucide-react'
import type { EChartsOption } from 'echarts'
import { ChartContainer } from '@/components/ui/chart'
import { Tooltip as UiTip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { BE, PLACES, RANK } from '@/data/dash'
import { cap, fmtN, fmtPct, fmtSoles, isNum, mean, median, pct, shortChain, shortD, sum, trunc, ANIM } from '@/lib/format'
import { COLORS, MARGIN, MARGIN_W, VULN_N, VULN_R, hhiLabel, hhiTone, isEnriched, isEstTicket, isVuln, lorenz, ticketBasis, toneColor, topNegThemes, type Scope } from '@/lib/logic'
import { setDistrict } from '@/lib/store'
import { CardHead, Empty, Insight, Legend, Meter, Panel, Pill, Reveal, Rich, Section, TipCard, tipHTML } from '@/components/common/common'
import { EChart } from '@/components/charts/EChart'
import { TIP, FONT } from '@/lib/echarts'

function TopPlayers({ S }: { S: Scope }) {
  if (!S.top.length) return <Empty msg="Sin clínicas en este alcance." />
  const max = Math.max(...S.top.map(t => t.share || 0), 1)
  return (
    <div className="grid gap-2.5 px-5 pb-5">
      {S.top.map((t, i) => (
        <UiTip key={t.p.id}>
          <TooltipTrigger asChild>
            <div className="group min-w-0 cursor-default">
              <div className="mb-1 flex items-center justify-between gap-2 text-[13px]">
                <span className="flex min-w-0 items-center gap-1.5">
                  <span className="w-4 shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">{i + 1}</span>
                  <span className="truncate font-medium">{t.name}</span>
                  {t.is_24h && <Moon className="size-3.5 shrink-0 text-[#0F766E]" aria-label="Atiende 24h" />}
                  {t.chain && <Pill tone="teal" className="hidden sm:inline-flex">{trunc(t.chain, 14)}</Pill>}
                </span>
                <b className="shrink-0 tabular-nums">{fmtPct(t.share, 1)}</b>
              </div>
              <div className="ml-5.5 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(100 * (t.share || 0)) / max}%`, background: t.is_24h ? COLORS.primaryDark : '#5EEAD4' }} />
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="bg-transparent p-0 shadow-none">
            <TipCard title={t.name} rows={[{ k: 'Reseñas', v: `${fmtN(t.reviews)} (${fmtPct(t.share, 1)})`, strong: true }, { k: 'Rating', v: fmtN(t.rating, 1) }, { k: 'Horario', v: t.is_24h ? 'Atiende 24h' : 'Regular' }, { k: 'Distrito', v: shortD(t.p.district) }, ...(t.chain ? [{ k: 'Cadena', v: t.chain }] : [])]} />
          </TooltipContent>
        </UiTip>
      ))}
      <Legend className="mt-1" items={[{ color: COLORS.primaryDark, label: 'Atiende 24h' }, { color: '#5EEAD4', label: 'Horario regular' }]} />
    </div>
  )
}

function Chains({ S }: { S: Scope }) {
  const cc: Record<string, number> = {}; S.P.forEach(p => { const c = shortChain(p.chain); if (c) cc[c] = (cc[c] || 0) + 1 })
  const list = Object.entries(cc).sort((a, b) => b[1] - a[1])
  const enr = S.P.filter(isEnriched).length
  let shown = list.filter(x => x[1] >= 2).slice(0, 5); if (!shown.length) shown = list.slice(0, 5)
  const inChain = sum(list.map(x => x[1]))
  if (!list.length) return <div className="px-5 pb-5"><Empty msg={enr ? `No se identificaron cadenas en ${S.label}.` : 'Investigación de cadenas en curso.'} /></div>
  return (
    <div className="px-5 pb-5">
      <div className="mb-4 flex items-end gap-3">
        <div className="text-3xl font-semibold tracking-tight tabular-nums">{fmtPct(pct(inChain, S.P.length))}</div>
        <div className="pb-1 text-xs text-muted-foreground">de las clínicas pertenece a una cadena<br />{fmtN(S.P.length - inChain)} independientes</div>
      </div>
      <div className="grid gap-3">
        {shown.map(([n, c]) => (
          <div key={n}>
            <div className="mb-1 flex justify-between text-[13px]"><span className="font-medium">{n}</span><span className="tabular-nums text-muted-foreground">{fmtN(c)} sede{c === 1 ? '' : 's'}</span></div>
            <Meter value={c} max={list[0][1]} color={COLORS.primary} />
          </div>
        ))}
      </div>
      {list.length > shown.length && <p className="mt-3 text-xs text-muted-foreground">+{fmtN(list.length - shown.length)} marcas con presencia menor.</p>}
    </div>
  )
}

function Ticket({ S }: { S: Scope }) {
  const T = S.tickets; const cp = S.P.map(p => p.consult_price).filter(isNum)
  const TB = ticketBasis(S.P)
  if (!T.length) return <div className="px-5 pb-5"><Empty msg={`Aún no hay tickets estimados para ${S.label}.`} /></div>
  const bins: [number, number][] = [[0, 50], [50, 100], [100, 150], [150, 200], [200, 300], [300, Infinity]]
  const data = bins.map(([a, b]) => ({ l: b === Infinity ? `${a}+` : `${a}–${b - 1}`, n: T.filter(v => v >= a && v < b).length }))
  const mx = Math.max(...data.map(d => d.n))
  return (
    <div className="px-5 pb-5">
      <div className="grid grid-cols-3 gap-2">
        {[['Promedio', fmtSoles(mean(T))], ['Mediana', fmtSoles(median(T))], ['Consulta publ.', cp.length ? `${fmtSoles(Math.min(...cp))}–${fmtN(Math.max(...cp))}` : '—']].map(([l, v]) => (
          <div key={l} className="rounded-lg bg-muted/60 p-2.5"><div className="text-[11px] text-muted-foreground">{l}</div><div className="text-base font-semibold tabular-nums sm:text-lg">{v}</div></div>
        ))}
      </div>
      <ChartContainer config={{ n: { label: 'Clínicas', color: COLORS.primary } }} className="mt-3 aspect-auto h-[170px] w-full">
        <BarChart data={data} margin={{ top: 18, right: 4, left: 4, bottom: 0 }}>
          <XAxis dataKey="l" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
          <Tooltip cursor={{ fill: 'var(--muted)' }} content={({ active, payload }) => active && payload?.length ? <TipCard title={`S/ ${(payload[0].payload as { l: string }).l}`} rows={[{ k: 'Clínicas', v: fmtN(payload[0].value), strong: true }, { k: '% del total', v: fmtPct(pct(payload[0].value, T.length)) }]} /> : null} />
          <Bar isAnimationActive={ANIM} dataKey="n" radius={4} animationDuration={800}>
            {data.map(d => <Cell key={d.l} fill={d.n === mx ? COLORS.primaryDark : '#99F6E4'} />)}
            <LabelList dataKey="n" position="top" className="fill-foreground text-[11px] font-semibold tabular-nums" formatter={(v: unknown) => (v ? fmtN(v) : '')} />
          </Bar>
        </BarChart>
      </ChartContainer>
      <p className="mt-2 flex gap-1.5 text-[11px] leading-snug text-muted-foreground"><TriangleAlert className="size-3.5 shrink-0 text-mid-ink" />Estimado: {TB.pub ? `solo ${fmtN(TB.pub)} de ${fmtN(TB.n)}` : `ninguno de ${fmtN(TB.n)}`} de precios publicados; {fmtN(TB.rev)} de reseñas y {fmtN(TB.seg)} por segmento.</p>
    </div>
  )
}

function Bubbles({ S }: { S: Scope }) {
  const pts = S.P.filter(p => isNum(p.rating)).map((p, i) => ({ p, x: (p.rating as number) + ((((i * 37) % 7) - 3) * 0.012), y: Math.max(p.reviews_count || 0, 1), t: isNum(p.ticket) ? p.ticket : BE.ticket_default_soles || 120 }))
  if (!pts.length) return <Empty msg="Sin clínicas con rating en este alcance." />
  const V = pts.filter(q => isVuln(q.p))
  const ymax = Math.pow(10, Math.ceil(Math.log10(Math.max(10, ...pts.map(q => q.y)) * 1.3)))
  const xmin = Math.min(3, Math.floor(Math.min(...pts.map(q => q.x)) * 2) / 2)
  const size = (t: number) => Math.max(6, Math.sqrt(t) * 1.25)
  const mk = (arr: typeof pts, vuln: boolean) => arr.map(q => ({
    value: [q.x, q.y, q.t], name: q.p.name, p: q.p,
    itemStyle: { color: vuln ? 'rgba(234,88,12,.72)' : 'rgba(13,148,136,.32)', borderColor: q.p.is_24h ? '#0F172A' : vuln ? '#C2410C' : 'rgba(15,118,110,.7)', borderWidth: q.p.is_24h ? 2 : 0.8 },
  }))
  const option: EChartsOption = {
    textStyle: { fontFamily: FONT },
    grid: { left: 52, right: 16, top: 16, bottom: 44 },
    tooltip: { ...TIP, trigger: 'item', formatter: (prm: unknown) => {
      const d = (prm as { data: { p: (typeof pts)[number]['p'] } }).data.p; const neg = topNegThemes(d)
      return tipHTML(d.name, [['Rating', fmtN(d.rating, 1)], ['Reseñas', fmtN(d.reviews_count)], ['Ticket', `${fmtSoles(d.ticket)}${isEstTicket(d) ? ' (est.)' : ''}`], ['Distrito', shortD(d.district)], ...(d.is_24h ? [['Horario', '24h'] as [string, string]] : [])], neg.length ? `Quejas: ${neg.join(', ')}` : undefined)
    } },
    xAxis: { type: 'value', min: xmin, max: 5.05, name: 'Rating en Google', nameLocation: 'middle', nameGap: 28, nameTextStyle: { color: '#5B6B7F', fontSize: 11 }, axisLabel: { color: '#5B6B7F', formatter: (v: number) => fmtN(v, 1) }, splitLine: { lineStyle: { color: '#EEF2F6', type: 'dashed' } }, axisLine: { show: false }, axisTick: { show: false } },
    yAxis: { type: 'log', min: 1, max: ymax, name: 'Reseñas (log)', nameLocation: 'middle', nameGap: 38, nameTextStyle: { color: '#5B6B7F', fontSize: 11 }, axisLabel: { color: '#5B6B7F', formatter: (v: number) => fmtN(v) }, splitLine: { lineStyle: { color: '#EEF2F6', type: 'dashed' } }, axisLine: { show: false } },
    series: [
      { type: 'scatter', name: 'Resto', data: mk(pts.filter(q => !isVuln(q.p)), false), symbolSize: (v: number[]) => size(v[2]),
        markArea: { silent: true, itemStyle: { color: 'rgba(234,88,12,.06)' }, label: { show: true, position: 'insideTopLeft', color: '#C2410C', fontWeight: 700, fontSize: 12, formatter: `Vulnerables: ${V.length}` }, data: [[{ coord: [xmin, VULN_N] }, { coord: [VULN_R, ymax] }]] },
        markLine: { silent: true, symbol: 'none', label: { show: false }, lineStyle: { color: '#EA580C', type: 'dashed', width: 1.2 }, data: [{ xAxis: VULN_R }, { yAxis: VULN_N }] } },
      { type: 'scatter', name: 'Vulnerables', data: mk(V, true), symbolSize: (v: number[]) => size(v[2]), z: 5 },
    ],
  }
  return <EChart option={option} height={360} />
}

function HHI({ sel }: { sel: string }) {
  const LZ = RANK.map(n => ({ n, L: lorenz(PLACES.filter(p => p.district === n)) })).filter(x => x.L).map(x => ({ name: shortD(x.n), full: x.n, hhi: Math.round(x.L!.hhi), top3: x.L!.top3 }))
  if (!LZ.length) return <Empty msg="Sin reseñas para calcular concentración." />
  const max = Math.max(3000, ...LZ.map(d => d.hhi)) * 1.1
  return (
    <div className="px-3 pb-4">
      <ChartContainer config={{ hhi: { label: 'HHI', color: COLORS.primary } }} className="aspect-auto h-[250px] w-full">
        <BarChart data={LZ} layout="vertical" margin={{ top: 18, right: 44, left: 4, bottom: 4 }} barCategoryGap={10}>
          <XAxis type="number" hide domain={[0, max]} />
          <YAxis type="category" dataKey="name" width={84} tickLine={false} axisLine={false} tick={{ fill: 'var(--foreground)', fontSize: 13, fontWeight: 500 }} />
          <ReferenceLine x={1500} stroke="#F59E0B" strokeDasharray="4 4" label={{ value: '1.500', position: 'top', fontSize: 10, fill: '#B45309' }} />
          <ReferenceLine x={2500} stroke="#DC2626" strokeDasharray="4 4" label={{ value: '2.500', position: 'top', fontSize: 10, fill: '#B91C1C' }} />
          <Tooltip cursor={{ fill: 'var(--muted)' }} content={({ active, payload }) => { if (!active || !payload?.length) return null; const d = payload[0].payload as (typeof LZ)[number]; return <TipCard title={d.full} rows={[{ k: 'HHI', v: fmtN(d.hhi), strong: true }, { k: 'Top 3 se lleva', v: fmtPct(d.top3) }, { k: 'Lectura', v: hhiLabel(d.hhi) }]} foot=">2.500 = pocos dominan · <1.500 = repartido" /> }} />
          <Bar isAnimationActive={ANIM} dataKey="hhi" radius={5} barSize={22} className="cursor-pointer" onClick={(e: { payload?: { full?: string } }) => e?.payload?.full && setDistrict(e.payload.full)}>
            {LZ.map(d => <Cell key={d.full} fill={toneColor(hhiTone(d.hhi))} fillOpacity={sel !== 'all' && sel !== d.full ? 0.35 : 0.9} />)}
            <LabelList dataKey="hhi" position="right" className="fill-foreground text-[12px] font-semibold tabular-nums" formatter={(v: unknown) => fmtN(v)} />
          </Bar>
        </BarChart>
      </ChartContainer>
      <Legend className="px-2" items={[{ color: COLORS.good, label: 'Repartido' }, { color: COLORS.mid, label: 'Moderado' }, { color: COLORS.bad, label: 'Muy concentrado' }]} />
    </div>
  )
}

function heat(t: number) { const a = [240, 253, 250], b = [15, 118, 110]; return `rgb(${a.map((x, i) => Math.round(x + (b[i] - x) * t)).join(',')})` }
function Services({ sel }: { sel: string }) {
  const svc: Record<string, number> = {}; PLACES.forEach(p => (p.services || []).forEach(s => { if (s) svc[s] = (svc[s] || 0) + 1 }))
  const SERV = Object.keys(svc).filter(s => s !== 'consulta').sort((a, b) => (MARGIN_W[MARGIN[b] || 'Sin dato'] - MARGIN_W[MARGIN[a] || 'Sin dato']) || svc[b] - svc[a])
  const cols = RANK.map(n => ({ n, known: PLACES.filter(p => p.district === n && (p.services || []).length) }))
  const val = (col: (typeof cols)[number], s: string) => (col.known.length ? (100 * col.known.filter(p => (p.services || []).includes(s)).length) / col.known.length : null)
  const opp: Record<string, string[]> = {}
  cols.forEach(col => { opp[col.n] = SERV.filter(s => MARGIN[s] === 'Alto' || MARGIN[s] === 'Medio').map(s => ({ s, o: MARGIN_W[MARGIN[s]] * (1 - (val(col, s) || 0) / 100) })).sort((a, b) => b.o - a.o).slice(0, 3).map(x => x.s) })
  if (!SERV.length) return <Empty msg="Sin datos de servicios." />
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-separate border-spacing-1 px-4 pb-4 text-[13px]">
        <thead><tr className="text-xs text-muted-foreground">
          <th className="px-2 py-1.5 text-left font-medium">Servicio</th><th className="px-2 py-1.5 text-left font-medium">Margen</th>
          {cols.map(c => <th key={c.n} className={cn('px-2 py-1.5 text-center font-medium', sel === c.n && 'text-foreground')}>{shortD(c.n)}<div className="text-[10px] font-normal">n={fmtN(c.known.length)}</div></th>)}
        </tr></thead>
        <tbody>
          {SERV.map(s => { const mg = MARGIN[s] || 'Sin dato'; return (
            <tr key={s}>
              <th scope="row" className="px-2 py-1 text-left font-medium">{cap(s)}</th>
              <td className="px-2 py-1"><Pill tone={mg === 'Alto' ? 'opp' : mg === 'Medio' ? 'teal' : 'gray'}>{mg}</Pill></td>
              {cols.map(col => { const v = val(col, s); const t = isNum(v) ? v / 100 : 0; const o = opp[col.n].includes(s); return (
                <td key={col.n} title={`${shortD(col.n)} · ${s}: ${isNum(v) ? fmtPct(v) : 'sin dato'}${o ? ' · hueco de margen' : ''}`}
                  className={cn('rounded-md px-2 py-1.5 text-center font-medium tabular-nums', sel !== 'all' && sel !== col.n && 'opacity-45', o && 'ring-2 ring-opp ring-inset')}
                  style={{ background: isNum(v) ? heat(t) : '#F8FAFC', color: t > 0.55 ? '#fff' : '#0F172A' }}>{isNum(v) ? fmtN(v) + '%' : '—'}</td>
              ) })}
            </tr>
          ) })}
        </tbody>
      </table>
    </div>
  )
}

export function Competition({ S }: { S: Scope }) {
  const lowPct = pct(S.lowRated, S.ratings.length)
  const share3 = sum(S.top.slice(0, 3).map(t => t.share))
  const conc = share3 >= 40 ? 'concentrado' : 'fragmentado'
  return (
    <Section id="competencia" n="05" eyebrow="Competencia" title="¿Qué tan fuerte es la competencia?"
      insight={<Insight><Rich text={`En ${S.label}, **${fmtPct(lowPct)}** de las clínicas tiene rating menor a 4.0. El top 3 se lleva **${fmtPct(share3)}** de las reseñas: mercado ${conc}.`} /></Insight>}>
      <div className="grid gap-4 lg:grid-cols-3">
        <Reveal className="h-full"><Panel className="h-full"><CardHead title="Top players por reseñas" sub={`% de reseñas en ${S.label}`} /><div className="pt-4"><TopPlayers S={S} /></div></Panel></Reveal>
        <Reveal delay={0.06} className="h-full"><Panel className="h-full"><CardHead title="Cadenas presentes" sub="Top 5 por sedes" /><div className="pt-4"><Chains S={S} /></div></Panel></Reveal>
        <Reveal delay={0.12} className="h-full"><Panel className="h-full"><CardHead title="Ticket por visita" sub="Distribución de clínicas por rango (S/)" action={<Pill tone="mid">estimado</Pill>} /><div className="pt-4"><Ticket S={S} /></div></Panel></Reveal>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-5">
        <Reveal className="h-full lg:col-span-3">
          <Panel className="h-full">
            <CardHead title="Líderes débiles que se pueden desplazar" sub={`Rating × reseñas × ticket (tamaño) · vulnerable = <${fmtN(VULN_R, 1)}★ y ${VULN_N}+ reseñas`} />
            <div className="px-2 pt-2"><Bubbles S={S} /></div>
            <Legend className="px-5 pb-4" items={[{ color: COLORS.accent, label: 'Vulnerable', shape: 'dot' }, { color: 'rgba(13,148,136,.45)', label: 'Resto', shape: 'dot' }, { color: '#0F172A', label: 'Atiende 24h', ring: true, shape: 'dot' }]} />
          </Panel>
        </Reveal>
        <Reveal delay={0.08} className="h-full lg:col-span-2">
          <Panel className="h-full"><CardHead title="¿Alguien domina el mercado?" sub="Índice HHI sobre reseñas · >2.500 = concentrado" /><div className="pt-3"><HHI sel={S.district} /></div></Panel>
        </Reveal>
      </div>
      <Reveal className="mt-4">
        <Panel>
          <CardHead title="Servicios × distrito" sub="% de clínicas que ofrece cada servicio · borde naranja = hueco de margen alto/medio" />
          <div className="pt-3"><Services sel={S.district} /></div>
        </Panel>
      </Reveal>
    </Section>
  )
}
