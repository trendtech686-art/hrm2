'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * MobileCard — primitive card chuẩn mobile-app cho các list renderer trên mobile.
 *
 * Dùng bên trong `renderMobileCard` của `ResponsiveDataTable` (hoặc list mobile
 * bất kỳ). Preset:
 * - `rounded-xl` chuẩn iOS 13+
 * - `border border-border/50` subtle, `bg-card` token shadcn
 * - `active:scale-[0.98]` tap feedback, `touch-manipulation` scroll mượt
 * - Padding 16px (`p-4`) đồng bộ chuẩn 44pt touch target
 *
 * Khi anh muốn đổi look tổng thể của mobile cards (VD: rounded-lg, shadow,
 * border color, active feedback…) — chỉ cần sửa ở đây là toàn bộ card
 * renderer trong app đồng loạt đổi theo.
 *
 * Kèm 3 slot phổ biến: `MobileCardHeader`, `MobileCardFooter`, `MobileCardBody`.
 */
interface MobileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Tắt tap feedback (khi card không clickable) */
  inert?: boolean
  /** Thêm nhấn mạnh cho card (overdue / critical / warning) */
  emphasis?: 'none' | 'destructive' | 'warning' | 'success'
}

export function MobileCard({
  className,
  inert = false,
  emphasis = 'none',
  children,
  ...rest
}: MobileCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border bg-card text-card-foreground p-4',
        'border-border/50',
        !inert &&
          'cursor-pointer touch-manipulation transition-transform active:scale-[0.98]',
        emphasis === 'destructive' && 'border-destructive/40',
        emphasis === 'warning' && 'border-yellow-500/40',
        emphasis === 'success' && 'border-emerald-500/40',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

/**
 * MobileCardHeader — hàng đầu của card: thường chứa avatar/icon + title +
 * meta + menu. Layout `flex items-start gap-3`.
 */
interface MobileCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function MobileCardHeader({
  className,
  children,
  ...rest
}: MobileCardHeaderProps) {
  return (
    <div className={cn('flex items-start gap-3', className)} {...rest}>
      {children}
    </div>
  )
}

/**
 * MobileCardBody — phần giữa của card (mô tả, progress, chips…). Tự có
 * `mt-3` để cách với header.
 */
interface MobileCardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export function MobileCardBody({
  className,
  children,
  ...rest
}: MobileCardBodyProps) {
  return (
    <div className={cn('mt-3', className)} {...rest}>
      {children}
    </div>
  )
}

/**
 * MobileCardFooter — hàng cuối card: badge + quick actions. Tự có border-top
 * nhẹ + `mt-3 pt-3` để phân vùng với phần trên.
 */
interface MobileCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Ẩn border top (nếu card không cần phân vùng). */
  noBorder?: boolean
}

export function MobileCardFooter({
  className,
  noBorder = false,
  children,
  ...rest
}: MobileCardFooterProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between mt-3',
        !noBorder && 'pt-3 border-t border-border/50',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
