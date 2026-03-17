# fitness-treinos — Plataforma de Treinos

**Data:** 2026-03-17
**Autor:** Leon
**Status:** Aprovada

---

## 1. Identidade do Nicho

**Contexto:** Praticantes de musculação e treino funcional que precisam registrar treinos, acompanhar cargas e monitorar consistência. O usuário típico está na academia com o celular na mão — precisa de uma interface rápida, legível com uma mão, sem fricção.

**Referências visuais coletadas:**
- [Apple Fitness iOS — Mobbin](https://mobbin.com/screens/f63c41b2-c028-4f68-8f83-7b72c0eb47b2) — activity rings, dark/light adaptativo, segmented controls, SF Pro Display
- [Future iOS Workout Overview — Mobbin](https://mobbin.com/explore/screens/7a7d0256-2454-4e34-88da-fce5571d6686) — calendar de consistência, dark, hierarquia numérica clara
- [Ultrahuman iOS — 60fps.design](https://60fps.design/apps/ultrahuman) — minimalismo extremo, Inter, card-based, whitespace generoso
- [Dribbble: dark-fitness-app](https://dribbble.com/search/dark-fitness-app) — dark com accent laranja/âmbar, tipografia bold para números de performance

**Paleta de cores:**
| Token | Valor | Uso |
|-------|-------|-----|
| `background` | `#0A0A0A` | Fundo base |
| `surface` | `#141414` | Cards, modais |
| `surface-elevated` | `#1C1C1C` | Inputs, hover states |
| `accent` | `#FF6B00` | CTAs, progress, destaque |
| `accent-muted` | `#FF6B0026` | Backgrounds de badges, fills |
| `text-primary` | `#F5F5F5` | Títulos, números grandes |
| `text-secondary` | `#6B6B6B` | Labels, subtítulos |
| `destructive` | `#FF3B30` | Deletar, erro |

**Justificativa das cores:** Preto profundo reduz distração durante o treino. Laranja/âmbar comunica energia e intensidade sem a frieza do azul nem a artificialidade do verde-neon. Hierarquia de texto em dois tons (branco quase puro + cinza médio) é o padrão Apple para dark mode.

**Tipografia:** Inter (via `next/font/google`)
- Display numbers (kg, reps, streak): `Inter 700–900`, 48–72px
- Títulos de seção: `Inter 600`, 20–24px
- Body / labels: `Inter 400–500`, 14–16px

**Estilo geral:** Focado. Intenso. Preciso. Denso. Sem ruído. Como um personal trainer de luxo — tudo serve ao movimento, nada é enfeite.

---

## 2. Stack

**Framework:** Next.js 15 (App Router)
**Justificativa:** Demonstra domínio de App Router, separação server/client components, estrutura de projeto production-ready — exatamente o que um recrutador técnico avalia.

**Estilização:** Tailwind CSS v4
**Ícones:** Lucide React
**Fontes:** `next/font` com Inter

**Gerenciamento de estado:** Zustand
**Justificativa:** Padrão de mercado atual para estado global em React. Demonstra decisão técnica consciente. Código limpo, sem boilerplate de Redux, sem fragilidade de Context para estado que muda com frequência.

**Linguagem:** TypeScript strict — tipos explícitos em todos os modelos de dados, sem `any`.

**Sem bibliotecas de componentes prontos** (shadcn, MUI, etc.) — identidade visual totalmente própria, coerente com o princípio Apple da spec pai.

---

## 3. Telas e Fluxo de Navegação

**Navegação principal:** Bottom tab bar com 3 tabs — Dashboard, Treinos, Histórico.
Criar Treino e Treino Ativo são páginas filhas acessadas via navegação programática.

### Tela 1 — Dashboard (`/`)
**O que exibe:**
- Saudação com data atual
- Streak atual em destaque (número grande + label "dias seguidos")
- Resumo da semana: volume total (kg), treinos realizados, músculo mais trabalhado
- Card do próximo treino sugerido com botão "Iniciar"
- Mini heatmap dos últimos 30 dias (grid de quadrados coloridos por intensidade)

**Interações:**
- Botão "Iniciar" no card → navega para `/workouts/[id]/active`

---

### Tela 2 — Lista de Treinos (`/workouts`)
**O que exibe:**
- Grid/lista de cards de treinos salvos
- Cada card: nome do treino, grupos musculares (chips), nº de exercícios, última vez realizado

**Interações:**
- Clique num card → navega para o treino ativo `/workouts/[id]/active`
- Botão flutuante "+" → navega para `/workouts/new`

---

### Tela 3 — Criar Treino (`/workouts/new`)
**O que exibe:**
- Input de nome do treino
- Chips de seleção de grupo muscular (Peito, Costas, Pernas, Ombro, Braço, Core)
- Lista de exercícios adicionados (nome + número de séries planejadas)
- Botão inline "Adicionar exercício" (abre um mini-form inline)
- Botão "Salvar treino"

**Interações:**
- Salvar → adiciona ao store Zustand → redireciona para `/workouts`

---

### Tela 4 — Treino Ativo (`/workouts/[id]/active`)
**O que exibe:**
- Nome do treino + timer correndo (MM:SS)
- Exercício atual em destaque: nome, indicador "Série X de Y"
- Inputs de peso (kg) e repetições realizadas
- Botão "Concluir série" — accent laranja, tamanho grande (fácil de tocar)
- Lista de exercícios do treino abaixo: pendentes vs. concluídos
- Botão "Finalizar treino" (disponível após completar todos os exercícios)

**Interações:**
- "Concluir série" → salva o set no store, avança para próxima série/exercício
- "Finalizar treino" → cria uma `Session` no store → redireciona para `/history`

---

### Tela 5 — Histórico (`/history`)
**O que exibe:**
- Heatmap de frequência (últimos 90 dias, estilo GitHub contribution graph)
- Lista cronológica de sessões: data, nome do treino, volume total (kg), duração (min)
- Cada item expansível → mostra exercícios com pesos e reps registrados

**Interações:**
- Clique na sessão → expande inline (accordion)

---

## 4. Dados Mockados

**Localização:** `src/data/mock.ts` — inicializa o store Zustand na primeira renderização.

**Estrutura de tipos:**

```typescript
type MuscleGroup = 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core'

type Exercise = {
  id: string
  name: string
  muscleGroup: MuscleGroup
  sets: number           // séries planejadas
}

type Workout = {
  id: string
  name: string
  exercises: Exercise[]
  lastDone: string | null  // ISO date string
}

type CompletedSet = {
  exerciseName: string
  weightKg: number
  reps: number
}

type Session = {
  id: string
  workoutId: string
  workoutName: string
  date: string             // ISO date string
  durationMinutes: number
  totalVolumeKg: number
  sets: CompletedSet[]
}
```

**Mocks incluídos:**
- 4 treinos salvos: Push (Peito/Ombro/Tríceps), Pull (Costas/Bíceps), Legs (Pernas/Core), Full Body
- Cada treino com 4–6 exercícios reais (ex: Supino Reto, Puxada Frontal, Agachamento Livre)
- 30 sessões históricas distribuídas nos últimos 45 dias, com volume e duração variados
- Streak atual calculado dinamicamente a partir das sessões mockadas

**Onde cada mock é usado:**
- `workouts` → Tela 2 (lista), Tela 3 (referência), Tela 4 (treino ativo)
- `sessions` → Tela 1 (dashboard: streak, resumo semanal, heatmap), Tela 5 (histórico)

---

## 5. Scope do MVP

**✅ Dentro:**
- 5 telas navegáveis e funcionais
- Criar treino com nome, grupo muscular e exercícios
- Iniciar treino e registrar séries (peso + reps) com timer
- Concluir treino e gerar sessão no histórico
- Dashboard com streak, volume semanal, heatmap 30 dias e próximo treino sugerido
- Histórico com heatmap 90 dias e lista expandível de sessões
- Estado em memória via Zustand (persiste durante a sessão do browser)
- TypeScript strict em todos os modelos
- Design dark + accent laranja consistente em todas as telas

**❌ Fora:**
- Autenticação real
- Banco de dados real (sem Prisma, sem Supabase)
- Persistência entre sessões (sem localStorage, sem cookies)
- Timer com notificações push ou alarme sonoro
- Editar ou deletar treinos existentes
- Perfil de usuário
- Filtros no histórico
- Exportar/importar dados
- Deploy em produção
- Integração com qualquer API externa

---

## 6. Critério de "Pronto"

**Checklist visual:**
- [ ] Fundo `#0A0A0A` consistente em todas as telas, sem branco escapando
- [ ] Accent laranja `#FF6B00` aparece apenas em CTAs, progress e destaques — não em decoração
- [ ] Números grandes (streak, volume) legíveis à distância
- [ ] Bottom tab bar sempre visível e com estado ativo indicado
- [ ] Heatmap populado e visualmente reconhecível (não uma grade vazia)
- [ ] Cards com sombra/borda sutil — distinguíveis do fundo sem serem pesados

**Checklist funcional:**
- [ ] Dashboard carrega com streak calculado e próximo treino sugerido
- [ ] Consigo criar um treino do zero e ele aparece na lista de treinos
- [ ] Consigo iniciar um treino mockado, registrar séries com peso/reps e finalizar
- [ ] Ao finalizar, a sessão aparece no histórico
- [ ] Heatmap do histórico reflete as sessões mockadas (não está vazio)
- [ ] Navegação entre todas as 5 telas funciona sem erro

**Pergunta final:** Isso está pronto para gravar um demo de 2 minutos?
> Sim, quando: abro o app → mostro o dashboard com streak → navego para treinos → crio um treino → inicio um treino existente → registro 2 séries → finalizo → vou ao histórico e mostro o heatmap. Fluxo completo em 90 segundos, zero explicação necessária.
