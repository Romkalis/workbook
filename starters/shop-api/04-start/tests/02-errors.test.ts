import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';

describe('шаг 2: товар по id и ошибки', () => {
  it('отдаёт товар по id', async () => {
    const res = await request(createApp()).get('/api/products/g1');
    expect(res.body).toEqual({ id: 'g1', title: 'Каркассон', category: 'games', price: 249000 });
  });

  it('неизвестный id — 404 в JSON', async () => {
    const res = await request(createApp()).get('/api/products/zz');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Товар не найден' });
  });

  it('неизвестный маршрут — 404 в JSON', async () => {
    const res = await request(createApp()).get('/api/nope');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Маршрут не найден' });
  });

  it('битый JSON — 400, а не 500', async () => {
    const res = await request(createApp()).post('/api/health').set('Content-Type', 'application/json').send('{oops');
    expect(res.status).toBe(400);
  });
});
