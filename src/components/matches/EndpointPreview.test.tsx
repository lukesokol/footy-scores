import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EndpointPreview } from './EndpointPreview'
import type { FootyScoresEndpoint } from '@/types'

const mockEndpoint: FootyScoresEndpoint = {
  competition: { name: 'Olympic Football Tournament Men', season: 'Paris 2024', round: 'Group A' },
  venue: { name: 'Parc des Princes', city: 'Paris' },
  kickoff: '2024-07-24T15:00:00+02:00',
  status: 'FT',
  teams: { home: 'Uzbekistan', homeNoc: 'UZB', away: 'Spain', awayNoc: 'ESP' },
  score: { home: 1, away: 2, halfTime: { home: 0, away: 0 } },
  scorers: [],
  lineups: null,
}

describe('EndpointPreview', () => {
  it('shows placeholder when no endpoint selected', () => {
    render(<EndpointPreview endpoint={null} />)
    expect(screen.getByText(/select a match/i)).toBeInTheDocument()
  })

  it('renders JSON preview for selected endpoint', () => {
    render(<EndpointPreview endpoint={mockEndpoint} />)
    expect(screen.getByText(/Uzbekistan vs Spain/)).toBeInTheDocument()
    expect(screen.getByText(/application\/json/)).toBeInTheDocument()
  })

  it('shows formatted JSON in code block', () => {
    render(<EndpointPreview endpoint={mockEndpoint} />)
    const code = screen.getByText(/"Olympic Football Tournament Men"/)
    expect(code).toBeInTheDocument()
  })
})
