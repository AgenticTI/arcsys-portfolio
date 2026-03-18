// src/components/OrderSummary.tsx
import { useNavigate } from '@tanstack/react-router'
import { useCartStore } from '../stores/useCartStore'
import { formatBRL } from '../lib/formatBRL'

export function OrderSummary() {
  const items = useCartStore((s) => s.items)
  const getTotal = useCartStore((s) => s.total)
  const navigate = useNavigate()
  const subtotal = getTotal()

  return (
    <div className="bg-white rounded-3xl p-8 space-y-5" style={{ boxShadow: '0 2px 24px rgba(0,0,0,0.06)' }}>
      <h2 className="font-semibold text-lg text-text-primary">Resumo do Pedido</h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-text-secondary">
          <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'itens'})</span>
          <span>{formatBRL(subtotal)}</span>
        </div>
        <div className="flex justify-between text-text-secondary">
          <span>Entrega</span>
          <span style={{ color: '#30D158' }}>Grátis</span>
        </div>
      </div>

      <div
        className="pt-4 flex justify-between"
        style={{ borderTop: '1px solid var(--border)', fontWeight: 700, fontSize: '18px' }}
      >
        <span>Total</span>
        <span>{formatBRL(subtotal)}</span>
      </div>

      <button
        onClick={() => navigate({ to: '/checkout' })}
        disabled={items.length === 0}
        className="w-full py-3.5 rounded-2xl text-white font-semibold text-sm transition-transform hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 accent-bg"
      >
        Finalizar Pedido
      </button>

      <p className="text-center text-xs" style={{ color: '#86868B' }}>
        🔒 Pagamento 100% seguro
      </p>
    </div>
  )
}
