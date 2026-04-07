---
description: 'Use when creating or editing React components in src/components/. Covers component structure, Tailwind usage, and accessibility.'
applyTo: 'src/components/**'
---

# React Component Conventions

## Structure

- One component per file, PascalCase filename matching component name
- Props interface: `{ComponentName}Props`, exported
- Default export for the component

```tsx
export interface MatchCardProps {
  match: OlympicMatch
  onSelect?: (matchId: string) => void
}

export default function MatchCard({ match, onSelect }: MatchCardProps) {
  return (...)
}
```

## Styling

- Use Tailwind utility classes directly on elements
- For complex conditional classes, use template literals or a `cn()` helper
- No inline `style` attributes unless truly dynamic (e.g., computed positions)

## Accessibility

- Use semantic HTML: `<main>`, `<nav>`, `<section>`, `<article>`, `<button>`
- Clickable non-button elements must have `role`, `tabIndex`, and keyboard handlers
- Images need `alt` text; decorative images use `alt=""`
- Loading states should use `aria-busy="true"`
- Error messages should use `role="alert"`

## State

- Local UI state in component (`useState`)
- Data fetching and business logic in custom hooks (`hooks/`)
- No prop drilling beyond 2 levels — introduce hooks or context
