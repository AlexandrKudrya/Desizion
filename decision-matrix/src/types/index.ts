export const NormalizationType = {
  LINEAR: 'LINEAR',
  INVERSE_LINEAR: 'INVERSE_LINEAR',
  THRESHOLD: 'THRESHOLD',
  EXPONENTIAL: 'EXPONENTIAL',
  CATEGORICAL: 'CATEGORICAL'
} as const

export type NormalizationType = typeof NormalizationType[keyof typeof NormalizationType]

export interface CategoryMapping {
  label: string
  value: number
}

export interface LinearParams {
  min: number
  max: number
}

export interface InverseLinearParams {
  min: number
  max: number
  threshold: number
}

export interface ThresholdParams {
  min: number
  max: number
  threshold1: number
}

export interface ExponentialParams {
  min: number
  max: number
  threshold1: number
  threshold2: number // k coefficient
}

export interface CategoricalParams {
  categories: CategoryMapping[]
}

export type NormalizationParams =
  | LinearParams
  | InverseLinearParams
  | ThresholdParams
  | ExponentialParams
  | CategoricalParams

export interface Criterion {
  id: string
  name: string
  weight: number
  normType: NormalizationType
  params: NormalizationParams
  description?: string
}

export interface Alternative {
  id: string
  name: string
  description?: string
  values: Record<string, number | string | null>
  normalizedScores?: Record<string, number>
  totalScore?: number
}

export interface Project {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
  criteria: Criterion[]
  alternatives: Alternative[]
}
