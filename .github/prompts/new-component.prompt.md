---
description: 'Scaffold a new React component with proper TypeScript types, Tailwind styling, and a co-located test file.'
agent: 'agent'
---

Create a new React component following the FootyScores project conventions:

1. **Component file** at the specified path under `src/components/`
   - Functional component with typed props (`{Name}Props` interface)
   - Tailwind CSS utility classes for styling
   - Semantic HTML with accessibility attributes
   - Export the component as default export

2. **Test file** co-located next to the component (`{Name}.test.tsx`)
   - Import from `@testing-library/react`
   - Test basic rendering
   - Test props handling
   - Test any interactive behavior

3. **Update barrel export** — add to the nearest `index.ts`

Follow all conventions in `.github/copilot-instructions.md` and `.github/instructions/react-components.instructions.md`.
