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
