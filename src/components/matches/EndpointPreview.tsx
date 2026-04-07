import type { FootyScoresEndpoint } from '@/types'

interface EndpointPreviewProps {
  readonly endpoint: FootyScoresEndpoint | null
}

export function EndpointPreview({ endpoint }: EndpointPreviewProps) {
  if (!endpoint) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 px-6 py-12 text-center">
        <p className="text-gray-500">Select a match to preview the endpoint JSON</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <h3 className="text-sm font-medium text-gray-900">
          Endpoint Preview — {endpoint.teams.home} vs {endpoint.teams.away}
        </h3>
        <span className="text-xs text-gray-500">application/json</span>
      </div>
      <pre className="max-h-[60vh] overflow-auto px-4 py-3 text-xs leading-relaxed text-gray-800">
        <code>{JSON.stringify(endpoint, null, 2)}</code>
      </pre>
    </div>
  )
}
