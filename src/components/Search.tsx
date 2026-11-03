'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useUi } from '@/store/ui';
import { search } from '@/lib/search';
import type { SearchEntry } from '@/lib/types';
import styles from './Search.module.css';

/** Поиск по всему курсу. Открывается кнопкой в шапке или Ctrl/Cmd+K.
    Индекс (/search-index.json) загружается один раз, при первом открытии. */
export function Search() {
  const open = useUi((s) => s.searchOpen);
  const setOpen = useUi((s) => s.setSearchOpen);
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [index, setIndex] = useState<SearchEntry[] | null>(null);
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      inputRef.current?.select();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [setOpen]);

  useEffect(() => {
    if (!open || index) return;
    fetch('/search-index.json')
      .then((r) => r.json() as Promise<SearchEntry[]>)
      .then(setIndex)
      .catch(() => setIndex([]));
  }, [open, index]);

  const hits = useMemo(() => (index ? search(index, query) : []), [index, query]);

  function go(url: string) {
    setOpen(false);
    router.push(url);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, hits.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === 'Enter' && hits[cursor]) {
      e.preventDefault();
      go(hits[cursor].entry.url);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label="Поиск по курсу"
      onClose={() => setOpen(false)}
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div className={styles.panel}>
        <input
          ref={inputRef}
          type="search"
          className={styles.input}
          placeholder="Что ищем? Например: брейкпоинт, наследование, reflow"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setCursor(0);
          }}
          onKeyDown={onKeyDown}
          aria-label="Запрос"
          autoComplete="off"
        />
        <div className={styles.results} aria-live="polite">
          {!index && <p className={styles.hint}>Загружаю индекс…</p>}
          {index && query.trim() === '' && <p className={styles.hint}>Ищет по заголовкам, подтемам и тексту всех уроков.</p>}
          {index && query.trim() !== '' && hits.length === 0 && <p className={styles.hint}>Ничего не нашлось. Попробуйте другое слово.</p>}
          <ul className={styles.list}>
            {hits.map((hit, i) => (
              <li key={hit.entry.url + i}>
                <Link
                  href={hit.entry.url}
                  className={styles.hit}
                  aria-current={i === cursor ? 'true' : undefined}
                  onClick={() => setOpen(false)}
                  onMouseEnter={() => setCursor(i)}
                >
                  <span className={styles.where}>
                    {hit.entry.lessonTitle} · {hit.entry.sectionTitle}
                  </span>
                  <span className={styles.title}>{hit.entry.title}</span>
                  <span className={styles.snippet}>
                    {hit.snippet.before}
                    {hit.snippet.match && <mark>{hit.snippet.match}</mark>}
                    {hit.snippet.after}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </dialog>
  );
}
