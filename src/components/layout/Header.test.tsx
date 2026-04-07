import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Header } from './Header'

const mockSetTheme = vi.fn()

vi.mock('@/hooks', () => ({
  useTheme: () => ({ theme: 'light', resolvedTheme: 'light', setTheme: mockSetTheme }),
}))

describe('Header', () => {
  it('renders the app name', () => {
    render(<Header matchCount={0} />)
    expect(screen.getByText('FootyScores')).toBeInTheDocument()
  })

  it('renders the subtitle', () => {
    render(<Header matchCount={0} />)
    expect(screen.getByText(/Paris 2024/)).toBeInTheDocument()
  })

  it('shows match count badge when matches > 0', () => {
    render(<Header matchCount={58} />)
    expect(screen.getByText('58 matches')).toBeInTheDocument()
  })

  it('hides match count badge when matches = 0', () => {
    render(<Header matchCount={0} />)
    expect(screen.queryByText(/matches/)).not.toBeInTheDocument()
  })

  it('renders theme toggle button', () => {
    render(<Header matchCount={0} />)
    expect(screen.getByLabelText(/Theme/)).toBeInTheDocument()
  })

  it('calls setTheme on toggle click', async () => {
    const user = userEvent.setup()
    render(<Header matchCount={0} />)
    await user.click(screen.getByLabelText(/Theme/))
    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })
})
