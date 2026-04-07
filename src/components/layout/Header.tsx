import { useTheme } from '@/hooks'

interface HeaderProps {
  readonly matchCount: number
}

type Theme = 'light' | 'dark' | 'system'

const themeIcons: Record<Theme, string> = {
  light: '☀️',
  dark: '🌙',
  system: '💻',
}

const nextTheme: Record<Theme, Theme> = {
  light: 'dark',
  dark: 'system',
  system: 'light',
}

export function Header({ matchCount }: HeaderProps) {
  const { theme, setTheme } = useTheme()

  return (
    <header className="border-border-subtle bg-surface-raised border-b">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="bg-accent/10 flex h-9 w-9 items-center justify-center rounded-lg">
            <span className="text-lg" role="img" aria-label="football">
              ⚽
            </span>
          </div>
          <div>
            <h1 className="text-text-primary text-lg font-semibold tracking-tight">FootyScores</h1>
            <p className="text-text-muted text-xs">Paris 2024 · QA Endpoint Generator</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {matchCount > 0 && (
            <span className="bg-accent/10 text-accent rounded-full px-3 py-1 text-xs font-medium">
              {matchCount} matches
            </span>
          )}
          <button
            type="button"
            onClick={() => setTheme(nextTheme[theme])}
            className="border-border-subtle hover:bg-surface-overlay flex h-8 w-8 items-center justify-center rounded-lg border transition-colors"
            aria-label={`Theme: ${theme}. Click to switch.`}
            title={`Current: ${theme}`}
          >
            <span className="text-sm">{themeIcons[theme]}</span>
          </button>
        </div>
      </div>
    </header>
  )
}
