import { cases } from './cases'
import { deadlines } from './deadlines'
import { appointments } from './appointments'
import { clients } from './clients'
import { daysUntil } from '@/lib/format'
import type { Deadline } from '@/types'

export { cases, caseById } from './cases'
export { clients, clientById } from './clients'
export { deadlines } from './deadlines'
export { appointments } from './appointments'
export { firm, team, currentUser } from './firm'
export * from './finance'

/** Data de referência do protótipo. */
export const TODAY = new Date('2026-07-03T09:00:00')

/** Casos vinculados a um cliente. */
export function casesByClient(clientId: string) {
  return cases.filter((c) => c.clientId === clientId)
}

/** Prazos pendentes ordenados por vencimento (mais urgente primeiro). */
export function pendingDeadlines(): Deadline[] {
  return deadlines
    .filter((d) => d.status === 'pendente')
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    )
}

/** Prazos que vencem nos próximos N dias (inclui vencidos ainda pendentes). */
export function deadlinesWithin(days: number): Deadline[] {
  return pendingDeadlines().filter((d) => daysUntil(d.dueDate, TODAY) <= days)
}

/** Compromissos futuros ordenados por data. */
export function upcomingAppointments() {
  return [...appointments]
    .filter((a) => new Date(a.start).getTime() >= TODAY.getTime())
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
}

/** Audiências dentro da semana (próximos 7 dias). */
export function hearingsThisWeek() {
  return upcomingAppointments().filter(
    (a) => a.type === 'Audiência' && daysUntil(a.start, TODAY) <= 7,
  )
}

/** Métricas agregadas para os KPIs do dashboard. */
export function dashboardStats() {
  const activeCases = cases.filter((c) => c.status === 'Ativo').length
  const next7 = deadlinesWithin(7)
  const fatalPending = pendingDeadlines().filter(
    (d) => d.criticality === 'fatal',
  ).length
  const hearingsWeek = hearingsThisWeek().length
  const activeClients = clients.length

  return {
    activeCases,
    totalCases: cases.length,
    deadlinesNext7: next7.length,
    fatalPending,
    hearingsWeek,
    activeClients,
  }
}
