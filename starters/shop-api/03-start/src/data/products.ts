export interface Product {
  id: string;
  title: string;
  category: 'books' | 'games' | 'home';
  /** Цена в копейках */
  price: number;
}

export const PRODUCTS: readonly Product[] = [
  { id: 'b1', title: 'Чистый код', category: 'books', price: 150000 },
  { id: 'b2', title: 'Грокаем алгоритмы', category: 'books', price: 99000 },
  { id: 'g1', title: 'Каркассон', category: 'games', price: 249000 },
  { id: 'h1', title: 'Настольная лампа', category: 'home', price: 27900 },
];
