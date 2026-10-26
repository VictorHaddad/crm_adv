import { useMemo, useState } from 'react'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, CalendarClock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DeadlineItem } from './DeadlineItem'
import { EmptyState } from '@/components/common/EmptyState'
import { TODAY } from '@/data'
import { formatDateLong } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Criticality, Deadline } from '@/types'

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

const dotColor: Record<Criticality, string> = {
  fatal: 'bg-critical',
  importante: 'bg-warning',
  normal: 'bg-info',
}

export function DeadlineCalendar({
  items,
  onToggle,
}: {
  items: Deadline[]
  onToggle: (id: string) => void
}) {
  const [cursor, setCursor] = useState(() => startOfMonth(TODAY))
  const [selected, setSelected] = useState<Date>(TODAY)

  const byDay = useMemo(() => {
    const map = new Map<string, Deadline[]>()
    for (const d of items) {
      const key = d.dueDate.slice(0, 10)
      const arr = map.get(key) ?? []
      arr.push(d)
      map.set(key, arr)
    }
    return map
  }, [items])

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 0 })
    const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 0 })
    return eachDayOfInterval({ start, end })
  }, [cursor])

  const selectedItems = (byDay.get(format(selected, 'yyyy-MM-dd')) ?? []).sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
  )

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Calendário */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-card lg:col-span-2">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-serif text-lg font-semibold capitalize text-foreground">
            {format(cursor, 'MMMM yyyy', { locale: ptBR })}
          </h3>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              aria-label="Mês anterior"
              onClick={() => setCursor((c) => addMonths(c, -1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCursor(startOfMonth(TODAY))
                setSelected(TODAY)
              }}
            >
              Hoje
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Próximo mês"
              onClick={() => setCursor((c) => addMonths(c, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {WEEKDAYS.map((w) => (
            <div
              key={w}
              className="pb-2 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            >
              {w}
            </div>
          ))}

          {days.map((day) => {
            const key = format(day, 'yyyy-MM-dd')
            const dayItems = byDay.get(key) ?? []
            const inMonth = isSameMonth(day, cursor)
            const isToday = isSameDay(day, TODAY)
            const isSelected = isSameDay(day, selected)

            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelected(day)}
                className={cn(
                  'relative flex aspect-square flex-col items-center gap-1 rounded-lg p-1.5 text-sm transition-colors sm:aspect-auto sm:min-h-[68px] sm:justify-start',
                  inMonth
                    ? 'text-foreground hover:bg-surface-muted'
                    : 'text-muted-foreground/40 hover:bg-surface-muted/50',
                  isSelected && 'bg-primary/[0.07] ring-1 ring-accent dark:bg-accent/10',
                )}
              >
                <span
                  className={cn(
                    'grid h-6 w-6 place-items-center rounded-full text-xs font-medium tabular',
                    isToday && 'bg-accent text-accent-foreground',
                  )}
                >
                  {format(day, 'd')}
                </span>
                {dayItems.length > 0 && (
                  <span className="flex items-center gap-0.5">
                    {dayItems.slice(0, 3).map((d) => (
                      <span
                        key={d.id}
                        className={cn(
                          'h-1.5 w-1.5 rounded-full',
                          d.status === 'cumprido'
                            ? 'bg-success/50'
                            : dotColor[d.criticality],
                        )}
                      />
                    ))}
                    {dayItems.length > 3 && (
                      <span className="text-[10px] font-medium text-muted-foreground">
                        +{dayItems.length - 3}
                      </span>
                    )}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Legenda */}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-border pt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-critical" /> Fatal
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-warning" /> Importante
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-info" /> Normal
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-success/50" /> Cumprido
          </span>
        </div>
      </div>

      {/* Painel do dia selecionado */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-card">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {isSameDay(selected, TODAY) ? 'Hoje' : 'Dia selecionado'}
        </p>
        <h3 className="mt-0.5 font-serif text-lg font-semibold capitalize text-foreground">
          {formatDateLong(selected)}
        </h3>

        <div className="mt-4">
          {selectedItems.length === 0 ? (
            <EmptyState
              icon={CalendarClock}
              title="Nenhum prazo"
              description="Não há prazos para este dia."
              className="py-8"
            />
          ) : (
            <div className="divide-y divide-border">
              {selectedItems.map((d) => (
                <DeadlineItem key={d.id} deadline={d} onToggle={onToggle} compact />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
