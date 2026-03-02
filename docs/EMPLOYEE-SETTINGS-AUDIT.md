# Employee Settings - Performance & Standards Audit

> Document mô tả chuẩn thiết kế và trạng thái các tabs trong Employee Settings

## Tổng quan

Employee Settings bao gồm 9 tabs quản lý các cấu hình liên quan đến nhân viên:

| Tab | Component | API | Hook | Status |
|-----|-----------|-----|------|--------|
| Loại nghỉ phép | `LeaveTypesSettingsContent` | ✅ | ✅ Optimistic | ✅ Done |
| Thành phần lương | `SalaryComponentsSettingsContent` | ✅ | ✅ Optimistic | ✅ Done |
| Loại phạt | `PenaltyTypesSettingsContent` | ✅ | ✅ Optimistic | ✅ Done |
| Chức vụ | `JobTitlesPageContent` | ✅ | ✅ Optimistic | ✅ Done |
| Phòng ban | `DepartmentsSettingsContent` | ✅ | ✅ Optimistic | ✅ Done |
| Loại nhân viên | `EmployeeTypesSettingsContent` | ✅ | ✅ Optimistic | ✅ Done |
| Mẫu lương | `PayrollTemplatesSettingsContent` | ✅ | ✅ setQueryData | ✅ Done |
| Cấu hình bảo hiểm | InsuranceConfigContent | 📋 Form-based | N/A | OK |
| Cấu hình thuế | TaxConfigContent | 📋 Form-based | N/A | OK |

## Chuẩn thiết kế (Next.js Best Practices)

### 1. React Query Configuration

```typescript
// Query key factory pattern
export const entityKeys = {
  all: ['entity-name'] as const,
  lists: () => [...entityKeys.all, 'list'] as const,
  list: (params: Params) => [...entityKeys.lists(), params] as const,
  details: () => [...entityKeys.all, 'detail'] as const,
  detail: (id: string) => [...entityKeys.details(), id] as const,
};

// Query hook với staleTime
export function useEntities(params = {}) {
  return useQuery({
    queryKey: entityKeys.list(params),
    queryFn: () => fetchEntities(params),
    staleTime: 10 * 60 * 1000, // 10 minutes cho settings
    gcTime: 60 * 60 * 1000,    // 1 hour cache
    placeholderData: keepPreviousData,
  });
}
```

### 2. Optimistic Updates Pattern

```typescript
const create = useMutation({
  mutationFn: createEntity,
  onMutate: async (newData) => {
    // 1. Cancel outgoing queries
    await queryClient.cancelQueries({ queryKey: entityKeys.lists() });
    
    // 2. Snapshot previous value
    const previousData = queryClient.getQueriesData({ queryKey: entityKeys.lists() });
    
    // 3. Optimistically add temp item
    queryClient.setQueriesData({ queryKey: entityKeys.lists() }, (old: any) => {
      if (!old) return old;
      const tempItem = { systemId: `temp-${Date.now()}`, ...newData };
      return [...old, tempItem];
    });
    
    return { previousData };
  },
  onSuccess: (data) => {
    // Replace temp item with real data
    queryClient.setQueriesData({ queryKey: entityKeys.lists() }, (old: any) => {
      const filtered = old.filter((item: any) => !item.systemId.startsWith('temp-'));
      return [...filtered, data];
    });
  },
  onError: (error, _, context) => {
    // Rollback on error
    context?.previousData?.forEach(([queryKey, data]) => {
      queryClient.setQueryData(queryKey, data);
    });
  },
});
```

### 3. Component Pattern

```typescript
export function EntitySettingsContent() {
  // React Query hooks
  const { data: entities = [], isLoading } = useEntities();
  const { create, update, remove } = useEntityMutations({
    onCreateSuccess: () => toast.success('Đã thêm mới'),
    onUpdateSuccess: () => toast.success('Đã cập nhật'),
    onDeleteSuccess: () => toast.success('Đã xóa'),
    onError: (err) => toast.error(err.message),
  });
  
  // Memoized columns
  const columns = React.useMemo(() => getColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    onToggle: handleToggle,
  }), [handleEdit, handleDelete, handleToggle]);
  
  // Callback handlers
  const handleEdit = React.useCallback((item) => {
    setEditingItem(item);
    setIsFormOpen(true);
  }, []);
  
  return (
    <SimpleSettingsTable
      data={entities}
      columns={columns}
      isLoading={isLoading}
      emptyTitle="Chưa có dữ liệu"
      emptyDescription="Thêm mới để bắt đầu"
      enablePagination={entities.length > 10}
      pagination={{ pageSize: 10 }}
    />
  );
}
```

### 4. SimpleSettingsTable Props

| Prop | Type | Description |
|------|------|-------------|
| `data` | `T[]` | Danh sách dữ liệu |
| `columns` | `ColumnDef<T>[]` | Định nghĩa cột |
| `isLoading` | `boolean` | Hiển thị skeleton loading |
| `emptyTitle` | `string` | Title khi không có dữ liệu |
| `emptyDescription` | `string` | Mô tả khi không có dữ liệu |
| `emptyAction` | `ReactNode` | Button action khi empty |
| `enableSelection` | `boolean` | Cho phép chọn rows |
| `enablePagination` | `boolean` | Bật pagination |
| `pagination.pageSize` | `number` | Số rows/trang |

## Files đã cập nhật

### Hooks (Optimistic Updates)
- [use-penalty-types.ts](../features/settings/penalty-types/hooks/use-penalty-types.ts)
- [use-job-titles.ts](../features/settings/job-titles/hooks/use-job-titles.ts)
- [use-employee-types.ts](../features/settings/employee-types/hooks/use-employee-types.ts)
- [use-departments.ts](../features/settings/departments/hooks/use-departments.ts)

### Components (isLoading prop added)
- [leave-types-settings-content.tsx](../features/settings/employees/leave-types-settings-content.tsx)
- [salary-components-settings-content.tsx](../features/settings/employees/salary-components-settings-content.tsx)
- [penalty-types-settings-content.tsx](../features/settings/penalties/penalty-types-settings-content.tsx)
- [page-content.tsx](../features/settings/job-titles/page-content.tsx)
- [departments-settings-content.tsx](../features/settings/departments/departments-settings-content.tsx)
- [employee-types-settings-content.tsx](../features/settings/employee-types/employee-types-settings-content.tsx)

### Shared Components
- [SimpleSettingsTable.tsx](../components/settings/SimpleSettingsTable.tsx) - Added `isLoading` prop with skeleton rows

## Performance Improvements

| Metric | Before | After |
|--------|--------|-------|
| Network requests on update | Refetch all | None (optimistic) |
| UI update delay | ~200-500ms | Instant |
| Error recovery | No rollback | Auto rollback |
| Cache strategy | Always refetch | 10min staleTime |

## Best Practices Checklist

- [x] Query key factory pattern
- [x] staleTime >= 5 minutes cho settings data
- [x] keepPreviousData để tránh loading flash
- [x] setQueryData thay vì invalidateQueries
- [x] Optimistic updates với rollback
- [x] useCallback cho handlers
- [x] useMemo cho columns definition
- [x] isLoading prop cho SimpleSettingsTable
- [x] Skeleton loading thay vì spinner
- [x] Pagination cho tables > 10 rows
