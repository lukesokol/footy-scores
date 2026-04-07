import type { FootyScoresEndpoint } from '@/types'

interface MatchCardProps {
  readonly endpoint: FootyScoresEndpoint
  readonly onSelect: (endpoint: FootyScoresEndpoint) => void
  readonly isSelected: boolean
}

function formatKickoff(kickoff: string): string {
  const date = new Date(kickoff)
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  })
}

export function MatchCard({ endpoint, onSelect, isSelected }: MatchCardProps) {
  const isMen = endpoint.competition.name.includes('Men')
  const genderBadge = isMen ? 'Men' : 'Women'
  const genderColor = isMen ? 'bg-men-bg text-men' : 'bg-women-bg text-women'

  return (
    <button
      type="button"
      onClick={() => onSelect(endpoint)}
      aria-pressed={isSelected}
      aria-label={`${endpoint.teams.home} vs ${endpoint.teams.away}, ${genderBadge}, ${endpoint.competition.round}, ${endpoint.status}`}
      className={`group w-full rounded-xl border p-4 text-left transition-all duration-200 active:scale-[0.98] ${
        isSelected
          ? 'border-accent bg-accent/5 ring-accent/30 ring-1'
          : 'border-border-subtle bg-surface-raised hover:border-border-default hover:bg-surface-overlay'
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${genderColor}`}>
          {genderBadge}
        </span>
        <span className="text-text-muted text-xs">{endpoint.competition.round}</span>
      </div>

      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-text-primary truncate text-sm font-medium">
          {endpoint.teams.home}
        </span>
        {endpoint.score ? (
          <span className="bg-surface-overlay text-text-primary shrink-0 rounded-md px-2.5 py-1 font-mono text-sm font-semibold">
            {endpoint.score.home} – {endpoint.score.away}
          </span>
        ) : (
          <span className="text-text-muted shrink-0 text-xs">vs</span>
        )}
        <span className="text-text-primary truncate text-right text-sm font-medium">
          {endpoint.teams.away}
        </span>
      </div>

      <div className="text-text-muted flex items-center justify-between text-xs">
        <span>{formatKickoff(endpoint.kickoff)}</span>
        <div className="flex items-center gap-2">
          <span>{endpoint.venue.city}</span>
          <span
            className={`inline-block rounded-full px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${
              endpoint.status === 'FT'
                ? 'bg-success-bg text-success'
                : 'bg-surface-overlay text-warning'
            }`}
            aria-label={`Match status: ${endpoint.status === 'FT' ? 'Full Time' : 'Scheduled'}`}
          >
            {endpoint.status}
          </span>
        </div>
      </div>
    </button>
  )
}
