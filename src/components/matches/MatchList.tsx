import { SearchX } from 'lucide-react'
import type { FootyScoresEndpoint } from '@/types'
import { MatchCard } from './MatchCard'

export interface MatchListProps {
  readonly endpoints: readonly FootyScoresEndpoint[]
  readonly selectedEndpoint: FootyScoresEndpoint | null
  readonly onSelectEndpoint: (endpoint: FootyScoresEndpoint) => void
}

function formatDayHeader(dateKey: string): string {
  const d = new Date(dateKey + 'T12:00:00Z')
  return d.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function groupByDate(
  endpoints: readonly FootyScoresEndpoint[],
): Map<string, FootyScoresEndpoint[]> {
  const groups = new Map<string, FootyScoresEndpoint[]>()
  for (const ep of endpoints) {
    const dateKey = ep.kickoff.slice(0, 10)
    const group = groups.get(dateKey)
    if (group) {
      group.push(ep)
    } else {
      groups.set(dateKey, [ep])
    }
  }
  return groups
}

export function MatchList({ endpoints, selectedEndpoint, onSelectEndpoint }: MatchListProps) {
  if (endpoints.length === 0) {
    return (
      <div className="border-border-default flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-16 text-center">
        <SearchX size={32} className="text-text-muted mb-3 opacity-40" aria-hidden />
        <p className="text-text-secondary text-sm">No matches found</p>
        <p className="text-text-muted mt-1 text-xs">
          Adjust your filters or load data to get started.
        </p>
      </div>
    )
  }

  const dayGroups = groupByDate(endpoints)

  return (
    <div className="space-y-6" role="list" aria-label="Match list">
      {[...dayGroups.entries()].map(([dateKey, dayEndpoints]) => (
        <section key={dateKey} aria-label={formatDayHeader(dateKey)}>
          <h3 className="text-text-secondary border-border-subtle mb-3 border-b pb-1 text-sm font-semibold">
            {formatDayHeader(dateKey)}
            <span className="text-text-muted ml-2 font-normal">
              ({dayEndpoints.length} {dayEndpoints.length === 1 ? 'match' : 'matches'})
            </span>
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {dayEndpoints.map((ep) => (
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
        </section>
      ))}
    </div>
  )
}
