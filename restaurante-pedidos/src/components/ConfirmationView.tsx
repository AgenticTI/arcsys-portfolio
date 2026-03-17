'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import type { Order } from '@/types'

interface ConfirmationViewProps {
  order: Order
}

export default function ConfirmationView({ order }: ConfirmationViewProps) {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/status')
    }, 2500)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-[80vh] bg-noir-black flex flex-col items-center justify-center text-center px-8">
      {/* Animated check circle */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200, delay: 0.1 }}
        className="w-24 h-24 border-2 border-noir-gold rounded-full flex items-center justify-center mb-8"
      >
        <motion.svg
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#C9A96E"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <motion.path
            d="M5 12l5 5L19 7"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          />
        </motion.svg>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <p className="font-body text-noir-gold text-xs tracking-[0.4em] uppercase mb-3">
          Confirmado
        </p>
        <h1 className="font-cormorant text-5xl text-noir-white mb-4">
          Pedido Recebido
        </h1>
        <p className="font-caps text-3xl text-noir-gold mb-6">
          {order.id}
        </p>
        <p className="font-body text-noir-white/50 text-sm">
          Redirecionando para acompanhamento...
        </p>
      </motion.div>
    </div>
  )
}
