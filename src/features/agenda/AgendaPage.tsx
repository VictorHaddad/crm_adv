import { useMemo, useState } from 'react'
import { Plus, Gavel, Users, CalendarRange } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AgendaList } from './components/AgendaList'
import { AgendaCalendar } from './components/AgendaCalendar'
import { appointments, TODAY } from '@/data'
import { daysUntil } from '@/lib/format'
import { cn } from '@/lib/utils'

const startOfToday = new Date(
  TODAY.getFullYear(),
  TODAY.getMonth(),
  TODAY.getDate(),
)

function StatBox({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Gavel
  label: string
  value: number
  tone: string
}) {
  return (
    <Card className="flex items-center gap-3 p-4">
      <span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-lg', tone)}>
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <div>
        <p className="font-serif text-2xl font-semibold leading-none tabular text-foreground">
          {value}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{label}</p>
      </div>
    </Card>
  )
}

export function AgendaPage() {
  const [type, setType] = useState('all')

  const byType = useMemo(
    () =>
      type === 'all'
        ? appointments
        : appointments.filter((a) => a.type === type),
    [type],
  )

  const upcoming = useMemo(
    () =>
      byType.filter((a) => new Date(a.start).getTime() >= startOfToday.getTime()),
    [byType],
  )

  const stats = useMemo(() => {
    const up = appointments.filter(
      (a) => new Date(a.start).getTime() >= startOfToday.getTime(),
    )
    return {
      week: up.filter((a) => daysUntil(a.start, TODAY) <= 7).length,
      hearings: up.filter((a) => a.type === 'Audiência').length,
      meetings: up.filter((a) => a.type === 'Reunião').length,
    }
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agenda"
        description="Audiências, reuniões e compromissos da equipe."
        actions={
          <Button variant="accent">
            <Plus /> Novo compromisso
          </Button>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatBox icon={CalendarRange} label="Nos próximos 7 dias" value={stats.week} tone="text-accent bg-accent/10" />
        <StatBox icon={Gavel} label="Audiências agendadas" value={stats.hearings} tone="text-primary bg-primary/10 dark:text-accent dark:bg-accent/10" />
        <StatBox icon={Users} label="Reuniões agendadas" value={stats.meetings} tone="text-info bg-info/10" />
      </div>

      <Tabs defaultValue="agenda" className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="agenda">Agenda</TabsTrigger>
            <TabsTrigger value="mes">Mês</TabsTrigger>
          </TabsList>

          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="sm:w-48" aria-label="Filtrar por tipo">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="Audiência">Audiência</SelectItem>
              <SelectItem value="Reunião">Reunião</SelectItem>
              <SelectItem value="Prazo">Prazo</SelectItem>
              <SelectItem value="Compromisso">Compromisso</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="agenda" className="mt-0">
          <AgendaList items={upcoming} />
        </TabsContent>

        <TabsContent value="mes" className="mt-0">
          <AgendaCalendar items={byType} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
