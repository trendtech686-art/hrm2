import * as React from 'react';
import type { InventoryCheck } from './types.ts';
import { Badge } from '../../components/ui/badge.tsx';
import { formatDateCustom } from '../../lib/date-utils.ts';

export function InventoryCheckCard({ item, onEdit, onBalance }: { item: InventoryCheck; onEdit?: (i: InventoryCheck) => void; onBalance?: (systemId: string) => void }) {
  const preview = item.items?.slice(0,2).map(i => i.productName).join(', ');
  return (
    <div className="p-4 bg-white rounded shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-medium">{item.id}</div>
          <div className="text-sm text-muted-foreground">{item.branchName} • {formatDateCustom(new Date(item.createdAt), 'dd/MM/yyyy')}</div>
        </div>
        <div>
          <Badge>{item.status === 'draft' ? 'Nháp' : item.status === 'balanced' ? 'Đã cân bằng' : 'Đã hủy'}</Badge>
        </div>
      </div>

      <div className="mt-2 text-sm text-muted-foreground">
        {preview}
        {item.items && item.items.length > 2 ? ` +${item.items.length - 2} khác` : ''}
      </div>

      <div className="mt-3 flex items-center gap-2">
        {onEdit && (
          <button className="btn btn-ghost text-sm" onClick={() => onEdit(item)}>Sửa</button>
        )}
        {onBalance && item.status === 'draft' && (
          <button className="btn btn-primary text-sm" onClick={() => onBalance(item.systemId)}>Cân bằng</button>
        )}
      </div>
    </div>
  );
}
