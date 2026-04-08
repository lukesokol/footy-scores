import { describe, it, expect } from 'vitest'
import {
  generateEndpoint,
  generateAllEndpoints,
  generateEndpointFromDetail,
  generateAllEndpointsFromDetails,
} from '../endpoint-generator'
import type { OlympicScheduleUnit } from '@/types'
import type {
  OlympicsMatchDetailResponse,
  OlympicsMatchTeam,
  OlympicsPlayByPlayPeriod,
  OlympicsMatchPeriod,
} from '@/types'
import type { MatchDetailWithMeta } from '../olympics-api'

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function makeUnit(overrides: Partial<OlympicScheduleUnit> = {}): OlympicScheduleUnit {
  return {
    startDate: '2024-07-24T15:00:00+02:00',
    endDate: '2024-07-24T17:00:00+02:00',
    disciplineCode: 'FBL',
    disciplineName: 'Football',
    eventName: "Men's Tournament",
    gender: 'M',
    unitCode: 'FBLMTEAM1---GPA000101--',
    unitName: 'Group A - Matchday 1',
    phaseName: 'Group A',
    venueDescription: 'Parc des Princes',
    locationDescription: 'Paris',
    competitors: [
      {
        code: 'UZB',
        noc: 'UZB',
        name: 'Uzbekistan',
        order: 1,
        results: { mark: '1-2', winnerLoserTie: 'L' },
      },
      {
        code: 'ESP',
        noc: 'ESP',
        name: 'Spain',
        order: 2,
        results: { mark: '1-2', winnerLoserTie: 'W' },
      },
    ],
    status: 'FINISHED',
    ...overrides,
  }
}

function makeTeam(overrides: Partial<OlympicsMatchTeam> = {}): OlympicsMatchTeam {
  return {
    sortOrder: 1,
    startSortOrder: 1,
    startOrder: '1',
    itemType: 'TEAM',
    resultWLT: 'W',
    resultType: 'SCORE',
    resultData: '2',
    teamCode: 'ARG',
    teamCoaches: [
      {
        order: 1,
        function: { functionCode: 'COACH', description: 'Head Coach' },
        coach: {
          code: 'C001',
          familyName: 'Mascherano',
          givenName: 'Javier',
          name: 'Javier Mascherano',
          shortName: 'J. Mascherano',
        },
      },
    ],
    eventUnitEntries: [
      { eue_code: 'HOME_AWAY', eue_type: 'S', eue_value: 'HOME' },
      { eue_code: 'FORMATION', eue_type: 'S', eue_value: '4-3-3' },
    ],
    participant: {
      code: 'ARG',
      name: 'Argentina',
      shortName: 'ARG',
      teamType: 'NATIONAL',
      organisation: {
        type: 'NOC',
        code: 'ARG',
        description: 'Argentina',
        longDescription: 'Argentina',
      },
    },
    teamAthletes: [
      {
        order: 1,
        startSortOrder: 1,
        bib: '1',
        participantCode: 'P001',
        athlete: {
          code: 'P001',
          name: 'Geronimo Rulli',
          shortName: 'G. Rulli',
          TVName: 'RULLI',
          givenName: 'Geronimo',
          familyName: 'Rulli',
          organisation: {
            type: 'NOC',
            code: 'ARG',
            description: 'Argentina',
            longDescription: 'Argentina',
          },
        },
        eventUnitEntries: [
          { eue_code: 'STARTER', eue_type: 'S', eue_value: 'Y' },
          { eue_code: 'POSITION', eue_type: 'S', eue_value: 'GK', eue_pos: '1' },
        ],
      },
      {
        order: 2,
        startSortOrder: 2,
        bib: '7',
        participantCode: 'P007',
        athlete: {
          code: 'P007',
          name: 'Julian Alvarez',
          shortName: 'J. Alvarez',
          TVName: 'ALVAREZ',
          givenName: 'Julian',
          familyName: 'Alvarez',
          organisation: {
            type: 'NOC',
            code: 'ARG',
            description: 'Argentina',
            longDescription: 'Argentina',
          },
        },
        eventUnitEntries: [
          { eue_code: 'STARTER', eue_type: 'S', eue_value: 'Y' },
          { eue_code: 'POSITION', eue_type: 'S', eue_value: 'FW', eue_pos: '1' },
        ],
      },
      {
        order: 3,
        startSortOrder: 3,
        bib: '12',
        participantCode: 'P012',
        athlete: {
          code: 'P012',
          name: 'Sub Player',
          shortName: 'Sub',
          TVName: 'SUB',
          givenName: 'Sub',
          familyName: 'Player',
          organisation: {
            type: 'NOC',
            code: 'ARG',
            description: 'Argentina',
            longDescription: 'Argentina',
          },
        },
        eventUnitEntries: [
          { eue_code: 'STARTER', eue_type: 'S', eue_value: 'N' },
          { eue_code: 'POSITION', eue_type: 'S', eue_value: 'MF', eue_pos: '1' },
        ],
      },
    ],
    ...overrides,
  }
}

function makeAwayTeam(overrides: Partial<OlympicsMatchTeam> = {}): OlympicsMatchTeam {
  return makeTeam({
    teamCode: 'MAR',
    eventUnitEntries: [
      { eue_code: 'HOME_AWAY', eue_type: 'S', eue_value: 'AWAY' },
      { eue_code: 'FORMATION', eue_type: 'S', eue_value: '4-4-2' },
    ],
    participant: {
      code: 'MAR',
      name: 'Morocco',
      shortName: 'MAR',
      teamType: 'NATIONAL',
      organisation: {
        type: 'NOC',
        code: 'MAR',
        description: 'Morocco',
        longDescription: 'Morocco',
      },
    },
    teamCoaches: [
      {
        order: 1,
        function: { functionCode: 'COACH', description: 'Head Coach' },
        coach: {
          code: 'C002',
          familyName: 'Hakimi',
          givenName: 'Tarik',
          name: 'Tarik Hakimi',
          shortName: 'T. Hakimi',
        },
      },
    ],
    teamAthletes: [],
    ...overrides,
  })
}

function makePeriods(
  overrides: Partial<Record<string, { home: string; away: string }>> = {},
): OlympicsMatchPeriod[] {
  const defaults = {
    H1: { home: '1', away: '0' },
    H2: { home: '1', away: '1' },
    TOT: { home: '2', away: '1' },
  }
  const merged = { ...defaults, ...overrides }
  return Object.entries(merged).map(([code, scores]) => ({
    p_code: code,
    home: { score: scores.home },
    away: { score: scores.away },
  }))
}

function makePlayByPlay(actions: OlympicsPlayByPlayPeriod[] = []): OlympicsPlayByPlayPeriod[] {
  if (actions.length > 0) return actions
  return [
    {
      subcode: 'H1',
      actions: [
        {
          pbpa_period: 'H1',
          pbpa_id: '1',
          pbpa_order: 1,
          pbpa_Action: 'SHOT',
          pbpa_When: "16'",
          pbpa_Result: 'GOAL',
          competitors: [
            {
              pbpc_code: 'ARG',
              pbpc_order: 1,
              pbpc_type: 'T',
              athletes: [
                { pbpat_code: 'P007', pbpat_order: '1', pbpat_bib: '7', pbpat_role: 'SCR' },
              ],
            },
          ],
        },
      ],
    },
  ]
}

function makeDetailResponse(
  overrides: {
    periods?: OlympicsMatchPeriod[]
    items?: OlympicsMatchTeam[]
    playByPlay?: OlympicsPlayByPlayPeriod[]
    statusCode?: string
    description?: string
    startDate?: string
    venue?: string
    location?: string
  } = {},
): OlympicsMatchDetailResponse {
  return {
    results: {
      date: '2024-07-24',
      eventUnitCode: 'FBLMTEAM1---GPA000101--',
      eventUnit: {
        description: overrides.description ?? 'Group A - Matchday 1',
        shortDescription: 'GrpA - MD1',
        longDescription: 'Group A - Matchday 1',
        phase: { order: '1' },
      },
      status: { code: overrides.statusCode ?? 'FINISHED', description: 'Finished' },
      periods: overrides.periods ?? makePeriods(),
      schedule: {
        startDate: overrides.startDate ?? '2024-07-24T15:00:00+02:00',
        endDate: '2024-07-24T17:00:00+02:00',
        status: { code: overrides.statusCode ?? 'FINISHED', description: 'Finished' },
        venue: { description: overrides.venue ?? 'Stade Geoffroy-Guichard', longDescription: '' },
        location: {
          description: overrides.location ?? 'Geoffroy-Guichard, St-Etienne',
          longDescription: '',
          shortDescription: 'St-Etienne',
        },
      },
      items: overrides.items ?? [makeTeam(), makeAwayTeam()],
      playByPlay: overrides.playByPlay ?? makePlayByPlay(),
    },
  }
}

function makeMatchDetail(
  overrides: {
    unitCode?: string
    gender?: 'M' | 'W'
    detail?: OlympicsMatchDetailResponse
  } = {},
): MatchDetailWithMeta {
  return {
    unitCode: overrides.unitCode ?? 'FBLMTEAM1---GPA000101--',
    gender: overrides.gender ?? 'M',
    detail: overrides.detail ?? makeDetailResponse(),
  }
}

// ---------------------------------------------------------------------------
// Legacy path tests — generateEndpoint / generateAllEndpoints
// ---------------------------------------------------------------------------

describe('generateEndpoint (legacy)', () => {
  it('maps competition name from gender', () => {
    const menEndpoint = generateEndpoint(makeUnit({ gender: 'M' }))
    expect(menEndpoint.competition.name).toBe('Olympic Football Tournament Men')

    const womenEndpoint = generateEndpoint(makeUnit({ gender: 'W' }))
    expect(womenEndpoint.competition.name).toBe('Olympic Football Tournament Women')
  })

  it('sets season to Paris 2024', () => {
    const endpoint = generateEndpoint(makeUnit())
    expect(endpoint.competition.season).toBe('Paris 2024')
  })

  it('maps phaseName to round correctly', () => {
    expect(generateEndpoint(makeUnit({ phaseName: 'Group A' })).competition.round).toBe('Group A')
    expect(generateEndpoint(makeUnit({ phaseName: 'Group D' })).competition.round).toBe('Group D')
    expect(generateEndpoint(makeUnit({ phaseName: 'Quarterfinal' })).competition.round).toBe(
      'Quarter-final',
    )
    expect(generateEndpoint(makeUnit({ phaseName: 'Semifinal' })).competition.round).toBe(
      'Semi-final',
    )
    expect(generateEndpoint(makeUnit({ phaseName: 'Bronze Medal Match' })).competition.round).toBe(
      'Bronze Medal Match',
    )
    expect(generateEndpoint(makeUnit({ phaseName: 'Gold Medal Match' })).competition.round).toBe(
      'Gold Medal Match',
    )
  })

  it('extracts matchNumber from unitName', () => {
    expect(
      generateEndpoint(makeUnit({ unitName: "Men's Group A - Match 3" })).matchNumber,
    ).toBe(3)
    expect(
      generateEndpoint(makeUnit({ unitName: "Men's Quarter-final 2" })).matchNumber,
    ).toBe(2)
    expect(
      generateEndpoint(makeUnit({ unitName: "Men's Gold Medal Match" })).matchNumber,
    ).toBeUndefined()
  })

  it('maps venue and city', () => {
    const endpoint = generateEndpoint(
      makeUnit({ venueDescription: 'Stade de Lyon', locationDescription: 'Lyon' }),
    )
    expect(endpoint.venue).toEqual({ name: 'Stade de Lyon', city: 'Lyon' })
  })

  it('preserves kickoff datetime', () => {
    const endpoint = generateEndpoint(makeUnit({ startDate: '2024-08-01T19:00:00+02:00' }))
    expect(endpoint.kickoff).toBe('2024-08-01T19:00:00+02:00')
  })

  it('maps FINISHED status to FT', () => {
    expect(generateEndpoint(makeUnit({ status: 'FINISHED' })).status).toBe('FT')
  })

  it('maps non-FINISHED status to NS', () => {
    expect(generateEndpoint(makeUnit({ status: 'SCHEDULED' })).status).toBe('NS')
  })

  it('maps resultStatus "After extra time" to AET', () => {
    expect(generateEndpoint(makeUnit({ resultStatus: 'After extra time' })).status).toBe('AET')
  })

  it('maps resultStatus "After penalty shoot-out" to PEN', () => {
    expect(generateEndpoint(makeUnit({ resultStatus: 'After penalty shoot-out' })).status).toBe(
      'PEN',
    )
  })

  it('maps home and away teams by competitor order with NOC codes', () => {
    const endpoint = generateEndpoint(
      makeUnit({
        competitors: [
          { code: 'FRA', noc: 'FRA', name: 'France', order: 1 },
          { code: 'USA', noc: 'USA', name: 'United States', order: 2 },
        ],
      }),
    )
    expect(endpoint.teams).toEqual({
      home: 'France',
      homeNoc: 'FRA',
      away: 'United States',
      awayNoc: 'USA',
    })
  })

  it('parses score from H-A format in competitor results.mark', () => {
    const endpoint = generateEndpoint(makeUnit())
    expect(endpoint.score).toEqual({
      home: 1,
      away: 2,
      halfTime: { home: 0, away: 0 },
    })
  })

  it('returns null score when no results', () => {
    const endpoint = generateEndpoint(
      makeUnit({
        competitors: [
          { code: 'FRA', noc: 'FRA', name: 'France', order: 1 },
          { code: 'USA', noc: 'USA', name: 'United States', order: 2 },
        ],
      }),
    )
    expect(endpoint.score).toBeNull()
  })

  it('returns empty scorers array', () => {
    expect(generateEndpoint(makeUnit()).scorers).toEqual([])
  })

  it('returns null lineups', () => {
    expect(generateEndpoint(makeUnit()).lineups).toBeNull()
  })
})

describe('generateAllEndpoints (legacy)', () => {
  it('returns empty array for empty input', () => {
    expect(generateAllEndpoints([])).toEqual([])
  })

  it('returns endpoints for each unit', () => {
    const units = [makeUnit(), makeUnit({ unitCode: 'FBLMTEAM1---GPA000102--' })]
    expect(generateAllEndpoints(units)).toHaveLength(2)
  })

  it('is deterministic — same input always yields same output', () => {
    const units = [
      makeUnit({ startDate: '2024-07-25T15:00:00+02:00', gender: 'W', unitCode: 'W01' }),
      makeUnit({ startDate: '2024-07-24T15:00:00+02:00', gender: 'M', unitCode: 'M01' }),
      makeUnit({ startDate: '2024-07-24T15:00:00+02:00', gender: 'W', unitCode: 'W02' }),
    ]

    const run1 = generateAllEndpoints(units)
    const run2 = generateAllEndpoints(units)
    expect(JSON.stringify(run1)).toBe(JSON.stringify(run2))
  })

  it('sorts by kickoff date ascending', () => {
    const units = [
      makeUnit({ startDate: '2024-08-01T15:00:00+02:00', unitCode: 'LATE' }),
      makeUnit({ startDate: '2024-07-24T15:00:00+02:00', unitCode: 'EARLY' }),
    ]

    const endpoints = generateAllEndpoints(units)
    expect(endpoints[0]?.kickoff).toBe('2024-07-24T15:00:00+02:00')
    expect(endpoints[1]?.kickoff).toBe('2024-08-01T15:00:00+02:00')
  })

  it('sorts men before women for same kickoff', () => {
    const units = [
      makeUnit({ startDate: '2024-07-24T15:00:00+02:00', gender: 'W', unitCode: 'W01' }),
      makeUnit({ startDate: '2024-07-24T15:00:00+02:00', gender: 'M', unitCode: 'M01' }),
    ]

    const endpoints = generateAllEndpoints(units)
    expect(endpoints[0]?.competition.name).toContain('Men')
    expect(endpoints[1]?.competition.name).toContain('Women')
  })

  it('does not mutate the input array', () => {
    const units = [
      makeUnit({ startDate: '2024-08-01T15:00:00+02:00', unitCode: 'LATE' }),
      makeUnit({ startDate: '2024-07-24T15:00:00+02:00', unitCode: 'EARLY' }),
    ]
    const originalFirst = units[0]
    generateAllEndpoints(units)
    expect(units[0]).toBe(originalFirst)
  })
})

// ---------------------------------------------------------------------------
// Rich data path tests — generateEndpointFromDetail / generateAllEndpointsFromDetails
// ---------------------------------------------------------------------------

describe('generateEndpointFromDetail', () => {
  it('maps competition name from gender metadata', () => {
    const men = generateEndpointFromDetail(makeMatchDetail({ gender: 'M' }))
    expect(men.competition.name).toBe('Olympic Football Tournament Men')

    const women = generateEndpointFromDetail(makeMatchDetail({ gender: 'W' }))
    expect(women.competition.name).toBe('Olympic Football Tournament Women')
  })

  it('sets season to Paris 2024', () => {
    const endpoint = generateEndpointFromDetail(makeMatchDetail())
    expect(endpoint.competition.season).toBe('Paris 2024')
  })

  it('maps round from eventUnit description', () => {
    const group = generateEndpointFromDetail(
      makeMatchDetail({ detail: makeDetailResponse({ description: 'Group B - Matchday 2' }) }),
    )
    expect(group.competition.round).toBe('Group B')

    const qf = generateEndpointFromDetail(
      makeMatchDetail({ detail: makeDetailResponse({ description: 'Quarter-final 1' }) }),
    )
    expect(qf.competition.round).toBe('Quarter-final')

    const sf = generateEndpointFromDetail(
      makeMatchDetail({ detail: makeDetailResponse({ description: 'Semi-final 2' }) }),
    )
    expect(sf.competition.round).toBe('Semi-final')

    const bronze = generateEndpointFromDetail(
      makeMatchDetail({ detail: makeDetailResponse({ description: 'Bronze Medal Match' }) }),
    )
    expect(bronze.competition.round).toBe('Bronze Medal Match')

    const gold = generateEndpointFromDetail(
      makeMatchDetail({ detail: makeDetailResponse({ description: 'Gold Medal Match' }) }),
    )
    expect(gold.competition.round).toBe('Gold Medal Match')
  })

  it('extracts matchNumber from eventUnit description', () => {
    const group = generateEndpointFromDetail(
      makeMatchDetail({ detail: makeDetailResponse({ description: 'Group B - Matchday 2' }) }),
    )
    expect(group.matchNumber).toBe(2)

    const qf = generateEndpointFromDetail(
      makeMatchDetail({ detail: makeDetailResponse({ description: 'Quarter-final 1' }) }),
    )
    expect(qf.matchNumber).toBe(1)

    const medal = generateEndpointFromDetail(
      makeMatchDetail({ detail: makeDetailResponse({ description: 'Gold Medal Match' }) }),
    )
    expect(medal.matchNumber).toBeUndefined()
  })

  it('maps venue and city from schedule', () => {
    const endpoint = generateEndpointFromDetail(
      makeMatchDetail({
        detail: makeDetailResponse({
          venue: 'Parc des Princes',
          location: 'Parc des Princes, Paris',
        }),
      }),
    )
    expect(endpoint.venue.name).toBe('Parc des Princes')
    expect(endpoint.venue.city).toBe('Paris')
  })

  it('preserves kickoff datetime from schedule', () => {
    const endpoint = generateEndpointFromDetail(
      makeMatchDetail({
        detail: makeDetailResponse({ startDate: '2024-08-09T18:00:00+02:00' }),
      }),
    )
    expect(endpoint.kickoff).toBe('2024-08-09T18:00:00+02:00')
  })

  it('identifies home and away teams from eventUnitEntries', () => {
    const endpoint = generateEndpointFromDetail(makeMatchDetail())
    expect(endpoint.teams.home).toBe('Argentina')
    expect(endpoint.teams.homeNoc).toBe('ARG')
    expect(endpoint.teams.away).toBe('Morocco')
    expect(endpoint.teams.awayNoc).toBe('MAR')
  })

  describe('score parsing', () => {
    it('parses full-time score from TOT period', () => {
      const endpoint = generateEndpointFromDetail(makeMatchDetail())
      expect(endpoint.score?.home).toBe(2)
      expect(endpoint.score?.away).toBe(1)
    })

    it('parses half-time score from H1 period', () => {
      const endpoint = generateEndpointFromDetail(makeMatchDetail())
      expect(endpoint.score?.halfTime).toEqual({ home: 1, away: 0 })
    })

    it('returns null score when no TOT period', () => {
      const endpoint = generateEndpointFromDetail(
        makeMatchDetail({
          detail: makeDetailResponse({
            periods: [{ p_code: 'H1', home: { score: '0' }, away: { score: '0' } }],
          }),
        }),
      )
      expect(endpoint.score).toBeNull()
    })

    it('includes extraTime from ET-H1/ET-H2 periods', () => {
      const periods = [
        ...makePeriods(),
        {
          p_code: 'ET-H1',
          home: { score: '1', periodScore: '1' },
          away: { score: '0', periodScore: '0' },
        },
        {
          p_code: 'ET-H2',
          home: { score: '1', periodScore: '0' },
          away: { score: '0', periodScore: '0' },
        },
      ]
      const endpoint = generateEndpointFromDetail(
        makeMatchDetail({ detail: makeDetailResponse({ periods }) }),
      )
      expect(endpoint.score?.extraTime).toEqual({ home: 1, away: 0 })
    })

    it('includes penalty from PSO period', () => {
      const periods = [
        ...makePeriods(),
        {
          p_code: 'ET-H1',
          home: { score: '0', periodScore: '0' },
          away: { score: '0', periodScore: '0' },
        },
        {
          p_code: 'ET-H2',
          home: { score: '0', periodScore: '0' },
          away: { score: '0', periodScore: '0' },
        },
        {
          p_code: 'PSO',
          home: { score: '0', periodScore: '4' },
          away: { score: '0', periodScore: '2' },
        },
      ]
      const endpoint = generateEndpointFromDetail(
        makeMatchDetail({ detail: makeDetailResponse({ periods }) }),
      )
      expect(endpoint.score?.penalty).toEqual({ home: 4, away: 2 })
    })

    it('does not include extraTime or penalty for regular FT match', () => {
      const endpoint = generateEndpointFromDetail(makeMatchDetail())
      expect(endpoint.score?.extraTime).toBeUndefined()
      expect(endpoint.score?.penalty).toBeUndefined()
    })
  })

  describe('status mapping', () => {
    it('maps FINISHED status to FT', () => {
      const endpoint = generateEndpointFromDetail(makeMatchDetail())
      expect(endpoint.status).toBe('FT')
    })

    it('maps non-FINISHED status to NS', () => {
      const endpoint = generateEndpointFromDetail(
        makeMatchDetail({ detail: makeDetailResponse({ statusCode: 'SCHEDULED' }) }),
      )
      expect(endpoint.status).toBe('NS')
    })

    it('detects PEN from PSO period', () => {
      const periods = [
        ...makePeriods(),
        {
          p_code: 'ET-H1',
          home: { score: '0', periodScore: '0' },
          away: { score: '0', periodScore: '0' },
        },
        {
          p_code: 'ET-H2',
          home: { score: '0', periodScore: '0' },
          away: { score: '0', periodScore: '0' },
        },
        {
          p_code: 'PSO',
          home: { score: '0', periodScore: '4' },
          away: { score: '0', periodScore: '2' },
        },
      ]
      const endpoint = generateEndpointFromDetail(
        makeMatchDetail({ detail: makeDetailResponse({ periods }) }),
      )
      expect(endpoint.status).toBe('PEN')
    })

    it('detects AET from ET-H1/ET-H2 periods', () => {
      const periods = [
        ...makePeriods(),
        {
          p_code: 'ET-H1',
          home: { score: '1', periodScore: '1' },
          away: { score: '0', periodScore: '0' },
        },
        {
          p_code: 'ET-H2',
          home: { score: '1', periodScore: '0' },
          away: { score: '0', periodScore: '0' },
        },
      ]
      const endpoint = generateEndpointFromDetail(
        makeMatchDetail({ detail: makeDetailResponse({ periods }) }),
      )
      expect(endpoint.status).toBe('AET')
    })
  })

  describe('scorers', () => {
    it('extracts goal scorers from playByPlay', () => {
      const endpoint = generateEndpointFromDetail(makeMatchDetail())
      expect(endpoint.scorers).toHaveLength(1)
      expect(endpoint.scorers[0]).toMatchObject({
        team: 'Argentina',
        player: 'J. Alvarez',
        minute: 16,
        type: 'open_play',
      })
    })

    it('extracts assist from SCR+ASSIST athlete roles', () => {
      const playByPlay: OlympicsPlayByPlayPeriod[] = [
        {
          subcode: 'H1',
          actions: [
            {
              pbpa_period: 'H1',
              pbpa_id: '1',
              pbpa_order: 1,
              pbpa_Action: 'SHOT',
              pbpa_When: "25'",
              pbpa_Result: 'GOAL',
              competitors: [
                {
                  pbpc_code: 'ARG',
                  pbpc_order: 1,
                  pbpc_type: 'T',
                  athletes: [
                    { pbpat_code: 'P007', pbpat_order: '1', pbpat_bib: '7', pbpat_role: 'SCR' },
                    { pbpat_code: 'P001', pbpat_order: '2', pbpat_bib: '1', pbpat_role: 'ASSIST' },
                  ],
                },
              ],
            },
          ],
        },
      ]

      const endpoint = generateEndpointFromDetail(
        makeMatchDetail({ detail: makeDetailResponse({ playByPlay }) }),
      )
      expect(endpoint.scorers[0]?.assist).toBe('G. Rulli')
    })

    it('identifies penalty goals', () => {
      const playByPlay: OlympicsPlayByPlayPeriod[] = [
        {
          subcode: 'H2',
          actions: [
            {
              pbpa_period: 'H2',
              pbpa_id: '2',
              pbpa_order: 1,
              pbpa_Action: 'PEN',
              pbpa_When: "65'",
              pbpa_Result: 'GOAL',
              competitors: [
                {
                  pbpc_code: 'ARG',
                  pbpc_order: 1,
                  pbpc_type: 'T',
                  athletes: [
                    { pbpat_code: 'P007', pbpat_order: '1', pbpat_bib: '7', pbpat_role: 'SCR' },
                  ],
                },
              ],
            },
          ],
        },
      ]

      const endpoint = generateEndpointFromDetail(
        makeMatchDetail({ detail: makeDetailResponse({ playByPlay }) }),
      )
      expect(endpoint.scorers[0]?.type).toBe('penalty')
    })

    it('parses added time from When format', () => {
      const playByPlay: OlympicsPlayByPlayPeriod[] = [
        {
          subcode: 'H1',
          actions: [
            {
              pbpa_period: 'H1',
              pbpa_id: '1',
              pbpa_order: 1,
              pbpa_Action: 'SHOT',
              pbpa_When: "45' +2",
              pbpa_Result: 'GOAL',
              competitors: [
                {
                  pbpc_code: 'ARG',
                  pbpc_order: 1,
                  pbpc_type: 'T',
                  athletes: [
                    { pbpat_code: 'P007', pbpat_order: '1', pbpat_bib: '7', pbpat_role: 'SCR' },
                  ],
                },
              ],
            },
          ],
        },
      ]

      const endpoint = generateEndpointFromDetail(
        makeMatchDetail({ detail: makeDetailResponse({ playByPlay }) }),
      )
      expect(endpoint.scorers[0]?.minute).toBe(47)
    })

    it('returns empty scorers when no playByPlay data', () => {
      const detail: OlympicsMatchDetailResponse = {
        results: {
          ...makeDetailResponse().results,
          playByPlay: undefined,
        },
      }
      const endpoint = generateEndpointFromDetail(makeMatchDetail({ detail }))
      expect(endpoint.scorers).toEqual([])
    })

    it('sorts scorers by minute', () => {
      const playByPlay: OlympicsPlayByPlayPeriod[] = [
        {
          subcode: 'H1',
          actions: [
            {
              pbpa_period: 'H1',
              pbpa_id: '2',
              pbpa_order: 2,
              pbpa_Action: 'SHOT',
              pbpa_When: "30'",
              pbpa_Result: 'GOAL',
              competitors: [
                {
                  pbpc_code: 'ARG',
                  pbpc_order: 1,
                  pbpc_type: 'T',
                  athletes: [
                    { pbpat_code: 'P007', pbpat_order: '1', pbpat_bib: '7', pbpat_role: 'SCR' },
                  ],
                },
              ],
            },
            {
              pbpa_period: 'H1',
              pbpa_id: '1',
              pbpa_order: 1,
              pbpa_Action: 'SHOT',
              pbpa_When: "10'",
              pbpa_Result: 'GOAL',
              competitors: [
                {
                  pbpc_code: 'ARG',
                  pbpc_order: 1,
                  pbpc_type: 'T',
                  athletes: [
                    { pbpat_code: 'P001', pbpat_order: '1', pbpat_bib: '1', pbpat_role: 'SCR' },
                  ],
                },
              ],
            },
          ],
        },
      ]

      const endpoint = generateEndpointFromDetail(
        makeMatchDetail({ detail: makeDetailResponse({ playByPlay }) }),
      )
      expect(endpoint.scorers[0]?.minute).toBe(10)
      expect(endpoint.scorers[1]?.minute).toBe(30)
    })
  })

  describe('lineups', () => {
    it('extracts starters and bench from teamAthletes', () => {
      const endpoint = generateEndpointFromDetail(makeMatchDetail())
      expect(endpoint.lineups).not.toBeNull()
      expect(endpoint.lineups?.home.startingXI).toHaveLength(2) // GK + FW
      expect(endpoint.lineups?.home.bench).toHaveLength(1) // Sub
    })

    it('sorts starters by position: GK → DF → MF → FW', () => {
      const endpoint = generateEndpointFromDetail(makeMatchDetail())
      const positions = endpoint.lineups?.home.startingXI.map((p) => p.position)
      expect(positions).toEqual(['GK', 'FW'])
    })

    it('maps formation from event unit entries', () => {
      const endpoint = generateEndpointFromDetail(makeMatchDetail())
      expect(endpoint.lineups?.home.formation).toBe('4-3-3')
      expect(endpoint.lineups?.away.formation).toBe('4-4-2')
    })

    it('maps coach name', () => {
      const endpoint = generateEndpointFromDetail(makeMatchDetail())
      expect(endpoint.lineups?.home.coach).toBe('Javier Mascherano')
    })

    it('builds player with name, number, and position', () => {
      const endpoint = generateEndpointFromDetail(makeMatchDetail())
      const gk = endpoint.lineups?.home.startingXI[0]
      expect(gk).toEqual({
        name: 'Geronimo Rulli',
        number: 1,
        position: 'GK',
      })
    })

    it('returns null lineups when no athletes', () => {
      const detail = makeDetailResponse({
        items: [makeTeam({ teamAthletes: [] }), makeAwayTeam({ teamAthletes: [] })],
      })
      const endpoint = generateEndpointFromDetail(makeMatchDetail({ detail }))
      expect(endpoint.lineups).toBeNull()
    })
  })

  it('matches the expected endpoint shape', () => {
    const endpoint = generateEndpointFromDetail(makeMatchDetail())
    expect(endpoint).toHaveProperty('competition')
    expect(endpoint).toHaveProperty('venue')
    expect(endpoint).toHaveProperty('kickoff')
    expect(endpoint).toHaveProperty('status')
    expect(endpoint).toHaveProperty('teams')
    expect(endpoint).toHaveProperty('score')
    expect(endpoint).toHaveProperty('scorers')
    expect(endpoint).toHaveProperty('lineups')
  })
})

describe('generateAllEndpointsFromDetails', () => {
  it('returns empty array for empty input', () => {
    expect(generateAllEndpointsFromDetails([])).toEqual([])
  })

  it('returns endpoints for each match', () => {
    const matches = [makeMatchDetail({ unitCode: 'U01' }), makeMatchDetail({ unitCode: 'U02' })]
    expect(generateAllEndpointsFromDetails(matches)).toHaveLength(2)
  })

  it('is deterministic — same input always yields same output', () => {
    const matches = [
      makeMatchDetail({
        unitCode: 'W01',
        gender: 'W',
        detail: makeDetailResponse({ startDate: '2024-07-25T15:00:00+02:00' }),
      }),
      makeMatchDetail({
        unitCode: 'M01',
        gender: 'M',
        detail: makeDetailResponse({ startDate: '2024-07-24T15:00:00+02:00' }),
      }),
    ]

    const run1 = generateAllEndpointsFromDetails(matches)
    const run2 = generateAllEndpointsFromDetails(matches)
    expect(JSON.stringify(run1)).toBe(JSON.stringify(run2))
  })

  it('sorts by kickoff date ascending', () => {
    const matches = [
      makeMatchDetail({
        unitCode: 'LATE',
        detail: makeDetailResponse({ startDate: '2024-08-01T15:00:00+02:00' }),
      }),
      makeMatchDetail({
        unitCode: 'EARLY',
        detail: makeDetailResponse({ startDate: '2024-07-24T15:00:00+02:00' }),
      }),
    ]

    const endpoints = generateAllEndpointsFromDetails(matches)
    expect(endpoints[0]?.kickoff).toBe('2024-07-24T15:00:00+02:00')
    expect(endpoints[1]?.kickoff).toBe('2024-08-01T15:00:00+02:00')
  })

  it('sorts men before women for same kickoff', () => {
    const matches = [
      makeMatchDetail({ unitCode: 'W01', gender: 'W' }),
      makeMatchDetail({ unitCode: 'M01', gender: 'M' }),
    ]

    const endpoints = generateAllEndpointsFromDetails(matches)
    expect(endpoints[0]?.competition.name).toContain('Men')
    expect(endpoints[1]?.competition.name).toContain('Women')
  })

  it('does not mutate the input array', () => {
    const matches = [
      makeMatchDetail({
        unitCode: 'LATE',
        detail: makeDetailResponse({ startDate: '2024-08-01T15:00:00+02:00' }),
      }),
      makeMatchDetail({
        unitCode: 'EARLY',
        detail: makeDetailResponse({ startDate: '2024-07-24T15:00:00+02:00' }),
      }),
    ]
    const originalFirst = matches[0]
    generateAllEndpointsFromDetails(matches)
    expect(matches[0]).toBe(originalFirst)
  })
})
