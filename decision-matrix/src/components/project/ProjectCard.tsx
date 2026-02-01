import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import type { Project } from '@/types'
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

interface ProjectCardProps {
  project: Project
  onClick: () => void
  onDelete: () => void
}

export function ProjectCard({ project, onClick, onDelete }: ProjectCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="truncate">{project.name}</span>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-500 hover:text-red-600"
                onClick={(e) => e.stopPropagation()}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
              <AlertDialogHeader>
                <AlertDialogTitle>Удалить проект?</AlertDialogTitle>
                <AlertDialogDescription>
                  Проект &quot;{project.name}&quot; будет удалён безвозвратно.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Отмена</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete}>Удалить</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardTitle>
        {project.description && (
          <CardDescription className="truncate">{project.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Badge variant="secondary">{project.criteria.length} критериев</Badge>
          <Badge variant="secondary">{project.alternatives.length} альтернатив</Badge>
        </div>
      </CardContent>
      <CardFooter className="text-sm text-gray-500">
        {formatDate(project.updatedAt)}
      </CardFooter>
    </Card>
  )
}
