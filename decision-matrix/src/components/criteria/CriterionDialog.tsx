import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { NormalizationParamsInput } from './NormalizationParamsInput'
import { NormalizationType, type Criterion, type NormalizationParams } from '@/types'

interface CriterionDialogProps {
  open: boolean
  criterion: Criterion | null
  onClose: () => void
  onSave: (data: Omit<Criterion, 'id'>) => void
}

const defaultParams: Record<NormalizationType, NormalizationParams> = {
  [NormalizationType.LINEAR]: { min: 0, max: 100 },
  [NormalizationType.INVERSE_LINEAR]: { min: 0, max: 100, threshold: 50 },
  [NormalizationType.THRESHOLD]: { min: 0, max: 100, threshold1: 50 },
  [NormalizationType.EXPONENTIAL]: { min: 0, max: 100, threshold1: 50, threshold2: 0.1 },
  [NormalizationType.CATEGORICAL]: { categories: [{ label: 'Хорошо', value: 1 }, { label: 'Плохо', value: 0 }] }
}

export function CriterionDialog({ open, criterion, onClose, onSave }: CriterionDialogProps) {
  const [name, setName] = useState('')
  const [weight, setWeight] = useState(10)
  const [normType, setNormType] = useState<NormalizationType>(NormalizationType.LINEAR)
  const [params, setParams] = useState<NormalizationParams>(defaultParams[NormalizationType.LINEAR])
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (criterion) {
      setName(criterion.name)
      setWeight(Math.round(criterion.weight * 100))
      setNormType(criterion.normType)
      setParams(criterion.params)
      setDescription(criterion.description || '')
    } else {
      setName('')
      setWeight(10)
      setNormType(NormalizationType.LINEAR)
      setParams(defaultParams[NormalizationType.LINEAR])
      setDescription('')
    }
  }, [criterion, open])

  const handleNormTypeChange = (value: NormalizationType) => {
    setNormType(value)
    setParams(defaultParams[value])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    onSave({
      name: name.trim(),
      weight: weight / 100,
      normType,
      params,
      description: description.trim() || undefined
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{criterion ? 'Редактировать критерий' : 'Новый критерий'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Название</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: Цена, Расстояние..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Вес (%)</Label>
            <Input
              id="weight"
              type="number"
              min={1}
              max={100}
              value={weight}
              onChange={(e) => setWeight(parseInt(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label>Тип нормализации</Label>
            <Select value={normType} onValueChange={(v) => handleNormTypeChange(v as NormalizationType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NormalizationType.LINEAR}>
                  Линейная (больше = лучше)
                </SelectItem>
                <SelectItem value={NormalizationType.INVERSE_LINEAR}>
                  Обратная (меньше = лучше)
                </SelectItem>
                <SelectItem value={NormalizationType.THRESHOLD}>
                  Пороговая (с критич. границей)
                </SelectItem>
                <SelectItem value={NormalizationType.EXPONENTIAL}>
                  Экспоненциальная
                </SelectItem>
                <SelectItem value={NormalizationType.CATEGORICAL}>
                  Категориальная
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <NormalizationParamsInput
            normType={normType}
            params={params}
            onChange={setParams}
          />

          <div className="space-y-2">
            <Label htmlFor="description">Описание (опционально)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Дополнительные пояснения..."
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit">Сохранить</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
