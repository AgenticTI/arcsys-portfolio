'use client'

import { motion } from 'framer-motion'
import type { OrderStatus } from '@/types'

const STEPS: { key: OrderStatus; label: string }[] = [
  { key: 'received', label: 'Recebido' },
  { key: 'preparing', label: 'Preparando' },
  { key: 'ready', label: 'Pronto' },
  { key: 'delivered', label: 'Entregue' },
]

interface StatusTrackerProps {
  currentStatus: OrderStatus
}

export default function StatusTracker({ currentStatus }: StatusTrackerProps) {
  const currentIndex = STEPS.findIndex(s => s.key === currentStatus)
  const progressPercent = (currentIndex / (STEPS.length - 1)) * 100

  return (
    <div className="py-8">
      {/* Progress bar */}
      <div className="relative mb-8">
        <div className="h-0.5 bg-noir-gray/30 w-full" />
        <motion.div
          className="absolute top-0 left-0 h-0.5 bg-noir-gold"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
        {/* Step dots */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.key}
              animate={{
                backgroundColor: i <= currentIndex ? '#C9A96E' : '#9A9088',
                borderColor: i <= currentIndex ? '#C9A96E' : '#9A9088',
                boxShadow: i <= currentIndex ? '0 0 6px #C9A96E' : 'none',
              }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="w-4 h-4 rounded-full border-2 -translate-y-px"
            />
          ))}
        </div>
      </div>

      {/* Labels */}
      <div className="flex justify-between">
        {STEPS.map((step, i) => (
          <span
            key={step.key}
            className={`font-body text-[11px] uppercase tracking-widest transition-colors ${
              i <= currentIndex ? 'text-noir-gold' : 'text-noir-gray'
            }`}
            style={{ width: '25%', textAlign: i === 0 ? 'left' : i === STEPS.length - 1 ? 'right' : 'center' }}
          >
            {step.label}
          </span>
        ))}
      </div>
    </div>
  )
}
