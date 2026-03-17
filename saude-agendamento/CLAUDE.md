# CLAUDE.md — saude-agendamento

This is a **Next.js 14 medical appointment scheduling app** built as a portfolio project. It simulates a two-role system (patient and doctor) with no backend — all state lives in a Zustand store seeded from JSON files.

---

## 1. Project Overview

**SaúdeApp** is a healthcare scheduling UI where:
- A **patient** can browse doctors, view profiles, book appointments via a week calendar, and track upcoming/past appointments.
- A **doctor** can view their daily and weekly agenda and confirm or cancel pending appointments.

There is no auth. The entry point (`/`) is a role-selection screen — clicking "Paciente" navigates to `/paciente/dashboard`, clicking "Médico" navigates to `/medico/agenda`. The logged-in identities are hardcoded in `src/data/patient.json` and `src/data/doctor-user.json`.

---

## 2. Tech Stack

| Tool | Version |
|---|---|
| Next.js (App Router) | 14.2.35 |
| React | 18 |
| TypeScript | 5 |
| Tailwind CSS | 3.4.x |
| Zustand | 5.0.12 |
| shadcn/ui (base-nova style) | 4.0.8 |
| lucide-react | 0.577.0 |
| class-variance-authority | 0.7.1 |
| clsx + tailwind-merge | 2.x / 3.x |
| @base-ui/react | 1.3.0 |

No test runner is configured. No database, API routes, or authentication library.

---

## 3. Folder Structure

```
src/
  app/
    page.tsx                        # Role-selection landing page (/)
    layout.tsx                      # Root layout — sets <html lang="pt-BR">
    globals.css                     # Tailwind directives + Inter font import

    paciente/
      layout.tsx                    # Wraps all patient pages with <Sidebar>
      dashboard/page.tsx            # Patient home: next appointment hero + upcoming list
      buscar/page.tsx               # Search doctors by name/specialty
      medico/[id]/page.tsx          # Doctor profile (static, no "use client")
      agendar/[id]/page.tsx         # Booking flow: week calendar + time slot grid
      confirmacao/page.tsx          # Post-booking success screen (reads URL params)
      historico/page.tsx            # Past appointments list

    medico/
      layout.tsx                    # Doctor header (reads doctor-user.json directly)
      agenda/page.tsx               # Doctor agenda: day/week tab view + confirm/cancel

  components/
    Sidebar.tsx                     # Patient left nav (Dashboard, Buscar, Histórico, Sair)
    AppointmentCard.tsx             # Appointment row used in dashboard + historico
    DoctorCard.tsx                  # Doctor grid card used in buscar page
    StatusBadge.tsx                 # Pill badge for confirmed / pending / cancelled
    TimeSlotGrid.tsx                # 4-column grid of time slot buttons

    ui/                             # shadcn-generated primitives (do not edit manually)
      avatar.tsx
      badge.tsx
      button.tsx
      card.tsx
      separator.tsx
      tabs.tsx

  data/                             # Static mock data (JSON — acts as the "database")
    doctors.json                    # Array of 6 Doctor objects
    appointments.json               # Array of 9 Appointment objects
    patient.json                    # Single Patient object (id: "p1")
    doctor-user.json                # Single DoctorUser object (id: "d3" — Dr. Carlos Lima)

  store/
    appointments.ts                 # Zustand store — single source of truth for appointments

  types/
    index.ts                        # All shared TypeScript interfaces and types

  lib/
    utils.ts                        # cn() helper (clsx + twMerge)
```

---

## 4. Essential Commands

```bash
npm run dev        # Start dev server at http://localhost:3000
npm run build      # Production build
npm run start      # Run production build locally
npm run lint       # ESLint via next lint
```

There is no `typecheck` script. Run TypeScript checks manually with:

```bash
npx tsc --noEmit
```

---

## 5. Architecture Decisions

### Two roles, no auth
Role selection on the root page (`src/app/page.tsx`) is purely navigational — two `<Link>` buttons. There is no session, cookie, or context. The "logged-in" patient is always `patient.json` (`id: "p1"`, Rafael Mendes) and the "logged-in" doctor is always `doctor-user.json` (`id: "d3"`, Dr. Carlos Lima).

### Route namespacing via layouts
- `/paciente/*` routes share `src/app/paciente/layout.tsx` which injects the `<Sidebar>` component.
- `/medico/*` routes share `src/app/medico/layout.tsx` which injects a top header bar. The header reads `doctorUser` directly from the JSON import — it does not use Zustand.

### Zustand store (`src/store/appointments.ts`)
The store is the only piece of runtime mutable state. It is seeded once from `appointments.json` at module load time.

```
useAppointmentsStore
  .appointments         — Appointment[]
  .addAppointment()     — push a new appointment (called during booking)
  .confirmAppointment() — set status → "confirmed" (doctor action)
  .cancelAppointment()  — set status → "cancelled" (doctor action)
```

State is in-memory only. Refreshing the page resets everything back to the JSON seed.

All pages that need live appointment data call `useAppointmentsStore` with a selector — e.g. `useAppointmentsStore((s) => s.appointments)`. Pages that only need static doctor/patient data import the JSON directly without Zustand.

### TODAY is hardcoded
`const TODAY = "2026-03-17"` appears in `dashboard/page.tsx`, `historico/page.tsx`, `agendar/[id]/page.tsx`, and `medico/agenda/page.tsx`. This is intentional — the mock data dates are relative to this value. Do not replace it with `new Date()` unless you also update all appointment dates in `appointments.json`.

### Booking flow
`/paciente/agendar/[id]` — the `id` param is a `doctorId` from `doctors.json`. On confirm, a new `Appointment` is pushed into the Zustand store with `status: "pending"` and the user is navigated to `/paciente/confirmacao?doctorId=...&date=...&time=...`. The confirmation page reads those URL params with `useSearchParams` (wrapped in `<Suspense>` to satisfy Next.js App Router requirements).

Booked slots are computed live: the store is filtered by `doctorId + date + status !== "cancelled"` to determine which time slots are disabled in `<TimeSlotGrid>`.

### Slot availability
Each doctor in `doctors.json` has a fixed `availableSlots` array (e.g. `["09:00", "10:00", "14:00"]`). These are the same slots every day of the week — there is no per-day scheduling. A slot is visually disabled only if an existing non-cancelled appointment already occupies it on the selected date.

### "use client" boundary
Pages that use Zustand hooks, `useState`, `useRouter`, `useSearchParams`, or `usePathname` must have `"use client"` at the top. Server components (no interactivity, no hooks) do not need it. Currently:
- `Sidebar.tsx` — client (uses `usePathname`)
- `dashboard/page.tsx` — client (uses Zustand)
- `buscar/page.tsx` — client (uses `useState`)
- `agendar/[id]/page.tsx` — client (uses Zustand + `useState` + `useRouter`)
- `confirmacao/page.tsx` — client (uses `useSearchParams`)
- `historico/page.tsx` — client (uses Zustand)
- `medico/agenda/page.tsx` — client (uses Zustand + `useState`)
- `medico/[id]/page.tsx` — server component (pure display)

---

## 6. Code Conventions

### Naming
- Pages: `page.tsx` (Next.js App Router convention, default export).
- Layouts: `layout.tsx` (default export).
- Shared components: `PascalCase.tsx` in `src/components/` (named exports, not default).
- shadcn UI primitives: live in `src/components/ui/` — generated by the CLI, do not hand-edit.
- Store file: `src/store/appointments.ts` — export is named `useAppointmentsStore`.
- Types: all in `src/types/index.ts`, exported as named interfaces/types.

### Tailwind classes
Use the custom design tokens defined in `tailwind.config.ts`:
- `bg-primary` / `text-primary` → green `#3DAA6D`
- `bg-primary-light` → light green tint `#EBF7F0`
- `text-accent` → blue `#5B8CDB` (used for specialty labels on doctor cards)
- `text-neutral-900` / `text-neutral-500` / `bg-neutral-100` → the standard neutral scale
- `shadow-card` → `0 2px 12px rgba(0,0,0,0.06)`
- `rounded-[20px]` for large cards, `rounded-[14px]` for smaller cards and buttons — these are inline values, not a config key

Use the `cn()` utility from `@/lib/utils` when conditional class merging is needed.

### Where to place new components
- If used on 2+ pages → `src/components/PascalCase.tsx` (named export).
- If only used inside one page → define as a local function inside that `page.tsx` file (see `AppointmentRow` in `medico/agenda/page.tsx` and `ConfirmacaoContent` in `confirmacao/page.tsx`).
- shadcn primitives → add via `npx shadcn@latest add <component>`, which writes to `src/components/ui/`.

---

## 7. Mock Data

All mock data lives in `src/data/`. It is imported directly as JSON (`import doctors from "@/data/doctors.json"`). TypeScript resolves JSON imports because `resolveJsonModule: true` is set in `tsconfig.json`.

### `doctors.json`
Array of 6 `Doctor` objects. IDs: `d1`–`d6`. Each has:
- `availableSlots: string[]` — fixed time strings used by the booking UI every day of the week.
- `photo` — sourced from `https://i.pravatar.cc/150?img=<N>` (external service, requires internet).

### `appointments.json`
Array of 9 `Appointment` objects. IDs: `a1`–`a9`. All have `patientId: "p1"`. Spread across February and March 2026, with statuses: `confirmed`, `pending`, `cancelled`.

This file is the seed for the Zustand store. Changes here affect the initial state on every fresh page load.

### `patient.json`
Single object. `id: "p1"`, name "Rafael Mendes". Used by all patient pages to filter appointments by `patientId` and to display the avatar/name.

### `doctor-user.json`
Single object. `id: "d3"` (maps to Dr. Carlos Lima in `doctors.json`). Used by the doctor layout header and by `medico/agenda/page.tsx` to filter appointments by `doctorId`.

**To change which doctor is "logged in":** update the `id`, `name`, `specialty`, and `photo` in `doctor-user.json`. The `id` must match an entry in `doctors.json` for the agenda to show real appointments.

---

## 8. How to Add a New Feature

### Example: add a new patient page (e.g. "Notifications")

1. **Create the route file:** `src/app/paciente/notificacoes/page.tsx`.
2. **Add `"use client"` at the top** if the page needs hooks or interactivity.
3. **Add a nav item to the Sidebar:** open `src/components/Sidebar.tsx`, add an entry to the `navItems` array with the matching `href`, a `label`, and a `lucide-react` icon.
4. **If you need new state:** add actions and state slices to `src/store/appointments.ts` following the existing Zustand pattern (or create a new store file in `src/store/`).
5. **If you need new data shape:** add the TypeScript interface to `src/types/index.ts` and a corresponding JSON file under `src/data/` if mock data is needed.
6. **Use existing design tokens** — stick to `bg-primary`, `shadow-card`, `rounded-[20px]`/`rounded-[14px]`, `text-neutral-*` as used in the rest of the app. Do not introduce new colors or shadow values without adding them to `tailwind.config.ts`.

### Example: add a new doctor page (e.g. "Patient Detail")

1. Create `src/app/medico/<route>/page.tsx`.
2. The doctor layout (`src/app/medico/layout.tsx`) wraps it automatically — no extra work needed for the header.
3. Use `doctorUser.id` from `@/data/doctor-user.json` to scope any appointment queries.
