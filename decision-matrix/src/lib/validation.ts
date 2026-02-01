import { z } from 'zod'

const CategoryMappingSchema = z.object({
  label: z.string().min(1),
  value: z.number().min(0).max(1)
})

const LinearParamsSchema = z.object({
  min: z.number(),
  max: z.number()
})

const InverseLinearParamsSchema = z.object({
  min: z.number(),
  max: z.number(),
  threshold: z.number()
})

const ThresholdParamsSchema = z.object({
  min: z.number(),
  max: z.number(),
  threshold1: z.number()
})

const ExponentialParamsSchema = z.object({
  min: z.number(),
  max: z.number(),
  threshold1: z.number(),
  threshold2: z.number()
})

const CategoricalParamsSchema = z.object({
  categories: z.array(CategoryMappingSchema)
})

export const NormalizationParamsSchema = z.union([
  LinearParamsSchema,
  InverseLinearParamsSchema,
  ThresholdParamsSchema,
  ExponentialParamsSchema,
  CategoricalParamsSchema
])

export const CriterionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  weight: z.number().min(0).max(1),
  normType: z.enum(['LINEAR', 'INVERSE_LINEAR', 'THRESHOLD', 'EXPONENTIAL', 'CATEGORICAL']),
  params: NormalizationParamsSchema,
  description: z.string().optional()
})

export const AlternativeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  values: z.record(z.string(), z.union([z.number(), z.string(), z.null()])),
  normalizedScores: z.record(z.string(), z.number()).optional(),
  totalScore: z.number().optional()
})

export const ProjectSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  criteria: z.array(CriterionSchema),
  alternatives: z.array(AlternativeSchema)
})

export type CriterionFormData = z.infer<typeof CriterionSchema>
export type AlternativeFormData = z.infer<typeof AlternativeSchema>
export type ProjectFormData = z.infer<typeof ProjectSchema>
