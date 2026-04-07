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
  const genderColor = isMen ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'

  return (
    <button
      type="button"
      onClick={() => onSelect(endpoint)}
      aria-pressed={isSelected}
      className={`w-full rounded-lg border p-4 text-left transition-colors hover:border-blue-300 hover:bg-blue-50 ${
        isSelected ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-200 bg-white'
      }`}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className={`rounded px-2 py-0.5 text-xs font-medium ${genderColor}`}>
          {genderBadge}
        </span>
        <span className="text-xs text-gray-500">{endpoint.competition.round}</span>
      </div>

      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="truncate font-semibold text-gray-900">{endpoint.teams.home}</span>
        {endpoint.score ? (
          <span className="shrink-0 rounded bg-gray-900 px-2 py-0.5 text-sm font-bold text-white">
            {endpoint.score.home} – {endpoint.score.away}
          </span>
        ) : (
          <span className="shrink-0 text-sm text-gray-400">vs</span>
        )}
        <span className="truncate text-right font-semibold text-gray-900">
          {endpoint.teams.away}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{formatKickoff(endpoint.kickoff)}</span>
        <span>{endpoint.venue.city}</span>
      </div>

      <div className="mt-1 text-right">
        <span
          className={`inline-block rounded px-1.5 py-0.5 text-xs font-medium ${
            endpoint.status === 'FT'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {endpoint.status}
        </span>
      </div>
    </button>
  )
}
