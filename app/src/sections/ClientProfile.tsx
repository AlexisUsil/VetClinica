import * as React from 'react'
import { CalendarCheck, Frown, Heart, ThumbsUp, UserRound, Wallet } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DASH } from '@/data/dash'
import type { LabelPct } from '@/data/types'
import { fmtN, fmtPct, isNum } from '@/lib/format'
import { COLORS } from '@/lib/logic'
import { Panel, Pill, Reveal } from '@/components/common/common'

const CP = DASH.client_profile || {}
const EST = new Set(Array.isArray(CP.estimated_fields) ? CP.estimated_fields : [])
const arr = (a?: LabelPct[] | null) => (Array.isArray(a) ? a.filter(x => x && x.label && isNum(x.pct)) as { label: string; pct: number }[] : [])
const MIX = [COLORS.primaryDark, COLORS.primary, '#5EEAD4', '#94A3B8', '#CBD5E1', '#E2E8F0']

function Card({ title, icon, fields, children }: { title: string; icon: React.ReactNode; fields: string[]; children: React.ReactNode }) {
  const est = fields.some(f => EST.has(f))
  return (
    <Panel className="flex h-full flex-col gap-3 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <h4 className="flex min-w-0 items-center gap-2 text-sm font-semibold"><span className="grid size-7 shrink-0 place-items-center rounded-lg bg-teal-soft text-[#0F766E] [&>svg]:size-4">{icon}</span><span className="truncate">{title}</span></h4>
      </div>
      {children}
    </Panel>
  )
}

/** Barras horizontales compactas; resalta la mayor */
function HBars({ items, color = COLORS.primary, rest = '#CBD5E1', hl = true, right }: { items: { label: string; pct: number }[]; color?: string; rest?: string; hl?: boolean; right?: (i: number) => React.ReactNode }) {
  if (!items.length) return <p className="text-xs text-muted-foreground">Sin datos.</p>
  const max = Math.max(...items.map(i => i.pct), 1)
  return (
    <div className="grid gap-1.5">
      {items.map((it, i) => (
        <div key={it.label} className="grid grid-cols-[minmax(0,9.5rem)_1fr_auto] items-center gap-2 text-xs">
          <span className="truncate text-slate-700" title={it.label}>{it.label}</span>
          <span className="h-2 overflow-hidden rounded-full bg-slate-100"><span className="block h-full rounded-full" style={{ width: `${(100 * it.pct) / max}%`, background: !hl || it.pct === max ? color : rest }} /></span>
          <span className="min-w-9 text-right font-semibold tabular-nums">{right ? right(i) : fmtPct(it.pct)}</span>
        </div>
      ))}
    </div>
  )
}

function Stack({ items }: { items: { label: string; pct: number }[] }) {
  if (!items.length) return null
  const tot = items.reduce((a, b) => a + b.pct, 0) || 1
  return (
    <div>
      <div className="flex h-6 w-full overflow-hidden rounded-md text-[10px] font-semibold" role="img" aria-label={items.map(i => `${i.label} ${fmtPct(i.pct)}`).join(', ')}>
        {items.map((it, i) => { const w = (100 * it.pct) / tot; return (
          <div key={it.label} title={`${it.label}: ${fmtPct(it.pct)}`} className={cn('grid min-w-0 place-items-center overflow-hidden whitespace-nowrap', i < 2 ? 'text-white' : 'text-slate-700')} style={{ width: `${w}%`, background: MIX[i % MIX.length] }}>{w >= 9 ? fmtPct(it.pct) : ''}</div>
        ) })}
      </div>
      <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
        {items.map((it, i) => <span key={it.label} className="inline-flex items-center gap-1"><i className="inline-block size-2 rounded-[2px]" style={{ background: MIX[i % MIX.length] }} />{it.label} {fmtPct(it.pct)}</span>)}
      </div>
    </div>
  )
}

function Mini({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-muted/60 px-2.5 py-2"><div className="text-[10px] leading-tight text-muted-foreground">{label}</div><div className="text-base font-semibold tabular-nums">{value}</div></div>
}

export function ClientProfile() {
  if (!DASH.client_profile) return null
  const gd = CP.gender_decider
  const complaints = (Array.isArray(CP.complaints) ? CP.complaints : []).filter(c => c && c.label && isNum(c.neg_pct)).sort((a, b) => (b.neg_pct as number) - (a.neg_pct as number)).slice(0, 6)
  const channels = arr(CP.channels)
  const nRev = (Array.isArray(DASH.places) ? DASH.places : []).reduce((a, p) => a + (Array.isArray(p?.reviews) ? p.reviews.length : 0), 0) || null
  return (
    <div className="mt-10">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-lg font-semibold tracking-tight">Perfil general del cliente</h3>
        <span className="text-xs text-muted-foreground">NSE A/B · 5 distritos</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Reveal className="h-full">
          <Card title="Edad del dueño" icon={<UserRound />} fields={['age_bands', 'gender_decider']}>
            <HBars items={arr(CP.age_bands)} />
            {gd && isNum(gd.female_pct) && isNum(gd.male_pct) && <p className="mt-auto text-xs text-muted-foreground"><b className="text-foreground tabular-nums">{fmtPct(gd.female_pct)}</b> mujeres · <b className="text-foreground tabular-nums">{fmtPct(gd.male_pct)}</b> hombres</p>}
          </Card>
        </Reveal>
        <Reveal delay={0.05} className="h-full">
          <Card title="Gasto mensual en la mascota" icon={<Wallet />} fields={['avg_spend_monthly_soles', 'spend_bands', 'spend_mix']}>
            {isNum(CP.avg_spend_monthly_soles) && <div className="flex items-baseline gap-2"><span className="text-2xl font-semibold tabular-nums">S/ {fmtN(CP.avg_spend_monthly_soles)}</span><span className="text-xs text-muted-foreground">promedio · Lima 2026</span></div>}
            <HBars items={arr(CP.spend_bands)} />
            <div className="mt-auto"><Stack items={arr(CP.spend_mix)} /></div>
          </Card>
        </Reveal>
        <Reveal delay={0.1} className="h-full">
          <Card title="Mascota y vínculo" icon={<Heart />} fields={['pet_type', 'pets_per_household', 'family_member_pct', 'insured_pct']}>
            <Stack items={arr(CP.pet_type)} />
            <div className="mt-auto grid grid-cols-3 gap-2">
              <Mini label="mascotas por hogar" value={fmtN(CP.pets_per_household, 1)} />
              <Mini label="la considera familia" value={fmtPct(CP.family_member_pct)} />
              <Mini label="con seguro" value={fmtPct(CP.insured_pct)} />
            </div>
          </Card>
        </Reveal>
        <Reveal delay={0.15} className="h-full">
          <Card title="Qué valora al elegir" icon={<ThumbsUp />} fields={['values']}>
            <HBars items={arr(CP.values).sort((a, b) => b.pct - a.pct).slice(0, 6)} />
          </Card>
        </Reveal>
        <Reveal delay={0.2} className="h-full">
          <Card title="Qué le molesta" icon={<Frown />} fields={['complaints']}>
            <HBars items={complaints.map(c => ({ label: c.label, pct: c.neg_pct as number }))} color={COLORS.bad} hl={false}
              right={i => <span>{fmtPct(complaints[i].neg_pct)}<span className="ml-1 font-normal text-muted-foreground">n={fmtN(complaints[i].mentions)}</span></span>} />
            <p className="mt-auto text-[11px] text-muted-foreground">% de menciones negativas · fuente: nuestras reseñas</p>
          </Card>
        </Reveal>
        <Reveal delay={0.25} className="h-full">
          <Card title="Cómo llega y cuándo va" icon={<CalendarCheck />} fields={['channels', 'visit_reasons', 'visits_per_year']}>
            {channels.length > 0 && <div className="flex flex-wrap gap-1">{channels.map((c, i) => <span key={c.label} className={cn('rounded-md px-1.5 py-0.5 text-xs ring-1 ring-inset', i === 0 ? 'bg-teal-soft text-[#0F766E] ring-primary/20' : 'bg-muted text-slate-700 ring-slate-300/60')}>{c.label} <b className="tabular-nums">{fmtPct(c.pct)}</b></span>)}</div>}
            <HBars items={arr(CP.visit_reasons)} />
            {isNum(CP.visits_per_year) && <p className="mt-auto text-xs text-muted-foreground"><b className="text-base text-foreground tabular-nums">{fmtN(CP.visits_per_year)}</b> visitas clínicas al año</p>}
          </Card>
        </Reveal>
      </div>
      <p className="mt-3 px-1 text-[11px] text-muted-foreground">Fuentes: ESAN 2021 (n=384, NSE A/B), Clientes Anónimos 2026, INEI ENAHO 2025, Arellano; reseñas propias{nRev ? ` (${fmtN(nRev)})` : ''}.</p>
    </div>
  )
}
