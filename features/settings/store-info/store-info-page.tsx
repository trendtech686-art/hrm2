import * as React from 'react';
import { PlusCircle, MoreHorizontal, Edit, Trash2, ShieldCheck, Phone, MapPin, User } from 'lucide-react';
import { usePageHeader } from '../../../contexts/page-header-context.tsx';
import { useBranchStore } from '../branches/store.ts';
import { useEmployeeStore } from '../../employees/store.ts';
import type { Branch } from '../branches/types.ts';
import { BranchForm, type BranchFormValues } from '../branches/branch-form.tsx';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../components/ui/card.tsx';
import { Button } from '../../../components/ui/button.tsx';
import { Badge } from '../../../components/ui/badge.tsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog.tsx';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../../components/ui/alert-dialog.tsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../components/ui/dropdown-menu.tsx';
import { cn } from '../../../lib/utils.ts';

export function StoreInfoPage() {
    const { data: branches, add: addBranch, update: updateBranch, remove: removeBranch, setDefault: setDefaultBranch } = useBranchStore();
    const { data: employees } = useEmployeeStore();
    
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [editingBranch, setEditingBranch] = React.useState<Branch | null>(null);
    const [isAlertOpen, setIsAlertOpen] = React.useState(false);
    const [idToDelete, setIdToDelete] = React.useState<string | null>(null);

    const handleAddNew = () => {
        setEditingBranch(null);
        setIsFormOpen(true);
    };

    usePageHeader({
        title: 'Thông tin cửa hàng',
        subtitle: 'Quản lý thông tin chi nhánh cửa hàng',
        breadcrumb: [
            { label: 'Trang chủ', href: '/' },
            { label: 'Cài đặt', href: '/settings' },
            { label: 'Thông tin cửa hàng', href: '/settings/store-info', isCurrent: true }
        ],
        actions: [
            <Button key="add" onClick={handleAddNew}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Thêm chi nhánh
            </Button>
        ]
    });

    const getManagerName = (managerId?: string) => {
        if (!managerId) return 'Chưa có';
        return employees.find(e => e.systemId === managerId)?.fullName || 'Không tìm thấy';
    }

    const handleEdit = (branch: Branch) => {
        setEditingBranch(branch);
        setIsFormOpen(true);
    };

    const handleDeleteRequest = (systemId: string) => {
        setIdToDelete(systemId);
        setIsAlertOpen(true);
    };
    
    const confirmDelete = () => {
        if (idToDelete) {
            removeBranch(idToDelete);
        }
        setIsAlertOpen(false);
    };

    const handleFormSubmit = (values: BranchFormValues) => {
        if (editingBranch) {
            updateBranch(editingBranch.systemId, { ...editingBranch, ...values });
        } else {
            addBranch(values);
        }
        setIsFormOpen(false);
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Thông tin chung</CardTitle>
                    <CardDescription>Các thông tin cơ bản của công ty hoặc chuỗi cửa hàng.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="flex h-40 items-center justify-center rounded-lg border border-dashed shadow-sm">
                        <div className="flex flex-col items-center gap-1 text-center text-muted-foreground">
                            <h3 className="text-lg font-semibold tracking-tight">Chức năng đang phát triển</h3>
                            <p className="text-sm">Phần thông tin chung của cửa hàng sẽ được cập nhật sớm.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Quản lý Chi nhánh</CardTitle>
                            <CardDescription>Danh sách các chi nhánh và điểm kinh doanh của bạn.</CardDescription>
                        </div>
                        <Button size="sm" onClick={handleAddNew}><PlusCircle className="mr-2 h-4 w-4" /> Thêm chi nhánh</Button>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {branches.map(branch => (
                        <Card key={branch.systemId} className="flex flex-col">
                             <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                <div className="space-y-1">
                                    <CardTitle className="text-base">{branch.name}</CardTitle>
                                    <CardDescription>{branch.id}</CardDescription>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onSelect={() => handleEdit(branch)}><Edit className="mr-2 h-4 w-4" />Sửa</DropdownMenuItem>
                                        {!branch.isDefault && <DropdownMenuItem onSelect={() => setDefaultBranch(branch.systemId)}><ShieldCheck className="mr-2 h-4 w-4" />Đặt làm mặc định</DropdownMenuItem>}
                                        <DropdownMenuItem className="text-destructive" onSelect={() => handleDeleteRequest(branch.systemId)}><Trash2 className="mr-2 h-4 w-4" />Xóa</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                             </CardHeader>
                             <CardContent className="text-sm text-muted-foreground space-y-2 flex-grow">
                                <div className="flex items-start">
                                    <MapPin className="mr-2 h-4 w-4 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        {branch.address && <div>{branch.address}</div>}
                                        {branch.ward && <div>{branch.ward}</div>}
                                        {branch.district && <div>{branch.district}</div>}
                                        {branch.province && <div>{branch.province}</div>}
                                        {!branch.province && !branch.ward && <span>{branch.address}</span>}
                                    </div>
                                </div>
                                <div className="flex items-center"><Phone className="mr-2 h-4 w-4 flex-shrink-0" /><span>{branch.phone}</span></div>
                                <div className="flex items-center"><User className="mr-2 h-4 w-4 flex-shrink-0" /><span>Quản lý: {getManagerName(branch.managerId)}</span></div>
                             </CardContent>
                             {branch.isDefault && (
                                <CardFooter className="pt-4">
                                    <Badge variant="outline" className="text-amber-600 border-amber-500"><ShieldCheck className="mr-2 h-3 w-3 fill-amber-500 text-amber-500" />Chi nhánh mặc định</Badge>
                                </CardFooter>
                             )}
                        </Card>
                    ))}
                </CardContent>
            </Card>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingBranch ? 'Chỉnh sửa chi nhánh' : 'Thêm chi nhánh mới'}</DialogTitle>
                    </DialogHeader>
                    {isFormOpen && (
                        <BranchForm 
                            initialData={editingBranch}
                            onSubmit={handleFormSubmit}
                            onCancel={() => setIsFormOpen(false)}
                        />
                    )}
                </DialogContent>
            </Dialog>

             <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                        <AlertDialogDescription>Hành động này không thể được hoàn tác.</AlertDialogDescription>
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
