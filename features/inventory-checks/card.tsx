import * as React from 'react';
import type { InventoryCheck } from './types.ts';
import { Badge } from '../../components/ui/badge.tsx';
import { Button } from '../../components/ui/button.tsx';
import { formatDateCustom } from '../../lib/date-utils.ts';

type CardProps = {
  item: InventoryCheck;
  onEdit?: (item: InventoryCheck) => void;
  onBalance?: (item: InventoryCheck) => void;
};

export function InventoryCheckCard({ item, onEdit, onBalance }: CardProps) {
  const preview = item.items?.slice(0,2).map(i => i.productName).join(', ');
  return (
    <div className="p-4 bg-white rounded shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-medium">{item.id}</div>
          <div className="text-body-sm text-muted-foreground">{item.branchName} • {formatDateCustom(new Date(item.createdAt), 'dd/MM/yyyy')}</div>
        </div>
        <div>
          <Badge>{item.status === 'draft' ? 'Nháp' : item.status === 'balanced' ? 'Đã cân bằng' : 'Đã hủy'}</Badge>
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
        {onBalance && item.status === 'draft' && (
          <Button className="h-9" onClick={() => onBalance(item)}>
            Cân bằng
          </Button>
        )}
      </div>
    </div>
  );
}
