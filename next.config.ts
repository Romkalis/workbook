import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Статический экспорт: `npm run build` кладёт готовый сайт в out/, сервер Node не нужен.
  output: 'export',
  // Каждая страница становится папкой с index.html: /lessons/testing/ работает на любом веб-сервере без настроек.
  trailingSlash: true,
};

export default nextConfig;
