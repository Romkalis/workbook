import type { Product, RemoteData } from '../types.js';
import { createCard } from './card.js';

function message(text: string): HTMLParagraphElement {
  const p = document.createElement('p');
  p.className = 'message';
  p.textContent = text;
  return p;
}

export function renderCatalog(root: HTMLElement, state: RemoteData<Product[]>, onRetry: () => void): void {
  if (state.status === 'loading') root.setAttribute('aria-busy', 'true');
  else root.removeAttribute('aria-busy');

  switch (state.status) {
    case 'idle':
      root.replaceChildren();
      return;
    case 'loading': {
      const skeletons = Array.from({ length: 4 }, () => {
        const s = document.createElement('div');
        s.className = 'card card--skeleton';
        s.setAttribute('aria-hidden', 'true');
        return s;
      });
      root.replaceChildren(...skeletons);
      return;
    }
    case 'error': {
      const retry = document.createElement('button');
      retry.type = 'button';
      retry.textContent = 'Повторить';
      retry.addEventListener('click', onRetry);
      root.replaceChildren(message(`Не удалось загрузить товары: ${state.message}`), retry);
      return;
    }
    case 'success':
      root.replaceChildren(...(state.data.length === 0 ? [message('Ничего не найдено')] : state.data.map(createCard)));
      return;
    default: {
      const unreachable: never = state;
      throw new Error(`Неизвестное состояние: ${JSON.stringify(unreachable)}`);
    }
  }
}
