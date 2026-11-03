# Дизайн-система

Единый внешний вид задают три слоя. Менять оформление нужно в них, а не в отдельных компонентах.

| Слой | Файл | За что отвечает |
|---|---|---|
| Токены | `src/styles/tokens.css` | цвета (обе темы), шрифты, отступы, радиусы, размеры раскладки |
| База | `src/styles/base.css` | сброс, типографика страницы, фокус, `.btn`, `.visually-hidden` |
| Контент | `src/styles/prose.css` | оформление HTML-лекций, всё внутри `.prose` |

Компоненты интерфейса (шапка, оглавление, поиск, тест) стилизуются своими `*.module.css` и берут значения только из токенов. Живой пример всего перечисленного: страница `/design-system`.

## Токены

Цвета: `--bg`, `--surface`, `--fg`, `--muted`, `--line`, `--accent`, `--accent-soft`, `--code-bg`, `--warn`, `--warn-soft`, `--overlay`. Акцент один (морская волна), тёплый `--warn` используется только для предупреждений и ошибок. Новый цвет вводить не нужно: почти всегда достаточно существующих.

Шрифты: `--font-body` (Onest), `--font-display` (Unbounded, только h1 и бренд), `--font-mono` (JetBrains Mono). Подключаются через `next/font` в `layout.tsx`.

Отступы: шкала `--sp-1` (4px) … `--sp-7` (48px). Скругления: `--r-sm`, `--r-md`, `--r-lg`, `--r-pill`.

Раскладка: `--header-h`, `--sidebar-w`, `--content-w`, слои `--z-header`, `--z-drawer`.

## Темы

Тёмная тема включается `data-theme="dark"` на `<html>`. Атрибут ставит inline-скрипт в `layout.tsx` до первой отрисовки (сохранённый выбор или системная настройка), переключатель меняет его и пишет в localStorage. Тёмные значения токенов продублированы в `@media (prefers-color-scheme: dark)` для случая без JS. Меняя палитру, правьте оба места.

## Компоненты контента (классы внутри `.prose`)

| Что | Разметка |
|---|---|
| Заметка / предупреждение | `<div class="note"><b>Заголовок</b><p>…</p></div>`, `.warn` |
| Таблица | `<div class="tbl"><table>…</table></div>` (прокручивается внутри блока) |
| Код | `<pre><code>…</code></pre>` |
| Вопросы | `<p class="qgroup">…</p>` и `<details class="q"><summary>…</summary><div class="a">…</div></details>`; кнопка `<button class="btn" data-toggle-answers>` раскрывает все |
| Глоссарий | `<dl class="gloss"><dt>…</dt><dd>…</dd></dl>` |
| Схема-анимация | `<figure class="dg">` с `.dg-title`, телом и `figcaption`; варианты: `.seqlist` + `.lit` (подсветка по очереди, `.n3 .n5 .n6` для другой длины цикла), `.inst`, `.enc`, `.poly`, `.uml`, `.bm`, `.dbg`, `.wf` |
| Диаграммы браузера | `.tl`, `.flow`, `.seq`, `.pipe`, `.cost` (см. урок «Как работают браузеры») |
| Скриншот | `<figure class="shot"><button class="zoom" data-w="1500"><img …></button><figcaption>…</figcaption></figure>`; клик открывает `Lightbox` |
| Презентация | `<figure class="deck" tabindex="0">` → `.deck-stage` со слайдами `.slide` (заголовок `h4`, подпись `.kick`, колонки `.slide-cols`) + `.deck-nav` с кнопками `data-deck-step="-1"/"1"` и `.deck-count`. Листание добавляет `ProseBehavior`, без JS слайды идут списком. Образец: урок «TanStack Query: основы» |
| Обмен клиент — сервер | `.wire-ends` + `ol.wire > li` (`.back` — ответ, `.idle` — пустой ответ, `.open` — открытое соединение), внутри `figure.dg` |
| Источники | `<section class="sources">` |

Схемы должны отключаться при `prefers-reduced-motion`, ставиться на паузу по наведению и всегда иметь текстовое пояснение рядом.

## Компоненты интерфейса

`Header`, `ThemeToggle`, `Sidebar` (общее оглавление: этапы → уроки → разделы → подтемы, подсветка по прокрутке), `Search` (диалог, Ctrl/Cmd+K), `LessonHeader`, `LessonCard`, `LessonPager`, `Quiz`, `Lightbox`, `Prose`, `ProseBehavior`. Каждый лежит в `src/components/` со своим CSS Module.
