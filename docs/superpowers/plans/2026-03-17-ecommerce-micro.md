# E-commerce Micro Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a white-label e-commerce MVP with an Admin Panel (dark) and a Public Store (light) that share a live Zustand config, demonstrating dynamic theming, a full shopping flow, and a polished demo-ready UI.

**Architecture:** A single React + Vite SPA with TanStack Router. Two "worlds" share one Zustand config store persisted to localStorage: the Admin Panel (`/admin`) writes store identity (name, logo, accent color, banner), and the Public Store (`/`, `/produto/:id`, `/carrinho`, `/checkout`, `/checkout/sucesso`) reads it and applies the accent via a CSS custom property. Product data is a committed static JSON snapshot — no network calls at runtime.

**Tech Stack:** React 18, Vite 5, TypeScript 5, TanStack Router v1, Tailwind CSS v3, shadcn/ui, Zustand 4, Inter (Google Fonts), localStorage persistence.

---

## File Map

> Every file that will be created or modified. Read this before touching any task.

```
ecommerce-micro/
├── index.html                          # Root HTML, loads Inter font
├── vite.config.ts                      # Vite + path aliases
├── tailwind.config.ts                  # Extend theme with design tokens
├── tsconfig.json
├── package.json
├── scripts/
│   └── fetch-mock-data.ts              # One-time script: fetch FakeStore API → JSON
├── src/
│   ├── main.tsx                        # React entry, router provider
│   ├── router.ts                       # TanStack Router: all route definitions
│   ├── mocks/
│   │   ├── products.json               # 20 products snapshot (committed)
│   │   └── categories.json             # ["electronics","jewelery","men's clothing","women's clothing"]
│   ├── types/
│   │   └── index.ts                    # Product, CartItem, StoreConfig, Order interfaces
│   ├── stores/
│   │   ├── useStoreConfig.ts           # Zustand: StoreConfig + localStorage persistence
│   │   ├── useCartStore.ts             # Zustand: CartItem[] + localStorage persistence
│   │   └── useProductsStore.ts         # Zustand: products[] seeded from products.json
│   ├── hooks/
│   │   └── useAccentColor.ts           # Applies --cor-principal CSS var on config change
│   ├── components/
│   │   ├── layout/
│   │   │   ├── StoreHeader.tsx         # Public store nav: logo/name, cart icon with badge
│   │   │   └── AdminHeader.tsx         # Admin nav: "Painel" title + "Ver Loja →" button
│   │   ├── ui/                         # shadcn/ui re-exports (Button, Input, Slider, etc.)
│   │   ├── ProductCard.tsx             # Product grid card: image, title, price, CTA button
│   │   ├── ProductGrid.tsx             # Responsive grid wrapper
│   │   ├── FilterBar.tsx               # Category tabs + price range slider + name search
│   │   ├── HeroBanner.tsx              # Full-width banner with title/subtitle overlay
│   │   ├── CartItem.tsx                # Single cart row: image, title, qty controls, subtotal
│   │   ├── OrderSummary.tsx            # Cart totals + checkout button
│   │   └── SuccessCheckmark.tsx        # Animated SVG checkmark for /checkout/sucesso
│   └── routes/
│       ├── admin/
│       │   └── index.tsx               # /admin — StoreConfig form, live preview link
│       ├── index.tsx                   # / — HeroBanner + featured grid + FilterBar + full catalog
│       ├── produto/
│       │   └── $id.tsx                 # /produto/:id — product detail page
│       ├── carrinho/
│       │   └── index.tsx               # /carrinho — cart page
│       ├── checkout/
│       │   ├── index.tsx               # /checkout — fake form
│       │   └── sucesso.tsx             # /checkout/sucesso — animated confirmation
│       └── __root.tsx                  # Root layout: injects accent CSS var, renders <Outlet />
```

---

## Parallel Execution Groups

The tasks below are organized into sequential **waves**. Within each wave, all tasks are independent and can run in parallel sub-agents.

```
Wave 1 (Foundation — must finish before anything else):
  Task 1: Project Scaffold
  Task 2: Design Tokens + Tailwind
  Task 3: Types + Mock Data

Wave 2 (Stores — depend on types):
  Task 4: useStoreConfig store
  Task 5: useCartStore store
  Task 6: useProductsStore store

Wave 3 (Routing + Root Layout — depends on stores):
  Task 7: Router + Root Layout + useAccentColor

Wave 4 (Components — depend on stores + routing):
  Task 8: StoreHeader + AdminHeader
  Task 9: ProductCard + ProductGrid
  Task 10: FilterBar
  Task 11: HeroBanner
  Task 12: CartItem + OrderSummary
  Task 13: SuccessCheckmark

Wave 5 (Routes/Pages — depend on all components):
  Task 14: /admin page
  Task 15: / (homepage) page
  Task 16: /produto/:id page
  Task 17: /carrinho page
  Task 18: /checkout page
  Task 19: /checkout/sucesso page

Wave 6 (Polish + Verification):
  Task 20: Responsive audit + final smoke test
```

---

## Wave 1 — Foundation

### Task 1: Project Scaffold

**Files:**
- Create: `ecommerce-micro/package.json`
- Create: `ecommerce-micro/vite.config.ts`
- Create: `ecommerce-micro/tsconfig.json`
- Create: `ecommerce-micro/index.html`
- Create: `ecommerce-micro/src/main.tsx`

> No tests for scaffold steps — verify by running the dev server.

- [ ] **Step 1: Initialize Vite project**

Run from `C:\Users\leona\Documents\Backup\Portifolio ARCSYS`:

```bash
npm create vite@latest ecommerce-micro -- --template react-ts
cd ecommerce-micro
npm install
```

- [ ] **Step 2: Install all dependencies in one shot**

```bash
npm install @tanstack/react-router zustand
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install class-variance-authority clsx tailwind-merge lucide-react
npm install @radix-ui/react-slider @radix-ui/react-tabs @radix-ui/react-label
npm install uuid
npm install -D @types/uuid tsx
```

- [ ] **Step 3: Install shadcn/ui CLI and init**

```bash
npx shadcn@latest init
```

When prompted:
- Style: **Default**
- Base color: **Neutral**
- CSS variables: **Yes**

Then add the components used in this project:

```bash
npx shadcn@latest add button input label slider tabs badge card separator
```

- [ ] **Step 4: Update `index.html` to load Inter font**

Replace the contents of `ecommerce-micro/index.html`:

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
    <title>E-commerce Micro</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Verify dev server starts**

```bash
npm run dev
```

Expected: Server running at `http://localhost:5173` with no errors.

- [ ] **Step 6: Commit**

```bash
git init
git add .
git commit -m "chore: scaffold Vite + React + TS project with all deps"
```

---

### Task 2: Design Tokens + Tailwind Config

**Files:**
- Modify: `ecommerce-micro/tailwind.config.ts`
- Modify: `ecommerce-micro/src/index.css`

- [ ] **Step 1: Update `tailwind.config.ts` with design tokens**

Replace the file contents:

```ts
import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: '#FFFFFF',
        surface: '#F5F5F7',
        'text-primary': '#1D1D1F',
        'text-secondary': '#6E6E73',
        border: '#D2D2D7',
        'admin-bg': '#0F0F0F',
        accent: 'var(--cor-principal)',
      },
      letterSpacing: {
        widest: '0.15em',
      },
    },
  },
  plugins: [],
} satisfies Config
```

- [ ] **Step 2: Update `src/index.css` with CSS variables and base styles**

Replace the file contents:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --cor-principal: #000000;
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-text-primary font-sans antialiased;
  }
}

@layer utilities {
  .accent-bg {
    background-color: var(--cor-principal);
  }
  .accent-text {
    color: var(--cor-principal);
  }
  .accent-border {
    border-color: var(--cor-principal);
  }
}
```

- [ ] **Step 3: Verify Tailwind compiles**

```bash
npm run dev
```

Expected: No CSS compilation errors in terminal.

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.ts src/index.css
git commit -m "chore: add design tokens and Tailwind config"
```

---

### Task 3: Types + Mock Data

**Files:**
- Create: `ecommerce-micro/src/types/index.ts`
- Create: `ecommerce-micro/scripts/fetch-mock-data.ts`
- Create: `ecommerce-micro/src/mocks/products.json` (generated by script)
- Create: `ecommerce-micro/src/mocks/categories.json` (generated by script)

- [ ] **Step 1: Create `src/types/index.ts`**

```ts
export interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: { rate: number; count: number }
}

export interface CartItem {
  productId: number
  title: string
  image: string
  price: number
  quantity: number
}

export interface StoreConfig {
  nomeLoja: string
  logotipoUrl: string | null
  corPrincipal: string
  bannerUrl: string
  bannerTitulo: string
  bannerSubtitulo: string
}

export interface Order {
  orderId: string
  items: CartItem[]
  total: number
  createdAt: Date
}
```

- [ ] **Step 2: Create `scripts/fetch-mock-data.ts`**

```ts
// Run once: npx tsx scripts/fetch-mock-data.ts
// Saves FakeStore API snapshot to src/mocks/

import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const MOCKS_DIR = join(process.cwd(), 'src', 'mocks')

async function main() {
  mkdirSync(MOCKS_DIR, { recursive: true })

  const res = await fetch('https://fakestoreapi.com/products')
  const products = await res.json()

  writeFileSync(
    join(MOCKS_DIR, 'products.json'),
    JSON.stringify(products, null, 2)
  )

  const categories = [...new Set(products.map((p: { category: string }) => p.category))]
  writeFileSync(
    join(MOCKS_DIR, 'categories.json'),
    JSON.stringify(categories, null, 2)
  )

  console.log(`Saved ${products.length} products and ${categories.length} categories.`)
}

main().catch(console.error)
```

- [ ] **Step 3: Run the fetch script to generate mock JSON files**

```bash
npx tsx scripts/fetch-mock-data.ts
```

Expected output: `Saved 20 products and 4 categories.`

Verify files exist:
```bash
ls src/mocks/
```
Expected: `products.json  categories.json`

- [ ] **Step 4: Commit**

```bash
git add src/types/index.ts scripts/fetch-mock-data.ts src/mocks/products.json src/mocks/categories.json
git commit -m "feat: add TypeScript types and static mock data snapshot"
```

---

## Wave 2 — Zustand Stores

> All three tasks in this wave are independent. Run in parallel.

### Task 4: useStoreConfig Store

**Files:**
- Create: `ecommerce-micro/src/stores/useStoreConfig.ts`

- [ ] **Step 1: Create the store**

```ts
// src/stores/useStoreConfig.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { StoreConfig } from '../types'

interface StoreConfigState {
  config: StoreConfig
  updateConfig: (partial: Partial<StoreConfig>) => void
  resetConfig: () => void
}

const DEFAULT_CONFIG: StoreConfig = {
  nomeLoja: 'My Store',
  logotipoUrl: null,
  corPrincipal: '#000000',
  bannerUrl: '/assets/banner-default.jpg',
  bannerTitulo: 'Bem-vindo à nossa loja',
  bannerSubtitulo: 'Encontre o produto perfeito',
}

export const useStoreConfig = create<StoreConfigState>()(
  persist(
    (set) => ({
      config: DEFAULT_CONFIG,
      updateConfig: (partial) =>
        set((state) => ({ config: { ...state.config, ...partial } })),
      resetConfig: () => set({ config: DEFAULT_CONFIG }),
    }),
    { name: 'store-config' }
  )
)
```

- [ ] **Step 2: Manually verify in browser console**

In the running dev server, open the browser console and run:
```js
// After importing, check localStorage persistence
localStorage.getItem('store-config')
```
Expected: Either `null` (first load) or a JSON string after any store update.

- [ ] **Step 3: Commit**

```bash
git add src/stores/useStoreConfig.ts
git commit -m "feat: add useStoreConfig Zustand store with localStorage persistence"
```

---

### Task 5: useCartStore

**Files:**
- Create: `ecommerce-micro/src/stores/useCartStore.ts`

- [ ] **Step 1: Create the store**

```ts
// src/stores/useCartStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '../types'

interface CartState {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  total: () => number
  itemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (incoming) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === incoming.productId)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === incoming.productId
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            }
          }
          return { items: [...state.items, { ...incoming, quantity: 1 }] }
        }),
      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.productId !== productId)
              : state.items.map((i) =>
                  i.productId === productId ? { ...i, quantity } : i
                ),
        })),
      clearCart: () => set({ items: [] }),
      total: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      itemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    { name: 'cart' }
  )
)
```

- [ ] **Step 2: Commit**

```bash
git add src/stores/useCartStore.ts
git commit -m "feat: add useCartStore with add/remove/quantity/clear actions"
```

---

### Task 6: useProductsStore

**Files:**
- Create: `ecommerce-micro/src/stores/useProductsStore.ts`

- [ ] **Step 1: Create the store**

```ts
// src/stores/useProductsStore.ts
import { create } from 'zustand'
import type { Product } from '../types'
import productsData from '../mocks/products.json'
import categoriesData from '../mocks/categories.json'

interface ProductsState {
  products: Product[]
  categories: string[]
  getById: (id: number) => Product | undefined
}

export const useProductsStore = create<ProductsState>()(() => ({
  products: productsData as Product[],
  categories: categoriesData as string[],
  getById: (id) => (productsData as Product[]).find((p) => p.id === id),
}))
```

- [ ] **Step 2: Add JSON import resolution to `tsconfig.json`**

Ensure `tsconfig.json` has `"resolveJsonModule": true` in `compilerOptions`. Open `tsconfig.json` and add/confirm:

```json
{
  "compilerOptions": {
    "resolveJsonModule": true
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/stores/useProductsStore.ts tsconfig.json
git commit -m "feat: add useProductsStore seeded from static JSON mock"
```

---

## Wave 3 — Routing + Root Layout

### Task 7: Router + Root Layout + useAccentColor

**Files:**
- Create: `ecommerce-micro/src/router.ts`
- Create: `ecommerce-micro/src/routes/__root.tsx`
- Create: `ecommerce-micro/src/hooks/useAccentColor.ts`
- Modify: `ecommerce-micro/src/main.tsx`

> Stub all page routes with a placeholder component so the router compiles. Real pages come in Wave 5.

- [ ] **Step 1: Create stub pages for all routes**

Create `src/routes/index.tsx`:
```tsx
export default function HomePage() {
  return <div>Homepage — coming soon</div>
}
```

Create `src/routes/admin/index.tsx`:
```tsx
export default function AdminPage() {
  return <div>Admin — coming soon</div>
}
```

Create `src/routes/produto/$id.tsx`:
```tsx
export default function ProductPage() {
  return <div>Product — coming soon</div>
}
```

Create `src/routes/carrinho/index.tsx`:
```tsx
export default function CartPage() {
  return <div>Cart — coming soon</div>
}
```

Create `src/routes/checkout/index.tsx`:
```tsx
export default function CheckoutPage() {
  return <div>Checkout — coming soon</div>
}
```

Create `src/routes/checkout/sucesso.tsx`:
```tsx
export default function SuccessPage() {
  return <div>Success — coming soon</div>
}
```

- [ ] **Step 2: Create `src/hooks/useAccentColor.ts`**

```ts
// src/hooks/useAccentColor.ts
import { useEffect } from 'react'
import { useStoreConfig } from '../stores/useStoreConfig'

export function useAccentColor() {
  const corPrincipal = useStoreConfig((s) => s.config.corPrincipal)

  useEffect(() => {
    document.documentElement.style.setProperty('--cor-principal', corPrincipal)
  }, [corPrincipal])
}
```

- [ ] **Step 3: Create `src/routes/__root.tsx`**

```tsx
// src/routes/__root.tsx
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { useAccentColor } from '../hooks/useAccentColor'

function RootLayout() {
  useAccentColor()
  return <Outlet />
}

export const Route = createRootRoute({
  component: RootLayout,
})
```

- [ ] **Step 4: Create `src/router.ts`**

```ts
// src/router.ts
import { createRouter, createRoute } from '@tanstack/react-router'
import { Route as rootRoute } from './routes/__root'
import HomePage from './routes/index'
import AdminPage from './routes/admin/index'
import ProductPage from './routes/produto/$id'
import CartPage from './routes/carrinho/index'
import CheckoutPage from './routes/checkout/index'
import SuccessPage from './routes/checkout/sucesso'

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPage,
})

const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/produto/$id',
  component: ProductPage,
})

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/carrinho',
  component: CartPage,
})

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: CheckoutPage,
})

const successRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout/sucesso',
  component: SuccessPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  adminRoute,
  productRoute,
  cartRoute,
  checkoutRoute,
  successRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
```

- [ ] **Step 5: Update `src/main.tsx`**

```tsx
// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
```

- [ ] **Step 6: Verify all routes compile and render stubs**

```bash
npm run dev
```

Navigate to each route manually:
- `http://localhost:5173/` → "Homepage — coming soon"
- `http://localhost:5173/admin` → "Admin — coming soon"
- `http://localhost:5173/produto/1` → "Product — coming soon"
- `http://localhost:5173/carrinho` → "Cart — coming soon"
- `http://localhost:5173/checkout` → "Checkout — coming soon"
- `http://localhost:5173/checkout/sucesso` → "Success — coming soon"

Expected: All routes render without errors in the browser console.

- [ ] **Step 7: Commit**

```bash
git add src/router.ts src/routes/ src/hooks/useAccentColor.ts src/main.tsx
git commit -m "feat: add TanStack Router with all routes and root layout with accent color injection"
```

---

## Wave 4 — Shared Components

> All tasks in this wave are independent. Run in parallel.

### Task 8: StoreHeader + AdminHeader

**Files:**
- Create: `ecommerce-micro/src/components/layout/StoreHeader.tsx`
- Create: `ecommerce-micro/src/components/layout/AdminHeader.tsx`

- [ ] **Step 1: Create `src/components/layout/StoreHeader.tsx`**

```tsx
// src/components/layout/StoreHeader.tsx
import { Link } from '@tanstack/react-router'
import { ShoppingCart } from 'lucide-react'
import { useStoreConfig } from '../../stores/useStoreConfig'
import { useCartStore } from '../../stores/useCartStore'

export function StoreHeader() {
  const { nomeLoja, logotipoUrl } = useStoreConfig((s) => s.config)
  const itemCount = useCartStore((s) => s.itemCount())

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          {logotipoUrl ? (
            <img src={logotipoUrl} alt={nomeLoja} className="h-8 w-auto object-contain" />
          ) : (
            <span className="text-lg font-semibold tracking-tight text-text-primary">
              {nomeLoja}
            </span>
          )}
        </Link>

        <Link to="/carrinho" className="relative p-2 hover:opacity-70 transition-opacity">
          <ShoppingCart className="w-5 h-5 text-text-primary" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 accent-bg text-white text-xs font-medium w-4 h-4 rounded-full flex items-center justify-center leading-none">
              {itemCount > 9 ? '9+' : itemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Create `src/components/layout/AdminHeader.tsx`**

```tsx
// src/components/layout/AdminHeader.tsx
import { ExternalLink } from 'lucide-react'

export function AdminHeader() {
  return (
    <header className="bg-admin-bg border-b border-white/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400" />
          <span className="text-white font-semibold tracking-tight">Painel do Lojista</span>
        </div>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors"
        >
          Ver Loja
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </header>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/
git commit -m "feat: add StoreHeader and AdminHeader layout components"
```

---

### Task 9: ProductCard + ProductGrid

**Files:**
- Create: `ecommerce-micro/src/components/ProductCard.tsx`
- Create: `ecommerce-micro/src/components/ProductGrid.tsx`

- [ ] **Step 1: Create `src/components/ProductCard.tsx`**

```tsx
// src/components/ProductCard.tsx
import { Link } from '@tanstack/react-router'
import { Star } from 'lucide-react'
import type { Product } from '../types'
import { useCartStore } from '../stores/useCartStore'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      productId: product.id,
      title: product.title,
      image: product.image,
      price: product.price,
    })
  }

  return (
    <Link
      to="/produto/$id"
      params={{ id: String(product.id) }}
      className="group flex flex-col bg-background border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Image container — fixed aspect ratio, no distortion */}
      <div className="aspect-square bg-surface flex items-center justify-center p-6">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-contain mix-blend-multiply"
          loading="lazy"
        />
      </div>

      <div className="flex flex-col flex-1 p-4 gap-2">
        {/* Category badge */}
        <span className="text-xs uppercase tracking-widest text-text-secondary font-medium">
          {product.category}
        </span>

        {/* Title */}
        <p className="text-sm font-medium text-text-primary leading-snug line-clamp-2 flex-1">
          {product.title}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 text-text-secondary">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span className="text-xs">{product.rating.rate}</span>
          <span className="text-xs">({product.rating.count})</span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
          <span className="font-semibold text-text-primary">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            className="text-xs font-medium px-3 py-1.5 rounded-lg accent-bg text-white hover:opacity-80 transition-opacity"
          >
            + Carrinho
          </button>
        </div>
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: Create `src/components/ProductGrid.tsx`**

```tsx
// src/components/ProductGrid.tsx
import type { Product } from '../types'
import { ProductCard } from './ProductCard'

interface ProductGridProps {
  products: Product[]
  emptyMessage?: string
}

export function ProductGrid({ products, emptyMessage = 'Nenhum produto encontrado.' }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-16 text-center text-text-secondary">
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ProductCard.tsx src/components/ProductGrid.tsx
git commit -m "feat: add ProductCard and ProductGrid components"
```

---

### Task 10: FilterBar

**Files:**
- Create: `ecommerce-micro/src/components/FilterBar.tsx`

- [ ] **Step 1: Create `src/components/FilterBar.tsx`**

```tsx
// src/components/FilterBar.tsx
import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Input } from './ui/input'
import { Slider } from './ui/slider'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs'
import type { Product } from '../types'

interface FilterBarProps {
  categories: string[]
  products: Product[]
  onFilter: (filtered: Product[]) => void
}

export function FilterBar({ categories, products, onFilter }: FilterBarProps) {
  const maxPrice = Math.ceil(Math.max(...products.map((p) => p.price)))

  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [priceRange, setPriceRange] = useState<[number]>([maxPrice])
  const [search, setSearch] = useState('')

  useEffect(() => {
    const filtered = products.filter((p) => {
      const matchCategory = activeCategory === 'all' || p.category === activeCategory
      const matchPrice = p.price <= priceRange[0]
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase())
      return matchCategory && matchPrice && matchSearch
    })
    onFilter(filtered)
  }, [activeCategory, priceRange, search, products, onFilter])

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        <Input
          placeholder="Buscar produtos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Category tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="flex flex-wrap gap-1 h-auto bg-transparent p-0">
          <TabsTrigger value="all" className="rounded-full border border-border text-xs px-3 py-1 data-[state=active]:accent-bg data-[state=active]:text-white data-[state=active]:border-transparent">
            Todos
          </TabsTrigger>
          {categories.map((cat) => (
            <TabsTrigger
              key={cat}
              value={cat}
              className="rounded-full border border-border text-xs px-3 py-1 capitalize data-[state=active]:accent-bg data-[state=active]:text-white data-[state=active]:border-transparent"
            >
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Price range */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-text-secondary">
          <span>Preço máximo</span>
          <span className="font-medium text-text-primary">${priceRange[0].toFixed(0)}</span>
        </div>
        <Slider
          min={1}
          max={maxPrice}
          step={1}
          value={priceRange}
          onValueChange={(val) => setPriceRange(val as [number])}
          className="w-full"
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/FilterBar.tsx
git commit -m "feat: add FilterBar with category tabs, price slider, and search"
```

---

### Task 11: HeroBanner

**Files:**
- Create: `ecommerce-micro/src/components/HeroBanner.tsx`
- Create: `ecommerce-micro/public/assets/banner-default.jpg`

- [ ] **Step 1: Add a default banner image**

Download any free high-quality product/lifestyle image (e.g., from Unsplash) and save it to `ecommerce-micro/public/assets/banner-default.jpg`.

A simple fallback gradient can also be used if no image is available — the component handles both via `bannerUrl`.

- [ ] **Step 2: Create `src/components/HeroBanner.tsx`**

```tsx
// src/components/HeroBanner.tsx
import { useStoreConfig } from '../stores/useStoreConfig'

export function HeroBanner() {
  const { bannerUrl, bannerTitulo, bannerSubtitulo } = useStoreConfig((s) => s.config)

  return (
    <section
      className="relative w-full h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${bannerUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-2xl">
        <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight mb-4 leading-tight">
          {bannerTitulo}
        </h1>
        <p className="text-lg sm:text-xl text-white/80 leading-relaxed">
          {bannerSubtitulo}
        </p>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/HeroBanner.tsx public/assets/
git commit -m "feat: add HeroBanner reading from StoreConfig"
```

---

### Task 12: CartItem + OrderSummary

**Files:**
- Create: `ecommerce-micro/src/components/CartItem.tsx`
- Create: `ecommerce-micro/src/components/OrderSummary.tsx`

- [ ] **Step 1: Create `src/components/CartItem.tsx`**

```tsx
// src/components/CartItem.tsx
import { Minus, Plus, Trash2 } from 'lucide-react'
import type { CartItem as CartItemType } from '../types'
import { useCartStore } from '../stores/useCartStore'

interface CartItemProps {
  item: CartItemType
}

export function CartItemRow({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore()

  return (
    <div className="flex gap-4 py-4 border-b border-border last:border-0">
      {/* Image */}
      <div className="w-20 h-20 bg-surface rounded-lg flex-shrink-0 flex items-center justify-center p-2">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-contain mix-blend-multiply"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <p className="text-sm font-medium text-text-primary leading-snug line-clamp-2">
          {item.title}
        </p>
        <p className="text-sm text-text-secondary">${item.price.toFixed(2)} / un.</p>

        {/* Qty controls */}
        <div className="flex items-center gap-2 mt-auto">
          <button
            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
            className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-surface transition-colors"
            aria-label="Diminuir quantidade"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
            className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-surface transition-colors"
            aria-label="Aumentar quantidade"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Subtotal + remove */}
      <div className="flex flex-col items-end justify-between flex-shrink-0">
        <span className="font-semibold text-sm text-text-primary">
          ${(item.price * item.quantity).toFixed(2)}
        </span>
        <button
          onClick={() => removeItem(item.productId)}
          className="text-text-secondary hover:text-red-500 transition-colors"
          aria-label="Remover item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `src/components/OrderSummary.tsx`**

```tsx
// src/components/OrderSummary.tsx
import { useNavigate } from '@tanstack/react-router'
import { useCartStore } from '../stores/useCartStore'

export function OrderSummary() {
  const { items, total } = useCartStore()
  const navigate = useNavigate()
  const subtotal = total()
  const shipping = 0

  return (
    <div className="bg-surface rounded-2xl p-6 space-y-4">
      <h2 className="font-semibold text-lg text-text-primary">Resumo do Pedido</h2>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-text-secondary">
          <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'itens'})</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-text-secondary">
          <span>Entrega</span>
          <span className="text-green-600">Grátis</span>
        </div>
      </div>

      <div className="pt-3 border-t border-border flex justify-between font-semibold">
        <span>Total</span>
        <span>${(subtotal + shipping).toFixed(2)}</span>
      </div>

      <button
        onClick={() => navigate({ to: '/checkout' })}
        disabled={items.length === 0}
        className="w-full py-3 rounded-xl accent-bg text-white font-medium hover:opacity-80 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Finalizar Pedido
      </button>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/CartItem.tsx src/components/OrderSummary.tsx
git commit -m "feat: add CartItemRow and OrderSummary components"
```

---

### Task 13: SuccessCheckmark

**Files:**
- Create: `ecommerce-micro/src/components/SuccessCheckmark.tsx`

- [ ] **Step 1: Create the animated checkmark component**

```tsx
// src/components/SuccessCheckmark.tsx
// CSS-in-JSX keyframe animation via style tag

export function SuccessCheckmark() {
  return (
    <>
      <style>{`
        @keyframes draw-circle {
          to { stroke-dashoffset: 0; }
        }
        @keyframes draw-check {
          to { stroke-dashoffset: 0; }
        }
        @keyframes fade-scale-in {
          from { opacity: 0; transform: scale(0.8); }
          to   { opacity: 1; transform: scale(1); }
        }
        .checkmark-circle {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          animation: draw-circle 0.6s cubic-bezier(0.65, 0, 0.45, 1) 0.1s forwards;
        }
        .checkmark-path {
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: draw-check 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.7s forwards;
        }
        .checkmark-wrapper {
          animation: fade-scale-in 0.4s ease forwards;
        }
      `}</style>

      <div className="checkmark-wrapper flex items-center justify-center">
        <svg
          viewBox="0 0 52 52"
          className="w-24 h-24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            className="checkmark-circle"
            cx="26"
            cy="26"
            r="25"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            className="checkmark-path"
            d="M14.1 27.2l7.1 7.2 16.7-16.8"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SuccessCheckmark.tsx
git commit -m "feat: add animated SuccessCheckmark SVG component"
```

---

## Wave 5 — Pages

> All six page tasks are independent once Wave 4 is complete. Run in parallel.

### Task 14: /admin Page

**Files:**
- Modify: `ecommerce-micro/src/routes/admin/index.tsx`

- [ ] **Step 1: Implement the Admin page**

Replace `src/routes/admin/index.tsx`:

```tsx
// src/routes/admin/index.tsx
import { createRoute } from '@tanstack/react-router'
import { Route as rootRoute } from '../__root'
import { AdminHeader } from '../../components/layout/AdminHeader'
import { useStoreConfig } from '../../stores/useStoreConfig'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Button } from '../../components/ui/button'

function AdminPage() {
  const { config, updateConfig, resetConfig } = useStoreConfig()

  return (
    <div className="min-h-screen bg-admin-bg">
      <AdminHeader />

      <main className="max-w-2xl mx-auto px-4 py-12 space-y-10">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Configurações da Loja
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Personalize a identidade visual da sua loja. As mudanças são salvas automaticamente.
          </p>
        </div>

        <div className="space-y-6">
          {/* Identidade */}
          <section className="space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-white/40 font-medium">
              Identidade
            </h2>

            <div className="space-y-2">
              <Label htmlFor="nomeLoja" className="text-white/80 text-sm">
                Nome da loja
              </Label>
              <Input
                id="nomeLoja"
                value={config.nomeLoja}
                onChange={(e) => updateConfig({ nomeLoja: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-white/20"
                placeholder="My Store"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logotipoUrl" className="text-white/80 text-sm">
                URL do logotipo (opcional)
              </Label>
              <Input
                id="logotipoUrl"
                value={config.logotipoUrl ?? ''}
                onChange={(e) => updateConfig({ logotipoUrl: e.target.value || null })}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-white/20"
                placeholder="https://..."
              />
              {config.logotipoUrl && (
                <img
                  src={config.logotipoUrl}
                  alt="Logo preview"
                  className="h-10 object-contain mt-2"
                />
              )}
            </div>
          </section>

          {/* Cor principal */}
          <section className="space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-white/40 font-medium">
              Cor Principal
            </h2>

            <div className="flex items-center gap-4">
              <input
                type="color"
                id="corPrincipal"
                value={config.corPrincipal}
                onChange={(e) => updateConfig({ corPrincipal: e.target.value })}
                className="w-12 h-12 rounded-lg cursor-pointer border-0 bg-transparent p-0"
              />
              <div className="space-y-1">
                <Label htmlFor="corPrincipal" className="text-white/80 text-sm">
                  Cor dos botões CTA e destaques
                </Label>
                <p className="text-white/40 text-xs font-mono">{config.corPrincipal}</p>
              </div>
            </div>
          </section>

          {/* Banner */}
          <section className="space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-white/40 font-medium">
              Banner Hero
            </h2>

            <div className="space-y-2">
              <Label htmlFor="bannerUrl" className="text-white/80 text-sm">
                URL da imagem do banner
              </Label>
              <Input
                id="bannerUrl"
                value={config.bannerUrl}
                onChange={(e) => updateConfig({ bannerUrl: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-white/20"
                placeholder="/assets/banner-default.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bannerTitulo" className="text-white/80 text-sm">
                Título do banner
              </Label>
              <Input
                id="bannerTitulo"
                value={config.bannerTitulo}
                onChange={(e) => updateConfig({ bannerTitulo: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-white/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bannerSubtitulo" className="text-white/80 text-sm">
                Subtítulo do banner
              </Label>
              <Input
                id="bannerSubtitulo"
                value={config.bannerSubtitulo}
                onChange={(e) => updateConfig({ bannerSubtitulo: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-white/20"
              />
            </div>
          </section>

          <div className="pt-4 flex justify-end">
            <Button
              variant="ghost"
              onClick={resetConfig}
              className="text-white/40 hover:text-white hover:bg-white/5"
            >
              Redefinir padrões
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPage,
})
```

> Note: After implementing each page with `createRoute`, update `src/router.ts` to import the `Route` export from each page file instead of the default export. See Step 3.

- [ ] **Step 2: Update `src/router.ts` to use file-based route exports**

Replace `src/router.ts` with the final version that imports `Route` objects from each page:

```ts
// src/router.ts
import { createRouter } from '@tanstack/react-router'
import { Route as rootRoute } from './routes/__root'
import { Route as indexRoute } from './routes/index'
import { Route as adminRoute } from './routes/admin/index'
import { Route as productRoute } from './routes/produto/$id'
import { Route as cartRoute } from './routes/carrinho/index'
import { Route as checkoutRoute } from './routes/checkout/index'
import { Route as successRoute } from './routes/checkout/sucesso'

const routeTree = rootRoute.addChildren([
  indexRoute,
  adminRoute,
  productRoute,
  cartRoute,
  checkoutRoute,
  successRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
```

- [ ] **Step 3: Verify `/admin` renders correctly**

Navigate to `http://localhost:5173/admin`. Expected:
- Dark background (`#0F0F0F`)
- Form fields are visible with white text
- Color picker changes `--cor-principal` in real time (open DevTools → Elements → `:root` to verify)
- "Ver Loja" link opens `/` in a new tab

- [ ] **Step 4: Commit**

```bash
git add src/routes/admin/index.tsx src/router.ts
git commit -m "feat: implement /admin page with live StoreConfig form"
```

---

### Task 15: / (Homepage) Page

**Files:**
- Modify: `ecommerce-micro/src/routes/index.tsx`

- [ ] **Step 1: Implement the Homepage**

Replace `src/routes/index.tsx`:

```tsx
// src/routes/index.tsx
import { createRoute } from '@tanstack/react-router'
import { Route as rootRoute } from './__root'
import { useState, useCallback } from 'react'
import { StoreHeader } from '../components/layout/StoreHeader'
import { HeroBanner } from '../components/HeroBanner'
import { ProductGrid } from '../components/ProductGrid'
import { FilterBar } from '../components/FilterBar'
import { useProductsStore } from '../stores/useProductsStore'
import type { Product } from '../types'

function HomePage() {
  const { products, categories } = useProductsStore()
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)

  const handleFilter = useCallback((filtered: Product[]) => {
    setFilteredProducts(filtered)
  }, [])

  const featured = products.slice(0, 8)

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />
      <HeroBanner />

      {/* Featured section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
            Destaques
          </h2>
          <span className="text-sm text-text-secondary">{featured.length} produtos</span>
        </div>
        <ProductGrid products={featured} />
      </section>

      {/* Full catalog with filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="border-t border-border pt-12">
          <h2 className="text-2xl font-semibold tracking-tight text-text-primary mb-8">
            Catálogo Completo
          </h2>

          <div className="space-y-8">
            <FilterBar
              categories={categories}
              products={products}
              onFilter={handleFilter}
            />
            <ProductGrid products={filteredProducts} />
          </div>
        </div>
      </section>
    </div>
  )
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})
```

- [ ] **Step 2: Verify homepage**

Navigate to `http://localhost:5173/`. Expected:
- Hero banner fills top of page
- 8 featured products in a grid below
- Full catalog with FilterBar below that
- Filtering by category, price, or name updates the catalog in real time

- [ ] **Step 3: Commit**

```bash
git add src/routes/index.tsx
git commit -m "feat: implement homepage with hero, featured grid, and filtered catalog"
```

---

### Task 16: /produto/:id Page

**Files:**
- Modify: `ecommerce-micro/src/routes/produto/$id.tsx`

- [ ] **Step 1: Implement the Product Detail page**

Replace `src/routes/produto/$id.tsx`:

```tsx
// src/routes/produto/$id.tsx
import { createRoute, Link } from '@tanstack/react-router'
import { Route as rootRoute } from '../__root'
import { useState } from 'react'
import { Star, ChevronLeft, ShoppingCart, Check } from 'lucide-react'
import { StoreHeader } from '../../components/layout/StoreHeader'
import { useProductsStore } from '../../stores/useProductsStore'
import { useCartStore } from '../../stores/useCartStore'

function ProductPage() {
  const { id } = Route.useParams()
  const getById = useProductsStore((s) => s.getById)
  const addItem = useCartStore((s) => s.addItem)
  const product = getById(Number(id))

  const [added, setAdded] = useState(false)

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-text-secondary">Produto não encontrado.</p>
      </div>
    )
  }

  function handleAddToCart() {
    if (!product) return
    addItem({
      productId: product.id,
      title: product.title,
      image: product.image,
      price: product.price,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar ao catálogo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image */}
          <div className="aspect-square bg-surface rounded-2xl flex items-center justify-center p-12">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-contain mix-blend-multiply"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col gap-6 py-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-text-secondary font-medium">
                {product.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary mt-2 leading-tight">
                {product.title}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.round(product.rating.rate) ? 'fill-current text-amber-400' : 'text-border'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-text-secondary">
                {product.rating.rate} ({product.rating.count} avaliações)
              </span>
            </div>

            <p className="text-4xl font-semibold tracking-tight text-text-primary">
              ${product.price.toFixed(2)}
            </p>

            <p className="text-text-secondary leading-relaxed text-sm">
              {product.description}
            </p>

            <button
              onClick={handleAddToCart}
              className="mt-auto flex items-center justify-center gap-2 w-full py-4 rounded-xl accent-bg text-white font-medium hover:opacity-80 transition-all"
            >
              {added ? (
                <>
                  <Check className="w-5 h-5" />
                  Adicionado!
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  Adicionar ao Carrinho
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/produto/$id',
  component: ProductPage,
})
```

- [ ] **Step 2: Verify product page**

Navigate to `http://localhost:5173/produto/1`. Expected:
- Product image in large square container (no distortion)
- Star ratings rendered correctly
- "Adicionar ao Carrinho" button changes to "Adicionado!" briefly after click
- Cart badge in header increments

- [ ] **Step 3: Commit**

```bash
git add src/routes/produto/\$id.tsx
git commit -m "feat: implement /produto/:id page with add-to-cart feedback"
```

---

### Task 17: /carrinho Page

**Files:**
- Modify: `ecommerce-micro/src/routes/carrinho/index.tsx`

- [ ] **Step 1: Implement the Cart page**

Replace `src/routes/carrinho/index.tsx`:

```tsx
// src/routes/carrinho/index.tsx
import { createRoute, Link } from '@tanstack/react-router'
import { Route as rootRoute } from '../__root'
import { ChevronLeft, ShoppingBag } from 'lucide-react'
import { StoreHeader } from '../../components/layout/StoreHeader'
import { CartItemRow } from '../../components/CartItem'
import { OrderSummary } from '../../components/OrderSummary'
import { useCartStore } from '../../stores/useCartStore'

function CartPage() {
  const items = useCartStore((s) => s.items)

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Continuar comprando
        </Link>

        <h1 className="text-2xl font-semibold tracking-tight text-text-primary mb-8">
          Carrinho de Compras
        </h1>

        {items.length === 0 ? (
          <div className="py-24 flex flex-col items-center gap-4 text-text-secondary">
            <ShoppingBag className="w-12 h-12 opacity-30" />
            <p>Seu carrinho está vazio.</p>
            <Link
              to="/"
              className="text-sm font-medium accent-text hover:opacity-70 transition-opacity"
            >
              Explorar produtos →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Item list */}
            <div className="lg:col-span-2">
              {items.map((item) => (
                <CartItemRow key={item.productId} item={item} />
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <OrderSummary />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/carrinho',
  component: CartPage,
})
```

- [ ] **Step 2: Verify cart page**

Navigate to `http://localhost:5173/carrinho`. Expected:
- Empty state shows bag icon + "Explorar produtos" link
- After adding items: items list shows with quantity controls
- `+` / `-` buttons update quantity; `–` at 1 removes the item
- "Finalizar Pedido" navigates to `/checkout`

- [ ] **Step 3: Commit**

```bash
git add src/routes/carrinho/index.tsx
git commit -m "feat: implement /carrinho page with item list and order summary"
```

---

### Task 18: /checkout Page

**Files:**
- Modify: `ecommerce-micro/src/routes/checkout/index.tsx`

- [ ] **Step 1: Implement the Checkout page**

Replace `src/routes/checkout/index.tsx`:

```tsx
// src/routes/checkout/index.tsx
import { createRoute, useNavigate } from '@tanstack/react-router'
import { Route as rootRoute } from '../__root'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { StoreHeader } from '../../components/layout/StoreHeader'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { useCartStore } from '../../stores/useCartStore'

// In-memory order store (not persisted — cleared after success)
let pendingOrder: { orderId: string; items: ReturnType<typeof useCartStore.getState>['items']; total: number; createdAt: Date } | null = null

export function getPendingOrder() {
  return pendingOrder
}

function CheckoutPage() {
  const navigate = useNavigate()
  const { items, total, clearCart } = useCartStore()
  const [form, setForm] = useState({ nome: '', endereco: '', cartao: '' })

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    pendingOrder = {
      orderId: uuidv4(),
      items: [...items],
      total: total(),
      createdAt: new Date(),
    }
    clearCart()
    navigate({ to: '/checkout/sucesso' })
  }

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />

      <main className="max-w-lg mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary mb-8">
          Finalizar Pedido
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-text-secondary font-medium">
              Dados de entrega
            </h2>

            <div className="space-y-2">
              <Label htmlFor="nome">Nome completo</Label>
              <Input
                id="nome"
                name="nome"
                required
                value={form.nome}
                onChange={handleChange}
                placeholder="João Silva"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                name="endereco"
                required
                value={form.endereco}
                onChange={handleChange}
                placeholder="Rua das Flores, 123 — São Paulo"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-text-secondary font-medium">
              Pagamento
            </h2>

            <div className="space-y-2">
              <Label htmlFor="cartao">Número do cartão</Label>
              <Input
                id="cartao"
                name="cartao"
                required
                value={form.cartao}
                onChange={handleChange}
                placeholder="0000 0000 0000 0000"
                maxLength={19}
              />
            </div>
          </div>

          {/* Order preview */}
          <div className="bg-surface rounded-xl p-4 space-y-2">
            <p className="text-xs uppercase tracking-widest text-text-secondary font-medium">
              Resumo
            </p>
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span className="text-text-secondary line-clamp-1 flex-1 mr-4">
                  {item.title} × {item.quantity}
                </span>
                <span className="font-medium text-text-primary flex-shrink-0">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="pt-2 border-t border-border flex justify-between font-semibold text-sm">
              <span>Total</span>
              <span>${total().toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl accent-bg text-white font-medium hover:opacity-80 transition-opacity"
          >
            Confirmar Pedido
          </button>
        </form>
      </main>
    </div>
  )
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: CheckoutPage,
})
```

- [ ] **Step 2: Verify checkout page**

Navigate to `http://localhost:5173/checkout` (with items in cart). Expected:
- Form renders with three fields
- All fields are required (HTML5 validation)
- Submitting navigates to `/checkout/sucesso`
- Cart is cleared after submission

- [ ] **Step 3: Commit**

```bash
git add src/routes/checkout/index.tsx
git commit -m "feat: implement /checkout fake form that creates in-memory order"
```

---

### Task 19: /checkout/sucesso Page

**Files:**
- Modify: `ecommerce-micro/src/routes/checkout/sucesso.tsx`

- [ ] **Step 1: Implement the Success page**

Replace `src/routes/checkout/sucesso.tsx`:

```tsx
// src/routes/checkout/sucesso.tsx
import { createRoute, Link } from '@tanstack/react-router'
import { Route as rootRoute } from '../__root'
import { StoreHeader } from '../../components/layout/StoreHeader'
import { SuccessCheckmark } from '../../components/SuccessCheckmark'
import { getPendingOrder } from './index'

function SuccessPage() {
  const order = getPendingOrder()

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />

      <main className="max-w-lg mx-auto px-4 sm:px-6 py-16 text-center">
        {/* Animated checkmark */}
        <div className="accent-text flex justify-center mb-8">
          <SuccessCheckmark />
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-text-primary mb-2">
          Pedido confirmado!
        </h1>
        <p className="text-text-secondary mb-8">
          Obrigado pela sua compra. Você receberá um e-mail de confirmação em breve.
        </p>

        {order && (
          <div className="bg-surface rounded-2xl p-6 text-left space-y-4 mb-8">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Número do pedido</span>
              <span className="font-mono text-xs text-text-primary font-medium break-all">
                #{order.orderId.split('-')[0].toUpperCase()}
              </span>
            </div>

            <div className="border-t border-border pt-4 space-y-2">
              {order.items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="text-text-secondary line-clamp-1 flex-1 mr-4">
                    {item.title} × {item.quantity}
                  </span>
                  <span className="text-text-primary font-medium flex-shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-3 flex justify-between font-semibold text-sm">
              <span>Total pago</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        )}

        <Link
          to="/"
          className="inline-block px-8 py-3 rounded-xl accent-bg text-white font-medium hover:opacity-80 transition-opacity"
        >
          Continuar comprando
        </Link>
      </main>
    </div>
  )
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout/sucesso',
  component: SuccessPage,
})
```

- [ ] **Step 2: Verify success page**

Complete the full checkout flow: `/` → add to cart → `/carrinho` → `/checkout` → submit form → lands on `/checkout/sucesso`. Expected:
- Animated checkmark draws in (circle first, then tick)
- Order number displayed (short UUID prefix)
- Items list matches what was in cart
- Cart badge in header shows 0
- "Continuar comprando" returns to `/`

- [ ] **Step 3: Commit**

```bash
git add src/routes/checkout/sucesso.tsx
git commit -m "feat: implement /checkout/sucesso with animated checkmark and order summary"
```

---

## Wave 6 — Polish + Verification

### Task 20: Responsive Audit + Final Smoke Test

**Files:**
- None new — this task is verification only.

- [ ] **Step 1: Smoke test at 375px (mobile)**

In Chrome DevTools, set viewport to iPhone SE (375 × 667). Walk through the full demo flow:

| Page | Check |
|------|-------|
| `/admin` | Form fields stack vertically, all readable |
| `/` | Hero fills height, product grid is 2 columns |
| `/produto/1` | Image + details stack vertically |
| `/carrinho` | Items and summary stack vertically |
| `/checkout` | Form is full-width, no overflow |
| `/checkout/sucesso` | Centered, checkmark visible, order card fits |

- [ ] **Step 2: Smoke test at 1280px (desktop)**

Set viewport to 1280px. Walk through the same flow. Confirm:
- Product grid is 4 columns on homepage
- Product detail has side-by-side layout (image left, details right)
- Cart has 2-col layout (items left, summary right)
- No text overflows or broken layouts

- [ ] **Step 3: Check browser console for errors**

Open DevTools console and walk through every page interaction. Expected: **zero red errors** in normal use.

- [ ] **Step 4: Verify full demo roteiro**

Run the exact demo script from the spec:

> Abre `/admin` → muda nome da loja para "TechShop" → troca cor principal para azul → informa URL de banner → edita título e subtítulo do banner → clica "Ver Loja" → loja abre com identidade nova → filtra por "electronics" → abre produto → adiciona ao carrinho → vai ao carrinho → faz checkout → tela de sucesso com animação. **Fim.**

Elapsed time target: under 2 minutes.

- [ ] **Step 5: Verify localStorage persistence**

After configuring admin and adding items to cart:
1. Hard-reload the page (`Ctrl+Shift+R`)
2. Navigate back to `/admin` — config should be unchanged
3. Navigate to `/carrinho` — cart should still have items

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "chore: final polish and smoke test pass — MVP ready for demo"
```

---

## Appendix: Key Design Decisions

**Why `createRoute` in page files (not `createFileRoute`):** TanStack Router v1's file-based routing with `createFileRoute` requires the Vite plugin (`@tanstack/router-plugin`). To avoid extra toolchain complexity for an MVP, we use code-based `createRoute` in each page file and manually register routes in `src/router.ts`. This is fully supported and simpler to debug.

**Why in-memory order (not Zustand):** The order only needs to survive the `/checkout` → `/checkout/sucesso` navigation. No persistence needed — the spec explicitly excludes an order history panel. A module-level variable in `checkout/index.tsx` is the simplest correct solution.

**Why `mix-blend-multiply` on product images:** FakeStore API images have white backgrounds. `mix-blend-multiply` on a white/light container makes them appear transparent — a common e-commerce technique that avoids ugly white squares in the product grid.

**CSS variable for accent color:** Rather than passing the accent color as a prop through every component, we write it to `--cor-principal` on `:root` in `useAccentColor`. Components use `accent-bg`, `accent-text`, `accent-border` utility classes (defined in `index.css`) or `style={{ color: 'var(--cor-principal)' }}` inline. This is the minimal approach that makes the whole UI respond to admin changes instantly.
