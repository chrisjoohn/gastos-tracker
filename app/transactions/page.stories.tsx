import type { Meta, StoryObj } from "@storybook/react";
import TransactionsPage from "./page";

const meta = {
  title: "Pages/Transactions",
  component: TransactionsPage,
} satisfies Meta<typeof TransactionsPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
