import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  Scale,
  CalendarClock,
  Users,
  CalendarDays,
  Wallet,
  Settings,
} from 'lucide-react'

export interface NavItem {
  label: string
  to: string
  icon: LucideIcon
  /** Rota base para destaque de item ativo em sub-rotas. */
  match?: string
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Casos', to: '/casos', icon: Scale, match: '/casos' },
  { label: 'Prazos', to: '/prazos', icon: CalendarClock },
  { label: 'Clientes', to: '/clientes', icon: Users, match: '/clientes' },
  { label: 'Agenda', to: '/agenda', icon: CalendarDays },
  { label: 'Financeiro', to: '/financeiro', icon: Wallet },
  { label: 'Configurações', to: '/configuracoes', icon: Settings },
]

/** Título legível da página a partir do pathname. */
export function pageTitleFor(pathname: string): string {
  const item =
    NAV_ITEMS.find((i) => i.match && pathname.startsWith(i.match)) ??
    NAV_ITEMS.find((i) => i.to === pathname)
  return item?.label ?? 'Dashboard'
}
