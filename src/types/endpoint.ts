export interface Competition {
  readonly name: string
  readonly season: string
  readonly round: string
}

export interface Venue {
  readonly name: string
  readonly city: string
}

export interface PeriodScore {
  readonly home: number
  readonly away: number
}

export interface Score {
  readonly home: number
  readonly away: number
  readonly halfTime: PeriodScore
  readonly extraTime?: PeriodScore
  readonly penalty?: PeriodScore
}

export interface Scorer {
  readonly team: string
  readonly player: string
  readonly minute: number
  readonly assist?: string
  readonly type: string
}

export interface Player {
  readonly name: string
  readonly number: number
  readonly position: string
}

export interface LineupEntry {
  readonly team: string
  readonly formation: string
  readonly coach: string
  readonly startingXI: readonly Player[]
  readonly bench: readonly Player[]
}

export interface Lineups {
  readonly home: LineupEntry
  readonly away: LineupEntry
}

export interface Teams {
  readonly home: string
  readonly homeNoc: string
  readonly away: string
  readonly awayNoc: string
}

export type MatchStatus = 'FT' | 'AET' | 'PEN' | 'NS'

export interface FootyScoresEndpoint {
  readonly competition: Competition
  readonly venue: Venue
  readonly kickoff: string
  readonly status: MatchStatus
  readonly teams: Teams
  readonly score: Score | null
  readonly scorers: readonly Scorer[]
  readonly lineups: Lineups | null
}
