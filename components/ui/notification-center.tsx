import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Bell, X, CheckCheck, ShoppingCart, Truck, Warehouse, Settings } from 'lucide-react';
import { Badge } from './badge';
import { Button } from './button';
import { ScrollArea } from './scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { formatDateTime } from '../../lib/date-utils';
import { cn } from '../../lib/utils';
import {
  useNotifications,
  useUnreadNotificationCount,
  useMarkAsRead,
  useMarkAllAsRead,
  useDeleteNotification,
  useUnreadGroupCounts,
  type ServerNotification,
} from '@/hooks/use-notifications';
import type { NotificationGroup } from '@/lib/notification-groups';

/**
 * Notification Center - Trung tâm thông báo toàn hệ thống (Server-backed)
 *
 * Data is stored in PostgreSQL `notifications` table.
 * React Query polls every 30s for updates.
 *
 * Server-side: use `createNotification()` from `@/lib/notifications` to trigger.
 * Client-side: use `useNotificationStore()` for reading (backward-compatible wrapper).
 */

// Re-export type for backward compatibility
export type Notification = ServerNotification;

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'isRead' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

/**
 * Backward-compatible hook for reading notifications.
 *
 * Note: `addNotification` is now a no-op on the client.
 * Create notifications server-side via `createNotification()` from `@/lib/notifications`.
 */
export function useNotificationStore(): NotificationStore {
  const { data } = useNotifications({ limit: 50 });
  const unreadCount = useUnreadNotificationCount();
  const markAsReadMutation = useMarkAsRead();
  const markAllMutation = useMarkAllAsRead();
  const deleteMutation = useDeleteNotification();

  const notifications = data?.data ?? [];

  return {
    notifications,
    unreadCount,
    addNotification: () => {
      // No-op — notifications are now created server-side via lib/notifications.ts
      console.warn('[NotificationCenter] addNotification is deprecated. Use server-side createNotification() instead.');
    },
    markAsRead: (id: string) => markAsReadMutation.mutate(id),
    markAllAsRead: () => markAllMutation.mutate(),
    removeNotification: (id: string) => deleteMutation.mutate(id),
    clearAll: () => {
      // Clear = mark all as read (don't bulk-delete from DB)
      markAllMutation.mutate();
    },
  };
}

// Icon mapping
const notificationIcons: Record<string, React.ReactNode> = {
  // Đơn hàng
  order: <span className="text-green-600">📦</span>,
  warranty: <span className="text-blue-600">🔧</span>,
  complaint: <span className="text-red-600">📝</span>,
  sales_return: <span className="text-orange-600">↩️</span>,
  customer: <span className="text-cyan-600">👤</span>,
  // Vận chuyển
  shipment: <span className="text-indigo-600">🚚</span>,
  reconciliation: <span className="text-violet-600">📊</span>,
  // Kho hàng
  stock_transfer: <span className="text-amber-600">🔄</span>,
  inventory: <span className="text-yellow-600">📦</span>,
  inventory_check: <span className="text-lime-600">📋</span>,
  inventory_receipt: <span className="text-emerald-600">📥</span>,
  cost_adjustment: <span className="text-rose-600">💲</span>,
  price_adjustment: <span className="text-pink-600">🏷️</span>,
  purchase_order: <span className="text-sky-600">🛒</span>,
  purchase_return: <span className="text-fuchsia-600">↩️</span>,
  // Hệ thống
  system: <span className="text-gray-600">⚙️</span>,
  task: <span className="text-teal-600">✅</span>,
  comment: <span className="text-indigo-600">💬</span>,
  mention: <span className="text-pink-600">@</span>,
  attendance: <span className="text-amber-600">📋</span>,
  leave: <span className="text-green-600">🌴</span>,
  payroll: <span className="text-emerald-600">💰</span>,
  penalty: <span className="text-red-600">⚠️</span>,
  employee: <span className="text-purple-600">👤</span>,
  payment: <span className="text-emerald-600">💳</span>,
  receipt: <span className="text-blue-600">🧾</span>,
};

// Group tab config
const GROUP_TABS: { key: NotificationGroup | null; label: string; Icon: typeof Bell }[] = [
  { key: null, label: 'Tất cả', Icon: Bell },
  { key: 'orders', label: 'Đơn hàng', Icon: ShoppingCart },
  { key: 'shipping', label: 'Vận chuyển', Icon: Truck },
  { key: 'inventory', label: 'Kho hàng', Icon: Warehouse },
  { key: 'system', label: 'Hệ thống', Icon: Settings },
];

export function NotificationCenter() {
  const router = useRouter();
  const [activeGroup, setActiveGroup] = React.useState<NotificationGroup | null>(null);
  const { data, isLoading } = useNotifications({
    limit: 50,
    ...(activeGroup ? { group: activeGroup } : {}),
  });
  const unreadCount = useUnreadNotificationCount();
  const { data: groupCounts } = useUnreadGroupCounts();
  const markAsReadMutation = useMarkAsRead();
  const markAllMutation = useMarkAllAsRead();
  const deleteMutation = useDeleteNotification();
  const [open, setOpen] = React.useState(false);

  const notifications = data?.data ?? [];

  const handleNotificationClick = React.useCallback((notification: ServerNotification) => {
    markAsReadMutation.mutate(notification.id);
    if (notification.link) {
      router.push(notification.link);
      setOpen(false);
    }
  }, [markAsReadMutation, router]);

  // Get badge count for a group tab
  const getBadgeCount = (group: NotificationGroup | null) => {
    if (!groupCounts) return 0;
    if (group === null) return groupCounts.total;
    return groupCounts[group];
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 text-xs"
              variant="destructive"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-95 p-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="font-semibold">Thông báo</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                markAllMutation.mutate();
              }}
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Đọc tất cả ({unreadCount})
            </Button>
          )}
        </div>

        {/* Group Tabs */}
        <div className="flex items-center border-b border-border px-2">
          {GROUP_TABS.map(({ key, label, Icon }) => {
            const count = getBadgeCount(key);
            const isActive = activeGroup === key;
            return (
              <button
                key={key ?? 'all'}
                className={cn(
                  "relative flex flex-col items-center gap-0.5 px-3 py-2.5 text-xs transition-colors",
                  isActive
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveGroup(key);
                }}
              >
                <div className="relative">
                  <Icon className="h-4.5 w-4.5" />
                  {count > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive text-xs font-medium text-destructive-foreground px-0.5">
                      {count > 99 ? '99+' : count}
                    </span>
                  )}
                </div>
                <span className="mt-0.5">{label}</span>
              </button>
            );
          })}
        </div>

        {/* Notifications List */}
        {notifications.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Bell className="h-12 w-12 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">Không có thông báo</p>
          </div>
        ) : (
          <>
            <ScrollArea className="h-100">
              <div className="p-2">
                {notifications.map((notification) => (
                  <div key={notification.id}>
                    <div
                      className={cn(
                        "group relative flex gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                        notification.isRead 
                          ? "hover:bg-accent/50" 
                          : "bg-blue-50 hover:bg-blue-100 border-l-2 border-blue-500"
                      )}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleNotificationClick(notification)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleNotificationClick(notification);
                        }
                      }}
                    >
                      {/* Icon */}
                      <div className="shrink-0 mt-0.5">
                        {notificationIcons[notification.type]}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn(
                            "text-sm font-medium",
                            !notification.isRead && "font-semibold"
                          )}>
                            {notification.title}
                          </p>
                          
                          {/* Delete button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteMutation.mutate(notification.id);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-muted-foreground">
                            {formatDateTime(notification.createdAt)}
                          </span>
                          
                          {notification.senderName && (
                            <>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground">
                                {notification.senderName}
                              </span>
                            </>
                          )}
                          
                          {!notification.isRead && (
                            <>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-blue-600 font-medium">Mới</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Footer */}
            <DropdownMenuSeparator />
            <div className="p-2 flex items-center justify-between">
              <span className="text-xs text-muted-foreground pl-2">
                {activeGroup ? `${GROUP_TABS.find(t => t.key === activeGroup)?.label}` : 'Tất cả thông báo'}
              </span>
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => {
                    markAllMutation.mutate();
                    setOpen(false);
                  }}
                >
                  Đánh dấu tất cả đã đọc
                </Button>
              )}
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
