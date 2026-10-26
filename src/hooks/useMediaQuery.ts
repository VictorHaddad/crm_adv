import * as React from 'react'

/** Retorna true quando a media query casa. SSR-safe. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  React.useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/** Atalho: true em telas < 1024px (abaixo de desktop). */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 1023px)')
}
