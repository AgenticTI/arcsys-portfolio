'use client'

import { AnimatePresence } from 'framer-motion'
import KanbanCard from './KanbanCard'
import type { Order, OrderStatus } from '@/types'

const COLUMN_LABELS: Record<OrderStatus, string> = {
  received:  'Novos Pedidos',
  preparing: 'Em Preparo',
  ready:     'Prontos',
  delivered: 'Entregues',
}

const DOT_STYLE: Record<OrderStatus, { background: string; boxShadow: string }> = {
  received:  { background: '#C9A96E', boxShadow: '0 0 6px rgba(201,169,110,0.5)' },
  preparing: { background: '#f59e0b', boxShadow: '0 0 6px rgba(245,158,11,0.5)' },
  ready:     { background: '#4ade80', boxShadow: '0 0 6px rgba(74,222,128,0.5)' },
  delivered: { background: '#9A9088', boxShadow: 'none' },
}

interface KanbanColumnProps {
  status: OrderStatus
  orders: Order[]
  onAdvance: (orderId: string) => void
  onCardClick: (order: Order) => void
}

export default function KanbanColumn({ status, orders, onAdvance, onCardClick }: KanbanColumnProps) {
  const dotStyle = DOT_STYLE[status]
  const title = COLUMN_LABELS[status]

  return (
    <div className="flex flex-col" style={{ background: '#110f0c', minHeight: 'calc(100vh - 112px)' }}>
      {/* Column header */}
      <div
        className="sticky top-[57px] z-10 flex items-center gap-3 px-6 py-5"
        style={{ background: '#110f0c', borderBottom: '2px solid rgba(240,234,224,0.08)' }}
      >
        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={dotStyle} />
        <span className="font-caps text-[13px] tracking-[0.25em] uppercase text-noir-white flex-1">
          {title}
        </span>
        <span
          className="w-6 h-6 rounded-full flex items-center justify-center font-body text-[13px] text-noir-white"
          style={{ background: 'rgba(240,234,224,0.12)' }}
        >
          {orders.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2.5 p-3.5 flex-1">
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
          <p className="text-center font-script text-[26px] text-noir-white/15 leading-relaxed pt-10 px-4">
            os pratos<br />seguem em preparo…
          </p>
        )}
      </div>
    </div>
  )
}
