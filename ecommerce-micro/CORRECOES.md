# CORRECOES.md — ecommerce-micro (MicroShop)

Arquivo de comunicação entre instâncias do processo de correção.
**Cada instância deve ler este arquivo antes de começar seu trabalho.**

---

## Status do Processo

| Etapa | Responsável | Status |
|---|---|---|
| Mapeamento e identificação | Instância 1 | ✅ Concluído |
| Spec de Correção | Instância 2 | ✅ Concluído |
| Plano de Implementação | Instância 3 | ⏳ Pendente |
| Implementação | Instância 4 | ⏳ Pendente |

---

## Referências Visuais

| Arquivo | Descrição |
|---|---|
| `Prints/Planejado/full-mock.png` | Como o site deveria estar — design completo do MicroShop |
| `Prints/Planejado/Referencia.png` | Referência de design externo (site "nitec." com headphones) |
| `Prints/Problemas encontrados/Video-Hero-Não-Carregado.png` | Print do bug: hero todo preto sem vídeo |
| `Prints/Problemas encontrados/Fotos-produtos-nao-sem-alinhamento.png` | Print do bug: BentoGrid com imagens desalinhadas |

---

## Problemas Identificados (Instância 1)

### P1 — CRÍTICO: Vídeo do Hero não existe

**Arquivo:** `src/components/HeroBanner.tsx:34`

```tsx
<source src="/src/assets/hero-loop.mp4" type="video/mp4" />
```

**Causa raiz:** O arquivo `hero-loop.mp4` não existe em `src/assets/` (apenas `hero.png`, `react.svg`, `vite.svg` existem). O asset nunca foi criado/adicionado ao projeto.

**Impacto visual:** O Hero exibe apenas o gradiente animado de fallback (`radial-gradient`) num fundo completamente preto. O visual premium com vídeo não aparece.

**Observação adicional:** O path `/src/assets/hero-loop.mp4` é incorreto para Vite — assets importados dessa forma em produção precisam estar em `/public/` ou ser importados via `import`. O path `/src/...` funciona em dev mas não em build.

---

### P2 — ALTO: Imagens do BentoGrid mal posicionadas

**Arquivo:** `src/routes/index.tsx` — componente `BentoGrid`

**Big card (produto em destaque):**
- Linha 32: `className="absolute top-8 right-8 w-32 h-32 object-contain"` — imagem fixada com posicionamento absoluto no canto superior direito, pequena (128×128px)
- No mock planejado (`full-mock.png`), a imagem deveria ocupar mais espaço e ser mais proeminente dentro do card grande

**Cards pequenos (4 cards secundários):**
- Linha 70: `className="w-16 h-16 object-contain"` — imagens de apenas 64×64px
- No mock planejado, as imagens são claramente maiores e melhor enquadradas dentro dos cards

**Resultado visual confirmado:** Print `Fotos-produtos-nao-sem-alinhamento.png` mostra exatamente isso — imagens pequenas e deslocadas, sem centralização adequada para o layout bento.

---

### P3 — ALTO: Idioma misturado PT/EN nas categorias

**Contexto:** Os dados de `products.json` vêm da FakeStore API com categorias em inglês: `"men's clothing"`, `"jewelery"`, `"electronics"`, `"women's clothing"`.

**Locais onde categorias são exibidas sem tradução:**
- `src/components/ProductCard.tsx:49` — label da categoria no card
- `src/components/FilterBar.tsx:59` — chips/botões de filtro de categoria
- `src/routes/index.tsx:37` — label no big card do BentoGrid
- `src/routes/index.tsx:56` — labels nos cards pequenos do BentoGrid
- `src/routes/produto/$id.tsx:76` — categoria na página de detalhe do produto

**Outros textos em inglês:**
- `src/stores/useStoreConfig.ts:13` — `nomeLoja: 'My Store'` (default em inglês)
- `src/components/HeroBanner.tsx:127` — palavra `scroll` no scroll cue (menor gravidade — estilístico)

---

### P4 — ALTO: Preços exibidos em dólar ($) quando o planejado era R$

**Contexto:** O mock planejado (`full-mock.png`) mostra claramente preços em Real Brasileiro com formato PT-BR: `R$ 22,30`, `R$ 64,00`, `R$ 168,00`. Os dados da FakeStore API têm preços em USD com ponto decimal americano.

**Locais com `$` hardcoded:**
- `src/components/ProductCard.tsx:61, 105`
- `src/components/CartItem.tsx:37`
- `src/components/OrderSummary.tsx:18, 31`
- `src/routes/index.tsx:39, 66`
- `src/routes/checkout/index.tsx:121, 127`
- `src/routes/checkout/sucesso.tsx:44, 52`
- `src/routes/produto/$id.tsx:107`

**Problemas relacionados:**
- Formato numérico americano (ponto decimal) em vez de brasileiro (vírgula decimal)
- Sem conversão de moeda — os preços USD serão exibidos como se fossem BRL (inconsistência de valor)

---

### P5 — MÉDIO: Campo `bannerUrl` configurável no Admin mas ignorado no HeroBanner

**Arquivo Admin:** `src/routes/admin/index.tsx:98-107` — existe input para "URL da imagem do banner"

**Arquivo Hero:** `src/components/HeroBanner.tsx` — o campo `bannerUrl` do `useStoreConfig` **não é usado em nenhum lugar do componente**. O Hero apenas usa `bannerTitulo` e `bannerSubtitulo`.

```tsx
// HeroBanner.tsx:5 — só desestrutura título e subtítulo, ignora bannerUrl
const { bannerTitulo, bannerSubtitulo } = useStoreConfig((s) => s.config)
```

**Impacto:** O campo de configuração do admin é "morto" — o admin pode editar a URL mas ela não afeta nada visualmente. Quebra a expectativa do usuário do painel admin.

---

### P6 — MÉDIO: FOUC (Flash of Unstyled Content) na cor de acento

**Causa:**
- `src/index.css:6` — `:root { --cor-principal: #000000; }` — CSS inicial é preto
- `src/stores/useStoreConfig.ts:15` — `corPrincipal: '#0066CC'` — default do Zustand é azul
- `src/hooks/useAccentColor.ts` — sincroniza o valor via `useEffect`, que só dispara **após** a primeira renderização

**Resultado:** No carregamento inicial (especialmente sem localStorage), os botões e elementos com `accent-bg`/`accent-text` aparecem **pretos** por um frame antes de virar azuis. Se o usuário tiver configurado outra cor no localStorage, esse flash é da cor errada para a correta.

---

### P7 — MÉDIO: StoreHeader sem links de navegação

**Arquivo:** `src/components/layout/StoreHeader.tsx` — apenas logo + ícone de carrinho

**O mock planejado (`full-mock.png`) mostra:**
- Logo "MicroShop" à esquerda
- Links centrais: "Catálogo | Novidades | Ofertas"
- Ícone carrinho à direita

**Impacto:** Navegação limitada — usuário não tem acesso rápido às seções da loja via header.

---

### P8 — MÉDIO: Botão "Finalizar Pedido" não usa `accent-bg`

**Arquivo:** `src/components/OrderSummary.tsx:39`

```tsx
style={{ background: '#1D1D1F' }}  // hardcoded preto
```

**Contexto:** Todos os outros CTAs principais do site usam `accent-bg` e respeitam a cor configurável do admin (ex: botão da página de produto, botão "Confirmar Pedido" no checkout). O botão mais importante do fluxo de compra (Finalizar Pedido no carrinho) é a exceção e não respeita o sistema de design.

---

### P9 — MENOR: "Coleção 2026" hardcoded no HeroBanner

**Arquivo:** `src/components/HeroBanner.tsx:52`

```tsx
<p ...>Coleção 2026</p>  // texto fixo, não configurável
```

**Contexto:** O título e subtítulo do banner são configuráveis via admin, mas o "eyebrow label" está hardcoded. Ao trocar de ano ou campanha, requer mudança no código.

---

### P10 — MENOR: CSS var `var(--gray-600)` não definida no sistema de design

**Arquivo:** `src/components/OrderSummary.tsx:16, 20`

```tsx
style={{ color: 'var(--gray-600, #424245)' }}
```

O sistema de design usa tokens Tailwind (`text-secondary: #6E6E73`) e CSS vars definidas (`--cor-principal`). `--gray-600` não está definida em nenhum lugar. Funciona pelo fallback `#424245`, mas é um token órfão inconsistente.

---

### P11 — MENOR: Links de "Ver todos →" ausentes nas seções

**Arquivo:** `src/routes/index.tsx`

- Seção "Em Destaque" (linha 104-113) — sem "Ver todos →" no header da seção
- Seção "Catálogo Completo" (linha 117-123) — sem "Ver todos →" no header da seção

O mock planejado (`full-mock.png`) mostra claramente esses links à direita dos títulos de seção.

---

### P12 — INFO: Checkout sem validação de formato do cartão

**Arquivo:** `src/routes/checkout/index.tsx:99-106`

O campo "Número do cartão" aceita qualquer texto (`required` + `maxLength={19}` apenas). Sem máscara, sem validação de formato `XXXX XXXX XXXX XXXX`. Para um portfolio, é uma incompletude visual que reduz o realismo da demo.

---

### P13 — INFO: Sem footer em nenhuma página

Nenhuma rota possui componente de rodapé. O mock planejado sugere uma estrutura mais completa. Ausência total de footer é uma lacuna visual para um e-commerce.

---

## Resumo por Prioridade

| ID | Severidade | Problema |
|---|---|---|
| P1 | CRÍTICO | Vídeo do Hero não existe (arquivo ausente) |
| P2 | ALTO | Imagens BentoGrid mal posicionadas e pequenas |
| P3 | ALTO | Categorias dos produtos em inglês sem tradução |
| P4 | ALTO | Preços em $ com formato americano (deveria ser R$ BR) |
| P5 | MÉDIO | `bannerUrl` configurável no admin mas ignorado no Hero |
| P6 | MÉDIO | FOUC na cor de acento no carregamento |
| P7 | MÉDIO | StoreHeader sem links de navegação |
| P8 | MÉDIO | Botão "Finalizar Pedido" não usa accent-bg |
| P9 | MENOR | "Coleção 2026" hardcoded no Hero |
| P10 | MENOR | CSS var `--gray-600` não definida no sistema de design |
| P11 | MENOR | Links "Ver todos →" ausentes nas seções |
| P12 | INFO | Checkout sem validação de formato do cartão |
| P13 | INFO | Sem footer em nenhuma página |

---

## Log de Implementação

*(A ser preenchido pela(s) instância(s) de implementação)*
