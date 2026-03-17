'use client'

import { useEffect } from 'react'
import { useApp } from '@/context/AppContext'
import KanbanBoard from '@/components/KanbanBoard'

export default function KitchenPage() {
  const { setView, orders } = useApp()

  useEffect(() => {
    setView('kitchen')
  }, [setView])

  const activeOrders = orders.filter(o => o.status !== 'delivered')

  return (
    <div className="min-h-screen bg-noir-black px-8 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <p className="font-inter text-noir-gold text-xs tracking-[0.4em] uppercase mb-2">Dashboard</p>
          <div className="flex items-end justify-between">
            <h1 className="font-playfair text-4xl text-noir-white">Cozinha</h1>
            <span className="font-inter text-noir-gray text-sm">
              {activeOrders.length} {activeOrders.length === 1 ? 'pedido ativo' : 'pedidos ativos'}
            </span>
          </div>
        </div>

        <KanbanBoard />
      </div>
    </div>
  )
}
