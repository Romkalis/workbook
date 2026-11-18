/** Метаданные урока из content/lessons/<slug>/lesson.json */
export interface LessonMeta {
  slug: string;
  /** Короткое название для оглавления и карточек */
  title: string;
  stage: number;
  /** Отдельный раздел вне этапов, например "backend". Без него урок попадает в свой Stage. */
  track?: string;
  /** Сквозной порядок в курсе */
  order: number;
  kicker: string;
  /** Заголовок h1 страницы урока */
  heading: string;
  lead: string;
  chips: string[];
}

export interface Subtopic {
  id: string;
  title: string;
  /** Чистый текст подтемы для поиска */
  text: string;
}

export interface Section {
  id: string;
  title: string;
  /** Исходный HTML раздела (<section id=...>) */
  html: string;
  /** Текст до первой подтемы */
  text: string;
  subtopics: Subtopic[];
  /** Раздел «Источники»: в уроке он идёт после теста */
  isSources: boolean;
}

/** Облегчённая структура для общего оглавления (без HTML) */
export interface NavItem {
  id: string;
  title: string;
  subtopics: { id: string; title: string }[];
}

export interface NavLesson {
  slug: string;
  title: string;
  items: NavItem[];
}

/** Группа уроков в оглавлении: этап курса или отдельный раздел (track). */
export interface NavStage {
  key: string;
  title: string;
  lessons: NavLesson[];
}

export interface QuizItem {
  q: string;
  o: string[];
  a: number;
  why: string;
}

export interface Lesson extends LessonMeta {
  sections: Section[];
  quiz: QuizItem[];
  /** Идентификаторы задач урока (data-task), по порядку в тексте */
  tasks: string[];
}

/** Запись поискового индекса: один раздел или одна подтема */
export interface SearchEntry {
  lessonSlug: string;
  lessonTitle: string;
  sectionTitle: string;
  title: string;
  url: string;
  text: string;
}
