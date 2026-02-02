import { Badge } from '@/components/ui/badge'
import type { Alternative, Criterion } from '@/types'

interface ScoreBreakdownProps {
  alternative: Alternative
  criteria: Criterion[]
}

export function ScoreBreakdown({ alternative, criteria }: ScoreBreakdownProps) {
  const normalizedScores = alternative.normalizedScores || {}

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Критерий</th>
            <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">Значение</th>
            <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">Норм.</th>
            <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">Вес</th>
            <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">Вклад</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {criteria.map(criterion => {
            const value = alternative.values[criterion.id]
            const normalized = normalizedScores[criterion.id] || 0
            const contribution = normalized * criterion.weight

            return (
              <tr key={criterion.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{criterion.name}</td>
                <td className="px-4 py-3 text-center">
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
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${contribution * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">
                      {(contribution * 100).toFixed(1)}%
                    </span>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
        <tfoot className="bg-gray-50">
          <tr>
            <td colSpan={4} className="px-4 py-3 text-right font-medium">Итого:</td>
            <td className="px-4 py-3 text-center">
              <Badge>{((alternative.totalScore || 0) * 100).toFixed(1)}%</Badge>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
