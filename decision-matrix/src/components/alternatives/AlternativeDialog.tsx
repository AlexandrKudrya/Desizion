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
import { CriterionValueInput } from './CriterionValueInput'
import type { Alternative, Criterion } from '@/types'

interface AlternativeDialogProps {
  open: boolean
  alternative: Alternative | null
  criteria: Criterion[]
  onClose: () => void
  onSave: (data: Omit<Alternative, 'id'>) => void
}

export function AlternativeDialog({ open, alternative, criteria, onClose, onSave }: AlternativeDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [values, setValues] = useState<Record<string, number | string | null>>({})

  useEffect(() => {
    if (alternative) {
      setName(alternative.name)
      setDescription(alternative.description || '')
      setValues(alternative.values || {})
    } else {
      setName('')
      setDescription('')
      setValues({})
    }
  }, [alternative, open])

  const handleValueChange = (criterionId: string, value: number | string | null) => {
    setValues(prev => ({ ...prev, [criterionId]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    onSave({
      name: name.trim(),
      description: description.trim() || undefined,
      values
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{alternative ? 'Редактировать альтернативу' : 'Новая альтернатива'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Название</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: Квартира на Приморской..."
              required
            />
          </div>

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

          {criteria.length > 0 && (
            <div className="space-y-3">
              <Label>Значения по критериям</Label>
              <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                {criteria.map(criterion => (
                  <CriterionValueInput
                    key={criterion.id}
                    criterion={criterion}
                    value={values[criterion.id]}
                    onChange={(value) => handleValueChange(criterion.id, value)}
                  />
                ))}
              </div>
            </div>
          )}

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
