interface HeaderProps {
  readonly matchCount: number
}

export function Header({ matchCount }: HeaderProps) {
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
        {matchCount > 0 && (
          <span className="bg-accent/10 text-accent rounded-full px-3 py-1 text-xs font-medium">
            {matchCount} matches
          </span>
        )}
      </div>
    </header>
  )
}
