// src/components/CartItem.tsx
import { Minus, Plus, Trash2 } from 'lucide-react'
import type { CartItem as CartItemType } from '../types'
import { useCartStore } from '../stores/useCartStore'

interface CartItemProps {
  item: CartItemType
}

export function CartItemRow({ item }: CartItemProps) {
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)

  return (
    <div
      className="flex gap-4 p-6 mb-3 rounded-2xl bg-white transition-shadow hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
      style={{ border: '1px solid rgba(0,0,0,0.04)' }}
    >
      {/* Image */}
      <div
        className="w-[90px] h-[90px] flex-shrink-0 flex items-center justify-center rounded-xl p-2.5 bg-white"
        style={{ border: '1px solid rgba(0,0,0,0.06)' }}
      >
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-contain"
          style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.12))' }}
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <p className="text-sm font-medium text-text-primary leading-snug line-clamp-2">
          {item.title}
        </p>
        <p className="text-sm text-text-secondary">${item.price.toFixed(2)} / un.</p>

        {/* Qty controls */}
        <div className="flex items-center gap-2 mt-auto">
          <button
            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
            className="w-7 h-7 rounded-full bg-[var(--surface)] flex items-center justify-center hover:bg-[var(--border)] transition-colors"
            aria-label="Diminuir quantidade"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
            className="w-7 h-7 rounded-full bg-[var(--surface)] flex items-center justify-center hover:bg-[var(--border)] transition-colors"
            aria-label="Aumentar quantidade"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Subtotal + remove */}
      <div className="flex flex-col items-end justify-between flex-shrink-0">
        <span className="font-semibold text-sm text-text-primary">
          ${(item.price * item.quantity).toFixed(2)}
        </span>
        <button
          onClick={() => removeItem(item.productId)}
          className="text-text-secondary hover:text-red-500 transition-colors"
          aria-label="Remover item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
