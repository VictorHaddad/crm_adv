import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { PageLoader } from '@/components/common/PageLoader'

// Páginas carregadas sob demanda (code-splitting por rota).
const LoginPage = lazy(() =>
  import('@/features/auth/LoginPage').then((m) => ({ default: m.LoginPage })),
)
const DashboardPage = lazy(() =>
  import('@/features/dashboard/DashboardPage').then((m) => ({
    default: m.DashboardPage,
  })),
)
const CaseListPage = lazy(() =>
  import('@/features/cases/CaseListPage').then((m) => ({
    default: m.CaseListPage,
  })),
)
const CaseDetailPage = lazy(() =>
  import('@/features/cases/CaseDetailPage').then((m) => ({
    default: m.CaseDetailPage,
  })),
)
const DeadlinesPage = lazy(() =>
  import('@/features/deadlines/DeadlinesPage').then((m) => ({
    default: m.DeadlinesPage,
  })),
)
const ClientListPage = lazy(() =>
  import('@/features/clients/ClientListPage').then((m) => ({
    default: m.ClientListPage,
  })),
)
const ClientDetailPage = lazy(() =>
  import('@/features/clients/ClientDetailPage').then((m) => ({
    default: m.ClientDetailPage,
  })),
)
const AgendaPage = lazy(() =>
  import('@/features/agenda/AgendaPage').then((m) => ({ default: m.AgendaPage })),
)
const FinancePage = lazy(() =>
  import('@/features/finance/FinancePage').then((m) => ({
    default: m.FinancePage,
  })),
)
const SettingsPage = lazy(() =>
  import('@/features/settings/SettingsPage').then((m) => ({
    default: m.SettingsPage,
  })),
)

function lazyRoute(element: React.ReactNode) {
  return <Suspense fallback={<PageLoader />}>{element}</Suspense>
}

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/login', element: lazyRoute(<LoginPage />) },
  {
    element: <AppShell />,
    children: [
      { path: '/dashboard', element: lazyRoute(<DashboardPage />) },
      { path: '/casos', element: lazyRoute(<CaseListPage />) },
      { path: '/casos/:id', element: lazyRoute(<CaseDetailPage />) },
      { path: '/prazos', element: lazyRoute(<DeadlinesPage />) },
      { path: '/clientes', element: lazyRoute(<ClientListPage />) },
      { path: '/clientes/:id', element: lazyRoute(<ClientDetailPage />) },
      { path: '/agenda', element: lazyRoute(<AgendaPage />) },
      { path: '/financeiro', element: lazyRoute(<FinancePage />) },
      { path: '/configuracoes', element: lazyRoute(<SettingsPage />) },
    ],
  },
  { path: '*', element: <Navigate to="/dashboard" replace /> },
], {
  // Acompanha o `base` do Vite (ex.: /crm_adv/ no GitHub Pages).
  basename: import.meta.env.BASE_URL,
})
