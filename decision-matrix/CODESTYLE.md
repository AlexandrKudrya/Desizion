# Code Style Guide для AI-ассистентов

Этот файл описывает правила и ограничения ESLint/TypeScript для проекта, чтобы нейронки сразу генерировали валидный код.

## Быстрый чеклист

- [ ] Не используй `useEffect` для инициализации состояния из пропсов
- [ ] Не экспортируй константы из файлов с компонентами
- [ ] Используй `type` вместо пустых `interface`
- [ ] Помечай неиспользуемые параметры через `_`

---

## 1. React Hooks

### ❌ Нельзя: setState в useEffect

```tsx
// ПЛОХО - вызовет ошибку линтера
useEffect(() => {
  setName(props.name)        // ❌ react-hooks/set-state-in-effect
  setValues(props.values)    // ❌
}, [props])
```

### ✅ Правильно: key для сброса состояния

```tsx
// ХОРОШО - используй key для "сброса" компонента
function Dialog({ item, onClose }) {
  return (
    <DialogContainer>
      <DialogContent
        key={item?.id ?? 'new'}  // ✅ key сбрасывает состояние
        item={item}
        onClose={onClose}
      />
    </DialogContainer>
  )
}

function DialogContent({ item }) {
  // ✅ Инициализация из пропсов в useState - ок
  const [name, setName] = useState(item?.name ?? '')
  // ...
}
```

### ✅ Альтернатива: useMemo для derived state

```tsx
// ХОРОШО - для вычисляемых значений
const fullName = useMemo(() =>
  `${firstName} ${lastName}`,
  [firstName, lastName]
)
```

---

## 2. Экспорты из файлов компонентов

### ❌ Нельзя: экспорт констант вместе с компонентами

```tsx
// ПЛОХО - react-refresh/only-export-components
const buttonVariants = cva(...)

export { Button, buttonVariants }  // ❌ buttonVariants - не компонент
```

### ✅ Правильно: экспортируй только компоненты

```tsx
// ХОРОШО - только компоненты
const buttonVariants = cva(...)  // не экспортируем

export { Button }  // ✅ только компонент
```

### ✅ Альтернатива: отдельный файл для констант

```tsx
// button.variants.ts
export const buttonVariants = cva(...)

// button.tsx
import { buttonVariants } from './button.variants'
export { Button }
```

---

## 3. TypeScript интерфейсы

### ❌ Нельзя: пустые интерфейсы

```tsx
// ПЛОХО - @typescript-eslint/no-empty-object-type
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}  // ❌ пустой
```

### ✅ Правильно: используй type alias

```tsx
// ХОРОШО - type alias вместо пустого interface
export type InputProps = React.InputHTMLAttributes<HTMLInputElement>  // ✅
```

### ✅ Когда interface OK

```tsx
// ХОРОШО - interface с дополнительными полями
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline'  // есть свои поля
  size?: 'sm' | 'lg'
}
```

---

## 4. Неиспользуемые параметры

### ❌ Нельзя: объявленные но неиспользуемые

```tsx
// ПЛОХО - @typescript-eslint/no-unused-vars
function normalize(value: number, min: number, max: number) {
  return value  // min и max не используются ❌
}
```

### ✅ Правильно: underscore prefix

```tsx
// ХОРОШО - underscore показывает намеренное неиспользование
function normalize(value: number, _min: number, _max: number) {
  return value  // ✅ _min и _max - ок
}
```

---

## 5. Enum vs const object

### ⚠️ Особенность: erasableSyntaxOnly

В проекте включён `erasableSyntaxOnly`, поэтому:

```tsx
// РАБОТАЕТ
export const NormalizationType = {
  LINEAR: 'LINEAR',
  INVERSE: 'INVERSE',
} as const

export type NormalizationType = typeof NormalizationType[keyof typeof NormalizationType]
```

```tsx
// ❌ НЕ РАБОТАЕТ с erasableSyntaxOnly
export enum NormalizationType {
  LINEAR = 'LINEAR',
  INVERSE = 'INVERSE',
}
```

---

## 6. Импорты

### Порядок импортов

```tsx
// 1. React
import { useState, useEffect } from 'react'

// 2. Внешние библиотеки
import { cva } from 'class-variance-authority'
import { z } from 'zod'

// 3. Внутренние компоненты (абсолютные пути)
import { Button } from '@/components/ui/button'
import { useStore } from '@/store'

// 4. Типы
import type { Criterion, Alternative } from '@/types'

// 5. Утилиты
import { cn } from '@/lib/utils'
```

### Type-only импорты

```tsx
// Предпочтительно для типов
import type { Criterion } from '@/types'

// Или inline
import { type Criterion, NormalizationType } from '@/types'
```

---

## 7. Компоненты

### Структура файла компонента

```tsx
// 1. Импорты
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { Item } from '@/types'

// 2. Типы/интерфейсы (локальные)
interface ItemCardProps {
  item: Item
  onSelect: (id: string) => void
}

// 3. Константы (не экспортировать!)
const MAX_ITEMS = 10

// 4. Компонент
export function ItemCard({ item, onSelect }: ItemCardProps) {
  const [expanded, setExpanded] = useState(false)

  // handlers
  const handleClick = () => {
    onSelect(item.id)
  }

  // render
  return (
    <div onClick={handleClick}>
      {item.name}
    </div>
  )
}

// 5. Вспомогательные компоненты (в том же файле, если маленькие)
function ItemBadge({ count }: { count: number }) {
  return <span>{count}</span>
}
```

### Naming conventions

```tsx
// Компоненты - PascalCase
function UserCard() {}
function ProjectList() {}

// Props - PascalCase + Props suffix
interface UserCardProps {}

// Handlers - handle + Action
const handleClick = () => {}
const handleSubmit = () => {}

// Boolean props - is/has/should prefix
interface Props {
  isLoading: boolean
  hasError: boolean
  shouldAutoFocus: boolean
}
```

---

## 8. Стили (Tailwind)

### Conditional classes

```tsx
// Используй cn() из @/lib/utils
import { cn } from '@/lib/utils'

<div className={cn(
  'base-classes',
  isActive && 'active-classes',
  variant === 'primary' && 'primary-classes'
)} />
```

### Responsive

```tsx
// Mobile-first
<div className="p-2 md:p-4 lg:p-6" />
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" />
```

---

## 9. Zod валидация

```tsx
// Используй z.enum для const objects
const normTypeSchema = z.enum(['LINEAR', 'INVERSE', 'THRESHOLD'])

// Не используй z.nativeEnum с const objects
// z.nativeEnum работает только с TypeScript enum
```

---

## 10. Zustand store

```tsx
// Разделяй state и actions
interface StoreState {
  items: Item[]
  selectedId: string | null
}

interface StoreActions {
  addItem: (item: Item) => void
  selectItem: (id: string) => void
}

// Типизация store
const useStore = create<StoreState & StoreActions>()(
  devtools(
    persist(
      (set, get) => ({
        // state
        items: [],
        selectedId: null,

        // actions
        addItem: (item) => set(state => ({
          items: [...state.items, item]
        })),

        selectItem: (id) => set({ selectedId: id }),
      }),
      { name: 'store-key' }
    )
  )
)
```

---

## Команды проверки

```bash
# Линтер
npm run lint

# TypeScript check
npm run build  # tsc -b запускается перед vite build

# Исправить автофиксируемые ошибки
npm run lint -- --fix
```

---

## Частые ошибки и решения

| Ошибка | Причина | Решение |
|--------|---------|---------|
| `set-state-in-effect` | setState в useEffect | Используй key для сброса |
| `only-export-components` | Экспорт не-компонента | Убери экспорт или вынеси в отдельный файл |
| `no-empty-object-type` | Пустой interface | Замени на type alias |
| `no-unused-vars` | Неиспользуемая переменная | Добавь `_` prefix |
| `This syntax is not allowed` | enum + erasableSyntaxOnly | Используй const object |
