import * as React from 'react'
import { flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef, type SortingState } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ChevronDown, ChevronLeft, ChevronRight, Download, Globe, Moon, Music2, Search, TriangleAlert, ChevronsUpDown } from 'lucide-react'
import { Facebook, Instagram } from '@/components/common/brand'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { GENERATED, NON_CLINICS } from '@/data/dash'
import type { Place } from '@/data/types'
import { fmtN, isNum, shortChain, shortD, slug, trunc } from '@/lib/format'
import type { Scope } from '@/lib/logic'
import { Insight, Panel, Pill, Reveal, Rich, Section, Stars } from '@/components/common/common'

const REP_ORDER: Record<string, number> = { Alta: 4, Media: 3, Baja: 2, 'Sin presencia': 1 }
const SEG_ORDER: Record<string, number> = { Premium: 3, Medio: 2, 'Económico': 1 }
const u = <T,>(v: T | null | undefined) => (v == null || (typeof v === 'number' && !Number.isFinite(v)) ? undefined : v)

function Badge24({ p }: { p: Place }) {
  if (p.is_24h) return <span className="inline-flex flex-col gap-0.5"><Pill tone="teal" icon={<Moon />}>24h</Pill>{!p.is_24h_google && <span className="text-[10px] text-muted-foreground">no figura en Google</span>}</span>
  if (p.is_24h_google) return <Pill tone="mid" icon={<TriangleAlert />} title="Google dice 24h pero sus canales indican horario limitado">solo Google</Pill>
  return <span className="text-muted-foreground">No</span>
}
function Social({ p }: { p: Place }) {
  const L: [string, React.ReactNode, string][] = []
  if (p.instagram) L.push([p.instagram, <Instagram />, `Instagram${isNum(p.instagram_followers) ? ` · ${fmtN(p.instagram_followers)} seguidores` : ''}`])
  if (p.facebook) L.push([p.facebook, <Facebook />, 'Facebook'])
  if (p.tiktok) L.push([p.tiktok, <Music2 />, 'TikTok'])
  if (p.website) L.push([p.website, <Globe />, 'Sitio web'])
  if (!L.length) return <span className="text-muted-foreground">—</span>
  return <span className="flex gap-1">{L.map(([href, ic, t]) => <a key={href + t} href={href} target="_blank" rel="noopener" title={t} aria-label={`${t} de ${p.name}`} onClick={e => e.stopPropagation()} className="grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-teal-soft hover:text-[#0F766E] [&>svg]:size-3.5">{ic}</a>)}</span>
}
function Detail({ p }: { p: Place }) {
  const revs = (p.reviews || []).filter(r => r.text).slice(0, 2)
  const serv = [...(p.services || []), ...(p.specialties || [])]
  return (
    <div className="grid gap-5 bg-slate-50/80 px-5 py-4 text-[13px] md:grid-cols-2">
      <div className="grid content-start gap-2.5">
        <div><div className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">Notas</div><p>{p.notes || <span className="text-muted-foreground">Sin notas de investigación.</span>}</p></div>
        {p.price_notes && <div><div className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">Precios</div><p>{p.price_notes}</p></div>}
        <div><div className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">Contacto</div><p>{p.address || '—'}{p.phone && <> · <a href={`tel:${String(p.phone).replace(/\s+/g, '')}`} className="text-[#0F766E]">{p.phone}</a></>}{isNum(p.founded_year) && <> · Fundada en {p.founded_year}</>}</p></div>
        {serv.length > 0 && <div className="flex flex-wrap gap-1">{serv.map(s => <Pill key={s}>{s}</Pill>)}</div>}
        {(p.hours || []).length > 0 && <div className="text-xs text-muted-foreground">{p.hours!.join(' · ')}</div>}
      </div>
      <div className="grid content-start gap-3">
        <div className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">Reseñas recientes</div>
        {revs.length ? revs.map((r, i) => <div key={i} className="rounded-lg border bg-white p-3"><div className="flex items-center gap-2"><Stars r={r.rating} size={11} /><span className="text-[11px] text-muted-foreground">{r.relative}</span></div><p className="mt-1 text-slate-700">{trunc(r.text, 320)}</p></div>) : <span className="text-muted-foreground">Sin reseñas con texto.</span>}
      </div>
    </div>
  )
}

export function Directory({ S }: { S: Scope }) {
  const [q, setQ] = React.useState('')
  const [only24, setOnly24] = React.useState(false)
  const [onlyEm, setOnlyEm] = React.useState(false)
  const [inclNon, setInclNon] = React.useState(false)
  const [chain, setChain] = React.useState<'all' | 'chain' | 'indep'>('all')
  const [minR, setMinR] = React.useState(0)
  const [sorting, setSorting] = React.useState<SortingState>([{ id: 'reviews_count', desc: true }])
  const [open, setOpen] = React.useState<Set<string>>(new Set())
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })

  const base = inclNon ? S.Pall : S.P
  const rows = React.useMemo(() => {
    const qq = q.trim().toLowerCase()
    return base.filter(p => (!qq || String(p.name || '').toLowerCase().includes(qq)) && (!only24 || p.is_24h) &&
      (!onlyEm || p.emergency === true || (p.is_24h === true && p.emergency !== false)) &&
      (chain === 'all' || (chain === 'chain' ? !!p.chain : !p.chain)) && (minR <= 0 || (isNum(p.rating) && p.rating >= minR)))
  }, [base, q, only24, onlyEm, chain, minR])
  React.useEffect(() => { setPagination(p => ({ ...p, pageIndex: 0 })); setOpen(new Set()) }, [S.district, q, only24, onlyEm, inclNon, chain, minR])

  const columns = React.useMemo<ColumnDef<Place>[]>(() => [
    { id: 'name', header: 'Nombre', accessorFn: p => (p.name || '').toLowerCase(), sortDescFirst: false, meta: { cls: 'min-w-56' },
      cell: ({ row }) => { const p = row.original; const o = open.has(p.id); return (
        <span className="flex items-start gap-2">
          <ChevronDown className={cn('mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform duration-200', o && 'rotate-180')} />
          <span className="min-w-0">
            {p.maps_url ? <a href={p.maps_url} target="_blank" rel="noopener" onClick={e => e.stopPropagation()} className="font-medium hover:text-[#0F766E] hover:underline">{p.name}</a> : <span className="font-medium">{p.name}</span>}
            <span className="mt-0.5 flex flex-wrap gap-1">{p.chain && <Pill tone="teal">{shortChain(p.chain)}</Pill>}{p.is_clinic === false && <Pill tone="bad" icon={<TriangleAlert />}>No es clínica</Pill>}<span className="text-[11px] text-muted-foreground md:hidden">{shortD(p.district)}</span></span>
          </span>
        </span>) } },
    { id: 'district', header: 'Distrito', accessorFn: p => p.district, sortDescFirst: false, meta: { cls: 'hidden md:table-cell whitespace-nowrap' }, cell: ({ row }) => shortD(row.original.district) },
    { id: 'rating', header: 'Rating', accessorFn: p => u(p.rating), sortUndefined: 'last', meta: { cls: 'whitespace-nowrap' }, cell: ({ row }) => <Stars r={row.original.rating} size={11} /> },
    { id: 'reviews_count', header: 'Reseñas', accessorFn: p => u(p.reviews_count), sortUndefined: 'last', meta: { cls: 'text-right tabular-nums', num: true }, cell: ({ row }) => fmtN(row.original.reviews_count) },
    { id: 'is_24h', header: '24h', accessorFn: p => (p.is_24h ? 2 : 0) + (p.is_24h_google ? 1 : 0), meta: { cls: 'hidden sm:table-cell' }, cell: ({ row }) => <Badge24 p={row.original} /> },
    { id: 'ticket', header: 'Ticket S/', accessorFn: p => u(p.ticket), sortUndefined: 'last', meta: { cls: 'hidden sm:table-cell text-right tabular-nums', num: true }, cell: ({ row }) => fmtN(row.original.ticket) },
    { id: 'consult_price', header: 'Consulta S/', accessorFn: p => u(p.consult_price), sortUndefined: 'last', meta: { cls: 'hidden lg:table-cell text-right tabular-nums', num: true }, cell: ({ row }) => fmtN(row.original.consult_price) },
    { id: 'social', header: 'Redes', enableSorting: false, meta: { cls: 'hidden lg:table-cell' }, cell: ({ row }) => <Social p={row.original} /> },
    { id: 'rep', header: 'Reputación', accessorFn: p => u(REP_ORDER[p.social_reputation || '']), sortUndefined: 'last', meta: { cls: 'hidden xl:table-cell' },
      cell: ({ row }) => { const r = row.original.social_reputation; return !r || r === 'Sin datos' ? <span className="text-muted-foreground">—</span> : <Pill tone={r === 'Alta' ? 'good' : r === 'Media' ? 'mid' : r === 'Baja' ? 'bad' : 'gray'}>{r}</Pill> } },
    { id: 'segment', header: 'Segmento', accessorFn: p => u(SEG_ORDER[p.segment || '']), sortUndefined: 'last', meta: { cls: 'hidden xl:table-cell' }, cell: ({ row }) => row.original.segment ? <Pill>{row.original.segment}</Pill> : <span className="text-muted-foreground">—</span> },
  ], [open])

  const table = useReactTable({ data: rows, columns, state: { sorting, pagination }, onSortingChange: setSorting, onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel(), getPaginationRowModel: getPaginationRowModel(), getRowId: r => r.id, autoResetPageIndex: false })

  const exportCSV = () => {
    const P = table.getSortedRowModel().rows.map(r => r.original)
    const cols: [string, (p: Place) => unknown][] = [['Nombre', p => p.name], ['Distrito', p => p.district], ['Es clínica', p => (p.is_clinic === false ? 'No' : 'Sí')], ['Dirección', p => p.address], ['Rating', p => p.rating], ['Reseñas', p => p.reviews_count],
      ['24h confirmado', p => (p.is_24h ? 'Sí' : 'No')], ['24h según Google', p => (p.is_24h_google ? 'Sí' : 'No')], ['Emergencias', p => (p.emergency === true ? 'Sí' : p.emergency === false ? 'No' : '')], ['Ticket S/', p => p.ticket], ['Base ticket', p => p.ticket_basis],
      ['Consulta S/', p => p.consult_price], ['Segmento', p => p.segment], ['Cadena', p => p.chain], ['Reputación social', p => (p.social_reputation === 'Sin datos' ? '' : p.social_reputation)],
      ['Teléfono', p => p.phone], ['Web', p => p.website], ['Instagram', p => p.instagram], ['Facebook', p => p.facebook], ['TikTok', p => p.tiktok],
      ['Servicios', p => (p.services || []).join('; ')], ['Especialidades', p => (p.specialties || []).join('; ')], ['Notas', p => p.notes], ['Google Maps', p => p.maps_url], ['Lat', p => p.lat], ['Lng', p => p.lng]]
    const cell = (v: unknown) => { if (v == null || (typeof v === 'number' && !Number.isFinite(v))) return ''; const s = String(v); return /[",;\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s }
    const csv = '﻿' + [cols.map(c => c[0]).join(','), ...P.map(p => cols.map(c => cell(c[1](p))).join(','))].join('\r\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    a.download = `vetclinica_${S.all ? 'todos' : slug(S.district)}_${GENERATED}.csv`
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove() }, 500)
    toast.success(`CSV descargado · ${fmtN(P.length)} clínicas`)
  }

  const hi = S.P.filter(p => isNum(p.rating) && p.rating >= 4.5).length
  const weakBig = S.P.filter(p => isNum(p.rating) && p.rating < 4 && (p.reviews_count || 0) >= 100).sort((a, b) => (b.reviews_count || 0) - (a.reviews_count || 0))
  const { pageIndex, pageSize } = pagination
  const from = rows.length ? pageIndex * pageSize + 1 : 0, to = Math.min(rows.length, (pageIndex + 1) * pageSize)
  const toggle = (id: string) => setOpen(s => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n })

  return (
    <Section id="directorio" n="10" eyebrow="Directorio completo" title="¿Quiénes son, uno por uno?"
      insight={<Insight><Rich text={`${fmtN(S.P.length)} clínicas en ${S.label}: ${fmtN(hi)} con 4.5★ o más y **${fmtN(S.lowRated)} bajo 4.0**.${weakBig.length ? ` Candidata a perder clientes: **${weakBig[0].name}** (${fmtN(weakBig[0].rating, 1)}★, ${fmtN(weakBig[0].reviews_count)} reseñas).` : ''}`} /></Insight>}>
      <Reveal>
        <Panel>
          <div className="grid gap-3 border-b p-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar clínica por nombre…" aria-label="Buscar por nombre" className="h-9 pl-9" />
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3 text-[13px]">
              <label className="flex cursor-pointer items-center gap-2"><Switch checked={only24} onCheckedChange={setOnly24} />Solo 24h</label>
              <label className="flex cursor-pointer items-center gap-2"><Switch checked={onlyEm} onCheckedChange={setOnlyEm} />Emergencias</label>
              {NON_CLINICS > 0 && <label className="flex cursor-pointer items-center gap-2"><Switch checked={inclNon} onCheckedChange={setInclNon} />Incluir no clínicas</label>}
              <Select value={chain} onValueChange={v => setChain(v as typeof chain)}>
                <SelectTrigger className="h-9 w-36" aria-label="Cadena o independiente"><SelectValue /></SelectTrigger>
                <SelectContent className="z-[1150]"><SelectItem value="all">Todas</SelectItem><SelectItem value="chain">Cadena</SelectItem><SelectItem value="indep">Independiente</SelectItem></SelectContent>
              </Select>
              <label className="flex items-center gap-2"><span className="text-muted-foreground">Rating mín.</span><Slider aria-label="Rating mínimo" min={0} max={5} step={0.1} value={[minR]} onValueChange={v => setMinR(v[0])} className="w-24" /><b className="w-7 tabular-nums">{fmtN(minR, 1)}</b></label>
              <Button onClick={exportCSV} className="h-9"><Download />CSV</Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <caption className="sr-only">Directorio de clínicas veterinarias</caption>
              <thead>
                {table.getHeaderGroups().map(hg => (
                  <tr key={hg.id} className="border-b bg-muted/50">
                    {hg.headers.map(h => { const m = h.column.columnDef.meta as { cls?: string; num?: boolean } | undefined; const s = h.column.getIsSorted(); return (
                      <th key={h.id} scope="col" aria-sort={s ? (s === 'asc' ? 'ascending' : 'descending') : undefined} className={cn('px-3 py-2.5 text-left text-xs font-medium whitespace-nowrap text-muted-foreground first:pl-5', m?.cls?.replace(/tabular-nums|whitespace-nowrap|min-w-56/g, ''), m?.num && 'text-right')}>
                        {h.column.getCanSort() ? (
                          <button type="button" onClick={h.column.getToggleSortingHandler()} className={cn('inline-flex items-center gap-1 rounded hover:text-foreground', s && 'text-foreground')}>
                            {flexRender(h.column.columnDef.header, h.getContext())}{s === 'asc' ? <ArrowUp className="size-3" /> : s === 'desc' ? <ArrowDown className="size-3" /> : <ChevronsUpDown className="size-3 opacity-40" />}
                          </button>
                        ) : flexRender(h.column.columnDef.header, h.getContext())}
                      </th>) })}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.length ? table.getRowModel().rows.map(row => (
                  <React.Fragment key={row.id}>
                    <tr onClick={() => toggle(row.id)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(row.id) } }} tabIndex={0} aria-expanded={open.has(row.id)}
                      className={cn('cursor-pointer border-b align-top transition-colors hover:bg-muted/40', open.has(row.id) && 'bg-teal-soft/50')}>
                      {row.getVisibleCells().map(c => { const m = c.column.columnDef.meta as { cls?: string } | undefined; return <td key={c.id} className={cn('px-3 py-2.5 first:pl-5', m?.cls)}>{flexRender(c.column.columnDef.cell, c.getContext())}</td> })}
                    </tr>
                    {open.has(row.id) && <tr className="border-b"><td colSpan={columns.length} className="p-0"><Detail p={row.original} /></td></tr>}
                  </React.Fragment>
                )) : <tr><td colSpan={columns.length} className="p-8 text-center text-muted-foreground">Ninguna clínica cumple los filtros. Prueba bajando el rating mínimo.</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t px-5 py-3 text-[13px]">
            <span className="text-muted-foreground">Mostrando <b className="text-foreground tabular-nums">{fmtN(from)}–{fmtN(to)}</b> de <b className="text-foreground tabular-nums">{fmtN(rows.length)}</b>{rows.length !== base.length && <> (de {fmtN(base.length)})</>}</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} aria-label="Página anterior"><ChevronLeft />Anterior</Button>
              <span className="tabular-nums text-muted-foreground">{fmtN(pageIndex + 1)} / {fmtN(Math.max(1, table.getPageCount()))}</span>
              <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} aria-label="Página siguiente">Siguiente<ChevronRight /></Button>
            </div>
          </div>
        </Panel>
      </Reveal>
    </Section>
  )
}
