# ui/ - Базовые UI компоненты

Компоненты основаны на shadcn/ui и Radix UI. Стилизация через Tailwind CSS.

## Файлы

| Файл | Описание |
|------|----------|
| `button.tsx` | Кнопки с вариантами: default, destructive, outline, secondary, ghost, link. Размеры: default, sm, lg, icon |
| `input.tsx` | Текстовое поле ввода с поддержкой всех HTML атрибутов |
| `textarea.tsx` | Многострочное текстовое поле |
| `label.tsx` | Лейбл для форм |
| `card.tsx` | Карточка с заголовком, контентом, футером |
| `badge.tsx` | Бейдж/тег с вариантами: default, secondary, destructive, outline, success, warning |
| `dialog.tsx` | Модальное окно с оверлеем, заголовком, контентом |
| `alert-dialog.tsx` | Диалог подтверждения для опасных действий |
| `select.tsx` | Выпадающий список на основе Radix Select |
| `tabs.tsx` | Вкладки на основе Radix Tabs |

## Использование

```tsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

<Button variant="outline" size="sm">Нажми</Button>
<Input placeholder="Введите текст..." />
```
