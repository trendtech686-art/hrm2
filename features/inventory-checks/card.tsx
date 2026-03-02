import * as React from 'react';
import type { InventoryCheck } from '@/lib/types/prisma-extended';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { formatDateCustom } from '../../lib/date-utils';

type CardProps = {
  item: InventoryCheck;
  onEdit?: (item: InventoryCheck) => void;
  onBalance?: (item: InventoryCheck) => void;
};

// Helper to normalize status for comparison (DB returns uppercase, app uses lowercase)
const normalizeStatus = (status?: string) => status?.toLowerCase() || '';

export function InventoryCheckCard({ item, onEdit, onBalance }: CardProps) {
  const preview = item.items?.slice(0,2).map(i => i.productName).join(', ');
  const status = normalizeStatus(item.status);
  const statusLabel = status === 'draft' ? 'Nháp' 
    : status === 'balanced' || status === 'completed' ? 'Đã cân bằng' 
    : status === 'in_progress' || status === 'pending' ? 'Đang xử lý'
    : status === 'cancelled' ? 'Đã hủy'
    : item.status;
  const statusVariant = status === 'draft' ? 'outline' 
    : status === 'balanced' || status === 'completed' ? 'secondary'
    : status === 'in_progress' || status === 'pending' ? 'default'
    : 'destructive';
  
  return (
    <div className="p-4 bg-white rounded shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-medium">{item.id}</div>
          <div className="text-body-sm text-muted-foreground">{item.branchName} • {item.createdAt ? formatDateCustom(new Date(item.createdAt), 'dd/MM/yyyy') : ''}</div>
        </div>
        <div>
          <Badge variant={statusVariant}>{statusLabel}</Badge>
        </div>
      </div>

      <div className="mt-2 text-body-sm text-muted-foreground">
        {preview}
        {item.items && item.items.length > 2 ? ` +${item.items.length - 2} khác` : ''}
      </div>

      <div className="mt-3 flex items-center gap-2">
        {onEdit && (
          <Button variant="outline" className="h-9" onClick={() => onEdit(item)}>
            Sửa
          </Button>
        )}
        {onBalance && status === 'draft' && (
          <Button className="h-9" onClick={() => onBalance(item)}>
            Cân bằng
          </Button>
        )}
      </div>
    </div>
  );
}
