import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import {
  NormalizationType,
  type NormalizationParams,
  type LinearParams,
  type InverseLinearParams,
  type ThresholdParams,
  type ExponentialParams,
  type CategoricalParams
} from '@/types'

interface NormalizationParamsInputProps {
  normType: NormalizationType
  params: NormalizationParams
  onChange: (params: NormalizationParams) => void
}

export function NormalizationParamsInput({ normType, params, onChange }: NormalizationParamsInputProps) {
  switch (normType) {
    case NormalizationType.LINEAR: {
      const p = params as LinearParams
      return (
        <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Минимум</Label>
              <Input
                type="number"
                value={p.min}
                onChange={(e) => onChange({ ...p, min: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label className="text-xs">Максимум</Label>
              <Input
                type="number"
                value={p.max}
                onChange={(e) => onChange({ ...p, max: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
        </div>
      )
    }

    case NormalizationType.INVERSE_LINEAR: {
      const p = params as InverseLinearParams
      return (
        <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Минимум</Label>
              <Input
                type="number"
                value={p.min}
                onChange={(e) => onChange({ ...p, min: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label className="text-xs">Максимум</Label>
              <Input
                type="number"
                value={p.max}
                onChange={(e) => onChange({ ...p, max: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
          <div>
            <Label className="text-xs">Порог идеала (до этого = 100%)</Label>
            <Input
              type="number"
              value={p.threshold}
              onChange={(e) => onChange({ ...p, threshold: parseFloat(e.target.value) || 0 })}
            />
          </div>
        </div>
      )
    }

    case NormalizationType.THRESHOLD: {
      const p = params as ThresholdParams
      return (
        <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Минимум</Label>
              <Input
                type="number"
                value={p.min}
                onChange={(e) => onChange({ ...p, min: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label className="text-xs">Критич. максимум</Label>
              <Input
                type="number"
                value={p.max}
                onChange={(e) => onChange({ ...p, max: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
          <div>
            <Label className="text-xs">Порог идеала</Label>
            <Input
              type="number"
              value={p.threshold1}
              onChange={(e) => onChange({ ...p, threshold1: parseFloat(e.target.value) || 0 })}
            />
          </div>
        </div>
      )
    }

    case NormalizationType.EXPONENTIAL: {
      const p = params as ExponentialParams
      return (
        <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Минимум</Label>
              <Input
                type="number"
                value={p.min}
                onChange={(e) => onChange({ ...p, min: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label className="text-xs">Максимум</Label>
              <Input
                type="number"
                value={p.max}
                onChange={(e) => onChange({ ...p, max: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Порог комфорта</Label>
              <Input
                type="number"
                value={p.threshold1}
                onChange={(e) => onChange({ ...p, threshold1: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label className="text-xs">Коэфф. спада (k)</Label>
              <Input
                type="number"
                step="0.01"
                value={p.threshold2}
                onChange={(e) => onChange({ ...p, threshold2: parseFloat(e.target.value) || 0.1 })}
              />
            </div>
          </div>
        </div>
      )
    }

    case NormalizationType.CATEGORICAL: {
      const p = params as CategoricalParams
      const categories = p.categories || []

      const addCategory = () => {
        onChange({
          ...p,
          categories: [...categories, { label: '', value: 0.5 }]
        })
      }

      const updateCategory = (index: number, field: 'label' | 'value', value: string | number) => {
        const updated = [...categories]
        updated[index] = { ...updated[index], [field]: value }
        onChange({ ...p, categories: updated })
      }

      const removeCategory = (index: number) => {
        onChange({
          ...p,
          categories: categories.filter((_, i) => i !== index)
        })
      }

      return (
        <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Категории</Label>
            <Button type="button" variant="ghost" size="sm" onClick={addCategory}>
              <Plus className="h-4 w-4 mr-1" />
              Добавить
            </Button>
          </div>
          <div className="space-y-2">
            {categories.map((cat, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  placeholder="Название"
                  value={cat.label}
                  onChange={(e) => updateCategory(index, 'label', e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={cat.value}
                  onChange={(e) => updateCategory(index, 'value', parseFloat(e.target.value) || 0)}
                  className="w-20"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-600"
                  onClick={() => removeCategory(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )
    }

    default:
      return null
  }
}
