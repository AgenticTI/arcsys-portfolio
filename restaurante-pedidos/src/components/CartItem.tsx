'use client'

import Image from 'next/image'
import type { CartItem as CartItemType } from '@/types'

interface CartItemProps {
  item: CartItemType
  onIncrease: () => void
  onDecrease: () => void
  onRemove: () => void
}

export default function CartItem({ item, onIncrease, onDecrease, onRemove }: CartItemProps) {
  return (
    <div
      className="grid items-center gap-6 py-6"
      style={{
        gridTemplateColumns: '80px 1fr auto',
        borderBottom: '1px solid rgba(240,234,224,0.07)',
      }}
    >
      {/* Thumbnail */}
      <div className="relative w-20 h-20 overflow-hidden flex-shrink-0">
        <Image src={item.dish.imageUrl} alt={item.dish.name} fill className="object-cover" />
      </div>

      {/* Info */}
      <div>
        <p className="font-body text-[9px] tracking-[0.3em] uppercase text-noir-gold mb-1.5">
          {item.dish.category}
        </p>
        <h3 className="font-cormorant text-[20px] font-light text-noir-white mb-2.5 leading-tight">
          {item.dish.name}
        </h3>
        <div className="flex items-center gap-3.5">
          <div
            className="flex items-center"
            style={{ border: '1px solid rgba(240,234,224,0.12)' }}
          >
            <button
              onClick={onDecrease}
              className="w-7 h-7 flex items-center justify-center text-noir-white/50 hover:text-noir-white text-base transition-colors"
            >
              −
            </button>
            <span className="w-8 text-center font-body text-[13px] text-noir-white">
              {item.quantity}
            </span>
            <button
              onClick={onIncrease}
              className="w-7 h-7 flex items-center justify-center text-noir-white/50 hover:text-noir-white text-base transition-colors"
            >
              +
            </button>
          </div>
          <button
            onClick={onRemove}
            className="font-body text-[10px] tracking-[0.2em] uppercase text-noir-white/25 hover:text-red-400 transition-colors"
          >
            Remover
          </button>
        </div>
      </div>

      {/* Price — shows subtotal for this item */}
      <span className="font-caps text-[18px] text-noir-gold text-right whitespace-nowrap">
        R$ {(item.dish.price * item.quantity).toFixed(2).replace('.', ',')}
      </span>
    </div>
  )
}
