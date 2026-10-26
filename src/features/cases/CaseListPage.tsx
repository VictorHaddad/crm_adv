import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, ChevronRight, FileSearch } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EmptyState } from '@/components/common/EmptyState'
import {
  AreaBadge,
  CaseStatusBadge,
  PhaseBadge,
} from '@/components/common/badges'
import {
  CaseFilters,
  EMPTY_FILTERS,
  type CaseFilterState,
} from './components/CaseFilters'
import { cases, clientById } from '@/data'
import { formatBRL } from '@/lib/format'

export function CaseListPage() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<CaseFilterState>(EMPTY_FILTERS)

  const rows = useMemo(() => {
    const q = filters.search.trim().toLowerCase()
    return cases
      .map((c) => ({ ...c, clientName: clientById(c.clientId)?.name ?? '—' }))
      .filter((c) => {
        if (filters.area !== 'all' && c.area !== filters.area) return false
        if (filters.phase !== 'all' && c.phase !== filters.phase) return false
        if (filters.status !== 'all' && c.status !== filters.status) return false
        if (q) {
          const hay = `${c.title} ${c.cnj} ${c.clientName}`.toLowerCase()
          if (!hay.includes(q)) return false
        }
        return true
      })
  }, [filters])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Casos"
        description="Processos e procedimentos do escritório."
        actions={
          <Button variant="accent">
            <Plus /> Novo caso
          </Button>
        }
      />

      <Card className="p-4">
        <CaseFilters value={filters} onChange={setFilters} />
      </Card>

      <div className="flex items-center justify-between px-1">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground tabular">
            {rows.length}
          </span>{' '}
          {rows.length === 1 ? 'caso encontrado' : 'casos encontrados'}
        </p>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={FileSearch}
          title="Nenhum caso encontrado"
          description="Ajuste os filtros ou limpe a busca para ver todos os processos."
          action={
            <Button variant="outline" onClick={() => setFilters(EMPTY_FILTERS)}>
              Limpar filtros
            </Button>
          }
        />
      ) : (
        <>
          {/* Tabela — desktop */}
          <Card className="hidden overflow-hidden lg:block">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Caso</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Área</TableHead>
                  <TableHead>Fase</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Valor da causa</TableHead>
                  <TableHead className="w-8" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((c) => (
                  <TableRow
                    key={c.id}
                    onClick={() => navigate(`/casos/${c.id}`)}
                    className="group cursor-pointer hover:bg-surface-muted"
                  >
                    <TableCell className="max-w-xs">
                      <p className="truncate font-medium text-foreground">
                        {c.title}
                      </p>
                      <p className="mt-0.5 font-mono text-xs text-muted-foreground tabular">
                        {c.cnj}
                      </p>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {c.clientName}
                    </TableCell>
                    <TableCell>
                      <AreaBadge area={c.area} />
                    </TableCell>
                    <TableCell>
                      <PhaseBadge phase={c.phase} />
                    </TableCell>
                    <TableCell>
                      <CaseStatusBadge status={c.status} />
                    </TableCell>
                    <TableCell className="text-right font-medium tabular text-foreground">
                      {c.claimValue > 0 ? formatBRL(c.claimValue) : '—'}
                    </TableCell>
                    <TableCell>
                      <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Cards — mobile/tablet */}
          <div className="space-y-3 lg:hidden">
            {rows.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.25 }}
              >
                <Card
                  onClick={() => navigate(`/casos/${c.id}`)}
                  className="cursor-pointer p-4 transition-colors hover:bg-surface-muted"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">
                        {c.title}
                      </p>
                      <p className="mt-0.5 font-mono text-xs text-muted-foreground tabular">
                        {c.cnj}
                      </p>
                    </div>
                    <CaseStatusBadge status={c.status} />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <AreaBadge area={c.area} />
                    <PhaseBadge phase={c.phase} />
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-sm">
                    <span className="truncate text-muted-foreground">
                      {c.clientName}
                    </span>
                    <span className="font-medium tabular text-foreground">
                      {c.claimValue > 0 ? formatBRL(c.claimValue) : '—'}
                    </span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
