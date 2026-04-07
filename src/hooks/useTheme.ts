import { useCallback, useSyncExternalStore } from 'react'

type Theme = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'theme'

function getSystemPreference(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getStoredTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return 'system'
}

function applyTheme(theme: Theme): void {
  const resolved = theme === 'system' ? getSystemPreference() : theme
  document.documentElement.classList.toggle('dark', resolved === 'dark')
}

// External store for theme preference
let currentTheme: Theme = getStoredTheme()
const listeners = new Set<() => void>()

function subscribe(listener: () => void): () => void {
  listeners.add(listener)

  // Listen for system preference changes when in "system" mode
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  const handleChange = () => {
    if (currentTheme === 'system') {
      applyTheme('system')
      listeners.forEach((l) => l())
    }
  }
  mq.addEventListener('change', handleChange)

  return () => {
    listeners.delete(listener)
    mq.removeEventListener('change', handleChange)
  }
}

function getSnapshot(): Theme {
  return currentTheme
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot)

  const setTheme = useCallback((next: Theme) => {
    currentTheme = next
    if (next === 'system') {
      localStorage.removeItem(STORAGE_KEY)
    } else {
      localStorage.setItem(STORAGE_KEY, next)
    }
    applyTheme(next)
    listeners.forEach((l) => l())
  }, [])

  const resolvedTheme: 'light' | 'dark' = theme === 'system' ? getSystemPreference() : theme

  return { theme, resolvedTheme, setTheme } as const
}
