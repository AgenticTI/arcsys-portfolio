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
