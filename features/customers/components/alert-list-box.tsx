import * as React from "react";
import { Badge } from "../../../components/ui/badge.tsx";
import { cn } from "../../../lib/utils.ts";
import type { LucideIcon } from "lucide-react";

interface AlertItem {
  key: string;
  label: string;
  value: number;
  Icon: LucideIcon;
  accent: string;
}

interface AlertListBoxProps {
  items: AlertItem[];
  activeFilter: string;
  onFilterChange: (key: string) => void;
  variant?: 'default' | 'destructive';
}

export function AlertListBox({ items, activeFilter, onFilterChange, variant = 'default' }: AlertListBoxProps) {
  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      <div className="divide-y">
        {items.map(({ key, label, value, Icon, accent }) => {
          const isActive = activeFilter === key;
          const borderColor = variant === 'destructive' ? 'border-l-destructive' : 'border-l-primary';
          
          return (
            <div
              key={key}
              onClick={() => onFilterChange(isActive ? 'all' : key)}
              className={cn(
                "flex items-center justify-between px-4 py-2.5 cursor-pointer transition-all hover:bg-accent/50",
                isActive && "bg-accent border-l-4",
                isActive && borderColor
              )}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Icon className={cn("h-4 w-4 flex-shrink-0", accent)} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{label}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={isActive ? "default" : "secondary"} className="text-xs font-semibold">
                  {value}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
