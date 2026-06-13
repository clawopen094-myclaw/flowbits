# UI Context

## Theme

Built with shadcn/ui components on top of Tailwind CSS. Supports both light and dark
themes via next-themes. The design language uses Radix UI primitives for accessible,
composable components. Visual identity is clean, modern, with subtle gradients and
glow effects for interactive elements.

The theme is toggled via `components/themeToogle.tsx` and wrapped in
`components/theme-provider.tsx`.

## Colors

Using Tailwind CSS 3 with shadcn/ui CSS variable system (defined in `app/globals.css`
via `@layer base`). Colors adapt to light/dark mode.

| Role            | CSS Variable           | Description                   |
| --------------- | ---------------------- | ----------------------------- |
| Page background | `--background`         | Root page/surface background  |
| Foreground      | `--foreground`         | Primary text color            |
| Card            | `--card`               | Card/surface background       |
| Card foreground | `--card-foreground`    | Card text                     |
| Primary         | `--primary`            | Primary action/accent color   |
| Primary fg      | `--primary-foreground` | Text on primary               |
| Muted           | `--muted`              | Secondary surface             |
| Muted fg        | `--muted-foreground`   | Secondary text                |
| Accent          | `--accent`             | Highlight/selected states     |
| Border          | `--border`             | Default border color          |
| Destructive     | `--destructive`        | Error/delete actions          |

## Typography

| Role         | Font                         | Variable      |
| ------------ | ---------------------------- | ------------- |
| UI text      | Inter (via next/font/google) | `--font-sans` |
| Default      | System sans-serif fallback   | Default       |

All typography uses Tailwind's text size scale. No custom font sizes outside the scale.

## Border Radius

| Context           | Tailwind Class     |
| ----------------- | ------------------ |
| Inline / small UI | `rounded-sm`       |
| Cards / panels    | `rounded-lg`       |
| Modals / overlays | `rounded-lg`       |
| Buttons           | `rounded-md`       |
| Inputs            | `rounded-md`       |

Radius is consistent across the app via the shadcn/ui system — defined in
`tailwind.config.ts` and applied through the component library.

## Component Library

shadcn/ui on top of Tailwind CSS 3. Components live in `components/ui/`.
Use the shadcn CLI (`npx shadcn-ui@latest add`) to add new components rather
than writing from scratch. The library includes ~40+ components (accordion,
dialog, select, table, tabs, command, carousel, etc.).

Additional libraries:
- **Lucide React** — stroke-based icons. Sizes: `h-4 w-4` for inline, `h-5 w-5` for buttons
- **@tabler/icons-react** — supplementary icons
- **@fortawesome** — brand icons (free-brands-svg-icons)
- **Recharts** — charts (credits usage, execution stats, monthly runs)
- **Framer Motion** — animations and transitions
- **@xyflow/react** — node editor canvas
- **Sonner** — toast notifications

## Layout Patterns

- **Dashboard**: Sidebar navigation (collapsible via `components/ui/sidebar.tsx`) +
  content area with breadcrumb header
- **Workflow Editor**: Full-viewport split canvas —
  left sidebar (node palette with toggle), center canvas (React Flow), right sidebar
  (node settings), bottom bar (run/publish actions)
- **Modals**: Centered overlay with backdrop blur via `@radix-ui/react-dialog`
- **Navigation**: Icon dock menu (`components/DockMenu.tsx`) + top breadcrumb header
- **Data Tables**: Reusable data table pattern with faceted filters, column headers,
  pagination, row actions — built on @tanstack/react-table v8

## Icons

Lucide React (primary). Stroke-based icons only. Custom icons for AI providers
in `public/icons/` (OpenAiIcon, GeminiIcon). Sizes: `h-4 w-4` for inline,
`h-5 w-5` for buttons, custom sizes for node cards.
