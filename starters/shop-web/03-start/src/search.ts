import type { Api } from './api.js';
import type { Product, ProductFilters, RemoteData } from './types.js';

export function createSearch(api: Api, onState: (state: RemoteData<Product[]>) => void, delay = 300) {
  // Шаг 3: задержка, отмена предыдущего запроса, состояния
  void api;
  void onState;
  void delay;
  return {
    search(filters: ProductFilters): void {
      void filters;
    },
  };
}
