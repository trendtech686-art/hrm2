import * as React from "react";
import { asBusinessId, type SystemId } from "@/lib/id-types";
import { usePricingPolicies, usePricingPolicyMutations } from "./hooks/use-pricing";
import type { PricingPolicy } from '@/lib/types/prisma-extended';
import { PricingPolicyForm, type PricingPolicyFormValues } from "./form";
import { PricingTable } from "./pricing-table";
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../../components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { toast } from 'sonner';
import { SettingsActionButton } from "../../../components/settings/SettingsActionButton";
import { PlusCircle } from "lucide-react";
import { logError } from '@/lib/logger'

interface PricingPolicyContentProps {
    isActive: boolean;
    onRegisterActions: (actions: React.ReactNode[]) => void;
}

export function PricingPolicyContent({ isActive, onRegisterActions }: PricingPolicyContentProps) {
    const { data: queryData } = usePricingPolicies({ limit: 100 });
    const data = React.useMemo(() => queryData?.data ?? [], [queryData?.data]);
    
    
    const { create, update, remove, setDefault } = usePricingPolicyMutations({
        onSuccess: () => {},
        onError: (err) => toast.error(err.message)
    });

    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [editingPolicy, setEditingPolicy] = React.useState<PricingPolicy | null>(null);
    const [isAlertOpen, setIsAlertOpen] = React.useState(false);
    const [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null);
    const [innerTab, setInnerTab] = React.useState('all');

    // Store handler in ref to always have fresh closure
    const handleAddNewRef = React.useRef(() => {
        setEditingPolicy(null);
        setIsFormOpen(true);
    });
    
    // Update ref on every render
    React.useEffect(() => {
        handleAddNewRef.current = () => {
            setEditingPolicy(null);
            setIsFormOpen(true);
        };
    });

    // Register actions - use ref wrapper
    React.useEffect(() => {
        const actions = [
            <SettingsActionButton 
                key="add" 
                onClick={() => handleAddNewRef.current()}
            >
                <PlusCircle className="h-4 w-4" />
                Tạo chính sách giá
            </SettingsActionButton>
        ];
        onRegisterActions(actions);
    }, [onRegisterActions]);
    
    // Close dialog when tab becomes inactive
    React.useEffect(() => {
        if (!isActive && isFormOpen) {
            setIsFormOpen(false);
            setEditingPolicy(null);
        }
    }, [isActive, isFormOpen]);

    const _handleAddNew = () => {
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
            remove.mutate(idToDelete, {
                onSuccess: () => toast.success(`Đã xóa chính sách giá "${policy?.name}"`),
                onError: (err) => toast.error(err.message)
            });
        }
        setIsAlertOpen(false);
        setIsFormOpen(false);
        setIdToDelete(null);
    };

    const handleFormSubmit = (values: PricingPolicyFormValues) => {
        const normalized = {
            id: asBusinessId(values.id.trim().toUpperCase()),
            name: values.name.trim(),
            description: values.description?.trim() ?? '',
            type: values.type,
            isActive: values.isActive,
            isDefault: values.isDefault,
        };


        if (editingPolicy) {
            update.mutate({ systemId: editingPolicy.systemId, data: normalized }, {
                onSuccess: (_data) => {
                    toast.success(`Đã cập nhật chính sách giá "${normalized.name}"`);
                    setIsFormOpen(false);
                },
                onError: (err) => {
                    logError('Update error', err);
                    toast.error(err.message);
                }
            });
        } else {
            create.mutate(normalized, {
                onSuccess: (_data) => {
                    toast.success(`Đã thêm chính sách giá "${normalized.name}"`);
                    setIsFormOpen(false);
                },
                onError: (err) => {
                    logError('Create error', err);
                    toast.error(err.message);
                }
            });
        }
    };
    
    const handleSetDefault = React.useCallback((systemId: SystemId) => {
        const policy = data.find(p => p.systemId === systemId);
        setDefault.mutate(systemId, {
            onSuccess: () => policy && toast.success(`Đã đặt "${policy.name}" làm giá mặc định`),
            onError: (err) => toast.error(err.message)
        });
    }, [data, setDefault]);
    
    const handleToggleActive = React.useCallback((policy: PricingPolicy, isActive: boolean) => {
        update.mutate({ systemId: policy.systemId, data: { ...policy, isActive } }, {
            onSuccess: () => toast.success(isActive ? `Đã kích hoạt "${policy.name}"` : `Đã tắt "${policy.name}"`),
            onError: (err) => toast.error(err.message)
        });
    }, [update]);
    
    const sellingPoliciesForTab = React.useMemo(() => data.filter(p => p.type === 'Bán hàng'), [data]);
    const purchasingPoliciesForTab = React.useMemo(() => data.filter(p => p.type === 'Nhập hàng'), [data]);

    return (
        <>
            <Tabs value={innerTab} onValueChange={setInnerTab} className="w-full">
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
                        allData={data}
                        onEdit={handleEdit}
                        onDelete={handleDeleteRequest}
                        onSetDefault={handleSetDefault}
                        onToggleActive={handleToggleActive}
                    />
                </TabsContent>
                <TabsContent value="purchasing" className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Các chính sách giá áp dụng cho việc nhập hàng
                    </p>
                    <PricingTable
                        data={purchasingPoliciesForTab}
                        allData={data}
                        onEdit={handleEdit}
                        onDelete={handleDeleteRequest}
                        onSetDefault={handleSetDefault}
                        onToggleActive={handleToggleActive}
                    />
                </TabsContent>
                <TabsContent value="all" className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Tất cả các chính sách giá trong hệ thống
                    </p>
                    <PricingTable
                        data={data}
                        allData={data}
                        onEdit={handleEdit}
                        onDelete={handleDeleteRequest}
                        onSetDefault={handleSetDefault}
                        onToggleActive={handleToggleActive}
                    />
                </TabsContent>
            </Tabs>

            <Dialog open={isFormOpen} onOpenChange={(open) => {
                setIsFormOpen(open);
                if (!open) {
                    setEditingPolicy(null);
                }
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingPolicy ? 'Cập nhật chính sách giá' : 'Thêm chính sách giá'}</DialogTitle>
                    </DialogHeader>
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
