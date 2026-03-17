// src/routes/__root.tsx
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { useAccentColor } from '../hooks/useAccentColor'

function RootLayout() {
  useAccentColor()
  return <Outlet />
}

export const Route = createRootRoute({
  component: RootLayout,
})
