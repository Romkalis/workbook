import { Router, type Request, type Response } from 'express';
import { PRODUCTS, type Product } from '../data/products.js';
import { HttpError } from '../http-error.js';

export const productsRouter = Router();

productsRouter.get('/', (_req, res: Response<readonly Product[]>) => {
  // Шаг 3: фильтры search, category, minPrice, maxPrice
  res.json(PRODUCTS);
});

productsRouter.get('/:id', (req: Request<{ id: string }>, res: Response<Product>) => {
  const product = PRODUCTS.find((p) => p.id === req.params.id);
  if (!product) throw new HttpError(404, 'Товар не найден');
  res.json(product);
});
