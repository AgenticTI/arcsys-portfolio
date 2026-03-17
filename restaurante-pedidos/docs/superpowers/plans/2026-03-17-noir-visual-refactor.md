# Noir Visual Refactor Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the Restaurante Noir frontend from a generic dark theme to an editorial fine-dining aesthetic (Côte & Cendre inspired) — new fonts, palette, and all component layouts — without touching any state, logic, or routing.

**Architecture:** 5-agent phased execution. Agent 0 runs first (sequential) to establish design tokens, fonts, and global CSS. Agents A/B/C/D then run in parallel, each owning a strict set of non-overlapping files. No shared file is touched by more than one agent.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS v3, Framer Motion, `next/font/google`

---

## CRITICAL RULES FOR ALL AGENTS

1. **Read the spec first:** `docs/superpowers/specs/2026-03-17-restaurante-noir-refactor-design.md`
2. **Do NOT touch:** `AppContext.tsx`, `menu.ts`, `categories.ts`, `types/index.ts`, `next.config.mjs`, `package.json`
3. **Do NOT touch** routing/redirect logic (`router.push`, `router.replace`, redirect `useEffect` guards)
4. **No hardcoded hex** in JSX/TSX — always use Tailwind tokens. Exception: Framer Motion inline `animate` props.
5. **Font class rename:** old `font-playfair` → `font-cormorant`, old `font-inter` → `font-body`
6. **Token rename:** old `noir-cream` → context-dependent: dark card bg = `noir-ember`, light surface = `noir-parchment`, borders = `rgba(240,234,224,0.1)`
7. **Verify at end:** `npx tsc --noEmit` + `npm run lint` must both pass with zero errors

---

## File Ownership Map

| Agent | Owns exclusively |
|---|---|
| **0** | `tailwind.config.ts`, `src/app/globals.css`, `src/app/layout.tsx` |
| **A** | `src/components/HeroSection.tsx`, `src/components/CategoryTabs.tsx`, `src/components/DishGrid.tsx`, `src/components/DishCard.tsx`, `src/components/DishModal.tsx`, `src/app/page.tsx` |
| **B** | `src/components/CartItem.tsx`, `src/components/OrderSummary.tsx`, `src/components/ConfirmationView.tsx`, `src/components/StatusTracker.tsx`, `src/app/cart/page.tsx`, `src/app/confirmation/page.tsx`, `src/app/status/page.tsx` |
| **C** | `src/components/KanbanBoard.tsx`, `src/components/KanbanColumn.tsx`, `src/components/KanbanCard.tsx`, `src/components/OrderDetailModal.tsx`, `src/app/kitchen/page.tsx` |
| **D** | `src/components/Header.tsx` |

---

## Phase 0 — Design Tokens (Sequential, run first)

**Agent 0 must complete before Agents A/B/C/D start.**

### Task 0.1: Update Tailwind config

**File:** `tailwind.config.ts`

- [ ] Read the current file (note: has `noir-cream`, `font-playfair`, `font-inter`)
- [ ] Replace entire `theme.extend` block with:

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
        'noir-black':     '#090806',
        'noir-white':     '#F0EAE0',
        'noir-ember':     '#1C1510',
        'noir-gold':      '#C9A96E',
        'noir-gray':      '#9A9088',
        'noir-parchment': '#EDE7DB',
        'noir-bronze':    '#8B5E3C',
      },
      fontFamily: {
        cormorant: ['var(--font-cormorant)', 'Georgia', 'serif'],
        caps:      ['var(--font-caps)', 'Georgia', 'serif'],
        script:    ['var(--font-script)', 'cursive'],
        body:      ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] Save file

### Task 0.2: Update global CSS

**File:** `src/app/globals.css`

- [ ] Replace the **entire file** with the following content (do not edit only the body block — replace the whole file to avoid partial overwrites):

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
  background-color: theme('colors.noir-black');
  color: theme('colors.noir-white');
  font-family: var(--font-body), system-ui, sans-serif;
  font-weight: 400;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
```

- [ ] Save file

### Task 0.3: Update layout.tsx fonts

**File:** `src/app/layout.tsx`

- [ ] Read the current file
- [ ] Replace the entire file with:

```tsx
import type { Metadata } from 'next'
import { Cormorant_Garamond, Cormorant_SC, Italianno, DM_Sans } from 'next/font/google'
import { AppProvider } from '@/context/AppContext'
import Header from '@/components/Header'
import './globals.css'

const cormorant = Cormorant_Garamond({
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
})

const cormorantSC = Cormorant_SC({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  variable: '--font-caps',
  display: 'swap',
})

const italianno = Italianno({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-script',
  display: 'swap',
})

const dmSans = DM_Sans({
  weight: ['300', '400'],
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Noir — Fine Dining',
  description: 'Sistema de pedidos do restaurante Noir',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${cormorant.variable} ${cormorantSC.variable} ${italianno.variable} ${dmSans.variable}`}
    >
      <body className="bg-noir-black min-h-screen">
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

- [ ] Save file

### Task 0.4: Verify Phase 0

- [ ] Run: `npx tsc --noEmit` from `restaurante-pedidos/`
- [ ] Expected: zero TypeScript errors
- [ ] Run: `npm run lint`
- [ ] Expected: zero lint errors
- [ ] Commit:

```bash
git add tailwind.config.ts src/app/globals.css src/app/layout.tsx
git commit -m "feat: update design tokens, fonts and global CSS for Noir editorial refactor"
```

---

## Phase 1 — Parallel Agents (run after Phase 0 is committed)

---

## Agent A — Client Menu Components

**Reads spec sections:** 4.1, 4.2, 4.3, 4.4

### Task A.1: HeroSection

**File:** `src/components/HeroSection.tsx`

- [ ] Read the current file (currently: centered logo, opacity-40 bg image, no parallax)
- [ ] Replace entirely with editorial layout: bottom-left title, 2-col grid, parallax, script annotation, badge:

```tsx
'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function HeroSection() {
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!bgRef.current) return
      const y = Math.min(window.scrollY * 0.3, 100)
      bgRef.current.style.transform = `scale(1.04) translateY(${y}px)`
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden flex flex-col justify-end">
      {/* Background */}
      <div
        ref={bgRef}
        className="absolute inset-0 scale-[1.04] transition-none"
        style={{ willChange: 'transform' }}
      >
        <Image
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800"
          alt="Restaurante Noir"
          fill
          className="object-cover"
          priority
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(160deg, rgba(9,8,6,0.2) 0%, rgba(9,8,6,0.5) 40%, rgba(9,8,6,0.92) 100%)',
          }}
        />
      </div>

      {/* Header gradient */}
      <div
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(9,8,6,0.85) 0%, transparent 100%)' }}
      />

      {/* Content */}
      <div className="relative z-10 grid grid-cols-2 items-end gap-0 px-14 pb-16">
        {/* Left */}
        <div>
          <p className="font-body text-noir-gold text-[10px] tracking-[0.4em] uppercase mb-5">
            Bem-vindo ao Noir
          </p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-cormorant text-[clamp(52px,6vw,88px)] font-light leading-[1.02] text-noir-white tracking-tight mb-8"
          >
            Nosso cardápio<br />
            promete deleitar<br />
            <em className="text-noir-gold">todos os sentidos</em>
          </motion.h1>
          <p className="font-body text-noir-white/80 text-sm leading-relaxed max-w-sm mb-8">
            Cada prato é uma celebração de sofisticação e arte, oferecendo uma experiência inesquecível que alia inovação e tradição.
          </p>
          <a
            href="#menu"
            className="inline-flex items-center gap-3 border border-noir-gold text-noir-gold font-body text-[10px] tracking-[0.3em] uppercase px-8 py-3.5 hover:bg-noir-gold hover:text-noir-black transition-all"
          >
            Ver Cardápio
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Right */}
        <div className="flex flex-col items-end gap-6">
          <p className="font-script text-[38px] text-noir-white/30 text-right leading-tight">
            a arte em<br />cada prato
          </p>
          <div className="border border-noir-gold/30 px-6 py-4 text-center">
            <span className="block font-body text-[9px] tracking-[0.35em] uppercase text-noir-gold mb-1">
              Reconhecimento
            </span>
            <strong className="font-cormorant text-2xl font-light text-noir-white">
              Top 50 Brasil
            </strong>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 z-10">
        <motion.div
          className="w-px bg-noir-gold/40"
          animate={{ height: [40, 24, 40] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ height: 40 }}
        />
        <span className="font-body text-[9px] tracking-[0.35em] uppercase text-noir-white/35">
          Explorar
        </span>
      </div>
    </section>
  )
}
```

- [ ] Save file

### Task A.2: CategoryTabs

**File:** `src/components/CategoryTabs.tsx`

- [ ] Read the current file
- [ ] Replace only class names to match new design (keep props interface intact):

```tsx
'use client'

import { categories } from '@/data/categories'
import type { Category } from '@/types'

interface CategoryTabsProps {
  active: Category | 'all'
  onChange: (cat: Category | 'all') => void
}

export default function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  const all = [{ id: 'all' as const, label: 'Todos' }, ...categories]

  return (
    <div className="flex border-b border-noir-white/8">
      {all.map(cat => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`font-body text-[10px] tracking-[0.3em] uppercase px-7 py-3.5 border-b-2 -mb-px transition-all ${
            active === cat.id
              ? 'text-noir-gold border-noir-gold'
              : 'text-noir-gray/60 border-transparent hover:text-noir-white'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
```

- [ ] Save file

### Task A.3: DishCard

**File:** `src/components/DishCard.tsx`

- [ ] Read the current file
- [ ] Replace with full-bleed photo card with overlaid text:

```tsx
'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Dish } from '@/types'

interface DishCardProps {
  dish: Dish
  onClick: (dish: Dish) => void
  feature?: boolean
}

export default function DishCard({ dish, onClick, feature = false }: DishCardProps) {
  return (
    <motion.div
      className={`relative overflow-hidden cursor-pointer bg-noir-ember ${
        feature ? 'col-span-2' : ''
      }`}
      style={{ aspectRatio: feature ? '16/9' : '4/3' }}
      onClick={() => onClick(dish)}
      whileHover="hover"
    >
      <motion.div
        className="absolute inset-0"
        variants={{ hover: { scale: 1.06 } }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Image
          src={dish.imageUrl}
          alt={dish.name}
          fill
          className="object-cover"
          sizes={feature ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 50vw, 33vw'}
        />
      </motion.div>

      {/* Gradient overlay */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(9,8,6,0.92) 0%, rgba(9,8,6,0.4) 50%, transparent 100%)',
        }}
        variants={{ hover: { opacity: 1 } }}
        initial={{ opacity: 0.7 }}
      />

      {/* Info */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <p className="font-body text-[9px] tracking-[0.35em] uppercase text-noir-gold mb-2">
          {dish.category}
        </p>
        <h3
          className={`font-cormorant font-light text-noir-white leading-tight mb-2 ${
            feature ? 'text-[32px]' : 'text-[22px]'
          }`}
        >
          {dish.name}
        </h3>
        <p className="font-body text-[13px] text-noir-white/78 line-clamp-2 mb-3">
          {dish.description}
        </p>
        <span className="font-caps text-noir-gold text-[15px]">
          R$ {dish.price.toFixed(2).replace('.', ',')}
        </span>
        <motion.span
          className="block font-body text-[9px] tracking-[0.3em] uppercase text-noir-white/70 mt-3"
          variants={{ hover: { opacity: 1, y: 0 } }}
          initial={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.2 }}
        >
          Ver detalhes →
        </motion.span>
      </div>
    </motion.div>
  )
}
```

- [ ] Save file

### Task A.4: DishGrid

**File:** `src/components/DishGrid.tsx`

- [ ] Read the current file
- [ ] Replace with 3-col grid using feature card pattern (first dish = col-span-2):

```tsx
'use client'

import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { menu } from '@/data/menu'
import DishCard from './DishCard'
import type { Category, Dish } from '@/types'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

interface DishGridProps {
  activeCategory: Category | 'all'
  onDishClick: (dish: Dish) => void
}

export default function DishGrid({ activeCategory, onDishClick }: DishGridProps) {
  const filtered = useMemo(
    () => activeCategory === 'all' ? menu : menu.filter(d => d.category === activeCategory),
    [activeCategory]
  )

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeCategory}
        className="grid grid-cols-3 gap-[2px]"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {filtered.map((dish, index) => (
          <motion.div
            key={dish.id}
            variants={item}
            className={index === 0 ? 'col-span-2' : ''}
          >
            <DishCard
              dish={dish}
              onClick={onDishClick}
              feature={index === 0}
            />
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  )
}
```

- [ ] Save file

### Task A.5: DishModal

**File:** `src/components/DishModal.tsx`

- [ ] Read the current file (keep all props/state logic, only rewrite JSX and styles)
- [ ] Preserve: `useApp()`, `addToCart`, `qty` state, `onClose` prop, `AnimatePresence` wrapper
- [ ] New visual: split 50/50 photo|content modal, ingredient chips, pairing list (use `dish.ingredients`):

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

// Static pairing suggestions — cosmetic only
const PAIRINGS = ['Wolf of Kyoto', 'Dirty Martini', 'Bordeaux 2018']

export default function DishModal({ dish, onClose }: DishModalProps) {
  const { addToCart } = useApp()
  const [qty, setQty] = useState(1)

  return (
    <AnimatePresence>
      {dish && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(9,8,6,0.85)', backdropFilter: 'blur(4px)' }}
          />

          {/* Modal */}
          <motion.div
            className="relative z-10 w-full max-w-[960px] grid grid-cols-2 max-h-[90vh] overflow-hidden"
            style={{ border: '1px solid rgba(201,169,110,0.15)' }}
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center text-noir-white/60 hover:text-noir-gold transition-colors"
              style={{ border: '1px solid rgba(240,234,224,0.15)' }}
            >
              ✕
            </button>

            {/* Left: Photo */}
            <div className="relative min-h-[540px]">
              <Image src={dish.imageUrl} alt={dish.name} fill className="object-cover" />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(9,8,6,0.85) 0%, transparent 60%)' }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span
                  className="inline-block font-body text-[9px] tracking-[0.35em] uppercase text-noir-gold mb-4"
                  style={{ border: '1px solid rgba(201,169,110,0.4)', padding: '4px 12px' }}
                >
                  {dish.category}
                </span>
                <h2 className="font-cormorant text-[34px] font-light text-noir-white leading-tight">
                  {dish.name}
                </h2>
              </div>
            </div>

            {/* Right: Content */}
            <div
              className="flex flex-col overflow-y-auto p-11"
              style={{ background: 'linear-gradient(to bottom, #0f0d0a 0%, #090806 100%)' }}
            >
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-7">
                <span className="font-body text-[9px] tracking-[0.4em] uppercase text-noir-gold">
                  {dish.category}
                </span>
                <div className="flex-1 h-px" style={{ background: 'rgba(201,169,110,0.2)' }} />
              </div>

              <h1 className="font-cormorant text-[38px] font-light text-noir-white leading-tight mb-2">
                {dish.name}
              </h1>
              <p className="font-caps text-[20px] text-noir-gold mb-6 tracking-wide">
                R$ {dish.price.toFixed(2).replace('.', ',')}
              </p>

              <div className="h-px mb-6" style={{ background: 'rgba(240,234,224,0.08)' }} />

              <p className="font-body text-sm text-noir-white/82 leading-relaxed mb-7">
                {dish.description}
              </p>

              {/* Ingredients */}
              <p className="font-body text-[9px] tracking-[0.35em] uppercase text-noir-gray mb-3">
                Ingredientes
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {dish.ingredients.map(ing => (
                  <span
                    key={ing}
                    className="font-body text-[12px] text-noir-white/78 px-3.5 py-1.5 hover:text-noir-gold transition-colors"
                    style={{ border: '1px solid rgba(240,234,224,0.18)' }}
                  >
                    {ing}
                  </span>
                ))}
              </div>

              {/* Pairings */}
              <p className="font-body text-[9px] tracking-[0.35em] uppercase text-noir-gray mb-2">
                Harmoniza com
              </p>
              <div className="mb-8">
                {PAIRINGS.map(p => (
                  <div
                    key={p}
                    className="flex items-center gap-2.5 font-body text-[13px] text-noir-white/75 py-2.5"
                    style={{ borderBottom: '1px solid rgba(240,234,224,0.1)' }}
                  >
                    <span className="text-noir-gold text-lg leading-none">·</span>
                    {p}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-auto pt-6" style={{ borderTop: '1px solid rgba(240,234,224,0.08)' }}>
                <div className="flex items-center gap-5 mb-4">
                  <span className="font-body text-[10px] tracking-[0.25em] uppercase text-noir-gray">
                    Qtd.
                  </span>
                  <div className="flex items-center" style={{ border: '1px solid rgba(240,234,224,0.15)' }}>
                    <button
                      onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="w-9 h-9 flex items-center justify-center text-noir-white/50 hover:text-noir-white text-lg transition-colors"
                    >
                      −
                    </button>
                    <span className="w-10 text-center font-caps text-[16px] text-noir-white">{qty}</span>
                    <button
                      onClick={() => setQty(q => q + 1)}
                      className="w-9 h-9 flex items-center justify-center text-noir-white/50 hover:text-noir-white text-lg transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <span className="ml-auto font-caps text-[14px] text-noir-gold">
                    R$ {(dish.price * qty).toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <button
                  onClick={() => { addToCart(dish, qty); onClose() }}
                  className="w-full bg-noir-gold text-noir-black font-body text-[11px] tracking-[0.35em] uppercase py-4 hover:bg-noir-bronze transition-all flex items-center justify-center gap-3"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
                  </svg>
                  Adicionar ao Pedido
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

- [ ] Save file

### Task A.6: page.tsx (menu page)

**File:** `src/app/page.tsx`

- [ ] Read the current file (keep all state: `activeCategory`, `selectedDish`)
- [ ] Update only the menu section wrapper and heading block:

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
      <section id="menu" className="bg-noir-black py-24 px-14">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <p className="font-body text-noir-gold text-[10px] tracking-[0.4em] uppercase mb-3">
              Nossa Culinária
            </p>
            <h2 className="font-cormorant text-5xl font-light text-noir-white">
              O <em>Cardápio</em> da Temporada
            </h2>
          </div>

          <div className="mb-12">
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

- [ ] Save file

### Task A.7: Verify Agent A

- [ ] Run: `npx tsc --noEmit`
- [ ] Expected: zero errors
- [ ] Run: `npm run lint`
- [ ] Expected: zero errors
- [ ] Commit:

```bash
git add src/components/HeroSection.tsx src/components/CategoryTabs.tsx src/components/DishGrid.tsx src/components/DishCard.tsx src/components/DishModal.tsx src/app/page.tsx
git commit -m "feat: refactor client menu components to editorial fine-dining design"
```

---

## Agent B — Order Flow Components

**Reads spec sections:** 4.5, 4.6, 4.7, 4.8

### Task B.1: CartItem

**File:** `src/components/CartItem.tsx`

- [ ] Read the current file — preserve all props and event handlers, replace only JSX/classes
- [ ] New design: 80px thumbnail + Cormorant name + minimal qty controls + gold price:

```tsx
'use client'

import Image from 'next/image'
import type { CartItem as CartItemType } from '@/types'

interface CartItemProps {
  item: CartItemType
  onIncrease: () => void
  onDecrease: () => void
  onRemove: () => void
}

export default function CartItem({ item, onIncrease, onDecrease, onRemove }: CartItemProps) {
  return (
    <div
      className="grid items-center gap-6 py-6"
      style={{
        gridTemplateColumns: '80px 1fr auto',
        borderBottom: '1px solid rgba(240,234,224,0.07)',
      }}
    >
      {/* Thumbnail */}
      <div className="relative w-20 h-20 overflow-hidden flex-shrink-0">
        <Image src={item.dish.imageUrl} alt={item.dish.name} fill className="object-cover" />
      </div>

      {/* Info */}
      <div>
        <p className="font-body text-[9px] tracking-[0.3em] uppercase text-noir-gold mb-1.5">
          {item.dish.category}
        </p>
        <h3 className="font-cormorant text-[20px] font-light text-noir-white mb-2.5 leading-tight">
          {item.dish.name}
        </h3>
        <div className="flex items-center gap-3.5">
          <div
            className="flex items-center"
            style={{ border: '1px solid rgba(240,234,224,0.12)' }}
          >
            <button
              onClick={onDecrease}
              className="w-7 h-7 flex items-center justify-center text-noir-white/50 hover:text-noir-white text-base transition-colors"
            >
              −
            </button>
            <span className="w-8 text-center font-body text-[13px] text-noir-white">
              {item.quantity}
            </span>
            <button
              onClick={onIncrease}
              className="w-7 h-7 flex items-center justify-center text-noir-white/50 hover:text-noir-white text-base transition-colors"
            >
              +
            </button>
          </div>
          <button
            onClick={onRemove}
            className="font-body text-[10px] tracking-[0.2em] uppercase text-noir-white/25 hover:text-red-400 transition-colors"
          >
            Remover
          </button>
        </div>
      </div>

      {/* Price — shows subtotal for this item */}
      <span className="font-caps text-[18px] text-noir-gold text-right whitespace-nowrap">
        R$ {(item.dish.price * item.quantity).toFixed(2).replace('.', ',')}
      </span>
    </div>
  )
}
```

- [ ] Save file

### Task B.2: OrderSummary

**File:** `src/components/OrderSummary.tsx`

- [ ] Read the current file — preserve all calculation logic, replace JSX/classes
- [ ] New design: line items with dividers, Cormorant total, 10% service fee note:

```tsx
import type { CartItem } from '@/types'

interface OrderSummaryProps {
  items: CartItem[]
}

export default function OrderSummary({ items }: OrderSummaryProps) {
  const subtotal = items.reduce((acc, i) => acc + i.dish.price * i.quantity, 0)
  const serviceFee = subtotal * 0.1
  const total = subtotal + serviceFee

  return (
    <div>
      {/* Line items */}
      <div style={{ borderTop: '1px solid rgba(240,234,224,0.1)' }}>
        {items.map(item => (
          <div
            key={item.dish.id}
            className="flex justify-between items-baseline py-3.5 font-body text-[13px] text-noir-white/75"
            style={{ borderBottom: '1px solid rgba(240,234,224,0.1)' }}
          >
            <span>{item.dish.name} × {item.quantity}</span>
            <span className="font-caps text-[15px] text-noir-white">
              R$ {(item.dish.price * item.quantity).toFixed(2).replace('.', ',')}
            </span>
          </div>
        ))}
        <div
          className="flex justify-between items-baseline py-3.5 font-body text-[13px] text-noir-white/75"
          style={{ borderBottom: '1px solid rgba(240,234,224,0.1)' }}
        >
          <span>Taxa de serviço (10%)</span>
          <span className="font-caps text-[15px] text-noir-white">
            R$ {serviceFee.toFixed(2).replace('.', ',')}
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-baseline py-6" style={{ borderTop: '1px solid rgba(201,169,110,0.25)' }}>
        <span className="font-cormorant text-[22px] font-light text-noir-white">Total</span>
        <span className="font-caps text-[28px] text-noir-gold">
          R$ {total.toFixed(2).replace('.', ',')}
        </span>
      </div>

      <p className="font-body text-[12px] text-noir-white/45 leading-relaxed">
        Inclui 10% de taxa de serviço. Pagamento ao final da visita.
      </p>
    </div>
  )
}
```

- [ ] Save file

### Task B.3: Cart page

**File:** `src/app/cart/page.tsx`

- [ ] Read the current file — preserve all logic (`useApp`, `router`, `confirmOrder`)
- [ ] `AppContext` API: use `updateCartQuantity(dishId, newQty)` for qty changes, `removeFromCart(dishId)` for removal — **do NOT pass a second argument to `removeFromCart`**
- [ ] New layout: two-panel grid `[1fr_400px]`:

```tsx
'use client'

import { useApp } from '@/context/AppContext'
import { useRouter } from 'next/navigation'
import CartItem from '@/components/CartItem'
import OrderSummary from '@/components/OrderSummary'

export default function CartPage() {
  const { cart, updateCartQuantity, removeFromCart, confirmOrder } = useApp()
  const router = useRouter()

  const handleConfirm = () => {
    confirmOrder()
    router.push('/confirmation')
  }

  return (
    <div className="min-h-screen bg-noir-black grid" style={{ gridTemplateColumns: '1fr 400px' }}>
      {/* Left: Items */}
      <div
        className="py-16 px-16"
        style={{ borderRight: '1px solid rgba(240,234,224,0.06)' }}
      >
        <p className="font-body text-[10px] tracking-[0.4em] uppercase text-noir-gold mb-4">
          Seu Pedido
        </p>
        <h1 className="font-cormorant text-[48px] font-light text-noir-white leading-tight mb-12">
          Revise<br />sua <em>seleção</em>
        </h1>

        {cart.length === 0 ? (
          <div className="mt-16 text-center">
            <p className="font-script text-[32px] text-noir-white/15 mb-6">carrinho vazio…</p>
            <button
              onClick={() => router.push('/')}
              className="font-body text-[10px] tracking-[0.3em] uppercase text-noir-gold border border-noir-gold/30 px-6 py-3 hover:bg-noir-gold hover:text-noir-black transition-all"
            >
              ← Ver Cardápio
            </button>
          </div>
        ) : (
          <div style={{ borderTop: '1px solid rgba(240,234,224,0.07)' }}>
            {cart.map(item => (
              <CartItem
                key={item.dish.id}
                item={item}
                onIncrease={() => updateCartQuantity(item.dish.id, item.quantity + 1)}
                onDecrease={() => updateCartQuantity(item.dish.id, item.quantity - 1)}
                onRemove={() => removeFromCart(item.dish.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Right: Summary — bg-noir-black with slight elevation */}
      <div
        className="py-16 px-14 flex flex-col bg-noir-black"
        style={{ borderLeft: '1px solid rgba(240,234,224,0.06)' }}
      >
        <p className="font-body text-[10px] tracking-[0.4em] uppercase text-noir-gold mb-8">
          Resumo do Pedido
        </p>

        <OrderSummary items={cart} />

        <div className="flex-1" />

        {/* Notes textarea */}
        <div className="mb-6">
          <label className="block font-body text-[9px] tracking-[0.3em] uppercase text-noir-gray mb-2.5">
            Observações para a cozinha
          </label>
          <textarea
            className="w-full bg-noir-white/4 font-body text-[12px] text-noir-white placeholder-noir-white/20 resize-none h-20 px-3.5 py-3 outline-none transition-colors"
            style={{ border: '1px solid rgba(240,234,224,0.1)' }}
            placeholder="Ex: sem glúten, alergia a frutos do mar…"
          />
        </div>

        <button
          onClick={handleConfirm}
          disabled={cart.length === 0}
          className="w-full bg-noir-gold text-noir-black font-body text-[11px] tracking-[0.4em] uppercase py-4 hover:bg-noir-bronze transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M5 13l4 4L19 7" />
          </svg>
          Confirmar Pedido
        </button>
        <button
          onClick={() => router.push('/')}
          className="mt-4 text-center font-body text-[10px] tracking-[0.2em] uppercase text-noir-white/25 hover:text-noir-gold transition-colors w-full"
        >
          ← Voltar ao Cardápio
        </button>
      </div>
    </div>
  )
}
```

- [ ] Save file

### Task B.4: ConfirmationView

**File:** `src/components/ConfirmationView.tsx`

- [ ] Read the current file — preserve animated checkmark logic, update only colors/fonts
- [ ] Replace `font-playfair` → `font-cormorant`, `font-inter` → `font-body`, update color tokens
- [ ] The animated checkmark SVG and `latestOrder` display logic must remain identical

### Task B.5: StatusTracker

**File:** `src/components/StatusTracker.tsx`

- [ ] Read the current file — preserve `steps`, `currentIndex` logic
- [ ] Replace `font-playfair`/`font-inter` → `font-cormorant`/`font-body`
- [ ] Progress bar: `bg-noir-gold`, dots: inactive `bg-noir-gray`, active `bg-noir-gold` with `box-shadow: 0 0 6px #C9A96E`
- [ ] Labels: `font-body text-[11px]`

### Task B.6: confirmation and status pages

**Files:** `src/app/confirmation/page.tsx`, `src/app/status/page.tsx`

- [ ] Read both files
- [ ] **DO NOT touch redirect guard `useEffect` blocks or any routing logic**
- [ ] Update only the wrapper `className` values: replace `bg-noir-white` → `bg-noir-black`, update any font/color tokens

### Task B.7: Verify Agent B

- [ ] Run: `npx tsc --noEmit`
- [ ] Expected: zero errors
- [ ] Run: `npm run lint`
- [ ] Expected: zero errors
- [ ] Commit:

```bash
git add src/components/CartItem.tsx src/components/OrderSummary.tsx src/components/ConfirmationView.tsx src/components/StatusTracker.tsx src/app/cart/page.tsx src/app/confirmation/page.tsx src/app/status/page.tsx
git commit -m "feat: refactor order flow components to editorial fine-dining design"
```

---

## Agent C — Kitchen Components

**Reads spec sections:** 4.9, 4.10, 4.11

### Task C.1: KanbanCard

**File:** `src/components/KanbanCard.tsx`

- [ ] Read the current file — preserve all props, `formatElapsed`, `STATUS_NEXT_LABEL`, `onAdvance`, `onClick`
- [ ] New visual: dark bg by status, 3px colored left border, 14px dish names at 88% opacity, 16px ID, 11px buttons:

```tsx
'use client'

import { motion } from 'framer-motion'
import type { Order, OrderStatus } from '@/types'

const STATUS_NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  received: 'Iniciar Preparo',
  preparing: 'Marcar Pronto',
}

const STATUS_CARD_STYLE: Record<string, { background: string; borderLeft: string }> = {
  received: { background: '#1C1510', borderLeft: '3px solid #C9A96E' },
  preparing: { background: '#1c1505', borderLeft: '3px solid #f59e0b' },
  ready:     { background: '#0e1c10', borderLeft: '3px solid #4ade80' },
}

const BTN_STYLE: Record<string, { border: string; color: string; background: string }> = {
  received: {
    border: '1px solid rgba(201,169,110,0.5)',
    color: '#C9A96E',
    background: 'rgba(201,169,110,0.1)',
  },
  preparing: {
    border: '1px solid rgba(74,222,128,0.5)',
    color: '#4ade80',
    background: 'rgba(74,222,128,0.08)',
  },
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
  const cardStyle = STATUS_CARD_STYLE[order.status] ?? STATUS_CARD_STYLE.received
  const btnStyle = order.status !== 'ready' ? BTN_STYLE[order.status] : undefined

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className="cursor-pointer transition-all hover:-translate-y-0.5"
      style={{
        background: cardStyle.background,
        border: '1px solid rgba(240,234,224,0.1)',
        borderLeft: cardStyle.borderLeft, /* must come AFTER border shorthand to avoid being overwritten */
        padding: '18px 20px',
      }}
      onClick={() => onClick(order)}
    >
      {/* Top row */}
      <div className="flex items-center justify-between mb-3.5">
        <span className="font-caps text-[16px] text-noir-gold tracking-wide">
          {order.id}
        </span>
        <span className="font-body text-[12px] text-noir-white/55">
          {formatElapsed(order.createdAt)}
        </span>
      </div>

      {/* Items */}
      <ul className="space-y-2 mb-4">
        {order.items.map(item => (
          <li key={item.dish.id} className="flex items-baseline gap-2.5 font-body text-[14px] text-noir-white/88">
            <span className="font-caps text-[13px] text-noir-gold min-w-[22px] flex-shrink-0">
              ×{item.quantity}
            </span>
            {item.dish.name}
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div
        className="flex items-center justify-between pt-3.5"
        style={{ borderTop: '1px solid rgba(240,234,224,0.1)' }}
        onClick={e => e.stopPropagation()}
      >
        <span className="font-body text-[12px] text-noir-white/55 tracking-widest uppercase">
          R$ {order.totalAmount.toFixed(2).replace('.', ',')}
        </span>
        {nextLabel && btnStyle && (
          <button
            onClick={() => onAdvance(order.id)}
            className="font-body text-[11px] tracking-[0.2em] uppercase px-4 py-2 transition-all hover:opacity-90"
            style={btnStyle}
          >
            {nextLabel}
          </button>
        )}
        {order.status === 'ready' && (
          <span
            className="font-body text-[12px] uppercase tracking-wide flex items-center gap-2"
            style={{ color: '#4ade80' }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: '#4ade80', animation: 'pulse 1.5s infinite' }}
            />
            Aguardando retirada
          </span>
        )}
      </div>
    </motion.div>
  )
}
```

- [ ] Save file

### Task C.2: KanbanColumn

**File:** `src/components/KanbanColumn.tsx`

- [ ] Read the current file — preserve all props (`orders`, `status`, `onAdvance`, `onCardClick`)
- [ ] **Do NOT add a `title` prop** — keep the column label as an internal lookup (same pattern as today's `COLUMN_LABELS`)
- [ ] New design: colored dot with glow, Cormorant SC title, count badge, sticky header:

```tsx
'use client'

import { AnimatePresence } from 'framer-motion'
import KanbanCard from './KanbanCard'
import type { Order, OrderStatus } from '@/types'

const COLUMN_LABELS: Record<OrderStatus, string> = {
  received:  'Novos Pedidos',
  preparing: 'Em Preparo',
  ready:     'Prontos',
  delivered: 'Entregues',
}

const DOT_STYLE: Record<OrderStatus, { background: string; boxShadow: string }> = {
  received:  { background: '#C9A96E', boxShadow: '0 0 6px rgba(201,169,110,0.5)' },
  preparing: { background: '#f59e0b', boxShadow: '0 0 6px rgba(245,158,11,0.5)' },
  ready:     { background: '#4ade80', boxShadow: '0 0 6px rgba(74,222,128,0.5)' },
  delivered: { background: '#9A9088', boxShadow: 'none' },
}

interface KanbanColumnProps {
  status: OrderStatus
  orders: Order[]
  onAdvance: (orderId: string) => void
  onCardClick: (order: Order) => void
}

export default function KanbanColumn({ status, orders, onAdvance, onCardClick }: KanbanColumnProps) {
  const dotStyle = DOT_STYLE[status]
  const title = COLUMN_LABELS[status]

  return (
    <div className="flex flex-col" style={{ background: '#110f0c', minHeight: 'calc(100vh - 112px)' }}>
      {/* Column header */}
      <div
        className="sticky top-[57px] z-10 flex items-center gap-3 px-6 py-5"
        style={{ background: '#110f0c', borderBottom: '2px solid rgba(240,234,224,0.08)' }}
      >
        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={dotStyle} />
        <span className="font-caps text-[13px] tracking-[0.25em] uppercase text-noir-white flex-1">
          {title}
        </span>
        <span
          className="w-6 h-6 rounded-full flex items-center justify-center font-body text-[13px] text-noir-white"
          style={{ background: 'rgba(240,234,224,0.12)' }}
        >
          {orders.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2.5 p-3.5 flex-1">
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
          <p className="text-center font-script text-[26px] text-noir-white/15 leading-relaxed pt-10 px-4">
            os pratos<br />seguem em preparo…
          </p>
        )}
      </div>
    </div>
  )
}
```

- [ ] Save file

### Task C.3: KanbanBoard

**File:** `src/components/KanbanBoard.tsx`

- [ ] Read the current file — preserve all column filtering logic and `OrderDetailModal` state
- [ ] Update only the wrapper div classes: `bg-noir-black` base, `gap-[1px]` board grid, background `rgba(240,234,224,0.08)` for gap color

### Task C.4: OrderDetailModal

**File:** `src/components/OrderDetailModal.tsx`

- [ ] Read the current file — preserve all props, advance logic, AnimatePresence
- [ ] Replace color tokens: `bg-noir-cream` → `bg-noir-ember`, `text-noir-black` → `text-noir-white`, `font-inter` → `font-body`, `font-playfair` → `font-cormorant`
- [ ] Backdrop: `rgba(9,8,6,0.85)` with `backdropFilter: blur(4px)`

### Task C.5: Kitchen page

**File:** `src/app/kitchen/page.tsx`

- [ ] Read the current file — preserve `setView('kitchen')` useEffect, `useApp()` calls
- [ ] Add timebar block above the board (inline in this file, no new component):

```tsx
// Timebar — add between header and KanbanBoard
<div
  className="flex items-center gap-10 px-10 py-3"
  style={{ background: '#0f0d0a', borderBottom: '1px solid rgba(240,234,224,0.08)' }}
>
  <div>
    <strong className="font-caps text-[20px] text-noir-gold block mb-0.5">
      {activeOrders.length}
    </strong>
    <span className="font-body text-[11px] tracking-[0.2em] uppercase text-noir-white/50">
      Pedidos ativos
    </span>
  </div>
  <div>
    <strong className="font-caps text-[20px] text-noir-gold block mb-0.5">~12 min</strong>
    <span className="font-body text-[11px] tracking-[0.2em] uppercase text-noir-white/50">
      Tempo médio
    </span>
  </div>
  <div>
    <strong className="font-caps text-[20px] text-noir-gold block mb-0.5" id="kitchen-time">
      {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
    </strong>
    <span className="font-body text-[11px] tracking-[0.2em] uppercase text-noir-white/50">
      Horário atual
    </span>
  </div>
</div>
```

- [ ] `activeOrders` = `orders.filter(o => o.status !== 'delivered')` (already available from `useApp()`)
- [ ] Do not add a `setInterval` for the clock — static time on render is sufficient for demo

### Task C.6: Verify Agent C

- [ ] Run: `npx tsc --noEmit`
- [ ] Expected: zero errors
- [ ] Run: `npm run lint`
- [ ] Expected: zero errors
- [ ] Commit:

```bash
git add src/components/KanbanBoard.tsx src/components/KanbanColumn.tsx src/components/KanbanCard.tsx src/components/OrderDetailModal.tsx src/app/kitchen/page.tsx
git commit -m "feat: refactor kitchen kanban components to editorial fine-dining design"
```

---

## Agent D — Header

**Reads spec section:** 4.12

### Task D.1: Header

**File:** `src/components/Header.tsx`

- [ ] Read the current file — preserve ALL logic: `useApp()`, `setView`, `cartItemCount`, `router`, `motion.button`, `motion.span` badge animation, spacer div for kitchen
- [ ] Only change visual classes:
  - Container: remove `rounded-full` from persona switcher, use rectangular pill with `border border-noir-gold/40`
  - Logo: `font-playfair` → `font-caps`, `text-2xl` → `text-[18px]`, `tracking-widest` → `tracking-[0.5em]`
  - Persona buttons: remove `rounded-full`, square pill, `font-body text-[11px] tracking-[0.2em] uppercase`
  - Active persona: `bg-noir-gold text-noir-black` (keep)
  - Inactive persona: `text-noir-white/50 hover:text-noir-white` (was `/70`)
  - Container bg: `bg-noir-black/95 backdrop-blur-sm` (keep), `border-b border-noir-white/8`
  - Cart badge: `font-body` instead of `font-bold`

- [ ] Save file

### Task D.2: Verify Agent D

- [ ] Run: `npx tsc --noEmit`
- [ ] Expected: zero errors
- [ ] Run: `npm run lint`
- [ ] Expected: zero errors
- [ ] Commit:

```bash
git add src/components/Header.tsx
git commit -m "feat: refactor Header to Cormorant SC logo and rectangular persona pill"
```

---

## Final Verification (run after all agents complete)

- [ ] Start dev server: `npm run dev`
- [ ] Open `http://localhost:3000` — verify hero section, dish grid, tabs, modal
- [ ] Add dishes to cart, open `/cart` — verify two-panel layout, totals
- [ ] Confirm order — verify `/confirmation` redirect to `/status`
- [ ] Switch to Cozinha — verify kanban board, timebar, card colors by status
- [ ] Advance an order through all statuses
- [ ] Run final: `npx tsc --noEmit && npm run lint`
- [ ] Expected: both pass with zero errors
