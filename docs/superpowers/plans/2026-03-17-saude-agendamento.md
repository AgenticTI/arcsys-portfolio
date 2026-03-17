# saude-agendamento Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished Next.js 14 MVP of a medical appointment scheduling system with two user roles (patient and doctor), mock data, and Zustand-managed state — ready to record a 2-minute portfolio demo.

**Architecture:** Single Next.js 14 App Router project with all data stored as static JSON files in `src/data/`. A Zustand store hydrates from `appointments.json` on first render and handles all mutations (confirm/cancel) in memory. Navigation is client-side only; no API routes are needed. Layout components (Sidebar for patient, Header for doctor) are shared via route group layouts.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Zustand, Lucide React, Inter (Google Fonts)

---

## File Map

| File | Responsibility |
|------|---------------|
| `saude-agendamento/src/app/page.tsx` | Login screen — two role-selection buttons |
| `saude-agendamento/src/app/layout.tsx` | Root layout — Inter font, global CSS |
| `saude-agendamento/src/app/paciente/layout.tsx` | Patient layout — wraps all patient pages with Sidebar |
| `saude-agendamento/src/app/paciente/dashboard/page.tsx` | Patient dashboard — next appointment card + appointments list |
| `saude-agendamento/src/app/paciente/buscar/page.tsx` | Search doctors — search field + specialty filter + doctor cards grid |
| `saude-agendamento/src/app/paciente/medico/[id]/page.tsx` | Doctor profile — photo, bio, "Book appointment" CTA |
| `saude-agendamento/src/app/paciente/agendar/[id]/page.tsx` | Slot selection — mini week calendar + available time slots grid |
| `saude-agendamento/src/app/paciente/confirmacao/page.tsx` | Booking confirmation — summary card + "back to dashboard" |
| `saude-agendamento/src/app/paciente/historico/page.tsx` | Patient history — read-only list of past appointments |
| `saude-agendamento/src/app/medico/layout.tsx` | Doctor layout — wraps doctor pages with top header |
| `saude-agendamento/src/app/medico/agenda/page.tsx` | Doctor schedule — day list + week tab, confirm/cancel actions |
| `saude-agendamento/src/components/Sidebar.tsx` | Patient sidebar navigation |
| `saude-agendamento/src/components/StatusBadge.tsx` | Colored badge for confirmed/pending/cancelled |
| `saude-agendamento/src/components/AppointmentCard.tsx` | Card displaying one appointment with badge |
| `saude-agendamento/src/components/DoctorCard.tsx` | Card displaying one doctor with photo, rating, specialty |
| `saude-agendamento/src/components/TimeSlotGrid.tsx` | Grid of time slot buttons (available / booked) |
| `saude-agendamento/src/data/doctors.json` | Static array of 6 doctors |
| `saude-agendamento/src/data/appointments.json` | Static array of 8 appointments (initial state) |
| `saude-agendamento/src/data/patient.json` | Single logged-in patient |
| `saude-agendamento/src/data/doctor-user.json` | Single logged-in doctor |
| `saude-agendamento/src/store/appointments.ts` | Zustand store — appointments state + confirm/cancel actions |
| `saude-agendamento/src/types/index.ts` | Shared TypeScript types (Doctor, Appointment, Patient, etc.) |
| `saude-agendamento/tailwind.config.ts` | Design token colors, font family |
| `saude-agendamento/src/app/globals.css` | Tailwind base + Inter import |

---

## Task 1: Project Bootstrap

**Files:**
- Create: `saude-agendamento/` (entire Next.js project scaffold)
- Modify: `saude-agendamento/tailwind.config.ts`
- Modify: `saude-agendamento/src/app/globals.css`
- Modify: `saude-agendamento/src/app/layout.tsx`

- [ ] **Step 1: Scaffold the Next.js project**

Run from `C:\Users\leona\Documents\Backup\Portifolio ARCSYS`:
```bash
npx create-next-app@14 saude-agendamento \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-git
```
When prompted about the `src/` directory and App Router, confirm yes. Accept all defaults.

Expected: `saude-agendamento/` directory created with Next.js 14 scaffold.

- [ ] **Step 2: Install additional dependencies**

```bash
cd saude-agendamento
npm install zustand lucide-react
npx shadcn@latest init
```

During `shadcn init`, choose:
- Style: **Default**
- Base color: **Slate**
- CSS variables: **Yes**

Expected: `src/components/ui/` directory created, `components.json` present.

- [ ] **Step 3: Install shadcn components needed**

```bash
npx shadcn@latest add button badge card separator tabs avatar
```

Expected: Components appear in `src/components/ui/`.

- [ ] **Step 4: Configure Tailwind with design tokens**

Replace the content of `saude-agendamento/tailwind.config.ts` with:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3DAA6D",
          light: "#EBF7F0",
        },
        accent: "#5B8CDB",
        neutral: {
          900: "#1A1D23",
          500: "#6B7280",
          100: "#F4F6F8",
        },
        status: {
          confirmed: "#3DAA6D",
          pending: "#F59E0B",
          cancelled: "#EF4444",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        card: "14px",
      },
      boxShadow: {
        card: "0 2px 12px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 5: Configure globals.css with Inter font**

Replace the content of `saude-agendamento/src/app/globals.css` with:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-neutral-100 text-neutral-900 font-sans;
  }
}
```

- [ ] **Step 6: Update root layout with font and meta**

Replace `saude-agendamento/src/app/layout.tsx` with:

```typescript
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Saúde Agendamento",
  description: "Sistema de agendamento de consultas médicas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 7: Verify the dev server starts**

```bash
npm run dev
```

Navigate to `http://localhost:3000`. Expected: Default Next.js page renders without errors in console.

- [ ] **Step 8: Commit**

```bash
cd "C:/Users/leona/Documents/Backup/Portifolio ARCSYS/saude-agendamento"
git init
git add .
git commit -m "feat: bootstrap Next.js 14 project with Tailwind, shadcn, Zustand"
```

---

## Task 2: Types and Mock Data

**Files:**
- Create: `saude-agendamento/src/types/index.ts`
- Create: `saude-agendamento/src/data/doctors.json`
- Create: `saude-agendamento/src/data/appointments.json`
- Create: `saude-agendamento/src/data/patient.json`
- Create: `saude-agendamento/src/data/doctor-user.json`

- [ ] **Step 1: Create shared TypeScript types**

Create `saude-agendamento/src/types/index.ts`:

```typescript
export type AppointmentStatus = "confirmed" | "pending" | "cancelled";

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  photo: string;
  rating: number;
  crm: string;
  bio: string;
  availableSlots: string[]; // e.g. ["09:00", "10:00"]
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;   // "YYYY-MM-DD"
  time: string;   // "HH:MM"
  status: AppointmentStatus;
  reason: string;
}

export interface Patient {
  id: string;
  name: string;
  photo: string;
  email: string;
}

export interface DoctorUser {
  id: string;
  name: string;
  specialty: string;
  photo: string;
}
```

- [ ] **Step 2: Create doctors.json with 6 doctors**

Create `saude-agendamento/src/data/doctors.json`:

```json
[
  {
    "id": "d1",
    "name": "Dra. Ana Costa",
    "specialty": "Cardiologia",
    "photo": "https://i.pravatar.cc/150?img=47",
    "rating": 4.9,
    "crm": "CRM/SP 123456",
    "bio": "Cardiologista com 12 anos de experiência. Especialista em prevenção cardiovascular.",
    "availableSlots": ["09:00", "10:00", "14:00", "15:30"]
  },
  {
    "id": "d2",
    "name": "Dr. Bruno Neves",
    "specialty": "Dermatologia",
    "photo": "https://i.pravatar.cc/150?img=11",
    "rating": 4.7,
    "crm": "CRM/RJ 654321",
    "bio": "Dermatologista com foco em tratamentos estéticos e dermatoses inflamatórias.",
    "availableSlots": ["08:00", "09:30", "11:00", "16:00"]
  },
  {
    "id": "d3",
    "name": "Dr. Carlos Lima",
    "specialty": "Clínico Geral",
    "photo": "https://i.pravatar.cc/150?img=33",
    "rating": 4.8,
    "crm": "CRM/SP 789012",
    "bio": "Médico clínico geral com vasta experiência em atenção primária e diagnóstico.",
    "availableSlots": ["08:30", "10:00", "13:00", "14:30", "17:00"]
  },
  {
    "id": "d4",
    "name": "Dra. Fernanda Rocha",
    "specialty": "Pediatria",
    "photo": "https://i.pravatar.cc/150?img=48",
    "rating": 5.0,
    "crm": "CRM/MG 345678",
    "bio": "Pediatra dedicada ao acompanhamento do desenvolvimento infantil de 0 a 12 anos.",
    "availableSlots": ["09:00", "10:30", "14:00", "15:00"]
  },
  {
    "id": "d5",
    "name": "Dr. Gustavo Pires",
    "specialty": "Ortopedia",
    "photo": "https://i.pravatar.cc/150?img=15",
    "rating": 4.6,
    "crm": "CRM/SP 901234",
    "bio": "Ortopedista especializado em lesões esportivas e cirurgia minimamente invasiva.",
    "availableSlots": ["08:00", "11:00", "14:00", "16:30"]
  },
  {
    "id": "d6",
    "name": "Dra. Helena Martins",
    "specialty": "Neurologia",
    "photo": "https://i.pravatar.cc/150?img=49",
    "rating": 4.8,
    "crm": "CRM/RS 567890",
    "bio": "Neurologista com expertise em cefaléias, epilepsia e doenças neurodegenerativas.",
    "availableSlots": ["10:00", "11:30", "15:00", "17:00"]
  }
]
```

- [ ] **Step 3: Create appointments.json with 8 appointments**

Create `saude-agendamento/src/data/appointments.json`.

Use these dates relative to 2026-03-17 (today):
- `2026-03-17` = today (2 appointments)
- `2026-03-24` = next week (2 future appointments)
- `2026-03-10`, `2026-03-05`, `2026-03-01`, `2026-02-20` = past (4 appointments)

Status distribution: 3 confirmed, 3 pending, 2 cancelled.

```json
[
  {
    "id": "a1",
    "patientId": "p1",
    "doctorId": "d1",
    "date": "2026-03-24",
    "time": "09:00",
    "status": "confirmed",
    "reason": "Consulta de rotina cardiovascular"
  },
  {
    "id": "a2",
    "patientId": "p1",
    "doctorId": "d3",
    "date": "2026-03-27",
    "time": "10:00",
    "status": "pending",
    "reason": "Check-up geral"
  },
  {
    "id": "a3",
    "patientId": "p1",
    "doctorId": "d3",
    "date": "2026-03-17",
    "time": "08:30",
    "status": "confirmed",
    "reason": "Retorno de exames"
  },
  {
    "id": "a4",
    "patientId": "p1",
    "doctorId": "d4",
    "date": "2026-03-17",
    "time": "14:00",
    "status": "pending",
    "reason": "Consulta pediátrica para filho"
  },
  {
    "id": "a5",
    "patientId": "p1",
    "doctorId": "d2",
    "date": "2026-03-10",
    "time": "09:30",
    "status": "confirmed",
    "reason": "Avaliação dermatológica"
  },
  {
    "id": "a6",
    "patientId": "p1",
    "doctorId": "d5",
    "date": "2026-03-05",
    "time": "11:00",
    "status": "cancelled",
    "reason": "Dor no joelho"
  },
  {
    "id": "a7",
    "patientId": "p1",
    "doctorId": "d1",
    "date": "2026-03-01",
    "time": "14:00",
    "status": "cancelled",
    "reason": "Exame de rotina"
  },
  {
    "id": "a8",
    "patientId": "p1",
    "doctorId": "d6",
    "date": "2026-02-20",
    "time": "10:00",
    "status": "confirmed",
    "reason": "Episódios de enxaqueca"
  }
]
```

Wait — the doctor-user is `d3` (Dr. Carlos Lima). The appointments for the doctor's agenda view should include appointments with `doctorId: "d3"`. Appointments a2 and a3 already use `d3`. For the doctor demo flow to be compelling, ensure at least 3 appointments reference `d3` — a2, a3, and optionally a4 can stay as-is; they are sufficient for the demo since the agenda filters by `doctorId`.

- [ ] **Step 4: Create patient.json**

Create `saude-agendamento/src/data/patient.json`:

```json
{
  "id": "p1",
  "name": "Rafael Mendes",
  "photo": "https://i.pravatar.cc/150?img=12",
  "email": "rafael@email.com"
}
```

- [ ] **Step 5: Create doctor-user.json**

Create `saude-agendamento/src/data/doctor-user.json`:

```json
{
  "id": "d3",
  "name": "Dr. Carlos Lima",
  "specialty": "Clínico Geral",
  "photo": "https://i.pravatar.cc/150?img=33"
}
```

- [ ] **Step 6: Verify TypeScript types compile**

```bash
cd saude-agendamento
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 7: Commit**

```bash
git add src/types src/data
git commit -m "feat: add TypeScript types and mock data files"
```

---

## Task 3: Zustand Store

**Files:**
- Create: `saude-agendamento/src/store/appointments.ts`

- [ ] **Step 1: Create the Zustand appointments store**

Create `saude-agendamento/src/store/appointments.ts`:

```typescript
import { create } from "zustand";
import { Appointment, AppointmentStatus } from "@/types";
import initialData from "@/data/appointments.json";

interface AppointmentsState {
  appointments: Appointment[];
  confirmAppointment: (id: string) => void;
  cancelAppointment: (id: string) => void;
  addAppointment: (appointment: Appointment) => void;
}

export const useAppointmentsStore = create<AppointmentsState>((set) => ({
  appointments: initialData as Appointment[],

  confirmAppointment: (id: string) =>
    set((state) => ({
      appointments: state.appointments.map((a) =>
        a.id === id ? { ...a, status: "confirmed" as AppointmentStatus } : a
      ),
    })),

  cancelAppointment: (id: string) =>
    set((state) => ({
      appointments: state.appointments.map((a) =>
        a.id === id ? { ...a, status: "cancelled" as AppointmentStatus } : a
      ),
    })),

  addAppointment: (appointment: Appointment) =>
    set((state) => ({
      appointments: [...state.appointments, appointment],
    })),
}));
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/store
git commit -m "feat: add Zustand appointments store with confirm/cancel/add actions"
```

---

## Task 4: Shared UI Components

**Files:**
- Create: `saude-agendamento/src/components/StatusBadge.tsx`
- Create: `saude-agendamento/src/components/AppointmentCard.tsx`
- Create: `saude-agendamento/src/components/DoctorCard.tsx`
- Create: `saude-agendamento/src/components/TimeSlotGrid.tsx`
- Create: `saude-agendamento/src/components/Sidebar.tsx`

- [ ] **Step 1: Create StatusBadge component**

Create `saude-agendamento/src/components/StatusBadge.tsx`:

```typescript
import { AppointmentStatus } from "@/types";

interface StatusBadgeProps {
  status: AppointmentStatus;
}

const config: Record<AppointmentStatus, { label: string; className: string }> = {
  confirmed: {
    label: "Confirmado",
    className: "bg-primary-light text-primary border border-primary/20",
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

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, className } = config[status];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide uppercase ${className}`}
    >
      {label}
    </span>
  );
}
```

- [ ] **Step 2: Create AppointmentCard component**

Create `saude-agendamento/src/components/AppointmentCard.tsx`:

```typescript
import { Appointment, Doctor } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { Calendar, Clock } from "lucide-react";

interface AppointmentCardProps {
  appointment: Appointment;
  doctor: Doctor | undefined;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function AppointmentCard({ appointment, doctor }: AppointmentCardProps) {
  return (
    <div className="bg-white rounded-[14px] shadow-card p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {doctor?.photo && (
          <img
            src={doctor.photo}
            alt={doctor.name}
            className="w-12 h-12 rounded-full object-cover"
          />
        )}
        <div>
          <p className="font-semibold text-neutral-900 text-sm">
            {doctor?.name ?? "Médico não encontrado"}
          </p>
          <p className="text-neutral-500 text-xs">{doctor?.specialty}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="flex items-center gap-1 text-xs text-neutral-500">
              <Calendar size={12} />
              {formatDate(appointment.date)}
            </span>
            <span className="flex items-center gap-1 text-xs text-neutral-500">
              <Clock size={12} />
              {appointment.time}
            </span>
          </div>
        </div>
      </div>
      <StatusBadge status={appointment.status} />
    </div>
  );
}
```

- [ ] **Step 3: Create DoctorCard component**

Create `saude-agendamento/src/components/DoctorCard.tsx`:

```typescript
import { Doctor } from "@/types";
import { Star } from "lucide-react";
import Link from "next/link";

interface DoctorCardProps {
  doctor: Doctor;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <Link href={`/paciente/medico/${doctor.id}`}>
      <div className="bg-white rounded-[14px] shadow-card p-4 hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <img
            src={doctor.photo}
            alt={doctor.name}
            className="w-14 h-14 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-neutral-900 text-sm">{doctor.name}</p>
            <p className="text-xs text-accent font-medium">{doctor.specialty}</p>
            <p className="text-xs text-neutral-500">{doctor.crm}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={14}
              className={i < Math.floor(doctor.rating) ? "fill-amber-400 text-amber-400" : "text-neutral-200"}
            />
          ))}
          <span className="text-xs text-neutral-500 ml-1">{doctor.rating.toFixed(1)}</span>
        </div>
        <p className="text-xs text-neutral-500 line-clamp-2">{doctor.bio}</p>
      </div>
    </Link>
  );
}
```

- [ ] **Step 4: Create TimeSlotGrid component**

Create `saude-agendamento/src/components/TimeSlotGrid.tsx`:

```typescript
interface TimeSlotGridProps {
  slots: string[];          // all possible slots for this doctor e.g. ["09:00", "10:00"]
  bookedSlots: string[];    // slots already booked on the selected date
  selectedSlot: string | null;
  onSelect: (slot: string) => void;
}

export function TimeSlotGrid({
  slots,
  bookedSlots,
  selectedSlot,
  onSelect,
}: TimeSlotGridProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {slots.map((slot) => {
        const isBooked = bookedSlots.includes(slot);
        const isSelected = selectedSlot === slot;

        return (
          <button
            key={slot}
            disabled={isBooked}
            onClick={() => onSelect(slot)}
            className={`
              py-2 px-3 rounded-xl text-sm font-medium border transition-all
              ${
                isBooked
                  ? "bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed"
                  : isSelected
                  ? "bg-primary text-white border-primary"
                  : "bg-primary-light text-primary border-primary/30 hover:border-primary"
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

- [ ] **Step 5: Create Sidebar component**

Create `saude-agendamento/src/components/Sidebar.tsx`:

```typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Search, Clock, LogOut, Stethoscope } from "lucide-react";

const navItems = [
  { href: "/paciente/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/paciente/buscar", label: "Buscar Médico", icon: Search },
  { href: "/paciente/historico", label: "Histórico", icon: Clock },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 min-h-screen bg-white border-r border-neutral-200 flex flex-col py-6 px-4 gap-1 shrink-0">
      <div className="flex items-center gap-2 px-2 mb-6">
        <Stethoscope size={22} className="text-primary" />
        <span className="font-bold text-neutral-900 text-lg">SaúdeApp</span>
      </div>

      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              active
                ? "bg-primary-light text-primary"
                : "text-neutral-500 hover:bg-neutral-100"
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        );
      })}

      <div className="mt-auto">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-500 hover:bg-neutral-100 transition-colors"
        >
          <LogOut size={18} />
          Sair
        </Link>
      </div>
    </aside>
  );
}
```

- [ ] **Step 6: Verify compilation**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 7: Commit**

```bash
git add src/components
git commit -m "feat: add shared UI components (StatusBadge, AppointmentCard, DoctorCard, TimeSlotGrid, Sidebar)"
```

---

## Task 5: Login Screen

**Files:**
- Modify: `saude-agendamento/src/app/page.tsx`

- [ ] **Step 1: Implement the login page**

Replace `saude-agendamento/src/app/page.tsx` with:

```typescript
import Link from "next/link";
import { Stethoscope, UserRound, BriefcaseMedical } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-[20px] shadow-card p-10 w-full max-w-md flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="bg-primary-light p-4 rounded-full">
            <Stethoscope size={36} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">SaúdeApp</h1>
          <p className="text-neutral-500 text-sm text-center">
            Sistema de agendamento médico
          </p>
        </div>

        {/* Role selection */}
        <div className="flex flex-col gap-3 w-full">
          <p className="text-sm font-medium text-neutral-500 text-center uppercase tracking-wide">
            Entrar como
          </p>

          <Link href="/paciente/dashboard" className="w-full">
            <button className="w-full flex items-center justify-center gap-3 bg-primary text-white py-4 px-6 rounded-[14px] font-semibold text-base hover:bg-primary/90 transition-colors">
              <UserRound size={20} />
              Paciente
            </button>
          </Link>

          <Link href="/medico/agenda" className="w-full">
            <button className="w-full flex items-center justify-center gap-3 bg-white text-primary border-2 border-primary py-4 px-6 rounded-[14px] font-semibold text-base hover:bg-primary-light transition-colors">
              <BriefcaseMedical size={20} />
              Médico
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Manually verify login page**

Run `npm run dev` and open `http://localhost:3000`.

Expected:
- Centered card with logo, two large buttons
- "Paciente" button navigates to `/paciente/dashboard` (will 404 until Task 6)
- "Médico" button navigates to `/medico/agenda` (will 404 until Task 8)
- No console errors

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: implement login screen with role-selection buttons"
```

---

## Task 6: Patient Layout and Dashboard

**Files:**
- Create: `saude-agendamento/src/app/paciente/layout.tsx`
- Create: `saude-agendamento/src/app/paciente/dashboard/page.tsx`

- [ ] **Step 1: Create the patient route layout**

Create `saude-agendamento/src/app/paciente/layout.tsx`:

```typescript
import { Sidebar } from "@/components/Sidebar";

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-neutral-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
```

- [ ] **Step 2: Create the patient dashboard page**

Create `saude-agendamento/src/app/paciente/dashboard/page.tsx`:

```typescript
"use client";

import { useAppointmentsStore } from "@/store/appointments";
import { AppointmentCard } from "@/components/AppointmentCard";
import { StatusBadge } from "@/components/StatusBadge";
import doctors from "@/data/doctors.json";
import patient from "@/data/patient.json";
import Link from "next/link";
import { Plus, Calendar } from "lucide-react";
import { Doctor, Appointment } from "@/types";

const TODAY = "2026-03-17";

function getNextAppointment(appointments: Appointment[]): Appointment | null {
  const upcoming = appointments
    .filter((a) => a.status !== "cancelled" && a.date >= TODAY)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  return upcoming[0] ?? null;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export default function PatientDashboard() {
  const appointments = useAppointmentsStore((s) => s.appointments);
  const myAppointments = appointments.filter((a) => a.patientId === patient.id);
  const upcoming = myAppointments.filter((a) => a.date >= TODAY && a.status !== "cancelled");
  const nextAppointment = getNextAppointment(myAppointments);
  const nextDoctor = nextAppointment
    ? (doctors as Doctor[]).find((d) => d.id === nextAppointment.doctorId)
    : null;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <img
            src={patient.photo}
            alt={patient.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="text-neutral-500 text-sm">Bem-vindo de volta,</p>
            <h1 className="text-2xl font-bold text-neutral-900">{patient.name}</h1>
          </div>
        </div>
        <Link href="/paciente/buscar">
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-[14px] font-semibold text-sm hover:bg-primary/90 transition-colors">
            <Plus size={18} />
            Agendar consulta
          </button>
        </Link>
      </div>

      {/* Next appointment hero card */}
      {nextAppointment && nextDoctor ? (
        <div className="bg-primary rounded-[20px] p-6 text-white mb-6">
          <p className="text-primary-light text-xs font-medium uppercase tracking-wide mb-3">
            Próxima Consulta
          </p>
          <div className="flex items-center gap-4">
            <img
              src={nextDoctor.photo}
              alt={nextDoctor.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-white/30"
            />
            <div>
              <p className="font-bold text-lg">{nextDoctor.name}</p>
              <p className="text-primary-light text-sm">{nextDoctor.specialty}</p>
              <div className="flex items-center gap-2 mt-2">
                <Calendar size={14} className="text-primary-light" />
                <span className="text-sm">{formatDate(nextAppointment.date)}</span>
                <span className="text-primary-light">·</span>
                <span className="text-sm">{nextAppointment.time}</span>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <StatusBadge status={nextAppointment.status} />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[20px] shadow-card p-6 text-center text-neutral-500 mb-6">
          <Calendar size={32} className="mx-auto mb-2 text-neutral-300" />
          <p className="text-sm">Nenhuma consulta agendada.</p>
        </div>
      )}

      {/* Upcoming appointments list */}
      <h2 className="text-lg font-bold text-neutral-900 mb-4">Consultas Agendadas</h2>
      {upcoming.length === 0 ? (
        <p className="text-neutral-500 text-sm">Nenhuma consulta futura.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {upcoming.map((appt) => (
            <AppointmentCard
              key={appt.id}
              appointment={appt}
              doctor={(doctors as Doctor[]).find((d) => d.id === appt.doctorId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Manually verify dashboard**

Navigate to `http://localhost:3000/paciente/dashboard`.

Expected:
- Sidebar visible on left
- Patient name "Rafael Mendes" in header
- Green hero card showing next appointment (Dra. Ana Costa, 2026-03-24)
- List of upcoming appointments below
- "+ Agendar consulta" button top right

- [ ] **Step 4: Commit**

```bash
git add src/app/paciente
git commit -m "feat: add patient layout with sidebar and dashboard page"
```

---

## Task 7: Search Doctors and Doctor Profile

**Files:**
- Create: `saude-agendamento/src/app/paciente/buscar/page.tsx`
- Create: `saude-agendamento/src/app/paciente/medico/[id]/page.tsx`

- [ ] **Step 1: Create the search doctors page**

Create `saude-agendamento/src/app/paciente/buscar/page.tsx`:

```typescript
"use client";

import { useState } from "react";
import { DoctorCard } from "@/components/DoctorCard";
import doctors from "@/data/doctors.json";
import { Doctor } from "@/types";
import { Search } from "lucide-react";

const SPECIALTIES = ["Todos", "Clínico Geral", "Cardiologia", "Dermatologia", "Ortopedia", "Pediatria", "Neurologia"];

export default function BuscarMedico() {
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("Todos");

  const filtered = (doctors as Doctor[]).filter((d) => {
    const matchesQuery = d.name.toLowerCase().includes(query.toLowerCase());
    const matchesSpecialty = specialty === "Todos" || d.specialty === specialty;
    return matchesQuery && matchesSpecialty;
  });

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Buscar Médico</h1>

      {/* Search input */}
      <div className="relative mb-4">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-200 rounded-[14px] text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
      </div>

      {/* Specialty filter tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {SPECIALTIES.map((s) => (
          <button
            key={s}
            onClick={() => setSpecialty(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              specialty === s
                ? "bg-primary text-white border-primary"
                : "bg-white text-neutral-500 border-neutral-200 hover:border-primary hover:text-primary"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Results grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-neutral-400">
          <Search size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Nenhum médico encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create the doctor profile page**

Create `saude-agendamento/src/app/paciente/medico/[id]/page.tsx`:

```typescript
import doctors from "@/data/doctors.json";
import { Doctor } from "@/types";
import { Star, MapPin } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string };
}

export default function DoctorProfile({ params }: Props) {
  const doctor = (doctors as Doctor[]).find((d) => d.id === params.id);

  if (!doctor) return notFound();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-[20px] shadow-card overflow-hidden">
        {/* Hero */}
        <div className="bg-primary-light p-8 flex flex-col items-center text-center gap-3">
          <img
            src={doctor.photo}
            alt={doctor.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-card"
          />
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">{doctor.name}</h1>
            <p className="text-accent font-medium text-sm mt-1">{doctor.specialty}</p>
            <div className="flex items-center justify-center gap-1 mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < Math.floor(doctor.rating) ? "fill-amber-400 text-amber-400" : "text-neutral-200"}
                />
              ))}
              <span className="text-sm text-neutral-500 ml-1">{doctor.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-neutral-500 text-sm">
            <MapPin size={16} className="text-primary" />
            <span>{doctor.crm}</span>
          </div>

          <div>
            <h2 className="font-semibold text-neutral-900 mb-1">Sobre</h2>
            <p className="text-neutral-500 text-sm leading-relaxed">{doctor.bio}</p>
          </div>

          <div>
            <h2 className="font-semibold text-neutral-900 mb-2">Horários Disponíveis</h2>
            <div className="flex gap-2 flex-wrap">
              {doctor.availableSlots.map((slot) => (
                <span
                  key={slot}
                  className="bg-primary-light text-primary text-xs font-medium px-3 py-1 rounded-full border border-primary/20"
                >
                  {slot}
                </span>
              ))}
            </div>
          </div>

          <Link href={`/paciente/agendar/${doctor.id}`} className="mt-2">
            <button className="w-full bg-primary text-white py-3.5 rounded-[14px] font-semibold text-base hover:bg-primary/90 transition-colors">
              Agendar Consulta
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Manually verify search and profile**

Navigate to `/paciente/buscar`:
- All 6 doctors appear in a grid
- Typing a name filters the cards
- Clicking a specialty tab filters correctly
- Clicking a doctor card navigates to `/paciente/medico/[id]`

On the profile page:
- Photo, name, specialty, rating, CRM, bio shown
- Available time slots shown as green pills
- "Agendar Consulta" button visible

- [ ] **Step 4: Commit**

```bash
git add src/app/paciente/buscar src/app/paciente/medico
git commit -m "feat: add search doctors page and doctor profile page"
```

---

## Task 8: Appointment Booking Flow (Slot Selection + Confirmation)

**Files:**
- Create: `saude-agendamento/src/app/paciente/agendar/[id]/page.tsx`
- Create: `saude-agendamento/src/app/paciente/confirmacao/page.tsx`

- [ ] **Step 1: Create the slot selection page**

Create `saude-agendamento/src/app/paciente/agendar/[id]/page.tsx`:

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import doctors from "@/data/doctors.json";
import patient from "@/data/patient.json";
import { Doctor } from "@/types";
import { TimeSlotGrid } from "@/components/TimeSlotGrid";
import { useAppointmentsStore } from "@/store/appointments";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  params: { id: string };
}

function getWeekDays(baseDate: Date): Date[] {
  const days: Date[] = [];
  // Start from Monday of the week containing baseDate
  const day = baseDate.getDay(); // 0=Sun
  const monday = new Date(baseDate);
  monday.setDate(baseDate.getDate() - ((day === 0 ? 7 : day) - 1));
  for (let i = 0; i < 5; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d);
  }
  return days;
}

function toDateStr(date: Date): string {
  return date.toISOString().split("T")[0];
}

const WEEKDAY_LABELS = ["Seg", "Ter", "Qua", "Qui", "Sex"];

export default function AgendarConsulta({ params }: Props) {
  const doctor = (doctors as Doctor[]).find((d) => d.id === params.id);
  if (!doctor) return notFound();

  const router = useRouter();
  const appointments = useAppointmentsStore((s) => s.appointments);
  const addAppointment = useAppointmentsStore((s) => s.addAppointment);

  const today = new Date("2026-03-17");
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const baseDate = new Date(today);
  baseDate.setDate(today.getDate() + weekOffset * 7);
  const weekDays = getWeekDays(baseDate);

  const selectedDateStr = toDateStr(selectedDate);
  const bookedSlots = appointments
    .filter((a) => a.doctorId === doctor.id && a.date === selectedDateStr && a.status !== "cancelled")
    .map((a) => a.time);

  function handleConfirm() {
    if (!selectedSlot) return;
    const newId = `a${Date.now()}`;
    addAppointment({
      id: newId,
      patientId: patient.id,
      doctorId: doctor!.id,
      date: selectedDateStr,
      time: selectedSlot,
      status: "pending",
      reason: "Consulta agendada pelo paciente",
    });
    router.push(
      `/paciente/confirmacao?doctorId=${doctor!.id}&date=${selectedDateStr}&time=${selectedSlot}`
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-neutral-900 mb-2">Agendar Consulta</h1>
      <p className="text-neutral-500 text-sm mb-6">
        {doctor.name} · {doctor.specialty}
      </p>

      {/* Mini week calendar */}
      <div className="bg-white rounded-[20px] shadow-card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setWeekOffset((w) => w - 1)}
            disabled={weekOffset <= 0}
            className="p-1.5 rounded-lg hover:bg-neutral-100 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft size={20} className="text-neutral-500" />
          </button>
          <span className="text-sm font-medium text-neutral-700">
            {weekDays[0].toLocaleDateString("pt-BR", { day: "numeric", month: "short" })} –{" "}
            {weekDays[4].toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" })}
          </span>
          <button
            onClick={() => setWeekOffset((w) => w + 1)}
            className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <ChevronRight size={20} className="text-neutral-500" />
          </button>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {weekDays.map((day, i) => {
            const dateStr = toDateStr(day);
            const isSelected = dateStr === selectedDateStr;
            const isToday = dateStr === toDateStr(today);
            return (
              <button
                key={dateStr}
                onClick={() => { setSelectedDate(day); setSelectedSlot(null); }}
                className={`flex flex-col items-center py-2.5 px-1 rounded-xl text-sm transition-colors ${
                  isSelected
                    ? "bg-primary text-white"
                    : "hover:bg-neutral-100 text-neutral-600"
                }`}
              >
                <span className="text-xs font-medium mb-1">{WEEKDAY_LABELS[i]}</span>
                <span className={`font-bold ${isToday && !isSelected ? "text-primary" : ""}`}>
                  {day.getDate()}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time slots */}
      <div className="bg-white rounded-[20px] shadow-card p-6 mb-6">
        <h2 className="font-semibold text-neutral-900 mb-4">
          Horários disponíveis —{" "}
          {selectedDate.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
        </h2>
        {doctor.availableSlots.length === 0 ? (
          <p className="text-neutral-400 text-sm">Nenhum horário disponível.</p>
        ) : (
          <TimeSlotGrid
            slots={doctor.availableSlots}
            bookedSlots={bookedSlots}
            selectedSlot={selectedSlot}
            onSelect={setSelectedSlot}
          />
        )}
      </div>

      <button
        onClick={handleConfirm}
        disabled={!selectedSlot}
        className="w-full bg-primary text-white py-3.5 rounded-[14px] font-semibold text-base hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Confirmar Agendamento
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Create the confirmation page**

Create `saude-agendamento/src/app/paciente/confirmacao/page.tsx`:

```typescript
"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import doctors from "@/data/doctors.json";
import { Doctor } from "@/types";
import { CheckCircle2, Calendar, Clock } from "lucide-react";
import Link from "next/link";

function ConfirmacaoContent() {
  const params = useSearchParams();
  const doctorId = params.get("doctorId");
  const date = params.get("date");
  const time = params.get("time");

  const doctor = (doctors as Doctor[]).find((d) => d.id === doctorId);

  function formatDate(dateStr: string): string {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <div className="max-w-md mx-auto text-center">
      <div className="bg-white rounded-[20px] shadow-card p-8 flex flex-col items-center gap-6">
        {/* Success icon */}
        <div className="bg-primary-light p-5 rounded-full">
          <CheckCircle2 size={48} className="text-primary" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Consulta Solicitada!</h1>
          <p className="text-neutral-500 text-sm mt-1">
            Aguardando confirmação do médico.
          </p>
        </div>

        {/* Summary */}
        <div className="bg-neutral-100 rounded-[14px] p-4 w-full text-left flex flex-col gap-3">
          {doctor && (
            <div className="flex items-center gap-3">
              <img
                src={doctor.photo}
                alt={doctor.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-neutral-900 text-sm">{doctor.name}</p>
                <p className="text-xs text-neutral-500">{doctor.specialty}</p>
              </div>
            </div>
          )}
          {date && (
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <Calendar size={16} className="text-primary" />
              {formatDate(date)}
            </div>
          )}
          {time && (
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <Clock size={16} className="text-primary" />
              {time}
            </div>
          )}
        </div>

        {/* Status notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-[12px] px-4 py-3 w-full">
          <p className="text-amber-700 text-xs font-medium text-center">
            Status: Pendente de confirmação pelo médico
          </p>
        </div>

        <Link href="/paciente/dashboard" className="w-full">
          <button className="w-full bg-primary text-white py-3 rounded-[14px] font-semibold text-sm hover:bg-primary/90 transition-colors">
            Voltar ao Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function ConfirmacaoPage() {
  return (
    <Suspense>
      <ConfirmacaoContent />
    </Suspense>
  );
}
```

- [ ] **Step 3: Manually verify booking flow**

Navigate: `/paciente/buscar` → click any doctor → "Agendar Consulta" → select date + slot → "Confirmar Agendamento".

Expected:
- Week calendar displays Mon–Fri
- Available slots shown as green buttons; booked slots greyed out
- Selecting a slot highlights it in green
- "Confirmar Agendamento" disabled until a slot is selected
- After confirming, redirected to `/paciente/confirmacao` with correct doctor info, date, and time shown
- Status notice says "Pendente de confirmação pelo médico"
- "Voltar ao Dashboard" returns to dashboard

- [ ] **Step 4: Commit**

```bash
git add src/app/paciente/agendar src/app/paciente/confirmacao
git commit -m "feat: implement booking flow — slot selection and confirmation pages"
```

---

## Task 9: Patient History Page

**Files:**
- Create: `saude-agendamento/src/app/paciente/historico/page.tsx`

- [ ] **Step 1: Create the patient history page**

Create `saude-agendamento/src/app/paciente/historico/page.tsx`:

```typescript
"use client";

import { useAppointmentsStore } from "@/store/appointments";
import { AppointmentCard } from "@/components/AppointmentCard";
import doctors from "@/data/doctors.json";
import patient from "@/data/patient.json";
import { Doctor } from "@/types";
import { History } from "lucide-react";

const TODAY = "2026-03-17";

export default function HistoricoPage() {
  const appointments = useAppointmentsStore((s) => s.appointments);

  const past = appointments
    .filter((a) => a.patientId === patient.id && a.date < TODAY)
    .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Histórico de Consultas</h1>

      {past.length === 0 ? (
        <div className="text-center py-16 text-neutral-400">
          <History size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Nenhuma consulta passada encontrada.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {past.map((appt) => (
            <AppointmentCard
              key={appt.id}
              appointment={appt}
              doctor={(doctors as Doctor[]).find((d) => d.id === appt.doctorId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Manually verify**

Navigate to `/paciente/historico`.

Expected:
- 4 past appointments listed (dates before 2026-03-17), newest first
- Each card shows doctor photo, name, specialty, date, time, and status badge
- No action buttons (read-only)

- [ ] **Step 3: Commit**

```bash
git add src/app/paciente/historico
git commit -m "feat: add patient consultation history page"
```

---

## Task 10: Doctor Schedule (Agenda do Médico)

**Files:**
- Create: `saude-agendamento/src/app/medico/layout.tsx`
- Create: `saude-agendamento/src/app/medico/agenda/page.tsx`

- [ ] **Step 1: Create the doctor route layout**

Create `saude-agendamento/src/app/medico/layout.tsx`:

```typescript
import doctorUser from "@/data/doctor-user.json";
import { Stethoscope } from "lucide-react";
import Link from "next/link";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Top header */}
      <header className="bg-white border-b border-neutral-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Stethoscope size={22} className="text-primary" />
          <span className="font-bold text-neutral-900 text-lg">SaúdeApp</span>
          <span className="text-neutral-300 mx-2">|</span>
          <span className="text-sm text-neutral-500">Painel do Médico</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-semibold text-neutral-900 text-sm">{doctorUser.name}</p>
            <p className="text-xs text-neutral-500">{doctorUser.specialty}</p>
          </div>
          <img
            src={doctorUser.photo}
            alt={doctorUser.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <Link href="/" className="text-xs text-neutral-400 hover:text-neutral-600 ml-2">
            Sair
          </Link>
        </div>
      </header>
      <main className="p-8">{children}</main>
    </div>
  );
}
```

- [ ] **Step 2: Create the doctor agenda page**

Create `saude-agendamento/src/app/medico/agenda/page.tsx`:

```typescript
"use client";

import { useState } from "react";
import { useAppointmentsStore } from "@/store/appointments";
import { StatusBadge } from "@/components/StatusBadge";
import doctorUser from "@/data/doctor-user.json";
import patient from "@/data/patient.json";
import { Check, X, Calendar } from "lucide-react";
import { Appointment } from "@/types";

const TODAY = "2026-03-17";

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getWeekDates(startStr: string): string[] {
  const dates: string[] = [];
  const start = new Date(startStr + "T00:00:00");
  for (let i = 0; i < 5; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
}

export default function AgendaMedico() {
  const appointments = useAppointmentsStore((s) => s.appointments);
  const confirmAppointment = useAppointmentsStore((s) => s.confirmAppointment);
  const cancelAppointment = useAppointmentsStore((s) => s.cancelAppointment);

  const [tab, setTab] = useState<"day" | "week">("day");

  const myAppointments = appointments.filter((a) => a.doctorId === doctorUser.id);
  const todayAppts = myAppointments
    .filter((a) => a.date === TODAY)
    .sort((a, b) => a.time.localeCompare(b.time));

  const weekDates = getWeekDates(TODAY);
  const weekAppts = myAppointments.filter((a) => weekDates.includes(a.date));

  function countByDate(date: string) {
    return weekAppts.filter((a) => a.date === date).length;
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Minha Agenda</h1>
          <p className="text-neutral-500 text-sm mt-1">{formatDate(TODAY)}</p>
        </div>
        <div className="bg-primary-light rounded-[14px] px-5 py-3 text-center">
          <p className="text-2xl font-bold text-primary">{todayAppts.length}</p>
          <p className="text-xs text-primary/70 font-medium">consultas hoje</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(["day", "week"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              tab === t
                ? "bg-primary text-white"
                : "bg-white text-neutral-500 border border-neutral-200 hover:border-primary hover:text-primary"
            }`}
          >
            {t === "day" ? "Hoje" : "Semana"}
          </button>
        ))}
      </div>

      {/* Day view */}
      {tab === "day" && (
        <div className="flex flex-col gap-3">
          {todayAppts.length === 0 ? (
            <div className="text-center py-16 text-neutral-400">
              <Calendar size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Nenhuma consulta para hoje.</p>
            </div>
          ) : (
            todayAppts.map((appt) => (
              <AppointmentRow
                key={appt.id}
                appointment={appt}
                onConfirm={() => confirmAppointment(appt.id)}
                onCancel={() => cancelAppointment(appt.id)}
              />
            ))
          )}
        </div>
      )}

      {/* Week view */}
      {tab === "week" && (
        <div className="flex flex-col gap-4">
          {weekDates.map((date) => {
            const count = countByDate(date);
            const d = new Date(date + "T00:00:00");
            const label = d.toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "numeric",
              month: "short",
            });
            const isToday = date === TODAY;
            return (
              <div
                key={date}
                className={`bg-white rounded-[14px] shadow-card px-5 py-4 flex items-center justify-between ${
                  isToday ? "border-l-4 border-primary" : ""
                }`}
              >
                <span className={`text-sm font-medium capitalize ${isToday ? "text-primary" : "text-neutral-700"}`}>
                  {label}
                </span>
                <span
                  className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    count > 0
                      ? "bg-primary-light text-primary"
                      : "bg-neutral-100 text-neutral-400"
                  }`}
                >
                  {count} {count === 1 ? "consulta" : "consultas"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Local sub-component for appointment row
function AppointmentRow({
  appointment,
  onConfirm,
  onCancel,
}: {
  appointment: Appointment;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="bg-white rounded-[14px] shadow-card p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="text-center min-w-[48px]">
          <p className="text-lg font-bold text-neutral-900">{appointment.time}</p>
        </div>
        <div>
          {/* Patient name is always p1 = Rafael in mock data */}
          <p className="font-semibold text-neutral-900 text-sm">Rafael Mendes</p>
          <p className="text-xs text-neutral-500">{appointment.reason}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <StatusBadge status={appointment.status} />
        {appointment.status === "pending" && (
          <>
            <button
              onClick={onConfirm}
              title="Confirmar"
              className="p-2 bg-primary-light text-primary rounded-xl hover:bg-primary hover:text-white transition-colors"
            >
              <Check size={16} />
            </button>
            <button
              onClick={onCancel}
              title="Cancelar"
              className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Manually verify the doctor agenda**

Navigate to `http://localhost:3000/medico/agenda`.

Expected:
- Doctor header with name "Dr. Carlos Lima" and photo
- "Hoje" tab shows 2 appointments (a3 at 08:30 and — note: a3 and a4 are today but a4 is doctorId d4, not d3; so only a3 is visible for d3)
  - Verify: a3 has `doctorId: "d3"` — should appear
  - a2 has `doctorId: "d3"` but date is 2026-03-27 — appears in week view only
- Pending appointments show green "Confirm" and red "Cancel" icon buttons
- Clicking "Confirmar" changes badge to green instantly (Zustand)
- Clicking "Cancelar" changes badge to red instantly (Zustand)
- "Semana" tab shows 5 days (Mon–Fri of current week) with appointment counts

Note: If today's view shows 0 pending appointments for `d3`, that's fine — the demo can navigate to the week tab to show the upcoming appointment with pending status for `d3` (a2 on 2026-03-27). Consider adding a second appointment for `d3` on today's date in `appointments.json` if the demo looks too sparse.

- [ ] **Step 4: Fix sparse doctor demo (if needed)**

If the doctor's "Hoje" tab has fewer than 2 pending appointments visible, update `appointments.json` to add one more appointment with `doctorId: "d3"`, `date: "2026-03-17"`, `status: "pending"`. Then re-run `npm run dev` to verify.

A suitable addition to `appointments.json` (make the array have 9 items total if needed):
```json
{
  "id": "a9",
  "patientId": "p1",
  "doctorId": "d3",
  "date": "2026-03-17",
  "time": "13:00",
  "status": "pending",
  "reason": "Avaliação de pressão arterial"
}
```

- [ ] **Step 5: Commit**

```bash
git add src/app/medico
git commit -m "feat: add doctor agenda page with day/week views and confirm/cancel actions"
```

---

## Task 11: Final Polish and Demo Readiness

**Files:**
- Modify: various pages (minor visual fixes only if needed)

- [ ] **Step 1: Run a full visual walkthrough at 1280px**

Open `http://localhost:3000` in a browser window set to 1280px width. Walk through every screen in order:

1. `/` — Login screen
2. Click "Paciente" → `/paciente/dashboard`
3. Click "Buscar Médico" in sidebar → `/paciente/buscar`
4. Click any doctor card → `/paciente/medico/[id]`
5. Click "Agendar Consulta" → `/paciente/agendar/[id]`
6. Select a day + slot → click "Confirmar Agendamento" → `/paciente/confirmacao`
7. Click "Voltar ao Dashboard" → `/paciente/dashboard`
8. Click "Histórico" in sidebar → `/paciente/historico`
9. Navigate back to `/` → click "Médico" → `/medico/agenda`
10. Click "Confirmar" on a pending appointment → badge turns green
11. Click "Cancelar" on a pending appointment → badge turns red
12. Switch to "Semana" tab → 5 days shown with counts

- [ ] **Step 2: Check for layout breaks**

Verify the following checklist visually:

- [ ] All 8 screens render without overflow or broken layout at 1280px
- [ ] Status badges use correct colors: green (confirmed), amber (pending), red (cancelled)
- [ ] Cards have consistent border-radius (~14px) and shadow
- [ ] Inter font is loading (check Network tab — Google Fonts request)
- [ ] Sidebar patient links are active/highlighted on current page
- [ ] Available slots are green; booked slots are grey and unclickable

- [ ] **Step 3: Fix any console errors**

Run `npm run build` to check for TypeScript or lint errors:

```bash
npm run build
```

Expected: Build completes successfully. Fix any errors before proceeding.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: saude-agendamento MVP — all 8 screens complete and demo-ready"
```

---

## Demo Script (for reference)

**Duration:** ~2 minutes

**Segment 1 — Patient flow (60s):**
1. Open `/` — show login screen (5s)
2. Click "Entrar como Paciente" — dashboard with upcoming consultation card (10s)
3. Click "Buscar Médico" — search grid, type a name to filter, click specialty tab (10s)
4. Click a doctor card — profile page, show bio and slots (5s)
5. Click "Agendar Consulta" — select a day, click an available slot (10s)
6. Click "Confirmar Agendamento" — confirmation page, status "Pendente" (10s)
7. Click "Voltar ao Dashboard" — show updated list (5s)
8. Click "Histórico" — past consultations (5s)

**Segment 2 — Doctor flow (60s):**
1. Navigate to `/` → click "Entrar como Médico" (5s)
2. Doctor agenda — today's appointments, badges (10s)
3. Click "Confirmar" on a pending appointment — watch badge turn green (10s)
4. Click "Cancelar" on another — badge turns red (10s)
5. Switch to "Semana" tab — week overview with counts (10s)
6. Return to header — show doctor name and specialty (5s)

---

## Parallel Execution Guide (for subagent-driven-development)

The following tasks can be executed in parallel after their prerequisites are met:

**Wave 1 — Sequential (dependencies):**
- Task 1: Project Bootstrap (must be first)
- Task 2: Types and Mock Data (must follow Task 1)
- Task 3: Zustand Store (must follow Task 2)
- Task 4: Shared UI Components (must follow Task 3)

**Wave 2 — Parallel (all depend on Wave 1 completing):**
- Task 5: Login Screen
- Task 6: Patient Layout and Dashboard
- Task 7: Search Doctors and Doctor Profile
- Task 8: Appointment Booking Flow
- Task 9: Patient History Page
- Task 10: Doctor Schedule

**Wave 3 — Sequential (after Wave 2):**
- Task 11: Final Polish and Demo Readiness
