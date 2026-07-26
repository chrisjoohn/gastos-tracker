"use client"

import * as React from "react"
import type { DateRange } from "react-day-picker"
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  X,
} from "lucide-react"

import {
  allTransactions,
  categories,
  categoryOptions,
  formatCurrency,
  type CategoryKey,
  type Transaction,
} from "@/lib/finance-data"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { CategoryBadge } from "@/components/category-badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  TransactionDialog,
  type TransactionDraft,
} from "@/components/transaction-dialog"
import { TransactionsEmptyState } from "@/components/transactions-empty-state"

const PAGE_SIZE = 8

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default function TransactionsPage() {
  const [transactions, setTransactions] =
    React.useState<Transaction[]>(allTransactions)
  const [categoryFilter, setCategoryFilter] = React.useState<
    CategoryKey | "all"
  >("all")
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>()
  const [page, setPage] = React.useState(1)

  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Transaction | null>(null)

  const filtered = React.useMemo(() => {
    return transactions
      .filter((tx) =>
        categoryFilter === "all" ? true : tx.category === categoryFilter,
      )
      .filter((tx) => {
        if (!dateRange?.from) return true
        const d = new Date(tx.date)
        const from = new Date(dateRange.from)
        from.setHours(0, 0, 0, 0)
        const to = dateRange.to ? new Date(dateRange.to) : from
        to.setHours(23, 59, 59, 999)
        return d >= from && d <= to
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1))
  }, [transactions, categoryFilter, dateRange])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )

  // Reset to first page whenever filters change.
  React.useEffect(() => {
    setPage(1)
  }, [categoryFilter, dateRange])

  const hasActiveFilters = categoryFilter !== "all" || dateRange?.from

  function openAdd() {
    setEditing(null)
    setDialogOpen(true)
  }

  function openEdit(tx: Transaction) {
    setEditing(tx)
    setDialogOpen(true)
  }

  function handleSave(draft: TransactionDraft, id: string | null) {
    const amount = Number.parseFloat(draft.amount)
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
      )
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
      ])
    }
  }

  function clearFilters() {
    setCategoryFilter("all")
    setDateRange(undefined)
  }

  const dateLabel = dateRange?.from
    ? dateRange.to
      ? `${formatDate(dateRange.from.toISOString())} – ${formatDate(dateRange.to.toISOString())}`
      : formatDate(dateRange.from.toISOString())
    : "Date range"

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
                  const cat = categories[key]
                  const Icon = cat.icon
                  return (
                    <SelectItem key={key} value={key}>
                      <Icon className="size-4 text-muted-foreground" />
                      {cat.label}
                    </SelectItem>
                  )
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
          <>
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="w-10" aria-label="Actions" />
                  </TableRow>
                </TableHeader>
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
                          onClick={() => openEdit(tx)}
                          aria-label={`Edit ${tx.description}`}
                        >
                          <Pencil className="size-4" aria-hidden="true" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {(currentPage - 1) * PAGE_SIZE + 1}–
                  {Math.min(currentPage * PAGE_SIZE, filtered.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {filtered.length}
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
            </div>
          </>
        )}
      </div>

      <TransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        transaction={editing}
        onSave={handleSave}
      />
    </main>
  )
}
