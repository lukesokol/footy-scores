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
    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onExportJson}
        disabled={disabled}
        className="bg-success/90 hover:bg-success rounded-lg px-4 py-2 text-xs font-medium text-white transition-colors active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Export JSON
      </button>
      <button
        type="button"
        onClick={handleCopy}
        disabled={disabled}
        className="border-border-subtle bg-surface-raised text-text-secondary hover:border-border-default hover:bg-surface-overlay rounded-lg border px-4 py-2 text-xs font-medium transition-colors active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {copied ? '✓ Copied!' : 'Copy to Clipboard'}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? 'Copied to clipboard' : ''}
      </span>
    </div>
  )
}
