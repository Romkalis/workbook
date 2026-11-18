import { describe, expect, it, vi } from 'vitest';
import { createApi } from '../src/api.js';
import { createCart } from '../src/cart.js';

const memory = (init: Record<string, string> = {}) => {
  const m = new Map(Object.entries(init));
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) };
};

describe('шаг 4: createCart', () => {
  it('добавление увеличивает количество, удаление убирает строку', () => {
    const cart = createCart(memory());
    cart.add('b1');
    cart.add('b1');
    cart.add('g1');
    cart.remove('g1');
    expect(cart.getItems()).toEqual([{ productId: 'b1', quantity: 2 }]);
  });
  it('сохраняет и восстанавливает, отбрасывая битые строки', () => {
    const storage = memory();
    createCart(storage).add('b1');
    expect(createCart(storage).getItems()).toEqual([{ productId: 'b1', quantity: 1 }]);
    const broken = memory({ 'shop-web:cart': '[{"productId":"a","quantity":1},{"productId":2},{"productId":"b","quantity":0}]' });
    expect(createCart(broken).getItems()).toEqual([{ productId: 'a', quantity: 1 }]);
    expect(createCart(memory({ 'shop-web:cart': '{oops' })).getItems()).toEqual([]);
  });
  it('оповещает подписчиков, отписка работает', () => {
    const cart = createCart(memory());
    const l = vi.fn();
    const off = cart.subscribe(l);
    cart.add('b1');
    off();
    cart.add('b1');
    expect(l).toHaveBeenCalledTimes(1);
    expect(l).toHaveBeenCalledWith([{ productId: 'b1', quantity: 1 }]);
  });
});

describe('шаг 4: api.quote', () => {
  it('POST с JSON-телом, итог с сервера', async () => {
    const fetchFn = vi.fn(async () => new Response(JSON.stringify({ subtotal: 300000, discount: 30000, total: 270000 }), { status: 200 }));
    const totals = await createApi('http://api.test', fetchFn as typeof fetch).quote([{ productId: 'b1', quantity: 2 }], 'SALE10');
    expect(totals.total).toBe(270000);
    const [url, init] = fetchFn.mock.calls[0] as unknown as [URL, RequestInit];
    expect(String(url)).toBe('http://api.test/api/cart/quote');
    expect(init.method).toBe('POST');
    expect(new Headers(init.headers).get('Content-Type')).toBe('application/json');
    expect(JSON.parse(String(init.body))).toEqual({ items: [{ productId: 'b1', quantity: 2 }], promo: 'SALE10' });
  });
  it('400 — HttpError с текстом сервера', async () => {
    const fetchFn = (async () => new Response(JSON.stringify({ error: 'Нет товара zz' }), { status: 400 })) as typeof fetch;
    await expect(createApi('http://api.test', fetchFn).quote([{ productId: 'zz', quantity: 1 }])).rejects.toMatchObject({ status: 400, message: 'Нет товара zz' });
  });
});
