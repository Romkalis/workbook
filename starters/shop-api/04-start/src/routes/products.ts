import { Router, type Request, type Response } from 'express';
import { PRODUCTS, type Product } from '../data/products.js';
import { filterProducts } from '../domain/products.js';
import { HttpError } from '../http-error.js';

export const productsRouter = Router();

type ProductsQuery = { search?: string; category?: string; minPrice?: string; maxPrice?: string };

function toPrice(value: string | undefined, name: string): number | undefined {
  if (value === undefined || value === '') return undefined;
  const n = Number(value);
  if (!Number.isInteger(n) || n < 0) throw new HttpError(400, `${name} должен быть целым числом ≥ 0`);
  return n;
}

productsRouter.get('/', (req: Request<{}, Product[], unknown, ProductsQuery>, res: Response<Product[]>) => {
  res.json(
    filterProducts(PRODUCTS, {
      search: req.query.search,
      category: req.query.category,
      minPrice: toPrice(req.query.minPrice, 'minPrice'),
      maxPrice: toPrice(req.query.maxPrice, 'maxPrice'),
    }),
  );
});

productsRouter.get('/:id', (req: Request<{ id: string }>, res: Response<Product>) => {
  const product = PRODUCTS.find((p) => p.id === req.params.id);
  if (!product) throw new HttpError(404, 'Товар не найден');
  res.json(product);
});
