import { useState } from 'react'

interface ExportButtonProps {
  readonly onExportJson: () => void
  readonly onCopyClipboard: () => Promise<void>
  readonly disabled: boolean
}

export function ExportButton({ onExportJson, onCopyClipboard, disabled }: ExportButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await onCopyClipboard()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onExportJson}
        disabled={disabled}
        className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Export JSON
      </button>
      <button
        type="button"
        onClick={handleCopy}
        disabled={disabled}
        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {copied ? '✓ Copied!' : 'Copy to Clipboard'}
      </button>
    </div>
  )
}
