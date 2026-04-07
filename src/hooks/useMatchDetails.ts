import { useState, useCallback } from 'react'
import type { LoadingState } from '@/types'
import type { MatchDetailWithMeta } from '@/services'
import { fetchAllMatchDetails } from '@/services'

interface UseMatchDetailsReturn {
  readonly matches: readonly MatchDetailWithMeta[]
  readonly state: LoadingState
  readonly error: string | null
  readonly loadData: () => Promise<void>
}

export function useMatchDetails(): UseMatchDetailsReturn {
  const [matches, setMatches] = useState<readonly MatchDetailWithMeta[]>([])
  const [state, setState] = useState<LoadingState>('idle')
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    setState('loading')
    setError(null)

    const result = await fetchAllMatchDetails()

    if (result.status === 'success') {
      setMatches(result.data)
      setState('success')
    } else {
      setError(result.error)
      setState('error')
    }
  }, [])

  return { matches, state, error, loadData }
}
