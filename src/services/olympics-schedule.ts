import type { OlympicScheduleUnit, ApiResult } from '@/types'
import fallbackData from '@/data/paris2024-schedule.json'

const OLYMPICS_API_PATH = '/api/olympics/summer/schedules/api/ENG/schedule/sport/FBL'

function isScheduleUnitArray(data: unknown): data is { units: OlympicScheduleUnit[] } {
  if (typeof data !== 'object' || data === null) return false
  const obj = data as Record<string, unknown>
  return Array.isArray(obj.units)
}

function getFallbackData(): OlympicScheduleUnit[] {
  return fallbackData as unknown as OlympicScheduleUnit[]
}

export async function fetchOlympicSchedule(): Promise<ApiResult<OlympicScheduleUnit[]>> {
  try {
    const response = await fetch(OLYMPICS_API_PATH)

    if (!response.ok) {
      console.warn(`Olympics API returned ${String(response.status)}, falling back to static data`)
      return { status: 'success', data: getFallbackData() }
    }

    const json: unknown = await response.json()

    if (isScheduleUnitArray(json)) {
      const footballUnits = json.units.filter((u) => u.disciplineCode === 'FBL')
      return { status: 'success', data: footballUnits }
    }

    console.warn('Unexpected API response shape, falling back to static data')
    return { status: 'success', data: getFallbackData() }
  } catch {
    console.warn('Olympics API unavailable, using static fallback data')
    return { status: 'success', data: getFallbackData() }
  }
}

export function loadFallbackSchedule(): OlympicScheduleUnit[] {
  return getFallbackData()
}
