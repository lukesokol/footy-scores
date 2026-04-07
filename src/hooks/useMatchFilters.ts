import { useState, useMemo, useCallback } from 'react'
import type { FootyScoresEndpoint } from '@/types'

export type GenderFilter = 'all' | 'men' | 'women'
export type RoundFilter = 'all' | string
export type MatchDayFilter = 'all' | string

interface UseMatchFiltersReturn {
  readonly gender: GenderFilter
  readonly round: RoundFilter
  readonly matchDay: MatchDayFilter
  readonly searchQuery: string
  readonly filtered: readonly FootyScoresEndpoint[]
  readonly availableRounds: readonly string[]
  readonly availableDays: readonly string[]
  readonly setGender: (g: GenderFilter) => void
  readonly setRound: (r: RoundFilter) => void
  readonly setMatchDay: (d: MatchDayFilter) => void
  readonly setSearchQuery: (q: string) => void
}

export function useMatchFilters(endpoints: readonly FootyScoresEndpoint[]): UseMatchFiltersReturn {
  const [gender, setGender] = useState<GenderFilter>('all')
  const [round, setRound] = useState<RoundFilter>('all')
  const [matchDay, setMatchDay] = useState<MatchDayFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const availableRounds = useMemo(() => {
    const rounds = new Set(endpoints.map((e) => e.competition.round))
    return [...rounds].sort()
  }, [endpoints])

  const availableDays = useMemo(() => {
    const days = new Set(endpoints.map((e) => e.kickoff.slice(0, 10)))
    return [...days].sort()
  }, [endpoints])

  const filtered = useMemo(() => {
    let result = [...endpoints]

    if (gender !== 'all') {
      const label = gender === 'men' ? 'Men' : 'Women'
      result = result.filter((e) => e.competition.name.includes(label))
    }

    if (round !== 'all') {
      result = result.filter((e) => e.competition.round === round)
    }

    if (matchDay !== 'all') {
      result = result.filter((e) => e.kickoff.startsWith(matchDay))
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (e) =>
          e.teams.home.toLowerCase().includes(q) ||
          e.teams.away.toLowerCase().includes(q) ||
          e.venue.name.toLowerCase().includes(q) ||
          e.venue.city.toLowerCase().includes(q),
      )
    }

    return result
  }, [endpoints, gender, round, matchDay, searchQuery])

  const handleSetGender = useCallback((g: GenderFilter) => setGender(g), [])
  const handleSetRound = useCallback((r: RoundFilter) => setRound(r), [])
  const handleSetMatchDay = useCallback((d: MatchDayFilter) => setMatchDay(d), [])
  const handleSetSearchQuery = useCallback((q: string) => setSearchQuery(q), [])

  return {
    gender,
    round,
    matchDay,
    searchQuery,
    filtered,
    availableRounds,
    availableDays,
    setGender: handleSetGender,
    setRound: handleSetRound,
    setMatchDay: handleSetMatchDay,
    setSearchQuery: handleSetSearchQuery,
  }
}
