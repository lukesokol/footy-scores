import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MatchModal } from './EndpointPreview'
import type { FootyScoresEndpoint } from '@/types'

const mockEndpoint: FootyScoresEndpoint = {
  competition: { name: 'Olympic Football Tournament Men', season: 'Paris 2024', round: 'Group A' },
  venue: { name: 'Parc des Princes', city: 'Paris' },
  kickoff: '2024-07-24T15:00:00+02:00',
  status: 'FT',
  teams: { home: 'Uzbekistan', homeNoc: 'UZB', away: 'Spain', awayNoc: 'ESP' },
  score: { home: 1, away: 2, halfTime: { home: 0, away: 0 } },
  scorers: [{ team: 'Spain', player: 'Fermín López', minute: 29, type: 'open_play' }],
  lineups: null,
}

// jsdom doesn't support HTMLDialogElement.showModal, so we stub it
beforeEach(() => {
  HTMLDialogElement.prototype.showModal = vi.fn()
  HTMLDialogElement.prototype.close = vi.fn()
})

describe('MatchModal', () => {
  it('renders dialog element when no endpoint', () => {
    render(<MatchModal endpoint={null} onClose={vi.fn()} />)
    expect(screen.getByRole('dialog', { hidden: true })).toBeInTheDocument()
  })

  it('renders match title when endpoint provided', () => {
    render(<MatchModal endpoint={mockEndpoint} onClose={vi.fn()} />)
    expect(screen.getByText(/Uzbekistan vs Spain/)).toBeInTheDocument()
  })

  it('opens on Details tab by default', () => {
    render(<MatchModal endpoint={mockEndpoint} onClose={vi.fn()} />)
    expect(screen.getByRole('tab', { name: /details/i, hidden: true })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(screen.getByText('Full Time')).toBeInTheDocument()
  })

  it('switches to JSON tab and shows formatted JSON', async () => {
    const user = userEvent.setup()
    render(<MatchModal endpoint={mockEndpoint} onClose={vi.fn()} />)
    await user.click(screen.getByRole('tab', { name: /json/i, hidden: true }))
    expect(screen.getByRole('tab', { name: /json/i, hidden: true })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(screen.getByText(/"Olympic Football Tournament Men"/)).toBeInTheDocument()
  })

  it('shows scorers in details tab', () => {
    render(<MatchModal endpoint={mockEndpoint} onClose={vi.fn()} />)
    expect(screen.getByText('Fermín López')).toBeInTheDocument()
  })
})
