import { Link } from 'react-router-dom'
import { MapPin, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatTime } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { AppointmentType, Appointment } from '@/types'

export const APPOINTMENT_TONE: Record<
  AppointmentType,
  { badge: 'accent' | 'info' | 'warning' | 'secondary'; dot: string; bar: string }
> = {
  'Audiência': { badge: 'accent', dot: 'bg-accent', bar: 'bg-accent' },
  'Reunião': { badge: 'info', dot: 'bg-info', bar: 'bg-info' },
  'Prazo': { badge: 'warning', dot: 'bg-warning', bar: 'bg-warning' },
  'Compromisso': { badge: 'secondary', dot: 'bg-muted-foreground', bar: 'bg-border' },
}

export function AppointmentItem({ appointment: a }: { appointment: Appointment }) {
  const tone = APPOINTMENT_TONE[a.type]
  const start = new Date(a.start)

  return (
    <div className="relative flex gap-3 rounded-lg py-3 pl-4 pr-2 transition-colors hover:bg-surface-muted">
      <span
        className={cn('absolute inset-y-2 left-0 w-0.5 rounded-full', tone.bar)}
      />
      {/* Hora */}
      <div className="w-14 shrink-0 pt-0.5 text-right">
        <p className="text-sm font-semibold tabular text-foreground">
          {formatTime(start)}
        </p>
        {a.end && (
          <p className="text-xs tabular text-muted-foreground">
            {formatTime(new Date(a.end))}
          </p>
        )}
      </div>

      {/* Conteúdo */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={tone.badge}>{a.type}</Badge>
          {a.caseCnj && a.caseId && (
            <Link
              to={`/casos/${a.caseId}`}
              className="font-mono text-xs text-muted-foreground tabular transition-colors hover:text-accent"
            >
              {a.caseCnj}
            </Link>
          )}
        </div>
        <p className="mt-1 text-sm font-medium text-foreground">{a.title}</p>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3 shrink-0" /> {a.location}
          </span>
          {a.participants.length > 0 && (
            <span className="inline-flex items-center gap-1">
              <Users className="h-3 w-3 shrink-0" />
              {a.participants.length === 1
                ? a.participants[0]
                : `${a.participants.length} participantes`}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
