import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, Tooltip, XAxis, YAxis } from 'recharts'
import { Globe, Music2, Quote } from 'lucide-react'
import { Facebook, Instagram } from '@/components/common/brand'
import { ChartContainer } from '@/components/ui/chart'
import { fmtN, fmtPct, isNum, maxBy, pct, sum, ANIM } from '@/lib/format'
import { COLORS, isEnriched, themeStats, worstTheme, type Scope } from '@/lib/logic'
import { CardHead, Empty, Insight, Legend, Meter, Panel, Reveal, Rich, Section, Stars, TipCard } from '@/components/common/common'

export function Social({ S }: { S: Scope }) {
  const T = themeStats(S.themes); const w = worstTheme(S.themes)
  const best = maxBy(T.filter(t => t.total >= 10), t => t.pos / t.total)
  const data = T.map(t => ({ name: t.name, neg: -t.neg, pos: t.pos, negPct: t.negPct, total: t.total, worst: w?.name === t.name }))
  const n = S.P.length; const enr = S.P.filter(isEnriched); const ne = enr.length
  const web = S.P.filter(p => p.website).length
  const ig = enr.filter(p => p.instagram).length, fb = enr.filter(p => p.facebook).length, tk = enr.filter(p => p.tiktok).length
  const REP: [string, string][] = [['Alta', COLORS.good], ['Media', COLORS.mid], ['Baja', COLORS.bad], ['Sin presencia', COLORS.gray]]
  const rc: Record<string, number> = {}; enr.forEach(p => { const r = p.social_reputation; if (r && r !== 'Sin datos') rc[r] = (rc[r] || 0) + 1 })
  const rt = sum(Object.values(rc))
  const cand: { p: (typeof S.P)[number]; r: { rating?: number | null; relative?: string | null; time?: string | null }; t: string }[] = []
  S.P.forEach(p => (p.reviews || []).forEach(r => { const t = String(r.text || '').replace(/[\p{Extended_Pictographic}\u{FE0F}]/gu, '').replace(/\s+/g, ' ').trim(); if (isNum(r.rating) && r.rating <= 2 && t.length >= 40 && t.length <= 200) cand.push({ p, r, t }) }))
  cand.sort((a, b) => String(b.r.time || '').localeCompare(String(a.r.time || '')))
  const seen = new Set<string>(); const pick: typeof cand = []
  for (const c of cand) { if (seen.has(c.p.id)) continue; seen.add(c.p.id); pick.push(c); if (pick.length === 4) break }
  const meters = [
    { ic: <Globe />, l: 'Sitio web', v: pct(web, n), note: `${fmtN(web)} de ${fmtN(n)}` },
    { ic: <Instagram />, l: 'Instagram', v: ne ? pct(ig, ne) : null, note: `${fmtN(ig)} de ${fmtN(ne)}` },
    { ic: <Facebook />, l: 'Facebook', v: ne ? pct(fb, ne) : null, note: `${fmtN(fb)} de ${fmtN(ne)}` },
    { ic: <Music2 />, l: 'TikTok', v: ne ? pct(tk, ne) : null, note: `${fmtN(tk)} de ${fmtN(ne)}` },
  ]
  const h = Math.max(240, data.length * 34 + 30)
  return (
    <Section id="social" n="07" eyebrow="Escucha social" title="¿Qué dicen los clientes de las veterinarias actuales?"
      insight={<Insight>{w ? <Rich text={`Lo que más molesta en ${S.label}: **${w.name}** (${fmtPct(w.negPct)} de ${fmtN(w.total)} menciones son negativas).${best ? ` Lo más valorado: “${best.name}” (${fmtPct((100 * best.pos) / best.total)} positivas).` : ''}`} /> : 'Aún no hay suficientes reseñas para detectar temas.'}</Insight>}>
      <div className="grid gap-4 lg:grid-cols-5">
        <Reveal className="h-full lg:col-span-3">
          <Panel className="h-full">
            <CardHead title="Temas en reseñas" sub="Menciones negativas ← → positivas" />
            <div className="px-2 pt-3 pb-3 sm:px-4">
              {data.length ? (
                <ChartContainer config={{}} className="aspect-auto w-full" style={{ height: h }}>
                  <BarChart data={data} layout="vertical" stackOffset="sign" margin={{ left: 4, right: 16, top: 4, bottom: 4 }} barCategoryGap={6}>
                    <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis type="number" tickLine={false} axisLine={false} tickFormatter={v => fmtN(Math.abs(v))} tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="name" width={150} tickLine={false} axisLine={false} tick={({ x, y, payload }) => { const wst = w?.name === payload.value; return <text x={x} y={y} dy={4} textAnchor="end" fontSize={12} fontWeight={wst ? 700 : 400} fill={wst ? COLORS.bad : '#0F172A'}>{payload.value}</text> }} />
                    <ReferenceLine x={0} stroke="#94A3B8" />
                    <Tooltip cursor={{ fill: 'var(--muted)' }} content={({ active, payload }) => { if (!active || !payload?.length) return null; const d = payload[0].payload as (typeof data)[number]; return <TipCard title={d.name} rows={[{ k: 'Negativas', v: `${fmtN(-d.neg)} (${fmtPct(d.negPct)})`, color: COLORS.bad }, { k: 'Positivas', v: `${fmtN(d.pos)} (${fmtPct(isNum(d.negPct) ? 100 - d.negPct : null)})`, color: COLORS.primary }, { k: 'Total', v: fmtN(d.total), strong: true }]} /> }} />
                    <Bar isAnimationActive={ANIM} dataKey="neg" stackId="a" radius={[4, 0, 0, 4]} animationDuration={800}>{data.map(d => <Cell key={d.name} fill={COLORS.bad} fillOpacity={d.worst ? 1 : 0.55} />)}</Bar>
                    <Bar isAnimationActive={ANIM} dataKey="pos" stackId="a" radius={[0, 4, 4, 0]} fill={COLORS.primary} animationDuration={800} />
                  </BarChart>
                </ChartContainer>
              ) : <Empty msg="Sin menciones de temas." />}
              <Legend className="mt-1 px-2" items={[{ color: COLORS.bad, label: 'Negativa (<4★)' }, { color: COLORS.primary, label: 'Positiva (4–5★)' }]} />
            </div>
          </Panel>
        </Reveal>
        <Reveal delay={0.08} className="h-full lg:col-span-2">
          <Panel className="h-full">
            <CardHead title="Presencia digital" sub={`${fmtN(ne)} de ${fmtN(n)} clínicas investigadas`} />
            <div className="grid gap-4 p-5">
              {meters.map(m => (
                <div key={m.l}>
                  <div className="mb-1.5 flex items-center justify-between text-[13px]"><span className="flex items-center gap-2 font-medium [&>svg]:size-4 [&>svg]:text-muted-foreground">{m.ic}{m.l}</span><span className="flex items-baseline gap-2"><span className="text-[11px] text-muted-foreground">{m.note}</span><b className="w-10 text-right tabular-nums">{fmtPct(m.v)}</b></span></div>
                  <Meter value={m.v} />
                </div>
              ))}
              <div className="mt-1">
                <div className="mb-2 text-[13px] font-medium">Reputación en redes</div>
                {rt ? (
                  <>
                    <div className="flex h-7 overflow-hidden rounded-md text-[11px] font-medium text-white" role="img" aria-label="Reputación social">
                      {REP.filter(([k]) => rc[k]).map(([k, c]) => <div key={k} className="grid place-items-center" style={{ width: `${(100 * rc[k]) / rt}%`, background: c }} title={`${k}: ${rc[k]}`}>{(100 * rc[k]) / rt >= 14 ? fmtPct((100 * rc[k]) / rt) : ''}</div>)}
                    </div>
                    <Legend className="mt-2" items={REP.filter(([k]) => rc[k]).map(([k, c]) => ({ color: c, label: `${k} ${rc[k]}` }))} />
                  </>
                ) : <Empty msg="Reputación social en investigación." />}
              </div>
            </div>
          </Panel>
        </Reveal>
      </div>
      <div className="mt-6 mb-3 flex items-baseline gap-2"><h3 className="text-[15px] font-semibold">Voz del cliente</h3><span className="text-xs text-muted-foreground">reseñas de 1–2 estrellas</span></div>
      {pick.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pick.map((c, i) => (
            <Reveal key={c.p.id} delay={i * 0.06} className="h-full">
              <Panel className="flex h-full flex-col p-5">
                <Quote className="size-5 text-bad/60" />
                <Stars r={c.r.rating ?? null} size={12} showValue={false} />
                <blockquote className="mt-2 flex-1 text-[14px] leading-relaxed text-slate-700">“{c.t}”</blockquote>
                <div className="mt-3 border-t pt-2 text-[11px] text-muted-foreground"><b className="font-medium text-foreground">{c.p.name}</b> · {c.p.district}{c.r.relative ? ` · ${c.r.relative}` : ''}</div>
              </Panel>
            </Reveal>
          ))}
        </div>
      ) : <Empty msg="No hay reseñas negativas cortas en este alcance." />}
    </Section>
  )
}
