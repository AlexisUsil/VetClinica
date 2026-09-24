import * as echarts from 'echarts/core'
import { HeatmapChart, ScatterChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, VisualMapComponent, MarkAreaComponent, MarkLineComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
echarts.use([HeatmapChart, ScatterChart, GridComponent, TooltipComponent, VisualMapComponent, MarkAreaComponent, MarkLineComponent, CanvasRenderer])
export { echarts }

/** Estilo de tooltip de ECharts igual al TipCard de Recharts */
export const TIP = {
  backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderWidth: 1, padding: [8, 12],
  textStyle: { color: '#0F172A', fontFamily: 'Geist Variable, sans-serif', fontSize: 12 },
  extraCssText: 'border-radius:8px;box-shadow:0 10px 30px -10px rgba(15,23,42,.25);',
}
export const FONT = 'Geist Variable, ui-sans-serif, system-ui, sans-serif'
