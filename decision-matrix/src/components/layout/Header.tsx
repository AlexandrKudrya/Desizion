import { Plus, Upload, Menu, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStore } from '@/store'
import { useRef } from 'react'

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const createProject = useStore(state => state.createProject)
  const importProject = useStore(state => state.importProject)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleNewProject = () => {
    const name = prompt('Название проекта:')
    if (name) {
      createProject(name)
    }
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string
        importProject(json)
      } catch {
        alert('Ошибка импорта: неверный формат файла')
      }
    }
    reader.readAsText(file)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <header className="h-16 glass border-b border-border/50 sticky top-0 z-50">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              DecisionMatrix
            </h1>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="text-muted-foreground hover:text-foreground"
          >
            <Upload className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Импорт</span>
          </Button>
          <Button
            size="sm"
            onClick={handleNewProject}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Новый проект</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
