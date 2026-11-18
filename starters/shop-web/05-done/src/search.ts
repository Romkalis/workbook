import type { Api } from './api.js';
import type { Product, ProductFilters, RemoteData } from './types.js';

const isAbort = (e: unknown) => e instanceof DOMException && e.name === 'AbortError';

export function createSearch(api: Api, onState: (state: RemoteData<Product[]>) => void, delay = 300) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let controller: AbortController | undefined;

  async function run(filters: ProductFilters) {
    controller?.abort();
    controller = new AbortController();
    const { signal } = controller;
    onState({ status: 'loading' });
    try {
      const data = await api.getProducts(filters, signal);
      if (!signal.aborted) onState({ status: 'success', data });
    } catch (error) {
      if (isAbort(error) || signal.aborted) return;
      onState({ status: 'error', message: error instanceof Error ? error.message : 'Неизвестная ошибка' });
    }
  }

  return {
    search(filters: ProductFilters): void {
      clearTimeout(timer);
      controller?.abort(); // ответ на старые фильтры уже не нужен, даже если новый запрос ещё ждёт паузы
      timer = setTimeout(() => void run(filters), delay);
    },
  };
}
