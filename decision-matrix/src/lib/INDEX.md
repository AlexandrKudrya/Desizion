# lib/ - Утилиты и бизнес-логика

## Файлы

| Файл | Описание |
|------|----------|
| `utils.ts` | Общие утилиты: `cn()` для классов, `generateId()` для UUID, `formatDate()`, `clamp()` |
| `normalization.ts` | Функции нормализации значений критериев в диапазон [0, 1] |
| `calculations.ts` | Расчёт нормализованных оценок и итогового рейтинга альтернатив |
| `storage.ts` | Работа с localStorage: сохранение/загрузка проектов, экспорт/импорт JSON |
| `validation.ts` | Zod схемы для валидации данных |

## normalization.ts

### Функции нормализации

| Функция | Формула | Когда использовать |
|---------|---------|-------------------|
| `normalizeLinear(value, min, max)` | (value - min) / (max - min) | Больше = лучше (площадь) |
| `normalizeInverseLinear(value, min, max, threshold)` | До threshold = 1, затем линейный спад | Меньше = лучше (время в пути) |
| `normalizeThreshold(value, min, max, threshold1)` | До threshold1 = 1, затем спад до 0 на max | С критической границей (цена) |
| `normalizeExponential(value, min, max, threshold1, k)` | exp(-k * (value - threshold1)) | Убывающая важность |
| `normalizeCategorical(value, categories)` | Поиск в справочнике | Фиксированные варианты |

### Главная функция

```typescript
normalize(value, criterion): number
```

Диспетчер, который выбирает нужную функцию нормализации по типу критерия.

## calculations.ts

| Функция | Описание |
|---------|----------|
| `calculateNormalizedScores(alternative, criteria)` | Нормализует все значения альтернативы |
| `calculateTotalScore(alternative, criteria)` | Σ(normalizedScore × weight) |
| `rankAlternatives(alternatives, criteria)` | Сортирует по убыванию totalScore |

## storage.ts

| Функция | Описание |
|---------|----------|
| `saveProjects(projects)` | Сохраняет в localStorage |
| `loadProjects()` | Загружает из localStorage |
| `exportProject(project)` | Возвращает prettified JSON строку |
| `importProject(jsonString)` | Парсит JSON в Project |

## validation.ts

Zod схемы для валидации:
- `CriterionSchema` - критерий
- `AlternativeSchema` - альтернатива
- `ProjectSchema` - проект
