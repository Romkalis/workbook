# shop-web — шаг 2 из 4: Отрисовка по состояниям

Фронтенд к API из урока «Express на TypeScript». Учебный проект урока «Данные с сервера в интерфейсе». Эта папка — состояние **до** шага 2.

## Задание

Реализуйте `renderCatalog(root, state, onRetry)` в `src/view/catalog.ts` для всех вариантов `RemoteData`: заглушки при загрузке, сообщение и кнопка «Повторить» при ошибке, «Ничего не найдено» для пустого списка, карточки при успехе.

## Как работать

```bash
npm install
npm test          # тесты этого шага красные — это нормально
npm run typecheck
npm run dev       # нужен запущенный shop-api: npx degit Romkalis/workbook/starters/shop-api/06-done shop-api
```

Шаг готов, когда `npm test` и `npm run typecheck` проходят. Тесты в `tests/` не меняйте.
Решение шага — в папке `03-start`.
