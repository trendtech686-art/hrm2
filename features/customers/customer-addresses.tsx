import * as React from 'react';
import { Button } from '../../components/ui/button.tsx';
import { Card, CardContent } from '../../components/ui/card.tsx';
import { Badge } from '../../components/ui/badge.tsx';
import { MapPin, Plus, Edit, Trash2, Check, ArrowLeftRight, X, MoreHorizontal, Eye } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu.tsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog.tsx';
import { toast } from 'sonner';
import { cn } from '../../lib/utils.ts';
import { AddressBidirectionalConverter } from './components/address-bidirectional-converter.tsx';
import { AddressFormDialog } from './components/address-form-dialog.tsx';
import type { EnhancedCustomerAddress } from './types/enhanced-address.ts';

// Use EnhancedCustomerAddress as CustomerAddress
export type CustomerAddress = EnhancedCustomerAddress;

interface CustomerAddressesProps {
  addresses: CustomerAddress[];
  onUpdate: (addresses: CustomerAddress[]) => void;
}

export function CustomerAddresses({ addresses = [], onUpdate }: CustomerAddressesProps) {
  console.log('[CustomerAddresses] Render with addresses:', addresses);
  
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isConverterOpen, setIsConverterOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [deletingAddress, setDeletingAddress] = React.useState<CustomerAddress | null>(null);
  const [convertingAddress, setConvertingAddress] = React.useState<CustomerAddress | null>(null);
  const [editingAddress, setEditingAddress] = React.useState<CustomerAddress | null>(null);

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
    console.log('[CustomerAddresses] handleSave called:', {
      addressData,
      editingAddress,
      currentAddresses: addresses,
    });

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
      console.log('[CustomerAddresses] Created new address:', newAddress);
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

    // If setting as default billing, unset other billing defaults
    if (addressData.isDefaultBilling) {
      newAddresses = newAddresses.map(addr => {
        if (addr.id !== savedAddressId) {
          return { ...addr, isDefaultBilling: false };
        }
        return addr;
      });
    }

    console.log('[CustomerAddresses] Calling onUpdate with:', newAddresses);
    onUpdate(newAddresses);
    
    const types: string[] = [];
    if (addressData.isDefaultShipping) types.push('Mặc định giao hàng');
    if (addressData.isDefaultBilling) types.push('Mặc định hóa đơn');
    
    toast.success(
      editingAddress ? 'Đã cập nhật địa chỉ' : 'Đã thêm địa chỉ mới',
      { description: types.length > 0 ? `${types.join(', ')}` : undefined }
    );
  };

  const handleDelete = (id: string) => {
    const address = addresses.find(addr => addr.id === id);
    if (!address) return;

    setDeletingAddress(address);
    setIsDeleteDialogOpen(true);
  };

  const handleSetDefault = (id: string, type: 'shipping' | 'billing') => {
    const address = addresses.find(addr => addr.id === id);
    if (!address) return;

    const updatedAddresses = addresses.map(addr => {
      if (type === 'shipping') {
        // Unset all other shipping defaults, set this one
        return {
          ...addr,
          isDefaultShipping: addr.id === id,
        };
      } else if (type === 'billing') {
        // Unset all other billing defaults, set this one
        return {
          ...addr,
          isDefaultBilling: addr.id === id,
        };
      }
      return addr;
    });
    
    onUpdate(updatedAddresses);
    
    const typeLabel = type === 'shipping' ? 'giao hàng' : 'hóa đơn';
    toast.success(`Đã đặt làm địa chỉ mặc định ${typeLabel}`);
  };

  const confirmDelete = () => {
    if (!deletingAddress) return;

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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Danh sách địa chỉ</h3>
        <Button onClick={handleAddNew} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Thêm địa chỉ
        </Button>
      </div>

      {addresses.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Chưa có địa chỉ nào. Nhấn "Thêm địa chỉ" để tạo mới.
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-muted/50">
                <TableHead className="w-[150px]">Tên địa chỉ</TableHead>
                <TableHead className="w-[200px]">Địa chỉ</TableHead>
                <TableHead className="w-[120px]">Tỉnh/TP</TableHead>
                <TableHead className="w-[120px]">Quận/Huyện</TableHead>
                <TableHead className="w-[120px]">Phường/Xã</TableHead>
                <TableHead className="w-[80px]">Loại</TableHead>
                <TableHead className="w-[120px]">Liên hệ</TableHead>
                <TableHead className="w-[110px]">SĐT</TableHead>
                <TableHead className="w-[80px] text-center">MĐ GH</TableHead>
                <TableHead className="w-[80px] text-center">MĐ HĐ</TableHead>
                <TableHead className="w-[60px] text-center">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {addresses.map((address) => (
                <TableRow 
                  key={address.id} 
                  className={cn(
                    "cursor-pointer transition-colors hover:bg-muted/50",
                    (address.isDefaultShipping || address.isDefaultBilling) ? 'bg-primary/5 hover:bg-primary/10' : ''
                  )}
                  onClick={() => handleEdit(address)}
                >
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-sm">{address.label}</span>
                      {address.notes && (
                        <span className="text-xs text-muted-foreground italic line-clamp-1">
                          {address.notes}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{address.street}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{address.province}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{address.district || '-'}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{address.ward || '-'}</span>
                  </TableCell>
                  <TableCell>
                    {address.inputLevel === '2-level' ? (
                      <Badge variant="secondary" className="text-xs">2 cấp</Badge>
                    ) : (
                      <Badge variant="default" className="text-xs bg-green-600">3 cấp</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{address.contactName || '-'}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{address.contactPhone || '-'}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    {address.isDefaultShipping ? (
                      <Check className="h-4 w-4 text-green-600 inline-block" />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {address.isDefaultBilling ? (
                      <Check className="h-4 w-4 text-green-600 inline-block" />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Mở menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[220px]">
                        <DropdownMenuItem onClick={() => handleEdit(address)}>
                          Sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSetDefault(address.id, 'shipping')}>
                          {address.isDefaultShipping ? '✓ Mặc định giao hàng' : 'Đặt làm mặc định giao hàng'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSetDefault(address.id, 'billing')}>
                          {address.isDefaultBilling ? '✓ Mặc định hóa đơn' : 'Đặt làm mặc định hóa đơn'}
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <AddressFormDialog
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
                <p className="font-medium text-sm">{deletingAddress.label}</p>
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
