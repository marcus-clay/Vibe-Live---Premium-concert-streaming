
import { create } from 'zustand';
import { ViewportType } from '../types';

interface ViewportState {
  currentViewport: ViewportType;
  setViewport: (viewport: ViewportType) => void;
}

export const useViewportStore = create<ViewportState>((set) => ({
  currentViewport: 'desktop',
  setViewport: (viewport) => set({ currentViewport: viewport }),
}));
