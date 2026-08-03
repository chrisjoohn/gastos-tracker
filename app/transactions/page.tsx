"use client";

import * as React from "react";
import type { DateRange } from "react-day-picker";
import { CalendarIcon, Plus, X } from "lucide-react";

import {
  allTransactions,
  categories,
  categoryOptions,
  type CategoryKey,
  type Transaction,
} from "@/lib/finance-data";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TransactionsTable from "@/components/transactions-table";
import {
  TransactionDialog,
  type TransactionDraft,
} from "@/components/transaction-dialog";
import { TransactionsEmptyState } from "@/components/transactions-empty-state";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function TransactionsPage() {
  const [transactions, setTransactions] =
    React.useState<Transaction[]>(allTransactions);
  const [categoryFilter, setCategoryFilter] = React.useState<
    CategoryKey | "all"
  >("all");
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Transaction | null>(null);

  const filtered = React.useMemo(() => {
    return transactions
      .filter((tx) =>
        categoryFilter === "all" ? true : tx.category === categoryFilter,
      )
      .filter((tx) => {
        if (!dateRange?.from) return true;
        const d = new Date(tx.date);
        const from = new Date(dateRange.from);
        from.setHours(0, 0, 0, 0);
        const to = dateRange.to ? new Date(dateRange.to) : from;
        to.setHours(23, 59, 59, 999);
        return d >= from && d <= to;
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [transactions, categoryFilter, dateRange]);

  const hasActiveFilters = categoryFilter !== "all" || dateRange?.from;

  function openAdd() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(tx: Transaction) {
    setEditing(tx);
    setDialogOpen(true);
  }

  function handleSave(draft: TransactionDraft, id: string | null) {
    const amount = Number.parseFloat(draft.amount);
    if (id) {
      setTransactions((prev) =>
        prev.map((tx) =>
          tx.id === id
            ? {
                ...tx,
                amount,
                category: draft.category,
                date: draft.date,
                description: draft.note.trim(),
              }
            : tx,
        ),
      );
    } else {
      setTransactions((prev) => [
        {
          id: `t${Date.now()}`,
          amount,
          category: draft.category,
          date: draft.date,
          description: draft.note.trim(),
        },
        ...prev,
      ]);
    }
  }

  function clearFilters() {
    setCategoryFilter("all");
    setDateRange(undefined);
  }

  const dateLabel = dateRange?.from
    ? dateRange.to
      ? `${formatDate(dateRange.from.toISOString())} – ${formatDate(
          dateRange.to.toISOString(),
        )}`
      : formatDate(dateRange.from.toISOString())
    : "Date range";

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <header className="mb-6 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">
              Transactions
            </h1>
            <Button onClick={openAdd} className="rounded-full shadow-sm">
              <Plus className="size-4" aria-hidden="true" />
              Add Transaction
            </Button>
          </div>

          {/* Filter controls */}
          <div className="flex flex-wrap items-center gap-3">
            <Select
              value={categoryFilter}
              onValueChange={(value) =>
                setCategoryFilter(value as CategoryKey | "all")
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue>
                  {(value: CategoryKey | "all") =>
                    value && value !== "all"
                      ? categories[value].label
                      : "All categories"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categoryOptions.map((key) => {
                  const cat = categories[key];
                  const Icon = cat.icon;
                  return (
                    <SelectItem key={key} value={key}>
                      <Icon className="size-4 text-muted-foreground" />
                      {cat.label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    variant="outline"
                    className="justify-start gap-2 font-normal"
                  />
                }
              >
                <CalendarIcon className="size-4" aria-hidden="true" />
                <span
                  className={dateRange?.from ? "" : "text-muted-foreground"}
                >
                  {dateLabel}
                </span>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={1}
                  autoFocus
                />
              </PopoverContent>
            </Popover>

            {hasActiveFilters ? (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="gap-1.5 text-muted-foreground"
              >
                <X className="size-4" aria-hidden="true" />
                Clear
              </Button>
            ) : null}
          </div>
        </header>

        {filtered.length === 0 ? (
          <TransactionsEmptyState onAdd={openAdd} />
        ) : (
          <TransactionsTable
            transactions={filtered}
            pageSize={8}
            onEdit={openEdit}
          />
        )}
      </div>

      <TransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        transaction={editing}
        onSave={handleSave}
      />
    </main>
  );
}
