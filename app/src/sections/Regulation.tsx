import { ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DIST, RANK, byName } from '@/data/dash'
import { fmtN, fmtSoles, isNum, joinY } from '@/lib/format'
import { legalStatus, type Scope } from '@/lib/logic'
import { setDistrict } from '@/lib/store'
import { Insight, LegalPill, Panel, Pill, Reveal, Rich, Section } from '@/components/common/common'

export function Regulation({ S }: { S: Scope }) {
  const withReg = DIST.filter(d => d.regulation && Object.keys(d.regulation).length)
  let txt: string
  if (!withReg.length) txt = 'La investigación municipal está en curso; el score asigna fricción neutra (50/100).'
  else {
    const bad = withReg.filter(d => legalStatus(d).lvl === 'bad').map(d => d.district)
    const good = withReg.filter(d => legalStatus(d).lvl === 'good').map(d => d.district)
    txt = `No hay tope numérico: **el tope real es la zonificación**. En **${bad.length} de ${DIST.length} distritos** no se puede abrir una clínica nueva.` + (good.length ? ` ${joinY(good)} ${good.length > 1 ? 'son los únicos' : 'es el único'} con vía legal clara.` : '')
  }
  const fric = (f?: string | null) => <Pill tone={f === 'Baja' ? 'good' : f === 'Alta' ? 'bad' : f ? 'mid' : 'gray'}>{f ? `Fricción ${f.toLowerCase()}` : 'en curso'}</Pill>
  return (
    <Section id="regulacion" n="09" eyebrow="Regulación municipal" title="¿Qué tan difícil es abrir en cada municipio?" insight={<Insight><Rich text={txt} /></Insight>}>
      <Reveal>
        <Panel>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-[13px]">
              <thead><tr className="border-b bg-muted/50 text-xs text-muted-foreground">
                <th className="px-5 py-2.5 text-left font-medium">Distrito</th><th className="px-3 py-2.5 text-left font-medium">¿Clínica nueva?</th><th className="px-3 py-2.5 text-left font-medium">Fricción</th>
                <th className="px-3 py-2.5 text-right font-medium">Licencia medio / alto</th><th className="px-3 py-2.5 text-right font-medium">Plazo</th><th className="px-3 py-2.5 text-left font-medium">Zonas para clínica</th><th className="px-5 py-2.5 text-left font-medium">Fuentes</th>
              </tr></thead>
              <tbody>
                {RANK.map(n => { const d = byName(n)!; const r = d.regulation || {}; const z = (r.zoning_allowed || []).filter(Boolean); const srcs = (r.sources || []).filter(Boolean)
                  return (
                    <tr key={n} className={cn('border-b align-top last:border-0 hover:bg-muted/30', S.district === n && 'bg-teal-soft/60')}>
                      <th scope="row" className="px-5 py-3 text-left"><button type="button" onClick={() => setDistrict(n)} className="font-semibold hover:text-primary">{n}</button></th>
                      <td className="px-3 py-3">{Object.keys(r).length ? <LegalPill d={d} /> : <span className="text-muted-foreground">en investigación</span>}</td>
                      <td className="px-3 py-3">{fric(r.friction)}</td>
                      <td className="px-3 py-3 text-right tabular-nums">{fmtSoles(r.license_cost_soles)} / {fmtSoles(r.license_cost_high_risk_soles)}</td>
                      <td className="px-3 py-3 text-right tabular-nums">{isNum(r.license_days) ? `${fmtN(r.license_days)} d.h.` : '—'}</td>
                      <td className="max-w-72 px-3 py-3 text-muted-foreground">{z.length ? <span className="line-clamp-2" title={z.join('; ')}>{z.slice(0, 3).join('; ')}{z.length > 3 ? ` +${z.length - 3}` : ''}</span> : '—'}</td>
                      <td className="px-5 py-3 whitespace-nowrap">{srcs.slice(0, 3).map((u, i) => <a key={u} href={u} target="_blank" rel="noopener" title={u} className="mr-1.5 inline-grid size-6 place-items-center rounded bg-muted text-[11px] font-medium text-[#0F766E] hover:bg-teal-soft">{i + 1}</a>)}</td>
                    </tr>
                  ) })}
              </tbody>
            </table>
          </div>
          <p className="flex gap-2 border-t px-5 py-3 text-[13px] text-slate-600"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" /><span>Sin tope numérico ni distancia mínima en ningún distrito; manda el índice de usos. Pedir el <b className="font-semibold text-foreground">Certificado de Zonificación y Vías</b> del local antes de firmar.</span></p>
        </Panel>
      </Reveal>
    </Section>
  )
}
