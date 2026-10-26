import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  Briefcase,
  Scale,
  Wallet,
  UserSearch,
  ChevronRight,
  StickyNote,
} from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EmptyState } from '@/components/common/EmptyState'
import {
  AreaBadge,
  CaseStatusBadge,
  ClientTypeBadge,
} from '@/components/common/badges'
import { clientById, casesByClient } from '@/data'
import {
  formatCPF,
  formatCNPJ,
  formatBRL,
  formatDateLong,
  formatDate,
  initials,
} from '@/lib/format'
import { cn } from '@/lib/utils'

export function ClientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const client = id ? clientById(id) : undefined

  if (!client) {
    return (
      <div>
        <PageHeader title="Cliente não encontrado" />
        <EmptyState
          icon={UserSearch}
          title="Este cliente não existe"
          description="O cadastro que você procura pode ter sido removido."
          action={
            <Button asChild variant="outline">
              <Link to="/clientes">Voltar para clientes</Link>
            </Button>
          }
        />
      </div>
    )
  }

  const clientCases = casesByClient(client.id)
  const activeCases = clientCases.filter((c) => c.status === 'Ativo').length
  const totalClaim = clientCases.reduce((s, c) => s + c.claimValue, 0)
  const doc =
    client.type === 'PJ' ? formatCNPJ(client.document) : formatCPF(client.document)

  // Histórico: andamentos de todos os casos do cliente
  const history = clientCases
    .flatMap((c) =>
      c.events.map((e) => ({ ...e, caseTitle: c.title, caseId: c.id, caseCnj: c.cnj })),
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8)

  const stats = [
    { icon: Briefcase, label: 'Casos totais', value: String(clientCases.length), tone: 'text-primary bg-primary/10 dark:text-accent dark:bg-accent/10' },
    { icon: Scale, label: 'Casos ativos', value: String(activeCases), tone: 'text-success bg-success/10' },
    { icon: Wallet, label: 'Valor em causa', value: formatBRL(totalClaim), tone: 'text-accent bg-accent/10' },
  ]

  return (
    <div className="space-y-6">
      <Link
        to="/clientes"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Clientes
      </Link>

      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="text-lg">
            {initials(client.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="mb-1.5">
            <ClientTypeBadge type={client.type} />
          </div>
          <h2 className="font-serif text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {client.name}
          </h2>
          <p className="mt-1 font-mono text-sm text-muted-foreground tabular">
            {doc}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="flex items-center gap-3 p-4">
            <span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-lg', s.tone)}>
              <s.icon className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <div className="min-w-0">
              <p className="truncate font-serif text-xl font-semibold leading-none tabular text-foreground">
                {s.value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Coluna principal: abas */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="casos">
            <TabsList>
              <TabsTrigger value="casos">Casos vinculados</TabsTrigger>
              <TabsTrigger value="historico">Histórico</TabsTrigger>
            </TabsList>

            <TabsContent value="casos">
              {clientCases.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <EmptyState
                      icon={Briefcase}
                      title="Nenhum caso vinculado"
                      description="Este cliente ainda não possui processos cadastrados."
                    />
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {clientCases.map((c) => (
                    <Card key={c.id} className="overflow-hidden">
                      <Link
                        to={`/casos/${c.id}`}
                        className="group flex items-center gap-4 p-4 transition-colors hover:bg-surface-muted"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-foreground">
                            {c.title}
                          </p>
                          <p className="mt-0.5 font-mono text-xs text-muted-foreground tabular">
                            {c.cnj}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <AreaBadge area={c.area} />
                            <CaseStatusBadge status={c.status} />
                          </div>
                        </div>
                        <div className="hidden text-right sm:block">
                          <p className="text-xs text-muted-foreground">
                            Valor da causa
                          </p>
                          <p className="font-medium tabular text-foreground">
                            {c.claimValue > 0 ? formatBRL(c.claimValue) : '—'}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
                      </Link>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="historico">
              <Card>
                <CardContent className="pt-6">
                  {history.length === 0 ? (
                    <EmptyState
                      icon={StickyNote}
                      title="Sem histórico"
                      description="Nenhuma movimentação registrada para este cliente."
                    />
                  ) : (
                    <ol className="space-y-5">
                      {history.map((h, i) => (
                        <motion.li
                          key={`${h.caseId}-${h.id}`}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04, duration: 0.25 }}
                          className="relative flex gap-4"
                        >
                          <div className="flex flex-col items-center">
                            <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-accent" />
                            {i < history.length - 1 && (
                              <span className="mt-1 w-px flex-1 bg-border" />
                            )}
                          </div>
                          <div className="pb-1">
                            <p className="text-sm font-medium text-foreground">
                              {h.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDateLong(h.date)} · {h.caseTitle}
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {h.description}
                            </p>
                          </div>
                        </motion.li>
                      ))}
                    </ol>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar: contato + observações */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <a
                href={`mailto:${client.email}`}
                className="flex items-center gap-3 text-foreground transition-colors hover:text-accent"
              >
                <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{client.email}</span>
              </a>
              <div className="flex items-center gap-3 text-foreground">
                <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                {client.phone}
              </div>
              <div className="flex items-center gap-3 text-foreground">
                <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                {client.city}/{client.state}
              </div>
              <div className="flex items-center gap-3 text-foreground">
                <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
                Cliente desde {formatDate(client.since)}
              </div>

              {client.contacts && client.contacts.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Contatos adicionais
                    </p>
                    {client.contacts.map((ct, i) => (
                      <div key={i}>
                        <p className="text-sm font-medium text-foreground">
                          {ct.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {ct.email}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {ct.phone}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {client.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <StickyNote className="h-4 w-4 text-muted-foreground" />
                  Observações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {client.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
