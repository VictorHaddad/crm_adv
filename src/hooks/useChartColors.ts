import * as React from 'react'
import { useTheme } from '@/hooks/useTheme'

/** Lê um token CSS (HSL triplet) e devolve string hsl() utilizável em SVG/Recharts. */
function readToken(name: string, alpha?: number): string {
  if (typeof window === 'undefined') return '#000'
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim()
  if (!raw) return '#000'
  return alpha === undefined ? `hsl(${raw})` : `hsl(${raw} / ${alpha})`
}

/**
 * Resolve as cores dos tokens para uso em gráficos (Recharts trabalha com
 * valores concretos). Recalcula ao trocar de tema.
 */
export function useChartColors() {
  const { theme } = useTheme()

  return React.useMemo(
    () => ({
      accent: readToken('--accent'),
      accentSoft: readToken('--accent', 0.15),
      primary: readToken('--primary'),
      info: readToken('--info'),
      infoSoft: readToken('--info', 0.12),
      success: readToken('--success'),
      warning: readToken('--warning'),
      critical: readToken('--critical'),
      muted: readToken('--muted-foreground'),
      grid: readToken('--border'),
      surface: readToken('--surface'),
      foreground: readToken('--foreground'),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme],
  )
}
