// src/components/ProductCard.tsx
import { Link } from '@tanstack/react-router'
import { Star } from 'lucide-react'
import type { Product } from '../types'
import { useCartStore } from '../stores/useCartStore'

interface ProductCardProps {
  product: Product
  variant?: 'dark' | 'light'
}

export function ProductCard({ product, variant = 'dark' }: ProductCardProps) {
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

  if (variant === 'dark') {
    return (
      <Link
        to="/produto/$id"
        params={{ id: String(product.id) }}
        className="group flex flex-col rounded-[20px] overflow-hidden transition-transform duration-300 hover:-translate-y-1.5"
        style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* Image area */}
        <div
          className="flex items-center justify-center p-6"
          style={{ background: '#1c1c1c', height: '220px' }}
        >
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-contain group-hover:scale-[1.08] group-hover:-translate-y-1 transition-transform duration-[400ms]"
            style={{ filter: 'drop-shadow(0 20px 40px rgba(0,102,204,0.25)) drop-shadow(0 8px 20px rgba(0,0,0,0.5))' }}
            loading="lazy"
          />
        </div>

        <div className="flex flex-col flex-1 p-4 gap-2">
          <span className="text-xs uppercase tracking-widest font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {product.category}
          </span>
          <p className="text-sm font-medium text-white leading-snug line-clamp-2 flex-1">
            {product.title}
          </p>
          <div className="flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-xs">{product.rating.rate}</span>
            <span className="text-xs">({product.rating.count})</span>
          </div>
          <div className="flex items-center justify-between mt-auto pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="font-semibold text-white">${product.price.toFixed(2)}</span>
            <button
              onClick={handleAddToCart}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-lg transition-colors hover:accent-bg"
              style={{ background: 'rgba(0,102,204,0.15)', border: '1px solid rgba(0,102,204,0.3)' }}
              aria-label="Adicionar ao carrinho"
            >
              +
            </button>
          </div>
        </div>
      </Link>
    )
  }

  // variant === 'light'
  return (
    <Link
      to="/produto/$id"
      params={{ id: String(product.id) }}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden transition-shadow hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
      style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
    >
      <div className="bg-surface flex items-center justify-center p-6" style={{ height: '180px' }}>
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-contain mix-blend-multiply"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col flex-1 p-4 gap-2">
        <span className="text-xs uppercase tracking-widest text-text-secondary font-medium">
          {product.category}
        </span>
        <p className="text-sm font-medium text-text-primary leading-snug line-clamp-2 flex-1">
          {product.title}
        </p>
        <div className="flex items-center gap-1 text-text-secondary">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span className="text-xs">{product.rating.rate}</span>
          <span className="text-xs">({product.rating.count})</span>
        </div>
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
          <span className="font-semibold text-text-primary">${product.price.toFixed(2)}</span>
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
