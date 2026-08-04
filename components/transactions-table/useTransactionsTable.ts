import * as React from "react";
import { allTransactions } from "@/lib/finance-data";

const DEFAULT_PAGE_SIZE = 8;

export type UseTransactionsTableOptions = {
  pageSize?: number;
  initialPage?: number;
};

export function useTransactionsTable(
  options: UseTransactionsTableOptions = {},
) {
  const { pageSize = DEFAULT_PAGE_SIZE, initialPage = 1 } = options;
  const [page, setPage] = React.useState<number>(initialPage);

  React.useEffect(() => {
    setPage(1);
  }, [pageSize]);

  const totalPages = Math.max(1, Math.ceil(allTransactions.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const pageItems = React.useMemo(
    () =>
      allTransactions.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize,
      ),
    [currentPage, pageSize],
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
    transactions: allTransactions,
  } as const;
}
