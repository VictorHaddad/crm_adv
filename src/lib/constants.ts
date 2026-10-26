import type {
  PracticeArea,
  CasePhase,
  CaseStatus,
  Criticality,
} from '@/types'

export const PRACTICE_AREAS: PracticeArea[] = [
  'Cível',
  'Trabalhista',
  'Tributário',
  'Penal',
  'Família',
  'Empresarial',
]

export const CASE_PHASES: CasePhase[] = [
  'Conhecimento',
  'Recursal',
  'Execução',
  'Arquivado',
]

export const CASE_STATUSES: CaseStatus[] = ['Ativo', 'Suspenso', 'Encerrado']

/** Cor de acento (classe utilitária) por área do direito — usada em badges/gráficos. */
export const AREA_COLORS: Record<PracticeArea, string> = {
  'Cível': 'hsl(205 54% 45%)',
  'Trabalhista': 'hsl(154 46% 40%)',
  'Tributário': 'hsl(42 48% 47%)',
  'Penal': 'hsl(3 60% 48%)',
  'Família': 'hsl(280 30% 52%)',
  'Empresarial': 'hsl(220 35% 40%)',
}

export const CRITICALITY_LABEL: Record<Criticality, string> = {
  fatal: 'Fatal',
  importante: 'Importante',
  normal: 'Normal',
}

/** Mapeia criticidade para token semântico de cor. */
export const CRITICALITY_TONE: Record<Criticality, 'critical' | 'warning' | 'info'> = {
  fatal: 'critical',
  importante: 'warning',
  normal: 'info',
}
