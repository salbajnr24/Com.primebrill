import { create } from 'zustand';
import { User } from '@shared/schema';

interface AuthStore {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  loading: true,
  
  setUser: (user) => {
    set({ user, loading: false });
  },
  
  setLoading: (loading) => {
    set({ loading });
  },
  
  logout: () => {
    set({ user: null, loading: false });
  },
  
  isAuthenticated: () => {
    return get().user !== null;
  },
  
  isAdmin: () => {
    const user = get().user;
    return user?.isAdmin === true;
  },
}));
