import * as React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Users2, PlusCircle, X } from 'lucide-react';
import type { Customer } from '../../customers/types.ts';
import { useCustomerStore } from '../../customers/store.ts';
import { useOrderStore } from '../store.ts';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card.tsx';
import { Button } from '../../../components/ui/button.tsx';
import { Separator } from '../../../components/ui/separator.tsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog.tsx';
import { VirtualizedCombobox, type ComboboxOption } from '../../../components/ui/virtualized-combobox.tsx';
import { CustomerForm, type CustomerFormValues } from '../../customers/customer-form.tsx';
import { CustomerAddressSelector } from './customer-address-selector.tsx';

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '0';
    return new Intl.NumberFormat('vi-VN').format(value);
};

const formatAddress = (street?: string, ward?: string, province?: string) => {
    return [street, ward, province].filter(Boolean).join(', ');
};

export function CustomerSelector({ disabled }: { disabled: boolean }) {
    const { control, setValue } = useFormContext();
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const { data: allCustomers, add: addCustomer, searchCustomers } = useCustomerStore();
    const { data: allOrders } = useOrderStore();

    // ✅ PHASE 2: Convert watch to useWatch
    const selectedCustomer = useWatch({ control, name: 'customer' });

    // ✅ Convert customers to options for VirtualizedCombobox
    const customerOptions: ComboboxOption[] = React.useMemo(() => {
        return allCustomers.map(c => {
            const defaultAddress = c.addresses?.[0];
            return {
                value: c.systemId,
                label: c.name,
                metadata: {
                    phone: c.phone,
                    address: defaultAddress ? formatAddress(defaultAddress.street, defaultAddress.ward, defaultAddress.province) : '',
                    debt: c.currentDebt,
                    totalSpent: c.totalSpent
                }
            };
        });
    }, [allCustomers]);

    const handleSelect = (option: ComboboxOption | null) => {
        if (option) {
            const fullCustomer = allCustomers.find(c => c.systemId === option.value);
            // console.log('🔍 [Customer Selector] Selected customer:', fullCustomer); // Removed to prevent circular reference error
            setValue('customer', fullCustomer || null, { shouldValidate: true, shouldDirty: true });
            
            // ✅ Auto-load default addresses when selecting customer
            if (fullCustomer?.addresses) {
                // console.log('🔍 [Customer Selector] Customer addresses:', fullCustomer.addresses); // Removed
                const defaultShipping = fullCustomer.addresses.find(a => a.isDefaultShipping);
                const defaultBilling = fullCustomer.addresses.find(a => a.isDefaultBilling);
                
                // console.log('🔍 [Customer Selector] Default shipping:', defaultShipping); // Removed
                // console.log('🔍 [Customer Selector] Default billing:', defaultBilling); // Removed
                
                if (defaultShipping) {
                    // console.log('✅ [Customer Selector] Setting shippingAddress:', defaultShipping); // Removed
                    setValue('shippingAddress', defaultShipping, { shouldDirty: true });
                }
                if (defaultBilling) {
                    // console.log('✅ [Customer Selector] Setting billingAddress:', defaultBilling); // Removed
                    setValue('billingAddress', defaultBilling, { shouldDirty: true });
                }
            } else {
                console.warn('⚠️ [Customer Selector] Customer has no addresses array');
            }
        } else {
            setValue('customer', null, { shouldValidate: true, shouldDirty: true });
            setValue('shippingAddress', null);
            setValue('billingAddress', null);
        }
    };
    const handleFormSubmit = (values: CustomerFormValues) => { 
        addCustomer(values as Omit<Customer, 'systemId'>); 
        setIsFormOpen(false); 
    };

    return (
        // FIX: Wrapped component in a React.Fragment to resolve a TypeScript error related to JSX element types when using dialogs and other components together.
        <React.Fragment>
            <Card className="flex flex-col h-[385px]">
                <CardHeader className="flex-shrink-0"><CardTitle className="text-base font-semibold">Thông tin khách hàng</CardTitle></CardHeader>
                <CardContent className="flex-1 overflow-y-auto space-y-4">
                    {selectedCustomer ? (
                         <div className="space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <a className="font-semibold text-primary hover:underline cursor-pointer">{selectedCustomer.name}</a>
                                        {!disabled && <Button variant="ghost" size="icon" className="h-6 w-6" type="button" onClick={() => handleSelect(null)}><X className="h-4 w-4 text-muted-foreground" /></Button>}
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">SĐT: {selectedCustomer.phone}</p>
                                </div>
                                <div className="border rounded-md p-2 text-sm w-64 flex-shrink-0 bg-muted/50 space-y-1">
                                    <div className="flex justify-between items-center"><span className="text-muted-foreground">Nợ phải thu</span> <span className="font-semibold text-destructive">{formatCurrency(selectedCustomer.currentDebt)}</span></div>
                                    <div className="flex justify-between items-center"><span className="text-muted-foreground">Tổng chi tiêu ({selectedCustomer.totalOrders || 0} đơn)</span> <span className="font-semibold text-primary">{formatCurrency(selectedCustomer.totalSpent)}</span></div>
                                </div>
                            </div>
                            <Separator />
                            <CustomerAddressSelector customer={selectedCustomer} disabled={disabled} />
                        </div>
                    ) : (
                        <>
                            <VirtualizedCombobox
                              options={customerOptions}
                              value={null}
                              onChange={(option) => handleSelect(option)}
                              placeholder="Tìm theo tên, SĐT, mã khách hàng... (F4)"
                              searchPlaceholder="Tìm kiếm..."
                              emptyPlaceholder="Không tìm thấy."
                              disabled={disabled}
                              renderHeader={() => (
                                <div className="p-1 border-b">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    className="w-full justify-start text-primary"
                                    onClick={() => setIsFormOpen(true)}
                                  >
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Thêm mới khách hàng
                                  </Button>
                                </div>
                              )}
                              renderOption={(option) => (
                                <div className="flex items-center justify-between gap-2 py-1">
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium truncate">{option.label}</div>
                                    <div className="text-xs text-muted-foreground truncate">
                                      {option.metadata?.phone} • {option.metadata?.address || 'Chưa có địa chỉ'}
                                    </div>
                                  </div>
                                  {option.metadata?.debt > 0 && (
                                    <div className="text-xs text-destructive font-semibold flex-shrink-0">
                                      Nợ: {formatCurrency(option.metadata.debt)}
                                    </div>
                                  )}
                                </div>
                              )}
                            />
                            <div className="text-center text-muted-foreground py-6"><Users2 className="mx-auto h-8 w-8 text-gray-300" /><p className="mt-2 text-sm">Chưa có thông tin khách hàng</p></div>
                        </>
                    )}
                </CardContent>
            </Card>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}><DialogContent className="sm:max-w-3xl"><DialogHeader><DialogTitle>Thêm khách hàng mới</DialogTitle></DialogHeader><CustomerForm initialData={null} onSubmit={handleFormSubmit} onCancel={() => setIsFormOpen(false)} /></DialogContent></Dialog>
        </React.Fragment>
    );
}
