import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <h1>Страница не найдена</h1>
      <p>
        Такого урока нет. Вернитесь к <Link href="/">списку уроков</Link> или воспользуйтесь поиском (Ctrl+K).
      </p>
    </>
  );
}
