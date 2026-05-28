import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Change to your machine's local IP when testing on a physical device.
// "localhost" only works on the Android emulator (10.0.2.2) or iOS simulator.
export const API_URL = 'http://10.0.2.2:8000/api';

export const client = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: attach JWT access token ──────────────────────────────
client.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: refresh token on 401 ───────────────────────────────
client.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const refresh = await AsyncStorage.getItem('@refresh_token');
        if (!refresh) throw new Error('no refresh token');

        const { data } = await axios.post(`${API_URL}/auth/token/refresh/`, {
          refresh,
        });

        await AsyncStorage.setItem('@access_token', data.access);
        if (data.refresh) {
          await AsyncStorage.setItem('@refresh_token', data.refresh);
        }

        original.headers.Authorization = `Bearer ${data.access}`;
        return client(original);
      } catch {
        // Refresh failed — caller will receive the 401 and the auth store
        // should handle logout.
        await AsyncStorage.multiRemove(['@access_token', '@refresh_token']);
      }
    }

    return Promise.reject(error);
  },
);
