import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { BottomTabBar } from '@/components/layout/BottomTabBar'

const jakarta = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-jakarta',
})

export const metadata: Metadata = {
  title: 'Fitness Treinos',
  description: 'Plataforma de treinos de musculação',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={jakarta.variable}>
      <body className="bg-background text-text-primary min-h-screen">
        <main className="pb-20 max-w-md mx-auto min-h-screen">
          {children}
        </main>
        <BottomTabBar />
      </body>
    </html>
  )
}
