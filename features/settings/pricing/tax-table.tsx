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
import { Switch } from '../../../components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import type { Tax } from '../taxes/types';
import { toast } from 'sonner';

interface TaxTableProps {
  data: Tax[];
  allData: Tax[]; // All taxes for finding fallback
  onEdit: (tax: Tax) => void;
  onDelete: (systemId: SystemId) => void;
  onSetDefaultSale: (systemId: SystemId) => void;
  onSetDefaultPurchase: (systemId: SystemId) => void;
}

export function TaxTable({
  data,
  allData,
  onEdit,
  onDelete,
  onSetDefaultSale,
  onSetDefaultPurchase,
}: TaxTableProps) {
  
  const handleToggleDefaultSale = React.useCallback((tax: Tax, checked: boolean) => {
    if (checked) {
      // Toggle ON: set this as default
      onSetDefaultSale(tax.systemId);
    } else {
      // Toggle OFF: find another tax to set as default
      const otherTaxes = allData.filter(t => t.systemId !== tax.systemId);
      if (otherTaxes.length > 0) {
        // Set first available as default
        onSetDefaultSale(otherTaxes[0].systemId);
      } else {
        // No other tax, cannot turn off
        toast.error('Phải có ít nhất một thuế mặc định bán hàng');
      }
    }
  }, [allData, onSetDefaultSale]);

  const handleToggleDefaultPurchase = React.useCallback((tax: Tax, checked: boolean) => {
    if (checked) {
      // Toggle ON: set this as default
      onSetDefaultPurchase(tax.systemId);
    } else {
      // Toggle OFF: find another tax to set as default
      const otherTaxes = allData.filter(t => t.systemId !== tax.systemId);
      if (otherTaxes.length > 0) {
        // Set first available as default
        onSetDefaultPurchase(otherTaxes[0].systemId);
      } else {
        // No other tax, cannot turn off
        toast.error('Phải có ít nhất một thuế mặc định nhập hàng');
      }
    }
  }, [allData, onSetDefaultPurchase]);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã thuế</TableHead>
            <TableHead>Tên thuế</TableHead>
            <TableHead className="text-right">Thuế suất</TableHead>
            <TableHead>MĐ Bán hàng</TableHead>
            <TableHead>MĐ Nhập hàng</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Chưa có dữ liệu
              </TableCell>
            </TableRow>
          ) : (
            data.map((tax) => (
              <TableRow key={tax.systemId}>
                <TableCell className="font-medium">{tax.id}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{tax.name}</span>
                    {tax.description && (
                      <span className="text-xs text-muted-foreground">{tax.description}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">{tax.rate}%</TableCell>
                <TableCell>
                  <Switch 
                    checked={tax.isDefaultSale} 
                    onCheckedChange={(checked) => handleToggleDefaultSale(tax, checked)}
                  />
                </TableCell>
                <TableCell>
                  <Switch 
                    checked={tax.isDefaultPurchase} 
                    onCheckedChange={(checked) => handleToggleDefaultPurchase(tax, checked)}
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
                      <DropdownMenuItem onClick={() => onEdit(tax)}>
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(tax.systemId)}
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
