interface HeaderProps {
  readonly matchCount: number
}

export function Header({ matchCount }: HeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="text-2xl" role="img" aria-label="football">
            ⚽
          </span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">FootyScores</h1>
            <p className="text-sm text-gray-500">Paris 2024 Olympic Football — QA Endpoint Tool</p>
          </div>
        </div>
        {matchCount > 0 && (
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
            {matchCount} matches
          </span>
        )}
      </div>
    </header>
  )
}
