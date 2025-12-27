/**
 * Phase 7: So sánh types.ts với Prisma Schema
 * 
 * File này document kết quả so sánh để quyết định xóa types.ts hay cập nhật schema
 * 
 * Cập nhật: 24/12/2024
 */

// ============================================================================
// 1. EMPLOYEES - features/employees/types.ts vs prisma/schema/hrm/employee.prisma
// ============================================================================

/*
┌────────────────────────────────────────────────────────────────────────────────┐
│ FIELD COMPARISON: Employee                                                      │
├─────────────────────────┬──────────────────────┬────────────────────┬──────────┤
│ Field (types.ts)        │ Type (types.ts)      │ Prisma Schema      │ Status   │
├─────────────────────────┼──────────────────────┼────────────────────┼──────────┤
│ systemId                │ SystemId (string)    │ String @id         │ ✅ Match │
│ id                      │ BusinessId (string)  │ String @unique     │ ✅ Match │
│ fullName                │ string               │ String             │ ✅ Match │
│ dob                     │ string               │ DateTime?          │ ⚠️ Type  │
│ placeOfBirth            │ string?              │ String?            │ ✅ Match │
│ gender                  │ "Nam"|"Nữ"|"Khác"    │ Gender enum        │ ⚠️ Enum  │
│ nationalId              │ string?              │ String?            │ ✅ Match │
│ nationalIdIssueDate     │ string?              │ DateTime?          │ ⚠️ Type  │
│ nationalIdIssuePlace    │ string?              │ String?            │ ✅ Match │
│ permanentAddress        │ EmployeeAddress      │ Json?              │ ✅ Match │
│ temporaryAddress        │ EmployeeAddress      │ Json?              │ ✅ Match │
│ phone                   │ string               │ String?            │ ✅ Match │
│ personalEmail           │ string               │ String?            │ ✅ Match │
│ workEmail               │ string               │ String? @unique    │ ✅ Match │
│ maritalStatus           │ string?              │ ❌ MISSING         │ 🔴 Add   │
│ emergencyContactName    │ string?              │ ❌ MISSING         │ 🔴 Add   │
│ emergencyContactPhone   │ string?              │ ❌ MISSING         │ 🔴 Add   │
│ personalTaxId           │ string?              │ String?            │ ✅ Match │
│ socialInsuranceNumber   │ string?              │ String?            │ ✅ Match │
│ bankAccountNumber       │ string?              │ String?            │ ✅ Match │
│ bankName                │ string?              │ String?            │ ✅ Match │
│ bankBranch              │ string?              │ String?            │ ✅ Match │
│ avatarUrl               │ string?              │ String?            │ ✅ Match │
│ avatar                  │ string?              │ String?            │ ✅ Match │
│ password                │ string?              │ ❌ (in User model) │ ✅ OK    │
│ jobTitle                │ string               │ ❌ (relation)      │ ⚠️ Diff  │
│ jobTitleId              │ ❌ MISSING           │ String?            │ ✅ Schema│
│ department              │ string?              │ ❌ (relation)      │ ⚠️ Diff  │
│ departmentId            │ SystemId?            │ String?            │ ✅ Match │
│ departmentName          │ string?              │ ❌ (computed)      │ ✅ OK    │
│ branchSystemId          │ SystemId?            │ ❌ MISSING         │ ⚠️ Name  │
│ branchId                │ ❌ MISSING           │ String?            │ ✅ Schema│
│ hireDate                │ string               │ DateTime?          │ ⚠️ Type  │
│ startDate               │ string?              │ DateTime?          │ ⚠️ Type  │
│ endDate                 │ string?              │ DateTime?          │ ⚠️ Type  │
│ employeeType            │ string literal       │ EmployeeType enum  │ ⚠️ Enum  │
│ employmentStatus        │ string literal       │ EmploymentStatus   │ ⚠️ Enum  │
│ status                  │ string?              │ ❌ (use Status)    │ 🟡 Remove│
│ terminationDate         │ string?              │ DateTime?          │ ⚠️ Type  │
│ reasonForLeaving        │ string?              │ String?            │ ✅ Match │
│ role                    │ EmployeeRole         │ String             │ ✅ Match │
│ baseSalary              │ number               │ Decimal?           │ ⚠️ Type  │
│ socialInsuranceSalary   │ number?              │ Decimal?           │ ⚠️ Type  │
│ positionAllowance       │ number?              │ Decimal?           │ ⚠️ Type  │
│ mealAllowance           │ number?              │ Decimal?           │ ⚠️ Type  │
│ otherAllowances         │ number?              │ Decimal?           │ ⚠️ Type  │
│ numberOfDependents      │ number?              │ Int?               │ ✅ Match │
│ contractNumber          │ string?              │ String?            │ ✅ Match │
│ contractStartDate       │ string?              │ DateTime?          │ ⚠️ Type  │
│ contractEndDate         │ string?              │ DateTime?          │ ⚠️ Type  │
│ probationEndDate        │ string?              │ DateTime?          │ ⚠️ Type  │
│ contractType            │ string literal       │ ContractType enum  │ ⚠️ Enum  │
│ workingHoursPerDay      │ number?              │ ❌ MISSING         │ 🔴 Add   │
│ workingDaysPerWeek      │ number?              │ ❌ MISSING         │ 🔴 Add   │
│ shiftType               │ string?              │ ❌ MISSING         │ 🔴 Add   │
│ performanceRating       │ string?              │ ❌ MISSING         │ 🔴 Add   │
│ lastReviewDate          │ string?              │ ❌ MISSING         │ 🔴 Add   │
│ nextReviewDate          │ string?              │ ❌ MISSING         │ 🔴 Add   │
│ skills                  │ string[]?            │ ❌ MISSING         │ 🔴 Add   │
│ certifications          │ string[]?            │ ❌ MISSING         │ 🔴 Add   │
│ notes                   │ string?              │ String?            │ ✅ Match │
│ leaveTaken              │ number               │ ❌ (computed)      │ 🟡 Remove│
│ paidLeaveTaken          │ number?              │ ❌ (computed)      │ 🟡 Remove│
│ unpaidLeaveTaken        │ number?              │ ❌ (computed)      │ 🟡 Remove│
│ annualLeaveTaken        │ number?              │ ❌ (computed)      │ 🟡 Remove│
│ annualLeaveBalance      │ number?              │ Int? @default(12)  │ ✅ Match │
│ managerId               │ SystemId?            │ String?            │ ✅ Match │
│ positionX               │ number?              │ ❌ MISSING         │ 🟡 UI    │
│ positionY               │ number?              │ ❌ MISSING         │ 🟡 UI    │
│ positionId              │ SystemId?            │ ❌ (jobTitleId)    │ ⚠️ Alias │
│ positionName            │ string?              │ ❌ (computed)      │ ✅ OK    │
│ createdAt               │ string?              │ DateTime           │ ⚠️ Type  │
│ updatedAt               │ string?              │ DateTime           │ ⚠️ Type  │
│ deletedAt               │ string?              │ DateTime?          │ ⚠️ Type  │
│ isDeleted               │ boolean?             │ Boolean            │ ✅ Match │
│ createdBy               │ SystemId?            │ String?            │ ✅ Match │
│ updatedBy               │ SystemId?            │ String?            │ ✅ Match │
│ activityHistory         │ HistoryEntry[]?      │ ❌ (separate)      │ ✅ OK    │
└─────────────────────────┴──────────────────────┴────────────────────┴──────────┘

LEGEND:
  ✅ Match  - Field exists in both, types compatible
  ⚠️ Type   - Field exists but type differs (string vs DateTime, number vs Decimal)
  ⚠️ Enum   - String literal in types.ts, Enum in Prisma
  ⚠️ Diff   - Different approach (string vs relation)
  🔴 Add    - Missing in Prisma schema, need to ADD
  🟡 Remove - Computed/UI field, should NOT be in schema
  🟡 UI     - UI-only field (org chart position)

SUMMARY FOR EMPLOYEES:
  ✅ Matching fields: 35
  ⚠️ Type differences: 15 (DateTime vs string, Decimal vs number - OK for runtime)
  🔴 Need to add to schema: 10 fields
  🟡 Remove from types (computed): 5 fields

FIELDS TO ADD TO PRISMA SCHEMA:
  1. maritalStatus          String?   // "Độc thân" | "Đã kết hôn" | "Khác"
  2. emergencyContactName   String?
  3. emergencyContactPhone  String?
  4. workingHoursPerDay     Int?      @default(8)
  5. workingDaysPerWeek     Int?      @default(5)
  6. shiftType              String?   // "Hành chính" | "Ca sáng" | etc.
  7. performanceRating      String?
  8. lastReviewDate         DateTime?
  9. nextReviewDate         DateTime?
  10. skills                Json?     // String array stored as JSON
  11. certifications        Json?     // String array stored as JSON

FIELDS TO REMOVE FROM types.ts (computed/deprecated):
  1. leaveTaken      - Computed from Leave records
  2. paidLeaveTaken  - Computed from Leave records
  3. unpaidLeaveTaken - Computed from Leave records
  4. annualLeaveTaken - Computed from Leave records
  5. status          - Duplicate of employmentStatus
  6. positionX/Y     - UI state only, not database

ACTION REQUIRED:
  1. ✅ Add 11 missing fields to employee.prisma
  2. ✅ Run prisma generate
  3. ✅ Then can delete types.ts and use Prisma types
*/

export const EMPLOYEE_COMPARISON_STATUS = {
  totalFields: 55,
  matching: 35,
  typeDifferences: 15,  // These are OK - runtime conversion
  needToAdd: 11,
  toRemove: 6,
  status: 'SCHEMA_UPDATED' as const,  // ✅ DONE - 24/12/2024
  schemaUpdatedAt: '2024-12-24',
  fieldsAdded: [
    'maritalStatus',
    'emergencyContactName', 
    'emergencyContactPhone',
    'workingHoursPerDay',
    'workingDaysPerWeek',
    'shiftType',
    'performanceRating',
    'lastReviewDate',
    'nextReviewDate',
    'skills',
    'certifications',
  ],
};

// ============================================================================
// 2. CUSTOMERS - features/customers/types.ts vs prisma/schema/sales/customer.prisma
// ============================================================================

/*
┌────────────────────────────────────────────────────────────────────────────────┐
│ FIELD COMPARISON: Customer                                                      │
├─────────────────────────┬──────────────────────┬────────────────────┬──────────┤
│ Field (types.ts)        │ Type (types.ts)      │ Prisma Schema      │ Status   │
├─────────────────────────┼──────────────────────┼────────────────────┼──────────┤
│ systemId                │ SystemId             │ String @id         │ ✅ Match │
│ id                      │ BusinessId           │ String @unique     │ ✅ Match │
│ name                    │ string               │ String             │ ✅ Match │
│ email                   │ string               │ String?            │ ✅ Match │
│ phone                   │ string               │ String?            │ ✅ Match │
│ company                 │ string?              │ String?            │ ✅ Match │
│ status                  │ CustomerStatus       │ CustomerStatus     │ ⚠️ Enum  │
│ taxCode                 │ string?              │ String?            │ ✅ Match │
│ representative          │ string?              │ String?            │ ✅ Match │
│ position                │ string?              │ String?            │ ✅ Match │
│ addresses               │ CustomerAddress[]    │ Json?              │ ✅ Match │
│ currentDebt             │ number?              │ Decimal?           │ ⚠️ Type  │
│ maxDebt                 │ number?              │ Decimal?           │ ⚠️ Type  │
│ lifecycleStage          │ CustomerLifecycle    │ CustomerLifecycle  │ ✅ Match │
│ pricingLevel            │ string?              │ PricingLevel?      │ ⚠️ Enum  │
│ defaultDiscount         │ number?              │ Decimal?           │ ⚠️ Type  │
│ totalOrders             │ number?              │ Int?               │ ✅ Match │
│ totalSpent              │ number?              │ Decimal?           │ ⚠️ Type  │
│ lastPurchaseDate        │ string?              │ DateTime?          │ ⚠️ Type  │
│ accountManagerId        │ SystemId?            │ String?            │ ✅ Match │
│ tags                    │ string[]?            │ String[]           │ ✅ Match │
│ notes                   │ string?              │ String?            │ ✅ Match │
│ isDeleted               │ boolean?             │ Boolean            │ ✅ Match │
│ deletedAt               │ string?              │ DateTime?          │ ⚠️ Type  │
│ createdAt               │ string?              │ DateTime           │ ⚠️ Type  │
│ updatedAt               │ string?              │ DateTime           │ ⚠️ Type  │
│ createdBy               │ SystemId?            │ String?            │ ✅ Match │
│ updatedBy               │ SystemId?            │ String?            │ ✅ Match │
│ ─────────────────────── │ ────────────────────── │ ────────────────── │ ──────── │
│ MISSING IN SCHEMA:      │                      │                    │          │
│ zaloPhone               │ string?              │ ❌ MISSING         │ 🔴 Add   │
│ bankName                │ string?              │ ❌ MISSING         │ 🔴 Add   │
│ bankAccount             │ string?              │ ❌ MISSING         │ 🔴 Add   │
│ type                    │ string?              │ ❌ MISSING         │ 🔴 Add   │
│ customerGroup           │ string?              │ ❌ MISSING         │ 🔴 Add   │
│ rfmScores               │ object?              │ ❌ MISSING         │ 🔴 Add   │
│ segment                 │ string?              │ ❌ MISSING         │ 🔴 Add   │
│ healthScore             │ number?              │ ❌ MISSING         │ 🔴 Add   │
│ churnRisk               │ string?              │ ❌ MISSING         │ 🔴 Add   │
│ source                  │ string?              │ ❌ MISSING         │ 🔴 Add   │
│ campaign                │ string?              │ ❌ MISSING         │ 🔴 Add   │
│ referredBy              │ SystemId?            │ ❌ MISSING         │ 🔴 Add   │
│ contacts                │ Json?                │ ❌ MISSING         │ 🔴 Add   │
│ paymentTerms            │ string?              │ ❌ MISSING         │ 🔴 Add   │
│ creditRating            │ string?              │ ❌ MISSING         │ 🔴 Add   │
│ allowCredit             │ boolean?             │ ❌ MISSING         │ 🔴 Add   │
│ contract                │ Json?                │ ❌ MISSING         │ 🔴 Add   │
│ images                  │ string[]?            │ ❌ MISSING         │ 🔴 Add   │
│ social                  │ Json?                │ ❌ MISSING         │ 🔴 Add   │
│ totalQuantityPurchased  │ number?              │ ❌ MISSING         │ 🟡 Computed │
│ totalQuantityReturned   │ number?              │ ❌ MISSING         │ 🟡 Computed │
│ failedDeliveries        │ number?              │ ❌ MISSING         │ 🟡 Computed │
│ lastContactDate         │ string?              │ ❌ MISSING         │ 🔴 Add   │
│ nextFollowUpDate        │ string?              │ ❌ MISSING         │ 🔴 Add   │
│ followUpReason          │ string?              │ ❌ MISSING         │ 🔴 Add   │
│ followUpAssigneeId      │ SystemId?            │ ❌ MISSING         │ 🔴 Add   │
│ ─────────────────────── │ ────────────────────── │ ────────────────── │ ──────── │
│ COMPUTED/UI FIELDS:     │                      │                    │          │
│ debtTransactions        │ DebtTransaction[]    │ ❌ (separate)      │ 🟡 Keep  │
│ debtReminders           │ DebtReminder[]       │ ❌ (separate)      │ 🟡 Keep  │
│ oldestDebtDueDate       │ string?              │ ❌ (computed)      │ 🟡 Keep  │
│ maxDaysOverdue          │ number?              │ ❌ (computed)      │ 🟡 Keep  │
│ debtStatus              │ DebtStatus?          │ ❌ (computed)      │ 🟡 Keep  │
│ activityHistory         │ HistoryEntry[]       │ ❌ (separate)      │ 🟡 Keep  │
│ accountManagerName      │ string?              │ ❌ (computed)      │ 🟡 Keep  │
│ followUpAssigneeName    │ string?              │ ❌ (computed)      │ 🟡 Keep  │
└─────────────────────────┴──────────────────────┴────────────────────┴──────────┘

SUMMARY FOR CUSTOMERS:
  ✅ Matching fields: 20
  ⚠️ Type differences: 9 (DateTime vs string, Decimal vs number)
  🔴 Need to add to schema: 23 fields
  🟡 Computed/Keep in types: 9 fields

FIELDS TO ADD TO PRISMA SCHEMA:
  1. zaloPhone            String?
  2. bankName             String?
  3. bankAccount          String?
  4. type                 String?    // Customer type ID
  5. customerGroup        String?    // Customer group ID
  6. rfmScores            Json?      // {recency, frequency, monetary}
  7. segment              String?    // RFM segment name
  8. healthScore          Int?       // 0-100
  9. churnRisk            String?    // low, medium, high
  10. source              String?    // Lead source ID
  11. campaign            String?    // Campaign name
  12. referredBy          String?    // Customer systemId who referred
  13. contacts            Json?      // Multiple contacts array
  14. paymentTerms        String?    // Payment term ID
  15. creditRating        String?    // Credit rating ID
  16. allowCredit         Boolean?   @default(true)
  17. contract            Json?      // Contract info object
  18. images              String[]   // Image URLs
  19. social              Json?      // Social links object
  20. lastContactDate     DateTime?
  21. nextFollowUpDate    DateTime?
  22. followUpReason      String?
  23. followUpAssigneeId  String?

ACTION REQUIRED:
  1. ⏳ Add 23 missing fields to customer.prisma
  2. ⏳ Run prisma generate
  3. ⏳ Then can delete types.ts and use Prisma types
*/

export const CUSTOMER_COMPARISON_STATUS = {
  totalFields: 52,
  matching: 20,
  typeDifferences: 9,
  needToAdd: 23,
  computed: 9,
  status: 'SCHEMA_UPDATED' as const,  // ✅ DONE - 24/12/2024
  schemaUpdatedAt: '2024-12-24',
  fieldsAdded: [
    'zaloPhone', 'bankName', 'bankAccount',
    'type', 'customerGroup', 'rfmScores', 'segment', 'healthScore', 'churnRisk',
    'source', 'campaign', 'referredBy',
    'contacts', 'paymentTerms', 'creditRating', 'allowCredit',
    'contract', 'images', 'social',
    'lastContactDate', 'nextFollowUpDate', 'followUpReason', 'followUpAssigneeId',
  ],
};

// ============================================================================
// 3. ORDERS - features/orders/types.ts vs prisma/schema/sales/order.prisma  
// ============================================================================
// TODO: Add comparison

export const ORDER_COMPARISON_STATUS = {
  status: 'PENDING' as const,
};

// ============================================================================
// 4. PRODUCTS - features/products/types.ts vs prisma/schema/inventory/product.prisma
// ============================================================================
// TODO: Add comparison

export const PRODUCT_COMPARISON_STATUS = {
  status: 'PENDING' as const,
};

// ... Continue for all 58 types.ts files

// ============================================================================
// OVERALL SUMMARY
// ============================================================================

export const PHASE7_SUMMARY = {
  totalTypesFiles: 58,
  compared: 2,
  schemaUpdated: 2,
  readyToDelete: 0,
  keepAsIs: 0,
  pending: 56,
  
  // Detailed breakdown
  breakdown: {
    // ✅ Schema updated
    employees: 'SCHEMA_UPDATED',  // +11 fields
    customers: 'SCHEMA_UPDATED',  // +23 fields
    
    // ⏳ Pending comparison
    orders: 'PENDING',      // Complex - needs careful review
    products: 'PENDING',    // Mostly OK, few fields to add
    suppliers: 'PENDING',
    complaints: 'PENDING',
    warranty: 'PENDING',
    receipts: 'PENDING',
    payments: 'PENDING',
    leaves: 'PENDING',
    attendance: 'PENDING',
    tasks: 'PENDING',
    // ... etc (46 more pending)
  },
  
  // Summary stats
  totalFieldsAdded: 34,  // 11 + 23
  lastUpdated: '2024-12-24',
};
