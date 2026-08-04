import { api } from "../client";
import type {
  PaginatedResponse,
  TransactionRecord,
  TransactionCategory,
} from "../types";

export interface TransactionFilters {
  page?: number;
  pageSize?: number;
  category?: TransactionCategory | "all";
  dateFrom?: string;
  dateTo?: string;
}

export interface CreateTransactionInput {
  description: string;
  category: TransactionCategory;
  date: string;
  amount: number;
}

export interface UpdateTransactionInput extends CreateTransactionInput {}

function buildQueryString(filters?: TransactionFilters) {
  if (!filters) {
    return "";
  }

  const params = new URLSearchParams();

  if (filters.page) params.set("page", String(filters.page));
  if (filters.pageSize) params.set("pageSize", String(filters.pageSize));
  if (filters.category && filters.category !== "all") {
    params.set("category", filters.category);
  }
  if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
  if (filters.dateTo) params.set("dateTo", filters.dateTo);

  const query = params.toString();
  return query ? `?${query}` : "";
}

export async function listTransactions(
  filters?: TransactionFilters,
): Promise<PaginatedResponse<TransactionRecord>> {
  return api.get<PaginatedResponse<TransactionRecord>>(
    `/transactions${buildQueryString(filters)}`,
  );
}

export async function getTransaction(id: string): Promise<TransactionRecord> {
  return api.get<TransactionRecord>(`/transactions/${id}`);
}

export async function createTransaction(
  input: CreateTransactionInput,
): Promise<TransactionRecord> {
  return api.post<TransactionRecord>("/transactions", input);
}

export async function updateTransaction(
  id: string,
  input: UpdateTransactionInput,
): Promise<TransactionRecord> {
  return api.patch<TransactionRecord>(`/transactions/${id}`, input);
}

export async function deleteTransaction(id: string): Promise<void> {
  return api.delete<void>(`/transactions/${id}`);
}
