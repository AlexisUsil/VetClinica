import * as React from 'react'
import NumberFlow, { type Format } from '@number-flow/react'
import { useInView } from 'motion/react'
import { Area, AreaChart, Bar, BarChart, Cell, ResponsiveContainer, YAxis } from 'recharts'
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { isNum } from '@/lib/format'
import { Panel } from './common'

export interface Delta { v: number | null; label: string; goodWhen?: 'up' | 'down' | 'none'; fmt?: (v: number) => string }

export function DeltaChip({ delta }: { delta: Delta }) {
  if (!isNum(delta.v)) return <span className="text-xs text-muted-foreground">{delta.label}</span>
  const up = delta.v > 0.0001, down = delta.v < -0.0001
  const good = delta.goodWhen === 'none' ? null : delta.goodWhen === 'down' ? down : up
  const tone = !up && !down ? 'text-muted-foreground bg-muted' : good === null ? 'text-slate-700 bg-muted' : good ? 'text-good-ink bg-good-soft' : 'text-bad-ink bg-bad-soft'
  const Icon = up ? ArrowUpRight : down ? ArrowDownRight : Minus
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
      <span className={cn('inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-medium tabular-nums', tone)}>
        <Icon className="size-3" />{delta.fmt ? delta.fmt(Math.abs(delta.v)) : Math.abs(delta.v).toFixed(1)}
      </span>
      {delta.label}
    </span>
  )
}

export interface SparkSpec { type: 'area' | 'bar'; data: number[]; highlight?: number | null; color?: string }
export function Spark({ spec, height = 40 }: { spec: SparkSpec; height?: number }) {
  const data = spec.data.map((v, i) => ({ i, v: isNum(v) ? v : 0 }))
  const color = spec.color || 'var(--primary)'
  const gid = 'sg' + React.useId().replace(/[^a-zA-Z0-9]/g, '')
  if (!data.length) return null
  return (
    <div style={{ height }} className="w-full" aria-hidden>
      <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 120, height }}>
        {spec.type === 'area' ? (
          <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis hide domain={[0, 'dataMax']} />
            <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.75} fill={`url(#${gid})`} isAnimationActive={false} dot={false} />
          </AreaChart>
        ) : (
          <BarChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }} barCategoryGap={3}>
            <YAxis hide domain={[0, 'dataMax']} />
            <Bar dataKey="v" radius={[2, 2, 0, 0]} isAnimationActive={false}>
              {data.map((_d, i) => <Cell key={i} fill={spec.highlight == null || spec.highlight === i ? color : '#CBD5E1'} />)}
            </Bar>
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}

export function KpiCard({ icon, label, value, format, suffix, prefix, sub, delta, spark, tag, soft, tone }: {
  icon: React.ReactNode; label: string; value: number | null; format?: Format; suffix?: string; prefix?: string
  sub?: React.ReactNode; delta?: Delta; spark?: SparkSpec; tag?: React.ReactNode; soft?: string; tone?: 'pos' | 'neg'
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const seen = useInView(ref, { once: true, amount: 0.3 })
  return (
    <Panel ref={ref} className="h-full p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2 text-[13px] font-medium text-muted-foreground">
          <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-teal-soft text-[#0F766E] [&>svg]:size-4">{icon}</span>
          <span className="truncate">{label}</span>
        </div>
        {tag}
      </div>
      <div className={cn('mt-3 flex items-baseline gap-1 text-[32px] leading-none font-semibold tracking-[-0.02em] tabular-nums sm:text-[36px]', tone === 'neg' ? 'text-bad-ink' : tone === 'pos' ? 'text-good-ink' : 'text-foreground')}>
        {isNum(value) ? (
          <>
            {prefix && <span className="text-xl font-medium text-muted-foreground">{prefix}</span>}
            <NumberFlow value={seen ? value : 0} format={format} locales="es-PE" willChange />
            {suffix && <span className="text-lg font-medium text-muted-foreground">{suffix}</span>}
          </>
        ) : <span className="text-xl font-medium text-muted-foreground">{soft || '—'}</span>}
      </div>
      <div className="mt-2 flex min-h-5 flex-wrap items-center gap-2">
        {delta ? <DeltaChip delta={delta} /> : null}
        {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
      </div>
      {spark && <div className="mt-auto pt-3"><Spark spec={spark} /></div>}
    </Panel>
  )
}
