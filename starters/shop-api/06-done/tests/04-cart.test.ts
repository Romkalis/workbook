import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';

const quote = (body: unknown) => request(createApp()).post('/api/cart/quote').send(body as object);

describe('шаг 4: POST /api/cart/quote', () => {
  it('считает сумму по серверным ценам', async () => {
    const res = await quote({ items: [{ productId: 'b1', quantity: 2 }, { productId: 'h1', quantity: 1 }] });
    expect(res.body).toEqual({ subtotal: 327900, discount: 0, total: 327900 });
  });
  it('SALE10 даёт 10%', async () => {
    const res = await quote({ items: [{ productId: 'b2', quantity: 1 }], promo: 'SALE10' });
    expect(res.body).toEqual({ subtotal: 99000, discount: 9900, total: 89100 });
  });
  it('цена из тела запроса игнорируется', async () => {
    const res = await quote({ items: [{ productId: 'b2', quantity: 1, price: 1 }] });
    expect(res.body.total).toBe(99000);
  });
  it.each([
    [{}],
    [{ items: 'b1' }],
    [{ items: [{ productId: 'b1', quantity: 0 }] }],
    [{ items: [{ productId: 'b1', quantity: 1.5 }] }],
    [{ items: [{ productId: 'zz', quantity: 1 }] }],
    [{ items: [], promo: 10 }],
  ])('неверное тело %j — 400', async (body) => {
    expect((await quote(body)).status).toBe(400);
  });
});
