export interface OlympicScheduleUnit {
  readonly startDate: string
  readonly endDate: string
  readonly disciplineCode: string
  readonly disciplineName: string
  readonly eventName: string
  readonly gender: 'M' | 'W'
  readonly unitCode: string
  readonly unitName: string
  readonly phaseName: string
  readonly venueDescription: string
  readonly locationDescription: string
  readonly competitors: readonly OlympicCompetitor[]
  readonly status: 'FINISHED' | 'SCHEDULED' | 'RUNNING'
  readonly resultStatus?: string
}

export interface OlympicCompetitor {
  readonly code: string
  readonly noc: string
  readonly name: string
  readonly order: number
  readonly results?: OlympicResult
}

export interface OlympicResult {
  readonly mark?: string
  readonly winnerLoserTie?: 'W' | 'L' | 'T'
}

export interface OlympicScheduleResponse {
  readonly units: readonly OlympicScheduleUnit[]
}
