import { useMemo } from 'react'
import type { OlympicScheduleUnit, FootyScoresEndpoint } from '@/types'
import type { MatchDetailWithMeta } from '@/services'
import { generateAllEndpoints, generateAllEndpointsFromDetails } from '@/services'

interface UseEndpointGeneratorReturn {
  readonly endpoints: readonly FootyScoresEndpoint[]
  readonly count: number
}

/**
 * Generate endpoints from legacy schedule units.
 */
export function useEndpointGenerator(
  units: readonly OlympicScheduleUnit[],
): UseEndpointGeneratorReturn {
  const endpoints = useMemo(() => generateAllEndpoints(units), [units])

  return { endpoints, count: endpoints.length }
}

/**
 * Generate endpoints from rich match detail data (RES_ByRSC_H2H).
 * Includes real scorers, lineups, half-time scores, and formations.
 */
export function useEndpointGeneratorFromDetails(
  matches: readonly MatchDetailWithMeta[],
): UseEndpointGeneratorReturn {
  const endpoints = useMemo(() => generateAllEndpointsFromDetails(matches), [matches])

  return { endpoints, count: endpoints.length }
}
