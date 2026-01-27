# Infrastructure Stores Migration Report

**Date:** 2026-01-11  
**Task:** Migrate infrastructure stores to React Query

## Summary

After comprehensive analysis of 5 infrastructure stores, here are the findings:

| Store | Files | .getState() | Status | Notes |
|-------|-------|-------------|--------|-------|
| useImageStore | 7 files | 1 | ❌ **CANNOT MIGRATE** | Pure client-side file upload state |
| usePrintTemplateStore | 2 files | 3 | ⚠️ **KEEP ZUSTAND** | UI state (separate from DB templates) |
| useEmployeeMappingStore | 1 file | 1 | ❌ **NO API** | LocalStorage-based import mappings |
| useRecurringTaskStore | 1 file | 0 | ❌ **NO API** | LocalStorage-based via createCrudStore |
| useCustomFieldStore | 1 file | 0 | ❌ **NO API** | LocalStorage-based via createCrudStore |

## Detailed Analysis

### 1. useImageStore (~7 files)

**Location:** `features/products/image-store.ts`

**Usage:**
- `features/products/form-page.tsx`
- `features/products/detail-page.tsx`  
- `features/products/components/product-image.tsx`
- `features/products/components/combo-product-search.tsx`
- `features/products/hooks/use-pkgx-sync.ts` (`.getState()` call)
- `features/shared/product-selection-dialog.tsx`
- `features/orders/components/line-items-table.tsx`

**Verdict:** ❌ **CANNOT MIGRATE - Keep in Zustand**

**Reasons:**
1. Pure client-side state for managing image uploads
2. Handles staging images (before save) and permanent images (after save)
3. Session-based file upload management
4. No database backing - this is transient UI state
5. Marked as infrastructure store for file upload functionality

**Action:** None - this is correctly using Zustand for client-side state management.

---

### 2. usePrintTemplateStore (2 files)

**Location:** `features/settings/printer/store.ts`

**Usage:**
- `lib/use-print.ts` (React hook - OK)
- `lib/print-service.ts` (3 × `.getState()` calls - ⚠️ NEEDS REFACTOR)

**React Query Hooks:** ✅ EXISTS (`features/settings/printer/hooks/use-print-templates.ts`)

**Verdict:** ⚠️ **KEEP ZUSTAND + REFACTOR .getState()**

**Reasons:**
1. Store header says: "✅ KEEP IN ZUSTAND - This is pure UI state"
2. This store manages **LOCAL/UI** template configurations
3. React Query hooks manage **DATABASE** templates (different system)
4. The `.getState()` calls in `print-service.ts` are for non-React utility functions

**Action:** Refactor the 3 `.getState()` calls in `print-service.ts`:
- Option A: Pass template data as parameters
- Option B: Convert functions to React hooks
- Option C: Use React Query hooks where appropriate

**Files needing refactor:**
- `lib/print-service.ts` lines 278, 302, 356

---

### 3. useEmployeeMappingStore (1 file)

**Location:** `lib/import-export/employee-mapping-store.ts`

**Usage:**
- Imported in `lib/import-export/index.ts`
- 1 × `.getState()` call at line 235 in `saveMappingsFromAutoMap()` function

**React Query Hooks:** ❌ DOES NOT EXIST

**API Endpoint:** ⚠️ Partial (has fetch call to `/api/employee-mappings` but no full CRUD API)

**Verdict:** ❌ **NO API - Cannot migrate**

**Reasons:**
1. LocalStorage-based via Zustand
2. Manages import/export employee name mappings
3. No complete API implementation
4. Infrastructure store for import functionality

**Action Required:**
1. Create API endpoints: `app/api/employee-mappings/route.ts`
2. Create React Query hooks: `lib/import-export/hooks/use-employee-mappings.ts`
3. Then migrate usage

---

### 4. useRecurringTaskStore (1 file)

**Location:** `features/tasks/recurring-store.ts`

**Usage:**
- `features/tasks/components/recurring-page.tsx`

**React Query Hooks:** ❌ DOES NOT EXIST

**API Endpoint:** ❌ DOES NOT EXIST

**Verdict:** ❌ **NO API - Cannot migrate**

**Reasons:**
1. Uses `createCrudStore` with LocalStorage key 'task-templates'
2. No database backing
3. No API endpoints in `app/api/tasks/` or `app/api/recurring-tasks/`
4. Complex business logic (recurrence calculation, task generation)

**Action Required:**
1. Create Prisma model for RecurringTask
2. Create API endpoints: `app/api/recurring-tasks/route.ts`
3. Create API layer: `features/tasks/api/recurring-tasks-api.ts`
4. Create React Query hooks: `features/tasks/hooks/use-recurring-tasks.ts`
5. Then migrate `recurring-page.tsx`

---

### 5. useCustomFieldStore (1 file)

**Location:** `features/tasks/custom-fields-store.ts`

**Usage:**
- `features/tasks/components/field-management-page.tsx`

**React Query Hooks:** ❌ DOES NOT EXIST

**API Endpoint:** ❌ DOES NOT EXIST

**Verdict:** ❌ **NO API - Cannot migrate**

**Reasons:**
1. Uses `createCrudStore` with LocalStorage key 'custom-fields'
2. No database backing
3. No API endpoints in `app/api/custom-fields/` or `app/api/tasks-settings/`
4. Field visibility/permission logic tied to user roles

**Action Required:**
1. Create Prisma model for CustomFieldDefinition
2. Create API endpoints: `app/api/tasks-settings/custom-fields/route.ts`
3. Create API layer: `features/tasks/api/custom-fields-api.ts`
4. Create React Query hooks: `features/tasks/hooks/use-custom-fields.ts`
5. Then migrate `field-management-page.tsx`

---

## Immediate Actions Possible

### ✅ Refactor .getState() Calls in print-service.ts

The only actionable item is refactoring the 3 `.getState()` calls in `lib/print-service.ts`:

```typescript
// Line 278
const store = usePrintTemplateStore.getState();

// Line 302  
const store = usePrintTemplateStore.getState();

// Line 356
const store = usePrintTemplateStore.getState();
```

**Options:**
1. **Pass template data as parameters** - Requires calling components to fetch templates
2. **Convert to React hooks** - Only works if called from React components
3. **Keep as-is** - These are utility functions, `.getState()` is appropriate

**Recommendation:** Keep as-is or pass templates as parameters if performance is an issue.

---

## Conclusion

**Migration Status:**
- ✅ **0 stores migrated** (0 out of 5)
- ⚠️ **1 store refactorable** (usePrintTemplateStore - .getState() calls)
- ❌ **3 stores need APIs** (useEmployeeMappingStore, useRecurringTaskStore, useCustomFieldStore)
- ❌ **1 store must stay Zustand** (useImageStore - client-side infrastructure)

**Next Steps:**
1. Decide whether to create APIs for recurring tasks and custom fields
2. If yes, follow the standard API creation pattern
3. If no, keep these as LocalStorage-based Zustand stores
4. Optionally refactor `print-service.ts` to reduce `.getState()` usage

**Errors:** No TypeScript errors in current implementation.
