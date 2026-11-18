# shop-web — шаг 4 из 4: Корзина и расчёт на сервере

Фронтенд к API из урока «Express на TypeScript». Учебный проект урока «Данные с сервера в интерфейсе». Эта папка — состояние **до** шага 4.

## Задание

Реализуйте `createCart(storage)` в `src/cart.ts` (добавление, удаление, сохранение в хранилище с проверкой при чтении) и `api.quote(items)` в `src/api.ts`: `POST /api/cart/quote` с телом `{ items, promo }`. Итог корзины берётся с сервера.

## Как работать

```bash
npm install
npm test          # тесты этого шага красные — это нормально
npm run typecheck
npm run dev       # нужен запущенный shop-api: npx degit Romkalis/workbook/starters/shop-api/06-done shop-api
```

Шаг готов, когда `npm test` и `npm run typecheck` проходят. Тесты в `tests/` не меняйте.
Решение шага — в папке `05-done`.
