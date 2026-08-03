import * as React from "react";
import { type Transaction } from "@/lib/finance-data";

const DEFAULT_PAGE_SIZE = 8;

export type UseTransactionsTableOptions = {
  pageSize?: number;
  initialPage?: number;
};

export function useTransactionsTable(
  transactions: Transaction[],
  options: UseTransactionsTableOptions = {},
) {
  const { pageSize = DEFAULT_PAGE_SIZE, initialPage = 1 } = options;
  const [page, setPage] = React.useState<number>(initialPage);

  React.useEffect(() => {
    setPage(1);
  }, [transactions, pageSize]);

  const totalPages = Math.max(1, Math.ceil(transactions.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const pageItems = React.useMemo(
    () => transactions.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [transactions, currentPage, pageSize],
  );

  const reset = React.useCallback(() => setPage(1), []);

  return {
    page,
    setPage,
    currentPage,
    totalPages,
    pageItems,
    pageSize,
    reset,
  } as const;
}
