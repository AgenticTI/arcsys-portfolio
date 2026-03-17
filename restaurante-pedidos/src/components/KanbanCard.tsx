'use client'

import { motion } from 'framer-motion'
import type { Order, OrderStatus } from '@/types'

const STATUS_NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  received: 'Iniciar Preparo',
  preparing: 'Marcar Pronto',
}

const STATUS_CARD_STYLE: Record<string, { background: string; borderLeft: string }> = {
  received: { background: '#1C1510', borderLeft: '3px solid #C9A96E' },
  preparing: { background: '#1c1505', borderLeft: '3px solid #f59e0b' },
  ready:     { background: '#0e1c10', borderLeft: '3px solid #4ade80' },
}

const BTN_STYLE: Record<string, { border: string; color: string; background: string }> = {
  received: {
    border: '1px solid rgba(201,169,110,0.5)',
    color: '#C9A96E',
    background: 'rgba(201,169,110,0.1)',
  },
  preparing: {
    border: '1px solid rgba(74,222,128,0.5)',
    color: '#4ade80',
    background: 'rgba(74,222,128,0.08)',
  },
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
  const cardStyle = STATUS_CARD_STYLE[order.status] ?? STATUS_CARD_STYLE.received
  const btnStyle = order.status !== 'ready' ? BTN_STYLE[order.status] : undefined

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      whileHover={{ y: -2 }}
      className="cursor-pointer transition-all"
      style={{
        background: cardStyle.background,
        border: '1px solid rgba(240,234,224,0.1)',
        borderLeft: cardStyle.borderLeft,
        padding: '18px 20px',
      }}
      onClick={() => onClick(order)}
    >
      {/* Top row */}
      <div className="flex items-center justify-between mb-3.5">
        <span className="font-caps text-[16px] text-noir-gold tracking-wide">
          {order.id}
        </span>
        <span className="font-body text-[12px] text-noir-white/55">
          {formatElapsed(order.createdAt)}
        </span>
      </div>

      {/* Items */}
      <ul className="space-y-2 mb-4">
        {order.items.map(item => (
          <li key={item.dish.id} className="flex items-baseline gap-2.5 font-body text-[14px] text-noir-white/88">
            <span className="font-caps text-[13px] text-noir-gold min-w-[22px] flex-shrink-0">
              ×{item.quantity}
            </span>
            {item.dish.name}
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div
        className="flex items-center justify-between pt-3.5"
        style={{ borderTop: '1px solid rgba(240,234,224,0.1)' }}
        onClick={e => e.stopPropagation()}
      >
        <span className="font-body text-[12px] text-noir-white/55 tracking-widest uppercase">
          R$ {order.totalAmount.toFixed(2).replace('.', ',')}
        </span>
        {nextLabel && btnStyle && (
          <button
            onClick={() => onAdvance(order.id)}
            className="font-body text-[11px] tracking-[0.2em] uppercase px-4 py-2 transition-all hover:opacity-90"
            style={btnStyle}
          >
            {nextLabel}
          </button>
        )}
        {order.status === 'ready' && (
          <span
            className="font-body text-[12px] uppercase tracking-wide flex items-center gap-2 text-green-400"
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-green-400 animate-pulse"
            />
            Aguardando retirada
          </span>
        )}
      </div>
    </motion.div>
  )
}
