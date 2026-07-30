"use client";

import { Pie, PieChart, Cell, Label } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  categories,
  formatCurrency,
  spendingByCategory,
} from "@/lib/finance-data";

const chartData = spendingByCategory.map((item) => ({
  key: item.category,
  label: categories[item.category].label,
  amount: item.amount,
  fill: categories[item.category].color,
}));

const chartConfig = spendingByCategory.reduce((config, item) => {
  config[item.category] = {
    label: categories[item.category].label,
    color: categories[item.category].color,
  };
  return config;
}, {} as ChartConfig);

const total = spendingByCategory.reduce((sum, c) => sum + c.amount, 0);

export function CategoryChart() {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
        <CardDescription>This month&apos;s breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-center">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square h-[220px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value, name) => [
                      `${formatCurrency(Number(value))}  `,
                      categories[name as keyof typeof categories]?.label ??
                        name,
                    ]}
                  />
                }
              />
              <Pie
                data={chartData}
                dataKey="amount"
                nameKey="key"
                innerRadius={62}
                outerRadius={90}
                strokeWidth={4}
                paddingAngle={2}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.key} fill={entry.fill} />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-2xl font-semibold"
                          >
                            {formatCurrency(total)}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 22}
                            className="fill-muted-foreground text-xs"
                          >
                            Total
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>

          <ul className="grid w-full grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:flex-1">
            {chartData.map((entry) => (
              <li key={entry.key} className="flex items-center gap-2 text-sm">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: entry.fill }}
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1 truncate text-muted-foreground">
                  {entry.label}
                </span>
                <span className="shrink-0 font-medium tabular-nums text-foreground">
                  {formatCurrency(entry.amount)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
