'use client'

import { useRouter } from 'next/navigation'
import {
  Package,
  Inbox,
  ClipboardCheck,
  Truck,
  ArrowLeftRight,
  History,
  Undo2,
  CircleDollarSign,
  Tags,
  FolderTree,
} from 'lucide-react'
import { useBreakpoint } from '@/contexts/breakpoint-context'
import { MobileModuleMenu } from '@/components/mobile/mobile-module-menu'
import { useEffect } from 'react'

export function ProductsHubPage() {
  const router = useRouter()
  const { isMobile } = useBreakpoint()

  // On desktop, redirect to products list
  useEffect(() => {
    if (!isMobile) {
      router.replace('/products')
    }
  }, [isMobile, router])

  if (!isMobile) return null

  return (
    <MobileModuleMenu
      createAction={{
        href: '/products/new',
        label: 'Thêm sản phẩm',
      }}
      groups={[
        {
          items: [
            { href: '/products', label: 'Danh sách sản phẩm', icon: Package },
            { href: '/brands', label: 'Thương hiệu', icon: Tags },
            { href: '/categories', label: 'Danh mục', icon: FolderTree },
          ],
        },
        {
          items: [
            { href: '/inventory-receipts', label: 'Nhập kho', icon: Inbox },
            { href: '/inventory-checks', label: 'Kiểm kê', icon: ClipboardCheck },
            { href: '/stock-transfers', label: 'Chuyển kho', icon: ArrowLeftRight },
            { href: '/cost-adjustments', label: 'Điều chỉnh giá vốn', icon: CircleDollarSign },
          ],
        },
        {
          items: [
            { href: '/suppliers', label: 'Nhà cung cấp', icon: Truck },
            { href: '/purchase-orders', label: 'Đơn nhập hàng', icon: History },
            { href: '/purchase-returns', label: 'Trả hàng nhập', icon: Undo2 },
          ],
        },
      ]}
    />
  )
}
