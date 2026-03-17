import type { Metadata } from 'next'
import { Cormorant_Garamond, Cormorant_SC, Italianno, DM_Sans } from 'next/font/google'
import { AppProvider } from '@/context/AppContext'
import Header from '@/components/Header'
import './globals.css'

const cormorant = Cormorant_Garamond({
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
})

const cormorantSC = Cormorant_SC({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  variable: '--font-caps',
  display: 'swap',
})

const italianno = Italianno({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-script',
  display: 'swap',
})

const dmSans = DM_Sans({
  weight: ['300', '400'],
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Noir — Fine Dining',
  description: 'Sistema de pedidos do restaurante Noir',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${cormorant.variable} ${cormorantSC.variable} ${italianno.variable} ${dmSans.variable}`}
    >
      <body className="bg-noir-black min-h-screen">
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
