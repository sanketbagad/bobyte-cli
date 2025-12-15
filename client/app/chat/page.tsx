"use client"

import { useState, useEffect } from "react"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { ChatInterface } from "@/components/chat-interface"
import { ConversationList } from "@/components/conversation-list"
import { Button } from "@/components/ui/button"
import { Loader2, Menu, X, LogOut, Home, Sparkles } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function ChatPage() {
  const { data, isPending } = authClient.useSession()
  const router = useRouter()
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isCreatingConversation, setIsCreatingConversation] = useState(false)

  useEffect(() => {
    if (!isPending && (!data?.session || !data?.user)) {
      router.push("/sign-in")
    }
  }, [data, isPending, router])

  useEffect(() => {
    // Create initial conversation when user loads the page
    if (data?.user && !currentConversationId && !isCreatingConversation) {
      createNewConversation()
    }
  }, [data?.user, currentConversationId])

  const createNewConversation = async () => {
    if (!data?.user?.id || isCreatingConversation) return

    try {
      setIsCreatingConversation(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/conversations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: data.user.id,
          mode: "chat",
          title: "New conversation",
        }),
      })
      const result = await response.json()
      if (result.success) {
        setCurrentConversationId(result.data.id)
        setIsSidebarOpen(false)
      }
    } catch (error) {
      console.error("Error creating conversation:", error)
    } finally {
      setIsCreatingConversation(false)
    }
  }

  const handleLogout = async () => {
    await authClient.signOut()
    router.push("/sign-in")
  }

  if (isPending || !data?.user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-zinc-950 via-zinc-900 to-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-r from-indigo-500 to-purple-500 rounded-2xl blur-xl opacity-50 animate-pulse" />
            <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <Sparkles className="w-10 h-10 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-linear-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0 bg-zinc-950 border-zinc-800">
                <ConversationList
                  userId={data.user.id}
                  currentConversationId={currentConversationId || undefined}
                  onSelectConversation={setCurrentConversationId}
                  onNewConversation={createNewConversation}
                />
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-r from-indigo-500 to-purple-500 rounded-lg blur-md opacity-50" />
                <div className="relative bg-zinc-900 border border-zinc-800 rounded-lg p-2">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Botbyte AI</h1>
                <p className="text-xs text-zinc-500">Chat Dashboard</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
              className="text-zinc-400 hover:text-white"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-zinc-400 hover:text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-80 border-r border-zinc-800 bg-zinc-950/50">
          <ConversationList
            userId={data.user.id}
            currentConversationId={currentConversationId || undefined}
            onSelectConversation={setCurrentConversationId}
            onNewConversation={createNewConversation}
          />
        </aside>

        {/* Chat Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {currentConversationId ? (
            <ChatInterface
              key={currentConversationId}
              conversationId={currentConversationId}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="relative mb-6 inline-block">
                  <div className="absolute inset-0 bg-linear-to-r from-indigo-500 to-purple-500 rounded-full blur-xl opacity-30 animate-pulse" />
                  <div className="relative bg-zinc-900 border border-zinc-800 rounded-full p-6">
                    <Sparkles className="w-12 h-12 text-indigo-400" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Welcome to Botbyte AI</h2>
                <p className="text-zinc-400 mb-6">Creating your first conversation...</p>
                <Loader2 className="w-6 h-6 text-indigo-400 animate-spin mx-auto" />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
