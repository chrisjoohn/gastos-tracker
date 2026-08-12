import * as React from "react";

import { listTransactions } from "@/lib/api/services/transactions";

import type { TransactionRecord } from "@/lib/api/types";
import type { TransactionFilters } from "@/lib/api/services/transactions";

const DEFAULT_PAGE_SIZE = 8;

export type UseTransactionsTableOptions = {
  pageSize?: number;
  initialPage?: number;
  filters?: TransactionFilters;
};

export function useTransactionsTable(options: UseTransactionsTableOptions = {}) {
  const { pageSize = DEFAULT_PAGE_SIZE, initialPage = 1, filters } = options;

  const [page, setPage] = React.useState<number>(initialPage);
  const [transactions, setTransactions] = React.useState<TransactionRecord[]>([]);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalCount, setTotalCount] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setPage(1);
  }, [pageSize]);

  const effectivePage = Math.max(1, Math.min(page, totalPages || 1));

  React.useEffect(() => {
    let isMounted = true;

    const _fetchTransactions = async () => {
      setError(null);

      try {
        const response = await listTransactions({
          page: effectivePage,
          pageSize,
          category: filters?.category,
          dateFrom: filters?.dateFrom,
          dateTo: filters?.dateTo,
        });

        if (!isMounted) {
          return;
        }

        setTransactions(response.data);
        setTotalPages(response.meta.totalPages || 1);
        setTotalCount(response.meta.total);
      } catch (err) {
        if (!isMounted) {
          return;
        }

        setTransactions([]);
        setTotalPages(1);
        setTotalCount(0);
        setError(err instanceof Error ? err.message : "Unable to load transactions.");
      }
    };

    void _fetchTransactions();

    return () => {
      isMounted = false;
    };
  }, [effectivePage, filters?.category, filters?.dateFrom, filters?.dateTo, pageSize]);

  const currentPage = Math.min(page, totalPages);
  const pageItems = React.useMemo(() => transactions, [transactions]);
  const reset = React.useCallback(() => setPage(1), []);

  return {
    setPage,
    currentPage,
    totalPages,
    totalCount,
    pageItems,
    pageSize,
    reset,
    transactions,
    error,
  } as const;
}
