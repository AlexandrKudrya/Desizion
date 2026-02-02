import { FolderOpen, Plus, Folder } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStore } from '@/store'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/utils'

interface SidebarProps {
  onNavigate?: () => void
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const projects = useStore(state => state.projects)
  const currentProjectId = useStore(state => state.currentProjectId)
  const setCurrentProject = useStore(state => state.setCurrentProject)
  const createProject = useStore(state => state.createProject)

  const handleNewProject = () => {
    const name = prompt('Название проекта:')
    if (name) {
      createProject(name)
      onNavigate?.()
    }
  }

  const handleSelectProject = (id: string) => {
    setCurrentProject(id)
    onNavigate?.()
  }

  return (
    <aside className="w-full h-full p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-muted-foreground hidden md:block">Проекты</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNewProject}
          className="hover:bg-primary/10 hover:text-primary"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto space-y-1">
        {projects.length === 0 ? (
          <div className="text-center py-8">
            <FolderOpen className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground mb-3">Нет проектов</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNewProject}
              className="border-primary/50 text-primary hover:bg-primary/10"
            >
              <Plus className="h-4 w-4 mr-2" />
              Создать первый
            </Button>
          </div>
        ) : (
          <ul className="space-y-1">
            {projects.map(project => (
              <li key={project.id}>
                <button
                  onClick={() => handleSelectProject(project.id)}
                  className={cn(
                    'w-full text-left px-3 py-3 rounded-xl transition-all duration-200 group',
                    currentProjectId === project.id
                      ? 'bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30'
                      : 'hover:bg-secondary/50 border border-transparent'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'mt-0.5 p-1.5 rounded-lg transition-colors',
                      currentProjectId === project.id
                        ? 'bg-primary/20 text-primary'
                        : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                    )}>
                      <Folder className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={cn(
                        'font-medium truncate transition-colors',
                        currentProjectId === project.id
                          ? 'text-primary'
                          : 'text-foreground group-hover:text-primary'
                      )}>
                        {project.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(project.updatedAt)}
                      </div>
                      <div className="flex gap-2 mt-1 text-xs text-muted-foreground">
                        <span>{project.criteria.length} крит.</span>
                        <span>·</span>
                        <span>{project.alternatives.length} альт.</span>
                      </div>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  )
}
