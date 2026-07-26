import {
  UtensilsCrossed,
  ShoppingBag,
  Car,
  Home,
  Clapperboard,
  HeartPulse,
  type LucideIcon,
} from "lucide-react"

export type CategoryKey =
  | "food"
  | "shopping"
  | "transport"
  | "housing"
  | "entertainment"
  | "health"

export type Category = {
  key: CategoryKey
  label: string
  icon: LucideIcon
  /** chart token index 1-5 */
  color: string
}

export const categories: Record<CategoryKey, Category> = {
  food: { key: "food", label: "Food & Dining", icon: UtensilsCrossed, color: "var(--chart-1)" },
  shopping: { key: "shopping", label: "Shopping", icon: ShoppingBag, color: "var(--chart-2)" },
  transport: { key: "transport", label: "Transport", icon: Car, color: "var(--chart-3)" },
  housing: { key: "housing", label: "Housing", icon: Home, color: "var(--chart-4)" },
  entertainment: { key: "entertainment", label: "Entertainment", icon: Clapperboard, color: "var(--chart-5)" },
  health: { key: "health", label: "Health", icon: HeartPulse, color: "var(--chart-2)" },
}

export type Transaction = {
  id: string
  description: string
  category: CategoryKey
  date: string // ISO
  amount: number
}

// Spending grouped by category (this month)
export const spendingByCategory: { category: CategoryKey; amount: number }[] = [
  { category: "housing", amount: 1450 },
  { category: "food", amount: 742 },
  { category: "shopping", amount: 528 },
  { category: "transport", amount: 316 },
  { category: "entertainment", amount: 214 },
  { category: "health", amount: 138 },
]

export const totalSpent = spendingByCategory.reduce((sum, c) => sum + c.amount, 0)

export const topCategory = [...spendingByCategory].sort((a, b) => b.amount - a.amount)[0]

// Daily spending over the last 30 days
function buildDailySpending() {
  const days: { date: string; amount: number }[] = []
  const today = new Date()
  const seed = [
    62, 40, 18, 95, 120, 34, 0, 58, 210, 44, 27, 80, 66, 12, 150, 39, 0, 74,
    132, 48, 22, 96, 58, 0, 180, 41, 63, 29, 110, 52,
  ]
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    days.push({
      date: d.toISOString().slice(0, 10),
      amount: seed[29 - i] ?? 50,
    })
  }
  return days
}

export const dailySpending = buildDailySpending()

export const transactionCount = 87

export const recentTransactions: Transaction[] = [
  {
    id: "t1",
    description: "Whole Foods Market",
    category: "food",
    date: "2026-07-25",
    amount: 86.42,
  },
  {
    id: "t2",
    description: "Uber ride to downtown",
    category: "transport",
    date: "2026-07-24",
    amount: 18.9,
  },
  {
    id: "t3",
    description: "Nike Store — running shoes",
    category: "shopping",
    date: "2026-07-23",
    amount: 129.0,
  },
  {
    id: "t4",
    description: "Netflix subscription",
    category: "entertainment",
    date: "2026-07-22",
    amount: 15.49,
  },
  {
    id: "t5",
    description: "City Pharmacy",
    category: "health",
    date: "2026-07-21",
    amount: 42.15,
  },
]

export function formatCurrency(value: number, opts?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    ...opts,
  }).format(value)
}
