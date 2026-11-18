import type { CartItem } from './types.js';

export interface KeyValueStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

const KEY = 'shop-web:cart';

function isItem(x: unknown): x is CartItem {
  return (
    typeof x === 'object' &&
    x !== null &&
    'productId' in x &&
    typeof x.productId === 'string' &&
    'quantity' in x &&
    Number.isInteger(x.quantity) &&
    (x.quantity as number) >= 1
  );
}

function load(storage: KeyValueStorage): CartItem[] {
  try {
    const data: unknown = JSON.parse(storage.getItem(KEY) ?? '[]');
    return Array.isArray(data) ? data.filter(isItem) : [];
  } catch {
    return [];
  }
}

export function createCart(storage: KeyValueStorage) {
  let items = load(storage);
  const listeners = new Set<(items: CartItem[]) => void>();

  function set(next: CartItem[]) {
    items = next;
    try {
      storage.setItem(KEY, JSON.stringify(items));
    } catch {
      // хранилище недоступно — работаем без сохранения
    }
    listeners.forEach((l) => l(items));
  }

  return {
    getItems: (): CartItem[] => items,
    add(productId: string): void {
      const found = items.find((i) => i.productId === productId);
      set(found ? items.map((i) => (i === found ? { ...i, quantity: i.quantity + 1 } : i)) : [...items, { productId, quantity: 1 }]);
    },
    remove(productId: string): void {
      if (items.some((i) => i.productId === productId)) set(items.filter((i) => i.productId !== productId));
    },
    subscribe(listener: (items: CartItem[]) => void): () => void {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
