import { useState, useCallback } from 'react'
import type { OlympicScheduleUnit, LoadingState } from '@/types'
import { fetchOlympicSchedule, loadFallbackSchedule } from '@/services'

interface UseOlympicScheduleReturn {
  readonly units: readonly OlympicScheduleUnit[]
  readonly state: LoadingState
  readonly error: string | null
  readonly loadData: () => Promise<void>
  readonly loadFallback: () => void
}

export function useOlympicSchedule(): UseOlympicScheduleReturn {
  const [units, setUnits] = useState<readonly OlympicScheduleUnit[]>([])
  const [state, setState] = useState<LoadingState>('idle')
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    setState('loading')
    setError(null)

    const result = await fetchOlympicSchedule()

    if (result.status === 'success') {
      setUnits(result.data)
      setState('success')
    } else {
      setError(result.error)
      setState('error')
    }
  }, [])

  const loadFallback = useCallback(() => {
    setUnits(loadFallbackSchedule())
    setState('success')
    setError(null)
  }, [])

  return { units, state, error, loadData, loadFallback }
}
