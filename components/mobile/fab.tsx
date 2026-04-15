'use client'

import * as React from 'react'
import { Plus, type LucideIcon } from 'lucide-react'
import { cn } from '../../lib/utils'

interface FABProps {
  onClick: () => void
  icon?: LucideIcon
  label?: string
  className?: string
}

/**
 * FAB (Floating Action Button) — Mobile-only
 * Positioned bottom-right, above the bottom navigation bar.
 * Follows Material Design FAB pattern.
 */
export function FAB({ onClick, icon: Icon = Plus, label, className }: FABProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'fixed bottom-20 right-4 z-40 md:hidden',
        'flex items-center justify-center gap-2',
        'rounded-full bg-primary text-primary-foreground shadow-lg',
        'active:scale-95 transition-transform touch-manipulation',
        label ? 'h-12 px-5' : 'h-14 w-14',
        className
      )}
      aria-label={label || 'Tạo mới'}
    >
      <Icon className="h-5 w-5" />
      {label && <span className="text-sm font-medium">{label}</span>}
    </button>
  )
}
