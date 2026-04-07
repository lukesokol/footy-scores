---
description: 'Use when working with data fetching, API integration, or endpoint generation in src/services/. Covers Olympics schedule API patterns and FootyScores endpoint mapping.'
applyTo: 'src/services/**'
---

# Data & API Service Conventions

## Pure Functions

- All exports from services must be **pure functions** (no side effects, no mutations)
- Async functions for network calls, sync for transformations
- Always return new objects/arrays, never mutate inputs

## Olympics Schedule API

- Primary source: `https://sph-s-api.olympics.com/summer/schedules/api/ENG/schedule/sport/FBL`
- Dev proxy configured at `/api/olympics` in `vite.config.ts`
- Filter for football only: discipline code `FBL`
- Handle CORS via Vite dev proxy; static fallback for offline/production

## Endpoint Generation

- Generated endpoints MUST match the structure in `references/example.json` exactly
- All fields present even if `null` or `[]` (scorers, lineups may not be in source data)
- Deterministic: same input → identical output (use stable sort, no random IDs)
- Sort order: `kickoff` ascending → competition gender (Men first) → match unit

## Error Handling

- Wrap fetch calls in try/catch
- Return discriminated unions: `{ status: 'success', data } | { status: 'error', error }`
- Never throw from service functions — return error objects
- Log errors with context (what was being fetched, parameters)

## Type Safety

- Every API response must have a corresponding TypeScript type in `types/`
- Use Zod or manual validation for runtime API response validation
- Never trust external API data without validation
