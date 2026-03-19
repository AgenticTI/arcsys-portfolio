# Spec — Hazel Missing Pages: Calendar, Reports, Docs

**Date:** 2026-03-19
**Project:** `saas-tarefas/` — Hazel Task Manager
**Status:** Approved for implementation

---

## Overview

Three routes referenced in the Sidebar (`/calendar`, `/reports`, `/docs`) return 404. This spec defines functional, portfolio-quality pages for each — not placeholders. All pages are frontend-only, use existing mock data, and follow the established patterns (Zustand, Tailwind semantic tokens, `"use client"` where needed).

---

## 1. `/calendar` — Gantt Timeline

### Purpose
A timeline view of tasks plotted by date, styled after tools like Linear/Asana. Gives a visual sense of project workload over time.

### Layout
- **Header:** page title "Calendar" + period navigation (← `Mar 2026` →) + project filter chips
- **Gantt grid:** two-column layout — fixed left column (180px) with task names, right column with the time axis and bars

### Gantt Grid Details
- Each row = one task from `tasks` store
- Bar color = `project.color` from `mockProjects` (matched via `task.projectId`)
- Bar position and width calculated from `task.createdAt` (start) and `task.dueDate` (end), relative to the visible period
- All tasks in `mockTasks` have `dueDate` — no null handling needed (Task type has `dueDate: string`, non-nullable)
- Vertical line highlighting "today" across all rows
- Hover tooltip on each bar: task title, project name, status, due date

### Gantt Bar Position Math
- Visible period: `[periodStart, periodEnd]` — first and last day of the current month
- `leftPercent = max(0, (taskStart - periodStart) / periodDuration) * 100`
- `widthPercent = (min(taskEnd, periodEnd) - max(taskStart, periodStart)) / periodDuration * 100`
- Minimum width: 1 day-unit (approximately `100 / daysInMonth` percent) so same-day tasks remain visible
- If a task falls entirely outside the visible period (start and end both out of range), hide the row
- If a task starts before `periodStart`, the bar clips to the left edge (leftPercent = 0)
- If a task ends after `periodEnd`, the bar clips to the right edge

### Period Navigation
- Default: current month (2026-03 at time of writing, but computed dynamically from `new Date()`)
- `←` / `→` buttons navigate one month at a time
- Time axis labels: day numbers at 1, 7, 14, 21, and last day of month

### Filtering
- One chip per project in the header, all active by default
- Click toggles visibility of that project's tasks
- Fade animation on filter change (Framer Motion `AnimatePresence` + `motion.div` on each row)
- Empty state: centered message "Nenhuma tarefa neste período" when no tasks pass the filter

### Data
- Reads `tasks` and `mockProjects` — no new store state needed
- Date math: compare task dates against `[periodStart, periodEnd]` window using native `Date` arithmetic

### Files to create
- `src/app/calendar/page.tsx` — thin page orchestrator
- `src/features/calendar/GanttChart.tsx` — main Gantt component (owns period state + filter state)
- `src/features/calendar/GanttBar.tsx` — single task row with positioned bar and tooltip
- `src/features/calendar/PeriodNav.tsx` — header with period nav + filter chips

---

## 2. `/reports` — Analytics Dashboard

### Purpose
Shows productivity metrics and project health. All data derived from the live `tasks` array in the Zustand store.

### Layout
Four stacked sections, all reactive to the selected period tab:

1. **Period tabs** — "Esta semana" / "Este mês" / "Total"
2. **Hero section** — large task completion count + mini bar chart + two secondary numbers
3. **Metric cards row** — 3 smaller KPI cards
4. **Project cards row** — one card per project

### Period Logic
- **Esta semana:** tasks where `dueDate` falls in the current ISO week (Mon–Sun)
- **Este mês:** tasks where `dueDate` falls in the current calendar month
- **Total:** all tasks, no date filter
- "Completed in period" means: `status === "done"` AND `dueDate` within the period window. This is a deliberate simplification — there is no `completedAt` field in the data model. It reads as "tasks that were due this period and are now done."

### `usePeriodFilter` Hook Signature
```ts
type PeriodTab = "week" | "month" | "total"

type PeriodData = {
  tasks: Task[]           // tasks in selected period (filtered by dueDate)
  completedCount: number  // tasks where status === "done"
  inProgressCount: number // tasks where status === "in_progress"
  todoCount: number       // tasks where status === "todo"
  completionRate: number  // completedCount / tasks.length, 0 if empty
}

function usePeriodFilter(period: PeriodTab): PeriodData
```

### Hero Section
- Large bold number: `completedCount` from `usePeriodFilter`
- Mini bar chart inline: 7 hardcoded bars for week view (same pattern as existing `WeeklyChart`), 4 bars for month, 1 bar for total — visual decoration, not derived from real data
- Secondary numbers: `inProgressCount` and `todoCount`
- Background: `bg-card` with `accent/10` overlay tint
- Tab switch animation: simple CSS opacity transition (0.15s) on the hero number — no external library needed

### Metric Cards (row of 3)
- **Tasks concluídas:** `completedCount` — absolute number for the selected period (replaces Streak, which requires a non-existent `completedAt` field)
- **Taxa de conclusão:** `completionRate` formatted as percentage (e.g. "67%")
- **Alta prioridade concluídas:** count of tasks with `priority === "high"` AND `status === "done"` within the period

### Project Cards (row of 3, one per project)
- Project color as card accent (left border or background tint)
- Project name + colored dot
- Progress bar: `done tasks / total tasks` — both computed from `tasks.filter(t => t.projectId === project.id)`, **not** from `project.taskCount` (which is stale after mutations)
- Task counts label: "X/Y concluídas"
- Overdue badge if any task in the project has `dueDate < today` and `status !== "done"`

### Data
- All computed inside `usePeriodFilter` hook from `useTaskStore().tasks`
- Date utilities: small inline helpers in `src/features/reports/dateUtils.ts` using native `Date` and `Intl` — no external library

### Files to create
- `src/app/reports/page.tsx`
- `src/features/reports/ReportsHero.tsx`
- `src/features/reports/MetricCards.tsx`
- `src/features/reports/ProjectCards.tsx`
- `src/features/reports/usePeriodFilter.ts`
- `src/features/reports/dateUtils.ts` — `getWeekRange()`, `getMonthRange()` helpers

---

## 3. `/docs` — Wiki per Project

### Purpose
Each project has editable wiki pages stored in Zustand. Demonstrates document management in a task manager SaaS.

### Layout
Two-column layout:
- **Sidebar (200px fixed):** project list + page list for selected project
- **Content area:** read or edit mode for the selected page

### Sidebar
- **Projects section:** lists all 3 `mockProjects` with colored dot; clicking selects the project and auto-selects its first page
- **Pages section:** lists pages belonging to selected project; active page highlighted with left yellow border + `text-accent` color
- **"+ Nova página" button:** at the bottom of the pages list; triggers edit mode with empty title/content
- **Delete page:** small trash icon on page list item hover — **disabled (grayed out, non-clickable) if it's the project's only page**, preventing an empty state. The empty state for "no pages" is therefore only a theoretical guard and should still be implemented as a safety net, but will not be reachable in normal usage.

### Content Area — Read Mode
- Page title (large, bold, `text-primary`)
- Metadata line: "Atualizado há X dias · [Project name]" — relative time computed with a simple inline helper using `Intl.RelativeTimeFormat('pt-BR', { style: 'long' })` and native `Date` arithmetic
- Horizontal divider
- Page content rendered with `whitespace-pre-wrap` (no markdown parsing)
- "Editar" button top-right

### Content Area — Edit Mode
- Title becomes an `<input>` (auto-focused on mount)
- Content becomes a `<textarea>` with `font-mono` class
- "Cancelar" and "Salvar" buttons top-right
- Saving calls `updatePage` action, sets `updatedAt` to `new Date().toISOString()`, persists via Zustand

### Empty State (safety net only)
- Centered message "Nenhuma página ainda. Crie a primeira." + button "+ Nova página"
- Only reachable if all pages were deleted (cannot happen via normal UI due to last-page guard)

### WikiPage Type
```ts
type WikiPage = {
  id: string
  projectId: string
  title: string
  content: string
  updatedAt: string // ISO date string
}
```

Add to `src/data/mock.ts` alongside existing types and mock arrays.

### Mock Data — `mockPages`
Six initial pages — two per project, with explicit IDs:

```ts
export const mockPages: WikiPage[] = [
  { id: "wp1", projectId: "p1", title: "Overview",    content: "Redesign completo do site corporativo.\n\nObjetivos: aumentar conversão em 30%.\nPrazo: Q2 2026.\nStakeholders: Leon (dev), Ana (design), Carlos (PM).", updatedAt: "2026-03-17T10:00:00Z" },
  { id: "wp2", projectId: "p1", title: "Brief",       content: "O cliente solicitou um redesign focado em mobile-first.\n\nRequisitos principais:\n- Nova identidade visual\n- Performance acima de 90 no Lighthouse\n- Integração com CRM existente", updatedAt: "2026-03-14T14:30:00Z" },
  { id: "wp3", projectId: "p2", title: "Overview",    content: "App mobile para iOS e Android.\n\nStack: React Native + Expo.\nTarget: usuários B2C, 18-35 anos.\nLançamento previsto: Julho 2026.", updatedAt: "2026-03-16T09:15:00Z" },
  { id: "wp4", projectId: "p2", title: "Sprint Notes", content: "Sprint 1 (Mar 11-18):\n✓ Setup do projeto e CI/CD\n✓ Tela de login e autenticação\n→ Push notifications (em progresso)\n\nSprint 2 (Mar 18-25):\n- Feed principal\n- Profile screen", updatedAt: "2026-03-18T16:00:00Z" },
  { id: "wp5", projectId: "p3", title: "Overview",    content: "Campanha de marketing para o Q2 2026.\n\nCanais: Google Ads, Instagram, LinkedIn.\nOrçamento: R$ 45.000.\nKPIs: 500 leads qualificados, CAC < R$ 90.", updatedAt: "2026-03-15T11:00:00Z" },
  { id: "wp6", projectId: "p3", title: "Copy Guidelines", content: "Tom de voz: profissional mas acessível.\n\nPalavras a usar: resultado, crescimento, solução.\nPalavras a evitar: barato, grátis, urgente.\n\nFormato dos CTAs: verbos no imperativo (\"Comece agora\", \"Saiba mais\").", updatedAt: "2026-03-13T08:45:00Z" },
]
```

New pages created via `addPage` use `crypto.randomUUID()` for the `id`.

### Store Changes
Add to `useTaskStore` in `src/store/useTaskStore.ts`:
```ts
pages: WikiPage[]       // initialized from mockPages
addPage(page: WikiPage): void
updatePage(id: string, updates: Partial<Pick<WikiPage, 'title' | 'content' | 'updatedAt'>>): void
deletePage(id: string): void
```

The `pages` slice persists to localStorage alongside `tasks` via the existing `persist` middleware — no additional configuration needed.

### Files to create
- `src/app/docs/page.tsx`
- `src/features/docs/DocsSidebar.tsx`
- `src/features/docs/PageViewer.tsx` — read mode
- `src/features/docs/PageEditor.tsx` — edit mode (receives `page` prop + `onSave` / `onCancel` callbacks)
- Add `WikiPage` type + `mockPages` to `src/data/mock.ts`
- Update `src/store/useTaskStore.ts` with pages slice

---

## Shared Conventions

- All new components use `"use client"` (they read from store or use local state)
- Props typed with local `type Props = { ... }` — no `React.FC`
- All imports use `@/` alias
- Colors: use existing semantic tokens (`accent`, `bg-card`, `text-muted`, etc.) — no hardcoded hex except dynamic `project.color`
- No new Tailwind tokens needed
- Framer Motion: only in `/calendar` (row fade on filter toggle)
- Date utilities: native `Date` + `Intl` only — no new npm packages

---

## Out of Scope

- Real markdown rendering (Docs uses plain `whitespace-pre-wrap`)
- Drag/resize of Gantt bars
- Calendar month/week view toggle (only Gantt timeline)
- Rich text editor (Docs uses plain `<textarea>`)
- Any API calls or server-side data fetching
- `completedAt` timestamp on Task (Streak metric intentionally replaced)
