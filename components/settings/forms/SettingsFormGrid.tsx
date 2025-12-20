import * as React from 'react';
import { cn } from '../../../lib/utils';

interface SettingsFormGridProps extends React.ComponentPropsWithoutRef<'div'> {
  columns?: 1 | 2 | 3;
}

const COLUMN_MAP: Record<Required<SettingsFormGridProps>['columns'], string> = {
  1: 'grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
};

export function SettingsFormGrid({ columns = 2, className, children, ...props }: SettingsFormGridProps) {
  return (
    <div
      className={cn('grid gap-4', COLUMN_MAP[columns], className)}
      {...props}
    >
      {children}
    </div>
  );
}
