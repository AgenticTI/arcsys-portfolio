// src/router.ts
import { createRouter } from '@tanstack/react-router'
import { Route as rootRoute } from './routes/__root'
import { Route as indexRoute } from './routes/index'
import { Route as adminRoute } from './routes/admin/index'
import { Route as productRoute } from './routes/produto/$id'
import { Route as cartRoute } from './routes/carrinho/index'
import { Route as checkoutRoute } from './routes/checkout/index'
import { Route as successRoute } from './routes/checkout/sucesso'

const routeTree = rootRoute.addChildren([
  indexRoute,
  adminRoute,
  productRoute,
  cartRoute,
  checkoutRoute,
  successRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
