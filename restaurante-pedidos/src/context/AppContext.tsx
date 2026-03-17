'use client'

import React, { createContext, useContext, useReducer, useCallback } from 'react'
import type { AppState, CartItem, Dish, Order, OrderStatus } from '@/types'

type Action =
  | { type: 'SET_VIEW'; payload: 'client' | 'kitchen' }
  | { type: 'ADD_TO_CART'; payload: { dish: Dish; quantity: number } }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { dishId: string; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { dishId: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'CONFIRM_ORDER' }
  | { type: 'ADVANCE_ORDER_STATUS'; payload: { orderId: string } }

const initialState: AppState = {
  activeView: 'client',
  cart: [],
  orders: [],
}

const STATUS_PROGRESSION: OrderStatus[] = ['received', 'preparing', 'ready', 'delivered']

let orderCounter = 0

function nextStatus(current: OrderStatus): OrderStatus {
  const index = STATUS_PROGRESSION.indexOf(current)
  if (index < STATUS_PROGRESSION.length - 1) {
    return STATUS_PROGRESSION[index + 1]
  }
  return current
}

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, activeView: action.payload }

    case 'ADD_TO_CART': {
      const existing = state.cart.find(item => item.dish.id === action.payload.dish.id)
      if (existing) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.dish.id === action.payload.dish.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        }
      }
      return {
        ...state,
        cart: [...state.cart, { dish: action.payload.dish, quantity: action.payload.quantity }],
      }
    }

    case 'UPDATE_CART_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          cart: state.cart.filter(item => item.dish.id !== action.payload.dishId),
        }
      }
      return {
        ...state,
        cart: state.cart.map(item =>
          item.dish.id === action.payload.dishId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      }
    }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.dish.id !== action.payload.dishId),
      }

    case 'CLEAR_CART':
      return { ...state, cart: [] }

    case 'CONFIRM_ORDER': {
      if (state.cart.length === 0) return state
      orderCounter += 1
      const subtotal = state.cart.reduce(
        (sum, item) => sum + item.dish.price * item.quantity,
        0
      )
      const totalAmount = subtotal * 1.1
      const newOrder: Order = {
        id: `#${String(orderCounter).padStart(4, '0')}`,
        items: [...state.cart],
        status: 'received',
        createdAt: new Date(),
        totalAmount,
      }
      return {
        ...state,
        cart: [],
        orders: [...state.orders, newOrder],
      }
    }

    case 'ADVANCE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.orderId
            ? { ...order, status: nextStatus(order.status) }
            : order
        ),
      }

    default:
      return state
  }
}

interface AppContextValue extends AppState {
  setView: (view: 'client' | 'kitchen') => void
  addToCart: (dish: Dish, quantity: number) => void
  updateCartQuantity: (dishId: string, quantity: number) => void
  removeFromCart: (dishId: string) => void
  clearCart: () => void
  confirmOrder: () => Order | null
  advanceOrderStatus: (orderId: string) => void
  cartTotal: number
  cartItemCount: number
  latestOrder: Order | null
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const setView = useCallback((view: 'client' | 'kitchen') => {
    dispatch({ type: 'SET_VIEW', payload: view })
  }, [])

  const addToCart = useCallback((dish: Dish, quantity: number) => {
    dispatch({ type: 'ADD_TO_CART', payload: { dish, quantity } })
  }, [])

  const updateCartQuantity = useCallback((dishId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { dishId, quantity } })
  }, [])

  const removeFromCart = useCallback((dishId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { dishId } })
  }, [])

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' })
  }, [])

  const confirmOrder = useCallback((): Order | null => {
    if (state.cart.length === 0) return null
    dispatch({ type: 'CONFIRM_ORDER' })
    return null
  }, [state.cart])

  const advanceOrderStatus = useCallback((orderId: string) => {
    dispatch({ type: 'ADVANCE_ORDER_STATUS', payload: { orderId } })
  }, [])

  const cartTotal = state.cart.reduce(
    (sum, item) => sum + item.dish.price * item.quantity,
    0
  )

  const cartItemCount = state.cart.reduce((sum, item) => sum + item.quantity, 0)

  const latestOrder = state.orders.length > 0
    ? state.orders[state.orders.length - 1]
    : null

  return (
    <AppContext.Provider
      value={{
        ...state,
        setView,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        confirmOrder,
        advanceOrderStatus,
        cartTotal,
        cartItemCount,
        latestOrder,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
