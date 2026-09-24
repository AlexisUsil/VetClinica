import * as React from 'react'
import { motion } from 'motion/react'
import { Lightbulb, Star, Clock, Check, TriangleAlert, CircleX, Database } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { fmtN, isNum } from '@/lib/format'
import type { LegalLvl, Tone } from '@/lib/logic'
import { legalStatus, LEGAL_LABEL } from '@/lib/logic'
import type { District } from '@/data/types'

/** Texto con **negritas** */
export function Rich({ text, className }: { text: string; className?: string }) {
  const parts = String(text || '').split(/(\*\*[^*]+\*\*)/g)
  return <span className={className}>{parts.map((p, i) => p.startsWith('**') && p.endsWith('**') ? <strong key={i} className="font-semibold text-foreground">{p.slice(2, -2)}</strong> : <React.Fragment key={i}>{p}</React.Fragment>)}</span>
}

const TONE_CLS: Record<Tone, string> = {
  good: 'bg-good-soft text-good-ink ring-good/25',
  mid: 'bg-mid-soft text-mid-ink ring-mid/30',
  bad: 'bg-bad-soft text-bad-ink ring-bad/25',
  gray: 'bg-muted text-muted-foreground ring-slate-300/60',
  teal: 'bg-teal-soft text-[#0F766E] ring-primary/25',
  opp: 'bg-opp-soft text-opp-ink ring-opp/30',
}
export function Pill({ tone = 'gray', icon, children, className, title }: { tone?: Tone; icon?: React.ReactNode; children: React.ReactNode; className?: string; title?: string }) {
  return (
    <span title={title} className={cn('inline-flex max-w-full items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset whitespace-nowrap [&>svg]:size-3.5 [&>svg]:shrink-0', TONE_CLS[tone], className)}>
      {icon}{children}
    </span>
  )
}

export const LEGAL_ICON: Record<LegalLvl, React.ReactNode> = { good: <Check />, mid: <TriangleAlert />, bad: <CircleX />, na: <Clock /> }
export function LegalPill({ d, long, className }: { d: District | null; long?: boolean; className?: string }) {
  const L = legalStatus(d)
  return <Pill tone={L.lvl === 'na' ? 'gray' : L.lvl} icon={LEGAL_ICON[L.lvl]} className={className} title={L.txt}>{long ? L.txt : L.short}</Pill>
}
export function LegalDot({ lvl }: { lvl: LegalLvl }) {
  const c = lvl === 'good' ? 'bg-good' : lvl === 'mid' ? 'bg-mid' : lvl === 'bad' ? 'bg-bad' : 'bg-slate-400'
  return <span className={cn('inline-block size-2 shrink-0 rounded-full', c)} aria-label={`Semáforo legal ${LEGAL_LABEL[lvl]}`} />
}

export function Insight({ children, kicker = 'Lectura', tone = 'teal' }: { children: React.ReactNode; kicker?: string; tone?: 'teal' | 'opp' }) {
  return (
    <div className={cn('flex items-start gap-3 rounded-xl border bg-card px-4 py-3 shadow-xs', tone === 'opp' ? 'border-opp/30 bg-opp-soft/60' : 'border-primary/20 bg-teal-soft/70')}>
      <span className={cn('mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg', tone === 'opp' ? 'bg-opp text-white' : 'bg-primary text-white')}><Lightbulb className="size-4" /></span>
      <div className="min-w-0">
        <div className={cn('text-[11px] font-semibold tracking-wide uppercase', tone === 'opp' ? 'text-opp-ink' : 'text-[#0F766E]')}>{kicker}</div>
        <p className="text-[15px] leading-snug text-slate-700">{children}</p>
      </div>
    </div>
  )
}

export function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.08 }} transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}

export function Section({ id, n, eyebrow, title, insight, children, className }: { id: string; n: string; eyebrow: string; title: string; insight?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={cn('scroll-mt-32 py-10 md:py-14', className)} aria-labelledby={`${id}-h`}>
      <Reveal>
        <div className="mb-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            <span className="rounded-md bg-ink px-1.5 py-0.5 font-mono text-[11px] text-white tabular-nums">{n}</span>{eyebrow}
          </div>
          <h2 id={`${id}-h`} className="text-2xl font-semibold tracking-tight text-balance text-foreground md:text-[28px]">{title}</h2>
        </div>
        {insight && <div className="mb-6">{insight}</div>}
      </Reveal>
      {children}
    </section>
  )
}

export function Stars({ r, size = 14, showValue = true }: { r: number | null | undefined; size?: number; showValue?: boolean }) {
  if (!isNum(r)) return <span className="text-muted-foreground">—</span>
  const w = Math.max(0, Math.min(100, (r / 5) * 100))
  const row = (cls: string) => <span className={cn('flex', cls)}>{[0, 1, 2, 3, 4].map(i => <Star key={i} style={{ width: size, height: size }} className="shrink-0" fill="currentColor" strokeWidth={0} />)}</span>
  return (
    <span className="inline-flex items-center gap-1.5" role="img" aria-label={`${fmtN(r, 1)} de 5 estrellas`}>
      <span className="relative inline-flex">
        {row('text-slate-200')}
        <span className="absolute inset-0 overflow-hidden" style={{ width: `${w}%` }}>{row('text-amber-400')}</span>
      </span>
      {showValue && <b className="text-sm font-semibold tabular-nums">{fmtN(r, 1)}</b>}
    </span>
  )
}

export function Meter({ value, max = 100, color = 'var(--primary)', className, height = 8 }: { value: number | null | undefined; max?: number; color?: string; className?: string; height?: number }) {
  const w = isNum(value) && max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0
  return (
    <div className={cn('w-full overflow-hidden rounded-full bg-slate-100', className)} style={{ height }}>
      <motion.div className="h-full rounded-full" style={{ background: color }} initial={{ width: 0 }} whileInView={{ width: `${w}%` }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} />
    </div>
  )
}

export function Empty({ msg, icon }: { msg: string; icon?: React.ReactNode }) {
  return <div className="flex min-h-32 flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">{icon || <Database className="size-5" />}<div>{msg}</div></div>
}

export function Legend({ items, className }: { items: { color: string; label: string; ring?: boolean; line?: boolean; shape?: 'sq' | 'dot' }[]; className?: string }) {
  return (
    <div className={cn('flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground', className)}>
      {items.map((it, i) => (
        <span key={i} className="inline-flex items-center gap-1.5">
          {it.line ? <i className="inline-block h-0.5 w-4" style={{ background: it.color }} />
            : <i className={cn('inline-block size-2.5', it.shape === 'dot' ? 'rounded-full' : 'rounded-[3px]')} style={{ background: it.ring ? '#fff' : it.color, boxShadow: it.ring ? `inset 0 0 0 2px ${it.color}` : undefined }} />}
          {it.label}
        </span>
      ))}
    </div>
  )
}

/** Tarjeta de tooltip rica, compartida por Recharts y ECharts (HTML) */
export function TipCard({ title, rows, foot }: { title: React.ReactNode; rows: { k: React.ReactNode; v: React.ReactNode; color?: string; strong?: boolean }[]; foot?: React.ReactNode }) {
  return (
    <div className="min-w-44 max-w-72 rounded-lg border bg-popover px-3 py-2 text-xs shadow-lg">
      <div className="mb-1.5 font-semibold text-foreground">{title}</div>
      <div className="grid gap-1">
        {rows.map((r, i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-muted-foreground">{r.color && <i className="inline-block size-2 rounded-[2px]" style={{ background: r.color }} />}{r.k}</span>
            <span className={cn('tabular-nums text-foreground', r.strong && 'font-semibold')}>{r.v}</span>
          </div>
        ))}
      </div>
      {foot && <div className="mt-1.5 border-t pt-1.5 text-muted-foreground">{foot}</div>}
    </div>
  )
}
export function tipHTML(title: string, rows: [string, string, string?][], foot?: string) {
  const esc = (s: string) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string))
  return `<div style="font-family:var(--font-sans);font-size:12px;min-width:170px;max-width:280px"><div style="font-weight:600;color:#0F172A;margin-bottom:6px;white-space:normal">${esc(title)}</div>${rows.map(([k, v, c]) => `<div style="display:flex;justify-content:space-between;gap:16px;line-height:1.7"><span style="color:#5B6B7F;display:flex;align-items:center;gap:6px">${c ? `<i style="width:8px;height:8px;border-radius:2px;background:${c};display:inline-block"></i>` : ''}${esc(k)}</span><span style="color:#0F172A;font-variant-numeric:tabular-nums;font-weight:600">${esc(v)}</span></div>`).join('')}${foot ? `<div style="margin-top:6px;padding-top:6px;border-top:1px solid #E2E8F0;color:#5B6B7F;white-space:normal">${esc(foot)}</div>` : ''}</div>`
}

export function CardHead({ title, sub, action, className }: { title: React.ReactNode; sub?: React.ReactNode; action?: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-wrap items-start justify-between gap-2 px-5 pt-5', className)}>
      <div className="min-w-0">
        <h3 className="text-[15px] font-semibold tracking-tight text-foreground">{title}</h3>
        {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
      </div>
      {action}
    </div>
  )
}
/** Tarjeta base (shadcn Card) con sombra suave y sin padding vertical por defecto */
export function Panel({ children, className, ...rest }: React.ComponentProps<'div'>) {
  return <Card className={cn('min-w-0 gap-0 py-0 ring-0 border border-border shadow-[0_1px_2px_rgb(15_23_42/0.04),0_4px_16px_-8px_rgb(15_23_42/0.08)]', className)} {...rest}>{children}</Card>
}
