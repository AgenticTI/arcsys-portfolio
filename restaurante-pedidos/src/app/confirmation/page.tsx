'use client'

import { useApp } from '@/context/AppContext'
import ConfirmationView from '@/components/ConfirmationView'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ConfirmationPage() {
  const { latestOrder } = useApp()
  const router = useRouter()

  useEffect(() => {
    if (!latestOrder) {
      router.replace('/')
    }
  }, [latestOrder, router])

  if (!latestOrder) return null

  return <ConfirmationView order={latestOrder} />
}
