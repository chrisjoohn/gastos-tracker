export type TransactionCategory =
  | "food"
  | "shopping"
  | "transport"
  | "housing"
  | "entertainment"
  | "health"
  | "utilities"
  | "other";

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  createdAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest extends LoginRequest {
  name?: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export interface TransactionRecord {
  id: string;
  description: string;
  category: TransactionCategory;
  date: string;
  amount: number;
}

export interface AnalyticsSummary {
  totalSpent: number;
  transactionCount: number;
  topCategory: TransactionCategory;
  monthlyBudget: number;
  remainingBudget: number;
}

export interface TrendPoint {
  date: string;
  amount: number;
}

export interface ApiErrorPayload {
  message: string;
  code?: string;
  details?: unknown;
}

export interface ApiErrorResponse {
  error: ApiErrorPayload;
}
