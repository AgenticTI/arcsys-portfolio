// src/stores/useProductsStore.ts
import { create } from 'zustand'
import type { Product } from '../types'
import productsData from '../mocks/products.json'
import categoriesData from '../mocks/categories.json'

interface ProductsState {
  products: Product[]
  categories: string[]
  getById: (id: number) => Product | undefined
}

export const useProductsStore = create<ProductsState>()(() => ({
  products: productsData as Product[],
  categories: categoriesData as string[],
  getById: (id) => (productsData as Product[]).find((p) => p.id === id),
}))
