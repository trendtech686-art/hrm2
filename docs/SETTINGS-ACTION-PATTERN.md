# Pattern chuẩn cho Settings Page Actions

## ❌ SAI - Gây stale closure

```tsx
const handleAddNew = React.useCallback(() => {
  setEditingItem(null);
  setIsFormOpen(true);
}, []);

React.useEffect(() => {
  if (!isActive) return;
  onRegisterActions([
    <Button onClick={handleAddNew}>Thêm mới</Button>
  ]);
}, [handleAddNew, isActive, onRegisterActions]);
```

**Vấn đề:** Button được cache với `handleAddNew` cũ. Sau khi data thay đổi, click không hoạt động.

---

## ✅ ĐÚNG - Pattern chuẩn với Ref (update mỗi render)

```tsx
// 1. State đơn giản
const [isFormOpen, setIsFormOpen] = React.useState(false);
const [editingItem, setEditingItem] = React.useState<ItemType | null>(null);

// 2. Handler định nghĩa TRƯỚC
const openAddForm = () => {
  setEditingItem(null);
  setIsFormOpen(true);
};

// 3. Ref được UPDATE MỖI RENDER để luôn có handler mới nhất
const actionsRef = React.useRef({ openAddForm });
actionsRef.current.openAddForm = openAddForm; // ⚠️ QUAN TRỌNG: update mỗi render!

// 4. Register actions với wrapper function
React.useEffect(() => {
  if (!isActive) return;
  onRegisterActions([
    <SettingsActionButton key="add" onClick={() => actionsRef.current.openAddForm()}>
      <Plus className="mr-2 h-4 w-4" /> Thêm mới
    </SettingsActionButton>
  ]);
}, [isActive, onRegisterActions]);
```

**Tại sao hoạt động:** 
- `actionsRef.current.openAddForm` được update mỗi render với function mới nhất
- Button wrapper `() => actionsRef.current.openAddForm()` sẽ gọi đúng function

---

## ✅ ĐÚNG - Pattern còn đơn giản hơn (không cần Ref)

Nếu component re-render đúng, chỉ cần đảm bảo `onRegisterActions` được gọi lại:

```tsx
const [isFormOpen, setIsFormOpen] = React.useState(false);
const [editingItem, setEditingItem] = React.useState<ItemType | null>(null);

// Đơn giản - không cần useCallback
const openAddForm = () => {
  setEditingItem(null);
  setIsFormOpen(true);
};

// Force re-register mỗi render khi isActive
React.useEffect(() => {
  if (!isActive) return;
  onRegisterActions([
    <SettingsActionButton key="add" onClick={openAddForm}>
      <Plus className="mr-2 h-4 w-4" /> Thêm mới
    </SettingsActionButton>
  ]);
}); // Không có dependency = re-register mỗi render
```

**Nhưng cách này có thể gây re-render loop** nếu `onRegisterActions` trigger state change.

---

## 🎯 PATTERN CHUẨN CUỐI CÙNG

```tsx
export function SettingsPageContent({ isActive, onRegisterActions }: Props) {
  // === STATE ===
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<ItemType | null>(null);
  
  // === DATA ===
  const { data: queryData } = useItems({});
  const data = React.useMemo(() => queryData?.data ?? [], [queryData?.data]);
  const { create, update, remove } = useItemMutations({
    onSuccess: () => toast.success("Thao tác thành công"),
    onError: (err) => toast.error(err.message),
  });

  // === ACTIONS REF (để tránh stale closure) ===
  const actionsRef = React.useRef({
    openAddForm: () => {
      setEditingItem(null);
      setIsFormOpen(true);
    },
  });

  // === REGISTER HEADER ACTIONS ===
  React.useEffect(() => {
    if (!isActive) return;
    onRegisterActions([
      <SettingsActionButton 
        key="add" 
        onClick={() => actionsRef.current.openAddForm()}
      >
        <Plus className="mr-2 h-4 w-4" /> Thêm mới
      </SettingsActionButton>
    ]);
  }, [isActive, onRegisterActions]);

  // === HANDLERS ===
  const handleEdit = (item: ItemType) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (values: FormValues) => {
    const payload = normalizeValues(values);
    if (editingItem) {
      update.mutate({ systemId: editingItem.systemId, data: payload });
    } else {
      create.mutate(payload);
    }
    setIsFormOpen(false);
  };

  // === RENDER ===
  return (
    <div className="space-y-4">
      <SimpleSettingsTable
        data={data}
        columns={columns}
        // ...
      />
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        {/* Form */}
      </Dialog>
    </div>
  );
}
```

---

## Checklist

- [ ] Dùng `actionsRef.current.xxx()` trong onClick của action buttons
- [ ] KHÔNG dùng `useCallback` cho handlers đơn giản
- [ ] KHÔNG dùng `mutateAsync`, chỉ dùng `mutate`
- [ ] Đóng form ngay sau khi gọi mutate
- [ ] `onRegisterActions` chỉ depend on `[isActive, onRegisterActions]`
