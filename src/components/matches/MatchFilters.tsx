import type { GenderFilter, RoundFilter } from '@/hooks'

interface MatchFiltersProps {
  readonly gender: GenderFilter
  readonly round: RoundFilter
  readonly searchQuery: string
  readonly availableRounds: readonly string[]
  readonly onGenderChange: (g: GenderFilter) => void
  readonly onRoundChange: (r: RoundFilter) => void
  readonly onSearchChange: (q: string) => void
}

const genderOptions: { value: GenderFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
]

export function MatchFilters({
  gender,
  round,
  searchQuery,
  availableRounds,
  onGenderChange,
  onRoundChange,
  onSearchChange,
}: MatchFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <fieldset className="flex gap-1 rounded-lg border border-gray-200 p-1" aria-label="Gender">
        {genderOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onGenderChange(opt.value)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              gender === opt.value ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
            aria-pressed={gender === opt.value}
          >
            {opt.label}
          </button>
        ))}
      </fieldset>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <span className="sr-only">Round</span>
        <select
          value={round}
          onChange={(e) => onRoundChange(e.target.value)}
          className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          aria-label="Filter by round"
        >
          <option value="all">All rounds</option>
          {availableRounds.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>

      <input
        type="search"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search teams, venues…"
        className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        aria-label="Search matches"
      />
    </div>
  )
}
