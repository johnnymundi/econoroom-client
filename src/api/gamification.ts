import { client } from './client';
import type { Achievement, UserRoom } from '../types';

export const gamificationApi = {
  getAchievements: () => client.get<Achievement[]>('/gamification/achievements/'),
  getRoom: () => client.get<UserRoom>('/gamification/room/'),
};
