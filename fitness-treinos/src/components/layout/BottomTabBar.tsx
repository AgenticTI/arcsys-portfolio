'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Dumbbell, History } from 'lucide-react'

const tabs = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/workouts', label: 'Treinos', icon: Dumbbell },
  { href: '/history', label: 'Histórico', icon: History },
]

export function BottomTabBar() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-surface-elevated">
      <div className="max-w-md mx-auto flex">
        {tabs.map(({ href, label, icon: Icon }) => {
          // Considera ativo: exact match para '/', startsWith para outros
          const isActive =
            href === '/' ? pathname === '/' : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center gap-1 py-3 px-2 transition-colors"
            >
              <Icon
                size={22}
                className={isActive ? 'text-accent' : 'text-text-secondary'}
              />
              <span
                className={`text-xs font-medium ${
                  isActive ? 'text-accent' : 'text-text-secondary'
                }`}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
