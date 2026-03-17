export type Category = 'starters' | 'mains' | 'desserts' | 'drinks'

export interface Dish {
  id: string
  name: string
  description: string
  price: number
  category: Category
  imageUrl: string
  ingredients: string[]
}

export type OrderStatus = 'received' | 'preparing' | 'ready' | 'delivered'

export interface CartItem {
  dish: Dish
  quantity: number
}

export interface Order {
  id: string
  items: CartItem[]
  status: OrderStatus
  createdAt: Date
  totalAmount: number
}

export interface AppState {
  activeView: 'client' | 'kitchen'
  cart: CartItem[]
  orders: Order[]
}
