# MicroShop Corrections P1–P13 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all 13 identified issues in `ecommerce-micro` — Hero video, BentoGrid images, PT-BR categories, R$ prices, accent-bg button, nav links, FOUC, footer, card mask, and admin fields.

**Architecture:** Pure frontend changes — no routing changes, no new stores, no new routes. We add two utility modules (`formatBRL`, `categoryLabels`), one new layout component (`StoreFooter`), extend the `StoreConfig` type with one field, and edit ~12 existing files.

**Tech Stack:** Vite 5, React 19, TypeScript strict, Tailwind CSS 3, Zustand 5, TanStack Router v1

---

> **No test infrastructure exists** in this project. All verification is done via `npm run build` (type-check + bundle) and visual inspection in the browser (`npm run dev`). Each task ends with a build check commit instead of a test run.

---

## File Map

| Action | File | Reason |
|---|---|---|
| Create | `src/lib/formatBRL.ts` | P4 — currency formatter (R$ pt-BR) |
| Create | `src/lib/categoryLabels.ts` | P3 — EN→PT-BR category map |
| Create | `src/components/layout/StoreFooter.tsx` | P13 — footer component |
| Modify | `src/types/index.ts` | Add `bannerEyebrow` to `StoreConfig` |
| Modify | `src/stores/useStoreConfig.ts` | Fix `nomeLoja`, `bannerUrl`, add `bannerEyebrow` default |
| Modify | `src/index.css` | P6 — fix `--cor-principal` initial value |
| Modify | `src/components/HeroBanner.tsx` | P1+P5+P9 — video/image/eyebrow/scroll |
| Modify | `src/routes/index.tsx` | P2+P3+P4+P11 — BentoGrid images/translations/prices/links |
| Modify | `src/components/ProductCard.tsx` | P3+P4 — category translation + R$ prices |
| Modify | `src/components/FilterBar.tsx` | P3+P4 — category chips + slider label |
| Modify | `src/components/CartItem.tsx` | P4 — R$ prices |
| Modify | `src/components/OrderSummary.tsx` | P4+P8+P10 — R$ prices + accent-bg + token fix |
| Modify | `src/routes/produto/$id.tsx` | P3+P4 — category + R$ price |
| Modify | `src/routes/checkout/index.tsx` | P4+P12 — R$ prices + card mask |
| Modify | `src/routes/checkout/sucesso.tsx` | P4 — R$ prices |
| Modify | `src/routes/admin/index.tsx` | P9 — eyebrow field |
| Modify | `src/components/layout/StoreHeader.tsx` | P7 — nav links |
| Modify | `src/routes/__root.tsx` | P13 — mount StoreFooter |
| Add asset | `public/hero-loop.mp4` | P1 — video file (downloaded manually) |

---

## Task 1: Foundation — Utility Modules

**Files:**
- Create: `src/lib/formatBRL.ts`
- Create: `src/lib/categoryLabels.ts`

### Why these first
Both utilities are imported by ~10 files. Creating them first lets every subsequent task import and use them without ordering issues.

- [ ] **Step 1: Create `src/lib/formatBRL.ts`**

```ts
export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}
// formatBRL(21.99) → "R$ 21,99"
// formatBRL(168)   → "R$ 168,00"
```

- [ ] **Step 2: Create `src/lib/categoryLabels.ts`**

```ts
const CATEGORY_MAP: Record<string, string> = {
  "men's clothing":   'Masculino',
  "jewelery":         'Joias',
  "electronics":      'Eletrônicos',
  "women's clothing": 'Feminino',
}

export function translateCategory(raw: string): string {
  return CATEGORY_MAP[raw.toLowerCase()] ?? raw
}
```

- [ ] **Step 3: Verify TypeScript accepts new files**

Run: `npx tsc -b --noEmit`
Expected: no errors (files are pure exports, no imports yet)

- [ ] **Step 4: Commit**

```bash
git add src/lib/formatBRL.ts src/lib/categoryLabels.ts
git commit -m "feat: add formatBRL and translateCategory utility modules"
```

---

## Task 2: Types + Store + CSS (Foundation Data Layer)

**Files:**
- Modify: `src/types/index.ts` — add `bannerEyebrow`
- Modify: `src/stores/useStoreConfig.ts` — fix defaults
- Modify: `src/index.css` — FOUC fix (P6)

### Why these before components
Components that read `bannerEyebrow` need the type to be declared first or TypeScript will fail.

- [ ] **Step 1: Add `bannerEyebrow` to `StoreConfig` interface in `src/types/index.ts`**

Current interface ends at `bannerSubtitulo`. Add one field after it:
```ts
// src/types/index.ts — StoreConfig interface, after bannerSubtitulo:
bannerEyebrow: string
```

Full interface after change:
```ts
export interface StoreConfig {
  nomeLoja: string
  logotipoUrl: string | null
  corPrincipal: string
  bannerUrl: string
  bannerTitulo: string
  bannerSubtitulo: string
  bannerEyebrow: string
}
```

- [ ] **Step 2: Update `DEFAULT_CONFIG` in `src/stores/useStoreConfig.ts`**

```ts
// src/stores/useStoreConfig.ts — replace DEFAULT_CONFIG:
const DEFAULT_CONFIG: StoreConfig = {
  nomeLoja: 'MicroShop',
  logotipoUrl: null,
  corPrincipal: '#0066CC',
  bannerUrl: '',
  bannerTitulo: 'Bem-vindo à nossa loja',
  bannerSubtitulo: 'Encontre o produto perfeito',
  bannerEyebrow: 'Nova Coleção',
}
```

Changes vs current:
- `nomeLoja`: `'My Store'` → `'MicroShop'`
- `bannerUrl`: `'/assets/banner-default.jpg'` → `''` (empty = use video by default)
- Added `bannerEyebrow: 'Nova Coleção'`

- [ ] **Step 3: Fix FOUC in `src/index.css` — change `--cor-principal` initial value**

Find this block:
```css
:root {
  --cor-principal: #000000;
```

Change to:
```css
:root {
  --cor-principal: #0066CC;
```

This aligns the CSS initial value with the Zustand default, eliminating the black flash before `useAccentColor` fires.

- [ ] **Step 4: Type-check**

Run: `npx tsc -b --noEmit`
Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add src/types/index.ts src/stores/useStoreConfig.ts src/index.css
git commit -m "feat: add bannerEyebrow type, fix store defaults, fix FOUC css var"
```

---

## Task 3: HeroBanner — Video/Image/Eyebrow (P1 + P5 + P9)

**Files:**
- Modify: `src/components/HeroBanner.tsx`

### What changes
1. Read `bannerUrl` and `bannerEyebrow` from store (currently only reads `bannerTitulo`/`bannerSubtitulo`)
2. Replace hardcoded `<video src="/src/assets/hero-loop.mp4">` with conditional: if `bannerUrl` → `<img>`, else → `<video src="/hero-loop.mp4">` (correct public path)
3. Replace hardcoded `"Coleção 2026"` eyebrow with `{bannerEyebrow}`
4. Translate `scroll` → `rolar`

- [ ] **Step 1: Update store destructure in `HeroBanner.tsx` (line 5)**

```tsx
// Before:
const { bannerTitulo, bannerSubtitulo } = useStoreConfig((s) => s.config)

// After:
const { bannerTitulo, bannerSubtitulo, bannerUrl, bannerEyebrow } = useStoreConfig((s) => s.config)
```

- [ ] **Step 2: Replace the `<video>` block (lines 26–35) with conditional image/video**

```tsx
{/* Background layer — priority: image > video > animated gradient */}
{bannerUrl ? (
  <img
    src={bannerUrl}
    alt=""
    aria-hidden="true"
    className="absolute inset-0 w-full h-full object-cover z-0"
    style={{ opacity: 0.35 }}
  />
) : (
  <video
    autoPlay
    muted
    loop
    playsInline
    className="absolute inset-0 w-full h-full object-cover z-0"
    style={{ opacity: 0.35 }}
  >
    <source src="/hero-loop.mp4" type="video/mp4" />
  </video>
)}
```

Note: path is `/hero-loop.mp4` (root-relative, served from `/public/`) — NOT `/src/assets/hero-loop.mp4`.

- [ ] **Step 3: Replace hardcoded eyebrow text (line 52)**

```tsx
// Before:
Coleção 2026

// After:
{bannerEyebrow}
```

- [ ] **Step 4: Translate scroll cue (line 127)**

```tsx
// Before:
<span className="text-[10px] text-white/30 uppercase tracking-widest">scroll</span>

// After:
<span className="text-[10px] text-white/30 uppercase tracking-widest">rolar</span>
```

- [ ] **Step 5: Type-check**

Run: `npx tsc -b --noEmit`
Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add src/components/HeroBanner.tsx
git commit -m "fix: hero uses bannerUrl/bannerEyebrow from store, correct video path, rolar cue"
```

- [ ] **Step 7: Add hero video asset**

Download a free looping video (Pexels/Pixabay, CC0 license) with neutral theme: fashion, lifestyle, abstract bokeh, or product shoot. Duration 10–30s, 1080p or 720p, MP4.

Save to: `public/hero-loop.mp4`

Verify file exists:
```bash
ls public/hero-loop.mp4
```

- [ ] **Step 8: Commit the video asset**

```bash
git add public/hero-loop.mp4
git commit -m "feat: add hero-loop.mp4 video asset to public/"
```

> **Note:** If the video is large (>50MB), consider .gitignore-ing it and documenting the download URL in CLAUDE.md instead. Most Pexels videos at 720p are 10–30MB.

---

## Task 4: BentoGrid — Images + Translations + Prices + Links (P2 + P3 + P4 + P11)

**Files:**
- Modify: `src/routes/index.tsx`

### What changes
1. Import `formatBRL` and `translateCategory`
2. Big card: fix image to fill card (`absolute inset-0 w-full h-full object-contain p-12`)
3. Small cards: enlarge images (`w-24 h-24` instead of `w-16 h-16`)
4. Translate all category labels
5. Format all prices as R$
6. Add "Ver todos →" links to section headers

- [ ] **Step 1: Add imports at top of `src/routes/index.tsx` (after existing imports)**

```tsx
import { formatBRL } from '../lib/formatBRL'
import { translateCategory } from '../lib/categoryLabels'
```

- [ ] **Step 2: Fix big card image (line 31–36)**

```tsx
// Before:
<img
  src={big.image}
  alt={big.title}
  className="absolute top-8 right-8 w-32 h-32 object-contain"
  style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))', animation: 'float 5s ease-in-out infinite' }}
/>

// After:
<img
  src={big.image}
  alt={big.title}
  className="absolute inset-0 w-full h-full object-contain p-12"
  style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))', animation: 'float 5s ease-in-out infinite' }}
/>
```

- [ ] **Step 3: Translate big card category (line 37)**

```tsx
// Before:
<span className="text-xs text-white/40 uppercase tracking-widest mb-1">{big.category}</span>

// After:
<span className="text-xs text-white/40 uppercase tracking-widest mb-1">{translateCategory(big.category)}</span>
```

- [ ] **Step 4: Format big card price (line 39)**

```tsx
// Before:
<span className="text-white font-bold text-xl">${big.price.toFixed(2)}</span>

// After:
<span className="text-white font-bold text-xl">{formatBRL(big.price)}</span>
```

- [ ] **Step 5: Translate small card categories (line 56)**

```tsx
// Before:
{product.category}

// After:
{translateCategory(product.category)}
```

- [ ] **Step 6: Format small card prices (line 67)**

```tsx
// Before:
${product.price.toFixed(2)}

// After:
{formatBRL(product.price)}
```

- [ ] **Step 7: Enlarge small card images (line 72)**

```tsx
// Before:
className="w-16 h-16 object-contain"

// After:
className="w-24 h-24 object-contain"
```

- [ ] **Step 8: Add "Ver todos →" to "Em Destaque" section header (lines 105–110)**

The current section header div has only the title block. Add the link to the right side:

```tsx
// Before (lines 105–110):
<div className="flex items-baseline justify-between mb-10">
  <div>
    <p className="text-xs font-semibold uppercase tracking-[0.1em] text-text-secondary mb-1">Seleção especial</p>
    <h2 className="text-[40px] font-bold tracking-[-1.2px] text-text-primary">Em Destaque</h2>
  </div>
</div>

// After:
<div className="flex items-baseline justify-between mb-10">
  <div>
    <p className="text-xs font-semibold uppercase tracking-[0.1em] text-text-secondary mb-1">Seleção especial</p>
    <h2 className="text-[40px] font-bold tracking-[-1.2px] text-text-primary">Em Destaque</h2>
  </div>
  <Link to="/" className="text-sm font-medium accent-text hover:opacity-70 transition-opacity">
    Ver todos →
  </Link>
</div>
```

- [ ] **Step 9: Add "Ver todos →" to "Catálogo Completo" section header (lines 118–123)**

```tsx
// Before:
<div className="mb-10">
  <p className="text-xs font-semibold uppercase tracking-[0.1em] mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
    Todos os produtos
  </p>
  <h2 className="text-[40px] font-bold tracking-[-1.2px] text-white">Catálogo Completo</h2>
</div>

// After:
<div className="flex items-baseline justify-between mb-10">
  <div>
    <p className="text-xs font-semibold uppercase tracking-[0.1em] mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
      Todos os produtos
    </p>
    <h2 className="text-[40px] font-bold tracking-[-1.2px] text-white">Catálogo Completo</h2>
  </div>
  <a href="#catalog" className="text-sm font-medium text-white/60 hover:text-white transition-colors">
    Ver todos →
  </a>
</div>
```

- [ ] **Step 10: Type-check**

Run: `npx tsc -b --noEmit`
Expected: no errors

- [ ] **Step 11: Commit**

```bash
git add src/routes/index.tsx
git commit -m "fix: bento grid images, pt-br categories, R$ prices, ver todos links"
```

---

## Task 5: ProductCard — Category + Price (P3 + P4)

**Files:**
- Modify: `src/components/ProductCard.tsx`

- [ ] **Step 1: Read the file to verify current line numbers**

Check lines around 49 (category label) and 61/105 (prices).

- [ ] **Step 2: Add imports**

```tsx
import { formatBRL } from '../lib/formatBRL'
import { translateCategory } from '../lib/categoryLabels'
```

- [ ] **Step 3: Replace category label (near line 49)**

Find the JSX that renders `{product.category}` and wrap it:
```tsx
// Before:
{product.category}

// After:
{translateCategory(product.category)}
```

- [ ] **Step 4: Replace price renders (near lines 61, 105)**

Find all occurrences of `$${...price...toFixed(2)}` pattern and replace with `formatBRL(...)`:
```tsx
// Before (both occurrences):
${product.price.toFixed(2)}

// After:
{formatBRL(product.price)}
```

- [ ] **Step 5: Type-check**

Run: `npx tsc -b --noEmit`
Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add src/components/ProductCard.tsx
git commit -m "fix: ProductCard — translate category, format price as R$"
```

---

## Task 6: FilterBar — Category Chips + Slider Label (P3 + P4)

**Files:**
- Modify: `src/components/FilterBar.tsx`

- [ ] **Step 1: Read the file to verify current line numbers**

Check line ~59 (category chips) and ~91 (slider max price label).

- [ ] **Step 2: Add imports**

```tsx
import { formatBRL } from '../lib/formatBRL'
import { translateCategory } from '../lib/categoryLabels'
```

- [ ] **Step 3: Replace category chip labels (near line 59)**

Find where `category` is rendered in the tab/chip and wrap with `translateCategory`:
```tsx
// Before:
{category}

// After:
{translateCategory(category)}
```

- [ ] **Step 4: Replace slider max price label (near line 91)**

Find the slider label showing `$${maxPrice}` or similar and replace:
```tsx
// Before:
${maxPrice}  (or similar)

// After:
{formatBRL(maxPrice)}
```

- [ ] **Step 5: Type-check**

Run: `npx tsc -b --noEmit`
Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add src/components/FilterBar.tsx
git commit -m "fix: FilterBar — translate category chips, format slider label as R$"
```

---

## Task 7: CartItem — Prices (P4)

**Files:**
- Modify: `src/components/CartItem.tsx`

- [ ] **Step 1: Read the file to verify current line numbers**

Check lines ~37 and ~62 for price renders.

- [ ] **Step 2: Add import**

```tsx
import { formatBRL } from '../lib/formatBRL'
```

- [ ] **Step 3: Replace both price renders**

```tsx
// Before (both occurrences):
$${...price...toFixed(2)}

// After:
{formatBRL(price)}   // or formatBRL(item.price), formatBRL(subtotal), etc. — adapt to actual variable names
```

- [ ] **Step 4: Type-check**

Run: `npx tsc -b --noEmit`
Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add src/components/CartItem.tsx
git commit -m "fix: CartItem — format prices as R$"
```

---

## Task 8: OrderSummary — Prices + accent-bg + Token Fix (P4 + P8 + P10)

**Files:**
- Modify: `src/components/OrderSummary.tsx`

### What changes
Three distinct fixes in one file:
1. Prices → `formatBRL()`
2. Button background: `style={{ background: '#1D1D1F' }}` → `className="accent-bg"`
3. Inline `style={{ color: 'var(--gray-600, #424245)' }}` → `className="text-text-secondary"`

- [ ] **Step 1: Add import**

```tsx
import { formatBRL } from '../lib/formatBRL'
```

- [ ] **Step 2: Fix subtotal price (line 18)**

```tsx
// Before:
<span>${subtotal.toFixed(2)}</span>

// After:
<span>{formatBRL(subtotal)}</span>
```

- [ ] **Step 3: Fix total price (line 31)**

```tsx
// Before:
<span>${subtotal.toFixed(2)}</span>

// After:
<span>{formatBRL(subtotal)}</span>
```

- [ ] **Step 4: Fix "Finalizar Pedido" button (line 38)**

Remove `style={{ background: '#1D1D1F' }}` and add `accent-bg` to className:
```tsx
// Before:
className="w-full py-3.5 rounded-2xl text-white font-semibold text-sm transition-transform hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
style={{ background: '#1D1D1F' }}

// After:
className="w-full py-3.5 rounded-2xl accent-bg text-white font-semibold text-sm transition-transform hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
```

- [ ] **Step 5: Fix orphan CSS var (lines 16, 20)**

```tsx
// Before (both rows):
style={{ color: 'var(--gray-600, #424245)' }}

// After (both rows):
className="text-text-secondary"
```

Note: these rows currently have no `className`. Add it. Remove the `style` prop entirely.

- [ ] **Step 6: Type-check**

Run: `npx tsc -b --noEmit`
Expected: no errors

- [ ] **Step 7: Commit**

```bash
git add src/components/OrderSummary.tsx
git commit -m "fix: OrderSummary — R$ prices, accent-bg button, text-text-secondary token"
```

---

## Task 9: Product Detail Page — Category + Price (P3 + P4)

**Files:**
- Modify: `src/routes/produto/$id.tsx`

- [ ] **Step 1: Read the file to verify current line numbers**

Check line ~76 (category) and ~107 (price).

- [ ] **Step 2: Add imports**

```tsx
import { formatBRL } from '../../lib/formatBRL'
import { translateCategory } from '../../lib/categoryLabels'
```

Note: file is in `src/routes/produto/` so path is `../../lib/`.

- [ ] **Step 3: Replace category (near line 76)**

```tsx
// Before:
{product.category}

// After:
{translateCategory(product.category)}
```

- [ ] **Step 4: Replace price (near line 107)**

```tsx
// Before:
$${product.price.toFixed(2)}

// After:
{formatBRL(product.price)}
```

- [ ] **Step 5: Type-check**

Run: `npx tsc -b --noEmit`
Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add "src/routes/produto/\$id.tsx"
git commit -m "fix: product detail — translate category, format price as R$"
```

---

## Task 10: Checkout — Prices + Card Mask (P4 + P12)

**Files:**
- Modify: `src/routes/checkout/index.tsx`

### What changes
1. Two price renders → `formatBRL()`
2. Card number input: add `formatCardNumber` helper + replace `onChange={handleChange}` with inline formatter

- [ ] **Step 1: Read the file to understand form state pattern**

Check how `form`, `setForm`, `handleChange` are defined. Understand the shape of `form.cartao`.

- [ ] **Step 2: Add import**

```tsx
import { formatBRL } from '../../lib/formatBRL'
```

- [ ] **Step 3: Add `formatCardNumber` helper — define OUTSIDE the component, near the top of the file**

```tsx
function formatCardNumber(value: string): string {
  return value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim()
}
```

- [ ] **Step 4: Replace price renders (near lines 121, 127)**

```tsx
// Before:
$${...price...toFixed(2)}

// After:
{formatBRL(price)}   // adapt to actual variable names
```

- [ ] **Step 5: Replace card input onChange (near lines 99–106)**

```tsx
// Before:
<Input
  name="cartao"
  placeholder="Número do cartão"
  maxLength={19}
  onChange={handleChange}
  required
/>

// After:
<Input
  placeholder="0000 0000 0000 0000"
  maxLength={19}
  value={form.cartao}
  onChange={(e) => setForm((prev) => ({ ...prev, cartao: formatCardNumber(e.target.value) }))}
  required
/>
```

Key changes:
- Remove `name="cartao"` (no longer routed through `handleChange`)
- Add `value={form.cartao}` to make it controlled
- Replace `onChange={handleChange}` with inline formatter

- [ ] **Step 6: Type-check**

Run: `npx tsc -b --noEmit`
Expected: no errors

- [ ] **Step 7: Commit**

```bash
git add src/routes/checkout/index.tsx
git commit -m "fix: checkout — R$ prices, card number mask (XXXX XXXX XXXX XXXX)"
```

---

## Task 11: Checkout Success — Prices (P4)

**Files:**
- Modify: `src/routes/checkout/sucesso.tsx`

- [ ] **Step 1: Read the file to verify current line numbers**

Check lines ~44 and ~52 for price renders.

- [ ] **Step 2: Add import**

```tsx
import { formatBRL } from '../../lib/formatBRL'
```

- [ ] **Step 3: Replace price renders**

```tsx
// Before (both occurrences):
$${...price...toFixed(2)}

// After:
{formatBRL(price)}
```

- [ ] **Step 4: Type-check**

Run: `npx tsc -b --noEmit`
Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add src/routes/checkout/sucesso.tsx
git commit -m "fix: checkout success — format prices as R$"
```

---

## Task 12: StoreHeader — Nav Links (P7)

**Files:**
- Modify: `src/components/layout/StoreHeader.tsx`

### What to add
A centered `<nav>` between the logo `<Link>` and the cart `<Link>`. The links inherit `textClass` for correct color on dark/light backgrounds.

- [ ] **Step 1: Insert nav block inside the header's flex container (after the logo link, before the cart link)**

Current `<div className="... flex items-center justify-between">` has only two children: logo Link and cart Link. Add the nav between them:

```tsx
{/* Nav — hidden on mobile */}
<nav className="hidden md:flex items-center gap-8">
  <a href="/#catalog" className={`text-sm font-medium transition-opacity hover:opacity-70 ${textClass}`}>
    Catálogo
  </a>
  <a href="#" className={`text-sm font-medium transition-opacity hover:opacity-70 ${textClass}`}>
    Novidades
  </a>
  <a href="#" className={`text-sm font-medium transition-opacity hover:opacity-70 ${textClass}`}>
    Ofertas
  </a>
</nav>
```

- [ ] **Step 2: Type-check**

Run: `npx tsc -b --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/StoreHeader.tsx
git commit -m "feat: add Catálogo/Novidades/Ofertas nav links to StoreHeader"
```

---

## Task 13: Admin Panel — Eyebrow Field (P9)

**Files:**
- Modify: `src/routes/admin/index.tsx`

- [ ] **Step 1: Read the file to understand form layout**

Find where `bannerTitulo` and `bannerSubtitulo` inputs are rendered. The new `bannerEyebrow` field goes after these, before or after `bannerUrl`.

- [ ] **Step 2: Add the eyebrow field**

```tsx
<div>
  <Label htmlFor="bannerEyebrow">Eyebrow do Banner</Label>
  <Input
    id="bannerEyebrow"
    value={config.bannerEyebrow}
    onChange={(e) => updateConfig({ bannerEyebrow: e.target.value })}
    placeholder="Ex: Nova Coleção"
  />
</div>
```

- [ ] **Step 3: Type-check**

Run: `npx tsc -b --noEmit`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/routes/admin/index.tsx
git commit -m "feat: add bannerEyebrow input to admin panel"
```

---

## Task 14: StoreFooter — Create + Mount (P13)

**Files:**
- Create: `src/components/layout/StoreFooter.tsx`
- Modify: `src/routes/__root.tsx`

### What to build
Three-column footer with dark background (`#1D1D1F`), dynamic store name from `useStoreConfig`, nav links, and copyright line. Mounted once in `__root.tsx` so it appears on every page.

- [ ] **Step 1: Create `src/components/layout/StoreFooter.tsx`**

```tsx
// src/components/layout/StoreFooter.tsx
import { useStoreConfig } from '../../stores/useStoreConfig'

export function StoreFooter() {
  const nomeLoja = useStoreConfig((s) => s.config.nomeLoja)

  return (
    <footer style={{ background: '#1D1D1F' }} className="text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Column 1 — Brand */}
          <div>
            <p className="text-white/90 font-semibold text-lg mb-3">{nomeLoja}</p>
            <p className="text-white/60 text-sm leading-relaxed">
              Produtos selecionados com qualidade premium.
            </p>
          </div>

          {/* Column 2 — Navigation */}
          <div>
            <p className="text-white/90 font-semibold text-sm uppercase tracking-widest mb-4">Navegação</p>
            <ul className="space-y-2">
              {[
                { label: 'Catálogo', href: '/#catalog' },
                { label: 'Novidades', href: '#' },
                { label: 'Ofertas', href: '#' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="text-white/60 text-sm hover:text-white transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Institutional */}
          <div>
            <p className="text-white/90 font-semibold text-sm uppercase tracking-widest mb-4">Institucional</p>
            <ul className="space-y-2">
              {[
                { label: 'Sobre', href: '#' },
                { label: 'Contato', href: '#' },
                { label: 'Política de Privacidade', href: '#' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="text-white/60 text-sm hover:text-white transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div
          className="mt-12 pt-6 text-center text-white/40 text-xs"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          © 2026 {nomeLoja}. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Mount `StoreFooter` in `src/routes/__root.tsx`**

```tsx
// Before:
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { useAccentColor } from '../hooks/useAccentColor'

function RootLayout() {
  useAccentColor()
  return <Outlet />
}

// After:
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { useAccentColor } from '../hooks/useAccentColor'
import { StoreFooter } from '../components/layout/StoreFooter'

function RootLayout() {
  useAccentColor()
  return (
    <>
      <Outlet />
      <StoreFooter />
    </>
  )
}
```

- [ ] **Step 3: Type-check**

Run: `npx tsc -b --noEmit`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/StoreFooter.tsx src/routes/__root.tsx
git commit -m "feat: add StoreFooter component, mount in root layout"
```

---

## Task 15: Final Build Verification

**Goal:** Confirm `npm run build` passes cleanly with all 13 fixes in place.

- [ ] **Step 1: Full build**

Run: `npm run build`
Expected: No TypeScript errors, no ESLint errors, bundle output in `dist/`

If the build fails, diagnose the error and fix it before proceeding.

- [ ] **Step 2: Visual smoke check**

Run: `npm run preview`

Open `http://localhost:4173` and verify:
- [ ] Hero: animated video plays (not black screen), no flash of black on accent elements
- [ ] Hero eyebrow shows "Nova Coleção" (or whatever `bannerEyebrow` default is), scroll cue says "rolar"
- [ ] BentoGrid: big card image fills the card prominently; small cards have larger images
- [ ] All category labels in PT-BR: "Masculino", "Joias", "Eletrônicos", "Feminino"
- [ ] All prices formatted as `R$ X,XX` (comma decimal, R$ prefix)
- [ ] Header has "Catálogo | Novidades | Ofertas" links centered (visible on desktop)
- [ ] Cart page → "Finalizar Pedido" button uses accent color (blue by default)
- [ ] Checkout card field formats to `0000 0000 0000 0000` pattern as you type
- [ ] Footer is visible on every page (Home, Cart, Product, Checkout)
- [ ] Admin panel has "Eyebrow do Banner" field; changing it updates the Hero live

- [ ] **Step 3: Test admin bannerUrl field**

In the admin panel, paste any image URL into "URL da imagem do banner". Navigate back to home. Verify the Hero now shows the image instead of the video.

- [ ] **Step 4: Final commit**

```bash
git add .
git commit -m "chore: final build verified — all P1–P13 corrections complete"
```

---

## Acceptance Criteria Checklist

- [ ] Hero exibe vídeo (sem `bannerUrl` configurado) — fundo animado, sem tela preta
- [ ] Admin pode configurar `bannerUrl` e o Hero exibe a imagem no lugar do vídeo
- [ ] `bannerEyebrow` configurável no admin substitui "Coleção 2026" no Hero
- [ ] Todas as categorias exibidas em PT-BR: "Masculino", "Joias", "Eletrônicos", "Feminino"
- [ ] Todos os preços exibidos como `R$ X,XX` (formato brasileiro, vírgula decimal)
- [ ] Header exibe links "Catálogo | Novidades | Ofertas" no centro (ocultos em mobile)
- [ ] Botão "Finalizar Pedido" usa `accent-bg` (respeita cor configurável do admin)
- [ ] Links "Ver todos →" visíveis nas seções "Em Destaque" e "Catálogo Completo"
- [ ] Imagens do BentoGrid: big card centralizada e grande, small cards `w-24 h-24`
- [ ] Carregamento inicial sem flash de cor preta nos elementos de acento
- [ ] Campo de cartão no checkout formata automaticamente: `1234 5678 9012 3456`
- [ ] Footer presente em todas as páginas com nome da loja dinâmico
- [ ] `npm run build` passa sem erros de TypeScript
