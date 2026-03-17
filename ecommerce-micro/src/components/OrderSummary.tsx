// src/components/OrderSummary.tsx
import { useNavigate } from '@tanstack/react-router'
import { useCartStore } from '../stores/useCartStore'

export function OrderSummary() {
  const { items, total } = useCartStore()
  const navigate = useNavigate()
  const subtotal = total()
  const shipping = 0

  return (
    <div className="bg-surface rounded-2xl p-6 space-y-4">
      <h2 className="font-semibold text-lg text-text-primary">Resumo do Pedido</h2>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-text-secondary">
          <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'itens'})</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-text-secondary">
          <span>Entrega</span>
          <span className="text-green-600">Grátis</span>
        </div>
      </div>

      <div className="pt-3 border-t border-border flex justify-between font-semibold">
        <span>Total</span>
        <span>${(subtotal + shipping).toFixed(2)}</span>
      </div>

      <button
        onClick={() => navigate({ to: '/checkout' })}
        disabled={items.length === 0}
        className="w-full py-3 rounded-xl accent-bg text-white font-medium hover:opacity-80 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Finalizar Pedido
      </button>
    </div>
  )
}
