# Hazel Missing Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement `/calendar` (Gantt timeline), `/reports` (analytics dashboard), and `/docs` (wiki per project) pages for the Hazel task manager.

**Architecture:** `/docs` extends the Zustand store with a `pages` slice and CRUD actions. `/reports` is pure computation via a `usePeriodFilter` hook over existing task data. `/calendar` is a stateful Gantt chart using Framer Motion for row animations.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, Zustand persist, Framer Motion, Lucide React — no new packages.

---

## File Structure

**Modified files:**
- `src/data/mock.ts` — add `WikiPage` type + `mockPages` array
- `src/store/useTaskStore.ts` — add `pages` slice with `addPage`, `updatePage`, `deletePage`

**New files — `/docs`:**
- `src/app/docs/page.tsx` — client page, owns `selectedProjectId`, `selectedPageId`, `isEditing`, `draftPage` state
- `src/features/docs/DocsSidebar.tsx` — project list + page list + new/delete controls
- `src/features/docs/PageViewer.tsx` — read mode with relative timestamp
- `src/features/docs/PageEditor.tsx` — edit mode with auto-focused title input + textarea

**New files — `/reports`:**
- `src/app/reports/page.tsx` — client page, owns `period` tab state
- `src/features/reports/dateUtils.ts` — `getWeekRange()`, `getMonthRange()` using native Date
- `src/features/reports/usePeriodFilter.ts` — hook returning `PeriodData` for selected tab
- `src/features/reports/ReportsHero.tsx` — period tabs + hero completion count + mini bars
- `src/features/reports/MetricCards.tsx` — 3 KPI cards
- `src/features/reports/ProjectCards.tsx` — per-project progress cards

**New files — `/calendar`:**
- `src/app/calendar/page.tsx` — server component, imports GanttChart
- `src/features/calendar/PeriodNav.tsx` — month nav + project filter chips
- `src/features/calendar/GanttBar.tsx` — single task row with positioned bar + hover tooltip
- `src/features/calendar/GanttChart.tsx` — owns period/filter state, renders grid + today line

---

## Task 1: Add WikiPage type + mockPages to mock.ts

**Files:**
- Modify: `src/data/mock.ts`

- [ ] **Step 1: Add WikiPage type and mockPages after the existing exports in mock.ts**

```ts
// Add after the User type:
export type WikiPage = {
  id: string
  projectId: string
  title: string
  content: string
  updatedAt: string // ISO date string
}

// Add after mockTasks:
export const mockPages: WikiPage[] = [
  {
    id: "wp1",
    projectId: "p1",
    title: "Overview",
    content: "Redesign completo do site corporativo.\n\nObjetivos: aumentar conversão em 30%.\nPrazo: Q2 2026.\nStakeholders: Leon (dev), Ana (design), Carlos (PM).",
    updatedAt: "2026-03-17T10:00:00Z",
  },
  {
    id: "wp2",
    projectId: "p1",
    title: "Brief",
    content: "O cliente solicitou um redesign focado em mobile-first.\n\nRequisitos principais:\n- Nova identidade visual\n- Performance acima de 90 no Lighthouse\n- Integração com CRM existente",
    updatedAt: "2026-03-14T14:30:00Z",
  },
  {
    id: "wp3",
    projectId: "p2",
    title: "Overview",
    content: "App mobile para iOS e Android.\n\nStack: React Native + Expo.\nTarget: usuários B2C, 18-35 anos.\nLançamento previsto: Julho 2026.",
    updatedAt: "2026-03-16T09:15:00Z",
  },
  {
    id: "wp4",
    projectId: "p2",
    title: "Sprint Notes",
    content: "Sprint 1 (Mar 11-18):\n✓ Setup do projeto e CI/CD\n✓ Tela de login e autenticação\n→ Push notifications (em progresso)\n\nSprint 2 (Mar 18-25):\n- Feed principal\n- Profile screen",
    updatedAt: "2026-03-18T16:00:00Z",
  },
  {
    id: "wp5",
    projectId: "p3",
    title: "Overview",
    content: "Campanha de marketing para o Q2 2026.\n\nCanais: Google Ads, Instagram, LinkedIn.\nOrçamento: R$ 45.000.\nKPIs: 500 leads qualificados, CAC < R$ 90.",
    updatedAt: "2026-03-15T11:00:00Z",
  },
  {
    id: "wp6",
    projectId: "p3",
    title: "Copy Guidelines",
    content: "Tom de voz: profissional mas acessível.\n\nPalavras a usar: resultado, crescimento, solução.\nPalavras a evitar: barato, grátis, urgente.\n\nFormato dos CTAs: verbos no imperativo (\"Comece agora\", \"Saiba mais\").",
    updatedAt: "2026-03-13T08:45:00Z",
  },
]
```

- [ ] **Step 2: Type-check**

```bash
cd saas-tarefas && npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/data/mock.ts
git commit -m "feat(docs): add WikiPage type and mockPages to mock data"
```

---

## Task 2: Extend useTaskStore with pages slice

**Files:**
- Modify: `src/store/useTaskStore.ts`

- [ ] **Step 1: Update import and type, then add pages slice**

Replace the existing file with:

```ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockTasks, mockProjects, mockPages, Task, Status, WikiPage } from "@/data/mock";

type TaskStore = {
  tasks: Task[];
  activeProjectId: string;
  selectedTaskId: string | null;
  pages: WikiPage[];
  setActiveProject: (projectId: string) => void;
  setSelectedTask: (taskId: string | null) => void;
  updateTaskStatus: (taskId: string, status: Status) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  reorderTasks: (projectId: string, orderedIds: string[]) => void;
  addPage: (page: WikiPage) => void;
  updatePage: (id: string, updates: Partial<Pick<WikiPage, "title" | "content" | "updatedAt">>) => void;
  deletePage: (id: string) => void;
};

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: mockTasks,
      activeProjectId: mockProjects[0].id,
      selectedTaskId: null,
      pages: mockPages,

      setActiveProject: (projectId) =>
        set({ activeProjectId: projectId, selectedTaskId: null }),

      setSelectedTask: (taskId) => set({ selectedTaskId: taskId }),

      updateTaskStatus: (taskId, status) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, status } : t
          ),
        })),

      toggleSubtask: (taskId, subtaskId) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  subtasks: t.subtasks.map((s) =>
                    s.id === subtaskId ? { ...s, completed: !s.completed } : s
                  ),
                }
              : t
          ),
        })),

      reorderTasks: (projectId, orderedIds) =>
        set((state) => {
          const otherTasks = state.tasks.filter((t) => t.projectId !== projectId);
          const projectTasks = state.tasks.filter((t) => t.projectId === projectId);
          const reordered = orderedIds
            .map((id) => projectTasks.find((t) => t.id === id))
            .filter(Boolean) as Task[];
          return { tasks: [...otherTasks, ...reordered] };
        }),

      addPage: (page) =>
        set((state) => ({ pages: [...state.pages, page] })),

      updatePage: (id, updates) =>
        set((state) => ({
          pages: state.pages.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),

      deletePage: (id) =>
        set((state) => ({ pages: state.pages.filter((p) => p.id !== id) })),
    }),
    {
      name: "hazel-tasks",
    }
  )
);
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/store/useTaskStore.ts
git commit -m "feat(docs): add pages slice to useTaskStore with CRUD actions"
```

---

## Task 3: Build DocsSidebar

**Files:**
- Create: `src/features/docs/DocsSidebar.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client"
import { mockProjects } from "@/data/mock"
import { useTaskStore } from "@/store/useTaskStore"
import { Trash2, Plus } from "lucide-react"

type Props = {
  selectedProjectId: string
  selectedPageId: string | null
  onSelectProject: (projectId: string) => void
  onSelectPage: (pageId: string) => void
  onNewPage: () => void
  onDeletePage: (pageId: string) => void
}

export function DocsSidebar({
  selectedProjectId,
  selectedPageId,
  onSelectProject,
  onSelectPage,
  onNewPage,
  onDeletePage,
}: Props) {
  const pages = useTaskStore((s) => s.pages)
  const projectPages = pages.filter((p) => p.projectId === selectedProjectId)

  return (
    <aside className="w-[200px] flex-shrink-0 border-r border-border flex flex-col h-full overflow-hidden">
      {/* Projects */}
      <div className="p-4">
        <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">
          Projetos
        </p>
        <ul className="space-y-1">
          {mockProjects.map((project) => (
            <li key={project.id}>
              <button
                onClick={() => onSelectProject(project.id)}
                className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors ${
                  selectedProjectId === project.id
                    ? "bg-accent/10 text-accent font-medium"
                    : "text-muted hover:text-primary hover:bg-card"
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: project.color }}
                />
                <span className="truncate">{project.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-border" />

      {/* Pages */}
      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">
          Páginas
        </p>
        <ul className="space-y-0.5">
          {projectPages.map((page) => (
            <li key={page.id} className="group relative">
              <button
                onClick={() => onSelectPage(page.id)}
                className={`w-full text-left text-sm px-2 py-1.5 rounded pr-7 truncate transition-colors ${
                  selectedPageId === page.id
                    ? "border-l-2 border-accent text-accent bg-accent/5"
                    : "text-muted hover:text-primary hover:bg-card"
                }`}
              >
                {page.title || "Sem título"}
              </button>
              <button
                onClick={() => onDeletePage(page.id)}
                disabled={projectPages.length <= 1}
                className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 rounded text-muted hover:text-primary disabled:opacity-20 disabled:cursor-not-allowed transition-opacity"
                aria-label="Deletar página"
              >
                <Trash2 size={12} />
              </button>
            </li>
          ))}
          {projectPages.length === 0 && (
            <p className="text-xs text-muted py-2 px-2">Nenhuma página.</p>
          )}
        </ul>
      </div>

      {/* New page */}
      <div className="p-3 border-t border-border">
        <button
          onClick={onNewPage}
          className="w-full flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors py-1 px-2"
        >
          <Plus size={14} />
          Nova página
        </button>
      </div>
    </aside>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/features/docs/DocsSidebar.tsx
git commit -m "feat(docs): add DocsSidebar component"
```

---

## Task 4: Build PageViewer + PageEditor

**Files:**
- Create: `src/features/docs/PageViewer.tsx`
- Create: `src/features/docs/PageEditor.tsx`

- [ ] **Step 1: Create PageViewer**

```tsx
"use client"
import { mockProjects } from "@/data/mock"
import { Edit } from "lucide-react"
import type { WikiPage } from "@/data/mock"

type Props = {
  page: WikiPage
  onEdit: () => void
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return "hoje"
  const rtf = new Intl.RelativeTimeFormat("pt-BR", { style: "long" })
  if (days < 30) return rtf.format(-days, "day")
  return rtf.format(-Math.floor(days / 30), "month")
}

export function PageViewer({ page, onEdit }: Props) {
  const project = mockProjects.find((p) => p.id === page.projectId)

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-start justify-between mb-2">
          <h1 className="text-2xl font-bold text-primary">{page.title}</h1>
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 text-sm text-muted hover:text-primary border border-border rounded px-3 py-1.5 transition-colors flex-shrink-0 ml-4"
          >
            <Edit size={14} />
            Editar
          </button>
        </div>
        <p className="text-sm text-muted mb-4">
          Atualizado {relativeTime(page.updatedAt)} · {project?.name}
        </p>
        <hr className="border-border mb-6" />
        <p className="text-primary whitespace-pre-wrap leading-relaxed">{page.content}</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create PageEditor**

```tsx
"use client"
import { useEffect, useRef, useState } from "react"
import type { WikiPage } from "@/data/mock"

type Props = {
  page: WikiPage
  onSave: (updates: { title: string; content: string; updatedAt: string }) => void
  onCancel: () => void
}

export function PageEditor({ page, onSave, onCancel }: Props) {
  const [title, setTitle] = useState(page.title)
  const [content, setContent] = useState(page.content)
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  function handleSave() {
    if (!title.trim()) return
    onSave({ title: title.trim(), content, updatedAt: new Date().toISOString() })
  }

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <input
            ref={titleRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título da página"
            className="text-2xl font-bold text-primary bg-transparent border-b border-border focus:border-accent outline-none pb-1 flex-1 mr-4"
          />
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={onCancel}
              className="text-sm text-muted hover:text-primary border border-border rounded px-3 py-1.5 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim()}
              className="text-sm bg-accent text-white rounded px-3 py-1.5 hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Salvar
            </button>
          </div>
        </div>
        <hr className="border-border mb-4" />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escreva o conteúdo aqui..."
          className="w-full min-h-[400px] bg-transparent text-primary font-mono text-sm leading-relaxed resize-none outline-none"
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/features/docs/PageViewer.tsx src/features/docs/PageEditor.tsx
git commit -m "feat(docs): add PageViewer and PageEditor components"
```

---

## Task 5: Build /docs page

**Files:**
- Create: `src/app/docs/page.tsx`

- [ ] **Step 1: Create the page**

```tsx
"use client"
import { useState, useEffect } from "react"
import { mockProjects } from "@/data/mock"
import { useTaskStore } from "@/store/useTaskStore"
import { DocsSidebar } from "@/features/docs/DocsSidebar"
import { PageViewer } from "@/features/docs/PageViewer"
import { PageEditor } from "@/features/docs/PageEditor"
import type { WikiPage } from "@/data/mock"

export default function DocsPage() {
  const { pages, addPage, updatePage, deletePage } = useTaskStore()
  const [selectedProjectId, setSelectedProjectId] = useState(mockProjects[0].id)
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [draftPage, setDraftPage] = useState<WikiPage | null>(null)

  // Auto-select first page when project changes, or clear selectedPageId if page was deleted
  useEffect(() => {
    const projectPages = pages.filter((p) => p.projectId === selectedProjectId)
    const stillExists = projectPages.some((p) => p.id === selectedPageId)
    if (!stillExists) {
      setSelectedPageId(projectPages[0]?.id ?? null)
      setIsEditing(false)
      setDraftPage(null)
    }
  }, [selectedProjectId, pages, selectedPageId])

  const activePage = draftPage ?? pages.find((p) => p.id === selectedPageId) ?? null

  function handleSelectProject(projectId: string) {
    setSelectedProjectId(projectId)
  }

  function handleSelectPage(pageId: string) {
    setSelectedPageId(pageId)
    setIsEditing(false)
    setDraftPage(null)
  }

  function handleNewPage() {
    const newPage: WikiPage = {
      id: crypto.randomUUID(),
      projectId: selectedProjectId,
      title: "",
      content: "",
      updatedAt: new Date().toISOString(),
    }
    setDraftPage(newPage)
    setIsEditing(true)
  }

  function handleDeletePage(pageId: string) {
    const remaining = pages.filter(
      (p) => p.projectId === selectedProjectId && p.id !== pageId
    )
    deletePage(pageId)
    setSelectedPageId(remaining[0]?.id ?? null)
    setIsEditing(false)
    setDraftPage(null)
  }

  function handleSave(updates: { title: string; content: string; updatedAt: string }) {
    if (draftPage) {
      addPage({ ...draftPage, ...updates })
      setSelectedPageId(draftPage.id)
      setDraftPage(null)
    } else if (selectedPageId) {
      updatePage(selectedPageId, updates)
    }
    setIsEditing(false)
  }

  function handleCancel() {
    setDraftPage(null)
    setIsEditing(false)
  }

  return (
    <div className="flex h-full overflow-hidden">
      <DocsSidebar
        selectedProjectId={selectedProjectId}
        selectedPageId={selectedPageId}
        onSelectProject={handleSelectProject}
        onSelectPage={handleSelectPage}
        onNewPage={handleNewPage}
        onDeletePage={handleDeletePage}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        {activePage && isEditing ? (
          <PageEditor page={activePage} onSave={handleSave} onCancel={handleCancel} />
        ) : activePage ? (
          <PageViewer page={activePage} onEdit={() => setIsEditing(true)} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-muted">
            <p className="text-sm">Nenhuma página ainda. Crie a primeira.</p>
            <button
              onClick={handleNewPage}
              className="text-sm bg-accent text-white rounded px-4 py-2 hover:bg-accent/90 transition-colors"
            >
              + Nova página
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
```

- [ ] **Step 2: Type-check + lint**

```bash
npx tsc --noEmit && npm run lint
```
Expected: no errors

- [ ] **Step 3: Visual check**
Start dev server (`npm run dev`), navigate to `/docs`. Verify:
- Project list shows 3 projects with colored dots
- Selecting a project shows its 2 pages
- Clicking a page shows it in PageViewer with relative date
- "Editar" opens PageEditor with auto-focused title input
- Saving a page persists the change
- "Nova página" enters edit mode; saving adds the page to the sidebar
- Trash icon disabled when only 1 page remains in project

- [ ] **Step 4: Commit**

```bash
git add src/app/docs/page.tsx
git commit -m "feat(docs): add /docs wiki page with project+page sidebar and read/edit modes"
```

---

## Task 6: Build dateUtils.ts + usePeriodFilter hook

**Files:**
- Create: `src/features/reports/dateUtils.ts`
- Create: `src/features/reports/usePeriodFilter.ts`

- [ ] **Step 1: Create dateUtils.ts**

```ts
export function getWeekRange(date: Date): [Date, Date] {
  const day = date.getDay()
  const diff = day === 0 ? -6 : 1 - day // shift to Monday
  const monday = new Date(date)
  monday.setDate(date.getDate() + diff)
  monday.setHours(0, 0, 0, 0)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)
  return [monday, sunday]
}

export function getMonthRange(date: Date): [Date, Date] {
  const start = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0)
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)
  return [start, end]
}
```

- [ ] **Step 2: Create usePeriodFilter.ts**

```ts
import { useTaskStore } from "@/store/useTaskStore"
import type { Task } from "@/data/mock"
import { getWeekRange, getMonthRange } from "./dateUtils"

export type PeriodTab = "week" | "month" | "total"

export type PeriodData = {
  tasks: Task[]
  completedCount: number
  inProgressCount: number
  todoCount: number
  completionRate: number
}

export function usePeriodFilter(period: PeriodTab): PeriodData {
  const allTasks = useTaskStore((s) => s.tasks)
  const now = new Date()

  let tasks: Task[]
  if (period === "week") {
    const [start, end] = getWeekRange(now)
    tasks = allTasks.filter((t) => {
      const d = new Date(t.dueDate)
      return d >= start && d <= end
    })
  } else if (period === "month") {
    const [start, end] = getMonthRange(now)
    tasks = allTasks.filter((t) => {
      const d = new Date(t.dueDate)
      return d >= start && d <= end
    })
  } else {
    tasks = allTasks
  }

  const completedCount = tasks.filter((t) => t.status === "done").length
  const inProgressCount = tasks.filter((t) => t.status === "in_progress").length
  const todoCount = tasks.filter((t) => t.status === "todo").length
  const completionRate = tasks.length > 0 ? completedCount / tasks.length : 0

  return { tasks, completedCount, inProgressCount, todoCount, completionRate }
}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/features/reports/dateUtils.ts src/features/reports/usePeriodFilter.ts
git commit -m "feat(reports): add dateUtils helpers and usePeriodFilter hook"
```

---

## Task 7: Build ReportsHero

**Files:**
- Create: `src/features/reports/ReportsHero.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client"
import type { PeriodTab, PeriodData } from "./usePeriodFilter"

type Props = {
  period: PeriodTab
  data: PeriodData
  onPeriodChange: (p: PeriodTab) => void
}

const PERIOD_LABELS: Record<PeriodTab, string> = {
  week: "Esta semana",
  month: "Este mês",
  total: "Total",
}

// Visual decoration bars (not derived from real data)
const MINI_BARS: Record<PeriodTab, number[]> = {
  week: [3, 5, 2, 7, 4, 6, 3],
  month: [8, 12, 9, 15],
  total: [12],
}

const MAX_BAR = 15

export function ReportsHero({ period, data, onPeriodChange }: Props) {
  return (
    <div className="space-y-4">
      {/* Period tabs */}
      <div className="flex gap-1 bg-card rounded-lg p-1 w-fit">
        {(["week", "month", "total"] as PeriodTab[]).map((p) => (
          <button
            key={p}
            onClick={() => onPeriodChange(p)}
            className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
              period === p
                ? "bg-accent text-white font-medium"
                : "text-muted hover:text-primary"
            }`}
          >
            {PERIOD_LABELS[p]}
          </button>
        ))}
      </div>

      {/* Hero card */}
      <div className="bg-card rounded-xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-accent/5 pointer-events-none" />
        <div className="relative">
          <p className="text-sm text-muted mb-2">Tarefas concluídas</p>
          <div className="flex items-end gap-8 flex-wrap">
            {/* Big number */}
            <span
              className="text-6xl font-bold text-primary transition-opacity duration-150"
              key={`${period}-${data.completedCount}`}
            >
              {data.completedCount}
            </span>

            {/* Mini bar chart */}
            <div className="flex items-end gap-1 h-12 mb-1">
              {MINI_BARS[period].map((h, i) => (
                <div
                  key={i}
                  className="w-3 bg-accent/40 rounded-sm"
                  style={{ height: `${(h / MAX_BAR) * 100}%` }}
                />
              ))}
            </div>

            {/* Secondary numbers */}
            <div className="flex gap-6 mb-1">
              <div>
                <p className="text-2xl font-semibold text-primary">{data.inProgressCount}</p>
                <p className="text-xs text-muted">Em progresso</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-primary">{data.todoCount}</p>
                <p className="text-xs text-muted">A fazer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/features/reports/ReportsHero.tsx
git commit -m "feat(reports): add ReportsHero with period tabs and hero metrics"
```

---

## Task 8: Build MetricCards + ProjectCards

**Files:**
- Create: `src/features/reports/MetricCards.tsx`
- Create: `src/features/reports/ProjectCards.tsx`

- [ ] **Step 1: Create MetricCards.tsx**

```tsx
"use client"
import type { PeriodData } from "./usePeriodFilter"

type Props = {
  data: PeriodData
}

export function MetricCards({ data }: Props) {
  const highPriorityDone = data.tasks.filter(
    (t) => t.priority === "high" && t.status === "done"
  ).length

  const metrics = [
    { label: "Tarefas concluídas", value: String(data.completedCount) },
    { label: "Taxa de conclusão", value: `${Math.round(data.completionRate * 100)}%` },
    { label: "Alta prioridade concluídas", value: String(highPriorityDone) },
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {metrics.map((m) => (
        <div key={m.label} className="bg-card rounded-xl p-5">
          <p className="text-3xl font-bold text-primary mb-1">{m.value}</p>
          <p className="text-sm text-muted">{m.label}</p>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Create ProjectCards.tsx**

```tsx
"use client"
import { mockProjects } from "@/data/mock"
import { useTaskStore } from "@/store/useTaskStore"

export function ProjectCards() {
  const allTasks = useTaskStore((s) => s.tasks)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <div className="grid grid-cols-3 gap-4">
      {mockProjects.map((project) => {
        // Progress bar uses all tasks for the project (not period-filtered), per spec
        const projectAllTasks = allTasks.filter((t) => t.projectId === project.id)
        const doneCount = projectAllTasks.filter((t) => t.status === "done").length
        const totalCount = projectAllTasks.length
        const progress = totalCount > 0 ? doneCount / totalCount : 0

        const isOverdue = projectAllTasks.some(
          (t) => new Date(t.dueDate) < today && t.status !== "done"
        )

        return (
          <div
            key={project.id}
            className="bg-card rounded-xl p-5 border-l-4"
            style={{ borderLeftColor: project.color }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: project.color }}
                />
                <span className="font-medium text-primary text-sm truncate">
                  {project.name}
                </span>
              </div>
              {isOverdue && (
                <span className="text-xs bg-priority-high/10 text-priority-high px-2 py-0.5 rounded-full flex-shrink-0 ml-2">
                  Atrasada
                </span>
              )}
            </div>
            <div className="mb-2">
              <div className="w-full bg-border rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${progress * 100}%`,
                    backgroundColor: project.color,
                  }}
                />
              </div>
            </div>
            <p className="text-xs text-muted">
              {doneCount}/{totalCount} concluídas
            </p>
          </div>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/features/reports/MetricCards.tsx src/features/reports/ProjectCards.tsx
git commit -m "feat(reports): add MetricCards and ProjectCards components"
```

---

## Task 9: Build /reports page

**Files:**
- Create: `src/app/reports/page.tsx`

- [ ] **Step 1: Create the page**

```tsx
"use client"
import { useState } from "react"
import { ReportsHero } from "@/features/reports/ReportsHero"
import { MetricCards } from "@/features/reports/MetricCards"
import { ProjectCards } from "@/features/reports/ProjectCards"
import { usePeriodFilter } from "@/features/reports/usePeriodFilter"
import type { PeriodTab } from "@/features/reports/usePeriodFilter"

export default function ReportsPage() {
  const [period, setPeriod] = useState<PeriodTab>("week")
  const data = usePeriodFilter(period)

  return (
    <div className="p-8 space-y-6 overflow-y-auto h-full">
      <h1 className="text-2xl font-bold text-primary">Relatórios</h1>
      <ReportsHero period={period} data={data} onPeriodChange={setPeriod} />
      <MetricCards data={data} />
      <ProjectCards />
    </div>
  )
}
```

- [ ] **Step 2: Type-check + lint**

```bash
npx tsc --noEmit && npm run lint
```
Expected: no errors

- [ ] **Step 3: Visual check**
Navigate to `/reports`. Verify:
- Period tabs switch between "Esta semana", "Este mês", "Total"
- Hero number updates when switching tabs
- Mini bar chart changes shape per period
- Metric cards show correct counts
- Project cards show progress bars and "Atrasada" badge for overdue projects

- [ ] **Step 4: Commit**

```bash
git add src/app/reports/page.tsx
git commit -m "feat(reports): add /reports analytics page with period tabs"
```

---

## Task 10: Build PeriodNav

**Files:**
- Create: `src/features/calendar/PeriodNav.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { mockProjects } from "@/data/mock"

type Props = {
  period: Date
  activeProjects: string[]
  onPrev: () => void
  onNext: () => void
  onToggleProject: (projectId: string) => void
}

const MONTHS_PT = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
]

export function PeriodNav({ period, activeProjects, onPrev, onNext, onToggleProject }: Props) {
  const label = `${MONTHS_PT[period.getMonth()]} ${period.getFullYear()}`

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-wrap gap-3">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-primary">Calendar</h1>
        <div className="flex items-center gap-1">
          <button
            onClick={onPrev}
            className="p-1 text-muted hover:text-primary transition-colors rounded hover:bg-card"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-medium text-primary w-36 text-center">{label}</span>
          <button
            onClick={onNext}
            className="p-1 text-muted hover:text-primary transition-colors rounded hover:bg-card"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex items-center gap-2">
        {mockProjects.map((project) => {
          const isActive = activeProjects.includes(project.id)
          return (
            <button
              key={project.id}
              onClick={() => onToggleProject(project.id)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                isActive
                  ? "border-transparent text-white"
                  : "border-border text-muted hover:text-primary"
              }`}
              style={isActive ? { backgroundColor: project.color } : undefined}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: isActive ? "white" : project.color }}
              />
              {project.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/features/calendar/PeriodNav.tsx
git commit -m "feat(calendar): add PeriodNav with month navigation and project filter chips"
```

---

## Task 11: Build GanttBar

**Files:**
- Create: `src/features/calendar/GanttBar.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client"
import { useState } from "react"
import type { Task, Project } from "@/data/mock"

type Props = {
  task: Task
  project: Project
  periodStart: Date
  daysInMonth: number
}

const STATUS_LABELS: Record<string, string> = {
  todo: "A fazer",
  in_progress: "Em progresso",
  done: "Concluída",
}

export function GanttBar({ task, project, periodStart, daysInMonth }: Props) {
  const [showTooltip, setShowTooltip] = useState(false)

  const periodEnd = new Date(periodStart.getFullYear(), periodStart.getMonth() + 1, 0, 23, 59, 59, 999)
  const periodDuration = periodEnd.getTime() - periodStart.getTime()

  // Parse date-only strings as local midnight to avoid UTC offset shifting the date
  function parseLocalDate(str: string): number {
    const [y, m, d] = str.split("-").map(Number)
    return new Date(y, m - 1, d, 0, 0, 0, 0).getTime()
  }
  const taskStart = parseLocalDate(task.createdAt)
  const taskEnd = parseLocalDate(task.dueDate)

  // Hide if entirely outside period
  if (taskStart > periodEnd.getTime() || taskEnd < periodStart.getTime()) return null

  const leftPercent =
    Math.max(0, (taskStart - periodStart.getTime()) / periodDuration) * 100
  const rawWidth =
    ((Math.min(taskEnd, periodEnd.getTime()) - Math.max(taskStart, periodStart.getTime())) /
      periodDuration) *
    100
  const minWidth = 100 / daysInMonth
  const widthPercent = Math.max(rawWidth, minWidth)

  return (
    <div className="flex h-10 items-center border-b border-border/50 hover:bg-card/50 transition-colors">
      {/* Task name column */}
      <div className="w-[180px] flex-shrink-0 px-4 text-sm text-primary truncate" title={task.title}>
        {task.title}
      </div>
      {/* Bar area */}
      <div className="flex-1 relative h-full flex items-center px-2">
        <div
          className="absolute h-6 rounded cursor-pointer"
          style={{
            left: `${leftPercent}%`,
            width: `${widthPercent}%`,
            backgroundColor: project.color,
            opacity: task.status === "done" ? 0.45 : 0.8,
          }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {showTooltip && (
            <div className="absolute bottom-full left-0 mb-2 z-20 bg-card border border-border rounded-lg shadow-lg p-3 text-xs whitespace-nowrap min-w-[180px]">
              <p className="font-medium text-primary mb-1">{task.title}</p>
              <p className="text-muted">{project.name}</p>
              <p className="text-muted">{STATUS_LABELS[task.status]}</p>
              <p className="text-muted">Prazo: {task.dueDate}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/features/calendar/GanttBar.tsx
git commit -m "feat(calendar): add GanttBar with positioned bar and hover tooltip"
```

---

## Task 12: Build GanttChart

**Files:**
- Create: `src/features/calendar/GanttChart.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useTaskStore } from "@/store/useTaskStore"
import { mockProjects } from "@/data/mock"
import { PeriodNav } from "./PeriodNav"
import { GanttBar } from "./GanttBar"

function getDaysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

function getTodayPercent(periodStart: Date, daysInMonth: number): number {
  const today = new Date()
  if (
    today.getMonth() !== periodStart.getMonth() ||
    today.getFullYear() !== periodStart.getFullYear()
  )
    return -1
  return ((today.getDate() - 1) / daysInMonth) * 100
}

export function GanttChart() {
  const tasks = useTaskStore((s) => s.tasks)

  const [period, setPeriod] = useState<Date>(() => {
    const d = new Date()
    d.setDate(1)
    d.setHours(0, 0, 0, 0)
    return d
  })

  const [activeProjects, setActiveProjects] = useState<string[]>(
    mockProjects.map((p) => p.id)
  )

  const daysInMonth = getDaysInMonth(period)
  const todayPercent = getTodayPercent(period, daysInMonth)
  const dayMarkers = [1, 7, 14, 21, daysInMonth]

  const periodEnd = new Date(period.getFullYear(), period.getMonth() + 1, 0, 23, 59, 59, 999)

  // Parse date-only strings as local midnight to avoid UTC offset shifting the date
  function parseLocalDate(str: string): Date {
    const [y, m, d] = str.split("-").map(Number)
    return new Date(y, m - 1, d, 0, 0, 0, 0)
  }

  const visibleTasks = tasks.filter((task) => {
    if (!activeProjects.includes(task.projectId)) return false
    const start = parseLocalDate(task.createdAt)
    const end = parseLocalDate(task.dueDate)
    return start <= periodEnd && end >= period
  })

  function handlePrev() {
    setPeriod((p) => {
      const d = new Date(p)
      d.setMonth(d.getMonth() - 1)
      return d
    })
  }

  function handleNext() {
    setPeriod((p) => {
      const d = new Date(p)
      d.setMonth(d.getMonth() + 1)
      return d
    })
  }

  function handleToggleProject(projectId: string) {
    setActiveProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <PeriodNav
        period={period}
        activeProjects={activeProjects}
        onPrev={handlePrev}
        onNext={handleNext}
        onToggleProject={handleToggleProject}
      />

      <div className="flex-1 overflow-y-auto">
        {/* Day axis header */}
        <div className="flex h-8 border-b border-border sticky top-0 bg-main z-10">
          <div className="w-[180px] flex-shrink-0" />
          <div className="flex-1 relative">
            {dayMarkers.map((day) => (
              <span
                key={day}
                className="absolute top-1/2 -translate-y-1/2 text-xs text-muted"
                style={{ left: `${((day - 1) / daysInMonth) * 100}%` }}
              >
                {day}
              </span>
            ))}
          </div>
        </div>

        {/* Rows */}
        <div className="relative">
          {/* Today vertical line */}
          {todayPercent >= 0 && (
            <div
              className="absolute top-0 bottom-0 w-px bg-accent/50 z-10 pointer-events-none"
              style={{
                left: `calc(180px + (100% - 180px) * ${todayPercent / 100})`,
              }}
            />
          )}

          <AnimatePresence>
            {visibleTasks.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center h-40 text-muted text-sm"
              >
                Nenhuma tarefa neste período
              </motion.div>
            ) : (
              visibleTasks.map((task) => {
                const project = mockProjects.find((p) => p.id === task.projectId)!
                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <GanttBar
                      task={task}
                      project={project}
                      periodStart={period}
                      daysInMonth={daysInMonth}
                    />
                  </motion.div>
                )
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/features/calendar/GanttChart.tsx
git commit -m "feat(calendar): add GanttChart with period navigation, today line, and animated rows"
```

---

## Task 13: Build /calendar page

**Files:**
- Create: `src/app/calendar/page.tsx`

- [ ] **Step 1: Create the page**

```tsx
import { GanttChart } from "@/features/calendar/GanttChart"

export default function CalendarPage() {
  return <GanttChart />
}
```

- [ ] **Step 2: Type-check + lint**

```bash
npx tsc --noEmit && npm run lint
```
Expected: no errors

- [ ] **Step 3: Visual check**
Navigate to `/calendar`. Verify:
- Current month displayed in header
- All 12 tasks visible as Gantt bars colored by project
- `←` / `→` buttons navigate months; tasks outside the month disappear
- Project filter chips toggle task visibility with fade animation
- Hovering a bar shows tooltip with title, project, status, due date
- Blue vertical line marks today (only on current month)
- Empty state message appears when all projects are deselected

- [ ] **Step 4: Full build check**

```bash
npm run build
```
Expected: build succeeds with no errors

- [ ] **Step 5: Commit**

```bash
git add src/app/calendar/page.tsx
git commit -m "feat(calendar): add /calendar page with Gantt timeline view"
```
