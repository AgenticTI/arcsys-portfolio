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
