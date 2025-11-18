import * as React from 'react';
import { useTaxStore } from './store.ts';
import { useTaxSettingsStore } from '../../settings/tax-settings-store.ts';
import { usePageHeader } from '../../../contexts/page-header-context.tsx';
import { TaxForm } from './form.tsx';
import type { Tax, TaxFormValues } from './types.ts';
import { Button } from '../../../components/ui/button.tsx';
import { Plus, Pencil, Trash2, Star, Settings } from 'lucide-react';
import { Badge } from '../../../components/ui/badge.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select.tsx';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table.tsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog.tsx';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../components/ui/alert-dialog.tsx';
import { toast } from 'sonner';

// TaxTable component for reusability
interface TaxTableProps {
  taxes: Tax[];
  onEdit: (tax: Tax) => void;
  onDelete: (tax: Tax) => void;
  onSetDefault: (tax: Tax) => void;
}

function TaxTable({ taxes, onEdit, onDelete, onSetDefault }: TaxTableProps) {
  if (taxes.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center text-muted-foreground">
        Chưa có thuế nào. Nhấn "Thêm thuế" để tạo mới.
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã thuế</TableHead>
            <TableHead>Tên thuế</TableHead>
            <TableHead>Thuế suất</TableHead>
            <TableHead>Mô tả</TableHead>
            <TableHead className="w-[150px]">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {taxes.map((tax) => (
            <TableRow key={tax.systemId}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{tax.id}</span>
                  {tax.isDefault && (
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  )}
                </div>
              </TableCell>
              <TableCell>{tax.name}</TableCell>
              <TableCell>{tax.rate}%</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {tax.description || '—'}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {!tax.isDefault && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onSetDefault(tax)}
                      title="Đặt làm mặc định"
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(tax)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(tax)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
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

export function TaxesPage() {
  const { data: taxes, add, update, remove, setDefault } = useTaxStore();
  const {
    priceIncludesTax,
    setPriceIncludesTax,
    defaultSaleTaxId,
    defaultPurchaseTaxId,
    setDefaultSaleTaxId,
    setDefaultPurchaseTaxId,
  } = useTaxSettingsStore();
  const [editingTax, setEditingTax] = React.useState<Tax | null>(null);
  const [deletingTax, setDeletingTax] = React.useState<Tax | null>(null);
  const [showDialog, setShowDialog] = React.useState(false);
  
  // State for default tax selection (local state before save)
  const [selectedSaleTaxId, setSelectedSaleTaxId] = React.useState<string>('');
  const [selectedPurchaseTaxId, setSelectedPurchaseTaxId] = React.useState<string>('');

  // Filter taxes by type
  const purchaseTaxes = taxes.filter((tax) => tax.type === 'purchase');
  const saleTaxes = taxes.filter((tax) => tax.type === 'sale');

  // Initialize selected defaults from settings
  React.useEffect(() => {
    if (defaultSaleTaxId) setSelectedSaleTaxId(defaultSaleTaxId);
    if (defaultPurchaseTaxId) setSelectedPurchaseTaxId(defaultPurchaseTaxId);
  }, [defaultSaleTaxId, defaultPurchaseTaxId]);

  const handleAdd = () => {
    setEditingTax(null);
    setShowDialog(true);
  };

  const handleEdit = (tax: Tax) => {
    setEditingTax(tax);
    setShowDialog(true);
  };

  // Page header with actions
  usePageHeader({
    actions: [
      <Button key="add" onClick={handleAdd}>
        <Plus className="mr-2 h-4 w-4" />
        Thêm thuế
      </Button>
    ]
  });

  const handleDelete = (tax: Tax) => {
    setDeletingTax(tax);
  };

  const confirmDelete = () => {
    if (deletingTax) {
      remove(deletingTax.systemId);
      toast.success('Đã xóa thuế', {
        description: `Thuế "${deletingTax.name}" đã được xóa`,
      });
      setDeletingTax(null);
    }
  };

  const handleSetDefault = (tax: Tax) => {
    setDefault(tax.systemId);
    toast.success('Đã đặt làm mặc định', {
      description: `Thuế "${tax.name}" là mặc định cho ${
        tax.type === 'purchase' ? 'nhập hàng' : 'bán hàng'
      }`,
    });
  };

  const handleSaveDefaults = () => {
    // Save to settings store
    if (selectedSaleTaxId) {
      setDefaultSaleTaxId(selectedSaleTaxId);
    }
    
    if (selectedPurchaseTaxId) {
      setDefaultPurchaseTaxId(selectedPurchaseTaxId);
    }
    
    toast.success('Đã lưu cài đặt', {
      description: 'Cài đặt thuế mặc định đã được cập nhật',
    });
  };

  const handleSubmit = (values: TaxFormValues) => {
    if (editingTax) {
      update(editingTax.systemId, values);
      toast.success('Đã cập nhật thuế', {
        description: `Thuế "${values.name}" đã được cập nhật`,
      });
    } else {
      const newTax = add(values);
      toast.success('Đã thêm thuế', {
        description: `Thuế "${values.name}" đã được thêm`,
      });
    }
    setShowDialog(false);
  };

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quản lý Thuế</h2>
          <p className="text-sm text-muted-foreground">
            Quản lý thuế nhập hàng và thuế bán hàng
          </p>
        </div>
      </div>

      {/* Thiết lập thuế sản phẩm mặc định */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Thiết lập thuế sản phẩm mặc định</CardTitle>
          <p className="text-sm text-muted-foreground">
            Áp dụng thuế sản phẩm mặc định khi thêm mới sản phẩm
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Thuế bán hàng mặc định */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Thuế bán hàng mặc định</label>
              <Select
                value={selectedSaleTaxId}
                onValueChange={(value) => setSelectedSaleTaxId(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn thuế mặc định" />
                </SelectTrigger>
                <SelectContent>
                  {taxes.map((tax) => (
                    <SelectItem key={tax.systemId} value={tax.systemId}>
                      {tax.name} ({tax.rate}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Thuế nhập hàng mặc định */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Thuế nhập hàng mặc định</label>
              <Select
                value={selectedPurchaseTaxId}
                onValueChange={(value) => setSelectedPurchaseTaxId(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn thuế mặc định" />
                </SelectTrigger>
                <SelectContent>
                  {taxes.map((tax) => (
                    <SelectItem key={tax.systemId} value={tax.systemId}>
                      {tax.name} ({tax.rate}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Cài đặt giá toàn hệ thống */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="font-medium text-sm">Thuế:</p>
                <div className="flex items-center gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={!priceIncludesTax}
                      onChange={() => setPriceIncludesTax(false)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Giá chưa bao gồm thuế</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={priceIncludesTax}
                      onChange={() => setPriceIncludesTax(true)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Giá đã bao gồm thuế</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  Hủy
                </Button>
                <Button onClick={handleSaveDefaults}>
                  Lưu
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quản lý thuế sản phẩm */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quản lý thuế sản phẩm</CardTitle>
          <p className="text-sm text-muted-foreground">
            Thiết lập các loại thuế phục vụ thuế đầu vào, đầu ra cho sản phẩm/dịch vụ.
          </p>
          <p className="text-sm text-red-600">
            <span className="font-medium">Lưu ý:</span> Bạn không thể sửa mức thuế suất mặc định hoặc đang áp dụng trong sản phẩm
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Button onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm mức thuế suất
            </Button>
          </div>

          {/* Table with combined data */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên</TableHead>
                  <TableHead>Mã</TableHead>
                  <TableHead>Thuế suất</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {taxes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      Chưa có thuế nào. Nhấn "Thêm mức thuế suất" để tạo mới.
                    </TableCell>
                  </TableRow>
                ) : (
                  taxes.map((tax) => (
                    <TableRow key={tax.systemId}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{tax.name}</span>
                          {(defaultSaleTaxId === tax.systemId ||
                            defaultPurchaseTaxId === tax.systemId) && (
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{tax.id}</TableCell>
                      <TableCell>{tax.rate}%</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(tax)}
                            className="h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(tax)}
                            className="h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Thêm thông tin thuế
            </DialogTitle>
          </DialogHeader>
          <TaxForm
            initialData={editingTax}
            onSubmit={handleSubmit}
            onCancel={() => setShowDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deletingTax}
        onOpenChange={(open) => !open && setDeletingTax(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa thuế "{deletingTax?.name}" không? Hành động
              này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
