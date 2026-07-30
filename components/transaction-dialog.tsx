"use client";

import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  categories,
  categoryOptions,
  type CategoryKey,
  type Transaction,
} from "@/lib/finance-data";

export type TransactionDraft = {
  amount: string;
  category: CategoryKey;
  date: string;
  note: string;
};

function toDraft(tx: Transaction | null): TransactionDraft {
  if (!tx) {
    return {
      amount: "",
      category: "food",
      date: new Date().toISOString().slice(0, 10),
      note: "",
    };
  }
  return {
    amount: String(tx.amount),
    category: tx.category,
    date: tx.date,
    note: tx.description,
  };
}

export function TransactionDialog({
  open,
  onOpenChange,
  transaction,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** null = adding a new transaction, otherwise editing */
  transaction: Transaction | null;
  onSave: (draft: TransactionDraft, id: string | null) => void;
}) {
  const [draft, setDraft] = React.useState<TransactionDraft>(() =>
    toDraft(transaction),
  );

  // Re-seed the form whenever the dialog opens for a different transaction.
  React.useEffect(() => {
    if (open) setDraft(toDraft(transaction));
  }, [open, transaction]);

  const isEditing = transaction !== null;
  const amountNum = Number.parseFloat(draft.amount);
  const isValid =
    Number.isFinite(amountNum) && amountNum > 0 && draft.note.trim().length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    onSave(draft, transaction?.id ?? null);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit transaction" : "Add transaction"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the details of this transaction."
                : "Record a new expense in your ledger."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  $
                </span>
                <Input
                  id="amount"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="pl-7"
                  value={draft.amount}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, amount: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={draft.category}
                onValueChange={(value) =>
                  setDraft((d) => ({ ...d, category: value as CategoryKey }))
                }
              >
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="Select a category">
                    {(value: CategoryKey | null) =>
                      value ? categories[value].label : "Select a category"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
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
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={draft.date}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, date: e.target.value }))
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="note">Note</Label>
              <Input
                id="note"
                placeholder="e.g. Grocery shopping"
                value={draft.note}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, note: e.target.value }))
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
