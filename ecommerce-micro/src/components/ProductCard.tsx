// src/components/ProductCard.tsx
import { Link } from '@tanstack/react-router'
import { Star } from 'lucide-react'
import type { Product } from '../types'
import { useCartStore } from '../stores/useCartStore'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      productId: product.id,
      title: product.title,
      image: product.image,
      price: product.price,
    })
  }

  return (
    <Link
      to="/produto/$id"
      params={{ id: String(product.id) }}
      className="group flex flex-col bg-background border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Image container — fixed aspect ratio, no distortion */}
      <div className="aspect-square bg-surface flex items-center justify-center p-6">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-contain mix-blend-multiply"
          loading="lazy"
        />
      </div>

      <div className="flex flex-col flex-1 p-4 gap-2">
        {/* Category badge */}
        <span className="text-xs uppercase tracking-widest text-text-secondary font-medium">
          {product.category}
        </span>

        {/* Title */}
        <p className="text-sm font-medium text-text-primary leading-snug line-clamp-2 flex-1">
          {product.title}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 text-text-secondary">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span className="text-xs">{product.rating.rate}</span>
          <span className="text-xs">({product.rating.count})</span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
          <span className="font-semibold text-text-primary">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            className="text-xs font-medium px-3 py-1.5 rounded-lg accent-bg text-white hover:opacity-80 transition-opacity"
          >
            + Carrinho
          </button>
        </div>
      </div>
    </Link>
  )
}
