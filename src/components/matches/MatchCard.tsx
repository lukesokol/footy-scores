import { Clock, MapPin } from 'lucide-react'
import type { FootyScoresEndpoint, Score } from '@/types'
import { flagImageUrl, nocToFlag } from '@/lib/flags'

export interface MatchCardProps {
  readonly endpoint: FootyScoresEndpoint
  readonly onSelect: (endpoint: FootyScoresEndpoint) => void
  readonly isSelected: boolean
}

function formatKickoff(kickoff: string): string {
  const date = new Date(kickoff)
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  })
}

const statusLabel: Record<string, string> = {
  FT: 'Full Time',
  AET: 'After Extra Time',
  PEN: 'After Penalties',
  NS: 'Scheduled',
}

function isHomeWinner(score: Score | null, status: string): boolean {
  if (!score || status === 'NS') return false
  if (score.penalty) return score.penalty.home > score.penalty.away
  return score.home > score.away
}

function isAwayWinner(score: Score | null, status: string): boolean {
  if (!score || status === 'NS') return false
  if (score.penalty) return score.penalty.away > score.penalty.home
  return score.away > score.home
}

function buildScoreBreakdown(score: Score, status: string): string {
  const parts: string[] = []
  parts.push(`HT ${score.halfTime.home}-${score.halfTime.away}`)
  if (status === 'AET' || status === 'PEN') {
    parts.push(score.extraTime ? `AET ${score.extraTime.home}-${score.extraTime.away}` : 'AET')
  }
  if (status === 'PEN') {
    parts.push(score.penalty ? `PSO ${score.penalty.home}-${score.penalty.away}` : 'PSO')
  }
  return parts.join(' · ')
}

function FlagImg({ noc, className = '' }: { readonly noc: string; readonly className?: string }) {
  return (
    <img
      src={flagImageUrl(noc)}
      alt=""
      aria-hidden
      width={28}
      height={20}
      className={`h-5 w-7 shrink-0 rounded-sm object-cover ${className}`}
      onError={(e) => {
        const target = e.currentTarget
        target.style.display = 'none'
        const span = document.createElement('span')
        span.textContent = nocToFlag(noc)
        span.className = 'shrink-0 text-lg'
        target.parentNode?.insertBefore(span, target)
      }}
    />
  )
}

export function MatchCard({ endpoint, onSelect, isSelected }: MatchCardProps) {
  const isMen = endpoint.competition.name.includes('Men')
  const genderBadge = isMen ? 'Men' : 'Women'
  const genderColor = isMen ? 'bg-men-bg text-men' : 'bg-women-bg text-women'

  const homeWins = isHomeWinner(endpoint.score, endpoint.status)
  const awayWins = isAwayWinner(endpoint.score, endpoint.status)

  return (
    <button
      type="button"
      onClick={() => onSelect(endpoint)}
      aria-pressed={isSelected}
      aria-label={`${endpoint.teams.home} vs ${endpoint.teams.away}, ${genderBadge}, ${endpoint.competition.round}, ${statusLabel[endpoint.status] ?? endpoint.status}`}
      className={`group flex h-full w-full flex-col rounded-xl border p-4 transition-all duration-200 active:scale-[0.98] ${
        isSelected
          ? 'border-accent bg-accent/5 ring-accent/30 ring-1'
          : 'border-border-subtle bg-surface-raised hover:border-border-default hover:bg-surface-overlay'
      }`}
    >
      {/* Header: gender badge + round */}
      <div className="mb-3 flex w-full items-center justify-between">
        <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${genderColor}`}>
          {genderBadge}
        </span>
        <span className="text-text-muted text-xs">{endpoint.competition.round}</span>
      </div>

      {/* Teams + score — 3-column centered grid */}
      <div className="mb-2 grid w-full grid-cols-[1fr_auto_1fr] items-center gap-3">
        {/* Home team — right-aligned toward score */}
        <div className="flex items-center justify-end gap-2">
          <div className="min-w-0 text-right">
            <p
              className={`text-text-primary text-sm leading-tight ${homeWins ? 'font-bold' : 'font-medium'}`}
            >
              {endpoint.teams.home}
            </p>
            <p className="text-text-muted text-[10px] tracking-wider uppercase">
              {endpoint.teams.homeNoc}
            </p>
          </div>
          <FlagImg noc={endpoint.teams.homeNoc} />
        </div>

        {/* Score — centered */}
        {endpoint.score ? (
          <div className="flex flex-col items-center">
            <span className="bg-surface-overlay text-text-primary rounded-lg px-4 py-1.5 font-mono text-base font-bold tabular-nums">
              {endpoint.score.home} – {endpoint.score.away}
            </span>
          </div>
        ) : (
          <span className="text-text-muted text-center text-sm font-medium">vs</span>
        )}

        {/* Away team — left-aligned away from score */}
        <div className="flex items-center gap-2">
          <FlagImg noc={endpoint.teams.awayNoc} />
          <div className="min-w-0">
            <p
              className={`text-text-primary text-sm leading-tight ${awayWins ? 'font-bold' : 'font-medium'}`}
            >
              {endpoint.teams.away}
            </p>
            <p className="text-text-muted text-[10px] tracking-wider uppercase">
              {endpoint.teams.awayNoc}
            </p>
          </div>
        </div>
      </div>

      {/* Score breakdown: HT · AET · PSO */}
      {endpoint.score && endpoint.status !== 'NS' && (
        <p className="text-text-muted mb-2 w-full text-center text-[11px] tracking-wide">
          {buildScoreBreakdown(endpoint.score, endpoint.status)}
        </p>
      )}

      {/* Compact scorer list */}
      {endpoint.scorers.length > 0 && (
        <div className="text-text-muted mb-2 w-full space-y-0.5 text-[11px] leading-tight">
          {endpoint.scorers.slice(0, 6).map((s, i) => (
            <p key={`${s.player}-${s.minute}-${i}`} className="truncate text-center">
              <span className="font-mono text-[10px]">{s.minute}&apos;</span>{' '}
              <span className={s.team === endpoint.teams.home ? 'text-text-primary' : ''}>
                {s.player}
              </span>
              {s.type === 'penalty' && <span className="ml-0.5 opacity-60">(P)</span>}
              {s.type === 'own_goal' && <span className="ml-0.5 opacity-60">(OG)</span>}
            </p>
          ))}
          {endpoint.scorers.length > 6 && (
            <p className="text-center opacity-50">+{endpoint.scorers.length - 6} more</p>
          )}
        </div>
      )}

      {/* Footer: kickoff · venue · status — pushed to bottom */}
      <div className="text-text-muted mt-auto flex w-full items-center justify-between gap-3 pt-2 text-xs">
        <div className="flex shrink-0 items-center gap-1">
          <Clock size={12} aria-hidden />
          <span>{formatKickoff(endpoint.kickoff)}</span>
        </div>
        <div className="flex min-w-0 items-center gap-1">
          <MapPin size={12} className="shrink-0" aria-hidden />
          <span className="truncate" title={endpoint.venue.name}>
            {endpoint.venue.name}
          </span>
        </div>
        <span
          className={`inline-block shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${
            endpoint.status === 'FT' || endpoint.status === 'AET' || endpoint.status === 'PEN'
              ? 'bg-success-bg text-success'
              : 'bg-surface-overlay text-warning'
          }`}
          aria-label={`Match status: ${statusLabel[endpoint.status] ?? endpoint.status}`}
        >
          {endpoint.status}
        </span>
      </div>
    </button>
  )
}
