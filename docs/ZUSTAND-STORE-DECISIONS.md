# Zustand Store Migration Decisions

## Decision Framework

### Migrate to React Query ✅
- **Server state**: Data fetched from API that needs to sync
- **CRUD operations**: Create, Read, Update, Delete business data
- **Cache invalidation**: Data that should refetch when stale
- **Optimistic updates**: Update UI before server confirms
- **Multi-tab sync**: State that should sync across browser tabs

### Keep in Zustand ✅
- **UI state**: Forms, modals, filters, selected items
- **Client-side cache**: Performance optimization for repeated renders
- **Staging workflows**: Temporary state before form submission
- **Derived state**: Computed values from other state
- **Synchronous utilities**: State accessed via getState() in utilities

---

## Store Decisions Summary

| Store | Decision | Type | Reason |
|-------|----------|------|--------|
| useImageStore | **KEEP** | Performance Cache | Client-side cache for product images, staging workflow |
| usePrintTemplateStore | **KEEP** | UI Configuration | Runtime cache for print templates, synchronous access |

---

## Detailed Analysis

### 1. useImageStore - KEEP ✅

**Store Type**: Performance Cache + Staging Workflow

**Data Structure**:
```typescript
{
  stagingImages: Record<string, StagingFile[]>; // Uncommitted uploads
  permanentImages: Record<string, StagingFile[]>; // Cached URLs from server
  permanentMeta: Record<string, { lastFetched: number }>; // Cache metadata
}
```

**Why Keep in Zustand**:

1. **Not Pure Server State**
   - `stagingImages`: Client-only state for uncommitted file uploads
   - `permanentImages`: Cache of URLs from database (source of truth is DB)
   - Cache is session-based, intentionally cleared on refresh

2. **Performance Optimization**
   - Avoids repeated API calls for same product images
   - Similar to React Query cache but with custom staging logic
   - Specialized for file upload workflow

3. **Staging Workflow**
   - Manages temporary uploads before form submission
   - Session tracking for uncommitted changes
   - Not business data until confirmed

4. **Business Data is Elsewhere**
   - Files: `/uploads/` directory
   - Database: `ProductImage` records
   - API: `FileUploadAPI.getProductFiles()`

5. **Low Migration Value**
   - Only 10 usages across 8 files
   - Works well for its specialized purpose
   - Migration would add complexity

**Files Using It**: 8 files, 10+ usages
- [features/shared/product-selection-dialog.tsx](features/shared/product-selection-dialog.tsx)
- [features/products/components/product-image.tsx](features/products/components/product-image.tsx)
- [features/orders/components/line-items-table.tsx](features/orders/components/line-items-table.tsx)
- [features/products/form-page.tsx](features/products/form-page.tsx)
- [features/products/detail-page.tsx](features/products/detail-page.tsx)
- And 3 more...

---

### 2. usePrintTemplateStore - KEEP ✅

**Store Type**: UI Configuration Cache (Hybrid Architecture)

**Data Structure**:
```typescript
{
  templates: Record<TemplateKey, PrintTemplate>; // Runtime cache
  defaultSizes: Record<TemplateType, PaperSize>; // UI preferences
}
```

**Why Keep in Zustand**:

1. **Already Has Hybrid Architecture** ✅
   - Zustand: Runtime cache for instant access
   - React Query: Server state management (already exists!)
   - API Layer: CRUD operations (already exists!)

2. **Synchronous Utility Functions**
   - `print-service.ts` uses `getState()` 3 times
   - Print operations need instant template access
   - Making async would require major refactoring

3. **Complex Client-Side Logic**
   - Branch-specific template resolution with fallbacks
   - Auto-reset for outdated syntax (payroll templates)
   - Default template generation
   - This is UI runtime logic, not database logic

4. **Already Documented Correctly**
   - Store has comment: "✅ KEEP IN ZUSTAND - This is pure UI state"
   - Directs users to React Query hooks for server operations
   - Architecture follows best practices

5. **React Query Already Available**
   - `use-print-templates.ts`: React Query hooks for CRUD
   - `print-templates-api.ts`: API layer
   - Settings page uses React Query
   - Print operations use Zustand cache

**Current Architecture** (Optimal):
```
Settings Page (Admin)
   ↓ (Use React Query)
   ↓ CRUD operations
   ↓
Database (PrintTemplate)
   ↓ (Load templates)
   ↓
Zustand Store (Runtime Cache)
   ↓ (Instant access via getState())
   ↓
Print Service (Utility Functions)
   → generatePrintHtml()
   → printDocument()
   → getPreviewHtml()
```

**Files Using It**: 6 usages
- [lib/use-print.ts](lib/use-print.ts) (1 usage)
- [lib/print-service.ts](lib/print-service.ts) (3 usages via getState())
- [features/settings/printer/print-templates-page.tsx](features/settings/printer/print-templates-page.tsx) (1 usage)

---

## Architectural Patterns

### Pattern 1: Pure UI State
**Examples**: Modal states, form drafts, selected filters
**Solution**: Zustand only
**Reason**: No server interaction needed

### Pattern 2: Pure Server State
**Examples**: Products, orders, customers
**Solution**: React Query only
**Reason**: CRUD operations with cache invalidation

### Pattern 3: Hybrid (Cache + Server)
**Examples**: usePrintTemplateStore
**Solution**: React Query for CRUD + Zustand for runtime cache
**Reason**: Best of both worlds
- React Query: Server state management in admin pages
- Zustand: Fast synchronous access in utility functions

### Pattern 4: Performance Cache
**Examples**: useImageStore
**Solution**: Zustand for client-side cache
**Reason**: Specialized caching logic not suitable for React Query
- Custom staging workflow
- Session-based cache (not persisted)
- Not pure server state

---

## Migration Guidelines

### When to Migrate to React Query
✅ Data comes from database
✅ Needs CRUD operations
✅ Should invalidate when stale
✅ Should sync across tabs
✅ Has optimistic updates

### When to Keep in Zustand
✅ UI-only state (modals, selections)
✅ Client-side cache with custom logic
✅ Staging/temporary workflows
✅ Accessed synchronously via getState()
✅ Complex client-side resolution logic

### When to Use Hybrid
✅ Server data with specialized caching needs
✅ Admin pages need CRUD (React Query)
✅ Runtime operations need instant access (Zustand)
✅ Complex client-side fallback logic

---

## Verification

### Compilation Status
- [x] useImageStore: 0 errors ✅
- [x] usePrintTemplateStore: 0 errors ✅

### Documentation Status
- [x] useImageStore: Enhanced with clear purpose and architecture notes
- [x] usePrintTemplateStore: Already documented correctly, verified

### Architecture Review
- [x] Both stores follow correct patterns
- [x] No unnecessary migrations
- [x] Hybrid architecture (print templates) is optimal
- [x] Performance cache (images) is justified

---

## Conclusion

**Both stores should remain in Zustand**. They serve important purposes:

1. **useImageStore**: Performance cache and staging workflow manager
   - Not suitable for React Query
   - Custom file upload workflow
   - Session-based cache

2. **usePrintTemplateStore**: Runtime configuration cache
   - Already has hybrid architecture with React Query
   - Synchronous utility function access
   - Complex client-side resolution logic

**No migration needed**. Current architecture is optimal.

---

## Next Steps

Batch 3 evaluation complete. Both stores properly classified and documented:
- ✅ useImageStore: Performance cache (KEEP)
- ✅ usePrintTemplateStore: UI configuration (KEEP with hybrid)
- ✅ Documentation enhanced
- ✅ Zero compilation errors
- ✅ Architecture decisions validated

Ready for next batch of stores if needed.
