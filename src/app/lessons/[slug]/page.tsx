import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LessonHeader } from '@/components/LessonHeader';
import { LessonPager } from '@/components/LessonPager';
import { Prose } from '@/components/Prose';
import { ProseBehavior } from '@/components/ProseBehavior';
import { Quiz } from '@/components/Quiz';
import { getLesson, getLessons } from '@/lib/content';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getLessons().map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLesson(slug);
  return lesson ? { title: lesson.title, description: lesson.lead } : {};
}

export default async function LessonPage({ params }: Props) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();

  const lessons = getLessons();
  const at = lessons.findIndex((l) => l.slug === slug);
  const body = lesson.sections.filter((s) => !s.isSources);
  const sources = lesson.sections.filter((s) => s.isSources);

  return (
    <article>
      <LessonHeader lesson={lesson} />
      <ProseBehavior>
        {body.map((s) => (
          <Prose key={s.id} html={s.html} />
        ))}
        <Quiz items={lesson.quiz} />
        {sources.map((s) => (
          <Prose key={s.id} html={s.html} />
        ))}
      </ProseBehavior>
      <LessonPager prev={lessons[at - 1]} next={lessons[at + 1]} />
    </article>
  );
}
