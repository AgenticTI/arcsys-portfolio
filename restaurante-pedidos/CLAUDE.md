# CLAUDE.md — restaurante-pedidos

This is a portfolio project: a fine-dining restaurant ordering system called **Noir**. It simulates the full flow from browsing a menu to kitchen fulfillment, demonstrating two distinct user personas in a single Next.js app.

---

## 1. Project Overview

**Noir — Fine Dining** is a full-cycle restaurant order management demo built for a portfolio. It has no backend or database — all state lives in memory via React context.

Two personas share the same app:

- **Client** — browses the menu (with category filtering), opens a dish detail modal, adds items to a cart, confirms an order, and then watches it advance through a status tracker that auto-ticks every 5 seconds.
- **Kitchen** — sees a Kanban board with three columns (Novos / Em Preparo / Prontos) and manually advances each order card, or opens a detail modal to do the same.

The persona switcher lives in the fixed header and routes between `/` (client) and `/kitchen`.

---

## 2. Tech Stack

| Dependency | Version |
|---|---|
| Next.js | 14.2.35 (App Router) |
| React | ^18 |
| TypeScript | ^5 |
| Tailwind CSS | ^3.4.1 |
| Framer Motion | ^12.38.0 |
| ESLint | ^8 (eslint-config-next 14.2.35) |

Fonts loaded via `next/font/google`:
- `Playfair_Display` → CSS var `--font-playfair` → Tailwind class `font-playfair` (headings, logo, dish names)
- `Inter` → CSS var `--font-inter` → Tailwind class `font-inter` (all body/UI text)

Image host: `images.unsplash.com` — whitelisted in `next.config.mjs` via `remotePatterns`.

---

## 3. Folder Structure

```
src/
  app/                        # Next.js App Router pages
    layout.tsx                # Root layout: loads fonts, wraps AppProvider + Header
    page.tsx                  # "/" — Client menu page (HeroSection + CategoryTabs + DishGrid + DishModal)
    globals.css               # Tailwind directives + scroll-behavior + .scrollbar-hide utility
    cart/page.tsx             # "/cart" — Cart review + OrderSummary + confirm button
    confirmation/page.tsx     # "/confirmation" — Animated checkmark, auto-redirects to /status after 2.5s
    status/page.tsx           # "/status" — StatusTracker + OrderSummary, auto-advances status every 5s
    kitchen/page.tsx          # "/kitchen" — KanbanBoard (3 columns: received/preparing/ready)

  components/                 # All UI components — no subdirectories
    Header.tsx                # Fixed top bar: NOIR logo, persona switcher pill, cart icon badge
    HeroSection.tsx           # Full-screen hero with Unsplash bg image at 40% opacity
    CategoryTabs.tsx          # Scrollable horizontal tab bar (Todos + 4 categories)
    DishGrid.tsx              # Responsive 1/2/3-col grid with stagger animation on category change
    DishCard.tsx              # Single dish card: image, name, truncated description, gold price
    DishModal.tsx             # Full detail modal: image, description, ingredients chips, qty selector, add CTA
    CartItem.tsx              # Row in cart: thumbnail, name, qty controls, subtotal, remove link
    OrderSummary.tsx          # Subtotal + 10% service fee + total block (reused in cart and /status)
    ConfirmationView.tsx      # Animated gold checkmark + order ID on noir-black bg
    StatusTracker.tsx         # Linear progress bar + 4 step dots, animated via Framer Motion
    KanbanBoard.tsx           # Renders 3 KanbanColumns + manages OrderDetailModal open state
    KanbanColumn.tsx          # Single column with header count badge + AnimatePresence card list
    KanbanCard.tsx            # Order card: id, elapsed time, items list, advance-status button
    OrderDetailModal.tsx      # Kitchen modal: order details + advance button or "Aguardando retirada"

  context/
    AppContext.tsx             # Single global store — see Architecture section

  data/
    menu.ts                   # 12 Dish objects (the only data source)
    categories.ts             # 4 category id/label pairs

  types/
    index.ts                  # All shared TypeScript types
```

---

## 4. Essential Commands

```bash
# Development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server (after build)
npm start

# Lint
npm run lint

# Type-check (no dedicated script — use tsc directly)
npx tsc --noEmit
```

There is no test runner configured. No `typecheck` script in `package.json` — use `npx tsc --noEmit` manually.

---

## 5. Architecture Decisions

### Single global store with useReducer

`src/context/AppContext.tsx` is the only state container. All mutations go through a typed `Action` union dispatched to `appReducer`. No Zustand, no Redux, no server state.

`AppState` shape:
```ts
{
  activeView: 'client' | 'kitchen'
  cart: CartItem[]
  orders: Order[]
}
```

Expose via `useApp()` hook — throw if used outside `AppProvider`. Never access the context directly.

### Order lifecycle

Status progression is a fixed linear array: `['received', 'preparing', 'ready', 'delivered']`.
`ADVANCE_ORDER_STATUS` moves an order one step forward and is idempotent at `'delivered'`.

- **Client side**: `/status/page.tsx` auto-advances `latestOrder` via `setInterval` every 5000ms, simulating kitchen progress.
- **Kitchen side**: staff manually clicks "Iniciar Preparo" / "Marcar Pronto" on KanbanCard or OrderDetailModal.
- `'delivered'` orders are filtered out of the Kanban board (`activeOrders = orders.filter(o => o.status !== 'delivered')`).

### Order IDs and pricing

`orderCounter` is a module-level variable in `AppContext.tsx` (not in state). It increments on each `CONFIRM_ORDER`. IDs are formatted as `#0001`, `#0002`, etc. **This resets on every page refresh** — intentional for a demo.

`totalAmount` on an `Order` is `subtotal * 1.1` (10% service fee applied at confirmation time). `OrderSummary` also computes the same fee client-side for display.

### Persona switching

`Header.tsx` controls routing: clicking "Cliente" calls `setView('client')` + `router.push('/')`, clicking "Cozinha" calls `setView('kitchen')` + `router.push('/kitchen')`. The cart icon is hidden when `activeView === 'kitchen'`.

### No persistence

State is in-memory only. Hard refresh clears everything. This is intentional — the project is a demo, not a production app.

---

## 6. Code Conventions

### Naming

- Components: PascalCase, one component per file, filename matches export (`DishCard.tsx` → `export default function DishCard`).
- Types: PascalCase interfaces in `src/types/index.ts`. Import via `@/types` (path alias configured in `tsconfig.json`).
- All path aliases use `@/` prefix (e.g., `@/components/Header`, `@/data/menu`, `@/context/AppContext`).

### Component placement

- All UI components go directly in `src/components/` — no subdirectories. There are only 14 components; keep the flat structure.
- Page-level components (pages that need local state like `selectedDish` or `activeCategory`) are defined inline in `src/app/**/page.tsx`.
- Components that need global state use `useApp()`. Components that only receive props do not import context.

### Styling

Use only Tailwind utility classes with the Noir palette tokens (defined in `tailwind.config.ts`):

| Token | Hex | Usage |
|---|---|---|
| `noir-black` | `#0A0A0A` | Backgrounds (header, hero, kitchen page), text |
| `noir-white` | `#F5F4F0` | Page background, light surfaces |
| `noir-cream` | `#E8E4DC` | Cards, borders, secondary surfaces |
| `noir-gold` | `#C9A96E` | Accent: prices, active states, CTA buttons, progress |
| `noir-gray` | `#6B6B6B` | Secondary text, disabled states, borders |

Never hardcode color hex values in JSX — always use the Tailwind token. Exception: Framer Motion `animate` props that require color values (see `StatusTracker.tsx` — `backgroundColor: '#C9A96E'`).

Typography pattern used throughout:
```tsx
// Section eyebrow label
<p className="font-inter text-noir-gold text-xs tracking-[0.4em] uppercase mb-3">Label</p>
// Section heading
<h2 className="font-playfair text-5xl text-noir-black">Title</h2>
```

### Framer Motion patterns

- **Card hover lift**: `whileHover={{ y: -4 }}` with `transition={{ duration: 0.2 }}` on `DishCard`.
- **Modal entrance**: `initial={{ opacity: 0, y: 40, scale: 0.97 }}` / `animate={{ opacity: 1, y: 0, scale: 1 }}` with spring `{ damping: 28, stiffness: 300 }`. Used in both `DishModal` and `OrderDetailModal`.
- **Kanban card**: `motion.div` with `layout` prop + `initial/animate/exit` for smooth column transitions via `AnimatePresence`.
- **Grid stagger**: `DishGrid` uses `variants` container/item pattern with `staggerChildren: 0.06` and `key={activeCategory}` to re-trigger on filter change.
- **Cart badge**: `key={cartItemCount}` on the badge span to re-trigger `initial={{ scale: 0.6 }}` → `animate={{ scale: 1 }}` on every count change.

Always wrap enter/exit animations in `AnimatePresence` (modals, kanban cards). Always give unique `key` props to animated siblings.

---

## 7. Mock Data

### Location

- `src/data/menu.ts` — the full menu array (`menu: Dish[]`)
- `src/data/categories.ts` — category metadata array (`categories: { id: Category; label: string }[]`)

### Menu structure

12 dishes, 3 per category:

| Category | IDs | Price range |
|---|---|---|
| `starters` | `starter-01`, `starter-02`, `starter-03` | R$ 68–98 |
| `mains` | `main-01`, `main-02`, `main-03` | R$ 118–148 |
| `desserts` | `dessert-01`, `dessert-02`, `dessert-03` | R$ 46–52 |
| `drinks` | `drink-01`, `drink-02`, `drink-03` | R$ 18–58 |

Each `Dish` has: `id`, `name`, `description`, `price` (number, BRL), `category`, `imageUrl` (Unsplash URL with `?w=800`), `ingredients` (string array).

### Images

All images are from `images.unsplash.com`. They are whitelisted in `next.config.mjs`. `next/image` with `fill` is used throughout — always provide a positioned parent container (e.g., `relative h-52 overflow-hidden`).

The hero background is `photo-1414235077428-338989a2e8c0?w=1600` with `opacity-40` overlay.

### Adding a dish

1. Add a new entry to `src/data/menu.ts` following the `Dish` interface from `src/types/index.ts`.
2. Use an existing `Category` value — there is no category registry beyond the 4 defined in the `Category` type. To add a new category, update the `Category` type union in `src/types/index.ts` AND add the label entry in `src/data/categories.ts`.
3. Use an Unsplash URL with `?w=800` suffix. No other image hosts are whitelisted.

---

## 8. How to Add a New Feature

Follow this sequence for any new feature:

**Step 1 — Define types** (if new data shapes are needed)
Edit `src/types/index.ts`. Keep types co-located in this single file; do not create separate type files.

**Step 2 — Add state/actions** (if new global state is needed)
Add to the `Action` union in `AppContext.tsx`, handle in `appReducer`, and expose a stable callback (wrapped in `useCallback`) through `AppContextValue`. Update `initialState` if necessary.

**Step 3 — Add data** (if new static data is needed)
Add to the relevant file in `src/data/`. If it's a new data domain, create a new `.ts` file in `src/data/` (not `.json` — use typed TS exports).

**Step 4 — Build the component**
Create `src/components/NewComponent.tsx`. Mark with `'use client'` if it uses hooks, event handlers, or Framer Motion. Use `useApp()` for global state; receive local data as props. Follow the Noir palette and typography patterns from section 6.

**Step 5 — Add a route** (if a new page is needed)
Create `src/app/new-route/page.tsx`. Mark with `'use client'` if needed. Redirect to `/` if required state (like `latestOrder`) is missing — see the guard pattern in `confirmation/page.tsx` and `status/page.tsx`.

**Step 6 — Wire navigation**
Add links/buttons that navigate to the new route using `useRouter().push()` or `<Link href="...">`. If it belongs to a specific persona, consider calling `setView()` in a `useEffect` (as done in `kitchen/page.tsx`).

Do not add external libraries for UI unless strictly necessary. The existing stack (Tailwind + Framer Motion) covers all current UI needs.
