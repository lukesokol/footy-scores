---
description: 'Use when defining or editing TypeScript types in src/types/. Covers type patterns and the FootyScores endpoint schema.'
applyTo: 'src/types/**'
---

# Type Definition Conventions

## Naming

- Interfaces for object shapes: `OlympicMatch`, `FootyScoresEndpoint`
- Type aliases for unions/utility types: `LoadingState`, `ApiResult<T>`
- Enums only when the set is fixed and small; prefer union types otherwise

## FootyScores Endpoint Schema

The canonical structure is in `references/example.json`. All generated endpoints must include:

```typescript
interface FootyScoresEndpoint {
  competition: { name: string; season: string; round: string }
  venue: { name: string; city: string }
  kickoff: string // ISO 8601
  status: string // e.g., "FT", "NS"
  teams: { home: string; away: string }
  score: { home: number; away: number; halfTime: { home: number; away: number } } | null
  scorers: Scorer[] // may be empty
  lineups: { home: LineupEntry; away: LineupEntry } | null
}
```

## Patterns

- Export all types from barrel `index.ts`
- Use `readonly` for data that should not be mutated
- Use discriminated unions for state: `{ status: 'loading' } | { status: 'success'; data: T } | { status: 'error'; error: string }`
- Avoid `any` — use `unknown` and narrow with type guards
