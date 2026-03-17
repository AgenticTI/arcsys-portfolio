import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { AppProvider } from '@/context/AppContext'
import Header from '@/components/Header'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Noir — Fine Dining',
  description: 'Sistema de pedidos do restaurante Noir',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-noir-white min-h-screen">
        <AppProvider>
          <Header />
          <main className="pt-16">
            {children}
          </main>
        </AppProvider>
      </body>
    </html>
  )
}
