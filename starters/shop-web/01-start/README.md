# shop-web — шаг 1 из 4: API-клиент

Фронтенд к API из урока «Express на TypeScript». Учебный проект урока «Данные с сервера в интерфейсе». Эта папка — состояние **до** шага 1.

## Задание

Реализуйте `getProducts` в `src/api.ts`: запрос `GET {baseUrl}/api/products` с параметрами фильтров, `HttpError` при статусе не 2xx, проверка ответа предикатом `isProduct` (не массив товаров — `TypeError`). `fetch` передаётся в `createApi` параметром.

## Как работать

```bash
npm install
npm test          # тесты этого шага красные — это нормально
npm run typecheck
npm run dev       # нужен запущенный shop-api: npx degit Romkalis/workbook/starters/shop-api/06-done shop-api
```

Шаг готов, когда `npm test` и `npm run typecheck` проходят. Тесты в `tests/` не меняйте.
Решение шага — в папке `02-start`.
