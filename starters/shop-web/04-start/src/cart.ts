import type { CartItem } from './types.js';

export interface KeyValueStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export function createCart(storage: KeyValueStorage) {
  // Шаг 4: состояние корзины, подписка, сохранение с проверкой при чтении
  void storage;
  return {
    getItems: (): CartItem[] => [],
    add(productId: string): void {
      void productId;
    },
    remove(productId: string): void {
      void productId;
    },
    subscribe(listener: (items: CartItem[]) => void): () => void {
      void listener;
      return () => {};
    },
  };
}
