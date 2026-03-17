// src/hooks/useAccentColor.ts
import { useEffect } from 'react'
import { useStoreConfig } from '../stores/useStoreConfig'

export function useAccentColor() {
  const corPrincipal = useStoreConfig((s) => s.config.corPrincipal)

  useEffect(() => {
    document.documentElement.style.setProperty('--cor-principal', corPrincipal)
  }, [corPrincipal])
}
