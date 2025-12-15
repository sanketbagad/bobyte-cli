"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Send, Loader2, Bot, User, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

/* eslint-disable @typescript-eslint/no-explicit-any */

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt: Date
}

interface ChatInterfaceProps {
  conversationId: string
  initialMessages?: Message[]
  onNewMessage?: (message: Message) => void
}

export function ChatInterface({ conversationId, initialMessages = [], onNewMessage }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      createdAt: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch(`/api/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId,
          message: userMessage.content,
        }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ""

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        createdAt: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split("\n")

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6))
                
                if (data.type === "chunk") {
                  assistantContent += data.content
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessage.id
                        ? { ...msg, content: assistantContent }
                        : msg
                    )
                  )
                } else if (data.type === "done") {
                  if (onNewMessage) {
                    onNewMessage({ ...assistantMessage, content: assistantContent })
                  }
                } else if (data.type === "error") {
                  throw new Error(data.error)
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error)
      setMessages((prev) =>
        prev.slice(0, -1).concat({
          id: Date.now().toString(),
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          createdAt: new Date(),
        })
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-6 max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-linear-to-r from-indigo-500 to-purple-500 rounded-full blur-xl opacity-30 animate-pulse" />
                <div className="relative bg-zinc-900 border border-zinc-800 rounded-full p-6">
                  <Sparkles className="w-12 h-12 text-indigo-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Start a Conversation</h3>
              <p className="text-zinc-400 max-w-md">
                Ask me anything! I can help with code, explanations, problem-solving, and much more.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-4 animate-in fade-in-0 slide-in-from-bottom-4",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <div className="shrink-0 mt-1">
                    <div className="relative">
                      <div className="absolute inset-0 bg-linear-to-r from-indigo-500 to-purple-500 rounded-lg blur-md opacity-50" />
                      <div className="relative bg-zinc-900 border border-zinc-800 rounded-lg p-2">
                        <Bot className="w-5 h-5 text-indigo-400" />
                      </div>
                    </div>
                  </div>
                )}

                <Card
                  className={cn(
                    "max-w-[80%] px-4 py-3",
                    message.role === "user"
                      ? "bg-indigo-600 border-indigo-500 text-white"
                      : "bg-zinc-800/80 border-zinc-700 text-zinc-100"
                  )}
                >
                  <div className="prose prose-invert max-w-none">
                    {message.role === "assistant" ? (
                      <ReactMarkdown
                        components={{
                          code(props: any) {
                            const { node, inline, className, children, ...rest } = props
                            const match = /language-(\w+)/.exec(className || "")
                            return !inline && match ? (
                              <SyntaxHighlighter
                                style={vscDarkPlus as any}
                                language={match[1]}
                                PreTag="div"
                                {...rest}
                              >
                                {String(children).replace(/\n$/, "")}
                              </SyntaxHighlighter>
                            ) : (
                              <code className={cn("bg-zinc-800 px-1.5 py-0.5 rounded text-sm", className)} {...rest}>
                                {children}
                              </code>
                            )
                          },
                          p: ({ children }: any) => <p className="mb-2 last:mb-0">{children}</p>,
                          ul: ({ children }: any) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                          ol: ({ children }: any) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                          li: ({ children }: any) => <li className="mb-1">{children}</li>,
                          h1: ({ children }: any) => <h1 className="text-xl font-bold mb-2">{children}</h1>,
                          h2: ({ children }: any) => <h2 className="text-lg font-bold mb-2">{children}</h2>,
                          h3: ({ children }: any) => <h3 className="text-base font-bold mb-2">{children}</h3>,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>
                </Card>

                {message.role === "user" && (
                  <div className="shrink-0 mt-1">
                    <div className="bg-indigo-600 border border-indigo-500 rounded-lg p-2">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex gap-4 justify-start animate-in fade-in-0">
              <div className="shrink-0 mt-1">
                <div className="relative">
                  <div className="absolute inset-0 bg-linear-to-r from-indigo-500 to-purple-500 rounded-lg blur-md opacity-50 animate-pulse" />
                  <div className="relative bg-zinc-900 border border-zinc-800 rounded-lg p-2">
                    <Bot className="w-5 h-5 text-indigo-400" />
                  </div>
                </div>
              </div>
              <Card className="bg-zinc-900 border-zinc-800 px-4 py-3">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-zinc-800 bg-zinc-950/50 p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="relative flex items-end gap-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Shift+Enter for new line)"
              className="min-h-[60px] max-h-[200px] resize-none bg-zinc-900 border-zinc-800 focus-visible:ring-indigo-500"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
              className="h-[60px] w-[60px] bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
          <p className="text-xs text-zinc-500 mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </form>
      </div>
    </div>
  )
}
