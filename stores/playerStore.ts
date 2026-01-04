
import { create } from 'zustand';

interface PlayerState {
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  currentAngleId: string;
  isControlsVisible: boolean;
  dynamicSourceUrl: string | null;
  // Tier 3 States
  isFanCircleOpen: boolean;
  isBackstageOpen: boolean;
  activeVibes: Array<{ id: number; emoji: string; x: number }>;
  // Tier 4 States
  isXRayOpen: boolean;
  isCapturing: boolean;
  capturedMoments: Array<{ id: string; timestamp: number; imageUrl: string; title: string }>;

  togglePlay: () => void;
  setPlaying: (playing: boolean) => void;
  setLoading: (loading: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  setAngle: (angleId: string) => void;
  setControlsVisible: (visible: boolean) => void;
  setDynamicSource: (url: string | null) => void;
  // Tier 3 Actions
  setFanCircleOpen: (open: boolean) => void;
  setBackstageOpen: (open: boolean) => void;
  sendVibe: (emoji: string) => void;
  // Tier 4 Actions
  setXRayOpen: (open: boolean) => void;
  captureMoment: (imageUrl: string, title: string) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  isPlaying: false,
  isLoading: false,
  currentTime: 0,
  duration: 3600,
  volume: 0.8,
  currentAngleId: 'cam1',
  isControlsVisible: true,
  dynamicSourceUrl: null,
  isFanCircleOpen: false,
  isBackstageOpen: false,
  activeVibes: [],
  isXRayOpen: false,
  isCapturing: false,
  capturedMoments: [],

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setPlaying: (playing) => set({ isPlaying: playing }),
  setLoading: (loading) => set({ isLoading: loading }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  setVolume: (volume) => set({ volume }),
  setAngle: (angleId) => set({ currentAngleId: angleId }),
  setControlsVisible: (visible) => set({ isControlsVisible: visible }),
  setDynamicSource: (url) => set({ dynamicSourceUrl: url }),
  setFanCircleOpen: (open) => set({ isFanCircleOpen: open }),
  setBackstageOpen: (open) => set({ isBackstageOpen: open }),
  sendVibe: (emoji) => set((state) => ({
    activeVibes: [...state.activeVibes, { id: Date.now(), emoji, x: Math.random() * 80 + 10 }]
  })),
  setXRayOpen: (open) => set({ isXRayOpen: open }),
  captureMoment: (imageUrl, title) => {
    set({ isCapturing: true });
    setTimeout(() => {
      set((state) => ({
        isCapturing: false,
        capturedMoments: [
          ...state.capturedMoments,
          { id: Math.random().toString(36), timestamp: state.currentTime, imageUrl, title }
        ]
      }));
    }, 400);
  }
}));
