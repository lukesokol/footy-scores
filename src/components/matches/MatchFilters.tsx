import { X } from 'lucide-react'
import type { GenderFilter, MatchDayFilter, RoundFilter } from '@/hooks'

export interface MatchFiltersProps {
  readonly gender: GenderFilter
  readonly round: RoundFilter
  readonly matchDay: MatchDayFilter
  readonly searchQuery: string
  readonly availableRounds: readonly string[]
  readonly availableDays: readonly string[]
  readonly onGenderChange: (g: GenderFilter) => void
  readonly onRoundChange: (r: RoundFilter) => void
  readonly onMatchDayChange: (d: MatchDayFilter) => void
  readonly onSearchChange: (q: string) => void
}

const genderOptions: { value: GenderFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
]

function formatDayOption(dateKey: string): string {
  const d = new Date(dateKey + 'T12:00:00Z')
  return d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export function MatchFilters({
  gender,
  round,
  matchDay,
  searchQuery,
  availableRounds,
  availableDays,
  onGenderChange,
  onRoundChange,
  onMatchDayChange,
  onSearchChange,
}: MatchFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <fieldset
        className="border-border-subtle bg-surface-raised flex gap-0.5 rounded-lg border p-0.5"
        aria-label="Gender"
      >
        <legend className="sr-only">Gender filter</legend>
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

      <select
        value={matchDay}
        onChange={(e) => onMatchDayChange(e.target.value)}
        className="border-border-subtle bg-surface-raised text-text-secondary focus:border-accent focus:ring-accent rounded-lg border px-3 py-1.5 text-xs focus:ring-1 focus:outline-none"
        aria-label="Filter by match day"
      >
        <option value="all">All days</option>
        {availableDays.map((d) => (
          <option key={d} value={d}>
            {formatDayOption(d)}
          </option>
        ))}
      </select>

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

      <div className="relative">
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search teams, venues…"
          className="border-border-subtle bg-surface-raised text-text-primary placeholder-text-muted focus:border-accent focus:ring-accent rounded-lg border px-3 py-1.5 pr-7 text-xs focus:ring-1 focus:outline-none"
          aria-label="Search matches"
        />
        {searchQuery.length > 0 && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="text-text-muted hover:text-text-secondary absolute top-1/2 right-2 -translate-y-1/2"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  )
}
