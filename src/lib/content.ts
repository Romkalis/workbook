import fs from 'node:fs';
import path from 'node:path';
import type { Lesson, LessonMeta, NavStage, QuizItem, SearchEntry, Section, Subtopic } from './types';
import { sectionTitle, toText } from './html';

const LESSONS_DIR = path.join(process.cwd(), 'content', 'lessons');

function readJson<T>(file: string): T {
  return JSON.parse(fs.readFileSync(file, 'utf-8')) as T;
}

/** Абсолютные ссылки и картинки в HTML контента дополняются префиксом basePath. */
function withBasePath(html: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  return base ? html.replace(/(href|src)="\/(?!\/)/g, `$1="${base}/`) : html;
}

/** Делит HTML раздела на текст до первой подтемы и список подтем (h3). */
function parseSection(raw: string): Section {
  const html = withBasePath(raw);
  const id = html.match(/<section id="([^"]+)"/)?.[1] ?? '';
  const parts = html.split(/(?=<h3 id=")/);
  const subtopics: Subtopic[] = parts.slice(1).map((chunk) => {
    const m = chunk.match(/<h3 id="([^"]+)"[^>]*>([\s\S]*?)<\/h3>/);
    return { id: m?.[1] ?? '', title: toText(m?.[2] ?? ''), text: toText(chunk) };
  });
  return {
    id,
    title: sectionTitle(html),
    html,
    text: toText(parts[0]),
    subtopics,
    isSources: html.includes('class="sources"'),
  };
}

function loadLesson(slug: string): Lesson {
  const dir = path.join(LESSONS_DIR, slug);
  const meta = readJson<LessonMeta>(path.join(dir, 'lesson.json'));
  const files = fs.readdirSync(path.join(dir, 'sections')).filter((f) => f.endsWith('.html')).sort();
  const sections = files.map((f) => parseSection(fs.readFileSync(path.join(dir, 'sections', f), 'utf-8')));
  const quiz = readJson<QuizItem[]>(path.join(dir, 'quiz.json'));
  return { ...meta, sections, quiz };
}

let cache: Lesson[] | null = null;

/** Все уроки, отсортированные по сквозному порядку. Читаются с диска один раз. */
export function getLessons(): Lesson[] {
  if (!cache) {
    cache = fs
      .readdirSync(LESSONS_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => loadLesson(d.name))
      .sort((a, b) => a.order - b.order);
  }
  return cache;
}

export function getLesson(slug: string): Lesson | undefined {
  return getLessons().find((l) => l.slug === slug);
}

/** Уроки, сгруппированные по этапам (Stage) для общего оглавления. */
export function getStages(): { stage: number; lessons: Lesson[] }[] {
  const map = new Map<number, Lesson[]>();
  for (const l of getLessons()) map.set(l.stage, [...(map.get(l.stage) ?? []), l]);
  return [...map.entries()].sort((a, b) => a[0] - b[0]).map(([stage, lessons]) => ({ stage, lessons }));
}

/** Структура общего оглавления: этапы → уроки → разделы → подтемы. Тест вставляется перед источниками. */
export function getNav(): NavStage[] {
  return getStages().map(({ stage, lessons }) => ({
    stage,
    lessons: lessons.map((l) => {
      const items = l.sections.map((s) => ({
        id: s.id,
        title: s.title,
        subtopics: s.subtopics.map(({ id, title }) => ({ id, title })),
        isSources: s.isSources,
      }));
      const at = items.findIndex((i) => i.isSources);
      const test = { id: 'test', title: 'Тест по уроку', subtopics: [], isSources: false };
      items.splice(at < 0 ? items.length : at, 0, test);
      return { slug: l.slug, title: l.title, items: items.map(({ isSources: _s, ...rest }) => rest) };
    }),
  }));
}

/** Плоский индекс для поиска: по записи на раздел и на каждую подтему. */
export function buildSearchIndex(): SearchEntry[] {
  const entries: SearchEntry[] = [];
  for (const l of getLessons()) {
    for (const s of l.sections) {
      const base = { lessonSlug: l.slug, lessonTitle: l.title, sectionTitle: s.title };
      entries.push({ ...base, title: s.title, url: `/lessons/${l.slug}#${s.id}`, text: s.text });
      for (const t of s.subtopics) {
        entries.push({ ...base, title: t.title, url: `/lessons/${l.slug}#${t.id}`, text: t.text });
      }
    }
    for (const q of l.quiz) {
      entries.push({
        lessonSlug: l.slug,
        lessonTitle: l.title,
        sectionTitle: 'Тест по уроку',
        title: toText(q.q),
        url: `/lessons/${l.slug}#test`,
        text: toText(q.why),
      });
    }
  }
  return entries;
}
