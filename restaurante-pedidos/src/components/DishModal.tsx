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

export default function DishModal({ dish, onClose }: DishModalProps) {
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useApp()

  function handleAdd() {
    if (!dish) return
    addToCart(dish, quantity)
    onClose()
    setQuantity(1)
  }

  return (
    <AnimatePresence>
      {dish && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-noir-black/70 z-40 backdrop-blur-sm"
          />
          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-x-4 top-16 bottom-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[600px] md:h-auto bg-noir-white z-50 overflow-y-auto"
            style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center text-noir-gray hover:text-noir-black transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Photo */}
            <div className="relative h-64 md:h-72 w-full">
              <Image
                src={dish.imageUrl}
                alt={dish.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-8">
              <h2 className="font-playfair text-3xl text-noir-black mb-3">{dish.name}</h2>
              <p className="font-inter text-noir-gray leading-relaxed mb-6">{dish.description}</p>

              {/* Ingredients */}
              <div className="mb-8">
                <h3 className="font-inter text-xs uppercase tracking-widest text-noir-gray mb-3">Ingredientes</h3>
                <div className="flex flex-wrap gap-2">
                  {dish.ingredients.map(ing => (
                    <span
                      key={ing}
                      className="font-inter text-xs text-noir-black border border-noir-cream px-3 py-1"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quantity + CTA */}
              <div className="flex items-center justify-between mb-6">
                <span className="font-inter font-semibold text-noir-gold text-2xl">
                  R$ {dish.price.toFixed(2).replace('.', ',')}
                </span>
                <div className="flex items-center gap-4 border border-noir-cream px-4 py-2">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-6 h-6 flex items-center justify-center text-noir-black hover:text-noir-gold transition-colors font-inter text-lg"
                  >
                    −
                  </button>
                  <span className="font-inter text-noir-black w-4 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-6 h-6 flex items-center justify-center text-noir-black hover:text-noir-gold transition-colors font-inter text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAdd}
                className="w-full bg-noir-gold text-noir-black font-inter font-semibold py-4 text-sm uppercase tracking-widest hover:bg-noir-gold/90 transition-colors"
              >
                Adicionar ao pedido — R$ {(dish.price * quantity).toFixed(2).replace('.', ',')}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
