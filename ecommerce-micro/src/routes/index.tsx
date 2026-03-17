// src/routes/index.tsx
import { createRoute } from '@tanstack/react-router'
import { Route as rootRoute } from './__root'
import { useState, useCallback } from 'react'
import { StoreHeader } from '../components/layout/StoreHeader'
import { HeroBanner } from '../components/HeroBanner'
import { ProductGrid } from '../components/ProductGrid'
import { FilterBar } from '../components/FilterBar'
import { useProductsStore } from '../stores/useProductsStore'
import type { Product } from '../types'

function HomePage() {
  const { products, categories } = useProductsStore()
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)

  const handleFilter = useCallback((filtered: Product[]) => {
    setFilteredProducts(filtered)
  }, [])

  const featured = products.slice(0, 8)

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />
      <HeroBanner />

      {/* Featured section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
            Destaques
          </h2>
          <span className="text-sm text-text-secondary">{featured.length} produtos</span>
        </div>
        <ProductGrid products={featured} />
      </section>

      {/* Full catalog with filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="border-t border-border pt-12">
          <h2 className="text-2xl font-semibold tracking-tight text-text-primary mb-8">
            Catálogo Completo
          </h2>

          <div className="space-y-8">
            <FilterBar
              categories={categories}
              products={products}
              onFilter={handleFilter}
            />
            <ProductGrid products={filteredProducts} />
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
