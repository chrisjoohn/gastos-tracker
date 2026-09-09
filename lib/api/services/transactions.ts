import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { PaginatedResponse, TransactionRecord, TransactionCategory } from "../types";

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

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL ?? "http://localhost:3001/api";

const buildQs = (filters?: TransactionFilters) => {
  if (!filters) return "";
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.pageSize) params.set("pageSize", String(filters.pageSize));
  if (filters.category && filters.category !== "all") params.set("category", filters.category);
  if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
  if (filters.dateTo) params.set("dateTo", filters.dateTo);
  const q = params.toString();
  return q ? `?${q}` : "";
};

export const transactionsApi = createApi({
  reducerPath: "transactionsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: String(BASE_URL).replace(/\/$/, ""),
    prepareHeaders(headers) {
      if (typeof window !== "undefined") {
        const token = window.localStorage.getItem("auth_token");
        if (token) headers.set("authorization", `Bearer ${token}`);
      }
      headers.set("accept", "application/json");
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["Transactions"],
  endpoints: (build) => ({
    listTransactions: build.query<PaginatedResponse<TransactionRecord>, TransactionFilters | void>({
      query: (filters) => `/transactions${buildQs(filters as TransactionFilters)}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((t) => ({ type: "Transactions" as const, id: t.id })),
              { type: "Transactions", id: "LIST" },
            ]
          : [{ type: "Transactions", id: "LIST" }],
    }),
    getTransaction: build.query<TransactionRecord, string>({
      query: (id) => `/transactions/${id}`,
      providesTags: (result, error, id) => [{ type: "Transactions", id }],
    }),
    createTransaction: build.mutation<TransactionRecord, CreateTransactionInput>({
      query: (body) => ({ url: "/transactions", method: "POST", body }),
      invalidatesTags: [{ type: "Transactions", id: "LIST" }],
    }),
    updateTransaction: build.mutation<
      TransactionRecord,
      { id: string; body: UpdateTransactionInput }
    >({
      query: ({ id, body }) => ({ url: `/transactions/${id}`, method: "PATCH", body }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Transactions", id },
        { type: "Transactions", id: "LIST" },
      ],
    }),
    deleteTransaction: build.mutation<void, string>({
      query: (id) => ({ url: `/transactions/${id}`, method: "DELETE" }),
      invalidatesTags: (result, error, id) => [
        { type: "Transactions", id },
        { type: "Transactions", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useListTransactionsQuery,
  useGetTransactionQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} = transactionsApi;
