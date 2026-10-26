/**
 * Formatadores para o contexto jurídico brasileiro:
 * moeda (BRL), datas (pt-BR), documentos (CPF/CNPJ) e número CNJ.
 */

/** Formata valor numérico como moeda brasileira (R$). */
export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 2,
  }).format(value)
}

/** Formata valor compacto (ex.: R$ 1,2 mi) para KPIs. */
export function formatBRLCompact(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

/** Formata data ISO para dd/MM/yyyy. */
export function formatDate(iso: string | Date): string {
  const d = typeof iso === 'string' ? new Date(iso) : iso
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(d)
}

/** Formata data por extenso curta (ex.: 3 jul 2026). */
export function formatDateLong(iso: string | Date): string {
  const d = typeof iso === 'string' ? new Date(iso) : iso
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d)
}

/** Formata hora (HH:mm). */
export function formatTime(iso: string | Date): string {
  const d = typeof iso === 'string' ? new Date(iso) : iso
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

/** Máscara de CPF: 000.000.000-00 */
export function formatCPF(cpf: string): string {
  const d = cpf.replace(/\D/g, '').padStart(11, '0')
  return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

/** Máscara de CNPJ: 00.000.000/0000-00 */
export function formatCNPJ(cnpj: string): string {
  const d = cnpj.replace(/\D/g, '').padStart(14, '0')
  return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
}

/**
 * Dias restantes até uma data (negativo = vencido).
 * Compara apenas datas (ignora horário).
 */
export function daysUntil(iso: string | Date, from: Date = new Date()): number {
  const target = typeof iso === 'string' ? new Date(iso) : iso
  const a = new Date(target.getFullYear(), target.getMonth(), target.getDate())
  const b = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  return Math.round((a.getTime() - b.getTime()) / 86_400_000)
}

/** Texto humano de contagem regressiva (ex.: "Vence em 3 dias", "Vencido há 2 dias"). */
export function countdownLabel(iso: string | Date, from?: Date): string {
  const d = daysUntil(iso, from)
  if (d === 0) return 'Vence hoje'
  if (d === 1) return 'Vence amanhã'
  if (d === -1) return 'Venceu ontem'
  if (d > 1) return `Vence em ${d} dias`
  return `Vencido há ${Math.abs(d)} dias`
}

/** Iniciais para avatar (ex.: "Ana Costa" -> "AC"). */
export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 2 || /^[A-ZÀ-Ú]/.test(w))
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}
