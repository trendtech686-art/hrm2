'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  Bell, ShoppingCart, Truck, Warehouse, Settings,
  Package, Wrench, FileText, RotateCcw, User,
  BarChart3, ArrowLeftRight, ClipboardList, Receipt,
  Tag, CreditCard, MessageCircle, AtSign, Clock,
  TreePalm, Banknote, AlertTriangle, CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs } from '@/components/ui/tabs'
import { MobileTabsList, MobileTabsTrigger } from '@/components/layout/page-section'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import {
  useNotifications,
  useUnreadGroupCounts,
  useMarkAsRead,
  useMarkAllAsRead,
  type ServerNotification,
} from '@/hooks/use-notifications'
import type { NotificationGroup } from '@/lib/notification-groups'
import { formatDateTime } from '@/lib/date-utils'
import { usePageHeader } from '@/contexts/page-header-context'

// Lucide icon mapping for notification types
const NOTIFICATION_TYPE_CONFIG: Record<string, { icon: React.ElementType; bg: string; fg: string }> = {
  order:            { icon: Package,         bg: 'bg-blue-100',    fg: 'text-blue-600' },
  warranty:         { icon: Wrench,          bg: 'bg-sky-100',     fg: 'text-sky-600' },
  complaint:        { icon: FileText,        bg: 'bg-red-100',     fg: 'text-red-600' },
  sales_return:     { icon: RotateCcw,       bg: 'bg-orange-100',  fg: 'text-orange-600' },
  customer:         { icon: User,            bg: 'bg-cyan-100',    fg: 'text-cyan-600' },
  shipment:         { icon: Truck,           bg: 'bg-indigo-100',  fg: 'text-indigo-600' },
  reconciliation:   { icon: BarChart3,       bg: 'bg-violet-100',  fg: 'text-violet-600' },
  stock_transfer:   { icon: ArrowLeftRight,  bg: 'bg-amber-100',   fg: 'text-amber-600' },
  inventory:        { icon: Warehouse,       bg: 'bg-yellow-100',  fg: 'text-yellow-600' },
  inventory_check:  { icon: ClipboardList,   bg: 'bg-lime-100',    fg: 'text-lime-600' },
  inventory_receipt:{ icon: Receipt,         bg: 'bg-emerald-100', fg: 'text-emerald-600' },
  cost_adjustment:  { icon: CreditCard,      bg: 'bg-rose-100',    fg: 'text-rose-600' },
  price_adjustment: { icon: Tag,             bg: 'bg-pink-100',    fg: 'text-pink-600' },
  purchase_order:   { icon: ShoppingCart,    bg: 'bg-sky-100',     fg: 'text-sky-600' },
  purchase_return:  { icon: RotateCcw,       bg: 'bg-fuchsia-100', fg: 'text-fuchsia-600' },
  system:           { icon: Settings,        bg: 'bg-gray-100',    fg: 'text-gray-600' },
  task:             { icon: CheckCircle2,    bg: 'bg-teal-100',    fg: 'text-teal-600' },
  comment:          { icon: MessageCircle,   bg: 'bg-indigo-100',  fg: 'text-indigo-600' },
  mention:          { icon: AtSign,          bg: 'bg-pink-100',    fg: 'text-pink-600' },
  attendance:       { icon: Clock,           bg: 'bg-amber-100',   fg: 'text-amber-600' },
  leave:            { icon: TreePalm,        bg: 'bg-green-100',   fg: 'text-green-600' },
  payroll:          { icon: Banknote,        bg: 'bg-emerald-100', fg: 'text-emerald-600' },
  penalty:          { icon: AlertTriangle,   bg: 'bg-red-100',     fg: 'text-red-600' },
  employee:         { icon: User,            bg: 'bg-purple-100',  fg: 'text-purple-600' },
  payment:          { icon: CreditCard,      bg: 'bg-emerald-100', fg: 'text-emerald-600' },
  receipt_doc:      { icon: Receipt,         bg: 'bg-blue-100',    fg: 'text-blue-600' },
}

function NotificationIcon({ type }: { type: string }) {
  const config = NOTIFICATION_TYPE_CONFIG[type]
  const Icon = config?.icon ?? Bell
  const bg = config?.bg ?? 'bg-muted'
  const fg = config?.fg ?? 'text-muted-foreground'

  return (
    <div className={cn('flex h-9 w-9 items-center justify-center rounded-full shrink-0', bg)}>
      <Icon className={cn('h-4 w-4', fg)} />
    </div>
  )
}

// Group tabs config
const GROUP_TABS: { value: string; label: string; Icon: React.ElementType }[] = [
  { value: 'all', label: 'Tất cả', Icon: Bell },
  { value: 'orders', label: 'Đơn hàng', Icon: ShoppingCart },
  { value: 'shipping', label: 'Vận chuyển', Icon: Truck },
  { value: 'inventory', label: 'Kho hàng', Icon: Warehouse },
  { value: 'system', label: 'Hệ thống', Icon: Settings },
]

export default function NotificationsPage() {
  const router = useRouter()
  const [activeGroup, setActiveGroup] = React.useState<string>('all')
  const groupParam = activeGroup === 'all' ? undefined : activeGroup as NotificationGroup
  const { data, isLoading } = useNotifications({
    limit: 50,
    ...(groupParam ? { group: groupParam } : {}),
  })
  const { data: groupCounts } = useUnreadGroupCounts()
  const markAsReadMutation = useMarkAsRead()
  const markAllMutation = useMarkAllAsRead()

  const notifications = data?.data ?? []
  const totalUnread = groupCounts?.total ?? 0

  usePageHeader({
    title: 'Thông báo',
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Thông báo', href: '/notifications', isCurrent: true },
    ],
  })

  const handleClick = (notification: ServerNotification) => {
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification.id)
    }
    if (notification.link) {
      router.push(notification.link)
    }
  }

  return (
    <div className="pb-20 md:pb-4 space-y-4">
      {/* ─── Group Tabs ─── */}
      <Tabs value={activeGroup} onValueChange={setActiveGroup}>
        <MobileTabsList>
          {GROUP_TABS.map(({ value, label, Icon }) => {
            const count = value === 'all' ? totalUnread : (groupCounts?.[value as NotificationGroup] ?? 0)
            return (
              <MobileTabsTrigger
                key={value}
                value={value}
                className="gap-1.5"
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{label}</span>
                {count > 0 && (
                  <Badge variant="destructive" className="h-4.5 min-w-4.5 px-1 text-xs leading-none rounded-full">
                    {count > 99 ? '99+' : count}
                  </Badge>
                )}
              </MobileTabsTrigger>
            )
          })}
        </MobileTabsList>
      </Tabs>

      {/* ─── Actions Bar ─── */}
      {totalUnread > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{totalUnread} chưa đọc</p>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-primary"
            onClick={() => markAllMutation.mutate()}
          >
            Đánh dấu đã đọc tất cả
          </Button>
        </div>
      )}

      {/* ─── Notification List ─── */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-3">
                <div className="flex gap-3 animate-pulse">
                  <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted mb-3">
              <Bell className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">Không có thông báo</p>
            <p className="text-xs text-muted-foreground mt-1">Thông báo mới sẽ hiển thị tại đây</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="divide-y divide-border">
            {notifications.map((n) => (
              <button
                key={n.id}
                type="button"
                className={cn(
                  'flex gap-3 px-4 py-3 w-full text-left transition-colors touch-manipulation',
                  n.link && 'cursor-pointer hover:bg-muted/50 active:bg-muted/70',
                  !n.isRead && 'bg-primary/[0.03]',
                )}
                onClick={() => handleClick(n)}
              >
                <NotificationIcon type={n.type} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2">
                    <p className={cn('text-sm flex-1 min-w-0', !n.isRead ? 'font-semibold' : 'font-normal text-foreground/80')}>
                      {n.title}
                    </p>
                    {!n.isRead && <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />}
                  </div>
                  {n.message && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                  )}
                  <span className="text-xs text-muted-foreground/70 mt-1 block">{formatDateTime(n.createdAt)}</span>
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
