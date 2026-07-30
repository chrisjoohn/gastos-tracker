import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SummaryCards } from "@/components/summary-cards";
import { CategoryChart } from "@/components/category-chart";
import { TrendChart } from "@/components/trend-chart";
import { RecentTransactions } from "@/components/recent-transactions";

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <Button className="fixed right-4 top-4 z-50 rounded-full shadow-lg sm:right-6 sm:top-6 lg:right-8">
        <Plus className="size-4" aria-hidden="true" />
        Add Transaction
      </Button>

      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <header className="mb-8 flex flex-col gap-1 pr-40">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">
            Finance Overview
          </h1>
          <p className="text-sm text-muted-foreground">
            Track your spending and stay on budget this month.
          </p>
        </header>

        <div className="flex flex-col gap-6">
          <SummaryCards />

          <div className="grid gap-6 lg:grid-cols-2">
            <CategoryChart />
            <TrendChart />
          </div>

          <RecentTransactions />
        </div>
      </div>
    </main>
  );
}
