'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Users, Clock, CalendarOff, CalendarCheck,
  Briefcase, Package, ShoppingCart, Truck, History, BookUser, Wrench,
  ShieldAlert, BadgeCent, Library, AreaChart, Settings, ReceiptText, CreditCard,
  Inbox, Wallet, Undo2, ListTodo, ClipboardCheck, CheckSquare,
  ArrowLeftRight, CircleDollarSign, Tags, FolderTree, LogOut,
  Bell, ChevronRight,
  type LucideIcon,
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useRoleSettings } from '@/features/settings/employees/hooks/use-role-settings'
import type { Permission } from '@/features/employees/permissions'
import { toast } from 'sonner'
import { useUnreadNotificationCount } from '@/hooks/use-notifications'

interface MenuItem {
  href: string
  label: string
  icon: LucideIcon
  permission?: Permission
}

interface MenuSection {
  title: string
  items: MenuItem[]
}

const MENU_SECTIONS: MenuSection[] = [
  {
    title: 'Nhân sự',
    items: [
      { href: '/employees', label: 'Nhân viên', icon: Users, permission: 'view_employees' },
      { href: '/attendance', label: 'Chấm công', icon: Clock, permission: 'view_attendance' },
      { href: '/leaves', label: 'Nghỉ phép', icon: CalendarOff, permission: 'view_leaves' },
      { href: '/payroll', label: 'Bảng lương', icon: CalendarCheck, permission: 'view_payroll' },
    ],
  },
  {
    title: 'Kinh doanh',
    items: [
      { href: '/customers', label: 'Khách hàng', icon: Briefcase, permission: 'view_customers' },
      { href: '/products', label: 'Sản phẩm', icon: Package, permission: 'view_products' },
      { href: '/brands', label: 'Thương hiệu', icon: Tags, permission: 'view_brands' },
      { href: '/categories', label: 'Danh mục', icon: FolderTree, permission: 'view_categories' },
      { href: '/orders', label: 'Đơn hàng', icon: ShoppingCart, permission: 'view_orders' },
      { href: '/returns', label: 'Trả hàng', icon: Undo2, permission: 'view_sales_returns' },
      { href: '/packaging', label: 'Đóng gói', icon: Inbox, permission: 'view_packaging' },
      { href: '/shipments', label: 'Vận đơn', icon: Truck, permission: 'view_shipments' },
      { href: '/reconciliation', label: 'Đối soát COD', icon: Wallet, permission: 'view_reconciliation' },
    ],
  },
  {
    title: 'Mua hàng & Kho',
    items: [
      { href: '/suppliers', label: 'NCC', icon: Truck, permission: 'view_suppliers' },
      { href: '/purchase-orders', label: 'Đơn nhập', icon: History, permission: 'view_purchase_orders' },
      { href: '/purchase-returns', label: 'Trả nhập', icon: Undo2, permission: 'view_purchase_returns' },
      { href: '/inventory-receipts', label: 'Nhập kho', icon: Inbox, permission: 'view_inventory' },
      { href: '/stock-transfers', label: 'Chuyển kho', icon: ArrowLeftRight, permission: 'view_stock_transfers' },
      { href: '/inventory-checks', label: 'Kiểm kê', icon: ClipboardCheck, permission: 'view_inventory_checks' },
      { href: '/cost-adjustments', label: 'Giá vốn', icon: CircleDollarSign, permission: 'view_cost_adjustments' },
    ],
  },
  {
    title: 'Tài chính',
    items: [
      { href: '/cashbook', label: 'Sổ quỹ', icon: BookUser, permission: 'view_vouchers' },
      { href: '/receipts', label: 'Phiếu thu', icon: ReceiptText, permission: 'view_vouchers' },
      { href: '/payments', label: 'Phiếu chi', icon: CreditCard, permission: 'view_vouchers' },
    ],
  },
  {
    title: 'Vận hành',
    items: [
      { href: '/my-tasks', label: 'Việc của tôi', icon: CheckSquare, permission: 'view_tasks' },
      { href: '/tasks', label: 'Giao việc', icon: ListTodo, permission: 'create_tasks' },
      { href: '/warranty', label: 'Bảo hành', icon: Wrench, permission: 'view_warranty' },
      { href: '/complaints', label: 'Khiếu nại', icon: ShieldAlert, permission: 'view_complaints' },
      { href: '/penalties', label: 'Phiếu phạt', icon: BadgeCent, permission: 'view_employees' },
      { href: '/wiki', label: 'Wiki', icon: Library, permission: 'view_wiki' },
    ],
  },
  {
    title: 'Hệ thống',
    items: [
      { href: '/reports', label: 'Báo cáo', icon: AreaChart, permission: 'view_reports' },
      { href: '/settings', label: 'Cài đặt', icon: Settings, permission: 'view_settings' },
    ],
  },
]

export default function MorePage() {
  const router = useRouter()
  const { logout, employee, isAdmin } = useAuth()
  const { data: customRoles } = useRoleSettings()
  const unreadCount = useUnreadNotificationCount()

  const userRole = employee?.role || 'Sales'

  const filteredSections = React.useMemo(() => {
    const matchedRole = customRoles?.find(r => r.id === userRole)
    const userPermissions: Permission[] = matchedRole?.permissions ?? []

    return MENU_SECTIONS
      .map(section => ({
        ...section,
        items: section.items.filter(item =>
          isAdmin || !item.permission || userPermissions.includes(item.permission)
        ),
      }))
      .filter(section => section.items.length > 0)
  }, [isAdmin, userRole, customRoles])

  const handleLogout = () => {
    logout()
    toast.success('Đăng xuất thành công')
    router.push('/login')
  }

  return (
    <div className="pb-20 -mx-4 md:mx-0">
      {/* User Card */}
      <div className="px-4 pt-3 pb-2">
        <Link
          href="/profile"
          className="flex items-center gap-3 rounded-xl border border-border/50 bg-card p-4 active:bg-muted/60 transition-colors touch-manipulation"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-lg">
            {employee?.fullName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{employee?.fullName || 'Người dùng'}</p>
            <p className="text-xs text-muted-foreground truncate">{employee?.role || 'Nhân viên'}</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground/50 shrink-0" />
        </Link>
      </div>

      {/* Quick Links */}
      <div className="px-4 pb-2">
        <div className="rounded-xl border border-border/50 bg-card divide-y divide-border/50 overflow-hidden">
          <Link
            href="/notifications"
            className="flex items-center gap-3 px-4 py-3.5 active:bg-muted/60 transition-colors touch-manipulation"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
              <Bell className="h-4.5 w-4.5 text-foreground/70" />
            </div>
            <span className="flex-1 text-sm font-medium">Thông báo</span>
            {unreadCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive text-xs font-medium text-destructive-foreground px-1.5">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
            <ChevronRight className="h-4 w-4 text-muted-foreground/50 shrink-0" />
          </Link>
          <Link
            href="/my-tasks"
            className="flex items-center gap-3 px-4 py-3.5 active:bg-muted/60 transition-colors touch-manipulation"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
              <CheckSquare className="h-4.5 w-4.5 text-foreground/70" />
            </div>
            <span className="flex-1 text-sm font-medium">Công việc của tôi</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground/50 shrink-0" />
          </Link>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="py-1">
        {filteredSections.map((section) => (
          <div key={section.title} className="py-2">
            <p className="px-4 pb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {section.title}
            </p>
            <div className="flex flex-wrap px-2">
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center gap-1.5 py-3 rounded-lg active:bg-muted/60 transition-colors touch-manipulation w-1/4"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
                    <item.icon className="h-5 w-5 text-foreground/70" />
                  </div>
                  <span className="text-xs text-muted-foreground text-center leading-tight line-clamp-1 max-w-18">
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Logout */}
      <div className="px-4 pt-2 pb-4">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-md border text-destructive text-sm font-medium active:bg-destructive/5 transition-colors touch-manipulation"
        >
          <LogOut className="h-4 w-4" />
          Đăng xuất
        </button>
      </div>
    </div>
  )
}
