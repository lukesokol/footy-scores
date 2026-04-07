import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoadDataButton } from './LoadDataButton'

describe('LoadDataButton', () => {
  it('renders fetch and static buttons', () => {
    render(<LoadDataButton state="idle" onLoad={vi.fn()} onLoadFallback={vi.fn()} />)
    expect(screen.getByText('Fetch Match Data')).toBeInTheDocument()
    expect(screen.getByText('Use Static Data')).toBeInTheDocument()
  })

  it('shows loading text when state is loading', () => {
    render(<LoadDataButton state="loading" onLoad={vi.fn()} onLoadFallback={vi.fn()} />)
    expect(screen.getByText('Loading…')).toBeInTheDocument()
  })

  it('disables buttons when loading', () => {
    render(<LoadDataButton state="loading" onLoad={vi.fn()} onLoadFallback={vi.fn()} />)
    const buttons = screen.getAllByRole('button')
    buttons.forEach((btn) => expect(btn).toBeDisabled())
  })

  it('calls onLoad when Fetch Schedule clicked', async () => {
    const user = userEvent.setup()
    const onLoad = vi.fn()
    render(<LoadDataButton state="idle" onLoad={onLoad} onLoadFallback={vi.fn()} />)
    await user.click(screen.getByText('Fetch Match Data'))
    expect(onLoad).toHaveBeenCalledOnce()
  })

  it('calls onLoadFallback when Use Static Data clicked', async () => {
    const user = userEvent.setup()
    const onLoadFallback = vi.fn()
    render(<LoadDataButton state="idle" onLoad={vi.fn()} onLoadFallback={onLoadFallback} />)
    await user.click(screen.getByText('Use Static Data'))
    expect(onLoadFallback).toHaveBeenCalledOnce()
  })
})
