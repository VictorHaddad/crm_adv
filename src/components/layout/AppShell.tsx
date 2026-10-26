import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { pageTitleFor } from '@/app/nav'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'

const COLLAPSE_KEY = 'crm-adv-sidebar-collapsed'

export function AppShell() {
  const location = useLocation()
  const isMobile = useIsMobile()

  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem(COLLAPSE_KEY) === '1',
  )
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(COLLAPSE_KEY, collapsed ? '1' : '0')
  }, [collapsed])

  // Fecha o drawer ao trocar de rota / ao sair do mobile
  useEffect(() => setMobileOpen(false), [location.pathname])
  useEffect(() => {
    if (!isMobile) setMobileOpen(false)
  }, [isMobile])

  const title = pageTitleFor(location.pathname)

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar desktop */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 hidden border-r border-border transition-[width] duration-300 ease-out lg:block',
          collapsed ? 'w-[76px]' : 'w-64',
        )}
      >
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((c) => !c)}
        />
      </aside>

      {/* Drawer mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-primary/40 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-64 border-r border-border shadow-pop lg:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 38 }}
            >
              <Sidebar
                collapsed={false}
                onToggleCollapse={() => setCollapsed((c) => !c)}
                onNavigate={() => setMobileOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Conteúdo */}
      <div
        className={cn(
          'flex min-h-screen flex-col transition-[padding] duration-300 ease-out',
          collapsed ? 'lg:pl-[76px]' : 'lg:pl-64',
        )}
      >
        <Topbar title={title} onOpenMobileMenu={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto w-full max-w-[1400px]"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
