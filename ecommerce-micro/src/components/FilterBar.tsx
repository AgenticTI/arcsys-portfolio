// src/components/FilterBar.tsx
import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Slider } from './ui/slider'
import { formatBRL } from '../lib/formatBRL'
import { translateCategory } from '../lib/categoryLabels'
import type { Product } from '../types'

interface FilterBarProps {
  categories: string[]
  products: Product[]
  onFilter: (filtered: Product[]) => void
  variant?: 'dark' | 'light'
}

export function FilterBar({ categories, products, onFilter, variant = 'light' }: FilterBarProps) {
  const maxPrice = Math.ceil(Math.max(...products.map((p) => p.price)))

  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [priceRange, setPriceRange] = useState<[number]>([maxPrice])
  const [search, setSearch] = useState('')

  useEffect(() => {
    const filtered = products.filter((p) => {
      const matchCategory = activeCategory === 'all' || p.category === activeCategory
      const matchPrice = p.price <= priceRange[0]
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase())
      return matchCategory && matchPrice && matchSearch
    })
    onFilter(filtered)
  }, [activeCategory, priceRange, search, products, onFilter])

  const isDark = variant === 'dark'

  const chipBase = 'text-xs font-medium px-3 py-1.5 rounded-full border transition-colors cursor-pointer'
  const chipInactive = isDark
    ? 'border-white/15 text-white/60 hover:border-white/30 hover:text-white'
    : 'border-border text-text-secondary hover:border-border hover:text-text-primary'
  const chipActive = isDark
    ? 'bg-white/10 border-white/30 text-white'
    : 'accent-bg border-transparent text-white'

  return (
    <div className="space-y-4">
      {/* Row 1: chips + search */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Category pills */}
        <div className="flex flex-wrap gap-2 flex-1">
          <button
            onClick={() => setActiveCategory('all')}
            className={`${chipBase} ${activeCategory === 'all' ? chipActive : chipInactive}`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`${chipBase} ${activeCategory === cat ? chipActive : chipInactive} capitalize`}
            >
              {translateCategory(cat)}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-shrink-0">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: isDark ? 'rgba(255,255,255,0.4)' : undefined }}
          />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm rounded-full outline-none transition-colors"
            style={isDark
              ? { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }
              : { background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }
            }
          />
        </div>
      </div>

      {/* Row 2: price slider */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span style={{ color: isDark ? 'rgba(255,255,255,0.5)' : undefined }} className={isDark ? '' : 'text-text-secondary'}>
            Preço máximo
          </span>
          <span className={isDark ? 'text-white font-medium' : 'font-medium text-text-primary'}>
            {formatBRL(priceRange[0])}
          </span>
        </div>
        <Slider
          min={1}
          max={maxPrice}
          step={1}
          value={priceRange}
          onValueChange={(val) => setPriceRange(val as [number])}
          className="w-full"
        />
      </div>
    </div>
  )
}
