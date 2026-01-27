# BATCH 3 - IMAGE & PRINT STORES EVALUATION REPORT

## Executive Summary

**Date**: 2026-01-11
**Evaluated Stores**: 2
- useImageStore: **KEEP** (Performance cache)
- usePrintTemplateStore: **KEEP** (UI configuration)

**Decision**: Both stores are **UI state/optimization** and should remain in Zustand.

---

## 1. useImageStore Analysis

### Data Structure
```typescript
{
  stagingImages: Record<string, {
    type: 'thumbnail' | 'gallery';
    sessionId: string;
    files: StagingFile[];
  }>;
  
  permanentImages: Record<string, {
    thumbnail: StagingFile[];
    gallery: StagingFile[];
  }>;
  
  permanentMeta: Record<string, {
    lastFetched: number;
  }>;
}
```

### Storage & Persistence
- **Storage**: In-memory only (Zustand without persist)
- **Scope**: Client-side cache
- **Lifetime**: Session-based (cleared on page refresh)

### API Layer
- **Endpoint**: `/api/upload` (file upload)
- **File Retrieval**: `FileUploadAPI.getProductFiles(productSystemId)`
- **Database**: Files are stored in database with `ProductImage` model
- **CDN/Static**: Files served from `/uploads/` directory

### Usage Patterns (10 locations)

**Files using it**:
1. [features/shared/product-selection-dialog.tsx](features/shared/product-selection-dialog.tsx#L18) (lines 30-32)
2. [features/products/components/product-image.tsx](features/products/components/product-image.tsx#L11) (lines 66-68, 149-151)
3. [features/orders/components/line-items-table.tsx](features/orders/components/line-items-table.tsx) (lines 158-160)
4. [features/products/form-page.tsx](features/products/form-page.tsx) (line 38)
5. [features/products/detail-page.tsx](features/products/detail-page.tsx) (lines 312, 319-320)
6. [features/products/components/combo-product-search.tsx](features/products/components/combo-product-search.tsx) (lines 120-122)
7. [features/orders/components/product-search.tsx](features/orders/components/product-search.tsx) (lines 241-243)
8. [features/products/hooks/use-pkgx-sync.ts](features/products/hooks/use-pkgx-sync.ts#L9) (line 507)

**Access patterns**:
```typescript
// Read from cache
const permanentImages = useImageStore(state => state.permanentImages[productSystemId]);
const lastFetched = useImageStore(state => state.permanentMeta[productSystemId]?.lastFetched);

// Update cache after fetching
const updatePermanentImages = useImageStore(state => state.updatePermanentImages);

// Staging workflow for uploads
updateStagingImage(productSystemId, type, files, sessionId);
clearStagingImages(productSystemId);
```

### Image Loading Flow
```
1. Component renders → Check cache (permanentImages)
2. If not in cache → Fetch from API (FileUploadAPI.getProductFiles)
3. Store in cache with timestamp (lastFetched)
4. Display image from cache
5. On page refresh → Cache cleared, refetch needed
```

### Decision: **KEEP IN ZUSTAND** ✅

**Reasoning**:

1. **Performance Optimization Cache**
   - This is a client-side cache to avoid repeated API calls
   - Stores URLs and metadata, not business data
   - Similar to React Query cache but specialized for image staging workflow

2. **Staging File Workflow**
   - Manages temporary uploads before form submission
   - Session-based tracking for uncommitted changes
   - Not persisted to localStorage (cleared on refresh)

3. **Business Data is in Database**
   - Actual files stored in `/uploads/` directory
   - Database has `ProductImage` records with URLs
   - The store only caches these URLs for UI performance

4. **Not Suitable for React Query**
   - React Query is for server state management
   - This store manages client-side staging workflow
   - Mixing staging state with server state adds complexity

5. **Low Migration Value**
   - Only 10 usages across 8 files
   - Works well for its purpose
   - Migration would not improve architecture

### Action Taken: Documentation Enhancement

Added clear comments explaining:
- This is a **UI performance cache**, not business data
- Actual images stored in database and served from `/uploads/`
- Cache is session-based and not persisted
- Used for both staging (uncommitted) and permanent (display) images

---

## 2. usePrintTemplateStore Analysis

### Data Structure
```typescript
{
  templates: Record<TemplateKey, PrintTemplate>;
  defaultSizes: Record<TemplateType, PaperSize>;
  
  // TemplateKey format: "type-size-branchId" or "type-size"
  // e.g., "order-A4-branch1" or "order-A4" (all branches)
}
```

### Storage & Persistence
- **Storage**: In-memory only (Zustand without persist)
- **Scope**: Client-side UI configuration
- **Lifetime**: Session-based
- **Note**: Already has comment: "UI configuration only - template configs, paper sizes"

### API Layer
- **API Exists**: `/api/settings/print-templates` ✅
- **React Query Hooks Exist**: `@/features/settings/printer/hooks/use-print-templates` ✅
- **Database**: `PrintTemplate` model (assumed, based on API)

### Usage Patterns (6 locations)

**Direct usage**:
1. [lib/use-print.ts](lib/use-print.ts#L12) (line 185) - Hook for printing
2. [features/settings/printer/print-templates-page.tsx](features/settings/printer/print-templates-page.tsx) (line 136) - Settings UI

**getState() calls** (non-reactive):
3. [lib/print-service.ts](lib/print-service.ts#L1) (line 278) - `generatePrintHtml()`
4. [lib/print-service.ts](lib/print-service.ts#L1) (line 302) - `printDocument()`
5. [lib/print-service.ts](lib/print-service.ts#L1) (line 356) - `getPreviewHtml()`

### Current State: HYBRID Architecture ⚠️

The codebase **already has both**:
- **Zustand Store** (`usePrintTemplateStore`) - UI runtime cache
- **React Query Hooks** (`use-print-templates.ts`) - Server state management
- **API Layer** (`print-templates-api.ts`) - CRUD operations

**Hybrid Pattern**:
```typescript
// Option 1: Load from server (React Query)
const { data: templates } = usePrintTemplates('order');

// Option 2: Get from runtime cache (Zustand)
const template = usePrintTemplateStore(state => 
  state.getTemplate('order', 'A4', branchId)
);
```

### Decision: **KEEP IN ZUSTAND** ✅

**Reasoning**:

1. **Already Documented as UI State**
   - Store file has clear comment: "✅ KEEP IN ZUSTAND - This is pure UI state"
   - Recommends: "For server-side templates, use React Query hooks"

2. **Runtime Template Cache**
   - Templates loaded from server are cached for printing operations
   - Avoids async operations during print dialog
   - Provides instant access via `getState()` in print-service

3. **Utility Functions Use It**
   - `print-service.ts` has 3 utility functions using `getState()`
   - These are called from multiple places synchronously
   - Migrating to React Query would require async refactoring

4. **Branch-Specific Template Resolution**
   - Complex fallback logic: branch-specific → general → default
   - Auto-reset for outdated syntax (payroll templates)
   - This is UI runtime logic, not database logic

5. **React Query Hooks Already Exist**
   - Server state management is already handled
   - Settings page can use React Query for CRUD
   - Print operations use Zustand cache

6. **Low Migration Value**
   - Only 6 usages
   - Already follows best practice (separate concerns)
   - Migration would complicate synchronous print operations

### Current Architecture is Correct ✅

```
┌─────────────────────────────────────────┐
│ SETTINGS PAGE (Admin UI)               │
│ - Use React Query hooks                │
│ - CRUD operations via API               │
│ - Server state management               │
└─────────────────────────────────────────┘
                  │
                  ↓ (Load templates)
┌─────────────────────────────────────────┐
│ ZUSTAND STORE (Runtime Cache)           │
│ - Store loaded templates                │
│ - Branch-specific resolution            │
│ - Instant synchronous access            │
└─────────────────────────────────────────┘
                  │
                  ↓ (Get template)
┌─────────────────────────────────────────┐
│ PRINT SERVICE (Utility Functions)       │
│ - generatePrintHtml()                   │
│ - printDocument()                       │
│ - getPreviewHtml()                      │
└─────────────────────────────────────────┘
```

### Action Taken: Documentation Verification

Verified existing documentation is correct:
- Store already marked as "UI configuration only"
- Comment directs users to React Query hooks for server operations
- No changes needed - architecture is already optimal

---

## Summary of Actions

### useImageStore ✅
- **Status**: KEPT in Zustand
- **Changes**: Enhanced documentation comments
- **Files modified**: [features/products/image-store.ts](features/products/image-store.ts)
- **Architecture**: Performance cache for product images

### usePrintTemplateStore ✅
- **Status**: KEPT in Zustand (HYBRID architecture)
- **Changes**: None needed (already documented correctly)
- **Files modified**: None
- **Architecture**: Runtime cache + React Query for server state

---

## Architecture Patterns Confirmed

### ✅ When to Keep in Zustand
1. **UI Performance Cache** (useImageStore)
   - Caching server data for UI performance
   - Staging workflow for uncommitted changes
   - Session-based, not persisted

2. **UI Configuration** (usePrintTemplateStore)
   - Runtime cache for instant access
   - Complex client-side logic (resolution, fallbacks)
   - Used by synchronous utility functions

### ✅ When to Use React Query
- Server state (CRUD operations)
- Data that needs to sync across tabs
- Data that should invalidate and refetch
- Admin/settings pages

### ✅ Hybrid Pattern (Best of Both Worlds)
```typescript
// Settings page: Use React Query
const { data, update } = usePrintTemplates();

// Runtime operations: Use Zustand cache
const template = usePrintTemplateStore.getState()
  .getTemplate(type, size, branchId);
```

---

## Verification Checklist

- [x] Read both store definitions
- [x] Identified all usage locations
- [x] Checked for API endpoints
- [x] Analyzed data flow and patterns
- [x] Determined if business data or UI state
- [x] Verified existing documentation
- [x] Made architecture decisions
- [x] Enhanced documentation where needed
- [x] No compilation errors
- [x] No breaking changes

---

## Errors & Warnings

**Compilation Errors**: 0 ✅
**Runtime Errors**: 0 ✅
**Breaking Changes**: 0 ✅

---

## Next Steps

Batch 3 is complete. Both stores evaluated and properly classified:

1. **useImageStore**: Performance cache (KEEP)
2. **usePrintTemplateStore**: UI configuration cache (KEEP)

Both stores serve important purposes and should remain in Zustand. They follow the correct architectural patterns for:
- Client-side optimization
- Staging workflows
- Runtime caching
- Synchronous utility functions

No migration needed. Architecture is optimal as-is.
