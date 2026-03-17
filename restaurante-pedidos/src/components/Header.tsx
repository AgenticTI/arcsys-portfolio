'use client'

import { useApp } from '@/context/AppContext'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function Header() {
  const { activeView, setView, cartItemCount } = useApp()
  const router = useRouter()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-noir-black/95 backdrop-blur-sm border-b border-noir-white/[0.08]">
      {/* Logo */}
      <button
        onClick={() => { setView('client'); router.push('/') }}
        className="font-caps text-[18px] text-noir-white tracking-[0.5em] hover:text-noir-gold transition-colors"
      >
        NOIR
      </button>

      {/* Persona Switcher */}
      <div className="flex items-center gap-1 border border-noir-gold/40 p-1">
        <button
          onClick={() => { setView('client'); router.push('/') }}
          className={`px-5 py-1.5 font-body text-[11px] tracking-[0.2em] uppercase transition-all ${
            activeView === 'client'
              ? 'bg-noir-gold text-noir-black'
              : 'text-noir-white/50 hover:text-noir-white'
          }`}
        >
          Cliente
        </button>
        <button
          onClick={() => { setView('kitchen'); router.push('/kitchen') }}
          className={`px-5 py-1.5 font-body text-[11px] tracking-[0.2em] uppercase transition-all ${
            activeView === 'kitchen'
              ? 'bg-noir-gold text-noir-black'
              : 'text-noir-white/50 hover:text-noir-white'
          }`}
        >
          Cozinha
        </button>
      </div>

      {/* Cart Button — only visible in client view */}
      {activeView === 'client' && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/cart')}
          className="relative flex items-center gap-2 text-noir-white hover:text-noir-gold transition-colors"
          aria-label={`Carrinho com ${cartItemCount} itens`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          {cartItemCount > 0 && (
            <motion.span
              key={cartItemCount}
              initial={{ scale: 0.6 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 w-[18px] h-[18px] bg-noir-gold text-noir-black text-xs font-body rounded-full flex items-center justify-center"
            >
              {cartItemCount}
            </motion.span>
          )}
        </motion.button>
      )}

      {/* Spacer when kitchen view (no cart icon) */}
      {activeView === 'kitchen' && <div className="w-24" />}
    </header>
  )
}
