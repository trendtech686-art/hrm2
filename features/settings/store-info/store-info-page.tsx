import * as React from 'react';
import { PlusCircle, MoreHorizontal, Edit, Trash2, ShieldCheck, Phone, MapPin, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { formatDateTimeForDisplay } from '@/lib/date-utils';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useSettingsPageHeader } from '../use-settings-page-header.tsx';
import { useAuth } from '../../../contexts/auth-context.tsx';
import { useBranchStore } from '../branches/store.ts';
import { useEmployeeStore } from '../../employees/store.ts';
import type { Branch } from '../branches/types.ts';
import { BranchForm, type BranchFormValues } from '../branches/branch-form.tsx';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../components/ui/card.tsx';
import { Button } from '../../../components/ui/button.tsx';
import { SettingsActionButton } from '../../../components/settings/SettingsActionButton.tsx';
import { Badge } from '../../../components/ui/badge.tsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog.tsx';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../../components/ui/alert-dialog.tsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../components/ui/dropdown-menu.tsx';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../components/ui/form.tsx';
import { Input } from '../../../components/ui/input.tsx';
import { Textarea } from '../../../components/ui/textarea.tsx';
import { Separator } from '../../../components/ui/separator.tsx';
import { toast } from 'sonner';
import { getDefaultStoreInfo, useStoreInfoStore, type StoreGeneralInfo, type StoreGeneralInfoInput } from './store-info-store.ts';
import type { SystemId } from '../../../lib/id-types.ts';

const generalInfoSchema = z.object({
    companyName: z.string().min(2, 'Vui lòng nhập tên pháp nhân'),
    brandName: z.string().min(2, 'Vui lòng nhập tên thương hiệu'),
    taxCode: z.string().min(8, 'MST chưa hợp lệ'),
    registrationNumber: z.string().default(''),
    representativeName: z.string().min(2, 'Vui lòng nhập tên người đại diện'),
    representativeTitle: z.string().min(2, 'Vui lòng nhập chức danh'),
    hotline: z.string().min(8, 'Số hotline chưa hợp lệ'),
    email: z.string().email('Email chưa đúng định dạng'),
    website: z.string().default(''),
    headquartersAddress: z.string().min(5, 'Vui lòng nhập địa chỉ'),
    ward: z.string().default(''),
    district: z.string().default(''),
    province: z.string().default(''),
    note: z.string().default(''),
    bankAccountName: z.string().default(''),
    bankAccountNumber: z.string().default(''),
    bankName: z.string().default(''),
});

type StoreGeneralInfoFormValues = z.input<typeof generalInfoSchema>;

const mapInfoToFormValues = (info: StoreGeneralInfo): StoreGeneralInfoFormValues => ({
    companyName: info.companyName ?? '',
    brandName: info.brandName ?? '',
    taxCode: info.taxCode ?? '',
    registrationNumber: info.registrationNumber ?? '',
    representativeName: info.representativeName ?? '',
    representativeTitle: info.representativeTitle ?? '',
    hotline: info.hotline ?? '',
    email: info.email ?? '',
    website: info.website ?? '',
    headquartersAddress: info.headquartersAddress ?? '',
    ward: info.ward ?? '',
    district: info.district ?? '',
    province: info.province ?? '',
    note: info.note ?? '',
    bankAccountName: info.bankAccountName ?? '',
    bankAccountNumber: info.bankAccountNumber ?? '',
    bankName: info.bankName ?? '',
});

export function StoreInfoPage() {
    const branchStore = useBranchStore();
    const { data: branches, add: addBranch, update: updateBranch, remove: removeBranch } = branchStore;
    const setDefaultBranch = branchStore.setDefault;
    const { data: employees } = useEmployeeStore();
    const { employee: authEmployee } = useAuth();
    const { info, updateInfo, reset: resetStoreInfo } = useStoreInfoStore();
    
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [editingBranch, setEditingBranch] = React.useState<Branch | null>(null);
    const [isAlertOpen, setIsAlertOpen] = React.useState(false);
    const [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null);

    const form = useForm<StoreGeneralInfoFormValues>({
        resolver: zodResolver(generalInfoSchema),
        defaultValues: mapInfoToFormValues(info),
        mode: 'onBlur',
    });

    React.useEffect(() => {
        form.reset(mapInfoToFormValues(info));
    }, [info, form]);

    const currentUserSystemId = authEmployee?.systemId;
    const currentUserName = React.useMemo(() => {
        if (authEmployee?.fullName) return authEmployee.fullName;
        if (!currentUserSystemId) return undefined;
        return employees.find((e) => e.systemId === currentUserSystemId)?.fullName;
    }, [authEmployee, currentUserSystemId, employees]);

    const lastUpdatedLabel = React.useMemo(() => {
        if (!info.updatedAt) return 'Chưa có lần cập nhật';
        return formatDateTimeForDisplay(new Date(info.updatedAt));
    }, [info.updatedAt]);

    const handleAddNew = () => {
        setEditingBranch(null);
        setIsFormOpen(true);
    };

    useSettingsPageHeader({
        title: 'Thông tin cửa hàng',
        subtitle: 'Quản lý thông tin chi nhánh cửa hàng',
        breadcrumb: [
            { label: 'Trang chủ', href: '/', isCurrent: false },
            { label: 'Cài đặt', href: '/settings', isCurrent: false },
            { label: 'Thông tin cửa hàng', href: '/settings/store-info', isCurrent: true },
        ],
        actions: [
            <SettingsActionButton key="add" onClick={handleAddNew}>
                <PlusCircle className="h-4 w-4" />
                Thêm chi nhánh
            </SettingsActionButton>
        ],
    });

    const handleGeneralInfoSubmit = form.handleSubmit((values) => {
        const parsedValues = generalInfoSchema.parse(values);
        updateInfo(parsedValues as StoreGeneralInfoInput, {
            updatedBySystemId: currentUserSystemId,
            updatedByName: currentUserName,
        });
        toast.success('Đã lưu thông tin chung', {
            description: 'Các thông tin pháp nhân và liên hệ đã được cập nhật.',
        });
    });

    const handleResetGeneralInfo = () => {
        resetStoreInfo();
        const defaults = getDefaultStoreInfo();
        form.reset(mapInfoToFormValues(defaults));
        toast.info('Đã khôi phục dữ liệu mặc định', {
            description: 'Vui lòng kiểm tra và lưu lại nếu cần chỉnh sửa.',
        });
    };

    const getManagerName = (managerId?: string) => {
        if (!managerId) return 'Chưa có';
        return employees.find(e => e.systemId === managerId)?.fullName || 'Không tìm thấy';
    }

    const handleEdit = (branch: Branch) => {
        setEditingBranch(branch);
        setIsFormOpen(true);
    };

    const handleDeleteRequest = (systemId: SystemId) => {
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
                    <p className="text-sm text-muted-foreground">Cập nhật lần cuối: {lastUpdatedLabel}{info.updatedByName ? ` • Bởi ${info.updatedByName}` : ''}</p>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={handleGeneralInfoSubmit} className="space-y-6">
                            <section className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-semibold uppercase text-muted-foreground">Thông tin pháp nhân</h4>
                                    <p className="text-sm text-muted-foreground">Dùng trên hóa đơn và hợp đồng với khách hàng, nhà cung cấp.</p>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="companyName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tên pháp nhân</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="CÔNG TY TNHH ABC" {...field} value={field.value ?? ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="brandName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tên thương hiệu</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Thương hiệu nội bộ" {...field} value={field.value ?? ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="taxCode"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Mã số thuế</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="0102030405" {...field} value={field.value ?? ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="registrationNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Số đăng ký kinh doanh</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="0123456789" {...field} value={field.value ?? ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </section>

                            <Separator />

                            <section className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-semibold uppercase text-muted-foreground">Người đại diện & liên hệ</h4>
                                    <p className="text-sm text-muted-foreground">Thông tin hiển thị cho cơ quan thuế và đối tác.</p>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="representativeName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Người đại diện pháp luật</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nguyễn Văn A" {...field} value={field.value ?? ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="representativeTitle"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Chức danh</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Giám đốc" {...field} value={field.value ?? ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="hotline"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Hotline</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="0900 000 000" {...field} value={field.value ?? ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email liên hệ</FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="contact@yourbrand.vn" {...field} value={field.value ?? ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="website"
                                        render={({ field }) => (
                                            <FormItem className="md:col-span-2">
                                                <FormLabel>Website</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://yourbrand.vn" {...field} value={field.value ?? ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </section>

                            <Separator />

                            <section className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-semibold uppercase text-muted-foreground">Địa chỉ trụ sở chính</h4>
                                    <p className="text-sm text-muted-foreground">Thông tin hiển thị trên chứng từ và hóa đơn đầu ra.</p>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="headquartersAddress"
                                        render={({ field }) => (
                                            <FormItem className="md:col-span-2">
                                                <FormLabel>Địa chỉ</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Số 1 Trần Duy Hưng" {...field} value={field.value ?? ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="ward"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phường/Xã</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Phường Trung Hòa" {...field} value={field.value ?? ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="district"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Quận/Huyện</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Quận Cầu Giấy" {...field} value={field.value ?? ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="province"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tỉnh/Thành phố</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Hà Nội" {...field} value={field.value ?? ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </section>

                            <Separator />

                            <section className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-semibold uppercase text-muted-foreground">Tài khoản ngân hàng</h4>
                                    <p className="text-sm text-muted-foreground">Sử dụng để hiển thị trên phiếu thu/chi và hợp đồng.</p>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="bankAccountName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Chủ tài khoản</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Công ty TNHH ABC" {...field} value={field.value ?? ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="bankAccountNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Số tài khoản</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="0123456789" {...field} value={field.value ?? ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="bankName"
                                        render={({ field }) => (
                                            <FormItem className="md:col-span-2">
                                                <FormLabel>Ngân hàng</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Ngân hàng TMCP Kỹ Thương Việt Nam (Techcombank)" {...field} value={field.value ?? ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </section>

                            <Separator />

                            <section className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-semibold uppercase text-muted-foreground">Ghi chú</h4>
                                    <p className="text-sm text-muted-foreground">Thêm hướng dẫn nội bộ liên quan tới pháp nhân hoặc thông tin liên hệ.</p>
                                </div>
                                <FormField
                                    control={form.control}
                                    name="note"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nội dung ghi chú</FormLabel>
                                            <FormControl>
                                                <Textarea rows={4} placeholder="Ví dụ: dùng MST này cho hóa đơn điện tử." {...field} value={field.value ?? ''} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </section>

                            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                                <Button type="button" variant="outline" className="h-9" onClick={handleResetGeneralInfo}>
                                    Khôi phục mặc định
                                </Button>
                                <Button type="submit" className="h-9" disabled={form.formState.isSubmitting}>
                                    Lưu thông tin
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Quản lý Chi nhánh</CardTitle>
                            <CardDescription>Danh sách các chi nhánh và điểm kinh doanh của bạn.</CardDescription>
                        </div>
                        <Button size="sm" onClick={handleAddNew} className="h-9"><PlusCircle className="mr-2 h-4 w-4" /> Thêm chi nhánh</Button>
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
