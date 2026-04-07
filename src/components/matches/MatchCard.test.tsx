import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MatchCard } from './MatchCard'
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

describe('MatchCard', () => {
  it('renders team names and NOC codes', () => {
    render(<MatchCard endpoint={mockEndpoint} onSelect={vi.fn()} isSelected={false} />)
    expect(screen.getByText('Uzbekistan')).toBeInTheDocument()
    expect(screen.getByText('Spain')).toBeInTheDocument()
    expect(screen.getByText('UZB')).toBeInTheDocument()
    expect(screen.getByText('ESP')).toBeInTheDocument()
  })

  it('renders score', () => {
    render(<MatchCard endpoint={mockEndpoint} onSelect={vi.fn()} isSelected={false} />)
    expect(screen.getByText('1 – 2')).toBeInTheDocument()
  })

  it('renders gender badge', () => {
    render(<MatchCard endpoint={mockEndpoint} onSelect={vi.fn()} isSelected={false} />)
    expect(screen.getByText('Men')).toBeInTheDocument()
  })

  it('renders round', () => {
    render(<MatchCard endpoint={mockEndpoint} onSelect={vi.fn()} isSelected={false} />)
    expect(screen.getByText('Group A')).toBeInTheDocument()
  })

  it('renders status badge', () => {
    render(<MatchCard endpoint={mockEndpoint} onSelect={vi.fn()} isSelected={false} />)
    expect(screen.getByText('FT')).toBeInTheDocument()
  })

  it('calls onSelect when clicked', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<MatchCard endpoint={mockEndpoint} onSelect={onSelect} isSelected={false} />)
    await user.click(screen.getByRole('button'))
    expect(onSelect).toHaveBeenCalledWith(mockEndpoint)
  })

  it('shows vs when no score', () => {
    const noScoreEndpoint: FootyScoresEndpoint = { ...mockEndpoint, score: null, status: 'NS' }
    render(<MatchCard endpoint={noScoreEndpoint} onSelect={vi.fn()} isSelected={false} />)
    expect(screen.getByText('vs')).toBeInTheDocument()
  })
})
