import * as React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import type { BusinessId, SystemId } from '@/lib/id-types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';

interface SettingsTableProps<T extends { systemId: SystemId; id: BusinessId; name: string; description?: string }> {
  data: T[];
  onEdit: (item: T) => void;
  onDelete: (systemId: SystemId) => void;
  renderExtraColumns?: (item: T) => React.ReactNode;
}

export function SettingsTable<T extends { systemId: SystemId; id: BusinessId; name: string; description?: string }>({
  data,
  onEdit,
  onDelete,
  renderExtraColumns,
}: SettingsTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
        <p className="text-sm text-muted-foreground">Chưa có dữ liệu</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Mã</TableHead>
            <TableHead>Tên</TableHead>
            <TableHead>Mô tả</TableHead>
            {renderExtraColumns && <TableHead>Thông tin</TableHead>}
            <TableHead className="w-[100px] text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.systemId}>
              <TableCell className="font-medium">{item.id}</TableCell>
              <TableCell className="font-semibold">{item.name}</TableCell>
              <TableCell className="text-muted-foreground">
                {item.description || '-'}
              </TableCell>
              {renderExtraColumns && (
                <TableCell>{renderExtraColumns(item)}</TableCell>
              )}
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit(item)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => onDelete(item.systemId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
