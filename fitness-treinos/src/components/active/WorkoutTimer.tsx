'use client'

import { useState, useEffect } from 'react'
import { formatDuration } from '@/lib/utils'

type Props = {
  startedAt: number
  onTick?: (seconds: number) => void
}

export function WorkoutTimer({ startedAt, onTick }: Props) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const seconds = Math.floor((Date.now() - startedAt) / 1000)
      setElapsed(seconds)
      onTick?.(seconds)
    }, 1000)
    return () => clearInterval(interval)
  }, [startedAt, onTick])

  return (
    <span
      className="tabular-nums font-bold"
      style={{ fontSize: 15, letterSpacing: '-0.3px', color: '#A5FD18' }}
    >
      {formatDuration(elapsed)}
    </span>
  )
}
