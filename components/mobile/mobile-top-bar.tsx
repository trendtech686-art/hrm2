'use client'

import Link from 'next/link'
import { Bell } from 'lucide-react'
import { useUnreadNotificationCount } from '@/hooks/use-notifications'

/**
 * Standalone notification bell icon — can be used as a page header action.
 * Hidden on desktop (md:hidden).
 */
export function NotificationBellIcon() {
  const unreadCount = useUnreadNotificationCount()

  return (
    <Link
      href="/notifications"
      className="relative flex items-center justify-center h-9 w-9 rounded-full active:bg-muted/60 transition-colors touch-manipulation md:hidden"
    >
      <Bell className="h-5 w-5 text-foreground" />
      {unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground px-1">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Link>
  )
}

/**
 * Mobile-only top header bar — shows notification bell icon.
 * Hidden on desktop (md:hidden).
 */
export function MobileTopBar() {
  return (
    <div className="sticky top-0 z-30 flex items-center justify-end h-11 px-4 bg-background/95 backdrop-blur md:hidden">
      <NotificationBellIcon />
    </div>
  )
}
