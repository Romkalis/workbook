import Link from 'next/link';
import type { LessonMeta } from '@/lib/types';
import styles from './LessonCard.module.css';

export function LessonCard({ lesson }: { lesson: LessonMeta }) {
  return (
    <article className={styles.card}>
      <p className={styles.kicker}>{lesson.kicker}</p>
      <h3 className={styles.title}>
        <Link href={`/lessons/${lesson.slug}`} className={styles.link}>
          {lesson.title}
        </Link>
      </h3>
      <p className={styles.lead}>{lesson.lead}</p>
      <ul className={styles.chips}>
        {lesson.chips.slice(0, 3).map((chip) => (
          <li key={chip}>{chip}</li>
        ))}
      </ul>
    </article>
  );
}
