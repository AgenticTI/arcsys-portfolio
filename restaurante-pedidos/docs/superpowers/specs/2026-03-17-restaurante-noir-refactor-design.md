# Restaurante Noir — Frontend Refactor Design Spec

**Date:** 2026-03-17
**Project:** `restaurante-pedidos` (Noir Fine Dining)
**Scope:** Full visual refactor of all pages and components, preserving all state/logic
**Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS v3, Framer Motion

---

## 1. Context & Goal

Noir is a fine-dining restaurant ordering demo with two personas: Client (menu → cart → order tracking) and Kitchen (kanban board). The current design uses a generic dark theme. This refactor elevates it to an **editorial fine-dining aesthetic** inspired by the Côte & Cendre Dribbble reference (haute cuisine, Cormorant serif, warm dark palette, generous negative space).

**Constraint:** Zero changes to state, reducers, routing, or data files. Only UI layer changes.

---

## 2. Design Tokens

### 2.1 Tailwind Color Palette (`tailwind.config.ts`)

Replace existing `noir-*` tokens:

| Token | Hex | Usage |
|---|---|---|
| `noir-black` | `#090806` | Base background (warmer than before) |
| `noir-white` | `#F0EAE0` | Text on dark, light surface text |
| `noir-ember` | `#1C1510` | Card backgrounds (dark surfaces) |
| `noir-gold` | `#C9A96E` | Accent: prices, active states, CTA, progress |
| `noir-gray` | `#9A9088` | Secondary text (was #6B6B6B, now more legible) |
| `noir-parchment` | `#EDE7DB` | Light surface backgrounds (split sections) |
| `noir-bronze` | `#8B5E3C` | Tertiary accent, hover states |

**`noir-cream` migration guide** — the old `noir-cream: #E8E4DC` token is removed. Each agent must replace usages as follows:

| Context of old `noir-cream` usage | Replacement |
|---|---|
| Card / modal background (dark context) | `noir-ember` (`#1C1510`) |
| Light-surface / split-section background | `noir-parchment` (`#EDE7DB`) |
| Borders and dividers (any context) | Use the inline rgba pattern: `rgba(240,234,224,0.1)` |
| Qty control containers / chip borders | Use the inline rgba pattern: `rgba(240,234,224,0.18)` |

**Agent 0 must also update `globals.css` body defaults:**
```css
body {
  background-color: theme('colors.noir-black'); /* replaces old #F5F4F0 */
  color: theme('colors.noir-white');            /* replaces old #0A0A0A */
  font-family: var(--font-body), system-ui, sans-serif; /* replaces --font-inter */
}
```

### 2.2 Typography (`src/app/layout.tsx`)

Replace `Playfair_Display` + `Inter` with:

| Font | CSS Var | Tailwind Class | Usage |
|---|---|---|---|
| `Cormorant_Garamond` (300,400,500,600,italic) | `--font-cormorant` | `font-cormorant` | Headings, dish names, editorial titles |
| `Cormorant_SC` (300,400,500) | `--font-caps` | `font-caps` | Logo, prices, labels, order IDs |
| `Italianno` (**weight: '400'** only) | `--font-script` | `font-script` | Decorative script annotations |
| `DM_Sans` (300,400) | `--font-body` | `font-body` | Body text, UI elements, buttons |

All loaded via `next/font/google`. Body font-weight default: 400 for legibility.

**Critical — `next/font/google` import pattern for Agent 0:**
```ts
import { Cormorant_Garamond, Cormorant_SC, Italianno, DM_Sans } from 'next/font/google'

const cormorant = Cormorant_Garamond({
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-cormorant',
})
const cormorantSC = Cormorant_SC({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  variable: '--font-caps',
})
const italianno = Italianno({
  weight: '400', // only available weight — required, do not omit
  subsets: ['latin'],
  variable: '--font-script',
})
const dmSans = DM_Sans({
  weight: ['300', '400'],
  subsets: ['latin'],
  variable: '--font-body',
})
```

**Note:** Use `font-body` (not `font-sans`) for DM Sans to avoid shadowing Tailwind's built-in `font-sans` system token.

---

## 3. Implementation Strategy

### 3.1 Execution Order

**Phase 0 (sequential, must complete first):**
- Agente 0: Design tokens + fonts + global CSS

**Phase 1 (parallel, after Phase 0):**
- Agente A: Client menu components
- Agente B: Order flow components + pages
- Agente C: Kitchen components + page
- Agente D: Header + shared layout

### 3.2 File Ownership (no overlaps)

| Agent | Files |
|---|---|
| 0 | `tailwind.config.ts`, `src/app/globals.css`, `src/app/layout.tsx` |
| A | `HeroSection.tsx`, `CategoryTabs.tsx`, `DishGrid.tsx`, `DishCard.tsx`, `DishModal.tsx`, `src/app/page.tsx` |
| B | `CartItem.tsx`, `OrderSummary.tsx`, `ConfirmationView.tsx`, `StatusTracker.tsx`, `src/app/cart/page.tsx`, `src/app/confirmation/page.tsx`, `src/app/status/page.tsx` |
| C | `KanbanBoard.tsx`, `KanbanColumn.tsx`, `KanbanCard.tsx`, `OrderDetailModal.tsx`, `src/app/kitchen/page.tsx` |
| D | `Header.tsx` |

---

## 4. Component Specs

### 4.1 HeroSection

- Full viewport height (`100vh`), min-height 700px
- Background: Unsplash food photo with multi-stop gradient overlay (`160deg`, transparent → 92% black)
- Layout: CSS grid 2 cols, content anchored to bottom-left
- Left: eyebrow label (gold, 10px, tracking-[0.4em]) + H1 serif 88px/lh 1.02 + description 14px/80% opacity + "Reservar Mesa" outline button (gold border, arrow icon)
- Right: Italianno script annotation + badge with "Top 50 Brasil"
- Scroll hint: animated vertical line + "Explorar" label
- Parallax: passive scroll listener via `useEffect`, `translateY(scrollY * 0.3)`, capped at `100px`, removed on unmount. Use `{ passive: true }` on the event listener to avoid jank.

### 4.2 CategoryTabs

- Horizontal flex, no scroll container border
- Each tab: 10px uppercase, tracking 0.3em, `border-bottom: 2px solid` (transparent → gold on active)
- Active: `text-noir-gold`, inactive: `text-noir-gray/60`, hover: `text-noir-white`

### 4.3 DishGrid + DishCard

- Grid: `grid-cols-3`, gap `2px` (the gap itself becomes a design element)
- First card always `col-span-2` with `aspect-ratio: 16/9` (feature card)
- Other cards: `aspect-ratio: 4/3`
- Card structure: `next/image fill` inside relative container + gradient overlay + absolute info block at bottom
- Info block: category (9px gold) + name (Cormorant 22px, feature: 32px) + truncated desc (13px, 78% opacity) + price (Cormorant SC, gold)
- Hover: `whileHover={{ scale: 1.02 }}` on image + fade in "Ver detalhes →" CTA
- Re-trigger stagger on category change via `key={activeCategory}`

### 4.4 DishModal

- Full-screen backdrop with `backdrop-filter: blur(4px)` + `rgba(9,8,6,0.85)`
- Modal: `max-w-[960px]`, 2-col grid (photo | content), `border: 1px solid rgba(201,169,110,0.15)`
- Left panel: `next/image fill` + bottom gradient overlay + `photo-tag` chip + title in Cormorant
- Right panel: eyebrow → title → price → description (14px/82% opacity) → ingredients chips → pairing list → qty controls + CTA button
- Ingredients: chips with `border: 1px solid rgba(240,234,224,0.18)`, 12px text, 78% opacity
- Pairing items: 13px, 75% opacity, `·` gold bullet prefix
- Close button: absolute top-right, 40×40, border on hover
- Animation: `initial={{ opacity: 0, y: 40, scale: 0.97 }}` spring `{ damping: 28, stiffness: 300 }`

### 4.5 CartItem

- Grid: `80px 1fr auto`
- Thumbnail: 80×80, overflow hidden with `next/image`
- Name: Cormorant 20px/300 weight
- Qty controls: minimal border container, `−` / `+` buttons 28×28
- Remove: 10px uppercase, hover red (`#c0544e`)
- Price: Cormorant SC gold

### 4.6 OrderSummary

- Line items: 13px, 75% opacity, `border-bottom: 1px solid rgba(240,234,224,0.1)`
- Total row: Cormorant 22px label + Cormorant SC 28px gold value
- Service note: 12px, 45% opacity

### 4.7 Cart Page (`/cart`)

- Two-panel layout: `grid-cols-[1fr_400px]`
- Left: eyebrow + Cormorant title "Revise sua seleção" + cart items list
- Right: dark panel `#0d0b08`, order summary + textarea for notes + confirm CTA button (gold fill)

### 4.8 StatusTracker

- Linear progress bar (gold fill, animated width)
- 4 step dots: inactive `noir-gray`, active `noir-gold` with glow
- Step labels: Cormorant or DM Sans 11px

### 4.9 KanbanBoard / Kitchen Page

- Sticky header: logo + "COZINHA" badge (gold border) + green pulsing live dot + persona pill
- Timebar: 3 stats (pedidos ativos, tempo médio, horário) — 11px uppercase, values in Cormorant SC 20px gold. All values are **static/cosmetic display only** — "tempo médio" is hardcoded as `~12 min`, "pedidos ativos" uses `orders.filter(o => o.status !== 'delivered').length` from context, "horário atual" uses `new Date().toLocaleTimeString`. No new state needed.
- Board: 3-col grid, `gap: 1px`, column separators as design element
- Timebar lives inline in `kitchen/page.tsx`, not in a separate component.

### 4.10 KanbanColumn

- Column header: 10px dot with status glow (gold/amber/green) + Cormorant SC 13px title + count badge
- Sticky at `top: 57px` (below header)

### 4.11 KanbanCard

- Background by status: new `#1C1510`, prep `#1c1505`, ready `#0e1c10`
- Left border 3px colored by status: new gold, prep amber, ready green
- Urgent: red border + red background tint
- Order ID: Cormorant SC 16px gold
- Timer: 12px, 55% opacity (urgent: red)
- Dish items: 14px, **88% opacity** (key legibility fix)
- Qty prefix: Cormorant SC 13px gold
- Footer: "Mesa XX" 12px 55% opacity + action button (border + bg tint by status)
- Button text: 11px (was 9px)
- "Aguardando retirada": green 12px with pulsing dot

### 4.12 Header

- Logo: Cormorant SC, letter-spacing 0.5em
- Nav: DM Sans 11px, tracking 0.25em, breadcrumb with `·` separators
- Persona pill: border `rgba(201,169,110,0.4)`, active tab gold fill
- Cart icon: svg + count badge (gold circle, 18×18)
- Gradient fade to transparent below header

---

## 5. Styling Conventions

- **Never hardcode hex values** in JSX — always use Tailwind tokens. Exception: Framer Motion `animate` props.
- **Font classes:** `font-cormorant` for headings, `font-caps` for prices/IDs, `font-script` for decorative, `font-body` for body/UI (never `font-sans` — that shadows Tailwind's built-in token).
- **Opacity pattern:** primary text 100%, secondary 80%, tertiary 55%, disabled 30%.
- **Border pattern:** `rgba(240,234,224,0.1)` for subtle dividers, `rgba(201,169,110,0.3)` for gold-tinted borders.
- **All animated components** marked `'use client'`.

---

## 6. What Does NOT Change

- `src/context/AppContext.tsx` — state, reducer, actions, hooks
- `src/data/menu.ts` — menu data
- `src/data/categories.ts` — category data
- `src/types/index.ts` — TypeScript types
- `next.config.mjs` — image domains
- `package.json` — no new dependencies (DM Sans and Cormorant Garamond available in `next/font/google`; Italianno also available)
- **Redirect guard `useEffect` blocks** in `confirmation/page.tsx` and `status/page.tsx` — these must not be touched. Only visual markup and class names change in those files.
- All `router.push()` / `router.replace()` navigation calls in all page files

---

## 7. Success Criteria

- All 4 mock screens faithfully implemented in the actual Next.js app
- `npx tsc --noEmit` passes with zero errors
- `npm run lint` passes with zero errors
- App runs on `http://localhost:3000` with both Client and Kitchen flows functional
- Typography legible at all viewport sizes (no sub-12px body text)
- No hardcoded colors in component files
