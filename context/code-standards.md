# Code Standards

## General

- Keep modules small and single-purpose — one concern per file
- Fix root causes, do not layer workarounds
- Do not mix unrelated concerns in one component or route
- Use Zod for input validation at all system boundaries
- Prefer server actions over direct API calls where possible

## TypeScript

- Strict mode is NOT configured in tsconfig.json — add it for new code
- Use explicit types — minimize use of `any` (see `AppNodeData: [key: string]: any`
  in types/appNode.ts as an anti-pattern to avoid in new code)
- Validate unknown external input at system boundaries before trusting
- Enum naming: PascalCase for enum name and SCREAMING_SNAKE_CASE for values
  (see TaskType, ExecutionPhaseStatus, etc.)
- Use `satisfies` operator for type-safe config objects (see task definitions)

## Next.js (App Router)

- **Server Components by default** — add `"use client"` only when browser
  interactivity requires it (hooks, event handlers, browser APIs)
- **Server Actions** — use `"use server"` directive for form submissions and
  data mutations (see `actions/` directory)
- **API Routes** — keep route handlers focused on a single responsibility
- **Route Groups** — use `(dashboard)`, `(auth)` for layout grouping
- **Next.js 14** — App Router, not Pages Router

## Styling

- Use Tailwind utility classes — no hardcoded styles
- Use shadcn/ui CSS custom properties for colors (--background, --primary, etc.)
- Follow the border radius scale defined in `ui-context.md`
- Use `cn()` utility from `lib/utils.ts` for conditional class merging
- Dark/light mode: use `dark:` prefix for mode-specific styles

## API Routes

- Validate and parse request input before any logic runs (Zod schemas in `schemas/`)
- Enforce auth (`auth()` from Clerk) and ownership before any mutation
- Return consistent response shapes — use `Response.json({ error, status })`
- Internal cron endpoints use Bearer token auth with `timingSafeEqual`
- All API responses should have proper Content-Type headers

## Data and Storage

- **Metadata belongs in Prisma/SQLite** — workflow definitions, execution plans,
  user balances, logs
- **Workflow definitions stored as JSON strings** — parsed at execution time
  (see `JSON.parse(workflow.defination)` pattern in executeWorkflow.tsx)
- **Do not store large content in the database** — execution outputs are stored
  as JSON strings but should be capped; large AI responses should be streamed
- **Use Prisma transactions for credit operations** — user balance updates must
  be atomic with execution state changes
- **Prisma schema is the source of truth** — run `npx prisma generate` after
  schema changes and `npx prisma migrate dev` for migrations

## File Organization

- `app/` — Next.js App Router pages and API routes
- `lib/` — Core business logic, workflow engine, executors
- `api/` — Standalone Python MCP servers and workflow generator
- `actions/` — Next.js Server Actions (one file per action group)
- `components/` — Shared React components
  - `components/ui/` — shadcn/ui generated components (do not manually edit)
  - `components/providers/` — React context providers
  - `components/magicui/` — Custom animated UI components
- `hooks/` — Custom React hooks (one hook per file)
- `types/` — TypeScript type definitions
- `schemas/` — Zod validation schemas
- `status/` — Enums and status types
- `prisma/` — Schema and migrations
- `public/` — Static assets and custom icons
