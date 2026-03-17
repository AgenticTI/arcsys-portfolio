'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '@/context/AppContext'
import type { Dish } from '@/types'

interface DishModalProps {
  dish: Dish | null
  onClose: () => void
}

// Static pairing suggestions — cosmetic only
const PAIRINGS = ['Wolf of Kyoto', 'Dirty Martini', 'Bordeaux 2018']

export default function DishModal({ dish, onClose }: DishModalProps) {
  const { addToCart } = useApp()
  const [qty, setQty] = useState(1)

  return (
    <AnimatePresence>
      {dish && (
        <motion.div
          key={dish.id}
          className="fixed inset-0 z-50 flex items-center justify-center p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(9,8,6,0.85)', backdropFilter: 'blur(4px)' }}
          />

          {/* Modal */}
          <motion.div
            className="relative z-10 w-full max-w-[960px] grid grid-cols-2 max-h-[90vh] overflow-hidden"
            style={{ border: '1px solid rgba(201,169,110,0.15)' }}
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center text-noir-white/60 hover:text-noir-gold transition-colors"
              style={{ border: '1px solid rgba(240,234,224,0.15)' }}
            >
              ✕
            </button>

            {/* Left: Photo */}
            <div className="relative min-h-[540px]">
              <Image src={dish.imageUrl} alt={dish.name} fill className="object-cover" />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(9,8,6,0.85) 0%, transparent 60%)' }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span
                  className="inline-block font-body text-[9px] tracking-[0.35em] uppercase text-noir-gold mb-4"
                  style={{ border: '1px solid rgba(201,169,110,0.4)', padding: '4px 12px' }}
                >
                  {dish.category}
                </span>
                <h2 className="font-cormorant text-[34px] font-light text-noir-white leading-tight">
                  {dish.name}
                </h2>
              </div>
            </div>

            {/* Right: Content */}
            <div
              className="flex flex-col overflow-y-auto p-11"
              style={{ background: 'linear-gradient(to bottom, #0f0d0a 0%, #090806 100%)' }}
            >
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-7">
                <span className="font-body text-[9px] tracking-[0.4em] uppercase text-noir-gold">
                  {dish.category}
                </span>
                <div className="flex-1 h-px" style={{ background: 'rgba(201,169,110,0.2)' }} />
              </div>

              <h1 className="font-cormorant text-[38px] font-light text-noir-white leading-tight mb-2">
                {dish.name}
              </h1>
              <p className="font-caps text-[20px] text-noir-gold mb-6 tracking-wide">
                R$ {dish.price.toFixed(2).replace('.', ',')}
              </p>

              <div className="h-px mb-6" style={{ background: 'rgba(240,234,224,0.08)' }} />

              <p className="font-body text-sm text-noir-white/82 leading-relaxed mb-7">
                {dish.description}
              </p>

              {/* Ingredients */}
              <p className="font-body text-[9px] tracking-[0.35em] uppercase text-noir-gray mb-3">
                Ingredientes
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {dish.ingredients.map(ing => (
                  <span
                    key={ing}
                    className="font-body text-[12px] text-noir-white/78 px-3.5 py-1.5 hover:text-noir-gold transition-colors"
                    style={{ border: '1px solid rgba(240,234,224,0.18)' }}
                  >
                    {ing}
                  </span>
                ))}
              </div>

              {/* Pairings */}
              <p className="font-body text-[9px] tracking-[0.35em] uppercase text-noir-gray mb-2">
                Harmoniza com
              </p>
              <div className="mb-8">
                {PAIRINGS.map(p => (
                  <div
                    key={p}
                    className="flex items-center gap-2.5 font-body text-[13px] text-noir-white/75 py-2.5"
                    style={{ borderBottom: '1px solid rgba(240,234,224,0.1)' }}
                  >
                    <span className="text-noir-gold text-lg leading-none">·</span>
                    {p}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-auto pt-6" style={{ borderTop: '1px solid rgba(240,234,224,0.08)' }}>
                <div className="flex items-center gap-5 mb-4">
                  <span className="font-body text-[10px] tracking-[0.25em] uppercase text-noir-gray">
                    Qtd.
                  </span>
                  <div className="flex items-center" style={{ border: '1px solid rgba(240,234,224,0.15)' }}>
                    <button
                      onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="w-9 h-9 flex items-center justify-center text-noir-white/50 hover:text-noir-white text-lg transition-colors"
                    >
                      −
                    </button>
                    <span className="w-10 text-center font-caps text-[16px] text-noir-white">{qty}</span>
                    <button
                      onClick={() => setQty(q => q + 1)}
                      className="w-9 h-9 flex items-center justify-center text-noir-white/50 hover:text-noir-white text-lg transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <span className="ml-auto font-caps text-[14px] text-noir-gold">
                    R$ {(dish.price * qty).toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <button
                  onClick={() => { addToCart(dish, qty); onClose() }}
                  className="w-full bg-noir-gold text-noir-black font-body text-[11px] tracking-[0.35em] uppercase py-4 hover:bg-noir-bronze transition-all flex items-center justify-center gap-3"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
                  </svg>
                  Adicionar ao Pedido
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
