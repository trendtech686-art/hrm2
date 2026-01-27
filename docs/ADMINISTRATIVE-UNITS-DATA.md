# Dữ liệu Đơn vị Hành chính Việt Nam

## Tổng quan

Hệ thống sử dụng 2 loại dữ liệu đơn vị hành chính:

| Loại | Tỉnh/TP | Quận/Huyện | Phường/Xã | Mô tả |
|------|---------|------------|-----------|-------|
| **2-level (mới)** | 34 | 0 | 3,321 | Hệ thống mới, chỉ có Tỉnh → Phường |
| **3-level (cũ)** | 63 | 691 | 10,035 | Hệ thống cũ, Tỉnh → Quận → Phường |

## File dữ liệu gốc (mẫu)

### 1. Dữ liệu 2 cấp (34 tỉnh mới)

**File:** `features/settings/provinces/provinces-data.ts`

```typescript
export const PROVINCES_DATA = [
  { id: "01", name: "An Giang" },
  { id: "02", name: "Bà Rịa - Vũng Tàu" },
  // ... 34 tỉnh thành
];
```

**File:** `features/settings/provinces/wards-2level-data.ts`

```typescript
export const WARDS_2LEVEL_DATA = [
  { id: "01001", name: "Phường 1", provinceId: "01", provinceName: "An Giang" },
  // ... 3,321 phường/xã
];
```

### 2. Dữ liệu 3 cấp (63 tỉnh cũ)

**File:** `features/settings/provinces/provinces-3level-data.ts`

```typescript
export const PROVINCES_3LEVEL_DATA = [
  { systemId: "P-1", id: "01", name: "Thành phố Hà Nội" },
  { systemId: "P-2", id: "02", name: "Tỉnh Hà Giang" },
  // ... 63 tỉnh thành
];
```

**File:** `features/settings/provinces/districts-3level-data.ts`

```typescript
export const DISTRICTS_3LEVEL_DATA = [
  { systemId: "D-1", id: 1, name: "Quận Ba Đình", provinceId: "01" },
  // ... 691 quận/huyện
];
```

**File:** `features/settings/provinces/wards-3level-data.ts`

```typescript
export const WARDS_3LEVEL_DATA = [
  { 
    systemId: "W-1", 
    id: "00001", 
    name: "Phường Phúc Xá", 
    provinceId: "01", 
    provinceName: "Thành phố Hà Nội",
    districtId: 1,
    districtName: "Quận Ba Đình"
  },
  // ... 10,035 phường/xã
];
```

## Cấu trúc Database

Dữ liệu được lưu trong 3 bảng với field `level` để phân biệt:

### Bảng `Province`

| Field | Type | Mô tả |
|-------|------|-------|
| systemId | String | ID hệ thống (P2_01, P3_01) |
| id | String | Mã tỉnh (01, 02, ...) |
| name | String | Tên tỉnh/thành phố |
| level | String | '2-level' hoặc '3-level' |

### Bảng `District`

| Field | Type | Mô tả |
|-------|------|-------|
| systemId | String | ID hệ thống (D3_1, D3_2) |
| id | Int | Mã quận/huyện |
| name | String | Tên quận/huyện |
| provinceId | String | Mã tỉnh |
| level | String | '3-level' (chỉ có ở 3-level) |

### Bảng `Ward`

| Field | Type | Mô tả |
|-------|------|-------|
| systemId | String | ID hệ thống (W2_01001, W3_00001) |
| id | String | Mã phường/xã |
| name | String | Tên phường/xã |
| provinceId | String | Mã tỉnh |
| provinceName | String | Tên tỉnh |
| districtId | Int? | Mã quận (chỉ có ở 3-level) |
| districtName | String? | Tên quận (chỉ có ở 3-level) |
| level | String | '2-level' hoặc '3-level' |

## API Endpoints

```
GET /api/administrative-units/provinces
GET /api/administrative-units/provinces?level=2-level  → 34 tỉnh
GET /api/administrative-units/provinces?level=3-level  → 63 tỉnh

GET /api/administrative-units/districts
GET /api/administrative-units/districts?level=3-level  → 691 quận
GET /api/administrative-units/districts?provinceId=01  → Quận của tỉnh 01

GET /api/administrative-units/wards
GET /api/administrative-units/wards?level=2-level      → 3,321 phường
GET /api/administrative-units/wards?level=3-level      → 10,035 phường
GET /api/administrative-units/wards?provinceId=01      → Phường của tỉnh 01
GET /api/administrative-units/wards?districtId=1       → Phường của quận 1
```

## Seed Script

Chạy seed để import dữ liệu vào database:

```bash
npx tsx prisma/seeds/seed-admin-units-v2.ts
```

**Output:**
```
🚀 Starting Administrative Units seed (2-level + 3-level)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2-LEVEL (34 provinces new)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 [2-level] Seeding 34 provinces...
✅ [2-level] Seeded 34 provinces
📍 [2-level] Seeding wards...
✅ [2-level] Seeded 3321 wards

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3-LEVEL (63 provinces old)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 [3-level] Seeding 63 provinces...
✅ [3-level] Seeded 63 provinces
📍 [3-level] Seeding districts...
✅ [3-level] Seeded 691 districts
📍 [3-level] Seeding wards...
✅ [3-level] Seeded 10035 wards

🎉 SEED COMPLETED
2-level: 34 provinces, 3321 wards
3-level: 63 provinces, 691 districts, 10035 wards
```

## Sử dụng trong code

### Zustand Store (deprecated)

```typescript
import { useProvinceStore } from '@/features/settings/provinces/store';

// Load dữ liệu
const { loadData, isLoaded } = useProvinceStore();
useEffect(() => { loadData(); }, []);

// Lấy dữ liệu 2-level
const provinces2Level = useProvinceStore(s => s.getProvinces2Level());
const wards2Level = useProvinceStore(s => s.getWards2LevelByProvinceId('01'));

// Lấy dữ liệu 3-level
const provinces3Level = useProvinceStore(s => s.getProvinces3Level());
const districts = useProvinceStore(s => s.getDistricts3LevelByProvinceId('01'));
const wards3Level = useProvinceStore(s => s.getWards3LevelByDistrictId(1));
```

### React Query Hooks (recommended)

```typescript
import { useProvinces, useDistricts, useWards } from '@/features/settings/provinces/hooks';

// 2-level
const { data: provinces } = useProvinces({ level: '2-level' });
const { data: wards } = useWards({ level: '2-level', provinceId: '01' });

// 3-level
const { data: provinces } = useProvinces({ level: '3-level' });
const { data: districts } = useDistricts({ level: '3-level', provinceId: '01' });
const { data: wards } = useWards({ level: '3-level', districtId: 1 });
```

---

*Cập nhật: Tháng 1/2026*
