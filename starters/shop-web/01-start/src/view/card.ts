import type { Product } from '../types.js';

export const formatPrice = (kopecks: number) => `${(kopecks / 100).toFixed(2)} ₽`;

export function createCard(product: Product): HTMLElement {
  const card = document.createElement('article');
  card.className = 'card';
  card.dataset.id = product.id;
  const title = document.createElement('h3');
  title.textContent = product.title;
  const price = document.createElement('p');
  price.className = 'card__price';
  price.textContent = formatPrice(product.price);
  const button = document.createElement('button');
  button.type = 'button';
  button.dataset.action = 'add';
  button.textContent = 'В корзину';
  card.append(title, price, button);
  return card;
}
