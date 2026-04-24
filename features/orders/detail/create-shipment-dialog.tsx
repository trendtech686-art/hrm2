'use client'

import * as React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { ShippingIntegration } from '../components/shipping-integration';
import { CustomerAddressSelector } from '../components/customer-address-selector';
import type { Order, Customer } from '@/lib/types/prisma-extended';
import type { OrderFormValues } from '../components/order-form-page';
import { logError } from '@/lib/logger'

interface CreateShipmentDialogProps {
    isOpen: boolean; 
    onOpenChange: (open: boolean) => void; 
    onSubmit: (data: Partial<OrderFormValues>, packagingSystemId?: string) => Promise<{ success: boolean; message?: string } | undefined>;
    order: Order | null;
    customer: Customer | null;
    packagingSystemId?: string;  // Specific packaging to create shipment for
}

export function CreateShipmentDialog({
    isOpen, onOpenChange, 
    onSubmit, 
    order,
    customer,
    packagingSystemId,
}: CreateShipmentDialogProps) {
    const [isLoading, setIsLoading] = React.useState(false);
    const [isAddressDialogOpen, setIsAddressDialogOpen] = React.useState(false);
    const form = useForm<OrderFormValues>();
    const { handleSubmit, reset } = form;

    React.useEffect(() => {
        if (isOpen && order && customer) {
            reset({
                customer: customer,
                lineItems: order.lineItems,
                grandTotal: order.grandTotal,
                payments: order.payments,
                branchSystemId: order.branchSystemId,
                deliveryMethod: 'shipping-partner',
            });
        }
    }, [isOpen, order, customer, reset]);

    const handleFormSubmit = async (data: Partial<OrderFormValues>) => {
        if (!order) return;
        setIsLoading(true);
        try {
            const result = await onSubmit(data, packagingSystemId);
            if (result && result.success) {
                toast.success('Tạo đơn vận chuyển thành công', { description: result.message || 'Đã đẩy đơn qua hãng vận chuyển' });
                onOpenChange(false);
            } else {
                toast.error('Không thể tạo đơn vận chuyển', { 
                    description: result?.message || 'Vui lòng kiểm tra lại thông tin và thử lại',
                    duration: 8000,
                });
            }
        } catch (error) {
            logError('[CreateShipmentDialog] Error', error);
            toast.error('Lỗi tạo đơn vận chuyển', { 
                description: error instanceof Error ? error.message : 'Có lỗi xảy ra, vui lòng thử lại',
                duration: 8000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent mobileFullScreen className="md:max-w-5xl! md:w-[85vw]! md:max-h-[90vh]! flex flex-col border-0 shadow-xl">
                <DialogHeader className="shrink-0">
                    <DialogTitle>Đẩy qua hãng vận chuyển</DialogTitle>
                    <DialogDescription>Cấu hình và tạo đơn vận chuyển qua đối tác.</DialogDescription>
                </DialogHeader>
                <FormProvider {...form}>
                    <form id="create-shipping-form-dialog" onSubmit={handleSubmit(handleFormSubmit)} className="grow overflow-hidden flex flex-col">
                        <div className="grow overflow-auto p-1">
                          <ShippingIntegration 
                            hideTabs 
                            onChangeDeliveryAddress={() => setIsAddressDialogOpen(true)}
                            customer={customer}
                          />
                        </div>
                         <DialogFooter className="mt-4 shrink-0">
                            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>Hủy</Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Spinner className="mr-2 h-4 w-4" />}
                                Tạo đơn vận chuyển
                            </Button>
                        </DialogFooter>
                    </form>

                    {/* Address selector dialog - inside FormProvider for useFormContext */}
                    {customer && (
                        <CustomerAddressSelector
                            customer={customer}
                            dialogOpen={isAddressDialogOpen}
                            onDialogOpenChange={setIsAddressDialogOpen}
                            hideCards={true}
                            addressType="shipping"
                        />
                    )}
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}
