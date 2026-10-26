import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PanelLeftClose, PanelLeftOpen, LogOut } from 'lucide-react'
import { NAV_ITEMS } from '@/app/nav'
import { Logo } from './Logo'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface SidebarProps {
  collapsed: boolean
  onToggleCollapse: () => void
  /** Fecha o drawer no mobile ao navegar. */
  onNavigate?: () => void
}

export function Sidebar({
  collapsed,
  onToggleCollapse,
  onNavigate,
}: SidebarProps) {
  return (
    <div className="flex h-full flex-col bg-surface">
      {/* Cabeçalho / marca */}
      <div
        className={cn(
          'flex h-16 items-center border-b border-border',
          collapsed ? 'justify-center px-2' : 'px-5',
        )}
      >
        <Logo compact={collapsed} />
      </div>

      {/* Navegação */}
      <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-thin p-3">
        {NAV_ITEMS.map((item) => {
          const link = (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  collapsed && 'justify-center px-0',
                  isActive
                    ? 'bg-primary/[0.06] text-foreground dark:bg-accent/10'
                    : 'text-muted-foreground hover:bg-surface-muted hover:text-foreground',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-active"
                      className="absolute inset-y-1.5 left-0 w-1 rounded-r-full bg-accent"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <item.icon
                    className={cn(
                      'h-5 w-5 shrink-0 transition-colors',
                      isActive ? 'text-accent' : 'text-muted-foreground group-hover:text-foreground',
                    )}
                    strokeWidth={1.75}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </>
              )}
            </NavLink>
          )

          return collapsed ? (
            <Tooltip key={item.to}>
              <TooltipTrigger asChild>{link}</TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          ) : (
            link
          )
        })}
      </nav>

      {/* Rodapé: colapsar + sair */}
      <div className="space-y-1 border-t border-border p-3">
        <button
          type="button"
          onClick={onNavigate}
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground',
            collapsed && 'justify-center px-0',
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" strokeWidth={1.75} />
          {!collapsed && <span>Sair</span>}
        </button>
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
          className={cn(
            'hidden w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground lg:flex',
            collapsed && 'justify-center px-0',
          )}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-5 w-5 shrink-0" strokeWidth={1.75} />
          ) : (
            <PanelLeftClose className="h-5 w-5 shrink-0" strokeWidth={1.75} />
          )}
          {!collapsed && <span>Recolher</span>}
        </button>
      </div>
    </div>
  )
}
