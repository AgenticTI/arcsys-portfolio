# fitness-treinos Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir um MVP de plataforma de treinos de musculação com 5 telas navegáveis, estado global em memória via Zustand e design dark com accent laranja — polido o suficiente para gravar um demo de 2 minutos.

**Architecture:** Next.js 15 App Router com componentes server/client claramente separados. Estado global gerenciado por um único Zustand store hidratado com dados mockados na inicialização do cliente. Navegação via Bottom Tab Bar persistente no layout raiz; telas de treino ativo são rotas filhas.

**Tech Stack:** Next.js 15 (App Router), Tailwind CSS v4, Zustand, Lucide React, TypeScript strict, Inter via `next/font/google`.

---

## File Map

Cada arquivo tem uma responsabilidade única. Arquivos que mudam juntos ficam juntos.

```
fitness-treinos/
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts               # tokens de cor + fonte Inter
├── src/
│   ├── app/
│   │   ├── layout.tsx               # fonte Inter, BottomTabBar, fundo #0A0A0A
│   │   ├── globals.css              # reset Tailwind v4 + CSS vars dos tokens
│   │   ├── page.tsx                 # Tela 1: Dashboard (/)
│   │   ├── workouts/
│   │   │   ├── page.tsx             # Tela 2: Lista de Treinos (/workouts)
│   │   │   ├── new/
│   │   │   │   └── page.tsx         # Tela 3: Criar Treino (/workouts/new)
│   │   │   └── [id]/
│   │   │       └── active/
│   │   │           └── page.tsx     # Tela 4: Treino Ativo (/workouts/[id]/active)
│   │   └── history/
│   │       └── page.tsx             # Tela 5: Histórico (/history)
│   ├── components/
│   │   ├── layout/
│   │   │   └── BottomTabBar.tsx     # tab bar com 3 tabs, estado ativo
│   │   ├── dashboard/
│   │   │   ├── StreakCard.tsx       # número grande + "dias seguidos"
│   │   │   ├── WeekSummary.tsx      # volume kg, treinos, músculo mais trabalhado
│   │   │   ├── NextWorkoutCard.tsx  # card do próximo treino + botão Iniciar
│   │   │   └── Heatmap.tsx          # grid 30 dias (reutilizado no histórico com prop)
│   │   ├── workouts/
│   │   │   ├── WorkoutCard.tsx      # card de treino: nome, chips, exercícios, última vez
│   │   │   └── MuscleChip.tsx       # chip de grupo muscular (selecionável ou display)
│   │   ├── create/
│   │   │   ├── ExerciseForm.tsx     # mini-form inline para adicionar exercício
│   │   │   └── ExerciseListItem.tsx # item da lista de exercícios adicionados
│   │   ├── active/
│   │   │   ├── WorkoutTimer.tsx     # timer MM:SS correndo
│   │   │   ├── ActiveExercise.tsx   # exercício atual em destaque + inputs kg/reps
│   │   │   └── ExerciseProgress.tsx # lista pendentes vs concluídos
│   │   └── history/
│   │       ├── SessionItem.tsx      # item accordion: data, nome, volume, duração
│   │       └── ContributionHeatmap.tsx  # heatmap 90 dias estilo GitHub
│   ├── store/
│   │   └── fitness.ts               # Zustand store: workouts + sessions + active workout state
│   ├── data/
│   │   └── mock.ts                  # 4 treinos + 30 sessões históricas
│   └── lib/
│       ├── types.ts                 # todos os tipos TypeScript (MuscleGroup, Exercise, Workout, Session, CompletedSet)
│       └── utils.ts                 # calcStreak, calcWeekVolume, calcHeatmapData, formatDuration
```

---

## Task 1: Scaffold do Projeto

**Files:**
- Create: `fitness-treinos/package.json`
- Create: `fitness-treinos/tsconfig.json`
- Create: `fitness-treinos/next.config.ts`
- Create: `fitness-treinos/tailwind.config.ts`
- Create: `fitness-treinos/src/app/globals.css`
- Create: `fitness-treinos/src/app/layout.tsx`

- [ ] **Step 1.1: Inicializar projeto Next.js 15**

No diretório `C:\Users\leona\Documents\Backup\Portifolio ARCSYS`:

```bash
npx create-next-app@latest fitness-treinos \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir=false \
  --import-alias "@/*" \
  --yes
```

Aguardar instalação completa. Expected: pasta `fitness-treinos/` criada com estrutura Next.js 15.

- [ ] **Step 1.2: Instalar dependências adicionais**

```bash
cd "C:\Users\leona\Documents\Backup\Portifolio ARCSYS\fitness-treinos"
npm install zustand lucide-react
```

Expected: `zustand` e `lucide-react` aparecem em `package.json` dependencies.

- [ ] **Step 1.3: Configurar tokens de cor no globals.css**

Substituir o conteúdo de `src/app/globals.css`:

```css
@import "tailwindcss";

@layer base {
  :root {
    --color-background: #0A0A0A;
    --color-surface: #141414;
    --color-surface-elevated: #1C1C1C;
    --color-accent: #FF6B00;
    --color-accent-muted: #FF6B0026;
    --color-text-primary: #F5F5F5;
    --color-text-secondary: #6B6B6B;
    --color-destructive: #FF3B30;
  }

  * {
    box-sizing: border-box;
  }

  body {
    background-color: var(--color-background);
    color: var(--color-text-primary);
    font-family: var(--font-inter), system-ui, sans-serif;
  }
}
```

- [ ] **Step 1.4: Configurar tailwind.config.ts com tokens**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        'surface-elevated': 'var(--color-surface-elevated)',
        accent: 'var(--color-accent)',
        'accent-muted': 'var(--color-accent-muted)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        destructive: 'var(--color-destructive)',
      },
      fontFamily: {
        inter: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 1.5: Configurar layout raiz com Inter e fundo escuro**

Criar `src/app/layout.tsx`:

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Fitness Treinos',
  description: 'Plataforma de treinos de musculação',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="bg-background text-text-primary min-h-screen">
        <main className="pb-20 max-w-md mx-auto min-h-screen">
          {children}
        </main>
        {/* BottomTabBar será adicionado na Task 2 */}
      </body>
    </html>
  )
}
```

- [ ] **Step 1.6: Verificar que o projeto compila**

```bash
cd "C:\Users\leona\Documents\Backup\Portifolio ARCSYS\fitness-treinos"
npm run build
```

Expected: build sem erros de TypeScript. Avisos de "no page found" são aceitáveis.

- [ ] **Step 1.7: Commit**

```bash
cd "C:\Users\leona\Documents\Backup\Portifolio ARCSYS\fitness-treinos"
git add -A
git commit -m "feat: scaffold Next.js 15 com Tailwind v4, tokens de cor e Inter"
```

---

## Task 2: Tipos, Mock Data e Zustand Store

**Files:**
- Create: `fitness-treinos/src/lib/types.ts`
- Create: `fitness-treinos/src/lib/utils.ts`
- Create: `fitness-treinos/src/data/mock.ts`
- Create: `fitness-treinos/src/store/fitness.ts`

- [ ] **Step 2.1: Criar tipos TypeScript**

Criar `src/lib/types.ts`:

```typescript
export type MuscleGroup = 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core'

export const MUSCLE_GROUP_LABELS: Record<MuscleGroup, string> = {
  chest: 'Peito',
  back: 'Costas',
  legs: 'Pernas',
  shoulders: 'Ombros',
  arms: 'Braços',
  core: 'Core',
}

export type Exercise = {
  id: string
  name: string
  muscleGroup: MuscleGroup
  sets: number
}

export type Workout = {
  id: string
  name: string
  exercises: Exercise[]
  lastDone: string | null
}

export type CompletedSet = {
  exerciseId: string
  exerciseName: string
  weightKg: number
  reps: number
}

export type Session = {
  id: string
  workoutId: string
  workoutName: string
  date: string
  durationMinutes: number
  totalVolumeKg: number
  sets: CompletedSet[]
}

// Estado de um treino em progresso
export type ActiveWorkoutState = {
  workoutId: string
  startedAt: number // Date.now()
  currentExerciseIndex: number
  currentSetIndex: number
  completedSets: CompletedSet[]
} | null
```

- [ ] **Step 2.2: Criar utilitários de cálculo**

Criar `src/lib/utils.ts`:

```typescript
import type { Session } from './types'

/** Calcula streak atual: quantos dias consecutivos (até hoje) têm pelo menos 1 sessão */
export function calcStreak(sessions: Session[]): number {
  if (sessions.length === 0) return 0

  const sessionDays = new Set(
    sessions.map((s) => s.date.split('T')[0])
  )

  let streak = 0
  const today = new Date()

  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const key = d.toISOString().split('T')[0]
    if (sessionDays.has(key)) {
      streak++
    } else {
      break
    }
  }

  return streak
}

/** Retorna volume total (kg) das sessões nos últimos 7 dias */
export function calcWeekVolume(sessions: Session[]): number {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 7)
  return sessions
    .filter((s) => new Date(s.date) >= cutoff)
    .reduce((sum, s) => sum + s.totalVolumeKg, 0)
}

/** Retorna quantidade de sessões nos últimos 7 dias */
export function calcWeekSessions(sessions: Session[]): number {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 7)
  return sessions.filter((s) => new Date(s.date) >= cutoff).length
}

/** Retorna o grupo muscular mais trabalhado nos últimos 7 dias (nome em português) */
export function calcTopMuscle(sessions: Session[]): string {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 7)
  const recentSets = sessions
    .filter((s) => new Date(s.date) >= cutoff)
    .flatMap((s) => s.sets)

  // contagem por nome (aproximação pelo nome do exercício — usamos mock conhecida)
  // Para o MVP usamos volume por sessão: retorna "Peito" como fallback se vazio
  if (recentSets.length === 0) return 'Peito'

  // Usa o nome do exercício para inferir grupo — simplificado para MVP
  const keywords: Record<string, string> = {
    supino: 'Peito', peitoral: 'Peito', crucifixo: 'Peito',
    puxada: 'Costas', remada: 'Costas', pulldown: 'Costas',
    agachamento: 'Pernas', leg: 'Pernas', cadeira: 'Pernas',
    ombro: 'Ombros', desenvolvimento: 'Ombros', elevação: 'Ombros',
    bíceps: 'Braços', tríceps: 'Braços', rosca: 'Braços',
    prancha: 'Core', abdominal: 'Core',
  }

  const counts: Record<string, number> = {}
  recentSets.forEach((set) => {
    const lower = set.exerciseName.toLowerCase()
    for (const [kw, group] of Object.entries(keywords)) {
      if (lower.includes(kw)) {
        counts[group] = (counts[group] ?? 0) + 1
        break
      }
    }
  })

  if (Object.keys(counts).length === 0) return 'Peito'
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
}

/**
 * Retorna um array de { date: string (YYYY-MM-DD), count: number } para os últimos `days` dias.
 * count = número de sessões naquele dia (0 se nenhuma).
 */
export function calcHeatmapData(
  sessions: Session[],
  days: number
): Array<{ date: string; count: number }> {
  const sessionCounts: Record<string, number> = {}
  sessions.forEach((s) => {
    const key = s.date.split('T')[0]
    sessionCounts[key] = (sessionCounts[key] ?? 0) + 1
  })

  const result: Array<{ date: string; count: number }> = []
  const today = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const key = d.toISOString().split('T')[0]
    result.push({ date: key, count: sessionCounts[key] ?? 0 })
  }

  return result
}

/** Formata segundos em MM:SS */
export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

/** Formata uma data ISO em string legível (ex: "17 mar") */
export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
  })
}
```

- [ ] **Step 2.3: Criar dados mockados**

Criar `src/data/mock.ts`:

```typescript
import type { Workout, Session } from '@/lib/types'

// Helper para gerar datas relativas ao dia de hoje
function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(18, 0, 0, 0)
  return d.toISOString()
}

export const MOCK_WORKOUTS: Workout[] = [
  {
    id: 'w1',
    name: 'Push — Peito / Ombro / Tríceps',
    exercises: [
      { id: 'e1', name: 'Supino Reto', muscleGroup: 'chest', sets: 4 },
      { id: 'e2', name: 'Crucifixo Inclinado', muscleGroup: 'chest', sets: 3 },
      { id: 'e3', name: 'Desenvolvimento com Halteres', muscleGroup: 'shoulders', sets: 4 },
      { id: 'e4', name: 'Elevação Lateral', muscleGroup: 'shoulders', sets: 3 },
      { id: 'e5', name: 'Tríceps Corda', muscleGroup: 'arms', sets: 3 },
      { id: 'e6', name: 'Tríceps Francês', muscleGroup: 'arms', sets: 3 },
    ],
    lastDone: daysAgo(1),
  },
  {
    id: 'w2',
    name: 'Pull — Costas / Bíceps',
    exercises: [
      { id: 'e7', name: 'Puxada Frontal', muscleGroup: 'back', sets: 4 },
      { id: 'e8', name: 'Remada Curvada', muscleGroup: 'back', sets: 4 },
      { id: 'e9', name: 'Remada Unilateral', muscleGroup: 'back', sets: 3 },
      { id: 'e10', name: 'Pulldown Reto', muscleGroup: 'back', sets: 3 },
      { id: 'e11', name: 'Rosca Direta', muscleGroup: 'arms', sets: 3 },
      { id: 'e12', name: 'Rosca Martelo', muscleGroup: 'arms', sets: 3 },
    ],
    lastDone: daysAgo(2),
  },
  {
    id: 'w3',
    name: 'Legs — Pernas / Core',
    exercises: [
      { id: 'e13', name: 'Agachamento Livre', muscleGroup: 'legs', sets: 5 },
      { id: 'e14', name: 'Leg Press 45°', muscleGroup: 'legs', sets: 4 },
      { id: 'e15', name: 'Cadeira Extensora', muscleGroup: 'legs', sets: 3 },
      { id: 'e16', name: 'Mesa Flexora', muscleGroup: 'legs', sets: 3 },
      { id: 'e17', name: 'Panturrilha em Pé', muscleGroup: 'legs', sets: 4 },
      { id: 'e18', name: 'Prancha Abdominal', muscleGroup: 'core', sets: 3 },
    ],
    lastDone: daysAgo(3),
  },
  {
    id: 'w4',
    name: 'Full Body',
    exercises: [
      { id: 'e19', name: 'Supino Reto', muscleGroup: 'chest', sets: 3 },
      { id: 'e20', name: 'Puxada Frontal', muscleGroup: 'back', sets: 3 },
      { id: 'e21', name: 'Agachamento Livre', muscleGroup: 'legs', sets: 3 },
      { id: 'e22', name: 'Desenvolvimento com Halteres', muscleGroup: 'shoulders', sets: 3 },
      { id: 'e23', name: 'Rosca Direta', muscleGroup: 'arms', sets: 2 },
    ],
    lastDone: daysAgo(4),
  },
]

// Gera 30 sessões nos últimos 45 dias com padrão Push/Pull/Legs/Full
function generateSessions(): Session[] {
  const sessions: Session[] = []
  const workoutRotation = ['w1', 'w2', 'w3', 'w1', 'w4', 'w2', 'w3']
  const workoutNames: Record<string, string> = {
    w1: 'Push — Peito / Ombro / Tríceps',
    w2: 'Pull — Costas / Bíceps',
    w3: 'Legs — Pernas / Core',
    w4: 'Full Body',
  }
  const volumes: Record<string, number> = {
    w1: 4800, w2: 5200, w3: 6100, w4: 3900,
  }

  // Distribui ~30 sessões em 45 dias, pulando ~1/3 dos dias
  const trainingDays = [
    0, 1, 3, 4, 6, 7, 8, 10, 11, 13,
    14, 15, 17, 18, 20, 21, 22, 24, 25, 27,
    28, 29, 31, 32, 34, 35, 36, 38, 39, 41,
  ]

  trainingDays.forEach((dayOffset, index) => {
    const wId = workoutRotation[index % workoutRotation.length]
    sessions.push({
      id: `s${index + 1}`,
      workoutId: wId,
      workoutName: workoutNames[wId],
      date: daysAgo(dayOffset),
      durationMinutes: 45 + Math.floor(Math.random() * 25),
      totalVolumeKg: volumes[wId] + Math.floor(Math.random() * 800 - 400),
      sets: [
        { exerciseId: 'e1', exerciseName: 'Supino Reto', weightKg: 80, reps: 10 },
        { exerciseId: 'e1', exerciseName: 'Supino Reto', weightKg: 82.5, reps: 8 },
        { exerciseId: 'e7', exerciseName: 'Puxada Frontal', weightKg: 70, reps: 12 },
        { exerciseId: 'e13', exerciseName: 'Agachamento Livre', weightKg: 100, reps: 8 },
      ],
    })
  })

  return sessions
}

export const MOCK_SESSIONS: Session[] = generateSessions()
```

- [ ] **Step 2.4: Criar Zustand store**

Criar `src/store/fitness.ts`:

```typescript
import { create } from 'zustand'
import type { Workout, Session, CompletedSet, ActiveWorkoutState } from '@/lib/types'
import { MOCK_WORKOUTS, MOCK_SESSIONS } from '@/data/mock'

type FitnessStore = {
  // Data
  workouts: Workout[]
  sessions: Session[]
  activeWorkout: ActiveWorkoutState

  // Actions — Workouts
  addWorkout: (workout: Workout) => void

  // Actions — Active Workout
  startWorkout: (workoutId: string) => void
  completeSet: (set: CompletedSet) => void
  nextExercise: () => void
  finishWorkout: (durationSeconds: number) => void
  cancelWorkout: () => void
}

export const useFitnessStore = create<FitnessStore>((set, get) => ({
  workouts: MOCK_WORKOUTS,
  sessions: MOCK_SESSIONS,
  activeWorkout: null,

  addWorkout: (workout) =>
    set((state) => ({ workouts: [...state.workouts, workout] })),

  startWorkout: (workoutId) =>
    set({
      activeWorkout: {
        workoutId,
        startedAt: Date.now(),
        currentExerciseIndex: 0,
        currentSetIndex: 0,
        completedSets: [],
      },
    }),

  completeSet: (completedSet) =>
    set((state) => {
      if (!state.activeWorkout) return state
      const workout = state.workouts.find(
        (w) => w.id === state.activeWorkout!.workoutId
      )
      if (!workout) return state

      const updatedSets = [...state.activeWorkout.completedSets, completedSet]
      const exercise = workout.exercises[state.activeWorkout.currentExerciseIndex]
      const nextSetIndex = state.activeWorkout.currentSetIndex + 1

      // Avança para próximo set ou próximo exercício
      if (nextSetIndex < exercise.sets) {
        return {
          activeWorkout: {
            ...state.activeWorkout,
            currentSetIndex: nextSetIndex,
            completedSets: updatedSets,
          },
        }
      } else {
        const nextExerciseIndex = state.activeWorkout.currentExerciseIndex + 1
        return {
          activeWorkout: {
            ...state.activeWorkout,
            currentExerciseIndex: nextExerciseIndex,
            currentSetIndex: 0,
            completedSets: updatedSets,
          },
        }
      }
    }),

  nextExercise: () =>
    set((state) => {
      if (!state.activeWorkout) return state
      return {
        activeWorkout: {
          ...state.activeWorkout,
          currentExerciseIndex: state.activeWorkout.currentExerciseIndex + 1,
          currentSetIndex: 0,
        },
      }
    }),

  finishWorkout: (durationSeconds) => {
    const state = get()
    if (!state.activeWorkout) return

    const workout = state.workouts.find(
      (w) => w.id === state.activeWorkout!.workoutId
    )
    if (!workout) return

    const totalVolumeKg = state.activeWorkout.completedSets.reduce(
      (sum, s) => sum + s.weightKg * s.reps,
      0
    )

    const session: Session = {
      id: `s${Date.now()}`,
      workoutId: workout.id,
      workoutName: workout.name,
      date: new Date().toISOString(),
      durationMinutes: Math.round(durationSeconds / 60),
      totalVolumeKg,
      sets: state.activeWorkout.completedSets,
    }

    set((s) => ({
      sessions: [session, ...s.sessions],
      activeWorkout: null,
      workouts: s.workouts.map((w) =>
        w.id === workout.id
          ? { ...w, lastDone: session.date }
          : w
      ),
    }))
  },

  cancelWorkout: () => set({ activeWorkout: null }),
}))
```

- [ ] **Step 2.5: Verificar types com TypeScript**

```bash
cd "C:\Users\leona\Documents\Backup\Portifolio ARCSYS\fitness-treinos"
npx tsc --noEmit
```

Expected: zero erros de tipo.

- [ ] **Step 2.6: Commit**

```bash
git add src/lib/types.ts src/lib/utils.ts src/data/mock.ts src/store/fitness.ts
git commit -m "feat: tipos, mock data (4 treinos + 30 sessões) e Zustand store"
```

---

## Task 3: Bottom Tab Bar e Layout

**Files:**
- Create: `fitness-treinos/src/components/layout/BottomTabBar.tsx`
- Modify: `fitness-treinos/src/app/layout.tsx`

- [ ] **Step 3.1: Criar BottomTabBar**

Criar `src/components/layout/BottomTabBar.tsx`:

```typescript
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Dumbbell, History } from 'lucide-react'

const tabs = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/workouts', label: 'Treinos', icon: Dumbbell },
  { href: '/history', label: 'Histórico', icon: History },
]

export function BottomTabBar() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-surface-elevated">
      <div className="max-w-md mx-auto flex">
        {tabs.map(({ href, label, icon: Icon }) => {
          // Considera ativo: exact match para '/', startsWith para outros
          const isActive =
            href === '/' ? pathname === '/' : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center gap-1 py-3 px-2 transition-colors"
            >
              <Icon
                size={22}
                className={isActive ? 'text-accent' : 'text-text-secondary'}
              />
              <span
                className={`text-xs font-medium ${
                  isActive ? 'text-accent' : 'text-text-secondary'
                }`}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
```

- [ ] **Step 3.2: Adicionar BottomTabBar ao layout raiz**

Modificar `src/app/layout.tsx` para incluir o BottomTabBar:

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { BottomTabBar } from '@/components/layout/BottomTabBar'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Fitness Treinos',
  description: 'Plataforma de treinos de musculação',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="bg-background text-text-primary min-h-screen">
        <main className="pb-20 max-w-md mx-auto min-h-screen">
          {children}
        </main>
        <BottomTabBar />
      </body>
    </html>
  )
}
```

- [ ] **Step 3.3: Criar página placeholder para cada rota**

Criar `src/app/page.tsx` (temporário):

```typescript
export default function DashboardPage() {
  return <div className="p-6 text-text-primary">Dashboard</div>
}
```

Criar `src/app/workouts/page.tsx`:

```typescript
export default function WorkoutsPage() {
  return <div className="p-6 text-text-primary">Treinos</div>
}
```

Criar `src/app/history/page.tsx`:

```typescript
export default function HistoryPage() {
  return <div className="p-6 text-text-primary">Histórico</div>
}
```

- [ ] **Step 3.4: Verificar no browser**

```bash
cd "C:\Users\leona\Documents\Backup\Portifolio ARCSYS\fitness-treinos"
npm run dev
```

Abrir `http://localhost:3000`. Verificar:
- Fundo `#0A0A0A` na página inteira
- Bottom tab bar visível na base
- Clicar nos 3 tabs navega corretamente
- Tab ativo fica laranja

- [ ] **Step 3.5: Commit**

```bash
git add src/components/layout/BottomTabBar.tsx src/app/layout.tsx src/app/page.tsx src/app/workouts/page.tsx src/app/history/page.tsx
git commit -m "feat: bottom tab bar com estado ativo e navegação entre tabs"
```

---

## Task 4: Tela 1 — Dashboard

**Files:**
- Create: `fitness-treinos/src/components/dashboard/StreakCard.tsx`
- Create: `fitness-treinos/src/components/dashboard/WeekSummary.tsx`
- Create: `fitness-treinos/src/components/dashboard/NextWorkoutCard.tsx`
- Create: `fitness-treinos/src/components/dashboard/Heatmap.tsx`
- Modify: `fitness-treinos/src/app/page.tsx`

- [ ] **Step 4.1: Criar StreakCard**

Criar `src/components/dashboard/StreakCard.tsx`:

```typescript
type Props = {
  streak: number
}

export function StreakCard({ streak }: Props) {
  return (
    <div className="bg-surface rounded-2xl p-6 flex items-center gap-6">
      <div className="flex-1">
        <p className="text-text-secondary text-sm font-medium uppercase tracking-wider mb-1">
          Sequência atual
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-7xl font-black text-text-primary leading-none">
            {streak}
          </span>
          <span className="text-text-secondary text-base font-medium">
            {streak === 1 ? 'dia seguido' : 'dias seguidos'}
          </span>
        </div>
      </div>
      <div className="text-5xl">🔥</div>
    </div>
  )
}
```

- [ ] **Step 4.2: Criar WeekSummary**

Criar `src/components/dashboard/WeekSummary.tsx`:

```typescript
type Props = {
  volumeKg: number
  sessionsCount: number
  topMuscle: string
}

function StatBox({
  value,
  label,
}: {
  value: string
  label: string
}) {
  return (
    <div className="bg-surface rounded-xl p-4 flex-1">
      <p className="text-2xl font-bold text-text-primary">{value}</p>
      <p className="text-text-secondary text-xs mt-1">{label}</p>
    </div>
  )
}

export function WeekSummary({ volumeKg, sessionsCount, topMuscle }: Props) {
  return (
    <div>
      <p className="text-text-secondary text-sm font-medium uppercase tracking-wider mb-3">
        Esta semana
      </p>
      <div className="flex gap-3">
        <StatBox value={`${(volumeKg / 1000).toFixed(1)}t`} label="Volume total" />
        <StatBox value={String(sessionsCount)} label="Treinos" />
        <StatBox value={topMuscle} label="Foco principal" />
      </div>
    </div>
  )
}
```

- [ ] **Step 4.3: Criar NextWorkoutCard**

Criar `src/components/dashboard/NextWorkoutCard.tsx`:

```typescript
'use client'

import { useRouter } from 'next/navigation'
import { Play } from 'lucide-react'
import type { Workout } from '@/lib/types'
import { MUSCLE_GROUP_LABELS } from '@/lib/types'

type Props = {
  workout: Workout
}

export function NextWorkoutCard({ workout }: Props) {
  const router = useRouter()
  const muscleGroups = [
    ...new Set(workout.exercises.map((e) => e.muscleGroup)),
  ]

  return (
    <div className="bg-surface rounded-2xl p-5">
      <p className="text-text-secondary text-sm font-medium uppercase tracking-wider mb-2">
        Próximo treino
      </p>
      <p className="text-text-primary text-xl font-bold mb-2">{workout.name}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {muscleGroups.map((mg) => (
          <span
            key={mg}
            className="bg-accent-muted text-accent text-xs font-semibold px-2.5 py-1 rounded-full"
          >
            {MUSCLE_GROUP_LABELS[mg]}
          </span>
        ))}
      </div>
      <p className="text-text-secondary text-sm mb-4">
        {workout.exercises.length} exercícios
      </p>
      <button
        onClick={() => router.push(`/workouts/${workout.id}/active`)}
        className="w-full bg-accent text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 active:opacity-80 transition-opacity"
      >
        <Play size={18} fill="white" />
        Iniciar treino
      </button>
    </div>
  )
}
```

- [ ] **Step 4.4: Criar Heatmap**

Criar `src/components/dashboard/Heatmap.tsx`:

```typescript
type HeatmapDay = {
  date: string
  count: number
}

type Props = {
  data: HeatmapDay[]
  columns?: number // quantas colunas no grid (default 6 para 30 dias)
}

function getIntensityClass(count: number): string {
  if (count === 0) return 'bg-surface-elevated'
  if (count === 1) return 'bg-accent opacity-40'
  return 'bg-accent'
}

export function Heatmap({ data, columns = 6 }: Props) {
  return (
    <div>
      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {data.map((day) => (
          <div
            key={day.date}
            title={`${day.date}: ${day.count} treino(s)`}
            className={`aspect-square rounded-sm ${getIntensityClass(day.count)}`}
          />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4.5: Montar Dashboard completo**

Substituir `src/app/page.tsx`:

```typescript
'use client'

import { useFitnessStore } from '@/store/fitness'
import { calcStreak, calcWeekVolume, calcWeekSessions, calcTopMuscle, calcHeatmapData } from '@/lib/utils'
import { StreakCard } from '@/components/dashboard/StreakCard'
import { WeekSummary } from '@/components/dashboard/WeekSummary'
import { NextWorkoutCard } from '@/components/dashboard/NextWorkoutCard'
import { Heatmap } from '@/components/dashboard/Heatmap'

export default function DashboardPage() {
  const { sessions, workouts } = useFitnessStore()

  const streak = calcStreak(sessions)
  const weekVolume = calcWeekVolume(sessions)
  const weekSessionsCount = calcWeekSessions(sessions)
  const topMuscle = calcTopMuscle(sessions)
  const heatmapData = calcHeatmapData(sessions, 30)

  // Próximo treino: o que foi feito há mais tempo (lastDone mais antigo ou null)
  const nextWorkout = [...workouts].sort((a, b) => {
    if (!a.lastDone) return -1
    if (!b.lastDone) return 1
    return new Date(a.lastDone).getTime() - new Date(b.lastDone).getTime()
  })[0]

  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <div className="px-4 pt-12 pb-6 space-y-5">
      {/* Header */}
      <div>
        <p className="text-text-secondary text-sm capitalize">{today}</p>
        <h1 className="text-text-primary text-2xl font-bold mt-0.5">
          Bom treino, Leon 👊
        </h1>
      </div>

      {/* Streak */}
      <StreakCard streak={streak} />

      {/* Resumo semanal */}
      <WeekSummary
        volumeKg={weekVolume}
        sessionsCount={weekSessionsCount}
        topMuscle={topMuscle}
      />

      {/* Próximo treino */}
      {nextWorkout && <NextWorkoutCard workout={nextWorkout} />}

      {/* Heatmap 30 dias */}
      <div className="bg-surface rounded-2xl p-5">
        <p className="text-text-secondary text-sm font-medium uppercase tracking-wider mb-4">
          Últimos 30 dias
        </p>
        <Heatmap data={heatmapData} columns={6} />
      </div>
    </div>
  )
}
```

- [ ] **Step 4.6: Verificar no browser**

Abrir `http://localhost:3000`. Verificar:
- Streak com número grande em destaque
- WeekSummary com 3 stat boxes
- NextWorkoutCard com botão laranja "Iniciar treino"
- Heatmap com quadrados, a maioria laranja/colorida (não vazia)
- Zero fundo branco escapando

- [ ] **Step 4.7: Commit**

```bash
git add src/components/dashboard/ src/app/page.tsx
git commit -m "feat: tela Dashboard com streak, resumo semanal, próximo treino e heatmap"
```

---

## Task 5: Tela 2 — Lista de Treinos

**Files:**
- Create: `fitness-treinos/src/components/workouts/MuscleChip.tsx`
- Create: `fitness-treinos/src/components/workouts/WorkoutCard.tsx`
- Modify: `fitness-treinos/src/app/workouts/page.tsx`

- [ ] **Step 5.1: Criar MuscleChip**

Criar `src/components/workouts/MuscleChip.tsx`:

```typescript
import type { MuscleGroup } from '@/lib/types'
import { MUSCLE_GROUP_LABELS } from '@/lib/types'

type Props = {
  group: MuscleGroup
  selected?: boolean
  onClick?: () => void
}

export function MuscleChip({ group, selected = false, onClick }: Props) {
  const base = 'text-xs font-semibold px-2.5 py-1 rounded-full transition-colors'
  const active = 'bg-accent text-white'
  const inactive = 'bg-surface-elevated text-text-secondary'

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`${base} ${selected ? active : inactive}`}
      >
        {MUSCLE_GROUP_LABELS[group]}
      </button>
    )
  }

  return (
    <span className={`${base} ${selected ? active : 'bg-accent-muted text-accent'}`}>
      {MUSCLE_GROUP_LABELS[group]}
    </span>
  )
}
```

- [ ] **Step 5.2: Criar WorkoutCard**

Criar `src/components/workouts/WorkoutCard.tsx`:

```typescript
'use client'

import { useRouter } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import type { Workout, MuscleGroup } from '@/lib/types'
import { MuscleChip } from './MuscleChip'
import { formatDate } from '@/lib/utils'

type Props = {
  workout: Workout
}

export function WorkoutCard({ workout }: Props) {
  const router = useRouter()
  const muscleGroups = [
    ...new Set(workout.exercises.map((e) => e.muscleGroup)),
  ] as MuscleGroup[]

  return (
    <button
      onClick={() => router.push(`/workouts/${workout.id}/active`)}
      className="w-full bg-surface rounded-2xl p-5 text-left flex items-start justify-between gap-4 active:opacity-70 transition-opacity"
    >
      <div className="flex-1 min-w-0">
        <p className="text-text-primary font-bold text-lg leading-tight mb-2 truncate">
          {workout.name}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {muscleGroups.map((mg) => (
            <MuscleChip key={mg} group={mg} />
          ))}
        </div>
        <div className="flex items-center gap-3 text-text-secondary text-sm">
          <span>{workout.exercises.length} exercícios</span>
          {workout.lastDone && (
            <>
              <span>·</span>
              <span>Último: {formatDate(workout.lastDone)}</span>
            </>
          )}
        </div>
      </div>
      <ChevronRight size={20} className="text-text-secondary flex-shrink-0 mt-1" />
    </button>
  )
}
```

- [ ] **Step 5.3: Montar página de lista de treinos**

Substituir `src/app/workouts/page.tsx`:

```typescript
'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'
import { useFitnessStore } from '@/store/fitness'
import { WorkoutCard } from '@/components/workouts/WorkoutCard'

export default function WorkoutsPage() {
  const { workouts } = useFitnessStore()

  return (
    <div className="px-4 pt-12 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-text-primary text-2xl font-bold">Meus Treinos</h1>
        <Link
          href="/workouts/new"
          className="bg-accent text-white rounded-full p-2.5 flex items-center justify-center active:opacity-80 transition-opacity"
          aria-label="Novo treino"
        >
          <Plus size={20} />
        </Link>
      </div>

      {/* Lista */}
      <div className="space-y-3">
        {workouts.map((workout) => (
          <WorkoutCard key={workout.id} workout={workout} />
        ))}
      </div>

      {workouts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-text-secondary text-base">Nenhum treino ainda.</p>
          <p className="text-text-secondary text-sm mt-1">
            Toque em + para criar seu primeiro treino.
          </p>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 5.4: Verificar no browser**

Navegar para `/workouts`. Verificar:
- 4 cards de treinos listados
- Cada card com chips de grupos musculares em laranja
- Clique em um card navega para `/workouts/[id]/active` (pode mostrar 404 por enquanto)
- Botão "+" no header leva para `/workouts/new`

- [ ] **Step 5.5: Commit**

```bash
git add src/components/workouts/ src/app/workouts/page.tsx
git commit -m "feat: tela Lista de Treinos com cards e navegação"
```

---

## Task 6: Tela 3 — Criar Treino

**Files:**
- Create: `fitness-treinos/src/components/create/ExerciseForm.tsx`
- Create: `fitness-treinos/src/components/create/ExerciseListItem.tsx`
- Create: `fitness-treinos/src/app/workouts/new/page.tsx`

- [ ] **Step 6.1: Criar ExerciseListItem**

Criar `src/components/create/ExerciseListItem.tsx`:

```typescript
import { X } from 'lucide-react'
import type { Exercise } from '@/lib/types'
import { MUSCLE_GROUP_LABELS } from '@/lib/types'

type Props = {
  exercise: Exercise
  onRemove: () => void
}

export function ExerciseListItem({ exercise, onRemove }: Props) {
  return (
    <div className="bg-surface-elevated rounded-xl px-4 py-3 flex items-center justify-between gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-text-primary font-medium truncate">{exercise.name}</p>
        <p className="text-text-secondary text-sm mt-0.5">
          {MUSCLE_GROUP_LABELS[exercise.muscleGroup]} · {exercise.sets} séries
        </p>
      </div>
      <button
        onClick={onRemove}
        className="text-text-secondary active:text-destructive transition-colors p-1"
        aria-label="Remover exercício"
      >
        <X size={18} />
      </button>
    </div>
  )
}
```

- [ ] **Step 6.2: Criar ExerciseForm**

Criar `src/components/create/ExerciseForm.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { Exercise, MuscleGroup } from '@/lib/types'
import { MUSCLE_GROUP_LABELS } from '@/lib/types'
import { MuscleChip } from '@/components/workouts/MuscleChip'

type Props = {
  onAdd: (exercise: Exercise) => void
}

const ALL_MUSCLE_GROUPS: MuscleGroup[] = [
  'chest', 'back', 'legs', 'shoulders', 'arms', 'core',
]

export function ExerciseForm({ onAdd }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>('chest')
  const [sets, setSets] = useState(3)

  function handleSubmit() {
    if (!name.trim()) return
    onAdd({
      id: `ex-${Date.now()}`,
      name: name.trim(),
      muscleGroup,
      sets,
    })
    setName('')
    setSets(3)
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full border border-dashed border-surface-elevated rounded-xl py-3.5 flex items-center justify-center gap-2 text-text-secondary active:text-text-primary transition-colors"
      >
        <Plus size={18} />
        <span className="font-medium text-sm">Adicionar exercício</span>
      </button>
    )
  }

  return (
    <div className="bg-surface-elevated rounded-xl p-4 space-y-3">
      <input
        type="text"
        placeholder="Nome do exercício"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full bg-surface rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary text-sm outline-none focus:ring-1 focus:ring-accent"
        autoFocus
      />
      <div>
        <p className="text-text-secondary text-xs mb-2">Grupo muscular</p>
        <div className="flex flex-wrap gap-2">
          {ALL_MUSCLE_GROUPS.map((mg) => (
            <MuscleChip
              key={mg}
              group={mg}
              selected={muscleGroup === mg}
              onClick={() => setMuscleGroup(mg)}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <p className="text-text-secondary text-sm flex-1">Séries</p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSets(Math.max(1, sets - 1))}
            className="bg-surface rounded-lg w-9 h-9 flex items-center justify-center text-text-primary font-bold active:opacity-70"
          >
            −
          </button>
          <span className="text-text-primary font-bold w-5 text-center">{sets}</span>
          <button
            onClick={() => setSets(sets + 1)}
            className="bg-surface rounded-lg w-9 h-9 flex items-center justify-center text-text-primary font-bold active:opacity-70"
          >
            +
          </button>
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => setIsOpen(false)}
          className="flex-1 py-2.5 rounded-lg text-text-secondary text-sm font-medium bg-surface active:opacity-70"
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          disabled={!name.trim()}
          className="flex-1 py-2.5 rounded-lg text-white text-sm font-bold bg-accent disabled:opacity-40 active:opacity-80"
        >
          Adicionar
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 6.3: Montar página Criar Treino**

Criar `src/app/workouts/new/page.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { useFitnessStore } from '@/store/fitness'
import type { Exercise, MuscleGroup } from '@/lib/types'
import { MUSCLE_GROUP_LABELS } from '@/lib/types'
import { MuscleChip } from '@/components/workouts/MuscleChip'
import { ExerciseForm } from '@/components/create/ExerciseForm'
import { ExerciseListItem } from '@/components/create/ExerciseListItem'

const ALL_MUSCLE_GROUPS: MuscleGroup[] = [
  'chest', 'back', 'legs', 'shoulders', 'arms', 'core',
]

export default function NewWorkoutPage() {
  const router = useRouter()
  const { addWorkout } = useFitnessStore()

  const [name, setName] = useState('')
  const [selectedGroups, setSelectedGroups] = useState<MuscleGroup[]>([])
  const [exercises, setExercises] = useState<Exercise[]>([])

  function toggleGroup(mg: MuscleGroup) {
    setSelectedGroups((prev) =>
      prev.includes(mg) ? prev.filter((g) => g !== mg) : [...prev, mg]
    )
  }

  function handleAddExercise(exercise: Exercise) {
    setExercises((prev) => [...prev, exercise])
    // Auto-seleciona o grupo muscular do exercício adicionado
    if (!selectedGroups.includes(exercise.muscleGroup)) {
      setSelectedGroups((prev) => [...prev, exercise.muscleGroup])
    }
  }

  function handleRemoveExercise(id: string) {
    setExercises((prev) => prev.filter((e) => e.id !== id))
  }

  function handleSave() {
    if (!name.trim() || exercises.length === 0) return
    addWorkout({
      id: `w-${Date.now()}`,
      name: name.trim(),
      exercises,
      lastDone: null,
    })
    router.push('/workouts')
  }

  const canSave = name.trim().length > 0 && exercises.length > 0

  return (
    <div className="px-4 pt-12 pb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="text-text-secondary active:text-text-primary transition-colors"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-text-primary text-xl font-bold">Novo Treino</h1>
      </div>

      <div className="space-y-5">
        {/* Nome do treino */}
        <div>
          <label className="text-text-secondary text-sm font-medium block mb-2">
            Nome do treino
          </label>
          <input
            type="text"
            placeholder="Ex: Push A — Peito e Ombros"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-surface rounded-xl px-4 py-3.5 text-text-primary placeholder-text-secondary outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        {/* Grupos musculares */}
        <div>
          <label className="text-text-secondary text-sm font-medium block mb-2">
            Grupos musculares
          </label>
          <div className="flex flex-wrap gap-2">
            {ALL_MUSCLE_GROUPS.map((mg) => (
              <MuscleChip
                key={mg}
                group={mg}
                selected={selectedGroups.includes(mg)}
                onClick={() => toggleGroup(mg)}
              />
            ))}
          </div>
        </div>

        {/* Exercícios */}
        <div>
          <label className="text-text-secondary text-sm font-medium block mb-2">
            Exercícios ({exercises.length})
          </label>
          <div className="space-y-2 mb-3">
            {exercises.map((exercise) => (
              <ExerciseListItem
                key={exercise.id}
                exercise={exercise}
                onRemove={() => handleRemoveExercise(exercise.id)}
              />
            ))}
          </div>
          <ExerciseForm onAdd={handleAddExercise} />
        </div>

        {/* Botão Salvar */}
        <button
          onClick={handleSave}
          disabled={!canSave}
          className="w-full bg-accent text-white font-bold py-4 rounded-xl disabled:opacity-30 active:opacity-80 transition-opacity mt-4"
        >
          Salvar treino
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 6.4: Verificar no browser**

Navegar para `/workouts/new`. Verificar:
- Input de nome funcionando
- Chips de grupo muscular selecionáveis (ficam laranjas)
- Botão "Adicionar exercício" abre form inline
- Form inline permite selecionar grupo e ajustar séries
- Exercício adicionado aparece na lista com botão X
- Botão "Salvar treino" habilitado apenas com nome + ao menos 1 exercício
- Após salvar, redireciona para `/workouts` e novo treino aparece na lista

- [ ] **Step 6.5: Commit**

```bash
git add src/components/create/ src/app/workouts/new/page.tsx
git commit -m "feat: tela Criar Treino com form inline de exercícios e salvamento no store"
```

---

## Task 7: Tela 4 — Treino Ativo

**Files:**
- Create: `fitness-treinos/src/components/active/WorkoutTimer.tsx`
- Create: `fitness-treinos/src/components/active/ActiveExercise.tsx`
- Create: `fitness-treinos/src/components/active/ExerciseProgress.tsx`
- Create: `fitness-treinos/src/app/workouts/[id]/active/page.tsx`

- [ ] **Step 7.1: Criar WorkoutTimer**

Criar `src/components/active/WorkoutTimer.tsx`:

```typescript
'use client'

import { useState, useEffect } from 'react'
import { formatDuration } from '@/lib/utils'

type Props = {
  startedAt: number
  onTick?: (seconds: number) => void
}

export function WorkoutTimer({ startedAt, onTick }: Props) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const seconds = Math.floor((Date.now() - startedAt) / 1000)
      setElapsed(seconds)
      onTick?.(seconds)
    }, 1000)
    return () => clearInterval(interval)
  }, [startedAt, onTick])

  return (
    <span className="text-text-secondary text-sm font-medium tabular-nums">
      {formatDuration(elapsed)}
    </span>
  )
}
```

- [ ] **Step 7.2: Criar ActiveExercise**

Criar `src/components/active/ActiveExercise.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import type { Exercise } from '@/lib/types'

type Props = {
  exercise: Exercise
  currentSet: number // 1-indexed
  onCompleteSet: (weightKg: number, reps: number) => void
}

export function ActiveExercise({ exercise, currentSet, onCompleteSet }: Props) {
  const [weight, setWeight] = useState('')
  const [reps, setReps] = useState('')

  function handleComplete() {
    const w = parseFloat(weight)
    const r = parseInt(reps, 10)
    if (isNaN(w) || isNaN(r) || w <= 0 || r <= 0) return
    onCompleteSet(w, r)
    setWeight('')
    setReps('')
  }

  const canComplete = weight !== '' && reps !== '' &&
    !isNaN(parseFloat(weight)) && !isNaN(parseInt(reps, 10))

  return (
    <div className="bg-surface rounded-2xl p-6">
      {/* Exercício */}
      <div className="mb-5">
        <p className="text-text-secondary text-sm font-medium uppercase tracking-wider mb-1">
          Exercício atual
        </p>
        <h2 className="text-text-primary text-2xl font-bold leading-tight">
          {exercise.name}
        </h2>
        <p className="text-accent font-semibold mt-1">
          Série {currentSet} de {exercise.sets}
        </p>
      </div>

      {/* Inputs kg / reps */}
      <div className="flex gap-3 mb-5">
        <div className="flex-1">
          <label className="text-text-secondary text-xs font-medium block mb-1.5">
            Peso (kg)
          </label>
          <input
            type="number"
            inputMode="decimal"
            placeholder="0"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full bg-surface-elevated rounded-xl px-4 py-3 text-text-primary text-xl font-bold text-center outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
        <div className="flex-1">
          <label className="text-text-secondary text-xs font-medium block mb-1.5">
            Repetições
          </label>
          <input
            type="number"
            inputMode="numeric"
            placeholder="0"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="w-full bg-surface-elevated rounded-xl px-4 py-3 text-text-primary text-xl font-bold text-center outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
      </div>

      {/* Botão Concluir Série */}
      <button
        onClick={handleComplete}
        disabled={!canComplete}
        className="w-full bg-accent text-white font-bold py-4 rounded-xl text-base flex items-center justify-center gap-2 disabled:opacity-30 active:opacity-80 transition-opacity"
      >
        <CheckCircle size={20} />
        Concluir série
      </button>
    </div>
  )
}
```

- [ ] **Step 7.3: Criar ExerciseProgress**

Criar `src/components/active/ExerciseProgress.tsx`:

```typescript
import { CheckCircle, Circle } from 'lucide-react'
import type { Exercise } from '@/lib/types'

type Props = {
  exercises: Exercise[]
  currentExerciseIndex: number
  completedSetsPerExercise: number[]
}

export function ExerciseProgress({
  exercises,
  currentExerciseIndex,
  completedSetsPerExercise,
}: Props) {
  return (
    <div className="space-y-2">
      {exercises.map((exercise, index) => {
        const completedSets = completedSetsPerExercise[index] ?? 0
        const isDone = completedSets >= exercise.sets
        const isCurrent = index === currentExerciseIndex
        const isPending = index > currentExerciseIndex

        return (
          <div
            key={exercise.id}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 ${
              isCurrent
                ? 'bg-surface-elevated border border-accent/30'
                : 'bg-surface'
            } ${isPending ? 'opacity-50' : ''}`}
          >
            {isDone ? (
              <CheckCircle size={18} className="text-accent flex-shrink-0" />
            ) : (
              <Circle
                size={18}
                className={isCurrent ? 'text-accent' : 'text-text-secondary'}
              />
            )}
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-medium truncate ${
                  isDone ? 'text-text-secondary line-through' : 'text-text-primary'
                }`}
              >
                {exercise.name}
              </p>
            </div>
            <p className="text-text-secondary text-xs">
              {completedSets}/{exercise.sets} séries
            </p>
          </div>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 7.4: Montar página Treino Ativo**

Criar `src/app/workouts/[id]/active/page.tsx`:

```typescript
'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import { useFitnessStore } from '@/store/fitness'
import { WorkoutTimer } from '@/components/active/WorkoutTimer'
import { ActiveExercise } from '@/components/active/ActiveExercise'
import { ExerciseProgress } from '@/components/active/ExerciseProgress'
import type { CompletedSet } from '@/lib/types'

export default function ActiveWorkoutPage() {
  const params = useParams()
  const router = useRouter()
  const workoutId = params.id as string

  const { workouts, activeWorkout, startWorkout, completeSet, finishWorkout, cancelWorkout } =
    useFitnessStore()

  const workout = workouts.find((w) => w.id === workoutId)
  const elapsedRef = useRef(0)

  // Inicia o treino se ainda não foi iniciado (ou se o activeWorkout é de outro treino)
  useEffect(() => {
    if (!activeWorkout || activeWorkout.workoutId !== workoutId) {
      startWorkout(workoutId)
    }
  }, [workoutId]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!workout) {
    return (
      <div className="px-4 pt-12 text-text-secondary text-center">
        Treino não encontrado.
      </div>
    )
  }

  if (!activeWorkout || activeWorkout.workoutId !== workoutId) {
    return null // aguardando startWorkout
  }

  const { currentExerciseIndex, currentSetIndex, completedSets } = activeWorkout
  const currentExercise = workout.exercises[currentExerciseIndex]
  const allDone = currentExerciseIndex >= workout.exercises.length

  // Conta quantas séries foram completadas por exercício
  const completedSetsPerExercise = workout.exercises.map((ex) =>
    completedSets.filter((s) => s.exerciseId === ex.id).length
  )

  function handleCompleteSet(weightKg: number, reps: number) {
    if (!currentExercise) return
    const set: CompletedSet = {
      exerciseId: currentExercise.id,
      exerciseName: currentExercise.name,
      weightKg,
      reps,
    }
    completeSet(set)
  }

  function handleFinish() {
    finishWorkout(elapsedRef.current)
    router.push('/history')
  }

  function handleCancel() {
    cancelWorkout()
    router.push('/workouts')
  }

  return (
    <div className="px-4 pt-10 pb-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-text-primary font-bold text-lg leading-tight">
            {workout.name}
          </h1>
          <WorkoutTimer
            startedAt={activeWorkout.startedAt}
            onTick={(s) => { elapsedRef.current = s }}
          />
        </div>
        <button
          onClick={handleCancel}
          className="text-text-secondary active:text-destructive transition-colors p-1"
          aria-label="Cancelar treino"
        >
          <X size={22} />
        </button>
      </div>

      {/* Exercício ativo ou estado de conclusão */}
      {!allDone && currentExercise ? (
        <ActiveExercise
          exercise={currentExercise}
          currentSet={currentSetIndex + 1}
          onCompleteSet={handleCompleteSet}
        />
      ) : (
        <div className="bg-surface rounded-2xl p-6 text-center">
          <p className="text-4xl mb-3">🎉</p>
          <p className="text-text-primary font-bold text-xl">
            Todos os exercícios concluídos!
          </p>
          <p className="text-text-secondary text-sm mt-1">
            Toque em Finalizar para salvar o treino.
          </p>
        </div>
      )}

      {/* Lista de progresso */}
      <div>
        <p className="text-text-secondary text-xs font-medium uppercase tracking-wider mb-2">
          Progresso
        </p>
        <ExerciseProgress
          exercises={workout.exercises}
          currentExerciseIndex={currentExerciseIndex}
          completedSetsPerExercise={completedSetsPerExercise}
        />
      </div>

      {/* Botão Finalizar — visível quando tudo concluído */}
      {allDone && (
        <button
          onClick={handleFinish}
          className="w-full bg-accent text-white font-bold py-4 rounded-xl text-base active:opacity-80 transition-opacity"
        >
          Finalizar treino
        </button>
      )}
    </div>
  )
}
```

- [ ] **Step 7.5: Verificar no browser**

Navegar para `/workouts` e clicar em um treino. Verificar:
- Timer iniciando e correndo (MM:SS)
- Exercício atual em destaque com nome e "Série X de Y"
- Inputs de peso e reps funcionando
- Botão "Concluir série" desabilitado com campos vazios, habilitado após preencher
- Após concluir uma série, avança para próxima (indicador de série muda)
- Após concluir todas as séries de um exercício, avança para próximo na lista de progresso
- Quando todos concluídos, aparece botão "Finalizar treino"
- Após finalizar, redireciona para `/history`

- [ ] **Step 7.6: Commit**

```bash
git add src/components/active/ src/app/workouts/[id]/active/page.tsx
git commit -m "feat: tela Treino Ativo com timer, registro de séries e finalização"
```

---

## Task 8: Tela 5 — Histórico

**Files:**
- Create: `fitness-treinos/src/components/history/ContributionHeatmap.tsx`
- Create: `fitness-treinos/src/components/history/SessionItem.tsx`
- Modify: `fitness-treinos/src/app/history/page.tsx`

- [ ] **Step 8.1: Criar ContributionHeatmap (90 dias, estilo GitHub)**

Criar `src/components/history/ContributionHeatmap.tsx`:

```typescript
import { calcHeatmapData } from '@/lib/utils'
import type { Session } from '@/lib/types'

type Props = {
  sessions: Session[]
}

function getColor(count: number): string {
  if (count === 0) return '#1C1C1C'
  if (count === 1) return '#FF6B0066'
  return '#FF6B00'
}

export function ContributionHeatmap({ sessions }: Props) {
  // 90 dias = 13 semanas completas (91 dias). Arredondamos para 91.
  const data = calcHeatmapData(sessions, 91)

  // Agrupa em semanas de 7 dias
  const weeks: Array<typeof data> = []
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7))
  }

  return (
    <div>
      <div className="flex gap-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day) => (
              <div
                key={day.date}
                title={`${day.date}: ${day.count} treino(s)`}
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: getColor(day.count) }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-3 justify-end">
        <span className="text-text-secondary text-xs">Menos</span>
        {[0, 1, 2].map((v) => (
          <div
            key={v}
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: getColor(v) }}
          />
        ))}
        <span className="text-text-secondary text-xs">Mais</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 8.2: Criar SessionItem (accordion)**

Criar `src/components/history/SessionItem.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { Session } from '@/lib/types'
import { formatDate } from '@/lib/utils'

type Props = {
  session: Session
}

export function SessionItem({ session }: Props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-surface rounded-xl overflow-hidden">
      {/* Header do accordion */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-4 flex items-center gap-3 text-left active:opacity-70 transition-opacity"
      >
        <div className="flex-1 min-w-0">
          <p className="text-text-primary font-semibold truncate">
            {session.workoutName}
          </p>
          <p className="text-text-secondary text-sm mt-0.5">
            {formatDate(session.date)}
          </p>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="text-right">
            <p className="text-text-primary text-sm font-bold">
              {(session.totalVolumeKg / 1000).toFixed(1)}t
            </p>
            <p className="text-text-secondary text-xs">{session.durationMinutes}min</p>
          </div>
          {expanded ? (
            <ChevronUp size={16} className="text-text-secondary" />
          ) : (
            <ChevronDown size={16} className="text-text-secondary" />
          )}
        </div>
      </button>

      {/* Conteúdo expandido */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-surface-elevated">
          <div className="pt-3 space-y-2">
            {session.sets.map((set, i) => (
              <div key={i} className="flex items-center justify-between">
                <p className="text-text-secondary text-sm">{set.exerciseName}</p>
                <p className="text-text-primary text-sm font-medium">
                  {set.weightKg}kg × {set.reps} reps
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 8.3: Montar página Histórico**

Substituir `src/app/history/page.tsx`:

```typescript
'use client'

import { useFitnessStore } from '@/store/fitness'
import { ContributionHeatmap } from '@/components/history/ContributionHeatmap'
import { SessionItem } from '@/components/history/SessionItem'

export default function HistoryPage() {
  const { sessions } = useFitnessStore()

  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div className="px-4 pt-12 pb-6">
      <h1 className="text-text-primary text-2xl font-bold mb-6">Histórico</h1>

      {/* Heatmap 90 dias */}
      <div className="bg-surface rounded-2xl p-5 mb-6">
        <p className="text-text-secondary text-sm font-medium uppercase tracking-wider mb-4">
          Frequência — últimos 90 dias
        </p>
        <ContributionHeatmap sessions={sessions} />
      </div>

      {/* Lista de sessões */}
      <div>
        <p className="text-text-secondary text-sm font-medium uppercase tracking-wider mb-3">
          Sessões ({sortedSessions.length})
        </p>
        <div className="space-y-2">
          {sortedSessions.map((session) => (
            <SessionItem key={session.id} session={session} />
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 8.4: Verificar no browser**

Navegar para `/history`. Verificar:
- Heatmap de 90 dias populado e visualmente reconhecível (maioria dos dias com cor)
- Legenda "Menos / Mais" ao lado do heatmap
- Lista de 30 sessões ordenadas por data (mais recente primeiro)
- Clicar em uma sessão expande o accordion e mostra exercícios com peso/reps
- Clicar novamente fecha o accordion

- [ ] **Step 8.5: Commit**

```bash
git add src/components/history/ src/app/history/page.tsx
git commit -m "feat: tela Histórico com heatmap 90 dias e lista expandível de sessões"
```

---

## Task 9: Polish e Verificação Final

**Files:** Todos os arquivos existentes (ajustes de UI).

- [ ] **Step 9.1: Verificar checklist visual da spec**

Abrir o app em `http://localhost:3000` e percorrer cada item:

- [ ] Fundo `#0A0A0A` consistente em todas as 5 telas — sem branco escapando em nenhum componente
- [ ] Accent laranja `#FF6B00` aparece **apenas** em CTAs, progress e destaques — não em borders decorativos ou backgrounds genéricos
- [ ] Números grandes (streak, volume) legíveis à distância (>48px, Inter 700+)
- [ ] Bottom tab bar sempre visível com estado ativo indicado em laranja
- [ ] Heatmap populado e visualmente reconhecível nas telas Dashboard e Histórico
- [ ] Cards com borda/sombra sutil distinguíveis do fundo — verificar que `bg-surface` (`#141414`) contrasta com `bg-background` (`#0A0A0A`)

Se algum item falhar, corrigir o componente correspondente antes de continuar.

- [ ] **Step 9.2: Verificar checklist funcional da spec**

- [ ] Dashboard carrega com streak calculado (número > 0 baseado nos mocks)
- [ ] Dashboard mostra próximo treino sugerido
- [ ] Consigo criar um treino do zero em `/workouts/new` e ele aparece em `/workouts`
- [ ] Consigo iniciar um treino mockado em `/workouts/[id]/active`
- [ ] Consigo registrar 2 séries completas (peso + reps) e ver o progresso avançar
- [ ] Consigo finalizar o treino e ser redirecionado para `/history`
- [ ] A sessão recém-finalizada aparece no topo do histórico
- [ ] Heatmap do histórico reflete as sessões mockadas (não vazio)
- [ ] Navegação entre todas as 5 telas funciona sem erro de console

- [ ] **Step 9.3: TypeScript check final**

```bash
cd "C:\Users\leona\Documents\Backup\Portifolio ARCSYS\fitness-treinos"
npx tsc --noEmit
```

Expected: zero erros. Se houver erros, corrigir antes de continuar.

- [ ] **Step 9.4: Build de produção**

```bash
npm run build
```

Expected: build completo sem erros. Warnings de `useEffect` dependencies são aceitáveis se o comportamento estiver correto.

- [ ] **Step 9.5: Commit final**

```bash
git add -A
git commit -m "polish: ajustes visuais finais, TypeScript clean, pronto para demo"
```

---

## Paralelismo para Subagents

Este plano pode ser executado por múltiplos sub-agentes em paralelo respeitando as dependências abaixo:

```
Task 1 (Scaffold)
    └─► Task 2 (Tipos + Store + Mock)
            ├─► Task 3 (Layout + Tab Bar)   ←── bloqueante para Tasks 4-8
            │       ├─► Task 4 (Dashboard)
            │       ├─► Task 5 (Lista Treinos)
            │       ├─► Task 6 (Criar Treino)
            │       ├─► Task 7 (Treino Ativo)
            │       └─► Task 8 (Histórico)
            │               └─► Task 9 (Polish)
```

**Tasks 4, 5, 6, 7 e 8 são independentes entre si** após a Task 3 estar completa — podem rodar em paralelo em sub-agentes separados, cada um com sua própria branch de trabalho, depois merge em `main`.

---

## Critério de Aceite

O plano está concluído quando o seguinte fluxo de demo funciona sem interrupções:

1. Abrir `http://localhost:3000` → Dashboard com streak e heatmap visíveis
2. Navegar para **Treinos** → 4 cards listados
3. Tocar em **"+"** → criar um treino com 2 exercícios → salvar → aparece na lista
4. Voltar à lista → clicar num treino mockado → tela ativa com timer
5. Registrar 2 séries (peso + reps) → progresso avança
6. Finalizar treino → redireciona para **Histórico**
7. Sessão recém-criada aparece no topo, heatmap atualizado

Tempo estimado de demo: 90 segundos.
