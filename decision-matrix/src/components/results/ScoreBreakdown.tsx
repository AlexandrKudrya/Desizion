import { Badge } from '@/components/ui/badge'
import type { Alternative, Criterion } from '@/types'

interface ScoreBreakdownProps {
  alternative: Alternative
  criteria: Criterion[]
}

export function ScoreBreakdown({ alternative, criteria }: ScoreBreakdownProps) {
  const normalizedScores = alternative.normalizedScores || {}

  return (
    <div className="border border-border rounded-2xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-secondary/50">
          <tr>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Критерий</th>
            <th className="text-center px-4 py-3 text-sm font-medium text-muted-foreground">Значение</th>
            <th className="text-center px-4 py-3 text-sm font-medium text-muted-foreground">Норм.</th>
            <th className="text-center px-4 py-3 text-sm font-medium text-muted-foreground">Вес</th>
            <th className="text-center px-4 py-3 text-sm font-medium text-muted-foreground">Вклад</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {criteria.map(criterion => {
            const value = alternative.values[criterion.id]
            const normalized = normalizedScores[criterion.id] || 0
            const contribution = normalized * criterion.weight

            return (
              <tr key={criterion.id} className="hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground">{criterion.name}</td>
                <td className="px-4 py-3 text-center text-foreground">
                  {value !== null && value !== undefined ? String(value) : '-'}
                </td>
                <td className="px-4 py-3 text-center">
                  <Badge variant="outline">{(normalized * 100).toFixed(0)}%</Badge>
                </td>
                <td className="px-4 py-3 text-center">
                  <Badge variant="secondary">{(criterion.weight * 100).toFixed(0)}%</Badge>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center gap-2 justify-center">
                    <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full neon-progress"
                        style={{ width: `${contribution * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {(contribution * 100).toFixed(1)}%
                    </span>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
        <tfoot className="bg-secondary/50">
          <tr>
            <td colSpan={4} className="px-4 py-3 text-right font-medium text-foreground">Итого:</td>
            <td className="px-4 py-3 text-center">
              <Badge className="glow-cyan">{((alternative.totalScore || 0) * 100).toFixed(1)}%</Badge>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
