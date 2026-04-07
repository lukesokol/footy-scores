import type { FootyScoresEndpoint } from '@/types'
import { MatchCard } from './MatchCard'

interface MatchListProps {
  readonly endpoints: readonly FootyScoresEndpoint[]
  readonly selectedEndpoint: FootyScoresEndpoint | null
  readonly onSelectEndpoint: (endpoint: FootyScoresEndpoint) => void
}

export function MatchList({ endpoints, selectedEndpoint, onSelectEndpoint }: MatchListProps) {
  if (endpoints.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 px-6 py-12 text-center">
        <p className="text-gray-500">No matches found. Adjust your filters or load data.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="list" aria-label="Match list">
      {endpoints.map((ep) => (
        <div role="listitem" key={`${ep.kickoff}-${ep.teams.home}-${ep.teams.away}`}>
          <MatchCard
            endpoint={ep}
            onSelect={onSelectEndpoint}
            isSelected={
              selectedEndpoint !== null &&
              selectedEndpoint.kickoff === ep.kickoff &&
              selectedEndpoint.teams.home === ep.teams.home
            }
          />
        </div>
      ))}
    </div>
  )
}
