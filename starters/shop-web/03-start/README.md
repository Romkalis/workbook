# shop-web — шаг 3 из 4: Поиск без гонки ответов

Фронтенд к API из урока «Express на TypeScript». Учебный проект урока «Данные с сервера в интерфейсе». Эта папка — состояние **до** шага 3.

## Задание

Реализуйте `createSearch(api, onState, delay)` в `src/search.ts`: задержка перед запросом, отмена предыдущего запроса через `AbortController`, состояния `loading` → `success`/`error`. Отменённый запрос не показывается как ошибка.

## Как работать

```bash
npm install
npm test          # тесты этого шага красные — это нормально
npm run typecheck
npm run dev       # нужен запущенный shop-api: npx degit Romkalis/workbook/starters/shop-api/06-done shop-api
```

Шаг готов, когда `npm test` и `npm run typecheck` проходят. Тесты в `tests/` не меняйте.
Решение шага — в папке `04-start`.
