import { Sparkles } from "lucide-react";
import type { ChatMessage as ChatMessageType } from "@/lib/chat-data";
import { cn } from "@/lib/utils";

export function ChatMessage({ message }: { message: ChatMessageType }) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex w-full items-end gap-2.5",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      {!isUser && (
        <span
          className="flex size-7 shrink-0 items-center justify-center rounded-full text-primary-foreground"
          style={{ backgroundColor: "var(--chart-1)" }}
          aria-hidden="true"
        >
          <Sparkles className="size-3.5" />
        </span>
      )}

      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed sm:max-w-[70%]",
          isUser
            ? "rounded-br-sm text-primary-foreground"
            : "rounded-bl-sm bg-muted text-foreground",
        )}
        style={isUser ? { backgroundColor: "var(--chart-1)" } : undefined}
      >
        {message.content}
      </div>
    </div>
  );
}
