import { useMemo } from 'react'
import { TrendingUp, Wallet, Clock, AlertCircle } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { KpiCard } from '@/components/common/KpiCard'
import { CashFlowChart } from '@/components/charts/CashFlowChart'
import { RevenueByAreaChart } from '@/components/charts/RevenueByAreaChart'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  cases,
  receivables,
  monthlyRevenue,
  currentMonthRevenue,
  TODAY,
} from '@/data'
import type { Receivable } from '@/data/finance'
import { formatBRL, formatBRLCompact, formatDate, daysUntil } from '@/lib/format'
import type { Fee } from '@/types'

function receivableStatusBadge(status: Receivable['status']) {
  if (status === 'pago') return <Badge variant="success">Pago</Badge>
  if (status === 'atrasado') return <Badge variant="critical">Atrasado</Badge>
  return <Badge variant="warning">Pendente</Badge>
}

const FEE_TYPE_TONE: Record<Fee['type'], string> = {
  Contratual: 'bg-primary dark:bg-accent',
  'Êxito': 'bg-accent',
  'Sucumbência': 'bg-info',
  Custas: 'bg-warning',
}

export function FinancePage() {
  const totals = useMemo(() => {
    const open = receivables.filter((r) => r.status !== 'pago')
    const toReceive = open.reduce((s, r) => s + r.amount, 0)
    const overdue = receivables
      .filter((r) => r.status === 'atrasado')
      .reduce((s, r) => s + r.amount, 0)
    const yearRevenue = monthlyRevenue.reduce((s, m) => s + m.faturamento, 0)
    return { toReceive, overdue, yearRevenue }
  }, [])

  const feesByType = useMemo(() => {
    const map = new Map<Fee['type'], number>()
    for (const c of cases) {
      for (const f of c.fees) {
        map.set(f.type, (map.get(f.type) ?? 0) + f.amount)
      }
    }
    const entries = [...map.entries()].sort((a, b) => b[1] - a[1])
    const total = entries.reduce((s, [, v]) => s + v, 0)
    return { entries, total }
  }, [])

  const sortedReceivables = useMemo(
    () =>
      [...receivables].sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
      ),
    [],
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financeiro"
        description="Honorários, custas, contas a receber e fluxo de caixa do escritório."
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          index={0}
          label="Faturamento do mês"
          value={formatBRLCompact(currentMonthRevenue.value)}
          trend={currentMonthRevenue.changePct}
          hint="Julho · parcial"
          icon={Wallet}
          tone="success"
        />
        <KpiCard
          index={1}
          label="Faturamento (12 meses)"
          value={formatBRLCompact(totals.yearRevenue)}
          hint="Honorários recebidos"
          icon={TrendingUp}
          tone="primary"
        />
        <KpiCard
          index={2}
          label="Contas a receber"
          value={formatBRLCompact(totals.toReceive)}
          hint={`${receivables.filter((r) => r.status !== 'pago').length} lançamentos em aberto`}
          icon={Clock}
          tone="accent"
        />
        <KpiCard
          index={3}
          label="Em atraso"
          value={formatBRLCompact(totals.overdue)}
          hint="Requer cobrança"
          icon={AlertCircle}
          tone="critical"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Fluxo de caixa</CardTitle>
            <p className="text-sm text-muted-foreground">
              Faturamento, custas e resultado líquido nos últimos 12 meses
            </p>
          </CardHeader>
          <CardContent>
            <CashFlowChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Honorários por área</CardTitle>
            <p className="text-sm text-muted-foreground">Mês corrente</p>
          </CardHeader>
          <CardContent>
            <RevenueByAreaChart />
          </CardContent>
        </Card>
      </div>

      {/* Contas a receber + Honorários por tipo */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Contas a receber</CardTitle>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Total em aberto</p>
              <p className="font-serif text-lg font-semibold tabular text-foreground">
                {formatBRL(totals.toReceive)}
              </p>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Cliente / Descrição</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedReceivables.map((r) => {
                  const overdue = r.status !== 'pago' && daysUntil(r.dueDate, TODAY) < 0
                  return (
                    <TableRow key={r.id} className="hover:bg-surface-muted/50">
                      <TableCell className="max-w-xs">
                        <p className="truncate font-medium text-foreground">
                          {r.clientName}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {r.description}
                        </p>
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            overdue
                              ? 'text-sm font-medium tabular text-critical'
                              : 'text-sm tabular text-muted-foreground'
                          }
                        >
                          {formatDate(r.dueDate)}
                        </span>
                      </TableCell>
                      <TableCell>{receivableStatusBadge(r.status)}</TableCell>
                      <TableCell className="text-right font-medium tabular text-foreground">
                        {formatBRL(r.amount)}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Honorários por tipo</CardTitle>
            <p className="text-sm text-muted-foreground">
              Carteira total do escritório
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {feesByType.entries.map(([type, value]) => {
              const pct = Math.round((value / feesByType.total) * 100)
              return (
                <div key={type}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{type}</span>
                    <span className="tabular text-muted-foreground">
                      {formatBRL(value)}
                    </span>
                  </div>
                  <Progress
                    value={pct}
                    indicatorClassName={FEE_TYPE_TONE[type]}
                  />
                </div>
              )
            })}
            <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
              <span className="font-medium text-foreground">Total</span>
              <span className="font-serif text-base font-semibold tabular text-foreground">
                {formatBRL(feesByType.total)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
