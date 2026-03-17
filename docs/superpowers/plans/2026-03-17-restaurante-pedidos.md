# restaurante-pedidos Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished, demo-ready restaurant ordering system MVP called "Noir" with a client-facing menu/ordering flow and a kitchen Kanban dashboard, fully mocked with no backend.

**Architecture:** Next.js 14 App Router with a single `AppContext` holding all shared state (cart, orders, activeView). Client components handle all interactivity. No server actions or API routes — data lives in `src/data/` as static TypeScript files and order state lives in Context memory only.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, React Context API, Google Fonts via `next/font` (Playfair Display + Inter), Unsplash static URLs.

---

## Scope Check

The spec covers two distinct UI surfaces (Client view and Kitchen view) but they share one context and one codebase with no independent deployment. This is a single plan — no split needed.

---

## File Structure

```
restaurante-pedidos/
├── package.json
├── tsconfig.json
├── tailwind.config.ts          # Noir color tokens + font families
├── next.config.ts              # Allow images from unsplash.com
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout: fonts, AppProvider, Header
│   │   ├── globals.css         # Tailwind base + @layer utilities if needed
│   │   ├── page.tsx            # Home / Cardápio (client component)
│   │   ├── cart/
│   │   │   └── page.tsx        # Carrinho page (client component)
│   │   ├── confirmation/
│   │   │   └── page.tsx        # Confirmação de pedido (client component)
│   │   ├── status/
│   │   │   └── page.tsx        # Acompanhamento de status (client component)
│   │   └── kitchen/
│   │       └── page.tsx        # Dashboard Kanban da cozinha (client component)
│   ├── components/
│   │   ├── Header.tsx          # Switcher Cliente/Cozinha, ícone carrinho + contador
│   │   ├── HeroSection.tsx     # Hero full-screen com foto + tipografia Playfair
│   │   ├── CategoryTabs.tsx    # Tabs de filtro por categoria
│   │   ├── DishGrid.tsx        # Grid de cards de pratos
│   │   ├── DishCard.tsx        # Card individual de prato
│   │   ├── DishModal.tsx       # Modal de detalhe do prato (AnimatePresence)
│   │   ├── CartSheet.tsx       # Sheet lateral do carrinho (slide-in)
│   │   ├── CartItem.tsx        # Linha de item no carrinho com qtd editável
│   │   ├── OrderSummary.tsx    # Subtotal + taxa 10% + total (reutilizado em cart e status)
│   │   ├── ConfirmationView.tsx # Animação de check + número do pedido
│   │   ├── StatusTracker.tsx   # Barra de 4 etapas animada
│   │   ├── KanbanBoard.tsx     # 3 colunas do dashboard cozinha
│   │   ├── KanbanColumn.tsx    # Uma coluna do Kanban
│   │   ├── KanbanCard.tsx      # Card de pedido no Kanban
│   │   └── OrderDetailModal.tsx # Modal de detalhe de pedido na cozinha
│   ├── context/
│   │   └── AppContext.tsx      # AppProvider + useApp hook + todas as actions
│   ├── data/
│   │   ├── menu.ts             # 12 pratos mockados (3 por categoria)
│   │   └── categories.ts       # 4 categorias com id e label
│   └── types/
│       └── index.ts            # Dish, CartItem, Order, OrderStatus, AppState
```

---

## Parallel Execution Map

Tasks 1–3 must run sequentially (foundation). After Task 3, Tasks 4–6 can run in parallel. Task 7 depends on Tasks 4 and 5. Task 8 depends on Tasks 4 and 6. Tasks 9–10 depend on all prior tasks.

```
[Task 1: Project Setup]
        ↓
[Task 2: Types + Mock Data]
        ↓
[Task 3: AppContext]
        ↓
    ┌───┼───┐
[T4]  [T5]  [T6]      ← parallel
  ↓    ↓     ↓
[T7]  [T8]          ← T7 needs T4+T5, T8 needs T4+T6
        ↓
[Task 9: Kitchen View]
        ↓
[Task 10: Polish + Responsive]
```

---

## Task 1: Project Setup

**Files:**
- Create: `restaurante-pedidos/package.json`
- Create: `restaurante-pedidos/tsconfig.json`
- Create: `restaurante-pedidos/tailwind.config.ts`
- Create: `restaurante-pedidos/next.config.ts`
- Create: `restaurante-pedidos/src/app/globals.css`
- Create: `restaurante-pedidos/src/app/layout.tsx`

- [ ] **Step 1.1: Scaffold Next.js project**

Run from `C:\Users\leona\Documents\Backup\Portifolio ARCSYS`:

```bash
cd "C:\Users\leona\Documents\Backup\Portifolio ARCSYS" && npx create-next-app@14 restaurante-pedidos --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Expected: Project created with `src/app/` structure, Tailwind already wired.

- [ ] **Step 1.2: Install Framer Motion**

```bash
cd "C:\Users\leona\Documents\Backup\Portifolio ARCSYS\restaurante-pedidos" && npm install framer-motion
```

Expected: `framer-motion` appears in `package.json` dependencies.

- [ ] **Step 1.3: Configure Tailwind with Noir color tokens**

Replace the contents of `restaurante-pedidos/tailwind.config.ts` with:

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'noir-black': '#0A0A0A',
        'noir-white': '#F5F4F0',
        'noir-cream': '#E8E4DC',
        'noir-gold': '#C9A96E',
        'noir-gray': '#6B6B6B',
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'Georgia', 'serif'],
        inter: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 1.4: Configure next.config.ts for Unsplash images**

Replace `restaurante-pedidos/next.config.ts`:

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

export default nextConfig
```

- [ ] **Step 1.5: Set up root layout with fonts and globals**

Replace `restaurante-pedidos/src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: #F5F4F0;
  color: #0A0A0A;
  font-family: var(--font-inter), system-ui, sans-serif;
}
```

Replace `restaurante-pedidos/src/app/layout.tsx`:

```tsx
import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Noir — Fine Dining',
  description: 'Sistema de pedidos do restaurante Noir',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 1.6: Verify dev server starts**

```bash
cd "C:\Users\leona\Documents\Backup\Portifolio ARCSYS\restaurante-pedidos" && npm run dev
```

Expected: Server starts on `http://localhost:3000` with default Next.js page. No TypeScript or Tailwind errors.

- [ ] **Step 1.7: Commit**

```bash
cd "C:\Users\leona\Documents\Backup\Portifolio ARCSYS\restaurante-pedidos" && git add . && git commit -m "chore: scaffold Next.js 14 project with Tailwind Noir tokens and Framer Motion"
```

---

## Task 2: Types and Mock Data

**Files:**
- Create: `restaurante-pedidos/src/types/index.ts`
- Create: `restaurante-pedidos/src/data/categories.ts`
- Create: `restaurante-pedidos/src/data/menu.ts`

> This task has no external dependencies — can start as soon as Task 1 is done.

- [ ] **Step 2.1: Define all TypeScript types**

Create `restaurante-pedidos/src/types/index.ts`:

```ts
export type Category = 'starters' | 'mains' | 'desserts' | 'drinks'

export interface Dish {
  id: string
  name: string
  description: string
  price: number
  category: Category
  imageUrl: string
  ingredients: string[]
}

export type OrderStatus = 'received' | 'preparing' | 'ready' | 'delivered'

export interface CartItem {
  dish: Dish
  quantity: number
}

export interface Order {
  id: string
  items: CartItem[]
  status: OrderStatus
  createdAt: Date
  totalAmount: number
}

export interface AppState {
  activeView: 'client' | 'kitchen'
  cart: CartItem[]
  orders: Order[]
}
```

- [ ] **Step 2.2: Create categories data**

Create `restaurante-pedidos/src/data/categories.ts`:

```ts
import type { Category } from '@/types'

export const categories: { id: Category; label: string }[] = [
  { id: 'starters', label: 'Entradas' },
  { id: 'mains', label: 'Pratos Principais' },
  { id: 'desserts', label: 'Sobremesas' },
  { id: 'drinks', label: 'Bebidas' },
]
```

- [ ] **Step 2.3: Create menu mock data with 12 dishes**

Create `restaurante-pedidos/src/data/menu.ts`:

```ts
import type { Dish } from '@/types'

export const menu: Dish[] = [
  // Entradas
  {
    id: 'starter-01',
    name: 'Carpaccio di Manzo',
    description: 'Fatias finíssimas de filé mignon cru, alcaparras, rúcula selvagem e lascas de parmesão envelhecido.',
    price: 68.00,
    category: 'starters',
    imageUrl: 'https://images.unsplash.com/photo-1609167830220-7164aa360951?w=800',
    ingredients: ['Filé mignon', 'Alcaparras', 'Rúcula selvagem', 'Parmesão 24 meses', 'Azeite extravirgem', 'Limão siciliano'],
  },
  {
    id: 'starter-02',
    name: 'Foie Gras Poêlé',
    description: 'Fígado de pato salteado na frigideira, geleia de figo artesanal e brioche tostado.',
    price: 98.00,
    category: 'starters',
    imageUrl: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800',
    ingredients: ['Foie gras de canard', 'Geleia de figo', 'Brioche', 'Flor de sal', 'Pimenta rosa'],
  },
  {
    id: 'starter-03',
    name: 'Tartare de Atum',
    description: 'Atum bluefin picado na faca, abacate, gergelim negro e molho ponzu cítrico.',
    price: 82.00,
    category: 'starters',
    imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
    ingredients: ['Atum bluefin', 'Abacate', 'Gergelim negro', 'Ponzu', 'Cebolinha', 'Gengibre'],
  },
  // Pratos Principais
  {
    id: 'main-01',
    name: 'Entrecôte Noir',
    description: 'Corte nobre de 300g, manteiga de ervas finas, purê de batata trufado e jus de carne reduzido.',
    price: 148.00,
    category: 'mains',
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800',
    ingredients: ['Entrecôte 300g', 'Manteiga de ervas', 'Batata', 'Trufa negra', 'Jus de carne'],
  },
  {
    id: 'main-02',
    name: 'Salmão Noir',
    description: 'Filé de salmão selvagem ao miso branco, espuma de dashi e legumes da estação grelhados.',
    price: 128.00,
    category: 'mains',
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800',
    ingredients: ['Salmão selvagem 200g', 'Miso branco', 'Dashi', 'Aspargos', 'Cenoura baby', 'Gergelim'],
  },
  {
    id: 'main-03',
    name: 'Risotto al Tartufo',
    description: 'Arroz arbóreo cremoso, trufa negra raspada na hora, parmesão e manteiga de leitelho.',
    price: 118.00,
    category: 'mains',
    imageUrl: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800',
    ingredients: ['Arroz arbóreo', 'Trufa negra fresca', 'Parmesão 36 meses', 'Manteiga de leitelho', 'Vinho branco seco'],
  },
  // Sobremesas
  {
    id: 'dessert-01',
    name: 'Tarte Tatin de Pera',
    description: 'Tarte invertida de pera caramelizada no forno, sorvete de baunilha bourbon e caramelo fleur de sel.',
    price: 48.00,
    category: 'desserts',
    imageUrl: 'https://images.unsplash.com/photo-1488477304112-4944851de03d?w=800',
    ingredients: ['Pera Williams', 'Massa folhada artesanal', 'Caramelo', 'Baunilha bourbon', 'Fleur de sel'],
  },
  {
    id: 'dessert-02',
    name: 'Coulant de Chocolate',
    description: 'Bolinho de chocolate 70% com coração líquido, sorvete de avelã e farofa crocante de cacau.',
    price: 52.00,
    category: 'desserts',
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800',
    ingredients: ['Chocolate 70%', 'Manteiga', 'Ovos caipiras', 'Avelã', 'Cacau em pó'],
  },
  {
    id: 'dessert-03',
    name: 'Mille-Feuille de Maracujá',
    description: 'Camadas de massa folhada, creme pâtissière de maracujá e cobertura de açúcar dourado.',
    price: 46.00,
    category: 'desserts',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    ingredients: ['Massa folhada', 'Maracujá', 'Creme de leite', 'Gemas', 'Açúcar demerara'],
  },
  // Bebidas
  {
    id: 'drink-01',
    name: 'Água com Gás Perrier',
    description: 'Água mineral gasosa natural da fonte francesa, servida gelada com casca de limão.',
    price: 18.00,
    category: 'drinks',
    imageUrl: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800',
    ingredients: ['Água mineral gasosa', 'Limão siciliano'],
  },
  {
    id: 'drink-02',
    name: 'Sommelier\'s Selection',
    description: 'Taça de vinho tinto selecionada pelo sommelier — Malbec argentino 2021 ou Cabernet chileno 2020.',
    price: 58.00,
    category: 'drinks',
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800',
    ingredients: ['Vinho tinto', 'Malbec / Cabernet'],
  },
  {
    id: 'drink-03',
    name: 'Espresso Noir',
    description: 'Blend exclusivo da casa com notas de cacau amargo e castanha, extração dupla.',
    price: 22.00,
    category: 'drinks',
    imageUrl: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=800',
    ingredients: ['Blend arábica exclusivo', 'Água filtrada'],
  },
]
```

- [ ] **Step 2.4: Verify TypeScript compiles**

```bash
cd "C:\Users\leona\Documents\Backup\Portifolio ARCSYS\restaurante-pedidos" && npx tsc --noEmit
```

Expected: No errors. If you see errors about missing modules, run `npm install` first.

- [ ] **Step 2.5: Commit**

```bash
cd "C:\Users\leona\Documents\Backup\Portifolio ARCSYS\restaurante-pedidos" && git add src/types src/data && git commit -m "feat: add TypeScript types, 12 mock dishes and categories"
```

---

## Task 3: AppContext — Shared State and Actions

**Files:**
- Create: `restaurante-pedidos/src/context/AppContext.tsx`
- Modify: `restaurante-pedidos/src/app/layout.tsx`

> Depends on Task 2. After this task, Tasks 4, 5, and 6 can start in parallel.

- [ ] **Step 3.1: Create AppContext with all actions**

Create `restaurante-pedidos/src/context/AppContext.tsx`:

```tsx
'use client'

import React, { createContext, useContext, useReducer, useCallback } from 'react'
import type { AppState, CartItem, Dish, Order, OrderStatus } from '@/types'

type Action =
  | { type: 'SET_VIEW'; payload: 'client' | 'kitchen' }
  | { type: 'ADD_TO_CART'; payload: { dish: Dish; quantity: number } }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { dishId: string; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { dishId: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'CONFIRM_ORDER' }
  | { type: 'ADVANCE_ORDER_STATUS'; payload: { orderId: string } }

const initialState: AppState = {
  activeView: 'client',
  cart: [],
  orders: [],
}

const STATUS_PROGRESSION: OrderStatus[] = ['received', 'preparing', 'ready', 'delivered']

let orderCounter = 0

function nextStatus(current: OrderStatus): OrderStatus {
  const index = STATUS_PROGRESSION.indexOf(current)
  if (index < STATUS_PROGRESSION.length - 1) {
    return STATUS_PROGRESSION[index + 1]
  }
  return current
}

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, activeView: action.payload }

    case 'ADD_TO_CART': {
      const existing = state.cart.find(item => item.dish.id === action.payload.dish.id)
      if (existing) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.dish.id === action.payload.dish.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        }
      }
      return {
        ...state,
        cart: [...state.cart, { dish: action.payload.dish, quantity: action.payload.quantity }],
      }
    }

    case 'UPDATE_CART_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          cart: state.cart.filter(item => item.dish.id !== action.payload.dishId),
        }
      }
      return {
        ...state,
        cart: state.cart.map(item =>
          item.dish.id === action.payload.dishId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      }
    }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.dish.id !== action.payload.dishId),
      }

    case 'CLEAR_CART':
      return { ...state, cart: [] }

    case 'CONFIRM_ORDER': {
      if (state.cart.length === 0) return state
      orderCounter += 1
      const subtotal = state.cart.reduce(
        (sum, item) => sum + item.dish.price * item.quantity,
        0
      )
      const totalAmount = subtotal * 1.1
      const newOrder: Order = {
        id: `#${String(orderCounter).padStart(4, '0')}`,
        items: [...state.cart],
        status: 'received',
        createdAt: new Date(),
        totalAmount,
      }
      return {
        ...state,
        cart: [],
        orders: [...state.orders, newOrder],
      }
    }

    case 'ADVANCE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.orderId
            ? { ...order, status: nextStatus(order.status) }
            : order
        ),
      }

    default:
      return state
  }
}

interface AppContextValue extends AppState {
  setView: (view: 'client' | 'kitchen') => void
  addToCart: (dish: Dish, quantity: number) => void
  updateCartQuantity: (dishId: string, quantity: number) => void
  removeFromCart: (dishId: string) => void
  clearCart: () => void
  confirmOrder: () => Order | null
  advanceOrderStatus: (orderId: string) => void
  cartTotal: number
  cartItemCount: number
  latestOrder: Order | null
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const setView = useCallback((view: 'client' | 'kitchen') => {
    dispatch({ type: 'SET_VIEW', payload: view })
  }, [])

  const addToCart = useCallback((dish: Dish, quantity: number) => {
    dispatch({ type: 'ADD_TO_CART', payload: { dish, quantity } })
  }, [])

  const updateCartQuantity = useCallback((dishId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { dishId, quantity } })
  }, [])

  const removeFromCart = useCallback((dishId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { dishId } })
  }, [])

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' })
  }, [])

  const confirmOrder = useCallback((): Order | null => {
    if (state.cart.length === 0) return null
    dispatch({ type: 'CONFIRM_ORDER' })
    // Return what the next order will look like (counter incremented inside reducer)
    return null
  }, [state.cart])

  const advanceOrderStatus = useCallback((orderId: string) => {
    dispatch({ type: 'ADVANCE_ORDER_STATUS', payload: { orderId } })
  }, [])

  const cartTotal = state.cart.reduce(
    (sum, item) => sum + item.dish.price * item.quantity,
    0
  )

  const cartItemCount = state.cart.reduce((sum, item) => sum + item.quantity, 0)

  const latestOrder = state.orders.length > 0
    ? state.orders[state.orders.length - 1]
    : null

  return (
    <AppContext.Provider
      value={{
        ...state,
        setView,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        confirmOrder,
        advanceOrderStatus,
        cartTotal,
        cartItemCount,
        latestOrder,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
```

- [ ] **Step 3.2: Wrap layout with AppProvider**

Modify `restaurante-pedidos/src/app/layout.tsx` — add AppProvider import and wrap children:

```tsx
import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { AppProvider } from '@/context/AppContext'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Noir — Fine Dining',
  description: 'Sistema de pedidos do restaurante Noir',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 3.3: Verify TypeScript**

```bash
cd "C:\Users\leona\Documents\Backup\Portifolio ARCSYS\restaurante-pedidos" && npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3.4: Commit**

```bash
cd "C:\Users\leona\Documents\Backup\Portifolio ARCSYS\restaurante-pedidos" && git add src/context src/app/layout.tsx && git commit -m "feat: add AppContext with cart, orders and view switching"
```

---

## Task 4: Header Component

**Files:**
- Create: `restaurante-pedidos/src/components/Header.tsx`
- Modify: `restaurante-pedidos/src/app/layout.tsx`

> Depends on Task 3. Can run in parallel with Tasks 5 and 6.

- [ ] **Step 4.1: Create Header component**

Create `restaurante-pedidos/src/components/Header.tsx`:

```tsx
'use client'

import { useApp } from '@/context/AppContext'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function Header() {
  const { activeView, setView, cartItemCount } = useApp()
  const router = useRouter()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-noir-black/95 backdrop-blur-sm border-b border-noir-gray/20">
      {/* Logo */}
      <button
        onClick={() => { setView('client'); router.push('/') }}
        className="font-playfair text-2xl text-noir-white tracking-widest hover:text-noir-gold transition-colors"
      >
        NOIR
      </button>

      {/* Persona Switcher */}
      <div className="flex items-center gap-1 bg-noir-white/10 rounded-full p-1">
        <button
          onClick={() => { setView('client'); router.push('/') }}
          className={`px-5 py-1.5 rounded-full text-sm font-inter font-medium transition-all ${
            activeView === 'client'
              ? 'bg-noir-gold text-noir-black'
              : 'text-noir-white hover:text-noir-gold'
          }`}
        >
          Cliente
        </button>
        <button
          onClick={() => { setView('kitchen'); router.push('/kitchen') }}
          className={`px-5 py-1.5 rounded-full text-sm font-inter font-medium transition-all ${
            activeView === 'kitchen'
              ? 'bg-noir-gold text-noir-black'
              : 'text-noir-white hover:text-noir-gold'
          }`}
        >
          Cozinha
        </button>
      </div>

      {/* Cart Button — only visible in client view */}
      {activeView === 'client' && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/cart')}
          className="relative flex items-center gap-2 text-noir-white hover:text-noir-gold transition-colors"
          aria-label={`Carrinho com ${cartItemCount} itens`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          {cartItemCount > 0 && (
            <motion.span
              key={cartItemCount}
              initial={{ scale: 0.6 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 w-5 h-5 bg-noir-gold text-noir-black text-xs font-bold rounded-full flex items-center justify-center"
            >
              {cartItemCount}
            </motion.span>
          )}
        </motion.button>
      )}

      {/* Spacer when kitchen view (no cart icon) */}
      {activeView === 'kitchen' && <div className="w-24" />}
    </header>
  )
}
```

- [ ] **Step 4.2: Add Header to layout**

Modify `restaurante-pedidos/src/app/layout.tsx` to import and render Header:

```tsx
import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { AppProvider } from '@/context/AppContext'
import Header from '@/components/Header'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Noir — Fine Dining',
  description: 'Sistema de pedidos do restaurante Noir',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-noir-white min-h-screen">
        <AppProvider>
          <Header />
          <main className="pt-16">
            {children}
          </main>
        </AppProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 4.3: Verify server renders without error**

```bash
cd "C:\Users\leona\Documents\Backup\Portifolio ARCSYS\restaurante-pedidos" && npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 4.4: Commit**

```bash
cd "C:\Users\leona\Documents\Backup\Portifolio ARCSYS\restaurante-pedidos" && git add src/components/Header.tsx src/app/layout.tsx && git commit -m "feat: add Header with persona switcher and cart icon"
```

---

## Task 5: Home Page — Hero, Category Tabs, Dish Grid, Dish Modal

**Files:**
- Create: `restaurante-pedidos/src/components/HeroSection.tsx`
- Create: `restaurante-pedidos/src/components/CategoryTabs.tsx`
- Create: `restaurante-pedidos/src/components/DishCard.tsx`
- Create: `restaurante-pedidos/src/components/DishGrid.tsx`
- Create: `restaurante-pedidos/src/components/DishModal.tsx`
- Modify: `restaurante-pedidos/src/app/page.tsx`

> Depends on Task 3. Can run in parallel with Tasks 4 and 6.

- [ ] **Step 5.1: Create HeroSection**

Create `restaurante-pedidos/src/components/HeroSection.tsx`:

```tsx
import Image from 'next/image'

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-noir-black">
      <Image
        src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600"
        alt="Restaurante Noir"
        fill
        className="object-cover opacity-40"
        priority
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
        <p className="font-inter text-noir-gold text-sm tracking-[0.4em] uppercase mb-6">
          Fine Dining Experience
        </p>
        <h1 className="font-playfair text-[80px] leading-none text-noir-white mb-6 tracking-tight">
          NOIR
        </h1>
        <p className="font-inter text-noir-white/70 text-lg max-w-md leading-relaxed">
          Alta gastronomia em cada detalhe. Ingredientes selecionados, técnica impecável, experiência inesquecível.
        </p>
        <a
          href="#menu"
          className="mt-10 inline-flex items-center gap-2 border border-noir-gold text-noir-gold font-inter text-sm tracking-widest uppercase px-8 py-3 hover:bg-noir-gold hover:text-noir-black transition-all"
        >
          Ver Cardápio
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </a>
      </div>
    </section>
  )
}
```

- [ ] **Step 5.2: Create CategoryTabs**

Create `restaurante-pedidos/src/components/CategoryTabs.tsx`:

```tsx
'use client'

import { categories } from '@/data/categories'
import type { Category } from '@/types'

interface CategoryTabsProps {
  active: Category | 'all'
  onChange: (cat: Category | 'all') => void
}

export default function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  const allCategories = [{ id: 'all' as const, label: 'Todos' }, ...categories]

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {allCategories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`whitespace-nowrap px-6 py-2.5 font-inter text-sm font-medium transition-all border ${
            active === cat.id
              ? 'bg-noir-black text-noir-gold border-noir-black'
              : 'bg-transparent text-noir-gray border-noir-cream hover:border-noir-gray hover:text-noir-black'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 5.3: Create DishCard**

Create `restaurante-pedidos/src/components/DishCard.tsx`:

```tsx
'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Dish } from '@/types'

interface DishCardProps {
  dish: Dish
  onClick: (dish: Dish) => void
}

export default function DishCard({ dish, onClick }: DishCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={() => onClick(dish)}
      className="bg-noir-white border border-noir-cream cursor-pointer group overflow-hidden"
      style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
    >
      <div className="relative h-52 overflow-hidden">
        <Image
          src={dish.imageUrl}
          alt={dish.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <h3 className="font-playfair text-xl text-noir-black mb-1">{dish.name}</h3>
        <p className="font-inter text-sm text-noir-gray leading-snug line-clamp-1 mb-4">
          {dish.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-inter font-semibold text-noir-gold text-base">
            R$ {dish.price.toFixed(2).replace('.', ',')}
          </span>
          <span className="font-inter text-xs text-noir-gray/60 uppercase tracking-widest">
            Ver mais
          </span>
        </div>
      </div>
    </motion.div>
  )
}
```

- [ ] **Step 5.4: Create DishGrid**

Create `restaurante-pedidos/src/components/DishGrid.tsx`:

```tsx
'use client'

import { menu } from '@/data/menu'
import type { Category, Dish } from '@/types'
import DishCard from './DishCard'

interface DishGridProps {
  activeCategory: Category | 'all'
  onDishClick: (dish: Dish) => void
}

export default function DishGrid({ activeCategory, onDishClick }: DishGridProps) {
  const filtered = activeCategory === 'all'
    ? menu
    : menu.filter(dish => dish.category === activeCategory)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filtered.map(dish => (
        <DishCard key={dish.id} dish={dish} onClick={onDishClick} />
      ))}
    </div>
  )
}
```

- [ ] **Step 5.5: Create DishModal**

Create `restaurante-pedidos/src/components/DishModal.tsx`:

```tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '@/context/AppContext'
import type { Dish } from '@/types'

interface DishModalProps {
  dish: Dish | null
  onClose: () => void
}

export default function DishModal({ dish, onClose }: DishModalProps) {
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useApp()

  function handleAdd() {
    if (!dish) return
    addToCart(dish, quantity)
    onClose()
    setQuantity(1)
  }

  return (
    <AnimatePresence>
      {dish && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-noir-black/70 z-40 backdrop-blur-sm"
          />
          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-x-4 top-16 bottom-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[600px] md:h-auto bg-noir-white z-50 overflow-y-auto"
            style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center text-noir-gray hover:text-noir-black transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Photo */}
            <div className="relative h-64 md:h-72 w-full">
              <Image
                src={dish.imageUrl}
                alt={dish.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-8">
              <h2 className="font-playfair text-3xl text-noir-black mb-3">{dish.name}</h2>
              <p className="font-inter text-noir-gray leading-relaxed mb-6">{dish.description}</p>

              {/* Ingredients */}
              <div className="mb-8">
                <h3 className="font-inter text-xs uppercase tracking-widest text-noir-gray mb-3">Ingredientes</h3>
                <div className="flex flex-wrap gap-2">
                  {dish.ingredients.map(ing => (
                    <span
                      key={ing}
                      className="font-inter text-xs text-noir-black border border-noir-cream px-3 py-1"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quantity + CTA */}
              <div className="flex items-center justify-between mb-6">
                <span className="font-inter font-semibold text-noir-gold text-2xl">
                  R$ {dish.price.toFixed(2).replace('.', ',')}
                </span>
                <div className="flex items-center gap-4 border border-noir-cream px-4 py-2">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-6 h-6 flex items-center justify-center text-noir-black hover:text-noir-gold transition-colors font-inter text-lg"
                  >
                    −
                  </button>
                  <span className="font-inter text-noir-black w-4 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-6 h-6 flex items-center justify-center text-noir-black hover:text-noir-gold transition-colors font-inter text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAdd}
                className="w-full bg-noir-gold text-noir-black font-inter font-semibold py-4 text-sm uppercase tracking-widest hover:bg-noir-gold/90 transition-colors"
              >
                Adicionar ao pedido — R$ {(dish.price * quantity).toFixed(2).replace('.', ',')}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 5.6: Assemble Home page**

Replace `restaurante-pedidos/src/app/page.tsx`:

```tsx
'use client'

import { useState } from 'react'
import HeroSection from '@/components/HeroSection'
import CategoryTabs from '@/components/CategoryTabs'
import DishGrid from '@/components/DishGrid'
import DishModal from '@/components/DishModal'
import type { Category, Dish } from '@/types'

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all')
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null)

  return (
    <>
      <HeroSection />

      {/* Menu Section */}
      <section id="menu" className="bg-noir-white py-20 px-8 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="font-inter text-noir-gold text-xs tracking-[0.4em] uppercase mb-3">Cardápio</p>
            <h2 className="font-playfair text-5xl text-noir-black">Nossa Seleção</h2>
          </div>

          <div className="mb-10">
            <CategoryTabs active={activeCategory} onChange={setActiveCategory} />
          </div>

          <DishGrid activeCategory={activeCategory} onDishClick={setSelectedDish} />
        </div>
      </section>

      <DishModal dish={selectedDish} onClose={() => setSelectedDish(null)} />
    </>
  )
}
```

- [ ] **Step 5.7: Verify dev server and visual check**

```bash
cd "C:\Users\leona\Documents\Backup\Portifolio ARCSYS\restaurante-pedidos" && npx tsc --noEmit
```

Open `http://localhost:3000` in browser. Verify:
- Hero full-screen with Playfair Display "NOIR" at 80px
- Category tabs filter dishes
- Dish cards show photo, name, description, gold price
- Clicking a dish opens modal with animation
- Quantity selector works
- "Adicionar ao pedido" closes modal and updates cart count in header

- [ ] **Step 5.8: Commit**

```bash
cd "C:\Users\leona\Documents\Backup\Portifolio ARCSYS\restaurante-pedidos" && git add src/components/HeroSection.tsx src/components/CategoryTabs.tsx src/components/DishCard.tsx src/components/DishGrid.tsx src/components/DishModal.tsx src/app/page.tsx && git commit -m "feat: add home page with hero, category filter, dish grid and dish modal"
```

---

## Task 6: Cart Page

**Files:**
- Create: `restaurante-pedidos/src/components/CartItem.tsx`
- Create: `restaurante-pedidos/src/components/OrderSummary.tsx`
- Create: `restaurante-pedidos/src/app/cart/page.tsx`

> Depends on Task 3. Can run in parallel with Tasks 4 and 5.

- [ ] **Step 6.1: Create CartItem component**

Create `restaurante-pedidos/src/components/CartItem.tsx`:

```tsx
'use client'

import Image from 'next/image'
import { useApp } from '@/context/AppContext'
import type { CartItem as CartItemType } from '@/types'

interface CartItemProps {
  item: CartItemType
}

export default function CartItem({ item }: CartItemProps) {
  const { updateCartQuantity, removeFromCart } = useApp()

  return (
    <div className="flex items-center gap-5 py-5 border-b border-noir-cream">
      {/* Thumbnail */}
      <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden">
        <Image
          src={item.dish.imageUrl}
          alt={item.dish.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-playfair text-lg text-noir-black mb-0.5">{item.dish.name}</h3>
        <p className="font-inter text-sm text-noir-gold font-semibold">
          R$ {item.dish.price.toFixed(2).replace('.', ',')}
        </p>
      </div>

      {/* Quantity control */}
      <div className="flex items-center gap-3 border border-noir-cream px-3 py-1.5">
        <button
          onClick={() => updateCartQuantity(item.dish.id, item.quantity - 1)}
          className="w-5 h-5 flex items-center justify-center text-noir-black hover:text-noir-gold transition-colors"
        >
          −
        </button>
        <span className="font-inter text-noir-black w-4 text-center text-sm">{item.quantity}</span>
        <button
          onClick={() => updateCartQuantity(item.dish.id, item.quantity + 1)}
          className="w-5 h-5 flex items-center justify-center text-noir-black hover:text-noir-gold transition-colors"
        >
          +
        </button>
      </div>

      {/* Subtotal */}
      <div className="text-right w-24 flex-shrink-0">
        <p className="font-inter font-semibold text-noir-black">
          R$ {(item.dish.price * item.quantity).toFixed(2).replace('.', ',')}
        </p>
        <button
          onClick={() => removeFromCart(item.dish.id)}
          className="font-inter text-xs text-noir-gray hover:text-red-500 transition-colors mt-1"
        >
          Remover
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 6.2: Create OrderSummary component**

Create `restaurante-pedidos/src/components/OrderSummary.tsx`:

```tsx
import type { CartItem } from '@/types'

interface OrderSummaryProps {
  items: CartItem[]
  showServiceFee?: boolean
}

export default function OrderSummary({ items, showServiceFee = true }: OrderSummaryProps) {
  const subtotal = items.reduce((sum, item) => sum + item.dish.price * item.quantity, 0)
  const serviceFee = showServiceFee ? subtotal * 0.1 : 0
  const total = subtotal + serviceFee

  return (
    <div className="bg-noir-cream p-6 space-y-3">
      <div className="flex justify-between font-inter text-sm text-noir-black">
        <span>Subtotal</span>
        <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
      </div>
      {showServiceFee && (
        <div className="flex justify-between font-inter text-sm text-noir-gray">
          <span>Taxa de serviço (10%)</span>
          <span>R$ {serviceFee.toFixed(2).replace('.', ',')}</span>
        </div>
      )}
      <div className="border-t border-noir-gray/20 pt-3 flex justify-between font-inter font-semibold text-noir-black">
        <span>Total</span>
        <span className="text-noir-gold text-lg">R$ {total.toFixed(2).replace('.', ',')}</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 6.3: Create Cart page**

Create `restaurante-pedidos/src/app/cart/page.tsx`:

```tsx
'use client'

import { useApp } from '@/context/AppContext'
import CartItemComponent from '@/components/CartItem'
import OrderSummary from '@/components/OrderSummary'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function CartPage() {
  const { cart, confirmOrder } = useApp()
  const router = useRouter()

  function handleConfirm() {
    if (cart.length === 0) return
    confirmOrder()
    router.push('/confirmation')
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-8">
        <p className="font-playfair text-3xl text-noir-black mb-4">Carrinho vazio</p>
        <p className="font-inter text-noir-gray mb-8">Adicione pratos do cardápio para continuar.</p>
        <Link
          href="/"
          className="font-inter text-sm uppercase tracking-widest border border-noir-black text-noir-black px-8 py-3 hover:bg-noir-black hover:text-noir-white transition-all"
        >
          Ver Cardápio
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-8 py-16">
      <div className="mb-10">
        <p className="font-inter text-noir-gold text-xs tracking-[0.4em] uppercase mb-2">Seu Pedido</p>
        <h1 className="font-playfair text-4xl text-noir-black">Carrinho</h1>
      </div>

      <div className="mb-8">
        {cart.map(item => (
          <CartItemComponent key={item.dish.id} item={item} />
        ))}
      </div>

      <OrderSummary items={cart} />

      <div className="mt-6 flex flex-col gap-3">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleConfirm}
          className="w-full bg-noir-gold text-noir-black font-inter font-semibold py-4 text-sm uppercase tracking-widest hover:bg-noir-gold/90 transition-colors"
        >
          Confirmar Pedido
        </motion.button>
        <Link
          href="/"
          className="w-full text-center border border-noir-gray text-noir-gray font-inter text-sm uppercase tracking-widest py-4 hover:border-noir-black hover:text-noir-black transition-all"
        >
          Continuar Navegando
        </Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 6.4: Verify TypeScript**

```bash
cd "C:\Users\leona\Documents\Backup\Portifolio ARCSYS\restaurante-pedidos" && npx tsc --noEmit
```

- [ ] **Step 6.5: Commit**

```bash
cd "C:\Users\leona\Documents\Backup\Portifolio ARCSYS\restaurante-pedidos" && git add src/components/CartItem.tsx src/components/OrderSummary.tsx src/app/cart && git commit -m "feat: add cart page with editable quantities and order summary"
```

---

## Task 7: Confirmation and Status Tracking Pages

**Files:**
- Create: `restaurante-pedidos/src/components/ConfirmationView.tsx`
- Create: `restaurante-pedidos/src/app/confirmation/page.tsx`
- Create: `restaurante-pedidos/src/components/StatusTracker.tsx`
- Create: `restaurante-pedidos/src/app/status/page.tsx`

> Depends on Tasks 4 (Header) and 5 (Home flow must exist for redirect to make sense). Can start after Task 3.

- [ ] **Step 7.1: Create ConfirmationView component**

Create `restaurante-pedidos/src/components/ConfirmationView.tsx`:

```tsx
'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import type { Order } from '@/types'

interface ConfirmationViewProps {
  order: Order
}

export default function ConfirmationView({ order }: ConfirmationViewProps) {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/status')
    }, 2500)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-[80vh] bg-noir-black flex flex-col items-center justify-center text-center px-8">
      {/* Animated check circle */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200, delay: 0.1 }}
        className="w-24 h-24 border-2 border-noir-gold rounded-full flex items-center justify-center mb-8"
      >
        <motion.svg
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#C9A96E"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <motion.path
            d="M5 12l5 5L19 7"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          />
        </motion.svg>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <p className="font-inter text-noir-gold text-xs tracking-[0.4em] uppercase mb-3">
          Confirmado
        </p>
        <h1 className="font-playfair text-5xl text-noir-white mb-4">
          Pedido Recebido
        </h1>
        <p className="font-inter text-3xl text-noir-gold font-semibold mb-6">
          {order.id}
        </p>
        <p className="font-inter text-noir-white/50 text-sm">
          Redirecionando para acompanhamento...
        </p>
      </motion.div>
    </div>
  )
}
```

- [ ] **Step 7.2: Create Confirmation page**

Create `restaurante-pedidos/src/app/confirmation/page.tsx`:

```tsx
'use client'

import { useApp } from '@/context/AppContext'
import ConfirmationView from '@/components/ConfirmationView'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ConfirmationPage() {
  const { latestOrder } = useApp()
  const router = useRouter()

  useEffect(() => {
    if (!latestOrder) {
      router.replace('/')
    }
  }, [latestOrder, router])

  if (!latestOrder) return null

  return <ConfirmationView order={latestOrder} />
}
```

- [ ] **Step 7.3: Create StatusTracker component**

Create `restaurante-pedidos/src/components/StatusTracker.tsx`:

```tsx
'use client'

import { motion } from 'framer-motion'
import type { OrderStatus } from '@/types'

const STEPS: { key: OrderStatus; label: string }[] = [
  { key: 'received', label: 'Recebido' },
  { key: 'preparing', label: 'Preparando' },
  { key: 'ready', label: 'Pronto' },
  { key: 'delivered', label: 'Entregue' },
]

interface StatusTrackerProps {
  currentStatus: OrderStatus
}

export default function StatusTracker({ currentStatus }: StatusTrackerProps) {
  const currentIndex = STEPS.findIndex(s => s.key === currentStatus)
  const progressPercent = (currentIndex / (STEPS.length - 1)) * 100

  return (
    <div className="py-8">
      {/* Progress bar */}
      <div className="relative mb-8">
        <div className="h-0.5 bg-noir-cream w-full" />
        <motion.div
          className="absolute top-0 left-0 h-0.5 bg-noir-gold"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
        {/* Step dots */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.key}
              animate={{
                backgroundColor: i <= currentIndex ? '#C9A96E' : '#E8E4DC',
                borderColor: i <= currentIndex ? '#C9A96E' : '#6B6B6B',
              }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="w-4 h-4 rounded-full border-2 -translate-y-px"
            />
          ))}
        </div>
      </div>

      {/* Labels */}
      <div className="flex justify-between">
        {STEPS.map((step, i) => (
          <span
            key={step.key}
            className={`font-inter text-xs uppercase tracking-widest transition-colors ${
              i <= currentIndex ? 'text-noir-gold' : 'text-noir-gray'
            }`}
            style={{ width: '25%', textAlign: i === 0 ? 'left' : i === STEPS.length - 1 ? 'right' : 'center' }}
          >
            {step.label}
          </span>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 7.4: Create Status page with auto-advance timer**

Create `restaurante-pedidos/src/app/status/page.tsx`:

```tsx
'use client'

import { useEffect } from 'react'
import { useApp } from '@/context/AppContext'
import StatusTracker from '@/components/StatusTracker'
import OrderSummary from '@/components/OrderSummary'
import { useRouter } from 'next/navigation'
import type { OrderStatus } from '@/types'

const STATUS_LABELS: Record<OrderStatus, string> = {
  received: 'Pedido Recebido',
  preparing: 'Em Preparação',
  ready: 'Pronto para Retirada',
  delivered: 'Entregue',
}

export default function StatusPage() {
  const { latestOrder, advanceOrderStatus } = useApp()
  const router = useRouter()

  useEffect(() => {
    if (!latestOrder) {
      router.replace('/')
      return
    }
    if (latestOrder.status === 'delivered') return

    const timer = setInterval(() => {
      advanceOrderStatus(latestOrder.id)
    }, 5000)

    return () => clearInterval(timer)
  }, [latestOrder, advanceOrderStatus, router])

  if (!latestOrder) return null

  return (
    <div className="max-w-2xl mx-auto px-8 py-16">
      <div className="mb-10">
        <p className="font-inter text-noir-gold text-xs tracking-[0.4em] uppercase mb-2">
          Pedido {latestOrder.id}
        </p>
        <h1 className="font-playfair text-4xl text-noir-black">
          {STATUS_LABELS[latestOrder.status]}
        </h1>
      </div>

      <StatusTracker currentStatus={latestOrder.status} />

      <div className="mt-12">
        <h2 className="font-inter text-xs uppercase tracking-widest text-noir-gray mb-4">Resumo do Pedido</h2>
        <OrderSummary items={latestOrder.items} />
      </div>

      {latestOrder.status === 'delivered' && (
        <div className="mt-8 text-center">
          <p className="font-playfair text-2xl text-noir-black mb-4">Bom apetite!</p>
          <button
            onClick={() => router.push('/')}
            className="font-inter text-sm uppercase tracking-widest border border-noir-black text-noir-black px-8 py-3 hover:bg-noir-black hover:text-noir-white transition-all"
          >
            Fazer Novo Pedido
          </button>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 7.5: Verify TypeScript**

```bash
cd "C:\Users\leona\Documents\Backup\Portifolio ARCSYS\restaurante-pedidos" && npx tsc --noEmit
```

- [ ] **Step 7.6: Test full client flow manually**

Open `http://localhost:3000`. Walk through:
1. Click a dish → modal opens with animation
2. Add to cart → cart count updates in header
3. Open cart (`/cart`) → item visible, quantity editable, total correct with 10% fee
4. Confirm → goes to `/confirmation` with gold check animation and order ID
5. After 2.5s → redirects to `/status` with 4-step tracker
6. Wait 5s → status advances to "Preparando" with animated gold progress bar
7. Wait more → advances through all steps to "Entregue"

- [ ] **Step 7.7: Commit**

```bash
cd "C:\Users\leona\Documents\Backup\Portifolio ARCSYS\restaurante-pedidos" && git add src/components/ConfirmationView.tsx src/components/StatusTracker.tsx src/app/confirmation src/app/status && git commit -m "feat: add confirmation page with animated check and status tracking with auto-advance timer"
```

---

## Task 8: Kitchen Dashboard (Kanban)

**Files:**
- Create: `restaurante-pedidos/src/components/KanbanCard.tsx`
- Create: `restaurante-pedidos/src/components/KanbanColumn.tsx`
- Create: `restaurante-pedidos/src/components/OrderDetailModal.tsx`
- Create: `restaurante-pedidos/src/components/KanbanBoard.tsx`
- Create: `restaurante-pedidos/src/app/kitchen/page.tsx`

> Depends on Tasks 3 (AppContext) and 4 (Header already handles kitchen view). Can start after Task 3.

- [ ] **Step 8.1: Create KanbanCard**

Create `restaurante-pedidos/src/components/KanbanCard.tsx`:

```tsx
'use client'

import { motion } from 'framer-motion'
import type { Order, OrderStatus } from '@/types'

const STATUS_NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  received: 'Iniciar Preparo',
  preparing: 'Marcar Pronto',
}

interface KanbanCardProps {
  order: Order
  onAdvance: (orderId: string) => void
  onClick: (order: Order) => void
}

function formatElapsed(createdAt: Date): string {
  const ms = Date.now() - createdAt.getTime()
  const minutes = Math.floor(ms / 60000)
  if (minutes < 1) return 'Agora mesmo'
  if (minutes === 1) return '1 min atrás'
  return `${minutes} min atrás`
}

export default function KanbanCard({ order, onAdvance, onClick }: KanbanCardProps) {
  const nextLabel = STATUS_NEXT_LABEL[order.status]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className="bg-noir-cream border border-noir-cream hover:border-noir-gray/40 p-5 cursor-pointer transition-colors"
      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
    >
      <div onClick={() => onClick(order)}>
        <div className="flex items-center justify-between mb-3">
          <span className="font-inter font-semibold text-noir-black text-base">{order.id}</span>
          <span className="font-inter text-xs text-noir-gray">{formatElapsed(order.createdAt)}</span>
        </div>
        <ul className="mb-4 space-y-1">
          {order.items.map(item => (
            <li key={item.dish.id} className="font-inter text-sm text-noir-black">
              <span className="text-noir-gold font-medium">{item.quantity}×</span> {item.dish.name}
            </li>
          ))}
        </ul>
        <p className="font-inter text-xs text-noir-gray font-semibold">
          Total: R$ {order.totalAmount.toFixed(2).replace('.', ',')}
        </p>
      </div>

      {nextLabel && (
        <button
          onClick={(e) => { e.stopPropagation(); onAdvance(order.id) }}
          className="mt-4 w-full bg-noir-black text-noir-gold font-inter text-xs uppercase tracking-widest py-2.5 hover:bg-noir-gold hover:text-noir-black transition-all"
        >
          {nextLabel}
        </button>
      )}
    </motion.div>
  )
}
```

- [ ] **Step 8.2: Create KanbanColumn**

Create `restaurante-pedidos/src/components/KanbanColumn.tsx`:

```tsx
'use client'

import { AnimatePresence } from 'framer-motion'
import type { Order, OrderStatus } from '@/types'
import KanbanCard from './KanbanCard'

const COLUMN_LABELS: Partial<Record<OrderStatus, string>> = {
  received: 'Novos',
  preparing: 'Em Preparo',
  ready: 'Prontos',
}

interface KanbanColumnProps {
  status: OrderStatus
  orders: Order[]
  onAdvance: (orderId: string) => void
  onCardClick: (order: Order) => void
}

export default function KanbanColumn({ status, orders, onAdvance, onCardClick }: KanbanColumnProps) {
  return (
    <div className="flex-1 min-w-[280px] md:min-w-0">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-noir-gray/20">
        <h2 className="font-inter text-sm uppercase tracking-widest text-noir-white">
          {COLUMN_LABELS[status]}
        </h2>
        <span className="w-6 h-6 bg-noir-gray/20 text-noir-white font-inter text-xs flex items-center justify-center rounded-full">
          {orders.length}
        </span>
      </div>
      <div className="space-y-4">
        <AnimatePresence>
          {orders.map(order => (
            <KanbanCard
              key={order.id}
              order={order}
              onAdvance={onAdvance}
              onClick={onCardClick}
            />
          ))}
        </AnimatePresence>
        {orders.length === 0 && (
          <p className="font-inter text-xs text-noir-gray/40 text-center py-8 uppercase tracking-widest">
            Nenhum pedido
          </p>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 8.3: Create OrderDetailModal**

Create `restaurante-pedidos/src/components/OrderDetailModal.tsx`:

```tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { Order, OrderStatus } from '@/types'

const STATUS_NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  received: 'Iniciar Preparo',
  preparing: 'Marcar Pronto',
}

interface OrderDetailModalProps {
  order: Order | null
  onClose: () => void
  onAdvance: (orderId: string) => void
}

function formatElapsed(createdAt: Date): string {
  const ms = Date.now() - createdAt.getTime()
  const minutes = Math.floor(ms / 60000)
  if (minutes < 1) return 'Menos de 1 minuto'
  if (minutes === 1) return '1 minuto'
  return `${minutes} minutos`
}

export default function OrderDetailModal({ order, onClose, onAdvance }: OrderDetailModalProps) {
  const nextLabel = order ? STATUS_NEXT_LABEL[order.status] : undefined

  return (
    <AnimatePresence>
      {order && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-noir-black/80 z-40 backdrop-blur-sm"
          />
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-auto md:left-1/2 md:-translate-x-1/2 md:w-[480px] bg-noir-cream z-50 p-8"
            style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-noir-gray hover:text-noir-black transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <p className="font-inter text-xs text-noir-gold uppercase tracking-widest mb-1">Pedido</p>
            <h2 className="font-playfair text-3xl text-noir-black mb-1">{order.id}</h2>
            <p className="font-inter text-sm text-noir-gray mb-6">
              Tempo de espera: {formatElapsed(order.createdAt)}
            </p>

            <ul className="space-y-3 mb-6">
              {order.items.map(item => (
                <li key={item.dish.id} className="flex justify-between font-inter text-noir-black">
                  <span>
                    <span className="text-noir-gold font-semibold">{item.quantity}×</span> {item.dish.name}
                  </span>
                  <span className="text-noir-gray text-sm">
                    R$ {(item.dish.price * item.quantity).toFixed(2).replace('.', ',')}
                  </span>
                </li>
              ))}
            </ul>

            {nextLabel && (
              <button
                onClick={() => { onAdvance(order.id); onClose() }}
                className="w-full bg-noir-black text-noir-gold font-inter text-sm uppercase tracking-widest py-4 hover:bg-noir-gold hover:text-noir-black transition-all"
              >
                {nextLabel}
              </button>
            )}

            {order.status === 'ready' && (
              <p className="text-center font-inter text-sm text-noir-gold font-semibold py-3 uppercase tracking-widest">
                Aguardando retirada
              </p>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 8.4: Create KanbanBoard**

Create `restaurante-pedidos/src/components/KanbanBoard.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import type { Order, OrderStatus } from '@/types'
import KanbanColumn from './KanbanColumn'
import OrderDetailModal from './OrderDetailModal'

const KITCHEN_COLUMNS: OrderStatus[] = ['received', 'preparing', 'ready']

export default function KanbanBoard() {
  const { orders, advanceOrderStatus } = useApp()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  function getOrdersForStatus(status: OrderStatus): Order[] {
    return orders.filter(o => o.status === status)
  }

  return (
    <>
      <div className="flex gap-6 overflow-x-auto pb-4">
        {KITCHEN_COLUMNS.map(status => (
          <KanbanColumn
            key={status}
            status={status}
            orders={getOrdersForStatus(status)}
            onAdvance={advanceOrderStatus}
            onCardClick={setSelectedOrder}
          />
        ))}
      </div>
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onAdvance={(id) => { advanceOrderStatus(id); setSelectedOrder(null) }}
      />
    </>
  )
}
```

- [ ] **Step 8.5: Create Kitchen page**

Create `restaurante-pedidos/src/app/kitchen/page.tsx`:

```tsx
'use client'

import { useEffect } from 'react'
import { useApp } from '@/context/AppContext'
import KanbanBoard from '@/components/KanbanBoard'

export default function KitchenPage() {
  const { setView, orders } = useApp()

  useEffect(() => {
    setView('kitchen')
  }, [setView])

  const activeOrders = orders.filter(o => o.status !== 'delivered')

  return (
    <div className="min-h-screen bg-noir-black px-8 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <p className="font-inter text-noir-gold text-xs tracking-[0.4em] uppercase mb-2">Dashboard</p>
          <div className="flex items-end justify-between">
            <h1 className="font-playfair text-4xl text-noir-white">Cozinha</h1>
            <span className="font-inter text-noir-gray text-sm">
              {activeOrders.length} {activeOrders.length === 1 ? 'pedido ativo' : 'pedidos ativos'}
            </span>
          </div>
        </div>

        <KanbanBoard />
      </div>
    </div>
  )
}
```

- [ ] **Step 8.6: Verify TypeScript**

```bash
cd "C:\Users\leona\Documents\Backup\Portifolio ARCSYS\restaurante-pedidos" && npx tsc --noEmit
```

- [ ] **Step 8.7: Test kitchen flow manually**

1. Switch to Cliente view, add items to cart, confirm order
2. Switch to Cozinha (header switcher or click logo → kitchen button)
3. Order appears in "Novos" column
4. Click "Iniciar Preparo" → moves to "Em Preparo"
5. Click "Marcar Pronto" → moves to "Prontos"
6. Click card → OrderDetailModal opens with full item list
7. Return to Cliente view → cart state is preserved

- [ ] **Step 8.8: Commit**

```bash
cd "C:\Users\leona\Documents\Backup\Portifolio ARCSYS\restaurante-pedidos" && git add src/components/KanbanCard.tsx src/components/KanbanColumn.tsx src/components/KanbanBoard.tsx src/components/OrderDetailModal.tsx src/app/kitchen && git commit -m "feat: add kitchen Kanban dashboard with 3-column layout and order detail modal"
```

---

## Task 9: Polish — Animations, Transitions, and Responsive Adjustments

**Files:**
- Modify: `restaurante-pedidos/src/app/page.tsx` (page transitions)
- Modify: `restaurante-pedidos/src/components/DishGrid.tsx` (stagger animation)
- Modify: `restaurante-pedidos/src/app/globals.css` (hide scrollbar on category tabs)
- Modify: `restaurante-pedidos/tailwind.config.ts` (add scrollbar-hide utility)

> Depends on all prior tasks being functionally complete.

- [ ] **Step 9.1: Add stagger entry animation to DishGrid**

Modify `restaurante-pedidos/src/components/DishGrid.tsx` to wrap in motion container:

```tsx
'use client'

import { motion } from 'framer-motion'
import { menu } from '@/data/menu'
import type { Category, Dish } from '@/types'
import DishCard from './DishCard'

interface DishGridProps {
  activeCategory: Category | 'all'
  onDishClick: (dish: Dish) => void
}

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

export default function DishGrid({ activeCategory, onDishClick }: DishGridProps) {
  const filtered = activeCategory === 'all'
    ? menu
    : menu.filter(dish => dish.category === activeCategory)

  return (
    <motion.div
      key={activeCategory}
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {filtered.map(dish => (
        <motion.div key={dish.id} variants={item}>
          <DishCard dish={dish} onClick={onDishClick} />
        </motion.div>
      ))}
    </motion.div>
  )
}
```

- [ ] **Step 9.2: Add scrollbar-hide utility for CategoryTabs**

Add to `restaurante-pedidos/src/app/globals.css`:

```css
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
```

- [ ] **Step 9.3: Verify tablet layout for Kanban (768px–1023px)**

Open browser DevTools, set viewport to 900px wide. Verify:
- Kanban columns are horizontally scrollable (the `overflow-x-auto` and `min-w-[280px]` on KanbanColumn already handle this)
- Header switcher still fully visible
- Home page grid switches to 2 columns

- [ ] **Step 9.4: Verify no colors outside Noir palette**

Scan each page visually. The only acceptable colors are:
- `#0A0A0A` (noir-black)
- `#F5F4F0` (noir-white)
- `#E8E4DC` (noir-cream)
- `#C9A96E` (noir-gold)
- `#6B6B6B` (noir-gray)
- Red is only used on the "Remover" hover in CartItem — replace with `text-noir-gray` permanently:

In `restaurante-pedidos/src/components/CartItem.tsx`, change `hover:text-red-500` to `hover:text-noir-black`.

- [ ] **Step 9.5: Final TypeScript check**

```bash
cd "C:\Users\leona\Documents\Backup\Portifolio ARCSYS\restaurante-pedidos" && npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 9.6: Commit**

```bash
cd "C:\Users\leona\Documents\Backup\Portifolio ARCSYS\restaurante-pedidos" && git add -A && git commit -m "polish: stagger animation on dish grid, hide scrollbar, remove off-palette color"
```

---

## Task 10: Demo Readiness — Final Checklist Run

> This task is manual verification only. No code changes expected unless issues are found.

- [ ] **Step 10.1: Run full spec checklist — Visual**

Open `http://localhost:3000` and verify each item:
- [ ] Hero full-screen with Playfair Display "NOIR" at ~80px loads and impacts immediately
- [ ] Dark hero → light cardápio section transition is evident
- [ ] Gold appears only on prices, CTAs, and active states — nowhere else
- [ ] Dish cards have clean spacing, full photo, no visual clutter
- [ ] Dish modal opens with spring animation (not abrupt)
- [ ] Kitchen dashboard (`/kitchen`) is visually distinct — dark background, cream cards

- [ ] **Step 10.2: Run full spec checklist — Functional**

- [ ] Home → click dish → modal opens → add to cart → cart count updates
- [ ] Filter by category → correct dishes shown
- [ ] Open cart → items present → edit quantity → total recalculates with 10% fee
- [ ] Confirm order → confirmation page with animated check and order ID
- [ ] 2.5s later → redirects to status page
- [ ] Status auto-advances every 5s through all 4 stages
- [ ] Switch to Kitchen → order appears in "Novos"
- [ ] Manually advance order via button → moves column
- [ ] Click card → detail modal shows items and action buttons
- [ ] Switch back to Client → cart state intact (empty if order was placed)

- [ ] **Step 10.3: Confirm demo criterion**

> "Isso está pronto para gravar um demo de 2 minutos sem pausar para explicar o que é?"

If all boxes above are checked and the answer is YES → done.

- [ ] **Step 10.4: Final commit**

```bash
cd "C:\Users\leona\Documents\Backup\Portifolio ARCSYS\restaurante-pedidos" && git add -A && git commit -m "chore: project complete — demo-ready MVP restaurante Noir"
```

---

## Dependency Summary for Parallel Execution

| Task | Depends On | Can Parallelize With |
|------|-----------|----------------------|
| Task 1: Setup | — | — |
| Task 2: Types + Data | Task 1 | — |
| Task 3: AppContext | Task 2 | — |
| Task 4: Header | Task 3 | Tasks 5, 6, 8 |
| Task 5: Home + Modals | Task 3 | Tasks 4, 6, 8 |
| Task 6: Cart | Task 3 | Tasks 4, 5, 8 |
| Task 7: Confirmation + Status | Task 3 | Tasks 4, 6, 8 |
| Task 8: Kitchen | Task 3 | Tasks 4, 5, 6, 7 |
| Task 9: Polish | Tasks 1–8 | — |
| Task 10: Demo Checklist | Tasks 1–9 | — |
