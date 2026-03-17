'use client'

import { useState } from 'react'
import HeroSection from '@/components/HeroSection'
import CategoryTabs from '@/components/CategoryTabs'
import DishGrid from '@/components/DishGrid'
import DishModal from '@/components/DishModal'
import type { Category, Dish } from '@/types'

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all')
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null)

  return (
    <>
      <HeroSection />

      {/* Menu Section */}
      <section id="menu" className="bg-noir-white py-20 px-8 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="font-inter text-noir-gold text-xs tracking-[0.4em] uppercase mb-3">Cardápio</p>
            <h2 className="font-playfair text-5xl text-noir-black">Nossa Seleção</h2>
          </div>

          <div className="mb-10">
            <CategoryTabs active={activeCategory} onChange={setActiveCategory} />
          </div>

          <DishGrid activeCategory={activeCategory} onDishClick={setSelectedDish} />
        </div>
      </section>

      <DishModal dish={selectedDish} onClose={() => setSelectedDish(null)} />
    </>
  )
}
