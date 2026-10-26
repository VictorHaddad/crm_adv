import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Search, MapPin, Briefcase, UsersRound } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { EmptyState } from '@/components/common/EmptyState'
import { ClientTypeBadge } from '@/components/common/badges'
import { clients, casesByClient } from '@/data'
import { formatCPF, formatCNPJ, initials } from '@/lib/format'

export function ClientListPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [type, setType] = useState('all')

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase()
    return clients.filter((c) => {
      if (type !== 'all' && c.type !== type) return false
      if (q) {
        const hay = `${c.name} ${c.document} ${c.city}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [search, type])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clientes"
        description="Pessoas físicas e jurídicas atendidas pelo escritório."
        actions={
          <Button variant="accent">
            <Plus /> Novo cliente
          </Button>
        }
      />

      {/* Filtros */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, documento ou cidade..."
            className="pl-9"
            aria-label="Buscar clientes"
          />
        </div>

        <Tabs value={type} onValueChange={setType}>
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="PF">Pessoa Física</TabsTrigger>
            <TabsTrigger value="PJ">Pessoa Jurídica</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <p className="px-1 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground tabular">{rows.length}</span>{' '}
        {rows.length === 1 ? 'cliente' : 'clientes'}
      </p>

      {rows.length === 0 ? (
        <EmptyState
          icon={UsersRound}
          title="Nenhum cliente encontrado"
          description="Ajuste a busca ou o filtro de tipo para ver mais resultados."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((c, i) => {
            const total = casesByClient(c.id).length
            const doc =
              c.type === 'PJ' ? formatCNPJ(c.document) : formatCPF(c.document)
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.28 }}
              >
                <Card
                  onClick={() => navigate(`/clientes/${c.id}`)}
                  className="group h-full cursor-pointer p-5 transition-all hover:-translate-y-0.5 hover:shadow-pop"
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-11 w-11">
                      <AvatarFallback>{initials(c.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-foreground">
                        {c.name}
                      </p>
                      <p className="mt-0.5 font-mono text-xs text-muted-foreground tabular">
                        {doc}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <ClientTypeBadge type={c.type} />
                  </div>

                  <div className="mt-4 space-y-1.5 border-t border-border pt-4 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 shrink-0" />
                      {c.city}/{c.state}
                    </p>
                    <p className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 shrink-0" />
                      {total} {total === 1 ? 'caso vinculado' : 'casos vinculados'}
                    </p>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
