import { useEffect, useRef, useState } from 'react'
import { X, Copy, Check, Code2, FileText, Columns2 } from 'lucide-react'
import type { FootyScoresEndpoint } from '@/types'
import { MatchDetails } from '@/components/detail/MatchDetails'

export interface MatchModalProps {
  readonly endpoint: FootyScoresEndpoint | null
  readonly onClose: () => void
}

type ModalTab = 'details' | 'json' | 'compare'

export function MatchModal({ endpoint, onClose }: MatchModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [copied, setCopied] = useState(false)
  const [tab, setTab] = useState<ModalTab>('details')
  const [prevEndpointKey, setPrevEndpointKey] = useState<string | null>(null)

  // Reset tab and copied state when a different match is selected (adjust-during-render pattern)
  const currentKey = endpoint
    ? `${endpoint.teams.home}-${endpoint.teams.away}-${endpoint.kickoff}`
    : null
  if (currentKey !== prevEndpointKey) {
    setPrevEndpointKey(currentKey)
    if (currentKey) {
      setTab('details')
      setCopied(false)
    }
  }

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (endpoint) {
      if (!dialog.open) dialog.showModal()
    } else {
      if (dialog.open) dialog.close()
    }
  }, [endpoint])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    function handleClose() {
      onClose()
    }
    dialog.addEventListener('close', handleClose)
    return () => dialog.removeEventListener('close', handleClose)
  }, [onClose])

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) onClose()
  }

  async function handleCopy() {
    if (!endpoint) return
    await navigator.clipboard.writeText(JSON.stringify(endpoint, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tabs: { id: ModalTab; label: string; icon: typeof FileText }[] = [
    { id: 'details', label: 'Details', icon: FileText },
    { id: 'json', label: 'JSON', icon: Code2 },
    { id: 'compare', label: 'Compare', icon: Columns2 },
  ]

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      className={`bg-surface border-border-subtle m-auto flex h-[85vh] max-h-[85vh] w-full flex-col rounded-xl border shadow-xl not-open:hidden backdrop:bg-black/50 backdrop:backdrop-blur-sm ${
        tab === 'compare' ? 'max-w-6xl' : 'max-w-2xl'
      }`}
    >
      {endpoint && (
        <>
          {/* Header */}
          <div className="border-border-subtle flex shrink-0 items-center justify-between border-b px-5 py-3">
            <div className="flex items-center gap-3">
              <h3 className="text-text-primary text-sm font-medium">
                {endpoint.teams.home} vs {endpoint.teams.away}
              </h3>
            </div>
            <div className="flex items-center gap-1">
              {(tab === 'json' || tab === 'compare') && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-text-muted hover:text-text-primary hover:bg-surface-overlay rounded-md p-1.5 transition-colors"
                  aria-label="Copy JSON to clipboard"
                >
                  {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="text-text-muted hover:text-text-primary hover:bg-surface-overlay rounded-md p-1.5 transition-colors"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Tab bar */}
          <div
            className="border-border-subtle flex shrink-0 gap-0 border-b px-5"
            role="tablist"
            aria-label="Match view"
          >
            {tabs.map((t) => {
              const Icon = t.icon
              const active = tab === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-1.5 border-b-2 px-4 py-2 text-xs font-medium transition-colors ${
                    active
                      ? 'border-accent text-accent'
                      : 'text-text-muted hover:text-text-secondary border-transparent'
                  }`}
                >
                  <Icon size={13} aria-hidden />
                  {t.label}
                </button>
              )
            })}
          </div>

          {/* Tab content */}
          {tab === 'compare' ? (
            <div className="flex min-h-0 flex-1 flex-col md:flex-row" role="tabpanel">
              <div className="min-h-0 flex-1 overflow-auto">
                <MatchDetails endpoint={endpoint} />
              </div>
              <div className="border-border-subtle hidden shrink-0 border-l md:block" />
              <div className="border-border-subtle border-t md:hidden" />
              <div className="min-h-0 flex-1 overflow-auto">
                <pre
                  className="text-text-secondary h-full px-5 py-4 font-mono text-xs leading-relaxed"
                  aria-label="Endpoint JSON preview"
                  tabIndex={0}
                >
                  <code>{JSON.stringify(endpoint, null, 2)}</code>
                </pre>
              </div>
            </div>
          ) : (
            <div className="min-h-0 flex-1 overflow-auto" role="tabpanel">
              {tab === 'details' && <MatchDetails endpoint={endpoint} />}
              {tab === 'json' && (
                <pre
                  className="text-text-secondary px-5 py-4 font-mono text-xs leading-relaxed"
                  aria-label="Endpoint JSON preview"
                  tabIndex={0}
                >
                  <code>{JSON.stringify(endpoint, null, 2)}</code>
                </pre>
              )}
            </div>
          )}
        </>
      )}
    </dialog>
  )
}
