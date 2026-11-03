/** Маленькие помощники для разбора HTML-фрагментов контента без сторонних библиотек. */

const ENTITIES: Record<string, string> = {
  '&lt;': '<',
  '&gt;': '>',
  '&amp;': '&',
  '&quot;': '"',
  '&#39;': "'",
  '&nbsp;': ' ',
};

export function decodeEntities(s: string): string {
  return s.replace(/&(lt|gt|amp|quot|nbsp|#39);/g, (m) => ENTITIES[m] ?? m);
}

/** Убирает теги и схлопывает пробелы */
export function toText(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

/** Заголовок h2 без подписи-источника (<span class="src">) */
export function sectionTitle(html: string): string {
  const m = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/);
  if (!m) return '';
  return toText(m[1].replace(/<span class="src">[\s\S]*?<\/span>/, ''));
}
