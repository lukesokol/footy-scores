# Future Roadmap

Potential enhancements tracked for future implementation. None of these are required for the current QA tool scope.

## Design System & Figma Integration

**Status**: Groundwork laid (instructions, agents, prompts exist)

### What's Ready Now

- `.github/instructions/design.instructions.md` — Design token patterns and Figma workflow guide
- `.github/agents/designer.agent.md` — `@designer` agent for Figma-to-code translation
- `.github/agents/ui-validator.agent.md` — `@ui-validator` agent for visual QA
- `.github/prompts/enhance-component.prompt.md` — `/enhance-component` prompt for UI improvements

### Steps to Activate

1. Create a Figma file with component designs
2. Get a Figma API key from https://www.figma.com/developers/api
3. Configure the MCP server:
   ```jsonc
   // .vscode/mcp.json
   {
     "servers": {
       "figma": {
         "type": "stdio",
         "command": "npx",
         "args": ["-y", "figma-developer-mcp", "--figma-api-key=YOUR_KEY"],
       },
     },
   }
   ```
4. Create design tokens in `src/styles/tokens.ts`
5. Use `@designer` in Copilot Chat to translate Figma frames into components

## Possible Feature Enhancements

| Feature                  | Complexity | Description                                                     |
| ------------------------ | :--------: | --------------------------------------------------------------- |
| Dark mode                |    Low     | Add `dark:` Tailwind variants, toggle in Header                 |
| Match detail view        |   Medium   | Dedicated route/modal with full endpoint breakdown              |
| Comparison mode          |   Medium   | Side-by-side diff of generated vs actual API response           |
| Live API validation      |    High    | Fetch real FootyScores API and diff against generated endpoints |
| Multi-tournament support |    High    | Extend beyond Paris 2024 (e.g., FIFA World Cup, Euro)           |
| Responsive mobile layout |    Low     | Optimise card grid and preview for small screens                |
| Search by venue/date     |    Low     | Extend `useMatchFilters` with additional filter dimensions      |
| Keyboard shortcuts       |    Low     | `j`/`k` navigation, `e` to export, `/` to search                |
| PWA offline mode         |   Medium   | Service worker + cached static data for offline use             |

## Technical Improvements

| Improvement             | Complexity | Description                                                |
| ----------------------- | :--------: | ---------------------------------------------------------- |
| Design tokens           |    Low     | Extract colours, spacing, typography into token layer      |
| Storybook               |   Medium   | Component catalog for visual development and review        |
| Visual regression tests |   Medium   | Playwright screenshot comparison against baselines         |
| i18n                    |   Medium   | Multi-language support via `react-intl` or `i18next`       |
| Analytics               |    Low     | Track export counts, filter usage for QA workflow insights |
