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
      <fieldset
        className="border-border-subtle bg-surface-raised flex gap-0.5 rounded-lg border p-0.5"
        aria-label="Gender"
      >
        {genderOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onGenderChange(opt.value)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              gender === opt.value
                ? 'bg-surface-overlay text-text-primary shadow-sm'
                : 'text-text-muted hover:text-text-secondary'
            }`}
            aria-pressed={gender === opt.value}
          >
            {opt.label}
          </button>
        ))}
      </fieldset>

      <label className="text-text-secondary flex items-center gap-2 text-sm">
        <span className="sr-only">Round</span>
        <select
          value={round}
          onChange={(e) => onRoundChange(e.target.value)}
          className="border-border-subtle bg-surface-raised text-text-secondary focus:border-accent focus:ring-accent rounded-lg border px-3 py-1.5 text-xs focus:ring-1 focus:outline-none"
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
        className="border-border-subtle bg-surface-raised text-text-primary placeholder-text-muted focus:border-accent focus:ring-accent rounded-lg border px-3 py-1.5 text-xs focus:ring-1 focus:outline-none"
        aria-label="Search matches"
      />
    </div>
  )
}
