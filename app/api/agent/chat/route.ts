/**
 * SSE Streaming API Route — Agent Chat
 * 
 * POST /api/agent/chat
 * Request: { message: string, history: ChatMessage[], providerId: string, modelId: string }
 * Response: SSE stream of agent events (text, tool_call, tool_result, done, error)
 * 
 * Phase 1: Mock implementation with simulated streaming
 * Phase 2: Real Cline SDK AgentRuntime integration
 */

import { NextRequest } from "next/server";

interface ChatRequest {
  message: string;
  history?: Array<{
    id: string;
    role: "user" | "assistant" | "tool";
    content: string;
    timestamp: number;
  }>;
  providerId?: string;
  modelId?: string;
}

// Encoding helpers
const encoder = new TextEncoder();

function sseEvent(event: string, data: unknown): Uint8Array {
  return encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

// =============================================================================
// Phase 1: Mock Agent Responses
// =============================================================================

const CLARIFYING_QUESTIONS = [
  "Great idea! Let me build that content pipeline for you. 🚀\n\nFirst, I have a few questions:\n\n1. **What niche or industry** should this focus on? (e.g., AI/ML, data science, web development, cybersecurity)\n2. **Who's your target audience?** (beginners, intermediate, expert practitioners)\n3. **What tone should the content have?** (professional, educational, inspirational, technical)\n4. **How often should posts go out?** (daily, weekdays, weekly)\n\nOnce I understand these, I'll design the complete workflow for you.",
];

const WORKFLOW_GENERATION = [
  "Perfect! Here's the workflow I've designed for you:\n\n",
  "## 📋 Workflow: \"Trending Topics to LinkedIn Pipeline\"\n\n",
  "**Description:** Scrapes trending topics from multiple sources, generates professional LinkedIn posts with AI, creates matching images, and publishes on schedule.\n\n",
  "### Pipeline Steps:\n\n",
  "1. **🔍 Trending Scraper** — Fetches top content ideas from Reddit, Google Trends, and LinkedIn\n",
  "2. **✍️ AI Content Writer (GPT-4o)** — Generates engaging LinkedIn posts with hooks and CTAs\n",
  "3. **🎨 AI Image Generator (DALL-E 3)** — Creates professional visuals for each post\n",
  "4. **#️⃣ Hashtag Generator** — Adds relevant, trending hashtags\n",
  "5. **📤 LinkedIn Publisher** — Posts or schedules each piece of content\n\n",
  "**Schedule:** Daily at 9:00 AM\n",
  "**Estimated credits per run:** 14 credits\n",
  "**Monthly cost:** ~420 credits\n\n",
  "You can view and modify this workflow in the [Workflow Editor](/workflows). ",
  "Would you like me to make any adjustments? I can change the schedule, add more platforms, or modify the content strategy.",
];

// =============================================================================
// POST Handler
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, history = [] } = body;

    if (!message?.trim()) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const turn = history.filter((m) => m.role === "user").length;

          if (turn === 0) {
            // First message: send clarifying questions
            await streamWords(controller, CLARIFYING_QUESTIONS);
          } else {
            // Subsequent: generate workflow
            // Send tool_call event first
            controller.enqueue(
              sseEvent("tool_call", {
                name: "scrape_trending_topics",
                input: { niche: "data science" },
              })
            );
            await sleep(800);

            // Send tool result
            controller.enqueue(
              sseEvent("tool_result", {
                name: "scrape_trending_topics",
                output: {
                  trends: [
                    { topic: "Machine Learning in Production 2026", engagement: "high" },
                    { topic: "Python for Data Engineering Best Practices", engagement: "high" },
                    { topic: "Real-time Analytics with Apache Kafka", engagement: "medium" },
                  ],
                },
              })
            );
            await sleep(500);

            // Send tool_call for content generation
            controller.enqueue(
              sseEvent("tool_call", {
                name: "generate_content",
                input: { topic: "data science trends", platform: "linkedin" },
              })
            );
            await sleep(600);

            controller.enqueue(
              sseEvent("tool_result", {
                name: "generate_content",
                output: { content: "[Content generated successfully]", platform: "linkedin" },
              })
            );
            await sleep(300);

            // Stream the workflow description
            await streamWords(controller, WORKFLOW_GENERATION);
          }

          // Done
          controller.enqueue(sseEvent("done", { turn: turn + 1 }));
        } catch (error) {
          controller.enqueue(
            sseEvent("error", {
              error: error instanceof Error ? error.message : "Unknown error",
            })
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Invalid request",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// =============================================================================
// Helpers
// =============================================================================

async function streamWords(
  controller: ReadableStreamDefaultController,
  wordsArray: string[]
) {
  for (const chunk of wordsArray) {
    // Stream character by character for realistic effect
    for (let i = 0; i < chunk.length; i++) {
      const char = chunk[i];
      controller.enqueue(sseEvent("text", { content: char }));
      await sleep(8 + Math.random() * 12);
    }
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
