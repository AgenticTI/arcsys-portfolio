# E-commerce Micro — Plataforma White-Label para Lojistas

**Data:** 2026-03-17
**Autor:** Leon
**Status:** Aprovada

---

## 1. Identidade do Nicho

**Contexto:** Uma plataforma de e-commerce genérica (white-label) onde qualquer lojista pode configurar e personalizar sua loja online para vender o produto que quiser. O diferencial de portfólio é a existência de dois contextos distintos: o **Painel do Lojista** (admin) e a **Loja Pública** (cliente). O demo mostra a plataforma como produto — não a loja em si.

**Referências visuais coletadas:**

| Site | URL | O que inspira |
|------|-----|---------------|
| Aark Collective | aarkcollective.com | Black & white, ample white space, precision layout |
| Anglo-Italian | angloitalian.com | Monochrome palette, generous white space, premium product focus |
| Oura Ring | ouraring.com | Interactive product pages, high-resolution imagery, sleek navigation |
| NOMOS Glashütte | nomos-glashuette.com | Organized design, product-quality emphasis |
| Seedlip | seedlipdrinks.com | Radical white space, editorial feel |
| VanMoof | vanmoof.com | Stunning hero imagery, clean aesthetics, smooth navigation |

**Paleta de cores:**

| Token | Valor | Justificativa |
|-------|-------|---------------|
| Background | `#FFFFFF` | Máxima limpeza, deixa produto falar |
| Surface | `#F5F5F7` | Cards e inputs — cinza suave Apple |
| Text primary | `#1D1D1F` | Preto Apple, mais suave que #000 |
| Text secondary | `#6E6E73` | Descrições, labels — hierarquia clara |
| Border | `#D2D2D7` | Divisores delicados, quase invisíveis |
| Accent | `var(--cor-principal)` | Definido pelo lojista no painel (default `#000000`) |
| Admin BG | `#0F0F0F` | Dark mode do painel — contraste visual total com a loja |

**Justificativa da paleta:** Neutro o suficiente para qualquer produto, premium o suficiente para o portfólio. O accent dinâmico é o diferencial: mostra que a plataforma é configurável.

**Tipografia:**
- Fonte: **Inter** (Google Fonts)
- Títulos: `font-semibold`, `tracking-tight`
- Corpo: `font-normal`, `leading-relaxed`
- Labels/badges: `text-xs uppercase tracking-widest`

**Estilo geral (adjetivos):** Arejado · Confiável · Neutro · Sofisticado · Produto-primeiro

---

## 2. Stack

| Camada | Escolha | Justificativa |
|--------|---------|---------------|
| Framework | **React + Vite** | SPA rápida, sem complexidade de SSR desnecessária para MVP |
| Roteamento | **TanStack Router** | Padrão moderno, type-safe, diferencial no portfólio |
| Estilização | **Tailwind CSS** | Utilitário, rápido, padrão do mercado |
| Componentes | **shadcn/ui** | Componentes polidos e customizáveis sem lock-in |
| Estado global | **Zustand** | Leve, simples, ideal para compartilhar config da loja + carrinho |
| Persistência | **localStorage** | Sem backend — configurações e carrinho sobrevivem ao reload |
| Dados de produtos | **JSON estático local** | `src/mocks/products.json` — snapshot da FakeStore API salvo em build-time, sem dependência de rede em runtime |
| Linguagem | **TypeScript** | Tipagem forte, demonstra maturidade técnica |

---

## 3. Telas e Fluxo de Navegação

### Mapa de telas

```
/admin              → Painel do Lojista (dark)
/                   → Loja Pública — Homepage + Catálogo
/produto/:id        → Página do Produto
/carrinho           → Carrinho de Compras
/checkout           → Checkout Fake
/checkout/sucesso   → Tela de Confirmação do Pedido
```

### Fluxo do Lojista (admin)

```
/admin
  └── Configura: nome da loja, logotipo, cor principal, banner hero
  └── Preview live: botão "Ver Loja →" abre / em nova aba
```

### Fluxo do Cliente (loja pública)

```
/ (Homepage)
  ├── Banner hero (configurado pelo lojista)
  ├── Grid de destaques (8 primeiros produtos da API)
  └── Seção de catálogo completo com filtros
        ├── Filtro por categoria (tabs)
        ├── Filtro por preço (range slider)
        └── Busca por nome (input)

/produto/:id
  ├── Imagem grande do produto
  ├── Nome, preço, rating, descrição
  └── Botão "Adicionar ao carrinho"

/carrinho
  ├── Lista de itens com quantidade editável
  ├── Subtotal por item
  ├── Total geral
  └── Botão "Finalizar pedido" → /checkout

/checkout
  ├── Formulário: nome, endereço, número do cartão (fake)
  └── Botão "Confirmar Pedido" → /checkout/sucesso

/checkout/sucesso
  ├── Animação de confirmação (checkmark animado)
  ├── Número do pedido (UUID gerado no client)
  ├── Resumo dos itens
  └── Botão "Continuar comprando" → /
```

### O que cada tela exibe e suas interações

| Tela | Exibe | Interações |
|------|-------|------------|
| `/admin` | Formulário de configuração da loja, preview ao vivo | Editar campos, input de URL ou seleção de arquivo (base64, sem servidor), color picker, salvar |
| `/` | Banner personalizado, grid de produtos, filtros | Filtrar por categoria, filtrar por preço, buscar, clicar em produto |
| `/produto/:id` | Imagem, detalhes, rating | Adicionar ao carrinho (com feedback visual) |
| `/carrinho` | Lista de itens, totais | Aumentar/diminuir quantidade, remover item, ir ao checkout |
| `/checkout` | Formulário fake | Preencher dados, submeter pedido |
| `/checkout/sucesso` | Confirmação animada | Voltar à loja |

---

## 4. Dados Mockados

### Dados de produtos (JSON estático local)

**Origem:** Snapshot da FakeStore API (`fakestoreapi.com`) salvo em desenvolvimento como `src/mocks/products.json`. O app **nunca faz chamadas de rede em runtime** para produtos — lê diretamente do JSON importado. Isso garante que o demo funcione offline e sem risco de API indisponível durante gravação.

**Como gerar o mock:** Executar `scripts/fetch-mock-data.ts` uma única vez em dev para fazer o fetch e salvar o JSON. O arquivo é comitado no repositório.

| Dado | Arquivo | Conteúdo |
|------|---------|----------|
| Produtos | `src/mocks/products.json` | Array de 20 produtos (estrutura `Product[]`) |
| Categorias | `src/mocks/categories.json` | Array de strings com as 4 categorias |

Estratégia de acesso: importados diretamente no `useProductsStore` (Zustand) como estado inicial. Nenhuma chamada de rede.

**Estrutura do produto retornado:**
```ts
interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: { rate: number; count: number }
}
```

### Mock local (gerado no client)

**Configuração da loja** (Zustand + localStorage):
```ts
interface StoreConfig {
  nomeLoja: string        // default: "My Store"
  logotipoUrl: string | null  // default: null (mostra nomeLoja como texto)
  corPrincipal: string    // default: "#000000"
  bannerUrl: string       // default: "/assets/banner-default.jpg"
  bannerTitulo: string    // default: "Bem-vindo à nossa loja"
  bannerSubtitulo: string // default: "Encontre o produto perfeito"
}
```

**Carrinho** (Zustand + localStorage):
```ts
interface CartItem {
  productId: number
  title: string
  image: string
  price: number
  quantity: number
}
```

**Pedido confirmado** (in-memory, limpo após sucesso):
```ts
interface Order {
  orderId: string    // crypto.randomUUID()
  items: CartItem[]
  total: number
  createdAt: Date
}
```

---

## 5. Scope do MVP

### ✅ Dentro do scope

- Painel do lojista: configurar nome, logotipo, cor principal e banner hero
- Persistência das configurações em localStorage
- Catálogo de produtos via JSON estático local (snapshot da FakeStore API)
- Filtro por categoria (tabs)
- Filtro por preço (range slider)
- Busca por nome (filtro client-side)
- Página de produto individual
- Carrinho com quantidade editável e persistência em localStorage
- Checkout fake (formulário sem validação real)
- Tela de sucesso com animação e número de pedido
- Cor principal do lojista aplicada dinamicamente em CTAs, badges e destaques via CSS variable
- Responsivo (mobile-first)

### ❌ Fora do scope

- Autenticação real (nenhum login, nenhum JWT)
- Backend ou banco de dados
- Painel de gestão de produtos (adicionar/editar/remover)
- Painel de pedidos (lojista não vê o que foi comprado)
- Pagamento real ou integração com gateway
- Upload real de imagens para servidor (logo/banner usam base64 local ou URL externa)
- Deploy em produção
- Multi-tenant real (um único lojista configurado por vez)
- Internacionalização

---

## 6. Critério de "Pronto"

### ✅ Checklist visual

- [ ] A loja pública parece uma loja real ao primeiro olhar (sem que o usuário precise ler nada)
- [ ] O painel do lojista é visivelmente diferente da loja (dark vs light)
- [ ] A cor principal configurada no painel aparece nos botões CTA, badges e links da loja
- [ ] O banner hero da loja reflete o que foi configurado no painel
- [ ] Cards de produto têm proporções corretas, imagens sem distorção
- [ ] Tela de sucesso do checkout tem micro-animação (checkmark ou confetti)
- [ ] Responsivo: funciona bem em mobile (375px) e desktop (1280px)

### ✅ Checklist funcional

- [ ] Configurações do painel persistem após recarregar a página
- [ ] Carrinho persiste entre páginas e após recarregar
- [ ] Filtro por categoria filtra corretamente
- [ ] Filtro por preço filtra corretamente (range)
- [ ] Busca por nome filtra em tempo real
- [ ] Adicionar/remover/editar quantidade no carrinho funciona
- [ ] Checkout completa o fluxo até a tela de sucesso
- [ ] Nenhum erro no console em estado normal de uso

### Demo de 2 minutos

> **Roteiro:** Abre `/admin` → muda nome da loja para "TechShop" → troca cor principal para azul → informa URL de banner → edita título e subtítulo do banner → clica "Ver Loja" → loja abre com identidade nova → filtra por "electronics" → abre produto → adiciona ao carrinho → vai ao carrinho → faz checkout → tela de sucesso com animação. **Fim.**
