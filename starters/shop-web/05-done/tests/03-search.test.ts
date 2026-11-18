import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createApi } from '../src/api.js';
import { createSearch } from '../src/search.js';
import type { Product, RemoteData } from '../src/types.js';

const book = { id: 'b1', title: 'Чистый код', category: 'books', price: 150000 };

/** fetch, который отвечает только по команде и честно реагирует на abort */
function controllableFetch() {
  const pending: { url: string; resolve: (r: Response) => void; signal?: AbortSignal | null }[] = [];
  const fn = vi.fn((input: RequestInfo | URL, init?: RequestInit) =>
    new Promise<Response>((resolve, reject) => {
      init?.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
      pending.push({ url: String(input), resolve, signal: init?.signal });
    }),
  );
  return { fn: fn as unknown as typeof fetch, pending };
}
const ok = (body: unknown) => new Response(JSON.stringify(body), { status: 200 });

describe('шаг 3: createSearch', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('ждёт паузу и отправляет один запрос с последними фильтрами', async () => {
    const { fn, pending } = controllableFetch();
    const states: RemoteData<Product[]>[] = [];
    const { search } = createSearch(createApi('http://api.test', fn), (s) => states.push(s), 300);
    search({ search: 'к' });
    search({ search: 'код' });
    await vi.advanceTimersByTimeAsync(299);
    expect(pending).toHaveLength(0);
    await vi.advanceTimersByTimeAsync(1);
    expect(pending).toHaveLength(1);
    expect(new URL(pending[0]!.url).searchParams.get('search')).toBe('код');
    pending[0]!.resolve(ok([book]));
    await vi.runAllTimersAsync();
    expect(states.map((s) => s.status)).toEqual(['loading', 'success']);
  });

  it('новый поиск отменяет старый запрос, и старый ответ не показывается', async () => {
    const { fn, pending } = controllableFetch();
    const states: RemoteData<Product[]>[] = [];
    const { search } = createSearch(createApi('http://api.test', fn), (s) => states.push(s), 0);
    search({ search: 'а' });
    await vi.advanceTimersByTimeAsync(0);
    search({ search: 'код' });
    await vi.advanceTimersByTimeAsync(0);
    expect(pending[0]!.signal?.aborted).toBe(true);
    pending[1]!.resolve(ok([book]));
    await vi.runAllTimersAsync();
    expect(states.filter((s) => s.status === 'error')).toHaveLength(0);
    expect(states.at(-1)).toEqual({ status: 'success', data: [book] });
  });

  it('ошибка сервера — состояние error с текстом', async () => {
    const fn = (async () => new Response(JSON.stringify({ error: 'База недоступна' }), { status: 503 })) as typeof fetch;
    const states: RemoteData<Product[]>[] = [];
    createSearch(createApi('http://api.test', fn), (s) => states.push(s), 0).search({});
    await vi.runAllTimersAsync();
    expect(states.at(-1)).toEqual({ status: 'error', message: 'База недоступна' });
  });
});
