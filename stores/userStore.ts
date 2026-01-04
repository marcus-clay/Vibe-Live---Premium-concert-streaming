
import { create } from 'zustand';
import { UserEntitlements } from '../types';

interface UserState {
  isAuthenticated: boolean;
  entitlements: UserEntitlements;
  isCheckoutOpen: boolean;
  activeCheckoutEventId: string | null;
  
  login: () => void;
  logout: () => void;
  openCheckout: (eventId: string) => void;
  closeCheckout: () => void;
  purchaseEvent: (eventId: string) => void;
  toggleSubscription: () => void;
  hasAccess: (eventId: string) => boolean;
}

export const useUserStore = create<UserState>((set, get) => ({
  isAuthenticated: false, // Start unauthenticated to show the landing page
  entitlements: {
    ownedEventIds: ['e3', 'e4'],
    isPremiumSubscriber: false,
  },
  isCheckoutOpen: false,
  activeCheckoutEventId: null,

  login: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false }),
  
  openCheckout: (eventId: string) => set({ isCheckoutOpen: true, activeCheckoutEventId: eventId }),
  closeCheckout: () => set({ isCheckoutOpen: false, activeCheckoutEventId: null }),
  
  purchaseEvent: (eventId: string) => set((state) => ({
    entitlements: {
      ...state.entitlements,
      ownedEventIds: [...state.entitlements.ownedEventIds, eventId],
    },
    isCheckoutOpen: false,
    activeCheckoutEventId: null,
  })),

  toggleSubscription: () => set((state) => ({
    entitlements: {
      ...state.entitlements,
      isPremiumSubscriber: !state.entitlements.isPremiumSubscriber,
    }
  })),

  hasAccess: (eventId: string) => {
    const { entitlements } = get();
    return entitlements.isPremiumSubscriber || entitlements.ownedEventIds.includes(eventId);
  },
}));
