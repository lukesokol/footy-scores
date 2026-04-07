import type { OlympicScheduleUnit, FootyScoresEndpoint, Score } from '@/types'

function getCompetitionName(gender: 'M' | 'W'): string {
  return gender === 'M' ? 'Olympic Football Tournament Men' : 'Olympic Football Tournament Women'
}

function getRoundName(phaseName: string): string {
  const normalized = phaseName.trim()

  if (/^group\s+[a-d]$/i.test(normalized)) return normalized
  if (/quarter/i.test(normalized)) return 'Quarter-final'
  if (/semi/i.test(normalized)) return 'Semi-final'
  if (/bronze/i.test(normalized)) return 'Bronze Medal Match'
  if (/gold|final/i.test(normalized)) return 'Gold Medal Match'

  return normalized
}

function parseScore(unit: OlympicScheduleUnit): Score | null {
  const comp1 = unit.competitors[0]
  const comp2 = unit.competitors[1]

  if (!comp1?.results?.mark || !comp2?.results?.mark) return null

  const homeScore = parseInt(comp1.results.mark, 10)
  const awayScore = parseInt(comp2.results.mark, 10)

  if (isNaN(homeScore) || isNaN(awayScore)) return null

  return {
    home: homeScore,
    away: awayScore,
    halfTime: { home: 0, away: 0 },
  }
}

function genderSortOrder(gender: 'M' | 'W'): number {
  return gender === 'M' ? 0 : 1
}

export function generateEndpoint(unit: OlympicScheduleUnit): FootyScoresEndpoint {
  const homeCompetitor = unit.competitors.find((c) => c.order === 1) ?? unit.competitors[0]
  const awayCompetitor = unit.competitors.find((c) => c.order === 2) ?? unit.competitors[1]

  return {
    competition: {
      name: getCompetitionName(unit.gender),
      season: 'Paris 2024',
      round: getRoundName(unit.phaseName),
    },
    venue: {
      name: unit.venueDescription,
      city: unit.locationDescription,
    },
    kickoff: unit.startDate,
    status: unit.status === 'FINISHED' ? 'FT' : 'NS',
    teams: {
      home: homeCompetitor?.name ?? 'TBD',
      away: awayCompetitor?.name ?? 'TBD',
    },
    score: parseScore(unit),
    scorers: [],
    lineups: null,
  }
}

export function generateAllEndpoints(units: readonly OlympicScheduleUnit[]): FootyScoresEndpoint[] {
  const sortedUnits = [...units].sort((a, b) => {
    const dateCompare = a.startDate.localeCompare(b.startDate)
    if (dateCompare !== 0) return dateCompare

    const genderCompare = genderSortOrder(a.gender) - genderSortOrder(b.gender)
    if (genderCompare !== 0) return genderCompare

    return a.unitCode.localeCompare(b.unitCode)
  })

  return sortedUnits.map(generateEndpoint)
}
