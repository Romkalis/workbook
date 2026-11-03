/** Рендерит HTML-фрагмент лекции. Контент лежит в репозитории (content/) и написан нами, поэтому ему можно доверять.
    Правила оформления для разметки внутри: src/styles/prose.css, описание классов: docs/design-system.md. */
export function Prose({ html }: { html: string }) {
  return <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />;
}
