export type Category = 'books' | 'games' | 'home';

export interface Product {
  id: string;
  title: string;
  category: Category;
  /** Цена в копейках */
  price: number;
}

export interface ProductFilters {
  search?: string;
  category?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Totals {
  subtotal: number;
  discount: number;
  total: number;
}

/** Данные, которые загружаются с сервера: одно из четырёх состояний */
export type RemoteData<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string };
