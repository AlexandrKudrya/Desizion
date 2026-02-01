import { useState } from 'react'
import { Plus, Pencil, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CriterionDialog } from './CriterionDialog'
import { useStore } from '@/store'
import type { Criterion, NormalizationType } from '@/types'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface CriteriaListProps {
  projectId: string
  criteria: Criterion[]
}

const normTypeLabels: Record<NormalizationType, string> = {
  LINEAR: 'Линейная',
  INVERSE_LINEAR: 'Обратная',
  THRESHOLD: 'Пороговая',
  EXPONENTIAL: 'Экспоненц.',
  CATEGORICAL: 'Категориальная'
}

export function CriteriaList({ projectId, criteria }: CriteriaListProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCriterion, setEditingCriterion] = useState<Criterion | null>(null)

  const addCriterion = useStore(state => state.addCriterion)
  const updateCriterion = useStore(state => state.updateCriterion)
  const deleteCriterion = useStore(state => state.deleteCriterion)

  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0)
  const isWeightValid = Math.abs(totalWeight - 1) < 0.01

  const handleSave = (data: Omit<Criterion, 'id'>) => {
    if (editingCriterion) {
      updateCriterion(projectId, editingCriterion.id, data)
    } else {
      addCriterion(projectId, data)
    }
    setDialogOpen(false)
    setEditingCriterion(null)
  }

  const handleEdit = (criterion: Criterion) => {
    setEditingCriterion(criterion)
    setDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    deleteCriterion(projectId, id)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Критерии</h3>
          {criteria.length > 0 && (
            <div className="flex items-center gap-1">
              {isWeightValid ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-orange-500" />
              )}
              <span className={isWeightValid ? 'text-green-600 text-sm' : 'text-orange-500 text-sm'}>
                {(totalWeight * 100).toFixed(0)}%
              </span>
            </div>
          )}
        </div>
        <Button size="sm" onClick={() => { setEditingCriterion(null); setDialogOpen(true) }}>
          <Plus className="h-4 w-4 mr-2" />
          Добавить
        </Button>
      </div>

      {criteria.length === 0 ? (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
          <p className="mb-2">Нет критериев</p>
          <Button variant="link" onClick={() => setDialogOpen(true)}>
            Добавить первый критерий
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Название</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-gray-600 w-24">Вес</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-gray-600 w-32">Тип</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600 w-24">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {criteria.map(criterion => (
                <tr key={criterion.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium">{criterion.name}</div>
                    {criterion.description && (
                      <div className="text-sm text-gray-500">{criterion.description}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant="outline">{(criterion.weight * 100).toFixed(0)}%</Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant="secondary">{normTypeLabels[criterion.normType]}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(criterion)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Удалить критерий?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Критерий &quot;{criterion.name}&quot; будет удалён.
                              Значения этого критерия во всех альтернативах будут потеряны.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Отмена</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(criterion.id)}>
                              Удалить
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CriterionDialog
        open={dialogOpen}
        criterion={editingCriterion}
        onClose={() => { setDialogOpen(false); setEditingCriterion(null) }}
        onSave={handleSave}
      />
    </div>
  )
}
