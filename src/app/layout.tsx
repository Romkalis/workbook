import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono, Onest, Unbounded } from 'next/font/google';
import { Header } from '@/components/Header';
import { Search } from '@/components/Search';
import { Sidebar } from '@/components/Sidebar';
import { getNav } from '@/lib/content';
import './globals.css';
import styles from './layout.module.css';

const onest = Onest({ subsets: ['latin', 'cyrillic'], variable: '--font-onest', display: 'swap' });
const unbounded = Unbounded({ subsets: ['latin', 'cyrillic'], variable: '--font-unbounded', display: 'swap' });
const jetbrains = JetBrains_Mono({ subsets: ['latin', 'cyrillic'], variable: '--font-jetbrains', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'Учебник', template: '%s · Учебник' },
  description: 'Конспекты модулей RS School: ООП, Chrome DevTools, как работают браузеры.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

/** Выставляет тему до первой отрисовки: сохранённый выбор, иначе системная настройка. */
const THEME_SCRIPT = `try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const nav = getNav();

  return (
    <html lang="ru" className={`${onest.variable} ${unbounded.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <a href="#content" className={styles.skip}>
          К содержимому
        </a>
        <Header />
        <div className={styles.shell}>
          <Sidebar nav={nav} />
          <main id="content" className={styles.main}>
            {children}
          </main>
        </div>
        <Search />
      </body>
    </html>
  );
}
