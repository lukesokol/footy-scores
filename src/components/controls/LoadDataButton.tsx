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
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? 'Loading…' : 'Fetch Schedule'}
      </button>
      <button
        type="button"
        onClick={onLoadFallback}
        disabled={isLoading}
        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Use Static Data
      </button>
    </div>
  )
}
