"use client"

import { useState, useRef, useEffect, type FormEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, Send, X, Bot, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface Message {
  role: "user" | "bot"
  content: string
}

// Function to generate a simple unique ID
const generateSessionId = () => `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      content: "Hi! I'm the Wadada Run Club assistant. How can I help you today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  // State to hold the session ID for the current chat
  const [sessionId, setSessionId] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Generate a session ID when the component mounts or when the chat is opened
    if (isOpen && !sessionId) {
      setSessionId(generateSessionId())
    }
  }, [isOpen, sessionId])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [messages])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, sessionId: sessionId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response from server.")
      }

      const botMessage: Message = { role: "bot", content: data.reply }
      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error(error)
      let message = "Sorry, something went wrong. Please try again later."
      if (error instanceof Error) {
        message = error.message
      }
      const errorMessage: Message = {
        role: "bot",
        content: message,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="w-[calc(100vw-48px)] sm:w-96"
            >
              <Card className="h-[60vh] flex flex-col shadow-2xl">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Bot className="text-primary" />
                    Wadada Assistant
                  </CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="flex-grow overflow-hidden">
                  <ScrollArea className="h-full" ref={scrollAreaRef}>
                    <div className="space-y-4 pr-4">
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={cn(
                            "flex items-start gap-3",
                            message.role === "user" ? "justify-end" : "justify-start",
                          )}
                        >
                          {message.role === "bot" && (
                            <div className="p-2 bg-primary text-primary-foreground rounded-full">
                              <Bot size={16} />
                            </div>
                          )}
                          <div
                            className={cn(
                              "p-3 rounded-lg max-w-[80%]",
                              message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                            )}
                          >
                            <ReactMarkdown
                              className="text-sm leading-relaxed"
                              remarkPlugins={[remarkGfm]}
                              components={{
                                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                ol: ({ node, ...props }) => (
                                  <ol className="list-decimal list-inside my-2 space-y-1" {...props} />
                                ),
                                ul: ({ node, ...props }) => (
                                  <ul className="list-disc list-inside my-2 space-y-1" {...props} />
                                ),
                                a: ({ node, ...props }) => (
                                  <a
                                    className="underline hover:text-blue-500"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    {...props}
                                  />
                                ),
                              }}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </div>
                          {message.role === "user" && (
                            <div className="p-2 bg-muted rounded-full">
                              <User size={16} />
                            </div>
                          )}
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex items-start gap-3 justify-start">
                          <div className="p-2 bg-primary text-primary-foreground rounded-full">
                            <Bot size={16} />
                          </div>
                          <div className="p-3 rounded-lg bg-muted">
                            <div className="flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]" />
                              <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]" />
                              <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter>
                  <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask about the club..."
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button type="submit" size="icon" disabled={isLoading}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div layout>
          <Button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-full w-16 h-16 shadow-lg"
            aria-label="Toggle Chatbot"
          >
            {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
          </Button>
        </motion.div>
      </div>
    </>
  )
}
