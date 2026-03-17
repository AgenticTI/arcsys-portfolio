'use client'

import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { menu } from '@/data/menu'
import DishCard from './DishCard'
import type { Category, Dish } from '@/types'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

interface DishGridProps {
  activeCategory: Category | 'all'
  onDishClick: (dish: Dish) => void
}

export default function DishGrid({ activeCategory, onDishClick }: DishGridProps) {
  const filtered = useMemo(
    () => activeCategory === 'all' ? menu : menu.filter(d => d.category === activeCategory),
    [activeCategory]
  )

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeCategory}
        className="grid grid-cols-3 gap-[2px]"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {filtered.map((dish, index) => (
          <motion.div
            key={dish.id}
            variants={item}
            className={index === 0 ? 'col-span-2' : ''}
          >
            <DishCard
              dish={dish}
              onClick={onDishClick}
              feature={index === 0}
            />
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  )
}
