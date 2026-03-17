# Hazel — SaaS Gerenciador de Tarefas — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build "Hazel", a polished MVP de task manager SaaS com 4 telas funcionais, drag-and-drop, animações Framer Motion e persistência localStorage — pronto para gravar um demo de 2 minutos.

**Architecture:** Next.js 14 App Router com arquitetura feature-based: cada feature (`dashboard`, `board`, `settings`) contém seus próprios componentes e hooks. Estado global via Zustand com middleware localStorage. Dados 100% mockados em `src/data/mock.ts`.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion, @dnd-kit/core + @dnd-kit/sortable, Zustand

---

## File Map

> Todos os arquivos criados/modificados neste plano.

```
saas-tarefas/
├── package.json
├── tailwind.config.ts
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Root layout com sidebar
│   │   ├── page.tsx                      # Redirect → /dashboard
│   │   ├── dashboard/
│   │   │   └── page.tsx                  # Tela Dashboard
│   │   ├── board/
│   │   │   └── [projectId]/
│   │   │       └── page.tsx              # Tela Board (lista de tarefas)
│   │   └── settings/
│   │       └── page.tsx                  # Tela Settings
│   ├── data/
│   │   └── mock.ts                       # Todos os dados mockados
│   ├── store/
│   │   └── useTaskStore.ts               # Zustand store com localStorage
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx               # Sidebar esquerda (240px, dark)
│   │   │   └── AppShell.tsx              # Wrapper que compõe Sidebar + main
│   │   └── ui/
│   │       ├── PriorityBadge.tsx         # Badge colorido de prioridade
│   │       └── Avatar.tsx                # Avatar com iniciais
│   ├── features/
│   │   ├── dashboard/
│   │   │   ├── SummaryCards.tsx          # 3 cards de resumo
│   │   │   ├── WeeklyChart.tsx           # Mini gráfico de barras semanal
│   │   │   └── UpcomingTasks.tsx         # Lista das 3 próximas tarefas
│   │   ├── board/
│   │   │   ├── KanbanCounters.tsx        # 3 colunas de contagem + filtro
│   │   │   ├── TaskList.tsx              # Lista de tarefas com dnd-kit
│   │   │   ├── TaskCard.tsx              # Card de tarefa individual
│   │   │   └── TaskDetailPanel.tsx       # Painel slide-in de detalhe
│   │   └── settings/
│   │       ├── ProfileSection.tsx        # Avatar, nome, email
│   │       └── PreferencesSection.tsx    # Toggles decorativos + sobre
```

---

## Task 1: Scaffold do Projeto

**Files:**
- Create: `saas-tarefas/` (diretório raiz do projeto)
- Create: `saas-tarefas/package.json` (gerado pelo create-next-app)
- Create: `saas-tarefas/tailwind.config.ts`
- Create: `saas-tarefas/src/app/layout.tsx`
- Create: `saas-tarefas/src/app/page.tsx`

- [ ] **Step 1: Criar o projeto Next.js com TypeScript e Tailwind**

Execute a partir de `C:\Users\leona\Documents\Backup\Portifolio ARCSYS`:

```bash
cd "C:\Users\leona\Documents\Backup\Portifolio ARCSYS"
npx create-next-app@14 saas-tarefas \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-turbopack
```

Expected: pasta `saas-tarefas/` criada com estrutura App Router.

- [ ] **Step 2: Instalar dependências adicionais**

```bash
cd "C:\Users\leona\Documents\Backup\Portifolio ARCSYS\saas-tarefas"
npm install framer-motion zustand @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

Expected: `node_modules` atualizado sem erros.

- [ ] **Step 3: Configurar Tailwind com os design tokens da spec**

Sobrescrever `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-sidebar": "#111118",
        "bg-main": "#F7F7F8",
        "bg-card": "#FFFFFF",
        accent: "#7C3AED",
        "accent-soft": "#EDE9FE",
        "text-primary": "#0D0D12",
        "text-muted": "#6B7280",
        border: "#E5E7EB",
        "priority-high": "#EF4444",
        "priority-medium": "#F59E0B",
        "priority-low": "#10B981",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 4: Adicionar Inter ao layout raiz**

Sobrescrever `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Hazel — Task Manager",
  description: "Organize your projects and tasks with clarity.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-bg-main text-text-primary`}>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Criar redirect da raiz para /dashboard**

Criar `src/app/page.tsx`:

```tsx
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard");
}
```

- [ ] **Step 6: Verificar que o projeto compila**

```bash
cd "C:\Users\leona\Documents\Backup\Portifolio ARCSYS\saas-tarefas"
npm run build
```

Expected: build bem-sucedido sem erros TypeScript.

- [ ] **Step 7: Commit**

```bash
git init
git add .
git commit -m "feat: scaffold Next.js 14 project with design tokens"
```

---

## Task 2: Dados Mockados e Zustand Store

**Files:**
- Create: `saas-tarefas/src/data/mock.ts`
- Create: `saas-tarefas/src/store/useTaskStore.ts`

- [ ] **Step 1: Criar o arquivo de dados mockados**

Criar `src/data/mock.ts`:

```typescript
export type Priority = "high" | "medium" | "low";
export type Status = "todo" | "in_progress" | "done";

export type Subtask = {
  id: string;
  title: string;
  completed: boolean;
};

export type Task = {
  id: string;
  projectId: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  dueDate: string;
  subtasks: Subtask[];
  createdAt: string;
};

export type Project = {
  id: string;
  name: string;
  color: string;
  taskCount: number;
};

export type User = {
  name: string;
  email: string;
  avatarInitials: string;
};

export const mockUser: User = {
  name: "Leon",
  email: "leon@hazel.app",
  avatarInitials: "L",
};

export const mockProjects: Project[] = [
  { id: "p1", name: "Website Redesign", color: "#7C3AED", taskCount: 5 },
  { id: "p2", name: "Mobile App", color: "#10B981", taskCount: 4 },
  { id: "p3", name: "Marketing Q2", color: "#F59E0B", taskCount: 3 },
];

// Datas relativas ao momento do demo (use datas fixas próximas de 2026-03-17)
export const mockTasks: Task[] = [
  // --- Website Redesign (p1) ---
  {
    id: "t1",
    projectId: "p1",
    title: "Redesign landing page hero section",
    description: "Create a modern hero section with clear value proposition, CTA button, and product screenshot.",
    priority: "high",
    status: "in_progress",
    dueDate: "2026-03-17",
    subtasks: [
      { id: "st1", title: "Write headline copy", completed: true },
      { id: "st2", title: "Design hero layout", completed: true },
      { id: "st3", title: "Add CTA button", completed: false },
      { id: "st4", title: "Add product screenshot", completed: false },
    ],
    createdAt: "2026-03-10",
  },
  {
    id: "t2",
    projectId: "p1",
    title: "Update color palette to new brand guide",
    description: "Apply updated brand colors across all components. Focus on primary and accent colors.",
    priority: "medium",
    status: "todo",
    dueDate: "2026-03-19",
    subtasks: [
      { id: "st5", title: "Update CSS variables", completed: false },
      { id: "st6", title: "Apply to buttons", completed: false },
      { id: "st7", title: "Apply to navigation", completed: false },
    ],
    createdAt: "2026-03-11",
  },
  {
    id: "t3",
    projectId: "p1",
    title: "Improve page load performance",
    description: "Optimize images and reduce JavaScript bundle size to achieve sub-2s load time.",
    priority: "high",
    status: "todo",
    dueDate: "2026-03-21",
    subtasks: [
      { id: "st8", title: "Compress all images", completed: false },
      { id: "st9", title: "Lazy load below-fold images", completed: false },
    ],
    createdAt: "2026-03-12",
  },
  {
    id: "t4",
    projectId: "p1",
    title: "Write about us page content",
    description: "Draft copy for the about page including team bios and company story.",
    priority: "low",
    status: "done",
    dueDate: "2026-03-15",
    subtasks: [
      { id: "st10", title: "Draft company story", completed: true },
      { id: "st11", title: "Write team bios", completed: true },
    ],
    createdAt: "2026-03-08",
  },
  {
    id: "t5",
    projectId: "p1",
    title: "Set up analytics tracking",
    description: "Integrate analytics for key user actions: CTA clicks, form submissions, page views.",
    priority: "medium",
    status: "in_progress",
    dueDate: "2026-03-18",
    subtasks: [
      { id: "st12", title: "Install analytics SDK", completed: true },
      { id: "st13", title: "Track CTA clicks", completed: false },
      { id: "st14", title: "Track form submissions", completed: false },
    ],
    createdAt: "2026-03-13",
  },
  // --- Mobile App (p2) ---
  {
    id: "t6",
    projectId: "p2",
    title: "Design onboarding flow screens",
    description: "Create 4-screen onboarding with permission requests and account setup.",
    priority: "high",
    status: "in_progress",
    dueDate: "2026-03-18",
    subtasks: [
      { id: "st15", title: "Welcome screen", completed: true },
      { id: "st16", title: "Permissions screen", completed: false },
      { id: "st17", title: "Profile setup screen", completed: false },
    ],
    createdAt: "2026-03-11",
  },
  {
    id: "t7",
    projectId: "p2",
    title: "Implement push notifications",
    description: "Set up push notification service and implement opt-in flow for iOS and Android.",
    priority: "medium",
    status: "todo",
    dueDate: "2026-03-24",
    subtasks: [
      { id: "st18", title: "Configure notification service", completed: false },
      { id: "st19", title: "Build opt-in UI", completed: false },
    ],
    createdAt: "2026-03-12",
  },
  {
    id: "t8",
    projectId: "p2",
    title: "Fix crash on login screen",
    description: "Users report app crashes when entering email with special characters. Reproduce and fix.",
    priority: "high",
    status: "done",
    dueDate: "2026-03-16",
    subtasks: [
      { id: "st20", title: "Reproduce the crash", completed: true },
      { id: "st21", title: "Fix input validation", completed: true },
      { id: "st22", title: "Write regression test", completed: true },
    ],
    createdAt: "2026-03-14",
  },
  {
    id: "t9",
    projectId: "p2",
    title: "Add dark mode support",
    description: "Implement system-aware dark mode using platform theme APIs.",
    priority: "low",
    status: "todo",
    dueDate: "2026-03-28",
    subtasks: [
      { id: "st23", title: "Define dark color tokens", completed: false },
      { id: "st24", title: "Apply to all screens", completed: false },
    ],
    createdAt: "2026-03-13",
  },
  // --- Marketing Q2 (p3) ---
  {
    id: "t10",
    projectId: "p3",
    title: "Plan Q2 content calendar",
    description: "Define blog topics, social media posts, and newsletter schedule for April through June.",
    priority: "medium",
    status: "in_progress",
    dueDate: "2026-03-20",
    subtasks: [
      { id: "st25", title: "Research trending topics", completed: true },
      { id: "st26", title: "Draft April schedule", completed: false },
      { id: "st27", title: "Draft May–June schedule", completed: false },
    ],
    createdAt: "2026-03-10",
  },
  {
    id: "t11",
    projectId: "p3",
    title: "Create social media assets",
    description: "Design reusable templates for Instagram, LinkedIn, and Twitter posts.",
    priority: "low",
    status: "todo",
    dueDate: "2026-03-22",
    subtasks: [
      { id: "st28", title: "Design Instagram template", completed: false },
      { id: "st29", title: "Design LinkedIn template", completed: false },
    ],
    createdAt: "2026-03-11",
  },
  {
    id: "t12",
    projectId: "p3",
    title: "Write Q1 performance report",
    description: "Summarize Q1 campaign results, key metrics, and learnings for the team.",
    priority: "medium",
    status: "done",
    dueDate: "2026-03-15",
    subtasks: [
      { id: "st30", title: "Gather metrics data", completed: true },
      { id: "st31", title: "Write report draft", completed: true },
      { id: "st32", title: "Get team review", completed: true },
    ],
    createdAt: "2026-03-09",
  },
];
```

- [ ] **Step 2: Criar o Zustand store com persistência localStorage**

Criar `src/store/useTaskStore.ts`:

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockTasks, mockProjects, Task, Status } from "@/data/mock";

type TaskStore = {
  tasks: Task[];
  activeProjectId: string;
  selectedTaskId: string | null;
  setActiveProject: (projectId: string) => void;
  setSelectedTask: (taskId: string | null) => void;
  updateTaskStatus: (taskId: string, status: Status) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  reorderTasks: (projectId: string, orderedIds: string[]) => void;
};

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: mockTasks,
      activeProjectId: mockProjects[0].id,
      selectedTaskId: null,

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
    }),
    {
      name: "hazel-tasks",
    }
  )
);
```

- [ ] **Step 3: Verificar que TypeScript compila sem erros**

```bash
cd "C:\Users\leona\Documents\Backup\Portifolio ARCSYS\saas-tarefas"
npx tsc --noEmit
```

Expected: sem erros.

- [ ] **Step 4: Commit**

```bash
git add src/data/mock.ts src/store/useTaskStore.ts
git commit -m "feat: add mock data and Zustand store with localStorage persistence"
```

---

## Task 3: Layout Base — Sidebar e AppShell

**Files:**
- Create: `saas-tarefas/src/components/layout/Sidebar.tsx`
- Create: `saas-tarefas/src/components/layout/AppShell.tsx`
- Create: `saas-tarefas/src/components/ui/Avatar.tsx`
- Modify: `saas-tarefas/src/app/layout.tsx`

- [ ] **Step 1: Criar o componente Avatar**

Criar `src/components/ui/Avatar.tsx`:

```tsx
type AvatarProps = {
  initials: string;
  size?: "sm" | "md";
};

export function Avatar({ initials, size = "md" }: AvatarProps) {
  const sizeClass = size === "sm" ? "w-7 h-7 text-xs" : "w-9 h-9 text-sm";
  return (
    <div
      className={`${sizeClass} rounded-full bg-accent flex items-center justify-center text-white font-semibold flex-shrink-0`}
    >
      {initials}
    </div>
  );
}
```

- [ ] **Step 2: Criar a Sidebar**

Criar `src/components/layout/Sidebar.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTaskStore } from "@/store/useTaskStore";
import { mockProjects, mockUser } from "@/data/mock";
import { Avatar } from "@/components/ui/Avatar";
import {
  LayoutDashboard,
  CheckSquare,
  Settings,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { activeProjectId, setActiveProject } = useTaskStore();

  return (
    <aside className="w-60 h-screen bg-bg-sidebar flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-5 py-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
            <CheckSquare className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">Hazel</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="px-3 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-accent text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Projects */}
      <div className="px-3 mt-6">
        <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Projects
        </p>
        <div className="space-y-0.5">
          {mockProjects.map((project) => {
            const isActive = activeProjectId === project.id;
            return (
              <Link
                key={project.id}
                href={`/board/${project.id}`}
                onClick={() => setActiveProject(project.id)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: project.color }}
                />
                <span className="truncate">{project.name}</span>
                <span className="ml-auto text-xs text-gray-500">{project.taskCount}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer — User */}
      <div className="mt-auto px-3 pb-5">
        <div className="flex items-center gap-3 px-3 py-2">
          <Avatar initials={mockUser.avatarInitials} size="sm" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{mockUser.name}</p>
            <p className="text-xs text-gray-500 truncate">{mockUser.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
```

- [ ] **Step 3: Instalar lucide-react (ícones)**

```bash
cd "C:\Users\leona\Documents\Backup\Portifolio ARCSYS\saas-tarefas"
npm install lucide-react
```

- [ ] **Step 4: Criar o AppShell**

Criar `src/components/layout/AppShell.tsx`:

```tsx
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-bg-main">
        {children}
      </main>
    </div>
  );
}
```

- [ ] **Step 5: Atualizar o layout raiz para usar AppShell**

Modificar `src/app/layout.tsx` para envolver as páginas com o AppShell:

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Hazel — Task Manager",
  description: "Organize your projects and tasks with clarity.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-bg-main text-text-primary`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
```

- [ ] **Step 6: Verificar compilação e rodar dev server**

```bash
cd "C:\Users\leona\Documents\Backup\Portifolio ARCSYS\saas-tarefas"
npx tsc --noEmit
```

Expected: sem erros TypeScript. Rodar `npm run dev` e verificar visualmente que a sidebar aparece em `http://localhost:3000`.

- [ ] **Step 7: Commit**

```bash
git add src/components/
git commit -m "feat: add Sidebar and AppShell layout components"
```

---

## Task 4: Tela Dashboard

**Files:**
- Create: `saas-tarefas/src/app/dashboard/page.tsx`
- Create: `saas-tarefas/src/features/dashboard/SummaryCards.tsx`
- Create: `saas-tarefas/src/features/dashboard/WeeklyChart.tsx`
- Create: `saas-tarefas/src/features/dashboard/UpcomingTasks.tsx`

- [ ] **Step 1: Criar os SummaryCards**

Criar `src/features/dashboard/SummaryCards.tsx`:

```tsx
"use client";

import { useTaskStore } from "@/store/useTaskStore";

export function SummaryCards() {
  const tasks = useTaskStore((s) => s.tasks);

  const today = new Date().toISOString().split("T")[0];
  const todayCount = tasks.filter((t) => t.dueDate === today).length;
  const inProgressCount = tasks.filter((t) => t.status === "in_progress").length;
  const doneCount = tasks.filter((t) => t.status === "done").length;

  const cards = [
    { label: "Due Today", value: todayCount, color: "bg-accent/10 text-accent" },
    { label: "In Progress", value: inProgressCount, color: "bg-amber-50 text-amber-600" },
    { label: "Completed", value: doneCount, color: "bg-green-50 text-green-600" },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="bg-bg-card rounded-xl border border-border p-5">
          <p className="text-sm text-text-muted font-medium">{card.label}</p>
          <p className="text-3xl font-bold text-text-primary mt-1">{card.value}</p>
          <div className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${card.color}`}>
            {card.label === "Due Today" ? "tasks today" : card.label === "In Progress" ? "active" : "all time"}
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Criar o WeeklyChart**

Criar `src/features/dashboard/WeeklyChart.tsx`:

```tsx
// Dados mockados fixos — representa uma semana de atividade realista
const weeklyData = [
  { day: "Mon", completed: 2 },
  { day: "Tue", completed: 4 },
  { day: "Wed", completed: 1 },
  { day: "Thu", completed: 5 },
  { day: "Fri", completed: 3 },
  { day: "Sat", completed: 0 },
  { day: "Sun", completed: 2 },
];

const maxValue = Math.max(...weeklyData.map((d) => d.completed));

export function WeeklyChart() {
  return (
    <div className="bg-bg-card rounded-xl border border-border p-5">
      <p className="text-sm font-semibold text-text-primary mb-4">Weekly Progress</p>
      <div className="flex items-end gap-2 h-20">
        {weeklyData.map((d) => {
          const heightPct = maxValue > 0 ? (d.completed / maxValue) * 100 : 0;
          return (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col justify-end" style={{ height: "64px" }}>
                <div
                  className="w-full rounded-t bg-accent transition-all"
                  style={{ height: `${heightPct}%`, minHeight: d.completed > 0 ? "4px" : "0" }}
                />
              </div>
              <span className="text-[10px] text-text-muted">{d.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Criar o UpcomingTasks**

Criar `src/features/dashboard/UpcomingTasks.tsx`:

```tsx
"use client";

import Link from "next/link";
import { useTaskStore } from "@/store/useTaskStore";
import { mockProjects } from "@/data/mock";
import { PriorityBadge } from "@/components/ui/PriorityBadge";

export function UpcomingTasks() {
  const tasks = useTaskStore((s) => s.tasks);

  const upcoming = tasks
    .filter((t) => t.status !== "done")
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 3);

  return (
    <div className="bg-bg-card rounded-xl border border-border p-5">
      <p className="text-sm font-semibold text-text-primary mb-4">Upcoming Tasks</p>
      <div className="space-y-3">
        {upcoming.map((task) => {
          const project = mockProjects.find((p) => p.id === task.projectId);
          return (
            <Link
              key={task.id}
              href={`/board/${task.projectId}`}
              className="flex items-center gap-3 group"
            >
              <div
                className="w-1.5 h-8 rounded-full flex-shrink-0"
                style={{ backgroundColor: project?.color ?? "#7C3AED" }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate group-hover:text-accent transition-colors">
                  {task.title}
                </p>
                <p className="text-xs text-text-muted">{project?.name} · Due {task.dueDate}</p>
              </div>
              <PriorityBadge priority={task.priority} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Criar o componente PriorityBadge (UI compartilhado)**

Criar `src/components/ui/PriorityBadge.tsx`:

```tsx
import { Priority } from "@/data/mock";

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  high: { label: "High", className: "bg-red-50 text-priority-high" },
  medium: { label: "Medium", className: "bg-amber-50 text-priority-medium" },
  low: { label: "Low", className: "bg-green-50 text-priority-low" },
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  const { label, className } = priorityConfig[priority];
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
```

- [ ] **Step 5: Criar a página Dashboard**

Criar `src/app/dashboard/page.tsx`:

```tsx
import { SummaryCards } from "@/features/dashboard/SummaryCards";
import { WeeklyChart } from "@/features/dashboard/WeeklyChart";
import { UpcomingTasks } from "@/features/dashboard/UpcomingTasks";

export default function DashboardPage() {
  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Good morning, Leon</h1>
        <p className="text-text-muted mt-1">Here&apos;s what&apos;s on your plate today.</p>
      </div>

      {/* Summary Cards */}
      <SummaryCards />

      {/* Bottom row: chart + upcoming */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <WeeklyChart />
        <UpcomingTasks />
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Verificar compilação**

```bash
cd "C:\Users\leona\Documents\Backup\Portifolio ARCSYS\saas-tarefas"
npx tsc --noEmit
```

Expected: sem erros. Verificar visualmente em `http://localhost:3000/dashboard`.

- [ ] **Step 7: Commit**

```bash
git add src/app/dashboard/ src/features/dashboard/ src/components/ui/PriorityBadge.tsx
git commit -m "feat: add Dashboard page with summary cards, weekly chart, and upcoming tasks"
```

---

## Task 5: Tela Board — KanbanCounters e TaskCard

**Files:**
- Create: `saas-tarefas/src/features/board/KanbanCounters.tsx`
- Create: `saas-tarefas/src/features/board/TaskCard.tsx`

- [ ] **Step 1: Criar o KanbanCounters**

Criar `src/features/board/KanbanCounters.tsx`:

```tsx
"use client";

import { Status } from "@/data/mock";

type Props = {
  todoCnt: number;
  inProgressCnt: number;
  doneCnt: number;
  activeFilter: Status | null;
  onFilter: (status: Status | null) => void;
};

const columns: { status: Status; label: string; color: string }[] = [
  { status: "todo", label: "To Do", color: "bg-gray-100 text-gray-600" },
  { status: "in_progress", label: "In Progress", color: "bg-amber-50 text-amber-600" },
  { status: "done", label: "Done", color: "bg-green-50 text-green-600" },
];

export function KanbanCounters({ todoCnt, inProgressCnt, doneCnt, activeFilter, onFilter }: Props) {
  const counts: Record<Status, number> = {
    todo: todoCnt,
    in_progress: inProgressCnt,
    done: doneCnt,
  };

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {columns.map(({ status, label, color }) => {
        const isActive = activeFilter === status;
        return (
          <button
            key={status}
            onClick={() => onFilter(isActive ? null : status)}
            className={`rounded-xl border p-4 text-left transition-all ${
              isActive
                ? "border-accent bg-accent/5"
                : "border-border bg-bg-card hover:border-accent/40"
            }`}
          >
            <p className="text-xs font-medium text-text-muted uppercase tracking-wide">{label}</p>
            <p className="text-2xl font-bold text-text-primary mt-1">{counts[status]}</p>
            <div className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
              {counts[status] === 1 ? "task" : "tasks"}
            </div>
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Criar o TaskCard**

Criar `src/features/board/TaskCard.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { Task, Status } from "@/data/mock";
import { useTaskStore } from "@/store/useTaskStore";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { Calendar } from "lucide-react";

const statusCycle: Record<Status, Status> = {
  todo: "in_progress",
  in_progress: "done",
  done: "todo",
};

const statusLabel: Record<Status, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
};

const statusStyle: Record<Status, string> = {
  todo: "bg-gray-100 text-gray-500",
  in_progress: "bg-amber-50 text-amber-600",
  done: "bg-green-50 text-green-600",
};

type Props = {
  task: Task;
  onSelect: (id: string) => void;
};

export function TaskCard({ task, onSelect }: Props) {
  const { updateTaskStatus } = useTaskStore();
  const isDone = task.status === "done";

  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateTaskStatus(task.id, statusCycle[task.status]);
  };

  return (
    <div
      onClick={() => onSelect(task.id)}
      className="bg-bg-card border border-border rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:border-accent/40 hover:shadow-sm transition-all group"
    >
      {/* Animated checkbox */}
      <button
        onClick={handleStatusClick}
        className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-border group-hover:border-accent/60 flex items-center justify-center transition-colors"
      >
        {isDone && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-3 h-3 rounded-full bg-priority-low"
          />
        )}
      </button>

      {/* Title */}
      <p className={`flex-1 text-sm font-medium truncate ${isDone ? "line-through text-text-muted" : "text-text-primary"}`}>
        {task.title}
      </p>

      {/* Meta */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <PriorityBadge priority={task.priority} />
        <div className="flex items-center gap-1 text-xs text-text-muted">
          <Calendar className="w-3 h-3" />
          <span>{task.dueDate}</span>
        </div>
        <button
          onClick={handleStatusClick}
          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${statusStyle[task.status]} hover:opacity-80`}
        >
          {statusLabel[task.status]}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verificar compilação**

```bash
cd "C:\Users\leona\Documents\Backup\Portifolio ARCSYS\saas-tarefas"
npx tsc --noEmit
```

Expected: sem erros.

- [ ] **Step 4: Commit**

```bash
git add src/features/board/KanbanCounters.tsx src/features/board/TaskCard.tsx
git commit -m "feat: add KanbanCounters and TaskCard components"
```

---

## Task 6: Tela Board — TaskList com Drag-and-Drop

**Files:**
- Create: `saas-tarefas/src/features/board/TaskList.tsx`
- Create: `saas-tarefas/src/app/board/[projectId]/page.tsx`

- [ ] **Step 1: Criar o TaskList com dnd-kit**

Criar `src/features/board/TaskList.tsx`:

```tsx
"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTaskStore } from "@/store/useTaskStore";
import { Task, Status } from "@/data/mock";
import { TaskCard } from "./TaskCard";
import { GripVertical } from "lucide-react";

function SortableTaskCard({
  task,
  onSelect,
}: {
  task: Task;
  onSelect: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2">
      <button
        {...attributes}
        {...listeners}
        className="p-1 text-text-muted hover:text-text-primary cursor-grab active:cursor-grabbing flex-shrink-0"
      >
        <GripVertical className="w-4 h-4" />
      </button>
      <div className="flex-1">
        <TaskCard task={task} onSelect={onSelect} />
      </div>
    </div>
  );
}

type Props = {
  projectId: string;
  statusFilter: Status | null;
  onSelectTask: (id: string) => void;
};

export function TaskList({ projectId, statusFilter, onSelectTask }: Props) {
  const { tasks, reorderTasks } = useTaskStore();

  const projectTasks = tasks.filter((t) => t.projectId === projectId);
  const filtered = statusFilter
    ? projectTasks.filter((t) => t.status === statusFilter)
    : projectTasks;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const currentIds = projectTasks.map((t) => t.id);
      const oldIndex = currentIds.indexOf(active.id as string);
      const newIndex = currentIds.indexOf(over.id as string);
      const newOrder = arrayMove(currentIds, oldIndex, newIndex);
      reorderTasks(projectId, newOrder);
    }
  }

  if (filtered.length === 0) {
    return (
      <div className="text-center py-12 text-text-muted text-sm">
        No tasks in this category.
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={projectTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {filtered.map((task) => (
            <SortableTaskCard key={task.id} task={task} onSelect={onSelectTask} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
```

- [ ] **Step 2: Criar a página Board**

Criar `src/app/board/[projectId]/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useTaskStore } from "@/store/useTaskStore";
import { mockProjects } from "@/data/mock";
import { Status } from "@/data/mock";
import { KanbanCounters } from "@/features/board/KanbanCounters";
import { TaskList } from "@/features/board/TaskList";
import { TaskDetailPanel } from "@/features/board/TaskDetailPanel";

export default function BoardPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const [statusFilter, setStatusFilter] = useState<Status | null>(null);

  const tasks = useTaskStore((s) => s.tasks);
  const selectedTaskId = useTaskStore((s) => s.selectedTaskId);
  const setSelectedTask = useTaskStore((s) => s.setSelectedTask);

  const project = mockProjects.find((p) => p.id === projectId);
  const projectTasks = tasks.filter((t) => t.projectId === projectId);

  const todoCnt = projectTasks.filter((t) => t.status === "todo").length;
  const inProgressCnt = projectTasks.filter((t) => t.status === "in_progress").length;
  const doneCnt = projectTasks.filter((t) => t.status === "done").length;

  const selectedTask = selectedTaskId
    ? tasks.find((t) => t.id === selectedTaskId) ?? null
    : null;

  return (
    <div className="relative flex h-full">
      {/* Main content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            {project && (
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: project.color }}
              />
            )}
            <h1 className="text-2xl font-bold text-text-primary">
              {project?.name ?? "Project"}
            </h1>
          </div>
          <p className="text-text-muted text-sm">{projectTasks.length} tasks total</p>
        </div>

        {/* Kanban counters */}
        <KanbanCounters
          todoCnt={todoCnt}
          inProgressCnt={inProgressCnt}
          doneCnt={doneCnt}
          activeFilter={statusFilter}
          onFilter={setStatusFilter}
        />

        {/* Task list */}
        <TaskList
          projectId={projectId}
          statusFilter={statusFilter}
          onSelectTask={setSelectedTask}
        />
      </div>

      {/* Detail panel */}
      <TaskDetailPanel
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </div>
  );
}
```

- [ ] **Step 3: Verificar compilação**

```bash
cd "C:\Users\leona\Documents\Backup\Portifolio ARCSYS\saas-tarefas"
npx tsc --noEmit
```

Expected: erro esperado sobre `TaskDetailPanel` (ainda não criado) — normal neste ponto. Os outros arquivos devem estar ok.

- [ ] **Step 4: Commit (parcial, antes do painel)**

```bash
git add src/features/board/TaskList.tsx src/app/board/
git commit -m "feat: add Board page with drag-and-drop TaskList"
```

---

## Task 7: Painel de Detalhe da Tarefa (Slide-in)

**Files:**
- Create: `saas-tarefas/src/features/board/TaskDetailPanel.tsx`

- [ ] **Step 1: Criar o TaskDetailPanel com Framer Motion**

Criar `src/features/board/TaskDetailPanel.tsx`:

```tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Task } from "@/data/mock";
import { useTaskStore } from "@/store/useTaskStore";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { X, Calendar, CheckSquare } from "lucide-react";

type Props = {
  task: Task | null;
  onClose: () => void;
};

export function TaskDetailPanel({ task, onClose }: Props) {
  const { toggleSubtask, updateTaskStatus } = useTaskStore();

  return (
    <AnimatePresence>
      {task && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/10 z-10"
          />

          {/* Panel */}
          <motion.aside
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute right-0 top-0 h-full w-96 bg-bg-card border-l border-border z-20 flex flex-col shadow-xl overflow-y-auto"
          >
            {/* Panel Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                Task Detail
              </p>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-text-muted hover:text-text-primary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Panel Body */}
            <div className="flex-1 px-6 py-5 space-y-5">
              {/* Title */}
              <div>
                <h2 className="text-lg font-semibold text-text-primary leading-snug">
                  {task.title}
                </h2>
              </div>

              {/* Description */}
              <div>
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                  Description
                </p>
                <p className="text-sm text-text-primary leading-relaxed">{task.description}</p>
              </div>

              {/* Meta row */}
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                    Priority
                  </p>
                  <PriorityBadge priority={task.priority} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                    Due Date
                  </p>
                  <div className="flex items-center gap-1 text-sm text-text-primary">
                    <Calendar className="w-3.5 h-3.5 text-text-muted" />
                    <span>{task.dueDate}</span>
                  </div>
                </div>
              </div>

              {/* Subtasks */}
              <div>
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                  Subtasks ({task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length})
                </p>
                <div className="space-y-2">
                  {task.subtasks.map((subtask) => (
                    <button
                      key={subtask.id}
                      onClick={() => toggleSubtask(task.id, subtask.id)}
                      className="w-full flex items-center gap-3 group"
                    >
                      <div className="w-4 h-4 rounded border-2 border-border group-hover:border-accent flex items-center justify-center transition-colors flex-shrink-0">
                        <AnimatePresence>
                          {subtask.completed && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="w-2 h-2 rounded-sm bg-accent"
                            />
                          )}
                        </AnimatePresence>
                      </div>
                      <span
                        className={`text-sm text-left transition-colors ${
                          subtask.completed
                            ? "line-through text-text-muted"
                            : "text-text-primary group-hover:text-accent"
                        }`}
                      >
                        {subtask.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Panel Footer — Mark as done */}
            <div className="px-6 py-4 border-t border-border flex-shrink-0">
              <button
                onClick={() => {
                  updateTaskStatus(task.id, task.status === "done" ? "todo" : "done");
                  onClose();
                }}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  task.status === "done"
                    ? "bg-gray-100 text-text-muted hover:bg-gray-200"
                    : "bg-accent text-white hover:bg-accent/90"
                }`}
              >
                <CheckSquare className="w-4 h-4" />
                {task.status === "done" ? "Mark as To Do" : "Mark as Complete"}
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Verificar compilação completa**

```bash
cd "C:\Users\leona\Documents\Backup\Portifolio ARCSYS\saas-tarefas"
npx tsc --noEmit
```

Expected: sem erros. A página Board agora deve compilar completamente.

- [ ] **Step 3: Verificar comportamento no browser**

Rodar `npm run dev`, navegar para `http://localhost:3000/board/p1`, clicar em uma tarefa e verificar:
- Painel desliza da direita com animação spring
- Subtarefas são checkáveis com animação
- Botão "Mark as Complete" fecha o painel e atualiza o status

- [ ] **Step 4: Commit**

```bash
git add src/features/board/TaskDetailPanel.tsx
git commit -m "feat: add TaskDetailPanel with Framer Motion slide-in animation"
```

---

## Task 8: Tela Settings

**Files:**
- Create: `saas-tarefas/src/features/settings/ProfileSection.tsx`
- Create: `saas-tarefas/src/features/settings/PreferencesSection.tsx`
- Create: `saas-tarefas/src/app/settings/page.tsx`

- [ ] **Step 1: Criar ProfileSection**

Criar `src/features/settings/ProfileSection.tsx`:

```tsx
import { mockUser } from "@/data/mock";
import { Avatar } from "@/components/ui/Avatar";

export function ProfileSection() {
  return (
    <div className="bg-bg-card rounded-xl border border-border p-6">
      <h2 className="text-sm font-semibold text-text-primary mb-4">Profile</h2>
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center text-white text-xl font-bold">
          {mockUser.avatarInitials}
        </div>
        <div>
          <p className="text-base font-semibold text-text-primary">{mockUser.name}</p>
          <p className="text-sm text-text-muted">{mockUser.email}</p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Criar PreferencesSection**

Criar `src/features/settings/PreferencesSection.tsx`:

```tsx
"use client";

import { useState } from "react";

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-10 h-5 rounded-full transition-colors ${checked ? "bg-accent" : "bg-gray-200"}`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export function PreferencesSection() {
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="space-y-4">
      {/* Preferences */}
      <div className="bg-bg-card rounded-xl border border-border p-6">
        <h2 className="text-sm font-semibold text-text-primary mb-4">Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-primary">Notifications</p>
              <p className="text-xs text-text-muted">Receive reminders for upcoming tasks</p>
            </div>
            <Toggle checked={notifications} onChange={() => setNotifications((v) => !v)} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-primary">Theme</p>
              <p className="text-xs text-text-muted">Dark mode coming soon</p>
            </div>
            <span className="text-xs px-2 py-1 bg-accent-soft text-accent rounded-full font-medium">
              Light
            </span>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="bg-bg-card rounded-xl border border-border p-6">
        <h2 className="text-sm font-semibold text-text-primary mb-4">About Hazel</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-text-muted">Version</span>
            <span className="text-text-primary font-medium">1.0.0-mvp</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Docs</span>
            <a href="#" className="text-accent hover:underline font-medium">
              docs.hazel.app
            </a>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Built with</span>
            <span className="text-text-primary font-medium">Next.js · Tailwind · Framer Motion</span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Criar a página Settings**

Criar `src/app/settings/page.tsx`:

```tsx
import { ProfileSection } from "@/features/settings/ProfileSection";
import { PreferencesSection } from "@/features/settings/PreferencesSection";

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="text-text-muted mt-1">Manage your profile and preferences.</p>
      </div>

      <div className="space-y-4">
        <ProfileSection />
        <PreferencesSection />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verificar compilação**

```bash
cd "C:\Users\leona\Documents\Backup\Portifolio ARCSYS\saas-tarefas"
npx tsc --noEmit
```

Expected: sem erros.

- [ ] **Step 5: Commit**

```bash
git add src/features/settings/ src/app/settings/
git commit -m "feat: add Settings page with profile and preferences sections"
```

---

## Task 9: Polish e Verificação Final

**Files:**
- Modify: vários arquivos conforme itens encontrados no checklist

- [ ] **Step 1: Executar build de produção**

```bash
cd "C:\Users\leona\Documents\Backup\Portifolio ARCSYS\saas-tarefas"
npm run build
```

Expected: build sem erros. Warnings de lint são aceitáveis, erros de TypeScript não.

- [ ] **Step 2: Percorrer o Checklist Visual da spec**

Abrir `http://localhost:3000` em 1440px de largura e verificar cada item:

- [ ] Sidebar com fundo `#111118` e item ativo destacado em `#7C3AED`
- [ ] Cards com badge de prioridade colorido (vermelho/âmbar/verde)
- [ ] Animação de checkbox visível e satisfatória ao completar
- [ ] Slide-in do painel de detalhe fluido (sem jank)
- [ ] Dashboard com números que parecem dados de uso real
- [ ] Espaço em branco generoso em todas as telas
- [ ] Tipografia Inter com hierarquia clara

- [ ] **Step 3: Percorrer o Checklist Funcional da spec**

- [ ] Drag-and-drop reordena e persiste via localStorage (reload e verificar)
- [ ] Status toggle atualiza os contadores do mini-kanban instantaneamente
- [ ] Sub-tarefas checkáveis no painel de detalhe
- [ ] Troca de projeto na sidebar carrega as tarefas corretas
- [ ] Clicar em uma tarefa abre o painel de detalhe com os dados corretos
- [ ] Dashboard calcula contagens reais a partir do estado Zustand

- [ ] **Step 4: Corrigir qualquer problema encontrado nos checklists**

Ajustar componentes conforme necessário. Cada correção deve ser um commit separado com mensagem descritiva.

- [ ] **Step 5: Commit final**

```bash
git add -A
git commit -m "polish: final UI pass — all checklist items verified"
```

---

## Notas de Paralelismo para Subagentes

Este plano é projetado para execução sequencial com **oportunidades de paralelismo** nas Tasks 4–8:

| Tasks Paralelas | Dependências |
|-----------------|-------------|
| Task 4 (Dashboard) | Precisa: Tasks 1, 2, 3 |
| Tasks 5 + 6 (Board components) | Podem rodar em paralelo entre si após Tasks 1, 2, 3 |
| Task 7 (Detail Panel) | Precisa: Task 5 (TaskCard) |
| Task 8 (Settings) | Pode rodar em paralelo com Tasks 5–7 após Tasks 1–3 |
| Task 9 (Polish) | Precisa: todas as anteriores |

**Grafo de dependências:**
```
Task 1 → Task 2 → Task 3 → Task 4
                          → Task 5 → Task 7
                          → Task 6 (depende de Task 5 para TaskCard)
                          → Task 8
                                    → Task 9
```
