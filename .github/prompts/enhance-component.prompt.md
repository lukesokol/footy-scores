---
mode: agent
description: "Redesign or enhance an existing component with improved styling, animations, or responsive behaviour"
---

# Enhance Component: {{ component }}

Improve the visual design of the `{{ component }}` component.

## Context

- Current implementation: `src/components/{{ category }}/{{ component }}.tsx`
- Project uses Tailwind CSS v4 with utility classes
- Follow design guidelines in `.github/instructions/design.instructions.md`
- If a Figma frame is provided, use `@designer` agent to extract specs

## Enhancement Goals

{{ goals }}

## Requirements

1. Keep the component's existing functionality intact
2. Use Tailwind utilities — no CSS modules or inline styles
3. Ensure accessibility (contrast, focus states, keyboard nav)
4. Update the co-located test file if markup structure changes
5. Test at `sm`, `md`, and `lg` breakpoints
