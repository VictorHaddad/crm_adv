import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { CalendarClock, Scale } from 'lucide-react'
import { currentUser, dashboardStats, TODAY } from '@/data'

// Carregada sob demanda para manter o three.js fora do bundle principal.
const DashboardAura = lazy(() =>
  import('@/components/three/DashboardAura').then((m) => ({
    default: m.DashboardAura,
  })),
)

export function WelcomeHero() {
  const stats = dashboardStats()
  const firstName = currentUser.name.replace(/^Dra?\.\s*/, '').split(' ')[0]
  const today = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(TODAY)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-xl border border-border bg-primary text-primary-foreground shadow-card"
    >
      {/* Textura de fundo sutil */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_100%_0%,hsl(var(--accent)/0.18),transparent_55%)]" />

      {/* Cena 3D à direita */}
      <div className="pointer-events-none absolute right-0 top-1/2 hidden h-[240px] w-[320px] -translate-y-1/2 opacity-90 sm:block">
        <Suspense fallback={null}>
          <DashboardAura />
        </Suspense>
      </div>

      <div className="relative z-10 flex flex-col gap-6 p-6 md:p-8">
        <div>
          <p className="text-sm font-medium capitalize text-accent">{today}</p>
          <h2 className="mt-1 font-serif text-2xl font-semibold tracking-tight md:text-3xl">
            Bom dia, {firstName}.
          </h2>
          <p className="mt-2 max-w-md text-sm text-primary-foreground/70">
            Você tem{' '}
            <strong className="font-semibold text-primary-foreground">
              {stats.fatalPending} prazos fatais
            </strong>{' '}
            pendentes e{' '}
            <strong className="font-semibold text-primary-foreground">
              {stats.hearingsWeek} audiências
            </strong>{' '}
            nesta semana.
          </p>
        </div>

        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/10">
              <Scale className="h-5 w-5 text-accent" strokeWidth={1.75} />
            </span>
            <div>
              <p className="font-serif text-xl font-semibold leading-none tabular">
                {stats.activeCases}
              </p>
              <p className="mt-1 text-xs text-primary-foreground/60">
                casos ativos
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/10">
              <CalendarClock className="h-5 w-5 text-accent" strokeWidth={1.75} />
            </span>
            <div>
              <p className="font-serif text-xl font-semibold leading-none tabular">
                {stats.deadlinesNext7}
              </p>
              <p className="mt-1 text-xs text-primary-foreground/60">
                prazos em 7 dias
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
