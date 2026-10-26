import type { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface KpiCardProps {
  label: string
  value: string
  icon: LucideIcon
  /** Texto auxiliar sob o valor. */
  hint?: string
  /** Variação percentual (mostra seta e cor). */
  trend?: number
  /** Índice para stagger da animação de entrada. */
  index?: number
  /** Tom do ícone/realce. */
  tone?: 'accent' | 'primary' | 'critical' | 'success' | 'info'
}

const toneMap: Record<
  NonNullable<KpiCardProps['tone']>,
  { icon: string; ring: string }
> = {
  accent: { icon: 'text-accent', ring: 'bg-accent/10' },
  primary: { icon: 'text-primary dark:text-accent', ring: 'bg-primary/10 dark:bg-accent/10' },
  critical: { icon: 'text-critical', ring: 'bg-critical/10' },
  success: { icon: 'text-success', ring: 'bg-success/10' },
  info: { icon: 'text-info', ring: 'bg-info/10' },
}

export function KpiCard({
  label,
  value,
  icon: Icon,
  hint,
  trend,
  index = 0,
  tone = 'primary',
}: KpiCardProps) {
  const tones = toneMap[tone]
  const trendUp = (trend ?? 0) >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="group relative overflow-hidden p-5 transition-shadow hover:shadow-pop">
        <div className="flex items-start justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            {label}
          </span>
          <span
            className={cn(
              'grid h-10 w-10 place-items-center rounded-lg transition-transform group-hover:scale-105',
              tones.ring,
            )}
          >
            <Icon className={cn('h-5 w-5', tones.icon)} strokeWidth={1.75} />
          </span>
        </div>
        <div className="mt-3 flex items-end gap-2">
          <span className="font-serif text-3xl font-semibold tracking-tight text-foreground tabular">
            {value}
          </span>
          {typeof trend === 'number' && (
            <span
              className={cn(
                'mb-1 inline-flex items-center gap-0.5 text-xs font-semibold',
                trendUp ? 'text-success' : 'text-critical',
              )}
            >
              {trendUp ? (
                <ArrowUpRight className="h-3.5 w-3.5" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5" />
              )}
              {Math.abs(trend)}%
            </span>
          )}
        </div>
        {hint && (
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        )}
      </Card>
    </motion.div>
  )
}
