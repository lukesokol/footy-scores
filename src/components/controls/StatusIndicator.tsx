import type { LoadingState } from '@/types'

interface StatusIndicatorProps {
  readonly state: LoadingState
  readonly error: string | null
  readonly matchCount: number
  readonly filteredCount: number
}

const stateConfig: Record<LoadingState, { color: string; label: string }> = {
  idle: { color: 'bg-gray-400', label: 'Ready' },
  loading: { color: 'bg-yellow-400 animate-pulse', label: 'Loading…' },
  success: { color: 'bg-green-500', label: 'Loaded' },
  error: { color: 'bg-red-500', label: 'Error' },
}

export function StatusIndicator({ state, error, matchCount, filteredCount }: StatusIndicatorProps) {
  const config = stateConfig[state]

  return (
    <div className="flex items-center gap-3 text-sm text-gray-600">
      <div className="flex items-center gap-1.5">
        <span className={`inline-block h-2.5 w-2.5 rounded-full ${config.color}`} aria-hidden />
        <span>{config.label}</span>
      </div>

      {state === 'success' && (
        <span>
          Showing {filteredCount} of {matchCount}
        </span>
      )}

      {error && <span className="text-red-600">{error}</span>}
    </div>
  )
}
