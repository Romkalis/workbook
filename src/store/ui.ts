import { create } from 'zustand';

/** Общее состояние интерфейса, которое нужно разным частям экрана: шапке, меню и поиску. */
interface UiState {
  navOpen: boolean;
  searchOpen: boolean;
  setNavOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
}

export const useUi = create<UiState>()((set) => ({
  navOpen: false,
  searchOpen: false,
  setNavOpen: (navOpen) => set({ navOpen }),
  setSearchOpen: (searchOpen) => set({ searchOpen }),
}));
