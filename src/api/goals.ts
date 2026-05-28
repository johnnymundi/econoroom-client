import { client } from './client';
import type { GoalDeposit, Paginated, SavingsGoal } from '../types';

export const goalsApi = {
  getGoals: () => client.get<Paginated<SavingsGoal>>('/goals/'),
  createGoal: (data: Omit<SavingsGoal, 'id' | 'current_amount' | 'created_at' | 'completed_at'>) =>
    client.post<SavingsGoal>('/goals/', data),
  updateGoal: (id: number, data: Partial<SavingsGoal>) =>
    client.patch<SavingsGoal>(`/goals/${id}/`, data),
  deleteGoal: (id: number) => client.delete(`/goals/${id}/`),

  addDeposit: (goalId: number, amount: string, note?: string) =>
    client.post<GoalDeposit>(`/goals/${goalId}/deposits/`, { amount, note }),
};
