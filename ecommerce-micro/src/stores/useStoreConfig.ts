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
  nomeLoja: 'My Store',
  logotipoUrl: null,
  corPrincipal: '#000000',
  bannerUrl: '/assets/banner-default.jpg',
  bannerTitulo: 'Bem-vindo à nossa loja',
  bannerSubtitulo: 'Encontre o produto perfeito',
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
