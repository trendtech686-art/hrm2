# Hướng dẫn UI Patterns cho Settings

> **Tài liệu này** phân loại và hướng dẫn triển khai các trang Settings dựa trên mục đích sử dụng.

---

## 📋 Tổng quan 2 loại Settings Page

| Loại | Mục đích | Ví dụ | Header Actions |
|------|----------|-------|----------------|
| **Config Settings** | Thay đổi các cấu hình, bật/tắt tính năng | Sales Config, Employee Settings | `Lưu cài đặt` / `Lưu thay đổi` |
| **Entity Management** | CRUD danh sách các đối tượng | Nguồn bán hàng, Tỉnh thành, Đơn vị | `Thêm [entity]`, `Nhập file`, `Xuất file` |

---

## 🔧 Loại 1: Config Settings (Thiết lập cấu hình)

### Đặc điểm

- **Mục đích**: Thay đổi các thiết lập hệ thống (bật/tắt tính năng, chọn giá trị mặc định)
- **UI Pattern**: Form với các Switch, Select, Input
- **Action chính**: Nút **"Lưu cài đặt"** hoặc **"Lưu thay đổi"** ở header
- **State**: Sử dụng Zustand store để lưu trữ settings

### Ví dụ tham khảo

📁 `features/settings/sales/sales-management-settings.tsx`

```
┌─────────────────────────────────────────────────────────────┐
│ 📌 Thiết lập quản lý bán hàng              [ 💾 Lưu cài đặt ] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Thiết lập quản lý bán hàng                          │   │
│  │ Áp dụng mặc định phương thức thanh toán...          │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │                                                     │   │
│  │  In nhiều liên hoá đơn:  [ In 1 liên ▼ ]           │   │
│  │                                                     │   │
│  │  Cho phép hủy đơn sau xuất kho       ────○ OFF     │   │
│  │  Cho phép tạo đơn đặt hàng âm        ○──── ON      │   │
│  │  Cho phép duyệt đơn âm               ────○ OFF     │   │
│  │  Cho phép đóng gói phiếu âm          ────○ OFF     │   │
│  │  Cho phép xuất kho âm                ────○ OFF     │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Cấu trúc code

```tsx
// 1. Header Actions - Chỉ có nút Lưu
const headerActions = React.useMemo(() => [
  <SettingsActionButton key="save" onClick={handleSaveSettings}>
    <Save className="mr-2 h-4 w-4" />
    Lưu cài đặt
  </SettingsActionButton>,
], [handleSaveSettings]);

// 2. UI Components
<Card>
  <CardHeader>
    <CardTitle>Thiết lập quản lý bán hàng</CardTitle>
    <CardDescription>Mô tả ngắn về nhóm settings</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Sử dụng Switch thay vì Checkbox cho boolean */}
    <div className="flex items-center justify-between">
      <Label>Cho phép hủy đơn sau khi xuất kho</Label>
      <Switch checked={...} onCheckedChange={...} />
    </div>
    
    {/* Sử dụng Select cho lựa chọn */}
    <Select value={...} onValueChange={...}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="1">In 1 liên</SelectItem>
      </SelectContent>
    </Select>
  </CardContent>
</Card>
```

### Khi nào dùng?

✅ Bật/tắt tính năng hệ thống  
✅ Cấu hình mặc định (payment method, shipping, pricing)  
✅ Thiết lập thông tin cửa hàng  
✅ Cài đặt chấm công, nghỉ phép, lương  

---

## 📦 Loại 2: Entity Management (Quản lý danh sách)

### Đặc điểm

- **Mục đích**: Thêm/sửa/xóa các đối tượng trong danh sách
- **UI Pattern**: Table với các row, mỗi row có actions (Edit, Delete)
- **Action chính**: Nút **"Thêm [entity]"** ở header
- **Inline edit**: Một số cột có thể edit trực tiếp (Switch cho boolean)
- **State**: Sử dụng Zustand store với CRUD methods

### Ví dụ tham khảo

📁 `features/settings/sales-channels/page-content.tsx`

```
┌──────────────────────────────────────────────────────────────────┐
│ 📌 Quản lý nguồn bán hàng              [ ➕ Thêm nguồn bán hàng ] │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Bên cạnh một số nguồn phổ biến...                              │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Mã nguồn   │ Tên nguồn    │ Trạng thái │ Mặc định │ ⋮     │ │
│  ├────────────┼──────────────┼────────────┼──────────┼────────┤ │
│  │ POS        │ Bán tại quầy │ [Đang dùng]│ ○────    │ [⋮]   │ │
│  │ WEB        │ Website      │ [Đang dùng]│ ────○    │ [⋮]   │ │
│  │ APP        │ Ứng dụng     │ [Tạm tắt]  │ ────○    │ [⋮]   │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

       ┌─────────────┐
  [⋮] → │ ✏️ Sửa      │  ← Dropdown Menu với 3 dots
       │ 🗑️ Xóa      │
       └─────────────┘
```

### Cấu trúc code

```tsx
// 1. Header Actions - Có nút Thêm (+ Import/Export nếu cần)
const headerActions = React.useMemo(() => [
  <SettingsActionButton key="import" variant="outline" onClick={handleImport}>
    <Upload className="h-4 w-4" />
    Nhập file
  </SettingsActionButton>,
  <SettingsActionButton key="export" variant="outline" onClick={handleExport}>
    <Download className="h-4 w-4" />
    Xuất file
  </SettingsActionButton>,
  <SettingsActionButton key="add" onClick={handleAddNew}>
    <PlusCircle className="h-4 w-4" />
    Thêm nguồn bán hàng
  </SettingsActionButton>,
], [handleImport, handleExport, handleAddNew]);

// 2. Table với Actions column sử dụng Dropdown Menu
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Mã</TableHead>
      <TableHead>Tên</TableHead>
      <TableHead>Trạng thái</TableHead>
      <TableHead>Mặc định</TableHead>
      <TableHead className="w-[80px] text-right">Hành động</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map((item) => (
      <TableRow key={item.systemId}>
        <TableCell>{item.id}</TableCell>
        <TableCell>{item.name}</TableCell>
        <TableCell>
          <Badge variant={item.isApplied ? "default" : "secondary"}>
            {item.isApplied ? "Đang dùng" : "Tạm tắt"}
          </Badge>
        </TableCell>
        <TableCell>
          {/* Inline Switch cho boolean columns */}
          <Switch 
            checked={item.isDefault} 
            onCheckedChange={(checked) => handleToggle(item, checked)}
          />
        </TableCell>
        <TableCell className="text-right">
          {/* Dropdown Menu với 3 dots */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(item)}>
                <Pencil className="mr-2 h-4 w-4" />
                Sửa
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleDelete(item.systemId)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

// 3. Dialog cho Add/Edit form
<Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>
        {editingItem ? 'Cập nhật nguồn bán hàng' : 'Thêm nguồn bán hàng'}
      </DialogTitle>
    </DialogHeader>
    <EntityForm initialData={editingItem} onSubmit={handleFormSubmit} />
  </DialogContent>
</Dialog>

// 4. AlertDialog cho xác nhận xóa
<AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
  <AlertDialogContent>
    <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
    <AlertDialogDescription>Hành động này không thể hoàn tác.</AlertDialogDescription>
    <AlertDialogFooter>
      <AlertDialogCancel>Hủy</AlertDialogCancel>
      <AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Khi nào dùng?

✅ Quản lý nguồn bán hàng (sales channels)  
✅ Quản lý tỉnh thành, quận huyện, phường xã  
✅ Quản lý đơn vị tính  
✅ Quản lý phương thức thanh toán  
✅ Quản lý loại nghỉ phép  
✅ Quản lý các danh mục (categories)  

---

## 🔄 Loại Kết hợp (Hybrid)

Một số trang có cả 2 loại, ví dụ: **Employee Settings**

📁 `features/settings/employees/employee-settings-page.tsx`

```
┌──────────────────────────────────────────────────────────────────┐
│ 📌 Cài đặt nhân viên            [ Hủy ] [ 💾 Lưu thay đổi ]     │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ 🕐 Chấm công & Thời gian làm việc                        │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  Giờ vào:  [08:00]    Giờ tan: [17:00]   Nghỉ trưa: [60] │   │
│  │  Ngày làm việc: ☑T2 ☑T3 ☑T4 ☑T5 ☑T6 ☐T7 ☐CN            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ 📋 Quản lý Nghỉ phép                                     │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  Số ngày phép/năm: [12]                                  │   │
│  │  ────────────────────────────────────────                │   │
│  │  Danh sách loại phép    [ ➕ Thêm loại phép ]            │   │
│  │  ┌─────────┬────────┬──────────┬─────────┬─────────┐    │   │
│  │  │ Tên     │ Số ngày│ Hưởng lương│ Y/C File │ ⋮       │    │   │
│  │  ├─────────┼────────┼──────────┼─────────┼─────────┤    │   │
│  │  │ Phép năm│ 12     │ ○────    │ ────○   │ [⋮]     │    │   │
│  │  │ Thai sản│ 180    │ ○────    │ ○────   │ [⋮]     │    │   │
│  │  └─────────┴────────┴──────────┴─────────┴─────────┘    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Đặc điểm Hybrid

- **Header có nút "Lưu thay đổi"** (vì có config settings)
- **Bên trong có Table với nút "Thêm"** (cho entity list)
- Table là một phần của form, dữ liệu được lưu cùng lúc

---

## 🎨 UI Guidelines

### 1. Switch vs Checkbox

| Component | Khi nào dùng |
|-----------|--------------|
| **Switch** | Bật/tắt tính năng, có hiệu lực ngay hoặc inline trong table |
| **Checkbox** | Multi-select, danh sách lựa chọn (VD: ngày làm việc) |

### 2. Actions Column trong Table

```tsx
// ✅ Dùng Dropdown Menu với icon 3 dots
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon" className="h-8 w-8">
      <MoreHorizontal className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem>
      <Pencil className="mr-2 h-4 w-4" />
      Sửa
    </DropdownMenuItem>
    <DropdownMenuItem className="text-destructive">
      <Trash2 className="mr-2 h-4 w-4" />
      Xóa
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

// ❌ Không dùng nhiều button riêng lẻ
<Button onClick={handleEdit}>Sửa</Button>
<Button onClick={handleDelete}>Xóa</Button>
```

### 3. Toast Notifications

```tsx
// Sử dụng sonner cho tất cả toast
import { toast } from 'sonner';

// Success
toast.success('Đã lưu cài đặt thành công');

// Error với description
toast.error('Lỗi khi đọc file', {
  description: 'File không hợp lệ'
});

// Info
toast.info('Thông báo', {
  description: 'Chi tiết...'
});
```

### 4. Card Layout

```tsx
<Card>
  <CardHeader>
    <CardTitle>Tiêu đề nhóm settings</CardTitle>
    <CardDescription>Mô tả ngắn (1-2 dòng)</CardDescription>
  </CardHeader>
  <CardContent className="space-y-6">
    {/* Nội dung */}
  </CardContent>
</Card>
```

---

## 📁 Tham khảo Files

| Loại | File |
|------|------|
| **Config Settings** | `features/settings/sales/sales-management-settings.tsx` |
| **Config Settings** | `features/settings/store-info/store-info-page.tsx` |
| **Entity Management** | `features/settings/sales-channels/page-content.tsx` |
| **Entity Management** | `features/settings/provinces/page.tsx` |
| **Hybrid** | `features/settings/employees/employee-settings-page.tsx` |

---

## ✅ Checklist khi tạo Settings Page mới

### Config Settings Page

- [ ] Có nút "Lưu cài đặt" / "Lưu thay đổi" ở header
- [ ] Sử dụng Switch thay vì Checkbox cho boolean
- [ ] Có CardHeader với Title và Description
- [ ] Sử dụng Zustand store cho state
- [ ] Toast success khi lưu thành công

### Entity Management Page

- [ ] Có nút "Thêm [entity]" ở header
- [ ] Table với cột Hành động dùng Dropdown Menu (3 dots)
- [ ] Boolean columns sử dụng Switch inline
- [ ] Dialog cho Add/Edit form
- [ ] AlertDialog cho confirm xóa
- [ ] Toast thông báo sau mỗi action

---

*Cập nhật: 2025-11-28*
