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
    <div className="min-h-screen bg-noir-black">
      <div className="px-10 pt-10 pb-4">
        <p className="font-body text-noir-gold text-xs tracking-[0.4em] uppercase mb-2">Dashboard</p>
        <div className="flex items-end justify-between">
          <h1 className="font-cormorant text-4xl text-noir-white">Cozinha</h1>
          <span className="font-body text-noir-gray text-sm">
            {activeOrders.length} {activeOrders.length === 1 ? 'pedido ativo' : 'pedidos ativos'}
          </span>
        </div>
      </div>

      {/* Timebar */}
      <div
        className="flex items-center gap-10 px-10 py-3"
        style={{ background: '#0f0d0a', borderBottom: '1px solid rgba(240,234,224,0.08)' }}
      >
        <div>
          <strong className="font-caps text-[20px] text-noir-gold block mb-0.5">
            {activeOrders.length}
          </strong>
          <span className="font-body text-[11px] tracking-[0.2em] uppercase text-noir-white/50">
            Pedidos ativos
          </span>
        </div>
        <div>
          <strong className="font-caps text-[20px] text-noir-gold block mb-0.5">~12 min</strong>
          <span className="font-body text-[11px] tracking-[0.2em] uppercase text-noir-white/50">
            Tempo médio
          </span>
        </div>
        <div>
          <strong className="font-caps text-[20px] text-noir-gold block mb-0.5">
            {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </strong>
          <span className="font-body text-[11px] tracking-[0.2em] uppercase text-noir-white/50">
            Horário atual
          </span>
        </div>
      </div>

      <KanbanBoard />
    </div>
  )
}
