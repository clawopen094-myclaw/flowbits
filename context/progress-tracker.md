# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

- **Phase 1: Agent Chat MVP** — Complete ✅

## Current Goal

- Agent Chat page live at `/agent` — conversational workflow builder with streaming

## Completed

- [x] Deep architecture research: Flowbits codebase, Cline SDK, MCP ecosystem
- [x] Product design: Agent Chat → Workflow → Execute pipeline
- [x] Tech stack decision: Flowbits skeleton + Cline SDK + FastMCP + PostgreSQL
- [x] Written all 7 context files (CLAUDE.md + 6 context/ files)
- [x] Initialized ContentFlow project from Flowbits base (269 files)
- [x] Added 6 new Prisma models (SocialAccount, Asset, McpConnection, AgentConversation, ContentCalendar)
- [x] Fixed 3 pre-existing Flowbits build errors (key prop, hook rules, type annotation)
- [x] Created Cline SDK integration module (`lib/cline/index.ts`) with 4 content tools
- [x] Built Agent Chat page (`app/agent/page.tsx`) — chat UI, streaming mock, tool call display
- [x] Built SSE streaming API route (`app/api/agent/chat/route.ts`)
- [x] Built Python workflow generator (`api/agent/workflow_generator.py`)
- [x] Updated DockMenu with Agent Chat nav link (Sparkles icon)
- [x] Added `/agent` to public routes in middleware.ts

## In Progress

- None — Phase 1 complete

## Next Up

- Phase 2: Real Cline SDK agent (replace mocks with @cline/agents AgentRuntime)
  - [ ] Fix npm install for @cline packages (currently optionalDependencies)
  - [ ] Wire lib/cline/index.ts into SSE API route
  - [ ] Real tool execution (scrape_trends → web, generate_content → LLM, etc.)
  - [ ] Tool streaming in chat UI
- Phase 3: Workflow generation from chat
  - [ ] Chat → WorkflowDefinition translation
  - [ ] Workflow opens in visual editor
  - [ ] Real pydantic-ai agent (replace template-based generator)
- Phase 4: MCP platform connectors
  - [ ] LinkedIn MCP server (FastMCP)
  - [ ] MCP Hub client (connect, discover, execute)
  - [ ] SocialAccount OAuth flow
- Phase 5: Testing & Polish
  - [ ] Chrome DevTools MCP testing
  - [ ] End-to-end pipeline
  - [ ] Bug fixes

## Open Questions

- Cline SDK npm: installed as optionalDependencies to avoid build failures.
  Need to fix version compatibility before Phase 2.
- Clerk auth: `/agent` made public for dev. Production needs proper auth.
- Chrome DevTools MCP: unavailable this session (protocol error).
  Need to test frontend in next session.
- PostgreSQL migration: defer to Phase 4. SQLite fine for Phase 1-3.
- Video generation (Runway): v2 scope, not v1.

## Architecture Decisions

- **Cline SDK over custom agent loop** — Saves ~3,600 lines. Gives tool registry,
  cron, MCP client, session persistence for free.
- **PostgreSQL over SQLite** — Deferred to Phase 4. Needed for concurrent writes.
- **FastMCP for platform connectors** — Each platform = one MCP server. Zero
  platform code in core. New platform = new MCP server.
- **Dual-language (TS + Python)** — TypeScript for web + workflow orchestration.
  Python for MCP servers and content generation. Cline bridges via MCP protocol.
- **Dark theme default** — Platform is a creator workspace.
- **Agent Chat as primary UX** — Natural language → workflow, not node editor first.

## Session Notes

- 2026-06-12-13: Full ContentFlow Phase 1 delivered.
- Project at: `/tmp/contentflow/`
- Context files: `/tmp/contentflow/context/*.md` (7 files, 642 lines)
- Phase 1 files delivered: 6 new files, 3 fixes, 1 schema change
- Dev server: running on localhost:3000 (HTTP 200 confirmed)
- Agent page verified via curl — HTML renders with agent/page.js chunk
