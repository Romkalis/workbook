import type { Metadata } from 'next';
import { Prose } from '@/components/Prose';
import styles from './page.module.css';

export const metadata: Metadata = { title: 'Дизайн-система' };

const COLORS = [
  ['--bg', 'Фон страницы'],
  ['--surface', 'Карточки, панели'],
  ['--fg', 'Основной текст'],
  ['--muted', 'Вторичный текст'],
  ['--line', 'Границы'],
  ['--accent', 'Акцент, ссылки'],
  ['--accent-soft', 'Фон акцента'],
  ['--code-bg', 'Код'],
  ['--warn', 'Предупреждение'],
  ['--warn-soft', 'Фон предупреждения'],
] as const;

const SPACING = ['--sp-1', '--sp-2', '--sp-3', '--sp-4', '--sp-5', '--sp-6', '--sp-7'] as const;

/** Образцы компонентов контента: ровно та разметка, которую используют лекции в content/ */
const SAMPLE = `
<h2>Заголовок раздела <span class="src">Источник раздела</span></h2>
<p>Обычный абзац с <code>inline-кодом</code> и <strong>выделением</strong>. Длина строки ограничена 70 символами для удобного чтения.</p>
<h3 id="ds-h3">Подтема (h3)</h3>
<div class="note"><b>Заметка</b><p>Нейтральная подсказка, акцентный фон.</p></div>
<div class="warn"><b>Осторожно</b><p>Предупреждение или типичная ошибка, тёплый фон.</p></div>
<pre><code>const sum = Number(a) + Number(b);</code></pre>
<div class="tbl"><table>
  <thead><tr><th>Колонка</th><th>Описание</th></tr></thead>
  <tbody><tr><td>Строка</td><td>Таблица прокручивается внутри своего блока, страница не ползёт вбок.</td></tr></tbody>
</table></div>
<p class="qgroup">Группа вопросов</p>
<details class="q"><summary>Вопрос для самопроверки</summary><div class="a"><p>Ответ скрыт, пока не раскроете.</p></div></details>
<figure class="dg">
  <p class="dg-title">Схема-анимация: подсвечивается по очереди</p>
  <ol class="seqlist" aria-hidden="true">
    <li class="card lit" style="--i:0"><span class="hd">Шаг 1</span><span class="ln">схема дополняет текст, а не заменяет его</span></li>
    <li class="card lit" style="--i:1"><span class="hd">Шаг 2</span><span class="ln">под схемой всегда есть подпись с тем же смыслом</span></li>
  </ol>
  <figcaption>Подпись к схеме: полное объяснение продублировано текстом.</figcaption>
</figure>
<dl class="gloss"><dt>Термин</dt><dd>Определение термина для глоссария.</dd></dl>
<article class="task" id="ds-task">
  <h4>Задача 1. Название задачи <span class="lvl">★☆☆ разминка</span></h4>
  <p>Условие: что написать и какой результат ожидается. В уроке у задачи есть data-task="урок/id", и кнопка ниже сохраняет отметку в браузере.</p>
  <p class="why"><b>Зачем:</b> какой навык тренирует задача и где он пригодится.</p>
  <p class="starter"><code>npx degit Romkalis/workbook/starters/shop/01-start my-shop</code> <a href="#ds-task">Скачать ZIP</a></p>
  <details class="q spoiler"><summary>Подсказка</summary><div class="a"><p>Направление, а не ответ.</p></div></details>
  <details class="q spoiler"><summary>Решение и разбор</summary><div class="a"><pre><code>const answer = 42;</code></pre><p>Почему решение именно такое.</p></div></details>
  <button type="button" class="task-done" data-task-done aria-pressed="false">Отметить решённой</button>
</article>
`;

export default function DesignSystemPage() {
  return (
    <>
      <h1 className={styles.title}>Дизайн-система</h1>
      <p className={styles.lead}>
        Все цвета, шрифты и отступы лежат в <code>src/styles/tokens.css</code>. Переключите тему в шапке, чтобы увидеть обе палитры.
        Подробности и правила: <code>docs/design-system.md</code>.
      </p>

      <h2 className={styles.h2}>Цвета</h2>
      <ul className={styles.swatches}>
        {COLORS.map(([token, label]) => (
          <li key={token} className={styles.swatch}>
            <span className={styles.chip} style={{ background: `var(${token})` }} />
            <code>{token}</code>
            <span className={styles.muted}>{label}</span>
          </li>
        ))}
      </ul>

      <h2 className={styles.h2}>Типографика</h2>
      <p className={styles.display}>Unbounded — заголовки h1 (--font-display)</p>
      <p>Onest — основной текст (--font-body). Съешь ещё этих мягких французских булок.</p>
      <p className={styles.mono}>JetBrains Mono — код (--font-mono): const answer = 42;</p>

      <h2 className={styles.h2}>Отступы</h2>
      <ul className={styles.spacing}>
        {SPACING.map((t) => (
          <li key={t}>
            <code>{t}</code>
            <span className={styles.bar} style={{ width: `var(${t})` }} />
          </li>
        ))}
      </ul>

      <h2 className={styles.h2}>Кнопки</h2>
      <p>
        <button type="button" className="btn">
          Обычная кнопка (.btn)
        </button>
      </p>

      <h2 className={styles.h2}>Компоненты контента</h2>
      <Prose html={SAMPLE} />
    </>
  );
}
