import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { loadConfig } from '../src/config.js';

describe('шаг 5: loadConfig', () => {
  it('значения по умолчанию', () => {
    expect(loadConfig({})).toEqual({ port: 3000, clientOrigin: 'http://localhost:5173' });
  });
  it('читает переменные', () => {
    expect(loadConfig({ PORT: '8080', CLIENT_ORIGIN: 'https://shop.example' })).toEqual({ port: 8080, clientOrigin: 'https://shop.example' });
  });
  it.each(['abc', '0', '70000'])('PORT=%s — ошибка', (PORT) => {
    expect(() => loadConfig({ PORT })).toThrow(/PORT/);
  });
});

describe('шаг 5: CORS', () => {
  it('разрешает адрес фронтенда', async () => {
    const res = await request(createApp('https://shop.example')).get('/api/health').set('Origin', 'https://shop.example');
    expect(res.headers['access-control-allow-origin']).toBe('https://shop.example');
  });
  it('отвечает на предварительный запрос', async () => {
    const res = await request(createApp('https://shop.example'))
      .options('/api/cart/quote')
      .set('Origin', 'https://shop.example')
      .set('Access-Control-Request-Method', 'POST');
    expect(res.status).toBe(204);
  });
});
