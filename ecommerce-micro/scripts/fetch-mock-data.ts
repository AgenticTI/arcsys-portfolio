// Run once: npx tsx scripts/fetch-mock-data.ts
// Saves FakeStore API snapshot to src/mocks/

import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const MOCKS_DIR = join(process.cwd(), 'src', 'mocks')

async function main() {
  mkdirSync(MOCKS_DIR, { recursive: true })

  const res = await fetch('https://fakestoreapi.com/products')
  const products = await res.json()

  writeFileSync(
    join(MOCKS_DIR, 'products.json'),
    JSON.stringify(products, null, 2)
  )

  const categories = [...new Set(products.map((p: { category: string }) => p.category))]
  writeFileSync(
    join(MOCKS_DIR, 'categories.json'),
    JSON.stringify(categories, null, 2)
  )

  console.log(`Saved ${products.length} products and ${categories.length} categories.`)
}

main().catch(console.error)
