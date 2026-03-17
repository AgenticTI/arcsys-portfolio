# MicroShop — Redesign Editorial
**Data:** 2026-03-17
**Escopo:** Redesign completo da UI (todas as páginas exceto `/admin`)
**Stack:** Vite 5 + React 19 + TanStack Router + Zustand + Tailwind CSS v3

---

## 1. Visão Geral

Redesign do MicroShop adotando estilo **Editorial Apple-inspired**: seções que alternam dark/light conforme o usuário scrolla, tipografia massiva, animações de entrada cinematográficas e efeitos de profundidade nos produtos via CSS puro. Nenhuma lib de animação externa — tudo com CSS `@keyframes` e `transition`.

**Princípios:**
- Minimalismo clean com espaço generoso
- Premium dark em seções de impacto
- Translucidez/glassmorphism no header e badges
- Hierarquia visual forte: tamanho e peso tipográfico comunicam importância

---

## 2. Design Tokens

### Paleta
```
--black:         #000000
--white:         #FFFFFF
--gray-50:       #F5F5F7   (surface claro)
--gray-100:      #E8E8ED
--gray-200:      #D2D2D7
--gray-400:      #86868B   (texto secundário)
--gray-600:      #424245
--gray-900:      #1D1D1F   (texto primário)
--dark-surface:  #0A0A0A   (fundo seções escuras)
--card-dark:     #141414   (cards no dark)
--card-img-dark: #1c1c1c   (área de imagem no card dark)
```

**Accent color:** manter o sistema dinâmico existente (`--cor-principal` via `useStoreConfig`). O valor default em `useStoreConfig` passa de `#000000` para `#0066CC`. As classes `.accent-bg`, `.accent-text`, `.accent-border` em `index.css` continuam apontando para `var(--cor-principal)` — não criar tokens fixos.

### Tipografia
- Família: `Inter` (já instalada)
- Hero: `font-size: clamp(52px, 7vw, 96px)`, `font-weight: 800`, `letter-spacing: -3px`
- Títulos de seção: `40px`, `font-weight: 700`, `letter-spacing: -1.2px`
- Body: `15–17px`, `font-weight: 400–500`
- Labels/eyebrow: `11–13px`, `font-weight: 600`, `letter-spacing: 0.1em`, uppercase

### Novos tokens Tailwind (`tailwind.config.ts` na raiz do projeto)
Adicionar ao `theme.extend.colors`:
```ts
'dark-surface': '#0A0A0A',
'card-dark':    '#141414',
'card-img-dark':'#1c1c1c',
```

### Novas classes CSS (`src/index.css`)
```css
/* Keyframes globais */
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

/* Redução de movimento */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 3. Componentes Refatorados

### StoreHeader

**Comportamento atual:** sticky, fundo sempre claro.

**Novo comportamento:**
- Na rota `/` (home): começa **totalmente transparente** e muda para **glass dark** (`rgba(0,0,0,0.7)` + `backdrop-filter: blur(20px)`) quando `scrollY > 60px`.
- Nas demais rotas (produto, carrinho, checkout): sempre **glass light** (`rgba(245,245,247,0.85)` + `backdrop-filter: blur(20px)`).
- Texto/ícones: branco quando dark, `text-primary` quando light.

**Como detectar a rota:** usar `useRouterState({ select: (s) => s.location.pathname })` do `@tanstack/react-router`. Comparar com `'/'`.

**Como detectar scroll:** `useEffect` com `window.addEventListener('scroll', handler)` dentro do componente. Guardar `isScrolled: boolean` em `useState`.

---

### HeroBanner (refatoração completa)

**Estrutura:**
```
<section class="hero"> (position: relative, min-height: 100vh)
  <video autoplay muted loop playsinline>  ← fundo em loop
    <source src="/src/assets/hero-loop.mp4" type="video/mp4">
  </video>
  <div class="hero-bg-fallback"> ← gradiente animado, z-index: 0, visível quando vídeo falha
  <div class="hero-overlay">    ← linear-gradient cinematográfico, z-index: 1
  <div class="particles">       ← partículas JS, z-index: 1
  <div class="hero-content">    ← texto + CTAs, z-index: 2
  <div class="hero-badges">     ← strip glassmorphism, z-index: 2
  <div class="scroll-cue">      ← indicador de scroll, z-index: 2
</section>
```

**Vídeo de fundo:** arquivo local `src/assets/hero-loop.mp4` (baixar do Pexels — lifestyle/produto, ~10s loop, resolução mínima 1280×720). O `<video>` tem `opacity: 0.35` e `object-fit: cover`. O fallback (`hero-bg-fallback`) usa `radial-gradient` animado com `@keyframes drift` e é sobreposto pelo vídeo quando disponível.

**Word Reveal:** implementação com `@keyframes wordReveal` e `animation-delay` inline.

Cada palavra do título é um `<span>` com `display: inline-block; opacity: 0; animation: wordReveal 0.5s ease forwards; animation-delay: Xs`. Os delays são:

| Palavra | Delay |
|---------|-------|
| 1ª      | 0.5s  |
| 2ª      | 0.75s |
| 3ª      | 1.0s  |
| 4ª      | 1.25s |
| 5ª      | 1.5s  |
| 6ª      | 1.75s |
| 7ª      | 2.0s  |

Após as palavras (a última termina em ~2.5s), os demais elementos entram:

| Elemento       | Animação  | Delay  | Duração |
|----------------|-----------|--------|---------|
| eyebrow        | slideUp   | 0.3s   | 0.5s    |
| subtítulo      | slideUp   | 2.2s   | 0.6s    |
| hero-ctas      | slideUp   | 2.4s   | 0.6s    |
| hero-badges    | fadeIn    | 2.6s   | 0.6s    |
| scroll-cue     | fadeIn    | 2.8s   | 0.6s    |
| header items   | fadeIn    | 2.8s   | 0.6s    |

**Overlay:** `background: linear-gradient(to right, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.2) 100%), linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 40%)`

---

### ProductCard

Recebe uma nova prop `variant: 'dark' | 'light'` (default: `'dark'`).

**Variant `dark`** (catálogo e produto):
- Container: `background: #141414`, `border-radius: 20px`, `border: 1px solid rgba(255,255,255,0.06)`
- Área de imagem: `background: #1c1c1c`, `height: 220px`
- Imagem: remover `mix-blend-multiply`. Aplicar `filter: drop-shadow(0 20px 40px rgba(var(--accent-rgb), 0.25)) drop-shadow(0 8px 20px rgba(0,0,0,0.5))` — onde `--accent-rgb` é `0,102,204` por padrão.
- Hover do card: `transform: translateY(-6px)`, `transition: 0.3s ease`
- Hover da imagem: `transform: scale(1.08) translateY(-4px)`, `transition: 0.4s ease`
- Texto: categoria em `rgba(255,255,255,0.4)`, nome em `#fff`, preço em `#fff`
- Botão "+" circular: `background: rgba(0,102,204,0.15)`, `border: 1px solid rgba(0,102,204,0.3)`, hover muda para `.accent-bg`

**Variant `light`** (não usada diretamente — ver bento grid abaixo):
- Container: `background: #fff`, `border-radius: 16px`, sombra `0 2px 16px rgba(0,0,0,0.06)`
- Área de imagem: `background: var(--surface)`, altura 180px
- Imagem: manter `mix-blend-multiply` (fundo claro, funciona corretamente)
- Hover: `box-shadow: 0 8px 32px rgba(0,0,0,0.12)`

---

### FilterBar

**Mudanças:**
1. Substituir `<Tabs>` do shadcn por `<button>` pills com estilos manuais.
2. O Slider de preço é **mantido** — reposicionado abaixo dos chips em uma segunda linha.
3. Search bar movida para a direita dos chips na mesma linha.

**Variante dark** (prop `variant: 'dark'`):
- Chips: `border: 1px solid rgba(255,255,255,0.15)`, chip ativo: `background: rgba(255,255,255,0.1)`, `border-color: rgba(255,255,255,0.3)`, texto branco
- Search: `background: rgba(255,255,255,0.08)`, `border: 1px solid rgba(255,255,255,0.1)`, texto `rgba(255,255,255,0.4)`
- Slider label: texto branco

**Variante light** (comportamento atual, apenas com visual pill):
- Chips: `border: 1px solid var(--border)`, ativo: `.accent-bg` com texto branco
- Search: fundo `var(--surface)`, borda `var(--border)`

---

### CartItem (CartItemRow)

- Container: `background: #fff`, `border-radius: 16px`, padding `24px`
- Hover: `box-shadow: 0 4px 24px rgba(0,0,0,0.08)`
- Imagem: container `90x90px`, `background: #fff`, `border-radius: 12px`, `padding: 10px`; imagem com `filter: drop-shadow(0 4px 12px rgba(0,0,0,0.12))`
- Botões de quantidade: circulares, `background: var(--gray-100)`

---

### OrderSummary

- Container: `background: #fff`, `border-radius: 24px`, `padding: 32px`
- Linhas: texto `15px`, cor `var(--gray-600)`
- Linha "Frete Grátis": texto verde `#30D158`
- Linha "Total": separador acima, `font-weight: 700`, `font-size: 18px`
- CTA: full-width, `background: var(--gray-900)`, `border-radius: 14px`, hover `translateY(-1px)`
- Selo: `🔒 Pagamento 100% seguro`, `font-size: 12px`, `color: var(--gray-400)`, centralizado

---

### ProductGrid

Recebe nova prop `layout: 'grid' | 'bento'` (default: `'grid'`).

- `'grid'`: comportamento atual (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`)
- `'bento'`: implementado inline na `routes/index.tsx` (ver seção abaixo) — não usa `ProductGrid`

---

## 4. Páginas

### `/` — HomePage

**Estrutura de seções:**

```
<StoreHeader />           ← fixo, tema dinâmico
<HeroBanner />            ← seção 1: dark, 100vh
<FeaturedSection />       ← seção 2: light (#fff), bento grid (inline JSX)
<CatalogSection />        ← seção 3: dark (#0A0A0A), grid 4 colunas
```

**Seção 2 — Em Destaque (bento grid, inline em `routes/index.tsx`):**

Layout: `display: grid; grid-template-columns: 2fr 1fr 1fr; grid-template-rows: 320px 240px; gap: 16px`

- Card grande (`grid-row: 1 / 3`): fundo `#1a1a2e`, produto no topo direito com float animation, texto (categoria + nome + preço) na base. Não usa `ProductCard`.
- 4 cards menores: fundos coloridos suaves (`#F0F4FF`, `#F5F0FF`, `#FFF5F0`, `#1D1D1F`). Cada um tem label, nome, thumb do produto, preço. Não usa `ProductCard`.
- Estes cards são JSX ad-hoc na própria `routes/index.tsx`, não uma abstração reutilizável.
- Hover em todos: `transform: scale(1.01)`, `transition: 0.3s ease`

**Seção 3 — Catálogo:**
- `<FilterBar variant="dark" />` com chips + search + slider
- `<ProductGrid variant="dark" />` com `ProductCard` variant `dark`

---

### `/produto/$id` — ProductPage

**Fundo:** `background: #0A0A0A`
**Header:** glass dark (sempre, não depende de scroll)

**Layout 2 colunas (lg):**
- Coluna esquerda: container `background: #141414`, `border-radius: 24px`, padding `40px`
  - Imagem centralizada, `max-width: 420px`
  - `filter: drop-shadow(0 40px 60px rgba(0,102,204,0.3)) drop-shadow(0 16px 32px rgba(0,0,0,0.6))`
  - `animation: float 5s ease-in-out infinite`
  - Remover `mix-blend-multiply`
- Coluna direita:
  - Eyebrow: categoria uppercase, `color: rgba(255,255,255,0.4)`
  - Título: `font-size: 32px`, `font-weight: 700`, `color: #fff`
  - Stars: `color: #FFD700`
  - Preço: `font-size: 28px`, `font-weight: 800`, `color: #fff`
  - Descrição: `color: rgba(255,255,255,0.55)`, `font-size: 15px`
  - Botão "Adicionar ao Carrinho": `.accent-bg`, `border-radius: 14px`, `width: 100%`
  - Estado "Adicionado!": manter lógica atual (2s com checkmark)
- Breadcrumb "← Catálogo": `.accent-text`, `font-size: 14px`

---

### `/carrinho` — CartPage

**Fundo:** `background: var(--surface)` (`#F5F5F7`)
**Header:** glass light (sempre)

**Layout:** `display: grid; grid-template-columns: 1fr 380px; gap: 48px; align-items: start`

- Coluna esquerda: lista de `CartItemRow` refatorados
- Coluna direita: `OrderSummary` refatorado, `position: sticky; top: 72px`
- Estado vazio: manter lógica atual, ícone + texto + link centralizado

---

### `/checkout` — CheckoutPage

**Fundo:** `background: var(--surface)`
**Header:** glass light (sempre)

**Mudanças de estilo:**
- Campos `<Input>`: `border-radius: 12px`, foco com `border-color: var(--accent)` e `box-shadow: 0 0 0 3px rgba(0,102,204,0.15)`
- Labels: `font-size: 13px`, `font-weight: 500`, `color: var(--gray-600)`
- Layout: manter estrutura atual de formulário, adicionar `OrderSummary` sticky na direita se viewport > lg

---

### `/checkout/sucesso` — SuccessPage

Sem mudanças visuais. Adicionar apenas `background: #fff` explícito ao container raiz se não estiver presente. Listada aqui para deixar claro que é intencional não alterar.

---

### `/admin` — AdminPage

**Fora de escopo.** `AdminHeader` e `routes/admin/index.tsx` não são modificados.

---

## 5. Animações — Referência Completa

| Elemento | `@keyframes` | Propriedades | Timing |
|---|---|---|---|
| Palavras hero (cada) | `wordReveal` | `opacity 0→1`, `translateY(24px)→0`, `rotateX(25°→0)` | 0.5s ease, delays na tabela da seção 3 |
| Eyebrow | `slideUp` | `opacity 0→1`, `translateY(16px)→0` | 0.5s ease, delay 0.3s |
| Subtítulo | `slideUp` | idem | 0.6s ease, delay 2.2s |
| Hero CTAs | `slideUp` | idem | 0.6s ease, delay 2.4s |
| Hero badges | `fadeIn` | `opacity 0→1` | 0.6s ease, delay 2.6s |
| Scroll cue / header | `fadeIn` | idem | 0.6s ease, delay 2.8s |
| Imagem produto (float) | `float` | `translateY(0)↔translateY(-12px)` | 5s ease-in-out infinite |
| Card hover | — | `transform: translateY(-6px)` | `transition: 0.3s ease` |
| Imagem no card hover | — | `transform: scale(1.08) translateY(-4px)` | `transition: 0.4s ease` |
| Bento card hover | — | `transform: scale(1.01)` | `transition: 0.3s ease` |
| CTA botão hover | — | `transform: translateY(-1px)` | `transition: 0.2s` |
| Header glass | — | `background` + `backdrop-filter` | `transition: 0.4s ease` |

**Todos os keyframes são definidos em `src/index.css`.** Nenhum `@keyframes` inline em componentes.

---

## 6. Arquivos a Modificar

| Arquivo | Tipo de mudança |
|---|---|
| `tailwind.config.ts` (raiz) | Adicionar `dark-surface`, `card-dark`, `card-img-dark` aos tokens |
| `src/index.css` | Adicionar `@keyframes` globais + `@media prefers-reduced-motion` |
| `src/stores/useStoreConfig.ts` | Alterar `DEFAULT_CONFIG.corPrincipal` de `'#000000'` para `'#0066CC'` |
| `src/components/layout/StoreHeader.tsx` | Tema dinâmico por rota + scroll, usando `useRouterState` |
| `src/components/HeroBanner.tsx` | Refatoração completa: vídeo + fallback + word reveal |
| `src/components/ProductCard.tsx` | Prop `variant`, drop-shadow, remover `mix-blend-multiply` no dark |
| `src/components/FilterBar.tsx` | Chips pill, prop `variant`, slider mantido em segunda linha |
| `src/components/CartItem.tsx` | Nova aparência: card branco, imagem com shadow |
| `src/components/OrderSummary.tsx` | Card branco arredondado, novo layout |
| `src/components/ProductGrid.tsx` | Prop `layout` (apenas `'grid'` usado; `'bento'` é inline no index) |
| `src/routes/index.tsx` | Estrutura de 3 seções, bento grid inline para Em Destaque |
| `src/routes/produto/$id.tsx` | Layout dark, float animation, drop-shadow sem blend |
| `src/routes/carrinho/index.tsx` | Fundo `surface`, CartItemRow e OrderSummary refatorados |
| `src/routes/checkout/index.tsx` | Campos estilizados, fundo `surface` |
| `src/assets/hero-loop.mp4` | Adicionar vídeo Pexels (baixar manualmente) |

---

## 7. O que NÃO muda

- `src/router.ts` — sem novas rotas
- `src/stores/useCartStore.ts` — sem alterações
- `src/stores/useProductsStore.ts` — sem alterações
- `src/mocks/` — dados estáticos inalterados
- `src/components/ui/` — shadcn primitives, não tocar
- `src/routes/admin/index.tsx` — fora de escopo
- `src/components/layout/AdminHeader.tsx` — fora de escopo
- `src/routes/checkout/sucesso.tsx` — sem mudanças visuais
- `src/types/index.ts` — interfaces inalteradas
- `src/hooks/useAccentColor.ts` — inalterado
- Lógica de negócio: filtro, checkout, ordem, carrinho

---

## 8. Critérios de Aceitação

- [ ] Hero exibe vídeo em loop (ou fallback gradiente) com word reveal na abertura
- [ ] Palavras do hero aparecem uma a uma com delays corretos
- [ ] Header é transparente no topo da home e glass ao scrollar
- [ ] Header é glass light em todas as outras páginas
- [ ] Alternância dark/light entre seções é perceptível e fluida
- [ ] ProductCard dark sem `mix-blend-multiply`, com drop-shadow azul
- [ ] Float animation ativa na página de produto
- [ ] FilterBar com chips pill e slider mantido
- [ ] Carrinho com card branco por item e OrderSummary arredondado
- [ ] Accent color dinâmica (`--cor-principal`) continua funcionando via admin
- [ ] Default accent muda para `#0066CC`
- [ ] `npm run build` passa sem erros TypeScript
- [ ] Nenhuma lib externa nova adicionada
- [ ] `@media prefers-reduced-motion` desativa todas as animações
