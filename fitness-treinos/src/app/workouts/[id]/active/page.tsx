'use client'

import { useEffect, useRef } from 'react'
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
