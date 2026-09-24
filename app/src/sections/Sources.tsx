import * as React from 'react'
import { ChevronDown, FileText } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import { G, GENERATED, NON_CLINICS, PLACES, WEIGHTS } from '@/data/dash'
import { fmtN, isNum, sum } from '@/lib/format'
import { COMP, COMP_KEYS, FRIC_SCORE, ticketBasis } from '@/lib/logic'
import { Panel } from '@/components/common/common'

export function Sources() {
  const [open, setOpen] = React.useState(false)
  const nRev = sum(PLACES.map(p => (p.reviews || []).length))
  const TB = ticketBasis(PLACES)
  const f24 = PLACES.filter(p => p.is_24h_google && !p.is_24h).length
  const items: [string, string][] = [
    ['Clínicas', `${fmtN(PLACES.length)} clínicas veterinarias de Google Places${NON_CLINICS ? `; se excluyeron ${fmtN(NON_CLINICS)} lugares que no son clínicas (visibles en el directorio con el filtro)` : ''}. Ratings, reseñas y horarios según Google, corregidos con investigación web cuando se confirmó 24h.`],
    ...(G.search_cap_note || isNum(G.raw_places) ? [['Cobertura', `${G.search_cap_note || ''} ${isNum(G.raw_places) ? `La búsqueda devolvió ${fmtN(G.raw_places)} lugares` : ''}${isNum(G.excluded_neighbors) ? `; ${fmtN(G.excluded_neighbors)} de distritos vecinos excluidos` : ''}.`] as [string, string]] : []),
    ['24 horas', `“24h confirmado” usa la web y redes de cada clínica. Las ${fmtN(f24)} que dicen 24h en Google sin confirmarlo no cuentan como 24h.`],
    ['Demografía', 'Población y hogares: CPI 2025. NSE A/B: proxy INEI (Planos Estratificados 2020). Alquiler: mediana de avisos InfoCasas. Hogares con mascota: 59.6% Lima Metropolitana (INEI). “est.” = estimado.'],
    ['Regulación', 'TUPA e índices de usos (ordenanzas MML). Verde = clínica permitida en 2+ zonas; ámbar = 1 zona o no verificado; rojo = ninguna zona o tope de facto.'],
    ['Temas y citas', `Palabras clave sobre ${fmtN(nRev)} reseñas de muestra (hasta 5 por clínica). Positiva = 4–5 estrellas.`],
    ['Score', `Cada factor se normaliza de 20 (peor) a 100 (mejor) y se pondera: ${COMP_KEYS.map(k => `${COMP[k].name.toLowerCase()} ${fmtN((WEIGHTS[k] || 0) * 100)}%`).join(', ')}. Regulación: fricción baja ${FRIC_SCORE.Baja}, media ${FRIC_SCORE.Media}, alta ${FRIC_SCORE.Alta}. Sin datos = 50.`],
    ['Ticket', `Estimado. De ${fmtN(TB.n)} tickets, ${fmtN(TB.pub)} de precios publicados, ${fmtN(TB.rev)} de reseñas y ${fmtN(TB.seg)} por segmento.`],
  ]
  return (
    <section className="pt-4 pb-10">
      <Collapsible open={open} onOpenChange={setOpen}>
        <Panel>
          <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 px-5 py-4 text-left hover:bg-muted/40">
            <span className="flex items-center gap-2 text-sm font-semibold"><FileText className="size-4 text-primary" />Fuentes y metodología</span>
            <ChevronDown className={cn('size-4 transition-transform duration-200', open && 'rotate-180')} />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <dl className="grid gap-x-8 gap-y-3 border-t p-5 text-[13px] md:grid-cols-2">
              {items.map(([k, v]) => <div key={k}><dt className="font-semibold">{k}</dt><dd className="text-muted-foreground">{v}</dd></div>)}
              <p className="text-xs text-muted-foreground md:col-span-2">Datos generados el {GENERATED}. No constituye asesoría financiera ni legal; valide cifras críticas en campo antes de invertir.</p>
            </dl>
          </CollapsibleContent>
        </Panel>
      </Collapsible>
      <footer className="mt-6 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>VetClínica · Inteligencia de mercado · Datos al {GENERATED}</span>
        <span>Google Places + investigación web · Mapa © OpenFreeMap / Esri, OpenStreetMap</span>
      </footer>
    </section>
  )
}
