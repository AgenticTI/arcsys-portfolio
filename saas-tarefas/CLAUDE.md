# CLAUDE.md — Hazel Task Manager

This file is the authoritative guide for any AI agent working in this repository.
Read it fully before making any change. Follow these instructions exactly.

---

## 1. Project Overview

**Hazel** is a portfolio SaaS task manager built as a frontend-only demo (no backend, no auth, no database). Its purpose is to showcase a polished, production-quality UI for a multi-project Kanban/list task management app.

The app has three routes:
- `/dashboard` — overview of all tasks across all projects (summary cards, weekly chart, upcoming tasks)
- `/board/[projectId]` — per-project task list with drag-and-drop reordering, status filters, and a slide-in task detail panel
- `/settings` — static profile display and a toggle-based preferences panel

The root `/` redirects immediately to `/dashboard`.

All data is mocked (no API calls). State is managed client-side with Zustand and persisted to `localStorage` under the key `"hazel-tasks"`.

---

## 2. Tech Stack

| Tool | Version | Role |
|---|---|---|
| Next.js | 14.2.35 | App Router, SSR shell, file-based routing |
| React | 18 | UI |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 3.4.1 | All styling — no CSS modules, no styled-components |
| Zustand | 5.0.12 | Global client state with `persist` middleware |
| @dnd-kit/core | 6.3.1 | Drag-and-drop engine |
| @dnd-kit/sortable | 10.0.0 | Sortable list primitives |
| @dnd-kit/utilities | 3.2.2 | CSS transform helpers |
| Framer Motion | 12.38.0 | Animations (task card checkbox, detail panel slide-in/out) |
| Lucide React | 0.577.0 | Icons throughout the app |

There is no testing framework, no Storybook, no external UI component library.

---

## 3. Folder Structure

```
saas-tarefas/
├── src/
│   ├── app/                        # Next.js App Router pages
│   │   ├── layout.tsx              # Root layout: wraps everything in <AppShell>
│   │   ├── page.tsx                # Redirects / → /dashboard
│   │   ├── globals.css             # Tailwind directives only (no custom classes here)
│   │   ├── dashboard/
│   │   │   └── page.tsx            # Dashboard page — assembles feature components
│   │   ├── board/
│   │   │   └── [projectId]/
│   │   │       └── page.tsx        # Board page — dynamic route per project
│   │   └── settings/
│   │       └── page.tsx            # Settings page
│   │
│   ├── components/                 # Shared, reusable, dumb components
│   │   ├── layout/
│   │   │   ├── AppShell.tsx        # Sidebar + main content wrapper (h-screen, overflow-hidden)
│   │   │   └── Sidebar.tsx         # Navigation, project list, user footer
│   │   └── ui/
│   │       ├── Avatar.tsx          # Initials-based avatar, size="sm"|"md"
│   │       └── PriorityBadge.tsx   # Colored pill for priority values
│   │
│   ├── features/                   # Feature-scoped components (own their domain logic)
│   │   ├── board/
│   │   │   ├── KanbanCounters.tsx  # 3-column status counter cards (also act as filters)
│   │   │   ├── TaskCard.tsx        # Single task row with inline status cycling
│   │   │   ├── TaskDetailPanel.tsx # Animated slide-in panel (Framer Motion)
│   │   │   └── TaskList.tsx        # DnD-enabled sortable list; contains SortableTaskCard
│   │   ├── dashboard/
│   │   │   ├── SummaryCards.tsx    # Due today / In progress / Completed counts
│   │   │   ├── UpcomingTasks.tsx   # Top-3 non-done tasks sorted by dueDate
│   │   │   └── WeeklyChart.tsx     # Static bar chart (hardcoded weekly data)
│   │   └── settings/
│   │       ├── PreferencesSection.tsx  # Notifications toggle + theme info
│   │       └── ProfileSection.tsx      # Displays mockUser data
│   │
│   ├── store/
│   │   └── useTaskStore.ts         # Single Zustand store for all app state
│   │
│   └── data/
│       └── mock.ts                 # All types + all mock data (projects, tasks, user)
│
├── tailwind.config.ts              # Custom color tokens (all semantic names)
├── tsconfig.json                   # Path alias: @/ → ./src/
├── next.config.mjs                 # Empty — no custom config needed
└── package.json
```

---

## 4. Essential Commands

```bash
# Start dev server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Serve production build
npm run start

# ESLint (Next.js ruleset)
npm run lint
```

There is no `typecheck` script in `package.json`. Run TypeScript manually if needed:

```bash
npx tsc --noEmit
```

---

## 5. Architecture Decisions

### Why @dnd-kit instead of react-beautiful-dnd
`react-beautiful-dnd` is unmaintained. `@dnd-kit` is the modern standard: it is accessible by default (keyboard drag support via `KeyboardSensor`), works in React 18 strict mode, and has no dependency on `ReactDOM.findDOMNode`. The app uses `PointerSensor` + `KeyboardSensor` with `sortableKeyboardCoordinates`.

### How drag-and-drop is wired
Drag operates on the **full project task list** (unfiltered), but only the filtered subset is rendered. `SortableContext` always receives the full `projectTasks` id array — this is intentional to maintain stable indices during drag. `reorderTasks` in the store takes an ordered id array and rebuilds the tasks array for that project.

### Zustand store shape
The single store (`useTaskStore`) owns:
- `tasks: Task[]` — flat array of all tasks across all projects; filter by `projectId` at the component level
- `activeProjectId: string` — which project the sidebar highlights; set on sidebar click
- `selectedTaskId: string | null` — drives the detail panel open/closed state

The store uses `zustand/middleware/persist` and serializes to `localStorage` key `"hazel-tasks"`. The initial value is `mockTasks` from `src/data/mock.ts` — on first load, if `localStorage` is empty, mock data populates it.

### Page components are thin orchestrators
Pages (`app/*/page.tsx`) do not contain UI logic. They import feature components, read minimal store state, and pass props down. All real logic lives in `features/`.

### Framer Motion usage
Used in exactly two places:
1. `TaskCard.tsx` — the animated filled dot inside the round checkbox when a task is `done`
2. `TaskDetailPanel.tsx` — `AnimatePresence` + `motion.aside` for the slide-in panel (`x: "100%" → 0`) and its dim backdrop

Do not add Framer Motion to components that do not need it.

### Tailwind semantic color tokens
All colors are semantic aliases defined in `tailwind.config.ts`. Never hardcode hex values in components. Use these tokens:
- `bg-sidebar`, `bg-main`, `bg-card`
- `accent`, `accent-soft`
- `text-primary`, `text-muted`
- `border`
- `priority-high`, `priority-medium`, `priority-low`

---

## 6. Code Conventions

### "use client" directive
Any component that uses hooks (`useState`, `useTaskStore`, `usePathname`, etc.) or browser APIs must have `"use client"` as its first line. Server components (`app/*/page.tsx` that only import and compose) omit it. Check existing files to see the pattern.

### Component naming
- All components are named exports (no `export default` inside `components/` or `features/`)
- Pages use `export default function` (Next.js requirement)
- Component file names match the exported function name exactly: `TaskCard.tsx` exports `TaskCard`

### Where to put new components
- Generic, reusable, stateless UI primitives → `src/components/ui/`
- Layout wrappers → `src/components/layout/`
- Feature-specific components that touch store state or domain logic → `src/features/<featureName>/`
- Do not create new top-level directories without a clear reason

### Props typing
Always define a local `type Props = { ... }` above the component. Do not use `React.FC<Props>` — use plain function syntax with typed parameters.

### Imports
Use the `@/` path alias for all internal imports (configured in `tsconfig.json`). Never use relative `../` paths that cross feature or component boundaries.

### No inline styles
Prefer Tailwind classes. The only exception is dynamic values that cannot be expressed as classes, such as project color dots: `style={{ backgroundColor: project.color }}`.

---

## 7. Mock Data

All mock data lives in `src/data/mock.ts`. It also defines all shared TypeScript types.

**Types exported from mock.ts:**
- `Priority` — `"high" | "medium" | "low"`
- `Status` — `"todo" | "in_progress" | "done"`
- `Subtask` — `{ id, title, completed }`
- `Task` — `{ id, projectId, title, description, priority, status, dueDate, subtasks, createdAt }`
- `Project` — `{ id, name, color, taskCount }`
- `User` — `{ name, email, avatarInitials }`

**Exported mock values:**
- `mockUser` — single user object (name: "Leon", email: "leon@hazel.app")
- `mockProjects` — array of 3 projects: `p1` Website Redesign, `p2` Mobile App, `p3` Marketing Q2
- `mockTasks` — array of 12 tasks distributed across projects (4-5 per project)

**How mock data flows into the app:**
1. `useTaskStore` initializes `tasks` with `mockTasks` and `activeProjectId` with `mockProjects[0].id`
2. The store's `persist` middleware saves to `localStorage`; on subsequent loads the persisted state overrides the initial mock values
3. `mockProjects` and `mockUser` are imported **directly** in components that need them (Sidebar, UpcomingTasks, ProfileSection) — they are not in the store
4. `WeeklyChart` has its own locally hardcoded `weeklyData` array — it is completely static and not derived from tasks

**To reset to initial mock state:** clear `localStorage` key `"hazel-tasks"` in DevTools.

---

## 8. How to Add a New Feature

Example: adding a "Labels" field to tasks.

**Step 1 — Extend the types and mock data.**
In `src/data/mock.ts`, add the new field to the `Task` type and update `mockTasks` entries to include it.

**Step 2 — Update the store if mutation is needed.**
In `src/store/useTaskStore.ts`, add a new action to `TaskStore` and implement it in the `create` call.

**Step 3 — Create a feature component.**
Add a new file under the relevant `src/features/<feature>/` folder. Use `"use client"` if it reads from the store. Type its props with a local `type Props`.

**Step 4 — Wire it into the page.**
Import the component into the relevant `src/app/*/page.tsx` and place it in the layout.

**Step 5 — Style with Tailwind tokens.**
Use existing semantic color tokens from `tailwind.config.ts`. Add new tokens to the config only if needed for the feature's unique color requirements.

**Step 6 — No backend needed.**
This is a frontend-only demo. All persistence is through the Zustand `persist` middleware into `localStorage`. Do not add `fetch` calls, API routes, or server actions unless explicitly requested.
