import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { monthlyRevenue } from '@/data/finance'
import { formatBRL, formatBRLCompact } from '@/lib/format'
import { useChartColors } from '@/hooks/useChartColors'

interface TooltipEntry {
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
  payload?: TooltipEntry[]
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

export function RevenueChart() {
  const c = useChartColors()

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart
        data={monthlyRevenue}
        margin={{ top: 8, right: 8, left: 4, bottom: 0 }}
      >
        <defs>
          <linearGradient id="grad-faturamento" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c.accent} stopOpacity={0.35} />
            <stop offset="100%" stopColor={c.accent} stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="grad-custas" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c.info} stopOpacity={0.22} />
            <stop offset="100%" stopColor={c.info} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={c.grid}
          vertical={false}
        />
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
          cursor={{ stroke: c.grid, strokeWidth: 1 }}
        />
        <Area
          type="monotone"
          dataKey="custas"
          name="custas"
          stroke={c.info}
          strokeWidth={1.5}
          fill="url(#grad-custas)"
        />
        <Area
          type="monotone"
          dataKey="faturamento"
          name="faturamento"
          stroke={c.accent}
          strokeWidth={2.5}
          fill="url(#grad-faturamento)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
