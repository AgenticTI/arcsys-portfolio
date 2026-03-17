'use client'

import { categories } from '@/data/categories'
import type { Category } from '@/types'

interface CategoryTabsProps {
  active: Category | 'all'
  onChange: (cat: Category | 'all') => void
}

export default function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  const allCategories = [{ id: 'all' as const, label: 'Todos' }, ...categories]

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {allCategories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`whitespace-nowrap px-6 py-2.5 font-inter text-sm font-medium transition-all border ${
            active === cat.id
              ? 'bg-noir-black text-noir-gold border-noir-black'
              : 'bg-transparent text-noir-gray border-noir-cream hover:border-noir-gray hover:text-noir-black'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
