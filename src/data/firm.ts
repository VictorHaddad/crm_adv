import type { TeamMember } from '@/types'

export const firm = {
  name: 'Marques & Andrade Advocacia',
  cnpj: '19427388000164',
  oabFirm: 'OAB/SP 12.482',
  address: 'Av. Brigadeiro Faria Lima, 3477 — 14º andar, Itaim Bibi, São Paulo/SP',
  phone: '(11) 3048-9200',
  email: 'contato@marquesandrade.adv.br',
}

export const currentUser: TeamMember = {
  id: 'u1',
  name: 'Dra. Helena Marques',
  role: 'Sócia-fundadora',
  email: 'helena.marques@marquesandrade.adv.br',
  oab: 'OAB/SP 148.902',
  active: true,
}

export const team: TeamMember[] = [
  currentUser,
  {
    id: 'u2',
    name: 'Dr. Rafael Andrade',
    role: 'Sócio',
    email: 'rafael.andrade@marquesandrade.adv.br',
    oab: 'OAB/SP 152.311',
    active: true,
  },
  {
    id: 'u3',
    name: 'Dra. Beatriz Nogueira',
    role: 'Advogada Sênior — Trabalhista',
    email: 'beatriz.nogueira@marquesandrade.adv.br',
    oab: 'OAB/SP 201.774',
    active: true,
  },
  {
    id: 'u4',
    name: 'Dr. Thiago Peixoto',
    role: 'Advogado — Tributário',
    email: 'thiago.peixoto@marquesandrade.adv.br',
    oab: 'OAB/SP 233.019',
    active: true,
  },
  {
    id: 'u5',
    name: 'Dra. Camila Rezende',
    role: 'Advogada — Cível',
    email: 'camila.rezende@marquesandrade.adv.br',
    oab: 'OAB/SP 245.660',
    active: true,
  },
  {
    id: 'u6',
    name: 'Lucas Ferreira',
    role: 'Estagiário',
    email: 'lucas.ferreira@marquesandrade.adv.br',
    active: false,
  },
]
