import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** Решённые задачи. Ключ — значение data-task у задачи: "<урок>/<id>". Хранится в localStorage браузера. */
interface ProgressState {
  done: Record<string, true>;
  toggle: (taskId: string) => void;
}

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      done: {},
      toggle: (taskId) =>
        set(({ done }) => {
          const next = { ...done };
          if (next[taskId]) delete next[taskId];
          else next[taskId] = true;
          return { done: next };
        }),
    }),
    // Страницы собираются заранее и на сервере прогресса не знают. Читаем localStorage только после
    // монтирования (useProgressHydration), иначе разметка сервера и клиента разойдётся.
    { name: 'workbook:progress', skipHydration: true },
  ),
);

/** Считывает сохранённый прогресс один раз на клиенте. Вызывается в каждом компоненте, который показывает прогресс. */
export function rehydrateProgress() {
  if (!useProgress.persist.hasHydrated()) void useProgress.persist.rehydrate();
}
