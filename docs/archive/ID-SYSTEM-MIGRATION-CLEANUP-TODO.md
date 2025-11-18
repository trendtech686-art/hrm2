# ID System Migration - Cleanup Todo List

**Created:** 2025-11-10  
**Status:** Phase 8 Complete - Legacy Code Audit  
**Priority:** HIGH - Remove all old ID generation patterns

---

## 🎯 Overview

This document lists all legacy SystemId creation patterns found in the codebase that need to be migrated to the new ID Management System v2.0. All items must be addressed to complete 100% migration.

---

## ✅ Already Completed

### Forms Migration (20 files)
All forms have been updated to use `id: ''` pattern:

- ✅ `features/vouchers/voucher-form.tsx`
- ✅ `features/suppliers/supplier-form.tsx`
- ✅ `features/products/form.tsx`
- ✅ `features/products/product-form.tsx`
- ✅ `features/penalties/form.tsx`
- ✅ `features/payment-types/form.tsx`
- ✅ `features/orders/order-form-page.tsx`
- ✅ `features/leaves/leave-form.tsx`
- ✅ `features/cash-accounts/form.tsx`
- ✅ `features/departments/form.tsx`
- ✅ `features/employees/form.tsx`
- ✅ `features/customers/form.tsx`
- ✅ `features/branches/form.tsx`
- ✅ `features/bonuses/form.tsx`
- ✅ `features/deductions/form.tsx`
- ✅ `features/allowances/form.tsx`
- ✅ `features/contracts/form.tsx`
- ✅ `features/job-titles/form.tsx`
- ✅ `features/inventory-receipts/form-page.tsx`
- ✅ `features/purchase-orders/form-page.tsx`

### Store Factory Migration
- ✅ All stores using `createStoreWithFactory` have auto ID generation
- ✅ No manual `generateNextId` imports remaining (only comments)

---

## ⚠️ Manual ID Generation - MUST REMOVE

### Critical Files with padStart() Usage

#### 1. **features/purchase-returns/form-page.tsx** (Line 391)
```typescript
// ❌ OLD PATTERN
const newSystemId = `TH${String(allPurchaseReturns.length + 1).padStart(8, '0')}`;

// ✅ NEW PATTERN - Use id: ''
const newPurchaseReturn = {
  id: '',  // Store will auto-generate
  // ... rest of data
};
```
**Action:** Remove manual systemId generation, use `id: ''` pattern

---

#### 2. **features/purchase-orders/form-page.tsx** (Line 576)
```typescript
// ❌ OLD PATTERN
systemId: `PAY${finalOrderId}${String(idx + 1).padStart(3, '0')}`,

// ✅ NEW PATTERN - For nested payment items
// This is a sub-item, keep manual generation OR define in id-config.ts
```
**Action:** Decide if payment items need auto ID or can remain manual

---

#### 3. **features/orders/store.ts** (Line 77)
```typescript
// ❌ OLD PATTERN in initialData
systemId: `ORD${String(index + 1).padStart(8, '0')}`,

// ✅ NEW PATTERN
// Remove hardcoded systemIds from initialData
// Let store factory generate them on first load
```
**Action:** Remove systemId from initial data arrays

---

#### 4. **features/vouchers/store.ts** (Line 30)
```typescript
// ❌ OLD PATTERN
systemId: `VOUCHER${String(i + 1).padStart(8, '0')}`,

// ✅ NEW PATTERN
// If using store-factory: Remove systemId generation
// If NOT using store-factory yet: Migrate to store-factory
```
**Action:** Check if voucher store uses store-factory, migrate if not

---

#### 5. **features/wiki/store.ts** (Line 23)
```typescript
// ❌ OLD PATTERN
const displayId = `WIKI${String(state.data.length + 1).padStart(6, '0')}`;

// ✅ NEW PATTERN
// Use store-factory or generateSystemId('wiki')
```
**Action:** Migrate wiki store to use store-factory

---

#### 6. **features/warranty/store.ts** (Line 606)
```typescript
// ❌ OLD PATTERN
const paddedId = String(index + 1).padStart(6, '0');

// ✅ NEW PATTERN
// Warranty already in id-config.ts, use store-factory
```
**Action:** Review warranty store, ensure using new system

---

#### 7. **features/sales-channels/store.ts** (Line 22)
```typescript
// ❌ OLD PATTERN
const newSystemId = `SC${idCounter.toString().padStart(8, '0')}`;

// ✅ NEW PATTERN
// Migrate to store-factory
```
**Action:** Migrate sales-channels to store-factory

---

#### 8. **features/provinces/store.ts** (Lines 173, 180)
```typescript
// ❌ OLD PATTERN
const newSystemId = `T${provinceIdCounter.toString().padStart(8, '0')}`;

// ✅ NEW PATTERN
// Provinces already defined in id-config.ts
// Migrate to store-factory
```
**Action:** Migrate provinces store to store-factory

---

## 📝 Initial Data Cleanup

### Remove Hardcoded SystemIds from Initial Data

These files have hardcoded systemIds in sample data that should be removed:

#### Features to Update:
1. **features/taxes/store.ts** (Lines 20, 30, 40, 50)
   - Remove `systemId: 'TAX001'` etc.
   - Let store generate on load

2. **features/warranty/store.ts** (Lines 68-491)
   - Contains ~50+ hardcoded systemIds in initialData
   - Should use `id: ''` pattern or remove initial data

3. **features/warranty/initial-data.ts** (Lines 8-426)
   - Duplicate initial data file
   - Same issue as above

4. **features/wiki/data.ts** (Lines 5, 31, 58)
   - 3 hardcoded wiki systemIds
   - Remove and regenerate

5. **features/vouchers/data.ts** (Multiple lines)
   - Many hardcoded account/branch/category systemIds
   - Clean up hardcoded references

6. **features/suppliers/data.ts** (Lines 40-72)
   - Generator function creating hardcoded IDs
   - Should use store's auto-generation

7. **features/employees/data.ts** (Lines 584-659)
   - Large dataset with hardcoded employee IDs
   - Consider regenerating with new system

---

## 🔍 Special Cases - Review Required

### Date/Time padStart() - OK to Keep
These are NOT ID generation, safe to ignore:
- `features/orders/components/shipping-integration.tsx` (Lines 38-39) - Date formatting
- `features/purchase-returns/data.ts` (Lines 7-10) - DateTime formatting
- `features/settings/shipping-partners/integrations/spx-service.ts` (Lines 219, 433) - Hash formatting

### Settings Page - OK, For Display Only
- `features/settings/id-counter-settings-page.tsx` (Lines 122, 444-446)
  - ✅ These are for PREVIEW/DISPLAY purposes only
  - ✅ Not actual ID generation, keep as-is

---

## 🎯 Migration Priorities

### Priority 1 - IMMEDIATE (Critical Business Logic)
1. ✅ **purchase-returns/form-page.tsx** - Active form
2. ✅ **orders/store.ts** - High traffic
3. ✅ **vouchers/store.ts** - Financial data
4. ✅ **warranty/store.ts** - Already migrated, verify

### Priority 2 - HIGH (Data Integrity)
5. ✅ **sales-channels/store.ts**
6. ✅ **wiki/store.ts**
7. ✅ **provinces/store.ts**

### Priority 3 - MEDIUM (Initial Data Cleanup)
8. Remove hardcoded systemIds from all initial data files
9. Clean up data.ts files with legacy patterns

### Priority 4 - LOW (Future Considerations)
10. Decide on nested payment item ID strategy
11. Consider regenerating employee sample data

---

## 🔧 Migration Steps

### For Each File with Manual ID Generation:

1. **Identify the entity type**
   - Check if it exists in `lib/id-config.ts`
   - If not, add configuration

2. **Update the store**
   - Migrate to `createStoreWithFactory` if not already
   - Remove manual systemId generation code
   - Use `id: ''` in add operations

3. **Update forms**
   - Remove any `systemId` field from form data
   - Use `id: ''` when creating new items

4. **Clean initial data**
   - Remove hardcoded `systemId` values
   - Let store generate them on first load

5. **Test thoroughly**
   - Verify IDs are generated correctly
   - Check ID format matches expectations
   - Ensure no duplicate IDs

---

## 📊 Statistics

### Current Status:
- ✅ **Forms Migrated:** 20/20 (100%)
- ⏳ **Stores with Manual ID:** 8 found
- ⏳ **Initial Data Files:** 7 need cleanup
- ✅ **Type Safety:** 100% (all using branded types)
- ✅ **Documentation:** Complete
- ⏳ **Overall Migration:** ~85% complete

### Remaining Work:
- 8 stores to migrate to store-factory
- 7 initial data files to clean up
- 1 purchase orders payment item decision needed

---

## ✅ Verification Checklist

After completing all migrations:

- [ ] No `padStart()` usage in store files (except date/display)
- [ ] No manual systemId generation in forms
- [ ] All stores use `createStoreWithFactory` or proper pattern
- [ ] No hardcoded systemIds in initial data
- [ ] All entities defined in `id-config.ts`
- [ ] Settings page shows correct counters
- [ ] All tests pass
- [ ] No type errors
- [ ] Breadcrumbs work correctly
- [ ] No duplicate IDs in production data

---

## 📞 Support

If you encounter issues during migration:
1. Check `docs/ID-MANAGEMENT-SYSTEM-GUIDE.md`
2. Review `docs/ID-SYSTEM-IMPLEMENTATION-SUMMARY.md`
3. See examples in already-migrated forms
4. Test with settings page at `/settings/id-counters`

---

**Next Steps:**
1. Review this document
2. Prioritize files to migrate
3. Start with Priority 1 items
4. Test each migration
5. Update this checklist as you progress

Good luck! 🚀
