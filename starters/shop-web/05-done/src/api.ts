import type { CartItem, Product, ProductFilters, Totals } from './types.js';

export class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

const CATEGORIES = ['books', 'games', 'home'];

export function isProduct(x: unknown): x is Product {
  return (
    typeof x === 'object' &&
    x !== null &&
    'id' in x &&
    typeof x.id === 'string' &&
    'title' in x &&
    typeof x.title === 'string' &&
    'category' in x &&
    typeof x.category === 'string' &&
    CATEGORIES.includes(x.category) &&
    'price' in x &&
    Number.isInteger(x.price)
  );
}

function isTotals(x: unknown): x is Totals {
  return (
    typeof x === 'object' &&
    x !== null &&
    'subtotal' in x && Number.isInteger(x.subtotal) &&
    'discount' in x && Number.isInteger(x.discount) &&
    'total' in x && Number.isInteger(x.total)
  );
}

async function readError(res: Response): Promise<string> {
  try {
    const body: unknown = await res.json();
    if (typeof body === 'object' && body !== null && 'error' in body && typeof body.error === 'string') return body.error;
  } catch {
    // тело не JSON — используем статус
  }
  return `Сервер ответил ${res.status}`;
}

export function createApi(baseUrl: string, fetchFn: typeof fetch = fetch) {
  return {
    async getProducts(filters: ProductFilters = {}, signal?: AbortSignal): Promise<Product[]> {
      const url = new URL('/api/products', baseUrl);
      for (const [key, value] of Object.entries(filters)) {
        if (value) url.searchParams.set(key, value);
      }
      const res = await fetchFn(url, { signal });
      if (!res.ok) throw new HttpError(res.status, await readError(res));
      const data: unknown = await res.json();
      if (!Array.isArray(data) || !data.every(isProduct)) throw new TypeError('Неожиданный ответ сервера');
      return data;
    },

    async quote(items: CartItem[], promo?: string): Promise<Totals> {
      const res = await fetchFn(new URL('/api/cart/quote', baseUrl), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, promo }),
      });
      if (!res.ok) throw new HttpError(res.status, await readError(res));
      const data: unknown = await res.json();
      if (!isTotals(data)) throw new TypeError('Неожиданный ответ сервера');
      return data;
    },
  };
}

export type Api = ReturnType<typeof createApi>;
