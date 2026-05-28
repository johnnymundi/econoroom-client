// ── Auth ──────────────────────────────────────────────────────────────────────

export interface User {
  id: number;
  email: string;
  username: string;
  avatar: string | null;
  created_at: string;
}

export interface TokenPair {
  access: string;
  refresh: string;
}

// ── Finances ──────────────────────────────────────────────────────────────────

export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  is_default: boolean;
}

export interface Account {
  id: number;
  balance: string;
  updated_at: string;
}

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: number;
  type: TransactionType;
  amount: string;
  description: string;
  date: string;
  category: number | null;
  created_at: string;
}

export interface Budget {
  id: number;
  category: number;
  limit_amount: string;
  month: number;
  year: number;
}

export type DebtStatus = 'active' | 'paid';

export interface Debt {
  id: number;
  creditor: string;
  total_amount: string;
  paid_amount: string;
  due_date: string | null;
  status: DebtStatus;
  created_at: string;
  paid_at: string | null;
}

export interface FinanceSummary {
  month: number;
  year: number;
  balance: string;
  income: number;
  expenses: number;
  net: number;
  by_category: { category__name: string; category__color: string; total: number }[];
}

// ── Goals ─────────────────────────────────────────────────────────────────────

export type GoalStatus = 'active' | 'completed' | 'cancelled';

export interface SavingsGoal {
  id: number;
  name: string;
  target_amount: string;
  current_amount: string;
  deadline: string | null;
  status: GoalStatus;
  created_at: string;
  completed_at: string | null;
}

export interface GoalDeposit {
  id: number;
  goal: number;
  amount: string;
  note: string;
  created_at: string;
}

// ── Gamification ──────────────────────────────────────────────────────────────

export interface RoomItem {
  id: number;
  name: string;
  description: string;
  category: string;
  asset_key: string;
  position_x: number;
  position_y: number;
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  trigger_type: string;
  trigger_value: string | null;
  room_item: RoomItem | null;
  unlocked: boolean;
  unlocked_at: string | null;
}

export interface UserRoom {
  id: number;
  items: RoomItem[];
  updated_at: string;
}

// ── Pagination ────────────────────────────────────────────────────────────────

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
