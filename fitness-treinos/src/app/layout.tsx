import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { BottomTabBar } from '@/components/layout/BottomTabBar'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter-var',
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
    <html lang="pt-BR" className={inter.variable}>
      <body className="bg-background text-text-primary min-h-screen">
        <main className="pb-20 max-w-md mx-auto min-h-screen">
          {children}
        </main>
        <BottomTabBar />
      </body>
    </html>
  )
}
