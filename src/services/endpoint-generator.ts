import type {
  OlympicScheduleUnit,
  FootyScoresEndpoint,
  Score,
  MatchStatus,
  Scorer,
  Lineups,
  LineupEntry,
  Player,
} from '@/types'
import type {
  OlympicsMatchResults,
  OlympicsMatchTeam,
  OlympicsPlayByPlayAction,
  OlympicsPlayByPlayPeriod,
  OlympicsTeamAthlete,
  OlympicsEventUnitEntry,
} from '@/types'
import type { MatchDetailWithMeta } from './olympics-api'

// ---------------------------------------------------------------------------
// Helpers shared by both legacy and rich data paths
// ---------------------------------------------------------------------------

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

function genderSortOrder(gender: 'M' | 'W'): number {
  return gender === 'M' ? 0 : 1
}

// ---------------------------------------------------------------------------
// Legacy path — from OlympicScheduleUnit (basic schedule data)
// ---------------------------------------------------------------------------

function parseScoreLegacy(unit: OlympicScheduleUnit): Score | null {
  const home = unit.competitors.find((c) => c.order === 1) ?? unit.competitors[0]
  const away = unit.competitors.find((c) => c.order === 2) ?? unit.competitors[1]

  if (!home?.results?.mark || !away?.results?.mark) return null

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

function mapStatusLegacy(unit: OlympicScheduleUnit): MatchStatus {
  if (unit.status !== 'FINISHED') return 'NS'

  if (unit.resultStatus) {
    const rs = unit.resultStatus.toLowerCase()
    if (rs.includes('penalty')) return 'PEN'
    if (rs.includes('extra')) return 'AET'
  }

  return 'FT'
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
    status: mapStatusLegacy(unit),
    teams: {
      home: homeCompetitor?.name ?? 'TBD',
      homeNoc: homeCompetitor?.noc ?? '',
      away: awayCompetitor?.name ?? 'TBD',
      awayNoc: awayCompetitor?.noc ?? '',
    },
    score: parseScoreLegacy(unit),
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

// ---------------------------------------------------------------------------
// Rich data path — from MatchDetailWithMeta (RES_ByRSC_H2H)
// ---------------------------------------------------------------------------

function getEntryValue(
  entries: readonly OlympicsEventUnitEntry[],
  code: string,
): string | undefined {
  return entries.find((e) => e.eue_code === code)?.eue_value
}

function identifyHomeAway(
  items: readonly OlympicsMatchTeam[],
): { home: OlympicsMatchTeam; away: OlympicsMatchTeam } | null {
  const home = items.find((item) => getEntryValue(item.eventUnitEntries, 'HOME_AWAY') === 'HOME')
  const away = items.find((item) => getEntryValue(item.eventUnitEntries, 'HOME_AWAY') === 'AWAY')
  if (!home || !away) return null
  return { home, away }
}

function parseScoreRich(results: OlympicsMatchResults): Score | null {
  const totPeriod = results.periods.find((p) => p.p_code === 'TOT')
  if (!totPeriod) return null

  const homeTotal = parseInt(totPeriod.home.score, 10)
  const awayTotal = parseInt(totPeriod.away.score, 10)
  if (isNaN(homeTotal) || isNaN(awayTotal)) return null

  const h1Period = results.periods.find((p) => p.p_code === 'H1')
  const homeHT = h1Period ? parseInt(h1Period.home.score, 10) : 0
  const awayHT = h1Period ? parseInt(h1Period.away.score, 10) : 0

  return {
    home: homeTotal,
    away: awayTotal,
    halfTime: {
      home: isNaN(homeHT) ? 0 : homeHT,
      away: isNaN(awayHT) ? 0 : awayHT,
    },
  }
}

function mapStatusRich(results: OlympicsMatchResults): MatchStatus {
  const statusCode = results.schedule.status.code
  if (statusCode !== 'FINISHED') return 'NS'

  // Check if there are extra-time or penalty periods
  const hasPenPeriod = results.periods.some((p) => p.p_code === 'PEN_PHASE')
  if (hasPenPeriod) return 'PEN'

  const hasExtraPeriod = results.periods.some(
    (p) => p.p_code === 'EXT' || p.p_code === 'EX1' || p.p_code === 'EX2',
  )
  if (hasExtraPeriod) return 'AET'

  // Fallback: check extendedInfos for PERIOD value
  const periodInfo = results.extendedInfos?.find((ei) => ei.ei_code === 'PERIOD')
  if (periodInfo) {
    const val = periodInfo.ei_value.toUpperCase()
    if (val.includes('PEN')) return 'PEN'
    if (val.includes('AET') || val.includes('EXT')) return 'AET'
  }

  return 'FT'
}

/** Parse minute from the pbpa_When format, e.g. "45' +2" → 47, "68'" → 68 */
function parseMinute(when: string): number {
  const match = when.match(/^(\d+)'/)
  const base = match ? parseInt(match[1] ?? '0', 10) : 0
  const addedMatch = when.match(/\+(\d+)/)
  const added = addedMatch ? parseInt(addedMatch[1] ?? '0', 10) : 0
  return base + added
}

/** Resolve an athlete code to their display name from the team roster */
function resolveAthleteName(team: OlympicsMatchTeam, athleteCode: string): string {
  const athlete = team.teamAthletes.find((a) => a.participantCode === athleteCode)
  if (!athlete) return 'Unknown'

  // Prefer SHIRT_NAME from registered events, else use TVName or name
  const shirtEntry = athlete.athlete.registeredEvents
    ?.flatMap((re) => re.eventEntries)
    .find((ee) => ee.ee_code === 'SHIRT_NAME')

  if (shirtEntry) {
    // Format: "BELLINGHAM" → "J. Bellingham" using given name initial
    const given = athlete.athlete.givenName
    const family = athlete.athlete.familyName
    if (given && family) {
      return `${given.charAt(0)}. ${family}`
    }
  }

  // Use givenName + familyName for a clean format
  const { givenName, familyName } = athlete.athlete
  if (givenName && familyName) {
    return `${givenName.charAt(0)}. ${familyName}`
  }

  return athlete.athlete.name
}

function extractGoalType(action: OlympicsPlayByPlayAction): string {
  if (action.pbpa_Action === 'PEN') return 'penalty'

  // Check for own goals via VAR
  if (action.extendedActions?.some((ea) => ea.pbpea_value === 'OG')) return 'own_goal'

  return 'open_play'
}

function extractScorers(
  playByPlay: readonly OlympicsPlayByPlayPeriod[] | undefined,
  home: OlympicsMatchTeam,
  away: OlympicsMatchTeam,
): Scorer[] {
  if (!playByPlay) return []

  const scorers: Scorer[] = []

  for (const period of playByPlay) {
    for (const action of period.actions) {
      // Goals: SHOT with Result=GOAL, or PEN with Result=GOAL
      const isGoal =
        (action.pbpa_Action === 'SHOT' || action.pbpa_Action === 'PEN') &&
        action.pbpa_Result === 'GOAL'

      if (!isGoal) continue

      // Check for VAR-disallowed goals in the same period
      const wasDisallowed = period.actions.some(
        (a) =>
          a.pbpa_Action === 'VAR' &&
          a.pbpa_Result?.startsWith('CHANGED_GOAL') &&
          a.pbpa_When === action.pbpa_When,
      )
      if (wasDisallowed) continue

      const scorerCompetitor = action.competitors?.[0]
      if (!scorerCompetitor) continue

      const scorerAthlete = scorerCompetitor.athletes?.find((a) => a.pbpat_role === 'SCR')
      const assistAthlete = scorerCompetitor.athletes?.find((a) => a.pbpat_role === 'ASSIST')

      if (!scorerAthlete) continue

      // Determine which team scored
      const isHomeTeam = scorerCompetitor.pbpc_code === home.teamCode
      const team = isHomeTeam ? home : away
      const teamName = team.participant.name

      const scorer: Scorer = {
        team: teamName,
        player: resolveAthleteName(team, scorerAthlete.pbpat_code),
        minute: parseMinute(action.pbpa_When),
        type: extractGoalType(action),
        ...(assistAthlete ? { assist: resolveAthleteName(team, assistAthlete.pbpat_code) } : {}),
      }

      scorers.push(scorer)
    }
  }

  // Sort by minute for deterministic output
  scorers.sort((a, b) => a.minute - b.minute)

  return scorers
}

function mapPosition(posCode: string): string {
  switch (posCode) {
    case 'GK':
      return 'GK'
    case 'DF':
      return 'DF'
    case 'MF':
      return 'MF'
    case 'FW':
      return 'FW'
    default:
      return posCode
  }
}

function buildPlayer(athlete: OlympicsTeamAthlete): Player {
  const { givenName, familyName } = athlete.athlete
  const name = givenName && familyName ? `${givenName} ${familyName}` : athlete.athlete.name

  const posEntry = athlete.eventUnitEntries?.find(
    (e) => e.eue_code === 'POSITION' && e.eue_pos === '1',
  )
  const position = posEntry ? mapPosition(posEntry.eue_value) : ''

  return {
    name,
    number: parseInt(athlete.bib, 10) || 0,
    position,
  }
}

function buildLineupEntry(team: OlympicsMatchTeam): LineupEntry {
  const formation = getEntryValue(team.eventUnitEntries, 'FORMATION') ?? ''
  const headCoach = team.teamCoaches.find((c) => c.function.functionCode === 'COACH')
  const coachName = headCoach ? `${headCoach.coach.givenName} ${headCoach.coach.familyName}` : ''

  const starters: Player[] = []
  const bench: Player[] = []

  for (const athlete of team.teamAthletes) {
    const isStarter = athlete.eventUnitEntries?.some(
      (e) => e.eue_code === 'STARTER' && e.eue_value === 'Y',
    )

    const player = buildPlayer(athlete)

    if (isStarter) {
      starters.push(player)
    } else {
      bench.push(player)
    }
  }

  // Sort starters by position order: GK, DF, MF, FW
  const posOrder: Record<string, number> = { GK: 0, DF: 1, MF: 2, FW: 3 }
  starters.sort((a, b) => {
    const pa = posOrder[a.position] ?? 9
    const pb = posOrder[b.position] ?? 9
    if (pa !== pb) return pa - pb
    return a.number - b.number
  })

  // Sort bench by number
  bench.sort((a, b) => a.number - b.number)

  return {
    team: team.participant.name,
    formation,
    coach: coachName,
    startingXI: starters,
    bench,
  }
}

function extractLineups(home: OlympicsMatchTeam, away: OlympicsMatchTeam): Lineups | null {
  if (home.teamAthletes.length === 0 && away.teamAthletes.length === 0) {
    return null
  }

  return {
    home: buildLineupEntry(home),
    away: buildLineupEntry(away),
  }
}

function getRoundNameFromDescription(description: string): string {
  const d = description.trim()

  if (/group\s+[a-d]/i.test(d)) {
    const groupMatch = d.match(/group\s+([a-d])/i)
    return groupMatch ? `Group ${groupMatch[1]?.toUpperCase() ?? ''}` : d
  }
  if (/quarter/i.test(d)) return 'Quarter-final'
  if (/semi/i.test(d)) return 'Semi-final'
  if (/bronze/i.test(d)) return 'Bronze Medal Match'
  if (/gold/i.test(d)) return 'Gold Medal Match'
  if (/final/i.test(d) && !/semi|quarter/i.test(d)) return 'Gold Medal Match'

  return d
}

function getVenueCity(location: { description: string; shortDescription: string }): string {
  // location.description is like "Geoffroy-Guichard, St-Etienne"
  // Extract city from the part after the last comma
  const parts = location.description.split(',')
  return parts.length > 1
    ? (parts[parts.length - 1]?.trim() ?? location.description)
    : location.description
}

/**
 * Generate a single endpoint from rich match detail data (RES_ByRSC_H2H).
 */
export function generateEndpointFromDetail(match: MatchDetailWithMeta): FootyScoresEndpoint {
  const { results } = match.detail
  const sides = identifyHomeAway(results.items)

  // Fallback to sort order if HOME_AWAY entries aren't present
  const home = sides?.home ?? results.items[0]
  const away = sides?.away ?? results.items[1]

  if (!home || !away) {
    // Shouldn't happen in valid data, but handle gracefully
    return {
      competition: {
        name: getCompetitionName(match.gender),
        season: 'Paris 2024',
        round: getRoundNameFromDescription(results.eventUnit.description),
      },
      venue: {
        name: results.schedule.venue.description,
        city: getVenueCity(results.schedule.location),
      },
      kickoff: results.schedule.startDate,
      status: mapStatusRich(results),
      teams: { home: 'TBD', homeNoc: '', away: 'TBD', awayNoc: '' },
      score: null,
      scorers: [],
      lineups: null,
    }
  }

  return {
    competition: {
      name: getCompetitionName(match.gender),
      season: 'Paris 2024',
      round: getRoundNameFromDescription(results.eventUnit.description),
    },
    venue: {
      name: results.schedule.venue.description,
      city: getVenueCity(results.schedule.location),
    },
    kickoff: results.schedule.startDate,
    status: mapStatusRich(results),
    teams: {
      home: home.participant.name,
      homeNoc: home.participant.organisation.code,
      away: away.participant.name,
      awayNoc: away.participant.organisation.code,
    },
    score: parseScoreRich(results),
    scorers: extractScorers(results.playByPlay, home, away),
    lineups: extractLineups(home, away),
  }
}

/**
 * Generate all endpoints from rich match detail data.
 * Sorted by kickoff ascending → Men before Women → unit code.
 */
export function generateAllEndpointsFromDetails(
  matches: readonly MatchDetailWithMeta[],
): FootyScoresEndpoint[] {
  const sorted = [...matches].sort((a, b) => {
    const dateA = a.detail.results.schedule.startDate
    const dateB = b.detail.results.schedule.startDate
    const dateCompare = dateA.localeCompare(dateB)
    if (dateCompare !== 0) return dateCompare

    const genderCompare = genderSortOrder(a.gender) - genderSortOrder(b.gender)
    if (genderCompare !== 0) return genderCompare

    return a.unitCode.localeCompare(b.unitCode)
  })

  return sorted.map(generateEndpointFromDetail)
}
