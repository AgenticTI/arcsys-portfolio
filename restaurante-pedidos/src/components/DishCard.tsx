'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Dish } from '@/types'

interface DishCardProps {
  dish: Dish
  onClick: (dish: Dish) => void
}

export default function DishCard({ dish, onClick }: DishCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={() => onClick(dish)}
      className="bg-noir-white border border-noir-cream cursor-pointer group overflow-hidden"
      style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
    >
      <div className="relative h-52 overflow-hidden">
        <Image
          src={dish.imageUrl}
          alt={dish.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <h3 className="font-playfair text-xl text-noir-black mb-1">{dish.name}</h3>
        <p className="font-inter text-sm text-noir-gray leading-snug line-clamp-1 mb-4">
          {dish.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-inter font-semibold text-noir-gold text-base">
            R$ {dish.price.toFixed(2).replace('.', ',')}
          </span>
          <span className="font-inter text-xs text-noir-gray/60 uppercase tracking-widest">
            Ver mais
          </span>
        </div>
      </div>
    </motion.div>
  )
}
