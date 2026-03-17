// src/routes/index.tsx
import { createRoute, Link } from '@tanstack/react-router'
import { Route as rootRoute } from './__root'
import { useState, useCallback } from 'react'
import { StoreHeader } from '../components/layout/StoreHeader'
import { HeroBanner } from '../components/HeroBanner'
import { ProductGrid } from '../components/ProductGrid'
import { FilterBar } from '../components/FilterBar'
import { useProductsStore } from '../stores/useProductsStore'
import type { Product } from '../types'

function BentoGrid({ products }: { products: Product[] }) {
  const [big, ...rest] = products.slice(0, 5)
  const bentoColors = ['#F0F4FF', '#F5F0FF', '#FFF5F0', '#1D1D1F']
  const bentoTextColors = ['#1D1D1F', '#1D1D1F', '#1D1D1F', '#ffffff']

  if (!big) return null

  return (
    <div
      className="w-full"
      style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gridTemplateRows: '320px 240px', gap: '16px' }}
    >
      {/* Big card */}
      <Link
        to="/produto/$id"
        params={{ id: String(big.id) }}
        className="relative overflow-hidden rounded-3xl p-8 flex flex-col justify-end transition-transform hover:scale-[1.01] duration-300"
        style={{ background: '#1a1a2e', gridRow: '1 / 3' }}
      >
        <img
          src={big.image}
          alt={big.title}
          className="absolute top-8 right-8 w-32 h-32 object-contain"
          style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))', animation: 'float 5s ease-in-out infinite' }}
        />
        <span className="text-xs text-white/40 uppercase tracking-widest mb-1">{big.category}</span>
        <p className="text-white font-semibold text-lg leading-snug line-clamp-2 mb-2">{big.title}</p>
        <span className="text-white font-bold text-xl">${big.price.toFixed(2)}</span>
      </Link>

      {/* 4 small cards */}
      {rest.map((product, i) => (
        <Link
          key={product.id}
          to="/produto/$id"
          params={{ id: String(product.id) }}
          className="relative overflow-hidden rounded-2xl p-5 flex flex-col justify-between transition-transform hover:scale-[1.01] duration-300"
          style={{ background: bentoColors[i] }}
        >
          <div>
            <span
              className="text-xs uppercase tracking-widest font-medium"
              style={{ color: bentoTextColors[i], opacity: 0.5 }}
            >
              {product.category}
            </span>
            <p
              className="text-sm font-semibold mt-1 line-clamp-2"
              style={{ color: bentoTextColors[i] }}
            >
              {product.title}
            </p>
          </div>
          <div className="flex items-end justify-between">
            <span className="font-bold text-base" style={{ color: bentoTextColors[i] }}>
              ${product.price.toFixed(2)}
            </span>
            <img
              src={product.image}
              alt={product.title}
              className="w-16 h-16 object-contain"
              style={{
                filter: i === 3
                  ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))'
                  : 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))',
                mixBlendMode: i === 3 ? 'normal' : 'multiply',
              }}
            />
          </div>
        </Link>
      ))}
    </div>
  )
}

function HomePage() {
  const { products, categories } = useProductsStore()
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)

  const handleFilter = useCallback((filtered: Product[]) => {
    setFilteredProducts(filtered)
  }, [])

  return (
    <div className="min-h-screen">
      <StoreHeader />

      {/* Section 1: Hero — dark */}
      <HeroBanner />

      {/* Section 2: Featured — light */}
      <section id="featured" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-text-secondary mb-1">Seleção especial</p>
              <h2 className="text-[40px] font-bold tracking-[-1.2px] text-text-primary">Em Destaque</h2>
            </div>
          </div>
          <BentoGrid products={products} />
        </div>
      </section>

      {/* Section 3: Catalog — dark */}
      <section id="catalog" className="bg-dark-surface py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Todos os produtos
            </p>
            <h2 className="text-[40px] font-bold tracking-[-1.2px] text-white">Catálogo Completo</h2>
          </div>
          <div className="space-y-8">
            <FilterBar
              categories={categories}
              products={products}
              onFilter={handleFilter}
              variant="dark"
            />
            <ProductGrid products={filteredProducts} variant="dark" />
          </div>
        </div>
      </section>
    </div>
  )
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})
