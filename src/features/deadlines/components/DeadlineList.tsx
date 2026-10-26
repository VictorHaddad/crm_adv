import { AnimatePresence } from 'framer-motion'
import { CalendarCheck } from 'lucide-react'
import { DeadlineItem } from './DeadlineItem'
import { EmptyState } from '@/components/common/EmptyState'
import { TODAY } from '@/data'
import { daysUntil } from '@/lib/format'
import type { Deadline } from '@/types'

interface Group {
  key: string
  label: string
  items: Deadline[]
}

function groupDeadlines(items: Deadline[]): Group[] {
  const pend = items.filter((d) => d.status === 'pendente')
  const done = items.filter((d) => d.status === 'cumprido')

  const overdue: Deadline[] = []
  const today: Deadline[] = []
  const week: Deadline[] = []
  const later: Deadline[] = []

  for (const d of pend) {
    const n = daysUntil(d.dueDate, TODAY)
    if (n < 0) overdue.push(d)
    else if (n === 0) today.push(d)
    else if (n <= 7) week.push(d)
    else later.push(d)
  }

  const byDate = (a: Deadline, b: Deadline) =>
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()

  return [
    { key: 'overdue', label: 'Vencidos', items: overdue.sort(byDate) },
    { key: 'today', label: 'Vencem hoje', items: today.sort(byDate) },
    { key: 'week', label: 'Próximos 7 dias', items: week.sort(byDate) },
    { key: 'later', label: 'Mais adiante', items: later.sort(byDate) },
    { key: 'done', label: 'Cumpridos', items: done.sort(byDate) },
  ].filter((g) => g.items.length > 0)
}

export function DeadlineList({
  items,
  onToggle,
}: {
  items: Deadline[]
  onToggle: (id: string) => void
}) {
  const groups = groupDeadlines(items)

  if (groups.length === 0) {
    return (
      <EmptyState
        icon={CalendarCheck}
        title="Nenhum prazo"
        description="Não há prazos que correspondam aos filtros selecionados."
      />
    )
  }

  return (
    <div className="space-y-6">
      {groups.map((g) => (
        <section key={g.key}>
          <div className="mb-1 flex items-center gap-2 px-2">
            <h3
              className={
                g.key === 'overdue'
                  ? 'text-sm font-semibold text-critical'
                  : 'text-sm font-semibold text-foreground'
              }
            >
              {g.label}
            </h3>
            <span className="rounded-full bg-surface-muted px-2 py-0.5 text-xs font-medium text-muted-foreground tabular">
              {g.items.length}
            </span>
          </div>
          <div className="divide-y divide-border">
            <AnimatePresence initial={false}>
              {g.items.map((d) => (
                <DeadlineItem key={d.id} deadline={d} onToggle={onToggle} />
              ))}
            </AnimatePresence>
          </div>
        </section>
      ))}
    </div>
  )
}
