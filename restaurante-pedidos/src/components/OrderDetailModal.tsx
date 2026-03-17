'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { Order, OrderStatus } from '@/types'

const STATUS_NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  received: 'Iniciar Preparo',
  preparing: 'Marcar Pronto',
}

interface OrderDetailModalProps {
  order: Order | null
  onClose: () => void
  onAdvance: (orderId: string) => void
}

function formatElapsed(createdAt: Date): string {
  const ms = Date.now() - createdAt.getTime()
  const minutes = Math.floor(ms / 60000)
  if (minutes < 1) return 'Menos de 1 minuto'
  if (minutes === 1) return '1 minuto'
  return `${minutes} minutos`
}

export default function OrderDetailModal({ order, onClose, onAdvance }: OrderDetailModalProps) {
  const nextLabel = order ? STATUS_NEXT_LABEL[order.status] : undefined

  return (
    <AnimatePresence>
      {order && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-noir-black/80 z-40 backdrop-blur-sm"
          />
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-auto md:left-1/2 md:-translate-x-1/2 md:w-[480px] bg-noir-cream z-50 p-8"
            style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-noir-gray hover:text-noir-black transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <p className="font-inter text-xs text-noir-gold uppercase tracking-widest mb-1">Pedido</p>
            <h2 className="font-playfair text-3xl text-noir-black mb-1">{order.id}</h2>
            <p className="font-inter text-sm text-noir-gray mb-6">
              Tempo de espera: {formatElapsed(order.createdAt)}
            </p>

            <ul className="space-y-3 mb-6">
              {order.items.map(item => (
                <li key={item.dish.id} className="flex justify-between font-inter text-noir-black">
                  <span>
                    <span className="text-noir-gold font-semibold">{item.quantity}×</span> {item.dish.name}
                  </span>
                  <span className="text-noir-gray text-sm">
                    R$ {(item.dish.price * item.quantity).toFixed(2).replace('.', ',')}
                  </span>
                </li>
              ))}
            </ul>

            {nextLabel && (
              <button
                onClick={() => { onAdvance(order.id); onClose() }}
                className="w-full bg-noir-black text-noir-gold font-inter text-sm uppercase tracking-widest py-4 hover:bg-noir-gold hover:text-noir-black transition-all"
              >
                {nextLabel}
              </button>
            )}

            {order.status === 'ready' && (
              <p className="text-center font-inter text-sm text-noir-gold font-semibold py-3 uppercase tracking-widest">
                Aguardando retirada
              </p>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
