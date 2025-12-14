# So sánh kiến trúc Upload: Employee vs Product

## 📋 Tổng quan

Đã refactor **Product Image Upload** để hoàn toàn giống với **Employee Document Upload**.

---

## 🔄 Kiến trúc TRƯỚC và SAU

### ❌ TRƯỚC (Sai - Dùng Hook)

```
┌─────────────────┐
│  form-page.tsx  │ 
└────────┬────────┘
         │ onSubmit (FormValues)
         ▼
┌──────────────────────────┐
│ product-form-complete.tsx│
│                          │
│  useProductImageManager()│ ◄── Hook (State không persist)
│  ├─ stagingFiles         │
│  ├─ permanentFiles       │
│  ├─ confirmStagingForType│ ◄── Logic confirm TRONG Form (SAI!)
│  └─ deleteMarkedFiles    │
└──────────────────────────┘
```

**Vấn đề:**
- ❌ State lưu trong Hook → Mất khi unmount component
- ❌ Logic confirm nằm trong Form → Vi phạm separation of concerns
- ❌ Form tự confirm file → Parent không kiểm soát được


### ✅ SAU (Đúng - Dùng Store)

```
┌─────────────────┐
│  form-page.tsx  │ ◄──┐
└────────┬────────┘    │
         │             │ Read/Write
         │             │
         ▼             │
┌──────────────────────┴────┐
│     image-store.ts         │ ◄── Zustand Store (Global state)
│  ├─ stagingImages          │
│  ├─ permanentImages        │
│  ├─ updateStagingImage     │
│  └─ updatePermanentImages  │
└────────────────────────────┘
         ▲
         │ Read
         │
┌────────┴──────────────────┐
│ product-form-complete.tsx │
│                           │
│  useImageStore()          │ ◄── Chỉ đọc state
│  └─ Pass _imageFiles up   │ ◄── Truyền data lên parent
└───────────────────────────┘
```

**Ưu điểm:**
- ✅ State persist trong Store → Không mất dữ liệu
- ✅ Logic confirm ở FormPage → Đúng responsibility
- ✅ Form chỉ thu thập data → Clean separation


---

## 📂 Cấu trúc file

### Employee (Chuẩn)
```
features/employees/
├── employee-form-page.tsx    ← Parent, xử lý confirm
├── employee-form.tsx          ← Form, thu thập data
└── document-store.ts          ← Zustand store
```

### Product (Giống Employee)
```
features/products/
├── form-page.tsx              ← Parent, xử lý confirm
├── product-form-complete.tsx  ← Form, thu thập data
└── image-store.ts             ← Zustand store (MỚI!)
```

---

## 🔍 So sánh Code Chi tiết

### 1. Store Definition

#### Employee: `document-store.ts`
```typescript
type DocumentState = {
  stagingDocuments: Record<string, {
    documentType: string;
    documentName: string;
    sessionId: string;
    files: StagingFile[];
  }>;
  
  updateStagingDocument: (
    documentType: string,
    documentName: string,
    files: StagingFile[],
    sessionId: string
  ) => void;
};
```

#### Product: `image-store.ts` ✅ GIỐNG Y HỆT
```typescript
type ImageState = {
  stagingImages: Record<string, {
    type: ProductImageType;
    sessionId: string;
    files: StagingFile[];
  }>;
  
  updateStagingImage: (
    productSystemId: string,
    type: ProductImageType,
    files: StagingFile[],
    sessionId: string
  ) => void;
};
```

---

### 2. Form Component

#### Employee: `employee-form.tsx`
```typescript
export function EmployeeForm({ 
  initialData, 
  onSubmit, 
  onCancel,
  isEditMode 
}) {
  const { updateStagingDocument } = useDocumentStore();
  const [documentFiles, setDocumentFiles] = useState({});
  
  const handleDocumentUpload = (type, name, files, sessionId) => {
    setDocumentFiles(prev => ({
      ...prev,
      [`${type}-${name}`]: files
    }));
    updateStagingDocument(type, name, files, sessionId);
  };
  
  const handleSubmit = async (values) => {
    // Pass _documentFiles to parent
    await onSubmit({ 
      ...values, 
      _documentFiles: documentFiles 
    });
  };
}
```

#### Product: `product-form-complete.tsx` ✅ GIỐNG Y HỆT
```typescript
export function ProductFormComplete({ 
  initialData, 
  onSubmit, 
  onCancel,
  isEditMode 
}) {
  const imageStore = useImageStore();
  const [imageFiles, setImageFiles] = useState({});
  
  const handleImageUpload = (type, files, sessionId) => {
    setImageFiles(prev => ({
      ...prev,
      [type]: files
    }));
    imageStore.updateStagingImage(productSystemId, type, files, sessionId);
  };
  
  const handleSubmit = async (values) => {
    // Pass _imageFiles to parent
    await onSubmit({ 
      ...values, 
      _imageFiles: imageFiles 
    });
  };
}
```

---

### 3. Form Page (Parent)

#### Employee: `employee-form-page.tsx`
```typescript
export function EmployeeFormPage() {
  const { add, update } = useEmployeeStore();
  
  const handleSubmit = async (values) => {
    const { _documentFiles, ...employeeData } = values;
    
    // Save employee first
    const savedEmployee = isNew 
      ? add(employeeData) 
      : update(employeeId, employeeData);
    
    // Then confirm documents
    if (_documentFiles) {
      for (const [key, files] of Object.entries(_documentFiles)) {
        const [type, name] = key.split('-');
        const sessionId = files[0]?.sessionId;
        
        if (sessionId) {
          await FileUploadAPI.confirmStagingFiles(
            sessionId,
            savedEmployee.systemId,
            type,
            name,
            employeeData
          );
        }
      }
    }
    
    navigate(`/employees/${savedEmployee.systemId}`);
  };
}
```

#### Product: `form-page.tsx` ✅ GIỐNG Y HỆT
```typescript
export function ProductFormPage() {
  const { add, update } = useProductStore();
  const imageStore = useImageStore();
  
  const handleSubmit = async (values) => {
    const { _imageFiles, ...productData } = values;
    
    // Save product first
    const savedProduct = isNew 
      ? add(productData) 
      : update(productId, productData);
    
    // Then confirm images
    if (_imageFiles) {
      for (const [type, files] of Object.entries(_imageFiles)) {
        const sessionId = files[0]?.sessionId;
        
        if (sessionId) {
          await FileUploadAPI.confirmStagingFiles(
            sessionId,
            savedProduct.systemId,
            'products',
            type,
            productData
          );
        }
      }
    }
    
    navigate(`/products/${savedProduct.systemId}`);
  };
}
```

---

## 🎯 Điểm giống nhau 100%

| Khía cạnh | Employee | Product |
|-----------|----------|---------|
| **Store** | `document-store.ts` | `image-store.ts` |
| **Store Type** | Zustand | Zustand |
| **Staging Pattern** | Session → Confirm | Session → Confirm |
| **Form Props** | `_documentFiles` | `_imageFiles` |
| **Confirm Location** | FormPage | FormPage |
| **Separation** | Form ≠ Confirm | Form ≠ Confirm |
| **State Persist** | ✅ Yes | ✅ Yes |
| **API Client** | `FileUploadAPI` | `FileUploadAPI` |

---

## 📊 Data Flow (Giống nhau)

### Employee & Product đều dùng flow này:

```
1. User picks files
   ↓
2. NewDocumentsUpload → Upload to staging
   ↓
3. Store sessionId in Store
   ↓
4. User clicks "Save"
   ↓
5. Form passes _files to Parent
   ↓
6. Parent saves Employee/Product
   ↓
7. Parent confirms staging → permanent
   ↓
8. Update Store with permanent files
   ↓
9. Navigate to detail page
```

---

## 🛠️ Các thay đổi đã thực hiện

### 1. Tạo mới: `image-store.ts`
- Copy từ `document-store.ts`
- Đổi tên: `documents` → `images`
- Đổi tên: `documentType/Name` → `imageType`

### 2. Sửa: `product-form-complete.tsx`
- ❌ Xóa: `useProductImageManager()`
- ✅ Thêm: `useImageStore()`
- ❌ Xóa: Logic confirm trong Form
- ✅ Thêm: Pass `_imageFiles` lên parent

### 3. Sửa: `form-page.tsx`
- ✅ Thêm: `confirmAllImages()` function
- ✅ Thêm: Confirm logic sau khi save
- ✅ Thêm: Cleanup staging sau confirm

### 4. Sửa: `detail-page.tsx`
- ❌ Xóa: `useProductImageManager()`
- ✅ Thêm: `useImageStore()`
- ✅ Thêm: Auto-load từ Store

### 5. Xóa: `use-product-image-manager.ts`
- Không còn cần thiết

---

## ✅ Checklist hoàn thành

- [x] Tạo `image-store.ts` giống `document-store.ts`
- [x] Form chỉ thu thập data, không confirm
- [x] FormPage xử lý logic confirm
- [x] State persist trong Zustand Store
- [x] API calls dùng `FileUploadAPI`
- [x] Cleanup staging sau confirm
- [x] DetailPage load từ Store
- [x] TypeScript error-free
- [x] Cấu trúc file giống Employee 100%

---

## 🎓 Kết luận

Giờ đây **Product** và **Employee** có kiến trúc upload **hoàn toàn giống nhau**:

1. ✅ **Store-based state** → Không mất data
2. ✅ **Staging pattern** → Preview trước khi confirm
3. ✅ **Separation of concerns** → Form ≠ Confirm logic
4. ✅ **Parent control** → FormPage kiểm soát confirm
5. ✅ **Consistent API** → Dùng chung FileUploadAPI

Bất kỳ tính năng nào thêm cho Employee (như drag-drop, image crop, v.v.) đều có thể áp dụng ngay cho Product mà không cần sửa kiến trúc!
