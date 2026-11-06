import type { NextConfig } from 'next';

// Сайт опубликован в подпапке https://rkliss.ru/workbook/. В dev работает от корня.
const basePath = process.env.NODE_ENV === 'production' ? '/workbook' : '';

const nextConfig: NextConfig = {
  // Статический экспорт: `npm run build` кладёт готовый сайт в out/, сервер Node не нужен.
  output: 'export',
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  // Каждая страница становится папкой с index.html: /lessons/testing/ работает на любом веб-сервере без настроек.
  trailingSlash: true,
};

export default nextConfig;
