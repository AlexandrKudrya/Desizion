import { Plus, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStore } from '@/store'
import { useRef } from 'react'

export function Header() {
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
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">DecisionMatrix</h1>
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="px-2 md:px-3"
          >
            <Upload className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Импорт</span>
          </Button>
          <Button size="sm" onClick={handleNewProject} className="px-2 md:px-3">
            <Plus className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Новый проект</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
