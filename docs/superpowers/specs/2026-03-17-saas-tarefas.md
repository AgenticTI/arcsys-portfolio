# Hazel — SaaS Gerenciador de Tarefas

**Data:** 2026-03-17
**Autor:** Leon
**Status:** Aprovada
**Projeto:** saas-tarefas (MVP #5 do Portfólio ARCSYS)

---

## 1. Identidade do Nicho

### Contexto
Freelancers e pequenas equipes que precisam organizar projetos pessoais e profissionais. Conhecem ferramentas como Notion e Linear, mas querem algo mais limpo e focado. O sistema precisa parecer um produto real — não um exercício acadêmico.

### Referências Visuais (Dribbble)

| # | Título | Autor | URL | O que extrair |
|---|--------|-------|-----|---------------|
| 1 | Minimal Task Manager App UI | Vivek Unni | https://dribbble.com/shots/26249399-Minimal-Task-Manager-App-UI | Layout single-column, priority tags coloridas, espaço em branco generoso, soft pastels com accent roxo vibrante |
| 2 | Task Manager App - Productivity Dashboard UI | Madalina | https://dribbble.com/shots/26993044-Task-Manager-App-Productivity-Dashboard-UI | Soft gradients, visual hierarchy clara, progress tracking at a glance, elegant e minimal |
| 3 | Desktop App UI for Task Manager | Sigma Software Design | https://dribbble.com/shots/19201408-Desktop-App-UI-for-Task-Manager | Web/desktop version, all important information on one screen, sidebar escura + conteúdo claro |

**Padrão emergente das referências:** roxo/violeta como accent, fundo claro, espaço em branco generoso, hierarquia visual por tipografia e cor — alinhado com Apple design language.

### Paleta de Cores

| Token | Valor | Uso |
|-------|-------|-----|
| `bg-sidebar` | `#111118` | Sidebar escura |
| `bg-main` | `#F7F7F8` | Área de conteúdo principal |
| `bg-card` | `#FFFFFF` | Cards de tarefa |
| `accent` | `#7C3AED` | CTA, badges, itens ativos na sidebar |
| `accent-soft` | `#EDE9FE` | Background de tags de prioridade |
| `text-primary` | `#0D0D12` | Títulos e textos principais |
| `text-muted` | `#6B7280` | Labels, metadados, placeholders |
| `border` | `#E5E7EB` | Divisores e bordas de cards |
| `priority-high` | `#EF4444` | Badge prioridade alta |
| `priority-medium` | `#F59E0B` | Badge prioridade média |
| `priority-low` | `#10B981` | Badge prioridade baixa |

**Justificativa:** Roxo (#7C3AED) é a cor de SaaS premium moderno (Linear, Loom, Notion). Sidebar escura com conteúdo claro é o padrão reconhecível de produto real. A complexidade está no movimento (Framer Motion), não na cor — quanto mais simples parece, mais sofisticado é por dentro.

### Tipografia
**Inter** — pesos 400 / 500 / 600 / 700. Sem serifa, neutro, Apple-adjacent, amplamente disponível via Google Fonts.

### Estilo Geral
**deliberado · claro · quieto · preciso · confiável**

---

## 2. Stack

| Camada | Escolha | Justificativa |
|--------|---------|---------------|
| Framework | Next.js 14 (App Router) | SSR, file-based routing, estrutura profissional |
| Linguagem | TypeScript | Tipagem forte — diferencial explícito no portfólio |
| Estilização | Tailwind CSS | Utility-first, fácil de manter consistência de design tokens |
| Animações | Framer Motion | Animações Apple-level sem código complexo |
| Drag-and-drop | @dnd-kit/core + @dnd-kit/sortable | Acessível, performático, padrão moderno (substitui react-beautiful-dnd) |
| Estado global | Zustand | Simples, sem boilerplate, persiste com localStorage middleware |
| Dados | Mock estático (TypeScript) | Sem backend — dados em `src/data/mock.ts` |

---

## 3. Telas e Fluxo de Navegação

### Layout Base (persiste em todas as telas)
- **Sidebar esquerda** (240px, `#111118`): logo Hazel, lista de projetos mockados com indicador de cor, nav items (Dashboard / Tarefas / Configurações), avatar do usuário no rodapé
- **Área principal** (`#F7F7F8`): header contextual com título da tela + área de conteúdo

### Tela 1 — Dashboard (`/dashboard`)
**O que exibe:**
- Saudação com nome do usuário ("Bom dia, Leon")
- 3 cards de resumo: Tarefas Hoje / Em Progresso / Concluídas (números calculados dos mocks)
- Mini gráfico de barras de progresso semanal (7 dias, dados mockados)
- Lista rápida das 3 próximas tarefas com prazo mais próximo

**Sensação:** "você está no controle"

### Tela 2 — Board / Lista de Tarefas (`/board/[projectId]`)
**O que exibe:**
- Header com nome do projeto ativo
- 3 colunas mini-kanban no topo mostrando contagem por status (A Fazer / Em Progresso / Concluído) — clicando filtra a lista abaixo
- Lista principal de tarefas com drag-and-drop para reordenar
- Cada TaskCard: checkbox animado, título, badge de prioridade (Alta/Média/Baixa), data de vencimento, status toggle inline

**Interações:**
- Drag-and-drop reordena tarefas na lista
- Clique no status toggle altera status e atualiza os contadores do mini-kanban
- Clique na tarefa abre o painel de detalhe

**Sensação:** "tudo em um lugar"

### Tela 3 — Detalhe da Tarefa (painel slide-in sobre o Board)
**O que exibe:**
- Painel deslizante da direita (Framer Motion: `x: "100%"` → `x: 0`)
- Título editável inline
- Descrição da tarefa
- Seletor de prioridade
- Data de vencimento
- Checklist de sub-tarefas (2–4 itens, cada um checkável)
- Botão "Marcar como concluída"
- Botão de fechar (X) que reverte a animação

**Sensação:** "foco total na tarefa"

### Tela 4 — Perfil / Configurações (`/settings`)
**O que exibe:**
- Avatar com iniciais, nome e email mockados
- Seção "Preferências": toggle de notificações (decorativo), seletor de tema (só light ativo)
- Seção "Sobre o Hazel": versão e link fictício para docs

**Sensação:** "produto completo com estrutura"

### Fluxo Principal do Usuário
```
Dashboard
  → clica num projeto na sidebar
  → Board (lista de tarefas do projeto)
    → clica numa tarefa
    → Detalhe abre como painel slide-in
    → fecha painel
  → volta ao Board

Sidebar (acessível em qualquer tela)
  → clica em "Configurações" na nav
  → /settings
```

**Tempo de demo:** o fluxo completo é gravável em menos de 90 segundos.

---

## 4. Dados Mockados

### Arquivo único: `src/data/mock.ts`

**Projetos (3):**
```ts
type Project = {
  id: string
  name: string
  color: string       // cor do indicador na sidebar
  taskCount: number
}

// Exemplos:
// { id: "p1", name: "Website Redesign", color: "#7C3AED", taskCount: 5 }
// { id: "p2", name: "Mobile App", color: "#10B981", taskCount: 4 }
// { id: "p3", name: "Marketing Q2", color: "#F59E0B", taskCount: 3 }
```

**Tarefas (12, distribuídas entre os projetos):**
```ts
type Task = {
  id: string
  projectId: string
  title: string
  description: string
  priority: "high" | "medium" | "low"
  status: "todo" | "in_progress" | "done"
  dueDate: string          // ISO date string
  subtasks: Subtask[]      // 2–4 por tarefa
  createdAt: string
}

type Subtask = {
  id: string
  title: string
  completed: boolean
}
```

**Distribuição das 12 tarefas:**
- 5 `todo` / 4 `in_progress` / 3 `done` — proporção que faz o dashboard parecer "em uso real"
- 3 tarefas com prioridade alta (aparecem em destaque)
- Datas variadas: hoje, amanhã, próxima semana — cria urgência visual no Dashboard

**Usuário (1):**
```ts
type User = {
  name: string          // "Leon"
  email: string         // "leon@hazel.app"
  avatarInitials: string // "L"
}
```

**Onde cada mock é usado:**
| Mock | Usado em |
|------|---------|
| `projects` | Sidebar (ProjectList), Dashboard (nome do projeto) |
| `tasks` | Board (TaskList), Dashboard (contagens e lista rápida) |
| `user` | Sidebar (avatar rodapé), Settings (perfil) |

---

## 5. Scope do MVP

### ✅ O que está dentro
- 4 telas funcionais (Dashboard, Board, Detalhe, Settings)
- Drag-and-drop para reordenar tarefas na lista
- Status toggle (todo → in_progress → done) com atualização imediata do mini-kanban
- Checkbox de tarefa com animação Framer Motion (scale + opacity)
- Painel de detalhe com slide-in animation
- Sub-tarefas checkáveis dentro do painel de detalhe
- Persistência via localStorage (mudanças sobrevivem a reload)
- Sidebar com troca de projeto ativo
- Dashboard com contagens reais calculadas dos mocks
- TypeScript em todo o projeto
- Arquitetura feature-based

### ❌ O que está fora (explicitamente)
- Autenticação real
- Banco de dados real
- Criação de novos projetos
- Criação de novas tarefas (só edição/interação com as mockadas)
- Dark mode toggle funcional
- Responsividade mobile (desktop-first, demo gravado em 1440px)
- Deploy em produção
- Testes automatizados
- Internacionalização

---

## 6. Critério de "Pronto"

### Checklist Visual
- [ ] Sidebar com fundo `#111118` e item ativo destacado em `#7C3AED`
- [ ] Cards com badge de prioridade colorido (vermelho/âmbar/verde)
- [ ] Animação de checkbox visível e satisfatória ao completar
- [ ] Slide-in do painel de detalhe fluido (sem jank)
- [ ] Dashboard com números que parecem dados de uso real
- [ ] Espaço em branco generoso — nenhuma tela parece "apertada"
- [ ] Tipografia Inter com hierarquia clara (tamanho e peso)

### Checklist Funcional
- [ ] Drag-and-drop reordena e persiste via localStorage
- [ ] Status toggle atualiza os contadores do mini-kanban instantaneamente
- [ ] Sub-tarefas checkáveis no painel de detalhe
- [ ] Troca de projeto na sidebar carrega as tarefas corretas
- [ ] Clicar em uma tarefa abre o painel de detalhe com os dados corretos da tarefa selecionada
- [ ] Dashboard calcula contagens reais a partir do estado Zustand

### Pergunta final
**"Isso está pronto para gravar um demo de 2 minutos?"**

Sim, se: abrir no browser em 1440px, navegar pelas 4 telas sem hesitar, arrastar uma tarefa, completar uma sub-tarefa, e tudo parecer intencional — não improvisado.
