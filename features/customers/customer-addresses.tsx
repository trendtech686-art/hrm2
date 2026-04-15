import * as React from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Switch } from '../../components/ui/switch';
import { Checkbox } from '../../components/ui/checkbox';
import { MapPin as _MapPin, Plus, Edit as _Edit, Trash2, Check as _Check, ArrowLeftRight as _ArrowLeftRight, X as _X, MoreHorizontal, Eye as _Eye } from 'lucide-react';
import { DataTablePagination } from '../../components/data-table/data-table-pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { toast } from 'sonner';
import { cn as _cn } from '../../lib/utils';
import { AddressBidirectionalConverter } from './components/address-bidirectional-converter';
import { AddressFormDialog } from './components/address-form-dialog';
import type { EnhancedCustomerAddress } from './types/enhanced-address';

// Use EnhancedCustomerAddress as CustomerAddress
export type CustomerAddress = EnhancedCustomerAddress;

interface CustomerAddressesProps {
  addresses: CustomerAddress[];
  onUpdate?: (addresses: CustomerAddress[]) => void;
  readonly?: boolean;
}

export function CustomerAddresses({ addresses = [], onUpdate, readonly = false }: CustomerAddressesProps) {
  
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isConverterOpen, setIsConverterOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [deletingAddress, setDeletingAddress] = React.useState<CustomerAddress | null>(null);
  const [convertingAddress, setConvertingAddress] = React.useState<CustomerAddress | null>(null);
  const [editingAddress, setEditingAddress] = React.useState<CustomerAddress | null>(null);
  
  // Pagination
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20);
  const totalPages = Math.ceil(addresses.length / pageSize);
  const paginatedAddresses = addresses.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
  
  // Checkbox selection
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const allSelected = paginatedAddresses.length > 0 && paginatedAddresses.every(addr => selectedIds.has(addr.id));
  const someSelected = paginatedAddresses.some(addr => selectedIds.has(addr.id));

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newIds = new Set(selectedIds);
      paginatedAddresses.forEach(addr => newIds.add(addr.id));
      setSelectedIds(newIds);
    } else {
      const newIds = new Set(selectedIds);
      paginatedAddresses.forEach(addr => newIds.delete(addr.id));
      setSelectedIds(newIds);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newIds = new Set(selectedIds);
    if (checked) {
      newIds.add(id);
    } else {
      newIds.delete(id);
    }
    setSelectedIds(newIds);
  };
  
  const handleDeleteSelected = () => {
    if (selectedIds.size === 0 || !onUpdate) return;
    const newAddresses = addresses.filter(addr => !selectedIds.has(addr.id));
    onUpdate(newAddresses);
    setSelectedIds(new Set());
    toast.success(`Đã xóa ${selectedIds.size} địa chỉ`);
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (address: CustomerAddress) => {
    setEditingAddress(address);
    setIsDialogOpen(true);
  };

  const handleConvert = (address: CustomerAddress) => {
    setConvertingAddress(address);
    setIsConverterOpen(true);
  };

  const handleConverterSave = (convertedAddress: Partial<CustomerAddress>) => {
    if (!onUpdate) return;
    // Add converted address to list
    const newAddress: CustomerAddress = {
      ...convertedAddress,
      id: crypto.randomUUID(),
      isDefaultShipping: false,
      isDefaultBilling: false,
    } as CustomerAddress;
    
    onUpdate([...addresses, newAddress]);
    setIsConverterOpen(false);
    setConvertingAddress(null);
    toast.success('Đã thêm địa chỉ đã chuyển đổi');
  };

  const handleSave = (addressData: Omit<CustomerAddress, 'id'>) => {

    let newAddresses: CustomerAddress[];
    let savedAddressId: string;

    if (editingAddress) {
      // Update existing
      savedAddressId = editingAddress.id;
      newAddresses = addresses.map(addr =>
        addr.id === editingAddress.id 
          ? { 
              ...addressData, 
              id: addr.id,
            } as CustomerAddress 
          : addr
      );
    } else {
      // Add new
      savedAddressId = crypto.randomUUID();
      const newAddress: CustomerAddress = {
        ...addressData,
        id: savedAddressId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      newAddresses = [...addresses, newAddress];
    }

    // If setting as default shipping, unset other shipping defaults
    if (addressData.isDefaultShipping) {
      newAddresses = newAddresses.map(addr => {
        if (addr.id !== savedAddressId) {
          return { ...addr, isDefaultShipping: false };
        }
        return addr;
      });
    }

    onUpdate?.(newAddresses);
    
    toast.success(
      editingAddress ? 'Đã cập nhật địa chỉ' : 'Đã thêm địa chỉ mới',
      { description: addressData.isDefaultShipping ? 'Mặc định giao hàng' : undefined }
    );
  };

  const handleDelete = (id: string) => {
    const address = addresses.find(addr => addr.id === id);
    if (!address) return;

    setDeletingAddress(address);
    setIsDeleteDialogOpen(true);
  };

  const handleSetDefault = (id: string, type: 'shipping') => {
    const address = addresses.find(addr => addr.id === id);
    if (!address) return;

    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefaultShipping: addr.id === id,
    }));
    
    onUpdate?.(updatedAddresses);
    
    toast.success('Đã đặt làm địa chỉ mặc định giao hàng');
  };

  const confirmDelete = () => {
    if (!deletingAddress || !onUpdate) return;

    const newAddresses = addresses.filter(addr => addr.id !== deletingAddress.id);
    onUpdate(newAddresses);
    toast.success('Đã xóa địa chỉ');
    setIsDeleteDialogOpen(false);
    setDeletingAddress(null);
  };

  const formatFullAddress = (addr: CustomerAddress) => {
    const parts = [addr.street, addr.ward, addr.district, addr.province].filter(Boolean);
    return parts.join(', ');
  };

  return (
    <div className="space-y-4 p-4 rounded-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">Quản lý địa chỉ</h3>
          {!readonly && selectedIds.size > 0 && (
            <Button 
              type="button" 
              variant="destructive" 
              size="sm"
              onClick={handleDeleteSelected}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa {selectedIds.size} địa chỉ
            </Button>
          )}
        </div>
        {!readonly && (
          <Button type="button" onClick={handleAddNew} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Thêm địa chỉ
          </Button>
        )}
      </div>

      {addresses.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Chưa có địa chỉ nào. Nhấn "Thêm địa chỉ" để tạo mới.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          <div className="rounded-md border border-border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {!readonly && (
                    <TableHead className="w-10">
                      <Checkbox 
                        checked={allSelected}
                        onCheckedChange={handleSelectAll}
                        aria-label="Chọn tất cả"
                        className={someSelected && !allSelected ? 'opacity-50' : ''}
                      />
                    </TableHead>
                  )}
                  <TableHead>Địa chỉ</TableHead>
                  <TableHead>Tỉnh/TP</TableHead>
                  <TableHead>Quận/Huyện</TableHead>
                  <TableHead>Phường/Xã</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Liên hệ</TableHead>
                  <TableHead>SĐT</TableHead>
                  <TableHead className="text-center">MĐ GH</TableHead>
                  {!readonly && <TableHead className="w-12"></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAddresses.map((address) => (
                <TableRow 
                  key={address.id} 
                  className={readonly ? "" : "cursor-pointer"}
                  onClick={readonly ? undefined : () => handleEdit(address)}
                >
                  {!readonly && (
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox 
                        checked={selectedIds.has(address.id)}
                        onCheckedChange={(checked) => handleSelectOne(address.id, !!checked)}
                        aria-label={`Chọn địa chỉ ${address.street}`}
                      />
                    </TableCell>
                  )}
                  <TableCell className="font-medium">{address.street}</TableCell>
                  <TableCell>{address.province}</TableCell>
                  <TableCell>{address.district || '—'}</TableCell>
                  <TableCell>{address.ward || '—'}</TableCell>
                  <TableCell>
                    <Badge variant={address.inputLevel === '2-level' ? 'secondary' : 'default'}>
                      {address.inputLevel === '2-level' ? '2 cấp' : '3 cấp'}
                    </Badge>
                  </TableCell>
                  <TableCell>{address.contactName || '—'}</TableCell>
                  <TableCell>{address.contactPhone || '—'}</TableCell>
                  <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                    <Switch 
                      checked={address.isDefaultShipping} 
                      onCheckedChange={readonly ? undefined : () => handleSetDefault(address.id, 'shipping')}
                      disabled={readonly}
                    />
                  </TableCell>
                  {!readonly && (
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Mở menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(address)}>
                            Sửa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleConvert(address)}>
                            {address.inputLevel === '2-level' ? 'Chuyển sang 3 cấp' : 'Chuyển sang 2 cấp'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDelete(address.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
          
          <div className="border-t border-border px-6 py-3">
            <DataTablePagination
              pageIndex={pageIndex}
              pageSize={pageSize}
              pageCount={totalPages}
              setPageIndex={setPageIndex}
              setPageSize={(size) => { setPageSize(size); setPageIndex(0); }}
              canPreviousPage={pageIndex > 0}
              canNextPage={pageIndex < totalPages - 1}
              rowCount={addresses.length}
              selectedRowCount={selectedIds.size}
            />
          </div>
        </div>
      )}

      {/* Add/Edit Dialog - key forces re-mount when editingAddress changes */}
      <AddressFormDialog
        key={editingAddress?.id || 'new'}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSave}
        editingAddress={editingAddress}
      />

      {/* Address Converter Dialog */}
      {convertingAddress && (
        <AddressBidirectionalConverter
          address={convertingAddress}
          onSuccess={handleConverterSave}
          open={isConverterOpen}
          onOpenChange={setIsConverterOpen}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa địa chỉ</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa địa chỉ này?
            </DialogDescription>
          </DialogHeader>
          {deletingAddress && (
            <div className="py-4 space-y-2">
              <div className="p-3 bg-muted rounded-md">
                <p className="font-medium text-sm">{deletingAddress.street}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatFullAddress(deletingAddress)}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Hành động này không thể hoàn tác.
              </p>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Hủy
            </Button>
            <Button 
              variant="destructive"
              onClick={confirmDelete}
              className="w-full sm:w-auto"
            >
              Xóa địa chỉ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
