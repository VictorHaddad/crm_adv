import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { monthlyRevenue } from '@/data/finance'
import { formatBRL, formatBRLCompact } from '@/lib/format'
import { useChartColors } from '@/hooks/useChartColors'

const data = monthlyRevenue.map((m) => ({
  ...m,
  liquido: m.faturamento - m.custas,
}))

interface Entry {
  name: string
  value: number
  color: string
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Entry[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-pop">
      <p className="mb-1.5 text-xs font-semibold text-foreground">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-xs">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="capitalize text-muted-foreground">{entry.name}</span>
          <span className="ml-auto font-medium tabular text-foreground">
            {formatBRL(entry.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

export function CashFlowChart() {
  const c = useChartColors()

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={data} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={c.grid} vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tick={{ fill: c.muted, fontSize: 12 }}
          dy={8}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: c.muted, fontSize: 12 }}
          tickFormatter={(v) => formatBRLCompact(v as number)}
          width={64}
        />
        <Tooltip
          content={<ChartTooltip />}
          cursor={{ fill: c.grid, opacity: 0.4 }}
        />
        <Bar
          dataKey="faturamento"
          name="faturamento"
          fill={c.accent}
          radius={[4, 4, 0, 0]}
          barSize={14}
        />
        <Bar
          dataKey="custas"
          name="custas"
          fill={c.info}
          fillOpacity={0.55}
          radius={[4, 4, 0, 0]}
          barSize={14}
        />
        <Line
          type="monotone"
          dataKey="liquido"
          name="líquido"
          stroke={c.success}
          strokeWidth={2.5}
          dot={{ r: 3, fill: c.success, strokeWidth: 0 }}
          activeDot={{ r: 5 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
