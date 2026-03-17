'use client'

import { motion } from 'framer-motion'
import { menu } from '@/data/menu'
import type { Category, Dish } from '@/types'
import DishCard from './DishCard'

interface DishGridProps {
  activeCategory: Category | 'all'
  onDishClick: (dish: Dish) => void
}

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

export default function DishGrid({ activeCategory, onDishClick }: DishGridProps) {
  const filtered = activeCategory === 'all'
    ? menu
    : menu.filter(dish => dish.category === activeCategory)

  return (
    <motion.div
      key={activeCategory}
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {filtered.map(dish => (
        <motion.div key={dish.id} variants={item}>
          <DishCard dish={dish} onClick={onDishClick} />
        </motion.div>
      ))}
    </motion.div>
  )
}
