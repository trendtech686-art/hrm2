import * as React from "react";
import { asBusinessId, type SystemId } from "@/lib/id-types";
import { useTaxStore } from "../taxes/store.ts";
import type { Tax } from "../taxes/types.ts";
import { TaxTable } from "./tax-table.tsx";
import { Button } from "../../../components/ui/button.tsx";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "../../../components/ui/dialog.tsx";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../../components/ui/alert-dialog.tsx";
import { Input } from "../../../components/ui/input.tsx";
import { Switch } from "../../../components/ui/switch.tsx";
import { Textarea } from "../../../components/ui/textarea.tsx";
import { toast } from 'sonner';
import { SettingsActionButton } from "../../../components/settings/SettingsActionButton.tsx";
import { PlusCircle, Percent } from "lucide-react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../../components/ui/form.tsx";
import { NumberInput } from "../../../components/ui/number-input.tsx";

interface TaxContentProps {
    isActive: boolean;
    onRegisterActions: (actions: React.ReactNode[]) => void;
}

type TaxFormValues = {
    id: string;
    name: string;
    rate: number;
    isDefaultSale: boolean;
    isDefaultPurchase: boolean;
    description?: string;
};

export function TaxContent({ isActive, onRegisterActions }: TaxContentProps) {
    const { data, add, update, remove, setDefaultSale, setDefaultPurchase } = useTaxStore();

    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [editingTax, setEditingTax] = React.useState<Tax | null>(null);
    const [isAlertOpen, setIsAlertOpen] = React.useState(false);
    const [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null);

    const form = useForm<TaxFormValues>({
        defaultValues: {
            id: '',
            name: '',
            rate: 0,
            isDefaultSale: false,
            isDefaultPurchase: false,
            description: '',
        },
    });

    // Register actions when tab is active
    React.useEffect(() => {
        if (isActive) {
            onRegisterActions([
                <SettingsActionButton key="add" onClick={() => handleAddNew()}>
                    <PlusCircle className="h-4 w-4" />
                    Thêm thuế
                </SettingsActionButton>
            ]);
        }
    }, [isActive, onRegisterActions]);

    const handleAddNew = () => {
        setEditingTax(null);
        form.reset({
            id: '',
            name: '',
            rate: 0,
            isDefaultSale: false,
            isDefaultPurchase: false,
            description: '',
        });
        setIsFormOpen(true);
    };
    
    const handleEdit = React.useCallback((tax: Tax) => {
        setEditingTax(tax);
        form.reset({
            id: tax.id,
            name: tax.name,
            rate: tax.rate,
            isDefaultSale: tax.isDefaultSale,
            isDefaultPurchase: tax.isDefaultPurchase,
            description: tax.description || '',
        });
        setIsFormOpen(true);
    }, [form]);
    
    const handleDeleteRequest = React.useCallback((systemId: SystemId) => {
        setIdToDelete(systemId);
        setIsAlertOpen(true);
    }, []);
    
    const confirmDelete = () => {
        if (idToDelete) {
            const tax = data.find(t => t.systemId === idToDelete);
            remove(idToDelete);
            toast.success(`Đã xóa thuế "${tax?.name}"`);
        }
        setIsAlertOpen(false);
        setIsFormOpen(false);
        setIdToDelete(null);
    };

    const handleFormSubmit = (values: TaxFormValues) => {
        if (editingTax) {
            update(editingTax.systemId, {
                id: asBusinessId(values.id.trim().toUpperCase()),
                name: values.name.trim(),
                rate: values.rate,
                isDefaultSale: values.isDefaultSale,
                isDefaultPurchase: values.isDefaultPurchase,
                description: values.description?.trim() || undefined,
            });
            toast.success(`Đã cập nhật thuế "${values.name}"`);
        } else {
            add({
                id: asBusinessId(values.id.trim().toUpperCase()),
                name: values.name.trim(),
                rate: values.rate,
                isDefaultSale: values.isDefaultSale,
                isDefaultPurchase: values.isDefaultPurchase,
                description: values.description?.trim() || undefined,
            });
            toast.success(`Đã thêm thuế "${values.name}"`);
        }
        setIsFormOpen(false);
    };
    
    const handleSetDefaultSale = React.useCallback((systemId: SystemId) => {
        const tax = data.find(t => t.systemId === systemId);
        setDefaultSale(systemId);
        if (tax) {
            toast.success(`Đã đặt "${tax.name}" làm thuế mặc định bán hàng`);
        }
    }, [data, setDefaultSale]);

    const handleSetDefaultPurchase = React.useCallback((systemId: SystemId) => {
        const tax = data.find(t => t.systemId === systemId);
        setDefaultPurchase(systemId);
        if (tax) {
            toast.success(`Đã đặt "${tax.name}" làm thuế mặc định nhập hàng`);
        }
    }, [data, setDefaultPurchase]);

    return (
        <>
            <p className="text-sm text-muted-foreground mb-4">
                Tất cả các loại thuế trong hệ thống (áp dụng cho cả nhập hàng và bán hàng)
            </p>
            <TaxTable
                data={data}
                allData={data}
                onEdit={handleEdit}
                onDelete={handleDeleteRequest}
                onSetDefaultSale={handleSetDefaultSale}
                onSetDefaultPurchase={handleSetDefaultPurchase}
            />

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingTax ? 'Cập nhật thuế' : 'Thêm thuế mới'}</DialogTitle>
                        <DialogDescription>
                            {editingTax ? 'Chỉnh sửa thông tin thuế' : 'Tạo loại thuế mới cho hệ thống'}
                        </DialogDescription>
                    </DialogHeader>
                    
                    <Form {...form}>
                        <form id="tax-form" onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="id"
                                    rules={{ required: 'Mã thuế là bắt buộc' }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mã thuế</FormLabel>
                                            <FormControl>
                                                <Input placeholder="VD: VAT10" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="rate"
                                    rules={{ required: 'Thuế suất là bắt buộc', min: { value: 0, message: 'Thuế suất phải >= 0' } }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Thuế suất (%)</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <NumberInput 
                                                        value={field.value} 
                                                        onChange={field.onChange}
                                                        min={0}
                                                        max={100}
                                                        className="pr-8"
                                                    />
                                                    <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            
                            <FormField
                                control={form.control}
                                name="name"
                                rules={{ required: 'Tên thuế là bắt buộc' }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tên thuế</FormLabel>
                                        <FormControl>
                                            <Input placeholder="VD: VAT 10%" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mô tả</FormLabel>
                                        <FormControl>
                                            <Textarea 
                                                placeholder="Mô tả về loại thuế này..." 
                                                className="resize-none"
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="isDefaultSale"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                        <div className="space-y-0.5">
                                            <FormLabel>Mặc định bán hàng</FormLabel>
                                            <FormDescription>
                                                Thuế này sẽ được tự động áp dụng cho đơn bán hàng mới
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="isDefaultPurchase"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                        <div className="space-y-0.5">
                                            <FormLabel>Mặc định nhập hàng</FormLabel>
                                            <FormDescription>
                                                Thuế này sẽ được tự động áp dụng cho đơn nhập hàng mới
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>

                    <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
                        {editingTax && (
                            <Button 
                                type="button" 
                                variant="destructive" 
                                onClick={() => handleDeleteRequest(editingTax.systemId)}
                                className="sm:mr-auto h-9"
                            >
                                Xóa
                            </Button>
                        )}
                        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} className="h-9">
                                Thoát
                            </Button>
                            <Button type="submit" form="tax-form" className="h-9">
                                Xác nhận
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Hành động này không thể được hoàn tác. Thuế đã xóa sẽ không còn áp dụng được cho các đơn hàng.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="h-9">Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="h-9">Xóa</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
