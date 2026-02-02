import { FolderOpen, Plus, Sparkles } from 'lucide-react'
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
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center glass rounded-3xl p-8">
        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6">
          <FolderOpen className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
          Нет проектов
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Создайте свой первый проект для оценки альтернатив по множеству критериев
        </p>
        <Button onClick={handleNewProject} className="glow-cyan">
          <Sparkles className="h-4 w-4 mr-2" />
          Создать проект
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Ваши проекты
        </h2>
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
