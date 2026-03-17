'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { useFitnessStore } from '@/store/fitness'
import type { Exercise, MuscleGroup } from '@/lib/types'
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
