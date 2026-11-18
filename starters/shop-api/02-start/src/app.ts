import express, { type Response } from 'express';
import { PRODUCTS, type Product } from './data/products.js';

export function createApp() {
  const app = express();
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.get('/api/products', (_req, res: Response<readonly Product[]>) => {
    res.json(PRODUCTS);
  });

  // Шаг 2: GET /api/products/:id, 404 и обработчик ошибок

  return app;
}
