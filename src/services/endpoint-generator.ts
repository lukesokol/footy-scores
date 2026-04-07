import type { OlympicScheduleUnit, FootyScoresEndpoint, Score, MatchStatus } from '@/types'

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
  const home = unit.competitors.find((c) => c.order === 1) ?? unit.competitors[0]
  const away = unit.competitors.find((c) => c.order === 2) ?? unit.competitors[1]

  if (!home?.results?.mark || !away?.results?.mark) return null

  // Marks are in "H-A" format, e.g. "1-2"
  const parts = home.results.mark.split('-')
  if (parts.length !== 2) return null

  const homeScore = parseInt(parts[0] ?? '', 10)
  const awayScore = parseInt(parts[1] ?? '', 10)

  if (isNaN(homeScore) || isNaN(awayScore)) return null

  return {
    home: homeScore,
    away: awayScore,
    halfTime: { home: 0, away: 0 },
  }
}

function mapStatus(unit: OlympicScheduleUnit): MatchStatus {
  if (unit.status !== 'FINISHED') return 'NS'

  if (unit.resultStatus) {
    const rs = unit.resultStatus.toLowerCase()
    if (rs.includes('penalty')) return 'PEN'
    if (rs.includes('extra')) return 'AET'
  }

  return 'FT'
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
    status: mapStatus(unit),
    teams: {
      home: homeCompetitor?.name ?? 'TBD',
      homeNoc: homeCompetitor?.noc ?? '',
      away: awayCompetitor?.name ?? 'TBD',
      awayNoc: awayCompetitor?.noc ?? '',
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
