import type { Meta, StoryObj } from "@storybook/react";
import { delay, http, HttpResponse } from "msw";

import { mockTransactions } from "@/lib/finance-data";

import TransactionsPage from "./page";

const transactionsUrl = "http://localhost:3001/api/transactions";

const transactionsHandler = http.get(transactionsUrl, async ({ request }) => {
  await delay(500);

  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "8");
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return HttpResponse.json({
    data: mockTransactions.slice(start, end),
    meta: {
      page,
      pageSize,
      total: mockTransactions.length,
      totalPages: Math.ceil(mockTransactions.length / pageSize),
    },
  });
});

const emptyTransactionsHandler = http.get(transactionsUrl, async () => {
  await delay(300);

  return HttpResponse.json({
    data: [],
    meta: {
      page: 1,
      pageSize: 8,
      total: 0,
      totalPages: 0,
    },
  });
});

const meta = {
  title: "Pages/Transactions",
  component: TransactionsPage,
  parameters: {
    msw: {
      handlers: [transactionsHandler],
    },
  },
} satisfies Meta<typeof TransactionsPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [emptyTransactionsHandler],
    },
  },
};
