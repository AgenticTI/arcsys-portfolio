import type { Category } from '@/types'

export const categories: { id: Category; label: string }[] = [
  { id: 'starters', label: 'Entradas' },
  { id: 'mains', label: 'Pratos Principais' },
  { id: 'desserts', label: 'Sobremesas' },
  { id: 'drinks', label: 'Bebidas' },
]
