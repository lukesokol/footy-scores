import { useCallback, useState } from 'react'
import {
  useMatchDetails,
  useOlympicSchedule,
  useEndpointGenerator,
  useEndpointGeneratorFromDetails,
  useExport,
  useMatchFilters,
} from '@/hooks'
import { Layout } from '@/components/layout'
import { MatchList, MatchModal, MatchFilters } from '@/components/matches'
import { LoadDataButton, ExportButton, StatusIndicator } from '@/components/controls'
import type { FootyScoresEndpoint } from '@/types'

function App() {
  const { matches, state: detailState, error: detailError, loadData } = useMatchDetails()
  const {
    units,
    state: scheduleState,
    error: scheduleError,
    loadFallback,
  } = useOlympicSchedule()

  const { endpoints: detailEndpoints } = useEndpointGeneratorFromDetails(matches)
  const { endpoints: scheduleEndpoints } = useEndpointGenerator(units)

  // Use whichever data source was loaded
  const endpoints = detailEndpoints.length > 0 ? detailEndpoints : scheduleEndpoints
  const count = endpoints.length
  const state = detailState === 'success' || scheduleState === 'success'
    ? 'success' as const
    : detailState === 'loading' ? 'loading' as const
    : detailState === 'error' ? detailState
    : scheduleState !== 'idle' ? scheduleState
    : detailState
  const error = detailError ?? scheduleError

  const {
    gender,
    round,
    matchDay,
    searchQuery,
    filtered,
    availableRounds,
    availableDays,
    setGender,
    setRound,
    setMatchDay,
    setSearchQuery,
  } = useMatchFilters(endpoints)
  const { exportAsJson, copyToClipboard } = useExport(filtered)
  const [selectedEndpoint, setSelectedEndpoint] = useState<FootyScoresEndpoint | null>(null)
  const clearSelected = useCallback(() => setSelectedEndpoint(null), [])

  return (
    <Layout matchCount={count}>
      {/* Controls bar */}
      <div className="border-border-subtle bg-surface-raised mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4">
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
            matchDay={matchDay}
            searchQuery={searchQuery}
            availableRounds={availableRounds}
            availableDays={availableDays}
            onGenderChange={setGender}
            onRoundChange={setRound}
            onMatchDayChange={setMatchDay}
            onSearchChange={setSearchQuery}
          />
        </div>
      )}

      {/* Match grid (full width) */}
      <MatchList
        endpoints={filtered}
        selectedEndpoint={selectedEndpoint}
        onSelectEndpoint={setSelectedEndpoint}
      />

      {/* Match detail + JSON modal */}
      <MatchModal endpoint={selectedEndpoint} onClose={clearSelected} />
    </Layout>
  )
}

export default App
