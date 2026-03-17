// src/components/layout/AdminHeader.tsx
import { ExternalLink } from 'lucide-react'

export function AdminHeader() {
  return (
    <header className="bg-admin-bg border-b border-white/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400" />
          <span className="text-white font-semibold tracking-tight">Painel do Lojista</span>
        </div>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors"
        >
          Ver Loja
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </header>
  )
}
