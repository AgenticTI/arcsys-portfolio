// src/components/layout/StoreHeader.tsx
import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { useRouterState } from '@tanstack/react-router'
import { ShoppingCart } from 'lucide-react'
import { useStoreConfig } from '../../stores/useStoreConfig'
import { useCartStore } from '../../stores/useCartStore'

export function StoreHeader() {
  const { nomeLoja, logotipoUrl } = useStoreConfig((s) => s.config)
  const itemCount = useCartStore((s) => s.itemCount())
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isHome = pathname === '/'

  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    if (!isHome) return
    function handleScroll() {
      setIsScrolled(window.scrollY > 60)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHome])

  // Dark glass: home + scrolled. Transparent: home + top. Light glass: other routes.
  const isDark = isHome && isScrolled
  const isTransparent = isHome && !isScrolled

  const headerStyle: React.CSSProperties = isTransparent
    ? { background: 'transparent', borderColor: 'transparent' }
    : isDark
      ? { background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255,255,255,0.08)' }
      : { background: 'rgba(245,245,247,0.85)', backdropFilter: 'blur(20px)', borderColor: 'rgba(0,0,0,0.08)' }

  const textClass = isTransparent || isDark ? 'text-white' : 'text-text-primary'

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b transition-all duration-[400ms]"
      style={headerStyle}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className={`flex items-center gap-3 ${textClass}`}>
          {logotipoUrl ? (
            <img src={logotipoUrl} alt={nomeLoja} className="h-8 w-auto object-contain" />
          ) : (
            <span className="text-lg font-semibold tracking-tight">
              {nomeLoja}
            </span>
          )}
        </Link>

        {/* Nav — hidden on mobile */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="/#catalog" className={`text-sm font-medium transition-opacity hover:opacity-70 ${textClass}`}>
            Catálogo
          </a>
          <a href="#" className={`text-sm font-medium transition-opacity hover:opacity-70 ${textClass}`}>
            Novidades
          </a>
          <a href="#" className={`text-sm font-medium transition-opacity hover:opacity-70 ${textClass}`}>
            Ofertas
          </a>
        </nav>

        <Link to="/carrinho" className={`relative p-2 hover:opacity-70 transition-opacity ${textClass}`}>
          <ShoppingCart className="w-5 h-5" />
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
