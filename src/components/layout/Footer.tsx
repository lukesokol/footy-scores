export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-4 text-center text-sm text-gray-500 sm:px-6 lg:px-8">
        FootyScores QA Tool &middot; Paris 2024 Olympic Games &middot; Source:{' '}
        <a
          href="https://www.olympics.com/en/paris-2024/schedule/football"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline hover:text-blue-800"
        >
          Official Schedule
        </a>
      </div>
    </footer>
  )
}
