# FootyScores Olympic Endpoint Generator — Project Plan

> This document is the master plan for the project. It tracks architecture decisions, phases, and verification criteria. Update it as the project evolves.

## Overview

Build a React + TypeScript web app (Vite, Tailwind CSS, pnpm) that fetches Paris 2024 Olympic football match data from the official competition schedule, generates FootyScores-compatible API endpoints matching `references/example.json`, displays them in a QA-friendly UI, and supports JSON export.

## Tech Stack

| Layer           | Choice                                  |
| --------------- | --------------------------------------- |
| Framework       | React 18+ with TypeScript (strict mode) |
| Build           | Vite                                    |
| Styling         | Tailwind CSS v4                         |
| Testing         | Vitest (unit) + Playwright (E2E)        |
| Package Manager | pnpm                                    |
| Linting         | ESLint + Prettier                       |
| CI              | GitHub Actions                          |

## Architecture

```
src/
├── types/              # TypeScript interfaces (match, endpoint, API responses)
├── services/           # Data fetching (Olympics API) + endpoint generation
├── hooks/              # React hooks (useOlympicSchedule, useEndpointGenerator, useExport)
├── components/
│   ├── layout/         # Header, Footer, Layout shell
│   ├── matches/        # MatchList, MatchCard, EndpointPreview, MatchFilters
│   ├── controls/       # LoadDataButton, ExportButton, StatusIndicator
│   └── detail/         # MatchDetail (source data vs generated endpoint)
├── data/               # Static fallback dataset (paris2024-schedule.json)
├── lib/                # Shared utilities
└── App.tsx             # Root component with ErrorBoundary
```

## Phases

### Phase 1: Repository & AI Tooling Setup

- [x] Save plan
- [ ] Init Git, `.gitignore`, initial commit
- [ ] Scaffold Vite + React + TS
- [ ] Tailwind CSS v4, PostCSS
- [ ] ESLint, Prettier, `.editorconfig`
- [ ] `.github/copilot-instructions.md`
- [ ] `.github/instructions/*.instructions.md` (4 files)
- [ ] `.github/agents/*.agent.md` (2 files)
- [ ] `.github/prompts/*.prompt.md` (2 files)
- [ ] `README.md`, `CONTRIBUTING.md`

### Phase 2: Core Types & Data Layer

- [ ] TypeScript types (match, endpoint, API)
- [ ] Olympics schedule fetching service
- [ ] Endpoint generator service
- [ ] Unit tests for data layer

### Phase 3: UI Implementation

- [ ] Layout components
- [ ] Match list + cards
- [ ] Filtering (Men/Women, round, date)
- [ ] Export button + JSON download
- [ ] Detail/inspection view
- [ ] Custom hooks
- [ ] Wire up App.tsx

### Phase 4: Testing & Quality

- [ ] Unit tests (Vitest)
- [ ] E2E tests (Playwright)
- [ ] GitHub Actions CI

### Phase 5: Documentation & Deployment

- [ ] Dockerfile + docker-compose.yml
- [ ] Final README polish

## Key Decisions

| Decision            | Choice                                                               | Rationale                                                                  |
| ------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Solution type       | Web application                                                      | Easier to develop, test, deploy, hand off                                  |
| Data source         | Olympics schedule API + static fallback                              | Primary fetch via `sph-s-api.olympics.com`, fallback JSON for offline/demo |
| Sort order          | Kickoff ascending → Men first → match unit                           | Deterministic, documented                                                  |
| CORS strategy       | Vite dev proxy (dev), configurable proxy URL (prod), static fallback | No backend needed                                                          |
| Missing data fields | Generate full structure, `null`/`[]` for unavailable                 | Scorers/lineups unlikely in Olympics source                                |
| Scope in            | Schedule parsing, endpoint generation, UI, JSON export, tooling      | Core requirements                                                          |
| Scope out           | API validation, backend, auth, persistent storage                    | Out of assignment scope                                                    |

## Verification Checklist

- [ ] `pnpm typecheck` — zero errors
- [ ] `pnpm lint` — clean
- [ ] `pnpm test` — all pass; endpoints match `example.json` structure
- [ ] `pnpm test:e2e` — full user flow
- [ ] `pnpm build` — clean production build
- [ ] `docker compose up` — serves on localhost
- [ ] JSON export valid for every match
- [ ] Determinism: two exports with same input → identical output
- [ ] ~56 matches total (32 men's + 24 women's)

## Data Source Notes

- **Primary**: `https://sph-s-api.olympics.com/summer/schedules/api/ENG/schedule/sport/FBL`
- **Fallback**: Static `data/paris2024-schedule.json`
- **Reference schedule page**: `https://stacy.olympics.com/en/paris-2024/competition-schedule`
- The schedule page is a JS SPA — data is loaded dynamically from the API above
- Paris 2024 football: Men's tournament (16 teams, 32 matches) + Women's tournament (12 teams, 24 matches) = 56 total
