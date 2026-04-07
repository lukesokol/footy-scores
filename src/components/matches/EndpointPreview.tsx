import { Code2 } from 'lucide-react'
import type { FootyScoresEndpoint } from '@/types'

interface EndpointPreviewProps {
  readonly endpoint: FootyScoresEndpoint | null
}

export function EndpointPreview({ endpoint }: EndpointPreviewProps) {
  if (!endpoint) {
    return (
      <div className="border-border-default flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-16 text-center">
        <Code2 size={28} className="text-text-muted mb-3 opacity-30" aria-hidden />
        <p className="text-text-secondary text-sm">Select a match to preview</p>
        <p className="text-text-muted mt-1 text-xs">The endpoint JSON will appear here.</p>
      </div>
    )
  }

  return (
    <div className="border-border-subtle bg-surface-raised overflow-hidden rounded-xl border">
      <div className="border-border-subtle flex items-center justify-between border-b px-4 py-3">
        <h3 className="text-text-primary text-xs font-medium">
          {endpoint.teams.home} vs {endpoint.teams.away}
        </h3>
        <span className="bg-surface-overlay text-text-muted rounded-md px-2 py-0.5 font-mono text-[10px]">
          application/json
        </span>
      </div>
      <pre
        className="bg-surface text-text-secondary max-h-[50vh] overflow-auto px-4 py-4 font-mono text-xs leading-relaxed lg:max-h-[65vh]"
        aria-label="Endpoint JSON preview"
        tabIndex={0}
      >
        <code>{JSON.stringify(endpoint, null, 2)}</code>
      </pre>
    </div>
  )
}
