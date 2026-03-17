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
      <section id="menu" className="bg-noir-black py-24 px-14">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <p className="font-body text-noir-gold text-[10px] tracking-[0.4em] uppercase mb-3">
              Nossa Culinária
            </p>
            <h2 className="font-cormorant text-5xl font-light text-noir-white">
              O <em>Cardápio</em> da Temporada
            </h2>
          </div>

          <div className="mb-12">
            <CategoryTabs active={activeCategory} onChange={setActiveCategory} />
          </div>

          <DishGrid activeCategory={activeCategory} onDishClick={setSelectedDish} />
        </div>
      </section>

      <DishModal dish={selectedDish} onClose={() => setSelectedDish(null)} />
    </>
  )
}
