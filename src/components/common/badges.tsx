import { Badge } from '@/components/ui/badge'
import { AREA_COLORS, CRITICALITY_LABEL, CRITICALITY_TONE } from '@/lib/constants'
import type {
  Criticality,
  PracticeArea,
  CaseStatus,
  CasePhase,
  DeadlineStatus,
  ClientType,
} from '@/types'
import { cn } from '@/lib/utils'

/** Badge de área do direito com ponto colorido. */
export function AreaBadge({ area, className }: { area: PracticeArea; className?: string }) {
  return (
    <Badge variant="secondary" className={cn('gap-1.5', className)}>
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: AREA_COLORS[area] }}
      />
      {area}
    </Badge>
  )
}

/** Badge de criticidade de prazo (fatal/importante/normal). */
export function CriticalityBadge({ level }: { level: Criticality }) {
  const tone = CRITICALITY_TONE[level]
  return <Badge variant={tone}>{CRITICALITY_LABEL[level]}</Badge>
}

/** Ponto de criticidade (para listas densas). */
export function CriticalityDot({ level, className }: { level: Criticality; className?: string }) {
  const color =
    level === 'fatal'
      ? 'bg-critical'
      : level === 'importante'
        ? 'bg-warning'
        : 'bg-info'
  return (
    <span className={cn('inline-block h-2.5 w-2.5 rounded-full', color, className)} />
  )
}

export function CaseStatusBadge({ status }: { status: CaseStatus }) {
  const variant =
    status === 'Ativo' ? 'success' : status === 'Suspenso' ? 'warning' : 'secondary'
  return <Badge variant={variant}>{status}</Badge>
}

export function PhaseBadge({ phase }: { phase: CasePhase }) {
  return (
    <Badge variant="outline" className="font-normal text-muted-foreground">
      {phase}
    </Badge>
  )
}

export function ClientTypeBadge({ type }: { type: ClientType }) {
  return type === 'PJ' ? (
    <Badge variant="accent">Pessoa Jurídica</Badge>
  ) : (
    <Badge variant="info">Pessoa Física</Badge>
  )
}

export function DeadlineStatusBadge({ status }: { status: DeadlineStatus }) {
  return status === 'cumprido' ? (
    <Badge variant="success">Cumprido</Badge>
  ) : (
    <Badge variant="outline">Pendente</Badge>
  )
}
