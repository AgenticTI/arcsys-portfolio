'use client'

import { useApp } from '@/context/AppContext'
import CartItemComponent from '@/components/CartItem'
import OrderSummary from '@/components/OrderSummary'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function CartPage() {
  const { cart, confirmOrder } = useApp()
  const router = useRouter()

  function handleConfirm() {
    if (cart.length === 0) return
    confirmOrder()
    router.push('/confirmation')
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-8">
        <p className="font-playfair text-3xl text-noir-black mb-4">Carrinho vazio</p>
        <p className="font-inter text-noir-gray mb-8">Adicione pratos do cardápio para continuar.</p>
        <Link
          href="/"
          className="font-inter text-sm uppercase tracking-widest border border-noir-black text-noir-black px-8 py-3 hover:bg-noir-black hover:text-noir-white transition-all"
        >
          Ver Cardápio
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-8 py-16">
      <div className="mb-10">
        <p className="font-inter text-noir-gold text-xs tracking-[0.4em] uppercase mb-2">Seu Pedido</p>
        <h1 className="font-playfair text-4xl text-noir-black">Carrinho</h1>
      </div>

      <div className="mb-8">
        {cart.map(item => (
          <CartItemComponent key={item.dish.id} item={item} />
        ))}
      </div>

      <OrderSummary items={cart} />

      <div className="mt-6 flex flex-col gap-3">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleConfirm}
          className="w-full bg-noir-gold text-noir-black font-inter font-semibold py-4 text-sm uppercase tracking-widest hover:bg-noir-gold/90 transition-colors"
        >
          Confirmar Pedido
        </motion.button>
        <Link
          href="/"
          className="w-full text-center border border-noir-gray text-noir-gray font-inter text-sm uppercase tracking-widest py-4 hover:border-noir-black hover:text-noir-black transition-all"
        >
          Continuar Navegando
        </Link>
      </div>
    </div>
  )
}
