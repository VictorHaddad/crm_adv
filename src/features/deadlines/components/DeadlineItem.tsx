import { motion } from 'framer-motion'
import { Checkbox } from '@/components/ui/checkbox'
import { CriticalityBadge } from '@/components/common/badges'
import { Badge } from '@/components/ui/badge'
import { TODAY } from '@/data'
import { countdownLabel, daysUntil, formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Deadline } from '@/types'

interface DeadlineItemProps {
  deadline: Deadline
  onToggle: (id: string) => void
  /** Layout compacto para o painel do calendário. */
  compact?: boolean
}

export function DeadlineItem({ deadline: d, onToggle, compact }: DeadlineItemProps) {
  const done = d.status === 'cumprido'
  const days = daysUntil(d.dueDate, TODAY)
  const overdue = !done && days < 0

  const tone =
    done
      ? 'text-success'
      : d.criticality === 'fatal'
        ? 'text-critical'
        : d.criticality === 'importante'
          ? 'text-warning'
          : 'text-muted-foreground'

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        'group relative flex items-start gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-surface-muted',
        !done &&
          d.criticality === 'fatal' &&
          'before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:rounded-full before:bg-critical',
      )}
    >
      <Checkbox
        checked={done}
        onCheckedChange={() => onToggle(d.id)}
        aria-label={done ? 'Reabrir prazo' : 'Marcar como cumprido'}
        className="mt-0.5"
      />

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            'text-sm font-medium',
            done ? 'text-muted-foreground line-through' : 'text-foreground',
          )}
        >
          {d.title}
        </p>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
          <span className="font-mono tabular">{d.caseCnj}</span>
          {!compact && (
            <>
              <span aria-hidden>·</span>
              <span>{d.area}</span>
              <span aria-hidden>·</span>
              <span>{d.responsible}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        {!compact && <CriticalityBadge level={d.criticality} />}
        {done ? (
          <Badge variant="success">Cumprido</Badge>
        ) : (
          <span className={cn('text-xs font-semibold tabular', tone)}>
            {countdownLabel(d.dueDate, TODAY)}
          </span>
        )}
        <span
          className={cn(
            'text-xs tabular',
            overdue ? 'text-critical/80' : 'text-muted-foreground',
          )}
        >
          {formatDate(d.dueDate)}
        </span>
      </div>
    </motion.div>
  )
}
