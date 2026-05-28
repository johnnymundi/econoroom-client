import { client } from './client';
import type { TokenPair, User } from '../types';

export const authApi = {
  login: (email: string, password: string) =>
    client.post<TokenPair>('/auth/login/', { email, password }),

  register: (email: string, username: string, password: string) =>
    client.post<User>('/auth/register/', { email, username, password }),

  me: () => client.get<User>('/auth/me/'),

  updateMe: (data: Partial<Pick<User, 'username' | 'avatar'>>) =>
    client.patch<User>('/auth/me/', data),
};
