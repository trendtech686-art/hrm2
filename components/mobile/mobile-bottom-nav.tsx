'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  ShoppingCart,
  Truck,
  Package,
  LayoutGrid,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '../../lib/utils'

interface BottomNavItem {
  href: string
  label: string
  icon: LucideIcon
  matchPrefixes?: string[]
}

const NAV_ITEMS: BottomNavItem[] = [
  { href: '/dashboard', label: 'Tổng quan', icon: Home },
  { href: '/orders-hub', label: 'Đơn hàng', icon: ShoppingCart, matchPrefixes: ['/orders-hub', '/orders', '/packaging', '/returns', '/warranty', '/complaints'] },
  { href: '/shipping-hub', label: 'Vận chuyển', icon: Truck, matchPrefixes: ['/shipping-hub', '/shipments', '/reconciliation'] },
  { href: '/products-hub', label: 'Sản phẩm', icon: Package, matchPrefixes: ['/products-hub', '/products', '/inventory-receipts', '/inventory-checks', '/stock-transfers', '/purchase-orders', '/suppliers', '/purchase-returns', '/cost-adjustments'] },
  { href: '/more', label: 'Thêm', icon: LayoutGrid, matchPrefixes: ['/more', '/employees', '/attendance', '/leaves', '/payroll', '/cashbook', '/receipts', '/payments', '/my-tasks', '/tasks', '/penalties', '/wiki', '/reports', '/settings', '/customers', '/brands', '/categories', '/profile', '/notifications'] },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80 md:hidden pb-safe-bottom">
      <div className="flex items-center justify-around h-14 px-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.matchPrefixes?.some(p => pathname.startsWith(p)))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full gap-0.5 text-xs font-medium transition-colors',
                'active:scale-95 touch-manipulation',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              <item.icon className={cn('h-5 w-5', isActive && 'stroke-[2.5px]')} />
              <span className="truncate max-w-16">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
