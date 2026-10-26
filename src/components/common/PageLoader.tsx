import { Loader2 } from 'lucide-react'

/** Fallback de carregamento para rotas com code-splitting. */
export function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-accent" aria-label="Carregando" />
    </div>
  )
}
