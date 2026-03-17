'use client'

import { useEffect } from 'react'
import { useApp } from '@/context/AppContext'
import StatusTracker from '@/components/StatusTracker'
import OrderSummary from '@/components/OrderSummary'
import { useRouter } from 'next/navigation'
import type { OrderStatus } from '@/types'

const STATUS_LABELS: Record<OrderStatus, string> = {
  received: 'Pedido Recebido',
  preparing: 'Em Preparação',
  ready: 'Pronto para Retirada',
  delivered: 'Entregue',
}

export default function StatusPage() {
  const { latestOrder, advanceOrderStatus } = useApp()
  const router = useRouter()

  useEffect(() => {
    if (!latestOrder) {
      router.replace('/')
      return
    }
    if (latestOrder.status === 'delivered') return

    const timer = setInterval(() => {
      advanceOrderStatus(latestOrder.id)
    }, 5000)

    return () => clearInterval(timer)
  }, [latestOrder, advanceOrderStatus, router])

  if (!latestOrder) return null

  return (
    <div className="max-w-2xl mx-auto px-8 py-16">
      <div className="mb-10">
        <p className="font-inter text-noir-gold text-xs tracking-[0.4em] uppercase mb-2">
          Pedido {latestOrder.id}
        </p>
        <h1 className="font-playfair text-4xl text-noir-black">
          {STATUS_LABELS[latestOrder.status]}
        </h1>
      </div>

      <StatusTracker currentStatus={latestOrder.status} />

      <div className="mt-12">
        <h2 className="font-inter text-xs uppercase tracking-widest text-noir-gray mb-4">Resumo do Pedido</h2>
        <OrderSummary items={latestOrder.items} />
      </div>

      {latestOrder.status === 'delivered' && (
        <div className="mt-8 text-center">
          <p className="font-playfair text-2xl text-noir-black mb-4">Bom apetite!</p>
          <button
            onClick={() => router.push('/')}
            className="font-inter text-sm uppercase tracking-widest border border-noir-black text-noir-black px-8 py-3 hover:bg-noir-black hover:text-noir-white transition-all"
          >
            Fazer Novo Pedido
          </button>
        </div>
      )}
    </div>
  )
}
