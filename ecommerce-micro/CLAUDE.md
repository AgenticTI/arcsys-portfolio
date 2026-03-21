# CLAUDE.md — ecommerce-micro

This file is the authoritative guide for any AI agent working in this repository.
Read it fully before making any changes.

---

## 1. Project Overview

`ecommerce-micro` is a frontend-only e-commerce SPA built as a portfolio piece.
It simulates a complete purchase flow: product catalog → product detail → cart → checkout → order confirmation.

It also includes a `/admin` panel where the store owner can customize branding
(store name, logo URL, accent color, hero banner image and copy) without touching code.
All customization is persisted in `localStorage` via Zustand.

There is **no backend**. All data is static JSON. No authentication, no real payments.

---

## 2. Tech Stack

| Tool | Version | Role |
|---|---|---|
| Vite | ^8.0.0 | Dev server and bundler |
| React | ^19.2.4 | UI framework |
| TypeScript | ~5.9.3 | Strict mode, `noUnusedLocals`, `noUnusedParameters` |
| TanStack Router | ^1.167.4 | Client-side routing (code-based, not file-based) |
| Zustand | ^5.0.12 | Global state; two stores use `persist` middleware |
| Tailwind CSS | ^3.4.19 | Styling with a custom design token palette |
| shadcn/ui (Radix) | various | Headless primitives: `button`, `input`, `label`, `tabs`, `slider`, `badge`, `card`, `separator` |
| lucide-react | ^0.577.0 | Icon set |
| uuid | ^13.0.0 | Generates order IDs on checkout |
| clsx + tailwind-merge | latest | `cn()` utility in `src/lib/utils.ts` |

---

## 3. Folder Structure

```
public/
├── assets/
│   ├── banner-default.jpg     # Default hero banner image
│   └── hero-loop.mp4          # Hero background video (3.6 MB)
├── favicon.svg                # Site favicon
└── icons.svg                  # SVG icon sprite

scripts/
└── fetch-mock-data.ts         # One-time script: npx tsx scripts/fetch-mock-data.ts

src/
├── assets/            # Static images (hero.png only)
├── components/
│   ├── layout/
│   │   ├── StoreHeader.tsx    # Sticky nav: logo/name + cart badge
│   │   ├── StoreFooter.tsx    # Store footer with links and branding
│   │   └── AdminHeader.tsx    # Admin panel top bar
│   ├── ui/                    # shadcn/ui primitives (do not hand-edit)
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── separator.tsx
│   │   ├── slider.tsx
│   │   └── tabs.tsx
│   ├── CartItem.tsx           # CartItemRow — single line item in cart
│   ├── FilterBar.tsx          # Search + category tabs + price slider
│   ├── HeroBanner.tsx         # Hero section driven by useStoreConfig
│   ├── OrderSummary.tsx       # Cart total + "Finalizar Pedido" CTA
│   ├── ProductCard.tsx        # Card in grid; links to /produto/$id
│   ├── ProductGrid.tsx        # Responsive grid wrapper over ProductCard
│   └── SuccessCheckmark.tsx   # Animated SVG checkmark (CSS keyframes inline)
├── hooks/
│   └── useAccentColor.ts      # Syncs --cor-principal CSS var from store to :root
├── lib/
│   ├── utils.ts               # cn() helper (clsx + tailwind-merge)
│   ├── categoryLabels.ts      # pt-BR translation map for product categories
│   └── formatBRL.ts           # Format numbers as R$ currency
├── mocks/
│   ├── products.json          # 20 products from FakeStore API shape
│   └── categories.json        # ["men's clothing","jewelery","electronics","women's clothing"]
├── routes/
│   ├── __root.tsx             # Root layout: mounts useAccentColor, renders <Outlet />
│   ├── index.tsx              # / — HomePage: featured strip + filterable full catalog
│   ├── admin/
│   │   └── index.tsx          # /admin — StoreConfig editor
│   ├── carrinho/
│   │   └── index.tsx          # /carrinho — Cart page
│   ├── checkout/
│   │   ├── index.tsx          # /checkout — Form + order creation
│   │   └── sucesso.tsx        # /checkout/sucesso — Confirmation page
│   └── produto/
│       └── $id.tsx            # /produto/$id — Product detail
├── stores/
│   ├── useCartStore.ts        # Cart state (persisted as "cart" in localStorage)
│   ├── useProductsStore.ts    # Read-only product/category state from JSON
│   └── useStoreConfig.ts      # Branding config (persisted as "store-config")
├── types/
│   └── index.ts               # Product, CartItem, StoreConfig, Order interfaces
├── index.css                  # Tailwind directives + CSS custom properties
├── main.tsx                   # Entry point
└── router.ts                  # Route tree assembly + module augmentation
```

---

## 4. Essential Commands

```bash
npm run dev        # Start Vite dev server (http://localhost:5173)
npm run build      # tsc -b && vite build  — full type-check then bundle
npm run lint       # ESLint across all files
npm run preview    # Serve the dist/ build locally
```

There is no dedicated `typecheck` script. Type checking runs as part of `build` (`tsc -b`).
To check types without bundling, run: `npx tsc -b --noEmit`

### Vite public/ path convention

Files in `public/` are served at the root URL. Subdirectories matter:
- `public/assets/hero-loop.mp4` → reference as `/assets/hero-loop.mp4` (NOT `/hero-loop.mp4`)
- `public/favicon.svg` → reference as `/favicon.svg`

---

## 5. Architecture Decisions

### Routing — TanStack Router, code-based

The router is **not** file-based. Every route is a module that exports a named `Route` constant
created with `createRoute` / `createRootRoute`. All routes are manually assembled in
`src/router.ts` via `rootRoute.addChildren([...])`.

When adding a new route:
1. Create the file under `src/routes/`.
2. Export `Route` from it.
3. Import it in `src/router.ts` and add it to the `addChildren` array.

Do not attempt to use the TanStack Router Vite plugin or file-based routing — it is not configured.

Dynamic segments follow the `$param` filename convention (e.g., `src/routes/produto/$id.tsx`).
Access the param inside the component via `Route.useParams()`.

### Zustand Stores

Three stores, two of which persist to `localStorage`:

- `useCartStore` — persisted (`name: 'cart'`). `total()` and `itemCount()` are computed
  functions, not reactive selectors; call them as `total()` inside the component.
- `useProductsStore` — NOT persisted. Loads from JSON imports at module init. Read-only.
  Exposes `products`, `categories`, and `getById(id: number)`.
- `useStoreConfig` — persisted (`name: 'store-config'`). Drives all branding: store name,
  logo URL, accent color, banner image URL, banner title and subtitle.

Always use selector syntax to avoid unnecessary re-renders:
```tsx
const addItem = useCartStore((s) => s.addItem)  // good
const store = useCartStore()                     // avoid
```

### Dynamic Accent Color

`useStoreConfig` holds `corPrincipal` (a hex string, default `#0066CC`).
`useAccentColor` (mounted once in `__root.tsx`) writes it to
`document.documentElement.style.setProperty('--cor-principal', corPrincipal)` on every change.

CSS utility classes that consume this variable are defined in `src/index.css`:
- `.accent-bg` — `background-color: var(--cor-principal)`
- `.accent-text` — `color: var(--cor-principal)`
- `.accent-border` — `border-color: var(--cor-principal)`

Use these classes — not `bg-accent` Tailwind tokens — on any element that must respect
the user-chosen brand color.

### Checkout Order — Module-level Variable

The pending order is stored in a module-level `let pendingOrder` variable inside
`src/routes/checkout/index.tsx`, NOT in Zustand or localStorage.
`sucesso.tsx` reads it via the exported `getPendingOrder()` function.
This means navigating directly to `/checkout/sucesso` without going through checkout
will show the confirmation UI without order details (gracefully handled with `{order && ...}`).

### Path Aliases

`vite.config.ts` registers two aliases pointing to `./src`:
- `@` → `src/`
- `src` → `src/`

`tsconfig.app.json` only declares `@/*` for TypeScript.

**Note:** Existing code uses relative paths (`../`). Either style works; be consistent with
the file you're editing.

### Tailwind Design Tokens

Custom colors are defined in `tailwind.config.ts`:

| Token | Value |
|---|---|
| `background` | `#FFFFFF` |
| `surface` | `#F5F5F7` |
| `text-primary` | `#1D1D1F` |
| `text-secondary` | `#6E6E73` |
| `border` | `#D2D2D7` |
| `admin-bg` | `#0F0F0F` |
| `accent` | `var(--cor-principal)` |
| `dark-surface` | `#0A0A0A` |
| `card-dark` | `#141414` |
| `card-img-dark` | `#1c1c1c` |

Dark mode is enabled via `darkMode: ['class']` in Tailwind config.

Font is Inter (loaded from Google Fonts, system-ui fallback).

### CSS Keyframes

Global animations defined in `src/index.css`:
- `wordReveal` — staggered word-by-word text reveal (hero title)
- `slideUp` — fade-in with upward motion (hero elements)
- `fadeIn` — simple opacity transition (badges, scroll cue)
- `float` — vertical oscillation (scroll cue line)
- `drift` — slow background gradient movement (hero fallback)

A `prefers-reduced-motion` media query disables all animations for accessibility.

---

## 6. Code Conventions

- **Named exports only** — no default exports for components or stores.
- **PascalCase** for component files and their exported function names (`ProductCard`, `StoreHeader`).
- **camelCase** for stores and hooks (`useCartStore`, `useAccentColor`).
- **Route files** export a single named `Route` constant. The page component is a plain function
  defined in the same file (not exported separately).
- **shadcn/ui components** live in `src/components/ui/`. Do not hand-edit them.
  Add new primitives with `npx shadcn@latest add <component>`.
- **Business components** live directly in `src/components/` (not in subdirectories),
  except layout shells which go in `src/components/layout/`.
- **No barrel index files** — import directly from the file path.
- **`cn()` for class merging** — always use `cn()` from `src/lib/utils.ts` when conditionally
  composing Tailwind classes.
- TypeScript strict mode is on. All props must be typed. No `any`.

---

## 7. Mock Data

Products and categories come from two static JSON files:

- `src/mocks/products.json` — 20 products scraped from [FakeStore API](https://fakestoreapi.com).
  Each entry matches the `Product` interface: `{ id, title, price, description, category, image, rating: { rate, count } }`.
  Product images are external URLs pointing to `fakestoreapi.com/img/...`.
- `src/mocks/categories.json` — `["men's clothing", "jewelery", "electronics", "women's clothing"]`.

`useProductsStore` imports both files directly (JSON module imports, enabled via
`resolveJsonModule: true` in `tsconfig.app.json`). The store is initialized once and never mutated.

**There are no API calls anywhere in this project.** If you need to add real API fetching,
introduce it in `useProductsStore` using Zustand's `setState` pattern and TanStack Query or
native `fetch` inside a `useEffect`.

---

## 8. How to Add a New Feature

### New page / route

1. Create `src/routes/<path>/index.tsx` (or `src/routes/<path>/<segment>.tsx` for nested).
2. Inside, define the page component function and export `Route`:
   ```tsx
   import { createRoute } from '@tanstack/react-router'
   import { Route as rootRoute } from '../__root'

   function MyPage() { ... }

   export const Route = createRoute({
     getParentRoute: () => rootRoute,
     path: '/my-path',
     component: MyPage,
   })
   ```
3. In `src/router.ts`, import the `Route` and add it to `addChildren([...])`.

### New UI component

1. Create `src/components/MyComponent.tsx` with a named export.
2. Use `cn()` for class composition, design tokens from `tailwind.config.ts`,
   and `.accent-bg` / `.accent-text` for brand-colored elements.
3. Import directly where needed — no barrel files.

### New Zustand store

1. Create `src/stores/useMyStore.ts`.
2. Define the state interface, create the store with `create<State>()`.
3. Wrap with `persist(...)` only if the state must survive page refresh.
4. Use selector pattern when consuming in components.

### Extending StoreConfig

1. Add the new field to the `StoreConfig` interface in `src/types/index.ts`.
2. Add the default value to `DEFAULT_CONFIG` in `src/stores/useStoreConfig.ts`.
3. Add the form control to `src/routes/admin/index.tsx`.
4. Consume the new field in whichever component needs it via `useStoreConfig((s) => s.config.newField)`.

### Adding a new product or category

Edit `src/mocks/products.json` and/or `src/mocks/categories.json` directly.
Products must conform to the `Product` interface. No code changes required.
