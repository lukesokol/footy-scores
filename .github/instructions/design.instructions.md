---
description: "Use when implementing UI improvements, design system tokens, theming, component styling, or integrating Figma design specs. Covers visual design patterns and design-to-code workflows."
applyTo: "src/components/**"
---

# Design & UI Guidelines

## Current State

The UI uses Tailwind CSS v4 utility classes directly. There is no formal design system or token layer yet.

## Design Tokens (When Adopted)

When a design system is introduced:

- Define tokens in `src/styles/tokens.ts` (colours, spacing, typography, radii, shadows)
- Export as CSS custom properties via Tailwind theme extension
- Reference tokens instead of raw Tailwind values in components
- Token names should match Figma variable names exactly

## Figma Integration

If Figma is adopted as the design source of truth:

1. **Setup**: Install the Figma MCP server and add it to `.vscode/mcp.json`
2. **Workflow**: Use `@designer` agent to translate Figma frames into components
3. **Tokens**: Sync Figma variables → `src/styles/tokens.ts` via the MCP bridge
4. **Validation**: Use `@ui-validator` agent to compare rendered UI against Figma specs

### Figma MCP Server Configuration

```jsonc
// .vscode/mcp.json (add when ready)
{
  "servers": {
    "figma": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "figma-developer-mcp", "--figma-api-key=YOUR_KEY"]
    }
  }
}
```

## Component Styling Rules

- Use Tailwind utility classes — no CSS modules or styled-components
- Extract repeated patterns into Tailwind `@apply` only when 3+ components share the exact same set
- Responsive: mobile-first (`sm:`, `md:`, `lg:` breakpoints)
- Dark mode: use `dark:` variant when theming is added
- Transitions: use `transition-colors duration-150` for interactive elements

## Accessibility

- Colour contrast: minimum 4.5:1 for text, 3:1 for large text
- Focus indicators: visible `ring` on all interactive elements
- Motion: respect `prefers-reduced-motion` with `motion-safe:` / `motion-reduce:`
