import { useMemo, useState } from 'react'
import { AlertTriangle, CalendarClock, CalendarCheck, ListTodo } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DeadlineList } from './components/DeadlineList'
import { DeadlineCalendar } from './components/DeadlineCalendar'
import { deadlines as seedDeadlines, TODAY } from '@/data'
import { daysUntil } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Deadline } from '@/types'

function StatBox({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof CalendarClock
  label: string
  value: number
  tone: 'critical' | 'warning' | 'info' | 'success'
}) {
  const toneMap = {
    critical: 'text-critical bg-critical/10',
    warning: 'text-warning bg-warning/10',
    info: 'text-info bg-info/10',
    success: 'text-success bg-success/10',
  }
  return (
    <Card className="flex items-center gap-3 p-4">
      <span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-lg', toneMap[tone])}>
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

export function DeadlinesPage() {
  const [items, setItems] = useState<Deadline[]>(() =>
    seedDeadlines.map((d) => ({ ...d })),
  )
  const [criticality, setCriticality] = useState('all')
  const [status, setStatus] = useState('all')

  const toggle = (id: string) =>
    setItems((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, status: d.status === 'cumprido' ? 'pendente' : 'cumprido' }
          : d,
      ),
    )

  const stats = useMemo(() => {
    const pend = items.filter((d) => d.status === 'pendente')
    return {
      fatal: pend.filter((d) => d.criticality === 'fatal').length,
      overdue: pend.filter((d) => daysUntil(d.dueDate, TODAY) < 0).length,
      week: pend.filter((d) => {
        const n = daysUntil(d.dueDate, TODAY)
        return n >= 0 && n <= 7
      }).length,
      done: items.filter((d) => d.status === 'cumprido').length,
    }
  }, [items])

  const filtered = useMemo(
    () =>
      items.filter((d) => {
        if (criticality !== 'all' && d.criticality !== criticality) return false
        if (status !== 'all' && d.status !== status) return false
        return true
      }),
    [items, criticality, status],
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Prazos"
        description="Controle de prazos processuais com criticidade e contagem regressiva."
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatBox icon={AlertTriangle} label="Fatais pendentes" value={stats.fatal} tone="critical" />
        <StatBox icon={CalendarClock} label="Vencidos" value={stats.overdue} tone="warning" />
        <StatBox icon={ListTodo} label="Próximos 7 dias" value={stats.week} tone="info" />
        <StatBox icon={CalendarCheck} label="Cumpridos" value={stats.done} tone="success" />
      </div>

      <Tabs defaultValue="lista" className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="lista">Lista</TabsTrigger>
            <TabsTrigger value="calendario">Calendário</TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-2 gap-2 sm:flex">
            <Select value={criticality} onValueChange={setCriticality}>
              <SelectTrigger className="sm:w-44" aria-label="Filtrar por criticidade">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toda criticidade</SelectItem>
                <SelectItem value="fatal">Fatal</SelectItem>
                <SelectItem value="importante">Importante</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="sm:w-40" aria-label="Filtrar por status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos status</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="cumprido">Cumprido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="lista" className="mt-0">
          <Card className="p-2 sm:p-4">
            <DeadlineList items={filtered} onToggle={toggle} />
          </Card>
        </TabsContent>

        <TabsContent value="calendario" className="mt-0">
          <DeadlineCalendar items={filtered} onToggle={toggle} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
