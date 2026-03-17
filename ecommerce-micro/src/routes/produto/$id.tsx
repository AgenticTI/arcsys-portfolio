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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-text-secondary">Produto não encontrado.</p>
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
    <div className="min-h-screen bg-background">
      <StoreHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar ao catálogo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image */}
          <div className="aspect-square bg-surface rounded-2xl flex items-center justify-center p-12">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-contain mix-blend-multiply"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col gap-6 py-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-text-secondary font-medium">
                {product.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary mt-2 leading-tight">
                {product.title}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.round(product.rating.rate) ? 'fill-current text-amber-400' : 'text-border'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-text-secondary">
                {product.rating.rate} ({product.rating.count} avaliações)
              </span>
            </div>

            <p className="text-4xl font-semibold tracking-tight text-text-primary">
              ${product.price.toFixed(2)}
            </p>

            <p className="text-text-secondary leading-relaxed text-sm">
              {product.description}
            </p>

            <button
              onClick={handleAddToCart}
              className="mt-auto flex items-center justify-center gap-2 w-full py-4 rounded-xl accent-bg text-white font-medium hover:opacity-80 transition-all"
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
