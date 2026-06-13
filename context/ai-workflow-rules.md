# AI Workflow Rules

## Approach

Build Flowbits incrementally using a spec-driven workflow. Context files define
what to build, how to build it, and the current state of progress. Always implement
against these specs — do not infer or invent behavior from scratch.

The project architecture: TypeScript/Next.js for the web app, Cline AgentRuntime for agent orchestration, and standalone Python MCP servers for platform connectors. Respect this boundary — do not mix concerns.

## Scoping Rules

- Work on one feature unit at a time
- Prefer small, verifiable increments over large speculative changes
- Do not combine unrelated system boundaries in a single implementation step
- Adding a new AI model node means: task definition + executor (TS) +
  executor (Python) + agent creator support + frontend UI — scope accordingly

## When to Split Work

Split an implementation step if it combines:

- UI changes and backend execution changes (separate frontend from Python API work)
- Multiple unrelated API routes (each route = independent unit)
- Node type definition changes and execution engine changes (different concerns)
- Database schema changes and UI changes (migrate first, then build UI)

If a change cannot be verified end to end quickly, the scope is too broad — split it.

## Handling Missing Requirements

- Do not invent product behavior not defined in the context files
- If a requirement is ambiguous, resolve it in the relevant context file before
  implementing
- If a requirement is missing, add it as an open question in `progress-tracker.md`
  before continuing
- For existing workflows, study the pattern (e.g., how OpenAI node was added) and
  replicate it exactly for new similar nodes

## Protected Files

Do not modify the following unless explicitly instructed:

- `components/ui/*` — shadcn/ui generated library components (these are generated
  by `npx shadcn-ui@latest add`)
- `prisma/migrations/*` — Existing migrations (create new migrations, don't edit old ones)
- `public/*` — Static assets (except custom icons for new node types)
- Any third-party library internals

## Keeping Docs in Sync

Update the relevant context file whenever implementation changes:

- System architecture or boundaries → `architecture.md`
- Storage model decisions → `architecture.md`
- Code conventions or standards → `code-standards.md`
- Feature scope → `project-overview.md`
- UI patterns or design tokens → `ui-context.md`

## Before Moving to the Next Unit

1. The current unit works end to end within its defined scope
2. No invariant defined in `architecture.md` was violated
3. `progress-tracker.md` reflects the completed work
4. `npm run build` passes (Next.js)
5. Prisma client is regenerated if schema changed (`npx prisma generate`)
6. Python syntax is valid for MCP servers (`python3 -m py_compile api/mcp/*.py`)
