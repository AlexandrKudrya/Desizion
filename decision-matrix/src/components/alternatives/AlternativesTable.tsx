import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AlternativeDialog } from './AlternativeDialog'
import { useStore } from '@/store'
import type { Alternative, Criterion } from '@/types'
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

interface AlternativesTableProps {
  projectId: string
  alternatives: Alternative[]
  criteria: Criterion[]
}

export function AlternativesTable({ projectId, alternatives, criteria }: AlternativesTableProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingAlt, setEditingAlt] = useState<Alternative | null>(null)

  const addAlternative = useStore(state => state.addAlternative)
  const updateAlternative = useStore(state => state.updateAlternative)
  const deleteAlternative = useStore(state => state.deleteAlternative)

  const handleSave = (data: Omit<Alternative, 'id'>) => {
    if (editingAlt) {
      updateAlternative(projectId, editingAlt.id, data)
    } else {
      addAlternative(projectId, data)
    }
    setDialogOpen(false)
    setEditingAlt(null)
  }

  const handleEdit = (alt: Alternative) => {
    setEditingAlt(alt)
    setDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    deleteAlternative(projectId, id)
  }

  const formatValue = (value: string | number | null | undefined): string => {
    if (value === null || value === undefined) return '-'
    return String(value)
  }

  if (criteria.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-border rounded-2xl">
        <p className="mb-2">Сначала добавьте критерии</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Альтернативы</h3>
        <Button size="sm" onClick={() => { setEditingAlt(null); setDialogOpen(true) }}>
          <Plus className="h-4 w-4 mr-2" />
          Добавить
        </Button>
      </div>

      {alternatives.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-border rounded-2xl">
          <p className="mb-2">Нет альтернатив</p>
          <Button variant="link" onClick={() => setDialogOpen(true)}>
            Добавить первую альтернативу
          </Button>
        </div>
      ) : (
        <div className="border border-border rounded-2xl overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Название</th>
                {criteria.map(c => (
                  <th key={c.id} className="text-center px-4 py-3 text-sm font-medium text-muted-foreground min-w-[100px]">
                    {c.name}
                  </th>
                ))}
                <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground w-24">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {alternatives.map(alt => (
                <tr key={alt.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{alt.name}</div>
                    {alt.description && (
                      <div className="text-sm text-muted-foreground">{alt.description}</div>
                    )}
                  </td>
                  {criteria.map(c => (
                    <td key={c.id} className="px-4 py-3 text-center text-foreground">
                      {formatValue(alt.values[c.id])}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(alt)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Удалить альтернативу?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Альтернатива &quot;{alt.name}&quot; будет удалена безвозвратно.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Отмена</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(alt.id)}>
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

      <AlternativeDialog
        open={dialogOpen}
        alternative={editingAlt}
        criteria={criteria}
        onClose={() => { setDialogOpen(false); setEditingAlt(null) }}
        onSave={handleSave}
      />
    </div>
  )
}
