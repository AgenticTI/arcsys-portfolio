# CLAUDE.md — fitness-treinos

This is a **mobile-first fitness tracker** built as a portfolio piece. It simulates a native gym-training app running in the browser — users browse workout plans, execute them set-by-set with a live timer, and review their history with a contribution heatmap. There is no backend; all state lives in Zustand (in-memory, resets on reload).

---

## Tech Stack

| Layer | Library | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.1.7 |
| Language | TypeScript | ^5 |
| UI | React | 19.2.3 |
| Styling | Tailwind CSS v4 | ^4 |
| State | Zustand | ^5.0.12 |
| Icons | lucide-react | ^0.577.0 |
| Compiler | React Compiler (babel-plugin-react-compiler) | 1.0.0 |
| Font | Inter (next/font/google) | — |

`reactCompiler: true` is set in `next.config.ts`. This enables the React Compiler — do not manually add `useMemo`/`useCallback`; the compiler handles memoisation automatically.

---

## Folder Structure

```
src/
  app/                         # Next.js App Router pages
    layout.tsx                 # Root layout: max-w-md centering + BottomTabBar
    page.tsx                   # / — Dashboard
    globals.css                # Tailwind v4 @theme tokens (design system)
    history/
      page.tsx                 # /history — Session list + 90-day heatmap
    workouts/
      page.tsx                 # /workouts — Workout card list
      new/
        page.tsx               # /workouts/new — Create workout form
      [id]/active/
        page.tsx               # /workouts/[id]/active — Active workout execution

  components/
    layout/
      BottomTabBar.tsx         # Fixed bottom nav (Dashboard / Treinos / Histórico)
    dashboard/
      StreakCard.tsx           # Current training streak display
      WeekSummary.tsx          # Weekly volume, sessions count, top muscle group
      NextWorkoutCard.tsx      # Suggests the least-recently-done workout
      Heatmap.tsx              # 30-day grid heatmap (generic, grid-based)
    history/
      ContributionHeatmap.tsx  # 91-day GitHub-style heatmap (column-per-week layout)
      SessionItem.tsx          # Single session row in history list
    workouts/
      WorkoutCard.tsx          # Tappable card — navigates to /workouts/[id]/active
      MuscleChip.tsx           # Colored badge for a MuscleGroup
    active/
      ActiveExercise.tsx       # Current exercise card with weight/reps inputs
      ExerciseProgress.tsx     # Progress list showing all exercises in the workout
      WorkoutTimer.tsx         # Live elapsed timer using setInterval
    create/
      ExerciseForm.tsx         # Inline form to add an exercise to a new workout
      ExerciseListItem.tsx     # Row showing an added exercise with remove button

  data/
    mock.ts                    # MOCK_WORKOUTS + MOCK_SESSIONS (see section below)

  lib/
    types.ts                   # All shared TypeScript types and the MuscleGroup union
    utils.ts                   # Pure helper functions (calcStreak, heatmap, formatters)

  store/
    fitness.ts                 # Single Zustand store: useFitnessStore
```

---

## Essential Commands

```bash
npm run dev        # Start dev server at http://localhost:3000
npm run build      # Production build
npm run start      # Serve production build
npm run lint       # ESLint (eslint-config-next)
```

There is no `typecheck` script. Run type-checking manually with:

```bash
npx tsc --noEmit
```

---

## Architecture Decisions

### Bottom Tab Bar

`src/components/layout/BottomTabBar.tsx` is rendered once in `src/app/layout.tsx`, outside `<main>`. It is `position: fixed` at the bottom. The `<main>` element has `pb-20` to prevent content from being hidden behind it. The bar is constrained to `max-w-md mx-auto` — matching the app's mobile layout width.

Active tab detection: exact match (`pathname === '/'`) for the root, `pathname.startsWith(href)` for all other tabs. This correctly highlights "Treinos" for both `/workouts` and `/workouts/new` and `/workouts/[id]/active`.

The tabs array is a static constant inside the component — add new tabs there if needed.

### Zustand Store (`src/store/fitness.ts`)

Single store `useFitnessStore` with three data slices:

- `workouts: Workout[]` — the user's saved workout plans
- `sessions: Session[]` — completed workout sessions (newest first after `finishWorkout`)
- `activeWorkout: ActiveWorkoutState | null` — the in-progress workout state

Active workout lifecycle:
1. `startWorkout(workoutId)` — sets `activeWorkout` with `startedAt: Date.now()`, indexes at `[0,0]`
2. `completeSet(set)` — appends to `completedSets`, auto-advances `currentSetIndex`; when a set exceeds `exercise.sets`, it increments `currentExerciseIndex` and resets `currentSetIndex` to 0
3. `finishWorkout(durationSeconds)` — builds a `Session` object (calculates `totalVolumeKg = sum(weightKg * reps)`), prepends to `sessions`, updates `lastDone` on the workout, clears `activeWorkout`
4. `cancelWorkout()` — sets `activeWorkout` to null without saving

There is no persistence (no `persist` middleware). All state is lost on page reload.

### Active Workout Page (`/workouts/[id]/active`)

The page derives `currentExercise` and `allDone` from the store on every render. It does not duplicate store state locally. The timer elapsed time is tracked via a `useRef<number>` (`elapsedRef`) that is updated on each `WorkoutTimer` tick via `onTick` callback — this avoids re-renders from elapsed time and passes the final value to `finishWorkout` when the user taps "Finalizar".

### WorkoutTimer

`src/components/active/WorkoutTimer.tsx` runs a `setInterval` of 1 second, computes `Math.floor((Date.now() - startedAt) / 1000)`, and renders the result through `formatDuration` from utils. It exposes an `onTick?: (seconds: number) => void` callback so the parent can track elapsed time without subscribing to the timer's re-renders.

### Heatmap System

Two separate heatmap components exist for different contexts:

- **`Heatmap`** (`src/components/dashboard/Heatmap.tsx`): Generic, takes a pre-computed `data: {date, count}[]` array and a `columns` prop. Renders a CSS Grid. Intensity classes: `bg-surface-elevated` (0), `bg-accent-muted` (1), `bg-accent` (2+). Used on the Dashboard for 30 days with `columns={6}`.

- **`ContributionHeatmap`** (`src/components/history/ContributionHeatmap.tsx`): GitHub-style, always 91 days. Calls `calcHeatmapData` internally, groups data into 7-day weeks, and renders columns of 7 squares. Uses inline `style` for colours (hex literals) rather than Tailwind classes. Used on the History page.

Both consume `calcHeatmapData(sessions, days)` from `src/lib/utils.ts`, which builds a contiguous day array filled with session counts.

---

## Design System (Tailwind v4 Tokens)

All tokens are declared in `src/app/globals.css` under `@theme`:

| Token | Value | Usage |
|---|---|---|
| `background` | `#0A0A0A` | Page background |
| `surface` | `#141414` | Cards, input backgrounds |
| `surface-elevated` | `#1C1C1C` | Input fields inside cards, heatmap empty cells |
| `accent` | `#FF6B00` | Primary CTA, active state, active tab icon |
| `accent-muted` | `#FF6B0026` | Heatmap low-intensity fill |
| `text-primary` | `#F5F5F5` | Main text |
| `text-secondary` | `#6B6B6B` | Labels, captions, inactive tab icons |
| `destructive` | `#FF3B30` | Cancel/delete states |

Use these as Tailwind utility classes: `bg-surface`, `text-accent`, `border-surface-elevated`, etc.

---

## Code Conventions

### Naming
- **Pages**: `default export` function named `<Screen>Page` (e.g. `DashboardPage`, `ActiveWorkoutPage`)
- **Components**: Named exports, PascalCase filename matching the export (e.g. `WorkoutCard.tsx` exports `WorkoutCard`)
- **Hooks/store**: camelCase, prefixed with `use` (e.g. `useFitnessStore`)
- **Utilities**: camelCase verb phrases (e.g. `calcStreak`, `formatDate`)
- **Types**: PascalCase in `src/lib/types.ts`

### "use client" directive
All pages and components that use hooks, router, or event handlers must have `'use client'` at the top. Pure presentational components that only receive props and render JSX may omit it (e.g. `Heatmap`, `MuscleChip`, `SessionItem`).

### Where to place new files
- New page → `src/app/<route>/page.tsx`
- New reusable component → `src/components/<feature-group>/ComponentName.tsx`
- New utility function → append to `src/lib/utils.ts`
- New type → append to `src/lib/types.ts`
- No component should import from `src/store` except pages and feature-specific components that need to read/write global state

### Styling
Always use Tailwind utility classes. Never write inline `style` except when a value must be dynamic (e.g. heatmap cell colour based on a count). Do not create new CSS files.

---

## Mock Data (`src/data/mock.ts`)

`MOCK_WORKOUTS` — 4 static workout plans (Push, Pull, Legs, Full Body) with real Portuguese exercise names. Each workout's `lastDone` is generated relative to `Date.now()` using the local `daysAgo(n)` helper, so it always looks recent.

`MOCK_SESSIONS` — generated by `generateSessions()` at module load time. Produces 30 sessions spread over the last 45 days following a rotation of the 4 workouts. Training days are hard-coded as offsets (e.g. `[0, 1, 3, 4, 6, ...]`) to create a realistic-looking but deterministic pattern. Volume per session has a `±400 kg` random jitter.

Both are imported directly into the Zustand store as the initial state:
```ts
workouts: MOCK_WORKOUTS,
sessions: MOCK_SESSIONS,
```

To swap in real data later, replace these two initial values in `src/store/fitness.ts` and add a persistence middleware (e.g. `zustand/middleware` `persist` with `localStorage`).

---

## How to Add a New Feature

**Example: add a "Personal Records" page at `/records`**

1. **Create the page file**: `src/app/records/page.tsx`
   Add `'use client'` if it reads from the store.

2. **Add derived data to utils if needed**: append a `calcPersonalRecords(sessions)` function to `src/lib/utils.ts`. Keep it pure — input is always the `sessions` array from the store.

3. **Add new types if needed**: extend `src/lib/types.ts` with any new interfaces.

4. **Add new store actions if needed**: extend the `FitnessStore` type in `src/store/fitness.ts` and implement the action in the `create` call. Keep actions minimal — prefer deriving data in utils rather than storing computed values.

5. **Create components**: add to `src/components/records/` (new folder matching the feature).

6. **Register the tab**: in `src/components/layout/BottomTabBar.tsx`, add an entry to the `tabs` array with the correct `href`, `label`, and a lucide-react `icon`.

7. **Verify layout clearance**: the `<main>` in `layout.tsx` already has `pb-20`. If the tab bar grows taller, increase this value.
