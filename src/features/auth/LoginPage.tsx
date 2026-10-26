import { lazy, Suspense, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, type Variants } from 'framer-motion'
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
} from 'lucide-react'
import { Logo } from '@/components/layout/Logo'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'

// Carregada sob demanda para manter o three.js fora do bundle principal.
const LoginScene = lazy(() =>
  import('@/components/three/LoginScene').then((m) => ({
    default: m.LoginScene,
  })),
)

const fade: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.15 + i * 0.08,
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
}

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('helena.marques@marquesandrade.adv.br')
  const [password, setPassword] = useState('demo1234')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => navigate('/dashboard'), 900)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      {/* Painel de marca com cena 3D */}
      <div className="relative h-52 shrink-0 overflow-hidden bg-[#0A1622] sm:h-64 lg:h-auto lg:w-[54%]">
        <div className="absolute inset-0">
          <Suspense fallback={null}>
            <LoginScene />
          </Suspense>
        </div>
        {/* Vinhetas para legibilidade */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_80%_at_50%_20%,transparent,rgba(10,22,34,0.55))]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0A1622] to-transparent" />

        {/* Marca */}
        <div className="absolute left-6 top-6 lg:left-10 lg:top-10">
          <Logo />
        </div>

        {/* Citação — só desktop */}
        <div className="absolute inset-x-10 bottom-10 hidden lg:block">
          <motion.blockquote
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="max-w-md"
          >
            <p className="font-serif text-2xl font-medium leading-snug text-primary-foreground">
              “A justiça é a constante e perpétua vontade de dar a cada um o que
              é seu.”
            </p>
            <footer className="mt-3 text-sm text-primary-foreground/60">
              Ulpiano · Domício Ulpiano
            </footer>
          </motion.blockquote>
        </div>
      </div>

      {/* Painel do formulário */}
      <div className="relative flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
        <div className="absolute right-5 top-5">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-sm">
          <motion.div initial="hidden" animate="show" className="space-y-6">
            <motion.div custom={0} variants={fade}>
              <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">
                Acesse sua conta
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Bem-vindo(a) de volta. Entre para gerenciar seus casos, prazos e
                clientes.
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div custom={1} variants={fade} className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    placeholder="voce@escritorio.adv.br"
                    required
                  />
                </div>
              </motion.div>

              <motion.div custom={2} variants={fade} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <button
                    type="button"
                    className="text-xs font-medium text-accent transition-colors hover:text-accent-hover"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </motion.div>

              <motion.div
                custom={3}
                variants={fade}
                className="flex items-center gap-2 pt-1"
              >
                <Checkbox id="remember" defaultChecked />
                <Label
                  htmlFor="remember"
                  className="cursor-pointer font-normal text-muted-foreground"
                >
                  Manter-me conectado
                </Label>
              </motion.div>

              <motion.div custom={4} variants={fade}>
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin" /> Entrando...
                    </>
                  ) : (
                    'Entrar'
                  )}
                </Button>
              </motion.div>
            </form>

            <motion.div custom={5} variants={fade} className="space-y-4">
              <div className="flex items-center gap-3">
                <Separator className="flex-1" />
                <span className="text-xs text-muted-foreground">ou</span>
                <Separator className="flex-1" />
              </div>

              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => navigate('/dashboard')}
              >
                <ShieldCheck className="text-accent" /> Acessar com certificado
                digital
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                Protótipo de demonstração · dados fictícios. Clique em{' '}
                <strong className="font-medium text-foreground">Entrar</strong>{' '}
                para explorar.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
