import { Building2, Coins, MapPin, Moon, ShoppingBag, Star, Trees, Target, X } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { byName, isHighCell } from '@/data/dash'
import { fmtKm, fmtN, fmtPct, fmtSoles, isNum, trunc } from '@/lib/format'
import type { Analysis } from '@/lib/logic'
import { LegalPill, Meter, Pill } from '@/components/common/common'
import { cn } from '@/lib/utils'

function Stat({ icon, label, value, sub, className, accent }: { icon: React.ReactNode; label: string; value: React.ReactNode; sub?: React.ReactNode; className?: string; accent?: boolean }) {
  return (
    <div className={cn('rounded-lg border bg-white p-3', className)}>
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground [&>svg]:size-3.5">{icon}{label}</div>
      <div className={cn('mt-1 text-xl font-semibold tracking-tight tabular-nums', accent && 'text-good-ink')}>{value}</div>
      {sub && <div className="truncate text-[11px] text-muted-foreground">{sub}</div>}
    </div>
  )
}

export function ExplorePanel({ A, lat, lng, radius, onRadius, onClose }: { A: Analysis; lat: number; lng: number; radius: 1 | 2; onRadius: (r: 1 | 2) => void; onClose: () => void }) {
  const d = byName(A.district)
  const far = !!A.near24 && A.near24.d > 1.5
  const cs = A.cell?.score
  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold tracking-wide text-[#0F766E] uppercase">Explorar ubicación</div>
          <div className="text-xl font-semibold tracking-tight">{A.district || 'Fuera de los 5 distritos'}</div>
          <div className="font-mono text-[11px] text-muted-foreground tabular-nums">{fmtN(lat, 4)}, {fmtN(lng, 4)}</div>
        </div>
        <button type="button" onClick={onClose} className="inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-xs font-medium hover:bg-muted"><X className="size-3.5" />Salir</button>
      </div>

      <ToggleGroup type="single" variant="outline" value={String(radius)} onValueChange={v => v && onRadius(v === '2' ? 2 : 1)} className="w-full" aria-label="Radio de análisis">
        <ToggleGroupItem value="1" className="flex-1 data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-white">Radio 1 km</ToggleGroupItem>
        <ToggleGroupItem value="2" className="flex-1 data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-white">Radio 2 km</ToggleGroupItem>
      </ToggleGroup>

      {/* Score de celda */}
      <div className="rounded-xl border bg-gradient-to-br from-teal-soft to-white p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"><Target className="size-3.5" />Score de la celda (400 m)</span>
          {A.cell && (isHighCell(A.cell) ? <Pill tone="opp">top 20%</Pill> : isNum(A.cellPct) ? <Pill>mejor que {fmtPct(A.cellPct)}</Pill> : null)}
        </div>
        <div className="mt-1 flex items-baseline gap-1"><span className="text-4xl font-semibold tracking-tight tabular-nums">{isNum(cs) ? fmtN(cs) : '—'}</span><span className="text-sm text-muted-foreground">/100</span></div>
        <Meter value={isNum(cs) ? cs : 0} color={A.cell && isHighCell(A.cell) ? 'var(--opp)' : 'var(--primary)'} className="mt-2" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Stat icon={<Building2 />} label="Competidores 1 km" value={fmtN(A.n1)} />
        <Stat icon={<Building2 />} label="Competidores 2 km" value={fmtN(A.n2)} />
        <Stat icon={<Star />} label={`Rating prom. ${radius} km`} value={isNum(A.avgRating) ? fmtN(A.avgRating, 2) : '—'} />
        <Stat icon={<Coins />} label={`Ticket medio${A.tEst ? ' (est.)' : ''}`} value={isNum(A.avgTicket) ? fmtSoles(A.avgTicket) : '—'} />
        <Stat icon={<Moon />} label="24h más cercano" value={A.near24 ? fmtKm(A.near24.d) : '—'} sub={A.near24 ? trunc(A.near24.p.name, 40) : undefined} className="col-span-2" accent={far} />
        <Stat icon={<Trees />} label="Parques 500 m" value={fmtN(A.parks)} />
        <Stat icon={<ShoppingBag />} label="Petshops 500 m" value={fmtN(A.pets)} />
      </div>

      <div>
        <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold"><MapPin className="size-3.5 text-primary" />Share de reseñas · {radius} km</div>
        {A.share.length ? (
          <div className="grid gap-2.5">
            {A.share.map(s => (
              <div key={s.name}>
                <div className="mb-1 flex justify-between gap-2 text-xs"><span className="truncate">{s.name}{s.is24 ? ' · 24h' : ''}</span><b className="tabular-nums">{fmtPct(s.pct)}</b></div>
                <Meter value={Math.max(2, s.pct)} height={6} />
              </div>
            ))}
          </div>
        ) : <p className="text-sm text-muted-foreground">Sin clínicas en {radius} km.</p>}
      </div>
      {d && <div><LegalPill d={d} long /></div>}
      <p className="text-[11px] text-muted-foreground">Arrastra el pin para moverlo · Esc para salir</p>
    </div>
  )
}
