import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../api/auth';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (email, password) => {
    const { data } = await authApi.login(email, password);
    await AsyncStorage.multiSet([
      ['@access_token', data.access],
      ['@refresh_token', data.refresh],
    ]);
    const { data: user } = await authApi.me();
    set({ user, isAuthenticated: true });
  },

  register: async (email, username, password) => {
    await authApi.register(email, username, password);
    // Auto-login after registration
    const { data } = await authApi.login(email, password);
    await AsyncStorage.multiSet([
      ['@access_token', data.access],
      ['@refresh_token', data.refresh],
    ]);
    const { data: user } = await authApi.me();
    set({ user, isAuthenticated: true });
  },

  logout: async () => {
    await AsyncStorage.multiRemove(['@access_token', '@refresh_token']);
    set({ user: null, isAuthenticated: false });
  },

  loadUser: async () => {
    set({ isLoading: true });
    try {
      const token = await AsyncStorage.getItem('@access_token');
      if (!token) {
        set({ isLoading: false });
        return;
      }
      const { data: user } = await authApi.me();
      set({ user, isAuthenticated: true });
    } catch {
      await AsyncStorage.multiRemove(['@access_token', '@refresh_token']);
    } finally {
      set({ isLoading: false });
    }
  },
}));
