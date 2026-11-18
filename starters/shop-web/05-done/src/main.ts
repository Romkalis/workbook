import { createApi } from './api.js';
import { createCart } from './cart.js';
import { createSearch } from './search.js';
import type { RemoteData, Totals } from './types.js';
import { renderCart } from './view/cart.js';
import { renderCatalog } from './view/catalog.js';

function required<T extends Element>(selector: string, type: new () => T): T {
  const el = document.querySelector(selector);
  if (!(el instanceof type)) throw new Error(`Не найден ${selector}`);
  return el;
}

const catalogEl = required('#catalog', HTMLElement);
const cartEl = required('#cart', HTMLElement);
const form = required('#search', HTMLFormElement);
const badge = required('#badge', HTMLElement);

const api = createApi(import.meta.env.VITE_API_URL ?? 'http://localhost:3000');
const cart = createCart(localStorage);

const readFilters = () => {
  const data = new FormData(form);
  return { search: String(data.get('search') ?? '').trim(), category: String(data.get('category') ?? '') };
};

const { search } = createSearch(api, (state) => renderCatalog(catalogEl, state, () => search(readFilters())));
form.addEventListener('input', () => search(readFilters()));
form.addEventListener('submit', (e) => e.preventDefault());

catalogEl.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) return;
  const id = event.target.closest('[data-action="add"]')?.closest<HTMLElement>('[data-id]')?.dataset.id;
  if (id) cart.add(id);
});
cartEl.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) return;
  const id = event.target.closest('[data-action="remove"]')?.closest<HTMLElement>('[data-id]')?.dataset.id;
  if (id) cart.remove(id);
});

let quoteController = 0;
async function refreshCart() {
  const items = cart.getItems();
  const count = items.reduce((n, i) => n + i.quantity, 0);
  badge.textContent = String(count);
  badge.hidden = count === 0;
  if (items.length === 0) return renderCart(cartEl, items, { status: 'idle' });
  const request = ++quoteController;
  renderCart(cartEl, items, { status: 'loading' });
  let totals: RemoteData<Totals>;
  try {
    totals = { status: 'success', data: await api.quote(items) };
  } catch (error) {
    totals = { status: 'error', message: error instanceof Error ? error.message : 'ошибка' };
  }
  if (request === quoteController) renderCart(cartEl, items, totals); // показываем только последний расчёт
}

cart.subscribe(() => void refreshCart());
void refreshCart();
search(readFilters());
