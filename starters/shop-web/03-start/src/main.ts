// Точка входа: собирает части приложения. Дополняется на каждом шаге.
import { createApi } from './api.js';

const api = createApi(import.meta.env.VITE_API_URL ?? 'http://localhost:3000');
api.getProducts().then(
  (products) => console.log('Товары:', products),
  (error: unknown) => console.error(error),
);
