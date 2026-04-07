import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Header } from './Header'

describe('Header', () => {
  it('renders the app name', () => {
    render(<Header matchCount={0} />)
    expect(screen.getByText('FootyScores')).toBeInTheDocument()
  })

  it('renders the subtitle', () => {
    render(<Header matchCount={0} />)
    expect(screen.getByText(/Paris 2024 Olympic Football/)).toBeInTheDocument()
  })

  it('shows match count badge when matches > 0', () => {
    render(<Header matchCount={58} />)
    expect(screen.getByText('58 matches')).toBeInTheDocument()
  })

  it('hides match count badge when matches = 0', () => {
    render(<Header matchCount={0} />)
    expect(screen.queryByText(/matches/)).not.toBeInTheDocument()
  })
})
