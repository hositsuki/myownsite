import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Post } from '@/types/post';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: 'user' | 'admin';
}

interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | null;
  setAuth: (data: { isAuthenticated: boolean; isAdmin: boolean; user: User }) => void;
  logout: () => void;
}

interface PostState {
  posts: Post[];
  currentPost: Post | null;
  loading: boolean;
  error: string | null;
  setPosts: (posts: Post[]) => void;
  setCurrentPost: (post: Post | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

interface UIState {
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  notifications: Notification[];
  toggleTheme: () => void;
  toggleSidebar: () => void;
  addNotification: (type: Notification['type'], message: string, duration?: number) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      setAuth: (data) => set(data),
      logout: () => set({ isAuthenticated: false, isAdmin: false, user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export const usePostStore = create<PostState>()((set) => ({
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
  setPosts: (posts) => set({ posts }),
  setCurrentPost: (post) => set({ currentPost: post }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

export const useUIStore = create<UIState>()((set, get) => ({
  theme: 'system',
  sidebarOpen: false,
  notifications: [],
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === 'dark' ? 'light' : 'dark',
    })),
  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  addNotification: (type, message, duration = 5000) => {
    const id = Math.random().toString(36).substring(7);
    set((state) => ({
      notifications: [
        ...state.notifications,
        { id, type, message, duration },
      ],
    }));
    if (duration > 0) {
      setTimeout(() => {
        get().removeNotification(id);
      }, duration);
    }
  },
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  clearNotifications: () => set({ notifications: [] }),
}));
