import type { SearchEntry } from './types';

export interface Hit {
  entry: SearchEntry;
  score: number;
  /** Фрагмент текста с выделенным совпадением */
  snippet: { before: string; match: string; after: string };
}

/** Грубый «стемминг» для русского: отбрасываем окончание, чтобы «классы» находило «класс». */
function stem(term: string): string {
  if (term.length >= 6) return term.slice(0, -2);
  if (term.length === 5) return term.slice(0, -1);
  return term;
}

export function search(index: SearchEntry[], query: string, limit = 30): Hit[] {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map(stem);
  if (terms.length === 0) return [];

  const hits: Hit[] = [];
  for (const entry of index) {
    const title = entry.title.toLowerCase();
    const section = entry.sectionTitle.toLowerCase();
    const text = entry.text.toLowerCase();
    let score = 0;
    let matchAt = -1;
    let matchLen = 0;
    let ok = true;

    for (const t of terms) {
      const inTitle = title.includes(t);
      const inSection = section.includes(t);
      const pos = text.indexOf(t);
      if (!inTitle && !inSection && pos < 0) {
        ok = false;
        break;
      }
      score += (inTitle ? 10 : 0) + (inSection ? 3 : 0) + (pos >= 0 ? 1 : 0);
      if (pos >= 0 && matchAt < 0) {
        matchAt = pos;
        matchLen = t.length;
      }
    }
    if (!ok) continue;

    const start = Math.max(0, matchAt - 50);
    const snippet =
      matchAt < 0
        ? { before: '', match: '', after: entry.text.slice(0, 140) }
        : {
            before: (start > 0 ? '…' : '') + entry.text.slice(start, matchAt),
            match: entry.text.slice(matchAt, matchAt + matchLen),
            after: entry.text.slice(matchAt + matchLen, matchAt + matchLen + 110),
          };
    hits.push({ entry, score, snippet });
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}
