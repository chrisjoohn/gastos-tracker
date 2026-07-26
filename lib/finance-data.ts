import {
  UtensilsCrossed,
  ShoppingBag,
  Car,
  Home,
  Clapperboard,
  HeartPulse,
  Zap,
  Wallet,
  type LucideIcon,
} from "lucide-react"

export type CategoryKey =
  | "food"
  | "shopping"
  | "transport"
  | "housing"
  | "entertainment"
  | "health"
  | "utilities"
  | "other"

export type Category = {
  key: CategoryKey
  label: string
  icon: LucideIcon
  /** chart token index 1-5 */
  color: string
}

export const categories: Record<CategoryKey, Category> = {
  food: { key: "food", label: "Food", icon: UtensilsCrossed, color: "var(--chart-1)" },
  transport: { key: "transport", label: "Transport", icon: Car, color: "var(--chart-3)" },
  utilities: { key: "utilities", label: "Utilities", icon: Zap, color: "var(--chart-4)" },
  entertainment: { key: "entertainment", label: "Entertainment", icon: Clapperboard, color: "var(--chart-5)" },
  shopping: { key: "shopping", label: "Shopping", icon: ShoppingBag, color: "var(--chart-2)" },
  health: { key: "health", label: "Health", icon: HeartPulse, color: "var(--chart-2)" },
  housing: { key: "housing", label: "Housing", icon: Home, color: "var(--chart-4)" },
  other: { key: "other", label: "Other", icon: Wallet, color: "var(--chart-3)" },
}

/** Category options for the add/edit form, in the requested order. */
export const categoryOptions: CategoryKey[] = [
  "food",
  "transport",
  "utilities",
  "entertainment",
  "shopping",
  "health",
  "other",
]

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

// Full transaction ledger used by the Transactions page.
export const allTransactions: Transaction[] = [
  { id: "t1", description: "Whole Foods Market", category: "food", date: "2026-07-25", amount: 86.42 },
  { id: "t2", description: "Uber ride to downtown", category: "transport", date: "2026-07-24", amount: 18.9 },
  { id: "t3", description: "Nike Store — running shoes", category: "shopping", date: "2026-07-23", amount: 129.0 },
  { id: "t4", description: "Netflix subscription", category: "entertainment", date: "2026-07-22", amount: 15.49 },
  { id: "t5", description: "City Pharmacy", category: "health", date: "2026-07-21", amount: 42.15 },
  { id: "t6", description: "Pacific Gas & Electric", category: "utilities", date: "2026-07-20", amount: 112.30 },
  { id: "t7", description: "Chipotle lunch", category: "food", date: "2026-07-19", amount: 13.75 },
  { id: "t8", description: "Spotify Premium", category: "entertainment", date: "2026-07-18", amount: 10.99 },
  { id: "t9", description: "Shell gas station", category: "transport", date: "2026-07-17", amount: 54.20 },
  { id: "t10", description: "Amazon — desk lamp", category: "shopping", date: "2026-07-16", amount: 39.99 },
  { id: "t11", description: "Rent payment", category: "housing", date: "2026-07-15", amount: 1450.0 },
  { id: "t12", description: "Trader Joe's groceries", category: "food", date: "2026-07-14", amount: 67.83 },
  { id: "t13", description: "Internet bill — Xfinity", category: "utilities", date: "2026-07-13", amount: 79.99 },
  { id: "t14", description: "Movie tickets", category: "entertainment", date: "2026-07-12", amount: 32.0 },
  { id: "t15", description: "Dental checkup copay", category: "health", date: "2026-07-11", amount: 60.0 },
  { id: "t16", description: "Lyft to airport", category: "transport", date: "2026-07-10", amount: 41.5 },
  { id: "t17", description: "Zara — summer jacket", category: "shopping", date: "2026-07-09", amount: 89.9 },
  { id: "t18", description: "Coffee — Blue Bottle", category: "food", date: "2026-07-08", amount: 6.25 },
  { id: "t19", description: "Water & sewer bill", category: "utilities", date: "2026-07-07", amount: 44.10 },
  { id: "t20", description: "Steam game purchase", category: "entertainment", date: "2026-07-06", amount: 24.99 },
  { id: "t21", description: "Gym membership", category: "health", date: "2026-07-05", amount: 35.0 },
  { id: "t22", description: "Parking garage", category: "transport", date: "2026-07-04", amount: 18.0 },
  { id: "t23", description: "Miscellaneous ATM fee", category: "other", date: "2026-07-03", amount: 3.5 },
  { id: "t24", description: "Costco run", category: "food", date: "2026-07-02", amount: 154.72 },
  { id: "t25", description: "Birthday gift", category: "other", date: "2026-07-01", amount: 75.0 },
]

export function formatCurrency(value: number, opts?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    ...opts,
  }).format(value)
}
