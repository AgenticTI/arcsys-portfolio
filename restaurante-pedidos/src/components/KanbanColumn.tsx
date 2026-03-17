'use client'

import { AnimatePresence } from 'framer-motion'
import type { Order, OrderStatus } from '@/types'
import KanbanCard from './KanbanCard'

const COLUMN_LABELS: Partial<Record<OrderStatus, string>> = {
  received: 'Novos',
  preparing: 'Em Preparo',
  ready: 'Prontos',
}

interface KanbanColumnProps {
  status: OrderStatus
  orders: Order[]
  onAdvance: (orderId: string) => void
  onCardClick: (order: Order) => void
}

export default function KanbanColumn({ status, orders, onAdvance, onCardClick }: KanbanColumnProps) {
  return (
    <div className="flex-1 min-w-[280px] md:min-w-0">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-noir-gray/20">
        <h2 className="font-inter text-sm uppercase tracking-widest text-noir-white">
          {COLUMN_LABELS[status]}
        </h2>
        <span className="w-6 h-6 bg-noir-gray/20 text-noir-white font-inter text-xs flex items-center justify-center rounded-full">
          {orders.length}
        </span>
      </div>
      <div className="space-y-4">
        <AnimatePresence>
          {orders.map(order => (
            <KanbanCard
              key={order.id}
              order={order}
              onAdvance={onAdvance}
              onClick={onCardClick}
            />
          ))}
        </AnimatePresence>
        {orders.length === 0 && (
          <p className="font-inter text-xs text-noir-gray/40 text-center py-8 uppercase tracking-widest">
            Nenhum pedido
          </p>
        )}
      </div>
    </div>
  )
}
