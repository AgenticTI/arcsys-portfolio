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
