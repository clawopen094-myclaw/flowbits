/**
 * SSE Streaming API Route — Agent Chat
 * 
 * POST /api/agent/chat
 * Request: { message: string, history: ChatMessage[], providerId: string, modelId: string }
 * Response: SSE stream of agent events (text, tool_call, tool_result, done, error, status)
 */

import { NextRequest } from "next/server";
import {
  ContentFlowAgentConfig,
  createContentFlowConfig,
  streamAgentChat,
  type StreamEvent,
} from "@/lib/cline";

const DEFAULT_PROVIDER = "openrouter";
const DEFAULT_MODEL = "openai/gpt-4o";

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

const encoder = new TextEncoder();

function sseEvent(event: string, data: unknown): Uint8Array {
  return encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

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

    const providerId = body.providerId || process.env.DEFAULT_PROVIDER || DEFAULT_PROVIDER;
    const modelId = body.modelId || process.env.DEFAULT_MODEL || DEFAULT_MODEL;
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.CLINE_API_KEY;

    const contentFlowConfig: ContentFlowAgentConfig = {
      providerId,
      modelId,
      apiKey,
      ...(process.env.OPENROUTER_BASE_URL && { baseUrl: process.env.OPENROUTER_BASE_URL }),
    };

    const agentConfig = createContentFlowConfig(contentFlowConfig);

    const stream = new ReadableStream({
      async start(controller) {
        try {
          await new Promise<void>((resolve, reject) => {
            const { abort } = streamAgentChat(agentConfig, message, (event: StreamEvent) => {
              controller.enqueue(sseEvent(event.type, event));

              if (event.type === "done") {
                resolve();
              }
            });

            const originalClose = controller.close.bind(controller);
            controller.close = () => {
              abort();
              originalClose();
            };
          });

          controller.enqueue(sseEvent("done", {}));
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
