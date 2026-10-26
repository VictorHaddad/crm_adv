/** Tipos de domínio do CRM jurídico. */

export type PracticeArea =
  | 'Cível'
  | 'Trabalhista'
  | 'Tributário'
  | 'Penal'
  | 'Família'
  | 'Empresarial'

export type CasePhase =
  | 'Conhecimento'
  | 'Recursal'
  | 'Execução'
  | 'Arquivado'

export type CaseStatus = 'Ativo' | 'Suspenso' | 'Encerrado'

export type Criticality = 'fatal' | 'importante' | 'normal'

export type DeadlineStatus = 'pendente' | 'cumprido'

export type ClientType = 'PF' | 'PJ'

export interface Contact {
  label: string
  email: string
  phone: string
}

export interface Client {
  id: string
  type: ClientType
  name: string
  document: string // CPF ou CNPJ (somente dígitos)
  email: string
  phone: string
  city: string
  state: string
  since: string // ISO
  avatarColor?: string
  contacts?: Contact[]
  notes?: string
}

export interface Party {
  role: 'Autor' | 'Réu' | 'Requerente' | 'Requerido' | 'Exequente' | 'Executado'
  name: string
}

export interface CaseEvent {
  id: string
  date: string // ISO
  title: string
  description: string
  type: 'peticao' | 'decisao' | 'audiencia' | 'despacho' | 'publicacao' | 'juntada'
}

export interface CaseDocument {
  id: string
  name: string
  kind: 'Petição' | 'Contrato' | 'Procuração' | 'Sentença' | 'Comprovante' | 'Laudo'
  sizeKB: number
  uploadedAt: string // ISO
}

export interface Fee {
  id: string
  description: string
  type: 'Contratual' | 'Êxito' | 'Sucumbência' | 'Custas'
  amount: number
  status: 'pago' | 'pendente' | 'atrasado'
  dueDate: string // ISO
}

export interface LegalCase {
  id: string
  cnj: string // número CNJ
  title: string
  clientId: string
  area: PracticeArea
  phase: CasePhase
  status: CaseStatus
  court: string // vara
  district: string // comarca
  claimValue: number // valor da causa
  distributedAt: string // ISO
  parties: Party[]
  events: CaseEvent[]
  documents: CaseDocument[]
  fees: Fee[]
  responsible: string // advogado responsável
}

export interface Deadline {
  id: string
  caseId: string
  caseCnj: string
  title: string
  area: PracticeArea
  dueDate: string // ISO
  criticality: Criticality
  status: DeadlineStatus
  responsible: string
}

export type AppointmentType = 'Audiência' | 'Reunião' | 'Prazo' | 'Compromisso'

export interface Appointment {
  id: string
  title: string
  type: AppointmentType
  start: string // ISO com horário
  end?: string // ISO
  location: string
  caseId?: string
  caseCnj?: string
  participants: string[]
}

export interface TeamMember {
  id: string
  name: string
  role: string
  email: string
  oab?: string
  active: boolean
}
