# Учебник

Конспекты модулей RS School в одном приложении: оглавление курса, поиск, светлая и тёмная тема, тест после каждого урока.

Уроки: Основы ООП, Chrome DevTools, Как работают браузеры.

## Быстрый старт

```sh
sh scripts/setup.sh   # git init, npm install, первый коммит
npm run dev           # http://localhost:3000
```

Нужен Node.js 20 или новее.

## Что внутри

- Next.js (App Router) и TypeScript, стили на CSS Modules и токенах, без UI-библиотек.
- Контент уроков лежит в `content/` обычным HTML и JSON. Оглавление, подтемы и поиск строятся из него автоматически.
- Состояние интерфейса (меню, поиск) в zustand.
- Правила для разработчиков и агентов: [AGENTS.md](AGENTS.md). Дизайн-система: [docs/design-system.md](docs/design-system.md), живой пример на `/design-system`. Как писать уроки: [docs/content-guide.md](docs/content-guide.md).
