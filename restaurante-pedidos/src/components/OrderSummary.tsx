import type { CartItem } from '@/types'

interface OrderSummaryProps {
  items: CartItem[]
  showServiceFee?: boolean
}

export default function OrderSummary({ items, showServiceFee = true }: OrderSummaryProps) {
  const subtotal = items.reduce((sum, item) => sum + item.dish.price * item.quantity, 0)
  const serviceFee = showServiceFee ? subtotal * 0.1 : 0
  const total = subtotal + serviceFee

  return (
    <div className="bg-noir-cream p-6 space-y-3">
      <div className="flex justify-between font-inter text-sm text-noir-black">
        <span>Subtotal</span>
        <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
      </div>
      {showServiceFee && (
        <div className="flex justify-between font-inter text-sm text-noir-gray">
          <span>Taxa de serviço (10%)</span>
          <span>R$ {serviceFee.toFixed(2).replace('.', ',')}</span>
        </div>
      )}
      <div className="border-t border-noir-gray/20 pt-3 flex justify-between font-inter font-semibold text-noir-black">
        <span>Total</span>
        <span className="text-noir-gold text-lg">R$ {total.toFixed(2).replace('.', ',')}</span>
      </div>
    </div>
  )
}
