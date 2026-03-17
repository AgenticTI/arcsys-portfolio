# restaurante-pedidos

**Data:** 2026-03-17
**Autor:** Leon
**Status:** Aprovada

---

## 1. Identidade do Nicho

**Contexto:** Sistema de pedidos para restaurante fine dining. O usuário típico é um cliente que faz pedidos à mesa ou pelo balcão, e a equipe da cozinha que gerencia e executa os pedidos. O sistema precisa transmitir sofisticação e confiança — dois atributos centrais em restaurantes premium.

**Nome fictício do restaurante:** *Noir*

**Referências visuais coletadas:**
- [Tastio — Food Delivery iOS App (Behance)](https://www.behance.net/gallery/236270557/Tastio-Food-Delivery-iOS-App-UIUX-Design) — neutros profundos + acento único, hierarquia tipográfica clara, espaço em branco generoso
- [Foodu — Food Delivery App UI Kit (Behance)](https://www.behance.net/gallery/151310021/Foodu-Food-Delivery-App-UI-Kit) — design system modular, grid 4px, status colors consistentes
- [Honest Greens (Mobbin)](https://mobbin.com/explore/mobile/app-categories/food-drink) — minimalismo extremo, fotografia como protagonista
- Padrão recorrente nos top designs Dribbble 2024-2025: base neutra, 1 acento forte, tipografia com contraste de peso, cards com sombra sutil

**Paleta de cores:**

| Token | Valor | Uso |
|---|---|---|
| `--noir-black` | `#0A0A0A` | Backgrounds dark, hero sections, headers |
| `--noir-white` | `#F5F4F0` | Backgrounds light, texto sobre dark |
| `--noir-cream` | `#E8E4DC` | Cards, superfícies secundárias |
| `--noir-gold` | `#C9A96E` | Acento único — CTAs, preços, destaques |
| `--noir-gray` | `#6B6B6B` | Texto secundário, labels, bordas |

**Justificativa da paleta:** Fine dining exige sobriedade. O preto profundo ancora o peso visual do restaurante premium. O gold é o único acento — ele aparece onde o olho precisa ir (preços, botões de ação). O off-white evita o branco frio do SaaS genérico. A alternância dark/light cria ritmo editorial sem perder a coerência.

**Tipografia:**
- **Headlines:** `Playfair Display` (serif) — impacto editorial, 48px–80px. Evoca alta gastronomia
- **Body/UI:** `Inter` — legibilidade máxima, Apple-like, todas as labels e parágrafos
- **Preços:** `Inter` weight 600, cor `--noir-gold`

**Estilo geral:** editorial, noturno-diurno, fotográfico, sóbrio, sem ornamentos desnecessários. Como se o site da Apple e a revista Bon Appétit tivessem construído um sistema de pedidos juntos.

---

## 2. Stack

**Framework:** Next.js 14 (App Router)
- **Justificativa:** Demonstra conhecimento de SSR, rotas modernas, layouts aninhados e Server Components — diferencial técnico claro num portfólio

**Estilização:** Tailwind CSS
- Tokens definidos no `tailwind.config.ts` para a paleta Noir
- Sem CSS modules ou styled-components — Tailwind é o padrão de mercado em 2025

**Animações:** Framer Motion
- Transitions entre telas, progressão de status, entrada de cards
- `AnimatePresence` para montagem/desmontagem de modais e carrinho

**Gerenciamento de estado:** React Context API
- `AppContext` com `cart`, `orders`, `activeView`
- Sem Zustand — o escopo não justifica dependência extra

**Fontes:** Google Fonts via `next/font` (Playfair Display + Inter)

**Imagens:** Unsplash URLs estáticas no arquivo de mock — sem CDN próprio

---

## 3. Telas e Fluxo de Navegação

### Switcher de Persona
Fixo no topo da aplicação (header global). Dois botões: `Cliente` | `Cozinha`. Alterna o `activeView` no Context. Visível em todas as telas.

### Visão Cliente

```
Home/Cardápio
    ↓ (clica no prato)
Detalhe do Prato (modal)
    ↓ (adiciona ao carrinho)
Home/Cardápio (com carrinho atualizado)
    ↓ (abre carrinho)
Carrinho (sheet lateral ou página)
    ↓ (confirma pedido)
Confirmação (animação + número do pedido)
    ↓ (redirect automático após 2s)
Acompanhamento de Status
```

**Tela 1 — Home / Cardápio**
- Hero full-screen: foto do restaurante + nome *Noir* em Playfair Display 80px + tagline
- Scroll para o cardápio
- Filtro por categoria: Entradas | Pratos Principais | Sobremesas | Bebidas (tabs horizontais)
- Grid de pratos: foto, nome, descrição curta (1 linha), preço em gold
- Botão flutuante no canto inferior direito: ícone de carrinho + contador de itens
- Fundo: alternância entre seções dark e light (hero dark, cardápio light)

**Tela 2 — Detalhe do Prato (modal)**
- Abre sobre a Home via `AnimatePresence`
- Foto em 60% do modal
- Nome (Playfair Display 36px), descrição completa, lista de ingredientes
- Seletor de quantidade (−/+)
- Botão "Adicionar ao pedido" (gold, full-width)

**Tela 3 — Carrinho**
- Sheet lateral (slide-in pela direita) ou `/cart` page
- Lista de itens: foto thumbnail, nome, quantidade editável, subtotal por item
- Resumo: subtotal + taxa de serviço 10% + total
- Botão "Confirmar pedido" (CTA principal, gold)
- Botão "Continuar navegando" (secondary)

**Tela 4 — Confirmação**
- Fundo dark
- Animação Framer Motion: ícone de check em gold
- Texto: "Pedido recebido" + número gerado `#XXXX`
- Redirect automático para Acompanhamento após 2s
- Navegação é **unidirecional**: botão "voltar" do browser redireciona para Home (não reabre o carrinho)

**Tela 5 — Acompanhamento de Status**
- 4 etapas visuais em linha horizontal: `Recebido → Preparando → Pronto → Entregue`
- Etapa ativa em gold, etapas futuras em gray
- Barra de progresso animada com Framer Motion
- **Timer simulado:** `setInterval` a cada 5s avança o status automaticamente (modo demo)
- Resumo do pedido abaixo da barra (itens + total)

### Visão Cozinha

```
Dashboard (Kanban)
    ↓ (clica no card)
Detalhe do Pedido (modal ou expand)
```

**Tela 6 — Dashboard de Pedidos (Kanban)**
- 3 colunas: `Novos | Em Preparo | Prontos`
- Fundo dark com cards cream
- Card: número do pedido, lista de itens, tempo decorrido desde criação
- Botão no card para avançar status manualmente (além do timer automático)
- Pedidos entram na coluna "Novos" assim que confirmados pelo cliente

**Tela 7 — Detalhe do Pedido (modal)**
- Lista completa de itens com quantidades
- Tempo de espera
- Botões de ação: "Iniciar preparo" → "Marcar como pronto"

---

## 4. Dados Mockados

**Localização:** `src/data/`

**`menu.ts`** — 12 pratos, 3 por categoria:
```ts
interface Dish {
  id: string
  name: string
  description: string
  price: number          // em reais, ex: 89.90
  category: 'starters' | 'mains' | 'desserts' | 'drinks'
  imageUrl: string       // URL Unsplash estática
  ingredients: string[]
}
```

Exemplo:
```ts
{
  id: 'main-01',
  name: 'Entrecôte Noir',
  description: 'Corte nobre de 300g, manteiga de ervas finas, purê de batata trufado e jus de carne reduzido.',
  price: 148.00,
  category: 'mains',
  imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800',
  ingredients: ['Entrecôte 300g', 'Manteiga de ervas', 'Batata', 'Trufa negra', 'Jus de carne']
}
```

**`categories.ts`**
```ts
const categories = [
  { id: 'starters', label: 'Entradas' },
  { id: 'mains', label: 'Pratos Principais' },
  { id: 'desserts', label: 'Sobremesas' },
  { id: 'drinks', label: 'Bebidas' },
]
```

**Estado em AppContext:**
```ts
type OrderStatus = 'received' | 'preparing' | 'ready' | 'delivered'

interface CartItem {
  dish: Dish
  quantity: number
}

interface Order {
  id: string           // string formatada: '#0001', '#0002'...
  items: CartItem[]
  status: OrderStatus
  createdAt: Date
  totalAmount: number  // subtotal + taxa de serviço (exibido no resumo)
}

interface AppState {
  activeView: 'client' | 'kitchen'
  cart: CartItem[]
  orders: Order[]
}
```

Pedidos são gerados no momento do checkout com ID string sequencial (`'#0001'`, `'#0002'`...) e status inicial `received`. O contador reseta ao recarregar a página (comportamento esperado — sem persistência). A taxa de serviço de 10% é sempre aplicada sobre o subtotal, sem exceções.

---

## 5. Scope do MVP

**✅ Dentro:**
- Cardápio com 12 pratos mockados (3 por categoria)
- Filtro por categoria (tabs)
- Modal de detalhe do prato
- Carrinho com edição de quantidade e cálculo de total + taxa de serviço 10%
- Fluxo completo de confirmação de pedido com número gerado
- Tela de acompanhamento com progressão automática via timer (5s por etapa)
- Dashboard cozinha com Kanban 3 colunas
- Avanço manual de status no dashboard da cozinha
- Switcher Cliente/Cozinha no header global
- Animações Framer Motion: transitions de tela, entrada de modal, progressão de status
- Fotos reais via Unsplash (URLs estáticas no mock)
- Responsivo para desktop (≥1024px) e tablet (768px–1023px); no tablet o Kanban da cozinha usa scroll horizontal entre as 3 colunas
- Tema dark/light alternado por seção (não toggle global)

**❌ Fora:**
- Autenticação real de qualquer tipo
- Banco de dados (nenhuma persistência além de estado em memória)
- Pagamento real ou integração com gateway
- WebSocket (o timer substitui)
- Responsividade mobile abaixo de 768px
- Múltiplos restaurantes
- Histórico de pedidos entre sessões
- Notificações push
- Sistema de avaliações
- Deploy em produção

---

## 6. Critério de "Pronto"

**Checklist visual:**
- [ ] Hero full-screen com foto e tipografia Playfair Display impacta em 3 segundos
- [ ] Alternância dark/light entre seções é evidente e intencional
- [ ] Acento gold aparece consistentemente apenas em preços e CTAs
- [ ] Cards de prato têm foto de qualidade, espaçamento generoso, sem poluição visual
- [ ] Modal de detalhe abre com animação suave (Framer Motion)
- [ ] Dashboard da cozinha é distinguível do lado cliente apenas pela paleta e layout
- [ ] Nenhuma cor fora da paleta Noir aparece em qualquer tela

**Checklist funcional:**
- [ ] Fluxo cliente completo sem erros: Home → Detalhe → Carrinho → Confirmação → Status
- [ ] Filtro de categoria filtra corretamente os pratos
- [ ] Quantidade no carrinho é editável; total recalcula em tempo real
- [ ] Status do pedido avança automaticamente (5s por etapa) na tela de acompanhamento
- [ ] Status avança manualmente no dashboard da cozinha
- [ ] Pedido confirmado pelo cliente aparece imediatamente no Kanban da cozinha
- [ ] Switcher Cliente/Cozinha funciona em qualquer tela sem quebrar o estado do carrinho

**Critério final:**
> "Isso está pronto para gravar um demo de 2 minutos sem pausar para explicar o que é?"

Se a resposta for sim para todas as telas — está pronto.
