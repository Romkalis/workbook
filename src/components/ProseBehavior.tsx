'use client';

import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import { Lightbox, type LightboxImage } from './Lightbox';

/** Показывает слайд с номером index в презентации .deck и обновляет счётчик и кнопки. */
function showSlide(deck: HTMLElement, index: number) {
  const slides = deck.querySelectorAll<HTMLElement>('.slide');
  const at = Math.max(0, Math.min(slides.length - 1, index));
  slides.forEach((s, i) => s.toggleAttribute('data-on', i === at));
  deck.dataset.at = String(at);
  const count = deck.querySelector('.deck-count');
  if (count) count.textContent = `${at + 1} / ${slides.length}`;
  deck.querySelectorAll<HTMLButtonElement>('[data-deck-step]').forEach((b) => {
    const step = Number(b.dataset.deckStep);
    b.disabled = step < 0 ? at === 0 : at === slides.length - 1;
  });
}

/** Оживляет HTML-контент лекций: увеличение скриншотов, кнопка «Раскрыть все ответы» и презентации .deck.
    Контент приходит готовой разметкой, поэтому события ловим одним обработчиком на обёртке. */
export function ProseBehavior({ children }: { children: ReactNode }) {
  const [image, setImage] = useState<LightboxImage | null>(null);
  const root = useRef<HTMLDivElement>(null);

  // Без JS слайды идут списком; после гидрации оставляем на экране по одному.
  // Без массива зависимостей: при переходе между уроками компонент не перемонтируется, а разметка новая.
  useEffect(() => {
    root.current?.querySelectorAll<HTMLElement>('.deck:not([data-at])').forEach((deck) => showSlide(deck, 0));
  });

  function onClick(e: MouseEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement;

    const zoom = target.closest<HTMLElement>('.zoom');
    if (zoom) {
      const img = zoom.querySelector('img');
      if (img) {
        setImage({ src: img.currentSrc || img.src, alt: img.alt, width: Number(zoom.dataset.w) || img.naturalWidth });
      }
      return;
    }

    const step = target.closest<HTMLElement>('[data-deck-step]');
    const deck = step?.closest<HTMLElement>('.deck');
    if (step && deck) {
      showSlide(deck, Number(deck.dataset.at) + Number(step.dataset.deckStep));
      return;
    }

    const toggle = target.closest<HTMLElement>('[data-toggle-answers]');
    if (toggle) {
      const open = toggle.dataset.open !== 'true';
      toggle.closest('section')?.querySelectorAll<HTMLDetailsElement>('details.q').forEach((d) => {
        d.open = open;
      });
      toggle.dataset.open = String(open);
      toggle.textContent = open ? 'Скрыть все ответы' : 'Раскрыть все ответы';
    }
  }

  // Стрелки листают слайды, только когда фокус внутри презентации: прокрутку страницы не трогаем.
  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const deck = (e.target as HTMLElement).closest<HTMLElement>('.deck');
    if (!deck?.dataset.at) return;
    e.preventDefault();
    showSlide(deck, Number(deck.dataset.at) + (e.key === 'ArrowRight' ? 1 : -1));
  }

  return (
    <div ref={root} onClick={onClick} onKeyDown={onKeyDown}>
      {children}
      <Lightbox image={image} onClose={() => setImage(null)} />
    </div>
  );
}
