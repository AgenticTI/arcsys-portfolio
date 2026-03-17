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
