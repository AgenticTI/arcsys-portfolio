'use client'

import { useApp } from '@/context/AppContext'
import { useRouter } from 'next/navigation'
import CartItem from '@/components/CartItem'
import OrderSummary from '@/components/OrderSummary'

export default function CartPage() {
  const { cart, updateCartQuantity, removeFromCart, confirmOrder } = useApp()
  const router = useRouter()

  const handleConfirm = () => {
    confirmOrder()
    router.push('/confirmation')
  }

  return (
    <div className="min-h-screen bg-noir-black grid" style={{ gridTemplateColumns: '1fr 400px' }}>
      {/* Left: Items */}
      <div
        className="py-16 px-16"
        style={{ borderRight: '1px solid rgba(240,234,224,0.06)' }}
      >
        <p className="font-body text-[10px] tracking-[0.4em] uppercase text-noir-gold mb-4">
          Seu Pedido
        </p>
        <h1 className="font-cormorant text-[48px] font-light text-noir-white leading-tight mb-12">
          Revise<br />sua <em>seleção</em>
        </h1>

        {cart.length === 0 ? (
          <div className="mt-16 text-center">
            <p className="font-script text-[32px] text-noir-white/15 mb-6">carrinho vazio…</p>
            <button
              onClick={() => router.push('/')}
              className="font-body text-[10px] tracking-[0.3em] uppercase text-noir-gold border border-noir-gold/30 px-6 py-3 hover:bg-noir-gold hover:text-noir-black transition-all"
            >
              ← Ver Cardápio
            </button>
          </div>
        ) : (
          <div style={{ borderTop: '1px solid rgba(240,234,224,0.07)' }}>
            {cart.map(item => (
              <CartItem
                key={item.dish.id}
                item={item}
                onIncrease={() => updateCartQuantity(item.dish.id, item.quantity + 1)}
                onDecrease={() => updateCartQuantity(item.dish.id, item.quantity - 1)}
                onRemove={() => removeFromCart(item.dish.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Right: Summary */}
      <div
        className="py-16 px-14 flex flex-col bg-noir-black"
        style={{ borderLeft: '1px solid rgba(240,234,224,0.06)' }}
      >
        <p className="font-body text-[10px] tracking-[0.4em] uppercase text-noir-gold mb-8">
          Resumo do Pedido
        </p>

        <OrderSummary items={cart} />

        <div className="flex-1" />

        {/* Notes textarea */}
        <div className="mb-6">
          <label className="block font-body text-[9px] tracking-[0.3em] uppercase text-noir-gray mb-2.5">
            Observações para a cozinha
          </label>
          <textarea
            className="w-full bg-noir-white/4 font-body text-[12px] text-noir-white placeholder-noir-white/20 resize-none h-20 px-3.5 py-3 outline-none transition-colors"
            style={{ border: '1px solid rgba(240,234,224,0.1)' }}
            placeholder="Ex: sem glúten, alergia a frutos do mar…"
          />
        </div>

        <button
          onClick={handleConfirm}
          disabled={cart.length === 0}
          className="w-full bg-noir-gold text-noir-black font-body text-[11px] tracking-[0.4em] uppercase py-4 hover:bg-noir-bronze transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M5 13l4 4L19 7" />
          </svg>
          Confirmar Pedido
        </button>
        <button
          onClick={() => router.push('/')}
          className="mt-4 text-center font-body text-[10px] tracking-[0.2em] uppercase text-noir-white/25 hover:text-noir-gold transition-colors w-full"
        >
          ← Voltar ao Cardápio
        </button>
      </div>
    </div>
  )
}
