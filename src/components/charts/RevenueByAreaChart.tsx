import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { revenueByArea } from '@/data/finance'
import { AREA_COLORS } from '@/lib/constants'
import { formatBRL, formatBRLCompact } from '@/lib/format'
import { useChartColors } from '@/hooks/useChartColors'
import type { PracticeArea } from '@/types'

function AreaTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: { payload: { area: string; valor: number } }[]
}) {
  if (!active || !payload?.length) return null
  const { area, valor } = payload[0].payload
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-pop">
      <p className="text-xs font-semibold text-foreground">{area}</p>
      <p className="text-xs tabular text-muted-foreground">{formatBRL(valor)}</p>
    </div>
  )
}

export function RevenueByAreaChart() {
  const c = useChartColors()

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={revenueByArea}
        layout="vertical"
        margin={{ top: 0, right: 12, left: 4, bottom: 0 }}
      >
        <XAxis
          type="number"
          hide
          tickFormatter={(v) => formatBRLCompact(v as number)}
        />
        <YAxis
          type="category"
          dataKey="area"
          tickLine={false}
          axisLine={false}
          width={82}
          tick={{ fill: c.muted, fontSize: 12 }}
        />
        <Tooltip content={<AreaTooltip />} cursor={{ fill: c.grid, opacity: 0.4 }} />
        <Bar dataKey="valor" radius={[0, 6, 6, 0]} barSize={16}>
          {revenueByArea.map((entry) => (
            <Cell
              key={entry.area}
              fill={AREA_COLORS[entry.area as PracticeArea]}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
