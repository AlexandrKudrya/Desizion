import { FolderOpen, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStore } from '@/store'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/utils'

export function Sidebar() {
  const projects = useStore(state => state.projects)
  const currentProjectId = useStore(state => state.currentProjectId)
  const setCurrentProject = useStore(state => state.setCurrentProject)
  const createProject = useStore(state => state.createProject)

  const handleNewProject = () => {
    const name = prompt('Название проекта:')
    if (name) {
      createProject(name)
    }
  }

  return (
    <aside className="w-64 border-r bg-gray-50 p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-700">Проекты</h2>
        <Button variant="ghost" size="icon" onClick={handleNewProject}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        {projects.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <FolderOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Нет проектов</p>
            <Button variant="link" className="text-sm" onClick={handleNewProject}>
              Создать первый
            </Button>
          </div>
        ) : (
          <ul className="space-y-1">
            {projects.map(project => (
              <li key={project.id}>
                <button
                  onClick={() => setCurrentProject(project.id)}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-md transition-colors',
                    currentProjectId === project.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-gray-200 text-gray-700'
                  )}
                >
                  <div className="font-medium truncate">{project.name}</div>
                  <div className={cn(
                    'text-xs',
                    currentProjectId === project.id ? 'opacity-80' : 'text-gray-500'
                  )}>
                    {formatDate(project.updatedAt)}
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
