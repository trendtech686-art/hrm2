# Complaint Detail Page Refactoring Plan

## 📊 Current State Analysis
- **Total Lines:** 2,518 lines
- **Main Issues:**
  - Too many handlers in one file (20+ useCallback functions)
  - Mixed concerns (UI, business logic, state management)
  - Hard to maintain and debug
  - Every edit creates new function instances

## 🎯 Refactoring Strategy

### Phase 1: Extract Handlers (Priority: HIGH)
Move all business logic handlers to separate hook files:

#### File: `features/complaints/hooks/use-complaint-handlers.ts`
```typescript
export function useComplaintHandlers(complaint, currentUser, permissions) {
  const handleAssign = useCallback(...)
  const handleStatusChange = useCallback(...)
  const handleVerifyCorrect = useCallback(...)
  // ... all other handlers
  
  return {
    handleAssign,
    handleStatusChange,
    handleVerifyCorrect,
    // ...
  }
}
```

#### File: `features/complaints/hooks/use-compensation-handlers.ts`
```typescript
export function useCompensationHandlers(complaint) {
  const handleProcessCompensation = useCallback(...)
  const handleSubmitCorrectResolution = useCallback(...)
  
  return {
    handleProcessCompensation,
    handleSubmitCorrectResolution,
  }
}
```

#### File: `features/complaints/hooks/use-inventory-handlers.ts`
```typescript
export function useInventoryHandlers(complaint) {
  const handleProcessInventory = useCallback(...)
  const handleInventoryAdjustment = useCallback(...)
  
  return {
    handleProcessInventory,
    handleInventoryAdjustment,
  }
}
```

### Phase 2: Extract UI Components (Priority: MEDIUM)
Split large render sections into components:

#### File: `features/complaints/components/complaint-verification-section.tsx`
- Verification buttons
- Verification status display
- Verification forms

#### File: `features/complaints/components/complaint-compensation-section.tsx`
- Compensation accordion
- Voucher links
- Inventory adjustment display

#### File: `features/complaints/components/complaint-timeline.tsx`
- Timeline display
- Action history

#### File: `features/complaints/components/complaint-info-cards.tsx`
- Customer info
- Order info
- Product info

### Phase 3: Extract Dialog Components (Priority: MEDIUM)
Move dialog logic to separate files:

#### File: `features/complaints/dialogs/index.ts`
```typescript
export { ConfirmCorrectDialog } from './confirm-correct-dialog'
export { CompensationVoucherWizard } from './compensation-voucher-wizard'
export { InventoryAdjustmentDialog } from './inventory-adjustment-dialog'
export { VerificationEvidenceDialog } from './verification-evidence-dialog'
```

### Phase 4: Extract State Management (Priority: LOW)
Create custom hooks for complex state:

#### File: `features/complaints/hooks/use-complaint-dialogs.ts`
```typescript
export function useComplaintDialogs() {
  const [confirmCorrectOpen, setConfirmCorrectOpen] = useState(false)
  const [compensationOpen, setCompensationOpen] = useState(false)
  // ... all dialog states
  
  return {
    confirmCorrect: { open: confirmCorrectOpen, setOpen: setConfirmCorrectOpen },
    compensation: { open: compensationOpen, setOpen: setCompensationOpen },
    // ...
  }
}
```

## 📁 Final Structure
```
features/complaints/
├── detail-page.tsx (200-300 lines - orchestration only)
├── components/
│   ├── complaint-verification-section.tsx
│   ├── complaint-compensation-section.tsx
│   ├── complaint-timeline.tsx
│   ├── complaint-info-cards.tsx
│   └── complaint-header-actions.tsx
├── hooks/
│   ├── use-complaint-handlers.ts
│   ├── use-compensation-handlers.ts
│   ├── use-inventory-handlers.ts
│   ├── use-complaint-dialogs.ts
│   └── use-complaint-permissions.ts (existing)
└── dialogs/
    ├── confirm-correct-dialog.tsx (existing)
    ├── compensation-voucher-wizard.tsx (existing)
    ├── inventory-adjustment-dialog.tsx (to create)
    └── verification-evidence-dialog.tsx (to create)
```

## 🚀 Implementation Steps

### Step 1: Create Hook Files (1-2 hours)
1. Create `use-complaint-handlers.ts`
2. Move all `handleXxx` functions
3. Test imports work

### Step 2: Extract Verification Handlers (30 min)
1. Move `handleVerifyCorrect`, `handleVerifyIncorrect`, `handleConfirmCorrect`
2. Create `use-verification-handlers.ts`

### Step 3: Extract Compensation Logic (30 min)
1. Move compensation-related handlers
2. Create `use-compensation-handlers.ts`

### Step 4: Extract Inventory Logic (30 min)
1. Move inventory-related handlers
2. Create `use-inventory-handlers.ts`

### Step 5: Extract UI Sections (2-3 hours)
1. Create component files
2. Move JSX blocks
3. Pass necessary props

### Step 6: Clean Up Main File (30 min)
1. Remove old code
2. Import new hooks/components
3. Simplify render logic

## ✅ Benefits After Refactoring
- **Readability:** Each file has single responsibility
- **Maintainability:** Easy to find and fix bugs
- **Performance:** Better memoization, less re-renders
- **Testability:** Can test handlers independently
- **Reusability:** Components can be reused
- **Type Safety:** Better TypeScript inference

## ⚠️ Notes
- Keep backward compatibility during refactor
- Test after each step
- Use TypeScript strict mode
- Add JSDoc comments for complex functions
- Consider creating unit tests for handlers
