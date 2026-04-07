import type { ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'

interface LayoutProps {
  readonly matchCount: number
  readonly children: ReactNode
}

export function Layout({ matchCount, children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header matchCount={matchCount} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      <Footer />
    </div>
  )
}
