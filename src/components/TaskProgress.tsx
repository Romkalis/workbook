'use client';

import { useEffect } from 'react';
import { rehydrateProgress, useProgress } from '@/store/progress';
import styles from './TaskProgress.module.css';

/** «Решено 7 из 23» с полосой прогресса. Задачи урока передаются списком их data-task. */
export function TaskProgress({ tasks }: { tasks: string[] }) {
  const solved = useProgress((s) => tasks.filter((t) => s.done[t]).length);

  useEffect(rehydrateProgress, []);

  if (tasks.length === 0) return null;
  const complete = solved === tasks.length;

  return (
    <p className={styles.progress} data-complete={complete}>
      <span>
        {complete ? 'Все задачи решены: ' : 'Задачи: решено '}
        {solved} из {tasks.length}
      </span>
      <progress className={styles.bar} max={tasks.length} value={solved} aria-hidden="true" />
    </p>
  );
}
