
import { create } from 'zustand';

interface FocusRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface FocusState {
  currentFocusId: string | null;
  focusRect: FocusRect | null;
  setFocus: (id: string | null, rect?: FocusRect | null) => void;
}

export const useFocusStore = create<FocusState>((set) => ({
  currentFocusId: 'nav-home',
  focusRect: null,
  setFocus: (id, rect = null) => set({ currentFocusId: id, focusRect: rect }),
}));
