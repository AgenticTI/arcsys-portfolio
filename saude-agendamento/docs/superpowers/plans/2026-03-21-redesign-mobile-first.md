# SaudeApp Redesign — Mobile-First Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform SaudeApp from a desktop-only generic UI into a portfolio-worthy app with dual themes (dark doctor/light patient), lime green palette, and fully responsive mobile-first layouts.

**Architecture:** Progressive redesign — update Tailwind config first (foundation), then shared components, then layouts, then pages. No test runner is configured; use `npx tsc --noEmit` and `npm run build` for verification. All existing routes, Zustand store, and JSON data remain unchanged.

**Tech Stack:** Next.js 14 (App Router), React 18, TypeScript 5, Tailwind CSS 3.4, Zustand 5, shadcn/ui, lucide-react

**Spec:** `docs/superpowers/specs/2026-03-21-redesign-mobile-first-design.md`

**Visual mockups:** `.superpowers/brainstorm/2299-1774091633/` (patient-pages-mockup.html, doctor-dashboard-mockup.html, landing-page-options.html)

---

## File Map

### New files

| File | Responsibility |
|---|---|
| `src/components/MobileTabBar.tsx` | Bottom tab bar for patient mobile (Home, Buscar, FAB, Historico, Perfil) |
| `src/components/MobileHeader.tsx` | Contextual header for patient mobile pages |
| `src/components/DoctorSidebar.tsx` | Icon-only sidebar for doctor desktop (64px) |
| `src/components/StatsCard.tsx` | Reusable stat card (number + label + trend) |
| `src/components/ScheduleTable.tsx` | Table component for doctor's daily schedule |
| `src/components/MiniCalendar.tsx` | Monthly calendar widget (dark theme) |
| `src/components/WeeklyChart.tsx` | Pure CSS bar chart for weekly bookings |

### Modified files

| File | What changes |
|---|---|
| `tailwind.config.ts` | New color palette (primary → #88CD0A, dark tokens), remove accent |
| `src/app/globals.css` | Add font-weight 800, update base body styles |
| `src/components/Sidebar.tsx` | Complete rewrite: dark bg, user card, lime accents, hidden on mobile |
| `src/components/StatusBadge.tsx` | Update confirmed color to lime #88CD0A |
| `src/components/AppointmentCard.tsx` | New palette, responsive layout (row on desktop, stack on mobile) |
| `src/components/DoctorCard.tsx` | Desktop: centered card. Mobile: horizontal row. Lime specialty text |
| `src/components/TimeSlotGrid.tsx` | 4 cols desktop / 2 cols mobile, lime selection style |
| `src/app/page.tsx` | Replace role selection with full landing page |
| `src/app/paciente/layout.tsx` | Responsive: sidebar on md+, MobileTabBar + MobileHeader on <md |
| `src/app/paciente/dashboard/page.tsx` | Add hero card, stats row, new appointment list |
| `src/app/paciente/buscar/page.tsx` | Grid on desktop, list on mobile, new card style |
| `src/app/paciente/medico/[id]/page.tsx` | Redesign with new palette |
| `src/app/paciente/agendar/[id]/page.tsx` | Split view desktop, stacked mobile, doctor panel |
| `src/app/paciente/confirmacao/page.tsx` | Success icon, summary card, new palette |
| `src/app/paciente/historico/page.tsx` | Table desktop, cards mobile, filter chips |
| `src/app/medico/layout.tsx` | DoctorSidebar on desktop, dark header on mobile |
| `src/app/medico/agenda/page.tsx` | Full dashboard: stats, table, calendar, chart |

---

## Task 1: Update Tailwind Config & Global Styles

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/app/globals.css`

This is the foundation — all other tasks depend on these tokens being correct.

- [ ] **Step 1: Update tailwind.config.ts**

Replace the entire `colors` section in `theme.extend`:

```ts
colors: {
  primary: {
    DEFAULT: "#88CD0A",
    light: "rgba(136,205,10,0.12)",
    dark: "#6B9C00",
  },
  dark: {
    bg: "#0f1114",
    card: "#1A1D23",
    border: "#2d3139",
    surface: "#3d4149",
  },
  neutral: {
    900: "#1A1D23",
    800: "#2d3139",
    500: "#6B7280",
    100: "#F4F6F8",
  },
  status: {
    confirmed: "#88CD0A",
    pending: "#F59E0B",
    cancelled: "#EF4444",
  },
},
```

Remove the `accent: "#5B8CDB"` line entirely. Also update `boxShadow.card` to `"0 1px 4px rgba(0,0,0,0.05)"`.

- [ ] **Step 2: Update globals.css**

Update the Google Fonts import to include weight 800:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
```

- [ ] **Step 3: Verify build**

Run: `npx tsc --noEmit`

Expected: Some errors in files that reference `text-accent` (DoctorCard.tsx). These will be fixed in later tasks. Note them but don't fix now.

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.ts src/app/globals.css
git commit -m "chore: update tailwind palette to lime green and dark tokens"
```

---

## Task 2: Update StatusBadge Component

**Files:**
- Modify: `src/components/StatusBadge.tsx`

- [ ] **Step 1: Update StatusBadge colors**

The confirmed status should use the new lime green. Replace the entire `config` object:

```tsx
const config: Record<AppointmentStatus, { label: string; className: string }> = {
  confirmed: {
    label: "Confirmado",
    className: "bg-primary/10 text-primary-dark border border-primary/20",
  },
  pending: {
    label: "Pendente",
    className: "bg-amber-50 text-amber-600 border border-amber-200",
  },
  cancelled: {
    label: "Cancelado",
    className: "bg-red-50 text-red-500 border border-red-200",
  },
};
```

Note: `text-primary-dark` maps to `#6B9C00` (the new dark variant for text on light backgrounds). `bg-primary/10` uses Tailwind opacity modifier on `#88CD0A`.

- [ ] **Step 2: Commit**

```bash
git add src/components/StatusBadge.tsx
git commit -m "feat: update StatusBadge to lime green palette"
```

---

## Task 3: Create MobileTabBar Component

**Files:**
- Create: `src/components/MobileTabBar.tsx`

- [ ] **Step 1: Create MobileTabBar**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Search, Clock, User, Plus } from "lucide-react";

const tabs = [
  { href: "/paciente/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/paciente/buscar", label: "Buscar", icon: Search },
  { href: "__fab__", label: "", icon: Plus },
  { href: "/paciente/historico", label: "Histórico", icon: Clock },
  { href: "/paciente/perfil", label: "Perfil", icon: User }, // placeholder — no route exists yet, will show 404
];

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 flex justify-around items-center px-2 py-1.5 pb-[env(safe-area-inset-bottom)] z-50">
      {tabs.map(({ href, label, icon: Icon }) => {
        if (href === "__fab__") {
          return (
            <Link
              key="fab"
              href="/paciente/buscar"
              className="w-11 h-11 -mt-5 rounded-full bg-primary flex items-center justify-center shadow-[0_4px_12px_rgba(136,205,10,0.3)]"
            >
              <Plus size={22} className="text-white" strokeWidth={2.5} />
            </Link>
          );
        }

        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 ${
              active ? "text-primary" : "text-neutral-400"
            }`}
          >
            <Icon size={20} strokeWidth={active ? 2.5 : 2} />
            <span className={`text-[9px] ${active ? "font-semibold" : ""}`}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/MobileTabBar.tsx
git commit -m "feat: add MobileTabBar component with FAB"
```

---

## Task 4: Create MobileHeader Component

**Files:**
- Create: `src/components/MobileHeader.tsx`

- [ ] **Step 1: Create MobileHeader**

```tsx
"use client";

import { usePathname } from "next/navigation";
import patient from "@/data/patient.json";

const pageTitles: Record<string, string> = {
  "/paciente/dashboard": "",
  "/paciente/buscar": "Buscar Médico",
  "/paciente/historico": "Histórico",
};

export function MobileHeader() {
  const pathname = usePathname();
  const isDashboard = pathname === "/paciente/dashboard";
  const title = pageTitles[pathname];

  if (isDashboard) {
    return (
      <header className="md:hidden bg-white px-4 py-3 border-b border-neutral-200 flex items-center justify-between">
        <div>
          <p className="text-[11px] text-neutral-500">Bem-vindo,</p>
          <p className="text-[15px] font-bold text-neutral-900">
            {patient.name}
          </p>
        </div>
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-semibold">
          {patient.name.split(" ").map((n) => n[0]).join("")}
        </div>
      </header>
    );
  }

  if (title) {
    return (
      <header className="md:hidden bg-white px-4 py-3 border-b border-neutral-200">
        <p className="text-[15px] font-bold text-neutral-900">{title}</p>
      </header>
    );
  }

  return null;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/MobileHeader.tsx
git commit -m "feat: add MobileHeader component for patient mobile pages"
```

---

## Task 5: Redesign Patient Sidebar

**Files:**
- Modify: `src/components/Sidebar.tsx`

- [ ] **Step 1: Rewrite Sidebar with dark theme**

Replace the entire file content. Key changes: dark background (`bg-dark-card`), user card section, lime active states, CTA button at bottom, `hidden md:flex` to hide on mobile.

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Search, Clock, LogOut } from "lucide-react";
import patient from "@/data/patient.json";

const navItems = [
  { href: "/paciente/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/paciente/buscar", label: "Buscar Médico", icon: Search },
  { href: "/paciente/historico", label: "Histórico", icon: Clock },
];

export function Sidebar() {
  const pathname = usePathname();
  const initials = patient.name.split(" ").map((n) => n[0]).join("");

  return (
    <aside className="hidden md:flex w-60 min-h-screen bg-dark-card flex-col py-4 px-3 gap-1 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
            <path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a2 2 0 002 2h1a2 2 0 002-2V5a2 2 0 00-2-2H4" />
          </svg>
        </div>
        <span className="font-bold text-white text-sm">SaúdeApp</span>
      </div>

      {/* User card */}
      <div className="bg-dark-border rounded-xl px-3 py-2.5 mb-4 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-[11px] font-semibold">
          {initials}
        </div>
        <div>
          <p className="text-xs font-semibold text-white">{patient.name}</p>
          <p className="text-[9px] text-neutral-500">Paciente</p>
        </div>
      </div>

      {/* Menu label */}
      <p className="text-[9px] text-neutral-500 font-semibold tracking-wider px-2 mb-1">
        MENU
      </p>

      {/* Nav items */}
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 px-2 py-2 rounded-lg text-xs font-medium transition-colors ${
              active
                ? "bg-primary/10 text-primary"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Icon size={16} />
            {label}
          </Link>
        );
      })}

      {/* CTA */}
      <Link
        href="/paciente/buscar"
        className="mt-auto bg-primary text-dark-card text-xs font-bold py-3 px-4 rounded-xl text-center hover:bg-primary/90 transition-colors"
      >
        + Agendar Consulta
      </Link>
    </aside>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Sidebar.tsx
git commit -m "feat: redesign Sidebar with dark theme and lime accents"
```

---

## Task 6: Update Patient Layout (Responsive)

**Files:**
- Modify: `src/app/paciente/layout.tsx`

- [ ] **Step 1: Add MobileTabBar and MobileHeader to layout**

```tsx
import { Sidebar } from "@/components/Sidebar";
import { MobileTabBar } from "@/components/MobileTabBar";
import { MobileHeader } from "@/components/MobileHeader";

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-neutral-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <MobileHeader />
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6 overflow-y-auto">
          {children}
        </main>
        <MobileTabBar />
      </div>
    </div>
  );
}
```

Key changes:
- `Sidebar` is `hidden md:flex` (from Task 5)
- `MobileHeader` is `md:hidden` (from Task 4)
- `MobileTabBar` is `md:hidden` (from Task 3)
- Main content has `pb-20` on mobile for tab bar clearance, `p-4 md:p-6` responsive padding

- [ ] **Step 2: Verify build**

Run: `npm run build`

Expected: Build should succeed (or show only warnings for unused variables). The app should now show sidebar on desktop and tab bar on mobile.

- [ ] **Step 3: Commit**

```bash
git add src/app/paciente/layout.tsx
git commit -m "feat: make patient layout responsive with mobile tab bar"
```

---

## Task 7: Redesign AppointmentCard

**Files:**
- Modify: `src/components/AppointmentCard.tsx`

- [ ] **Step 1: Update AppointmentCard with new palette and responsive layout**

Replace the component's return JSX. The card should use white bg with subtle shadow, and be responsive:

```tsx
export function AppointmentCard({ appointment, doctor }: AppointmentCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-card p-3 flex items-center gap-3">
      {doctor?.photo && (
        <img
          src={doctor.photo}
          alt={doctor.name}
          className="w-10 h-10 md:w-11 md:h-11 rounded-full object-cover shrink-0"
        />
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-neutral-900 text-xs md:text-sm truncate">
          {doctor?.name ?? "Médico não encontrado"}
        </p>
        <p className="text-neutral-500 text-[10px] md:text-xs">
          {doctor?.specialty} · {formatDate(appointment.date)} · {appointment.time}
        </p>
      </div>
      <StatusBadge status={appointment.status} />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/AppointmentCard.tsx
git commit -m "feat: redesign AppointmentCard with responsive layout"
```

---

## Task 8: Redesign DoctorCard

**Files:**
- Modify: `src/components/DoctorCard.tsx`

- [ ] **Step 1: Update DoctorCard with responsive desktop/mobile layout**

Replace `text-accent` with `text-primary`. Add responsive layout: grid card on desktop (centered), row card on mobile.

```tsx
import { Doctor } from "@/types";
import { Star, ChevronRight } from "lucide-react";
import Link from "next/link";

interface DoctorCardProps {
  doctor: Doctor;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <Link href={`/paciente/medico/${doctor.id}`}>
      {/* Desktop: centered card */}
      <div className="hidden md:flex bg-white rounded-xl shadow-card p-4 hover:shadow-md transition-shadow cursor-pointer h-full flex-col gap-3 items-center text-center">
        <img
          src={doctor.photo}
          alt={doctor.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-neutral-900 text-xs">{doctor.name}</p>
          <p className="text-[10px] text-primary font-medium">{doctor.specialty}</p>
        </div>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={12}
              className={i < Math.floor(doctor.rating) ? "fill-amber-400 text-amber-400" : "text-neutral-200"}
            />
          ))}
          <span className="text-[10px] text-neutral-500 ml-1">{doctor.rating.toFixed(1)}</span>
        </div>
        <p className="text-[9px] text-neutral-500">{doctor.crm}</p>
        <div className="bg-primary/10 text-primary-dark text-[10px] font-semibold py-1.5 px-4 rounded-lg w-full">
          Ver perfil
        </div>
      </div>

      {/* Mobile: row card */}
      <div className="md:hidden bg-white rounded-xl shadow-card p-3 flex items-center gap-3 cursor-pointer">
        <img
          src={doctor.photo}
          alt={doctor.name}
          className="w-11 h-11 rounded-full object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-neutral-900 text-xs">{doctor.name}</p>
          <p className="text-[10px] text-primary font-medium">{doctor.specialty}</p>
          <div className="flex items-center gap-0.5 mt-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={10}
                className={i < Math.floor(doctor.rating) ? "fill-amber-400 text-amber-400" : "text-neutral-200"}
              />
            ))}
            <span className="text-[9px] text-neutral-500 ml-0.5">{doctor.rating.toFixed(1)}</span>
          </div>
        </div>
        <ChevronRight size={16} className="text-neutral-400 shrink-0" />
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/DoctorCard.tsx
git commit -m "feat: redesign DoctorCard with responsive desktop/mobile layouts"
```

---

## Task 9: Update TimeSlotGrid (Responsive)

**Files:**
- Modify: `src/components/TimeSlotGrid.tsx`

- [ ] **Step 1: Make TimeSlotGrid responsive**

Change `grid-cols-4` to `grid-cols-2 md:grid-cols-4`. Update selection styles to use lime border instead of filled background:

```tsx
export function TimeSlotGrid({
  slots,
  bookedSlots,
  selectedSlot,
  onSelect,
}: TimeSlotGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {slots.map((slot) => {
        const isBooked = bookedSlots.includes(slot);
        const isSelected = selectedSlot === slot;

        return (
          <button
            key={slot}
            disabled={isBooked}
            onClick={() => onSelect(slot)}
            className={`
              py-2.5 px-3 rounded-lg text-sm font-medium border-[1.5px] transition-all
              ${
                isBooked
                  ? "bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed"
                  : isSelected
                  ? "bg-primary/10 text-primary border-primary"
                  : "bg-white text-neutral-900 border-neutral-200 hover:border-primary"
              }
            `}
          >
            {slot}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/TimeSlotGrid.tsx
git commit -m "feat: make TimeSlotGrid responsive (2 cols mobile, 4 desktop)"
```

---

## Task 10: Redesign Landing Page

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Replace role selection with landing page**

Replace the entire page. This is a server component (no hooks needed). Use the approved "Landing Completa" design: dark navbar, hero with headline + mini mockup preview, features strip, footer.

```tsx
import Link from "next/link";
import {
  Calendar,
  Search,
  BarChart3,
  Users,
} from "lucide-react";

const features = [
  { icon: Calendar, title: "Agendamento", desc: "Rápido e fácil" },
  { icon: Search, title: "Busca", desc: "Por especialidade" },
  { icon: BarChart3, title: "Dashboard", desc: "Stats em tempo real" },
  { icon: Users, title: "Dois Papéis", desc: "Paciente e Médico" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-bg font-sans">
      {/* Navbar */}
      <nav className="bg-dark-bg px-6 py-3 flex items-center justify-between border-b border-dark-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
              <path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a2 2 0 002 2h1a2 2 0 002-2V5a2 2 0 00-2-2H4" />
            </svg>
          </div>
          <span className="text-sm font-bold text-white">SaúdeApp</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <span className="text-[11px] text-neutral-500">Funcionalidades</span>
          <span className="text-[11px] text-neutral-500">Sobre</span>
        </div>
        <Link
          href="/paciente/dashboard"
          className="bg-primary text-dark-card text-[11px] font-bold py-1.5 px-4 rounded-lg"
        >
          Acessar
        </Link>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-b from-dark-bg to-dark-card px-6 md:px-16 py-16 md:py-24">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <p className="text-[10px] text-primary font-bold tracking-[2px] mb-3">
              AGENDAMENTO INTELIGENTE
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
              Sua saúde merece
              <br />
              organização
            </h1>
            <p className="text-sm text-neutral-500 mb-8 max-w-md mx-auto md:mx-0">
              Conectamos pacientes e médicos em uma plataforma simples e moderna.
            </p>
            <div className="flex flex-col md:flex-row gap-3">
              <Link
                href="/paciente/dashboard"
                className="bg-primary text-dark-card text-sm font-bold py-3 px-8 rounded-xl text-center"
              >
                Sou Paciente
              </Link>
              <Link
                href="/medico/agenda"
                className="border-[1.5px] border-primary text-primary text-sm font-bold py-3 px-8 rounded-xl text-center"
              >
                Sou Médico
              </Link>
            </div>
          </div>

          {/* Mini mockup preview — hidden on mobile */}
          <div className="hidden md:block w-48 shrink-0">
            <div className="bg-dark-border rounded-xl p-4 rotate-2">
              <div className="bg-primary/10 rounded-lg p-3 mb-2">
                <p className="text-[8px] text-primary font-semibold">PRÓXIMA CONSULTA</p>
                <p className="text-[10px] text-white font-semibold mt-0.5">Dr. Carlos Lima</p>
                <p className="text-[8px] text-neutral-500">08:30 · Clínico Geral</p>
              </div>
              <div className="bg-dark-surface rounded-md p-2 mb-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-neutral-500" />
                  <p className="text-[8px] text-neutral-400">Dra. Ana Costa</p>
                </div>
              </div>
              <div className="bg-dark-surface rounded-md p-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-neutral-500" />
                  <p className="text-[8px] text-neutral-400">Dr. Bruno Neves</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section className="bg-dark-card border-t border-dark-border px-6 py-8">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <Icon size={16} className="text-primary" />
              </div>
              <p className="text-[10px] font-semibold text-white">{title}</p>
              <p className="text-[8px] text-neutral-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-bg py-4 text-center">
        <p className="text-[9px] text-neutral-500">
          Projeto de portfólio · Dados simulados
        </p>
      </footer>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: replace role selection with full landing page"
```

---

## Task 11: Redesign Patient Dashboard

**Files:**
- Modify: `src/app/paciente/dashboard/page.tsx`

- [ ] **Step 1: Redesign dashboard with hero card, stats, and appointment list**

Read the current file first to understand the existing logic (TODAY constant, appointment filtering, doctor lookup). Keep all the data logic, replace only the JSX.

Key additions:
- Dark gradient "Próxima Consulta" hero card with doctor info and large lime time
- 3 stats cards (Agendadas, Confirmadas, Pendentes) computed from filtered appointments
- "Consultas Agendadas" section with redesigned AppointmentCard components
- "+ Agendar consulta" button in header (desktop only, sidebar CTA handles this)

The page is a client component (uses Zustand). Keep `"use client"` and `const TODAY = "2026-03-17"`.

- [ ] **Step 2: Verify build**

Run: `npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/app/paciente/dashboard/page.tsx
git commit -m "feat: redesign patient dashboard with hero card and stats"
```

---

## Task 12: Redesign Search Doctors Page

**Files:**
- Modify: `src/app/paciente/buscar/page.tsx`

- [ ] **Step 1: Update search page with new filter chips and responsive grid**

Keep existing search/filter logic (useState for query and selectedSpecialty). Update JSX:
- Search bar with icon (styled with new palette)
- Filter chips: selected chip gets `bg-primary text-dark-card`, unselected gets white/outlined
- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` (DoctorCard handles its own responsive layout)

- [ ] **Step 2: Commit**

```bash
git add src/app/paciente/buscar/page.tsx
git commit -m "feat: redesign search page with responsive grid and lime chips"
```

---

## Task 13: Redesign Doctor Profile Page

**Files:**
- Modify: `src/app/paciente/medico/[id]/page.tsx`

- [ ] **Step 1: Update doctor profile with new palette**

This is a server component. Update styling to use new tokens (lime for specialty, updated card styling). Keep the "Agendar Consulta" button linking to `/paciente/agendar/[id]`.

- [ ] **Step 2: Commit**

```bash
git add "src/app/paciente/medico/[id]/page.tsx"
git commit -m "feat: redesign doctor profile page with lime palette"
```

---

## Task 14: Redesign Booking Page

**Files:**
- Modify: `src/app/paciente/agendar/[id]/page.tsx`

- [ ] **Step 1: Add split layout with doctor panel**

Read the current file first. Keep all booking logic (week navigation, slot selection, Zustand addAppointment, router push to confirmacao). Update layout:
- Desktop: flex row with doctor info panel (200px left) + calendar/slots (right)
- Mobile: stacked layout with back arrow header, doctor mini card, calendar, slots
- "Confirmar Agendamento" button styled with `bg-primary text-dark-card`

Doctor info for the left panel: find doctor from `doctors.json` by the `id` param, show photo, name, specialty, rating, CRM, bio.

- [ ] **Step 2: Commit**

```bash
git add "src/app/paciente/agendar/[id]/page.tsx"
git commit -m "feat: redesign booking page with split layout and doctor panel"
```

---

## Task 15: Redesign Confirmation Page

**Files:**
- Modify: `src/app/paciente/confirmacao/page.tsx`

- [ ] **Step 1: Update confirmation with success styling**

Keep useSearchParams logic. Update JSX:
- Large lime checkmark icon (circle with check)
- "Consulta Agendada!" heading
- Summary card with doctor, date, time (white card with subtle shadow)
- "Voltar ao Dashboard" button with lime styling

- [ ] **Step 2: Commit**

```bash
git add src/app/paciente/confirmacao/page.tsx
git commit -m "feat: redesign confirmation page with lime success theme"
```

---

## Task 16: Redesign History Page

**Files:**
- Modify: `src/app/paciente/historico/page.tsx`

- [ ] **Step 1: Add filter chips and responsive layout**

Keep existing data logic. Add filter state (useState for status filter: "all" | "confirmed" | "cancelled"). Update JSX:
- Title + filter chips row
- Desktop: table-like list in a single white card (rows with borders)
- Mobile: stacked appointment cards

- [ ] **Step 2: Commit**

```bash
git add src/app/paciente/historico/page.tsx
git commit -m "feat: redesign history page with filter chips and responsive layout"
```

---

## Task 17: Create Doctor Dashboard Components

**Files:**
- Create: `src/components/StatsCard.tsx`
- Create: `src/components/ScheduleTable.tsx`
- Create: `src/components/MiniCalendar.tsx`
- Create: `src/components/WeeklyChart.tsx`
- Create: `src/components/DoctorSidebar.tsx`

- [ ] **Step 1: Create StatsCard**

Reusable dark card with icon, label, large number, and trend text.

```tsx
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  trend?: string;
  trendColor?: string;
}

export function StatsCard({ icon: Icon, label, value, trend, trendColor = "text-primary" }: StatsCardProps) {
  return (
    <div className="bg-dark-card rounded-[14px] p-4 border border-dark-border flex-1">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon size={16} className="text-primary" />
        </div>
        <span className="text-[11px] text-neutral-500">{label}</span>
      </div>
      <p className="text-3xl font-extrabold text-white">{value}</p>
      {trend && <p className={`text-[10px] ${trendColor} mt-1`}>{trend}</p>}
    </div>
  );
}
```

- [ ] **Step 2: Create DoctorSidebar**

Icon-only sidebar (64px) for doctor desktop. Only Dashboard icon is active.

```tsx
"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
} from "lucide-react";
import doctorUser from "@/data/doctor-user.json";

const navIcons = [
  { icon: LayoutDashboard, active: true },
  { icon: Calendar, active: false },
  { icon: Users, active: false },
  { icon: Settings, active: false },
];

export function DoctorSidebar() {
  return (
    <aside className="hidden md:flex w-16 min-h-screen bg-dark-card border-r border-dark-border flex-col items-center py-4 gap-1 shrink-0">
      {/* Logo */}
      <div className="w-9 h-9 rounded-[10px] bg-primary flex items-center justify-center mb-5">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1D23" strokeWidth="2.5">
          <path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a2 2 0 002 2h1a2 2 0 002-2V5a2 2 0 00-2-2H4" />
          <path d="M14 2h-1a2 2 0 00-2 2v5a2 2 0 002 2h1a2 2 0 002-2V4a2 2 0 00-2-2z" />
        </svg>
      </div>

      {/* Nav icons */}
      {navIcons.map(({ icon: Icon, active }, i) => (
        <div
          key={i}
          className={`w-10 h-10 rounded-[10px] flex items-center justify-center ${
            active ? "bg-primary/10" : ""
          }`}
        >
          <Icon size={20} className={active ? "text-primary" : "text-neutral-500"} />
        </div>
      ))}

      {/* Avatar bottom */}
      <div className="mt-auto">
        <img
          src={doctorUser.photo}
          alt={doctorUser.name}
          className="w-9 h-9 rounded-full object-cover border-2 border-primary"
        />
      </div>
    </aside>
  );
}
```

- [ ] **Step 3: Create ScheduleTable**

Table with columns: Hora, Paciente, Motivo, Status, Acao. Receives appointments array, a patient name string (since all mock appointments belong to patient "p1" Rafael Mendes), and confirm/cancel handlers.

**Important:** The `Appointment` type has `reason` (not `description` or `type`), and `patientId` (not `patientName`). The component receives `patientName` as a prop resolved by the parent page from `patient.json`.

```tsx
"use client";

import { Appointment } from "@/types";
import { Check, X } from "lucide-react";

interface ScheduleTableProps {
  appointments: Appointment[];
  patientName: string;
  onConfirm: (id: string) => void;
  onCancel: (id: string) => void;
}

export function ScheduleTable({ appointments, patientName, onConfirm, onCancel }: ScheduleTableProps) {
  return (
    <div className="bg-dark-card rounded-[14px] border border-dark-border overflow-hidden">
      <div className="px-4 py-3 border-b border-dark-border flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white">Agenda de Hoje</span>
          <span className="bg-primary text-dark-card text-[10px] font-bold px-2 py-0.5 rounded-full">
            {appointments.length}
          </span>
        </div>
      </div>
      {/* Table header */}
      <div className="hidden md:flex px-4 py-2 border-b border-dark-border text-[10px] text-neutral-500 font-semibold">
        <div className="w-16">Hora</div>
        <div className="flex-1">Paciente</div>
        <div className="w-24">Motivo</div>
        <div className="w-20">Status</div>
        <div className="w-14">Ação</div>
      </div>
      {/* Rows */}
      {appointments.map((apt) => (
        <div
          key={apt.id}
          className="flex items-center px-4 py-3 border-b border-dark-bg last:border-b-0"
        >
          <div className={`w-16 text-sm font-bold ${apt.status === "confirmed" ? "text-primary" : "text-white"}`}>
            {apt.time}
          </div>
          <div className="flex-1 flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-dark-surface shrink-0" />
            <div>
              <p className="text-xs font-medium text-white">{patientName}</p>
              <p className="text-[9px] text-neutral-500">{apt.reason}</p>
            </div>
          </div>
          <div className="hidden md:block w-24 text-[10px] text-neutral-400">
            {apt.reason}
          </div>
          <div className="w-20">
            <span
              className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${
                apt.status === "confirmed"
                  ? "bg-primary/10 text-primary"
                  : apt.status === "pending"
                  ? "bg-amber-500/10 text-amber-500"
                  : "bg-red-500/10 text-red-500"
              }`}
            >
              {apt.status === "confirmed" ? "CONFIRMADO" : apt.status === "pending" ? "PENDENTE" : "CANCELADO"}
            </span>
          </div>
          <div className="w-14 flex gap-1">
            {apt.status === "pending" && (
              <>
                <button
                  onClick={() => onConfirm(apt.id)}
                  className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center"
                >
                  <Check size={12} className="text-primary" />
                </button>
                <button
                  onClick={() => onCancel(apt.id)}
                  className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center"
                >
                  <X size={12} className="text-red-500" />
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Create MiniCalendar**

Monthly calendar grid. Receives `today` date string, highlights it in lime.

```tsx
interface MiniCalendarProps {
  today: string; // "2026-03-17"
}

export function MiniCalendar({ today }: MiniCalendarProps) {
  const date = new Date(today + "T00:00:00");
  const year = date.getFullYear();
  const month = date.getMonth();
  const todayDay = date.getDate();

  const monthName = date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const weekdays = ["D", "S", "T", "Q", "Q", "S", "S"];

  return (
    <div className="bg-dark-card rounded-[14px] p-4 border border-dark-border">
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-bold text-white capitalize">{monthName}</span>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {weekdays.map((d, i) => (
          <div key={i} className="text-[9px] text-neutral-500 py-1">{d}</div>
        ))}
        {days.map((day, i) => {
          const isToday = day === todayDay;
          const isWeekend = i % 7 === 0 || i % 7 === 6;
          return (
            <div
              key={i}
              className={`text-[10px] py-1 rounded-md ${
                isToday
                  ? "bg-primary text-dark-card font-bold"
                  : isWeekend
                  ? "text-neutral-600"
                  : "text-white"
              }`}
            >
              {day || ""}
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create WeeklyChart**

Pure CSS bar chart. Receives array of {day, count} and highlights current day.

```tsx
interface WeeklyChartProps {
  data: { day: string; count: number }[];
  currentDay: string;
}

export function WeeklyChart({ data, currentDay }: WeeklyChartProps) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="bg-dark-card rounded-[14px] p-4 border border-dark-border flex-1">
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs font-bold text-white">Consultas da Semana</span>
        <span className="text-[9px] text-primary bg-primary/10 px-2 py-0.5 rounded-md font-semibold">
          Esta Semana
        </span>
      </div>
      <div className="flex items-end gap-2 h-24">
        {data.map(({ day, count }) => {
          const height = (count / maxCount) * 100;
          const isCurrent = day === currentDay;
          return (
            <div key={day} className="flex-1 flex flex-col items-center gap-1">
              {isCurrent && (
                <span className="text-[9px] text-primary font-bold">{count}</span>
              )}
              <div
                className={`w-full rounded-t ${isCurrent ? "bg-primary" : "bg-primary/15"}`}
                style={{ height: `${Math.max(height, 8)}%` }}
              />
              <span className={`text-[9px] ${isCurrent ? "text-white font-semibold" : "text-neutral-500"}`}>
                {day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Commit all doctor components**

```bash
git add src/components/StatsCard.tsx src/components/DoctorSidebar.tsx src/components/ScheduleTable.tsx src/components/MiniCalendar.tsx src/components/WeeklyChart.tsx
git commit -m "feat: add doctor dashboard components (stats, table, calendar, chart, sidebar)"
```

---

## Task 18: Redesign Doctor Layout

**Files:**
- Modify: `src/app/medico/layout.tsx`

- [ ] **Step 1: Replace header with DoctorSidebar and dark theme**

Desktop: DoctorSidebar (icon sidebar) + dark content area. Mobile: compact dark header.

```tsx
import { DoctorSidebar } from "@/components/DoctorSidebar";
import doctorUser from "@/data/doctor-user.json";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-dark-bg">
      <DoctorSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="md:hidden bg-dark-bg px-4 py-3 border-b border-dark-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1A1D23" strokeWidth="2.5">
                <path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a2 2 0 002 2h1a2 2 0 002-2V5a2 2 0 00-2-2H4" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-white">Dashboard</p>
              <p className="text-[9px] text-neutral-500">{doctorUser.name}</p>
            </div>
          </div>
          <img
            src={doctorUser.photo}
            alt={doctorUser.name}
            className="w-8 h-8 rounded-full object-cover border-2 border-primary"
          />
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/medico/layout.tsx
git commit -m "feat: redesign doctor layout with dark theme and icon sidebar"
```

---

## Task 19: Redesign Doctor Dashboard Page

**Files:**
- Modify: `src/app/medico/agenda/page.tsx`

- [ ] **Step 1: Rewrite doctor dashboard with full complexity**

Read the current file first to understand existing logic (TODAY, appointment filtering by doctorId, confirm/cancel handlers). Keep all Zustand logic. Replace JSX with:

- Desktop top bar: "Dashboard" title + date, search, notifications, doctor info
- Quick Stats row (3 StatsCard components): computed from appointments
- Bottom grid: ScheduleTable (left, wider) + right column (MiniCalendar + WeeklyChart)
- Pass `patientName` to ScheduleTable: import `patient from "@/data/patient.json"` and pass `patient.name`
- Mobile: stats row, Today/Semana toggle, stacked appointment cards with action buttons

Weekly chart data: compute from appointments by day of week for the current week.

The page uses `"use client"` and Zustand. Keep `const TODAY = "2026-03-17"`.

- [ ] **Step 2: Verify full build**

Run: `npm run build`

Expected: Clean build with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/medico/agenda/page.tsx
git commit -m "feat: redesign doctor dashboard with stats, table, calendar, and chart"
```

---

## Task 20: Final Verification & Cleanup

- [ ] **Step 1: Run TypeScript check**

Run: `npx tsc --noEmit`

Fix any remaining type errors.

- [ ] **Step 2: Run production build**

Run: `npm run build`

Fix any build errors.

- [ ] **Step 3: Run ESLint**

Run: `npm run lint`

Fix any critical lint errors (ignore style warnings).

- [ ] **Step 4: Visual smoke test**

Run: `npm run dev`

Manually verify in browser:
- Landing page at `/` — navbar, hero, features, footer
- Patient dashboard at `/paciente/dashboard` — sidebar (desktop), tab bar (mobile)
- Search at `/paciente/buscar` — grid (desktop), list (mobile)
- Booking flow at `/paciente/agendar/d1` — split layout (desktop), stacked (mobile)
- History at `/paciente/historico` — table (desktop), cards (mobile)
- Doctor dashboard at `/medico/agenda` — dark theme, stats, table, calendar, chart

Resize browser to test responsive breakpoint at 768px.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "fix: address remaining type and lint issues from redesign"
```
