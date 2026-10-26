import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, CalendarDays, MapPin, Users } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/common/EmptyState'
import { upcomingAppointments } from '@/data'
import { formatTime } from '@/lib/format'
import type { AppointmentType } from '@/types'

const typeTone: Record<AppointmentType, 'accent' | 'info' | 'warning' | 'secondary'> = {
  'Audiência': 'accent',
  'Reunião': 'info',
  'Prazo': 'warning',
  'Compromisso': 'secondary',
}

function DayChip({ date }: { date: Date }) {
  return (
    <div className="flex w-12 shrink-0 flex-col items-center rounded-lg border border-border bg-surface-muted py-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(date).replace('.', '')}
      </span>
      <span className="font-serif text-lg font-semibold leading-none text-foreground">
        {date.getDate()}
      </span>
    </div>
  )
}

export function HearingsTimeline() {
  const items = upcomingAppointments().slice(0, 5)

  return (
    <Card className="h-full">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Próximos compromissos</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Audiências, reuniões e prazos
          </p>
        </div>
        <Link
          to="/agenda"
          className="inline-flex items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent-hover"
        >
          Agenda <ArrowRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent className="pt-0">
        {items.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="Sem compromissos"
            description="Nenhum evento agendado para os próximos dias."
          />
        ) : (
          <ol className="space-y-2">
            {items.map((a, i) => {
              const start = new Date(a.start)
              return (
                <motion.li
                  key={a.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.3 }}
                  className="flex gap-3 rounded-lg p-2 transition-colors hover:bg-surface-muted"
                >
                  <DayChip date={start} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={typeTone[a.type]}>{a.type}</Badge>
                      <span className="text-xs font-medium tabular text-muted-foreground">
                        {formatTime(start)}
                        {a.end ? `–${formatTime(new Date(a.end))}` : ''}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-sm font-medium text-foreground">
                      {a.title}
                    </p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1 truncate">
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
                </motion.li>
              )
            })}
          </ol>
        )}
      </CardContent>
    </Card>
  )
}
