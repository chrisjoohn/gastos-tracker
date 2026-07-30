"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CategoryBadge } from "@/components/category-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, type Transaction } from "@/lib/finance-data";
import { useTransactionsTable } from "./useTransactionsTable";

export type TransactionsTableProps = {
  transactions: Transaction[];
  pageSize?: number;
  onEdit?: (transaction: Transaction) => void;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function TransactionsTable({
  transactions,
  pageSize,
  onEdit,
}: TransactionsTableProps) {

  const {
    currentPage,
    totalPages,
    pageItems,
    setPage,
    pageSize: resolvedPageSize,
  } = useTransactionsTable(transactions, { pageSize });

  if (transactions.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm p-8 text-center text-sm text-muted-foreground">
        No transactions available.
      </div>
    );
  }

  function _renderTableHeader() {
    return (
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Category</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="w-10" aria-label="Actions" />
        </TableRow>
      </TableHeader>
    );
  }

  function _renderTableBody() {
    return (
      <TableBody>
        {pageItems.map((tx) => (
          <TableRow key={tx.id} className="group">
            <TableCell>
              <CategoryBadge category={tx.category} />
            </TableCell>
            <TableCell className="font-medium text-foreground">
              {tx.description}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {formatDate(tx.date)}
            </TableCell>
            <TableCell className="text-right font-semibold tabular-nums text-destructive">
              -{formatCurrency(tx.amount, { maximumFractionDigits: 2 })}
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                onClick={() => onEdit?.(tx)}
                aria-label={`Edit ${tx.description}`}
              >
                <Pencil className="size-4" aria-hidden="true" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  }

  function _renderPagination() {
    return (
      <>
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">
            {(currentPage - 1) * resolvedPageSize + 1}–
            {Math.min(currentPage * resolvedPageSize, transactions.length)}
          </span>{" "}
          of{" "}
          <span className="font-medium text-foreground">
            {transactions.length}
          </span>
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </Button>
          <span className="text-sm tabular-nums text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <Table>
          {_renderTableHeader()}
          {_renderTableBody()}
        </Table>
      </div>
      <div className="mt-4 flex items-center justify-between gap-4">
        {_renderPagination()}
      </div>
    </>
  );
}
