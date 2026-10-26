import { Scale } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LogoProps {
  /** Oculta o wordmark (modo sidebar colapsada). */
  compact?: boolean
  className?: string
}

/** Marca do escritório: emblema dourado + wordmark serifado. */
export function Logo({ compact = false, className }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary text-accent ring-1 ring-accent/30 dark:bg-accent/10">
        <Scale className="h-5 w-5" strokeWidth={1.75} />
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-serif text-base font-semibold tracking-tight text-foreground">
            Marques & Andrade
          </span>
          <span className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Advocacia
          </span>
        </span>
      )}
    </div>
  )
}
