import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Building2,
  MapPin,
  Scale,
  CalendarDays,
  UserCog,
  Download,
  FileText,
  Users,
  FileSearch,
  Landmark,
} from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  CriticalityBadge,
  DeadlineStatusBadge,
} from '@/components/common/badges'
import { CaseTimeline } from './components/CaseTimeline'
import { caseById, clientById, deadlines } from '@/data'
import { formatBRL, formatDate, formatDateLong, countdownLabel } from '@/lib/format'
import type { Fee } from '@/types'

function MetaItem({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Scale
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface-muted text-muted-foreground">
        <Icon className="h-4 w-4" strokeWidth={1.75} />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <div className="mt-0.5 text-sm font-medium text-foreground">
          {children}
        </div>
      </div>
    </div>
  )
}

function feeStatusBadge(status: Fee['status']) {
  if (status === 'pago') return <Badge variant="success">Pago</Badge>
  if (status === 'atrasado') return <Badge variant="critical">Atrasado</Badge>
  return <Badge variant="warning">Pendente</Badge>
}

export function CaseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const legalCase = id ? caseById(id) : undefined

  if (!legalCase) {
    return (
      <div>
        <PageHeader title="Caso não encontrado" />
        <EmptyState
          icon={FileSearch}
          title="Este caso não existe"
          description="O processo que você procura pode ter sido removido."
          action={
            <Button asChild variant="outline">
              <Link to="/casos">Voltar para casos</Link>
            </Button>
          }
        />
      </div>
    )
  }

  const client = clientById(legalCase.clientId)
  const caseDeadlines = deadlines
    .filter((d) => d.caseId === legalCase.id)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

  const totalFees = legalCase.fees.reduce((s, f) => s + f.amount, 0)
  const receivedFees = legalCase.fees
    .filter((f) => f.status === 'pago')
    .reduce((s, f) => s + f.amount, 0)
  const pendingFees = totalFees - receivedFees

  return (
    <div className="space-y-6">
      {/* Voltar */}
      <Link
        to="/casos"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Casos
      </Link>

      {/* Cabeçalho */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <AreaBadge area={legalCase.area} />
          <PhaseBadge phase={legalCase.phase} />
          <CaseStatusBadge status={legalCase.status} />
        </div>
        <div>
          <h2 className="font-serif text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {legalCase.title}
          </h2>
          <p className="mt-1 font-mono text-sm text-muted-foreground tabular">
            {legalCase.cnj}
          </p>
        </div>
      </div>

      {/* Meta + Partes */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Dados do processo</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <MetaItem icon={Landmark} label="Vara / Juízo">
              {legalCase.court}
            </MetaItem>
            <MetaItem icon={MapPin} label="Comarca">
              {legalCase.district}
            </MetaItem>
            <MetaItem icon={Scale} label="Valor da causa">
              <span className="tabular">
                {legalCase.claimValue > 0
                  ? formatBRL(legalCase.claimValue)
                  : 'Inestimável'}
              </span>
            </MetaItem>
            <MetaItem icon={CalendarDays} label="Distribuído em">
              {formatDate(legalCase.distributedAt)}
            </MetaItem>
            <MetaItem icon={UserCog} label="Responsável">
              {legalCase.responsible}
            </MetaItem>
            <MetaItem icon={Building2} label="Cliente">
              {client ? (
                <Link
                  to="/clientes"
                  className="text-accent transition-colors hover:text-accent-hover"
                >
                  {client.name}
                </Link>
              ) : (
                '—'
              )}
            </MetaItem>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4 text-muted-foreground" /> Partes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {legalCase.parties.map((p, i) => (
              <div key={i} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {p.name}
                  </p>
                </div>
                <Badge variant="secondary" className="shrink-0">
                  {p.role}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Abas */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Tabs defaultValue="andamentos">
          <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
            <TabsTrigger value="andamentos">
              Andamentos
              <Badge variant="secondary" className="ml-1 px-1.5">
                {legalCase.events.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="documentos">
              Documentos
              <Badge variant="secondary" className="ml-1 px-1.5">
                {legalCase.documents.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="prazos">
              Prazos
              <Badge variant="secondary" className="ml-1 px-1.5">
                {caseDeadlines.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="honorarios">Honorários</TabsTrigger>
          </TabsList>

          {/* Andamentos */}
          <TabsContent value="andamentos">
            <Card>
              <CardContent className="pt-6">
                <CaseTimeline events={legalCase.events} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documentos */}
          <TabsContent value="documentos">
            <Card>
              <CardContent className="divide-y divide-border pt-2">
                {legalCase.documents.length === 0 ? (
                  <div className="py-6">
                    <EmptyState
                      icon={FileText}
                      title="Nenhum documento"
                      description="Ainda não há documentos anexados a este caso."
                    />
                  </div>
                ) : (
                  legalCase.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-3 py-3"
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-critical/10 text-critical">
                        <FileText className="h-5 w-5" strokeWidth={1.75} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {doc.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {doc.kind} · {(doc.sizeKB / 1024).toFixed(1)} MB ·{' '}
                          {formatDate(doc.uploadedAt)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Baixar ${doc.name}`}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Prazos */}
          <TabsContent value="prazos">
            <Card>
              <CardContent className="pt-6">
                {caseDeadlines.length === 0 ? (
                  <EmptyState
                    icon={CalendarDays}
                    title="Sem prazos vinculados"
                    description="Nenhum prazo cadastrado para este processo."
                  />
                ) : (
                  <ul className="divide-y divide-border">
                    {caseDeadlines.map((d) => (
                      <li
                        key={d.id}
                        className="flex flex-wrap items-center justify-between gap-3 py-3"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground">
                            {d.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDateLong(d.dueDate)} · {d.responsible}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <CriticalityBadge level={d.criticality} />
                          {d.status === 'pendente' ? (
                            <span className="text-xs font-medium text-muted-foreground">
                              {countdownLabel(d.dueDate)}
                            </span>
                          ) : (
                            <DeadlineStatusBadge status={d.status} />
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Honorários */}
          <TabsContent value="honorarios">
            <Card>
              <CardContent className="space-y-5 pt-6">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border border-border bg-surface-muted/50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Total
                    </p>
                    <p className="mt-1 font-serif text-xl font-semibold tabular text-foreground">
                      {formatBRL(totalFees)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-surface-muted/50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Recebido
                    </p>
                    <p className="mt-1 font-serif text-xl font-semibold tabular text-success">
                      {formatBRL(receivedFees)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-surface-muted/50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      A receber
                    </p>
                    <p className="mt-1 font-serif text-xl font-semibold tabular text-foreground">
                      {formatBRL(pendingFees)}
                    </p>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Descrição</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {legalCase.fees.map((f) => (
                      <TableRow key={f.id} className="hover:bg-transparent">
                        <TableCell className="font-medium text-foreground">
                          {f.description}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{f.type}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(f.dueDate)}
                        </TableCell>
                        <TableCell>{feeStatusBadge(f.status)}</TableCell>
                        <TableCell className="text-right font-medium tabular text-foreground">
                          {formatBRL(f.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
