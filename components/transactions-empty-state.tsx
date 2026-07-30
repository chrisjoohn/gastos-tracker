import { Plus, ReceiptText } from "lucide-react";

import { Button } from "@/components/ui/button";

export function TransactionsEmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
      <div
        className="flex size-16 items-center justify-center rounded-full bg-muted"
        aria-hidden="true"
      >
        <ReceiptText className="size-8 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-foreground">
          No transactions yet
        </h2>
        <p className="max-w-xs text-sm text-muted-foreground text-pretty">
          Start tracking your spending by adding your first transaction.
        </p>
      </div>
      <Button onClick={onAdd} className="rounded-full">
        <Plus className="size-4" aria-hidden="true" />
        Add Transaction
      </Button>
    </div>
  );
}
