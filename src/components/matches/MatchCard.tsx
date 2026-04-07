import { Clock, MapPin } from 'lucide-react'
import type { FootyScoresEndpoint } from '@/types'
import { nocToFlag } from '@/lib/flags'

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

const statusLabel: Record<string, string> = {
  FT: 'Full Time',
  AET: 'After Extra Time',
  PEN: 'After Penalties',
  NS: 'Scheduled',
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
      aria-label={`${endpoint.teams.home} vs ${endpoint.teams.away}, ${genderBadge}, ${endpoint.competition.round}, ${statusLabel[endpoint.status] ?? endpoint.status}`}
      className={`group w-full rounded-xl border p-4 text-left transition-all duration-200 active:scale-[0.98] ${
        isSelected
          ? 'border-accent bg-accent/5 ring-accent/30 ring-1'
          : 'border-border-subtle bg-surface-raised hover:border-border-default hover:bg-surface-overlay'
      }`}
    >
      {/* Header: gender badge + round */}
      <div className="mb-3 flex items-center justify-between">
        <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${genderColor}`}>
          {genderBadge}
        </span>
        <span className="text-text-muted text-xs">{endpoint.competition.round}</span>
      </div>

      {/* Teams + score — fixed 3-column grid for centering */}
      <div className="mb-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        {/* Home team */}
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="shrink-0 text-base" aria-hidden>
            {nocToFlag(endpoint.teams.homeNoc)}
          </span>
          <span className="text-text-primary truncate text-sm font-medium">
            {endpoint.teams.home}
          </span>
        </div>

        {/* Score (always centered) */}
        {endpoint.score ? (
          <div className="flex flex-col items-center">
            <span className="bg-surface-overlay text-text-primary rounded-md px-3 py-1 font-mono text-sm font-semibold">
              {endpoint.score.home} – {endpoint.score.away}
            </span>
            {(endpoint.status === 'AET' || endpoint.status === 'PEN') && (
              <span className="text-text-muted mt-0.5 text-[10px] font-medium uppercase">
                {endpoint.status}
              </span>
            )}
          </div>
        ) : (
          <span className="text-text-muted text-xs">vs</span>
        )}

        {/* Away team */}
        <div className="flex items-center justify-end gap-2 overflow-hidden">
          <span className="text-text-primary truncate text-right text-sm font-medium">
            {endpoint.teams.away}
          </span>
          <span className="shrink-0 text-base" aria-hidden>
            {nocToFlag(endpoint.teams.awayNoc)}
          </span>
        </div>
      </div>

      {/* Footer: kickoff + venue + status */}
      <div className="text-text-muted flex items-center justify-between text-xs">
        <div className="flex items-center gap-1">
          <Clock size={12} aria-hidden />
          <span>{formatKickoff(endpoint.kickoff)}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <MapPin size={12} aria-hidden />
            <span>{endpoint.venue.city}</span>
          </div>
          <span
            className={`inline-block rounded-full px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${
              endpoint.status === 'FT' || endpoint.status === 'AET' || endpoint.status === 'PEN'
                ? 'bg-success-bg text-success'
                : 'bg-surface-overlay text-warning'
            }`}
            aria-label={`Match status: ${statusLabel[endpoint.status] ?? endpoint.status}`}
          >
            {endpoint.status}
          </span>
        </div>
      </div>
    </button>
  )
}
