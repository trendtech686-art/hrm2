import * as React from 'react';
import { MoreHorizontal, Pencil, Trash2, Star } from 'lucide-react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import type { PricingPolicy } from './types';

interface PricingTableProps {
  data: PricingPolicy[];
  onEdit: (policy: PricingPolicy) => void;
  onDelete: (systemId: string) => void;
  onSetDefault: (systemId: string) => void;
}

export function PricingTable({
  data,
  onEdit,
  onDelete,
  onSetDefault,
}: PricingTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã</TableHead>
            <TableHead>Tên</TableHead>
            <TableHead>Mô tả</TableHead>
            <TableHead>Loại giá</TableHead>
            <TableHead>Chi tiết</TableHead>
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
                  <div className="flex items-center gap-2">
                    {policy.isDefault && (
                      <div className="flex items-center gap-1 font-semibold text-sm">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-yellow-600">MẶC ĐỊNH</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={policy.isActive ? 'default' : 'secondary'}>
                    {policy.isActive ? 'Hoạt động' : 'Tạm ngưng'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Mở menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onEdit(policy)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      {!policy.isDefault && (
                        <DropdownMenuItem onClick={() => onSetDefault(policy.systemId)}>
                          <Star className="mr-2 h-4 w-4" />
                          Đặt làm mặc định
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => onDelete(policy.systemId)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
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
