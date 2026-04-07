import { useCallback } from 'react'
import type { FootyScoresEndpoint } from '@/types'

interface UseExportReturn {
  readonly exportAsJson: () => void
  readonly copyToClipboard: () => Promise<void>
}

export function useExport(endpoints: readonly FootyScoresEndpoint[]): UseExportReturn {
  const exportAsJson = useCallback(() => {
    const json = JSON.stringify(endpoints, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = 'footy-scores-endpoints.json'
    link.click()

    URL.revokeObjectURL(url)
  }, [endpoints])

  const copyToClipboard = useCallback(async () => {
    const json = JSON.stringify(endpoints, null, 2)
    await navigator.clipboard.writeText(json)
  }, [endpoints])

  return { exportAsJson, copyToClipboard }
}
