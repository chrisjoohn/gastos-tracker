export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

// Suggested prompt chips shown in the empty state.
export const suggestedPrompts: string[] = [
  "Where did I overspend this month?",
  "How much did I spend on food?",
  "Give me a savings tip",
  "Am I on track with my budget?",
];

// A short canned greeting the assistant opens with.
export const assistantGreeting: ChatMessage = {
  id: "greeting",
  role: "assistant",
  content:
    "Hi, I'm your budgeting assistant. Ask me anything about your spending, categories, or savings goals this month.",
};

// Canned responses keyed loosely to the suggested prompts. Falls back to a
// generic reply for anything else. Mock data only for now.
const cannedResponses: { match: RegExp; reply: string }[] = [
  {
    match: /overspend|over budget|over my budget/i,
    reply:
      "This month you went over budget in two categories: Shopping is $129 above your $250 target, and Entertainment is $38 over. Dining and Transport are both comfortably under.",
  },
  {
    match: /food|dining|groceries|eat/i,
    reply:
      "You've spent $328.97 on Food so far this month across 5 transactions. That's about 12% higher than your monthly average of $293.",
  },
  {
    match: /savings tip|save money|saving|tip/i,
    reply:
      "Here's a quick one: your recurring subscriptions add up to $52 a month. Cancelling the two you haven't used in 30 days would save roughly $624 a year.",
  },
  {
    match: /on track|budget|track/i,
    reply:
      "You're at 68% of your total monthly budget with 6 days left. At your current pace you'll finish around $180 under budget — nicely on track.",
  },
];

export function getMockReply(userText: string): string {
  const hit = cannedResponses.find((r) => r.match.test(userText));
  if (hit) return hit.reply;
  return "I can help with that. Based on your recent activity, your spending looks steady this month. Try asking about a specific category like Food or Transport for a detailed breakdown.";
}
