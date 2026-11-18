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

export function createApi(baseUrl: string, fetchFn: typeof fetch = fetch) {
  return {
    async getProducts(filters: ProductFilters = {}, signal?: AbortSignal): Promise<Product[]> {
      // Шаг 1: запрос, проверка статуса и формы ответа
      void baseUrl;
      void fetchFn;
      void filters;
      void signal;
      throw new Error('Не реализовано');
    },
  };
}

export type Api = ReturnType<typeof createApi>;
