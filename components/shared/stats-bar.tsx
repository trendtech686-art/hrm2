'use client'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export interface StatsBarItem {
  key: string
  label: string
  value: string | number
  badge?: number
  description?: string
}

interface StatsBarProps {
  items: StatsBarItem[]
  activeKey?: string | null
  onSelect?: (key: string | null) => void
  className?: string
}

export function StatsBar({ items, activeKey, onSelect, className }: StatsBarProps) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <div className="flex gap-1.5 min-w-max pb-1">
        {items.map(item => {
          const isActive = activeKey === item.key
          const isClickable = !!onSelect

          return (
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
            <div
              key={item.key}
              role={isClickable ? 'button' : undefined}
              tabIndex={isClickable ? 0 : undefined}
              className={cn(
                "shrink-0 rounded-xl border px-3.5 py-2 text-left transition-colors",
                isActive
                  ? "bg-primary/5 border-primary ring-1 ring-primary"
                  : "border-border bg-background",
                isClickable && "cursor-pointer hover:bg-muted/50"
              )}
              onClick={isClickable ? () => onSelect!(isActive ? null : item.key) : undefined}
              onKeyDown={isClickable ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect!(isActive ? null : item.key) } } : undefined}
            >
              <div className="flex flex-col items-start gap-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{item.label}</span>
                  {item.badge != null && item.badge > 0 && (
                    <Badge
                      variant={isActive ? 'default' : 'destructive'}
                      className="h-5 min-w-5 justify-center rounded-full px-1.5 text-xs leading-none"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <span className="text-sm font-semibold tabular-nums">{item.value}</span>
                {item.description && (
                  <span className="text-xs text-muted-foreground">{item.description}</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
