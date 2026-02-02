import type {
  Criterion,
  NormalizationType,
  LinearParams,
  InverseLinearParams,
  ThresholdParams,
  ExponentialParams,
  CategoricalParams,
  CategoryMapping
} from '@/types'
import { clamp } from './utils'

/**
 * Линейная нормализация: чем больше значение, тем лучше
 * Формула: (value - min) / (max - min)
 */
export function normalizeLinear(value: number, min: number, max: number): number {
  if (max === min) return 1
  return clamp((value - min) / (max - min), 0, 1)
}

/**
 * Обратная линейная нормализация: чем меньше значение, тем лучше
 * До threshold = 1.0 (идеально)
 * После threshold - линейное падение до 0
 */
export function normalizeInverseLinear(
  value: number,
  _min: number,
  max: number,
  threshold: number
): number {
  if (value <= threshold) return 1.0
  if (value >= max) return 0
  return clamp((max - value) / (max - threshold), 0, 1)
}

/**
 * Пороговая нормализация с критической границей
 * value <= threshold1 → 1.0 (идеально)
 * threshold1 < value <= max → линейное падение от 1.0 до 0.5
 * value > max → 0 (неприемлемо)
 */
export function normalizeThreshold(
  value: number,
  _min: number,
  max: number,
  threshold1: number
): number {
  if (value <= threshold1) return 1.0
  if (value > max) return 0
  // Линейное падение от 1.0 до 0 между threshold1 и max
  return clamp(1 - (value - threshold1) / (max - threshold1), 0, 1)
}

/**
 * Экспоненциальная нормализация с убывающей важностью
 * До threshold1 → 1.0
 * После threshold1 → exp(-k * (value - threshold1))
 */
export function normalizeExponential(
  value: number,
  _min: number,
  _max: number,
  threshold1: number,
  k: number
): number {
  if (value <= threshold1) return 1.0
  return clamp(Math.exp(-k * (value - threshold1)), 0, 1)
}

/**
 * Категориальная нормализация - маппинг на фиксированные значения
 */
export function normalizeCategorical(
  value: string,
  categories: CategoryMapping[]
): number {
  const found = categories.find(c => c.label === value)
  return found ? found.value : 0
}

/**
 * Главная функция-диспетчер нормализации
 */
export function normalize(
  value: number | string | null | undefined,
  criterion: Criterion
): number {
  if (value === null || value === undefined) return 0

  const { normType, params } = criterion

  switch (normType) {
    case 'LINEAR' as NormalizationType: {
      const p = params as LinearParams
      return normalizeLinear(value as number, p.min, p.max)
    }
    case 'INVERSE_LINEAR' as NormalizationType: {
      const p = params as InverseLinearParams
      return normalizeInverseLinear(value as number, p.min, p.max, p.threshold)
    }
    case 'THRESHOLD' as NormalizationType: {
      const p = params as ThresholdParams
      return normalizeThreshold(value as number, p.min, p.max, p.threshold1)
    }
    case 'EXPONENTIAL' as NormalizationType: {
      const p = params as ExponentialParams
      return normalizeExponential(value as number, p.min, p.max, p.threshold1, p.threshold2)
    }
    case 'CATEGORICAL' as NormalizationType: {
      const p = params as CategoricalParams
      return normalizeCategorical(value as string, p.categories)
    }
    default:
      return 0
  }
}
