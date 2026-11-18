import express, { type ErrorRequestHandler } from 'express';
import { cartRouter } from './routes/cart.js';
import { HttpError } from './http-error.js';
import { productsRouter } from './routes/products.js';

export function createApp() {
  const app = express();
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });
  app.use('/api/products', productsRouter);
  app.use('/api/cart', cartRouter);

  app.use((_req, _res, next) => next(new HttpError(404, 'Маршрут не найден')));

  const onError: ErrorRequestHandler = (err, _req, res, _next) => {
    const status = err instanceof HttpError ? err.status : (err.status ?? 500);
    if (status >= 500) console.error(err);
    res.status(status).json({ error: status >= 500 ? 'Внутренняя ошибка сервера' : err.message });
  };
  app.use(onError);
  return app;
}
