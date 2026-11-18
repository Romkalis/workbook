import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';

describe('шаг 1: GET /api/products', () => {
  it('отдаёт все товары', async () => {
    const res = await request(createApp()).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body.map((p: { id: string }) => p.id)).toEqual(['b1', 'b2', 'g1', 'h1']);
  });
});
