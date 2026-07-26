"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { dailySpending, formatCurrency } from "@/lib/finance-data"

const chartConfig = {
  amount: {
    label: "Spent",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const chartData = dailySpending.map((d) => ({
  date: d.date,
  amount: d.amount,
}))

function formatDay(value: string) {
  const d = new Date(value)
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function TrendChart() {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Spending Over Time</CardTitle>
        <CardDescription>Last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[260px] w-full">
          <AreaChart data={chartData} margin={{ left: 4, right: 12, top: 8 }}>
            <defs>
              <linearGradient id="fillAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-amount)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-amount)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={28}
              tickFormatter={formatDay}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={44}
              tickFormatter={(v) => formatCurrency(Number(v))}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => formatDay(String(value))}
                  formatter={(value) => [formatCurrency(Number(value)), " Spent"]}
                />
              }
            />
            <Area
              dataKey="amount"
              type="monotone"
              fill="url(#fillAmount)"
              stroke="var(--color-amount)"
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
