import { client } from './client';
import type {
  Account,
  Budget,
  Category,
  Debt,
  FinanceSummary,
  Paginated,
  Transaction,
  TransactionType,
} from '../types';

export const financesApi = {
  // Account
  getAccount: () => client.get<Account>('/finances/account/'),

  // Summary
  getSummary: (month?: number, year?: number) =>
    client.get<FinanceSummary>('/finances/summary/', {
      params: { month, year },
    }),

  // Categories
  getCategories: () => client.get<Category[]>('/finances/categories/'),
  createCategory: (data: Partial<Category>) =>
    client.post<Category>('/finances/categories/', data),
  deleteCategory: (id: number) => client.delete(`/finances/categories/${id}/`),

  // Transactions
  getTransactions: (params?: {
    type?: TransactionType;
    category?: number;
    month?: number;
    year?: number;
    page?: number;
  }) => client.get<Paginated<Transaction>>('/finances/transactions/', { params }),
  createTransaction: (data: Omit<Transaction, 'id' | 'created_at'>) =>
    client.post<Transaction>('/finances/transactions/', data),
  deleteTransaction: (id: number) =>
    client.delete(`/finances/transactions/${id}/`),

  // Budgets
  getBudgets: () => client.get<Budget[]>('/finances/budgets/'),
  createBudget: (data: Omit<Budget, 'id'>) =>
    client.post<Budget>('/finances/budgets/', data),
  updateBudget: (id: number, data: Partial<Budget>) =>
    client.patch<Budget>(`/finances/budgets/${id}/`, data),
  deleteBudget: (id: number) => client.delete(`/finances/budgets/${id}/`),

  // Debts
  getDebts: () => client.get<Debt[]>('/finances/debts/'),
  createDebt: (data: Omit<Debt, 'id' | 'created_at' | 'paid_at'>) =>
    client.post<Debt>('/finances/debts/', data),
  updateDebt: (id: number, data: Partial<Debt>) =>
    client.patch<Debt>(`/finances/debts/${id}/`, data),
  deleteDebt: (id: number) => client.delete(`/finances/debts/${id}/`),
};
