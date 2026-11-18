import type { Product } from '../data/products.js';

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export function filterProducts(products: readonly Product[], f: ProductFilters): Product[] {
  const query = f.search?.trim().toLowerCase() ?? '';
  return products.filter(
    (p) =>
      (query === '' || p.title.toLowerCase().includes(query)) &&
      (f.category === undefined || p.category === f.category) &&
      (f.minPrice === undefined || p.price >= f.minPrice) &&
      (f.maxPrice === undefined || p.price <= f.maxPrice),
  );
}
