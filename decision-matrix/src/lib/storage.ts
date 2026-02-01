import type { Project } from '@/types'

const STORAGE_KEY = 'decision-matrix-projects'

/**
 * Сохраняет все проекты в localStorage
 */
export function saveProjects(projects: Project[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
  } catch (error) {
    console.error('Failed to save projects:', error)
  }
}

/**
 * Загружает проекты из localStorage
 */
export function loadProjects(): Project[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return []
    return JSON.parse(data) as Project[]
  } catch (error) {
    console.error('Failed to load projects:', error)
    return []
  }
}

/**
 * Экспортирует проект в JSON строку
 */
export function exportProject(project: Project): string {
  return JSON.stringify(project, null, 2)
}

/**
 * Импортирует проект из JSON строки
 */
export function importProject(jsonString: string): Project {
  const data = JSON.parse(jsonString)

  // Базовая валидация
  if (!data.id || !data.name || !Array.isArray(data.criteria) || !Array.isArray(data.alternatives)) {
    throw new Error('Invalid project format')
  }

  return data as Project
}
