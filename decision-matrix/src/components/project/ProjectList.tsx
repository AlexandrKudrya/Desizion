import { FolderOpen, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProjectCard } from './ProjectCard'
import { useStore } from '@/store'

export function ProjectList() {
  const projects = useStore(state => state.projects)
  const setCurrentProject = useStore(state => state.setCurrentProject)
  const deleteProject = useStore(state => state.deleteProject)
  const createProject = useStore(state => state.createProject)

  const handleNewProject = () => {
    const name = prompt('Название проекта:')
    if (name) {
      createProject(name)
    }
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <FolderOpen className="h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Нет проектов</h2>
        <p className="text-gray-500 mb-4">
          Создайте свой первый проект для оценки альтернатив
        </p>
        <Button onClick={handleNewProject}>
          <Plus className="h-4 w-4 mr-2" />
          Создать проект
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Ваши проекты</h2>
        <Button onClick={handleNewProject}>
          <Plus className="h-4 w-4 mr-2" />
          Новый проект
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => setCurrentProject(project.id)}
            onDelete={() => deleteProject(project.id)}
          />
        ))}
      </div>
    </div>
  )
}
