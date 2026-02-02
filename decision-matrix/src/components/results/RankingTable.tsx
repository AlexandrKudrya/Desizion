import { Trophy, Medal, Crown, Award } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { rankAlternatives } from '@/lib/calculations'
import type { Alternative, Criterion } from '@/types'
import { cn } from '@/lib/utils'

interface RankingTableProps {
  alternatives: Alternative[]
  criteria: Criterion[]
}

export function RankingTable({ alternatives, criteria }: RankingTableProps) {
  if (criteria.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-2xl">
        <Award className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>Сначала добавьте критерии</p>
      </div>
    )
  }

  if (alternatives.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-2xl">
        <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>Добавьте альтернативы для расчёта рейтинга</p>
      </div>
    )
  }

  const ranked = rankAlternatives(alternatives, criteria)
  const maxScore = ranked[0]?.totalScore || 1
  const top3 = ranked.slice(0, 3)
  const rest = ranked.slice(3)

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Trophy className="h-5 w-5 text-primary" />
        Рейтинг альтернатив
      </h3>

      {/* Podium for top 3 */}
      {ranked.length >= 1 && (
        <div className="flex justify-center items-end gap-4 py-8">
          {/* 2nd place */}
          {top3[1] && (
            <PodiumCard
              alt={top3[1]}
              place={2}
              maxScore={maxScore}
              className="h-32"
            />
          )}

          {/* 1st place */}
          {top3[0] && (
            <PodiumCard
              alt={top3[0]}
              place={1}
              maxScore={maxScore}
              className="h-40"
            />
          )}

          {/* 3rd place */}
          {top3[2] && (
            <PodiumCard
              alt={top3[2]}
              place={3}
              maxScore={maxScore}
              className="h-24"
            />
          )}
        </div>
      )}

      {/* Rest of the list */}
      {rest.length > 0 && (
        <div className="space-y-2">
          {rest.map((alt, index) => {
            const place = index + 4
            const score = alt.totalScore || 0
            const percent = maxScore > 0 ? (score / maxScore) * 100 : 0

            return (
              <div
                key={alt.id}
                className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border/50 hover:border-border transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-medium text-muted-foreground">
                  {place}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium truncate">{alt.name}</span>
                    <Badge variant="outline" className="ml-2">
                      {(score * 100).toFixed(1)}%
                    </Badge>
                  </div>

                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-muted-foreground/50 transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

interface PodiumCardProps {
  alt: Alternative
  place: 1 | 2 | 3
  maxScore: number
  className?: string
}

function PodiumCard({ alt, place, maxScore, className }: PodiumCardProps) {
  const score = alt.totalScore || 0
  const percent = maxScore > 0 ? (score / maxScore) * 100 : 0

  const config = {
    1: {
      icon: Crown,
      gradient: 'from-yellow-500/20 to-amber-500/20',
      border: 'border-yellow-500/50',
      iconColor: 'text-yellow-500',
      glow: 'shadow-yellow-500/20',
      bar: 'from-yellow-500 to-amber-500',
    },
    2: {
      icon: Medal,
      gradient: 'from-slate-400/20 to-slate-500/20',
      border: 'border-slate-400/50',
      iconColor: 'text-slate-400',
      glow: 'shadow-slate-400/20',
      bar: 'from-slate-400 to-slate-500',
    },
    3: {
      icon: Medal,
      gradient: 'from-amber-600/20 to-orange-600/20',
      border: 'border-amber-600/50',
      iconColor: 'text-amber-600',
      glow: 'shadow-amber-600/20',
      bar: 'from-amber-600 to-orange-600',
    },
  }[place]

  const Icon = config.icon

  return (
    <div
      className={cn(
        'w-32 sm:w-40 rounded-2xl p-4 border flex flex-col items-center justify-end transition-all hover:scale-105',
        `bg-gradient-to-b ${config.gradient}`,
        config.border,
        `shadow-lg ${config.glow}`,
        className
      )}
    >
      <div className={cn('mb-2', config.iconColor)}>
        <Icon className={cn('h-6 w-6', place === 1 && 'h-8 w-8')} />
      </div>

      <div className="text-center">
        <div className={cn(
          'font-bold text-2xl',
          place === 1 && 'text-3xl glow-text-cyan'
        )}>
          {(score * 100).toFixed(0)}%
        </div>
        <div className="text-xs text-muted-foreground truncate max-w-full mt-1">
          {alt.name}
        </div>
      </div>

      {/* Progress ring effect */}
      <div className="w-full mt-3">
        <div className="h-1 bg-black/20 rounded-full overflow-hidden">
          <div
            className={cn('h-full bg-gradient-to-r transition-all', config.bar)}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  )
}
