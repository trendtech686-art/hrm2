'use client'

import * as React from "react";
import { useRouter } from 'next/navigation';
import { PlusCircle } from "lucide-react";
import { useSettingsPageHeader } from "../use-settings-page-header";
import { useTabActionRegistry } from "../use-tab-action-registry";
import { SettingsVerticalTabs } from "../../../components/settings/SettingsVerticalTabs";
import { SettingsHistoryContent } from "../../../components/settings/SettingsHistoryContent";
import { SettingsActionButton } from "../../../components/settings/SettingsActionButton";
import { TabsContent } from "../../../components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../../components/ui/alert-dialog";
import { Button } from "../../../components/ui/button";
import { Tabs, TabsContent as InnerTabsContent } from "../../../components/ui/tabs";
import { MobileTabsList, MobileTabsTrigger } from "../../../components/layout/page-section";
import { toast } from 'sonner';
import { asBusinessId, type SystemId } from "@/lib/id-types";
import type { PricingPolicy } from '@/lib/types/prisma-extended';
import type { Tax } from "../taxes/types";
import { usePricingPolicyMutations } from "./hooks/use-pricing";
import { useAllPricingPolicies } from "./hooks/use-all-pricing-policies";
import { useTaxMutations, useAllTaxes } from "../taxes/hooks/use-taxes";
import { PricingPolicyForm, type PricingPolicyFormValues } from "./form";
import { PricingTable } from "./pricing-table";
import { TaxTable } from "./tax-table";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { Switch } from "../../../components/ui/switch";
import { Textarea } from "../../../components/ui/textarea";
import { NumberInput } from "../../../components/ui/number-input";
import { Percent } from "lucide-react";
import { useAuth } from '@/contexts/auth-context';

type TaxFormValues = {
    id: string;
    name: string;
    rate: number;
    isDefaultSale: boolean;
    isDefaultPurchase: boolean;
    description?: string;
};

const TABS = [
    { value: 'pricing-policy', label: 'Chính sách giá' },
    { value: 'tax', label: 'Thuế' },
];

export function PricingSettingsPage() {
    const router = useRouter();
    const { can, isLoading: authLoading } = useAuth();
    const canEditSettings = can('edit_settings');
    React.useEffect(() => {
      if (!authLoading && !canEditSettings) {
        toast.error('Bạn không có quyền truy cập cài đặt giá');
        router.replace('/products');
      }
    }, [authLoading, canEditSettings, router]);

    const [activeTab, setActiveTab] = React.useState('pricing-policy');
    const { headerActions, registerActions } = useTabActionRegistry(activeTab);
    
    // ========== SHARED DIALOG STATE (at page level like customers page) ==========
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [editingItem, setEditingItem] = React.useState<PricingPolicy | Tax | null>(null);
    const [deleteDialog, setDeleteDialog] = React.useState<{ isOpen: boolean; item: PricingPolicy | Tax | null }>({ isOpen: false, item: null });
    
    // Inner tab for pricing policies
    const [innerTab, setInnerTab] = React.useState('all');
    
    // ========== QUERIES ==========
    const { data: pricingData } = useAllPricingPolicies();
    
    const { data: allTaxData } = useAllTaxes();
    const taxData = React.useMemo(() => allTaxData ?? [], [allTaxData]);
    
    // ========== MUTATIONS ==========
    const pricingMutations = usePricingPolicyMutations({
        onSuccess: () => {},
        onError: (err) => toast.error(err.message)
    });
    
    const taxMutations = useTaxMutations({
        onSuccess: () => {},
        onError: (err) => toast.error(err.message)
    });
    
    // ========== TAX FORM ==========
    const taxForm = useForm<TaxFormValues>({
        defaultValues: {
            id: '',
            name: '',
            rate: 0,
            isDefaultSale: false,
            isDefaultPurchase: false,
            description: '',
        },
    });
    
    // ========== HANDLERS (defined at page level with useCallback) ==========
    const handleAdd = React.useCallback(() => {
        setEditingItem(null);
        setDialogOpen(true);
    }, []);
    
    const handleEditPricing = React.useCallback((policy: PricingPolicy) => {
        setEditingItem(policy);
        setDialogOpen(true);
    }, []);
    
    const handleEditTax = React.useCallback((tax: Tax) => {
        setEditingItem(tax);
        taxForm.reset({
            id: tax.id,
            name: tax.name,
            rate: tax.rate,
            isDefaultSale: tax.isDefaultSale,
            isDefaultPurchase: tax.isDefaultPurchase,
            description: tax.description || '',
        });
        setDialogOpen(true);
    }, [taxForm]);
    
    const handleDeleteRequest = React.useCallback((item: PricingPolicy | Tax) => {
        setDeleteDialog({ isOpen: true, item });
    }, []);
    
    // ========== REGISTER TAB ACTIONS (like customers page) ==========
    const regPricing = React.useMemo(() => registerActions('pricing-policy'), [registerActions]);
    const regTax = React.useMemo(() => registerActions('tax'), [registerActions]);
    
    React.useEffect(() => {
        if (activeTab === 'pricing-policy') {
            regPricing([
                <SettingsActionButton key="add-pricing" onClick={handleAdd}>
                    <PlusCircle className="h-4 w-4" />
                    Tạo chính sách giá
                </SettingsActionButton>
            ]);
        }
    }, [activeTab, handleAdd, regPricing]);
    
    React.useEffect(() => {
        if (activeTab === 'tax') {
            regTax([
                <SettingsActionButton key="add-tax" onClick={handleAdd}>
                    <PlusCircle className="h-4 w-4" />
                    Thêm thuế
                </SettingsActionButton>
            ]);
        }
    }, [activeTab, handleAdd, regTax]);
    
    useSettingsPageHeader({
        title: 'Giá & Thuế',
        subtitle: 'Quản lý chính sách giá và các loại thuế',
        actions: headerActions,
    });
    
    // ========== PRICING POLICY HANDLERS ==========
    const handlePricingSubmit = (values: PricingPolicyFormValues) => {
        const normalized = {
            id: asBusinessId(values.id.trim().toUpperCase()),
            name: values.name.trim(),
            description: values.description?.trim() ?? '',
            type: values.type,
            isActive: values.isActive,
            isDefault: values.isDefault,
        };
        
        if (editingItem) {
            pricingMutations.update.mutate({ systemId: (editingItem as PricingPolicy).systemId, data: normalized }, {
                onSuccess: () => {
                    toast.success(`Đã cập nhật chính sách giá "${normalized.name}"`);
                    setDialogOpen(false);
                },
                onError: (err) => toast.error(err.message)
            });
        } else {
            pricingMutations.create.mutate(normalized, {
                onSuccess: () => {
                    toast.success(`Đã thêm chính sách giá "${normalized.name}"`);
                    setDialogOpen(false);
                },
                onError: (err) => toast.error(err.message)
            });
        }
    };
    
    const handleSetDefault = React.useCallback((systemId: SystemId) => {
        const policy = pricingData.find(p => p.systemId === systemId);
        pricingMutations.setDefault.mutate(systemId, {
            onSuccess: () => policy && toast.success(`Đã đặt "${policy.name}" làm giá mặc định`),
            onError: (err) => toast.error(err.message)
        });
    }, [pricingData, pricingMutations]);
    
    const handleTogglePricingActive = React.useCallback((policy: PricingPolicy, isActive: boolean) => {
        pricingMutations.update.mutate({ systemId: policy.systemId, data: { ...policy, isActive } }, {
            onSuccess: () => toast.success(isActive ? `Đã kích hoạt "${policy.name}"` : `Đã tắt "${policy.name}"`),
            onError: (err) => toast.error(err.message)
        });
    }, [pricingMutations]);
    
    // ========== TAX HANDLERS ==========
    const handleTaxSubmit = (values: TaxFormValues) => {
        const payload = {
            id: asBusinessId(values.id.trim().toUpperCase()),
            name: values.name.trim(),
            rate: values.rate,
            isDefaultSale: values.isDefaultSale,
            isDefaultPurchase: values.isDefaultPurchase,
            description: values.description?.trim() || undefined,
        };
        
        if (editingItem) {
            taxMutations.update.mutate({ systemId: (editingItem as Tax).systemId, data: payload }, {
                onSuccess: () => {
                    toast.success(`Đã cập nhật thuế "${values.name}"`);
                    setDialogOpen(false);
                },
                onError: (err) => toast.error(err.message)
            });
        } else {
            taxMutations.create.mutate(payload, {
                onSuccess: () => {
                    toast.success(`Đã thêm thuế "${values.name}"`);
                    setDialogOpen(false);
                },
                onError: (err) => toast.error(err.message)
            });
        }
    };
    
    const handleSetDefaultSale = React.useCallback((systemId: SystemId) => {
        const tax = taxData.find(t => t.systemId === systemId);
        taxMutations.setDefaultSale.mutate(systemId, {
            onSuccess: () => tax && toast.success(`Đã đặt "${tax.name}" làm thuế mặc định bán hàng`),
            onError: (err) => toast.error(err.message)
        });
    }, [taxData, taxMutations]);
    
    const handleSetDefaultPurchase = React.useCallback((systemId: SystemId) => {
        const tax = taxData.find(t => t.systemId === systemId);
        taxMutations.setDefaultPurchase.mutate(systemId, {
            onSuccess: () => tax && toast.success(`Đã đặt "${tax.name}" làm thuế mặc định nhập hàng`),
            onError: (err) => toast.error(err.message)
        });
    }, [taxData, taxMutations]);

    const handleSetDefaultExcelExport = React.useCallback((systemId: SystemId) => {
        const tax = taxData.find(t => t.systemId === systemId);
        taxMutations.setDefaultExcelExport.mutate(systemId, {
            onSuccess: () => tax && toast.success(`Đã đặt "${tax.name}" làm thuế mặc định xuất Excel`),
            onError: (err) => toast.error(err.message)
        });
    }, [taxData, taxMutations]);
    
    // ========== DELETE CONFIRM ==========
    const confirmDelete = () => {
        if (!deleteDialog.item) return;
        
        if (activeTab === 'pricing-policy') {
            pricingMutations.remove.mutate((deleteDialog.item as PricingPolicy).systemId, {
                onSuccess: () => toast.success(`Đã xóa chính sách giá "${deleteDialog.item?.name}"`),
                onError: (err) => toast.error(err.message)
            });
        } else {
            taxMutations.remove.mutate((deleteDialog.item as Tax).systemId, {
                onSuccess: () => toast.success(`Đã xóa thuế "${deleteDialog.item?.name}"`),
                onError: (err) => toast.error(err.message)
            });
        }
        setDeleteDialog({ isOpen: false, item: null });
    };
    
    // ========== PRICING DATA FILTERED ==========
    const sellingPolicies = React.useMemo(() => pricingData.filter(p => p.type === 'Bán hàng'), [pricingData]);
    const purchasingPolicies = React.useMemo(() => pricingData.filter(p => p.type === 'Nhập hàng'), [pricingData]);
    
    return (
        <div className="space-y-6">
            <SettingsVerticalTabs value={activeTab} onValueChange={setActiveTab} tabs={TABS}>
                <TabsContent value="pricing-policy" className="mt-0">
                    <Card>
                        <CardHeader>
                            <CardTitle>Chính sách giá</CardTitle>
                            <CardDescription>
                                Quản lý các loại giá áp dụng cho việc bán hàng và nhập hàng
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs value={innerTab} onValueChange={setInnerTab} className="w-full">
                                <MobileTabsList>
                                    <MobileTabsTrigger value="selling">Bán hàng</MobileTabsTrigger>
                                    <MobileTabsTrigger value="purchasing">Nhập hàng</MobileTabsTrigger>
                                    <MobileTabsTrigger value="all">Tất cả</MobileTabsTrigger>
                                </MobileTabsList>
                                <InnerTabsContent value="selling" className="space-y-4">
                                    <p className="text-sm text-muted-foreground">
                                        Các chính sách giá áp dụng cho việc bán hàng
                                    </p>
                                    <PricingTable
                                        data={sellingPolicies}
                                        allData={pricingData}
                                        onEdit={handleEditPricing}
                                        onDelete={(systemId) => handleDeleteRequest(pricingData.find(p => p.systemId === systemId)!)}
                                        onSetDefault={handleSetDefault}
                                        onToggleActive={handleTogglePricingActive}
                                    />
                                </InnerTabsContent>
                                <InnerTabsContent value="purchasing" className="space-y-4">
                                    <p className="text-sm text-muted-foreground">
                                        Các chính sách giá áp dụng cho việc nhập hàng
                                    </p>
                                    <PricingTable
                                        data={purchasingPolicies}
                                        allData={pricingData}
                                        onEdit={handleEditPricing}
                                        onDelete={(systemId) => handleDeleteRequest(pricingData.find(p => p.systemId === systemId)!)}
                                        onSetDefault={handleSetDefault}
                                        onToggleActive={handleTogglePricingActive}
                                    />
                                </InnerTabsContent>
                                <InnerTabsContent value="all" className="space-y-4">
                                    <p className="text-sm text-muted-foreground">
                                        Tất cả các chính sách giá trong hệ thống
                                    </p>
                                    <PricingTable
                                        data={pricingData}
                                        allData={pricingData}
                                        onEdit={handleEditPricing}
                                        onDelete={(systemId) => handleDeleteRequest(pricingData.find(p => p.systemId === systemId)!)}
                                        onSetDefault={handleSetDefault}
                                        onToggleActive={handleTogglePricingActive}
                                    />
                                </InnerTabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="tax" className="mt-0">
                    <Card>
                        <CardHeader>
                            <CardTitle>Thuế</CardTitle>
                            <CardDescription>
                                Quản lý các loại thuế áp dụng cho nhập hàng và bán hàng (VAT, thuế GTGT...)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Tất cả các loại thuế trong hệ thống (áp dụng cho cả nhập hàng và bán hàng)
                            </p>
                            <TaxTable
                                data={taxData}
                                allData={taxData}
                                onEdit={handleEditTax}
                                onDelete={(systemId) => handleDeleteRequest(taxData.find(t => t.systemId === systemId)!)}
                                onSetDefaultSale={handleSetDefaultSale}
                                onSetDefaultPurchase={handleSetDefaultPurchase}
                                onSetDefaultExcelExport={handleSetDefaultExcelExport}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </SettingsVerticalTabs>

            <SettingsHistoryContent entityTypes={['promotion', 'tax', 'pricing_policy']} />

            {/* Pricing Policy Dialog */}
            {activeTab === 'pricing-policy' && (
                <Dialog open={dialogOpen} onOpenChange={(open) => {
                    setDialogOpen(open);
                    if (!open) setEditingItem(null);
                }}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingItem ? 'Cập nhật chính sách giá' : 'Thêm chính sách giá'}</DialogTitle>
                        </DialogHeader>
                        <React.Fragment key={editingItem?.systemId || 'new-pricing'}>
                            <PricingPolicyForm 
                                initialData={editingItem as PricingPolicy | null} 
                                onSubmit={handlePricingSubmit} 
                            />
                        </React.Fragment>
                        <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
                            {editingItem && (
                                <Button 
                                    type="button" 
                                    variant="destructive" 
                                    onClick={() => handleDeleteRequest(editingItem)}
                                    className="sm:mr-auto"
                                >
                                    Xóa
                                </Button>
                            )}
                            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                                    Thoát
                                </Button>
                                <Button type="submit" form="pricing-policy-form">
                                    Xác nhận
                                </Button>
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Tax Dialog */}
            {activeTab === 'tax' && (
                <Dialog open={dialogOpen} onOpenChange={(open) => {
                    setDialogOpen(open);
                    if (!open) {
                        setEditingItem(null);
                        taxForm.reset({
                            id: '',
                            name: '',
                            rate: 0,
                            isDefaultSale: false,
                            isDefaultPurchase: false,
                            description: '',
                        });
                    }
                }}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingItem ? 'Cập nhật thuế' : 'Thêm thuế mới'}</DialogTitle>
                        </DialogHeader>
                        
                        <Form {...taxForm} key={editingItem?.systemId || 'new-tax'}>
                            <form id="tax-form" onSubmit={taxForm.handleSubmit(handleTaxSubmit)} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={taxForm.control}
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
                                        control={taxForm.control}
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
                                    control={taxForm.control}
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
                                    control={taxForm.control}
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
                                    control={taxForm.control}
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
                                    control={taxForm.control}
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
                            {editingItem && (
                                <Button 
                                    type="button" 
                                    variant="destructive" 
                                    onClick={() => handleDeleteRequest(editingItem)}
                                    className="sm:mr-auto"
                                >
                                    Xóa
                                </Button>
                            )}
                            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                                    Thoát
                                </Button>
                                <Button type="submit" form="tax-form">
                                    Xác nhận
                                </Button>
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialog.isOpen} onOpenChange={(o) => setDeleteDialog(p => ({ isOpen: o, item: o ? p.item : null }))}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn sắp xóa "{deleteDialog.item?.name}". Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="h-9" onClick={() => setDeleteDialog({ isOpen: false, item: null })}>Hủy</AlertDialogCancel>
                        <AlertDialogAction className="h-9" onClick={confirmDelete}>Xóa</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
