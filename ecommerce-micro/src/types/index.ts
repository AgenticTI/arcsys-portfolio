export interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: { rate: number; count: number }
}

export interface CartItem {
  productId: number
  title: string
  image: string
  price: number
  quantity: number
}

export interface StoreConfig {
  nomeLoja: string
  logotipoUrl: string | null
  corPrincipal: string
  bannerUrl: string
  bannerTitulo: string
  bannerSubtitulo: string
  bannerEyebrow: string
}

export interface Order {
  orderId: string
  items: CartItem[]
  total: number
  createdAt: Date
}
