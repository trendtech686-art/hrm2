import * as React from 'react';
import { Button, type ButtonProps } from '../ui/button.tsx';
import { cn } from '../../lib/utils.ts';

/**
 * SettingsActionButton chuẩn hóa các nút hành động của module Cài đặt
 * để luôn tuân thủ chiều cao h-9 và padding đồng nhất.
 */
export const SettingsActionButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, size, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        size={size ?? 'sm'}
        className={cn('h-9 px-4 font-medium gap-2', className)}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

SettingsActionButton.displayName = 'SettingsActionButton';
