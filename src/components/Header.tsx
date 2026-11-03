'use client';

import Link from 'next/link';
import { useUi } from '@/store/ui';
import { ThemeToggle } from './ThemeToggle';
import styles from './Header.module.css';

export function Header() {
  const navOpen = useUi((s) => s.navOpen);
  const setNavOpen = useUi((s) => s.setNavOpen);
  const setSearchOpen = useUi((s) => s.setSearchOpen);

  return (
    <header className={styles.header}>
      <button
        type="button"
        className={styles.menu}
        aria-expanded={navOpen}
        aria-controls="site-nav"
        onClick={() => setNavOpen(!navOpen)}
      >
        <span aria-hidden="true">☰</span>
        <span className="visually-hidden">Оглавление</span>
      </button>

      <Link href="/" className={styles.brand}>
        Учебник
      </Link>

      <button type="button" className={styles.search} onClick={() => setSearchOpen(true)}>
        <span>Поиск по курсу</span>
        <kbd className={styles.kbd}>Ctrl K</kbd>
      </button>

      <ThemeToggle />
    </header>
  );
}
