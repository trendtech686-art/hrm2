import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Standard section heading that follows mobile typography guidelines.
 * Mobile: small uppercase gray text (like profile page "THÔNG TIN CÔNG VIỆC")
 * Desktop: normal semibold heading
 */
export function SectionHeading({ children, className }: SectionHeadingProps) {
  return (
    <h3
      className={cn(
        'text-xs font-medium text-muted-foreground uppercase tracking-wider',
        'md:text-sm md:font-semibold md:text-foreground md:normal-case md:tracking-normal',
        className
      )}
    >
      {children}
    </h3>
  );
}
