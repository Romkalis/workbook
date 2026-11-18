import type { CartItem, RemoteData, Totals } from '../types.js';
import { formatPrice } from './card.js';

export function renderCart(root: HTMLElement, items: CartItem[], totals: RemoteData<Totals>): void {
  const heading = document.createElement('h2');
  heading.textContent = 'Корзина';
  if (items.length === 0) {
    root.replaceChildren(heading, Object.assign(document.createElement('p'), { textContent: 'Корзина пуста' }));
    return;
  }
  const list = document.createElement('ul');
  list.append(
    ...items.map((i) => {
      const li = document.createElement('li');
      li.dataset.id = i.productId;
      li.textContent = `${i.productId} × ${i.quantity} `;
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.dataset.action = 'remove';
      remove.textContent = '✕';
      remove.setAttribute('aria-label', `Удалить ${i.productId}`);
      li.append(remove);
      return li;
    }),
  );
  const total = document.createElement('p');
  total.textContent =
    totals.status === 'success'
      ? `Итого: ${formatPrice(totals.data.total)}`
      : totals.status === 'error'
        ? `Не удалось посчитать: ${totals.message}`
        : 'Считаем…';
  root.replaceChildren(heading, list, total);
}
