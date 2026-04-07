# FootyScores — Project Guidelines

## Project Purpose

QA tool that generates expected FootyScores API endpoints for every Paris 2024 Olympic football match. Source of truth: the official Olympic Games competition schedule. Output matches the structure in `references/example.json`.

## Tech Stack

- React 19 + TypeScript (strict mode) on Vite 8
- Tailwind CSS v4 for styling
- Vitest + React Testing Library for unit tests
- Playwright for E2E tests
- pnpm as package manager

## Code Style

- Functional components only — no class components
- Custom hooks for all data/logic concerns (prefix: `use`)
- TypeScript strict mode — no `any`, no type assertions unless unavoidable (document why)
- Barrel exports from feature directories (`index.ts`)
- Path alias `@/` maps to `src/`
- Import order: React → third-party → `@/` aliases → relative → CSS

## File Organization

```
src/
├── types/          # TypeScript interfaces and type definitions
├── services/       # Data fetching, endpoint generation (pure functions)
├── hooks/          # React hooks (useOlympicSchedule, useEndpointGenerator, useExport)
├── components/
│   ├── layout/     # Header, Footer, Layout
│   ├── matches/    # MatchList, MatchCard, EndpointPreview, MatchFilters
│   ├── controls/   # LoadDataButton, ExportButton, StatusIndicator
│   └── detail/     # MatchDetail
├── data/           # Static fallback data (paris2024-schedule.json)
├── lib/            # Shared utilities
└── test/           # Test setup and utilities
```

## Component Patterns

- One component per file, named same as file (PascalCase)
- Props interface named `{ComponentName}Props`
- Use Tailwind utility classes directly — no CSS modules
- Accessible: use semantic HTML, ARIA labels where needed, keyboard navigable

## Data Layer

- All data transformations in `services/` as **pure functions** (no side effects)
- Endpoint generation must be **deterministic**: same input → same output
- Sort order: kickoff date ascending → Men before Women → match unit
- The `example.json` structure in `references/` is the **source of truth** for endpoint format

## Testing

- Co-located test files: `ComponentName.test.tsx` next to `ComponentName.tsx`
- Service tests in `services/__tests__/`
- Test file naming: `*.test.ts` or `*.test.tsx`
- Use `describe`/`it` blocks
- Mock external APIs; never call real endpoints in tests

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Type-check + production build
pnpm test         # Run unit tests
pnpm test:watch   # Run tests in watch mode
pnpm test:e2e     # Run Playwright E2E tests
pnpm lint         # ESLint check
pnpm format       # Prettier format
pnpm typecheck    # TypeScript type checking
```

## Key References

- Requirements: `references/readme.md`
- Endpoint structure: `references/example.json`
- Project plan: `docs/PLAN.md`
