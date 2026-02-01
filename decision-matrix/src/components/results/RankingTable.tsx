import { Trophy, Medal } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { rankAlternatives } from '@/lib/calculations'
import type { Alternative, Criterion } from '@/types'

interface RankingTableProps {
  alternatives: Alternative[]
  criteria: Criterion[]
}

export function RankingTable({ alternatives, criteria }: RankingTableProps) {
  if (criteria.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
        <p>Сначала добавьте критерии</p>
      </div>
    )
  }

  if (alternatives.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
        <p>Добавьте альтернативы для расчёта рейтинга</p>
      </div>
    )
  }

  const ranked = rankAlternatives(alternatives, criteria)
  const maxScore = ranked[0]?.totalScore || 1

  const getMedalIcon = (place: number) => {
    if (place === 1) return <Trophy className="h-5 w-5 text-yellow-500" />
    if (place === 2) return <Medal className="h-5 w-5 text-gray-400" />
    if (place === 3) return <Medal className="h-5 w-5 text-amber-600" />
    return <span className="text-gray-400 font-medium">{place}</span>
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Рейтинг альтернатив</h3>

      <div className="space-y-3">
        {ranked.map((alt, index) => {
          const place = index + 1
          const score = alt.totalScore || 0
          const percent = maxScore > 0 ? (score / maxScore) * 100 : 0

          return (
            <div
              key={alt.id}
              className={`p-4 rounded-lg border ${
                place === 1 ? 'bg-yellow-50 border-yellow-200' :
                place === 2 ? 'bg-gray-50 border-gray-200' :
                place === 3 ? 'bg-amber-50 border-amber-200' :
                'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10">
                  {getMedalIcon(place)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{alt.name}</span>
                    <Badge variant={place === 1 ? 'default' : 'secondary'}>
                      {(score * 100).toFixed(1)}%
                    </Badge>
                  </div>

                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        place === 1 ? 'bg-yellow-500' :
                        place === 2 ? 'bg-gray-400' :
                        place === 3 ? 'bg-amber-500' :
                        'bg-blue-400'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>

              {alt.description && (
                <p className="text-sm text-gray-500 mt-2 ml-14">{alt.description}</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
