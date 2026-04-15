'use client'

import Link from 'next/link'
import { Plus, ChevronRight, type LucideIcon } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface ModuleMenuItem {
  href: string
  label: string
  icon: LucideIcon
  /** Optional sub-label below the main label */
  description?: string
}

export interface ModuleMenuGroup {
  items: ModuleMenuItem[]
}

interface MobileModuleMenuProps {
  /** Big create button at top */
  createAction?: {
    href: string
    label: string
  }
  /** Groups of menu items */
  groups: ModuleMenuGroup[]
}

export function MobileModuleMenu({ createAction, groups }: MobileModuleMenuProps) {
  return (
    <div className="pb-20 -mx-4 md:mx-0">
      {/* Create Button */}
      {createAction && (
        <div className="px-4 pt-3 pb-2">
          <Link
            href={createAction.href}
            className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card py-8 active:bg-muted/60 transition-colors touch-manipulation"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Plus className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium text-foreground">
              {createAction.label}
            </span>
          </Link>
        </div>
      )}

      {/* Menu Groups */}
      {groups.map((group, gi) => (
        <div key={gi} className={cn('px-4', gi > 0 && 'mt-2')}>
          <div className="rounded-xl border border-border/50 bg-card divide-y divide-border/50 overflow-hidden">
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3.5 active:bg-muted/60 transition-colors touch-manipulation"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <item.icon className="h-4.5 w-4.5 text-foreground/70" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                  {item.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                  )}
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/50 shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
