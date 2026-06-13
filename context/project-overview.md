# Flowbits — AI Workflow Automation Platform

## Overview

Flowbits is a visual workflow builder and automation platform that lets users create
multi-step AI-powered workflows using a drag-and-drop node editor. Users chain
nodes (Input → Launch Browser → AI generation via OpenAI/Gemini → Output) into
execution pipelines triggered manually or by cron schedules. Built as a SaaS with
Clerk authentication and credit-based billing — every workflow execution consumes
credits based on the node types used.

## Goals

1. **Visual workflow builder** — drag-and-drop node editor using @xyflow/react
   (React Flow) with real-time validation and execution plan generation
2. **Multi-model AI execution** — support OpenAI, Google Gemini, and Anthropic
   models with configurable prompts, temperature, and streaming
3. **Automated scheduling** — cron-based workflow execution with next-run tracking
   and credit-enforced execution
4. **Multi-stage pipeline execution** — each workflow node is a "phase" in a
   sequential execution plan with inputs/outputs flowing between nodes
5. **Credit-based monetization** — users have credit balances; each node type costs
   credits (e.g., Launch Browser = 5, AI nodes = 2, Input = 0)

## Core User Flow

1. User signs up/in via Clerk authentication
2. User creates a new workflow (DRAFT) and enters the visual editor
3. User drags nodes onto the canvas (Input, Launch Browser, OpenAI, Gemini) and
   connects them with edges
4. UI validates the flow: single entrypoint, all required inputs filled, edges
   connected
5. User publishes the workflow (PUBLISHED) — execution plan is generated and saved
6. User can manually run the workflow or set a cron schedule
7. Execution runs phases sequentially, each checked against credit balance
8. Results visible in execution history with per-phase logs and outputs

## Features

### Visual Workflow Editor
- Drag-and-drop node canvas built with @xyflow/react (React Flow v12)
- Custom edge styling (CustomEdge)
- Sidebar with available task nodes
- Node parameter configuration: strings, comboboxes, toggles, range sliders, variables
- Real-time flow validation (entrypoints, inputs, connections)
- Execution plan generation from graph topology

### AI Agent Runtime
- **Cline AgentRuntime** — unified agent harness with tool registry, LLM abstraction (OpenRouter), cron, session persistence
- **SSE Streaming** — real-time agent chat via Server-Sent Events, streaming text + tool call display
- **Tool Registry** — 4 content tools: scrape_trending_topics, generate_content, generate_image, schedule_post
- **MCP Platform Connectors** — standalone FastMCP servers for LinkedIn, Instagram, YouTube, Twitter (auto-discoverable by Cline's MCP client)
- **pydantic-ai Workflow Generator** — natural language → structured WorkflowDefinition pipeline

### Workflow Management
- Dashboard with workflow list (data table with search, filter, pagination)
- Workflow status: DRAFT / PUBLISHED
- Execution history with per-phase status badges
- Monthly run charts, execution status charts
- Cron scheduling with cron-parser

### Billing System
- UserBalance model tracking credits
- Credit decrement during execution (insufficient balance = failure)
- Credits usage charts, stats cards
- Per-node credit costs defined in task registry

## Scope

### In Scope
- Visual node-based workflow builder
- OpenAI, Gemini, Launch Browser task types
- Sequential phase execution (DAG — Directed Acyclic Graph)
- Cron scheduling for automated runs
- Credit-based execution gating
- Execution logs and history

### Out of Scope
- Parallel/concurrent phase execution (currently sequential only)
- User-defined custom nodes/tools (only built-in node types)
- Team/collaboration features
- Webhook triggers (only manual + cron)
- Real-time streaming output display
- Anthropic execution (AgentCreator supports it code-wise but no frontend node)

## Success Criteria

1. A signed-in user can create a workflow and open the visual editor
2. User can add nodes, configure parameters, connect edges, and publish
3. Published workflows execute with correct data flow between nodes
4. Cron-scheduled workflows run automatically at the specified time
5. Credit balance prevents execution when insufficient; credits are deducted on success
