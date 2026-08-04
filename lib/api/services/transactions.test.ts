import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createTransaction,
  deleteTransaction,
  listTransactions,
  updateTransaction,
} from "./transactions";

describe("transactions api service", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockReset();
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({ data: [], meta: { page: 1, pageSize: 10, total: 0, totalPages: 0 } }),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("lists transactions with query params", async () => {
    await listTransactions({ page: 2, pageSize: 5, category: "food" });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3001/api/transactions?page=2&pageSize=5&category=food",
      expect.objectContaining({
        method: "GET",
        headers: expect.any(Headers),
      }),
    );
  });

  it("creates a transaction", async () => {
    await createTransaction({
      description: "Coffee",
      category: "food",
      date: "2026-08-04",
      amount: 4.5,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3001/api/transactions",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          description: "Coffee",
          category: "food",
          date: "2026-08-04",
          amount: 4.5,
        }),
      }),
    );
  });

  it("updates and deletes transactions", async () => {
    await updateTransaction("tx_123", {
      description: "Updated coffee",
      category: "food",
      date: "2026-08-04",
      amount: 5.5,
    });
    await deleteTransaction("tx_123");

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "http://localhost:3001/api/transactions/tx_123",
      expect.objectContaining({
        method: "PATCH",
      }),
    );

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "http://localhost:3001/api/transactions/tx_123",
      expect.objectContaining({
        method: "DELETE",
      }),
    );
  });
});
