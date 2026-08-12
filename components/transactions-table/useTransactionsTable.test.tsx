// @vitest-environment jsdom

import * as React from "react";
import { act } from "react-dom/test-utils";
import { createRoot } from "react-dom/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { TransactionRecord } from "@/lib/api/types";
import { useTransactionsTable } from "./useTransactionsTable";

const listTransactionsMock = vi.fn();

vi.mock("@/lib/api/services/transactions", () => ({
  listTransactions: (...args: unknown[]) => listTransactionsMock(...args),
}));

describe("useTransactionsTable", () => {
  beforeEach(() => {
    listTransactionsMock.mockReset();
  });

  it("loads transactions from the api service", async () => {
    const transactions: TransactionRecord[] = [
      {
        id: "tx_1",
        description: "Coffee",
        category: "food",
        date: "2026-08-04",
        amount: 4.5,
      },
    ];

    listTransactionsMock.mockResolvedValue({
      data: transactions,
      meta: { page: 1, pageSize: 8, total: 1, totalPages: 1 },
    });

    let latestResult: ReturnType<typeof useTransactionsTable> | undefined;

    function HookProbe() {
      latestResult = useTransactionsTable({ pageSize: 8 });
      return null;
    }

    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    await act(async () => {
      root.render(React.createElement(HookProbe));
      await Promise.resolve();
    });

    expect(listTransactionsMock).toHaveBeenCalledWith({ page: 1, pageSize: 8 });
    expect(latestResult?.transactions).toHaveLength(1);
    expect(latestResult?.transactions[0]).toMatchObject({
      id: "tx_1",
      description: "Coffee",
    });

    root.unmount();
    container.remove();
  });
});
