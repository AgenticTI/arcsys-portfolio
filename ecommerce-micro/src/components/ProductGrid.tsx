// src/components/ProductGrid.tsx
import type { Product } from '../types'
import { ProductCard } from './ProductCard'

interface ProductGridProps {
  products: Product[]
  emptyMessage?: string
  variant?: 'dark' | 'light'
}

export function ProductGrid({ products, emptyMessage = 'Nenhum produto encontrado.', variant = 'dark' }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-16 text-center" style={{ color: variant === 'dark' ? 'rgba(255,255,255,0.4)' : undefined }}>
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} variant={variant} />
      ))}
    </div>
  )
}
