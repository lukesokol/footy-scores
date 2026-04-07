import { useState } from 'react'
import { useOlympicSchedule, useEndpointGenerator, useExport, useMatchFilters } from '@/hooks'
import { Layout } from '@/components/layout'
import { MatchList, MatchFilters, EndpointPreview } from '@/components/matches'
import { LoadDataButton, ExportButton, StatusIndicator } from '@/components/controls'
import type { FootyScoresEndpoint } from '@/types'

function App() {
  const { units, state, error, loadData, loadFallback } = useOlympicSchedule()
  const { endpoints, count } = useEndpointGenerator(units)
  const {
    gender,
    round,
    searchQuery,
    filtered,
    availableRounds,
    setGender,
    setRound,
    setSearchQuery,
  } = useMatchFilters(endpoints)
  const { exportAsJson, copyToClipboard } = useExport(filtered)
  const [selectedEndpoint, setSelectedEndpoint] = useState<FootyScoresEndpoint | null>(null)

  return (
    <Layout matchCount={count}>
      {/* Controls bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border-subtle bg-surface-raised p-4">
        <LoadDataButton state={state} onLoad={loadData} onLoadFallback={loadFallback} />
        <StatusIndicator
          state={state}
          error={error}
          matchCount={count}
          filteredCount={filtered.length}
        />
        <ExportButton
          onExportJson={exportAsJson}
          onCopyClipboard={copyToClipboard}
          disabled={filtered.length === 0}
        />
      </div>

      {/* Filters */}
      {state === 'success' && (
        <div className="mb-6">
          <MatchFilters
            gender={gender}
            round={round}
            searchQuery={searchQuery}
            availableRounds={availableRounds}
            onGenderChange={setGender}
            onRoundChange={setRound}
            onSearchChange={setSearchQuery}
          />
        </div>
      )}

      {/* Content: match grid + preview */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <MatchList
          endpoints={filtered}
          selectedEndpoint={selectedEndpoint}
          onSelectEndpoint={setSelectedEndpoint}
        />
        <div className="lg:sticky lg:top-6 lg:self-start">
          <EndpointPreview endpoint={selectedEndpoint} />
        </div>
      </div>
    </Layout>
  )
}

export default App
