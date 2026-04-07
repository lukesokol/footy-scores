import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MatchFilters } from './MatchFilters'

describe('MatchFilters', () => {
  const defaultProps = {
    gender: 'all' as const,
    round: 'all' as const,
    searchQuery: '',
    availableRounds: ['Group A', 'Group B', 'Quarter-final'],
    onGenderChange: vi.fn(),
    onRoundChange: vi.fn(),
    onSearchChange: vi.fn(),
  }

  it('renders gender toggle buttons', () => {
    render(<MatchFilters {...defaultProps} />)
    expect(screen.getByText('All')).toBeInTheDocument()
    expect(screen.getByText('Men')).toBeInTheDocument()
    expect(screen.getByText('Women')).toBeInTheDocument()
  })

  it('renders round dropdown with options', () => {
    render(<MatchFilters {...defaultProps} />)
    const select = screen.getByRole('combobox', { name: /filter by round/i })
    expect(select).toBeInTheDocument()
    expect(screen.getByText('All rounds')).toBeInTheDocument()
    expect(screen.getByText('Group A')).toBeInTheDocument()
  })

  it('renders search input', () => {
    render(<MatchFilters {...defaultProps} />)
    expect(screen.getByRole('searchbox', { name: /search matches/i })).toBeInTheDocument()
  })

  it('calls onGenderChange when gender button clicked', async () => {
    const user = userEvent.setup()
    const onGenderChange = vi.fn()
    render(<MatchFilters {...defaultProps} onGenderChange={onGenderChange} />)
    await user.click(screen.getByText('Men'))
    expect(onGenderChange).toHaveBeenCalledWith('men')
  })

  it('calls onSearchChange when typing in search', async () => {
    const user = userEvent.setup()
    const onSearchChange = vi.fn()
    render(<MatchFilters {...defaultProps} onSearchChange={onSearchChange} />)
    await user.type(screen.getByRole('searchbox'), 'France')
    expect(onSearchChange).toHaveBeenCalled()
  })
})
