import type { CartItem } from '@/types'

interface OrderSummaryProps {
  items: CartItem[]
}

export default function OrderSummary({ items }: OrderSummaryProps) {
  const subtotal = items.reduce((acc, i) => acc + i.dish.price * i.quantity, 0)
  const serviceFee = subtotal * 0.1
  const total = subtotal + serviceFee

  return (
    <div>
      {/* Line items */}
      <div style={{ borderTop: '1px solid rgba(240,234,224,0.1)' }}>
        {items.map(item => (
          <div
            key={item.dish.id}
            className="flex justify-between items-baseline py-3.5 font-body text-[13px] text-noir-white/75"
            style={{ borderBottom: '1px solid rgba(240,234,224,0.1)' }}
          >
            <span>{item.dish.name} × {item.quantity}</span>
            <span className="font-caps text-[15px] text-noir-white">
              R$ {(item.dish.price * item.quantity).toFixed(2).replace('.', ',')}
            </span>
          </div>
        ))}
        <div
          className="flex justify-between items-baseline py-3.5 font-body text-[13px] text-noir-white/75"
          style={{ borderBottom: '1px solid rgba(240,234,224,0.1)' }}
        >
          <span>Taxa de serviço (10%)</span>
          <span className="font-caps text-[15px] text-noir-white">
            R$ {serviceFee.toFixed(2).replace('.', ',')}
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-baseline py-6" style={{ borderTop: '1px solid rgba(201,169,110,0.25)' }}>
        <span className="font-cormorant text-[22px] font-light text-noir-white">Total</span>
        <span className="font-caps text-[28px] text-noir-gold">
          R$ {total.toFixed(2).replace('.', ',')}
        </span>
      </div>

      <p className="font-body text-[12px] text-noir-white/45 leading-relaxed">
        Inclui 10% de taxa de serviço. Pagamento ao final da visita.
      </p>
    </div>
  )
}
