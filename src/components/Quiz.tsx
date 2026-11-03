'use client';

import { useState } from 'react';
import type { QuizItem } from '@/lib/types';
import styles from './Quiz.module.css';

const LETTERS = ['А', 'Б', 'В', 'Г', 'Д'];

function verdict(pct: number): string {
  if (pct >= 90) return 'Отлично, тема усвоена.';
  if (pct >= 70) return 'Хороший результат. Перечитайте разделы по вопросам, где ошиблись.';
  if (pct >= 50) return 'Базу вы поняли, но есть пробелы. Пройдите конспект ещё раз.';
  return 'Пока слабо. Вернитесь к началу конспекта, затем пройдите тест заново.';
}

/** Тест из quiz.json. Ответ выбирается один раз; сразу показывается верный вариант и пояснение.
    Текст вопросов и пояснений содержит простую разметку (<code>), поэтому выводится как HTML. */
export function Quiz({ items }: { items: QuizItem[] }) {
  // answers[i] — индекс выбранного варианта или null, если на вопрос ещё не ответили
  const [answers, setAnswers] = useState<(number | null)[]>(() => items.map(() => null));

  const answered = answers.filter((a) => a !== null).length;
  const correct = answers.filter((a, i) => a === items[i].a).length;
  const done = answered === items.length;
  const pct = Math.round((correct / items.length) * 100);

  function choose(question: number, option: number) {
    setAnswers((prev) => prev.map((a, i) => (i === question && a === null ? option : a)));
  }

  function reset() {
    setAnswers(items.map(() => null));
    document.getElementById('test')?.scrollIntoView();
  }

  return (
    <section id="test" className={styles.quiz}>
      <h2 className={styles.heading}>Тест по уроку</h2>
      <p className={styles.intro}>
        {items.length} вопросов с одним правильным ответом. После выбора сразу видно, верно ли, и почему. Ответ менять нельзя, так что
        думайте перед кликом.
      </p>

      <div className={styles.bar}>
        <span className={styles.score} aria-live="polite">
          Отвечено {answered} из {items.length} · верно {correct}
        </span>
        <button type="button" className="btn" onClick={reset}>
          Пройти заново
        </button>
      </div>

      <ol className={styles.questions}>
        {items.map((item, qi) => {
          const chosen = answers[qi];
          return (
            <li key={qi} className={styles.question}>
              <h3 className={styles.prompt}>
                <span className={styles.num}>
                  {qi + 1}/{items.length}
                </span>
                <span dangerouslySetInnerHTML={{ __html: item.q }} />
              </h3>
              <div className={styles.options} role="group" aria-label={`Варианты ответа на вопрос ${qi + 1}`}>
                {item.o.map((text, oi) => {
                  const state =
                    chosen === null ? '' : oi === item.a ? styles.ok : oi === chosen ? styles.bad : '';
                  return (
                    <button
                      key={oi}
                      type="button"
                      className={`${styles.option} ${state}`}
                      disabled={chosen !== null}
                      onClick={() => choose(qi, oi)}
                    >
                      {LETTERS[oi]}. <span dangerouslySetInnerHTML={{ __html: text }} />
                    </button>
                  );
                })}
              </div>
              {chosen !== null && (
                <p className={styles.why}>
                  <strong>{chosen === item.a ? 'Верно.' : `Неверно. Правильный ответ: ${LETTERS[item.a]}.`}</strong>{' '}
                  <span dangerouslySetInnerHTML={{ __html: item.why }} />
                </p>
              )}
            </li>
          );
        })}
      </ol>

      {done && (
        <div className={styles.result} aria-live="polite">
          <b>
            {correct} из {items.length} ({pct}%)
          </b>
          <p>{verdict(pct)}</p>
        </div>
      )}
    </section>
  );
}
