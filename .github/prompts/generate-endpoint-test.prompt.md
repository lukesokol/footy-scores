---
description: 'Generate comprehensive test cases for endpoint generation logic — verifying structure, determinism, completeness, and edge cases.'
agent: 'agent'
---

Generate test cases for the endpoint generation service (`src/services/endpoint-generator.ts`):

1. **Structure tests** — Verify each generated endpoint matches the schema in `references/example.json`:
   - All required fields present (competition, venue, kickoff, status, teams, score, scorers, lineups)
   - Correct data types for each field
   - Nested structures match exactly

2. **Determinism tests** — Same input produces identical output:
   - Run generation twice with same data, deep-equal the results
   - Order is consistent across runs

3. **Completeness tests** — All matches covered:
   - No duplicates (unique match per endpoint)
   - No omissions (all football matches from schedule included)
   - Expected count: ~56 matches (32 men's + 24 women's)

4. **Sorting tests** — Output order matches documented sort:
   - Kickoff date ascending
   - Men before Women for same kickoff
   - Stable sort for ties

5. **Edge cases** — Missing data, malformed input, empty schedule

Use mock data from `src/test/factories/` and follow `.github/instructions/testing.instructions.md`.
