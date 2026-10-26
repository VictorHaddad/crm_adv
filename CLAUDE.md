# CRM Jurídico — Protótipo

CRM para advogados / escritórios de advocacia. **Protótipo de demonstração** (sem backend, dados mockados). Prioridade máxima em **UX e design**: deve transmitir confiança e sofisticação para o setor jurídico.

## Stack

| Camada | Tecnologia |
|---|---|
| Build | Vite + React 19 + TypeScript |
| Estilo | Tailwind CSS v3 (tokens via CSS variables) |
| Componentes base | shadcn/ui (padrão "new-york"), Radix por baixo |
| Animação | Framer Motion (micro-interações, transições de página) |
| 3D | Three.js + React Three Fiber (+ drei) — cena sutil no Login e Dashboard |
| Gráficos | Recharts |
| Ícones | lucide-react |
| Rotas | React Router (`react-router-dom` v7) |
| Datas | date-fns + `Intl` (pt-BR) |

Sem backend: todos os dados vêm de `src/data/*` (fictícios, realistas do universo jurídico BR).

## Como rodar

```bash
npm install
npm run dev      # ambiente de desenvolvimento
npm run build    # type-check (tsc -b) + build de produção
npm run preview  # servir o build
```

## Estrutura de pastas

```
src/
├── app/            # router.tsx, providers.tsx
├── components/
│   ├── ui/         # primitivos shadcn/ui (button, card, input...)
│   ├── layout/     # AppShell, Sidebar, Topbar, PageHeader
│   ├── common/     # EmptyState, Skeleton, StatusBadge, KpiCard...
│   ├── charts/     # wrappers Recharts
│   └── three/      # cenas React Three Fiber
├── features/       # uma pasta por domínio/tela (auth, dashboard, cases...)
├── data/           # mocks (cases, clients, deadlines, hearings, finance, firm)
├── types/          # tipos de domínio (LegalCase, Client, Deadline...)
├── lib/            # utils.ts (cn), format.ts, constants.ts
└── hooks/          # useTheme, useMediaQuery, useSidebar
```

**Regra de organização:** o que é específico de um domínio vive em `features/<dominio>/`; o reutilizável genérico vive em `components/`. Páginas são exportadas pela feature; as rotas ficam em `app/router.tsx`.

## Design System

### Cores (tokens semânticos — nunca use hex cru em componentes)
Definidos como CSS variables em `src/index.css` (HSL, com light/dark) e expostos no Tailwind (`tailwind.config.ts`).

- **Marca:** `primary` = navy/petróleo profundo · `accent` = dourado/âmbar (usar como acento: bordas, ícones, CTA — nunca fundo de texto pequeno).
- **Superfícies:** `background`, `surface`, `surface-muted`, `border`.
- **Texto:** `foreground`, `muted-foreground`.
- **Feedback/criticidade:** `critical` (fatal/vencido), `warning` (importante), `success` (cumprido/em dia), `info` (neutro).

Use sempre as classes de token: `bg-surface`, `text-muted-foreground`, `border-border`, `text-accent`, `bg-critical`, etc. Suportam opacidade (`bg-primary/10`).

### Tipografia
- **Títulos (H1–H3):** `Playfair Display` (serifada) — via `font-serif` ou tags h1/h2/h3. Usar com moderação.
- **Corpo/UI:** `Inter` (`font-sans`, padrão).
- Dados numéricos em tabelas/financeiro: classe `.tabular` (tabular-nums).

### Espaçamento / raio / elevação
- Base 4px (escala Tailwind). Padding de card 20–24px, gaps 16–24px.
- Raio base `--radius` = 10px (`rounded-lg`); inputs/botões em `md/lg`.
- Sombras: `shadow-card` (repouso), `shadow-pop` (hover/menus/popovers).

### Movimento
- Transição de página: fade + slide sutil, ~220ms, ease `[0.22, 1, 0.36, 1]`.
- Hover: ~150ms. Skeletons com shimmer (`.skeleton-shimmer`).
- 3D discreto, lento, baixo contraste. **Sempre respeitar `prefers-reduced-motion`** (já tratado globalmente no CSS).

### Acessibilidade (baseline)
- Foco visível em anel (`:focus-visible` global). `aria-label` em ícones-ação.
- Contraste AA (≥ 4.5:1 para texto). Alvos de toque ≥ 40px. Navegação por teclado na sidebar.

## Convenções de código

- **Imports:** alias `@/` → `src/`. Tipos com `import type { ... }` (o projeto usa `verbatimModuleSyntax`).
- **Componentes:** função nomeada + export nomeado; um componente por arquivo quando relevante. PascalCase para componentes, camelCase para utils.
- **Classes:** compor com `cn()` de `@/lib/utils`. Variantes de componente com `class-variance-authority` (cva).
- **Formatação de dados:** usar helpers de `@/lib/format` (BRL, datas pt-BR, CPF/CNPJ, contagem regressiva) — não reimplementar.
- **Idioma:** UI e dados em **português (BR)**; nomes de código em português quando for domínio (ex.: `prazos`), mas termos técnicos podem ficar em inglês.
- **Dark mode:** classe `dark` no `<html>` (gerenciada por `useTheme`). Todo componente deve funcionar em ambos os temas via tokens.
- **Responsivo:** mobile-first. Sidebar colapsável (drawer no mobile). Testar em mobile/tablet/desktop.

## Áreas do direito (mocks)
Cível, Trabalhista, Tributário, Penal, Família, Empresarial.
