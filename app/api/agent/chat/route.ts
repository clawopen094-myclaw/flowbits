/**
 * SSE Streaming API Route — Agent Chat
 * 
 * POST /api/agent/chat
 * Request: { message: string, history[], providerId, modelId }
 * Response: SSE stream of agent events
 *
 * Uses runtime dynamic import for @cline/* — webpack never sees ESM packages.
 */

import { NextRequest } from "next/server";

const DEFAULT_PROVIDER = "openrouter";
const DEFAULT_MODEL = "openai/gpt-4o";

interface ChatRequest {
  message: string;
  history?: Array<{ id: string; role: string; content: string; timestamp: number }>;
  providerId?: string;
  modelId?: string;
}

const encoder = new TextEncoder();

function sseEvent(event: string, data: unknown): Uint8Array {
  return encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message } = body;

    if (!message?.trim()) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const providerId = body.providerId || process.env.DEFAULT_PROVIDER || DEFAULT_PROVIDER;
    const modelId = body.modelId || process.env.DEFAULT_MODEL || DEFAULT_MODEL;
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.CLINE_API_KEY;

    // Dynamic import — webpack never traces into @cline/* at build time
    const mod = await import("@/lib/cline");

    const agentConfig = mod.createContentFlowConfig({
      providerId,
      modelId,
      apiKey,
      ...(process.env.OPENROUTER_BASE_URL ? { baseUrl: process.env.OPENROUTER_BASE_URL } : {}),
    });

    const stream = new ReadableStream({
      async start(controller) {
        try {
          await new Promise<void>((resolve, reject) => {
            void mod.streamAgentChat(agentConfig, message, (event: { type: string; content?: string; name?: string; input?: unknown; output?: unknown; outputText?: string; message?: string }) => {
              controller.enqueue(sseEvent(event.type, event));
              if (event.type === "done") resolve();
            }).then(({ abort }: { abort: () => void }) => {
              const origClose = controller.close.bind(controller);
              controller.close = () => { abort(); origClose(); };
            }).catch(reject);
          });
          controller.enqueue(sseEvent("done", {}));
        } catch (error) {
          controller.enqueue(sseEvent("error", {
            error: error instanceof Error ? error.message : "Unknown error",
          }));
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
      JSON.stringify({ error: error instanceof Error ? error.message : "Invalid request" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}
