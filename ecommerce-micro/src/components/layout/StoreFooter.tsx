// src/components/layout/StoreFooter.tsx
import { useStoreConfig } from '../../stores/useStoreConfig'

export function StoreFooter() {
  const nomeLoja = useStoreConfig((s) => s.config.nomeLoja)

  return (
    <footer style={{ background: '#1D1D1F' }} className="text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Column 1 — Brand */}
          <div>
            <p className="text-white/90 font-semibold text-lg mb-3">{nomeLoja}</p>
            <p className="text-white/60 text-sm leading-relaxed">
              Produtos selecionados com qualidade premium.
            </p>
          </div>

          {/* Column 2 — Navigation */}
          <div>
            <p className="text-white/90 font-semibold text-sm uppercase tracking-widest mb-4">Navegação</p>
            <ul className="space-y-2">
              {[
                { label: 'Catálogo', href: '/#catalog' },
                { label: 'Novidades', href: '#' },
                { label: 'Ofertas', href: '#' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="text-white/60 text-sm hover:text-white transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Institutional */}
          <div>
            <p className="text-white/90 font-semibold text-sm uppercase tracking-widest mb-4">Institucional</p>
            <ul className="space-y-2">
              {[
                { label: 'Sobre', href: '#' },
                { label: 'Contato', href: '#' },
                { label: 'Política de Privacidade', href: '#' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="text-white/60 text-sm hover:text-white transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div
          className="mt-12 pt-6 text-center text-white/40 text-xs"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          © 2026 {nomeLoja}. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  )
}
