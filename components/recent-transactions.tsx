import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  categories,
  formatCurrency,
  recentTransactions,
} from "@/lib/finance-data";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function RecentTransactions() {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your last 5 purchases</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col">
          {recentTransactions.map((tx, i) => {
            const category = categories[tx.category];
            const Icon = category.icon;
            return (
              <li
                key={tx.id}
                className={`flex items-center gap-4 py-4 ${
                  i !== 0 ? "border-t border-border" : ""
                }`}
              >
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: `color-mix(in oklch, ${category.color} 14%, transparent)`,
                    color: category.color,
                  }}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </span>

                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate font-medium text-foreground">
                    {tx.description}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {category.label} &middot; {formatDate(tx.date)}
                  </span>
                </div>

                <span className="shrink-0 text-right font-semibold tabular-nums text-foreground">
                  -{formatCurrency(tx.amount, { maximumFractionDigits: 2 })}
                </span>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
