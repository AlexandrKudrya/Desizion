import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { NormalizationType, type Criterion, type CategoricalParams } from '@/types'

interface CriterionValueInputProps {
  criterion: Criterion
  value: number | string | null | undefined
  onChange: (value: number | string | null) => void
}

export function CriterionValueInput({ criterion, value, onChange }: CriterionValueInputProps) {
  if (criterion.normType === NormalizationType.CATEGORICAL) {
    const params = criterion.params as CategoricalParams
    const categories = params.categories || []

    return (
      <div className="space-y-1">
        <Label className="text-xs">{criterion.name}</Label>
        <Select
          value={value as string || ''}
          onValueChange={(v) => onChange(v || null)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Выберите..." />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat, idx) => (
              <SelectItem key={idx} value={cat.label}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <Label className="text-xs">{criterion.name}</Label>
      <Input
        type="number"
        step="any"
        value={value !== null && value !== undefined ? String(value) : ''}
        onChange={(e) => {
          const val = e.target.value
          if (val === '') {
            onChange(null)
          } else {
            onChange(parseFloat(val))
          }
        }}
        placeholder="Введите значение..."
      />
    </div>
  )
}
