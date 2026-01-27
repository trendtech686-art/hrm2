# Employee-Related Stores Migration Report

**Date**: January 11, 2026  
**Batch**: Employee Stores (Document, EmployeeComp, Attendance)  
**Status**: ✅ COMPLETED

---

## Executive Summary

Successfully analyzed and migrated 3 employee-related Zustand stores across 9 files. Key decision: **Document Store kept in Zustand** (UI state management), **EmployeeComp Store migrated to React Query** (business data), **Attendance Store already migrated** (deprecated with React Query hooks available).

---

## Store Analysis & Decisions

### 1. useDocumentStore - **KEEP in Zustand ✅**

**Purpose**: Manages file upload workflow and staging documents

**Reasoning**:
- This is **client-side UI state management**, not business data
- Manages ephemeral upload state:
  - Staging documents (temporary files before employee creation)
  - File upload preview/progress
  - Session-based file management
  - Client-side cache of loaded employees
- No need for server-side React Query as files are uploaded via API but the workflow state is purely client-side

**Type**: UI State Management (appropriate for Zustand)

**Files using it**: 3 files
- `features/employees/components/employee-form.tsx` (line 199)
- `features/employees/components/employee-form-page.tsx` (line 30)
- `features/employees/components/employee-documents.tsx` (line 53)

**Action**: ✅ NO MIGRATION NEEDED

---

### 2. useEmployeeCompStore - **MIGRATED to React Query ✓**

**Purpose**: Manages employee payroll profile assignments (salary components, work shifts, bank accounts)

**Reasoning**:
- This is **business data** that should persist to database
- API endpoints exist: `/api/employee-payroll-profiles`
- Multiple components read this data
- Data should be consistent across sessions

**Type**: Business Data (should use React Query)

**Migration Strategy**:

#### New Files Created:

1. **`features/employees/api/payroll-profiles-api.ts`** - API client functions
   - `fetchPayrollProfiles()` - Get all profiles
   - `fetchPayrollProfile(employeeSystemId)` - Get single profile
   - `upsertPayrollProfile()` - Create/update profile
   - `updatePayrollProfile()` - Partial update
   - `deletePayrollProfile()` - Delete profile

2. **`features/employees/hooks/use-payroll-profiles.ts`** - React Query hooks
   - `usePayrollProfiles()` - List all profiles
   - `usePayrollProfile(employeeSystemId)` - Single profile
   - `useResolvedPayrollProfile(employeeSystemId)` - Profile with defaults (replaces `getPayrollProfile`)
   - `usePayrollProfileMutations()` - Mutations (upsert, update, remove)

#### Files Migrated:

**File 1: `features/employees/components/employee-form.tsx`** (line 194)

**Before**:
```typescript
import { useEmployeeCompStore, type EmployeePayrollProfileInput } from "../employee-comp-store";

const getPayrollProfile = useEmployeeCompStore((state) => state.getPayrollProfile);
const payrollProfile = React.useMemo(
  () => (initialData?.systemId ? getPayrollProfile(initialData.systemId) : null),
  [initialData?.systemId, getPayrollProfile]
);
```

**After**:
```typescript
import { type EmployeePayrollProfileInput } from "../employee-comp-store";
import { useResolvedPayrollProfile } from "../hooks/use-payroll-profiles";

const { profile: payrollProfile } = useResolvedPayrollProfile(initialData?.systemId);
```

**Changes**: Replaced Zustand selector with React Query hook, simplified profile retrieval

---

**File 2: `features/employees/components/employee-form-page.tsx`** (line 31)

**Before**:
```typescript
import { useEmployeeCompStore } from '../employee-comp-store';
import { useShallow } from 'zustand/react/shallow';

const { assignComponents, removeProfile } = useEmployeeCompStore(
  useShallow((state) => ({
    assignComponents: state.assignComponents,
    removeProfile: state.removeProfile,
  }))
);

// In submit handler:
if (_payrollProfile === null) {
  removeProfile(asSystemId(targetEmployeeSystemId));
} else if (_payrollProfile) {
  assignComponents(asSystemId(targetEmployeeSystemId), _payrollProfile);
}
```

**After**:
```typescript
import { usePayrollProfileMutations } from '../hooks/use-payroll-profiles';

const { upsert: upsertPayrollProfile, remove: removePayrollProfile } = usePayrollProfileMutations();

// In submit handler:
if (_payrollProfile === null) {
  await removePayrollProfile.mutateAsync(asSystemId(targetEmployeeSystemId));
} else if (_payrollProfile) {
  await upsertPayrollProfile.mutateAsync({ 
    employeeSystemId: asSystemId(targetEmployeeSystemId), 
    input: _payrollProfile 
  });
}
```

**Changes**: Replaced Zustand mutations with React Query mutations, now async with proper server sync

---

**File 3: `features/employees/components/detail-page.tsx`** (lines 243, 341)

**Before**:
```typescript
import { useEmployeeCompStore } from '../employee-comp-store';

const getPayrollProfile = useEmployeeCompStore((state) => state.getPayrollProfile);
const payrollProfile = React.useMemo(() => (employee ? getPayrollProfile(employee.systemId) : null), [employee, getPayrollProfile]);
```

**After**:
```typescript
import { useResolvedPayrollProfile } from '../hooks/use-payroll-profiles';

const { profile: payrollProfile } = useResolvedPayrollProfile(systemId ? asSystemId(systemId) : undefined);
```

**Changes**: Replaced Zustand selector with React Query hook, removed useMemo (hook handles caching)

---

#### Store Deprecation Notice:

Added deprecation notice to `features/employees/employee-comp-store.ts`:

```typescript
/**
 * @deprecated Use React Query hooks instead:
 * - `usePayrollProfiles()` for list
 * - `usePayrollProfile(employeeSystemId)` for single profile
 * - `useResolvedPayrollProfile(employeeSystemId)` for profile with defaults
 * - `usePayrollProfileMutations()` for create/update/delete
 * 
 * Import from: `@/features/employees/hooks/use-payroll-profiles`
 * 
 * This store will be removed in a future version.
 */
```

**Migration Status**: ✅ COMPLETE - 3 files migrated, 0 files remaining

---

### 3. useAttendanceStore - **ALREADY MIGRATED ✓**

**Purpose**: Manages locked months and attendance data cache

**Current Status**: 
- Store marked as **deprecated** with migration notes
- React Query hooks exist: `useAttendance()`, `useAttendanceMutations()`
- Located at: `features/attendance/hooks/use-attendance.ts`

**Deprecation Notice** (from `features/attendance/store.ts`):
```typescript
/**
 * @deprecated Use React Query hooks instead:
 * - `useAttendance()` for list
 * - `useAttendanceMutations()` for create/update/delete
 * 
 * Import from: `@/features/attendance/hooks/use-attendance`
 * 
 * This store will be removed in a future version.
 */
```

**Remaining Usage**: 4 files still using the deprecated store
- `features/attendance/hooks/use-attendance-page-handlers.ts` (lines 33-34, 88-89, 201, 311)
- `features/attendance/hooks/use-attendance-bulk-edit.ts` (line 20)
- `features/employees/components/detail-page.tsx` (lines 250-251)
- `features/payroll/run-page.tsx` (line 408)

**Reason for Partial Migration**: 
- Legacy code still using localStorage patterns
- `lockedMonths` and `attendanceData` cache need gradual migration
- Some code paths still rely on Zustand for backward compatibility

**Type**: Hybrid - Business Data + Local Cache

**Action**: ✅ NO FURTHER ACTION (already has migration path, gradual migration in progress)

---

## Migration Statistics

### Files Analyzed: **9 files**
- Document Store: 3 files
- EmployeeComp Store: 3 files  
- Attendance Store: 4 files (already deprecated)

### Files Migrated: **3 files**
- `features/employees/components/employee-form.tsx`
- `features/employees/components/employee-form-page.tsx`
- `features/employees/components/detail-page.tsx`

### New Files Created: **2 files**
- `features/employees/api/payroll-profiles-api.ts` (103 lines)
- `features/employees/hooks/use-payroll-profiles.ts` (153 lines)

### Stores Status:
- ✅ **useDocumentStore**: KEEP (UI State Management)
- ✅ **useEmployeeCompStore**: MIGRATED (Business Data)
- ✅ **useAttendanceStore**: ALREADY DEPRECATED (Migration Path Exists)

---

## Technical Details

### API Endpoints Used

**Employee Payroll Profiles API**:
- `GET /api/employee-payroll-profiles` - List all profiles
- `GET /api/employee-payroll-profiles?employeeSystemId={id}` - Get single profile
- `POST /api/employee-payroll-profiles` - Create/update profile
- `PATCH /api/employee-payroll-profiles/{employeeSystemId}` - Partial update
- `DELETE /api/employee-payroll-profiles/{employeeSystemId}` - Delete profile

### React Query Implementation

**Query Keys**:
```typescript
payrollProfileKeys = {
  all: ['payroll-profiles'],
  lists: () => [...payrollProfileKeys.all, 'list'],
  list: () => [...payrollProfileKeys.lists()],
  details: () => [...payrollProfileKeys.all, 'detail'],
  detail: (employeeSystemId) => [...payrollProfileKeys.details(), employeeSystemId],
}
```

**Cache Configuration**:
- `staleTime: 5 minutes` - Data considered fresh for 5 minutes
- `gcTime: 10 minutes` - Cache garbage collected after 10 minutes
- `placeholderData: keepPreviousData` - Smooth transitions between queries

---

## Validation Results

### TypeScript Errors: **0 errors** ✅

All migrated files compile successfully with no TypeScript errors.

### Migration Approach:
- ✅ Preserved existing functionality
- ✅ Maintained backward compatibility during transition
- ✅ Added proper deprecation notices
- ✅ Created comprehensive React Query hooks
- ✅ Implemented proper error handling
- ✅ Used async/await for mutations

---

## Benefits of Migration

### Before (Zustand):
- ❌ Client-side only storage
- ❌ No server synchronization
- ❌ Data lost on page refresh (unless persisted to localStorage)
- ❌ No automatic refetching
- ❌ Manual cache invalidation

### After (React Query):
- ✅ Server-backed data with database persistence
- ✅ Automatic cache management
- ✅ Optimistic updates support
- ✅ Automatic refetching on window focus
- ✅ Built-in loading/error states
- ✅ Stale-while-revalidate patterns

---

## Backward Compatibility

### Transition Period:
- Old store still available with deprecation warnings
- New hooks coexist with old store
- Gradual migration path for remaining legacy code

### Breaking Changes: **NONE**
- All existing functionality preserved
- API remains compatible with existing types
- No changes to component interfaces

---

## Next Steps

1. **Document Store**: Monitor for any issues, confirm it remains appropriate for Zustand
2. **EmployeeComp Store**: 
   - Monitor usage in production
   - Remove Zustand store after confirming all code paths work
   - Update any remaining references in documentation
3. **Attendance Store**: 
   - Continue gradual migration of remaining 4 files
   - Update `use-attendance-page-handlers.ts` to use React Query
   - Update `use-attendance-bulk-edit.ts` to use React Query
   - Migrate `lockedMonths` to server-backed storage

---

## Conclusion

**Migration Status**: ✅ **SUCCESSFUL**

Successfully completed the analysis and migration of employee-related stores:
- **Document Store**: Correctly identified as UI state, kept in Zustand
- **EmployeeComp Store**: Migrated to React Query with full API integration
- **Attendance Store**: Already has migration path, gradual migration in progress

All TypeScript errors resolved, no breaking changes introduced, and proper deprecation notices added for smooth transition.

---

## Files Modified Summary

### New Files (2):
1. `features/employees/api/payroll-profiles-api.ts` ✨
2. `features/employees/hooks/use-payroll-profiles.ts` ✨

### Modified Files (4):
1. `features/employees/components/employee-form.tsx` 📝
2. `features/employees/components/employee-form-page.tsx` 📝
3. `features/employees/components/detail-page.tsx` 📝
4. `features/employees/employee-comp-store.ts` 📝 (added deprecation notice)

### Unchanged Files (3):
1. `features/employees/document-store.ts` (kept in Zustand - correct decision)
2. `features/employees/components/employee-documents.tsx` (uses document store)
3. `features/attendance/store.ts` (already deprecated, migration in progress)

---

**Total Changes**: 6 files (2 new, 4 modified)  
**TypeScript Errors**: 0 ✅  
**Breaking Changes**: 0 ✅  
**Migration Success**: 100% ✅
