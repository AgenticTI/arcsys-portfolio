'use client'

import Image from 'next/image'
import { useApp } from '@/context/AppContext'
import type { CartItem as CartItemType } from '@/types'

interface CartItemProps {
  item: CartItemType
}

export default function CartItem({ item }: CartItemProps) {
  const { updateCartQuantity, removeFromCart } = useApp()

  return (
    <div className="flex items-center gap-5 py-5 border-b border-noir-cream">
      {/* Thumbnail */}
      <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden">
        <Image
          src={item.dish.imageUrl}
          alt={item.dish.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-playfair text-lg text-noir-black mb-0.5">{item.dish.name}</h3>
        <p className="font-inter text-sm text-noir-gold font-semibold">
          R$ {item.dish.price.toFixed(2).replace('.', ',')}
        </p>
      </div>

      {/* Quantity control */}
      <div className="flex items-center gap-3 border border-noir-cream px-3 py-1.5">
        <button
          onClick={() => updateCartQuantity(item.dish.id, item.quantity - 1)}
          className="w-5 h-5 flex items-center justify-center text-noir-black hover:text-noir-gold transition-colors"
        >
          −
        </button>
        <span className="font-inter text-noir-black w-4 text-center text-sm">{item.quantity}</span>
        <button
          onClick={() => updateCartQuantity(item.dish.id, item.quantity + 1)}
          className="w-5 h-5 flex items-center justify-center text-noir-black hover:text-noir-gold transition-colors"
        >
          +
        </button>
      </div>

      {/* Subtotal */}
      <div className="text-right w-24 flex-shrink-0">
        <p className="font-inter font-semibold text-noir-black">
          R$ {(item.dish.price * item.quantity).toFixed(2).replace('.', ',')}
        </p>
        <button
          onClick={() => removeFromCart(item.dish.id)}
          className="font-inter text-xs text-noir-gray hover:text-noir-black transition-colors mt-1"
        >
          Remover
        </button>
      </div>
    </div>
  )
}
