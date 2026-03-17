// src/routes/produto/$id.tsx
import { createRoute, Link } from '@tanstack/react-router'
import { Route as rootRoute } from '../__root'
import { useState } from 'react'
import { Star, ChevronLeft, ShoppingCart, Check } from 'lucide-react'
import { StoreHeader } from '../../components/layout/StoreHeader'
import { useProductsStore } from '../../stores/useProductsStore'
import { useCartStore } from '../../stores/useCartStore'

function ProductPage() {
  const { id } = Route.useParams()
  const getById = useProductsStore((s) => s.getById)
  const addItem = useCartStore((s) => s.addItem)
  const product = getById(Number(id))

  const [added, setAdded] = useState(false)

  if (!product) {
    return (
      <div className="min-h-screen bg-dark-surface flex items-center justify-center">
        <p style={{ color: 'rgba(255,255,255,0.4)' }}>Produto não encontrado.</p>
      </div>
    )
  }

  function handleAddToCart() {
    if (!product) return
    addItem({
      productId: product.id,
      title: product.title,
      image: product.image,
      price: product.price,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="min-h-screen bg-dark-surface pt-16">
      <StoreHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm mb-10 accent-text hover:opacity-70 transition-opacity"
        >
          <ChevronLeft className="w-4 h-4" />
          Catálogo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image container */}
          <div
            className="rounded-3xl flex items-center justify-center p-10"
            style={{ background: '#141414', minHeight: '400px' }}
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-full max-w-[420px] h-auto object-contain"
              style={{
                filter: 'drop-shadow(0 40px 60px rgba(0,102,204,0.3)) drop-shadow(0 16px 32px rgba(0,0,0,0.6))',
                animation: 'float 5s ease-in-out infinite',
              }}
            />
          </div>

          {/* Details */}
          <div className="flex flex-col gap-6 py-4">
            <div>
              <span
                className="text-xs uppercase tracking-widest font-medium"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                {product.category}
              </span>
              <h1
                className="text-white mt-2 leading-tight"
                style={{ fontSize: '32px', fontWeight: 700 }}
              >
                {product.title}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.round(product.rating.rate) ? 'fill-current' : ''}`}
                    style={{ color: i < Math.round(product.rating.rate) ? '#FFD700' : 'rgba(255,255,255,0.2)' }}
                  />
                ))}
              </div>
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {product.rating.rate} ({product.rating.count} avaliações)
              </span>
            </div>

            <p
              className="font-extrabold tracking-tight text-white"
              style={{ fontSize: '28px' }}
            >
              ${product.price.toFixed(2)}
            </p>

            <p className="leading-relaxed text-sm" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '15px' }}>
              {product.description}
            </p>

            <button
              onClick={handleAddToCart}
              className="mt-auto flex items-center justify-center gap-2 w-full py-4 rounded-2xl accent-bg text-white font-semibold text-sm transition-transform hover:-translate-y-px"
            >
              {added ? (
                <>
                  <Check className="w-5 h-5" />
                  Adicionado!
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  Adicionar ao Carrinho
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/produto/$id',
  component: ProductPage,
})
