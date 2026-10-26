import { format, isSameDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarDays } from 'lucide-react'
import { AppointmentItem } from './AppointmentItem'
import { EmptyState } from '@/components/common/EmptyState'
import { TODAY } from '@/data'
import { daysUntil } from '@/lib/format'
import type { Appointment } from '@/types'

function dayLabel(date: Date): string {
  const n = daysUntil(date, TODAY)
  if (n === 0) return 'Hoje'
  if (n === 1) return 'Amanhã'
  return format(date, "EEEE", { locale: ptBR })
}

export function AgendaList({ items }: { items: Appointment[] }) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={CalendarDays}
        title="Nenhum compromisso"
        description="Não há eventos que correspondam aos filtros selecionados."
      />
    )
  }

  const sorted = [...items].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
  )

  // Agrupa por dia preservando a ordem
  const groups: { date: Date; items: Appointment[] }[] = []
  for (const a of sorted) {
    const d = new Date(a.start)
    const last = groups[groups.length - 1]
    if (last && isSameDay(last.date, d)) last.items.push(a)
    else groups.push({ date: d, items: [a] })
  }

  return (
    <div className="space-y-6">
      {groups.map((g) => {
        const isToday = isSameDay(g.date, TODAY)
        return (
          <section key={g.date.toISOString()} className="flex flex-col gap-2 sm:flex-row sm:gap-5">
            {/* Coluna da data */}
            <div className="flex shrink-0 items-center gap-3 sm:w-40 sm:flex-col sm:items-start sm:pt-3">
              <div
                className={
                  isToday
                    ? 'flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-accent text-accent-foreground'
                    : 'flex h-12 w-12 flex-col items-center justify-center rounded-lg border border-border bg-surface-muted text-foreground'
                }
              >
                <span className="font-serif text-lg font-semibold leading-none">
                  {format(g.date, 'd')}
                </span>
                <span className="text-[10px] font-medium uppercase">
                  {format(g.date, 'MMM', { locale: ptBR }).replace('.', '')}
                </span>
              </div>
              <div className="sm:mt-2">
                <p className="text-sm font-semibold capitalize text-foreground">
                  {dayLabel(g.date)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {g.items.length} {g.items.length === 1 ? 'evento' : 'eventos'}
                </p>
              </div>
            </div>

            {/* Eventos do dia */}
            <div className="flex-1 divide-y divide-border rounded-xl border border-border bg-card shadow-card">
              {g.items.map((a) => (
                <AppointmentItem key={a.id} appointment={a} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
