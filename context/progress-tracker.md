# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

- **Codebase inspection and context initialization** — Complete

## Current Goal

- Context file system initialized for Flowbits project

## Completed

- [x] Cloned and inspected Flowbits codebase (274 files)
- [x] Read all core files: schema, workflow engine, executors, task definitions,
  API routes, Python backend, UI components
- [x] Initialized `context/` directory with 6 context files:
  - `project-overview.md` — Product definition, goals, features, scope
  - `architecture.md` — Stack, boundaries, data flow, invariants
  - `ui-context.md` — Theme, colors, typography, component conventions
  - `code-standards.md` — TypeScript, Next.js, styling, API, data rules
  - `ai-workflow-rules.md` — Scoping, splitting, protected files, delivery
  - `progress-tracker.md` — This file
- [x] Created `CLAUDE.md` at project root as bootstrap

## In Progress

- None yet.

## Next Up

- TBD — awaiting user direction

## Open Questions

- Is SQLite production-ready? The schema uses SQLite (`dev.db`). For production deployment, PostgreSQL would be more appropriate.
- `NEXT_DBU` environment variable points to the FastAPI backend — what is the production value?
- Vercel Cron Jobs trigger `/api/workflows/cron` — is this configured in production?
- The python `/api/` directory has `__pycache__/` committed to git — should be in `.gitignore`
- `executeWorkflow.tsx` imports `toast from "sonner"` on line 15 but server code shouldn't use client-side toast
- `OpenAI.py` line 29 has a hardcoded test string `'Where does \"hello world\" come from?'` instead of using the actual input
- TypeScript `any` types in `executeWorkflow.tsx` (lines 85, 126, 193, 209, 216) — should be narrowed
- `cron/route.ts` line 35 has trailing backticks (syntax error) and uses bare `fetch()` without await

## Architecture Decisions

- **Dual-language architecture (TS + Python)**: The Next.js app handles auth, UI, and coordination. Python/FastAPI handles heavy LLM and browser execution via pydantic-ai. This separation means the Node.js event loop isn't blocked by AI generation.
- **SQLite for dev**: Development uses SQLite for zero-config setup. Production would benefit from PostgreSQL for concurrent write safety during cron + manual executions.
- **Credit check before execution**: Credits are checked once at the start of execution. If a phase fails, credits for that phase are still consumed — this is a business decision, not a bug.
- **Sequential execution only**: Despite the graph editor allowing complex DAGs, execution is strictly sequential (ordered by topo-sort). No parallelism between phases.

## Session Notes

- 2026-06-12: Initial codebase inspection. Deep-read all core files. Generated 7 context files covering the full project.
- Project located at: `/tmp/flowbits/`
- Total: 274 files, ~20 TypeScript source, ~6 Python source, 50+ UI components
- Key finding: The workflow engine is well-structured but has several production-readiness issues (hardcoded strings, type holes, unawaited promises)
