import * as React from 'react';
import { cn } from '../../../lib/utils.ts';

interface SettingsFormSectionProps extends React.ComponentPropsWithoutRef<'section'> {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  contentClassName?: string;
}

export function SettingsFormSection({
  title,
  description,
  badge,
  children,
  className,
  contentClassName,
  ...props
}: SettingsFormSectionProps) {
  return (
    <section
      className={cn(
        'rounded-xl border border-border bg-card p-6 shadow-none',
        'space-y-5 transition-colors',
        className,
      )}
      {...props}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold leading-6">{title}</h3>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {badge}
      </div>
      <div className={cn('space-y-4', contentClassName)}>{children}</div>
    </section>
  );
}
