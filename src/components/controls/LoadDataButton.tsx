import type { LoadingState } from '@/types'

interface LoadDataButtonProps {
  readonly state: LoadingState
  readonly onLoad: () => void
  readonly onLoadFallback: () => void
}

export function LoadDataButton({ state, onLoad, onLoadFallback }: LoadDataButtonProps) {
  const isLoading = state === 'loading'

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onLoad}
        disabled={isLoading}
        className="bg-accent hover:bg-accent-hover rounded-lg px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isLoading ? 'Loading…' : 'Fetch Schedule'}
      </button>
      <button
        type="button"
        onClick={onLoadFallback}
        disabled={isLoading}
        className="border-border-subtle bg-surface-raised text-text-secondary hover:border-border-default hover:bg-surface-overlay rounded-lg border px-4 py-2 text-xs font-medium transition-colors active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Use Static Data
      </button>
    </div>
  )
}
