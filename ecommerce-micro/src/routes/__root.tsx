// src/routes/__root.tsx
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { useAccentColor } from '../hooks/useAccentColor'
import { StoreFooter } from '../components/layout/StoreFooter'

function RootLayout() {
  useAccentColor()
  return (
    <>
      <Outlet />
      <StoreFooter />
    </>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
})
