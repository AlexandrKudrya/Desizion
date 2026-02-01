# types/ - TypeScript типы

## Файлы

| Файл | Описание |
|------|----------|
| `index.ts` | Все типы и интерфейсы приложения |

## Основные типы

### NormalizationType

```typescript
const NormalizationType = {
  LINEAR: 'LINEAR',
  INVERSE_LINEAR: 'INVERSE_LINEAR',
  THRESHOLD: 'THRESHOLD',
  EXPONENTIAL: 'EXPONENTIAL',
  CATEGORICAL: 'CATEGORICAL'
} as const
```

### Параметры нормализации

| Тип | Интерфейс |
|-----|-----------|
| LINEAR | `{ min: number, max: number }` |
| INVERSE_LINEAR | `{ min: number, max: number, threshold: number }` |
| THRESHOLD | `{ min: number, max: number, threshold1: number }` |
| EXPONENTIAL | `{ min: number, max: number, threshold1: number, threshold2: number }` |
| CATEGORICAL | `{ categories: CategoryMapping[] }` |

### CategoryMapping

```typescript
{ label: string, value: number }  // "Хорошо" -> 1.0
```

### Criterion (Критерий)

```typescript
{
  id: string
  name: string
  weight: number          // 0-1, сумма всех = 1.0
  normType: NormalizationType
  params: NormalizationParams
  description?: string
}
```

### Alternative (Альтернатива)

```typescript
{
  id: string
  name: string
  description?: string
  values: Record<string, number | string | null>  // criterionId -> значение
  normalizedScores?: Record<string, number>       // авто-расчёт
  totalScore?: number                             // авто-расчёт
}
```

### Project (Проект)

```typescript
{
  id: string
  name: string
  description?: string
  createdAt: string      // ISO date
  updatedAt: string      // ISO date
  criteria: Criterion[]
  alternatives: Alternative[]
}
```

## Использование

```typescript
import type { Project, Criterion, Alternative, NormalizationType } from '@/types'
import { NormalizationType } from '@/types'

const criterion: Criterion = {
  id: 'crit-1',
  name: 'Цена',
  weight: 0.3,
  normType: NormalizationType.THRESHOLD,
  params: { min: 40000, max: 50000, threshold1: 45000 }
}
```
