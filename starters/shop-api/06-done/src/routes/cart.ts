import { Router, type Request, type Response } from 'express';
import { PRODUCTS } from '../data/products.js';
import { calculateCart, type CartLine, type CartTotals } from '../domain/cart.js';
import { HttpError } from '../http-error.js';

export const cartRouter = Router();

interface QuoteBody {
  items: { productId: string; quantity: number }[];
  promo?: string;
}

function isQuoteBody(body: unknown): body is QuoteBody {
  if (typeof body !== 'object' || body === null || !('items' in body) || !Array.isArray(body.items)) return false;
  if ('promo' in body && body.promo !== undefined && typeof body.promo !== 'string') return false;
  return body.items.every(
    (i: unknown) =>
      typeof i === 'object' &&
      i !== null &&
      'productId' in i &&
      typeof i.productId === 'string' &&
      'quantity' in i &&
      typeof i.quantity === 'number' &&
      Number.isInteger(i.quantity) &&
      i.quantity >= 1,
  );
}

cartRouter.post('/quote', (req: Request<{}, CartTotals, unknown>, res: Response<CartTotals>) => {
  if (!isQuoteBody(req.body)) throw new HttpError(400, 'Неверное тело запроса');
  const lines: CartLine[] = req.body.items.map(({ productId, quantity }) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) throw new HttpError(400, `Нет товара ${productId}`);
    return { productId, price: product.price, quantity };
  });
  res.json(calculateCart(lines, req.body.promo));
});
