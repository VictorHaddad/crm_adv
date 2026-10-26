/** Dados financeiros do escritório para o dashboard e a tela Financeiro. */

export interface MonthlyRevenue {
  month: string // rótulo curto (ex.: 'Jan')
  faturamento: number // honorários recebidos
  custas: number // custas/despesas
}

/** Série de faturamento — últimos 12 meses até jul/2026. */
export const monthlyRevenue: MonthlyRevenue[] = [
  { month: 'Ago', faturamento: 182_000, custas: 41_000 },
  { month: 'Set', faturamento: 205_500, custas: 38_500 },
  { month: 'Out', faturamento: 168_000, custas: 44_200 },
  { month: 'Nov', faturamento: 221_400, custas: 39_800 },
  { month: 'Dez', faturamento: 258_900, custas: 52_300 },
  { month: 'Jan', faturamento: 197_600, custas: 36_100 },
  { month: 'Fev', faturamento: 214_300, custas: 40_900 },
  { month: 'Mar', faturamento: 246_800, custas: 47_500 },
  { month: 'Abr', faturamento: 231_200, custas: 42_700 },
  { month: 'Mai', faturamento: 268_500, custas: 49_100 },
  { month: 'Jun', faturamento: 289_700, custas: 51_600 },
  { month: 'Jul', faturamento: 142_900, custas: 22_400 },
]

/** Distribuição de honorários recebidos por área do direito (mês corrente). */
export const revenueByArea = [
  { area: 'Trabalhista', valor: 46_500 },
  { area: 'Tributário', valor: 38_000 },
  { area: 'Cível', valor: 24_400 },
  { area: 'Empresarial', valor: 18_000 },
  { area: 'Família', valor: 11_000 },
  { area: 'Penal', valor: 5_000 },
]

export interface Receivable {
  id: string
  clientName: string
  caseCnj: string
  description: string
  amount: number
  dueDate: string
  status: 'pago' | 'pendente' | 'atrasado'
}

/** Contas a receber (honorários em aberto). */
export const receivables: Receivable[] = [
  { id: 'r1', clientName: 'Mariana T. de Almeida', caseCnj: '1008921-45.2023.8.26.0100', description: 'Parcela 2/3 — honorários', amount: 15_000, dueDate: '2026-06-20', status: 'atrasado' },
  { id: 'r2', clientName: 'TechNova Sistemas S.A.', caseCnj: '5004312-88.2023.4.03.6100', description: 'Honorários de êxito', amount: 32_000, dueDate: '2026-09-30', status: 'pendente' },
  { id: 'r3', clientName: 'Construtora Horizonte', caseCnj: '1002345-68.2024.5.02.0011', description: 'Honorários de êxito (10%)', amount: 14_850, dueDate: '2026-12-15', status: 'pendente' },
  { id: 'r4', clientName: 'AgroVale Comércio', caseCnj: '1023456-12.2021.8.26.0577', description: 'Sucumbência (10%)', amount: 68_500, dueDate: '2026-10-15', status: 'pendente' },
  { id: 'r5', clientName: 'Fernanda L. Cardoso', caseCnj: '1012876-90.2022.8.26.0224', description: 'Honorários de êxito (20%)', amount: 24_000, dueDate: '2026-11-30', status: 'pendente' },
  { id: 'r6', clientName: 'Roberto C. Menezes', caseCnj: '1500987-34.2023.8.26.0050', description: 'Parcela final — defesa criminal', amount: 18_000, dueDate: '2026-08-09', status: 'pendente' },
]

/** Faturamento do mês corrente (jul/2026) e variação sobre o mês anterior. */
export const currentMonthRevenue = {
  value: 142_900,
  previous: 289_700,
  // mês em curso (parcial) — variação projetada positiva
  changePct: 8.4,
}
