import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, CalendarClock } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CriticalityDot } from '@/components/common/badges'
import { EmptyState } from '@/components/common/EmptyState'
import { pendingDeadlines, TODAY } from '@/data'
import { countdownLabel, daysUntil } from '@/lib/format'
import { cn } from '@/lib/utils'

export function UrgentDeadlines() {
  const items = pendingDeadlines().slice(0, 6)

  return (
    <Card className="h-full">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Prazos urgentes</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Ordenados por vencimento
          </p>
        </div>
        <Link
          to="/prazos"
          className="inline-flex items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent-hover"
        >
          Ver todos <ArrowRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent className="pt-0">
        {items.length === 0 ? (
          <EmptyState
            icon={CalendarClock}
            title="Nenhum prazo pendente"
            description="Todos os prazos estão em dia."
          />
        ) : (
          <ul className="divide-y divide-border">
            {items.map((d, i) => {
              const days = daysUntil(d.dueDate, TODAY)
              const overdue = days < 0
              const tone =
                d.criticality === 'fatal'
                  ? 'text-critical'
                  : d.criticality === 'importante'
                    ? 'text-warning'
                    : 'text-muted-foreground'
              return (
                <motion.li
                  key={d.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.3 }}
                >
                  <Link
                    to="/prazos"
                    className={cn(
                      'group -mx-2 flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-surface-muted',
                      d.criticality === 'fatal' &&
                        'relative before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:rounded-full before:bg-critical',
                    )}
                  >
                    <CriticalityDot level={d.criticality} className="mt-0.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {d.title}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {d.area} · {d.responsible}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className={cn('text-sm font-semibold tabular', tone)}>
                        {countdownLabel(d.dueDate, TODAY)}
                      </p>
                      <p
                        className={cn(
                          'text-xs',
                          overdue ? 'text-critical/80' : 'text-muted-foreground',
                        )}
                      >
                        {new Intl.DateTimeFormat('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                        }).format(new Date(d.dueDate))}
                      </p>
                    </div>
                  </Link>
                </motion.li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
