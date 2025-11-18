import * as React from 'react';
import { cn } from '../../lib/utils';
import { LucideIcon } from 'lucide-react';

interface InfoItemProps {
  icon?: LucideIcon;
  label: string;
  value?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isClickable?: boolean;
}

export function InfoItem({
  icon: Icon,
  label,
  value,
  children,
  className,
  onClick,
  isClickable = false,
}: InfoItemProps) {
  const content = value ?? children;

  return (
    <div 
      className={cn("grid gap-1", isClickable && "cursor-pointer", className)}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        <p className="text-sm font-medium leading-none">{label}</p>
      </div>
      <div className={cn("text-sm", isClickable ? "text-primary hover:underline" : "text-muted-foreground")}>
        {content !== null && content !== undefined && content !== '' ? content : '—'}
      </div>
    </div>
  );
}
