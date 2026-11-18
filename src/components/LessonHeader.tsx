import type { LessonMeta } from '@/lib/types';
import { TaskProgress } from './TaskProgress';
import styles from './LessonHeader.module.css';

export function LessonHeader({ lesson }: { lesson: LessonMeta & { tasks: string[] } }) {
  return (
    <header className={styles.header}>
      <p className={styles.kicker}>{lesson.kicker}</p>
      <h1 className={styles.title}>{lesson.heading}</h1>
      <p className={styles.lead}>{lesson.lead}</p>
      <ul className={styles.chips}>
        {lesson.chips.map((chip) => (
          <li key={chip}>{chip}</li>
        ))}
      </ul>
      <TaskProgress tasks={lesson.tasks} />
    </header>
  );
}
