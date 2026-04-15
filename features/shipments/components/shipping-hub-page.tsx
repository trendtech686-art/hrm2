'use client'

import { useRouter } from 'next/navigation'
import {
  Inbox,
  Truck,
  Wallet,
} from 'lucide-react'
import { useBreakpoint } from '@/contexts/breakpoint-context'
import { MobileModuleMenu } from '@/components/mobile/mobile-module-menu'
import { useEffect } from 'react'

export function ShippingHubPage() {
  const router = useRouter()
  const { isMobile } = useBreakpoint()

  // On desktop, redirect to shipments list
  useEffect(() => {
    if (!isMobile) {
      router.replace('/shipments')
    }
  }, [isMobile, router])

  if (!isMobile) return null

  return (
    <MobileModuleMenu
      createAction={{
        href: '/packaging',
        label: 'Quản lý đóng gói & giao hàng',
      }}
      groups={[
        {
          items: [
            { href: '/packaging', label: 'Quản lý đóng gói', icon: Inbox },
            { href: '/shipments', label: 'Vận đơn', icon: Truck },
            { href: '/reconciliation', label: 'Đối soát COD', icon: Wallet },
          ],
        },
      ]}
    />
  )
}
