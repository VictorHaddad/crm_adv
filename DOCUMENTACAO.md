# Documentação — CRM Jurídico (Protótipo)

Este documento explica **o que foi construído**, **por etapas**, e a **função de cada parte** do projeto. É um guia de leitura do código para quem for revisar, demonstrar ou evoluir o protótipo.

> Complementa o `CLAUDE.md` (que resume stack e convenções). Aqui o foco é *explicar as etapas e as funções*.

---

## 1. Visão geral

CRM para escritórios de advocacia, em formato de **protótipo de demonstração**:

- **Sem backend** — todos os dados são fictícios e vêm de `src/data/*`.
- **Prioridade em UX/design** — estética sóbria e sofisticada (navy + dourado), com dark/light mode, responsividade e micro-interações.
- **8 telas**: Login, Dashboard, Casos (lista + detalhe), Prazos, Clientes (lista + ficha), Agenda, Financeiro e Configurações.

### Como rodar

```bash
npm install
npm run dev      # desenvolvimento (http://localhost:5173)
npm run build    # type-check (tsc -b) + build de produção
npm run preview  # servir o build
```

O app abre em `/login`. Clique em **Entrar** (campos já vêm preenchidos) para acessar o sistema.

---

## 2. Stack e o papel de cada tecnologia

| Tecnologia | Função no projeto |
|---|---|
| **Vite + React 19 + TypeScript** | Base do app (build rápido, componentes tipados). |
| **Tailwind CSS v3** | Estilização utilitária; cores vêm de *tokens* (CSS variables). |
| **shadcn/ui + Radix** | Primitivos de UI acessíveis (botões, selects, tabs, dialog…). |
| **Framer Motion** | Micro-interações e transições de página/lista. |
| **Three.js + React Three Fiber + drei** | Cenas 3D sutis no Login e no Dashboard. |
| **Recharts** | Gráficos (faturamento, fluxo de caixa, honorários por área). |
| **lucide-react** | Ícones. |
| **React Router v7** | Navegação entre telas. |
| **date-fns + Intl** | Datas e calendários em pt-BR. |

---

## 3. Estrutura de pastas e a função de cada diretório

```
src/
├── app/            # composição do app: rotas, providers, config de navegação
├── components/
│   ├── ui/         # primitivos shadcn/ui (genéricos, reutilizáveis)
│   ├── layout/     # casca visual: AppShell, Sidebar, Topbar, PageHeader, Logo
│   ├── common/     # blocos reutilizáveis (KpiCard, EmptyState, badges…)
│   ├── charts/     # wrappers de gráficos Recharts
│   └── three/      # cenas React Three Fiber (3D)
├── features/       # uma pasta por domínio/tela (auth, dashboard, cases…)
├── data/           # mocks do universo jurídico + seletores derivados
├── types/          # tipos de domínio (LegalCase, Client, Deadline…)
├── lib/            # utilidades (cn, formatadores, constantes)
└── hooks/          # hooks (tema, media query, cores de gráfico)
```

**Regra de ouro:** o que é específico de uma tela vive em `features/<dominio>/`; o reutilizável genérico vive em `components/`.

---

## 4. Etapas de construção (e a função de cada uma)

As etapas seguem a ordem em que o protótipo foi montado. Cada uma lista sua **função** e os **arquivos-chave**.

### Etapa 0 — Scaffolding e configuração

**Função:** preparar o terreno (build, aliases, plugins).

- `vite.config.ts` — configura o React, o alias `@/` → `src/` e o `chunkSizeWarningLimit` (ver Etapa 10).
- `tailwind.config.ts` — mapeia os *tokens* de cor para classes Tailwind, define fontes, raios, sombras (`shadow-card`/`shadow-pop`) e animações.
- `postcss.config.js`, `tsconfig*.json`, `components.json` — infra de build e config do shadcn.

### Etapa 1 — Design System (a base visual)

**Função:** garantir consistência visual e suporte a dark/light via *tokens semânticos*.

- **`src/index.css`** — o coração do design system:
  - Importa as fontes (Playfair Display para títulos, Inter para corpo).
  - Define as **CSS variables** (cores em HSL) em `:root` (claro) e `.dark` (escuro): superfícies (`--background`, `--surface`…), texto (`--foreground`, `--muted-foreground`), marca (`--primary` navy, `--accent` dourado) e criticidade (`--critical`, `--warning`, `--success`, `--info`).
  - Estilos base: foco visível acessível, `.tabular` (números tabulares), `.skeleton-shimmer` e respeito a `prefers-reduced-motion`.
- **Regra:** componentes nunca usam hex cru — sempre classes de token (`bg-surface`, `text-accent`, `border-border`…), que suportam opacidade (`bg-primary/10`).

### Etapa 2 — Primitivos de UI (`components/ui/`)

**Função:** blocos de interface acessíveis e padronizados, no estilo shadcn "new-york".

Cada arquivo é um primitivo isolado: `button`, `card`, `input`, `label`, `badge`, `avatar`, `separator`, `checkbox`, `switch`, `select`, `tabs`, `table`, `tooltip`, `dropdown-menu`, `progress`, `skeleton`.
Todos compõem classes com `cn()` e usam variantes via `cva` (ex.: `buttonVariants`, `badgeVariants`).

### Etapa 3 — Utilidades e tipos

**Função:** lógica compartilhada e contrato de dados.

- **`lib/utils.ts`** — `cn()`: junta classes e resolve conflitos do Tailwind.
- **`lib/format.ts`** — formatadores do domínio BR (não reimplementar em componentes):
  - `formatBRL` / `formatBRLCompact` (moeda), `formatDate` / `formatDateLong` / `formatTime` (datas pt-BR), `formatCPF` / `formatCNPJ` (máscaras), `daysUntil` / `countdownLabel` (contagem regressiva) e `initials` (avatares).
- **`lib/constants.ts`** — listas do domínio (áreas do direito, fases, status), cores por área (`AREA_COLORS`) e mapeamento de criticidade → token de cor.
- **`types/index.ts`** — tipos de domínio: `LegalCase`, `Client`, `Deadline`, `Appointment`, `Fee`, `TeamMember`, etc.

### Etapa 4 — Camada de dados (`data/`)

**Função:** fornecer dados realistas e **seletores derivados** que as telas consomem.

- Mocks: `clients.ts`, `cases.ts` (com andamentos, documentos, honorários, partes), `deadlines.ts`, `appointments.ts`, `finance.ts`, `firm.ts` (escritório + equipe + usuário atual).
- **`data/index.ts`** — ponto único de import (`@/data`) e **seletores** que centralizam a lógica:
  - `TODAY` — data de referência do protótipo (03/07/2026), para que a contagem de prazos/agenda seja estável.
  - `pendingDeadlines()`, `deadlinesWithin(n)`, `upcomingAppointments()`, `hearingsThisWeek()`.
  - `dashboardStats()` — agrega os números dos KPIs do Dashboard.
  - `casesByClient(id)`, `caseById(id)`, `clientById(id)`.

### Etapa 5 — Layout e navegação (`components/layout/` + `app/`)

**Função:** a "casca" que envolve todas as telas internas.

- **`app/providers.tsx`** — envolve o app com `ThemeProvider` (dark/light) e `TooltipProvider`.
- **`app/nav.ts`** — define os itens do menu (`NAV_ITEMS`) e `pageTitleFor(pathname)` (título da Topbar).
- **`app/router.tsx`** — todas as rotas; páginas carregadas sob demanda (ver Etapa 10).
- **`AppShell.tsx`** — orquestra Sidebar + Topbar + conteúdo. Controla o estado de **colapso** (desktop) e o **drawer** (mobile), e faz a **transição de página** (fade + slide) com Framer Motion via `<Outlet/>`.
- **`Sidebar.tsx`** — navegação com destaque do item ativo (barra dourada animada com `layoutId`); vira tooltips quando colapsada.
- **`Topbar.tsx`** — título da página, busca, notificações, **theme toggle** e menu do usuário (dropdown).
- **`PageHeader.tsx`** / **`Logo.tsx`** — cabeçalho padrão de cada tela e a marca do escritório.

### Etapa 6 — Dashboard (`features/dashboard/`)

**Função:** visão geral do escritório na entrada do sistema.

- **`DashboardPage.tsx`** — monta a tela: hero, KPIs, gráficos e as duas listas.
- **`components/WelcomeHero.tsx`** — saudação + resumo + **cena 3D sutil** (`DashboardAura`).
- KPIs via **`components/common/KpiCard.tsx`** — prazos próximos, casos ativos, faturamento do mês (com variação %), audiências da semana.
- Gráficos: **`charts/RevenueChart.tsx`** (faturamento × custas) e **`charts/RevenueByAreaChart.tsx`** (honorários por área).
- **`components/UrgentDeadlines.tsx`** — prazos urgentes ordenados por vencimento, com destaque para os fatais.
- **`components/HearingsTimeline.tsx`** — próximos compromissos em timeline.

### Etapa 7 — Login (`features/auth/`)

**Função:** porta de entrada, sofisticada, com 3D.

- **`LoginPage.tsx`** — painel dividido: à esquerda a marca + **cena 3D** (`LoginScene`) + citação; à direita o formulário elegante (e-mail, senha com mostrar/ocultar, "manter conectado", loading no botão, entrada animada em *stagger*).
- **`components/three/LoginScene.tsx`** — cena R3F: núcleo dourado facetado dentro de cascas em wireframe, partículas (`Sparkles`), névoa e luzes. Respeita `prefers-reduced-motion`.

### Etapa 8 — Telas de domínio

Cada tela reutiliza os mesmos padrões (PageHeader, filtros, badges, tabs, cards, empty states).

#### Casos (`features/cases/`)
**Função:** gestão de processos.
- **`CaseListPage.tsx`** — lista com **filtros** (busca, área, fase, status), tabela no desktop e cards no mobile.
- **`CaseDetailPage.tsx`** — ficha do processo: dados (CNJ, vara, comarca, valor da causa…), **partes** e abas: **Andamentos** (timeline), **Documentos**, **Prazos vinculados**, **Honorários** (com resumo total/recebido/a receber).
- **`components/CaseFilters.tsx`** e **`components/CaseTimeline.tsx`** — filtros e a timeline de andamentos (ícone/cor por tipo de movimentação).

#### Prazos (`features/deadlines/`)
**Função:** controle de prazos com criticidade e contagem regressiva.
- **`DeadlinesPage.tsx`** — KPIs (fatais, vencidos, próximos 7 dias, cumpridos), filtros e alternância **Lista/Calendário**. Mantém o estado de "cumprido" localmente.
- **`components/DeadlineItem.tsx`** — item com **checkbox para cumprir**, criticidade e contagem ("Vence em 3 dias").
- **`components/DeadlineList.tsx`** — agrupa por urgência (Vencidos / Hoje / Próximos 7 dias / Mais adiante / Cumpridos).
- **`components/DeadlineCalendar.tsx`** — calendário mensal (date-fns/pt-BR) com pontos por criticidade e painel do dia selecionado.

#### Clientes (`features/clients/`)
**Função:** cadastro PF/PJ e ficha completa.
- **`ClientListPage.tsx`** — busca + filtro PF/PJ, grid de cards (avatar, documento formatado, nº de casos).
- **`ClientDetailPage.tsx`** — ficha: stats (casos totais/ativos, valor em causa), abas **Casos vinculados** e **Histórico** (andamentos consolidados de todos os casos do cliente), e sidebar de **Contato/Observações**.

#### Agenda (`features/agenda/`)
**Função:** audiências, reuniões e compromissos.
- **`AgendaPage.tsx`** — KPIs, filtro por tipo e alternância **Agenda (lista)/Mês (calendário)**.
- **`components/AppointmentItem.tsx`** — evento com hora, tipo (cor), local, participantes e link para o processo.
- **`components/AgendaList.tsx`** — lista agrupada por dia (Hoje/Amanhã/dia da semana).
- **`components/AgendaCalendar.tsx`** — calendário mensal com pontos por tipo.

#### Financeiro (`features/finance/`)
**Função:** honorários, custas, contas a receber e fluxo.
- **`FinancePage.tsx`** — KPIs (faturamento do mês, 12 meses, a receber, em atraso), **fluxo de caixa**, **honorários por área**, tabela de **contas a receber** (com atraso destacado) e **honorários por tipo** (barras de proporção).
- **`charts/CashFlowChart.tsx`** — gráfico composto (barras de faturamento/custas + linha de resultado líquido).

#### Configurações (`features/settings/`)
**Função:** perfil do escritório, tema e equipe.
- **`SettingsPage.tsx`** — três abas: **Escritório** (formulário com "Salvar" e confirmação), **Aparência** (seletor de tema com mini-preview + switches de notificação), **Equipe** (lista de membros com status Ativo/Inativo).

### Etapa 9 — Hooks transversais (`hooks/`)

**Função:** comportamentos reutilizáveis.

- **`useTheme.tsx`** — provê `theme`, `setTheme`, `toggleTheme`; aplica a classe `dark` no `<html>` e persiste no `localStorage`.
- **`useMediaQuery.ts`** — `useMediaQuery(query)` e `useIsMobile()` (responsividade).
- **`useChartColors.ts`** — lê os *tokens* CSS e devolve cores concretas para o Recharts, **recalculando ao trocar de tema**.

### Etapa 10 — Otimização (code-splitting)

**Função:** reduzir o carregamento inicial.

- **Cenas 3D sob demanda** — `LoginScene` e `DashboardAura` são carregadas com `React.lazy`, isolando o three.js num chunk próprio que só baixa quando um 3D monta.
- **Code-splitting por rota** — em `app/router.tsx`, cada página é `lazy` com fallback `PageLoader` (spinner). Assim, Recharts só carrega no Dashboard/Financeiro, o calendário (date-fns/pt-BR) só em Prazos/Agenda, etc.
- **Resultado:** o bundle inicial caiu de ~1,86 MB para ~380 kB. O chunk do three.js (~880 kB) é intencional e lazy — por isso o `chunkSizeWarningLimit` foi elevado no `vite.config.ts`.

---

## 5. Fluxo de dados (como as telas obtêm informação)

```
data/*.ts  →  data/index.ts (seletores)  →  features/<tela>/*  →  components/*
   (mocks)         (agrega/filtra)            (monta a tela)     (renderiza UI)
```

Exemplo: o Dashboard chama `dashboardStats()` e `pendingDeadlines()` de `@/data`; passa os resultados para `KpiCard` e `UrgentDeadlines`, que apenas renderizam. Nenhuma tela reimplementa formatação (usa `lib/format`) nem cores cruas (usa tokens).

---

## 6. Convenções para evoluir o projeto

- **Adicionar uma tela:** criar `features/<nova>/NovaPage.tsx`, registrar em `app/router.tsx` (como `lazy`) e, se for de menu, em `app/nav.ts`.
- **Adicionar um dado:** incluir o mock em `data/`, tipar em `types/` e, se for reutilizado, criar um seletor em `data/index.ts`.
- **Cores/estilo:** sempre via tokens (`bg-surface`, `text-accent`…); novas cores entram como CSS variables em `index.css` e no `tailwind.config.ts`.
- **Datas/moeda/documentos:** sempre via `lib/format`.
- **Dark mode:** todo componente deve funcionar em ambos os temas (usar tokens, testar o toggle).

---

## 7. Limitações conhecidas (por ser protótipo)

- Sem backend/persistência: ações como "Salvar", "cumprir prazo" ou login são simuladas (estado local ou navegação direta).
- Busca e notificações são ilustrativas.
- Dados fixos em torno de **julho/2026** (definido por `TODAY`), para manter prazos e agenda coerentes na demonstração.
