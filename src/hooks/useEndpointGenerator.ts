import { useMemo } from 'react'
import type { OlympicScheduleUnit, FootyScoresEndpoint } from '@/types'
import { generateAllEndpoints } from '@/services'

interface UseEndpointGeneratorReturn {
  readonly endpoints: readonly FootyScoresEndpoint[]
  readonly count: number
}

export function useEndpointGenerator(
  units: readonly OlympicScheduleUnit[],
): UseEndpointGeneratorReturn {
  const endpoints = useMemo(() => generateAllEndpoints(units), [units])

  return { endpoints, count: endpoints.length }
}
