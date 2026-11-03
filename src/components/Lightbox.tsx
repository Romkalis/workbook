'use client';

import { useEffect, useRef } from 'react';
import styles from './Lightbox.module.css';

export interface LightboxImage {
  src: string;
  alt: string;
  /** Ширина, с которой показывать картинку (px). Если шире экрана, появляется прокрутка. */
  width: number;
}

/** Крупный просмотр скриншота в нативном <dialog>: Esc и клик по фону закрывают. */
export function Lightbox({ image, onClose }: { image: LightboxImage | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (image && !dialog.open) dialog.showModal();
    if (!image && dialog.open) dialog.close();
  }, [image]);

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-label="Скриншот"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.bar}>
        <span className={styles.caption}>{image?.alt}</span>
        <button type="button" className="btn" onClick={onClose}>
          Закрыть
        </button>
      </div>
      <div className={styles.scroll}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {image && <img src={image.src} alt={image.alt} style={{ width: image.width }} className={styles.image} />}
      </div>
    </dialog>
  );
}
