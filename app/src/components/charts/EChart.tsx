import ReactEChartsCore from 'echarts-for-react/esm/core'
import type { EChartsOption } from 'echarts'
import { echarts } from '@/lib/echarts'

export function EChart({ option, height, onClick }: { option: EChartsOption; height: number; onClick?: (p: { data?: unknown; dataIndex?: number }) => void }) {
  const reduce = typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
  return (
    <ReactEChartsCore echarts={echarts} option={{ animation: !reduce, ...option }} notMerge lazyUpdate style={{ height, width: '100%' }}
      opts={{ renderer: 'canvas' }} onEvents={onClick ? { click: onClick } : undefined} />
  )
}
