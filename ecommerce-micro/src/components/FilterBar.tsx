// src/components/FilterBar.tsx
import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Input } from './ui/input'
import { Slider } from './ui/slider'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs'
import type { Product } from '../types'

interface FilterBarProps {
  categories: string[]
  products: Product[]
  onFilter: (filtered: Product[]) => void
}

export function FilterBar({ categories, products, onFilter }: FilterBarProps) {
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

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        <Input
          placeholder="Buscar produtos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Category tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="flex flex-wrap gap-1 h-auto bg-transparent p-0">
          <TabsTrigger value="all" className="rounded-full border border-border text-xs px-3 py-1 data-[state=active]:accent-bg data-[state=active]:text-white data-[state=active]:border-transparent">
            Todos
          </TabsTrigger>
          {categories.map((cat) => (
            <TabsTrigger
              key={cat}
              value={cat}
              className="rounded-full border border-border text-xs px-3 py-1 capitalize data-[state=active]:accent-bg data-[state=active]:text-white data-[state=active]:border-transparent"
            >
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Price range */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-text-secondary">
          <span>Preço máximo</span>
          <span className="font-medium text-text-primary">${priceRange[0].toFixed(0)}</span>
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
