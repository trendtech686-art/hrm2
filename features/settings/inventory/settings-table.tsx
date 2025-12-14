import * as React from 'react';
import { MoreHorizontal } from 'lucide-react';
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
import { Switch } from '../../../components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';

interface SettingsTableProps<T extends { 
  systemId: SystemId; 
  id: BusinessId; 
  name: string; 
  description?: string | undefined;
  isDefault?: boolean | undefined;
  isActive?: boolean | undefined;
}> {
  data: T[];
  onEdit: (item: T) => void;
  onDelete: (systemId: SystemId) => void;
  onToggleDefault?: (item: T) => void;
  onToggleActive?: (item: T) => void;
  renderExtraColumns?: (item: T) => React.ReactNode;
}

export function SettingsTable<T extends { 
  systemId: SystemId; 
  id: BusinessId; 
  name: string; 
  description?: string | undefined;
  isDefault?: boolean | undefined;
  isActive?: boolean | undefined;
}>({
  data,
  onEdit,
  onDelete,
  onToggleDefault,
  onToggleActive,
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
            <TableHead>Tên</TableHead>
            <TableHead>Mô tả</TableHead>
            {onToggleDefault && <TableHead className="w-[100px]">Mặc định</TableHead>}
            {onToggleActive && <TableHead className="w-[100px]">Hoạt động</TableHead>}
            {renderExtraColumns && <TableHead>Thông tin</TableHead>}
            <TableHead className="w-[100px] text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.systemId}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.name}</span>
                  {item.isDefault && !onToggleDefault && <Badge variant="outline">Mặc định</Badge>}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {item.description || '—'}
              </TableCell>
              {onToggleDefault && (
                <TableCell>
                  <Switch
                    checked={item.isDefault ?? false}
                    onCheckedChange={() => onToggleDefault(item)}
                    aria-label="Đặt làm mặc định"
                  />
                </TableCell>
              )}
              {onToggleActive && (
                <TableCell>
                  <Switch
                    checked={item.isActive !== false}
                    onCheckedChange={() => onToggleActive(item)}
                    aria-label="Bật/tắt hoạt động"
                  />
                </TableCell>
              )}
              {renderExtraColumns && (
                <TableCell>{renderExtraColumns(item)}</TableCell>
              )}
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onEdit(item)}>
                      Sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => onDelete(item.systemId)}
                    >
                      Xóa
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
