import { LessonCard } from '@/components/LessonCard';
import { getStages } from '@/lib/content';
import styles from './page.module.css';

export default function HomePage() {
  const stages = getStages();

  return (
    <>
      <header className={styles.hero}>
        <p className={styles.kicker}>RS School</p>
        <h1 className={styles.title}>Учебник</h1>
        <p className={styles.lead}>
          Конспекты модулей на русском: схемы, примеры, вопросы для самопроверки и тест в конце каждого урока. Поиск по всему курсу
          открывается клавишами Ctrl+K (Cmd+K на Mac).
        </p>
      </header>

      {stages.map(({ stage, lessons }) => (
        <section key={stage} className={styles.stage} aria-labelledby={`stage-${stage}`}>
          <h2 id={`stage-${stage}`} className={styles.stageTitle}>
            Stage {stage}
          </h2>
          <div className={styles.grid}>
            {lessons.map((lesson) => (
              <LessonCard key={lesson.slug} lesson={lesson} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
