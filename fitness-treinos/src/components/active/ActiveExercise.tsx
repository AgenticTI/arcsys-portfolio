'use client'

import { useState } from 'react'
import { MUSCLE_GROUP_LABELS } from '@/lib/types'
import type { Exercise } from '@/lib/types'

type Props = {
  exercise: Exercise
  currentSet: number // 1-indexed
  onCompleteSet: (weightKg: number, reps: number) => void
}

export function ActiveExercise({ exercise, currentSet, onCompleteSet }: Props) {
  const [weight, setWeight] = useState(60)
  const [reps, setReps] = useState(10)

  function handleComplete() {
    onCompleteSet(weight, reps)
  }

  const muscleLabel = MUSCLE_GROUP_LABELS[exercise.muscleGroup]

  return (
    <div className="bg-surface rounded-[22px] p-[22px]">
      {/* Top section */}
      <p className="text-[12px] font-semibold uppercase tracking-[0.5px] text-text-tertiary mb-2">
        SÉRIE {currentSet} DE {exercise.sets}
      </p>
      <h2 className="text-[26px] font-bold tracking-[-0.5px] leading-[1.15] text-text-primary mb-3">
        {exercise.name}
      </h2>

      {/* Tags row */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="text-[12px] font-semibold px-2.5 py-1 rounded-full"
          style={{
            background: 'rgba(165,253,24,0.12)',
            color: '#A5FD18',
          }}
        >
          {muscleLabel}
        </span>
        <span className="text-[12px] font-semibold px-2.5 py-1 rounded-full bg-surface-elevated text-text-secondary">
          {exercise.sets} séries
        </span>
      </div>

      {/* Steppers grid */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        {/* Weight stepper */}
        <div className="bg-surface-elevated rounded-2xl p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.5px] text-text-tertiary mb-3">
            PESO
          </p>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setWeight((w) => Math.max(0, parseFloat((w - 2.5).toFixed(1))))}
              className="w-[34px] h-[34px] rounded-full bg-surface-3 flex items-center justify-center text-[20px] font-light text-text-primary active:opacity-70"
              aria-label="Diminuir peso"
            >
              −
            </button>
            <div className="text-center">
              <p className="text-[28px] font-bold tracking-[-1px] text-text-primary leading-none">
                {weight % 1 === 0 ? weight : weight.toFixed(1)}
              </p>
              <p className="text-[12px] font-medium text-text-tertiary mt-1">kg</p>
            </div>
            <button
              onClick={() => setWeight((w) => parseFloat((w + 2.5).toFixed(1)))}
              className="w-[34px] h-[34px] rounded-full bg-surface-3 flex items-center justify-center text-[20px] font-light text-text-primary active:opacity-70"
              aria-label="Aumentar peso"
            >
              +
            </button>
          </div>
        </div>

        {/* Reps stepper */}
        <div className="bg-surface-elevated rounded-2xl p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.5px] text-text-tertiary mb-3">
            REPS
          </p>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setReps((r) => Math.max(1, r - 1))}
              className="w-[34px] h-[34px] rounded-full bg-surface-3 flex items-center justify-center text-[20px] font-light text-text-primary active:opacity-70"
              aria-label="Diminuir repetições"
            >
              −
            </button>
            <div className="text-center">
              <p className="text-[28px] font-bold tracking-[-1px] text-text-primary leading-none">
                {reps}
              </p>
              <p className="text-[12px] font-medium text-text-tertiary mt-1">reps</p>
            </div>
            <button
              onClick={() => setReps((r) => r + 1)}
              className="w-[34px] h-[34px] rounded-full bg-surface-3 flex items-center justify-center text-[20px] font-light text-text-primary active:opacity-70"
              aria-label="Aumentar repetições"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Set tracker */}
      <div className="flex gap-2 mt-5">
        {Array.from({ length: exercise.sets }, (_, i) => {
          const serieNum = i + 1
          const isDone = serieNum < currentSet
          const isCurrent = serieNum === currentSet

          if (isDone) {
            return (
              <div
                key={i}
                className="flex-1 flex items-center justify-center h-[38px] rounded-xl text-[14px] font-bold text-accent"
                style={{ background: 'rgba(165,253,24,0.12)' }}
              >
                S{serieNum} ✓
              </div>
            )
          }

          if (isCurrent) {
            return (
              <div
                key={i}
                className="flex-1 flex items-center justify-center h-[38px] rounded-xl bg-accent text-black text-[14px] font-bold"
              >
                S{serieNum}
              </div>
            )
          }

          return (
            <div
              key={i}
              className="flex-1 flex items-center justify-center h-[38px] rounded-xl bg-surface-elevated text-text-tertiary text-[14px] font-bold"
            >
              S{serieNum}
            </div>
          )
        })}
      </div>

      {/* CTA button */}
      <button
        onClick={handleComplete}
        className="mt-5 w-full bg-accent text-black text-[17px] font-bold rounded-2xl py-4 flex items-center justify-center gap-2 active:opacity-80 transition-opacity"
      >
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        Completar Série {currentSet}
      </button>
    </div>
  )
}
