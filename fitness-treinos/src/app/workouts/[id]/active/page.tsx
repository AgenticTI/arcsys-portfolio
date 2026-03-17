'use client'

import { useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
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
    if (confirm('Cancelar o treino? O progresso será perdido.')) {
      cancelWorkout()
      router.push('/workouts')
    }
  }

  return (
    <div className="pb-6">
      {/* Nav row */}
      <div className="px-5 pt-12 flex items-center gap-3">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-surface flex items-center justify-center flex-shrink-0 active:opacity-70"
          aria-label="Voltar"
        >
          <ChevronLeft size={20} className="text-text-primary" />
        </button>

        {/* Title block */}
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.5px] text-text-tertiary">
            EM ANDAMENTO
          </p>
          <h2
            className="font-bold text-text-primary truncate"
            style={{ fontSize: 18, letterSpacing: '-0.3px' }}
          >
            {workout.name}
          </h2>
        </div>

        {/* Timer badge */}
        <div
          className="flex items-center gap-1.5 px-3 py-[7px] rounded-full flex-shrink-0"
          style={{
            background: 'rgba(165,253,24,0.12)',
            border: '1px solid rgba(165,253,24,0.20)',
          }}
        >
          <svg
            width={12}
            height={12}
            viewBox="0 0 24 24"
            fill="#A5FD18"
            stroke="none"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
          </svg>
          <WorkoutTimer
            startedAt={activeWorkout.startedAt}
            onTick={(s) => { elapsedRef.current = s }}
          />
        </div>
      </div>

      {/* Exercise dots row */}
      <div className="mt-3 px-5 flex gap-[5px] overflow-x-auto [&::-webkit-scrollbar]:hidden">
        {workout.exercises.map((_, index) => {
          const isDone = index < currentExerciseIndex
          const isCurrent = index === currentExerciseIndex

          if (isCurrent) {
            return (
              <div
                key={index}
                className="h-1 rounded-full bg-accent flex-shrink-0"
                style={{
                  width: 32,
                  boxShadow: '0 0 8px rgba(165,253,24,0.5)',
                }}
              />
            )
          }

          if (isDone) {
            return (
              <div
                key={index}
                className="w-5 h-1 rounded-full flex-shrink-0"
                style={{ background: 'rgba(165,253,24,0.5)' }}
              />
            )
          }

          return (
            <div
              key={index}
              className="w-5 h-1 rounded-full bg-surface-3 flex-shrink-0"
            />
          )
        })}
      </div>

      {/* Active exercise or completion state */}
      <div className="mt-4 mx-5">
        {!allDone && currentExercise ? (
          <ActiveExercise
            exercise={currentExercise}
            currentSet={currentSetIndex + 1}
            onCompleteSet={handleCompleteSet}
          />
        ) : (
          <div className="bg-surface rounded-[22px] p-6 text-center">
            <p className="text-4xl mb-3">🎉</p>
            <p className="text-text-primary font-bold text-xl">
              Todos os exercícios concluídos!
            </p>
            <p className="text-text-secondary text-sm mt-1">
              Toque em Finalizar para salvar o treino.
            </p>
          </div>
        )}
      </div>

      {/* Exercise progress list */}
      <div className="mt-3 mx-5">
        <ExerciseProgress
          exercises={workout.exercises}
          currentExerciseIndex={currentExerciseIndex}
          completedSetsPerExercise={completedSetsPerExercise}
        />
      </div>

      {/* Finish button — visible when all done */}
      {allDone && (
        <div className="mt-4 mx-5">
          <button
            onClick={handleFinish}
            className="w-full bg-accent text-black font-bold py-4 rounded-2xl text-[17px] active:opacity-80 transition-opacity"
          >
            Finalizar Treino
          </button>
        </div>
      )}

      {/* Cancel button */}
      <div className="mt-4 mx-5 mb-6">
        <button
          onClick={handleCancel}
          className="w-full py-4 rounded-2xl bg-surface text-[17px] font-semibold text-destructive active:opacity-80 transition-opacity"
        >
          Cancelar Treino
        </button>
      </div>
    </div>
  )
}
