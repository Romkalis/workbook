export interface CartLine {
  productId: string;
  price: number;
  quantity: number;
}

export interface CartTotals {
  subtotal: number;
  discount: number;
  total: number;
}

const PROMO_CODES: Readonly<Record<string, number>> = { SALE10: 10 };

export function calculateCart(cart: readonly CartLine[], promo?: string): CartTotals {
  const subtotal = cart.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const percent = promo === undefined ? 0 : (PROMO_CODES[promo.trim().toUpperCase()] ?? 0);
  const discount = Math.round((subtotal * percent) / 100);
  return { subtotal, discount, total: subtotal - discount };
}
