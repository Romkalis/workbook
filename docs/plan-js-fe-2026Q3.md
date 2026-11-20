# План: уроки по автотестам курса js-fe-2026Q3

Источник: страница автотестов RS App (`/course/student/auto-test?course=js-fe-2026Q3`), вкладка «Available», 17 заданий, снято 20.11.2026. Вкладку «Done» (36 заданий) не разбирали.

Правило: одно задание — один урок. Название урока — как в задачнике, через тире перевод на русский. У каждого урока есть теория по материалам модуля (README задания на GitHub и ссылки из него), задачи с решениями (формат `article.task`) и тест `quiz.json`.

## Сопоставление с учебником

| Задание | Открыто | Срок | Урок | Название в учебнике | Что сделать |
|---|---|---|---|---|---|
| [St2] Design Patterns | 27.10 | 24.11 | `design-patterns` | Design Patterns — паттерны проектирования | переименовать, добавить задачи |
| [St2] TS Advanced | 27.10 | 24.11 | `typescript-advanced` | TS Advanced — продвинутый TypeScript | переименовать (задачи есть) |
| [St2] TypeScript Basics | 27.10 | 24.11 | `typescript-basic` | TypeScript Basics — основы TypeScript | переименовать (задачи есть) |
| core-js-promises | 10.11 | 01.12 | `core-js-promises` | core-js-promises — промисы | переименовать, добавить задачи |
| [St2] RESTful API Style | 10.11 | 01.12 | `restful-api` | RESTful API Style — стиль RESTful API | переименовать (задачи есть) |
| [St2] Error handling | 10.11 | 01.12 | `error-handling` | Error handling — обработка ошибок | переименовать, добавить задачи |
| [St2] Functional Programming | 03.11 | 01.12 | `fp-basics` | Functional Programming — функциональное программирование | переименовать, добавить задачи |
| [St1] Client - Server interaction | 10.11 | 01.12 | `client-server` | Client-Server interaction — клиент-серверное взаимодействие | переименовать, добавить задачи |
| [St2] Async JS Test | 10.11 | 01.12 | `async-js` | Async JS — асинхронный JavaScript | **новый урок** |
| [St2] Event Loop & Animation | 10.11 | 01.12 | `eventloop-animation` | Event Loop & Animation — цикл событий и анимация | **новый урок** |
| core-js-functions | 10.11 | 01.12 | `core-js-functions` | core-js-functions — функции | **новый урок** (разбор задач репозитория) |
| core-js-dates | 10.11 | 01.12 | `core-js-dates` | core-js-dates — даты | **новый урок** (разбор задач репозитория) |
| [St2] Web Storage | 17.11 | 01.12 | `web-storage` | Web Storage — веб-хранилища | **новый урок** |
| [St2] Web Security | 17.11 | 01.12 | `web-security` | Web Security — веб-безопасность | **новый урок** |
| [St2] Single Page Application | 17.11 | 01.12 | `single-page-application` | Single Page Application — одностраничное приложение | **новый урок** |
| [St2] CI/CD | 17.11 | 01.12 | `ci-cd` | CI/CD — непрерывная интеграция и доставка | **новый урок** |
| [St2] Scrum. Kanban | 17.11 | 01.12 | `scrum-kanban` | Scrum. Kanban — Scrum и Kanban | **новый урок** |

Итого: 8 уроков уже есть, 9 новых.

## График

Порядок — по сроку сдачи, внутри одного срока — по дате открытия: что открыли раньше, то и проверяют раньше.

| Даты | Работа | К сроку |
|---|---|---|
| 20–21.11 | Переименовать 8 существующих уроков. Задачи для Design Patterns | 24.11 |
| 21–22.11 | Новые: Async JS, Event Loop & Animation | 01.12 |
| 23.11 | Новые: core-js-functions, core-js-dates. Задачи для core-js-promises | 01.12 |
| 24–25.11 | Новые: Web Storage, Web Security | 01.12 |
| 26–27.11 | Новые: Single Page Application, CI/CD | 01.12 |
| 28.11 | Новый: Scrum. Kanban | 01.12 |
| 29–30.11 | Задачи для Error handling, Functional Programming, Client-Server. Запас на правки | 01.12 |
| после 01.12 | Разбить крупные уроки (TypeScript Basics, тестирование) на короткие | — |

Каждый день — отдельная ветка, проверка (`typecheck`, `build`, тесты задач, ссылки) и слияние в `main`.

## Риски и допущения

- Тексты заданий брать из README модулей на GitHub (ссылки на странице автотестов). Сами вопросы автотестов закрыты, их не копируем. Учебник готовит к теме, а не к конкретным вопросам.
- Слаги новых уроков взяты из имён папок модулей в репозитории `rolling-scopes-school/tasks`.
- Если материал модуля (видео, закрытые статьи) не удастся открыть, урок пишется по доступным источникам, и это помечается в разделе «Источники».
- Скорость — 2 урока в день с задачами. Если урок окажется объёмнее, Scrum. Kanban и задачи для старых уроков сдвигаются на запасные дни.
