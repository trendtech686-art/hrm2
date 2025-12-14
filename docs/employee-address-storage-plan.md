# Employee Address Storage - Implementation Plan

> **Mục đích:** Chuẩn hóa cách lưu trữ địa chỉ nhân viên (thường trú + tạm trú) để dễ dàng chuyển đổi giữa 2-cấp và 3-cấp, đồng thời sẵn sàng cho migration Next.js + Database thật.
> 
> **Ngày tạo:** 22/11/2025  
> **Ngày hoàn thành Phase 1:** 22/11/2025  
> **Trạng thái:** ✅ Phase 1 Completed → Ready for Phase 2

---

## 📋 Vấn đề hiện tại

### 1. Cấu trúc dữ liệu không rõ ràng
```typescript
// ❌ Hiện tại - Lưu string concatenated
interface Employee {
  permanentAddress?: string;  // "123 ABC, Phường 1, TP.HCM"
  temporaryAddress?: string;  // "456 XYZ, Quận 2, TP.HCM"
}
```

**Vấn đề:**
- ❌ Mất metadata (provinceId, districtId, wardId, inputLevel)
- ❌ Khó parse lại khi edit
- ❌ Không biết địa chỉ là 2-cấp hay 3-cấp
- ❌ Khó query/filter theo tỉnh/quận/phường

### 2. Parse address không chính xác
```typescript
// ❌ Hiện tại - parseAddress chỉ split string
const parseAddress = (fullAddress?: string): AddressParts => {
  const parts = fullAddress.split(',').map((p) => p.trim());
  return {
    street: parts[0] || '',
    ward: parts[1] || '',      // Có thể là ward hoặc district
    province: parts[2] || '',
    // Mất hết các ID và inputLevel
  };
}
```

**Vấn đề:**
- ❌ Không phân biệt được district vs ward
- ❌ Không lưu provinceId, districtId, wardId
- ❌ Không biết inputLevel (2-cấp hay 3-cấp)
- ❌ Khi user chuyển từ 3-cấp sang 2-cấp → mất data ward

### 3. Submit handler mất data
```typescript
// ❌ Hiện tại - Chỉ lưu string, mất metadata
permanentAddress: [permanentAddress.street, permanentAddress.ward || permanentAddress.district, permanentAddress.province]
  .filter(Boolean)
  .join(', ')
```

**Vấn đề:**
- ❌ Không lưu inputLevel → Không biết format gốc
- ❌ Không lưu IDs → Không query được theo tỉnh/quận
- ❌ Khi edit lại, không biết địa chỉ ban đầu là 2-cấp hay 3-cấp

---

## 🎯 Giải pháp: Structured Data Storage

### Phase 1: Mock Store (LocalStorage) - Implement ngay

#### 1.1. Type Definitions

```typescript
// features/employees/types.ts

export type AddressInputLevel = '2-level' | '3-level';

/**
 * Structured address data - Chuẩn cho cả mock và DB thật
 */
export interface EmployeeAddress {
  street: string;              // Số nhà, đường
  province: string;            // "TP Hồ Chí Minh"
  provinceId: string;          // "79"
  district: string;            // "Quận 7"
  districtId: number;          // 769
  ward: string;                // "Phường Tân Phú" (có thể rỗng nếu 2-cấp)
  wardId: string;              // "27259" (có thể rỗng nếu 2-cấp)
  inputLevel: AddressInputLevel; // '2-level' | '3-level'
}

export interface Employee {
  systemId: SystemId;
  id: BusinessId;
  fullName: string;
  
  // ✅ Địa chỉ - Lưu structured data
  permanentAddress: EmployeeAddress | null;
  temporaryAddress: EmployeeAddress | null;
  
  // ... other fields
}
```

#### 1.2. Store Implementation

```typescript
// features/employees/store.ts

/**
 * Format địa chỉ thành chuỗi hiển thị
 * - 2-cấp: "123 ABC, Quận 7, TP.HCM"
 * - 3-cấp: "123 ABC, Phường Tân Phú, TP.HCM"
 */
const formatAddressDisplay = (addr: EmployeeAddress | null): string => {
  if (!addr) return '';
  
  const { street, ward, district, province, inputLevel } = addr;
  
  if (inputLevel === '3-level') {
    // 3-cấp: Hiển thị ward
    return [street, ward, province].filter(Boolean).join(', ');
  } else {
    // 2-cấp: Hiển thị district
    return [street, district, province].filter(Boolean).join(', ');
  }
};

export const useEmployeeStore = createStore<Employee>({
  entityType: 'employees',
  
  // Không cần transform - Lưu thẳng structured data vào localStorage
  // Display string sẽ được tạo runtime khi cần
});
```

#### 1.3. Form Component Updates

**A. Update parseAddress function**

```typescript
// features/employees/employee-form.tsx

/**
 * Parse EmployeeAddress thành AddressParts cho form
 * - Giữ nguyên tất cả metadata
 * - Không mất data khi chuyển đổi 2-cấp ↔ 3-cấp
 */
const parseAddress = (addr: EmployeeAddress | null): AddressParts => {
  if (!addr) {
    return {
      label: '',
      street: '',
      province: '',
      provinceId: '',
      district: '',
      districtId: 0,
      ward: '',
      wardId: '',
      contactName: '',
      contactPhone: '',
      notes: '',
      inputLevel: '2-level',
    };
  }
  
  // ✅ Giữ nguyên structured data
  return {
    label: '',
    street: addr.street,
    province: addr.province,
    provinceId: addr.provinceId,
    district: addr.district,
    districtId: addr.districtId,
    ward: addr.ward,
    wardId: addr.wardId,
    contactName: '',
    contactPhone: '',
    notes: '',
    inputLevel: addr.inputLevel,
  };
};
```

**B. Update state initialization**

```typescript
// Initialize với structured data từ initialData
const [permanentAddress, setPermanentAddress] = React.useState<AddressParts>(
  parseAddress(initialData?.permanentAddress)
);
const [temporaryAddress, setTemporaryAddress] = React.useState<AddressParts>(
  parseAddress(initialData?.temporaryAddress)
);
```

**C. Update submit handler**

```typescript
const handleSubmit = async (values: EmployeeFormValues) => {
  // ✅ Convert AddressParts → EmployeeAddress
  const permanentAddr: EmployeeAddress | null = permanentAddress.street || permanentAddress.province
    ? {
        street: permanentAddress.street,
        province: permanentAddress.province,
        provinceId: permanentAddress.provinceId,
        district: permanentAddress.district,
        districtId: permanentAddress.districtId,
        ward: permanentAddress.ward,
        wardId: permanentAddress.wardId,
        inputLevel: permanentAddress.inputLevel,
      }
    : null;

  const temporaryAddr: EmployeeAddress | null = temporaryAddress.street || temporaryAddress.province
    ? {
        street: temporaryAddress.street,
        province: temporaryAddress.province,
        provinceId: temporaryAddress.provinceId,
        district: temporaryAddress.district,
        districtId: temporaryAddress.districtId,
        ward: temporaryAddress.ward,
        wardId: temporaryAddress.wardId,
        inputLevel: temporaryAddress.inputLevel,
      }
    : null;

  const payload = {
    ...values,
    permanentAddress: permanentAddr,  // ✅ Structured data
    temporaryAddress: temporaryAddr,   // ✅ Structured data
  };

  await onSubmit(payload);
};
```

**D. Update display (Addresses tab)**

```typescript
// Tab "Địa chỉ" - Display formatted address
{permanentAddress.street || permanentAddress.ward || permanentAddress.province ? (
  <dl className="grid gap-2 text-sm">
    {permanentAddress.province && (
      <div className="flex flex-col">
        <span className="text-muted-foreground">Tỉnh/Thành phố</span>
        <span className="font-medium">{permanentAddress.province}</span>
      </div>
    )}
    {permanentAddress.inputLevel === '3-level' && permanentAddress.ward && (
      <div className="flex flex-col">
        <span className="text-muted-foreground">Phường/Xã</span>
        <span className="font-medium">{permanentAddress.ward}</span>
      </div>
    )}
    {permanentAddress.inputLevel === '2-level' && permanentAddress.district && (
      <div className="flex flex-col">
        <span className="text-muted-foreground">Quận/Huyện</span>
        <span className="font-medium">{permanentAddress.district}</span>
      </div>
    )}
    {permanentAddress.street && (
      <div className="flex flex-col">
        <span className="text-muted-foreground">Số nhà, đường</span>
        <span className="font-medium">{permanentAddress.street}</span>
      </div>
    )}
  </dl>
) : (
  <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
    Chưa có địa chỉ. Nhấn "Chỉnh sửa địa chỉ" để nhập.
  </div>
)}
```

---

## 🔄 Kịch bản chuyển đổi 2-cấp ↔ 3-cấp

### QUAN TRỌNG: Hiểu đúng về 2-cấp và 3-cấp

**3-cấp (địa chỉ đầy đủ):**
- Format: Tỉnh/TP → **Quận/Huyện** → **Phường/Xã**
- Ví dụ: "TP Hồ Chí Minh → Quận 7 → Phường Tân Phú"
- Display: "123 Nguyễn Văn Linh, **Quận 7, Phường Tân Phú**, TP.HCM"

**2-cấp (bỏ cấp Quận/Huyện):**
- Format: Tỉnh/TP → **Phường/Xã** (không có Quận/Huyện)
- Ví dụ: "TP Hồ Chí Minh → Phường Tân Phú" (bỏ Quận 7)
- Display: "123 Nguyễn Văn Linh, **Phường Tân Phú**, TP.HCM"

### Case 1: User chọn 2-cấp ban đầu

```typescript
// Bước 1: User mở dialog và chọn:
// - Tỉnh/TP: "TP Hồ Chí Minh"
// - Phường/Xã: "Phường Tân Phú" (KHÔNG có Quận/Huyện)
// - Input level: "2-level"

const address: EmployeeAddress = {
  street: '123 Nguyễn Văn Linh',
  province: 'TP Hồ Chí Minh',
  provinceId: '79',
  district: '',           // ✅ Rỗng vì 2-cấp không có District
  districtId: 0,
  ward: 'Phường Tân Phú', // ✅ 2-cấp dùng Ward trực tiếp
  wardId: '27259',
  inputLevel: '2-level'
};

// Display: "123 Nguyễn Văn Linh, Phường Tân Phú, TP Hồ Chí Minh"
// (Không có Quận/Huyện)
```

### Case 2: User chuyển sang 3-cấp

```typescript
// Bước 2: User click "Chỉnh sửa địa chỉ" → Chọn 3-cấp
// Dialog tự động load:
// - Province: "TP Hồ Chí Minh" (giữ nguyên)
// - District: "" (rỗng, user phải chọn mới)
// - Ward: "Phường Tân Phú" (giữ lại từ 2-cấp)

// User chọn:
// - Quận/Huyện: "Quận 7" (thêm mới)

const updatedAddress: EmployeeAddress = {
  street: '123 Nguyễn Văn Linh',
  province: 'TP Hồ Chí Minh',
  provinceId: '79',
  district: 'Quận 7',       // ✅ Thêm mới District cho 3-cấp
  districtId: 769,
  ward: 'Phường Tân Phú',   // ✅ Giữ lại từ 2-cấp
  wardId: '27259',
  inputLevel: '3-level'      // ✅ Chuyển mode
};

// Display: "123 Nguyễn Văn Linh, Quận 7, Phường Tân Phú, TP Hồ Chí Minh"
// (Đầy đủ cả District và Ward)
```

### Case 3: User chuyển lại về 2-cấp

```typescript
// Bước 3: User click "Chỉnh sửa địa chỉ" → Chọn 2-cấp
// Dialog tự động load:
// - Province: "TP Hồ Chí Minh" (giữ nguyên)
// - District: "Quận 7" (ẩn field, nhưng data vẫn còn)
// - Ward: "Phường Tân Phú" (giữ nguyên)

const revertedAddress: EmployeeAddress = {
  street: '123 Nguyễn Văn Linh',
  province: 'TP Hồ Chí Minh',
  provinceId: '79',
  district: 'Quận 7',       // ✅ Vẫn còn trong data
  districtId: 769,
  ward: 'Phường Tân Phú',   // ✅ Vẫn còn, sẽ hiển thị
  wardId: '27259',
  inputLevel: '2-level'      // ✅ Chuyển lại mode
};

// Display: "123 Nguyễn Văn Linh, Phường Tân Phú, TP Hồ Chí Minh"
// (Chỉ hiển thị Ward, bỏ District)
// ✅ District data được giữ lại, user có thể chuyển lại 3-cấp mà không mất!
```

---

## 📊 So sánh Before/After

| Aspect | Before (String) | After (Structured) |
|--------|----------------|-------------------|
| **Storage** | `"123 ABC, Phường 1, TP.HCM"` | `{ street, province, provinceId, district, districtId, ward, wardId, inputLevel }` |
| **Parse** | ❌ Split string → mất metadata | ✅ Giữ nguyên object |
| **2-cấp ↔ 3-cấp** | ❌ Mất data khi chuyển | ✅ Giữ tất cả fields |
| **Query** | ❌ Không query được | ✅ Query theo provinceId, districtId |
| **Display 3-cấp** | ❌ Concat tĩnh | ✅ "Street, **District, Ward**, Province" |
| **Display 2-cấp** | ❌ Concat tĩnh | ✅ "Street, **Ward**, Province" (bỏ District) |
| **Migration** | ❌ Phải reparse tất cả | ✅ Sẵn sàng cho DB normalized |

---

## 🚀 Implementation Checklist

### Phase 1: Mock Store (Current - LocalStorage) ✅ COMPLETED

- [x] **Step 1:** Update `features/employees/types.ts`
  - [x] Add `AddressInputLevel` type
  - [x] Add `EmployeeAddress` interface
  - [x] Update `Employee` interface (change `permanentAddress`, `temporaryAddress` to `EmployeeAddress | null`)

- [x] **Step 2:** Update `features/employees/employee-form.tsx`
  - [x] Update `parseAddress` function to handle `EmployeeAddress | null`
  - [x] Update state initialization (`permanentAddress`, `temporaryAddress`)
  - [x] Update `handleSubmit` to create structured `EmployeeAddress` objects
  - [x] Update display in "Địa chỉ" tab to show dynamic format based on `inputLevel`

- [x] **Step 3:** Update `features/employees/detail-page.tsx`
  - [x] Update display logic to format `EmployeeAddress` → string for viewing
  - [x] Use helper function `formatAddressDisplay`

- [x] **Step 4:** Update seed data
  - [x] Convert existing string addresses to structured format in `features/employees/data.ts`
  - [x] Ensure all mock employees have valid `EmployeeAddress` objects

- [ ] **Step 5:** Test scenarios (Manual QA)
  - [ ] Create employee with 2-cấp address
  - [ ] Edit and change to 3-cấp
  - [ ] Edit and change back to 2-cấp → Verify ward data không bị mất
  - [ ] Save and reload → Verify data structure được giữ nguyên

---

## 🔮 Phase 2: Next.js + Database (Future)

### Database Schema (PostgreSQL/MySQL)

```sql
-- Table: employees
CREATE TABLE employees (
  system_id VARCHAR(50) PRIMARY KEY,
  id VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  
  -- Địa chỉ thường trú (normalized columns)
  permanent_address_street TEXT,
  permanent_address_province VARCHAR(100),
  permanent_address_province_id VARCHAR(10),
  permanent_address_district VARCHAR(100),
  permanent_address_district_id INT,
  permanent_address_ward VARCHAR(100),
  permanent_address_ward_id VARCHAR(10),
  permanent_address_input_level VARCHAR(10) DEFAULT '2-level',
  
  -- Generated column cho display/search
  permanent_address_full TEXT GENERATED ALWAYS AS (
    CASE 
      WHEN permanent_address_input_level = '3-level' 
      THEN CONCAT_WS(', ', permanent_address_street, permanent_address_ward, permanent_address_province)
      ELSE CONCAT_WS(', ', permanent_address_street, permanent_address_district, permanent_address_province)
    END
  ) STORED,
  
  -- Địa chỉ tạm trú (tương tự)
  temporary_address_street TEXT,
  temporary_address_province VARCHAR(100),
  temporary_address_province_id VARCHAR(10),
  temporary_address_district VARCHAR(100),
  temporary_address_district_id INT,
  temporary_address_ward VARCHAR(100),
  temporary_address_ward_id VARCHAR(10),
  temporary_address_input_level VARCHAR(10) DEFAULT '2-level',
  
  temporary_address_full TEXT GENERATED ALWAYS AS (
    CASE 
      WHEN temporary_address_input_level = '3-level' 
      THEN CONCAT_WS(', ', temporary_address_street, temporary_address_ward, temporary_address_province)
      ELSE CONCAT_WS(', ', temporary_address_street, temporary_address_district, temporary_address_province)
    END
  ) STORED,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_employees_permanent_address_full ON employees(permanent_address_full);
CREATE INDEX idx_employees_temporary_address_full ON employees(temporary_address_full);
CREATE INDEX idx_employees_province ON employees(permanent_address_province_id, temporary_address_province_id);
CREATE INDEX idx_employees_district ON employees(permanent_address_district_id, temporary_address_district_id);
```

### Prisma Schema

```prisma
model Employee {
  systemId String @id @map("system_id")
  id       String @unique
  fullName String @map("full_name")
  
  // Permanent Address
  permanentAddressStreet       String?  @map("permanent_address_street")
  permanentAddressProvince     String?  @map("permanent_address_province")
  permanentAddressProvinceId   String?  @map("permanent_address_province_id")
  permanentAddressDistrict     String?  @map("permanent_address_district")
  permanentAddressDistrictId   Int?     @map("permanent_address_district_id")
  permanentAddressWard         String?  @map("permanent_address_ward")
  permanentAddressWardId       String?  @map("permanent_address_ward_id")
  permanentAddressInputLevel   String?  @default("2-level") @map("permanent_address_input_level")
  
  // Temporary Address
  temporaryAddressStreet       String?  @map("temporary_address_street")
  temporaryAddressProvince     String?  @map("temporary_address_province")
  temporaryAddressProvinceId   String?  @map("temporary_address_province_id")
  temporaryAddressDistrict     String?  @map("temporary_address_district")
  temporaryAddressDistrictId   Int?     @map("temporary_address_district_id")
  temporaryAddressWard         String?  @map("temporary_address_ward")
  temporaryAddressWardId       String?  @map("temporary_address_ward_id")
  temporaryAddressInputLevel   String?  @default("2-level") @map("temporary_address_input_level")
  
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  
  @@map("employees")
  @@index([permanentAddressProvinceId])
  @@index([temporaryAddressProvinceId])
}
```

### Next.js API Route

```typescript
// app/api/employees/route.ts
import { db } from '@/lib/db';

export async function POST(req: Request) {
  const data = await req.json();
  
  // Transform EmployeeAddress → DB columns
  const employee = await db.employee.create({
    data: {
      systemId: data.systemId,
      id: data.id,
      fullName: data.fullName,
      
      // Permanent Address
      permanentAddressStreet: data.permanentAddress?.street,
      permanentAddressProvince: data.permanentAddress?.province,
      permanentAddressProvinceId: data.permanentAddress?.provinceId,
      permanentAddressDistrict: data.permanentAddress?.district,
      permanentAddressDistrictId: data.permanentAddress?.districtId,
      permanentAddressWard: data.permanentAddress?.ward,
      permanentAddressWardId: data.permanentAddress?.wardId,
      permanentAddressInputLevel: data.permanentAddress?.inputLevel,
      
      // Temporary Address
      temporaryAddressStreet: data.temporaryAddress?.street,
      temporaryAddressProvince: data.temporaryAddress?.province,
      temporaryAddressProvinceId: data.temporaryAddress?.provinceId,
      temporaryAddressDistrict: data.temporaryAddress?.district,
      temporaryAddressDistrictId: data.temporaryAddress?.districtId,
      temporaryAddressWard: data.temporaryAddress?.ward,
      temporaryAddressWardId: data.temporaryAddress?.wardId,
      temporaryAddressInputLevel: data.temporaryAddress?.inputLevel,
    },
  });
  
  return Response.json(employee);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const provinceId = searchParams.get('provinceId');
  
  const employees = await db.employee.findMany({
    where: provinceId
      ? {
          OR: [
            { permanentAddressProvinceId: provinceId },
            { temporaryAddressProvinceId: provinceId },
          ],
        }
      : {},
  });
  
  // Transform DB columns → EmployeeAddress
  const transformed = employees.map(emp => ({
    ...emp,
    permanentAddress: emp.permanentAddressStreet ? {
      street: emp.permanentAddressStreet,
      province: emp.permanentAddressProvince,
      provinceId: emp.permanentAddressProvinceId,
      district: emp.permanentAddressDistrict,
      districtId: emp.permanentAddressDistrictId,
      ward: emp.permanentAddressWard,
      wardId: emp.permanentAddressWardId,
      inputLevel: emp.permanentAddressInputLevel,
    } : null,
    temporaryAddress: emp.temporaryAddressStreet ? {
      street: emp.temporaryAddressStreet,
      province: emp.temporaryAddressProvince,
      provinceId: emp.temporaryAddressProvinceId,
      district: emp.temporaryAddressDistrict,
      districtId: emp.temporaryAddressDistrictId,
      ward: emp.temporaryAddressWard,
      wardId: emp.temporaryAddressWardId,
      inputLevel: emp.temporaryAddressInputLevel,
    } : null,
  }));
  
  return Response.json(transformed);
}
```

---

## ✅ Benefits

### Immediate (Phase 1)
- ✅ **No data loss**: Chuyển đổi 2-cấp ↔ 3-cấp không mất thông tin
- ✅ **Clear structure**: Code dễ đọc, maintain
- ✅ **Type safety**: TypeScript validation đầy đủ
- ✅ **Query ready**: Có thể filter theo provinceId, districtId (khi cần)

### Long-term (Phase 2)
- ✅ **Migration ready**: Cấu trúc sẵn sàng cho DB normalized
- ✅ **Performance**: DB indexed columns cho fast queries
- ✅ **Scalability**: Generated columns cho full-text search
- ✅ **Analytics**: Dễ dàng report theo tỉnh/quận/phường

---

## 📚 References

- **DEVELOPMENT-GUIDELINES-V2.md**: Quy tắc coding standards
- **ID-GOVERNANCE.md**: Dual ID system (SystemId vs BusinessId)
- **Prisma Docs**: https://www.prisma.io/docs
- **Next.js API Routes**: https://nextjs.org/docs/app/building-your-application/routing/route-handlers

---

**Last Updated:** 22/11/2025  
**Status:** ✅ Phase 1 implemented and ready for testing

## 📝 Implementation Summary

### Files Changed:
1. ✅ `features/employees/types.ts` - Added `EmployeeAddress` interface and `AddressInputLevel` type
2. ✅ `features/employees/employee-form.tsx` - Updated parseAddress, handleSubmit, and display logic
3. ✅ `features/employees/detail-page.tsx` - Added formatAddressDisplay helper
4. ✅ `features/employees/data.ts` - Converted seed data to structured format

### Breaking Changes:
- `Employee.permanentAddress`: `string` → `EmployeeAddress | null`
- `Employee.temporaryAddress`: `string | undefined` → `EmployeeAddress | null`

### Migration Notes:
- Existing localStorage data will need manual migration or will be reset on first load
- All new addresses will be saved as structured `EmployeeAddress` objects
- Display format automatically adapts based on `inputLevel` field

### Next Steps:
1. Manual QA testing (see Step 5 in checklist)
2. Monitor for any edge cases in production
3. Prepare for Phase 2 (Next.js + Database) when ready

