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
