import type { LoadingState } from '@/types'

interface StatusIndicatorProps {
  readonly state: LoadingState
  readonly error: string | null
  readonly matchCount: number
  readonly filteredCount: number
}

const stateConfig: Record<LoadingState, { color: string; label: string }> = {
  idle: { color: 'bg-text-muted', label: 'Ready' },
  loading: { color: 'bg-warning animate-pulse', label: 'Loading…' },
  success: { color: 'bg-success', label: 'Loaded' },
  error: { color: 'bg-error', label: 'Error' },
}

export function StatusIndicator({ state, error, matchCount, filteredCount }: StatusIndicatorProps) {
  const config = stateConfig[state]

  return (
    <div className="flex flex-col gap-2">
      <div
        className="text-text-secondary flex items-center gap-3 text-xs"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center gap-1.5">
          <span className={`inline-block h-2 w-2 rounded-full ${config.color}`} aria-hidden />
          <span>{config.label}</span>
        </div>

        {state === 'success' && (
          <span className="text-text-muted">
            Showing {filteredCount} of {matchCount}
          </span>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="bg-error/10 border-error/30 text-error rounded-lg border px-3 py-2 text-xs"
        >
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  )
}
