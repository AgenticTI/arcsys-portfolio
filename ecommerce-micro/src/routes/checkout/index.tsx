// src/routes/checkout/index.tsx
import { createRoute, useNavigate } from '@tanstack/react-router'
import { Route as rootRoute } from '../__root'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { StoreHeader } from '../../components/layout/StoreHeader'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { useCartStore } from '../../stores/useCartStore'

// In-memory order store (not persisted — cleared after success)
let pendingOrder: { orderId: string; items: ReturnType<typeof useCartStore.getState>['items']; total: number; createdAt: Date } | null = null

export function getPendingOrder() {
  return pendingOrder
}

function CheckoutPage() {
  const navigate = useNavigate()
  const { items, total, clearCart } = useCartStore()
  const [form, setForm] = useState({ nome: '', endereco: '', cartao: '' })

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    pendingOrder = {
      orderId: uuidv4(),
      items: [...items],
      total: total(),
      createdAt: new Date(),
    }
    clearCart()
    navigate({ to: '/checkout/sucesso' })
  }

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />

      <main className="max-w-lg mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary mb-8">
          Finalizar Pedido
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-text-secondary font-medium">
              Dados de entrega
            </h2>

            <div className="space-y-2">
              <Label htmlFor="nome">Nome completo</Label>
              <Input
                id="nome"
                name="nome"
                required
                value={form.nome}
                onChange={handleChange}
                placeholder="João Silva"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                name="endereco"
                required
                value={form.endereco}
                onChange={handleChange}
                placeholder="Rua das Flores, 123 — São Paulo"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-text-secondary font-medium">
              Pagamento
            </h2>

            <div className="space-y-2">
              <Label htmlFor="cartao">Número do cartão</Label>
              <Input
                id="cartao"
                name="cartao"
                required
                value={form.cartao}
                onChange={handleChange}
                placeholder="0000 0000 0000 0000"
                maxLength={19}
              />
            </div>
          </div>

          {/* Order preview */}
          <div className="bg-surface rounded-xl p-4 space-y-2">
            <p className="text-xs uppercase tracking-widest text-text-secondary font-medium">
              Resumo
            </p>
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span className="text-text-secondary line-clamp-1 flex-1 mr-4">
                  {item.title} × {item.quantity}
                </span>
                <span className="font-medium text-text-primary flex-shrink-0">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="pt-2 border-t border-border flex justify-between font-semibold text-sm">
              <span>Total</span>
              <span>${total().toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl accent-bg text-white font-medium hover:opacity-80 transition-opacity"
          >
            Confirmar Pedido
          </button>
        </form>
      </main>
    </div>
  )
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: CheckoutPage,
})
