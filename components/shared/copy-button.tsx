import * as React from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

interface CopyButtonProps {
  value: string | undefined | null;
  className?: string;
  showToast?: boolean;
  toastMessage?: string;
  size?: 'xs' | 'sm' | 'md';
}

/**
 * CopyButton - Nút copy với animation và feedback
 * 
 * @example
 * <CopyButton value={email} />
 * <CopyButton value={phone} showToast toastMessage="Đã copy số điện thoại" />
 */
export function CopyButton({ 
  value, 
  className,
  showToast = true,
  toastMessage = 'Đã copy vào clipboard',
  size = 'sm',
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      if (showToast) {
        toast.success(toastMessage);
      }
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Không thể copy vào clipboard');
    }
  };

  if (!value) return null;

  const sizeClasses = {
    xs: 'h-5 w-5',
    sm: 'h-6 w-6',
    md: 'h-7 w-7',
  };

  const iconSizes = {
    xs: 'h-3 w-3',
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleCopy}
      className={cn(
        sizeClasses[size],
        'text-muted-foreground hover:text-foreground transition-colors',
        className
      )}
      title="Copy"
    >
      {copied ? (
        <Check className={cn(iconSizes[size], 'text-green-600')} />
      ) : (
        <Copy className={iconSizes[size]} />
      )}
    </Button>
  );
}

interface CopyableTextProps {
  label: string;
  value: string | undefined | null;
  onClick?: () => void;
  className?: string;
}

/**
 * CopyableText - Text hiển thị với nút copy bên cạnh
 * 
 * @example
 * <CopyableText label="Email" value={customer.email} />
 * <CopyableText label="SĐT" value={customer.phone} onClick={() => window.open(`tel:${phone}`)} />
 */
export function CopyableText({ label, value, onClick, className }: CopyableTextProps) {
  if (!value) {
    return (
      <div className={cn('space-y-1', className)}>
        <dt className="text-sm text-muted-foreground">{label}</dt>
        <dd className="text-sm font-medium">—</dd>
      </div>
    );
  }

  return (
    <div className={cn('space-y-1', className)}>
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="flex items-center gap-1">
        <span 
          className={cn(
            'text-sm font-medium',
            onClick && 'text-primary hover:underline cursor-pointer'
          )}
          onClick={onClick}
        >
          {value}
        </span>
        <CopyButton value={value} size="xs" showToast toastMessage={`Đã copy ${label.toLowerCase()}`} />
      </dd>
    </div>
  );
}

export default CopyButton;
