import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusIndicator } from './StatusIndicator'

describe('StatusIndicator', () => {
  it('shows Ready when idle', () => {
    render(<StatusIndicator state="idle" error={null} matchCount={0} filteredCount={0} />)
    expect(screen.getByText('Ready')).toBeInTheDocument()
  })

  it('shows Loading when loading', () => {
    render(<StatusIndicator state="loading" error={null} matchCount={0} filteredCount={0} />)
    expect(screen.getByText('Loading…')).toBeInTheDocument()
  })

  it('shows count when loaded', () => {
    render(<StatusIndicator state="success" error={null} matchCount={58} filteredCount={32} />)
    expect(screen.getByText('Showing 32 of 58')).toBeInTheDocument()
  })

  it('shows error message', () => {
    render(
      <StatusIndicator
        state="error"
        error="Something went wrong"
        matchCount={0}
        filteredCount={0}
      />,
    )
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })
})
