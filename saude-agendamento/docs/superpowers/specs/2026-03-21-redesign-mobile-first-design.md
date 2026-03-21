# SaudeApp Redesign — Mobile-First + Visual Overhaul

## Overview

Complete visual redesign of the SaudeApp medical scheduling application. The current UI is desktop-only with no responsive support, generic styling, and a broken mobile experience. The redesign transforms it into a portfolio-worthy app with dual themes, mobile-first responsive design, and a modern aesthetic inspired by the Janjiyuk booking platform (Dribbble reference).

**Reference:** https://dribbble.com/shots/26933420-Janjiyuk-Booking-scheduling-platform

**Approach:** Progressive redesign — keep existing routes, Zustand store, JSON data, and component structure. Redesign each component in-place, refactor layouts for responsive support.

---

## Design Decisions

| Decision | Choice |
|---|---|
| Theme strategy | Dual: dark (doctor), light (patient) |
| Primary color | Lime green `#88CD0A` (replaces `#3DAA6D`) |
| Mobile navigation (patient) | Bottom tab bar + contextual header + FAB |
| Desktop sidebar (patient) | Dark sidebar with text (240px), `#1A1D23` background |
| Desktop sidebar (doctor) | Icon-only sidebar (64px), dark background |
| Doctor dashboard complexity | Full: stats cards + schedule table + calendar + weekly chart |
| Landing page | Mini landing page with navbar, hero, features strip, footer |
| Font | Inter (unchanged) |

---

## Color Palette

### Shared tokens

| Token | Value | Usage |
|---|---|---|
| `primary` | `#88CD0A` | CTA buttons, active states, accent highlights |
| `primary-light` | `rgba(136,205,10,0.12)` | Light accent backgrounds, hover states |
| `primary-dark` | `#6B9C00` | Text on light primary backgrounds |
| `status-confirmed` | `#88CD0A` | Confirmed badge (uses primary) |
| `status-pending` | `#F59E0B` | Pending badge (amber) |
| `status-cancelled` | `#EF4444` | Cancelled badge (red) |
| `neutral-900` | `#1A1D23` | Dark backgrounds, primary text (light theme) |
| `neutral-800` | `#2d3139` | Card backgrounds (dark theme), borders |
| `neutral-500` | `#6B7280` | Secondary text |
| `neutral-100` | `#F4F6F8` | Page background (light theme) |

### Patient theme (light)

- Page background: `#F4F6F8`
- Cards: `#FFFFFF` with `shadow: 0 1px 4px rgba(0,0,0,0.05)`
- Sidebar: `#1A1D23` (dark contrast)
- Text primary: `#1A1D23`
- Text secondary: `#6B7280`

### Doctor theme (dark)

- Page background: `#0f1114`
- Cards: `#1A1D23` with `border: 1px solid #2d3139`
- Sidebar: `#1A1D23` with `border-right: 1px solid #2d3139`
- Text primary: `#FFFFFF`
- Text secondary: `#6B7280`
- Accent highlights: `#88CD0A`

---

## Typography & Spacing

| Element | Size | Weight |
|---|---|---|
| Page title | 20px | 800 |
| Section heading | 16px | 700 |
| Card title | 14px | 600 |
| Body text | 13px | 400 |
| Caption/label | 11px | 500 |
| Badge text | 9-10px | 600 |
| Stats numbers | 32px (desktop), 22px (mobile) | 800 |

### Border radius

| Element | Value |
|---|---|
| Large cards / hero | `14px` |
| Small cards / inputs | `12px` |
| Buttons | `10-12px` |
| Badges / chips | `20px` |
| Avatar | `50%` (circle) |
| Sidebar logo icon | `10px` |

### Responsive padding

| Breakpoint | Main content padding |
|---|---|
| Desktop (≥768px) | `20-24px` |
| Mobile (<768px) | `12-16px` |

---

## Page Specifications

### 1. Landing Page (`/`)

**Structure:** Full dark page with sections.

**Desktop layout:**
- **Navbar:** Dark background (`#0f1114`), logo + brand left, nav links ("Funcionalidades", "Sobre") center, "Acessar" CTA button right
- **Hero section:** Gradient background (`#0f1114` → `#1A1D23`), left-aligned content with lime "AGENDAMENTO INTELIGENTE" label, headline "Sua saude merece organizacao", subtitle, two CTA buttons ("Sou Paciente" filled, "Sou Medico" outlined). Right side: mini mockup preview card showing a dashboard snippet
- **Features strip:** 4 feature cards in a row (Agendamento, Busca, Dashboard, Dois Papeis) with icon + title + description
- **Footer:** Dark with "Projeto de portfolio" text

**Mobile layout:**
- Navbar collapses to logo + hamburger (or just logo + CTA)
- Hero stacks vertically, mockup preview hidden on mobile
- Features strip becomes 2x2 grid
- CTAs stack vertically, full width

**Navigation:** "Sou Paciente" → `/paciente/dashboard`, "Sou Medico" → `/medico/agenda`

---

### 2. Patient Dashboard (`/paciente/dashboard`)

**Desktop layout:**
- Dark sidebar (240px) + light main area
- Header: greeting + name left, notification bell right
- "Proxima Consulta" hero card: dark gradient (`#1A1D23` → `#2d3139`), doctor avatar, name, specialty, date/time with large lime time display, lime "PROXIMA CONSULTA" label
- Stats row: 3 cards (Agendadas, Confirmadas, Pendentes) with large numbers
- "Consultas Agendadas" list: white cards with avatar, doctor name, specialty, date/time, status badge

**Mobile layout:**
- Contextual header with greeting + avatar
- Same hero card but compact
- Stats row (3 mini cards horizontal)
- Stacked appointment cards
- Bottom tab bar with FAB

---

### 3. Search Doctors (`/paciente/buscar`)

**Desktop layout:**
- Search bar with icon
- Filter chips row: "Todos" (filled primary), specialty chips (outlined)
- 3-column grid of doctor cards: avatar, name, specialty (lime), rating stars, CRM, "Ver perfil" button

**Mobile layout:**
- Search bar
- Horizontal scrolling filter chips
- List view (not grid): each doctor as a row card with avatar, name, specialty, rating, chevron right

---

### 4. Doctor Profile (`/paciente/medico/[id]`)

**Desktop layout:** Split view
- Left panel (200px): doctor card with avatar, name, specialty, rating, CRM, "Sobre" section
- Right panel: calendar + time slots (same as booking page)

**Mobile layout:**
- Back arrow header with "Agendar Consulta" title
- Doctor mini card (horizontal: avatar + name + specialty)
- Week calendar
- Time slot grid (2 columns instead of 4)
- "Confirmar Agendamento" button full width

**Note:** Profile and booking flow are visually merged — viewing a doctor profile shows the booking interface directly. This simplifies the flow from 2 pages to 1 combined view.

---

### 5. Booking Page (`/paciente/agendar/[id]`)

**Desktop layout (right panel of profile):**
- Week selector: arrows + "16 mar. - 20 mar. 2026" + 5 day pills (selected day in lime)
- Time slots card: "Horarios disponiveis — [day], [date]" heading, 4-column grid of time slots (selected: lime border + light lime bg, available: gray border, disabled: muted)
- "Confirmar Agendamento" button (lime, full width)

**Mobile layout:**
- Same structure, stacked vertically
- Time slots: 2-column grid (bigger touch targets)
- Button full width at bottom

---

### 6. Confirmation Page (`/paciente/confirmacao`)

Existing page with URL params. Redesign with:
- Success icon (checkmark in lime circle)
- "Consulta Agendada!" heading
- Summary card with doctor, date, time
- "Voltar ao Dashboard" button

---

### 7. History (`/paciente/historico`)

**Desktop layout:**
- Title + filter chips row (Todas, Confirmadas, Canceladas)
- Table-like list in a single white card: rows with avatar, doctor name, specialty, date/time, status badge. Rows separated by light borders

**Mobile layout:**
- Title + filter chips
- Stacked cards (not table), each with avatar row + date below
- Status badge in top right of each card

---

### 8. Doctor Dashboard (`/medico/agenda`)

**Desktop layout:** Full dark mode
- Icon sidebar (64px): logo, nav icons (Dashboard active, Calendar, Patients, Settings), avatar at bottom
- Top bar: "Dashboard" title + date, search bar, notification bell with dot, doctor name + avatar
- Quick Stats row: 3 cards with icon + label + large number + trend text
  - Consultas Hoje (white number)
  - Confirmadas (white number / total)
  - Pendentes (amber number, "Requer acao")
- Bottom grid (2 columns):
  - Left (wider): "Agenda de Hoje" table with columns: Hora, Paciente, Tipo, Status, Acao. Pending rows show confirm/cancel icon buttons
  - Right (240px): Monthly calendar (grid, today highlighted in lime) + Weekly bar chart (5 bars for Mon-Fri, current day highlighted in solid lime)

**Mobile layout:** Dark mode
- Header: logo + "Dashboard" + doctor avatar
- Stats row (3 compact cards)
- Today/Semana toggle pills
- Stacked appointment cards with time (large, lime for first), patient name, description, status badge
- Pending cards show "Confirmar" / "Cancelar" action buttons inline
- Calendar and chart hidden on mobile (too complex for small screen)

---

## Component Changes

### New components needed

| Component | Purpose |
|---|---|
| `MobileTabBar` | Bottom tab bar with Home, Buscar, FAB, Historico, Perfil |
| `MobileHeader` | Contextual header for patient mobile pages |
| `DoctorSidebar` | Icon-only sidebar for doctor desktop |
| `StatsCard` | Reusable stat card (number + label + trend) |
| `ScheduleTable` | Table component for doctor's daily schedule |
| `MiniCalendar` | Monthly calendar widget |
| `WeeklyChart` | Bar chart for weekly bookings (pure CSS/HTML, no chart library) |
| `LandingPage` | New root page component |

### Modified components

| Component | Changes |
|---|---|
| `Sidebar` | Complete redesign: dark bg, user card, lime accents, CTA button. Hidden on mobile (replaced by MobileTabBar) |
| `AppointmentCard` | Redesign with new palette, responsive layout |
| `DoctorCard` | Desktop: centered card with "Ver perfil" button. Mobile: horizontal row layout |
| `StatusBadge` | Update colors to new palette (`#88CD0A` for confirmed) |
| `TimeSlotGrid` | 4 cols desktop, 2 cols mobile. New lime selection style |

### Layout changes

| Layout | Changes |
|---|---|
| `paciente/layout.tsx` | Add responsive: sidebar on desktop (≥768px), MobileTabBar + MobileHeader on mobile (<768px) |
| `medico/layout.tsx` | Replace header with DoctorSidebar on desktop, compact dark header on mobile |
| `app/page.tsx` | Replace simple role selection with full LandingPage component |

---

## Tailwind Config Updates

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
  // status colors unchanged (pending, cancelled)
  // neutral scale unchanged
}
```

---

## Responsive Breakpoints

Using Tailwind defaults:
- `<768px` (below `md`): Mobile layout — tab bar, stacked cards, 2-col grids
- `≥768px` (`md` and up): Desktop layout — sidebar, multi-column grids, tables

Single breakpoint keeps implementation simple. The `md:` prefix handles all desktop-vs-mobile switches.

---

## Data & Store Changes

**No changes to the Zustand store or JSON data files.** The redesign is purely visual. All existing state management, appointment CRUD, and mock data remain identical.

The only data-adjacent additions are:
- New mock data for stats (computed from existing appointments, not stored)
- Weekly chart data (computed from existing appointments by day of week)

---

## Out of Scope

- Authentication / real login
- Backend / API integration
- New functional features beyond visual redesign
- Chart libraries (bar chart is pure CSS)
- Animation library changes (existing tw-animate-css stays)
- Dark mode toggle (themes are role-based, not user-selectable)
