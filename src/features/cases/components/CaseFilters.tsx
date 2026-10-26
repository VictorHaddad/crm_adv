import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PRACTICE_AREAS, CASE_PHASES, CASE_STATUSES } from '@/lib/constants'

export interface CaseFilterState {
  search: string
  area: string
  phase: string
  status: string
}

export const EMPTY_FILTERS: CaseFilterState = {
  search: '',
  area: 'all',
  phase: 'all',
  status: 'all',
}

interface CaseFiltersProps {
  value: CaseFilterState
  onChange: (next: CaseFilterState) => void
}

export function CaseFilters({ value, onChange }: CaseFiltersProps) {
  const set = (patch: Partial<CaseFilterState>) =>
    onChange({ ...value, ...patch })

  const hasActive =
    value.search !== '' ||
    value.area !== 'all' ||
    value.phase !== 'all' ||
    value.status !== 'all'

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative min-w-0 flex-1 sm:max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={value.search}
          onChange={(e) => set({ search: e.target.value })}
          placeholder="Buscar por caso, CNJ ou cliente..."
          className="pl-9"
          aria-label="Buscar casos"
        />
      </div>

      <div className="grid grid-cols-3 gap-2 sm:flex sm:gap-2">
        <Select value={value.area} onValueChange={(v) => set({ area: v })}>
          <SelectTrigger className="sm:w-40" aria-label="Filtrar por área">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as áreas</SelectItem>
            {PRACTICE_AREAS.map((a) => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={value.phase} onValueChange={(v) => set({ phase: v })}>
          <SelectTrigger className="sm:w-40" aria-label="Filtrar por fase">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as fases</SelectItem>
            {CASE_PHASES.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={value.status} onValueChange={(v) => set({ status: v })}>
          <SelectTrigger className="sm:w-36" aria-label="Filtrar por status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos status</SelectItem>
            {CASE_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasActive && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange(EMPTY_FILTERS)}
          className="text-muted-foreground"
        >
          <X className="h-4 w-4" /> Limpar
        </Button>
      )}
    </div>
  )
}
