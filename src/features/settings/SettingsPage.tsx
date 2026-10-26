import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Sun, Moon, Monitor, Mail, UserPlus, MoreHorizontal } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTheme } from '@/hooks/useTheme'
import { firm, team } from '@/data'
import { formatCNPJ, initials } from '@/lib/format'
import { cn } from '@/lib/utils'

function Field({
  id,
  label,
  defaultValue,
  type = 'text',
}: {
  id: string
  label: string
  defaultValue: string
  type?: string
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} defaultValue={defaultValue} />
    </div>
  )
}

function FirmTab() {
  const [saved, setSaved] = useState(false)

  const save = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2200)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil do escritório</CardTitle>
        <p className="text-sm text-muted-foreground">
          Informações exibidas em documentos e comunicações.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field id="firm-name" label="Razão social" defaultValue={firm.name} />
          </div>
          <Field id="firm-cnpj" label="CNPJ" defaultValue={formatCNPJ(firm.cnpj)} />
          <Field id="firm-oab" label="Inscrição OAB" defaultValue={firm.oabFirm} />
          <div className="sm:col-span-2">
            <Field id="firm-address" label="Endereço" defaultValue={firm.address} />
          </div>
          <Field id="firm-phone" label="Telefone" defaultValue={firm.phone} />
          <Field id="firm-email" label="E-mail" type="email" defaultValue={firm.email} />
        </div>

        <div className="flex items-center gap-3 border-t border-border pt-5">
          <Button variant="accent" onClick={save}>
            {saved ? (
              <>
                <Check /> Salvo
              </>
            ) : (
              'Salvar alterações'
            )}
          </Button>
          <Button variant="ghost">Cancelar</Button>
        </div>
      </CardContent>
    </Card>
  )
}

function AppearanceTab() {
  const { theme, setTheme } = useTheme()

  const options = [
    { key: 'light', label: 'Claro', icon: Sun },
    { key: 'dark', label: 'Escuro', icon: Moon },
  ] as const

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tema</CardTitle>
          <p className="text-sm text-muted-foreground">
            Escolha a aparência do sistema. A preferência é salva neste
            navegador.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:max-w-md">
            {options.map((o) => {
              const active = theme === o.key
              return (
                <button
                  key={o.key}
                  type="button"
                  onClick={() => setTheme(o.key)}
                  className={cn(
                    'relative flex flex-col items-start gap-3 rounded-xl border p-4 text-left transition-all',
                    active
                      ? 'border-accent ring-1 ring-accent'
                      : 'border-border hover:border-muted-foreground/40',
                  )}
                >
                  {active && (
                    <span className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-accent text-accent-foreground">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                  )}
                  {/* Mini preview */}
                  <div
                    className={cn(
                      'flex h-16 w-full items-center gap-1.5 rounded-lg p-2',
                      o.key === 'dark'
                        ? 'bg-[#0F2130]'
                        : 'bg-[#F1F3F6] ring-1 ring-black/5',
                    )}
                  >
                    <span className="h-full w-1/3 rounded bg-[#0C2233]" />
                    <div className="flex-1 space-y-1.5">
                      <span className="block h-2 w-3/4 rounded bg-[#C9A24C]" />
                      <span
                        className={cn(
                          'block h-2 w-full rounded',
                          o.key === 'dark' ? 'bg-white/15' : 'bg-black/10',
                        )}
                      />
                      <span
                        className={cn(
                          'block h-2 w-5/6 rounded',
                          o.key === 'dark' ? 'bg-white/15' : 'bg-black/10',
                        )}
                      />
                    </div>
                  </div>
                  <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <o.icon className="h-4 w-4 text-accent" /> {o.label}
                  </span>
                </button>
              )
            })}
          </div>
          <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <Monitor className="h-3.5 w-3.5" />
            Animações reduzidas são respeitadas automaticamente conforme a
            preferência do sistema.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notificações</CardTitle>
          <p className="text-sm text-muted-foreground">
            Alertas sobre prazos e audiências.
          </p>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          {[
            { label: 'Prazos fatais próximos', desc: 'Avisar 3 dias antes do vencimento', on: true },
            { label: 'Novas audiências', desc: 'Ao designar data de audiência', on: true },
            { label: 'Resumo semanal por e-mail', desc: 'Toda segunda-feira, às 8h', on: false },
          ].map((n) => (
            <div key={n.label} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-foreground">{n.label}</p>
                <p className="text-xs text-muted-foreground">{n.desc}</p>
              </div>
              <Switch defaultChecked={n.on} aria-label={n.label} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function TeamTab() {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Equipe</CardTitle>
          <p className="text-sm text-muted-foreground">
            {team.filter((m) => m.active).length} membros ativos
          </p>
        </div>
        <Button variant="accent">
          <UserPlus /> Convidar
        </Button>
      </CardHeader>
      <CardContent className="divide-y divide-border pt-0">
        {team.map((m) => (
          <div key={m.id} className="flex items-center gap-3 py-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{initials(m.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium text-foreground">
                  {m.name}
                </p>
                {m.active ? (
                  <Badge variant="success">Ativo</Badge>
                ) : (
                  <Badge variant="secondary">Inativo</Badge>
                )}
              </div>
              <p className="truncate text-xs text-muted-foreground">
                {m.role}
                {m.oab ? ` · ${m.oab}` : ''}
              </p>
            </div>
            <a
              href={`mailto:${m.email}`}
              aria-label={`E-mail para ${m.name}`}
              className="hidden text-muted-foreground transition-colors hover:text-accent sm:block"
            >
              <Mail className="h-4 w-4" />
            </a>
            <Button variant="ghost" size="icon" aria-label="Mais opções">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Configurações"
        description="Perfil do escritório, aparência e equipe."
      />

      <Tabs defaultValue="escritorio">
        <TabsList>
          <TabsTrigger value="escritorio">Escritório</TabsTrigger>
          <TabsTrigger value="aparencia">Aparência</TabsTrigger>
          <TabsTrigger value="equipe">Equipe</TabsTrigger>
        </TabsList>

        <TabsContent value="escritorio">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <FirmTab />
          </motion.div>
        </TabsContent>
        <TabsContent value="aparencia">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <AppearanceTab />
          </motion.div>
        </TabsContent>
        <TabsContent value="equipe">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <TeamTab />
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
