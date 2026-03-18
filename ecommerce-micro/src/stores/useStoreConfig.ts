// src/stores/useStoreConfig.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { StoreConfig } from '../types'

interface StoreConfigState {
  config: StoreConfig
  updateConfig: (partial: Partial<StoreConfig>) => void
  resetConfig: () => void
}

const DEFAULT_CONFIG: StoreConfig = {
  nomeLoja: 'MicroShop',
  logotipoUrl: null,
  corPrincipal: '#0066CC',
  bannerUrl: '',
  bannerTitulo: 'Bem-vindo à nossa loja',
  bannerSubtitulo: 'Encontre o produto perfeito',
  bannerEyebrow: 'Nova Coleção',
}

export const useStoreConfig = create<StoreConfigState>()(
  persist(
    (set) => ({
      config: DEFAULT_CONFIG,
      updateConfig: (partial) =>
        set((state) => ({ config: { ...state.config, ...partial } })),
      resetConfig: () => set({ config: DEFAULT_CONFIG }),
    }),
    { name: 'store-config' }
  )
)
