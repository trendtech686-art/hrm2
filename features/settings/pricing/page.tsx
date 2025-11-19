import * as React from "react";
import { asBusinessId, asSystemId, type SystemId } from "@/lib/id-types";
import { usePageHeader } from "../../../contexts/page-header-context.tsx";
import { usePricingPolicyStore } from "./store.ts";
import type { PricingPolicy } from "./types.ts";
import { PricingPolicyForm, type PricingPolicyFormValues } from "./form.tsx";
import { PricingTable } from "./pricing-table.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../../components/ui/card.tsx";
import { Button } from "../../../components/ui/button.tsx";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog.tsx";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../../components/ui/alert-dialog.tsx";
import { Label } from "../../../components/ui/label.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs.tsx";
import { useToast } from "../../../hooks/use-toast.ts";

export function PricingSettingsPage() {
    const { data, add, update, remove, setDefault } = usePricingPolicyStore();
    const { toast } = useToast();

    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [editingPolicy, setEditingPolicy] = React.useState<PricingPolicy | null>(null);
    const [isAlertOpen, setIsAlertOpen] = React.useState(false);
    const [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null);

    // State and logic for default price settings
    const sellingPolicies = React.useMemo(() => data.filter(p => p.type === 'Bán hàng'), [data]);
    const purchasingPolicies = React.useMemo(() => data.filter(p => p.type === 'Nhập hàng'), [data]);
    const [selectedDefaultSelling, setSelectedDefaultSelling] = React.useState<SystemId | undefined>();
    const [selectedDefaultPurchasing, setSelectedDefaultPurchasing] = React.useState<SystemId | undefined>();

    usePageHeader({
        actions: [
            <Button key="add" onClick={() => setIsFormOpen(true)} className="h-9">
                <PlusCircle className="mr-2 h-4 w-4" />
                Tạo chính sách giá
            </Button>
        ]
    });

    const setDefaultState = React.useCallback(() => {
        const defaultSelling = data.find(p => p.type === 'Bán hàng' && p.isDefault);
        const defaultPurchasing = data.find(p => p.type === 'Nhập hàng' && p.isDefault);
        setSelectedDefaultSelling(defaultSelling?.systemId);
        setSelectedDefaultPurchasing(defaultPurchasing?.systemId);
    }, [data]);

    React.useEffect(() => {
        setDefaultState();
    }, [setDefaultState]);

    const handleSaveDefaults = () => {
        const currentDefaultSelling = data.find(p => p.type === 'Bán hàng' && p.isDefault);
        const currentDefaultPurchasing = data.find(p => p.type === 'Nhập hàng' && p.isDefault);
        
        let updated = false;
        
        if (selectedDefaultSelling && selectedDefaultSelling !== currentDefaultSelling?.systemId) {
            setDefault(selectedDefaultSelling);
            updated = true;
        }

        if (selectedDefaultPurchasing && selectedDefaultPurchasing !== currentDefaultPurchasing?.systemId) {
            setDefault(selectedDefaultPurchasing);
            updated = true;
        }
        
        if (updated) {
            toast({
                title: 'Thành công',
                description: 'Đã cập nhật giá mặc định',
            });
        }
    };

    const handleCancelDefaults = () => {
        setDefaultState();
        toast({
            description: 'Đã hủy thay đổi',
        });
    };
    
    const handleAddNew = () => {
        setEditingPolicy(null);
        setIsFormOpen(true);
    };
    const handleEdit = React.useCallback((policy: PricingPolicy) => {
        setEditingPolicy(policy);
        setIsFormOpen(true);
    }, []);
    const handleDeleteRequest = React.useCallback((systemId: SystemId) => {
        setIdToDelete(systemId);
        setIsAlertOpen(true);
    }, []);
    const confirmDelete = () => {
        if (idToDelete) {
            const policy = data.find(p => p.systemId === idToDelete);
            remove(idToDelete);
            toast({
                title: 'Đã xóa',
                description: `Đã xóa chính sách giá "${policy?.name}"`,
            });
        }
        setIsAlertOpen(false);
        setIsFormOpen(false); // Close edit form if deleting from it
        setIdToDelete(null);
    };

    const handleFormSubmit = (values: PricingPolicyFormValues) => {
        const normalized = {
            id: asBusinessId(values.id.trim().toUpperCase()),
            name: values.name.trim(),
            description: values.description?.trim() || undefined,
            type: values.type,
            isActive: values.isActive,
            isDefault: values.isDefault,
        } satisfies Omit<PricingPolicy, 'systemId'>;

        if (editingPolicy) {
            update(editingPolicy.systemId, {
                ...editingPolicy,
                ...normalized,
            });
            toast({
                title: 'Thành công',
                description: `Đã cập nhật chính sách giá "${normalized.name}"`,
            });
        } else {
            add(normalized);
            toast({
                title: 'Thành công',
                description: `Đã thêm chính sách giá "${normalized.name}"`,
            });
        }
        setIsFormOpen(false);
    };
    
    const handleSetDefault = React.useCallback((systemId: SystemId) => {
        const policy = data.find(p => p.systemId === systemId);
        setDefault(systemId);
        if (policy) {
            toast({
                title: 'Thành công',
                description: `Đã đặt "${policy.name}" làm giá mặc định`,
            });
        }
    }, [data, setDefault, toast]);
    
    const activePolicies = React.useMemo(() => data.filter(p => p.isActive), [data]);
    const inactivePolicies = React.useMemo(() => data.filter(p => !p.isActive), [data]);
    const sellingPoliciesForTab = React.useMemo(() => activePolicies.filter(p => p.type === 'Bán hàng'), [activePolicies]);
    const purchasingPoliciesForTab = React.useMemo(() => activePolicies.filter(p => p.type === 'Nhập hàng'), [activePolicies]);

    return (
        <>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Giá mặc định</CardTitle>
                        <CardDescription>Chọn giá bán và giá nhập sẽ được áp dụng mặc định trên toàn hệ thống.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Giá bán hàng mặc định</Label>
                                <Select
                                    value={selectedDefaultSelling}
                                    onValueChange={(value) => setSelectedDefaultSelling(asSystemId(value))}
                                >
                                    <SelectTrigger className="h-9"><SelectValue placeholder="Chọn giá bán mặc định" /></SelectTrigger>
                                    <SelectContent>{sellingPolicies.map(p => <SelectItem key={p.systemId} value={p.systemId}>{p.name}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Giá nhập hàng mặc định</Label>
                                <Select
                                    value={selectedDefaultPurchasing}
                                    onValueChange={(value) => setSelectedDefaultPurchasing(asSystemId(value))}
                                >
                                    <SelectTrigger className="h-9"><SelectValue placeholder="Chọn giá nhập mặc định" /></SelectTrigger>
                                    <SelectContent>{purchasingPolicies.map(p => <SelectItem key={p.systemId} value={p.systemId}>{p.name}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="justify-end gap-2">
                        <Button variant="outline" onClick={handleCancelDefaults} className="h-9">Hủy</Button>
                        <Button onClick={handleSaveDefaults} className="h-9">Lưu</Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Danh sách chính sách giá</CardTitle>
                        <CardDescription>Quản lý các loại giá áp dụng cho việc bán hàng và nhập hàng.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="all" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="selling">Bán hàng</TabsTrigger>
                                <TabsTrigger value="purchasing">Nhập hàng</TabsTrigger>
                                <TabsTrigger value="all">Tất cả</TabsTrigger>
                            </TabsList>
                            <TabsContent value="selling" className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    Các chính sách giá áp dụng cho việc bán hàng
                                </p>
                                <PricingTable
                                    data={sellingPoliciesForTab}
                                    onEdit={handleEdit}
                                    onDelete={handleDeleteRequest}
                                    onSetDefault={handleSetDefault}
                                />
                            </TabsContent>
                            <TabsContent value="purchasing" className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    Các chính sách giá áp dụng cho việc nhập hàng
                                </p>
                                <PricingTable
                                    data={purchasingPoliciesForTab}
                                    onEdit={handleEdit}
                                    onDelete={handleDeleteRequest}
                                    onSetDefault={handleSetDefault}
                                />
                            </TabsContent>
                            <TabsContent value="all" className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    Tất cả các chính sách giá trong hệ thống
                                </p>
                                <PricingTable
                                    data={activePolicies}
                                    onEdit={handleEdit}
                                    onDelete={handleDeleteRequest}
                                    onSetDefault={handleSetDefault}
                                />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>


            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingPolicy ? 'Cập nhật chính sách giá' : 'Thêm chính sách giá'}</DialogTitle>
                    </DialogHeader>
                    {/* FIX: Wrapped component in a React.Fragment to move the `key` prop, resolving an error where `key` was incorrectly checked against the component's props. */}
                    <React.Fragment key={editingPolicy?.systemId || 'new'}>
                      <PricingPolicyForm initialData={editingPolicy} onSubmit={handleFormSubmit} />
                    </React.Fragment>

                    <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
                        {editingPolicy && (
                            <Button 
                                type="button" 
                                variant="destructive" 
                                onClick={() => handleDeleteRequest(editingPolicy.systemId)}
                                className="sm:mr-auto h-9"
                            >
                                Xóa
                            </Button>
                        )}
                        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} className="h-9">
                                Thoát
                            </Button>
                            <Button type="submit" form="pricing-policy-form" className="h-9">
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
                        <AlertDialogDescription>Hành động này không thể được hoàn tác.</AlertDialogDescription>
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
