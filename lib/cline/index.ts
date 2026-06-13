/**
 * Cline SDK Integration — ContentFlow Agent Runtime
 * 
 * Initializes the Cline AgentRuntime with ContentFlow-specific tools
 * for the content creation pipeline. This is the bridge between
 * natural language chat and workflow generation.
 *
 * Cline SDK v0.0.47 — AgentTool.execute uses generics:
 *   AgentTool<TInput, TOutput> with execute(input: TInput, context: AgentToolContext)
 * We cast internally to avoid friction with Cline's strict generics.
 */

import { type AgentTool, type AgentToolContext } from "@cline/shared";
import { AgentRuntime, type AgentRuntimeEvent, type AgentRuntimeConfigWithProvider } from "@cline/agents";
import type { AgentConfig } from "@cline/shared";

// =============================================================================
// ContentFlow Tool Definitions
// =============================================================================

export const scrapeTrendingTool = {
  name: "scrape_trending_topics",
  description: 
    "Scrape trending topics and content ideas from various sources. " +
    "Provide a niche or topic and get trending content ideas with engagement metrics.",
  inputSchema: {
    type: "object" as const,
    properties: {
      niche: { 
        type: "string" as const,
        description: "The niche or topic to find trending content for"
      },
      sources: {
        type: "array" as const,
        items: { type: "string" as const },
        description: "Sources to scrape trends from"
      },
      maxResults: {
        type: "number" as const,
        description: "Maximum number of trending topics to return"
      }
    },
    required: ["niche"]
  },
  execute: async (input: unknown, _context: AgentToolContext) => {
    const data = input as Record<string, unknown>;
    const niche = (data.niche as string) || "general";
    const maxResults = (data.maxResults as number) || 10;
    return {
      niche,
      trends: [
        { topic: `${niche} best practices in 2026`, engagement: "high", sourceCount: 245 },
        { topic: `How to master ${niche} as a beginner`, engagement: "high", sourceCount: 189 },
        { topic: `${niche} automation tools comparison`, engagement: "medium", sourceCount: 156 },
        { topic: `${niche} certification guide 2026`, engagement: "high", sourceCount: 312 },
        { topic: `Top ${niche} mistakes to avoid`, engagement: "medium", sourceCount: 134 },
      ].slice(0, maxResults),
      timestamp: new Date().toISOString(),
    };
  }
} as AgentTool;

export const generateContentTool = {
  name: "generate_content",
  description:
    "Generate content text using AI models. Create posts, captions, threads, " +
    "or articles on a given topic. Specify the platform to format appropriately.",
  inputSchema: {
    type: "object" as const,
    properties: {
      topic: {
        type: "string" as const,
        description: "The topic or prompt to generate content about"
      },
      platform: {
        type: "string" as const,
        enum: ["linkedin", "twitter", "instagram", "facebook", "youtube"],
        description: "Target platform for content formatting"
      },
      tone: {
        type: "string" as const,
        enum: ["professional", "casual", "inspirational", "educational", "humorous"],
        description: "Tone of the content"
      },
      maxLength: {
        type: "number" as const,
        description: "Maximum character count"
      },
      includeHashtags: {
        type: "boolean" as const,
        description: "Whether to include relevant hashtags"
      }
    },
    required: ["topic", "platform"]
  },
  execute: async (input: unknown, _context: AgentToolContext) => {
    const data = input as Record<string, unknown>;
    const topic = (data.topic as string) || "general";
    const platform = (data.platform as string) || "linkedin";
    const tone = (data.tone as string) || "professional";
    return {
      content: `[${platform.toUpperCase()} POST - ${tone} tone]\n\n` +
        `🚀 ${topic}\n\n` +
        `Here's what you need to know about ${topic.toLowerCase()}...\n\n` +
        `[Generated content placeholder — Phase 2: Real AI generation]\n\n` +
        `#content #${platform} #${topic.replace(/\s+/g, '').toLowerCase()}`,
      platform,
      tone,
      characterCount: 300,
      estimatedReadTime: "2 min",
    };
  }
} as AgentTool;

export const generateImageTool = {
  name: "generate_image",
  description:
    "Generate an image for social media content. Specify style, dimensions, " +
    "and topic. Returns a URL to the generated image.",
  inputSchema: {
    type: "object" as const,
    properties: {
      prompt: {
        type: "string" as const,
        description: "Image generation prompt"
      },
      style: {
        type: "string" as const,
        enum: ["minimalist", "illustration", "photo", "data_viz", "abstract"],
        description: "Visual style of the image"
      },
      width: {
        type: "number" as const,
        description: "Image width in pixels"
      },
      height: {
        type: "number" as const,
        description: "Image height in pixels"
      },
      platform: {
        type: "string" as const,
        enum: ["linkedin", "twitter", "instagram", "facebook", "youtube"],
        description: "Platform (for aspect ratio suggestions)"
      }
    },
    required: ["prompt"]
  },
  execute: async (input: unknown, _context: AgentToolContext) => {
    const data = input as Record<string, unknown>;
    const prompt = (data.prompt as string) || "ContentFlow";
    const width = (data.width as number) || 1200;
    const height = (data.height as number) || 630;
    const style = (data.style as string) || "minimalist";
    return {
      url: `https://placehold.co/${width}x${height}/1a1a2e/7c3aed?text=${encodeURIComponent(prompt.substring(0, 30))}`,
      prompt,
      style,
      dimensions: `${width}x${height}`,
      generated: false,
    };
  }
} as AgentTool;

export const postToLinkedInTool = {
  name: "post_linkedin",
  description:
    "Post content to LinkedIn. Can post text, text+image, or schedule for later. " +
    "Requires a connected LinkedIn account.",
  inputSchema: {
    type: "object" as const,
    properties: {
      content: {
        type: "string" as const,
        description: "The post text content"
      },
      imageUrl: {
        type: "string" as const,
        description: "URL of an image to attach"
      },
      hashtags: {
        type: "array" as const,
        items: { type: "string" as const },
        description: "Hashtags to include"
      },
      scheduleAt: {
        type: "string" as const,
        description: "ISO 8601 timestamp to schedule the post"
      }
    },
    required: ["content"]
  },
  execute: async (input: unknown, _context: AgentToolContext) => {
    const data = input as Record<string, unknown>;
    const content = (data.content as string) || "";
    return {
      postId: `linkedin_post_${Date.now()}`,
      status: data.scheduleAt ? "scheduled" : "posted",
      scheduledAt: data.scheduleAt || new Date().toISOString(),
      platform: "linkedin",
      contentPreview: content.substring(0, 100) + "...",
    };
  }
} as AgentTool;

// =============================================================================
// Tool Registry
// =============================================================================

export const CONTENT_TOOLS: AgentTool[] = [
  scrapeTrendingTool,
  generateContentTool,
  generateImageTool,
  postToLinkedInTool,
];

// =============================================================================
// Agent Runtime Configuration
// =============================================================================

export type { AgentConfig };

export interface ContentFlowAgentConfig {
  providerId: string;
  modelId: string;
  apiKey?: string;
  baseUrl?: string;
}

export function createContentFlowConfig(
  config: ContentFlowAgentConfig
): AgentConfig {
  return {
    sessionId: "contentflow-session",
    providerId: config.providerId,
    modelId: config.modelId,
    apiKey: config.apiKey,
    baseUrl: config.baseUrl,
    tools: CONTENT_TOOLS,
    systemPrompt: `You are ContentFlow, an AI content workflow builder.

Your job is to help users create content pipelines. When a user describes
what they want (e.g., "scrape trending AI topics and post to LinkedIn daily"),
your process is:

1. UNDERSTAND: Ask clarifying questions if needed
2. PLAN: Map out the workflow steps
3. BUILD: Use your tools to validate each step
4. DELIVER: Output a complete WorkflowDefinition as JSON

Available tools:
- scrape_trending_topics: Find trending content ideas
- generate_content: Create social media posts
- generate_image: Create images for content
- post_linkedin: Post to LinkedIn`,
  };
}

// =============================================================================
// Streaming Bridge — AgentRuntime events → callback
// =============================================================================

export type StreamEvent =
  | { type: "text"; content: string }
  | { type: "tool_call"; name: string; input: unknown }
  | { type: "tool_result"; name: string; output: unknown }
  | { type: "done"; outputText: string }
  | { type: "status"; message: string };

export function streamAgentChat(
  config: AgentConfig,
  userMessage: string,
  onEvent: (event: StreamEvent) => void
): { abort: () => void } {
  const runtime = new AgentRuntime(config as AgentRuntimeConfigWithProvider);

  runtime.subscribe((event: AgentRuntimeEvent) => {
    switch (event.type) {
      case "assistant-text-delta":
        onEvent({ type: "text", content: event.text });
        break;
      case "tool-started":
        onEvent({
          type: "tool_call",
          name: event.toolCall.toolName,
          input: event.toolCall.input,
        });
        break;
      case "tool-finished":
        onEvent({
          type: "tool_result",
          name: event.toolCall.toolName,
          output: event.message.content,
        });
        break;
      case "run-finished":
        onEvent({ type: "done", outputText: event.result.outputText });
        break;
      case "status-notice":
        onEvent({ type: "status", message: event.message });
        break;
    }
  });

  runtime.run(userMessage);

  return {
    abort: () => runtime.abort(),
  };
}

// =============================================================================
// Singleton Agent Runtime
// =============================================================================

let _runtime: AgentRuntime | null = null;

export function getAgentRuntime(config?: ContentFlowAgentConfig): AgentRuntime | null {
  if (!_runtime && config) {
    _runtime = new AgentRuntime(createContentFlowConfig(config) as AgentRuntimeConfigWithProvider);
  }
  return _runtime;
}

export function resetAgentRuntime(): void {
  _runtime = null;
}
