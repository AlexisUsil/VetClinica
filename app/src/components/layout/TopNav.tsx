import * as React from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { Layers, MapPin, Printer } from 'lucide-react'
import { cn } from '@/lib/utils'
import { RANK, rankOf, byName } from '@/data/dash'
import { setDistrict, useDistrict, scrollToId } from '@/lib/store'
import { shortD } from '@/lib/format'
import { legalStatus } from '@/lib/logic'
import { LegalDot } from '@/components/common/common'

export const SECTIONS = [
  { id: 'mapa', l: 'Mapa' },
  { id: 'ranking', l: 'Ranking' },
  { id: 'mercado', l: 'Mercado' },
  { id: 'huecos', l: 'Huecos' },
  { id: 'competencia', l: 'Competencia' },
  { id: 'numeros', l: 'Números' },
  { id: 'horarios', l: 'Horarios' },
  { id: 'social', l: 'Escucha social' },
  { id: 'regulacion', l: 'Regulación' },
  { id: 'directorio', l: 'Directorio' },
]

function useActiveSection() {
  const [active, setActive] = React.useState<string>('hero')
  React.useEffect(() => {
    const els = ['hero', ...SECTIONS.map(s => s.id)].map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(ents => ents.forEach(en => { if (en.isIntersecting) setActive(en.target.id) }), { rootMargin: '-40% 0px -55% 0px' })
    els.forEach(e => io.observe(e))
    return () => io.disconnect()
  }, [])
  return active
}

export function TopNav() {
  const district = useDistrict()
  const active = useActiveSection()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 })
  const navRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const bar = navRef.current; if (!bar) return
    const a = bar.querySelector<HTMLElement>(`[data-nav="${active}"]`)
    if (a && bar.scrollWidth > bar.clientWidth) bar.scrollTo({ left: Math.max(0, a.offsetLeft - 16), behavior: 'smooth' })
  }, [active])

  const items = [{ v: 'all', t: 'Todos' }, ...RANK.map(n => ({ v: n, t: shortD(n) }))]
  return (
    <header className="no-print sticky top-0 z-[1100] border-b border-border/80 bg-white/85 backdrop-blur-md supports-[backdrop-filter]:bg-white/75">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 pt-2.5 sm:px-6">
        <button type="button" onClick={() => scrollToId('hero')} className="flex shrink-0 items-center gap-2 rounded-md font-semibold tracking-tight text-foreground" aria-label="Ir al inicio">
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-white shadow-sm"><MapPin className="size-4" /></span>
          <span className="hidden text-[15px] sm:inline">VetClínica <span className="font-normal text-muted-foreground">· Lima</span></span>
        </button>
        <nav ref={navRef} aria-label="Secciones" className="relative flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {SECTIONS.map((s, i) => (
            <button key={s.id} type="button" data-nav={s.id} onClick={() => scrollToId(s.id)} aria-current={active === s.id ? 'true' : undefined}
              className={cn('relative shrink-0 rounded-md px-2.5 py-1.5 text-[13px] font-medium whitespace-nowrap transition-colors duration-200',
                active === s.id ? 'text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}>
              {active === s.id && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-md bg-muted" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
              <span className="relative"><span className="mr-1 font-mono text-[10px] text-muted-foreground tabular-nums">{String(i + 1).padStart(2, '0')}</span>{s.l}</span>
            </button>
          ))}
        </nav>
        <button type="button" onClick={() => window.print()} className="hidden shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[13px] font-medium text-foreground transition-colors hover:bg-muted md:inline-flex" aria-label="Imprimir o guardar como PDF">
          <Printer className="size-4" />Imprimir
        </button>
      </div>
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 pt-2 pb-2.5 sm:px-6">
        <span className="hidden shrink-0 text-xs font-medium text-muted-foreground sm:inline">Distrito</span>
        <div role="radiogroup" aria-label="Seleccionar distrito" className="flex min-w-0 flex-1 gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map(it => {
            const on = district === it.v
            const r = it.v === 'all' ? 0 : rankOf(it.v)
            const lvl = it.v === 'all' ? null : legalStatus(byName(it.v)).lvl
            return (
              <button key={it.v} type="button" role="radio" aria-checked={on} onClick={() => setDistrict(it.v)}
                className={cn('relative inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-[13px] font-medium transition-colors duration-200',
                  on ? 'border-ink bg-ink text-white' : 'border-border bg-white text-slate-700 hover:border-slate-400')}>
                {it.v === 'all' ? <Layers className="size-3.5" /> : lvl && <LegalDot lvl={lvl} />}
                {it.t}
                {r > 0 && <span className={cn('rounded px-1 font-mono text-[10px] tabular-nums', r === 1 ? 'bg-opp text-white' : on ? 'bg-white/15 text-white' : 'bg-muted text-muted-foreground')}>#{r}</span>}
              </button>
            )
          })}
        </div>
        <button type="button" onClick={() => window.print()} className="inline-flex size-8 shrink-0 items-center justify-center rounded-md border text-foreground md:hidden" aria-label="Imprimir o guardar como PDF"><Printer className="size-4" /></button>
      </div>
      <motion.div className="absolute right-0 bottom-0 left-0 h-0.5 origin-left bg-primary" style={{ scaleX }} />
    </header>
  )
}
