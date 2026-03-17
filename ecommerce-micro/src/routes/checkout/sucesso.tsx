// src/routes/checkout/sucesso.tsx
import { createRoute, Link } from '@tanstack/react-router'
import { Route as rootRoute } from '../__root'
import { StoreHeader } from '../../components/layout/StoreHeader'
import { SuccessCheckmark } from '../../components/SuccessCheckmark'
import { getPendingOrder } from './index'

function SuccessPage() {
  const order = getPendingOrder()

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />

      <main className="max-w-lg mx-auto px-4 sm:px-6 py-16 text-center">
        {/* Animated checkmark */}
        <div className="accent-text flex justify-center mb-8">
          <SuccessCheckmark />
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-text-primary mb-2">
          Pedido confirmado!
        </h1>
        <p className="text-text-secondary mb-8">
          Obrigado pela sua compra. Você receberá um e-mail de confirmação em breve.
        </p>

        {order && (
          <div className="bg-surface rounded-2xl p-6 text-left space-y-4 mb-8">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Número do pedido</span>
              <span className="font-mono text-xs text-text-primary font-medium break-all">
                #{order.orderId.split('-')[0].toUpperCase()}
              </span>
            </div>

            <div className="border-t border-border pt-4 space-y-2">
              {order.items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="text-text-secondary line-clamp-1 flex-1 mr-4">
                    {item.title} × {item.quantity}
                  </span>
                  <span className="text-text-primary font-medium flex-shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-3 flex justify-between font-semibold text-sm">
              <span>Total pago</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        )}

        <Link
          to="/"
          className="inline-block px-8 py-3 rounded-xl accent-bg text-white font-medium hover:opacity-80 transition-opacity"
        >
          Continuar comprando
        </Link>
      </main>
    </div>
  )
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout/sucesso',
  component: SuccessPage,
})
