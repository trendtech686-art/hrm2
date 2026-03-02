# Tiêu chuẩn Module Settings

Tài liệu này mô tả quy chuẩn và patterns để tạo một module settings hoàn chỉnh trong hệ thống HRM2.

## 📁 Cấu trúc thư mục

```
features/settings/{module-name}/
├── api/
│   └── {module-name}-api.ts          # API layer (fetch functions)
├── hooks/
│   └── use-{module-name}.ts          # React Query hooks
├── columns.tsx                        # Table column definitions
├── form.tsx                           # Form component
├── types.ts                           # TypeScript types (optional)
└── page-content.tsx                   # Main page component

app/api/settings/{module-name}/
├── route.ts                           # GET (list) + POST (create)
└── [systemId]/
    └── route.ts                       # GET (detail) + PATCH (update) + DELETE
```

---

## 1. Database Schema (Prisma)

### Sử dụng bảng `SettingsData` chung

```prisma
model SettingsData {
  systemId    String    @id @default(cuid())
  id          String?                          // Business ID (mã loại)
  type        String                           // Loại setting: 'receipt-type', 'payment-type', etc.
  name        String
  description String?
  isActive    Boolean   @default(true)
  isDefault   Boolean   @default(false)
  isDeleted   Boolean   @default(false)
  metadata    Json?                            // Các field mở rộng
  orderIndex  Int?                             // Thứ tự sắp xếp (nếu cần)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  createdBy   String?
  updatedBy   String?

  @@index([type, isDeleted])
  @@index([type, isActive])
}
```

### Quy ước đặt tên `type`
- Dùng kebab-case: `receipt-type`, `payment-type`, `target-group`, `sales-channel`
- Phải unique và mô tả rõ ràng loại setting

---

## 2. API Routes

### 2.1. List Route (`app/api/settings/{module}/route.ts`)

```typescript
import { prisma } from '@/lib/prisma'
import { apiError, apiSuccess, requireAuth } from '@/lib/api-utils'

const TYPE = 'receipt-type' // Đổi theo module

function mapRecord(item: any) {
  const meta = (item?.metadata as Record<string, unknown> | null) || {}
  return { ...item, ...meta }
}

export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(1000, Math.max(1, parseInt(searchParams.get('limit') || '50')))
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const isActiveParam = searchParams.get('isActive')

    const where: any = { type: TYPE, isDeleted: false }
    if (isActiveParam !== null) where.isActive = isActiveParam === 'true'

    const [rows, total] = await Promise.all([
      prisma.settingsData.findMany({
        where,
        orderBy: [{ createdAt: 'asc' }], // ⚠️ Sort theo createdAt, KHÔNG sort theo isDefault
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.settingsData.count({ where }),
    ])

    const data = rows.map(mapRecord)
    return apiSuccess({ data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } })
  } catch (error) {
    console.error(`[${TYPE}] GET error:`, error)
    return apiError(`Failed to fetch ${TYPE}`, 500)
  }
}

export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const body = await request.json()
    const { id, name, description, isActive = true, isDefault = false, ...extraFields } = body || {}
    if (!id || !name) return apiError('id and name are required', 400)

    const created = await prisma.settingsData.create({
      data: {
        id,
        name,
        description,
        type: TYPE,
        isActive,
        isDefault,
        metadata: extraFields, // Các field mở rộng lưu vào metadata
        createdBy: session.user.id,
        updatedBy: session.user.id,
      },
    })

    return apiSuccess({ data: mapRecord(created) }, 201)
  } catch (error: any) {
    console.error(`[${TYPE}] POST error:`, error)
    return apiError(`Failed to create ${TYPE}`, 500, error?.message)
  }
}
```

### 2.2. Detail Route (`app/api/settings/{module}/[systemId]/route.ts`)

```typescript
import { prisma } from '@/lib/prisma'
import { apiError, apiSuccess, requireAuth } from '@/lib/api-utils'

const TYPE = 'receipt-type' // Đổi theo module

function mapRecord(item: any) {
  const meta = (item?.metadata as Record<string, unknown> | null) || {}
  return { ...item, ...meta }
}

export async function GET(_req: Request, { params }: { params: Promise<{ systemId: string }> }) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const { systemId } = await params
  try {
    const item = await prisma.settingsData.findFirst({ 
      where: { systemId, type: TYPE, isDeleted: false } 
    })
    if (!item) return apiError('Not found', 404)
    return apiSuccess(mapRecord(item))
  } catch (error) {
    console.error(`[${TYPE}] GET detail error:`, error)
    return apiError(`Failed to fetch ${TYPE}`, 500)
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ systemId: string }> }) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const { systemId } = await params
  try {
    const body = await request.json()
    const existing = await prisma.settingsData.findUnique({ where: { systemId } })
    if (!existing || existing.type !== TYPE) return apiError('Not found', 404)

    const metadata = {
      ...(existing.metadata as Record<string, unknown> | null || {}),
    }
    // Cập nhật các field metadata từ body
    // if (Object.prototype.hasOwnProperty.call(body, 'customField')) metadata.customField = body.customField

    // ⚠️ QUAN TRỌNG: Auto-unset default của các items khác khi set default mới
    if (body.isDefault === true) {
      await prisma.settingsData.updateMany({
        where: { type: TYPE, isDeleted: false, isDefault: true, systemId: { not: systemId } },
        data: { isDefault: false },
      })
    }

    const updated = await prisma.settingsData.update({
      where: { systemId },
      data: {
        name: body.name ?? existing.name,
        description: body.description ?? existing.description,
        isActive: body.isActive ?? existing.isActive,
        isDefault: body.isDefault ?? existing.isDefault,
        metadata,
        updatedBy: session.user.id,
      },
    })

    return apiSuccess(mapRecord(updated))
  } catch (error) {
    console.error(`[${TYPE}] PATCH error:`, error)
    return apiError(`Failed to update ${TYPE}`, 500)
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ systemId: string }> }) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const { systemId } = await params
  try {
    await prisma.settingsData.delete({ where: { systemId } })
    return apiSuccess({ success: true })
  } catch (error: any) {
    if (error?.code === 'P2025') return apiError('Not found', 404)
    console.error(`[${TYPE}] DELETE error:`, error)
    return apiError(`Failed to delete ${TYPE}`, 500)
  }
}
```

---

## 3. API Layer (Frontend)

### File: `features/settings/{module}/api/{module}-api.ts`

```typescript
import type { ModuleType } from '@/lib/types/prisma-extended';

export interface ModuleFilters {
  page?: number;
  limit?: number;
  isActive?: boolean;
}

export interface ModuleResponse {
  data: ModuleType[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ModuleCreateInput {
  id: string;
  name: string;
  description?: string;
  isActive?: boolean;
  isDefault?: boolean;
}

export interface ModuleUpdateInput extends Partial<ModuleCreateInput> {}

const BASE_URL = '/api/settings/{module}';

export async function fetchModules(filters: ModuleFilters = {}): Promise<ModuleResponse> {
  const params = new URLSearchParams();
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.isActive !== undefined) params.set('isActive', String(filters.isActive));

  const url = params.toString() ? `${BASE_URL}?${params}` : BASE_URL;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch');
  return response.json();
}

export async function fetchModuleById(systemId: string): Promise<ModuleType> {
  const response = await fetch(`${BASE_URL}/${systemId}`);
  if (!response.ok) throw new Error('Failed to fetch');
  return response.json();
}

export async function createModule(data: ModuleCreateInput): Promise<ModuleType> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create');
  return response.json();
}

export async function updateModule(systemId: string, data: ModuleUpdateInput): Promise<ModuleType> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update');
  return response.json();
}

export async function deleteModule(systemId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${systemId}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete');
}
```

---

## 4. React Query Hooks

### File: `features/settings/{module}/hooks/use-{module}.ts`

```typescript
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  fetchModules,
  fetchModuleById,
  createModule,
  updateModule,
  deleteModule,
  type ModuleFilters,
  type ModuleCreateInput,
  type ModuleUpdateInput,
} from '../api/{module}-api';

// Query Keys
export const moduleKeys = {
  all: ['{module}'] as const,
  lists: () => [...moduleKeys.all, 'list'] as const,
  list: (filters: ModuleFilters) => [...moduleKeys.lists(), filters] as const,
  details: () => [...moduleKeys.all, 'detail'] as const,
  detail: (id: string) => [...moduleKeys.details(), id] as const,
};

// Hooks
export function useModules(filters: ModuleFilters = {}) {
  return useQuery({
    queryKey: moduleKeys.list(filters),
    queryFn: () => fetchModules(filters),
    staleTime: 0,              // ⚠️ QUAN TRỌNG: 0 để đảm bảo refetch ngay sau invalidate
    gcTime: 1000 * 60 * 60,    // 1 hour
    placeholderData: keepPreviousData,
  });
}

export function useModuleById(systemId: string | undefined) {
  return useQuery({
    queryKey: moduleKeys.detail(systemId!),
    queryFn: () => fetchModuleById(systemId!),
    enabled: !!systemId,
    staleTime: 1000 * 60 * 10,
  });
}

interface MutationCallbacks {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useModuleMutations(callbacks: MutationCallbacks = {}) {
  const queryClient = useQueryClient();
  // ⚠️ QUAN TRỌNG: refetchType: 'all' để force refetch ngay lập tức
  const invalidate = () => queryClient.invalidateQueries({ 
    queryKey: moduleKeys.all,
    refetchType: 'all',
  });

  const create = useMutation({
    mutationFn: (data: ModuleCreateInput) => createModule(data),
    onSuccess: () => { invalidate(); callbacks.onSuccess?.(); },
    onError: callbacks.onError,
  });

  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: ModuleUpdateInput }) => 
      updateModule(systemId, data),
    onSuccess: () => { invalidate(); callbacks.onSuccess?.(); },
    onError: callbacks.onError,
  });

  const remove = useMutation({
    mutationFn: (systemId: string) => deleteModule(systemId),
    onSuccess: () => { invalidate(); callbacks.onSuccess?.(); },
    onError: callbacks.onError,
  });

  return { create, update, remove };
}
```

---

## 5. UI Components

### 5.1. Columns Definition (`columns.tsx`)

```tsx
import * as React from 'react';
import type { ModuleType } from '@/lib/types/prisma-extended';
import type { ColumnDef } from '@/components/data-table/types';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { SystemId } from '@/lib/id-types';

interface ColumnOptions {
  onEdit: (item: ModuleType) => void;
  onDelete: (systemId: SystemId) => void;
  onToggleStatus: (item: ModuleType, isActive: boolean) => void;
  onToggleDefault: (item: ModuleType, isDefault: boolean) => void;
}

export const getModuleColumns = ({
  onEdit,
  onDelete,
  onToggleStatus,
  onToggleDefault,
}: ColumnOptions): ColumnDef<ModuleType>[] => [
  { 
    id: 'id',
    header: 'Mã',
    cell: ({ row }) => <span className="uppercase">{row.id}</span>,
    meta: { displayName: 'Mã' }
  },
  { 
    id: 'name', 
    header: 'Tên', 
    cell: ({ row }) => <span className="font-medium">{row.name}</span>,
    meta: { displayName: 'Tên' } 
  },
  { 
    id: 'description', 
    header: 'Mô tả', 
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.description || "—"}</span>
    ),
    meta: { displayName: 'Mô tả' } 
  },
  { 
    id: 'isDefault', 
    header: 'Mặc định', 
    cell: ({ row }) => (
      <Switch 
        checked={row.isDefault ?? false} 
        onCheckedChange={(checked) => onToggleDefault(row, checked)}
      />
    ),
    meta: { displayName: 'Mặc định' } 
  },
  { 
    id: 'isActive', 
    header: 'Trạng thái', 
    cell: ({ row }) => (
      <Switch 
        checked={row.isActive ?? true} 
        onCheckedChange={(checked) => onToggleStatus(row, checked)}
      />
    ),
    meta: { displayName: 'Trạng thái' } 
  },
  {
    id: 'actions',
    header: 'Thao tác',
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(row)}>Sửa</DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onDelete(row.systemId)} 
            className="text-destructive"
          >
            Xóa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    meta: { displayName: 'Thao tác' }
  },
];
```

### 5.2. Form Component (`form.tsx`)

```tsx
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import type { ModuleType } from '@/lib/types/prisma-extended';

const formSchema = z.object({
  id: z.string().min(1, 'Mã là bắt buộc').max(50),
  name: z.string().min(1, 'Tên là bắt buộc').max(200),
  description: z.string().max(500).optional(),
  isActive: z.boolean().default(true),
});

export type ModuleFormValues = z.infer<typeof formSchema>;

interface ModuleFormProps {
  initialData?: ModuleType | null;
  onSubmit: (values: ModuleFormValues) => void;
}

export function ModuleForm({ initialData, onSubmit }: ModuleFormProps) {
  const form = useForm<ModuleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: initialData?.id || '',
      name: initialData?.name || '',
      description: initialData?.description || '',
      isActive: initialData?.isActive ?? true,
    },
  });

  // ⚠️ QUAN TRỌNG: Reset form khi initialData thay đổi (edit item khác hoặc thêm mới)
  // React Hook Form chỉ đọc defaultValues lần đầu, khi props thay đổi cần gọi reset()
  React.useEffect(() => {
    if (initialData) {
      form.reset({
        id: initialData.id || '',
        name: initialData.name || '',
        description: initialData.description || '',
        isActive: initialData.isActive ?? true,
      });
    } else {
      form.reset({
        id: '',
        name: '',
        description: '',
        isActive: true,
      });
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form id="module-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* ⚠️ businessId (Mã) CÓ THỂ SỬA ĐƯỢC, systemId thì KHÔNG hiện ra */}
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mã</FormLabel>
              <FormControl>
                <Input {...field} placeholder="VD: LOAI_001" className="uppercase" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Nhập tên" />
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
                <Textarea {...field} placeholder="Mô tả (tùy chọn)" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3">
              <FormLabel>Kích hoạt</FormLabel>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
```

### 5.3. Page Content (`page-content.tsx`)

```tsx
import * as React from "react";
import { Plus } from "lucide-react";
import { asBusinessId, type SystemId } from "@/lib/id-types";
import { useModules, useModuleMutations } from "./hooks/use-modules";
import type { ModuleType } from '@/lib/types/prisma-extended';
import { ModuleForm, type ModuleFormValues } from "./form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { SimpleSettingsTable } from "@/components/settings/SimpleSettingsTable";
import { getModuleColumns } from "./columns";
import { toast } from "sonner";
import { SettingsActionButton } from "@/components/settings/SettingsActionButton";
import type { RegisterTabActions } from "../use-tab-action-registry";

type PageContentProps = {
  isActive: boolean;
  onRegisterActions: RegisterTabActions;
};

export function ModulePageContent({ isActive, onRegisterActions }: PageContentProps) {
  // Data
  const { data: queryData } = useModules({ limit: 1000 });
  const data = React.useMemo(() => queryData?.data ?? [], [queryData?.data]);
  const { create, update, remove } = useModuleMutations({
    onSuccess: () => toast.success("Thao tác thành công"),
    onError: (err) => toast.error(err.message)
  });
  
  // State
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<ModuleType | null>(null);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null);
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = React.useState(false);

  // Handlers
  const handleAddNew = React.useCallback(() => {
    setEditingItem(null);
    setIsFormOpen(true);
  }, []);

  const handleEdit = React.useCallback((item: ModuleType) => { 
    setEditingItem(item); 
    setIsFormOpen(true); 
  }, []);

  const handleDeleteRequest = React.useCallback((systemId: SystemId) => { 
    setIdToDelete(systemId);
    setIsAlertOpen(true);
  }, []);
  
  // ⚠️ Logic chuẩn cho toggle default
  const handleToggleDefault = React.useCallback((item: ModuleType, isDefault: boolean) => {
    if (isDefault) {
      // Backend sẽ tự động tắt mặc định của các items khác
      update.mutate({ systemId: item.systemId, data: { isDefault: true } });
      toast.success(`Đã đặt "${item.name}" làm mặc định`);
    } else {
      // Không cho phép tắt mặc định nếu chỉ còn 1 item
      const activeItems = data.filter(d => d.isActive);
      if (activeItems.length <= 1) {
        toast.error("Phải có ít nhất một mục mặc định");
        return;
      }
      // Chuyển mặc định sang item active khác
      const other = activeItems.find(d => d.systemId !== item.systemId);
      if (other) {
        update.mutate({ systemId: other.systemId, data: { isDefault: true } });
        toast.success(`Đã chuyển mặc định sang "${other.name}"`);
      }
    }
  }, [data, update]);

  const handleToggleStatus = React.useCallback((item: ModuleType, isActive: boolean) => {
    update.mutate({ systemId: item.systemId, data: { isActive } });
    toast.success(isActive ? `Đã kích hoạt "${item.name}"` : `Đã tắt "${item.name}"`);
  }, [update]);
  
  const confirmDelete = () => {
    if (idToDelete) {
      const item = data.find(d => d.systemId === idToDelete);
      remove.mutate(idToDelete);
      toast.success(`Đã xóa "${item?.name}"`);
    }
    setIsAlertOpen(false);
    setIdToDelete(null);
  };

  // Bulk delete - ⚠️ QUAN TRỌNG: Nhận selectedItems (TData[]) thay vì selectedIds (string[])
  const handleBulkDelete = React.useCallback((selectedItems: { systemId: string }[]) => {
    if (selectedItems.length === 0) return;
    setIsBulkDeleteOpen(true);
  }, []);

  const confirmBulkDelete = () => {
    const selectedIds = Object.keys(rowSelection);
    selectedIds.forEach(id => {
      remove.mutate(id as SystemId);
    });
    toast.success(`Đã xóa ${selectedIds.length} mục`);
    setRowSelection({});
    setIsBulkDeleteOpen(false);
  };
  
  // Form submit
  const handleFormSubmit = (values: ModuleFormValues) => {
    try {
      const normalized = {
        id: asBusinessId(values.id.trim().toUpperCase()),
        name: values.name.trim(),
        description: values.description?.trim() || undefined,
        isActive: values.isActive,
      };

      if (editingItem) {
        update.mutate({ systemId: editingItem.systemId, data: normalized });
      } else {
        create.mutate(normalized);
      }
      setIsFormOpen(false);
    } catch (error) {
      toast.error("Có lỗi xảy ra", {
        description: error instanceof Error ? error.message : "Lỗi không xác định",
      });
    }
  };

  // Columns
  const columns = React.useMemo(
    () => getModuleColumns({
      onEdit: handleEdit,
      onDelete: handleDeleteRequest,
      onToggleStatus: handleToggleStatus,
      onToggleDefault: handleToggleDefault,
    }),
    [handleEdit, handleDeleteRequest, handleToggleStatus, handleToggleDefault]
  );

  // Register header actions
  React.useEffect(() => {
    if (!isActive) return;
    onRegisterActions([
      <SettingsActionButton key="add-module" onClick={handleAddNew}>
        <Plus className="mr-2 h-4 w-4" /> Thêm mới
      </SettingsActionButton>,
    ]);
  }, [handleAddNew, isActive, onRegisterActions]);

  return (
    <div className="space-y-4">
      <SimpleSettingsTable
        data={data}
        columns={columns}
        emptyTitle="Chưa có dữ liệu"
        emptyDescription="Thêm mục đầu tiên để bắt đầu cấu hình"
        emptyAction={<Button size="sm" onClick={handleAddNew}>Thêm mới</Button>}
        enableSelection
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        onBulkDelete={handleBulkDelete}
        enablePagination
        pagination={{ pageSize: 10, showInfo: true }}
      />
      
      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Cập nhật' : 'Thêm mới'}</DialogTitle>
          </DialogHeader>
          <ModuleForm initialData={editingItem} onSubmit={handleFormSubmit} />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Đóng</Button>
            <Button type="submit" form="module-form">Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Dữ liệu sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation */}
      <AlertDialog open={isBulkDeleteOpen} onOpenChange={setIsBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa {Object.keys(rowSelection).length} mục?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Các mục đã chọn sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmBulkDelete} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa tất cả
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
```

---

## 6. Vấn đề thường gặp: INCONSISTENCY

### 🔴 Các lỗi hay gặp khi không tuân thủ tiêu chuẩn

**1. Không dùng SimpleSettingsTable:**
```tsx
// ❌ SAI - Code tự build table riêng
import { Table, TableBody, TableCell, ... } from "components/ui/table";
<div className="rounded-md border bg-card">
  <Table>
    <TableHeader>...</TableHeader>
    <TableBody>...</TableBody>
  </Table>
</div>

// ✅ ĐÚNG - Dùng SimpleSettingsTable
import { SimpleSettingsTable } from "components/settings/SimpleSettingsTable";
<SimpleSettingsTable
  data={data}
  columns={columns}
  enableSelection
  rowSelection={rowSelection}
  setRowSelection={setRowSelection}
  onBulkDelete={handleBulkDelete}
/>
```

**2. Style không nhất quán:**
```tsx
// ❌ SAI - Mỗi page 1 kiểu border/background khác nhau
<div className="rounded-md border bg-card">        // payment-methods
<div className="rounded-md border bg-background">  // receipt-types
<div className="rounded-md border-border border bg-card">  // sales-channels
<div className="rounded-md border">               // target-groups

// ✅ ĐÚNG - SimpleSettingsTable đã có style chuẩn
// overflow-x-auto border border-border rounded-md
```

**3. Logic selection không thống nhất:**
```tsx
// ❌ SAI - Code selection riêng cho mỗi page
const [rowSelection, setRowSelection] = useState({});
const isAllSelected = data.every(row => rowSelection[row.systemId]);
const handleToggleAll = () => { ... }
const handleToggleRow = (id) => { ... }

// ✅ ĐÚNG - Dùng props của SimpleSettingsTable
<SimpleSettingsTable
  enableSelection
  rowSelection={rowSelection}
  setRowSelection={setRowSelection}
  onBulkDelete={handleBulkDelete}
/>
```

**4. Checkbox header không có:**
```tsx
// ❌ SAI - Không có checkbox "Select All" ở header
<TableHead>Mã</TableHead>
<TableHead>Tên</TableHead>

// ✅ ĐÚNG - SimpleSettingsTable tự động thêm checkbox header
// Có checkbox ở đầu + indeterminate state khi chọn 1 phần
```

### 📋 Danh sách các page cần refactor

#### 🔴 KHÔNG dùng SimpleSettingsTable (đã migrate hoặc không cần migrate):
| # | File | Trạng thái | Ghi chú |
|---|------|-----------|---------|
| 1 | `features/settings/payments/methods/page-content.tsx` | ✅ Đã migrate | Dùng SimpleSettingsTable |
| 2 | `features/settings/cash-accounts/page-content.tsx` | ✅ Đã migrate | Dùng SimpleSettingsTable |
| 3 | `features/settings/other/website-tab.tsx` | ⏸️ Skip | Form settings phức tạp |
| 4 | `features/settings/other/email-template-tab.tsx` | ⏸️ Skip | Email template editor |
| 5 | `features/settings/employees/payroll-templates-settings-content.tsx` | ⏸️ Skip | Form phức tạp |
| 6 | `features/settings/employees/insurance-tax-settings.tsx` | ⏸️ Skip | Form BHXH/thuế |
| 7 | `features/settings/employees/employee-settings-page.tsx` | ⏸️ Skip | Multi-tab form |
| 8 | `features/settings/employees/employee-roles-page.tsx` | ⏸️ Skip | Permission UI |
| 9 | `features/settings/trendtech/components/category-mapping-tab.tsx` | ⏸️ Skip | Integration sync |
| 10 | `features/settings/trendtech/components/brand-mapping-tab.tsx` | ⏸️ Skip | Integration sync |
| 11 | `features/settings/trendtech/components/product-mapping-tab.tsx` | ⏸️ Skip | Integration sync |
| 12 | `features/settings/pkgx/components/category-list-tab.tsx` | ⏸️ Skip | External API |
| 13 | `features/settings/pkgx/components/brand-list-tab.tsx` | ⏸️ Skip | External API |
| 14 | `features/settings/pricing/tax-table.tsx` | ⏸️ Skip | Used in form |
| 15 | `features/settings/pricing/pricing-table.tsx` | ⏸️ Skip | Used in form |
| 16 | `features/settings/inventory/settings-table.tsx` | ⏸️ Legacy | Sẽ deprecate |
| 17 | `features/settings/customers/settings-table.tsx` | ⏸️ Legacy | Sẽ deprecate |

#### 🟡 Đã dùng SimpleSettingsTable nhưng có WRAPPER DIV thừa (đã fix):
| # | File | Wrapper Style | Trạng thái |
|---|------|--------------|-----------|
| 1 | `features/settings/receipt-types/page-content.tsx` | `rounded-md border bg-background` | ✅ Đã fix |
| 2 | `features/settings/target-groups/page-content.tsx` | `rounded-md border` | ✅ Đã fix |
| 3 | `features/settings/sales-channels/page-content.tsx` | `rounded-md border-border border bg-card` | ✅ Đã fix |

#### 🟢 Đã dùng SimpleSettingsTable ĐÚNG CHUẨN:
| # | File | Trạng thái |
|---|------|-----------|
| 1 | `features/settings/payments/types/page-content.tsx` | ✅ OK |
| 2 | `features/settings/job-titles/page-content.tsx` | ✅ OK |
| 3 | `features/settings/departments/departments-settings-content.tsx` | ✅ OK |
| 4 | `features/settings/employee-types/employee-types-settings-content.tsx` | ✅ OK |
| 5 | `features/settings/inventory/tabs/units-tab.tsx` | ✅ OK (trong Card) |
| 6 | `features/settings/inventory/tabs/importers-tab.tsx` | ✅ OK (trong Card) |
| 7 | `features/settings/inventory/tabs/storage-locations-tab.tsx` | ✅ OK (trong Card) |
| 8 | `features/settings/inventory/tabs/product-types-tab.tsx` | ✅ OK (trong Card) |
| 9 | `features/settings/customers/tabs/credit-ratings-tab.tsx` | ✅ OK (trong Card) |
| 10 | `features/settings/customers/tabs/groups-tab.tsx` | ✅ OK (trong Card) |
| 11 | `features/settings/customers/tabs/payment-terms-tab.tsx` | ✅ OK (trong Card) |
| 12 | `features/settings/customers/tabs/lifecycle-stages-tab.tsx` | ✅ OK (trong Card) |
| 13 | `features/settings/customers/tabs/sla-tab.tsx` | ✅ OK (trong Card) |
| 14 | `features/settings/customers/tabs/types-tab.tsx` | ✅ OK (trong Card) |
| 15 | `features/settings/customers/tabs/sources-tab.tsx` | ✅ OK (trong Card) |

#### ⚪ NGOẠI LỆ - Không cần migrate (dùng component phức tạp hơn):
| # | File | Lý do |
|---|------|------|
| 1 | `features/settings/system/import-export-logs-page.tsx` | Dùng ResponsiveDataTable - có pagination |
| 2 | `features/settings/printer/workflow-templates-page.tsx` | Dùng VirtualizedDataTable - có virtualization |

---

## TODO: Refactor Settings Pages

### ✅ Phase 1: Xóa wrapper div thừa (3 files) - HOÀN THÀNH
- [x] `receipt-types/page-content.tsx` - Xóa `<div className="rounded-md border bg-background">`
- [x] `target-groups/page-content.tsx` - Xóa `<div className="rounded-md border">`
- [x] `sales-channels/page-content.tsx` - Xóa `<div className="rounded-md border-border border bg-card">`

### ✅ Phase 2: Migrate payment settings (2 files) - HOÀN THÀNH
- [x] `payments/methods/page-content.tsx` - Migrate sang SimpleSettingsTable
- [x] `cash-accounts/page-content.tsx` - Migrate sang SimpleSettingsTable

### ⏸️ Phase 3-7: KHÔNG CẦN MIGRATE (các file này không phải simple settings table)

Các file sau đây có logic phức tạp riêng, không phù hợp với SimpleSettingsTable:

**Employee Settings (Form-based, không phải table list):**
- ⏸️ `employees/payroll-templates-settings-content.tsx` - Form phức tạp với salary components
- ⏸️ `employees/insurance-tax-settings.tsx` - Form cài đặt BHXH/thuế
- ⏸️ `employees/employee-settings-page.tsx` - Multi-tab form settings
- ⏸️ `employees/employee-roles-page.tsx` - Permission management UI

**Other Settings (Complex UI):**
- ⏸️ `other/website-tab.tsx` - Domain/SSL/404 settings form
- ⏸️ `other/email-template-tab.tsx` - Email template editor

**Pricing Settings (Shared components used in forms):**
- ⏸️ `pricing/tax-table.tsx` - Used inside pricing page form
- ⏸️ `pricing/pricing-table.tsx` - Used inside pricing page form

**Integration Settings (External API sync):**
- ⏸️ `trendtech/components/category-mapping-tab.tsx` - Trendtech mapping UI
- ⏸️ `trendtech/components/brand-mapping-tab.tsx` - Trendtech brand sync
- ⏸️ `trendtech/components/product-mapping-tab.tsx` - Trendtech product sync
- ⏸️ `pkgx/components/category-list-tab.tsx` - PKGX category management
- ⏸️ `pkgx/components/brand-list-tab.tsx` - PKGX brand management

**Shared Table Components (Legacy - sẽ deprecate dần):**
- ⏸️ `inventory/settings-table.tsx` - Generic table (đã có SimpleSettingsTable thay thế)
- ⏸️ `customers/settings-table.tsx` - Generic table (đã có SimpleSettingsTable thay thế)

**Lưu ý:** Khi dùng SimpleSettingsTable, KHÔNG cần wrap thêm div với border/rounded vì component đã có sẵn.

---

## 7. Checklist khi tạo module mới

### Backend
- [ ] Tạo `app/api/settings/{module}/route.ts` (GET list + POST create)
- [ ] Tạo `app/api/settings/{module}/[systemId]/route.ts` (GET detail + PATCH + DELETE)
- [ ] Sort theo `id` ASC (không sort theo `isDefault`)
- [ ] PATCH route có auto-unset default của các items khác

### Frontend
- [ ] Tạo `features/settings/{module}/api/{module}-api.ts`
- [ ] Tạo `features/settings/{module}/hooks/use-{module}.ts`
- [ ] Tạo `features/settings/{module}/columns.tsx`
- [ ] Tạo `features/settings/{module}/form.tsx`
- [ ] Tạo `features/settings/{module}/page-content.tsx`
- [ ] Sử dụng `SimpleSettingsTable` với `enableSelection`
- [ ] Logic `handleToggleDefault` chuẩn (1 API call, backend xử lý auto-unset)
- [ ] Form có `useEffect` reset khi `initialData` thay đổi
- [ ] Hook có `staleTime: 0` để refetch ngay sau invalidate
- [ ] Hook có `refetchType: 'all'` khi invalidate
- [ ] SimpleSettingsTable có `enablePagination` với `pageSize: 10`
- [ ] `handleBulkDelete` nhận `selectedItems: TData[]` thay vì `selectedIds: string[]`

### Testing
- [ ] Test tạo mới
- [ ] Test cập nhật
- [ ] Test xóa đơn lẻ
- [ ] Test xóa nhiều (bulk delete)
- [ ] Test toggle mặc định (không bị jump lên đầu)
- [ ] Test toggle trạng thái

---

## 7. Các lưu ý quan trọng

### ⚠️ Form phải reset khi initialData thay đổi
```tsx
// ❌ SAI - Form không update khi edit item khác
const form = useForm({
  defaultValues: initialData || { id: '', name: '' },
});
// defaultValues chỉ đọc lần đầu, khi props thay đổi form không update!

// ✅ ĐÚNG - Thêm useEffect reset
React.useEffect(() => {
  if (initialData) {
    form.reset(initialData);
  } else {
    form.reset({ id: '', name: '' });
  }
}, [initialData, form]);
```

### ⚠️ staleTime phải = 0 để refetch ngay sau mutation
```tsx
// ❌ SAI - staleTime cao khiến data không refetch sau mutation
staleTime: 1000 * 60 * 10, // 10 phút

// ✅ ĐÚNG - staleTime = 0
staleTime: 0,
```

### ⚠️ invalidateQueries phải có refetchType: 'all'
```tsx
// ❌ SAI - Có thể không refetch nếu query đang inactive
queryClient.invalidateQueries({ queryKey: moduleKeys.all });

// ✅ ĐÚNG - Force refetch tất cả queries
queryClient.invalidateQueries({ 
  queryKey: moduleKeys.all,
  refetchType: 'all',
});
```

### ⚠️ Không sort theo isDefault
```typescript
// ❌ SAI - sẽ làm item mặc định nhảy lên đầu khi thay đổi
orderBy: [{ isDefault: 'desc' }, { name: 'asc' }]

// ✅ ĐÚNG - giữ thứ tự ổn định theo createdAt
orderBy: [{ createdAt: 'asc' }]
```

### ⚠️ Backend phải auto-unset default
```typescript
// Trong PATCH route, khi set isDefault = true
if (body.isDefault === true) {
  await prisma.settingsData.updateMany({
    where: { type: TYPE, isDeleted: false, isDefault: true, systemId: { not: systemId } },
    data: { isDefault: false },
  })
}
```

### ⚠️ Frontend chỉ cần 1 API call cho toggle default
```typescript
// ❌ SAI - nhiều API calls, gây race condition
data.forEach(d => {
  if (d.isDefault) update.mutate({ systemId: d.systemId, data: { isDefault: false } });
});
update.mutate({ systemId: item.systemId, data: { isDefault: true } });

// ✅ ĐÚNG - 1 API call, backend xử lý
update.mutate({ systemId: item.systemId, data: { isDefault: true } });
```

### ⚠️ Dùng `.mutate()` thay vì `.mutateAsync()` trong form submit
```typescript
// ❌ SAI - mutateAsync có thể bị stuck nếu có lỗi, khiến add lần 2 không được
const handleFormSubmit = async (values: FormValues) => {
  try {
    await create.mutateAsync(payload);
    toast.success("Thêm mới thành công");
    setIsFormOpen(false);
  } catch (error) { ... }
};

// ✅ ĐÚNG - dùng mutate với callback onSuccess
const handleFormSubmit = (values: FormValues) => {
  try {
    if (editingItem) {
      update.mutate(
        { systemId: editingItem.systemId, data: payload },
        { onSuccess: () => toast.success("Cập nhật thành công") }
      );
    } else {
      create.mutate(payload, { onSuccess: () => toast.success("Thêm mới thành công") });
    }
    setIsFormOpen(false);
  } catch (error) { ... }
};
```

**Lý do:**
- `mutateAsync` trả về Promise, nếu có lỗi mutation bị stuck ở trạng thái error
- Lần click sau không trigger được vì mutation vẫn đang ở trạng thái lỗi
- `mutate()` không block, callback `onSuccess` chạy khi thành công

### ⚠️ Checkbox indeterminate phải trả về undefined thay vì false
```tsx
// ❌ SAI - gây warning "Received `false` for a non-boolean attribute"
indeterminate={isSomeSelected}

// ✅ ĐÚNG
indeterminate={isSomeSelected ? true : undefined}
```

### 🚫 TUYỆT ĐỐI KHÔNG dùng localStorage
```typescript
// ❌ CẤM - Không được lưu settings vào localStorage
localStorage.setItem('settings', JSON.stringify(data))
const data = JSON.parse(localStorage.getItem('settings') || '[]')

// ✅ BẮT BUỘC - Tất cả settings phải lưu vào database qua Prisma
await prisma.settingsData.create({ data: { ... } })
await prisma.settingsData.findMany({ where: { type: TYPE } })
```

**Lý do:**
- localStorage chỉ lưu trên 1 thiết bị, không đồng bộ giữa các máy
- Dữ liệu dễ bị mất khi clear browser data
- Không thể audit/tracking thay đổi
- Không hỗ trợ multi-user/phân quyền
- Không có backup/restore
