import type { OlympicsPhasesResponse, OlympicsMatchDetailResponse, ApiResult } from '@/types'

// Event codes for Paris 2024 football
const MEN_EVENT_CODE = 'FBLMTEAM11------------'
const WOMEN_EVENT_CODE = 'FBLWTEAM11------------'

const OLYMPICS_DATA_BASE = '/api/olympics-data'

function buildPhasesUrl(eventCode: string): string {
  return `${OLYMPICS_DATA_BASE}/SEL_Phases~comp=OG2024~lang=ENG~event=${eventCode}.json`
}

function buildMatchDetailUrl(unitCode: string): string {
  return `${OLYMPICS_DATA_BASE}/RES_ByRSC_H2H~comp=OG2024~disc=FBL~rscResult=${unitCode}~lang=ENG.json`
}

function isPhasesResponse(data: unknown): data is OlympicsPhasesResponse {
  if (typeof data !== 'object' || data === null) return false
  const obj = data as Record<string, unknown>
  if (typeof obj.event !== 'object' || obj.event === null) return false
  const event = obj.event as Record<string, unknown>
  return Array.isArray(event.phases)
}

function isMatchDetailResponse(data: unknown): data is OlympicsMatchDetailResponse {
  if (typeof data !== 'object' || data === null) return false
  const obj = data as Record<string, unknown>
  if (typeof obj.results !== 'object' || obj.results === null) return false
  const results = obj.results as Record<string, unknown>
  return Array.isArray(results.items)
}

/**
 * Extract all match unit codes from the phases response.
 * Filters out non-match phases (victory ceremonies, etc.)
 */
function extractUnitCodes(phases: OlympicsPhasesResponse): string[] {
  const codes: string[] = []
  for (const phase of phases.event.phases) {
    if (!phase.units) continue
    // Skip victory ceremony phases
    if (phase.type === '6') continue
    for (const unit of phase.units) {
      if (unit.type === 'HTEAM') {
        codes.push(unit.code)
      }
    }
  }
  return codes
}

/**
 * Fetch phase data for a single event and extract unit codes.
 */
async function fetchUnitCodesForEvent(eventCode: string): Promise<string[]> {
  const response = await fetch(buildPhasesUrl(eventCode))
  if (!response.ok) {
    console.warn(`Phases API returned ${String(response.status)} for ${eventCode}`)
    return []
  }

  const json: unknown = await response.json()
  if (!isPhasesResponse(json)) {
    console.warn(`Unexpected phases response shape for ${eventCode}`)
    return []
  }

  return extractUnitCodes(json)
}

/**
 * Fetch detailed match data for a single unit code.
 */
async function fetchMatchDetail(unitCode: string): Promise<OlympicsMatchDetailResponse | null> {
  try {
    const response = await fetch(buildMatchDetailUrl(unitCode))
    if (!response.ok) {
      console.warn(`Match detail API returned ${String(response.status)} for ${unitCode}`)
      return null
    }

    const json: unknown = await response.json()
    if (!isMatchDetailResponse(json)) {
      console.warn(`Unexpected match detail response shape for ${unitCode}`)
      return null
    }

    return json
  } catch (error) {
    console.warn(`Failed to fetch match detail for ${unitCode}:`, error)
    return null
  }
}

export interface MatchDetailWithMeta {
  readonly unitCode: string
  readonly gender: 'M' | 'W'
  readonly detail: OlympicsMatchDetailResponse
}

/**
 * Fetch all match details for both Men's and Women's football.
 * Returns an array of match details with gender metadata.
 */
export async function fetchAllMatchDetails(): Promise<ApiResult<MatchDetailWithMeta[]>> {
  try {
    // Step 1: Fetch unit codes for both events in parallel
    const [menCodes, womenCodes] = await Promise.all([
      fetchUnitCodesForEvent(MEN_EVENT_CODE),
      fetchUnitCodesForEvent(WOMEN_EVENT_CODE),
    ])

    if (menCodes.length === 0 && womenCodes.length === 0) {
      return { status: 'error', error: 'No match unit codes found from phases API' }
    }

    // Step 2: Fetch match details for all unit codes
    // Process in batches to avoid overwhelming the server
    const allRequests: { unitCode: string; gender: 'M' | 'W' }[] = [
      ...menCodes.map((code) => ({ unitCode: code, gender: 'M' as const })),
      ...womenCodes.map((code) => ({ unitCode: code, gender: 'W' as const })),
    ]

    const BATCH_SIZE = 10
    const results: MatchDetailWithMeta[] = []

    for (let i = 0; i < allRequests.length; i += BATCH_SIZE) {
      const batch = allRequests.slice(i, i + BATCH_SIZE)
      const batchResults = await Promise.all(
        batch.map(async ({ unitCode, gender }) => {
          const detail = await fetchMatchDetail(unitCode)
          if (!detail) return null
          return { unitCode, gender, detail }
        }),
      )

      for (const result of batchResults) {
        if (result) results.push(result)
      }
    }

    if (results.length === 0) {
      return { status: 'error', error: 'Failed to fetch any match details' }
    }

    return { status: 'success', data: results }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error fetching match data'
    return { status: 'error', error: message }
  }
}
