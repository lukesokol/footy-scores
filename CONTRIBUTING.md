# Contributing to FootyScores

## Development Setup

```bash
pnpm install
pnpm dev
```

## Workflow

1. Create a feature branch from `main`: `git checkout -b feat/description`
2. Make your changes
3. Run checks: `pnpm lint && pnpm typecheck && pnpm test`
4. Commit with a descriptive message (see below)
5. Push and open a pull request

## Branch Naming

| Prefix      | Use                               |
| ----------- | --------------------------------- |
| `feat/`     | New features                      |
| `fix/`      | Bug fixes                         |
| `refactor/` | Code restructuring                |
| `test/`     | Adding or updating tests          |
| `docs/`     | Documentation only                |
| `chore/`    | Build, config, dependency updates |

## Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add match filtering by gender
fix: correct endpoint sort for simultaneous kickoffs
test: add determinism tests for endpoint generator
docs: update deployment instructions
chore: upgrade Tailwind CSS to v4.3
```

## Code Quality Checks

Before committing, ensure all checks pass:

```bash
pnpm lint          # ESLint
pnpm format:check  # Prettier formatting
pnpm typecheck     # TypeScript strict mode
pnpm test          # Unit tests
```

## File Conventions

- **Components**: `src/components/{category}/{Name}.tsx` — one component per file, PascalCase
- **Tests**: Co-located next to source file: `Name.test.tsx`
- **Services**: `src/services/{name}.ts` — pure functions, no side effects
- **Types**: `src/types/{name}.ts` — exported from barrel `index.ts`
- **Hooks**: `src/hooks/use{Name}.ts` — custom hooks for data/logic

## AI Tooling

This project includes GitHub Copilot customization files:

- `.github/copilot-instructions.md` — Workspace-wide coding guidelines (auto-loaded)
- `.github/instructions/` — File-specific instructions (auto-loaded per glob pattern)
- `.github/agents/` — Custom agents (`@reviewer`, `@test-writer`)
- `.github/prompts/` — Reusable prompts (type `/` in chat to use)

When using Copilot in VS Code, these files ensure AI suggestions align with project conventions.
