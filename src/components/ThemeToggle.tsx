'use client';

import styles from './ThemeToggle.module.css';

const STORAGE_KEY = 'theme';

/** Переключатель светлой и тёмной темы. Тема лежит в атрибуте data-theme на <html>:
    начальное значение выставляет скрипт в layout.tsx до отрисовки, поэтому мерцания нет. */
export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* хранилище недоступно, тема просто не запомнится */
    }
  }

  return (
    <button type="button" className={styles.button} onClick={toggle} aria-label="Переключить тему: светлая или тёмная">
      {/* Видна одна из двух иконок, выбор делает CSS по data-theme */}
      <svg className={styles.sun} viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <svg className={styles.moon} viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
