---
description: 'Use when writing or editing test files. Covers Vitest patterns, React Testing Library usage, and mocking conventions.'
applyTo: '**/*.test.{ts,tsx}'
---

# Testing Conventions

## Structure

- Use `describe` blocks grouped by function/component name
- Use `it` for individual test cases with descriptive names
- Arrange–Act–Assert pattern

```tsx
describe('EndpointGenerator', () => {
  it('maps Olympic match to FootyScores endpoint structure', () => {
    // Arrange
    const match = createMockMatch({ ... })

    // Act
    const endpoint = generateEndpoint(match)

    // Assert
    expect(endpoint.competition.name).toBe('Olympic Football Tournament Men')
  })
})
```

## React Components

- Use React Testing Library — query by role, label, or text (not test IDs unless necessary)
- Test user interactions with `@testing-library/user-event`
- Test loading, error, and empty states
- Don't test implementation details (internal state, private methods)

## Mocking

- Mock API calls with `vi.mock()` or `vi.fn()`
- Create mock factories in `src/test/factories/` for reusable test data
- Never call real external APIs in tests
- Use `vi.spyOn` for partial mocking

## Assertions

- Prefer `toEqual` for object comparison, `toBe` for primitives
- Use snapshot testing sparingly — only for deterministic JSON output
- Test determinism: call the same function twice with same input, expect identical output
