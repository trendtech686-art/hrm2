# 📸 HỆ THỐNG UPLOAD HÌNH ẢNH - TÀI LIỆU THAM KHẢO

> **Mục đích**: Tài liệu chi tiết về hệ thống upload hình ảnh của module Bảo hành (Warranty), dùng để tham khảo khi triển khai cho các module khác.

---

## 📋 MỤC LỤC

1. [Tổng Quan Kiến Trúc](#1-tổng-quan-kiến-trúc)
2. [Frontend - Component & State](#2-frontend---component--state)
3. [Frontend - Submit Flow](#3-frontend---submit-flow)
4. [Server - API Endpoints](#4-server---api-endpoints)
5. [Database Schema](#5-database-schema)
6. [Directory Structure](#6-directory-structure)
7. [CRUD Operations Chi Tiết](#7-crud-operations-chi-tiết)
8. [Checklist Triển Khai](#8-checklist-triển-khai)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. TỔNG QUAN KIẾN TRÚC

### 🎯 Nguyên Tắc Hoạt Động

Hệ thống sử dụng **Two-Phase Commit Pattern**:

```
[User Upload] → [Staging Area] → [User Confirm/Submit] → [Permanent Storage]
     ↓                ↓                    ↓                      ↓
  Browser       Temp Folder          Move + Update DB        Final Location
```

### 🔑 Khái Niệm Quan Trọng

1. **Staging Files**: Files tạm thời, chưa xác nhận
   - Lưu ở: `uploads/staging/{sessionId}/`
   - Trạng thái: `status = 'staging'`
   - Có thể bị xóa nếu user hủy

2. **Permanent Files**: Files đã xác nhận
   - Lưu ở: `uploads/permanent/{entity}/{entityId}/{imageType}/`
   - Trạng thái: `status = 'permanent'`
   - Gắn với entity cụ thể (warranty, complaint, etc.)

3. **Session ID**: UUID để nhóm các files trong 1 lần upload
   - Tạo khi user upload file đầu tiên
   - Dùng để xóa hàng loạt khi cancel
   - Dùng để confirm hàng loạt khi submit

### 🏗️ Luồng Dữ Liệu

```
┌─────────────────┐
│  NewDocuments   │ ← Component UI
│     Upload      │
└────────┬────────┘
         │ onChange(files)
         ↓
┌─────────────────┐
│  State Layer    │ ← receivedStagingFiles[], sessionId
└────────┬────────┘
         │ On Upload
         ↓
┌─────────────────┐
│ FileUploadAPI   │ ← POST /api/staging/upload
│  .uploadFiles() │
└────────┬────────┘
         │ Returns StagingFile[]
         ↓
┌─────────────────┐
│  SQLite DB      │ ← status='staging', session_id
│   + Disk        │    uploads/staging/{sessionId}/
└─────────────────┘
         │ On Submit (confirmStagingFiles)
         ↓
┌─────────────────┐
│ Server Confirm  │ ← Move files, update DB
│    Endpoint     │
└────────┬────────┘
         │ Returns permanent URLs
         ↓
┌─────────────────┐
│  Permanent DB   │ ← status='permanent', employee_id={warrantyId}
│   + Disk        │    uploads/permanent/warranty/{id}/{type}/
└─────────────────┘
```

---

## 2. FRONTEND - COMPONENT & STATE

### 📦 Component Sử Dụng

**File**: `components/ui/new-documents-upload.tsx`

```tsx
import { NewDocumentsUpload, type StagingFile } from '@/components/ui/new-documents-upload';
```

### 🎛️ State Management Pattern

**Module Bảo hành có 2 loại hình**: `received` (lúc nhận) và `processed` (sau xử lý)

```typescript
// ============ RECEIVED IMAGES ============
// Files đã tồn tại (permanent)
const [receivedPermanentFiles, setReceivedPermanentFiles] = useState<StagingFile[]>([]);

// Files mới upload (staging)
const [receivedStagingFiles, setReceivedStagingFiles] = useState<StagingFile[]>([]);

// Session ID cho nhóm files staging
const [receivedSessionId, setReceivedSessionId] = useState<string | null>(null);

// Danh sách ID của files cần xóa
const [receivedFilesToDelete, setReceivedFilesToDelete] = useState<string[]>([]);

// ============ PROCESSED IMAGES ============
const [processedPermanentFiles, setProcessedPermanentFiles] = useState<StagingFile[]>([]);
const [processedStagingFiles, setProcessedStagingFiles] = useState<StagingFile[]>([]);
const [processedSessionId, setProcessedSessionId] = useState<string | null>(null);
const [processedFilesToDelete, setProcessedFilesToDelete] = useState<string[]>([]);
```

### 📝 Type StagingFile

```typescript
export interface StagingFile {
  id: string;              // UUID
  name: string;            // Tên hiển thị
  originalName: string;    // Tên gốc
  slug: string;            // URL-safe slug
  filename: string;        // Tên file hệ thống
  size: number;            // Kích thước (bytes)
  type: string;            // MIME type
  url: string;             // URL để hiển thị/download
  status: 'staging' | 'permanent';
  sessionId: string;       // Nhóm upload
  uploadedAt: string;      // ISO timestamp
  metadata: string;        // JSON metadata
}
```

### 🎨 Component Usage Example

```tsx
<FormItem>
  <FormLabel>Hình ảnh lúc nhận hàng</FormLabel>
  <FormDescription>
    Upload ảnh sản phẩm khi nhận từ khách hàng
  </FormDescription>
  <NewDocumentsUpload
    accept={{
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    }}
    maxSize={10 * 1024 * 1024}  // 10MB
    maxFiles={50}
    value={[
      ...receivedPermanentFiles,
      ...receivedStagingFiles
    ]}
    onChange={(files) => {
      // Tách permanent và staging
      const permanent = files.filter(f => f.status === 'permanent');
      const staging = files.filter(f => f.status === 'staging');
      setReceivedPermanentFiles(permanent);
      setReceivedStagingFiles(staging);
    }}
    sessionId={receivedSessionId}
    onSessionChange={setReceivedSessionId}
  />
</FormItem>
```

### 🔄 Convert Existing URLs to StagingFile

**Khi load dữ liệu cũ** (edit mode):

```typescript
// Helper function
const urlToStagingFile = (
  url: string, 
  index: number, 
  metadata?: string
): StagingFile => ({
  id: `existing-${index}-${Date.now()}`,
  name: url.split('/').pop() || `file-${index}`,
  originalName: url.split('/').pop() || `file-${index}`,
  slug: url.split('/').pop() || `file-${index}`,
  filename: url.split('/').pop() || `file-${index}`,
  size: 0,
  type: 'image/jpeg',
  url: url,
  status: 'permanent' as const,
  sessionId: '',
  uploadedAt: new Date().toISOString(),
  metadata: metadata || ''
});

// Load existing images
useEffect(() => {
  if (ticket?.receivedImages && ticket.receivedImages.length > 0) {
    const stagingFiles: StagingFile[] = ticket.receivedImages.map((url, idx) => 
      urlToStagingFile(url, idx)
    );
    setReceivedPermanentFiles(stagingFiles);
  }
  
  if (ticket?.processedImages && ticket.processedImages.length > 0) {
    const stagingFiles: StagingFile[] = ticket.processedImages.map((url, idx) => 
      urlToStagingFile(url, idx)
    );
    setProcessedPermanentFiles(stagingFiles);
  }
}, [ticket]);
```

---

## 3. FRONTEND - SUBMIT FLOW

### 🚀 Submit Handler Overview

```typescript
const onSubmit = async (values: FormValues) => {
  try {
    // ===== BƯỚC 1: TẠO/CẬP NHẬT TICKET =====
    let targetWarrantyId = ticket?.id;
    
    if (!targetWarrantyId) {
      // Create new ticket first
      const response = await fetch('/api/warranty', {
        method: 'POST',
        body: JSON.stringify(values)
      });
      const data = await response.json();
      targetWarrantyId = data.id;
    }

    // ===== BƯỚC 2: XỬ LÝ RECEIVED IMAGES =====
    let finalReceivedImageUrls: string[] = [];
    
    // 2.1: Lọc bỏ files bị đánh dấu xóa
    const cleanedReceivedFiles = receivedPermanentFiles.filter(
      file => !receivedFilesToDelete.includes(file.id)
    );
    
    // 2.2: Confirm staging files (nếu có)
    if (receivedSessionId && receivedStagingFiles.length > 0) {
      const warrantyInfo = {
        customerName: values.customerName,
        customerPhone: values.customerPhone,
        trackingCode: values.trackingCode
      };
      
      const confirmedFiles = await FileUploadAPI.confirmStagingFiles(
        receivedSessionId,
        targetWarrantyId,
        'warranty',
        'received',
        warrantyInfo
      );
      
      // Combine permanent + newly confirmed
      finalReceivedImageUrls = [
        ...cleanedReceivedFiles.map(f => f.url),
        ...confirmedFiles.map(f => f.url)
      ];
    } else {
      // Không có staging files mới
      finalReceivedImageUrls = cleanedReceivedFiles.map(f => f.url);
    }

    // ===== BƯỚC 3: XỬ LÝ PROCESSED IMAGES =====
    let finalProcessedImageUrls: string[] = [];
    
    const cleanedProcessedFiles = processedPermanentFiles.filter(
      file => !processedFilesToDelete.includes(file.id)
    );
    
    if (processedSessionId && processedStagingFiles.length > 0) {
      const confirmedFiles = await FileUploadAPI.confirmStagingFiles(
        processedSessionId,
        targetWarrantyId,
        'warranty',
        'processed',
        warrantyInfo
      );
      
      finalProcessedImageUrls = [
        ...cleanedProcessedFiles.map(f => f.url),
        ...confirmedFiles.map(f => f.url)
      ];
    } else {
      finalProcessedImageUrls = cleanedProcessedFiles.map(f => f.url);
    }

    // ===== BƯỚC 4: CẬP NHẬT TICKET VỚI IMAGE URLS =====
    await fetch(`/api/warranty/${targetWarrantyId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        ...values,
        receivedImages: finalReceivedImageUrls,
        processedImages: finalProcessedImageUrls
      })
    });

    toast.success('Lưu phiếu bảo hành thành công');
    navigate(`/warranty/${targetWarrantyId}`);
    
  } catch (error) {
    toast.error('Có lỗi xảy ra');
  }
};
```

### 🔍 Chi Tiết Các Bước

#### Bước 1: Create/Update Entity

```typescript
// QUAN TRỌNG: Phải có ID của entity trước khi confirm images
let targetWarrantyId = ticket?.id;

if (!targetWarrantyId) {
  // Tạo mới warranty
  const response = await fetch('/api/warranty', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName: values.customerName,
      customerPhone: values.customerPhone,
      trackingCode: values.trackingCode,
      // ... các field khác
      // ❌ CHƯA gửi receivedImages và processedImages
    })
  });
  
  const data = await response.json();
  targetWarrantyId = data.id; // Lấy ID mới tạo
}
```

#### Bước 2: Filter Deleted Files

```typescript
// Permanent files đã có sẵn, loại bỏ những cái bị mark để xóa
const cleanedReceivedFiles = receivedPermanentFiles.filter(
  file => !receivedFilesToDelete.includes(file.id)
);

// receivedFilesToDelete được set khi user click nút xóa
// trong NewDocumentsUpload component
```

#### Bước 3: Confirm Staging Files

```typescript
if (receivedSessionId && receivedStagingFiles.length > 0) {
  // Metadata để tạo filename có ý nghĩa
  const warrantyInfo = {
    customerName: values.customerName,
    customerPhone: values.customerPhone,
    trackingCode: values.trackingCode
  };
  
  // Call API confirm
  const confirmedFiles = await FileUploadAPI.confirmStagingFiles(
    receivedSessionId,        // UUID của session
    targetWarrantyId,         // ID của warranty
    'warranty',               // Document type
    'received',               // Document name (image type)
    warrantyInfo             // Metadata
  );
  
  // confirmedFiles = ServerFile[] với URL permanent
  // Ví dụ: /api/files/warranty/{warrantyId}/received/{filename}
}
```

#### Bước 4: Combine URLs

```typescript
// Merge permanent files (đã clean) + newly confirmed files
finalReceivedImageUrls = [
  ...cleanedReceivedFiles.map(f => f.url),
  ...confirmedFiles.map(f => f.url)
];

// Kết quả: Array of strings
// [
//   '/api/files/warranty/123/received/file1.webp',
//   '/api/files/warranty/123/received/file2.webp',
// ]
```

#### Bước 5: Update Entity

```typescript
// Cập nhật warranty với image URLs final
await fetch(`/api/warranty/${targetWarrantyId}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ...values,
    receivedImages: finalReceivedImageUrls,
    processedImages: finalProcessedImageUrls
  })
});
```

---

## 4. SERVER - API ENDPOINTS

### 📡 Endpoint Overview

| Method | Endpoint | Mô Tả |
|--------|----------|-------|
| POST | `/api/staging/upload` | Upload files vào staging |
| POST | `/api/staging/confirm/:sessionId/warranty/:warrantyId/:imageType` | Confirm staging → permanent |
| GET | `/api/files/warranty/:warrantyId/:imageType/:filename` | Serve permanent files |
| DELETE | `/api/files/:fileId` | Xóa permanent file |
| DELETE | `/api/staging/:sessionId` | Xóa toàn bộ staging session |

---

### 1️⃣ POST /api/staging/upload

**Mục đích**: Upload files vào staging area

**Request**:
```javascript
// FormData
const formData = new FormData();
formData.append('files', file1);
formData.append('files', file2);
// Optional: sessionId để group files
formData.append('sessionId', existingSessionId);

fetch('/api/staging/upload', {
  method: 'POST',
  body: formData
});
```

**Server Logic**:
```javascript
app.post('/api/staging/upload', stagingUpload.array('files', 10), (req, res) => {
  try {
    // 1. Generate hoặc lấy sessionId
    const sessionId = req.body.sessionId || uuidv4();
    
    // 2. Tạo thư mục staging
    const stagingPath = path.join(STAGING_DIR, sessionId);
    fs.ensureDirSync(stagingPath);
    
    // 3. Lưu files vào SQLite
    const uploadedFiles = req.files.map(file => {
      const fileId = uuidv4();
      
      db.run(`
        INSERT INTO files (
          id, session_id, original_name, filename, 
          filepath, filesize, mimetype, status, uploaded_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'staging', CURRENT_TIMESTAMP)
      `, [fileId, sessionId, file.originalname, file.filename, 
          file.path, file.size, file.mimetype]);
      
      return {
        id: fileId,
        name: file.originalname,
        filename: file.filename,
        url: `/api/staging/files/${sessionId}/${file.filename}`,
        size: file.size,
        type: file.mimetype,
        status: 'staging',
        sessionId: sessionId
      };
    });
    
    res.json({ success: true, files: uploadedFiles, sessionId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

**Response**:
```json
{
  "success": true,
  "sessionId": "abc-123-def",
  "files": [
    {
      "id": "file-uuid-1",
      "name": "image.jpg",
      "filename": "abc123.jpg",
      "url": "/api/staging/files/abc-123-def/abc123.jpg",
      "size": 102400,
      "type": "image/jpeg",
      "status": "staging",
      "sessionId": "abc-123-def"
    }
  ]
}
```

---

### 2️⃣ POST /api/staging/confirm/:sessionId/warranty/:warrantyId/:imageType

**Mục đích**: Move files từ staging → permanent, update database

**Request**:
```javascript
await fetch(`/api/staging/confirm/${sessionId}/warranty/${warrantyId}/${imageType}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    metadata: {
      customerName: 'Nguyễn Văn A',
      customerPhone: '0123456789',
      trackingCode: 'TK001'
    }
  })
});
```

**Server Logic**:
```javascript
app.post('/api/staging/confirm/:sessionId/warranty/:warrantyId/:imageType', (req, res) => {
  const { sessionId, warrantyId, imageType } = req.params;
  const metadata = req.body.metadata || {};
  
  // 1. Query staging files
  db.all(
    'SELECT * FROM files WHERE session_id = ? AND status = "staging"',
    [sessionId],
    (err, rows) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      if (!rows || rows.length === 0) {
        return res.json({ success: true, files: [] });
      }

      // 2. Tạo thư mục permanent
      const warrantyDir = path.join(PERMANENT_DIR, 'warranty', warrantyId.toString());
      const imageTypeDir = path.join(warrantyDir, imageType);
      fs.ensureDirSync(imageTypeDir);

      const confirmedFiles = [];

      // 3. Move từng file
      rows.forEach((file) => {
        // Generate smart filename
        const ext = path.extname(file.original_name);
        const slugName = slugify(
          `${metadata.customerName || ''}-${metadata.trackingCode || ''}-${Date.now()}`,
          { lower: true, strict: true }
        );
        const newFilename = `${slugName}${ext}`;
        
        const oldPath = file.filepath; // staging path
        const newPath = path.join(imageTypeDir, newFilename);

        // Move file
        try {
          fs.moveSync(oldPath, newPath, { overwrite: true });
        } catch (moveErr) {
          console.error('Error moving file:', moveErr);
          return;
        }

        // 4. Update database
        db.run(`
          UPDATE files SET
            employee_id = ?,
            document_type = 'warranty',
            document_name = ?,
            filename = ?,
            filepath = ?,
            file_slug = ?,
            display_name = ?,
            status = 'permanent',
            confirmed_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `, [
          warrantyId,
          imageType,
          newFilename,
          newPath,
          slugName,
          metadata.customerName || file.original_name,
          file.id
        ]);

        // 5. Build new URL
        const newUrl = `/api/files/warranty/${warrantyId}/${imageType}/${newFilename}`;
        
        confirmedFiles.push({
          id: file.id,
          name: metadata.customerName || file.original_name,
          filename: newFilename,
          url: newUrl,
          size: file.filesize,
          type: file.mimetype,
          status: 'permanent'
        });
      });

      // 6. Cleanup staging directory
      const stagingDir = path.join(STAGING_DIR, sessionId);
      fs.remove(stagingDir, () => {
        // Silent cleanup
      });

      res.json({ success: true, files: confirmedFiles });
    }
  );
});
```

**Response**:
```json
{
  "success": true,
  "files": [
    {
      "id": "file-uuid-1",
      "name": "nguyen-van-a",
      "filename": "nguyen-van-a-tk001-1234567890.jpg",
      "url": "/api/files/warranty/123/received/nguyen-van-a-tk001-1234567890.jpg",
      "size": 102400,
      "type": "image/jpeg",
      "status": "permanent"
    }
  ]
}
```

---

### 3️⃣ GET /api/files/warranty/:warrantyId/:imageType/:filename

**Mục đích**: Serve permanent files

**Server Logic**:
```javascript
app.get('/api/files/warranty/:warrantyId/:imageType/:filename', (req, res) => {
  const { warrantyId, imageType, filename } = req.params;
  
  // Build file path
  const filePath = path.join(
    PERMANENT_DIR,
    'warranty',
    warrantyId.toString(),
    imageType,
    filename
  );
  
  // Check file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ 
      success: false, 
      message: 'File không tồn tại' 
    });
  }
  
  // Serve file
  res.sendFile(filePath);
});
```

**Usage**:
```html
<img src="/api/files/warranty/123/received/file.jpg" alt="Received Image" />
```

---

### 4️⃣ DELETE /api/files/:fileId

**Mục đích**: Xóa permanent file (cả database và disk)

**Server Logic**:
```javascript
app.delete('/api/files/:fileId', (req, res) => {
  const { fileId } = req.params;
  
  // 1. Query file info
  db.get('SELECT * FROM files WHERE id = ?', [fileId], (err, row) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'File không tồn tại' });

    // 2. Delete physical file
    fs.remove(row.filepath, (fsErr) => {
      // Silent cleanup (continue even if file delete fails)
      
      // 3. Delete database record
      db.run('DELETE FROM files WHERE id = ?', [fileId], function(dbErr) {
        if (dbErr) return res.status(500).json({ success: false, error: dbErr.message });
        
        res.json({ 
          success: true, 
          message: 'Đã xóa file thành công',
          deletedRows: this.changes 
        });
      });
    });
  });
});
```

---

### 5️⃣ DELETE /api/staging/:sessionId

**Mục đích**: Xóa toàn bộ staging session (khi user cancel)

**Server Logic**:
```javascript
app.delete('/api/staging/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  
  // 1. Delete database records
  db.run(
    'DELETE FROM files WHERE session_id = ? AND status = "staging"',
    [sessionId],
    function(err) {
      if (err) return res.status(500).json({ success: false, error: err.message });
      
      // 2. Delete staging directory
      const stagingPath = path.join(STAGING_DIR, sessionId);
      fs.remove(stagingPath, (fsErr) => {
        // Silent cleanup
        
        res.json({ 
          success: true, 
          message: 'Đã xóa tất cả file tạm',
          deletedRows: this.changes 
        });
      });
    }
  );
});
```

---

## 5. DATABASE SCHEMA

### 📊 Table: files

```sql
CREATE TABLE IF NOT EXISTS files (
  id TEXT PRIMARY KEY,                    -- UUID
  session_id TEXT,                        -- Nhóm staging files
  employee_id TEXT,                       -- Entity ID (warrantyId cho warranty)
  document_type TEXT,                     -- 'warranty', 'employee', 'product', 'customer', 'complaint'
  document_name TEXT,                     -- 'received', 'processed', 'customer', 'employee'
  original_name TEXT NOT NULL,            -- Tên gốc từ user
  filename TEXT NOT NULL,                 -- Tên file hệ thống (UUID hoặc slugified)
  filepath TEXT NOT NULL,                 -- Full path trên disk
  filesize INTEGER,                       -- Kích thước (bytes)
  mimetype TEXT,                          -- Content type
  status TEXT DEFAULT 'staging',          -- 'staging' | 'permanent'
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  confirmed_at TIMESTAMP,                 -- Khi chuyển staging → permanent
  file_slug TEXT,                         -- URL-safe slug
  display_name TEXT                       -- Tên hiển thị cho user
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_files_session ON files(session_id);
CREATE INDEX IF NOT EXISTS idx_files_employee ON files(employee_id);
CREATE INDEX IF NOT EXISTS idx_files_status ON files(status);
```

### 🔍 Query Examples

**1. Lấy staging files theo session:**
```sql
SELECT * FROM files 
WHERE session_id = 'abc-123-def' 
  AND status = 'staging';
```

**2. Lấy permanent files của warranty:**
```sql
SELECT * FROM files 
WHERE employee_id = '123' 
  AND document_type = 'warranty'
  AND document_name = 'received'
  AND status = 'permanent';
```

**3. Update staging → permanent:**
```sql
UPDATE files SET
  employee_id = '123',
  document_type = 'warranty',
  document_name = 'received',
  filename = 'new-slugified-name.jpg',
  filepath = '/path/to/permanent/file.jpg',
  file_slug = 'customer-name-tracking',
  display_name = 'Nguyễn Văn A',
  status = 'permanent',
  confirmed_at = CURRENT_TIMESTAMP
WHERE id = 'file-uuid';
```

**4. Delete staging session:**
```sql
DELETE FROM files 
WHERE session_id = 'abc-123-def' 
  AND status = 'staging';
```

**5. Delete permanent file:**
```sql
DELETE FROM files 
WHERE id = 'file-uuid';
```

---

## 6. DIRECTORY STRUCTURE

### 📁 Cấu Trúc Thư Mục

```
server/
├── uploads/
│   ├── staging/                          # Files tạm
│   │   ├── {sessionId-1}/
│   │   │   ├── abc123.jpg
│   │   │   └── def456.webp
│   │   └── {sessionId-2}/
│   │       └── xyz789.png
│   │
│   └── permanent/                        # Files đã confirm
│       ├── employees/
│       │   └── {employeeId}/
│       │       └── {documentType}/
│       ├── products/
│       │   └── {productId}/
│       ├── customers/
│       │   └── {customerId}/
│       ├── warranty/                     # ⭐ Warranty images
│       │   └── {warrantyId}/
│       │       ├── received/             # Hình lúc nhận
│       │       │   ├── nguyen-van-a-tk001-123.jpg
│       │       │   └── nguyen-van-a-tk001-456.webp
│       │       └── processed/            # Hình sau xử lý
│       │           ├── nguyen-van-a-tk001-789.jpg
│       │           └── nguyen-van-a-tk001-012.webp
│       └── complaints/                   # 💡 Complaints images (tương tự)
│           └── {complaintId}/
│               ├── customer/             # Hình từ khách
│               └── employee/             # Hình từ nhân viên
```

### 🎯 Quy Tắc Đặt Tên File

**Staging**: Giữ nguyên hoặc UUID
```
original-filename.jpg
abc-123-def-456.webp
```

**Permanent**: Slugified với metadata
```
{customerName}-{trackingCode}-{timestamp}.ext

Ví dụ:
nguyen-van-a-tk001-1704096000000.jpg
tran-thi-b-tk002-1704096123456.webp
```

**Code tạo filename**:
```javascript
const ext = path.extname(file.original_name);
const slugName = slugify(
  `${metadata.customerName || 'unknown'}-${metadata.trackingCode || 'no-code'}-${Date.now()}`,
  { lower: true, strict: true, remove: /[*+~.()'"!:@]/g }
);
const filename = `${slugName}${ext}`;
```

---

## 7. CRUD OPERATIONS CHI TIẾT

### ➕ CREATE - Upload New Images

#### Frontend Code

```typescript
// Step 1: User drops/selects files
// → NewDocumentsUpload component tự động upload
// → Call FileUploadAPI.uploadFiles()

// Step 2: Component update state
const handleUploadChange = (files: StagingFile[]) => {
  const permanent = files.filter(f => f.status === 'permanent');
  const staging = files.filter(f => f.status === 'staging');
  
  setReceivedPermanentFiles(permanent);
  setReceivedStagingFiles(staging);
};

// Step 3: On submit, confirm staging files
const onSubmit = async (values) => {
  // ... create warranty first
  
  if (receivedSessionId && receivedStagingFiles.length > 0) {
    const confirmedFiles = await FileUploadAPI.confirmStagingFiles(
      receivedSessionId,
      warrantyId,
      'warranty',
      'received',
      { customerName, trackingCode }
    );
    
    // Use confirmed URLs
    await updateWarranty({
      receivedImages: confirmedFiles.map(f => f.url)
    });
  }
};
```

#### API Call Flow

```
User Upload → NewDocumentsUpload
              ↓
         POST /api/staging/upload
              ↓
         SQLite (status='staging')
              ↓
         Disk: uploads/staging/{sessionId}/
              ↓
User Submit → confirmStagingFiles()
              ↓
         POST /api/staging/confirm/...
              ↓
         Move files to permanent/
              ↓
         UPDATE SQLite (status='permanent')
              ↓
         Return permanent URLs
```

---

### 📖 READ - Display Images

#### Load Existing Images (Edit Mode)

```typescript
useEffect(() => {
  if (ticket?.receivedImages && ticket.receivedImages.length > 0) {
    // Convert URLs to StagingFile format
    const stagingFiles: StagingFile[] = ticket.receivedImages.map((url, idx) => ({
      id: `existing-${idx}-${Date.now()}`,
      name: url.split('/').pop() || `file-${idx}`,
      originalName: url.split('/').pop() || `file-${idx}`,
      slug: url.split('/').pop() || `file-${idx}`,
      filename: url.split('/').pop() || `file-${idx}`,
      size: 0,
      type: 'image/jpeg',
      url: url,  // ⭐ Important: full URL
      status: 'permanent' as const,
      sessionId: '',
      uploadedAt: new Date().toISOString(),
      metadata: ''
    }));
    
    setReceivedPermanentFiles(stagingFiles);
  }
}, [ticket]);
```

#### Display Images in Component

```tsx
<NewDocumentsUpload
  value={[
    ...receivedPermanentFiles,  // Existing images
    ...receivedStagingFiles     // Newly uploaded
  ]}
  onChange={handleChange}
/>
```

Component sẽ hiển thị:
- **Permanent files**: Có badge "Đã lưu"
- **Staging files**: Có badge "Chờ xác nhận"

#### Serve Images

```html
<!-- Direct image tag -->
<img src="/api/files/warranty/123/received/file.jpg" alt="" />

<!-- In NewDocumentsUpload -->
{files.map(file => (
  <img src={file.url} alt={file.name} />
))}
```

Server endpoint:
```javascript
GET /api/files/warranty/:warrantyId/:imageType/:filename
→ sendFile(uploads/permanent/warranty/{warrantyId}/{imageType}/{filename})
```

---

### ✏️ UPDATE - Modify Images

#### Xóa Images (Mark for Delete)

```typescript
// User clicks delete button
// → NewDocumentsUpload component removes from display
// → Add to filesToDelete array

const handleUploadChange = (files: StagingFile[]) => {
  // Find deleted files
  const currentIds = files.map(f => f.id);
  const deletedIds = receivedPermanentFiles
    .filter(f => !currentIds.includes(f.id))
    .map(f => f.id);
  
  // Update delete list
  setReceivedFilesToDelete(prev => [...prev, ...deletedIds]);
  
  // Update state
  const permanent = files.filter(f => f.status === 'permanent');
  const staging = files.filter(f => f.status === 'staging');
  setReceivedPermanentFiles(permanent);
  setReceivedStagingFiles(staging);
};
```

#### Filter Before Confirm

```typescript
const onSubmit = async (values) => {
  // Filter out deleted files
  const cleanedReceivedFiles = receivedPermanentFiles.filter(
    file => !receivedFilesToDelete.includes(file.id)
  );
  
  // Confirm staging files
  if (receivedSessionId && receivedStagingFiles.length > 0) {
    const confirmedFiles = await FileUploadAPI.confirmStagingFiles(
      receivedSessionId, warrantyId, 'warranty', 'received', metadata
    );
    
    // Combine: cleaned permanent + newly confirmed
    finalReceivedImageUrls = [
      ...cleanedReceivedFiles.map(f => f.url),
      ...confirmedFiles.map(f => f.url)
    ];
  } else {
    // No new staging files, just use cleaned
    finalReceivedImageUrls = cleanedReceivedFiles.map(f => f.url);
  }
  
  // Update warranty
  await updateWarranty({ receivedImages: finalReceivedImageUrls });
};
```

#### Thêm Images Mới (Edit Mode)

```typescript
// Khi edit, có thể upload thêm files mới
// → Files mới vào staging
// → Files cũ giữ nguyên ở permanent
// → On submit: combine cả hai

<NewDocumentsUpload
  value={[
    ...receivedPermanentFiles,  // Existing
    ...receivedStagingFiles     // Newly added
  ]}
  // User adds more files
  // → Auto upload to staging
  // → Update receivedStagingFiles
  onChange={handleChange}
/>
```

---

### � VIEW - Preview Images (Detail Page)

#### Hiển thị Images trên Detail Page

**Mục đích**: Xem full size images với preview modal

```tsx
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Eye, X } from 'lucide-react';

// State cho preview
const [previewImage, setPreviewImage] = useState<string | null>(null);

// Hiển thị grid images
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {entity.customerImages?.map((img, idx) => (
    <div key={img.id || idx} className="relative group">
      {/* Thumbnail */}
      <img
        src={img.url}
        alt={`Customer image ${idx + 1}`}
        className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition"
        onClick={() => setPreviewImage(img.url)}
      />
      
      {/* Overlay Actions */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 text-white hover:text-white hover:bg-white/20"
          onClick={() => setPreviewImage(img.url)}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 text-white hover:text-white hover:bg-white/20"
          onClick={() => handleDownload(img.url)}
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  ))}
</div>

{/* Preview Modal */}
<Dialog open={!!previewImage} onOpenChange={(open) => !open && setPreviewImage(null)}>
  <DialogContent className="max-w-4xl w-full p-0">
    <div className="relative">
      <img
        src={previewImage || ''}
        alt="Preview"
        className="w-full h-auto max-h-[80vh] object-contain"
      />
      <Button
        size="sm"
        variant="ghost"
        className="absolute top-2 right-2 h-8 w-8 p-0 bg-black/50 text-white hover:bg-black/70"
        onClick={() => setPreviewImage(null)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  </DialogContent>
</Dialog>
```

#### Download Image Function

```typescript
const handleDownload = async (imageUrl: string) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = imageUrl.split('/').pop() || 'image.jpg';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    toast.success('Đã tải xuống hình ảnh');
  } catch (error) {
    toast.error('Không thể tải xuống hình ảnh');
  }
};
```

#### Phân Loại Images theo Type

```tsx
// Hiển thị Customer Images
<Card>
  <CardHeader>
    <CardTitle className="text-base">Hình ảnh từ khách hàng ({customerImages.length})</CardTitle>
  </CardHeader>
  <CardContent>
    {customerImages.length > 0 ? (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {customerImages.map((img, idx) => (
          <ImageThumbnail key={idx} image={img} onPreview={setPreviewImage} />
        ))}
      </div>
    ) : (
      <p className="text-sm text-muted-foreground">Chưa có hình ảnh</p>
    )}
  </CardContent>
</Card>

// Hiển thị Employee Images
<Card>
  <CardHeader>
    <CardTitle className="text-base">Hình ảnh từ nhân viên ({employeeImages.length})</CardTitle>
  </CardHeader>
  <CardContent>
    {employeeImages.length > 0 ? (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {employeeImages.map((img, idx) => (
          <ImageThumbnail key={idx} image={img} onPreview={setPreviewImage} />
        ))}
      </div>
    ) : (
      <p className="text-sm text-muted-foreground">Chưa có hình ảnh kiểm tra</p>
    )}
  </CardContent>
</Card>
```

---

### 🗑️ DELETE - Remove Images

Warranty module có **2 CHẾ ĐỘ XÓA** khác nhau:

---

#### A. Mark for Delete (Safe Mode) ✅ - ExistingDocumentsViewer

**Component**: `ExistingDocumentsViewer` trong `warranty-form-page.tsx`

**Đặc điểm**:
- ✅ **Toggle mark/unmark** - Click nút xóa 2 lần để undo
- ✅ **KHÔNG hiện popup** confirmation - UX mượt
- ✅ **Visual feedback** rõ ràng:
  * Border: `green-200` → `red-300`
  * Badge: "✓ Đã lưu vĩnh viễn" → "🗑️ Sẽ xóa khi Lưu" (animate-pulse)
  * Opacity: `100%` → `60%`
  * Button icon: `X` → `RotateCcw` (khôi phục)
  * Button color: red → amber
- ✅ **Chỉ xóa khi SUBMIT** form - Không xóa ngay

**State Management**:
```typescript
// ===== WARRANTY-FORM-PAGE.TSX =====
const [processedPermanentFiles, setProcessedPermanentFiles] = useState<StagingFile[]>([]);
const [processedFilesToDelete, setProcessedFilesToDelete] = useState<string[]>([]); // ⭐ Track

// Handler: Toggle mark/unmark
const handleMarkProcessedForDeletion = useCallback((fileId: string) => {
  setProcessedFilesToDelete(prev => {
    if (prev.includes(fileId)) {
      return prev.filter(id => id !== fileId); // ✅ Unmark - khôi phục
    } else {
      return [...prev, fileId];                // ✅ Mark - đánh dấu xóa
    }
  });
}, []);
```

**Component Usage**:
```tsx
{/* Card: Hình ảnh đã xử lý */}
<Card>
  <CardContent>
    {/* Files cũ - Permanent */}
    {isEditing && processedPermanentFiles.length > 0 && (
      <ExistingDocumentsViewer
        files={processedPermanentFiles}
        onChange={setProcessedPermanentFiles}
        disabled={isReadOnly}
        onMarkForDeletion={handleMarkProcessedForDeletion}  // ← Toggle handler
        markedForDeletion={processedFilesToDelete}          // ← Array IDs marked
        hideFileInfo={true}
      />
    )}
    
    {/* Files mới - Staging */}
    <NewDocumentsUpload
      value={processedStagingFiles}
      onChange={setProcessedStagingFiles}
      sessionId={processedSessionId}
      onSessionChange={setProcessedSessionId}
    />
  </CardContent>
</Card>
```

**Logic trong ExistingDocumentsViewer** (lines 78-95):
```typescript
// ===== FILE: components/ui/existing-documents-viewer.tsx =====
const handleDelete = useCallback(async (fileId: string) => {
  const fileToDelete = files.find(f => f.id === fileId);
  if (!fileToDelete) return;

  // ✅ Safe deletion mode (khi có onMarkForDeletion prop)
  if (onMarkForDeletion) {
    const isMarked = markedForDeletion.includes(fileId);
    
    if (isMarked) {
      // ✅ UNMARK (khôi phục) - Click lần 2
      onMarkForDeletion(fileId);
      toast.success('✓ Đã khôi phục file', {
        description: `"${fileToDelete.originalName}" sẽ được giữ lại`
      });
    } else {
      // ✅ MARK (đánh dấu xóa) - Click lần 1
      onMarkForDeletion(fileToDelete.id);
      toast.warning('⚠️ Đã đánh dấu xóa', {
        description: `"${fileToDelete.originalName}" - Nhấn nút Lưu để xóa vĩnh viễn`,
        duration: 4000
      });
    }
    return; // ← Dừng tại đây, KHÔNG hiện dialog
  }

  // ❌ Direct deletion mode (fallback - hiện confirmation)
  setFileToDelete(fileToDelete);
  setDeleteMode('direct');
  setDeleteAlertOpen(true);
}, [files, onMarkForDeletion, markedForDeletion]);
```

**Visual Feedback** (lines 258-335):
```tsx
{files.map((file) => {
  const isMarkedForDeletion = markedForDeletion.includes(file.id);

  return (
    <Card 
      className={`group p-1.5 ${
        isMarkedForDeletion 
          ? 'border-red-300 bg-red-50/50 opacity-60'    // ← Đỏ + mờ
          : 'border-green-200 bg-green-50/30'           // ← Xanh
      }`}
    >
      <img src={file.url} />
      
      {/* Badge */}
      {isMarkedForDeletion ? (
        <span className="bg-red-100 text-red-700 animate-pulse">
          🗑️ Sẽ xóa khi Lưu
        </span>
      ) : (
        <span className="bg-green-100 text-green-700">
          ✓ Đã lưu vĩnh viễn
        </span>
      )}
      
      {/* Button */}
      <Button
        className={isMarkedForDeletion ? 'bg-amber-100 text-amber-700' : ''}
        onClick={() => handleDelete(file.id)}
        title={isMarkedForDeletion ? 'Khôi phục file' : 'Đánh dấu xóa'}
      >
        {isMarkedForDeletion ? <RotateCcw /> : <X />}
      </Button>
    </Card>
  );
})}
```

#### B. Xóa Thật (Submit) - Filter Before Save

**Workflow**:
1. User click nút "Lưu" ở form
2. Filter ra files bị mark delete
3. Merge: cleaned permanent + confirmed staging
4. Lưu ticket với URLs đã filter

**Submit Logic** (warranty-form-page.tsx lines 447-522):
```typescript
const onSubmit = async (values) => {
  try {
    // ===== 1️⃣ FILTER OUT DELETED FILES =====
    const cleanedProcessedFiles = processedPermanentFiles.filter(
      file => !processedFilesToDelete.includes(file.id)  // ⭐ Loại bỏ files bị mark
    );
    
    // Show toast
    if (processedFilesToDelete.length > 0) {
      toast.success('✓ Đã đánh dấu xóa files', {
        description: `${processedFilesToDelete.length} file sẽ bị xóa khỏi phiếu`
      });
      setProcessedFilesToDelete([]); // Clear marks
    }
    
    // ===== 2️⃣ PREPARE WARRANTY INFO =====
    const warrantyInfo = {
      name: data.customer?.name || '',
      phone: data.customer?.phone || '',
      trackingCode: data.trackingCode || '',
      warrantyId: targetWarrantyId || ''
    };
    
    // ===== 3️⃣ CONFIRM STAGING FILES (nếu có) =====
    let finalProcessedImageUrls: string[] = [];
    
    if (processedSessionId && processedStagingFiles.length > 0) {
      const confirmToast = toast.loading('Đang lưu hình ảnh đã xử lý...');
      
      try {
        const confirmedFiles = await FileUploadAPI.confirmStagingFiles(
          processedSessionId,
          targetWarrantyId!,
          'warranty',
          'processed',
          warrantyInfo
        );
        
        // ⭐ 4️⃣ MERGE: Cleaned (sau filter) + Confirmed (mới)
        finalProcessedImageUrls = [
          ...cleanedProcessedFiles.map(f => f.url),  // ← Không bao gồm files marked
          ...confirmedFiles.map(f => f.url)          // ← Files staging mới confirm
        ];
        
        toast.success('✓ Đã lưu hình ảnh đã xử lý', { id: confirmToast });
        
        // Cleanup staging
        await FileUploadAPI.deleteStagingFiles(processedSessionId);
      } catch (error) {
        toast.error('❌ Lỗi lưu hình ảnh đã xử lý', { id: confirmToast });
        throw error;
      }
    } else {
      // ⭐ 5️⃣ NO NEW FILES → Chỉ dùng cleaned permanent
      finalProcessedImageUrls = cleanedProcessedFiles.map(img => img.url);
    }
    
    // ===== 6️⃣ SAVE TICKET =====
    update(ticket.systemId, {
      ...ticketData,
      processedImages: finalProcessedImageUrls  // ← Không có URLs bị xóa
    });
    
    console.log('✅ Final processed images:', finalProcessedImageUrls);
  } catch (error) {
    console.error('❌ Submit error:', error);
  }
};
```

**Log để Debug**:
```typescript
console.log('📊 Processed Images Summary:', {
  permanent: {
    original: processedPermanentFiles.length,
    markedDelete: processedFilesToDelete.length,
    afterFilter: cleanedProcessedFiles.length
  },
  staging: {
    count: processedStagingFiles.length,
    sessionId: processedSessionId
  },
  final: {
    willSave: finalProcessedImageUrls.length
  }
});
```

**Lưu ý quan trọng**:
- ❌ **KHÔNG gọi** `deleteFile(fileId)` API - Warranty chỉ lưu URLs, không có file records riêng
- ✅ **Filter URLs** khỏi array là đủ - Files không còn tham chiếu = "đã xóa"
- ✅ **Comment trong code** (lines 447-449):
  ```typescript
  // Warranty chỉ lưu URL, không có file database ID như Employee
  // Nên chỉ filter ra khỏi list thôi, không gọi deleteFile API
  ```

---

#### C. So Sánh: Complaints vs Warranty - Cùng Sử Dụng Pattern Chuẩn

##### 🔹 **COMPLAINTS Module** - ExistingDocumentsViewer Pattern (✅ Đã Sửa)

**Component**: Dùng `ExistingDocumentsViewer` + `NewDocumentsUpload` riêng biệt (giống WARRANTY)

**Đặc điểm**:
- ✅ **2 components riêng biệt** - Permanent files và staging files tách rời
- ✅ **Dùng API chuẩn** - `confirmStagingFiles` giống WARRANTY
- ✅ **Pattern nhất quán** - Handler `onMarkForDeletion` + `markedForDeletion` array
- ✅ **Visual feedback tốt** - Badge, border, opacity, icon cho files marked

**State Management**:
```typescript
// ===== COMPLAINTS/FORM-PAGE.TSX =====
const [customerPermanentFiles, setCustomerPermanentFiles] = useState<StagingFile[]>([]);
const [customerStagingFiles, setCustomerStagingFiles] = useState<StagingFile[]>([]);
const [customerSessionId, setCustomerSessionId] = useState<string | null>(null);
const [customerFilesToDelete, setCustomerFilesToDelete] = useState<string[]>([]); // Track

const [employeePermanentFiles, setEmployeePermanentFiles] = useState<StagingFile[]>([]);
const [employeeStagingFiles, setEmployeeStagingFiles] = useState<StagingFile[]>([]);
const [employeeSessionId, setEmployeeSessionId] = useState<string | null>(null);
const [employeeFilesToDelete, setEmployeeFilesToDelete] = useState<string[]>([]);
```

**Component Usage**:
```tsx
{/* ===== COMPLAINTS: 2 components riêng biệt (giống WARRANTY) ===== */}
<div>
  <Label>Hình ảnh từ khách hàng</Label>
  
  {/* Component 1: ExistingDocumentsViewer cho permanent files */}
  {customerPermanentFiles.length > 0 && (
    <ExistingDocumentsViewer
      files={customerPermanentFiles}
      onMarkForDeletion={handleMarkCustomerForDeletion}
      markedForDeletion={customerFilesToDelete}
    />
  )}
  
  {/* Component 2: NewDocumentsUpload cho staging files */}
  <NewDocumentsUpload
    accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif'] }}
    maxSize={10 * 1024 * 1024}
    maxFiles={10}
    value={customerStagingFiles}
    onChange={setCustomerStagingFiles}
    sessionId={customerSessionId}
    onSessionChange={setCustomerSessionId}
  />
</div>
```

**Handler for Mark Deletion**:
```typescript
const handleMarkCustomerForDeletion = useCallback((fileId: string) => {
  setCustomerFilesToDelete(prev => {
    if (prev.includes(fileId)) {
      return prev.filter(id => id !== fileId); // Unmark
    } else {
      return [...prev, fileId]; // Mark
    }
  });
}, []);
```

**Submit Logic** (complaints/form-page.tsx) - ✅ Đã sửa dùng API chuẩn:
```typescript
const onSubmit = async (data) => {
  // ===== XỬ LÝ CUSTOMER IMAGES =====
  let finalCustomerImageUrls: string[] = [];
  
  // 1. Filter deleted files
  const cleanedCustomerPermanent = customerPermanentFiles.filter(
    f => !customerFilesToDelete.includes(f.id)
  );
  
  // 2. Confirm staging files - ✅ Dùng API chuẩn
  if (customerSessionId && customerStagingFiles.length > 0) {
    const result = await FileUploadAPI.confirmStagingFiles(
      customerSessionId, 
      targetComplaintId,
      'complaint',        // entityType
      'customer-images',  // subCategory
      {
        orderCode: data.orderCode,
        customerName: data.customerName,
      }
    );
    
    const newUrls = result.map((file: any) => file.url);
    
    // 3. Combine cleaned + confirmed
    finalCustomerImageUrls = [
      ...cleanedCustomerPermanent.map(f => f.url),
      ...newUrls
    ];
  } else {
    finalCustomerImageUrls = cleanedCustomerPermanent.map(f => f.url);
  }
  
  // ===== XỬ LÝ EMPLOYEE IMAGES (tương tự) =====
  // Same pattern với entityType: 'complaint', subCategory: 'employee-images'
```
  
  // 4. Save complaint
  const complaintData = {
    // ...
    images: finalCustomerImageUrls.map((url, idx) => ({
      id: `img_${Date.now()}_${idx}`,
      url,
      uploadedBy: "USER_001",
      uploadedAt: new Date(),
      type: "initial" as const,
    })),
    employeeImages: finalEmployeeImageUrls.map((url, idx) => ({
      id: `emp_img_${Date.now()}_${idx}`,
      url,
      uploadedBy: "USER_001",
      uploadedAt: new Date(),
      type: "verification" as const,
    })),
  };
  
  if (isEditing) {
    updateComplaint(systemId, complaintData);
  } else {
    addComplaint(complaintData);
  }
};
```

**Cleanup** (lines 220-240):
```typescript
// Cleanup staging khi unmount
useEffect(() => {
  return () => {
    if (customerSessionId && customerStagingFiles.length > 0) {
      FileUploadAPI.deleteStagingSession(customerSessionId).catch(err => {
        console.error('Failed to cleanup customer staging:', err);
      });
    }
    
    if (employeeSessionId && employeeStagingFiles.length > 0) {
      FileUploadAPI.deleteStagingSession(employeeSessionId).catch(err => {
        console.error('Failed to cleanup employee staging:', err);
      });
    }
  };
}, [customerSessionId, customerStagingFiles.length, employeeSessionId, employeeStagingFiles.length]);
```

---

##### 🔹 **WARRANTY Module** - ExistingDocumentsViewer Pattern (Đã mô tả ở Section A & B)

---

##### 📊 Bảng So Sánh Chi Tiết

| Aspect | Complaints (✅ Đã Sửa) | Warranty (Chuẩn) |
|--------|------------------------|------------------|
| **Component** | 2 components riêng biệt | 2 components riêng biệt |
| **Permanent Files** | `ExistingDocumentsViewer` riêng | `ExistingDocumentsViewer` riêng |
| **Staging Files** | `NewDocumentsUpload` riêng | `NewDocumentsUpload` riêng |
| **API Method** | ✅ `confirmStagingFiles` | ✅ `confirmStagingFiles` |
| **API Endpoint** | ✅ `/staging/confirm/:session/:type/:id/:sub` | ✅ `/staging/confirm/:session/:type/:id/:sub` |
| **Delete Detection** | Handler `onMarkForDeletion` | Handler `onMarkForDeletion` |
| **Visual Feedback** | ✅ Badge, border, opacity, icon | ✅ Badge, border, opacity, icon |
| **Undo** | ✅ Dễ (click lại nút) | ✅ Dễ (click lại nút) |
| **Code Complexity** | ✅ Handler đơn giản (toggle) | ✅ Handler đơn giản (toggle) |
| **User Experience** | ✅ Xuất sắc | ✅ Xuất sắc |
| **Pattern Consistency** | ✅ Nhất quán với WARRANTY | ✅ Pattern chuẩn |

**✅ Complaints đã được sửa để nhất quán với WARRANTY**:
- ✅ Dùng API chuẩn `confirmStagingFiles` thay vì `confirmComplaintImages`
- ✅ Parameters match với server: `entityType: 'complaint'`, `subCategory: 'customer-images'`
- ✅ Pattern giống y chang WARRANTY và Employee modules
- ✅ Xóa method `confirmComplaintImages` không cần thiết khỏi file-upload-api.ts

**Khuyến nghị**:
- 📌 **Tất cả modules mới** đều dùng WARRANTY pattern
- 📌 **API chuẩn duy nhất**: `confirmStagingFiles`
- 📌 **Components chuẩn**: ExistingDocumentsViewer + NewDocumentsUpload

---

#### D. Kiểm Tra Kỹ - Validation & Error Handling

**1. Kiểm tra trước khi xóa (Optional Confirmation)**

```typescript
const handleRemoveImage = (fileId: string) => {
  // Optional: Show confirmation dialog
  if (window.confirm('Bạn có chắc muốn xóa hình ảnh này?')) {
    // Mark for deletion
    setCustomerFilesToDelete(prev => [...prev, fileId]);
    
    // Remove from display
    setCustomerPermanentFiles(prev => prev.filter(f => f.id !== fileId));
    
    toast.info('Hình ảnh sẽ bị xóa khi bạn lưu thay đổi');
  }
};
```

**2. Kiểm tra consistency khi submit**

```typescript
const onSubmit = async (values) => {
  // ✅ Check 1: Validate có ít nhất 1 image
  const totalImages = cleanedCustomerPermanent.length + customerStagingFiles.length;
  if (totalImages === 0 && isRequired) {
    toast.error('Vui lòng upload ít nhất 1 hình ảnh');
    return;
  }
  
  // ✅ Check 2: Log để debug
  console.log('🔍 Submit Validation:', {
    permanent: {
      original: customerPermanentFiles.length,
      markedDelete: customerFilesToDelete.length,
      remaining: cleanedCustomerPermanent.length
    },
    staging: {
      count: customerStagingFiles.length,
      sessionId: customerSessionId
    },
    final: {
      willSave: cleanedCustomerPermanent.length + customerStagingFiles.length
    }
  });
  
  // ✅ Check 3: Verify sessionId exists for staging files
  if (customerStagingFiles.length > 0 && !customerSessionId) {
    console.error('❌ Staging files exist but no sessionId!');
    toast.error('Lỗi: Không tìm thấy session upload');
    return;
  }
  
  // Proceed with save...
};
```

**3. Error handling cho confirm staging**

```typescript
if (customerSessionId && customerStagingFiles.length > 0) {
  try {
    const confirmed = await FileUploadAPI.confirmComplaintImages(
      customerSessionId, complaintId, 'customer', metadata
    );
    
    // ✅ Verify confirmed files
    if (!confirmed || confirmed.length === 0) {
      throw new Error('No files confirmed from server');
    }
    
    console.log('✅ Confirmed files:', confirmed.length);
    
    finalCustomerUrls = [
      ...cleanedCustomerPermanent.map(f => f.url),
      ...confirmed.map(f => f.url)
    ];
  } catch (error) {
    console.error('❌ Failed to confirm staging files:', error);
    toast.error('Lỗi khi lưu hình ảnh mới');
    
    // ⚠️ Fallback: Save with staging URLs (not ideal but prevents data loss)
    finalCustomerUrls = [
      ...cleanedCustomerPermanent.map(f => f.url),
      ...customerStagingFiles.map(f => f.url)
    ];
  }
}
```

**4. Prevent duplicate deletions**

```typescript
const handleRemoveImage = (fileId: string) => {
  // ✅ Check if already marked
  if (customerFilesToDelete.includes(fileId)) {
    console.warn('⚠️ File already marked for deletion:', fileId);
    return;
  }
  
  // Mark and remove
  setCustomerFilesToDelete(prev => [...prev, fileId]);
  setCustomerPermanentFiles(prev => prev.filter(f => f.id !== fileId));
};
```

**5. Visual feedback cho files sẽ bị xóa**

```tsx
{customerPermanentFiles.map((file) => {
  const willBeDeleted = customerFilesToDelete.includes(file.id);
  
  return (
    <div 
      key={file.id} 
      className={cn(
        "relative",
        willBeDeleted && "opacity-50"  // ⭐ Visual feedback
      )}
    >
      <img src={file.url} alt={file.name} />
      
      {willBeDeleted && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-500/20">
          <span className="text-xs font-medium text-red-600">Sẽ bị xóa</span>
        </div>
      )}
      
      <Button onClick={() => handleRemoveImage(file.id)}>
        Xóa
      </Button>
    </div>
  );
})}
```

#### D. Delete Permanent File (From Detail Page) - Xóa Ngay Lập Tức

**Workflow**: Xóa trực tiếp trên server, không cần tracking

```typescript
const handleDeleteImage = async (imageUrl: string, imageId: string) => {
  // ⚠️ Confirmation required
  const confirmed = window.confirm('Bạn có chắc muốn xóa hình ảnh này? Hành động này không thể hoàn tác.');
  if (!confirmed) return;
  
  try {
    // Call delete API
    const response = await fetch(`/api/files/${imageId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Delete failed');
    }
    
    // Update local state
    setCustomerImages(prev => prev.filter(img => img.id !== imageId));
    
    // Update entity in database
    await updateComplaint(complaintId, {
      customerImages: customerImages
        .filter(img => img.id !== imageId)
        .map(img => img.url)
    });
    
    toast.success('Đã xóa hình ảnh thành công');
  } catch (error) {
    console.error('❌ Delete failed:', error);
    toast.error('Không thể xóa hình ảnh: ' + error.message);
  }
};
```

Server xử lý:
```javascript
app.delete('/api/files/:fileId', (req, res) => {
  const { fileId } = req.params;
  
  // 1. Query file info
  db.get('SELECT * FROM files WHERE id = ?', [fileId], (err, row) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        error: err.message 
      });
    }
    
    if (!row) {
      return res.status(404).json({ 
        success: false, 
        message: 'File không tồn tại' 
      });
    }
    
    console.log('🗑️ Deleting file:', {
      id: fileId,
      path: row.filepath,
      type: row.document_type
    });

    // 2. Delete physical file
    fs.remove(row.filepath, (fsErr) => {
      if (fsErr) {
        console.error('⚠️ Failed to delete physical file:', fsErr);
        // Continue anyway to clean DB
      }
      
      // 3. Delete DB record
      db.run('DELETE FROM files WHERE id = ?', [fileId], function(dbErr) {
        if (dbErr) {
          return res.status(500).json({ 
            success: false, 
            error: dbErr.message 
          });
        }
        
        console.log('✅ File deleted:', fileId);
        
        res.json({ 
          success: true, 
          message: 'Đã xóa file thành công',
          deletedRows: this.changes 
        });
      });
    });
  });
});
```

#### E. So Sánh: Xóa Tạm vs Xóa Thật

| Feature | Xóa Tạm (Form Edit) | Xóa Thật (Detail Page) |
|---------|---------------------|------------------------|
| **Timing** | Khi submit form | Ngay lập tức |
| **Reversible** | ✅ Có (reload form) | ❌ Không |
| **Track State** | ✅ `filesToDelete[]` | ❌ Không cần |
| **Server Call** | On submit | Immediate |
| **Confirmation** | Optional (toast only) | ⚠️ Required (confirm dialog) |
| **Use Case** | Bulk edit với nhiều thay đổi | Quick delete 1 file |
| **Safety** | ✅ Safe (chưa xóa thật) | ⚠️ Dangerous (xóa vĩnh viễn) |

#### F. Best Practices - Kiểm Tra Kỹ

**✅ DO:**
1. **Always log deletion operations**
   ```typescript
   console.log('🗑️ Deleting files:', filesToDelete);
   console.log('📊 Final URLs:', finalUrls);
   ```

2. **Validate before save**
   ```typescript
   if (cleanedFiles.length === 0 && isRequired) {
     toast.error('Cần ít nhất 1 hình ảnh');
     return;
   }
   ```

3. **Show visual feedback**
   ```tsx
   {file.willDelete && <Badge>Sẽ bị xóa</Badge>}
   ```

4. **Confirm destructive actions**
   ```typescript
   const confirmed = confirm('Bạn có chắc?');
   if (!confirmed) return;
   ```

5. **Handle errors gracefully**
   ```typescript
   try {
     await deleteFile(id);
   } catch (error) {
     toast.error('Lỗi: ' + error.message);
     // Rollback UI if needed
   }
   ```

**❌ DON'T:**
1. ❌ Xóa ngay khi user click trong form edit
2. ❌ Không track `filesToDelete`
3. ❌ Confirm tất cả staging files (bao gồm permanent)
4. ❌ Bỏ qua error handling
5. ❌ Không log operations (khó debug)

#### Cancel Upload (Delete Staging Session)

```typescript
// User clicks cancel/back without saving
useEffect(() => {
  return () => {
    // Cleanup on unmount
    if (receivedSessionId) {
      FileUploadAPI.deleteStagingSession(receivedSessionId);
    }
    if (processedSessionId) {
      FileUploadAPI.deleteStagingSession(processedSessionId);
    }
  };
}, [receivedSessionId, processedSessionId]);
```

API:
```typescript
// lib/file-upload-api.ts
static async deleteStagingSession(sessionId: string): Promise<void> {
  await fetch(`/api/staging/${sessionId}`, {
    method: 'DELETE'
  });
}
```

Server xử lý:
```javascript
app.delete('/api/staging/:sessionId', (req, res) => {
  // 1. Delete DB records
  db.run(
    'DELETE FROM files WHERE session_id = ? AND status = "staging"',
    [sessionId],
    () => {
      // 2. Delete staging directory
      const stagingPath = path.join(STAGING_DIR, sessionId);
      fs.remove(stagingPath, () => {
        res.json({ success: true });
      });
    }
  );
});
```

---

## 7.5 📸 VIEW - XEM HÌNH ẢNH (Image Preview)

### 🎯 Mục đích

Cung cấp trải nghiệm xem ảnh tốt nhất cho người dùng khi xem chi tiết (detail page) với các tính năng:
- **Progressive Loading**: Load placeholder blur trước, rồi mới load ảnh full
- **Carousel Preview**: Xem ảnh full screen với navigation
- **Zoom & Pan**: Phóng to, thu nhỏ, kéo ảnh
- **Rotate & Download**: Xoay ảnh, tải xuống
- **Keyboard Shortcuts**: Điều khiển bằng phím tắt

---

### 📦 Components Liên Quan

#### A. **ProgressiveImage** Component

**Location**: `components/ui/progressive-image.tsx`

**Mục đích**: Hiển thị ảnh với progressive loading (blur placeholder → full image)

**Props**:
```typescript
interface ProgressiveImageProps {
  src: string;              // URL ảnh full
  placeholder?: string;     // URL ảnh placeholder (optional)
  alt: string;             // Alt text
  className?: string;      // Custom styles
  onLoad?: () => void;     // Callback khi load xong
}
```

**Features**:
1. ✅ Auto-generate blur placeholder nếu không có
2. ✅ Show loading spinner khi đang load
3. ✅ Smooth fade transition khi load xong
4. ✅ Lazy loading với `loading="lazy"`
5. ✅ Error handling khi load fail

**Usage Example**:
```tsx
import { ProgressiveImage } from '@/components/ui/progressive-image';

<ProgressiveImage
  src={imageUrl}
  alt="Hình ảnh sản phẩm"
  className="h-40 w-40 object-cover rounded-lg border"
/>
```

**Internal Logic**:
```typescript
// 1. Generate tiny placeholder (10px thumbnail)
async function generateTinyPlaceholder(dataUrl: string): Promise<string> {
  const img = new Image();
  img.src = dataUrl;
  
  await img.onload;
  
  const canvas = document.createElement('canvas');
  canvas.width = 10;
  canvas.height = 10 / aspectRatio;
  
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.1); // 10% quality
}

// 2. Load stages
// Stage 1: Show placeholder with blur
<img src={placeholder} className="blur-lg opacity-100" />

// Stage 2: Load full image in background
const img = new Image();
img.onload = () => setImageSrc(fullSrc);

// Stage 3: Swap to full image with fade
<img src={fullSrc} className="opacity-100 transition-opacity" />
```

---

#### B. **ImagePreviewDialog** Component

**Location**: `components/ui/image-preview-dialog.tsx`

**Mục đích**: Dialog full-screen để xem ảnh với carousel, zoom, rotate, download

**Props**:
```typescript
interface ImagePreviewDialogProps {
  images: string[];         // Array of image URLs
  initialIndex?: number;    // Start from which image (default: 0)
  open: boolean;           // Dialog open state
  onOpenChange: (open: boolean) => void;  // Close handler
  title?: string;          // Dialog title (default: "Xem ảnh")
}
```

**Features**:

1. **Navigation** 🔄
   - Previous/Next buttons
   - Thumbnail carousel ở bottom
   - Keyboard: Arrow Left/Right
   - Click thumbnail để jump

2. **Zoom & Pan** 🔍
   - Zoom In/Out buttons (50% → 300%)
   - Mouse wheel để zoom
   - Drag to pan khi zoom > 100%
   - Reset position khi zoom out về 100%

3. **Rotate** 🔄
   - Rotate 90° clockwise
   - Keyboard: R key

4. **Download** ⬇️
   - Download ảnh hiện tại
   - Auto-naming: `image-{index}.jpg`

5. **Fullscreen** 🖥️
   - Enter/exit fullscreen mode
   - Keyboard: F key

6. **Keyboard Shortcuts** ⌨️
   - `←` Previous image
   - `→` Next image  
   - `Esc` Close dialog
   - `+` Zoom in
   - `-` Zoom out
   - `R` Rotate
   - `F` Fullscreen

**Usage Example**:
```tsx
import { ImagePreviewDialog } from '@/components/ui/image-preview-dialog';

// 1. Setup state
const [previewImages, setPreviewImages] = useState<string[]>([]);
const [previewIndex, setPreviewIndex] = useState(0);
const [showImagePreview, setShowImagePreview] = useState(false);

// 2. Handler to open preview
const handleImagePreview = useCallback((images: string[], index: number) => {
  setPreviewImages(images);
  setPreviewIndex(index);
  setShowImagePreview(true);
}, []);

// 3. Render clickable images
<div 
  className="cursor-pointer"
  onClick={() => handleImagePreview(ticket.receivedImages, idx)}
>
  <ProgressiveImage
    src={url}
    alt={`Hình ${idx + 1}`}
    className="h-40 w-40 object-cover rounded-lg"
  />
</div>

// 4. Render dialog
<ImagePreviewDialog
  images={previewImages}
  initialIndex={previewIndex}
  open={showImagePreview}
  onOpenChange={setShowImagePreview}
  title="Hình ảnh bảo hành"
/>
```

**Internal State Management**:
```typescript
// Track current image
const [currentIndex, setCurrentIndex] = useState(initialIndex);

// Zoom & rotation state
const [zoom, setZoom] = useState(1);        // 0.5x → 3x
const [rotation, setRotation] = useState(0); // 0°, 90°, 180°, 270°

// Pan position (for zoomed images)
const [position, setPosition] = useState({ x: 0, y: 0 });
const [isDragging, setIsDragging] = useState(false);

// Reset when switching images
const handleNext = () => {
  setCurrentIndex((prev) => (prev + 1) % images.length);
  setZoom(1);
  setRotation(0);
  setPosition({ x: 0, y: 0 });
};
```

**CSS Transform Stack**:
```tsx
<div style={{ 
  transform: `
    translate(${position.x}px, ${position.y}px)  // Pan
    scale(${zoom})                                // Zoom
    rotate(${rotation}deg)                        // Rotate
  `,
  transition: isDragging ? 'none' : 'transform 0.15s ease-out'
}}>
  <img src={images[currentIndex]} />
</div>
```

---

### 🏗️ Implementation trong Detail Page

#### Warranty Detail Page Example

**File**: `features/warranty/warranty-detail-page.tsx`

**Step 1: Import**
```tsx
import { ProgressiveImage } from '@/components/ui/progressive-image';
import { ImagePreviewDialog } from '@/components/ui/image-preview-dialog';
```

**Step 2: Setup State**
```tsx
const [previewImages, setPreviewImages] = useState<string[]>([]);
const [previewIndex, setPreviewIndex] = useState(0);
const [showImagePreview, setShowImagePreview] = useState(false);
```

**Step 3: Create Handler**
```tsx
const handleImagePreview = useCallback((images: string[], index: number) => {
  setPreviewImages(images);
  setPreviewIndex(index);
  setShowImagePreview(true);
}, []);
```

**Step 4: Render Images với ProgressiveImage**
```tsx
<div className="grid grid-cols-5 gap-2">
  {ticket.receivedImages?.map((url, idx) => (
    <div 
      key={idx} 
      className="relative group cursor-pointer aspect-square"
      onClick={() => handleImagePreview(ticket.receivedImages, idx)}
    >
      <ProgressiveImage
        src={url}
        alt={`Hình ${idx + 1}`}
        className="h-full w-full object-cover rounded-lg border-2 transition-all shadow-sm"
      />
      
      {/* Hover overlay with icon */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </div>
    </div>
  ))}
</div>
```

**Step 5: Render Dialog**
```tsx
<ImagePreviewDialog
  images={previewImages}
  initialIndex={previewIndex}
  open={showImagePreview}
  onOpenChange={setShowImagePreview}
  title="Hình ảnh bảo hành"
/>
```

---

### 🎨 UI/UX Best Practices

#### 1. **Thumbnail Grid**
```tsx
// ✅ Recommended: 5 columns grid với aspect-square
<div className="grid grid-cols-5 gap-2">
  <div className="aspect-square cursor-pointer hover:opacity-80 transition">
    <ProgressiveImage src={url} className="w-full h-full object-cover rounded-lg" />
  </div>
</div>

// ❌ Avoid: Fixed height without aspect-ratio
<div className="h-40 w-40"> {/* Images có thể bị distort */}
```

#### 2. **Hover Effects**
```tsx
// ✅ Recommended: Overlay với icon khi hover
<div className="relative group cursor-pointer">
  <ProgressiveImage src={url} />
  
  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center">
    <EyeIcon className="w-6 h-6 text-white" />
  </div>
</div>
```

#### 3. **Loading State**
```tsx
// ✅ ProgressiveImage tự động handle loading
<ProgressiveImage src={url} /> {/* Built-in spinner + blur placeholder */}

// ❌ Không cần thêm loading state thủ công
```

#### 4. **Click Area**
```tsx
// ✅ Recommended: Toàn bộ card clickable
<div 
  className="cursor-pointer"
  onClick={() => handleImagePreview(images, idx)}
>
  <ProgressiveImage src={url} />
</div>

// ❌ Avoid: Chỉ image clickable (click area nhỏ)
<img onClick={...} /> {/* User khó click */}
```

#### 5. **Image Count Badge**
```tsx
// ✅ Show count để user biết có bao nhiêu ảnh
<CardTitle>
  Hình ảnh lúc nhận ({ticket.receivedImages?.length || 0})
</CardTitle>

<p className="text-xs text-muted-foreground">
  {images.length} hình • Click để xem lớn
</p>
```

---

### 🔧 Customization Options

#### A. Custom Thumbnail Layout

**Horizontal Scroll** (cho nhiều ảnh):
```tsx
<div className="flex gap-3 overflow-x-auto pb-2">
  {images.map((url, idx) => (
    <div className="h-40 w-40 flex-shrink-0 cursor-pointer">
      <ProgressiveImage src={url} className="h-full w-full object-cover rounded-lg" />
    </div>
  ))}
</div>
```

**Grid 3x3**:
```tsx
<div className="grid grid-cols-3 gap-2">
  {images.slice(0, 9).map((url, idx) => (
    <ProgressiveImage src={url} className="aspect-square object-cover rounded" />
  ))}
</div>
```

#### B. Custom Preview Dialog Title

```tsx
<ImagePreviewDialog
  title={`${ticket.id} - Hình ảnh ${imageType === 'received' ? 'lúc nhận' : 'đã xử lý'}`}
  // ...
/>
```

#### C. Disable Certain Features

Hiện tại `ImagePreviewDialog` không support disable features, nhưng có thể fork component và customize:

```tsx
// Option 1: Hide download button
<Button onClick={handleDownload} className="hidden">Download</Button>

// Option 2: Disable zoom
const [zoom, setZoom] = useState(1);
const handleZoomIn = () => {}; // No-op
const handleZoomOut = () => {}; // No-op
```

---

### 📊 Performance Considerations

#### 1. **Lazy Loading**
```tsx
// ✅ ProgressiveImage tự động lazy load
<ProgressiveImage src={url} /> {/* loading="lazy" built-in */}

// ✅ Chỉ load images khi user scroll đến
```

#### 2. **Image Optimization**
```tsx
// ✅ Server nên resize images trước khi trả về
// - Thumbnails: 300x300px
// - Preview: 1920x1080px max
// - Format: WebP > JPEG > PNG

// ❌ Avoid: Load ảnh 4K/8K full quality cho thumbnails
```

#### 3. **Placeholder Strategy**
```tsx
// ✅ Auto-generate blur placeholder
<ProgressiveImage src={fullUrl} /> {/* Tự tạo 10px thumbnail */}

// ✅ Hoặc pre-generate trên server
<ProgressiveImage 
  src={fullUrl} 
  placeholder={thumbnailUrl} {/* 100x100px blur */}
/>
```

#### 4. **Preload Next Image**
```tsx
// ✅ Trong ImagePreviewDialog, preload next image khi user đang xem current
useEffect(() => {
  if (currentIndex < images.length - 1) {
    const nextImg = new Image();
    nextImg.src = images[currentIndex + 1];
  }
}, [currentIndex, images]);
```

---

### ✅ Checklist: Thêm Image Preview cho Module Mới

#### Frontend

- [ ] Import `ProgressiveImage` và `ImagePreviewDialog`
- [ ] Setup state: `previewImages`, `previewIndex`, `showImagePreview`
- [ ] Tạo handler: `handleImagePreview(images, index)`
- [ ] Render thumbnails với `ProgressiveImage` + click handler
- [ ] Thêm hover effect (overlay + icon)
- [ ] Render `ImagePreviewDialog` ở cuối component
- [ ] Test keyboard shortcuts (Arrow keys, Esc)
- [ ] Test zoom/pan/rotate functions
- [ ] Test download function

#### UI/UX

- [ ] Grid layout responsive (5 cols desktop, 3 cols tablet, 2 cols mobile)
- [ ] Show image count badge
- [ ] Hover effect smooth transition
- [ ] Loading state với spinner
- [ ] Empty state khi không có ảnh
- [ ] Click area đủ lớn (toàn bộ card)

#### Performance

- [ ] Lazy loading enabled
- [ ] Progressive loading (blur placeholder)
- [ ] Image optimization (resize trên server)
- [ ] Preload next image trong carousel

---

## 8. CHECKLIST TRIỂN KHAI

### 📋 Khi Thêm Image Upload Cho Module Mới

#### ✅ Phase 1: Frontend Setup

- [ ] **Import components**
  ```typescript
  import { NewDocumentsUpload, type StagingFile } from '@/components/ui/new-documents-upload';
  import { FileUploadAPI } from '@/lib/file-upload-api';
  ```

- [ ] **Tạo state cho mỗi image type**
  ```typescript
  // Ví dụ: complaints có 2 types (customer, employee)
  const [customerPermanentFiles, setCustomerPermanentFiles] = useState<StagingFile[]>([]);
  const [customerStagingFiles, setCustomerStagingFiles] = useState<StagingFile[]>([]);
  const [customerSessionId, setCustomerSessionId] = useState<string | null>(null);
  const [customerFilesToDelete, setCustomerFilesToDelete] = useState<string[]>([]);
  
  const [employeePermanentFiles, setEmployeePermanentFiles] = useState<StagingFile[]>([]);
  const [employeeStagingFiles, setEmployeeStagingFiles] = useState<StagingFile[]>([]);
  const [employeeSessionId, setEmployeeSessionId] = useState<string | null>(null);
  const [employeeFilesToDelete, setEmployeeFilesToDelete] = useState<string[]>([]);
  ```

- [ ] **Thêm NewDocumentsUpload component vào form**
  ```tsx
  <NewDocumentsUpload
    accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
    maxSize={10 * 1024 * 1024}
    maxFiles={50}
    value={[...customerPermanentFiles, ...customerStagingFiles]}
    onChange={(files) => {
      const permanent = files.filter(f => f.status === 'permanent');
      const staging = files.filter(f => f.status === 'staging');
      setCustomerPermanentFiles(permanent);
      setCustomerStagingFiles(staging);
    }}
    sessionId={customerSessionId}
    onSessionChange={setCustomerSessionId}
  />
  ```

- [ ] **Load existing images (edit mode)**
  ```typescript
  useEffect(() => {
    if (entity?.customerImages) {
      const stagingFiles = entity.customerImages.map((url, idx) => 
        urlToStagingFile(url, idx)
      );
      setCustomerPermanentFiles(stagingFiles);
    }
  }, [entity]);
  ```

- [ ] **Submit handler**
  ```typescript
  const onSubmit = async (values) => {
    // 1. Create entity first
    let entityId = entity?.id;
    if (!entityId) {
      const response = await createEntity(values);
      entityId = response.id;
    }
    
    // 2. Confirm customer images
    let finalCustomerUrls = [];
    const cleanedCustomer = customerPermanentFiles.filter(
      f => !customerFilesToDelete.includes(f.id)
    );
    
    if (customerSessionId && customerStagingFiles.length > 0) {
      const confirmed = await FileUploadAPI.confirmStagingFiles(
        customerSessionId, entityId, 'complaint', 'customer', metadata
      );
      finalCustomerUrls = [...cleanedCustomer.map(f => f.url), ...confirmed.map(f => f.url)];
    } else {
      finalCustomerUrls = cleanedCustomer.map(f => f.url);
    }
    
    // 3. Confirm employee images (tương tự)
    // ...
    
    // 4. Update entity
    await updateEntity({ customerImages: finalCustomerUrls, employeeImages: finalEmployeeUrls });
  };
  ```

#### ✅ Phase 2: API Client

- [ ] **Thêm confirm function vào FileUploadAPI**
  ```typescript
  // lib/file-upload-api.ts
  static async confirmComplaintImages(
    sessionId: string,
    complaintId: string,
    imageType: 'customer' | 'employee',
    metadata?: any
  ): Promise<ServerFile[]> {
    const response = await fetch(
      `/api/staging/confirm/${sessionId}/complaints/${complaintId}/${imageType}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metadata })
      }
    );
    
    if (!response.ok) throw new Error('Confirm failed');
    const data = await response.json();
    return data.files;
  }
  ```

#### ✅ Phase 3: Server Endpoints

- [ ] **Tạo thư mục permanent cho module**
  ```javascript
  // server.js
  const COMPLAINTS_DIR = path.join(PERMANENT_DIR, 'complaints');
  fs.ensureDirSync(COMPLAINTS_DIR);
  ```

- [ ] **Thêm confirm endpoint**
  ```javascript
  app.post('/api/staging/confirm/:sessionId/complaints/:complaintId/:imageType', (req, res) => {
    const { sessionId, complaintId, imageType } = req.params;
    const metadata = req.body.metadata || {};
    
    db.all(
      'SELECT * FROM files WHERE session_id = ? AND status = "staging"',
      [sessionId],
      (err, rows) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        
        // Create permanent directory
        const complaintDir = path.join(COMPLAINTS_DIR, complaintId.toString(), imageType);
        fs.ensureDirSync(complaintDir);
        
        const confirmedFiles = [];
        
        rows.forEach(file => {
          // Generate filename
          const ext = path.extname(file.original_name);
          const slugName = slugify(
            `${metadata.customerName || 'unknown'}-${metadata.orderCode || 'no-code'}-${Date.now()}`,
            { lower: true, strict: true }
          );
          const newFilename = `${slugName}${ext}`;
          
          // Move file
          const oldPath = file.filepath;
          const newPath = path.join(complaintDir, newFilename);
          fs.moveSync(oldPath, newPath, { overwrite: true });
          
          // Update database
          db.run(`
            UPDATE files SET
              employee_id = ?,
              document_type = 'complaint',
              document_name = ?,
              filename = ?,
              filepath = ?,
              status = 'permanent',
              confirmed_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `, [complaintId, imageType, newFilename, newPath, file.id]);
          
          // Build URL
          const url = `/api/files/complaints/${complaintId}/${imageType}/${newFilename}`;
          confirmedFiles.push({
            id: file.id,
            name: file.original_name,
            filename: newFilename,
            url: url,
            size: file.filesize,
            type: file.mimetype,
            status: 'permanent'
          });
        });
        
        // Cleanup staging
        fs.remove(path.join(STAGING_DIR, sessionId), () => {});
        
        res.json({ success: true, files: confirmedFiles });
      }
    );
  });
  ```

- [ ] **Thêm serve endpoint**
  ```javascript
  app.get('/api/files/complaints/:complaintId/:imageType/:filename', (req, res) => {
    const { complaintId, imageType, filename } = req.params;
    const filePath = path.join(COMPLAINTS_DIR, complaintId, imageType, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }
    
    res.sendFile(filePath);
  });
  ```

#### ✅ Phase 4: Database

- [ ] **Verify files table có đủ columns**
  ```sql
  -- Không cần thay đổi schema, chỉ cần sử dụng đúng:
  -- document_type = 'complaint'
  -- document_name = 'customer' hoặc 'employee'
  -- employee_id = complaintId
  ```

#### ✅ Phase 5: Testing

- [ ] Upload files mới
- [ ] Edit và giữ files cũ
- [ ] Xóa files cũ
- [ ] Thêm files mới khi edit
- [ ] Cancel form (check staging cleanup)
- [ ] Xem images trên detail page

---

## 9. TROUBLESHOOTING

### ❌ Problem 1: Files không upload được

**Triệu chứng**: NewDocumentsUpload không call API

**Nguyên nhân**:
- Thiếu `sessionId` và `onSessionChange` props
- API endpoint `/api/staging/upload` bị lỗi

**Giải pháp**:
```tsx
// ✅ Correct
<NewDocumentsUpload
  sessionId={customerSessionId}
  onSessionChange={setCustomerSessionId}
  // ... other props
/>

// ❌ Wrong
<NewDocumentsUpload
  // Missing sessionId props
/>
```

Kiểm tra server:
```bash
# Check server logs
POST /api/staging/upload
# Should return { success: true, files: [...], sessionId: '...' }
```

---

### ❌ Problem 2: Confirm files bị lỗi 404

**Triệu chứng**: `POST /api/staging/confirm/...` trả về 404

**Nguyên nhân**:
- Server chưa có endpoint cho module mới
- Route pattern không match

**Giải pháp**:
```javascript
// Kiểm tra server.js có endpoint này chưa
app.post('/api/staging/confirm/:sessionId/complaints/:complaintId/:imageType', ...)

// Pattern phải match với call từ frontend:
FileUploadAPI.confirmComplaintImages(sessionId, complaintId, imageType, metadata)
```

---

### ❌ Problem 3: Files không hiển thị sau khi confirm

**Triệu chứng**: Submit thành công nhưng images không thấy trên UI

**Nguyên nhân**:
- URL không đúng format
- Serve endpoint chưa có

**Giải pháp**:
```javascript
// ✅ Correct URL format
const url = `/api/files/complaints/${complaintId}/${imageType}/${filename}`;

// Server phải có endpoint serve này
app.get('/api/files/complaints/:complaintId/:imageType/:filename', (req, res) => {
  res.sendFile(filePath);
});
```

Kiểm tra:
```bash
# Test serve endpoint
curl http://localhost:5000/api/files/complaints/123/customer/file.jpg
# Should return image file
```

---

### ❌ Problem 4: Edit mode không load hình cũ

**Triệu chứng**: Khi edit, không thấy hình ảnh đã upload trước đó

**Nguyên nhân**:
- Không convert URLs thành StagingFile format
- useEffect dependency thiếu

**Giải pháp**:
```typescript
// ✅ Correct
useEffect(() => {
  if (entity?.customerImages && entity.customerImages.length > 0) {
    const stagingFiles: StagingFile[] = entity.customerImages.map((url, idx) => ({
      id: `existing-${idx}-${Date.now()}`,
      name: url.split('/').pop() || `file-${idx}`,
      originalName: url.split('/').pop() || `file-${idx}`,
      slug: url.split('/').pop() || `file-${idx}`,
      filename: url.split('/').pop() || `file-${idx}`,
      size: 0,
      type: 'image/jpeg',
      url: url,  // ⭐ MUST have full URL
      status: 'permanent' as const,
      sessionId: '',
      uploadedAt: new Date().toISOString(),
      metadata: ''
    }));
    setCustomerPermanentFiles(stagingFiles);
  }
}, [entity]); // ⭐ Dependency array
```

---

### ❌ Problem 5: Staging files không bị xóa sau confirm

**Triệu chứng**: Thư mục `uploads/staging/{sessionId}` còn lại sau submit

**Nguyên nhân**:
- Server không cleanup staging directory
- Silent error trong fs.remove

**Giải pháp**:
```javascript
// Trong confirm endpoint
const stagingDir = path.join(STAGING_DIR, sessionId);
fs.remove(stagingDir, (err) => {
  if (err) {
    console.error('Failed to cleanup staging:', err);
  }
  // Continue anyway (silent cleanup)
});
```

Manual cleanup:
```bash
# Check staging directory
ls uploads/staging/

# Remove old sessions
rm -rf uploads/staging/*
```

---

### ❌ Problem 6: TypeScript lỗi với StagingFile

**Triệu chứng**: Type error khi assign StagingFile

**Nguyên nhân**:
- Thiếu properties bắt buộc
- Type không match

**Giải pháp**:
```typescript
// ✅ All required properties
const stagingFile: StagingFile = {
  id: '...',           // ✅ Required
  name: '...',         // ✅ Required
  originalName: '...', // ✅ Required
  slug: '...',         // ✅ Required
  filename: '...',     // ✅ Required
  size: 0,             // ✅ Required
  type: '...',         // ✅ Required
  url: '...',          // ✅ Required
  status: 'permanent', // ✅ Required ('staging' | 'permanent')
  sessionId: '',       // ✅ Required
  uploadedAt: '...',   // ✅ Required (ISO string)
  metadata: ''         // ✅ Required
};
```

---

### ❌ Problem 9: Preview modal không hiển thị

**Triệu chứng**: Click vào thumbnail nhưng modal không mở

**Nguyên nhân**:
- State `previewImage` không được set
- Dialog component không import đúng
- Image URL bị lỗi

**Giải pháp**:
```typescript
// ✅ Import Dialog
import { Dialog, DialogContent } from '@/components/ui/dialog';

// ✅ State cho preview
const [previewImage, setPreviewImage] = useState<string | null>(null);

// ✅ Set state khi click
<img
  src={img.url}
  onClick={() => {
    console.log('Preview image:', img.url);
    setPreviewImage(img.url);
  }}
/>

// ✅ Dialog component
<Dialog 
  open={!!previewImage} 
  onOpenChange={(open) => {
    console.log('Dialog open:', open);
    if (!open) setPreviewImage(null);
  }}
>
  <DialogContent className="max-w-4xl">
    <img src={previewImage || ''} alt="Preview" />
  </DialogContent>
</Dialog>
```

**Debug:**
```typescript
// Check image URL
console.log('Image URLs:', customerImages.map(img => img.url));

// Check dialog state
console.log('Preview state:', { previewImage, isOpen: !!previewImage });
```

---

### ❌ Problem 10: Xóa file nhưng vẫn hiển thị sau reload

**Triệu chứng**: Xóa file trong form edit, submit thành công, nhưng reload lại thấy file vẫn còn

**Nguyên nhân**:
- **Không filter `filesToDelete` trước khi save**
- Lưu tất cả URLs (cả permanent + staging) mà không loại bỏ files bị xóa

**Giải pháp**:
```typescript
// ❌ WRONG: Không filter
const finalUrls = [
  ...customerPermanentFiles.map(f => f.url),  // Bao gồm cả files bị mark delete!
  ...confirmedStagingUrls
];

// ✅ CORRECT: Filter deleted files
const cleanedPermanent = customerPermanentFiles.filter(
  f => !customerFilesToDelete.includes(f.id)  // Loại bỏ files bị xóa
);

const finalUrls = [
  ...cleanedPermanent.map(f => f.url),  // Chỉ files còn lại
  ...confirmedStagingUrls
];

// ✅ Log để verify
console.log('🔍 Files status:', {
  permanent: customerPermanentFiles.length,
  markedDelete: customerFilesToDelete.length,
  afterFilter: cleanedPermanent.length,
  staging: customerStagingFiles.length,
  final: finalUrls.length
});
```

**Checklist khi submit:**
- [ ] Filter `filesToDelete` khỏi `permanentFiles`
- [ ] Chỉ confirm `stagingFiles` (không confirm permanent)
- [ ] Merge cleaned permanent + confirmed staging
- [ ] Log để verify số lượng đúng

---

### ❌ Problem 11: Delete staging session không chạy

**Triệu chứng**: Cancel form nhưng staging files vẫn còn trên server

**Nguyên nhân**:
- useEffect cleanup không trigger
- sessionId null hoặc undefined
- API endpoint bị lỗi

**Giải pháp**:
```typescript
// ✅ Correct useEffect cleanup
useEffect(() => {
  return () => {
    // Cleanup chỉ chạy khi component unmount
    console.log('🧹 Cleanup triggered');
    
    if (customerSessionId) {
      console.log('🗑️ Deleting customer staging:', customerSessionId);
      FileUploadAPI.deleteStagingSession(customerSessionId).catch(err => {
        console.error('Failed to cleanup customer staging:', err);
      });
    }
    
    if (employeeSessionId) {
      console.log('🗑️ Deleting employee staging:', employeeSessionId);
      FileUploadAPI.deleteStagingSession(employeeSessionId).catch(err => {
        console.error('Failed to cleanup employee staging:', err);
      });
    }
  };
}, [customerSessionId, employeeSessionId]);  // ⭐ Dependency array

// ✅ Server endpoint check
app.delete('/api/staging/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  
  console.log('🗑️ DELETE staging session:', sessionId);
  
  if (!sessionId) {
    return res.status(400).json({ 
      success: false, 
      message: 'sessionId required' 
    });
  }
  
  // Delete files...
});
```

**Manual cleanup (nếu cần):**
```bash
# Xem staging files
ls uploads/staging/

# Xóa sessions cũ hơn 1 ngày
find uploads/staging/ -type d -mtime +1 -exec rm -rf {} +
```

---

### ❌ Problem 12: Image không load (404 Not Found)

**Triệu chứng**: `<img src="...">` hiển thị broken image icon

**Nguyên nhân**:
- URL không đúng format
- File không tồn tại trên server
- Server endpoint không match URL pattern

**Giải pháp**:
```typescript
// ✅ Check URL format
console.log('Image URLs:', customerImages.map(img => ({
  id: img.id,
  url: img.url,
  status: img.status
})));

// ✅ Expected formats:
// Staging: /api/staging/files/{sessionId}/{filename}
// Permanent: /api/files/complaints/{complaintId}/{imageType}/{filename}

// ✅ Test URL manually
fetch(img.url)
  .then(res => {
    console.log('Image fetch:', res.status, res.statusText);
    if (!res.ok) {
      console.error('Image not found:', img.url);
    }
  });

// ✅ Server: Add logging
app.get('/api/files/complaints/:complaintId/:imageType/:filename', (req, res) => {
  const { complaintId, imageType, filename } = req.params;
  const filePath = path.join(COMPLAINTS_DIR, complaintId, imageType, filename);
  
  console.log('📂 Serve image:', {
    url: req.url,
    path: filePath,
    exists: fs.existsSync(filePath)
  });
  
  if (!fs.existsSync(filePath)) {
    console.error('❌ File not found:', filePath);
    return res.status(404).json({ 
      success: false, 
      message: 'Image not found',
      path: filePath  // For debugging
    });
  }
  
  res.sendFile(filePath);
});
```

**Debug steps:**
1. Copy image URL from browser
2. Open in new tab
3. Check network tab for response
4. Check server logs for request
5. Verify file exists on disk

---

### ❌ Problem 13: Upload nhiều lần bị duplicate

**Triệu chứng**: Upload 3 files, lưu được 6-9 files

**Nguyên nhân**:
- onChange được trigger nhiều lần
- Không deduplicate files
- Append thay vì replace state

**Giải pháp**:
```typescript
// ✅ Deduplicate by ID
onChange={(files) => {
  console.log('📥 onChange triggered:', files.length);
  
  // Remove duplicates by ID
  const uniqueFiles = files.reduce((acc, file) => {
    if (!acc.find(f => f.id === file.id)) {
      acc.push(file);
    }
    return acc;
  }, [] as StagingFile[]);
  
  console.log('After dedup:', uniqueFiles.length);
  
  // Split permanent and staging
  const permanent = uniqueFiles.filter(f => f.status === 'permanent');
  const staging = uniqueFiles.filter(f => f.status === 'staging');
  
  // Track deletions
  const currentIds = uniqueFiles.map(f => f.id);
  const deleted = customerPermanentFiles
    .filter(f => !currentIds.includes(f.id))
    .map(f => f.id);
  
  if (deleted.length > 0) {
    setCustomerFilesToDelete(prev => {
      // Deduplicate deletions too
      const uniqueDeleted = [...new Set([...prev, ...deleted])];
      return uniqueDeleted;
    });
  }
  
  // ⭐ Replace state (not append)
  setCustomerPermanentFiles(permanent);
  setCustomerStagingFiles(staging);
}}
```

---

### 🔍 Debug Checklist

Khi gặp lỗi, kiểm tra theo thứ tự:

1. **Frontend State**
   - [ ] `permanentFiles` có data?
   - [ ] `stagingFiles` có data?
   - [ ] `sessionId` đã được set?
   - [ ] `filesToDelete` tracking đúng?
   - [ ] `previewImage` state hoạt động?

2. **API Calls**
   - [ ] Upload: `POST /api/staging/upload` → 200 OK?
   - [ ] Confirm: `POST /api/staging/confirm/...` → 200 OK?
   - [ ] Serve: `GET /api/files/...` → 200 OK?
   - [ ] Delete: `DELETE /api/files/:id` → 200 OK?
   - [ ] Response có `files` array?

3. **Server**
   - [ ] Endpoint exists?
   - [ ] Directory created? (`fs.ensureDirSync`)
   - [ ] Files moved successfully?
   - [ ] Database updated?
   - [ ] Staging cleaned up?
   - [ ] Serve endpoint match URL pattern?

4. **Database**
   - [ ] Files inserted với `status='staging'`?
   - [ ] Files updated với `status='permanent'`?
   - [ ] `employee_id` (entityId) đúng?
   - [ ] `document_type` và `document_name` đúng?
   - [ ] Query files by sessionId works?

5. **File System**
   - [ ] Staging files tồn tại: `uploads/staging/{sessionId}/`?
   - [ ] Permanent files tồn tại: `uploads/permanent/{entity}/{id}/{type}/`?
   - [ ] Permissions OK?
   - [ ] File paths không có ký tự đặc biệt?

6. **UI/UX**
   - [ ] Preview modal hiển thị đúng?
   - [ ] Delete có confirmation?
   - [ ] Loading states hiển thị?
   - [ ] Error messages rõ ràng?
   - [ ] Visual feedback khi delete (opacity/badge)?

5. **File System**
   - [ ] Staging files tồn tại: `uploads/staging/{sessionId}/`?
   - [ ] Permanent files tồn tại: `uploads/permanent/{entity}/{id}/{type}/`?
   - [ ] Permissions OK?

---

## 🎓 KẾT LUẬN

### 📌 Điểm Quan Trọng Cần Nhớ

1. **Two-Phase Commit**: Luôn staging trước, confirm sau
2. **Session ID**: Group files để dễ cleanup
3. **Entity ID**: Phải có ID trước khi confirm
4. **Filter Deletes**: Lọc `filesToDelete` trước khi merge URLs
5. **Status Tracking**: `permanent` vs `staging` files
6. **Silent Cleanup**: Staging cleanup không được fail submit

### 🚀 Next Steps

Khi triển khai cho module mới:
1. Copy state pattern từ warranty
2. Tạo confirm function trong FileUploadAPI
3. Thêm server endpoints (confirm + serve)
4. Test đầy đủ CRUD operations

### 📚 Tài Liệu Tham Khảo

- **Warranty Form**: `features/warranty/warranty-form-page.tsx` (lines 51-590)
- **FileUploadAPI**: `lib/file-upload-api.ts` (lines 1-365)
- **Server Logic**: `server/server.js` (lines 315-1320)
- **NewDocumentsUpload**: `components/ui/new-documents-upload.tsx`

---

**Tác giả**: Generated for HRM System  
**Ngày tạo**: 2024  
**Version**: 1.0  
**Module tham khảo**: Warranty (Bảo hành)

---

_Tài liệu này là tài liệu sống (living document). Cập nhật khi có thay đổi trong hệ thống._
