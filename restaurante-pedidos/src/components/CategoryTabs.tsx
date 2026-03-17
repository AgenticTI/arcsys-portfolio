'use client'

import { categories } from '@/data/categories'
import type { Category } from '@/types'

interface CategoryTabsProps {
  active: Category | 'all'
  onChange: (cat: Category | 'all') => void
}

export default function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  const all = [{ id: 'all' as const, label: 'Todos' }, ...categories]

  return (
    <div className="flex border-b border-noir-white/8">
      {all.map(cat => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`font-body text-[10px] tracking-[0.3em] uppercase px-7 py-3.5 border-b-2 -mb-px transition-all ${
            active === cat.id
              ? 'text-noir-gold border-noir-gold'
              : 'text-noir-gray/60 border-transparent hover:text-noir-white'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
