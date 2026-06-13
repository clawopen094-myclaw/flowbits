# Architecture Context

## Stack

| Layer        | Technology                                      | Role                              |
| ------------ | ----------------------------------------------- | --------------------------------- |
| Framework    | Next.js 14 (App Router) + TypeScript 5          | Full-stack React framework        |
| UI           | Tailwind CSS 3 + Radix UI + shadcn/ui patterns  | Styling and component primitives  |
| Auth         | Clerk (@clerk/nextjs v6)                        | Authentication and user management |
| Database     | Prisma ORM v6 + SQLite (dev.db)                 | Data persistence                  |
| API (Python) | FastAPI (uvicorn) + pydantic-ai                 | Heavy AI/browser execution        |
| Workflow UI  | @xyflow/react v12 (React Flow)                  | Node-based visual editor          |
| Scheduling   | Cron-based (cron-parser + Vercel Cron trigger)  | Automated workflow execution      |
| Animations   | Framer Motion + motion v12                      | UI animations                     |

## System Boundaries

- `app/` — Next.js App Router: pages, layouts, API routes
  - `app/(auth)/` — Clerk sign-in/sign-up pages
  - `app/(dashboard)/` — Home, Workflows, Billing, Credentials pages
  - `app/workflow/` — Visual flow editor and execution viewer
  - `app/api/` — Next.js API routes (workflow execute, cron trigger)
- `lib/` — Core logic: workflow engine, executors, task definitions, execution plan
  - `lib/workflow/executor/` — TypeScript executors that call FastAPI
  - `lib/workflow/task/` — Node type definitions (inputs, outputs, params)
- `api/` — Python FastAPI backend for heavy execution
  - `api/nodes/` — Per-node execution functions (OpenAI, Gemini, LaunchBrowser)
  - `api/utils/agents/` — AgentCreator: pydantic-ai agent factory
  - `api/utils/tools/` — Agent tools (roll_die, get_player_name)
- `actions/` — Next.js Server Actions (workflows, analytics, billing, credentials)
- `components/` — Shared React components (ui/, providers/, magicui/)
- `hooks/` — Custom React hooks (execution plan, flow validation)
- `prisma/` — Database schema and migrations
- `types/` — TypeScript type definitions

## Storage Model

- **SQLite (via Prisma)**: All persistent data
  - `Workflow` — name, definition (JSON), execution plan, cron, status
  - `WorkflowExecution` — trigger type, status, phases, credits consumed
  - `executionPhase` — per-node execution: inputs, outputs, status, logs
  - `ExecutionLogs` — log entries per phase
  - `SystemVariables` — user-defined key-value secrets (API keys, etc.)
  - `UserBalance` — per-user credit balance

## Data Flow

```
User Canvas → FlowToExecutionPlan() → executionPlan (topo-sorted phases)
                    ↓
runWorkflow() → CREATE WorkflowExecution + phases → ExecuteWorkflow()
                    ↓
           For each phase → executeWorkflowPhase()
                    ↓
        Cline AgentRuntime → callTool(toolName, input)
                    ↓
              Tool execute() → MCP server / external API
                    ↓
              Result flows back → setOutputs → next phase picks up input
```

## Auth and Access Model

- Every user signs in via Clerk (GitHub/Google/email OAuth)
- Every workflow/workflow execution is owned by a userId
- All mutations check `auth()` from Clerk before proceeding
- API routes use Bearer token (SECRET_KEY) for internal cron triggers

## Invariants

1. Workflow execution is always sequential — phases run one at a time, in order,
   with no parallelism within a single execution
2. Every execution checks credit balance BEFORE running — if insufficient,
   the entire execution fails before any phase runs
3. TypeScript executors are thin proxies — they extract inputs, call FastAPI
   via axios, and set outputs; no business logic lives in executors
4. Node-to-node data flow is strictly via edge connections — a node's output
   can only reach another node if an edge connects them (sourceHandle → targetHandle)
5. Published workflows have a frozen execution plan — the plan is generated at
   publish time and stored; running a published workflow uses the stored plan
6. Request handlers (API routes, server actions) never run long-lived work —
   they delegate to ExecuteWorkflow() which runs asynchronously
