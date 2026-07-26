"use client"

import { useEffect, useRef, useState } from "react"
import { Send } from "lucide-react"
import {
  assistantGreeting,
  getMockReply,
  suggestedPrompts,
  type ChatMessage as ChatMessageType,
} from "@/lib/chat-data"
import { ChatMessage } from "@/components/chat-message"
import { ChatTypingIndicator } from "@/components/chat-typing-indicator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessageType[]>([assistantGreeting])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const replyTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Only the opening greeting means we're still in the empty state.
  const isEmptyState = messages.length === 1

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [messages, isTyping])

  useEffect(() => {
    return () => {
      if (replyTimeout.current) clearTimeout(replyTimeout.current)
    }
  }, [])

  function sendMessage(text: string) {
    const trimmed = text.trim()
    if (!trimmed || isTyping) return

    const userMessage: ChatMessageType = {
      id: `u-${Date.now()}`,
      role: "user",
      content: trimmed,
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    replyTimeout.current = setTimeout(() => {
      const assistantMessage: ChatMessageType = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: getMockReply(trimmed),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1200)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    sendMessage(input)
  }

  function handleChipClick(prompt: string) {
    setInput(prompt)
    inputRef.current?.focus()
  }

  return (
    <main className="flex h-screen flex-col bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-2xl items-center gap-3 px-4 py-4">
          <div className="flex flex-col">
            <h1 className="text-base font-semibold tracking-tight text-foreground">
              Budgeting Assistant
            </h1>
            <p className="text-xs text-muted-foreground">
              Ask about your spending and savings
            </p>
          </div>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-6">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isTyping && <ChatTypingIndicator />}

          {isEmptyState && !isTyping && (
            <div className="mt-2 flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleChipClick(prompt)}
                  className="rounded-full border border-border bg-card px-3.5 py-1.5 text-sm text-muted-foreground shadow-sm transition-colors hover:border-transparent hover:bg-muted hover:text-foreground"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-border bg-background">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex w-full max-w-2xl items-center gap-2 px-4 py-4"
        >
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message your budgeting assistant..."
            className="h-11 flex-1 rounded-full px-4"
            aria-label="Message"
          />
          <Button
            type="submit"
            size="icon"
            className="size-11 shrink-0 rounded-full"
            disabled={!input.trim() || isTyping}
            aria-label="Send message"
          >
            <Send className="size-4" />
          </Button>
        </form>
      </div>
    </main>
  )
}
