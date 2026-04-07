export function Footer() {
  return (
    <footer className="border-border-subtle bg-surface-raised border-t">
      <div className="text-text-muted mx-auto max-w-7xl px-4 py-4 text-center text-xs sm:px-6 lg:px-8">
        FootyScores QA Tool &middot; Paris 2024 Olympic Games &middot; Source:{' '}
        <a
          href="https://www.olympics.com/en/paris-2024/schedule/football"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:text-accent-hover transition-colors"
        >
          Official Schedule
        </a>
      </div>
    </footer>
  )
}
