import * as React from "react";

import { useListTransactionsQuery } from "@/lib/api/services/transactions";

import type { TransactionRecord } from "@/lib/api/types";
import type { TransactionFilters } from "@/lib/api/services/transactions";

const DEFAULT_PAGE_SIZE = 8;

export type UseTransactionsOptions = {
  pageSize?: number;
  initialPage?: number;
  filters?: TransactionFilters;
};

export function useTransactions(options: UseTransactionsOptions = {}): UseTransactionsReturn {
  const { pageSize = DEFAULT_PAGE_SIZE, initialPage = 1, filters } = options;

  const [page, setPage] = React.useState<number>(initialPage);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalCount, setTotalCount] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setPage(1);
  }, [pageSize, filters?.category, filters?.dateFrom, filters?.dateTo]);

  const effectivePage = Math.max(1, Math.min(page, Math.max(1, totalPages)));
  const { data, error: rtkError, isFetching } = useListTransactionsQuery(
    {
      page: effectivePage,
      pageSize,
      category: filters?.category,
      dateFrom: filters?.dateFrom,
      dateTo: filters?.dateTo,
    },
    { refetchOnMountOrArgChange: true },
  );

  React.useEffect(() => {
    setError(null);
    setTotalPages(data?.meta?.totalPages ?? 1);
    setTotalCount(data?.meta?.total ?? 0);

    if (rtkError) {
      // Map RTK Query error to a simple message
      const errAny = rtkError as any;
      const message = errAny?.data?.error?.message ?? errAny?.error ?? (rtkError as Error)?.message ?? "Unable to load transactions.";
      setError(String(message));
    }
  }, [data, rtkError]);

  // Ensure `page` is clamped when `totalPages` changes (e.g. after filtering)
  React.useEffect(() => {
    setPage((prev) => {
      const max = Math.max(1, totalPages);
      if (prev < 1) return 1;
      if (prev > max) return max;
      return prev;
    });
  }, [totalPages]);

  const currentPage = effectivePage;

  const reset = React.useCallback(() => setPage(1), [setPage]);
  const goTo = React.useCallback((n: number) => setPage((_) => Math.max(1, Math.floor(n))), []);
  const next = React.useCallback(() => setPage((p) => Math.min(Math.max(1, totalPages), p + 1)), [totalPages]);
  const prev = React.useCallback(() => setPage((p) => Math.max(1, p - 1)), []);

  return {
    setPage,
    next,
    prev,
    goTo,
    currentPage,
    totalPages,
    totalCount,
    pageSize,
    reset,
    transactions: data?.data ?? [],
    error,
    isFetching,
  } as const;
}

export type UseTransactionsReturn = {
  setPage: (n: number) => void;
  next: () => void;
  prev: () => void;
  goTo: (n: number) => void;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  reset: () => void;
  transactions: TransactionRecord[];
  error: string | null;
  isFetching: boolean;
};
