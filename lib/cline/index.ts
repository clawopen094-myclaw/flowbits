/**
 * Cline SDK Integration — ContentFlow Agent Runtime
 * 
 * Initializes the Cline AgentRuntime with ContentFlow-specific tools
 * for the content creation pipeline. This is the bridge between
 * natural language chat and workflow generation.
 */

import { 
  type AgentTool,
  type AgentRuntimeConfigWithProvider,
  type AgentMessage,
  type AgentRuntimeEvent,
} from "@cline/shared";
import { AgentRuntime } from "@cline/agents";

// =============================================================================
// ContentFlow Tool Definitions
// =============================================================================

export const scrapeTrendingTool: AgentTool = {
  name: "scrape_trending_topics",
  description: 
    "Scrape trending topics and content ideas from various sources. " +
    "Provide a niche or topic and get trending content ideas with engagement metrics.",
  inputSchema: {
    type: "object",
    properties: {
      niche: { 
        type: "string", 
        description: "The niche or topic to find trending content for (e.g., 'data science', 'AI engineering', 'MLOps')" 
      },
      sources: {
        type: "array",
        items: { type: "string", enum: ["google_trends", "reddit", "twitter", "linkedin", "youtube"] },
        description: "Sources to scrape trends from",
        default: ["google_trends", "reddit"]
      },
      maxResults: {
        type: "number",
        description: "Maximum number of trending topics to return",
        default: 10
      }
    },
    required: ["niche"]
  },
  handler: async (input) => {
    // Phase 1: Stub — returns mock trending data
    // Phase 2: Connects to Google Trends API + crawl4ai for real data
    const { niche, maxResults = 10 } = input;
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
};

export const generateContentTool: AgentTool = {
  name: "generate_content",
  description:
    "Generate content text using AI models. Create posts, captions, threads, " +
    "or articles on a given topic. Specify the platform to format appropriately.",
  inputSchema: {
    type: "object",
    properties: {
      topic: {
        type: "string",
        description: "The topic or prompt to generate content about"
      },
      platform: {
        type: "string",
        enum: ["linkedin", "twitter", "instagram", "facebook", "youtube"],
        description: "Target platform for content formatting"
      },
      tone: {
        type: "string",
        enum: ["professional", "casual", "inspirational", "educational", "humorous"],
        description: "Tone of the content",
        default: "professional"
      },
      maxLength: {
        type: "number",
        description: "Maximum character count",
        default: 3000
      },
      includeHashtags: {
        type: "boolean",
        description: "Whether to include relevant hashtags",
        default: true
      }
    },
    required: ["topic", "platform"]
  },
  handler: async (input) => {
    // Phase 1: Stub — returns mock content
    // Phase 2: Uses Cline's LLM provider to actually generate
    const { topic, platform, tone = "professional" } = input;
    return {
      content: `[${platform.toUpperCase()} POST - ${tone} tone]\n\n` +
        `🚀 ${topic}\n\n` +
        `Here's what you need to know about ${topic.toLowerCase()}...\n\n` +
        `[Generated content placeholder — will be replaced with actual AI generation in Phase 2]\n\n` +
        `#content #${platform} #${topic.replace(/\s+/g, '').toLowerCase()}`,
      platform,
      tone,
      characterCount: 300,
      estimatedReadTime: "2 min",
    };
  }
};

export const generateImageTool: AgentTool = {
  name: "generate_image",
  description:
    "Generate an image for social media content. Specify style, dimensions, " +
    "and topic. Returns a URL to the generated image.",
  inputSchema: {
    type: "object",
    properties: {
      prompt: {
        type: "string",
        description: "Image generation prompt — be descriptive about what you want"
      },
      style: {
        type: "string",
        enum: ["minimalist", "illustration", "photo", "data_viz", "abstract"],
        description: "Visual style of the image",
        default: "minimalist"
      },
      width: {
        type: "number",
        description: "Image width in pixels",
        default: 1200
      },
      height: {
        type: "number",
        description: "Image height in pixels",
        default: 630
      },
      platform: {
        type: "string",
        enum: ["linkedin", "twitter", "instagram", "facebook", "youtube"],
        description: "Platform (for aspect ratio suggestions)"
      }
    },
    required: ["prompt"]
  },
  handler: async (input) => {
    // Phase 1: Stub — generates a placeholder
    // Phase 2: Calls DALL-E / Stable Diffusion / Flux API
    return {
      url: `https://placehold.co/${input.width || 1200}x${input.height || 630}/1a1a2e/7c3aed?text=${encodeURIComponent(input.prompt?.substring(0, 30) || 'ContentFlow')}`,
      prompt: input.prompt,
      style: input.style || "minimalist",
      dimensions: `${input.width || 1200}x${input.height || 630}`,
      generated: false, // Phase 1: placeholder. Phase 2: real generation
    };
  }
};

export const postToLinkedInTool: AgentTool = {
  name: "post_linkedin",
  description:
    "Post content to LinkedIn. Can post text, text+image, or schedule for later. " +
    "Requires a connected LinkedIn account.",
  inputSchema: {
    type: "object",
    properties: {
      content: {
        type: "string",
        description: "The post text content"
      },
      imageUrl: {
        type: "string",
        description: "URL of an image to attach (optional)"
      },
      hashtags: {
        type: "array",
        items: { type: "string" },
        description: "Hashtags to include"
      },
      scheduleAt: {
        type: "string",
        description: "ISO 8601 timestamp to schedule the post (omit for immediate)"
      }
    },
    required: ["content"]
  },
  handler: async (input) => {
    // Phase 1: Stub — logs and returns
    // Phase 2: Calls LinkedIn MCP server for actual publishing
    return {
      postId: `linkedin_post_${Date.now()}`,
      status: input.scheduleAt ? "scheduled" : "posted",
      scheduledAt: input.scheduleAt || new Date().toISOString(),
      platform: "linkedin",
      content: input.content?.substring(0, 100) + "...",
    };
  }
};

// =============================================================================
// Tool Registry — all content tools
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

export interface ContentFlowAgentConfig {
  providerId: string;
  modelId: string;
  apiKey?: string;
  baseUrl?: string;
}

export function createContentFlowConfig(
  config: ContentFlowAgentConfig
): AgentRuntimeConfigWithProvider {
  return {
    agentId: "contentflow-agent",
    agentRole: "Content Workflow Builder",
    providerId: config.providerId,
    modelId: config.modelId,
    apiKey: config.apiKey,
    baseUrl: config.baseUrl,
    tools: CONTENT_TOOLS,
    systemPrompt: `You are ContentFlow, an AI content workflow builder.

Your job is to help users create content pipelines. When a user describes
what they want (e.g., "scrape trending AI topics and post to LinkedIn daily"),
your process is:

1. UNDERSTAND: Ask clarifying questions if needed (niche, tone, frequency, 
   visual style, platforms, target audience)
2. PLAN: Map out the workflow steps (sources → generation → publishing)
3. BUILD: Use your tools to validate each step (scrape, generate, post)
4. DELIVER: Output a complete WorkflowDefinition as JSON

Available tools:
- scrape_trending_topics: Find trending content ideas in a niche
- generate_content: Create social media posts/threads/articles
- generate_image: Create images for social media content
- post_linkedin: Post content to LinkedIn (post or schedule)

Output format for workflows:
\`\`\`json
{
  "workflowName": "...",
  "description": "...",
  "nodes": [
    { "id": "...", "type": "SCRAPE_TRENDS", "data": { "inputs": {...} } },
    { "id": "...", "type": "AI_TEXT_GEN", "data": { "inputs": {...} } },
    { "id": "...", "type": "AI_IMAGE_GEN", "data": { "inputs": {...} } },
    { "id": "...", "type": "LINKEDIN_PUBLISH", "data": { "inputs": {...} } }
  ],
  "edges": [
    { "source": "...", "target": "...", "sourceHandle": "Response", "targetHandle": "Input" }
  ],
  "schedule": "0 9 * * *"
}
\`\`\`

Always validate that every node's required inputs are filled.
Always connect edges so data flows from one step to the next.`,
    toolExecution: "sequential",
  };
}

// =============================================================================
// Singleton Agent Runtime
// =============================================================================

let _runtime: AgentRuntime | null = null;

export function getAgentRuntime(config?: ContentFlowAgentConfig): AgentRuntime | null {
  if (!_runtime && config) {
    const runtimeConfig = createContentFlowConfig(config);
    _runtime = new AgentRuntime(runtimeConfig);
  }
  return _runtime;
}

export function resetAgentRuntime(): void {
  _runtime = null;
}

// =============================================================================
// Chat Interface
// =============================================================================

export interface AgentChatMessage {
  id: string;
  role: "user" | "assistant" | "tool";
  content: string;
  timestamp: number;
  toolCalls?: Array<{ name: string; input: unknown; output?: unknown }>;
}

export async function* streamAgentChat(
  userMessage: string,
  config: ContentFlowAgentConfig,
  history: AgentChatMessage[] = []
): AsyncGenerator<{
  type: "text" | "tool_call" | "tool_result" | "done" | "error";
  content?: string;
  toolName?: string;
  toolInput?: unknown;
  toolOutput?: unknown;
  messages?: AgentChatMessage[];
  error?: string;
}> {
  const runtime = getAgentRuntime(config);
  if (!runtime) {
    yield { type: "error", error: "Agent runtime not initialized" };
    return;
  }

  // Convert history to Cline message format
  const clineMessages: AgentMessage[] = history.map(msg => ({
    id: msg.id,
    role: msg.role as AgentMessage["role"],
    content: [{ type: "text" as const, text: msg.content }],
    createdAt: msg.timestamp,
  }));

  try {
    const run = runtime.run(userMessage, clineMessages);
    
    for await (const event of run) {
      switch (event.type) {
        case "content_update":
          if (event.contentType === "text") {
            yield { type: "text", content: event.text };
          }
          break;
        case "content_start":
          if (event.contentType === "tool") {
            yield { 
              type: "tool_call", 
              toolName: event.toolName,
              toolInput: event.input 
            };
          }
          break;
        case "content_end":
          if (event.contentType === "tool") {
            yield {
              type: "tool_result",
              toolName: event.toolName,
              toolOutput: event.output,
            };
          }
          break;
        case "done":
          yield { type: "done" };
          break;
        case "error":
          yield { type: "error", error: event.error.message };
          break;
      }
    }
  } catch (err) {
    yield { type: "error", error: err instanceof Error ? err.message : String(err) };
  }
}
