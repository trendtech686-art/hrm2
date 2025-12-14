import * as React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card.tsx';
import { cn } from '../../lib/utils.ts';

export type SettingsPlaceholderProps = {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  contentClassName?: string;
};

/**
 * Placeholder card dùng chung cho các trang Settings chưa triển khai.
 */
export function SettingsPlaceholder({
  title,
  description,
  icon: Icon = Inbox,
  action,
  secondaryAction,
  children,
  className,
  contentClassName,
}: SettingsPlaceholderProps) {
  return (
    <Card className={cn('border-dashed border-muted-foreground/40 shadow-none', className)}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <CardTitle className="text-h5 font-semibold">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className={cn('space-y-4 text-sm text-muted-foreground', contentClassName)}>
        {children ?? (
          <p>Chức năng này đang được phát triển. Vui lòng quay lại sau.</p>
        )}
        {(action || secondaryAction) && (
          <div className="flex flex-wrap gap-2">
            {action}
            {secondaryAction}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
