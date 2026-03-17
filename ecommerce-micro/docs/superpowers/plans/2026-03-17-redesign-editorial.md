# MicroShop Editorial Redesign — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor all non-admin pages of MicroShop to an Editorial Apple-inspired style: alternating dark/light sections, CSS-only word-reveal animation in the hero, glassmorphism header, drop-shadow product images, and a bento grid featured section.

**Architecture:** Shared design tokens live in `tailwind.config.ts` and `src/index.css`. Components receive `variant` props (`'dark'|'light'`) where they are used in both contexts. The homepage is restructured into three full-width sections. All animation is pure CSS `@keyframes` defined globally in `index.css` and applied inline via `style` attributes.

**Tech Stack:** Vite 5, React 19, TypeScript strict, TanStack Router, Zustand, Tailwind CSS v3, CSS `@keyframes`, no external animation libraries.

**Spec:** `docs/superpowers/specs/2026-03-17-redesign-editorial-design.md`

**Verification command (run after every task):** `npx tsc -b --noEmit`

---

## File Map

| File | Action | What changes |
|---|---|---|
| `tailwind.config.ts` | Modify | Add `dark-surface`, `card-dark`, `card-img-dark` color tokens |
| `src/index.css` | Modify | Add `@keyframes` (wordReveal, slideUp, fadeIn, float, drift) + `prefers-reduced-motion` |
| `src/stores/useStoreConfig.ts` | Modify | Change `corPrincipal` default from `#000000` to `#0066CC` |
| `src/components/layout/StoreHeader.tsx` | Modify | Dynamic glass theme: transparent→dark on home scroll; always light on other routes |
| `src/components/HeroBanner.tsx` | Rewrite | Video bg + animated fallback + word reveal on title words + badges + scroll cue |
| `src/components/ProductCard.tsx` | Modify | Add `variant: 'dark' \| 'light'` prop; dark = no mix-blend, drop-shadow, dark card bg |
| `src/components/ProductGrid.tsx` | Modify | Pass `variant` prop through to `ProductCard` |
| `src/components/FilterBar.tsx` | Modify | Add `variant: 'dark' \| 'light'` prop; replace `Tabs` with pill `<button>` chips |
| `src/components/CartItem.tsx` | Modify | White card per item, image with drop-shadow, circular qty buttons |
| `src/components/OrderSummary.tsx` | Modify | White card with rounded corners, green shipping, `bg-gray-900` CTA, security seal |
| `src/routes/index.tsx` | Rewrite | Three full-width sections: Hero (dark) + Featured bento (light) + Catalog (dark) |
| `src/routes/produto/$id.tsx` | Modify | Dark bg, dark image container, float animation, drop-shadow, no mix-blend-multiply |
| `src/routes/carrinho/index.tsx` | Modify | `bg-surface`, 2-col sticky layout |
| `src/routes/checkout/index.tsx` | Modify | `bg-surface`, styled inputs with focus ring, OrderSummary in sidebar on lg |

---

## Task 1: Design Tokens + Global CSS

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/index.css`

- [ ] **Step 1.1 — Add color tokens to `tailwind.config.ts`**

  In `tailwind.config.ts`, inside `theme.extend.colors`, add three entries after `accent`:

  ```ts
  'dark-surface': '#0A0A0A',
  'card-dark':    '#141414',
  'card-img-dark':'#1c1c1c',
  ```

  Result: the `colors` block becomes:
  ```ts
  colors: {
    background:       '#FFFFFF',
    surface:          '#F5F5F7',
    'text-primary':   '#1D1D1F',
    'text-secondary': '#6E6E73',
    border:           '#D2D2D7',
    'admin-bg':       '#0F0F0F',
    accent:           'var(--cor-principal)',
    'dark-surface':   '#0A0A0A',
    'card-dark':      '#141414',
    'card-img-dark':  '#1c1c1c',
  },
  ```

- [ ] **Step 1.2 — Add `@keyframes` and `prefers-reduced-motion` to `src/index.css`**

  Append after the existing `@layer utilities` block:

  ```css
  /* ── Global keyframes ── */
  @keyframes wordReveal {
    0%   { opacity: 0; transform: translateY(24px) rotateX(25deg); }
    60%  { opacity: 1; }
    100% { opacity: 1; transform: translateY(0) rotateX(0deg); }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-12px); }
  }
  @keyframes drift {
    from { transform: translate(0, 0) scale(1); }
    to   { transform: translate(-60px, 40px) scale(1.15); }
  }

  /* ── Accessibility: reduced motion ── */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
  ```

- [ ] **Step 1.3 — Verify types**

  ```bash
  cd "C:\Users\leona\Documents\Backup\Portifolio ARCSYS\ecommerce-micro"
  npx tsc -b --noEmit
  ```
  Expected: no errors (config files are not type-checked by tsc directly, but the build should be clean).

- [ ] **Step 1.4 — Commit**

  ```bash
  git add tailwind.config.ts src/index.css
  git commit -m "feat: add design tokens and global CSS keyframes for editorial redesign"
  ```

---

## Task 2: Accent Color Default

**Files:**
- Modify: `src/stores/useStoreConfig.ts`

- [ ] **Step 2.1 — Change `corPrincipal` default**

  In `src/stores/useStoreConfig.ts`, line 15, change:
  ```ts
  corPrincipal: '#000000',
  ```
  to:
  ```ts
  corPrincipal: '#0066CC',
  ```

  > **Important:** This only affects the `DEFAULT_CONFIG` constant. Users who already have `store-config` in localStorage will keep their saved value. The dynamic `--cor-principal` system is untouched.

- [ ] **Step 2.2 — Verify types**

  ```bash
  npx tsc -b --noEmit
  ```
  Expected: no errors.

- [ ] **Step 2.3 — Commit**

  ```bash
  git add src/stores/useStoreConfig.ts
  git commit -m "feat: change default accent color to #0066CC"
  ```

---

## Task 3: StoreHeader — Dynamic Glass Theme

**Files:**
- Modify: `src/components/layout/StoreHeader.tsx`

**How it works:**
- `useRouterState` detects current pathname. On `/`, header starts transparent and transitions to glass-dark when `scrollY > 60`.
- On all other routes, always glass-light.
- Text and icon color adapts to background.

- [ ] **Step 3.1 — Rewrite `StoreHeader.tsx`**

  Replace the entire file content with:

  ```tsx
  // src/components/layout/StoreHeader.tsx
  import { useState, useEffect } from 'react'
  import { Link } from '@tanstack/react-router'
  import { useRouterState } from '@tanstack/react-router'
  import { ShoppingCart } from 'lucide-react'
  import { useStoreConfig } from '../../stores/useStoreConfig'
  import { useCartStore } from '../../stores/useCartStore'

  export function StoreHeader() {
    const { nomeLoja, logotipoUrl } = useStoreConfig((s) => s.config)
    const itemCount = useCartStore((s) => s.itemCount())
    const pathname = useRouterState({ select: (s) => s.location.pathname })
    const isHome = pathname === '/'

    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
      if (!isHome) return
      function handleScroll() {
        setIsScrolled(window.scrollY > 60)
      }
      window.addEventListener('scroll', handleScroll, { passive: true })
      return () => window.removeEventListener('scroll', handleScroll)
    }, [isHome])

    // Dark glass: home + scrolled. Transparent: home + top. Light glass: other routes.
    const isDark = isHome && isScrolled
    const isTransparent = isHome && !isScrolled

    const headerStyle: React.CSSProperties = isTransparent
      ? { background: 'transparent', borderColor: 'transparent' }
      : isDark
        ? { background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255,255,255,0.08)' }
        : { background: 'rgba(245,245,247,0.85)', backdropFilter: 'blur(20px)', borderColor: 'rgba(0,0,0,0.08)' }

    const textClass = isTransparent || isDark ? 'text-white' : 'text-text-primary'

    return (
      <header
        className="fixed top-0 left-0 right-0 z-50 border-b transition-all duration-400"
        style={headerStyle}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className={`flex items-center gap-3 ${textClass}`}>
            {logotipoUrl ? (
              <img src={logotipoUrl} alt={nomeLoja} className="h-8 w-auto object-contain" />
            ) : (
              <span className="text-lg font-semibold tracking-tight">
                {nomeLoja}
              </span>
            )}
          </Link>

          <Link to="/carrinho" className={`relative p-2 hover:opacity-70 transition-opacity ${textClass}`}>
            <ShoppingCart className="w-5 h-5" />
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

  > Note: `transition-all duration-400` — Tailwind v3 doesn't have `duration-400` by default; use `duration-[400ms]` or add it. Use `duration-[400ms]` in the className.

  Replace `transition-all duration-400` with `transition-all duration-[400ms]`.

- [ ] **Step 3.2 — Verify types**

  ```bash
  npx tsc -b --noEmit
  ```
  Expected: no errors.

- [ ] **Step 3.3 — Commit**

  ```bash
  git add src/components/layout/StoreHeader.tsx
  git commit -m "feat: StoreHeader — dynamic glass theme (transparent→dark on home scroll, light on other routes)"
  ```

---

## Task 4: HeroBanner — Full Rewrite

**Files:**
- Modify: `src/components/HeroBanner.tsx`

**What it does:**
- Video background (tries to load `src/assets/hero-loop.mp4`). If video is absent, the animated gradient fallback fills the section automatically.
- `@keyframes wordReveal` applied to each word of `bannerTitulo` via staggered `style.animationDelay`.
- Glassmorphism badge strip at bottom.
- Scroll indicator arrow fades in last.
- Header items (exposed separately) are already covered by the header's own `fadeIn` — the hero doesn't need to coordinate with the header.

- [ ] **Step 4.1 — Rewrite `HeroBanner.tsx`**

  Replace the entire file content with:

  ```tsx
  // src/components/HeroBanner.tsx
  import { useStoreConfig } from '../stores/useStoreConfig'

  export function HeroBanner() {
    const { bannerTitulo, bannerSubtitulo } = useStoreConfig((s) => s.config)
    const words = bannerTitulo.split(' ')

    // Delays: eyebrow=0.3s, words start at 0.5s (+0.25s each), subtitle=2.2s, ctas=2.4s, badges=2.6s, scrollcue=2.8s
    const wordDelays = words.map((_, i) => 0.5 + i * 0.25)

    return (
      <section
        className="relative w-full min-h-screen flex items-center overflow-hidden bg-dark-surface"
        style={{ perspective: '1000px' }}
      >
        {/* Animated gradient fallback (always present, video overlaps it) */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: 'radial-gradient(ellipse at 20% 50%, #0a1628 0%, #000 60%), radial-gradient(ellipse at 80% 20%, #0d2040 0%, transparent 50%)',
            animation: 'drift 18s ease-in-out infinite alternate',
          }}
        />

        {/* Video background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{ opacity: 0.35 }}
        >
          <source src="/src/assets/hero-loop.mp4" type="video/mp4" />
        </video>

        {/* Cinematic overlay */}
        <div
          className="absolute inset-0 z-1 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.2) 100%), linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 40%)',
          }}
        />

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 pt-40">
          {/* Eyebrow label */}
          <p
            className="text-xs font-semibold uppercase tracking-[0.1em] text-white/50 mb-4"
            style={{ opacity: 0, animation: 'slideUp 0.5s ease forwards', animationDelay: '0.3s' }}
          >
            Coleção 2026
          </p>

          {/* Title — word reveal */}
          <h1
            className="text-white mb-6 leading-[1.05] tracking-[-3px]"
            style={{ fontSize: 'clamp(52px, 7vw, 96px)', fontWeight: 800 }}
          >
            {words.map((word, i) => (
              <span
                key={i}
                className="inline-block mr-[0.25em]"
                style={{
                  opacity: 0,
                  animation: 'wordReveal 0.5s ease forwards',
                  animationDelay: `${wordDelays[i]}s`,
                }}
              >
                {word}
              </span>
            ))}
          </h1>

          {/* Subtitle */}
          <p
            className="text-white/70 mb-10 max-w-lg"
            style={{ fontSize: '17px', opacity: 0, animation: 'slideUp 0.6s ease forwards', animationDelay: '2.2s' }}
          >
            {bannerSubtitulo}
          </p>

          {/* CTAs */}
          <div
            className="flex flex-wrap gap-4"
            style={{ opacity: 0, animation: 'slideUp 0.6s ease forwards', animationDelay: '2.4s' }}
          >
            <a
              href="#catalog"
              className="px-8 py-3.5 rounded-full text-white font-semibold text-sm transition-transform hover:-translate-y-px"
              style={{ background: 'var(--cor-principal)' }}
            >
              Ver Catálogo
            </a>
            <a
              href="#featured"
              className="px-8 py-3.5 rounded-full font-semibold text-sm text-white transition-transform hover:-translate-y-px"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              Destaques
            </a>
          </div>
        </div>

        {/* Badge strip */}
        <div
          className="absolute bottom-20 left-0 right-0 z-10"
          style={{ opacity: 0, animation: 'fadeIn 0.6s ease forwards', animationDelay: '2.6s' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className="inline-flex gap-6 px-6 py-3 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              {['Frete Grátis', 'Pagamento Seguro', 'Devoluções em 30 dias'].map((label) => (
                <span key={label} className="text-xs font-medium text-white/70">{label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
          style={{ opacity: 0, animation: 'fadeIn 0.6s ease forwards', animationDelay: '2.8s' }}
        >
          <span className="text-[10px] text-white/30 uppercase tracking-widest">scroll</span>
          <div
            className="w-px h-8 bg-white/20"
            style={{ animation: 'float 2s ease-in-out infinite' }}
          />
        </div>
      </section>
    )
  }
  ```

- [ ] **Step 4.2 — Verify types**

  ```bash
  npx tsc -b --noEmit
  ```
  Expected: no errors.

- [ ] **Step 4.3 — Commit**

  ```bash
  git add src/components/HeroBanner.tsx
  git commit -m "feat: HeroBanner — video bg, word reveal animation, badge strip, scroll cue"
  ```

---

## Task 5: ProductCard — `variant` Prop

**Files:**
- Modify: `src/components/ProductCard.tsx`

**Logic:**
- `variant='dark'` (default): dark card bg, no `mix-blend-multiply`, drop-shadow filter, white text, circular `+` button with accent tint.
- `variant='light'`: current behavior, keeps `mix-blend-multiply`.

- [ ] **Step 5.1 — Rewrite `ProductCard.tsx`**

  Replace entire file:

  ```tsx
  // src/components/ProductCard.tsx
  import { Link } from '@tanstack/react-router'
  import { Star } from 'lucide-react'
  import type { Product } from '../types'
  import { useCartStore } from '../stores/useCartStore'

  interface ProductCardProps {
    product: Product
    variant?: 'dark' | 'light'
  }

  export function ProductCard({ product, variant = 'dark' }: ProductCardProps) {
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

    if (variant === 'dark') {
      return (
        <Link
          to="/produto/$id"
          params={{ id: String(product.id) }}
          className="group flex flex-col rounded-[20px] overflow-hidden transition-transform duration-300 hover:-translate-y-1.5"
          style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {/* Image area */}
          <div
            className="flex items-center justify-center p-6 transition-transform duration-400"
            style={{ background: '#1c1c1c', height: '220px' }}
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-contain group-hover:scale-[1.08] group-hover:-translate-y-1 transition-transform duration-[400ms]"
              style={{ filter: 'drop-shadow(0 20px 40px rgba(0,102,204,0.25)) drop-shadow(0 8px 20px rgba(0,0,0,0.5))' }}
              loading="lazy"
            />
          </div>

          <div className="flex flex-col flex-1 p-4 gap-2">
            <span className="text-xs uppercase tracking-widest font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {product.category}
            </span>
            <p className="text-sm font-medium text-white leading-snug line-clamp-2 flex-1">
              {product.title}
            </p>
            <div className="flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-xs">{product.rating.rate}</span>
              <span className="text-xs">({product.rating.count})</span>
            </div>
            <div className="flex items-center justify-between mt-auto pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="font-semibold text-white">${product.price.toFixed(2)}</span>
              <button
                onClick={handleAddToCart}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-lg transition-colors hover:accent-bg"
                style={{ background: 'rgba(0,102,204,0.15)', border: '1px solid rgba(0,102,204,0.3)' }}
                aria-label="Adicionar ao carrinho"
              >
                +
              </button>
            </div>
          </div>
        </Link>
      )
    }

    // variant === 'light'
    return (
      <Link
        to="/produto/$id"
        params={{ id: String(product.id) }}
        className="group flex flex-col bg-white rounded-2xl overflow-hidden transition-shadow hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
        style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
      >
        <div className="bg-surface flex items-center justify-center p-6" style={{ height: '180px' }}>
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-contain mix-blend-multiply"
            loading="lazy"
          />
        </div>
        <div className="flex flex-col flex-1 p-4 gap-2">
          <span className="text-xs uppercase tracking-widest text-text-secondary font-medium">
            {product.category}
          </span>
          <p className="text-sm font-medium text-text-primary leading-snug line-clamp-2 flex-1">
            {product.title}
          </p>
          <div className="flex items-center gap-1 text-text-secondary">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-xs">{product.rating.rate}</span>
            <span className="text-xs">({product.rating.count})</span>
          </div>
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
            <span className="font-semibold text-text-primary">${product.price.toFixed(2)}</span>
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

- [ ] **Step 5.2 — Verify types**

  ```bash
  npx tsc -b --noEmit
  ```
  Expected: no errors.

- [ ] **Step 5.3 — Commit**

  ```bash
  git add src/components/ProductCard.tsx
  git commit -m "feat: ProductCard — add variant prop (dark/light), drop-shadow on dark, no mix-blend"
  ```

---

## Task 6: ProductGrid — Pass `variant` Through

**Files:**
- Modify: `src/components/ProductGrid.tsx`

- [ ] **Step 6.1 — Add `variant` prop to `ProductGrid`**

  Replace entire file:

  ```tsx
  // src/components/ProductGrid.tsx
  import type { Product } from '../types'
  import { ProductCard } from './ProductCard'

  interface ProductGridProps {
    products: Product[]
    emptyMessage?: string
    variant?: 'dark' | 'light'
  }

  export function ProductGrid({ products, emptyMessage = 'Nenhum produto encontrado.', variant = 'dark' }: ProductGridProps) {
    if (products.length === 0) {
      return (
        <div className="py-16 text-center" style={{ color: variant === 'dark' ? 'rgba(255,255,255,0.4)' : undefined }}>
          <p>{emptyMessage}</p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} variant={variant} />
        ))}
      </div>
    )
  }
  ```

- [ ] **Step 6.2 — Verify types**

  ```bash
  npx tsc -b --noEmit
  ```
  Expected: no errors.

- [ ] **Step 6.3 — Commit**

  ```bash
  git add src/components/ProductGrid.tsx
  git commit -m "feat: ProductGrid — pass variant prop to ProductCard"
  ```

---

## Task 7: FilterBar — Pill Chips + `variant` Prop

**Files:**
- Modify: `src/components/FilterBar.tsx`

**Key change:** Remove `Tabs`/`TabsTrigger` imports. Replace with plain `<button>` pills. Chip row and search on same line. Slider below on second row.

- [ ] **Step 7.1 — Rewrite `FilterBar.tsx`**

  Replace entire file:

  ```tsx
  // src/components/FilterBar.tsx
  import { useState, useEffect } from 'react'
  import { Search } from 'lucide-react'
  import { Slider } from './ui/slider'
  import type { Product } from '../types'

  interface FilterBarProps {
    categories: string[]
    products: Product[]
    onFilter: (filtered: Product[]) => void
    variant?: 'dark' | 'light'
  }

  export function FilterBar({ categories, products, onFilter, variant = 'light' }: FilterBarProps) {
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

    const isDark = variant === 'dark'

    const chipBase = 'text-xs font-medium px-3 py-1.5 rounded-full border transition-colors cursor-pointer'
    const chipInactive = isDark
      ? 'border-white/15 text-white/60 hover:border-white/30 hover:text-white'
      : 'border-border text-text-secondary hover:border-border hover:text-text-primary'
    const chipActive = isDark
      ? 'bg-white/10 border-white/30 text-white'
      : 'accent-bg border-transparent text-white'

    return (
      <div className="space-y-4">
        {/* Row 1: chips + search */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2 flex-1">
            <button
              onClick={() => setActiveCategory('all')}
              className={`${chipBase} ${activeCategory === 'all' ? chipActive : chipInactive}`}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`${chipBase} ${activeCategory === cat ? chipActive : chipInactive} capitalize`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-shrink-0">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: isDark ? 'rgba(255,255,255,0.4)' : undefined }}
            />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm rounded-full outline-none transition-colors"
              style={isDark
                ? { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }
                : { background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }
              }
            />
          </div>
        </div>

        {/* Row 2: price slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span style={{ color: isDark ? 'rgba(255,255,255,0.5)' : undefined }} className={isDark ? '' : 'text-text-secondary'}>
              Preço máximo
            </span>
            <span className={isDark ? 'text-white font-medium' : 'font-medium text-text-primary'}>
              ${priceRange[0].toFixed(0)}
            </span>
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

- [ ] **Step 7.2 — Verify types**

  ```bash
  npx tsc -b --noEmit
  ```
  Expected: no errors. The `Tabs` import is removed — confirm no lingering reference.

- [ ] **Step 7.3 — Commit**

  ```bash
  git add src/components/FilterBar.tsx
  git commit -m "feat: FilterBar — pill chip buttons, variant prop, search inline with chips"
  ```

---

## Task 8: CartItem — White Card Style

**Files:**
- Modify: `src/components/CartItem.tsx`

- [ ] **Step 8.1 — Rewrite `CartItem.tsx`**

  Replace entire file:

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
      <div
        className="flex gap-4 p-6 mb-3 rounded-2xl bg-white transition-shadow hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
        style={{ border: '1px solid rgba(0,0,0,0.04)' }}
      >
        {/* Image */}
        <div
          className="w-[90px] h-[90px] flex-shrink-0 flex items-center justify-center rounded-xl p-2.5 bg-white"
          style={{ border: '1px solid rgba(0,0,0,0.06)' }}
        >
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-contain"
            style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.12))' }}
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
              className="w-7 h-7 rounded-full bg-[var(--surface)] flex items-center justify-center hover:bg-[var(--border)] transition-colors"
              aria-label="Diminuir quantidade"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
              className="w-7 h-7 rounded-full bg-[var(--surface)] flex items-center justify-center hover:bg-[var(--border)] transition-colors"
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

- [ ] **Step 8.2 — Verify types**

  ```bash
  npx tsc -b --noEmit
  ```
  Expected: no errors.

- [ ] **Step 8.3 — Commit**

  ```bash
  git add src/components/CartItem.tsx
  git commit -m "feat: CartItemRow — white card style, drop-shadow image, circular qty buttons"
  ```

---

## Task 9: OrderSummary — White Card

**Files:**
- Modify: `src/components/OrderSummary.tsx`

- [ ] **Step 9.1 — Rewrite `OrderSummary.tsx`**

  Replace entire file:

  ```tsx
  // src/components/OrderSummary.tsx
  import { useNavigate } from '@tanstack/react-router'
  import { useCartStore } from '../stores/useCartStore'

  export function OrderSummary() {
    const items = useCartStore((s) => s.items)
    const getTotal = useCartStore((s) => s.total)
    const navigate = useNavigate()
    const subtotal = getTotal()

    return (
      <div className="bg-white rounded-3xl p-8 space-y-5" style={{ boxShadow: '0 2px 24px rgba(0,0,0,0.06)' }}>
        <h2 className="font-semibold text-lg text-text-primary">Resumo do Pedido</h2>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between" style={{ color: 'var(--gray-600, #424245)' }}>
            <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'itens'})</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between" style={{ color: 'var(--gray-600, #424245)' }}>
            <span>Entrega</span>
            <span style={{ color: '#30D158' }}>Grátis</span>
          </div>
        </div>

        <div
          className="pt-4 flex justify-between"
          style={{ borderTop: '1px solid var(--border)', fontWeight: 700, fontSize: '18px' }}
        >
          <span>Total</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <button
          onClick={() => navigate({ to: '/checkout' })}
          disabled={items.length === 0}
          className="w-full py-3.5 rounded-2xl text-white font-semibold text-sm transition-transform hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          style={{ background: '#1D1D1F' }}
        >
          Finalizar Pedido
        </button>

        <p className="text-center text-xs" style={{ color: '#86868B' }}>
          🔒 Pagamento 100% seguro
        </p>
      </div>
    )
  }
  ```

- [ ] **Step 9.2 — Verify types**

  ```bash
  npx tsc -b --noEmit
  ```
  Expected: no errors.

- [ ] **Step 9.3 — Commit**

  ```bash
  git add src/components/OrderSummary.tsx
  git commit -m "feat: OrderSummary — white card, green shipping, dark CTA, security seal"
  ```

---

## Task 10: HomePage — Three Sections + Bento Grid

**Files:**
- Modify: `src/routes/index.tsx`

**Structure:**
1. `<StoreHeader />` — fixed, outside sections
2. `<HeroBanner />` — Section 1: dark, full-height
3. `<FeaturedSection>` — Section 2: light (`#fff`), bento grid ad-hoc JSX, id="featured"
4. `<CatalogSection>` — Section 3: dark (`#0A0A0A`), FilterBar dark + ProductGrid dark, id="catalog"

**Bento grid:** 5 cards. Cards are ad-hoc JSX — do NOT use `ProductCard`. Layout:
- `grid-template-columns: 2fr 1fr 1fr`
- `grid-template-rows: 320px 240px`
- Card big (`grid-row: 1 / 3`): dark bg `#1a1a2e`, product top-right with float, text bottom-left
- Cards 2-5: pastel backgrounds `#F0F4FF`, `#F5F0FF`, `#FFF5F0`, `#1D1D1F`

- [ ] **Step 10.1 — Rewrite `src/routes/index.tsx`**

  Replace entire file:

  ```tsx
  // src/routes/index.tsx
  import { createRoute, Link } from '@tanstack/react-router'
  import { Route as rootRoute } from './__root'
  import { useState, useCallback } from 'react'
  import { StoreHeader } from '../components/layout/StoreHeader'
  import { HeroBanner } from '../components/HeroBanner'
  import { ProductGrid } from '../components/ProductGrid'
  import { FilterBar } from '../components/FilterBar'
  import { useProductsStore } from '../stores/useProductsStore'
  import type { Product } from '../types'

  function BentoGrid({ products }: { products: Product[] }) {
    const [big, ...rest] = products.slice(0, 5)
    const bentoColors = ['#F0F4FF', '#F5F0FF', '#FFF5F0', '#1D1D1F']
    const bentoTextColors = ['#1D1D1F', '#1D1D1F', '#1D1D1F', '#ffffff']

    if (!big) return null

    return (
      <div
        className="w-full"
        style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gridTemplateRows: '320px 240px', gap: '16px' }}
      >
        {/* Big card */}
        <Link
          to="/produto/$id"
          params={{ id: String(big.id) }}
          className="relative overflow-hidden rounded-3xl p-8 flex flex-col justify-end transition-transform hover:scale-[1.01] duration-300"
          style={{ background: '#1a1a2e', gridRow: '1 / 3' }}
        >
          <img
            src={big.image}
            alt={big.title}
            className="absolute top-8 right-8 w-32 h-32 object-contain"
            style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))', animation: 'float 5s ease-in-out infinite' }}
          />
          <span className="text-xs text-white/40 uppercase tracking-widest mb-1">{big.category}</span>
          <p className="text-white font-semibold text-lg leading-snug line-clamp-2 mb-2">{big.title}</p>
          <span className="text-white font-bold text-xl">${big.price.toFixed(2)}</span>
        </Link>

        {/* 4 small cards */}
        {rest.map((product, i) => (
          <Link
            key={product.id}
            to="/produto/$id"
            params={{ id: String(product.id) }}
            className="relative overflow-hidden rounded-2xl p-5 flex flex-col justify-between transition-transform hover:scale-[1.01] duration-300"
            style={{ background: bentoColors[i] }}
          >
            <div>
              <span
                className="text-xs uppercase tracking-widest font-medium"
                style={{ color: bentoTextColors[i], opacity: 0.5 }}
              >
                {product.category}
              </span>
              <p
                className="text-sm font-semibold mt-1 line-clamp-2"
                style={{ color: bentoTextColors[i] }}
              >
                {product.title}
              </p>
            </div>
            <div className="flex items-end justify-between">
              <span className="font-bold text-base" style={{ color: bentoTextColors[i] }}>
                ${product.price.toFixed(2)}
              </span>
              <img
                src={product.image}
                alt={product.title}
                className="w-16 h-16 object-contain"
                style={{
                  filter: i === 3
                    ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))'
                    : 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))',
                  mixBlendMode: i === 3 ? 'normal' : 'multiply',
                }}
              />
            </div>
          </Link>
        ))}
      </div>
    )
  }

  function HomePage() {
    const { products, categories } = useProductsStore()
    const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)

    const handleFilter = useCallback((filtered: Product[]) => {
      setFilteredProducts(filtered)
    }, [])

    return (
      <div className="min-h-screen">
        <StoreHeader />

        {/* Section 1: Hero — dark */}
        <HeroBanner />

        {/* Section 2: Featured — light */}
        <section id="featured" className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-baseline justify-between mb-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-text-secondary mb-1">Seleção especial</p>
                <h2 className="text-[40px] font-bold tracking-[-1.2px] text-text-primary">Em Destaque</h2>
              </div>
            </div>
            <BentoGrid products={products} />
          </div>
        </section>

        {/* Section 3: Catalog — dark */}
        <section id="catalog" className="bg-dark-surface py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Todos os produtos
              </p>
              <h2 className="text-[40px] font-bold tracking-[-1.2px] text-white">Catálogo Completo</h2>
            </div>
            <div className="space-y-8">
              <FilterBar
                categories={categories}
                products={products}
                onFilter={handleFilter}
                variant="dark"
              />
              <ProductGrid products={filteredProducts} variant="dark" />
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

- [ ] **Step 10.2 — Verify types**

  ```bash
  npx tsc -b --noEmit
  ```
  Expected: no errors.

- [ ] **Step 10.3 — Commit**

  ```bash
  git add src/routes/index.tsx
  git commit -m "feat: HomePage — 3 editorial sections (dark hero, light bento, dark catalog)"
  ```

---

## Task 11: ProductPage — Dark Layout + Float Animation

**Files:**
- Modify: `src/routes/produto/$id.tsx`

**Changes:** dark bg, dark image container, `float` animation on product image, drop-shadow without `mix-blend-multiply`, header always glass dark (handled by StoreHeader detecting route), text colors for dark.

- [ ] **Step 11.1 — Rewrite `src/routes/produto/$id.tsx`**

  Replace entire file:

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
        <div className="min-h-screen bg-dark-surface flex items-center justify-center">
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>Produto não encontrado.</p>
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
      <div className="min-h-screen bg-dark-surface pt-16">
        <StoreHeader />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm mb-10 accent-text hover:opacity-70 transition-opacity"
          >
            <ChevronLeft className="w-4 h-4" />
            Catálogo
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Image container */}
            <div
              className="rounded-3xl flex items-center justify-center p-10"
              style={{ background: '#141414', minHeight: '400px' }}
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full max-w-[420px] h-auto object-contain"
                style={{
                  filter: 'drop-shadow(0 40px 60px rgba(0,102,204,0.3)) drop-shadow(0 16px 32px rgba(0,0,0,0.6))',
                  animation: 'float 5s ease-in-out infinite',
                }}
              />
            </div>

            {/* Details */}
            <div className="flex flex-col gap-6 py-4">
              <div>
                <span
                  className="text-xs uppercase tracking-widest font-medium"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  {product.category}
                </span>
                <h1
                  className="text-white mt-2 leading-tight"
                  style={{ fontSize: '32px', fontWeight: 700 }}
                >
                  {product.title}
                </h1>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.round(product.rating.rate) ? 'fill-current' : ''}`}
                      style={{ color: i < Math.round(product.rating.rate) ? '#FFD700' : 'rgba(255,255,255,0.2)' }}
                    />
                  ))}
                </div>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {product.rating.rate} ({product.rating.count} avaliações)
                </span>
              </div>

              <p
                className="font-extrabold tracking-tight text-white"
                style={{ fontSize: '28px' }}
              >
                ${product.price.toFixed(2)}
              </p>

              <p className="leading-relaxed text-sm" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '15px' }}>
                {product.description}
              </p>

              <button
                onClick={handleAddToCart}
                className="mt-auto flex items-center justify-center gap-2 w-full py-4 rounded-2xl accent-bg text-white font-semibold text-sm transition-transform hover:-translate-y-px"
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

- [ ] **Step 11.2 — Verify types**

  ```bash
  npx tsc -b --noEmit
  ```
  Expected: no errors.

- [ ] **Step 11.3 — Commit**

  ```bash
  git add src/routes/produto/\$id.tsx
  git commit -m "feat: ProductPage — dark bg, float animation, drop-shadow, no mix-blend-multiply"
  ```

---

## Task 12: CartPage — Surface Background + Sticky Layout

**Files:**
- Modify: `src/routes/carrinho/index.tsx`

**Changes:** `bg-surface`, 2-col grid (items + sticky summary), `pt-16` to clear fixed header.

- [ ] **Step 12.1 — Rewrite `src/routes/carrinho/index.tsx`**

  Replace entire file:

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
      <div className="min-h-screen bg-surface pt-16">
        <StoreHeader />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors mb-8"
          >
            <ChevronLeft className="w-4 h-4" />
            Continuar comprando
          </Link>

          <h1
            className="mb-10 text-text-primary"
            style={{ fontSize: '40px', fontWeight: 700, letterSpacing: '-1.2px' }}
          >
            Carrinho
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
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
              {/* Item list */}
              <div>
                {items.map((item) => (
                  <CartItemRow key={item.productId} item={item} />
                ))}
              </div>

              {/* Sticky summary */}
              <div style={{ position: 'sticky', top: '88px' }}>
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

- [ ] **Step 12.2 — Verify types**

  ```bash
  npx tsc -b --noEmit
  ```
  Expected: no errors.

- [ ] **Step 12.3 — Commit**

  ```bash
  git add src/routes/carrinho/index.tsx
  git commit -m "feat: CartPage — surface bg, sticky 2-col layout with OrderSummary"
  ```

---

## Task 13: CheckoutPage — Styled Inputs + Surface Background

**Files:**
- Modify: `src/routes/checkout/index.tsx`

**Changes:** `bg-surface`, `pt-16`, inputs with `border-radius: 12px` and focus ring, labels `font-size: 13px`. Business logic (order creation, navigate) is untouched.

- [ ] **Step 13.1 — Modify `src/routes/checkout/index.tsx`**

  Change the outer `<div>` class from `"min-h-screen bg-background"` to `"min-h-screen bg-surface pt-16"`.

  Change the `<Input>` elements to add a wrapper style. Since we're using shadcn `Input`, apply the rounded + focus ring via a `className` override. Add these classes to each `<Input>`:
  ```
  className="rounded-xl focus-visible:ring-2 focus-visible:ring-[rgba(0,102,204,0.3)] focus-visible:border-[#0066CC]"
  ```

  Change each `<Label>` to include:
  ```
  className="text-[13px] font-medium text-[#424245]"
  ```

  Change the order preview `<div>` from `bg-surface` to `bg-white rounded-2xl`.

  Full replacement of `src/routes/checkout/index.tsx`:

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
      <div className="min-h-screen bg-surface pt-16">
        <StoreHeader />

        <main className="max-w-lg mx-auto px-4 sm:px-6 py-12">
          <h1
            className="text-text-primary mb-10"
            style={{ fontSize: '40px', fontWeight: 700, letterSpacing: '-1.2px' }}
          >
            Finalizar Pedido
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xs uppercase tracking-widest text-text-secondary font-medium">
                Dados de entrega
              </h2>

              <div className="space-y-2">
                <Label htmlFor="nome" className="text-[13px] font-medium text-[#424245]">
                  Nome completo
                </Label>
                <Input
                  id="nome"
                  name="nome"
                  required
                  value={form.nome}
                  onChange={handleChange}
                  placeholder="João Silva"
                  className="rounded-xl focus-visible:ring-2 focus-visible:ring-[rgba(0,102,204,0.3)] focus-visible:border-[#0066CC]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endereco" className="text-[13px] font-medium text-[#424245]">
                  Endereço
                </Label>
                <Input
                  id="endereco"
                  name="endereco"
                  required
                  value={form.endereco}
                  onChange={handleChange}
                  placeholder="Rua das Flores, 123 — São Paulo"
                  className="rounded-xl focus-visible:ring-2 focus-visible:ring-[rgba(0,102,204,0.3)] focus-visible:border-[#0066CC]"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xs uppercase tracking-widest text-text-secondary font-medium">
                Pagamento
              </h2>

              <div className="space-y-2">
                <Label htmlFor="cartao" className="text-[13px] font-medium text-[#424245]">
                  Número do cartão
                </Label>
                <Input
                  id="cartao"
                  name="cartao"
                  required
                  value={form.cartao}
                  onChange={handleChange}
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  className="rounded-xl focus-visible:ring-2 focus-visible:ring-[rgba(0,102,204,0.3)] focus-visible:border-[#0066CC]"
                />
              </div>
            </div>

            {/* Order preview */}
            <div className="bg-white rounded-2xl p-5 space-y-2" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
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
              className="w-full py-4 rounded-2xl accent-bg text-white font-semibold transition-transform hover:-translate-y-px"
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

- [ ] **Step 13.2 — Verify types**

  ```bash
  npx tsc -b --noEmit
  ```
  Expected: no errors.

- [ ] **Step 13.3 — Commit**

  ```bash
  git add src/routes/checkout/index.tsx
  git commit -m "feat: CheckoutPage — surface bg, styled inputs with focus ring, white order preview card"
  ```

---

## Task 14: Final Build Verification

- [ ] **Step 14.1 — Full build**

  ```bash
  cd "C:\Users\leona\Documents\Backup\Portifolio ARCSYS\ecommerce-micro"
  npm run build
  ```
  Expected: 0 TypeScript errors, bundle completes successfully.

- [ ] **Step 14.2 — Visual verification (dev server)**

  ```bash
  npm run dev
  ```
  Open `http://localhost:5173` and verify:
  - [ ] Header is transparent at top of home, transitions to dark glass on scroll
  - [ ] Hero has gradient background (fallback), word reveal animation on title words
  - [ ] Featured section is white with bento grid (5 cards, large + 4 small)
  - [ ] Catalog section is dark with pill filter chips and dark product cards
  - [ ] ProductCard in dark: no white bleed, drop-shadow visible
  - [ ] Product detail page has dark background, float animation
  - [ ] Cart page has light surface background, white card per item, sticky OrderSummary
  - [ ] Checkout page has light surface background, rounded inputs
  - [ ] Accent color from admin still works (open `/admin`, change color → verify propagation)

- [ ] **Step 14.3 — Commit**

  If no issues found:
  ```bash
  git add -A
  git commit -m "chore: verify build — editorial redesign complete"
  ```

---

## Notes

**Hero video:** `src/assets/hero-loop.mp4` is referenced but not bundled. To add it:
1. Download a lifestyle/product loop from Pexels (search "product", ~10s, min 1280×720, MP4)
2. Save as `src/assets/hero-loop.mp4`
The fallback gradient animation is already functional without the video file.

**Cart page sticky layout on mobile:** The 2-col `gridTemplateColumns: '1fr 380px'` will overflow on narrow screens. The `lg:grid-cols-*` responsive approach used before is preferred. Task 12 uses inline style for the grid — if this causes mobile layout issues during visual verification, replace with Tailwind responsive classes: `className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start"`.

**`localStorage` accent color:** Users with existing `store-config` in localStorage will keep their saved `corPrincipal`. The new default `#0066CC` only applies on a fresh session or after resetting config via `/admin`.
