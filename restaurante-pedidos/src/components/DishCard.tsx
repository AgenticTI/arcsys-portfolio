'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Dish } from '@/types'

interface DishCardProps {
  dish: Dish
  onClick: (dish: Dish) => void
  feature?: boolean
}

export default function DishCard({ dish, onClick, feature = false }: DishCardProps) {
  return (
    <motion.div
      className={`relative overflow-hidden cursor-pointer bg-noir-ember ${
        feature ? 'col-span-2' : ''
      }`}
      style={{ aspectRatio: feature ? '16/9' : '4/3' }}
      onClick={() => onClick(dish)}
      whileHover="hover"
    >
      <motion.div
        className="absolute inset-0"
        variants={{ hover: { scale: 1.06 } }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Image
          src={dish.imageUrl}
          alt={dish.name}
          fill
          className="object-cover"
          sizes={feature ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 50vw, 33vw'}
        />
      </motion.div>

      {/* Gradient overlay */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(9,8,6,0.92) 0%, rgba(9,8,6,0.4) 50%, transparent 100%)',
        }}
        variants={{ hover: { opacity: 1 } }}
        initial={{ opacity: 0.7 }}
      />

      {/* Info */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <p className="font-body text-[9px] tracking-[0.35em] uppercase text-noir-gold mb-2">
          {dish.category}
        </p>
        <h3
          className={`font-cormorant font-light text-noir-white leading-tight mb-2 ${
            feature ? 'text-[32px]' : 'text-[22px]'
          }`}
        >
          {dish.name}
        </h3>
        <p className="font-body text-[13px] text-noir-white/78 line-clamp-2 mb-3">
          {dish.description}
        </p>
        <span className="font-caps text-noir-gold text-[15px]">
          R$ {dish.price.toFixed(2).replace('.', ',')}
        </span>
        <motion.span
          className="block font-body text-[9px] tracking-[0.3em] uppercase text-noir-white/70 mt-3"
          variants={{ hover: { opacity: 1, y: 0 } }}
          initial={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.2 }}
        >
          Ver detalhes →
        </motion.span>
      </div>
    </motion.div>
  )
}
