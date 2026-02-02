# store/ - Zustand Store

## Файлы

| Файл | Описание |
|------|----------|
| `index.ts` | Главный store приложения с persist middleware для localStorage |

## Структура State

```typescript
interface AppState {
  // Данные
  projects: Project[]           // Все проекты
  currentProjectId: string | null  // ID открытого проекта

  // Actions
  createProject(name, description?)
  deleteProject(id)
  updateProject(id, updates)
  setCurrentProject(id)

  addCriterion(projectId, criterion)
  updateCriterion(projectId, id, updates)
  deleteCriterion(projectId, id)

  addAlternative(projectId, alternative)
  updateAlternative(projectId, id, updates)
  deleteAlternative(projectId, id)

  recalculateScores(projectId)
  exportProject(projectId): string
  importProject(jsonString)
}
```

## Middleware

- **persist** - автосохранение в localStorage (ключ: `decision-matrix-storage`)
- **devtools** - поддержка Redux DevTools для отладки

## Автоматический пересчёт

`recalculateScores()` вызывается автоматически при:
- Добавлении/изменении/удалении критерия
- Изменении значений альтернативы

## Использование в компонентах

```tsx
import { useStore } from '@/store'

function MyComponent() {
  // Получение данных
  const projects = useStore(state => state.projects)
  const currentProject = useStore(state =>
    state.projects.find(p => p.id === state.currentProjectId)
  )

  // Actions
  const createProject = useStore(state => state.createProject)
  const addCriterion = useStore(state => state.addCriterion)

  // Использование
  createProject('Новый проект')
  addCriterion(projectId, { name: 'Цена', weight: 0.3, ... })
}
```

## Оптимизация

- Zustand автоматически оптимизирует ре-рендеры
- Используйте селекторы для подписки на конкретные поля
- Для сравнения объектов используйте `shallow` из `zustand/shallow`
