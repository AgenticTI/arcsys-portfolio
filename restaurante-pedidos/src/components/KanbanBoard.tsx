'use client'

import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import type { Order, OrderStatus } from '@/types'
import KanbanColumn from './KanbanColumn'
import OrderDetailModal from './OrderDetailModal'

const KITCHEN_COLUMNS: OrderStatus[] = ['received', 'preparing', 'ready']

export default function KanbanBoard() {
  const { orders, advanceOrderStatus } = useApp()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  function getOrdersForStatus(status: OrderStatus): Order[] {
    return orders.filter(o => o.status === status)
  }

  return (
    <>
      <div className="flex gap-6 overflow-x-auto pb-4">
        {KITCHEN_COLUMNS.map(status => (
          <KanbanColumn
            key={status}
            status={status}
            orders={getOrdersForStatus(status)}
            onAdvance={advanceOrderStatus}
            onCardClick={setSelectedOrder}
          />
        ))}
      </div>
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onAdvance={(id) => { advanceOrderStatus(id); setSelectedOrder(null) }}
      />
    </>
  )
}
