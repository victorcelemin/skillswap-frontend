/**
 * Estado global de SkillSwap con Zustand v5 + persist middleware.
 *
 * Ref oficial Zustand v5: https://github.com/pmndrs/zustand/blob/main/docs/integrations/persisting-store-data.md
 *
 * Con Next.js App Router (SSR) usamos skipHydration: true para evitar
 * hydration mismatch. La rehidratación se dispara manualmente desde
 * el HydrationProvider en layout.tsx con useEffect.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ─────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────

export interface AuthUser {
  id: number;
  username: string;
  fullName: string;
  avatarUrl?: string;
  creditsBalance: number;
  averageRating: number;
  totalSessionsTaught: number;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  setAuth: (token: string, user: AuthUser) => void;
  logout: () => void;
  updateCredits: (balance: number) => void;
}

// ─────────────────────────────────────────────
// Auth Store
// ─────────────────────────────────────────────

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user:  null,

      setAuth: (token, user) => set({ token, user }),

      logout: () => set({ token: null, user: null }),

      updateCredits: (balance) =>
        set((state) => ({
          user: state.user ? { ...state.user, creditsBalance: balance } : null,
        })),
    }),
    {
      name: 'skillswap-auth',
      storage: createJSONStorage(() => localStorage),
      /**
       * skipHydration: true → Zustand no intenta leer localStorage durante SSR.
       * Requiere llamar manualmente a useAuthStore.persist.rehydrate() en el
       * primer useEffect del cliente (ver HydrationProvider en layout.tsx).
       */
      skipHydration: true,
    },
  ),
);

// ─────────────────────────────────────────────
// Notification Store (en memoria, sin persist)
// ─────────────────────────────────────────────

export interface AppNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (n: AppNotification) => void;
  markAllRead: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (n) =>
    set((state) => ({
      notifications: [n, ...state.notifications].slice(0, 20),
      unreadCount: state.unreadCount + 1,
    })),

  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
}));
