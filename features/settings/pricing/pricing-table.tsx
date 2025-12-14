import * as React from 'react';
import type { SystemId } from '@/lib/id-types';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { Badge } from '../../../components/ui/badge';
import { Switch } from '../../../components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import type { PricingPolicy } from './types';
import { toast } from 'sonner';

interface PricingTableProps {
  data: PricingPolicy[];
  allData: PricingPolicy[]; // All policies for finding fallback
  onEdit: (policy: PricingPolicy) => void;
  onDelete: (systemId: SystemId) => void;
  onSetDefault: (systemId: SystemId) => void;
  onToggleActive?: (policy: PricingPolicy, isActive: boolean) => void;
}

export function PricingTable({
  data,
  allData,
  onEdit,
  onDelete,
  onSetDefault,
  onToggleActive,
}: PricingTableProps) {
  
  const handleToggleDefault = React.useCallback((policy: PricingPolicy, checked: boolean) => {
    if (checked) {
      // Toggle ON: set this as default
      onSetDefault(policy.systemId);
    } else {
      // Toggle OFF: find another policy of same type to set as default
      const samePolicies = allData.filter(p => p.type === policy.type && p.systemId !== policy.systemId);
      if (samePolicies.length > 0) {
        // Set first available as default
        onSetDefault(samePolicies[0].systemId);
      } else {
        // No other policy, cannot turn off
        toast.error('Phải có ít nhất một chính sách giá mặc định');
      }
    }
  }, [allData, onSetDefault]);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã</TableHead>
            <TableHead>Tên</TableHead>
            <TableHead>Mô tả</TableHead>
            <TableHead>Loại giá</TableHead>
            <TableHead>Mặc định</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Chưa có dữ liệu
              </TableCell>
            </TableRow>
          ) : (
            data.map((policy) => (
              <TableRow key={policy.systemId}>
                <TableCell className="font-medium">{policy.id}</TableCell>
                <TableCell className="font-medium">{policy.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {policy.description || '—'}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={policy.type === 'Bán hàng' ? 'default' : 'secondary'}
                    className={policy.type === 'Bán hàng' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-blue-100 text-blue-700 hover:bg-blue-100'}
                  >
                    {policy.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Switch 
                    checked={policy.isDefault} 
                    onCheckedChange={(checked) => handleToggleDefault(policy, checked)}
                  />
                </TableCell>
                <TableCell>
                  <Switch 
                    checked={policy.isActive} 
                    onCheckedChange={(checked) => onToggleActive?.(policy, checked)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-9 w-9 p-0">
                        <span className="sr-only">Mở menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onEdit(policy)}>
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(policy.systemId)}
                        className="text-destructive"
                      >
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
