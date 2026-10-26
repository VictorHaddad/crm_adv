import { CalendarClock, Scale, Wallet, Gavel } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { KpiCard } from '@/components/common/KpiCard'
import { RevenueChart } from '@/components/charts/RevenueChart'
import { RevenueByAreaChart } from '@/components/charts/RevenueByAreaChart'
import { WelcomeHero } from './components/WelcomeHero'
import { UrgentDeadlines } from './components/UrgentDeadlines'
import { HearingsTimeline } from './components/HearingsTimeline'
import { dashboardStats, currentMonthRevenue } from '@/data'
import { formatBRLCompact } from '@/lib/format'

export function DashboardPage() {
  const stats = dashboardStats()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Visão geral do escritório — prazos, casos, audiências e faturamento."
        actions={
          <Button variant="accent" className="hidden sm:inline-flex">
            Novo caso
          </Button>
        }
      />

      <WelcomeHero />

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          index={0}
          label="Prazos próximos (7 dias)"
          value={String(stats.deadlinesNext7)}
          hint={`${stats.fatalPending} classificados como fatais`}
          icon={CalendarClock}
          tone="critical"
        />
        <KpiCard
          index={1}
          label="Casos ativos"
          value={String(stats.activeCases)}
          hint={`${stats.totalCases} processos no total`}
          icon={Scale}
          tone="primary"
        />
        <KpiCard
          index={2}
          label="Faturamento do mês"
          value={formatBRLCompact(currentMonthRevenue.value)}
          trend={currentMonthRevenue.changePct}
          hint="Julho · parcial"
          icon={Wallet}
          tone="success"
        />
        <KpiCard
          index={3}
          label="Audiências da semana"
          value={String(stats.hearingsWeek)}
          hint="Próximos 7 dias"
          icon={Gavel}
          tone="accent"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Faturamento x Custas</CardTitle>
            <p className="text-sm text-muted-foreground">
              Honorários recebidos e despesas nos últimos 12 meses
            </p>
          </CardHeader>
          <CardContent>
            <RevenueChart />
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

      {/* Prazos + Compromissos */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <UrgentDeadlines />
        <HearingsTimeline />
      </div>
    </div>
  )
}
