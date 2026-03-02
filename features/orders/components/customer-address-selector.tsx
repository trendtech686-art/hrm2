import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { Plus, Edit2, MoreHorizontal } from 'lucide-react';
import { randomUUID } from 'crypto';
import type { Customer, CustomerAddress } from '../../customers/types';
import { asSystemId } from '@/lib/id-types';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group';
import { Switch } from '../../../components/ui/switch';
import { useCustomerMutations } from '../../customers/hooks/use-customers';
import { Badge } from '../../../components/ui/badge';
import { AddressBidirectionalConverter } from '../../customers/components/address-bidirectional-converter';
import { AddressFormDialog } from '../../customers/components/address-form-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '../../../components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../../components/ui/alert-dialog';
import { toast } from 'sonner';

interface CustomerAddressSelectorProps {
    customer: Customer | null;
    disabled?: boolean;
    dialogOpen?: boolean; // External control for dialog state
    onDialogOpenChange?: (open: boolean) => void; // External control callback
    hideCards?: boolean; // Hide the address cards (only show dialog when triggered)
    addressType?: 'shipping' | 'billing'; // Type of address to update (default: shipping)
    onOpenShippingDialog?: () => void; // Callback when shipping "Thay đổi" is clicked
    onOpenBillingDialog?: () => void; // Callback when billing "Thay đổi" is clicked
}

const formatAddress = (address: Partial<CustomerAddress>) => {
    const parts = [
        address.street,
        address.ward,
        address.district,
        address.province
    ].filter(Boolean);
    return parts.join(', ') || 'Chưa có địa chỉ';
};

export function CustomerAddressSelector({ 
    customer, 
    disabled, 
    dialogOpen, 
    onDialogOpenChange, 
    hideCards, 
    addressType = 'shipping',
    onOpenShippingDialog,
    onOpenBillingDialog
}: CustomerAddressSelectorProps) {
    const { setValue, watch } = useFormContext();
    const { update: updateCustomer } = useCustomerMutations({});
    
    // ✅ Watch customer from form - this updates when we setValue('customer', ...)
    const formCustomer = watch('customer') as Customer | null;
    
    // Use form customer if available, otherwise use prop
    const currentCustomer = formCustomer || customer;
    
    // Use external dialog state if provided, otherwise use internal state
    const [internalDialogOpen, setInternalDialogOpen] = React.useState(false);
    const [internalAddressType, setInternalAddressType] = React.useState<'shipping' | 'billing'>('shipping'); // Track internally when no external control
    const isDialogOpen = dialogOpen !== undefined ? dialogOpen : internalDialogOpen;
    const currentAddressType = dialogOpen !== undefined ? addressType : internalAddressType; // Use external or internal
    
    // Wrapper function to handle both external and internal state
    const setIsDialogOpen = React.useCallback((open: boolean | ((prev: boolean) => boolean)) => {
        const newOpen = typeof open === 'function' ? open(isDialogOpen) : open;
        if (onDialogOpenChange) {
            onDialogOpenChange(newOpen);
        } else {
            setInternalDialogOpen(newOpen);
        }
    }, [onDialogOpenChange, isDialogOpen]);
    
    const [_isAddingNew, setIsAddingNew] = React.useState(false);
    const [selectedAddressId, setSelectedAddressId] = React.useState<string>('');
    const [convertingAddress, setConvertingAddress] = React.useState<CustomerAddress | null>(null);
    const [isConverterOpen, setIsConverterOpen] = React.useState(false);
    const [editingAddress, setEditingAddress] = React.useState<CustomerAddress | null>(null);
    const [isAddressFormOpen, setIsAddressFormOpen] = React.useState(false);
    const [deletingAddressId, setDeletingAddressId] = React.useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

    // Memoize addresses to prevent new array reference on each render
    const addresses = React.useMemo(() => currentCustomer?.addresses || [], [currentCustomer?.addresses]);

    React.useEffect(() => {
        if (addresses.length > 0) {
            // Select appropriate default based on currentAddressType (not addressType prop)
            const defaultAddr = currentAddressType === 'shipping' 
                ? addresses.find(a => a.isDefaultShipping)
                : addresses.find(a => a.isDefaultBilling);
            
            if (defaultAddr) {
                setSelectedAddressId(defaultAddr.id);
            }
        }
    }, [currentCustomer, currentAddressType, addresses]);

    const _handleOpenDialog = () => {
        // If external callbacks provided, use them. Otherwise open dialog directly.
        setIsDialogOpen(true);
        setIsAddingNew(false);
        // Select appropriate default based on currentAddressType
        const defaultAddr = currentAddressType === 'shipping' 
            ? addresses.find(a => a.isDefaultShipping)
            : addresses.find(a => a.isDefaultBilling);
        
        if (defaultAddr) {
            setSelectedAddressId(defaultAddr.id);
        }
    };

    const handleOpenShippingDialog = () => {
        if (onOpenShippingDialog) {
            onOpenShippingDialog();
        } else {
            // Handle internally
            setInternalAddressType('shipping');
            const defaultAddr = addresses.find(a => a.isDefaultShipping);
            setSelectedAddressId(defaultAddr?.id || '');
            setIsDialogOpen(true);
        }
    };

    const handleOpenBillingDialog = () => {
        if (onOpenBillingDialog) {
            onOpenBillingDialog();
        } else {
            // Handle internally
            setInternalAddressType('billing');
            const defaultAddr = addresses.find(a => a.isDefaultBilling);
            setSelectedAddressId(defaultAddr?.id || '');
            setIsDialogOpen(true);
        }
    };

    const handleSelectAddress = (addressId: string) => {
        // ✅ Just update selected ID, don't update form yet (wait for "Xác nhận" button)
        setSelectedAddressId(addressId);
    };

    const handleConfirmAddress = () => {
        // ✅ Update form based on currentAddressType (not addressType prop)
        const selected = addresses.find(a => a.id === selectedAddressId);
        if (selected) {
            const fieldName = currentAddressType === 'shipping' ? 'shippingAddress' : 'billingAddress';
            //  // Removed
            setValue(fieldName, selected);
            setIsDialogOpen(false);
        }
    };

    const handleAddNew = () => {
        setEditingAddress(null);
        setIsAddingNew(false);
        setIsAddressFormOpen(true);
    };

    const handleSaveAddress = (addressData: Omit<CustomerAddress, 'id'>) => {
        if (!currentCustomer) return;
        
        let newAddresses: CustomerAddress[];
        let savedAddressId: string;

        if (editingAddress) {
            // Update existing
            savedAddressId = editingAddress.id;
            newAddresses = addresses.map(addr =>
                addr.id === editingAddress.id 
                    ? { ...addressData, id: addr.id, updatedAt: new Date().toISOString() } as CustomerAddress
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

        // Handle default shipping/billing
        if (addressData.isDefaultShipping) {
            newAddresses = newAddresses.map(addr => ({
                ...addr,
                isDefaultShipping: addr.id === savedAddressId
            }));
        }

        if (addressData.isDefaultBilling) {
            newAddresses = newAddresses.map(addr => ({
                ...addr,
                isDefaultBilling: addr.id === savedAddressId
            }));
        }

        updateCustomer.mutate({
            systemId: asSystemId(currentCustomer.systemId),
            addresses: newAddresses,
        });

        // Update form's customer object to reflect the changes
        const updatedCustomer = {
            ...currentCustomer,
            addresses: newAddresses,
        };
        setValue('customer', updatedCustomer);

        // ✅ Auto-select the new/edited address in the dialog
        setSelectedAddressId(savedAddressId);

        toast.success(editingAddress ? 'Đã cập nhật địa chỉ' : 'Đã thêm địa chỉ mới');
        
        // ❌ DON'T close dialog or update form - let user review and click "Xác nhận"
        // Close the address form dialog only
        setIsAddressFormOpen(false);
    };

    const handleConvertAddress = (address: CustomerAddress) => {
        setConvertingAddress(address);
        setIsConverterOpen(true);
    };

    const handleDeleteAddress = (addressId: string) => {
        setDeletingAddressId(addressId);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!currentCustomer || !deletingAddressId) return;

        const updatedAddresses = addresses.filter(a => a.id !== deletingAddressId);
        updateCustomer.mutate({
            systemId: asSystemId(currentCustomer.systemId),
            addresses: updatedAddresses,
        });

        // Update form's customer object
        const updatedCustomer = {
            ...currentCustomer,
            addresses: updatedAddresses,
        };
        setValue('customer', updatedCustomer);

        // If deleted address was selected, clear selection
        if (selectedAddressId === deletingAddressId) {
            setSelectedAddressId('');
            setValue('shippingAddress', null);
        }

        setIsDeleteDialogOpen(false);
        setDeletingAddressId(null);
    };

    const handleSetDefault = (addressId: string, type: 'shipping' | 'billing') => {
        if (!currentCustomer) return;

        const address = addresses.find(a => a.id === addressId);
        if (!address) return;

        const updatedAddresses = addresses.map(a => {
            if (type === 'shipping') {
                // Unset all other shipping defaults, set this one
                return {
                    ...a,
                    isDefaultShipping: a.id === addressId,
                };
            } else if (type === 'billing') {
                // Unset all other billing defaults, set this one
                return {
                    ...a,
                    isDefaultBilling: a.id === addressId,
                };
            }
            return a;
        });

        updateCustomer.mutate({
            systemId: asSystemId(currentCustomer.systemId),
            addresses: updatedAddresses,
        });

        // Update form's customer object
        const updatedCustomer = {
            ...currentCustomer,
            addresses: updatedAddresses,
        };
        setValue('customer', updatedCustomer);

        // ❌ DON'T update form shipping address here - wait for user to confirm
        // Only update if they click "Xác nhận" button
        toast.success(`Đã đặt làm mặc định ${type === 'shipping' ? 'giao hàng' : 'hóa đơn'}`);
    };

    const handleEditAddress = (address: CustomerAddress) => {
        setEditingAddress(address);
        setIsAddressFormOpen(true);
    };

    const handleConverterSuccess = (convertedAddress: CustomerAddress) => {
        if (!currentCustomer) return;

        // Add converted address as new address
        const newAddress: CustomerAddress = {
            ...convertedAddress,
            id: `addr_${randomUUID().slice(0, 12)}`,
            isDefaultShipping: false,
            isDefaultBilling: false,
        };

        const updatedAddresses = [...addresses, newAddress];
        updateCustomer.mutate({
            systemId: asSystemId(currentCustomer.systemId),
            addresses: updatedAddresses,
        });

        // Update form's customer object
        const updatedCustomer = {
            ...currentCustomer,
            addresses: updatedAddresses,
        };
        setValue('customer', updatedCustomer);

        // Optionally set as selected shipping address
        setValue('shippingAddress', newAddress);
        setSelectedAddressId(newAddress.id);
        
        setIsConverterOpen(false);
        setConvertingAddress(null);
    };

    if (!currentCustomer) return null;

    const defaultShippingAddr = addresses.find(a => a.isDefaultShipping);
    const defaultBillingAddr = addresses.find(a => a.isDefaultBilling);
    
    // ✅ Get currently selected addresses from form based on addressType
    const selectedShippingAddress = watch('shippingAddress') as CustomerAddress | undefined;
    const selectedBillingAddress = watch('billingAddress') as CustomerAddress | undefined;
    
    // Display selected address if available, otherwise show default
    const displayedShippingAddr = selectedShippingAddress || defaultShippingAddr;
    const displayedBillingAddr = selectedBillingAddress || defaultBillingAddr;

    // Determine dialog title and description based on currentAddressType
    const dialogTitle = currentAddressType === 'shipping' ? 'Chọn địa chỉ giao hàng' : 'Chọn địa chỉ nhận hóa đơn';
    const dialogDescription = currentAddressType === 'shipping' 
        ? 'Chọn một địa chỉ có sẵn hoặc thêm địa chỉ mới.'
        : 'Chọn địa chỉ để nhận hóa đơn hoặc thêm địa chỉ mới.';

    return (
        <>
            {/* Shipping Address Card */}
            {!hideCards && (
                <div className="space-y-2">
                    <div className="border border-border rounded-md p-2.5">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex-1 min-w-0">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Địa chỉ giao hàng</span>
                                <p className="text-sm truncate mt-0.5">
                                    {displayedShippingAddr ? formatAddress(displayedShippingAddr) : 'Chưa có địa chỉ'}
                                </p>
                            </div>
                            {!disabled && (
                                <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="h-7 px-2 text-xs text-primary" 
                                    type="button" 
                                    onClick={handleOpenShippingDialog}
                                >
                                    Thay đổi
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Billing Address Card */}
                    <div className="border border-border rounded-md p-2.5">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex-1 min-w-0">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Địa chỉ nhận hóa đơn</span>
                                <p className="text-sm truncate mt-0.5">
                                    {displayedBillingAddr ? formatAddress(displayedBillingAddr) : 'Chưa có địa chỉ'}
                                </p>
                            </div>
                            {!disabled && (
                                <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="h-7 px-2 text-xs text-primary" 
                                    type="button" 
                                    onClick={handleOpenBillingDialog}
                                >
                                    Thay đổi
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{dialogTitle}</DialogTitle>
                        <DialogDescription>
                            {dialogDescription}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="border border-border rounded-lg overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border bg-muted">
                                        <th className="h-11 px-3 text-left text-xs font-semibold text-foreground w-10"></th>
                                        <th className="h-11 px-3 text-left text-xs font-semibold text-foreground">Địa chỉ</th>
                                        <th className="h-11 px-3 text-center text-xs font-semibold text-foreground w-24">Giao hàng</th>
                                        <th className="h-11 px-3 text-center text-xs font-semibold text-foreground w-24">Hóa đơn</th>
                                        <th className="h-11 px-3 text-center text-xs font-semibold text-foreground w-20">Cấp</th>
                                        <th className="h-11 px-3 text-right text-xs font-semibold text-foreground w-12"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {addresses.map((address) => (
                                        <tr 
                                            key={`address-${address.id}`} 
                                            className={`border-b border-border last:border-0 hover:bg-accent cursor-pointer transition-colors ${selectedAddressId === address.id ? 'bg-accent' : ''}`}
                                            onClick={() => handleSelectAddress(address.id)}
                                        >
                                            <td className="p-3">
                                                <RadioGroup value={selectedAddressId} onValueChange={handleSelectAddress}>
                                                    <RadioGroupItem value={address.id} id={`addr-radio-${address.id}`} />
                                                </RadioGroup>
                                            </td>
                                            <td className="p-3">
                                                <label htmlFor={`addr-radio-${address.id}`} className="font-medium text-sm text-foreground cursor-pointer">
                                                    {formatAddress(address)}
                                                </label>
                                            </td>
                                            <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex justify-center">
                                                    <Switch
                                                        checked={address.isDefaultShipping}
                                                        onCheckedChange={() => handleSetDefault(address.id, 'shipping')}
                                                    />
                                                </div>
                                            </td>
                                            <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex justify-center">
                                                    <Switch
                                                        checked={address.isDefaultBilling}
                                                        onCheckedChange={() => handleSetDefault(address.id, 'billing')}
                                                    />
                                                </div>
                                            </td>
                                            <td className="p-3 text-center">
                                                <Badge 
                                                    variant={address.inputLevel === '3-level' ? 'secondary' : 'outline'} 
                                                    className="text-xs"
                                                >
                                                    {address.inputLevel === '3-level' ? '3 cấp' : '2 cấp'}
                                                </Badge>
                                            </td>
                                            <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Mở menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-45">
                                                        <DropdownMenuItem onClick={() => handleEditAddress(address)}>
                                                            Sửa
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleConvertAddress(address)}>
                                                            {address.inputLevel === '3-level' ? 'Chuyển sang 2 cấp' : 'Chuyển sang 3 cấp'}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem 
                                                            onClick={() => handleDeleteAddress(address.id)}
                                                            className="text-destructive focus:text-destructive"
                                                        >
                                                            Xóa
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={handleAddNew}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm địa chỉ mới
                        </Button>
                    </div>

                    <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">
                            Hủy
                        </Button>
                        {selectedAddressId && (
                            <Button 
                                variant="outline" 
                                onClick={() => {
                                    const address = addresses.find(a => a.id === selectedAddressId);
                                    if (address) {
                                        handleEditAddress(address);
                                    }
                                }}
                                className="w-full sm:w-auto"
                            >
                                <Edit2 className="h-4 w-4 mr-2" />
                                Thay đổi
                            </Button>
                        )}
                        <Button onClick={handleConfirmAddress} className="w-full sm:w-auto">
                            Xác nhận
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add/Edit Address Form Dialog */}
            <AddressFormDialog
                isOpen={isAddressFormOpen}
                onOpenChange={setIsAddressFormOpen}
                onSave={handleSaveAddress}
                editingAddress={editingAddress}
            />

            {/* Address Conversion Dialog */}
            {convertingAddress && (
                <AddressBidirectionalConverter
                    address={convertingAddress}
                    onSuccess={handleConverterSuccess}
                    open={isConverterOpen}
                    onOpenChange={setIsConverterOpen}
                />
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa địa chỉ</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa địa chỉ này? Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive hover:bg-destructive/90">
                            Xóa
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
