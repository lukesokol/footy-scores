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
      <div className="border-border-default flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-16 text-center">
        <div className="mb-3 text-3xl opacity-40">⚽</div>
        <p className="text-text-secondary text-sm">No matches found</p>
        <p className="text-text-muted mt-1 text-xs">
          Adjust your filters or load data to get started.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2" role="list" aria-label="Match list">
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
