'use client'

import { useRouter } from 'next/navigation'
import {
  ShoppingCart,
  Inbox,
  Undo2,
  Wrench,
  ShieldAlert,
  BookUser,
} from 'lucide-react'
import { useBreakpoint } from '@/contexts/breakpoint-context'
import { MobileModuleMenu } from '@/components/mobile/mobile-module-menu'
import { useEffect } from 'react'

export function OrdersHubPage() {
  const router = useRouter()
  const { isMobile } = useBreakpoint()

  // On desktop, redirect to orders list
  useEffect(() => {
    if (!isMobile) {
      router.replace('/orders')
    }
  }, [isMobile, router])

  if (!isMobile) return null

  return (
    <MobileModuleMenu
      createAction={{
        href: '/orders/new',
        label: 'Tạo đơn hàng',
      }}
      groups={[
        {
          items: [
            { href: '/orders', label: 'Danh sách đơn hàng', icon: ShoppingCart },
            { href: '/packaging', label: 'Quản lý đóng gói', icon: Inbox },
            { href: '/returns', label: 'Khách trả hàng', icon: Undo2 },
          ],
        },
        {
          items: [
            { href: '/customers', label: 'Khách hàng', icon: BookUser },
            { href: '/warranty', label: 'Bảo hành', icon: Wrench },
            { href: '/complaints', label: 'Khiếu nại', icon: ShieldAlert },
          ],
        },
      ]}
    />
  )
}
