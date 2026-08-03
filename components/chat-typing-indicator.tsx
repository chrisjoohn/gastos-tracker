import { Sparkles } from "lucide-react";

export function ChatTypingIndicator() {
  return (
    <div className="flex w-full items-end gap-2.5" aria-live="polite">
      <span className="sr-only">Assistant is typing</span>
      <span
        className="flex size-7 shrink-0 items-center justify-center rounded-full text-primary-foreground"
        style={{ backgroundColor: "var(--chart-1)" }}
        aria-hidden="true"
      >
        <Sparkles className="size-3.5" />
      </span>
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-muted px-4 py-3">
        <Dot className="[animation-delay:-0.3s]" />
        <Dot className="[animation-delay:-0.15s]" />
        <Dot />
      </div>
    </div>
  );
}

function Dot({ className }: { className?: string }) {
  return (
    <span
      className={`size-1.5 animate-bounce rounded-full bg-muted-foreground/60 ${className ?? ""}`}
      aria-hidden="true"
    />
  );
}
