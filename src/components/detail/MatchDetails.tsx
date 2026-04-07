import { Clock, MapPin, Trophy, Users } from 'lucide-react'
import type { FootyScoresEndpoint, LineupEntry, Score } from '@/types'
import { flagImageUrl, nocToFlag } from '@/lib/flags'

export interface MatchDetailsProps {
  readonly endpoint: FootyScoresEndpoint
}

function FlagImg({ noc, className = '' }: { readonly noc: string; readonly className?: string }) {
  return (
    <img
      src={flagImageUrl(noc)}
      alt=""
      aria-hidden
      width={32}
      height={22}
      className={`h-5.5 w-8 shrink-0 rounded-sm object-cover ${className}`}
      onError={(e) => {
        const target = e.currentTarget
        target.style.display = 'none'
        const span = document.createElement('span')
        span.textContent = nocToFlag(noc)
        span.className = 'shrink-0 text-xl'
        target.parentNode?.insertBefore(span, target)
      }}
    />
  )
}

const statusLabel: Record<string, string> = {
  FT: 'Full Time',
  AET: 'After Extra Time',
  PEN: 'After Penalties',
  NS: 'Not Started',
}

function formatKickoff(kickoff: string): string {
  const date = new Date(kickoff)
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  })
}

function buildPeriodBreakdown(score: Score, status: string): string[] {
  const parts: string[] = [`HT ${score.halfTime.home}–${score.halfTime.away}`]
  if (status === 'AET' || status === 'PEN') {
    parts.push(score.extraTime ? `AET ${score.extraTime.home}–${score.extraTime.away}` : 'AET')
  }
  if (status === 'PEN') {
    parts.push(score.penalty ? `PSO ${score.penalty.home}–${score.penalty.away}` : 'PSO')
  }
  return parts
}

const scorerTypeLabel: Record<string, string> = {
  penalty: 'Pen',
  own_goal: 'OG',
  header: 'Header',
  open_play: '',
}

function LineupTable({ entry, noc }: { readonly entry: LineupEntry; readonly noc: string }) {
  return (
    <div className="min-w-0 flex-1">
      <div className="mb-2 flex items-center gap-2">
        <FlagImg noc={noc} />
        <div>
          <p className="text-text-primary text-sm font-semibold">{entry.team}</p>
          <p className="text-text-muted text-xs">
            {entry.formation} · Coach: {entry.coach}
          </p>
        </div>
      </div>

      <p className="text-text-secondary mb-1 text-[10px] font-semibold tracking-wider uppercase">
        Starting XI
      </p>
      <table className="mb-3 w-full text-xs">
        <thead>
          <tr className="text-text-muted border-border-subtle border-b text-left text-[10px] tracking-wider uppercase">
            <th className="py-1 pr-2 font-medium">#</th>
            <th className="py-1 pr-2 font-medium">Name</th>
            <th className="py-1 font-medium">Pos</th>
          </tr>
        </thead>
        <tbody>
          {entry.startingXI.map((p) => (
            <tr key={p.number} className="border-border-subtle/50 border-b last:border-0">
              <td className="text-text-muted py-1 pr-2 font-mono">{p.number}</td>
              <td className="text-text-primary py-1 pr-2">{p.name}</td>
              <td className="text-text-muted py-1 font-mono text-[10px]">{p.position}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {entry.bench.length > 0 && (
        <>
          <p className="text-text-secondary mb-1 text-[10px] font-semibold tracking-wider uppercase">
            Bench
          </p>
          <table className="w-full text-xs">
            <tbody>
              {entry.bench.map((p) => (
                <tr key={p.number} className="border-border-subtle/50 border-b last:border-0">
                  <td className="text-text-muted py-1 pr-2 font-mono">{p.number}</td>
                  <td className="text-text-secondary py-1 pr-2">{p.name}</td>
                  <td className="text-text-muted py-1 font-mono text-[10px]">{p.position}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}

export function MatchDetails({ endpoint }: MatchDetailsProps) {
  const { teams, score, status, scorers, lineups, venue, kickoff, competition } = endpoint

  return (
    <div className="space-y-5 px-5 py-4">
      {/* ── Score header ── */}
      <div className="text-center">
        <div className="mb-3 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <FlagImg noc={teams.homeNoc} />
            <div className="text-right">
              <p className="text-text-primary text-sm font-semibold">{teams.home}</p>
              <p className="text-text-muted text-[10px] tracking-wider uppercase">
                {teams.homeNoc}
              </p>
            </div>
          </div>

          {score ? (
            <div className="flex flex-col items-center">
              <span className="bg-surface-overlay text-text-primary rounded-lg px-5 py-2 font-mono text-xl font-bold tabular-nums">
                {score.home} – {score.away}
              </span>
            </div>
          ) : (
            <span className="text-text-muted px-4 text-sm">vs</span>
          )}

          <div className="flex items-center gap-2">
            <div className="text-left">
              <p className="text-text-primary text-sm font-semibold">{teams.away}</p>
              <p className="text-text-muted text-[10px] tracking-wider uppercase">
                {teams.awayNoc}
              </p>
            </div>
            <FlagImg noc={teams.awayNoc} />
          </div>
        </div>

        {/* Status + period breakdown */}
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${
            status !== 'NS' ? 'bg-success-bg text-success' : 'bg-surface-overlay text-warning'
          }`}
        >
          {statusLabel[status] ?? status}
        </span>
        {score && status !== 'NS' && (
          <p className="text-text-muted mt-1.5 text-xs tracking-wide">
            {buildPeriodBreakdown(score, status).join(' · ')}
          </p>
        )}
      </div>

      {/* ── Scorers ── */}
      {scorers.length > 0 && (
        <div>
          <div className="text-text-secondary mb-2 flex items-center gap-1.5 text-xs font-semibold">
            <Trophy size={12} aria-hidden />
            Scorers
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-text-muted border-border-subtle border-b text-left text-[10px] tracking-wider uppercase">
                <th className="w-10 py-1 font-medium">Min</th>
                <th className="py-1 font-medium">Player</th>
                <th className="py-1 font-medium">Assist</th>
                <th className="w-14 py-1 text-right font-medium">Type</th>
              </tr>
            </thead>
            <tbody>
              {scorers.map((s, i) => (
                <tr
                  key={`${s.player}-${s.minute}-${i}`}
                  className="border-border-subtle/50 border-b last:border-0"
                >
                  <td className="text-text-muted py-1.5 font-mono">{s.minute}&apos;</td>
                  <td className="py-1.5">
                    <span
                      className={
                        s.team === teams.home
                          ? 'text-text-primary font-medium'
                          : 'text-text-secondary'
                      }
                    >
                      {s.player}
                    </span>
                    <span className="text-text-muted ml-1 text-[10px]">
                      ({s.team === teams.home ? teams.homeNoc : teams.awayNoc})
                    </span>
                  </td>
                  <td className="text-text-muted py-1.5">{s.assist ?? '—'}</td>
                  <td className="text-text-muted py-1.5 text-right text-[10px] uppercase">
                    {scorerTypeLabel[s.type] ?? s.type}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Lineups ── */}
      {lineups && (
        <div>
          <div className="text-text-secondary mb-3 flex items-center gap-1.5 text-xs font-semibold">
            <Users size={12} aria-hidden />
            Lineups
          </div>
          <div className="flex gap-5">
            <LineupTable entry={lineups.home} noc={teams.homeNoc} />
            <div className="border-border-subtle w-px shrink-0 self-stretch border-l" />
            <LineupTable entry={lineups.away} noc={teams.awayNoc} />
          </div>
        </div>
      )}

      {/* ── Match info ── */}
      <div className="border-border-subtle text-text-muted space-y-1 border-t pt-3 text-xs">
        <p>
          <span className="text-text-secondary font-medium">{competition.name}</span>
          {' · '}
          {competition.season} · {competition.round}
        </p>
        <div className="flex items-center gap-1">
          <MapPin size={11} aria-hidden />
          <span>
            {venue.name}, {venue.city}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={11} aria-hidden />
          <span>{formatKickoff(kickoff)}</span>
        </div>
      </div>
    </div>
  )
}
