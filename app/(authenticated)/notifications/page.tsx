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
import { MobileTabsList, MobileTabsTrigger, mobileBleedCardClass } from '@/components/layout/page-section'
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
import { TYPE_PALETTE } from '@/lib/type-color-palette'

// Lucide icon mapping for notification types.
// - Status-like (order/complaint/penalty/leave/receipt_doc) dùng token semantic.
// - "Type-like" (warranty/customer/inventory/...) lấy từ TYPE_PALETTE để 1 chỗ sửa
//   ảnh hưởng nhiều màn (notification-center, complaint-card, …).
const T = TYPE_PALETTE
const NOTIFICATION_TYPE_CONFIG: Record<string, { icon: React.ElementType; bg: string; fg: string }> = {
  order:             { icon: Package,         bg: 'bg-info/15',        fg: 'text-info' },
  warranty:          { icon: Wrench,          bg: T.sky.bg,            fg: T.sky.fg },
  complaint:         { icon: FileText,        bg: 'bg-destructive/15', fg: 'text-destructive' },
  sales_return:      { icon: RotateCcw,       bg: T.orange.bg,         fg: T.orange.fg },
  customer:          { icon: User,            bg: T.cyan.bg,           fg: T.cyan.fg },
  shipment:          { icon: Truck,           bg: T.indigo.bg,         fg: T.indigo.fg },
  reconciliation:    { icon: BarChart3,       bg: T.violet.bg,         fg: T.violet.fg },
  stock_transfer:    { icon: ArrowLeftRight,  bg: T.amber.bg,          fg: T.amber.fg },
  inventory:         { icon: Warehouse,       bg: T.yellow.bg,         fg: T.yellow.fg },
  inventory_check:   { icon: ClipboardList,   bg: T.lime.bg,           fg: T.lime.fg },
  inventory_receipt: { icon: Receipt,         bg: T.emerald.bg,        fg: T.emerald.fg },
  cost_adjustment:   { icon: CreditCard,      bg: T.rose.bg,           fg: T.rose.fg },
  price_adjustment:  { icon: Tag,             bg: T.pink.bg,           fg: T.pink.fg },
  purchase_order:    { icon: ShoppingCart,    bg: T.sky.bg,            fg: T.sky.fg },
  purchase_return:   { icon: RotateCcw,       bg: T.fuchsia.bg,        fg: T.fuchsia.fg },
  system:            { icon: Settings,        bg: T.neutral.bg,        fg: T.neutral.fg },
  task:              { icon: CheckCircle2,    bg: T.teal.bg,           fg: T.teal.fg },
  comment:           { icon: MessageCircle,   bg: T.indigo.bg,         fg: T.indigo.fg },
  mention:           { icon: AtSign,          bg: T.pink.bg,           fg: T.pink.fg },
  attendance:        { icon: Clock,           bg: T.amber.bg,          fg: T.amber.fg },
  leave:             { icon: TreePalm,        bg: 'bg-success/15',     fg: 'text-success' },
  payroll:           { icon: Banknote,        bg: T.emerald.bg,        fg: T.emerald.fg },
  penalty:           { icon: AlertTriangle,   bg: 'bg-destructive/15', fg: 'text-destructive' },
  employee:          { icon: User,            bg: T.purple.bg,         fg: T.purple.fg },
  payment:           { icon: CreditCard,      bg: T.emerald.bg,        fg: T.emerald.fg },
  receipt_doc:       { icon: Receipt,         bg: 'bg-info/15',        fg: 'text-info' },
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
            <Card key={i} className={mobileBleedCardClass}>
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
        <Card className={mobileBleedCardClass}>
          <CardContent className="flex min-h-[240px] flex-col items-center justify-center py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted mb-3">
              <Bell className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">Không có thông báo</p>
            <p className="text-xs text-muted-foreground mt-1">Thông báo mới sẽ hiển thị tại đây</p>
          </CardContent>
        </Card>
      ) : (
        <Card className={cn(mobileBleedCardClass, 'overflow-hidden')}>
          <div className="divide-y divide-border">
            {notifications.map((n) => (
              <button
                key={n.id}
                type="button"
                className={cn(
                  'flex gap-3 px-4 py-3 w-full text-left transition-colors touch-manipulation',
                  n.link && 'cursor-pointer hover:bg-muted/50 active:bg-muted/70',
                  !n.isRead && 'bg-primary/3',
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
