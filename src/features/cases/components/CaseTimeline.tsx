import type { LucideIcon } from 'lucide-react'
import {
  FileText,
  Gavel,
  Users,
  StickyNote,
  Megaphone,
  Paperclip,
} from 'lucide-react'
import { motion } from 'framer-motion'
import type { CaseEvent } from '@/types'
import { formatDateLong } from '@/lib/format'
import { cn } from '@/lib/utils'

const eventMeta: Record<
  CaseEvent['type'],
  { icon: LucideIcon; label: string; tone: string }
> = {
  peticao: { icon: FileText, label: 'Petição', tone: 'text-info bg-info/10' },
  decisao: { icon: Gavel, label: 'Decisão', tone: 'text-accent bg-accent/10' },
  audiencia: { icon: Users, label: 'Audiência', tone: 'text-primary bg-primary/10 dark:text-accent dark:bg-accent/10' },
  despacho: { icon: StickyNote, label: 'Despacho', tone: 'text-muted-foreground bg-surface-muted' },
  publicacao: { icon: Megaphone, label: 'Publicação', tone: 'text-warning bg-warning/10' },
  juntada: { icon: Paperclip, label: 'Juntada', tone: 'text-muted-foreground bg-surface-muted' },
}

export function CaseTimeline({ events }: { events: CaseEvent[] }) {
  const ordered = [...events].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  return (
    <ol className="relative space-y-6">
      {ordered.map((ev, i) => {
        const meta = eventMeta[ev.type]
        const isLast = i === ordered.length - 1
        return (
          <motion.li
            key={ev.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="relative flex gap-4"
          >
            {/* Linha vertical + ícone */}
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  'grid h-9 w-9 shrink-0 place-items-center rounded-full ring-4 ring-surface',
                  meta.tone,
                )}
              >
                <meta.icon className="h-4 w-4" strokeWidth={1.75} />
              </span>
              {!isLast && <span className="mt-1 w-px flex-1 bg-border" />}
            </div>

            {/* Conteúdo */}
            <div className={cn('pb-1', isLast ? '' : 'min-h-[3rem]')}>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <span className="text-sm font-semibold text-foreground">
                  {ev.title}
                </span>
                <span className="text-xs text-muted-foreground">
                  · {meta.label}
                </span>
              </div>
              <time className="text-xs text-muted-foreground">
                {formatDateLong(ev.date)}
              </time>
              <p className="mt-1 text-sm text-muted-foreground">
                {ev.description}
              </p>
            </div>
          </motion.li>
        )
      })}
    </ol>
  )
}
