import type { Alternative, Criterion } from '@/types'
import { normalize } from './normalization'

/**
 * Нормализует все оценки альтернативы по критериям
 */
export function calculateNormalizedScores(
  alternative: Alternative,
  criteria: Criterion[]
): Record<string, number> {
  const scores: Record<string, number> = {}

  for (const criterion of criteria) {
    const value = alternative.values[criterion.id]
    scores[criterion.id] = normalize(value, criterion)
  }

  return scores
}

/**
 * Рассчитывает взвешенный итоговый рейтинг
 * totalScore = Σ (normalizedScore[i] * weight[i])
 */
export function calculateTotalScore(
  alternative: Alternative,
  criteria: Criterion[]
): number {
  const normalizedScores = alternative.normalizedScores ??
    calculateNormalizedScores(alternative, criteria)

  let totalScore = 0

  for (const criterion of criteria) {
    const score = normalizedScores[criterion.id] ?? 0
    totalScore += score * criterion.weight
  }

  return totalScore
}

/**
 * Сортирует альтернативы по убыванию рейтинга
 */
export function rankAlternatives(
  alternatives: Alternative[],
  criteria: Criterion[]
): Alternative[] {
  const withScores = alternatives.map(alt => ({
    ...alt,
    normalizedScores: calculateNormalizedScores(alt, criteria),
    totalScore: calculateTotalScore(
      { ...alt, normalizedScores: calculateNormalizedScores(alt, criteria) },
      criteria
    )
  }))

  return [...withScores].sort((a, b) => (b.totalScore ?? 0) - (a.totalScore ?? 0))
}
