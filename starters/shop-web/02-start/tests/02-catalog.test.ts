import { describe, expect, it, vi } from 'vitest';
import { renderCatalog } from '../src/view/catalog.js';

const products = [
  { id: 'b1', title: 'Чистый код', category: 'books' as const, price: 150000 },
  { id: 'g1', title: '<b>Каркассон</b>', category: 'games' as const, price: 249000 },
];

describe('шаг 2: renderCatalog', () => {
  it('загрузка: заглушки и aria-busy', () => {
    const root = document.createElement('section');
    renderCatalog(root, { status: 'loading' }, () => {});
    expect(root.getAttribute('aria-busy')).toBe('true');
    expect(root.querySelectorAll('.card--skeleton').length).toBeGreaterThan(0);
  });
  it('успех: карточки, aria-busy снят, данные как текст', () => {
    const root = document.createElement('section');
    renderCatalog(root, { status: 'loading' }, () => {});
    renderCatalog(root, { status: 'success', data: products }, () => {});
    expect(root.hasAttribute('aria-busy')).toBe(false);
    expect(root.querySelectorAll('.card')).toHaveLength(2);
    expect(root.querySelector('b')).toBeNull();
  });
  it('пусто: сообщение', () => {
    const root = document.createElement('section');
    renderCatalog(root, { status: 'success', data: [] }, () => {});
    expect(root.textContent).toContain('Ничего не найдено');
  });
  it('ошибка: текст и рабочая кнопка «Повторить»', () => {
    const root = document.createElement('section');
    const retry = vi.fn();
    renderCatalog(root, { status: 'error', message: 'Нет сети' }, retry);
    expect(root.textContent).toContain('Нет сети');
    const button = [...root.querySelectorAll('button')].find((b) => b.textContent === 'Повторить');
    button?.click();
    expect(retry).toHaveBeenCalledTimes(1);
  });
});
