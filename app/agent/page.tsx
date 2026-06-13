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

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Sparkles, Loader2, Workflow, Settings, History, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { ContentFlowEvent, WorkflowDefinition } from "@/types/contentflow";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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

// =============================================================================
// Mock Workflow Generation (Phase 2 — real Cline SDK SSE in place)
// =============================================================================

function buildMockWorkflowResponse(niche: string, audience: string, tone: string, frequency: string): {
  text: string;
  workflow: WorkflowDefinition;
} {
  const name = `${niche} Content Pipeline`;
  const description = `Automated content pipeline: scrapes trending ${niche} topics, generates ${tone} ${"linkedin"} posts with images, and publishes on a ${frequency} schedule.`;

  const nodes = [
    { id: "trend-scraper", type: "SCRAPE_TRENDS", position: { x: 100, y: 100 }, data: { label: "Trending Scraper", Niche: niche, Sources: "google_trends,reddit", "Max Results": "10" } },
    { id: "content-writer", type: "AI_TEXT_GEN", position: { x: 450, y: 100 }, data: { label: "AI Content Writer", "System Message": `You are a ${tone} social media content writer.`, Model: "gpt-4o", Temperature: "0.7", Platform: "linkedin" } },
    { id: "image-gen", type: "AI_IMAGE_GEN", position: { x: 800, y: 100 }, data: { label: "AI Image Generator", Style: "minimalist", Width: "1200", Height: "630" } },
    { id: "hashtag-gen", type: "HASHTAG_GEN", position: { x: 1150, y: 100 }, data: { label: "Hashtag Generator" } },
    { id: "linkedin-pub", type: "LINKEDIN_PUBLISH", position: { x: 1500, y: 100 }, data: { label: "LinkedIn Publisher" } },
  ];

  const edges = [
    { id: "e1", source: "trend-scraper", target: "content-writer" },
    { id: "e2", source: "content-writer", target: "image-gen" },
    { id: "e3", source: "image-gen", target: "hashtag-gen" },
    { id: "e4", source: "hashtag-gen", target: "linkedin-pub" },
  ];

  const scheduleMap: Record<string, string> = {
    daily: "0 9 * * *",
    weekdays: "0 9 * * 1-5",
    "twice a week": "0 9 * * 1,4",
    weekly: "0 9 * * 1",
  };

  return {
    text: `Here's the workflow I've designed:\n\n**${name}**\n\n${description}\n\n**Schedule:** ${frequency} at 9:00 AM\n**Estimated credits per run:** 14 credits\n\nYou can open it in the Workflow Editor to customize each step.`,
    workflow: {
      id: crypto.randomUUID(),
      name,
      description,
      nodes,
      edges,
      createdAt: new Date().toISOString(),
      schedule: scheduleMap[frequency] ?? "0 9 * * *",
      estimatedCredits: 14,
    },
  };
}

// =============================================================================
// Component
// =============================================================================

export default function AgentChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [turn, setTurn] = useState(0);
  const [workflow, setWorkflow] = useState<WorkflowDefinition | null>(null);
  const [activeToolCalls, setActiveToolCalls] = useState<Array<{ name: string; status: "running" | "done" | "error" }>>([]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeToolCalls, scrollToBottom]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function extractContextFromHistory(): { niche: string; audience: string; tone: string; frequency: string } {
    const userMessages = messages.filter((m) => m.role === "user").map((m) => m.content);
    const combined = userMessages.join(" ").toLowerCase();

    const nicheMap: Record<string, string> = {
      "ai/ml": "AI/ML Engineering",
      "ai": "AI/ML Engineering",
      "data science": "Data Science",
      "web dev": "Web Development",
      cybersecurity: "Cybersecurity",
      "cloud": "Cloud Computing",
    };
    const niche = Object.entries(nicheMap).find(([k]) => combined.includes(k))?.[1] ?? "Data Science";

    const audience = combined.includes("beginner") ? "beginners" : combined.includes("c-level") ? "C-level executives" : "professionals";
    const tone = combined.includes("casual") ? "conversational" : combined.includes("educational") ? "educational" : "professional";
    const frequency = combined.includes("weekly") ? "weekly" : combined.includes("weekdays") ? "weekdays" : "daily";

    return { niche, audience, tone, frequency };
  }

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
    const nextTurn = turn + 1;
    setTurn(nextTurn);

    if (nextTurn <= 1) {
      // First message → clarifying questions
      const clarifyingText =
        "Great idea! Let me help you build that content pipeline.\n\nI have a few clarifying questions first:\n\n1. **What niche or industry** should the content focus on? (e.g., AI/ML, data science, web development)\n2. **Who is your target audience?** (beginners, experienced professionals, C-level)\n3. **What tone** should the content have? (professional, educational, inspirational)\n4. **How frequently** should content go out? (daily, weekdays, weekly)";

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      await streamText(assistantMessage.id, clarifyingText);
    } else {
      // Second+ message → simulate tool calls then workflow generation
      const ctx = extractContextFromHistory();

      // Simulate tool calls
      const toolNames = ["scrape_trending_topics", "generate_content", "create_workflow"];
      for (const name of toolNames) {
        setActiveToolCalls((prev) => [...prev, { name, status: "running" }]);
        await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));
        setActiveToolCalls((prev) =>
          prev.map((tc) => (tc.name === name ? { ...tc, status: "done" as const } : tc))
        );
      }
      await new Promise((r) => setTimeout(r, 300));
      setActiveToolCalls([]);

      const { text, workflow: wf } = buildMockWorkflowResponse(ctx.niche, ctx.audience, ctx.tone, ctx.frequency);

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
        timestamp: Date.now(),
        toolCalls: toolNames.map((name) => ({
          name,
          input: {},
          output: {},
          status: "done" as const,
        })),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      await streamText(assistantMessage.id, text);

      setWorkflow(wf);
    }

    setIsStreaming(false);
  }

  async function streamText(messageId: string, text: string) {
    const words = text.split(" ");
    for (let i = 0; i < words.length; i++) {
      await new Promise((r) => setTimeout(r, 12 + Math.random() * 20));
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, content: msg.content + (i > 0 ? " " : "") + words[i] }
            : msg
        )
      );
    }
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
            {messages.length === 0 && <WelcomeScreen />}

            <AnimatePresence>
              {messages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
              ))}
            </AnimatePresence>

            {/* Active tool calls animation */}
            <AnimatePresence>
              {activeToolCalls.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-start gap-3"
                >
                  <Avatar className="h-8 w-8 shrink-0 bg-primary/10 mt-0.5">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </Avatar>
                  <div className="space-y-1.5">
                    {activeToolCalls.map((tc) => (
                      <ToolCallIndicator key={tc.name} name={tc.name} status={tc.status} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {isStreaming && activeToolCalls.length === 0 && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Agent is thinking...
              </div>
            )}

            {/* Workflow Preview Card */}
            <AnimatePresence>
              {workflow && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <WorkflowCard workflow={workflow} onDismiss={() => setWorkflow(null)} />
                </motion.div>
              )}
            </AnimatePresence>
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}
    >
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
                <CheckCircle2 className="h-3 w-3 text-green-500" />
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
    </motion.div>
  );
}

function ToolCallIndicator({ name, status }: { name: string; status: "running" | "done" | "error" }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 8 }}
      className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-md bg-muted/80 border shadow-sm"
    >
      {status === "running" ? (
        <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
      ) : status === "error" ? (
        <span className="text-red-500 text-xs font-bold">!</span>
      ) : (
        <CheckCircle2 className="h-3 w-3 text-green-500" />
      )}
      <span className="font-mono text-muted-foreground">{name}</span>
    </motion.div>
  );
}

function WorkflowCard({ workflow, onDismiss }: { workflow: WorkflowDefinition; onDismiss?: () => void }) {
  return (
    <Card className="p-5 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Workflow className="h-4 w-4 text-primary shrink-0" />
            <h3 className="font-semibold text-sm truncate">{workflow.name}</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{workflow.description}</p>

          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-primary/60 inline-block" />
              {workflow.nodes.length} nodes
            </span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-primary/60 inline-block" />
              {workflow.edges.length} connections
            </span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-primary/60 inline-block" />
              {workflow.estimatedCredits} credits/run
            </span>
            {workflow.schedule && (
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-primary/60 inline-block" />
                {workflow.schedule}
              </span>
            )}
          </div>
        </div>
      </div>

      <Separator className="my-3" />

      <div className="flex items-center gap-2">
        <Link href="/workflows" className="flex-1">
          <Button className="w-full gap-2" size="sm">
            Open in Workflow Editor
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
        {onDismiss && (
          <Button variant="ghost" size="sm" className="shrink-0" onClick={onDismiss}>
            Dismiss
          </Button>
        )}
      </div>
    </Card>
  );
}
