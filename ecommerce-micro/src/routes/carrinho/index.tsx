// src/routes/carrinho/index.tsx
import { createRoute, Link } from '@tanstack/react-router'
import { Route as rootRoute } from '../__root'
import { ChevronLeft, ShoppingBag } from 'lucide-react'
import { StoreHeader } from '../../components/layout/StoreHeader'
import { CartItemRow } from '../../components/CartItem'
import { OrderSummary } from '../../components/OrderSummary'
import { useCartStore } from '../../stores/useCartStore'

function CartPage() {
  const items = useCartStore((s) => s.items)

  return (
    <div className="min-h-screen bg-surface pt-16">
      <StoreHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Continuar comprando
        </Link>

        <h1
          className="mb-10 text-text-primary"
          style={{ fontSize: '40px', fontWeight: 700, letterSpacing: '-1.2px' }}
        >
          Carrinho
        </h1>

        {items.length === 0 ? (
          <div className="py-24 flex flex-col items-center gap-4 text-text-secondary">
            <ShoppingBag className="w-12 h-12 opacity-30" />
            <p>Seu carrinho está vazio.</p>
            <Link
              to="/"
              className="text-sm font-medium accent-text hover:opacity-70 transition-opacity"
            >
              Explorar produtos →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
            {/* Item list */}
            <div>
              {items.map((item) => (
                <CartItemRow key={item.productId} item={item} />
              ))}
            </div>

            {/* Sticky summary */}
            <div style={{ position: 'sticky', top: '88px' }}>
              <OrderSummary />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/carrinho',
  component: CartPage,
})
