import { Wallet, TrendingUp, Receipt } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  categories,
  formatCurrency,
  topCategory,
  totalSpent,
  transactionCount,
} from "@/lib/finance-data";
import type { LucideIcon } from "lucide-react";

type SummaryCardProps = {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
};

function SummaryCard({ label, value, hint, icon: Icon }: SummaryCardProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex items-start justify-between gap-4 p-6">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-3xl font-semibold tracking-tight text-foreground text-balance">
            {value}
          </p>
          <p className="text-sm text-muted-foreground">{hint}</p>
        </div>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-chart-1/10 text-chart-1">
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </CardContent>
    </Card>
  );
}

export function SummaryCards() {
  const top = categories[topCategory.category];

  return (
    <section
      aria-label="Monthly summary"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      <SummaryCard
        label="Total Spent This Month"
        value={formatCurrency(totalSpent)}
        hint="Across all categories"
        icon={Wallet}
      />
      <SummaryCard
        label="Top Category"
        value={top.label}
        hint={`${formatCurrency(topCategory.amount)} spent`}
        icon={TrendingUp}
      />
      <SummaryCard
        label="Transactions This Month"
        value={String(transactionCount)}
        hint="Purchases recorded"
        icon={Receipt}
      />
    </section>
  );
}
