import { describe, expect, it, vi } from 'vitest';
import { createApi, HttpError } from '../src/api.js';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
const lamp = { id: 'h1', title: 'Лампа', category: 'home', price: 27900 };

describe('шаг 1: getProducts', () => {
  it('запрашивает правильный адрес с фильтрами', async () => {
    const fetchFn = vi.fn(async () => json([lamp]));
    const api = createApi('http://api.test', fetchFn as typeof fetch);
    expect(await api.getProducts({ search: 'лампа', category: 'home' })).toEqual([lamp]);
    const url = new URL(String((fetchFn.mock.calls[0] as unknown[])[0]));
    expect(url.pathname).toBe('/api/products');
    expect(Object.fromEntries(url.searchParams)).toEqual({ search: 'лампа', category: 'home' });
  });
  it('пустые фильтры не попадают в адрес', async () => {
    const fetchFn = vi.fn(async () => json([]));
    await createApi('http://api.test', fetchFn as typeof fetch).getProducts({ search: '' });
    expect(String((fetchFn.mock.calls[0] as unknown[])[0])).toBe('http://api.test/api/products');
  });
  it('статус не 2xx — HttpError с кодом', async () => {
    const api = createApi('http://api.test', (async () => json({ error: 'boom' }, 500)) as typeof fetch);
    await expect(api.getProducts()).rejects.toMatchObject({ name: 'HttpError', status: 500 });
    await expect(api.getProducts()).rejects.toBeInstanceOf(HttpError);
  });
  it('ответ неожиданной формы — TypeError', async () => {
    const api = createApi('http://api.test', (async () => json([{ id: 1 }])) as typeof fetch);
    await expect(api.getProducts()).rejects.toBeInstanceOf(TypeError);
  });
  it('передаёт signal в fetch', async () => {
    const fetchFn = vi.fn(async () => json([]));
    const controller = new AbortController();
    await createApi('http://api.test', fetchFn as typeof fetch).getProducts({}, controller.signal);
    expect((fetchFn.mock.calls[0] as unknown[])[1]).toMatchObject({ signal: controller.signal });
  });
});
