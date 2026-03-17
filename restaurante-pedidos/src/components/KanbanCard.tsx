'use client'

import { motion } from 'framer-motion'
import type { Order, OrderStatus } from '@/types'

const STATUS_NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  received: 'Iniciar Preparo',
  preparing: 'Marcar Pronto',
}

interface KanbanCardProps {
  order: Order
  onAdvance: (orderId: string) => void
  onClick: (order: Order) => void
}

function formatElapsed(createdAt: Date): string {
  const ms = Date.now() - createdAt.getTime()
  const minutes = Math.floor(ms / 60000)
  if (minutes < 1) return 'Agora mesmo'
  if (minutes === 1) return '1 min atrás'
  return `${minutes} min atrás`
}

export default function KanbanCard({ order, onAdvance, onClick }: KanbanCardProps) {
  const nextLabel = STATUS_NEXT_LABEL[order.status]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className="bg-noir-cream border border-noir-cream hover:border-noir-gray/40 p-5 cursor-pointer transition-colors"
      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
    >
      <div onClick={() => onClick(order)}>
        <div className="flex items-center justify-between mb-3">
          <span className="font-inter font-semibold text-noir-black text-base">{order.id}</span>
          <span className="font-inter text-xs text-noir-gray">{formatElapsed(order.createdAt)}</span>
        </div>
        <ul className="mb-4 space-y-1">
          {order.items.map(item => (
            <li key={item.dish.id} className="font-inter text-sm text-noir-black">
              <span className="text-noir-gold font-medium">{item.quantity}×</span> {item.dish.name}
            </li>
          ))}
        </ul>
        <p className="font-inter text-xs text-noir-gray font-semibold">
          Total: R$ {order.totalAmount.toFixed(2).replace('.', ',')}
        </p>
      </div>

      {nextLabel && (
        <button
          onClick={(e) => { e.stopPropagation(); onAdvance(order.id) }}
          className="mt-4 w-full bg-noir-black text-noir-gold font-inter text-xs uppercase tracking-widest py-2.5 hover:bg-noir-gold hover:text-noir-black transition-all"
        >
          {nextLabel}
        </button>
      )}
    </motion.div>
  )
}
