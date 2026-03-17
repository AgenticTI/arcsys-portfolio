import type { MuscleGroup } from '@/lib/types'
import { MUSCLE_GROUP_LABELS } from '@/lib/types'

type Category = 'push' | 'pull' | 'legs' | 'other'

function getChipCategory(group: MuscleGroup): Category {
  if (group === 'chest' || group === 'shoulders') return 'push'
  if (group === 'back') return 'pull'
  if (group === 'legs') return 'legs'
  return 'other'
}

const CHIP_STYLES: Record<Category, { background: string; color: string }> = {
  push: { background: 'rgba(165,253,24,0.12)', color: '#A5FD18' },
  pull: { background: 'rgba(10,132,255,0.12)', color: '#0A84FF' },
  legs: { background: 'rgba(255,69,58,0.10)', color: '#FF453A' },
  other: { background: 'rgba(255,159,10,0.10)', color: '#FF9F0A' },
}

type Props = {
  group: MuscleGroup
  selected?: boolean
  onClick?: () => void
}

export function MuscleChip({ group, selected = false, onClick }: Props) {
  const category = getChipCategory(group)
  const colorStyle = CHIP_STYLES[category]
  const base = 'text-xs font-semibold px-2.5 py-1 rounded-full transition-colors'

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={base}
        style={
          selected
            ? { background: colorStyle.color, color: '#000000' }
            : colorStyle
        }
      >
        {MUSCLE_GROUP_LABELS[group]}
      </button>
    )
  }

  return (
    <span
      className={base}
      style={selected ? { background: colorStyle.color, color: '#000000' } : colorStyle}
    >
      {MUSCLE_GROUP_LABELS[group]}
    </span>
  )
}
