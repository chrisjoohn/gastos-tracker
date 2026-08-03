import type { Meta, StoryObj } from "@storybook/react";
import ChatPage from "./page";

const meta = {
  title: "Pages/Chat",
  component: ChatPage,
} satisfies Meta<typeof ChatPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
