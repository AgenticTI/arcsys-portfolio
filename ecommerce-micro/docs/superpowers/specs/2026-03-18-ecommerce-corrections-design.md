# Spec: MicroShop — Correções P1–P13

**Data:** 2026-03-18
**Projeto:** `ecommerce-micro` (MicroShop)
**Escopo:** Corrigir todos os 13 problemas mapeados em `CORRECOES.md`
**Objetivo:** Entregar o site visualmente completo, em PT-BR, com Hero rodando vídeo em fallback, preços em R$, categorias traduzidas, footer presente e painel admin funcional.

---

## Referências

| Arquivo | Uso |
|---|---|
| `CORRECOES.md` | Mapeamento completo dos 13 problemas (fonte de verdade) |
| `Prints/Planejado/full-mock.png` | Design planejado completo |
| `Prints/Planejado/featured-section.png` | Detalhe da seção Em Destaque e Catálogo |

---

## 1. Novos Artefatos

### 1.1 `src/lib/formatBRL.ts`

Utilitário de formatação de moeda. Converte valor numérico para formato Real Brasileiro.

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

**Consumidores (10 locais — substitui todos os `$` hardcoded):**
- `src/components/ProductCard.tsx:61, 105`
- `src/components/CartItem.tsx:37, 62`
- `src/components/OrderSummary.tsx:18, 31`
- `src/components/FilterBar.tsx:91` (label do preço máximo do slider)
- `src/routes/index.tsx:39, 66` (BentoGrid)
- `src/routes/checkout/index.tsx:121, 127`
- `src/routes/checkout/sucesso.tsx:44, 52`
- `src/routes/produto/$id.tsx:107`

---

### 1.2 `src/lib/categoryLabels.ts`

Mapa de tradução de categorias da FakeStore API para PT-BR.

```ts
const CATEGORY_MAP: Record<string, string> = {
  "men's clothing":   "Masculino",
  "jewelery":         "Joias",
  "electronics":      "Eletrônicos",
  "women's clothing": "Feminino",
}

export function translateCategory(raw: string): string {
  return CATEGORY_MAP[raw.toLowerCase()] ?? raw
}
```

**Consumidores (5 locais):**
- `src/components/ProductCard.tsx:49` — label no card
- `src/components/FilterBar.tsx:59` — chips de filtro
- `src/routes/index.tsx:37, 56` — labels no BentoGrid
- `src/routes/produto/$id.tsx:76` — categoria na página de detalhe

---

### 1.3 `src/components/layout/StoreFooter.tsx`

Footer escuro, três colunas + linha de copyright. Montado em `__root.tsx`.

**Estrutura visual:**
- Fundo: `#1D1D1F`
- **Coluna esquerda:** `{nomeLoja}` (do `useStoreConfig`) + tagline hardcoded `"Produtos selecionados com qualidade premium."`
- **Coluna central — Navegação:** Catálogo (`href="/#catalog"`), Novidades (`href="#"`), Ofertas (`href="#"`)
- **Coluna direita — Institucional:** Sobre (`href="#"`), Contato (`href="#"`), Política de Privacidade (`href="#"`)
- **Rodapé do footer:** `© 2026 {nomeLoja}. Todos os direitos reservados.`

**Convenções:**
- Named export: `export function StoreFooter()`
- Cores: texto `text-white/60`, headings `text-white/90`, links `hover:text-white transition-colors`
- Montagem: adicionar `<StoreFooter />` em `src/routes/__root.tsx` após `<Outlet />`

---

## 2. Mudanças em Tipos e Store

### 2.1 `src/types/index.ts` — StoreConfig

Adicionar **um** novo campo à interface `StoreConfig` (`bannerUrl` já existe):

```ts
// Inserir na interface StoreConfig:
bannerEyebrow: string   // eyebrow label configurável do Hero (ex: "Nova Coleção")
```

`bannerUrl: string` já está declarado na interface — não alterar o tipo.

### 2.2 `src/stores/useStoreConfig.ts` — DEFAULT_CONFIG

```ts
// Antes:
nomeLoja: 'My Store',
bannerUrl: '/assets/banner-default.jpg',

// Depois:
nomeLoja: 'MicroShop',
bannerUrl: '',           // string vazia → Hero exibe vídeo por padrão (falsy check)
bannerEyebrow: 'Nova Coleção',
```

**Importante:** `bannerUrl` muda de `'/assets/banner-default.jpg'` para `''` (string vazia). Isso garante que a condição `{bannerUrl ? <img/> : <video/>}` no `HeroBanner` roteie para o vídeo no carregamento padrão. Quando o admin configurar uma URL real, a imagem sobrepõe o vídeo.

---

## 3. Mudanças em CSS

### 3.1 `src/index.css` — Correção do FOUC (P6)

```css
/* Antes: */
:root {
  --cor-principal: #000000;
}

/* Depois: */
:root {
  --cor-principal: #0066CC;
}
```

Alinha o valor inicial do CSS com o default do Zustand, eliminando o flash de cor preta no carregamento.

---

## 4. Mudanças em Componentes

### 4.1 `src/components/HeroBanner.tsx` (P1 + P5 + P9)

**Leitura do store — adicionar `bannerUrl` e `bannerEyebrow`:**
```tsx
// Antes:
const { bannerTitulo, bannerSubtitulo } = useStoreConfig((s) => s.config)

// Depois:
const { bannerTitulo, bannerSubtitulo, bannerUrl, bannerEyebrow } = useStoreConfig((s) => s.config)
```

**Hierarquia de background (substituir o `<video>` atual):**
```tsx
{/* Camada de background — prioridade: imagem > vídeo > gradiente */}
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
    autoPlay muted loop playsInline
    className="absolute inset-0 w-full h-full object-cover z-0"
    style={{ opacity: 0.35 }}
  >
    <source src="/hero-loop.mp4" type="video/mp4" />
  </video>
)}
```

O gradiente animado permanece na camada abaixo (z-0, sempre renderizado) como fallback visual quando vídeo ou imagem falham.

**Eyebrow label (P9):**
```tsx
// Antes:
<p ...>Coleção 2026</p>

// Depois:
<p ...>{bannerEyebrow}</p>
```

**Scroll cue (PT-BR):**
```tsx
// Antes:
<span ...>scroll</span>

// Depois:
<span ...>rolar</span>
```

**Asset a adicionar:** `public/hero-loop.mp4`
- Baixar vídeo gratuito (Pexels ou Pixabay) com tema neutro: produtos, moda, lifestyle ou abstrato/bokeh
- Licença: CC0 ou Pexels License
- Duração ideal: 10–30s em loop
- Resolução: 1080p ou 720p

---

### 4.2 `src/components/layout/StoreHeader.tsx` (P7)

**Adicionar nav central entre logo e carrinho:**
```tsx
{/* Nav central — oculto em mobile */}
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

O `textClass` já existente (`text-white` no hero, `text-text-primary` nas demais páginas) é aplicado diretamente — os links herdam o comportamento de cor do header.

---

### 4.3 `src/components/OrderSummary.tsx` (P4 + P8 + P10)

**Importar `formatBRL`:**
```tsx
import { formatBRL } from '../lib/formatBRL'
```

**Substituições:**
```tsx
// P4 — preços (3 ocorrências):
`$${subtotal.toFixed(2)}` → formatBRL(subtotal)  // duas vezes
`$${total.toFixed(2)}`   → formatBRL(total)       // se existir

// P8 — botão Finalizar Pedido:
style={{ background: '#1D1D1F' }}  →  className="accent-bg"

// P10 — cor de texto:
style={{ color: 'var(--gray-600, #424245)' }}  →  className="text-text-secondary"
```

---

### 4.4 `src/routes/index.tsx` — BentoGrid (P2 + P3 + P4 + P11)

**Importar utilitários:**
```tsx
import { formatBRL } from '../lib/formatBRL'
import { translateCategory } from '../lib/categoryLabels'
```

**P2 — imagens redimensionadas:**
```tsx
// Big card — antes:
className="absolute top-8 right-8 w-32 h-32 object-contain"

// Big card — depois:
className="absolute inset-0 w-full h-full object-contain p-12"

// Small cards — antes:
className="w-16 h-16 object-contain"

// Small cards — depois:
className="w-24 h-24 object-contain"
```

**P3 — categorias traduzidas:**
```tsx
// Antes (big card e small cards):
{big.category}
{product.category}

// Depois:
{translateCategory(big.category)}
{translateCategory(product.category)}
```

**P4 — preços formatados:**
```tsx
// Antes:
${big.price.toFixed(2)}
${product.price.toFixed(2)}

// Depois:
{formatBRL(big.price)}
{formatBRL(product.price)}
```

**P11 — "Ver todos →" nas seções:**
```tsx
// Seção "Em Destaque" — adicionar no header da seção:
<Link to="/" className="text-sm font-medium accent-text hover:opacity-70 transition-opacity">
  Ver todos →
</Link>

// Seção "Catálogo Completo" — idem (texto branco pois seção é escura):
<a href="#catalog" className="text-sm font-medium text-white/60 hover:text-white transition-colors">
  Ver todos →
</a>
```

---

### 4.5 Outros componentes — P3 e P4

Todos seguem o mesmo padrão: importar `translateCategory` e/ou `formatBRL`, substituir as ocorrências mapeadas.

| Arquivo | Mudança |
|---|---|
| `src/components/ProductCard.tsx` | `translateCategory` na linha 49; `formatBRL` nas linhas 61, 105 |
| `src/components/FilterBar.tsx` | `translateCategory` na linha 59; `formatBRL` na linha 91 (label do preço máximo do slider) |
| `src/components/CartItem.tsx` | `formatBRL` nas linhas 37 e 62 (preço unitário e subtotal da linha) |
| `src/routes/produto/$id.tsx` | `translateCategory` na linha 76; `formatBRL` na linha 107 |
| `src/routes/checkout/index.tsx` | `formatBRL` nas linhas 121, 127 |
| `src/routes/checkout/sucesso.tsx` | `formatBRL` nas linhas 44, 52 |

---

### 4.6 `src/routes/admin/index.tsx` (P9)

Adicionar campo "Eyebrow do Banner" abaixo dos campos de banner existentes:

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

---

### 4.7 `src/routes/checkout/index.tsx` — máscara de cartão (P12)

**Contexto importante:** O checkout usa um único objeto de estado `form` com `setForm` e um `handleChange` genérico. O campo do cartão é `form.cartao`. A máscara deve usar esse padrão existente — **não introduzir um `useState` separado**.

**Handler inline (sem biblioteca) — definir fora do componente:**
```tsx
function formatCardNumber(value: string): string {
  return value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim()
}
```

**Substituição no campo de input** — trocar o `onChange={handleChange}` pelo formatter:
```tsx
// Antes:
<Input
  name="cartao"
  placeholder="Número do cartão"
  maxLength={19}
  onChange={handleChange}
  required
/>

// Depois (remover name="cartao", substituir onChange):
<Input
  placeholder="0000 0000 0000 0000"
  maxLength={19}
  value={form.cartao}
  onChange={(e) => setForm((prev) => ({ ...prev, cartao: formatCardNumber(e.target.value) }))}
  required
/>
```

`handleChange` continua sendo usado pelos outros campos do formulário. O campo `cartao` passa a ter `onChange` dedicado e `value` explícito. O `name="cartao"` é removido pois o `handleChange` não é mais responsável por esse campo.

---

## 5. Ordem de Implementação Recomendada

Agrupar por independência para minimizar conflitos:

1. **Fundação** — `formatBRL.ts`, `categoryLabels.ts`, `index.css` (FOUC), tipos e store defaults
2. **Hero** — `HeroBanner.tsx` + download do vídeo para `/public/`
3. **BentoGrid** — `routes/index.tsx` (imagens + traduções + preços + "Ver todos →")
4. **Componentes restantes** — `ProductCard`, `FilterBar`, `CartItem`, `OrderSummary`, `produto/$id`, `checkout/index`, `checkout/sucesso`
5. **Header** — `StoreHeader.tsx` (nav links)
6. **Admin** — `admin/index.tsx` (campo eyebrow)
7. **Footer** — `StoreFooter.tsx` + montagem em `__root.tsx`

---

## 6. Critérios de Aceitação

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
