'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useUi } from '@/store/ui';
import type { NavStage } from '@/lib/types';
import styles from './Sidebar.module.css';

/** Следит за прокруткой и возвращает id последнего заголовка, который уже прошёл верхнюю границу экрана. */
function useActiveId(ids: string[]): string {
  const [active, setActive] = useState('');
  const key = ids.join('|');

  useEffect(() => {
    const elements = key
      .split('|')
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) {
      setActive('');
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.3;
      let current = elements[0].id;
      for (const el of elements) {
        if (el.getBoundingClientRect().top <= line) current = el.id;
        else break;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [key]);

  return active;
}

export function Sidebar({ nav }: { nav: NavStage[] }) {
  const pathname = usePathname() ?? '';
  const navOpen = useUi((s) => s.navOpen);
  const setNavOpen = useUi((s) => s.setNavOpen);

  const currentSlug = pathname.startsWith('/lessons/') ? pathname.split('/')[2] : '';
  const currentLesson = nav.flatMap((s) => s.lessons).find((l) => l.slug === currentSlug);

  const ids = useMemo(
    () => (currentLesson ? currentLesson.items.flatMap((i) => [i.id, ...i.subtopics.map((t) => t.id)]) : []),
    [currentLesson],
  );
  const activeId = useActiveId(ids);

  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNavOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [navOpen, setNavOpen]);

  const close = () => setNavOpen(false);

  return (
    <>
      <div className={styles.backdrop} data-open={navOpen} onClick={close} aria-hidden="true" />
      <aside id="site-nav" className={styles.sidebar} data-open={navOpen}>
        <nav aria-label="Оглавление курса">
          <Link href="/" className={styles.home} onClick={close} aria-current={pathname === '/' ? 'page' : undefined}>
            Все уроки
          </Link>
          {nav.map(({ stage, lessons }) => (
            <div key={stage} className={styles.stage}>
              <h2 className={styles.stageTitle}>Stage {stage}</h2>
              <ul className={styles.list}>
                {lessons.map((lesson) => {
                  const isCurrent = lesson.slug === currentSlug;
                  return (
                    <li key={lesson.slug}>
                      <Link
                        href={`/lessons/${lesson.slug}`}
                        className={styles.lesson}
                        aria-current={isCurrent ? 'page' : undefined}
                        onClick={close}
                      >
                        {lesson.title}
                      </Link>
                      {isCurrent && (
                        <ol className={styles.sections}>
                          {lesson.items.map((item) => {
                            const isActive =
                              activeId === item.id || item.subtopics.some((t) => t.id === activeId);
                            return (
                              <li key={item.id}>
                                <a
                                  href={`#${item.id}`}
                                  className={styles.section}
                                  aria-current={isActive ? 'location' : undefined}
                                  onClick={close}
                                >
                                  {item.title}
                                </a>
                                {isActive && item.subtopics.length > 0 && (
                                  <ul className={styles.subtopics}>
                                    {item.subtopics.map((t) => (
                                      <li key={t.id}>
                                        <a
                                          href={`#${t.id}`}
                                          className={styles.subtopic}
                                          aria-current={activeId === t.id ? 'location' : undefined}
                                          onClick={close}
                                        >
                                          {t.title}
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            );
                          })}
                        </ol>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          <Link
            href="/design-system"
            className={`${styles.home} ${styles.footerLink}`}
            onClick={close}
            aria-current={pathname === '/design-system' ? 'page' : undefined}
          >
            Дизайн-система
          </Link>
        </nav>
      </aside>
    </>
  );
}
