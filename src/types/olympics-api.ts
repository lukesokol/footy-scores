// Types for the rich Olympics JSON API endpoints:
// SEL_Phases, SEL_Events, RES_ByRSC_H2H

// --- SEL_Events ---

export interface OlympicsEventPhase {
  readonly code: string
  readonly description: string
  readonly shortDescription: string
  readonly longDescription: string
  readonly type: string
  readonly order?: string
}

export interface OlympicsEvent {
  readonly order: number
  readonly code: string
  readonly isTeam: boolean
  readonly description: string
  readonly longDescription: string
  readonly phases: readonly OlympicsEventPhase[]
}

export interface OlympicsEventsResponse {
  readonly events: readonly OlympicsEvent[]
}

// --- SEL_Phases ---

export interface OlympicsPhaseUnitSchedule {
  readonly startDate: string
  readonly endDate: string
  readonly medal: number
  readonly unitNum?: string
  readonly status: { readonly code: string; readonly description: string }
  readonly result?: { readonly status: { readonly code: string } }
}

export interface OlympicsPhaseUnit {
  readonly code: string
  readonly type: string
  readonly scheduled: string
  readonly order: string
  readonly description: string
  readonly shortDescription: string
  readonly longDescription: string
  readonly schedule: OlympicsPhaseUnitSchedule
}

export interface OlympicsPhase {
  readonly code: string
  readonly type: string
  readonly order?: string
  readonly description: string
  readonly longDescription: string
  readonly shortDescription: string
  readonly units?: readonly OlympicsPhaseUnit[]
}

export interface OlympicsPhasesResponse {
  readonly event: {
    readonly code: string
    readonly gender: { readonly code: string }
    readonly isTeam: boolean
    readonly description: string
    readonly longDescription: string
    readonly phases: readonly OlympicsPhase[]
  }
}

// --- RES_ByRSC_H2H (per-match detail) ---

export interface OlympicsMatchPeriodSide {
  readonly score: string
  readonly periodScore?: string
}

export interface OlympicsMatchPeriod {
  readonly p_code: string // H1, H2, TOT, EXT, PEN_PHASE
  readonly home: OlympicsMatchPeriodSide
  readonly away: OlympicsMatchPeriodSide
  readonly extendedPeriods?: readonly {
    readonly ep_code: string
    readonly ep_value: string
    readonly ep_type: string
  }[]
}

export interface OlympicsPlayByPlayAthlete {
  readonly pbpat_code: string
  readonly pbpat_order: string
  readonly pbpat_bib: string
  readonly pbpat_role?: string // SCR, ASSIST, IN, OUT, FOC, FOS
}

export interface OlympicsPlayByPlayCompetitor {
  readonly pbpc_code: string
  readonly pbpc_order: number
  readonly pbpc_type: string
  readonly athletes?: readonly OlympicsPlayByPlayAthlete[]
}

export interface OlympicsPlayByPlayAction {
  readonly pbpa_period: string
  readonly pbpa_id: string
  readonly pbpa_order: number
  readonly pbpa_Action: string // SHOT, PEN, SUBST, YC, RC, FOUL, CRN, OFF, STARTP, ENDP, VAR
  readonly pbpa_ActionAdd?: string
  readonly pbpa_When: string // e.g. "45' +2", "68'"
  readonly pbpa_Result?: string // GOAL, MISS, SAVE, BLC
  readonly pbpa_Comment?: string
  readonly pbpa_Score?: string
  readonly pbpa_ScoreA?: string
  readonly pbpa_ScoreH?: string
  readonly pbpa_Loc?: string
  readonly competitors?: readonly OlympicsPlayByPlayCompetitor[]
  readonly extendedActions?: readonly {
    readonly pbpea_code: string
    readonly pbpea_value: string
  }[]
}

export interface OlympicsPlayByPlayPeriod {
  readonly subcode: string // H1, H2
  readonly actions: readonly OlympicsPlayByPlayAction[]
}

export interface OlympicsMatchOfficial {
  readonly order: number
  readonly function: { readonly functionCode: string; readonly description: string }
  readonly official: {
    readonly code: string
    readonly name: string
    readonly shortName: string
    readonly givenName: string
    readonly familyName: string
    readonly nationality?: { readonly code: string; readonly longDescription: string }
  }
}

export interface OlympicsEventUnitEntry {
  readonly eue_code: string // HOME_AWAY, FORMATION, UNIFORM, SHORTS, SOCKS, STARTER, POSITION, CAPTAIN
  readonly eue_type: string
  readonly eue_value: string
  readonly eue_pos?: string
}

export interface OlympicsRegisteredEventEntry {
  readonly ee_value: string
  readonly ee_code: string // FIFA_ID, CLUB_NAME, POSITION, SHIRT_NAME
}

export interface OlympicsAthleteStats {
  readonly type: string
  readonly code: string // MINS, GF, GA, ASSIST, SHOT, etc.
  readonly value: string
  readonly pos?: string
  readonly attempt?: string
}

export interface OlympicsTeamAthlete {
  readonly order: number
  readonly startSortOrder: number
  readonly bib: string
  readonly participantCode: string
  readonly athlete: {
    readonly registeredEvents?: readonly {
      readonly code: string
      readonly eventEntries: readonly OlympicsRegisteredEventEntry[]
    }[]
    readonly code: string
    readonly name: string
    readonly shortName: string
    readonly TVName: string
    readonly givenName: string
    readonly familyName: string
    readonly organisation: {
      readonly type: string
      readonly code: string
      readonly description: string
      readonly longDescription: string
    }
  }
  readonly statsItems?: readonly OlympicsAthleteStats[]
  readonly eventUnitEntries?: readonly OlympicsEventUnitEntry[]
}

export interface OlympicsTeamCoach {
  readonly order: number
  readonly function: { readonly functionCode: string; readonly description: string }
  readonly coach: {
    readonly code: string
    readonly familyName: string
    readonly givenName: string
    readonly name: string
    readonly shortName: string
  }
}

export interface OlympicsMatchTeam {
  readonly sortOrder: number
  readonly startSortOrder: number
  readonly startOrder: string
  readonly itemType: string
  readonly resultWLT: string
  readonly resultType: string
  readonly resultData: string
  readonly teamCode: string
  readonly teamCoaches: readonly OlympicsTeamCoach[]
  readonly eventUnitEntries: readonly OlympicsEventUnitEntry[]
  readonly statsItems?: readonly OlympicsAthleteStats[]
  readonly participant: {
    readonly code: string
    readonly name: string
    readonly shortName: string
    readonly teamType: string
    readonly organisation: {
      readonly type: string
      readonly code: string
      readonly description: string
      readonly longDescription: string
    }
  }
  readonly teamAthletes: readonly OlympicsTeamAthlete[]
}

export interface OlympicsMatchSchedule {
  readonly startDate: string
  readonly endDate: string
  readonly status: { readonly code: string; readonly description: string }
  readonly venue: { readonly description: string; readonly longDescription: string }
  readonly location: {
    readonly description: string
    readonly longDescription: string
    readonly shortDescription: string
  }
}

export interface OlympicsMatchExtendedInfo {
  readonly extended_info_code: string
  readonly ei_code: string // PERIOD, UNIT_NUMBER, ATTENDANCE
  readonly ei_type: string
  readonly ei_value: string
}

export interface OlympicsMatchResults {
  readonly date: string
  readonly clock?: {
    readonly period: string
    readonly time: string
    readonly running: boolean
  }
  readonly eventUnitCode: string
  readonly eventUnit: {
    readonly description: string
    readonly shortDescription: string
    readonly longDescription: string
    readonly phase: { readonly order: string }
  }
  readonly status: { readonly code: string; readonly description: string }
  readonly extendedInfos?: readonly OlympicsMatchExtendedInfo[]
  readonly officials?: readonly OlympicsMatchOfficial[]
  readonly periods: readonly OlympicsMatchPeriod[]
  readonly schedule: OlympicsMatchSchedule
  readonly playByPlay?: readonly OlympicsPlayByPlayPeriod[]
  readonly items: readonly OlympicsMatchTeam[]
}

export interface OlympicsMatchDetailResponse {
  readonly positions?: readonly { readonly code: string; readonly description: string }[]
  readonly results: OlympicsMatchResults
}
