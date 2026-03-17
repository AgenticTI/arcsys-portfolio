// src/components/layout/StoreHeader.tsx
import { Link } from '@tanstack/react-router'
import { ShoppingCart } from 'lucide-react'
import { useStoreConfig } from '../../stores/useStoreConfig'
import { useCartStore } from '../../stores/useCartStore'

export function StoreHeader() {
  const { nomeLoja, logotipoUrl } = useStoreConfig((s) => s.config)
  const itemCount = useCartStore((s) => s.itemCount())

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          {logotipoUrl ? (
            <img src={logotipoUrl} alt={nomeLoja} className="h-8 w-auto object-contain" />
          ) : (
            <span className="text-lg font-semibold tracking-tight text-text-primary">
              {nomeLoja}
            </span>
          )}
        </Link>

        <Link to="/carrinho" className="relative p-2 hover:opacity-70 transition-opacity">
          <ShoppingCart className="w-5 h-5 text-text-primary" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 accent-bg text-white text-xs font-medium w-4 h-4 rounded-full flex items-center justify-center leading-none">
              {itemCount > 9 ? '9+' : itemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  )
}
