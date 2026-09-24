import { Bar, BarChart, CartesianGrid, Cell, ReferenceArea, ReferenceLine, Tooltip, XAxis, YAxis } from 'recharts'
import type { EChartsOption } from 'echarts'
import { ChartContainer } from '@/components/ui/chart'
import { G } from '@/data/dash'
import { fmtN, fmtPct, fmtX, hh, isNum, mean, nums, ANIM } from '@/lib/format'
import { COLORS, DAY_G, HEAT_ORDER, coverageAnalysis, demandSupply, type Scope } from '@/lib/logic'
import { CardHead, Empty, Insight, Legend, Panel, Reveal, Rich, Section, TipCard, tipHTML } from '@/components/common/common'
import { EChart } from '@/components/charts/EChart'
import { FONT, TIP } from '@/lib/echarts'

function Heat({ grid, A }: { grid: number[][]; A: NonNullable<ReturnType<typeof coverageAnalysis>> }) {
  const days = HEAT_ORDER.map(d => DAY_G[d].slice(0, 3))
  const data: { value: [number, number, number]; label?: object; itemStyle?: object }[] = []
  HEAT_ORDER.forEach((d, row) => { for (let h = 0; h < 24; h++) { const v = grid[d][h]; const t = A.mx > A.mn ? (v - A.mn) / (A.mx - A.mn) : 0.5; data.push({ value: [h, row, v], label: { color: t > 0.5 ? '#FFFFFF' : '#0F172A' }, itemStyle: v <= A.thr ? { borderColor: '#EA580C', borderWidth: 1.5 } : undefined }) } })
  const option: EChartsOption = {
    textStyle: { fontFamily: FONT },
    grid: { left: 40, right: 8, top: 8, bottom: 56 },
    tooltip: { ...TIP, formatter: (p: unknown) => { const v = (p as { value: number[] }).value; const low = v[2] <= A.thr; return tipHTML(`${DAY_G[HEAT_ORDER[v[1]]]} ${hh(v[0])}–${hh((v[0] + 1) % 24)}`, [['Clínicas abiertas', fmtN(v[2])], ['vs. pico', fmtPct((100 * v[2]) / (A.mx || 1))]], low ? 'Hueco: oportunidad de horario' : undefined) } },
    xAxis: { type: 'category', data: Array.from({ length: 24 }, (_, h) => `${h}`), axisTick: { show: false }, axisLine: { show: false }, axisLabel: { color: '#5B6B7F', fontSize: 10, interval: 1 }, splitArea: { show: false } },
    yAxis: { type: 'category', data: days, inverse: true, axisTick: { show: false }, axisLine: { show: false }, axisLabel: { color: '#0F172A', fontSize: 11 } },
    visualMap: { min: A.mn, max: A.mx, calculable: false, orient: 'horizontal', left: 'center', bottom: 0, itemHeight: 160, itemWidth: 10, text: ['Muchas abiertas', 'Pocas'], textStyle: { color: '#5B6B7F', fontSize: 11 }, inRange: { color: ['#F0FDFA', '#99F6E4', '#14B8A6', '#0F766E'] } },
    series: [{ type: 'heatmap', data, label: { show: true, fontSize: 9, color: '#0F172A', formatter: (p: unknown) => String((p as { value: number[] }).value[2]) }, itemStyle: { borderColor: '#fff', borderWidth: 1.5, borderRadius: 3 }, emphasis: { itemStyle: { borderColor: '#0F172A', borderWidth: 2 } } }],
  }
  return <EChart option={option} height={320} />
}

export function Hours({ S }: { S: Scope }) {
  const grid = S.coverage
  const A = coverageAnalysis(grid, S.count)
  const DS = demandSupply(S.all ? G : S.d)
  const f24 = S.P.filter(p => p.is_24h_google === true && p.is_24h === false).length
  const inBand = (h: number) => h >= 20 && h <= 23
  const bandAvg = DS ? mean(DS.idx.filter((_v, h) => inBand(h))) : null
  const dsData = DS ? DS.idx.map((v, h) => ({ h, v: isNum(v) ? Math.round(v * 100) / 100 : null, dem: DS.dem[h], sup: DS.sup[h] })) : []
  const imax = DS ? Math.max(2, ...nums(DS.idx)) : 2
  return (
    <Section id="horarios" n="06" eyebrow="Horarios y demanda" title="¿Cuándo hay menos clínicas abiertas?"
      insight={<Insight>{A ? <Rich text={`${f24 ? `Ojo: **${fmtN(f24)} “24h” de Google no lo son**. ` : ''}Entre las **${A.rangeTxt || '—'}** abren en promedio **${fmtN(A.lowAvg)} de ${fmtN(S.count)}** clínicas (${fmtPct(A.lowPct)}), frente a ${fmtN(A.peakV)} a las ${hh(A.peakH)}. El ${A.weakDay.toLowerCase()} es el día más flojo.`} /> : 'No hay datos de horarios para este alcance.'}</Insight>}>
      <Reveal>
        <Panel>
          <CardHead title="Clínicas abiertas por día y hora" sub={A ? `${S.name} · máx. ${fmtN(A.mx)} abiertas · borde naranja = hueco (${fmtN(Math.floor(A.thr))} o menos)` : S.name} />
          <div className="overflow-x-auto px-2 pt-2 pb-2"><div className="min-w-[640px]">{grid && A ? <Heat grid={grid} A={A} /> : <Empty msg="Sin horarios publicados." />}</div></div>
        </Panel>
      </Reveal>
      <Reveal className="mt-4">
        <Panel>
          <CardHead title="Demanda vs. oferta por hora" sub={DS ? `${isNum(bandAvg) ? `20–23h: ${fmtX(bandAvg)} demanda/oferta · ` : ''}${fmtN(DS.nRev)} reseñas con hora` : ''} />
          <div className="px-2 pt-3 pb-3 sm:px-4">
            {DS ? (
              <ChartContainer config={{}} className="aspect-auto h-[280px] w-full">
                <BarChart data={dsData} margin={{ top: 16, right: 8, left: 0, bottom: 4 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
                  <ReferenceArea x1={20} x2={23} fill="#EA580C" fillOpacity={0.07} stroke="#EA580C" strokeOpacity={0.3} label={{ value: 'Franja 20–23h', position: 'insideTop', fontSize: 11, fill: '#C2410C', fontWeight: 600 }} />
                  <XAxis dataKey="h" tickLine={false} axisLine={false} interval={2} tickFormatter={v => `${v}h`} />
                  <YAxis tickLine={false} axisLine={false} width={40} domain={[0, Math.ceil(imax)]} ticks={Array.from({ length: Math.ceil(imax) + 1 }, (_, i) => i)} tickFormatter={v => `${fmtN(v, Number.isInteger(v) ? 0 : 1)}×`} />
                  <ReferenceLine y={1} stroke="#0F172A" strokeDasharray="5 4" label={{ value: 'equilibrio 1,0', position: 'insideTopRight', fontSize: 10, fill: '#0F172A' }} />
                  <Tooltip cursor={{ fill: 'var(--muted)' }} content={({ active, payload }) => { if (!active || !payload?.length) return null; const d = payload[0].payload as (typeof dsData)[number]; return <TipCard title={`${hh(d.h)}–${hh((d.h + 1) % 24)}`} rows={[{ k: 'Índice', v: `${fmtN(d.v, 2)}×`, strong: true }, { k: 'Demanda', v: fmtPct(d.dem, 1) }, { k: 'Oferta', v: fmtPct(d.sup, 1) }]} foot={isNum(d.v) && d.v > 1 ? 'Más demanda que oferta' : 'Oferta cubre la demanda'} /> }} />
                  <Bar isAnimationActive={ANIM} dataKey="v" radius={[4, 4, 0, 0]} animationDuration={800}>
                    {dsData.map(d => <Cell key={d.h} fill={inBand(d.h) ? COLORS.accent : isNum(d.v) && d.v >= 1 ? COLORS.primary : '#99F6E4'} />)}
                  </Bar>
                </BarChart>
              </ChartContainer>
            ) : <Empty msg="Sin reseñas con hora o sin horarios en este alcance." />}
            <Legend className="mt-2 px-2" items={[{ color: COLORS.accent, label: 'Franja 20–23h' }, { color: COLORS.primary, label: 'Más demanda que oferta' }, { color: '#99F6E4', label: 'Menos' }]} />
          </div>
        </Panel>
      </Reveal>
      <p className="mt-3 text-xs text-muted-foreground">Cobertura: horarios publicados en Google (24h cuentan todas las horas). Demanda: hora de cada reseña (Lima) como aproximación de visitas; muestra pequeña.</p>
    </Section>
  )
}
