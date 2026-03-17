'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { Session } from '@/lib/types'
import { formatDate } from '@/lib/utils'

type Props = {
  session: Session
}

export function SessionItem({ session }: Props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-surface rounded-xl overflow-hidden">
      {/* Header do accordion */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-4 flex items-center gap-3 text-left active:opacity-70 transition-opacity"
      >
        <div className="flex-1 min-w-0">
          <p className="text-text-primary font-semibold truncate">
            {session.workoutName}
          </p>
          <p className="text-text-secondary text-sm mt-0.5">
            {formatDate(session.date)}
          </p>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="text-right">
            <p className="text-text-primary text-sm font-bold">
              {(session.totalVolumeKg / 1000).toFixed(1)}t
            </p>
            <p className="text-text-secondary text-xs">{session.durationMinutes}min</p>
          </div>
          {expanded ? (
            <ChevronUp size={16} className="text-text-secondary" />
          ) : (
            <ChevronDown size={16} className="text-text-secondary" />
          )}
        </div>
      </button>

      {/* Conteúdo expandido */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-surface-elevated">
          <div className="pt-3 space-y-2">
            {session.sets.map((set, i) => (
              <div key={i} className="flex items-center justify-between">
                <p className="text-text-secondary text-sm">{set.exerciseName}</p>
                <p className="text-text-primary text-sm font-medium">
                  {set.weightKg}kg × {set.reps} reps
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
