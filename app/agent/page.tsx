/**
 * Agent Chat Page — The main interface for conversational workflow creation.
 * 
 * Users describe content needs in natural language. The Cline-powered agent
 * asks clarifying questions, then generates complete workflow definitions.
 * 
 * Route: /agent
 * Layout: Full-height chat with sidebar for conversation history
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Loader2, Workflow, Settings, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// =============================================================================
// Types
// =============================================================================

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "tool";
  content: string;
  timestamp: number;
  toolCalls?: Array<{
    name: string;
    input: Record<string, unknown>;
    output?: unknown;
    status: "running" | "done" | "error";
  }>;
}

interface WorkflowPreview {
  workflowName: string;
  description: string;
  nodeCount: number;
  schedule?: string;
}

// =============================================================================
// Mock Agent (Phase 1 — real Cline SDK integration in Phase 2)
// =============================================================================

const MOCK_RESPONSES: Record<string, string[]> = {
  default: [
    "Great idea! Let me help you build that content pipeline. 🚀\n\nI have a few clarifying questions first:\n\n1. **What niche or industry** should the content focus on? (e.g., AI/ML, data science, web development)\n2. **What's your target audience**? (beginners, experienced professionals, C-level)\n3. **What tone** should the content have? (professional, educational, inspirational)\n\nOnce I understand these, I'll design the complete workflow for you.",
    
    "Perfect! Here's the workflow I've designed:\n\n**📋 Workflow: \"Data Science Content Pipeline\"**\n\n```\n1. Trending Scraper → Fetches top data science topics from Reddit & Google Trends\n2. AI Content Writer (GPT-4o) → Generates LinkedIn posts\n3. AI Image Generator (DALL-E 3) → Creates matching visuals\n4. Hashtag Generator → Adds relevant hashtags\n5. LinkedIn Publisher → Posts or schedules\n```\n\n**Schedule:** Daily at 9:00 AM\n**Estimated credits per run:** 12 credits\n\nYou can [view and modify this workflow in the editor](/workflow/editor/new) or I can adjust anything — just let me know!",
  ],
};

function getMockResponse(userMessage: string, turn: number): string {
  // First message → ask clarifying questions
  if (turn <= 1) {
    return MOCK_RESPONSES.default[0];
  }
  // Second message → generate workflow
  return MOCK_RESPONSES.default[1];
}

// =============================================================================
// Component
// =============================================================================

export default function AgentChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [turn, setTurn] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleSend() {
    if (!input.trim() || isStreaming) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsStreaming(true);
    setTurn((t) => t + 1);

    // Simulate streaming response (Phase 1 mock)
    const responseText = getMockResponse(input.trim(), turn);
    const words = responseText.split(" ");

    const assistantMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, assistantMessage]);

    // Stream words one by one
    for (let i = 0; i < words.length; i++) {
      await new Promise((r) => setTimeout(r, 15 + Math.random() * 25));
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id
            ? { ...msg, content: msg.content + (i > 0 ? " " : "") + words[i] }
            : msg
        )
      );
    }

    setIsStreaming(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // =============================================================================
  // Render
  // =============================================================================

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Left Sidebar — Conversation History */}
      <aside className="hidden lg:flex w-72 flex-col border-r bg-muted/30">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-sm flex items-center gap-2">
            <History className="h-4 w-4" />
            Conversations
          </h2>
        </div>
        <ScrollArea className="flex-1 p-2">
          {messages.length > 0 ? (
            <Card className="p-3 cursor-pointer hover:bg-accent transition-colors bg-accent/50">
              <p className="text-sm font-medium truncate">
                {messages[0]?.content?.substring(0, 50)}...
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date().toLocaleDateString()}
              </p>
            </Card>
          ) : (
            <p className="text-xs text-muted-foreground p-3 text-center">
              No conversations yet. Start by describing your content needs!
            </p>
          )}
        </ScrollArea>
        <div className="p-3 border-t">
          <Button variant="outline" size="sm" className="w-full text-xs" disabled>
            <Settings className="h-3 w-3 mr-1" />
            Agent Settings
          </Button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <header className="flex items-center justify-between px-4 py-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 bg-primary/10">
              <Sparkles className="h-4 w-4 text-primary" />
            </Avatar>
            <div>
              <h1 className="text-sm font-semibold">ContentFlow Agent</h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block" />
                Ready to build workflows
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs gap-1">
            <Workflow className="h-3 w-3" />
            {turn} turns
          </Badge>
        </header>

        {/* Messages */}
        <ScrollArea className="flex-1 px-4" ref={scrollRef}>
          <div className="max-w-3xl mx-auto py-6 space-y-6">
            {messages.length === 0 && (
              <WelcomeScreen />
            )}

            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}

            {isStreaming && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Agent is thinking...
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
          <div className="max-w-3xl mx-auto flex gap-3">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your content pipeline... (e.g., 'Build a workflow to scrape trending AI topics and post daily LinkedIn content with images')"
              className="min-h-[60px] max-h-[200px] resize-none"
              rows={2}
              disabled={isStreaming}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isStreaming}
              size="icon"
              className="h-[60px] w-[60px] shrink-0"
            >
              {isStreaming ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2 max-w-3xl mx-auto">
            Press Enter to send, Shift+Enter for new line. The agent can generate workflows, 
            post to social platforms, and schedule content.
          </p>
        </div>
      </main>
    </div>
  );
}

// =============================================================================
// Sub-components
// =============================================================================

function WelcomeScreen() {
  return (
    <div className="text-center py-12 space-y-4">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-2">
        <Sparkles className="h-8 w-8 text-primary" />
      </div>
      <h2 className="text-xl font-semibold">ContentFlow Agent</h2>
      <p className="text-muted-foreground max-w-md mx-auto">
        Describe the content pipeline you want to build. I&apos;ll ask clarifying
        questions and generate a complete workflow you can modify and schedule.
      </p>
      <div className="flex flex-wrap gap-2 justify-center pt-2">
        {[
          "Scrape trending AI topics and post to LinkedIn",
          "Create daily Twitter threads from my blog posts",
          "Generate Instagram carousels about data science",
          "Build a YouTube content pipeline from trending tech news",
        ].map((suggestion) => (
          <Badge
            key={suggestion}
            variant="secondary"
            className="cursor-pointer hover:bg-secondary/80 transition-colors px-3 py-1.5 text-xs"
          >
            {suggestion}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  const isTool = message.role === "tool";

  return (
    <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <Avatar className="h-8 w-8 shrink-0 bg-primary/10 mt-0.5">
          <Sparkles className="h-4 w-4 text-primary" />
        </Avatar>
      )}

      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "bg-primary text-primary-foreground"
            : isTool
            ? "bg-muted border text-muted-foreground font-mono text-xs"
            : "bg-muted"
        )}
      >
        {/* Tool calls display */}
        {message.toolCalls && message.toolCalls.length > 0 && (
          <div className="mb-2 space-y-1">
            {message.toolCalls.map((tc, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-xs bg-background/50 rounded px-2 py-1"
              >
                {tc.status === "running" ? (
                  <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
                ) : tc.status === "error" ? (
                  <span className="text-red-500">✕</span>
                ) : (
                  <span className="text-green-500">✓</span>
                )}
                <span className="font-medium">{tc.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Message content with basic markdown rendering */}
        <div
          className="prose prose-sm dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{
            __html: message.content
              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
              .replace(/```([\s\S]*?)```/g, "<pre class='bg-background/50 rounded p-2 my-2 text-xs overflow-x-auto'><code>$1</code></pre>")
              .replace(/`(.*?)`/g, "<code class='bg-background/50 rounded px-1 text-xs'>$1</code>")
              .replace(/\n/g, "<br/>")
              .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary underline" target="_blank">$1</a>'),
          }}
        />

        {/* Timestamp */}
        <p className="text-[10px] text-muted-foreground mt-1.5">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {isUser && (
        <Avatar className="h-8 w-8 shrink-0 bg-primary mt-0.5">
          <span className="text-xs font-medium text-primary-foreground">U</span>
        </Avatar>
      )}
    </div>
  );
}
