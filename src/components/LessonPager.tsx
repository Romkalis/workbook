import Link from 'next/link';
import type { LessonMeta } from '@/lib/types';
import styles from './LessonPager.module.css';

/** Ссылки на предыдущий и следующий урок внизу страницы */
export function LessonPager({ prev, next }: { prev?: LessonMeta; next?: LessonMeta }) {
  if (!prev && !next) return null;
  return (
    <nav className={styles.pager} aria-label="Соседние уроки">
      {prev ? (
        <Link href={`/lessons/${prev.slug}`} className={styles.link}>
          <span className={styles.label}>← Предыдущий</span>
          <span>{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link href={`/lessons/${next.slug}`} className={`${styles.link} ${styles.next}`}>
          <span className={styles.label}>Следующий →</span>
          <span>{next.title}</span>
        </Link>
      )}
    </nav>
  );
}
