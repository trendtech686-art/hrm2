# 🏗️ ID SYSTEM ARCHITECTURE v2.0

**Last Updated:** 2026-01-20  
**Status:** ✅ Production Ready  
**Architecture:** Simplified & Consolidated

---

## 📊 OVERVIEW

Hệ thống ID dual-key (SystemId + BusinessId) tối ưu cho Next.js + Production Database.

### Core Concepts

- **SystemId**: Internal unique identifier (CATEGORY000001, EMP000001)
  - Dùng cho: Database queries, foreign keys, routing, logic nội bộ
  - Immutable, never expose to users
  
- **BusinessId**: User-facing display identifier (DM000001, NV000001)
  - Dùng cho: UI display, breadcrumbs, reports, user communication
  - Có thể custom (nếu allowCustomId = true)

---

## 📁 FILE STRUCTURE

```
lib/
├── id-system.ts       ⭐ MAIN - All ID operations (748 lines)
├── id-types.ts        🏷️  Branded types only (80 lines)
└── id-generator.ts    🔧 Special cases (custom prefixes)
```

### ✅ `id-system.ts` - Single Source of Truth

**Contains:**
- ✅ ID_CONFIG registry (60+ entities)
- ✅ Branded types (SystemId, BusinessId)
- ✅ Async DB operations (generateNextIds, generateBatchIds)
- ✅ Validation utilities
- ✅ Client-side helpers (for store-factory)
- ✅ Backward compatibility exports

**Key Functions:**
```typescript
// 🔥 Primary - Server-side async generation
generateNextIds(entityType, customBusinessId?) → Promise<GeneratedIds>
generateBatchIds(entityType, count) → Promise<GeneratedIds[]>

// 📊 Preview & utilities
getCurrentCounter(entityType) → Promise<number>
previewNextIds(entityType) → Promise<{...}>

// 🔍 Validation
validateIdFormat(id, entityType) → { valid, error? }
sanitizeBusinessId(id) → string | null

// 🎨 Formatting
formatId(prefix, counter, digitCount) → string
```

### 🏷️ `id-types.ts` - Branded Types

**Purpose:** Lightweight type definitions only (no logic)

**Contains:**
```typescript
type SystemId = string & { readonly __brand: 'SystemId' }
type BusinessId = string & { readonly __brand: 'BusinessId' }

asSystemId(id: string) → SystemId
asBusinessId(id: string) → BusinessId

interface DualIDEntity { systemId, id }
interface IDPair { systemId, businessId }
```

**Usage:** Import from 20+ files (widely used across app)

### 🔧 `id-generator.ts` - Special Cases

**Purpose:** Custom prefix generation (TH, DCGV, etc.)

**Key Function:**
```typescript
generateIdWithPrefix(prefix, tx?) → Promise<string>
// Example: generateIdWithPrefix('TH') → 'TH000001'
```

---

## 🎯 USAGE GUIDE

### ✅ Server-Side (API Routes)

```typescript
import { generateNextIds } from '@/lib/id-system'

// Basic usage - auto-generate both IDs
const { systemId, businessId } = await generateNextIds('categories')
// systemId: "CATEGORY000001"
// businessId: "DM000001"

// With custom business ID (from PKGX import)
const { systemId, businessId } = await generateNextIds('categories', 'DM-CUSTOM')
// systemId: "CATEGORY000002" (auto)
// businessId: "DMCUSTOM" (sanitized custom)

// Batch generation (high-volume imports)
const batch = await generateBatchIds('categories', 100)
// Returns array of 100 ID pairs (atomic, 1 DB query)
```

### ✅ Client-Side (Components, Stores)

```typescript
import { asSystemId, asBusinessId } from '@/lib/id-types'
import type { SystemId, BusinessId, DualIDEntity } from '@/lib/id-types'

// Type-safe ID casting
const systemId = asSystemId(data.systemId)
const businessId = asBusinessId(data.id)

// Type-safe interfaces
interface Category extends DualIDEntity {
  systemId: SystemId
  id: BusinessId
  name: string
}
```

### ✅ Configuration

```typescript
import { ID_CONFIG, type EntityType } from '@/lib/id-system'

// Get entity config
const config = ID_CONFIG['categories']
// {
//   prefix: 'DM',
//   systemIdPrefix: 'CATEGORY',
//   digitCount: 6,
//   displayName: 'Danh mục',
//   category: 'inventory',
//   allowCustomId: true
// }
```

---

## 🗄️ DATABASE SCHEMA

### IdCounter Table

```prisma
model IdCounter {
  systemId       String   @id @default(uuid())
  entityType     String   @unique
  prefix         String
  systemPrefix   String?
  businessPrefix String?
  currentValue   Int      @default(0)
  padding        Int      @default(6)
  updatedAt      DateTime @updatedAt

  @@map("id_counters")
}
```

**Atomic Operations:**
```typescript
// Internally uses upsert for thread-safety
await prisma.idCounter.upsert({
  where: { entityType },
  update: { currentValue: { increment: 1 } },
  create: { entityType, currentValue: 1, ... }
})
```

---

## 🔄 MIGRATION FROM OLD SYSTEM

### Removed Files (Consolidated)

- ❌ `lib/id-config.ts` (1198 lines) → Merged into id-system.ts
- ❌ `lib/id-utils.ts` (290 lines) → Merged into id-system.ts

### Import Changes

```typescript
// ❌ Old (no longer works)
import { ID_CONFIG } from '@/lib/id-config'
import { generateSystemId } from '@/lib/id-utils'

// ✅ New
import { ID_CONFIG, generateNextIds } from '@/lib/id-system'
```

### Backward Compatibility

```typescript
// ✅ Still supported (exported from id-system.ts)
import { generateSystemId, generateBusinessId } from '@/lib/id-system'

// Sync versions (for legacy store-factory)
const systemId = generateSystemId('categories', counter)
const businessId = generateBusinessId('categories', counter, customId)
```

---

## 📋 ENTITY CONFIGURATIONS

**60+ entities organized by category:**

### 📦 Inventory (Kho hàng)
```typescript
'products':   { prefix: 'SP',  systemIdPrefix: 'PRODUCT',  digitCount: 6 }
'brands':     { prefix: 'TH',  systemIdPrefix: 'BRAND',    digitCount: 6 }
'categories': { prefix: 'DM',  systemIdPrefix: 'CATEGORY', digitCount: 6 }
'units':      { prefix: 'DV',  systemIdPrefix: 'UNIT',     digitCount: 6 }
```

### 👥 HR (Nhân sự)
```typescript
'employees':   { prefix: 'NV',  systemIdPrefix: 'EMP',    digitCount: 6 }
'departments': { prefix: 'PB',  systemIdPrefix: 'DEPT',   digitCount: 6 }
'branches':    { prefix: 'CN',  systemIdPrefix: 'BRANCH', digitCount: 6 }
'job-titles':  { prefix: 'CV',  systemIdPrefix: 'JOB',    digitCount: 6 }
```

### 💰 Finance (Tài chính)
```typescript
'receipts':  { prefix: 'PT',  systemIdPrefix: 'RECEIPT',  digitCount: 6 }
'payments':  { prefix: 'PC',  systemIdPrefix: 'PAYMENT',  digitCount: 6 }
'cashbook':  { prefix: 'STQ', systemIdPrefix: 'CASHBOOK', digitCount: 6 }
```

### 🛒 Sales (Bán hàng)
```typescript
'orders':         { prefix: 'DH',  systemIdPrefix: 'ORDER',        digitCount: 6 }
'customers':      { prefix: 'KH',  systemIdPrefix: 'CUSTOMER',     digitCount: 6 }
'sales-returns':  { prefix: 'TH',  systemIdPrefix: 'SALESRETURN',  digitCount: 6 }
```

---

## ⚡ PERFORMANCE

### Atomic Operations
✅ No race conditions with concurrent requests  
✅ Database-backed counter (single source of truth)  
✅ Thread-safe upsert operations

### Batch Operations
```typescript
// ❌ Bad: 1000 imports = 1000 DB queries
for (const item of items) {
  await generateNextIds('categories')
}

// ✅ Good: 1000 imports = 1 DB query
const batch = await generateBatchIds('categories', items.length)
items.forEach((item, i) => {
  item.systemId = batch[i].systemId
  item.id = batch[i].businessId
})
```

---

## 🔒 TYPE SAFETY

### Compile-Time Protection

```typescript
// ❌ Won't compile - type mismatch
function findBySystemId(id: BusinessId) { ... }  // Wrong!

// ✅ Correct - branded types enforce proper usage
function findBySystemId(id: SystemId) { ... }
function displayId(id: BusinessId): string { ... }
```

### Runtime Validation

```typescript
// Validate format
const result = validateIdFormat('DM000001', 'categories')
if (!result.valid) {
  console.error(result.error)
}

// Sanitize user input (removes special chars)
const clean = sanitizeBusinessId('DM-001-ABC')
// Result: "DM001ABC"
```

---

## 🎯 BEST PRACTICES

### ✅ DO

1. **Always use `generateNextIds()` on server**
   ```typescript
   const { systemId, businessId } = await generateNextIds('categories')
   ```

2. **Use batch operations for imports**
   ```typescript
   const batch = await generateBatchIds('categories', 100)
   ```

3. **Store both IDs in database**
   ```typescript
   await prisma.category.create({
     data: { systemId, id: businessId, ... }
   })
   ```

4. **Use SystemId for queries & foreign keys**
   ```typescript
   await prisma.product.findMany({
     where: { categorySystemId: systemId }
   })
   ```

5. **Display BusinessId to users**
   ```typescript
   <Badge>{category.id}</Badge> // Shows "DM000001"
   ```

### ❌ DON'T

1. ❌ Don't expose SystemId to users
2. ❌ Don't use BusinessId for foreign keys
3. ❌ Don't mix sync/async generation methods
4. ❌ Don't hardcode counter values
5. ❌ Don't bypass IdCounter table

---

## 🐛 TROUBLESHOOTING

### Duplicate ID Error

**Problem:** "Mã danh mục đã tồn tại"

**Solution:**
```typescript
// ✅ Use custom ID handling properly
const { systemId, businessId } = await generateNextIds(
  'categories',
  existingId // Pass existing ID to reuse
)
```

### Import Errors

**Problem:** `Cannot find module '@/lib/id-config'`

**Solution:** Update to `@/lib/id-system`
```typescript
import { ID_CONFIG } from '@/lib/id-system'
```

### Type Errors

**Problem:** Type 'string' not assignable to 'SystemId'

**Solution:** Use branded type casters
```typescript
import { asSystemId } from '@/lib/id-types'
const systemId = asSystemId(rawString)
```

---

## 📚 REFERENCES

- **Main File:** [lib/id-system.ts](../lib/id-system.ts)
- **Types:** [lib/id-types.ts](../lib/id-types.ts)
- **Generator:** [lib/id-generator.ts](../lib/id-generator.ts)
- **Schema:** [prisma/schema/settings/id-counter.prisma](../prisma/schema/settings/id-counter.prisma)

---

## ✅ CHANGELOG

### v2.0.0 (2026-01-20)
- ✅ Consolidated 3 files into single id-system.ts
- ✅ Removed duplicate code (id-config.ts, id-utils.ts)
- ✅ Simplified id-types.ts (branded types only)
- ✅ Updated all imports across codebase
- ✅ Maintained backward compatibility
- ✅ Zero compile errors after refactoring

### v1.0.0 (Initial)
- Multiple files with overlapping logic
- Confusion between id-config, id-utils, id-system
- Duplicate type definitions
