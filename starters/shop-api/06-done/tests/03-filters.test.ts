import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { filterProducts } from '../src/domain/products.js';
import { PRODUCTS } from '../src/data/products.js';

const ids = (list: { id: string }[]) => list.map((p) => p.id);

describe('шаг 3: filterProducts', () => {
  it('поиск без учёта регистра', () => {
    expect(ids(filterProducts(PRODUCTS, { search: 'КОД' }))).toEqual(['b1']);
  });
  it('категория и диапазон цены включительно', () => {
    expect(ids(filterProducts(PRODUCTS, { category: 'books', minPrice: 99000, maxPrice: 99000 }))).toEqual(['b2']);
  });
  it('без фильтров — все товары', () => {
    expect(filterProducts(PRODUCTS, {})).toHaveLength(4);
  });
});

describe('шаг 3: query в маршруте', () => {
  it('фильтрует по параметрам запроса', async () => {
    const res = await request(createApp()).get('/api/products').query({ category: 'books', maxPrice: '100000' });
    expect(ids(res.body)).toEqual(['b2']);
  });
  it.each(['abc', '-1', '1.5'])('minPrice=%s — 400', async (value) => {
    const res = await request(createApp()).get('/api/products').query({ minPrice: value });
    expect(res.status).toBe(400);
  });
});
