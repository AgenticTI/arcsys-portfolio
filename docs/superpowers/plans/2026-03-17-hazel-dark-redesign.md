# Hazel Dark Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the Hazel Task Manager visual design from a light purple theme to a dark olive-black system inspired by the Netsuite CRM Dribbble reference and Apple Human Interface Guidelines.

**Architecture:** Pure visual refactor — no logic, state, or component interfaces change. All Zustand store actions, DnD wiring, and Framer Motion animations remain untouched. Every change is CSS/Tailwind/layout only.

**Tech Stack:** Next.js 14, Tailwind CSS 3, Framer Motion, Syne + Outfit (Google Fonts replacing Inter), Lucide React

---

## Design System Reference

**Colors:**
- `bg-app: #0C0B07` — olive-black main background
- `bg-sidebar: #080700` — near-black sidebar
- `bg-card: #161410` — card surface
- `bg-card-2: #1E1C14` — elevated card / hover state
- `accent: #E6CE00` — primary yellow (CTA, active nav, hero card)
- `accent-orange: #D97820` — secondary orange (In Progress card)
- `text-primary: #F0ECD8` — warm white
- `text-secondary: #A89E7C` — subdued text
- `text-muted: #6A6248` — placeholder / disabled
- `priority-high: #FF3B30` — Apple red
- `priority-medium: #D97820` — orange (reuse accent-orange)
- `priority-low: #0A84FF` — Apple blue
- `status-done: #34C759` — Apple green

**Typography:**
- Display/headings: `Syne` (700–800 weight)
- Body/UI: `Outfit` (400–600 weight)
- Base font size: 16px (never smaller in body)
- Minimum label size: 13px

**Spacing system (via Tailwind):**
- All cards: `p-5` or `p-6`
- Table rows: `py-3`
- Sections: `gap-4` or `gap-5`

**Radius system:**
- Buttons/tags: `rounded-lg` (8px)
- Cards: `rounded-2xl` (16–20px)
- Sidebar active item: `rounded-xl` (12px)
- Badges/pills: `rounded-full`

---

## File Map

| File | Change Type | Description |
|---|---|---|
| `tailwind.config.ts` | **Modify** | Replace entire color palette + add font family |
| `src/app/globals.css` | **Modify** | Dark body bg, custom scrollbar, font smoothing |
| `src/app/layout.tsx` | **Modify** | Import Syne + Outfit, apply to body |
| `src/components/layout/AppShell.tsx` | **Modify** | Dark bg-app, adjust overflow for new sidebar |
| `src/components/layout/Sidebar.tsx` | **Modify** | Full redesign: 68px icon-only, active=yellow, blur backdrop |
| `src/components/ui/Avatar.tsx` | **Modify** | Dark background, accent-yellow initials |
| `src/components/ui/PriorityBadge.tsx` | **Modify** | Apple pill badges with system colors |
| `src/app/dashboard/page.tsx` | **Modify** | New layout: header + hero-row + middle-row + task preview |
| `src/features/dashboard/SummaryCards.tsx` | **Modify** | Redesign as 3 hero cards (yellow / orange / dark spotlight) |
| `src/features/dashboard/WeeklyChart.tsx` | **Modify** | Dark card, yellow+orange bars, larger labels |
| `src/features/dashboard/UpcomingTasks.tsx` | **Modify** | Dark card with project rows + progress bars |
| `src/app/board/[projectId]/page.tsx` | **Modify** | Dark header, full-height dark background |
| `src/features/board/KanbanCounters.tsx` | **Modify** | Dark cards, Apple system colors for statuses |
| `src/features/board/TaskCard.tsx` | **Modify** | Dark row, pill badges, Apple status colors |
| `src/features/board/TaskDetailPanel.tsx` | **Modify** | Dark panel, larger typography, Apple styling |
| `src/app/settings/page.tsx` | **Modify** | Dark layout |
| `src/features/settings/ProfileSection.tsx` | **Modify** | Dark card, accent avatar |
| `src/features/settings/PreferencesSection.tsx` | **Modify** | Dark cards, accent toggle |

---

## Task 1: Design Tokens + Fonts

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Replace tailwind.config.ts color palette + fonts (single pass — do NOT apply a partial version first)**

```typescript
// tailwind.config.ts
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
        // Backgrounds
        "bg-app":     "#0C0B07",
        "bg-sidebar": "#080700",
        "bg-card":    "#161410",
        "bg-card-2":  "#1E1C14",
        "bg-input":   "#1A1814",
        // Accents
        accent:             "#E6CE00",
        "accent-dim":       "rgba(230,206,0,0.14)",
        "accent-glow":      "rgba(230,206,0,0.28)",
        "accent-orange":    "#D97820",
        "accent-orange-dim":"rgba(217,120,32,0.14)",
        "accent-green":     "#34C759",
        "accent-red":       "#FF3B30",
        "accent-blue":      "#0A84FF",
        // Text
        "text-primary":   "#F0ECD8",
        "text-secondary": "#A89E7C",
        "text-muted":     "#6A6248",
        "text-label":     "#8A8068",
        // Borders
        border:       "rgba(255,255,255,0.055)",
        "border-soft":"rgba(255,255,255,0.035)",
        // Priority (kept for PriorityBadge compatibility)
        "priority-high":   "#FF3B30",
        "priority-medium": "#D97820",
        "priority-low":    "#0A84FF",
      },
      // Use CSS variables injected by Next.js font optimization (set in layout.tsx)
      fontFamily: {
        sans:    ["var(--font-outfit)", "sans-serif"],
        display: ["var(--font-syne)", "sans-serif"],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "20px",
        "4xl": "24px",
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 2: Update globals.css**

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #0C0B07;
  --foreground: #F0ECD8;
}

html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  background: var(--background);
  color: var(--foreground);
}

/* Custom scrollbar */
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.08);
  border-radius: 2px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(255,255,255,0.14);
}

@layer utilities {
  .text-balance { text-wrap: balance; }
  /* NOTE: do NOT add a .font-display rule here — Tailwind generates it automatically
     from the `display` key in tailwind.config.ts fontFamily. Adding it here would
     conflict with the CSS-variable-based version Tailwind generates. */
}
```

- [ ] **Step 3: Update layout.tsx to inject Syne + Outfit CSS variables**

The `variable` prop on each font creates `--font-outfit` and `--font-syne` CSS variables, which `tailwind.config.ts` already references. Both must be applied to `<body>` via their variable classes.

```tsx
// src/app/layout.tsx
import type { Metadata } from "next";
import { Syne, Outfit } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-syne",
});

export const metadata: Metadata = {
  title: "Hazel — Task Manager",
  description: "Organize your projects and tasks with clarity.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${syne.variable} font-sans bg-bg-app text-text-primary`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Verify in browser**

Run: `npm run dev` in `saas-tarefas/`
Expected: Dark background, Outfit font loaded, no layout errors in console.

- [ ] **Step 5: Commit**

```bash
git add tailwind.config.ts src/app/globals.css src/app/layout.tsx
git commit -m "feat(hazel): dark design tokens, Syne+Outfit fonts"
```

---

## Task 2: AppShell + Sidebar Redesign

**Files:**
- Modify: `src/components/layout/AppShell.tsx`
- Modify: `src/components/layout/Sidebar.tsx`

The sidebar changes from `w-60` (240px wide, text labels + project list) to `w-[68px]` (icon-only, active=yellow square).

> **Navigation model change:** The old sidebar listed all 3 projects directly. The new icon-only sidebar removes the project list. Users navigate to a project board by clicking the Board icon (which links to `activeProjectId`), then switch projects from the board page header. The `setActiveProject` store action is no longer called from the sidebar (it still works; it's just not triggered here anymore).

- [ ] **Step 1: Update AppShell**

```tsx
// src/components/layout/AppShell.tsx
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-bg-app">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Rewrite Sidebar**

```tsx
// src/components/layout/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTaskStore } from "@/store/useTaskStore";
import { mockUser } from "@/data/mock";
import {
  LayoutDashboard,
  Columns3,
  Calendar,
  BarChart2,
  FileText,
  Settings,
  Bell,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/board",     icon: Columns3,        label: "Board" },
  { href: "/calendar",  icon: Calendar,        label: "Calendar" },
  { href: "/reports",   icon: BarChart2,       label: "Reports" },
  { href: "/docs",      icon: FileText,        label: "Documents" },
  { href: "/settings",  icon: Settings,        label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { activeProjectId } = useTaskStore();

  // Determine active nav: dashboard, board (any project), settings
  const getIsActive = (href: string) => {
    if (href === "/board") return pathname.startsWith("/board");
    return pathname === href;
  };

  return (
    <aside
      className="w-[68px] min-w-[68px] h-screen flex flex-col items-center py-[22px]
                 bg-bg-sidebar border-r border-border flex-shrink-0"
      style={{ backdropFilter: "blur(24px) saturate(1.6)" }}
    >
      {/* Logo */}
      <div
        className="w-[38px] h-[38px] rounded-xl bg-accent flex items-center justify-center mb-8 flex-shrink-0"
        style={{ boxShadow: "0 4px 16px rgba(230,206,0,0.28)" }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#000">
          <rect x="3" y="3" width="8" height="8" rx="1.5"/>
          <rect x="13" y="3" width="8" height="8" rx="1.5"/>
          <rect x="3" y="13" width="8" height="8" rx="1.5"/>
          <rect x="13" y="13" width="8" height="8" rx="1.5"/>
        </svg>
      </div>

      {/* Nav */}
      <nav className="flex flex-col items-center gap-1.5 flex-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = getIsActive(href);
          return (
            <Link
              key={href}
              href={href === "/board" ? `/board/${activeProjectId}` : href}
              title={label}
              className={`w-[42px] h-[42px] rounded-xl flex items-center justify-center transition-all ${
                active
                  ? "bg-accent text-black shadow-[0_2px_12px_rgba(230,206,0,0.28)]"
                  : "text-text-muted hover:bg-bg-card hover:text-text-secondary"
              }`}
            >
              <Icon className="w-[18px] h-[18px]" />
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="flex flex-col items-center gap-3.5">
        {/* Bell */}
        <div className="relative w-[38px] h-[38px] rounded-full bg-bg-card border border-border flex items-center justify-center text-text-secondary cursor-pointer hover:bg-bg-card-2 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-[9px] right-[9px] w-[7px] h-[7px] rounded-full bg-accent-orange border-2 border-bg-sidebar" />
        </div>

        {/* Avatar */}
        <div className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-[#3A3010] to-[#5A4820] border-2 border-accent-dim flex items-center justify-center font-display text-[13px] font-bold text-accent cursor-pointer">
          {mockUser.avatarInitials.toUpperCase()}
        </div>
      </div>
    </aside>
  );
}
```

- [ ] **Step 3: Verify sidebar in browser**

Expected: Narrow 68px sidebar, icon-only, active page icon has yellow square background.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/AppShell.tsx src/components/layout/Sidebar.tsx
git commit -m "feat(hazel): icon-only dark sidebar, 68px width"
```

---

## Task 3: Shared UI Components

**Files:**
- Modify: `src/components/ui/Avatar.tsx`
- Modify: `src/components/ui/PriorityBadge.tsx`

- [ ] **Step 1: Update Avatar**

```tsx
// src/components/ui/Avatar.tsx
type AvatarProps = {
  initials: string;
  size?: "sm" | "md";
};

export function Avatar({ initials, size = "md" }: AvatarProps) {
  const sizeClass = size === "sm"
    ? "w-8 h-8 text-xs"
    : "w-10 h-10 text-sm";
  return (
    <div
      className={`${sizeClass} rounded-full bg-gradient-to-br from-[#3A3010] to-[#5A4820] border-2 border-accent-dim flex items-center justify-center font-display font-bold text-accent flex-shrink-0`}
    >
      {initials.toUpperCase()}
    </div>
  );
}
```

- [ ] **Step 2: Update PriorityBadge — Apple pill style**

```tsx
// src/components/ui/PriorityBadge.tsx
import { Priority } from "@/data/mock";

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  high: {
    label: "High",
    className: "bg-[rgba(255,59,48,0.16)] text-accent-red border border-[rgba(255,59,48,0.22)]",
  },
  medium: {
    label: "Medium",
    className: "bg-accent-orange-dim text-accent-orange border border-[rgba(217,120,32,0.22)]",
  },
  low: {
    label: "Low",
    className: "bg-[rgba(10,132,255,0.16)] text-accent-blue border border-[rgba(10,132,255,0.22)]",
  },
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  const { label, className } = priorityConfig[priority];
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${className}`}>
      {label}
    </span>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/Avatar.tsx src/components/ui/PriorityBadge.tsx
git commit -m "feat(hazel): dark Avatar + Apple pill PriorityBadge"
```

---

## Task 4: Dashboard Page + Feature Components

**Files:**
- Modify: `src/app/dashboard/page.tsx`
- Modify: `src/features/dashboard/SummaryCards.tsx`
- Modify: `src/features/dashboard/WeeklyChart.tsx`
- Modify: `src/features/dashboard/UpcomingTasks.tsx`

### 4a — Dashboard Page Layout

The dashboard page changes from a simple `max-w-4xl` column to a structured header + hero-row + middle-row layout matching the mock.

- [ ] **Step 1: Rewrite dashboard/page.tsx**

```tsx
// src/app/dashboard/page.tsx
import { SummaryCards } from "@/features/dashboard/SummaryCards";
import { WeeklyChart } from "@/features/dashboard/WeeklyChart";
import { UpcomingTasks } from "@/features/dashboard/UpcomingTasks";
import { LayoutDashboard, Home, ChevronDown } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full p-6 gap-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-[34px] h-[34px] bg-accent-dim border border-accent-glow rounded-lg flex items-center justify-center text-accent">
            <LayoutDashboard className="w-[17px] h-[17px]" />
          </div>
          <h1 className="font-display text-2xl font-bold text-text-primary tracking-tight">
            Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-bg-card border border-border rounded-lg px-3.5 py-2 text-sm font-medium text-text-secondary hover:bg-bg-card-2 transition-colors">
            <Home className="w-3.5 h-3.5 opacity-70" />
            All Projects
            <ChevronDown className="w-[11px] h-[11px]" />
          </button>
          <button className="flex items-center gap-2 bg-bg-card border border-border rounded-lg px-3.5 py-2 text-sm font-medium text-text-secondary hover:bg-bg-card-2 transition-colors">
            This Week
            <ChevronDown className="w-[11px] h-[11px]" />
          </button>
        </div>
      </div>

      {/* Hero Cards */}
      <SummaryCards />

      {/* Middle Row */}
      <div className="grid grid-cols-2 gap-4 flex-shrink-0">
        <WeeklyChart />
        <UpcomingTasks />
      </div>
    </div>
  );
}
```

### 4b — SummaryCards → Hero Cards

Replace the 3 identical light cards with the Netsuite-style colored trio.

- [ ] **Step 2: Rewrite SummaryCards**

```tsx
// src/features/dashboard/SummaryCards.tsx
"use client";

import { useTaskStore } from "@/store/useTaskStore";
import { mockProjects } from "@/data/mock";

export function SummaryCards() {
  const tasks = useTaskStore((s) => s.tasks);

  const total = tasks.length;
  const inProgressCount = tasks.filter((t) => t.status === "in_progress").length;
  const doneCount = tasks.filter((t) => t.status === "done").length;
  const overdueCount = tasks.filter((t) => {
    const today = new Date().toISOString().split("T")[0];
    return t.status !== "done" && t.dueDate < today;
  }).length;
  const highCount = tasks.filter((t) => t.priority === "high" && t.status !== "done").length;

  // Spotlight: first high-priority non-done task
  const spotlight = tasks.find((t) => t.priority === "high" && t.status !== "done") ?? tasks[0];
  const spotlightProject = mockProjects.find((p) => p.id === spotlight?.projectId);

  return (
    <div className="grid grid-cols-3 gap-4 flex-shrink-0">

      {/* Yellow — All Tasks */}
      <div className="relative rounded-[20px] p-6 overflow-hidden bg-accent min-h-[168px] flex flex-col">
        <p className="font-display text-[15px] font-bold text-black/55">Tasks</p>
        {/* Adjust icon */}
        <span className="absolute top-[18px] right-[18px] w-7 h-7 bg-black/10 rounded-lg flex items-center justify-center cursor-pointer">
          <span className="text-black/40 text-xs font-bold">≡</span>
        </span>
        <p className="font-display text-[56px] font-extrabold leading-none mt-1.5 text-black tracking-[-2px]">
          {total}
        </p>
        <p className="text-[13px] font-medium text-black/45 mt-0.5">Total across all projects</p>
        <div className="flex flex-col gap-1 mt-2.5">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-[22px] font-bold text-black">{doneCount}</span>
            <span className="text-[13px] font-medium text-black/50">Completed</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-[22px] font-bold text-black">{overdueCount}</span>
            <span className="text-[13px] font-medium text-black/50">Overdue</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-[22px] font-bold text-black">{highCount}</span>
            <span className="text-[13px] font-medium text-black/50">High priority</span>
          </div>
        </div>
        {/* Dot grid texture */}
        <svg
          className="absolute bottom-[-10px] right-[56px] w-[96px] h-[64px] opacity-[0.16] pointer-events-none"
          viewBox="0 0 96 64"
        >
          <pattern id="dp" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="rgba(0,0,0,0.8)" />
          </pattern>
          <rect width="96" height="64" fill="url(#dp)" />
        </svg>
        {/* Bar decoration */}
        <div className="absolute bottom-[18px] right-[18px] w-12 h-[58px] bg-black/16 rounded-lg" />
      </div>

      {/* Orange — In Progress */}
      <div className="relative rounded-[20px] p-6 overflow-hidden min-h-[168px] flex flex-col" style={{ background: "#D97820" }}>
        <p className="font-display text-[15px] font-bold text-white/60">In Progress</p>
        <p className="font-display text-[56px] font-extrabold leading-none mt-1.5 text-white tracking-[-2px]">
          {inProgressCount}
        </p>
        <div className="flex flex-col gap-1.5 mt-3">
          {mockProjects.map((p, i) => (
            <div key={p.id} className="flex items-center gap-2 text-[13px] font-medium text-white/80">
              <span
                className="w-[7px] h-[7px] rounded-full flex-shrink-0"
                style={{ background: `rgba(255,255,255,${i === 0 ? 0.9 : i === 1 ? 0.5 : 0.25})` }}
              />
              {p.name}
            </div>
          ))}
        </div>
        {/* Yellow badge */}
        <div
          className="absolute top-1/2 right-[22px] -translate-y-[58%] w-[60px] h-[60px] rounded-2xl bg-accent flex items-center justify-center font-display text-[28px] font-extrabold text-black"
          style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.25)" }}
        >
          {inProgressCount}
        </div>
        {/* Stripe texture */}
        <div
          className="absolute -bottom-5 -right-5 w-[130px] h-[130px] rounded-full opacity-[0.18] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg,rgba(0,0,0,0.6) 0px,rgba(0,0,0,0.6) 2px,transparent 2px,transparent 10px)",
          }}
        />
      </div>

      {/* Dark — Upcoming spotlight */}
      <div className="relative rounded-[20px] p-6 bg-bg-card-2 border border-border min-h-[168px] flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.04)]">
        <div className="flex justify-between items-start">
          <p className="font-display text-[15px] font-bold text-text-secondary">Upcoming</p>
          <div className="w-[26px] h-[26px] bg-white/5 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/9 transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
              <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
            </svg>
          </div>
        </div>

        {spotlight && (
          <div className="flex flex-col gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[rgba(255,59,48,0.16)] text-accent-red border border-[rgba(255,59,48,0.22)]">
              <span className="w-[7px] h-[7px] rounded-full bg-accent-red" />
              High priority
            </span>
            <p className="font-display text-[18px] font-bold text-text-primary leading-[1.3] tracking-[-0.2px]">
              {spotlight.title}
            </p>
            <p className="text-[13px] text-text-muted">
              Due {spotlight.dueDate} · {spotlightProject?.name}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <div className="w-[26px] h-[26px] rounded-full bg-gradient-to-br from-[#3A3010] to-[#5A4820] border-2 border-[#1E1C14] flex items-center justify-center font-display text-[10px] font-bold text-accent">
                LE
              </div>
            </div>
            <span className="text-[13px] text-text-muted">
              {spotlight?.subtasks.length ?? 0} subtasks
            </span>
          </div>
          <div className="w-[34px] h-[34px] rounded-[10px] bg-accent flex items-center justify-center cursor-pointer text-black text-xl font-light shadow-[0_2px_10px_rgba(230,206,0,0.28)] hover:scale-105 transition-transform">
            +
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 4c — WeeklyChart

- [ ] **Step 3: Rewrite WeeklyChart**

```tsx
// src/features/dashboard/WeeklyChart.tsx
const weeklyData = [
  { day: "Mon", value: 26, type: "low" },
  { day: "Tue", value: 44, type: "orange" },
  { day: "Wed", value: 62, type: "yellow" },
  { day: "Thu", value: 50, type: "orange" },
  { day: "Fri", value: 70, type: "yellow" },
  { day: "Sat", value: 18, type: "low" },
  { day: "Sun", value: 10, type: "low" },
];

const barColor: Record<string, string> = {
  yellow: "bg-accent",
  orange: "bg-accent-orange",
  low:    "bg-bg-card-2",
};

export function WeeklyChart() {
  return (
    <div className="bg-bg-card border border-border rounded-[20px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
      <div className="flex items-center justify-between mb-4">
        <p className="font-display text-[15px] font-bold text-text-primary">Weekly Activity</p>
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-text-muted">Mar 10 – 16</span>
        </div>
      </div>

      {/* Bars */}
      <div className="flex items-end gap-2 h-[76px]">
        {weeklyData.map((d) => (
          <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
            <div
              className={`w-full rounded-t-[5px] cursor-pointer hover:opacity-80 transition-opacity ${barColor[d.type]}`}
              style={{ height: `${d.value}px` }}
            />
            <span className="text-[12px] font-medium text-text-muted">{d.day}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex gap-4 mt-3 pt-2.5 border-t border-border-soft">
        {[
          { color: "bg-accent",       label: "Completed", num: 12 },
          { color: "bg-accent-orange", label: "Started",   num: 8 },
          { color: "bg-bg-card-2",    label: "Created",   num: 5 },
        ].map(({ color, label, num }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-[3px] flex-shrink-0 ${color}`} />
            <span className="text-[13px] text-text-muted">{label}</span>
            <span className="font-display text-[14px] font-bold text-text-primary">{num}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 4d — UpcomingTasks → Projects panel

- [ ] **Step 4: Rewrite UpcomingTasks**

```tsx
// src/features/dashboard/UpcomingTasks.tsx
"use client";

import Link from "next/link";
import { useTaskStore } from "@/store/useTaskStore";
import { mockProjects } from "@/data/mock";

export function UpcomingTasks() {
  const tasks = useTaskStore((s) => s.tasks);

  return (
    <div className="bg-bg-card border border-border rounded-[20px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
      <div className="flex items-center justify-between mb-4">
        <p className="font-display text-[15px] font-bold text-text-primary">Projects</p>
      </div>

      <div className="flex flex-col gap-1.5">
        {mockProjects.map((project) => {
          const projectTasks = tasks.filter((t) => t.projectId === project.id);
          const donePct = projectTasks.length > 0
            ? Math.round((projectTasks.filter((t) => t.status === "done").length / projectTasks.length) * 100)
            : 0;

          return (
            <Link
              key={project.id}
              href={`/board/${project.id}`}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] bg-bg-card-2 hover:bg-white/[0.04] cursor-pointer transition-colors"
            >
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: project.color }}
              />
              <span className="flex-1 text-[14px] font-medium text-text-primary">
                {project.name}
              </span>
              <span className="text-[13px] text-text-muted">{projectTasks.length} tasks</span>
              <div className="w-[56px] h-1 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${donePct}%`, backgroundColor: project.color }}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Verify dashboard in browser**

Navigate to `http://localhost:3000/dashboard`.
Expected: 3 hero cards (yellow/orange/dark), weekly chart, projects list — matching the HTML mock.

- [ ] **Step 6: Commit**

```bash
git add src/app/dashboard/page.tsx src/features/dashboard/
git commit -m "feat(hazel): dark dashboard — hero cards, weekly chart, projects panel"
```

---

## Task 5: Board Page + Feature Components

**Files:**
- Modify: `src/app/board/[projectId]/page.tsx`
- Modify: `src/features/board/KanbanCounters.tsx`
- Modify: `src/features/board/TaskCard.tsx`
- Modify: `src/features/board/TaskDetailPanel.tsx`

### 5a — Board Page

- [ ] **Step 1: Update board page header**

```tsx
// src/app/board/[projectId]/page.tsx
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useTaskStore } from "@/store/useTaskStore";
import { mockProjects } from "@/data/mock";
import { Status } from "@/data/mock";
import { KanbanCounters } from "@/features/board/KanbanCounters";
import { TaskList } from "@/features/board/TaskList";
import { TaskDetailPanel } from "@/features/board/TaskDetailPanel";
import { ChevronDown, Plus } from "lucide-react";

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
      <div className="flex-1 flex flex-col p-6 gap-5 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            {project && (
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: project.color }}
              />
            )}
            <h1 className="font-display text-2xl font-bold text-text-primary tracking-tight">
              {project?.name ?? "Project"}
            </h1>
            <span className="text-[14px] text-text-muted font-medium">
              {projectTasks.length} tasks
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 bg-bg-card border border-border rounded-lg px-3.5 py-2 text-[14px] font-medium text-text-secondary hover:bg-bg-card-2 transition-colors">
              Status
              <ChevronDown className="w-[11px] h-[11px]" />
            </button>
            <button
              className="flex items-center gap-1.5 bg-accent rounded-lg px-4 py-2 text-[14px] font-semibold text-black hover:opacity-90 transition-opacity"
              style={{ boxShadow: "0 2px 10px rgba(230,206,0,0.28)" }}
            >
              <Plus className="w-3.5 h-3.5" />
              New Task
            </button>
          </div>
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

      <TaskDetailPanel task={selectedTask} onClose={() => setSelectedTask(null)} />
    </div>
  );
}
```

### 5b — KanbanCounters

- [ ] **Step 2: Rewrite KanbanCounters**

```tsx
// src/features/board/KanbanCounters.tsx
"use client";

import { Status } from "@/data/mock";

type Props = {
  todoCnt: number;
  inProgressCnt: number;
  doneCnt: number;
  activeFilter: Status | null;
  onFilter: (status: Status | null) => void;
};

const columns: {
  status: Status;
  label: string;
  activeBg: string;
  activeText: string;
  badgeClass: string;
}[] = [
  {
    status: "todo",
    label: "To Do",
    activeBg: "border-white/10 bg-white/[0.04]",
    activeText: "text-text-primary",
    badgeClass: "bg-white/[0.05] text-text-muted border border-border",
  },
  {
    status: "in_progress",
    label: "In Progress",
    activeBg: "border-accent-orange/30 bg-accent-orange-dim",
    activeText: "text-accent-orange",
    badgeClass: "bg-accent-orange-dim text-accent-orange border border-[rgba(217,120,32,0.22)]",
  },
  {
    status: "done",
    label: "Done",
    activeBg: "border-[rgba(52,199,89,0.3)] bg-[rgba(52,199,89,0.08)]",
    activeText: "text-accent-green",
    badgeClass: "bg-[rgba(52,199,89,0.12)] text-accent-green border border-[rgba(52,199,89,0.2)]",
  },
];

export function KanbanCounters({
  todoCnt, inProgressCnt, doneCnt, activeFilter, onFilter,
}: Props) {
  const counts: Record<Status, number> = {
    todo: todoCnt,
    in_progress: inProgressCnt,
    done: doneCnt,
  };

  return (
    <div className="grid grid-cols-3 gap-3 flex-shrink-0">
      {columns.map(({ status, label, activeBg, activeText, badgeClass }) => {
        const isActive = activeFilter === status;
        return (
          <button
            key={status}
            onClick={() => onFilter(isActive ? null : status)}
            className={`rounded-[20px] border p-5 text-left transition-all ${
              isActive ? activeBg : "border-border bg-bg-card hover:border-white/10 hover:bg-bg-card-2"
            }`}
          >
            <p className={`text-[12px] font-semibold uppercase tracking-[0.06em] ${
              isActive ? activeText : "text-text-muted"
            }`}>
              {label}
            </p>
            <p className="font-display text-[40px] font-extrabold text-text-primary mt-1 tracking-[-1.5px] leading-none">
              {counts[status]}
            </p>
            <span className={`inline-flex items-center mt-2 px-2.5 py-1 rounded-full text-xs font-semibold ${badgeClass}`}>
              {counts[status] === 1 ? "task" : "tasks"}
            </span>
          </button>
        );
      })}
    </div>
  );
}
```

### 5c — TaskCard

- [ ] **Step 3: Rewrite TaskCard**

```tsx
// src/features/board/TaskCard.tsx
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

const statusConfig: Record<Status, { label: string; className: string }> = {
  todo: {
    label: "To Do",
    className: "bg-white/[0.05] text-text-muted border border-border",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-accent-orange-dim text-accent-orange border border-[rgba(217,120,32,0.2)]",
  },
  done: {
    label: "Done",
    className: "bg-[rgba(52,199,89,0.12)] text-accent-green border border-[rgba(52,199,89,0.2)]",
  },
};

type Props = {
  task: Task;
  onSelect: (id: string) => void;
};

export function TaskCard({ task, onSelect }: Props) {
  const { updateTaskStatus } = useTaskStore();
  const isDone = task.status === "done";
  const { label, className } = statusConfig[task.status];

  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateTaskStatus(task.id, statusCycle[task.status]);
  };

  return (
    <div
      onClick={() => onSelect(task.id)}
      className="bg-bg-card border border-border rounded-2xl px-5 py-3.5 flex items-center gap-4 cursor-pointer hover:border-white/10 hover:bg-bg-card-2 transition-all group"
    >
      {/* Checkbox */}
      <button
        onClick={handleStatusClick}
        className="flex-shrink-0 w-[18px] h-[18px] rounded-full border-[1.5px] border-text-muted group-hover:border-text-secondary flex items-center justify-center transition-colors"
      >
        {isDone && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-[7px] h-[7px] rounded-full bg-accent"
          />
        )}
      </button>

      {/* Title */}
      <p className={`flex-1 text-[15px] font-medium truncate ${
        isDone ? "line-through text-text-muted" : "text-text-primary"
      }`}>
        {task.title}
      </p>

      {/* Meta */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <PriorityBadge priority={task.priority} />
        <div className="flex items-center gap-1.5 text-[13px] text-text-muted">
          <Calendar className="w-3 h-3" />
          <span>{task.dueDate}</span>
        </div>
        <button
          onClick={handleStatusClick}
          className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-opacity hover:opacity-80 ${className}`}
        >
          {label}
        </button>
      </div>
    </div>
  );
}
```

### 5d — TaskDetailPanel

- [ ] **Step 4: Rewrite TaskDetailPanel**

```tsx
// src/features/board/TaskDetailPanel.tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Task } from "@/data/mock";
import { useTaskStore } from "@/store/useTaskStore";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { X, Calendar, CheckSquare } from "lucide-react";

type Props = { task: Task | null; onClose: () => void };

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
            className="absolute inset-0 bg-black/20 z-10"
          />

          {/* Panel */}
          <motion.aside
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute right-0 top-0 h-full w-96 bg-bg-card border-l border-border z-20 flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
              <p className="text-[12px] font-semibold text-text-label uppercase tracking-[0.06em]">
                Task Detail
              </p>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-bg-card-2 text-text-muted hover:text-text-primary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 px-6 py-5 space-y-5">
              <h2 className="font-display text-[20px] font-bold text-text-primary leading-snug tracking-[-0.3px]">
                {task.title}
              </h2>

              <div>
                <p className="text-[12px] font-semibold text-text-label uppercase tracking-[0.06em] mb-1.5">
                  Description
                </p>
                <p className="text-[15px] text-text-secondary leading-relaxed">{task.description}</p>
              </div>

              <div className="flex items-center gap-5">
                <div>
                  <p className="text-[12px] font-semibold text-text-label uppercase tracking-[0.06em] mb-1.5">
                    Priority
                  </p>
                  <PriorityBadge priority={task.priority} />
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-text-label uppercase tracking-[0.06em] mb-1.5">
                    Due Date
                  </p>
                  <div className="flex items-center gap-1.5 text-[15px] text-text-primary">
                    <Calendar className="w-3.5 h-3.5 text-text-muted" />
                    <span>{task.dueDate}</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[12px] font-semibold text-text-label uppercase tracking-[0.06em] mb-3">
                  Subtasks ({task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length})
                </p>
                <div className="space-y-2">
                  {task.subtasks.map((subtask) => (
                    <button
                      key={subtask.id}
                      onClick={() => toggleSubtask(task.id, subtask.id)}
                      className="w-full flex items-center gap-3 group"
                    >
                      <div className="w-4 h-4 rounded-[4px] border-[1.5px] border-border group-hover:border-accent flex items-center justify-center transition-colors flex-shrink-0">
                        <AnimatePresence>
                          {subtask.completed && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="w-2 h-2 rounded-[2px] bg-accent"
                            />
                          )}
                        </AnimatePresence>
                      </div>
                      <span
                        className={`text-[15px] text-left transition-colors ${
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

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border flex-shrink-0">
              <button
                onClick={() => {
                  updateTaskStatus(task.id, task.status === "done" ? "todo" : "done");
                  onClose();
                }}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[15px] font-semibold transition-all ${
                  task.status === "done"
                    ? "bg-bg-card-2 text-text-muted hover:bg-white/[0.06]"
                    : "bg-accent text-black hover:opacity-90 shadow-[0_2px_10px_rgba(230,206,0,0.28)]"
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

- [ ] **Step 5: Verify board page in browser**

Navigate to `http://localhost:3000/board/p1`.
Expected: Dark background, dark kanban counters with Apple status colors, dark task rows, pill badges.

- [ ] **Step 6: Commit**

```bash
git add src/app/board/ src/features/board/
git commit -m "feat(hazel): dark board — kanban counters, task cards, detail panel"
```

---

## Task 6: Settings Page

**Files:**
- Modify: `src/app/settings/page.tsx`
- Modify: `src/features/settings/ProfileSection.tsx`
- Modify: `src/features/settings/PreferencesSection.tsx`

- [ ] **Step 1: Update settings/page.tsx**

```tsx
// src/app/settings/page.tsx
import { ProfileSection } from "@/features/settings/ProfileSection";
import { PreferencesSection } from "@/features/settings/PreferencesSection";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col p-6 gap-5 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-[34px] h-[34px] bg-accent-dim border border-accent-glow rounded-lg flex items-center justify-center text-accent">
          <Settings className="w-[17px] h-[17px]" />
        </div>
        <h1 className="font-display text-2xl font-bold text-text-primary tracking-tight">
          Settings
        </h1>
      </div>
      <ProfileSection />
      <PreferencesSection />
    </div>
  );
}
```

- [ ] **Step 2: Update ProfileSection**

```tsx
// src/features/settings/ProfileSection.tsx
import { mockUser } from "@/data/mock";

export function ProfileSection() {
  return (
    <div className="bg-bg-card rounded-[20px] border border-border p-6 shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
      <h2 className="font-display text-[15px] font-bold text-text-primary mb-5">Profile</h2>
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#3A3010] to-[#5A4820] border-2 border-accent-dim flex items-center justify-center font-display text-xl font-bold text-accent">
          {mockUser.avatarInitials.toUpperCase()}
        </div>
        <div>
          <p className="text-[17px] font-semibold text-text-primary">{mockUser.name}</p>
          <p className="text-[14px] text-text-muted mt-0.5">{mockUser.email}</p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Update PreferencesSection**

```tsx
// src/features/settings/PreferencesSection.tsx
"use client";

import { useState } from "react";

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-10 h-5 rounded-full transition-colors ${
        checked ? "bg-accent" : "bg-bg-card-2 border border-border"
      }`}
      style={checked ? { boxShadow: "0 0 8px rgba(230,206,0,0.3)" } : {}}
    >
      <span
        className={`absolute top-[3px] w-[14px] h-[14px] rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-[22px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}

export function PreferencesSection() {
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="space-y-4">
      <div className="bg-bg-card rounded-[20px] border border-border p-6 shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
        <h2 className="font-display text-[15px] font-bold text-text-primary mb-5">Preferences</h2>
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[15px] font-medium text-text-primary">Notifications</p>
              <p className="text-[13px] text-text-muted mt-0.5">Receive reminders for upcoming tasks</p>
            </div>
            <Toggle checked={notifications} onChange={() => setNotifications((v) => !v)} />
          </div>
          <div className="h-px bg-border-soft" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[15px] font-medium text-text-primary">Theme</p>
              <p className="text-[13px] text-text-muted mt-0.5">Currently using dark mode</p>
            </div>
            <span className="text-[12px] px-2.5 py-1 bg-accent-dim border border-accent-glow text-accent rounded-full font-semibold">
              Dark
            </span>
          </div>
        </div>
      </div>

      <div className="bg-bg-card rounded-[20px] border border-border p-6 shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
        <h2 className="font-display text-[15px] font-bold text-text-primary mb-5">About Hazel</h2>
        <div className="space-y-3 text-[15px]">
          {[
            { label: "Version", value: "1.0.0-mvp" },
            { label: "Built with", value: "Next.js · Tailwind · Framer Motion" },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between">
              <span className="text-text-muted">{label}</span>
              <span className="text-text-primary font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify settings page**

Navigate to `http://localhost:3000/settings`.
Expected: Dark profile card with accent avatar, dark preferences card, accent toggle.

- [ ] **Step 5: Commit**

```bash
git add src/app/settings/page.tsx src/features/settings/
git commit -m "feat(hazel): dark settings page"
```

---

## Task 7: Final Verification

- [ ] **Step 1: Build check**

```bash
cd saas-tarefas && npm run build
```
Expected: Successful build, no TypeScript errors.

- [ ] **Step 2: Lint check**

```bash
npm run lint
```
Expected: No errors (warnings about missing `key` props are acceptable if pre-existing).

- [ ] **Step 3: Full smoke test**

1. `/dashboard` — hero cards render, chart visible, projects list visible
2. `/board/p1` — dark task list, kanban counters clickable (filter works)
3. Click any task → detail panel slides in with dark styling
4. Click checkbox → status cycles, animates correctly
5. `/settings` — profile + preferences render correctly
6. Sidebar: active item highlights yellow, all 6 icons visible

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat(hazel): complete dark redesign — Netsuite CRM + Apple HIG"
```
