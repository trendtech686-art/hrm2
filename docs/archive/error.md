Run npx tsc --noEmit --pretty false --incremental false
  
Error: contexts/auth-context.tsx(98,21): error TS2339: Property 'env' does not exist on type 'ImportMeta'.
Error: features/admin/id-counter-management-page.tsx(50,3): error TS2305: Module '"@/lib/id-config"' has no exported member 'formatCounterInfo'.
Error: features/admin/id-counter-management-page.tsx(100,7): error TS2322: Type '"voucher-receipt"' is not assignable to type '"employees" | "departments" | "branches" | "job-titles" | "customers" | "suppliers" | "shipping-partners" | "products" | "units" | "stock-locations" | "inventory-receipts" | ... 43 more ... | "users"'.
Error: features/admin/id-counter-management-page.tsx(113,7): error TS2322: Type '"voucher-payment"' is not assignable to type '"employees" | "departments" | "branches" | "job-titles" | "customers" | "suppliers" | "shipping-partners" | "products" | "units" | "stock-locations" | "inventory-receipts" | ... 43 more ... | "users"'.
Error: features/admin/id-counter-management-page.tsx(179,49): error TS2345: Argument of type 'string' is not assignable to parameter of type '"employees" | "departments" | "branches" | "job-titles" | "customers" | "suppliers" | "shipping-partners" | "products" | "units" | "stock-locations" | "inventory-receipts" | ... 43 more ... | "users"'.
Error: features/attendance/data.ts(46,11): error TS2322: Type '{ systemId: SystemId; employeeSystemId: SystemId; employeeId: string; fullName: string; department: "Kỹ thuật" | "Nhân sự" | "Kinh doanh" | "Marketing"; }' is not assignable to type 'AnyAttendanceDataRow'.
  Type '{ systemId: SystemId; employeeSystemId: SystemId; employeeId: string; fullName: string; department: "Kỹ thuật" | "Nhân sự" | "Kinh doanh" | "Marketing"; }' is missing the following properties from type 'Omit<AttendanceDataRow, `day_${number}`>': id, workDays, leaveDays, absentDays, and 3 more.
Error: features/auth/user-account-store.ts(38,11): error TS2353: Object literal may only specify known properties, and 'employeeId' does not exist in type 'UserAccount'.
Error: features/auth/user-account-store.ts(51,11): error TS2353: Object literal may only specify known properties, and 'employeeId' does not exist in type 'UserAccount'.
Error: features/auth/user-account-store.ts(81,11): error TS2353: Object literal may only specify known properties, and 'accountId' does not exist in type 'Omit<AccountActivity, "id" | "timestamp">'.
Error: features/auth/user-account-store.ts(82,34): error TS2339: Property 'employeeId' does not exist on type 'UserAccount'.
Error: features/auth/user-account-store.ts(107,47): error TS2339: Property 'employeeId' does not exist on type 'UserAccount'.
Error: features/auth/user-account-store.ts(127,13): error TS2353: Object literal may only specify known properties, and 'accountId' does not exist in type 'Omit<AccountActivity, "id" | "timestamp">'.
Error: features/auth/user-account-store.ts(128,33): error TS2339: Property 'employeeId' does not exist on type 'UserAccount'.
Error: features/auth/user-account-store.ts(149,13): error TS2353: Object literal may only specify known properties, and 'accountId' does not exist in type 'Omit<AccountActivity, "id" | "timestamp">'.
Error: features/auth/user-account-store.ts(150,33): error TS2339: Property 'employeeId' does not exist on type 'UserAccount'.
Error: features/auth/user-account-store.ts(174,13): error TS2353: Object literal may only specify known properties, and 'accountId' does not exist in type 'Omit<AccountActivity, "id" | "timestamp">'.
Error: features/auth/user-account-store.ts(175,33): error TS2339: Property 'employeeId' does not exist on type 'UserAccount'.
Error: features/auth/user-account-store.ts(196,13): error TS2353: Object literal may only specify known properties, and 'accountId' does not exist in type 'Omit<AccountActivity, "id" | "timestamp">'.
Error: features/auth/user-account-store.ts(197,33): error TS2339: Property 'employeeId' does not exist on type 'UserAccount'.
Error: features/auth/user-account-store.ts(229,51): error TS2339: Property 'employeeId' does not exist on type 'AccountActivity'.
Error: features/complaints/components/complaint-header-section.tsx(51,63): error TS2367: This comparison appears to be unintentional because the types '"ended" | "pending" | "cancelled" | "investigating"' and '"rejected"' have no overlap.
Error: features/complaints/hooks/use-complaint-reminders.ts(129,42): error TS2367: This comparison appears to be unintentional because the types '"ended" | "pending" | "cancelled" | "investigating"' and '"rejected"' have no overlap.
Error: features/complaints/hooks/use-complaint-statistics.ts(138,45): error TS2367: This comparison appears to be unintentional because the types 'ComplaintStatus' and '"rejected"' have no overlap.
Error: features/complaints/hooks/use-complaint-time-tracking.ts(114,51): error TS2367: This comparison appears to be unintentional because the types '"ended" | "pending" | "cancelled" | "investigating"' and '"rejected"' have no overlap.
Error: features/complaints/sla-utils.ts(52,57): error TS2367: This comparison appears to be unintentional because the types '"ended" | "pending" | "cancelled" | "investigating"' and '"rejected"' have no overlap.
Error: features/complaints/store.ts(329,11): error TS2322: Type '"rejected"' is not assignable to type 'ComplaintStatus'.
Error: features/complaints/store.ts(455,46): error TS2367: This comparison appears to be unintentional because the types 'ComplaintStatus' and '"rejected"' have no overlap.
Error: features/customers/components/address-migration-dialog.tsx(22,37): error TS2307: Cannot find module '@/features/provinces/ward-district-mapping' or its corresponding type declarations.
Error: features/customers/components/dual-address-form.tsx(19,34): error TS2307: Cannot find module '@/features/provinces/store' or its corresponding type declarations.
Error: features/customers/components/dual-address-form.tsx(53,63): error TS2339: Property 'isShipping' does not exist on type 'Partial<EnhancedCustomerAddress>'.
Error: features/customers/components/dual-address-form.tsx(54,61): error TS2339: Property 'isBilling' does not exist on type 'Partial<EnhancedCustomerAddress>'.
Error: features/customers/components/dual-address-form.tsx(55,61): error TS2339: Property 'isDefault' does not exist on type 'Partial<EnhancedCustomerAddress>'.
Error: features/customers/components/dual-address-form.tsx(216,7): error TS2353: Object literal may only specify known properties, and 'isDefault' does not exist in type 'EnhancedCustomerAddress'.
Error: features/customers/components/enhanced-address-form.tsx(15,34): error TS2307: Cannot find module '@/features/provinces/store' or its corresponding type declarations.
Error: features/customers/components/enhanced-address-form.tsx(173,11): error TS2353: Object literal may only specify known properties, and 'isDefault' does not exist in type 'CreateAddress2LevelInput'.
Error: features/customers/components/enhanced-address-form.tsx(220,9): error TS2353: Object literal may only specify known properties, and 'isDefault' does not exist in type 'CreateAddress3LevelInput'.
Error: features/customers/components/enhanced-address-list.tsx(88,53): error TS2339: Property 'isDefault' does not exist on type 'EnhancedCustomerAddress'.
Error: features/customers/components/enhanced-address-list.tsx(94,30): error TS2339: Property 'isDefault' does not exist on type 'EnhancedCustomerAddress'.
Error: features/customers/components/enhanced-address-list.tsx(97,30): error TS2339: Property 'isShipping' does not exist on type 'EnhancedCustomerAddress'.
Error: features/customers/components/enhanced-address-list.tsx(103,30): error TS2339: Property 'isBilling' does not exist on type 'EnhancedCustomerAddress'.
Error: features/customers/components/enhanced-address-list.tsx(228,21): error TS2322: Type '{ address: EnhancedCustomerAddress; onSuccess: (updatedAddress: EnhancedCustomerAddress) => void; trigger: Element; }' is not assignable to type 'IntrinsicAttributes & AddressConversionDialogProps'.
  Property 'trigger' does not exist on type 'IntrinsicAttributes & AddressConversionDialogProps'.
Error: features/customers/components/enhanced-address-list.tsx(237,27): error TS2339: Property 'isDefault' does not exist on type 'EnhancedCustomerAddress'.
Error: features/customers/components/enhanced-address-list.tsx(255,39): error TS2339: Property 'isDefault' does not exist on type 'EnhancedCustomerAddress'.
Error: features/customers/customer-form-page.tsx(22,61): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/customers/customer-form-page.tsx(27,14): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/customers/detail-page.tsx(87,61): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/customers/detail-page.tsx(103,68): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/customers/detail-page.tsx(104,70): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/customers/detail-page.tsx(105,72): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/customers/detail-page.tsx(106,74): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/customers/detail-page.tsx(107,76): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/customers/detail-page.tsx(108,66): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/customers/detail-page.tsx(149,24): error TS2339: Property 'payerType' does not exist on type 'Receipt'.
Error: features/customers/detail-page.tsx(339,59): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/customers/detail-page.tsx(689,24): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/customers/edit-customer-address-dialog.tsx(29,70): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/customers/edit-customer-address-dialog.tsx(141,20): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/customers/store.ts(17,35): error TS2344: Type 'Customer' does not satisfy the constraint 'ItemWithSystemId'.
  Types of property 'systemId' are incompatible.
    Type 'string' is not assignable to type 'SystemId'.
      Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/customers/store.ts(24,48): error TS2344: Type 'Customer' does not satisfy the constraint 'ItemWithSystemId'.
  Types of property 'systemId' are incompatible.
    Type 'string' is not assignable to type 'SystemId'.
      Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/customers/store.ts(121,37): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/customers/trash-page.tsx(24,13): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/customers/trash-page.tsx(30,14): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/customers/trash-page.tsx(84,16): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/customers/utils/address-conversion-helper.ts(9,37): error TS2307: Cannot find module '@/features/provinces/types' or its corresponding type declarations.
Error: features/customers/utils/enhanced-address-helper.ts(16,55): error TS2307: Cannot find module '@/features/provinces/ward-district-mapping' or its corresponding type declarations.
Error: features/customers/utils/enhanced-address-helper.ts(66,7): error TS2353: Object literal may only specify known properties, and 'isDefault' does not exist in type 'EnhancedCustomerAddress'.
Error: features/customers/utils/enhanced-address-helper.ts(66,24): error TS2339: Property 'isDefault' does not exist on type 'CreateAddress2LevelInput'.
Error: features/customers/utils/enhanced-address-helper.ts(67,25): error TS2339: Property 'isShipping' does not exist on type 'CreateAddress2LevelInput'.
Error: features/customers/utils/enhanced-address-helper.ts(68,24): error TS2339: Property 'isBilling' does not exist on type 'CreateAddress2LevelInput'.
Error: features/customers/utils/enhanced-address-helper.ts(126,7): error TS2353: Object literal may only specify known properties, and 'isDefault' does not exist in type 'EnhancedCustomerAddress'.
Error: features/customers/utils/enhanced-address-helper.ts(126,24): error TS2339: Property 'isDefault' does not exist on type 'CreateAddress3LevelInput'.
Error: features/customers/utils/enhanced-address-helper.ts(127,25): error TS2339: Property 'isShipping' does not exist on type 'CreateAddress3LevelInput'.
Error: features/customers/utils/enhanced-address-helper.ts(128,24): error TS2339: Property 'isBilling' does not exist on type 'CreateAddress3LevelInput'.
Error: features/customers/utils/enhanced-address-helper.ts(224,7): error TS2353: Object literal may only specify known properties, and 'isDefault' does not exist in type 'EnhancedCustomerAddress'.
Error: features/employees/columns.tsx(4,29): error TS2307: Cannot find module '../branches/types.ts' or its corresponding type declarations.
Error: features/employees/page-tanstack-test.tsx(55,14): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/employees/page.tsx(145,13): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/employees/page.tsx(177,14): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/employees/page.tsx(188,44): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/employees/tanstack-columns.tsx(8,29): error TS2307: Cannot find module '../branches/types' or its corresponding type declarations.
Error: features/employees/trash-columns.tsx(4,29): error TS2307: Cannot find module '../branches/types.ts' or its corresponding type declarations.
Error: features/employees/trash-page.tsx(48,13): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/employees/virtualized-page.tsx(114,30): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/employees/virtualized-page.tsx(118,31): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/inventory-receipts/data.ts(20,5): error TS2561: Object literal may only specify known properties, but 'purchaseOrderSystemId' does not exist in type 'InventoryReceipt'. Did you mean to write 'purchaseOrderId'?
Error: features/inventory-receipts/data.ts(45,5): error TS2561: Object literal may only specify known properties, but 'purchaseOrderSystemId' does not exist in type 'InventoryReceipt'. Did you mean to write 'purchaseOrderId'?
Error: features/inventory-receipts/detail-page.tsx(29,67): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/inventory-receipts/detail-page.tsx(35,76): error TS2339: Property 'supplierId' does not exist on type 'InventoryReceipt'.
Error: features/inventory-receipts/detail-page.tsx(36,76): error TS2339: Property 'receiverId' does not exist on type 'InventoryReceipt'.
Error: features/inventory-receipts/store.ts(5,57): error TS2344: Type 'InventoryReceipt' does not satisfy the constraint 'ItemWithSystemId'.
  Types of property 'systemId' are incompatible.
    Type 'string' is not assignable to type 'SystemId'.
      Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/leaves/detail-page.tsx(23,60): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/leaves/page.tsx(62,16): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/leaves/page.tsx(101,14): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/leaves/page.tsx(116,14): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/leaves/page.tsx(151,14): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/leaves/page.tsx(159,14): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/leaves/store.ts(6,46): error TS2344: Type 'LeaveRequest' does not satisfy the constraint 'ItemWithSystemId'.
  Types of property 'systemId' are incompatible.
    Type 'string' is not assignable to type 'SystemId'.
      Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/orders/components/customer-address-selector.tsx(52,47): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/orders/components/customer-address-selector.tsx(197,24): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/orders/components/customer-address-selector.tsx(233,24): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/orders/components/customer-address-selector.tsx(278,24): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/orders/components/customer-address-selector.tsx(312,24): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/orders/components/shipping-integration.tsx(269,41): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/orders/components/shipping-integration.tsx(474,35): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/orders/components/shipping-integration.tsx(780,42): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/orders/components/shipping-integration.tsx(931,42): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/orders/order-detail-page.tsx(633,47): error TS2304: Cannot find name 'allSalesReturns'.
Error: features/orders/store.ts(112,29): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/orders/store.ts(129,31): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/orders/store.ts(210,40): error TS2551: Property 'paymentMethod' does not exist on type 'Receipt'. Did you mean 'paymentMethodName'?
Error: features/orders/store.ts(397,31): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/orders/store.ts(566,31): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/orders/store.ts(607,41): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/orders/store.ts(639,40): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/orders/store.ts(710,40): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/orders/store.ts(963,43): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/orders/store.ts(967,46): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/orders/store.ts(971,52): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/orders/types.ts(1,29): error TS2307: Cannot find module '../branches/types.ts' or its corresponding type declarations.
Error: features/orders/utils/address-integration.ts(12,34): error TS2307: Cannot find module '@/features/provinces/store' or its corresponding type declarations.
Error: features/orders/utils/address-level-mapper.ts(7,37): error TS2307: Cannot find module '@/features/provinces/types' or its corresponding type declarations.
Error: features/orders/utils/create-shipment.ts(6,38): error TS2307: Cannot find module '../../settings/shipping-partners/types' or its corresponding type declarations.
Error: features/orders/utils/create-shipment.ts(7,29): error TS2307: Cannot find module '../../branches/types' or its corresponding type declarations.
Error: features/orders/utils/create-shipping-order.ts(20,37): error TS2307: Cannot find module '@/features/provinces/types' or its corresponding type declarations.
Error: features/other-targets/store.ts(10,35): error TS2344: Type 'OtherTarget' does not satisfy the constraint 'ItemWithSystemId'.
  Types of property 'systemId' are incompatible.
    Type 'string' is not assignable to type 'SystemId'.
      Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/other-targets/store.ts(39,59): error TS2344: Type 'OtherTarget' does not satisfy the constraint 'ItemWithSystemId'.
  Types of property 'systemId' are incompatible.
    Type 'string' is not assignable to type 'SystemId'.
      Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/payments/page.tsx(549,37): error TS2322: Type '{ key: SystemId; payment: { runningBalance: number; systemId: SystemId; id: BusinessId; date: string; amount: number; recipientTypeSystemId: string; recipientTypeName: string; ... 29 more ...; completedAt?: string; }; onCancel: (systemId: string) => void; onApprove: (systemId: string) => void; navigate: NavigateFunc...' is not assignable to type 'IntrinsicAttributes & { payment: Payment; }'.
  Property 'onCancel' does not exist on type 'IntrinsicAttributes & { payment: Payment; }'.
Error: features/payments/page.tsx(615,29): error TS2322: Type '{ payment: Payment; onCancel: (systemId: string) => void; onApprove: (systemId: string) => void; navigate: NavigateFunction; handleRowClick: (payment: Payment) => void; }' is not assignable to type 'IntrinsicAttributes & { payment: Payment; }'.
  Property 'onCancel' does not exist on type 'IntrinsicAttributes & { payment: Payment; }'.
Error: features/products/form-page.tsx(30,60): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/products/trash-columns.tsx(115,5): error TS2322: Type '"category"' is not assignable to type 'keyof Product'.
Error: features/products/trash-columns.tsx(117,28): error TS2339: Property 'category' does not exist on type 'Product'.
Error: features/products/trash-page.tsx(25,13): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/products/trash-page.tsx(31,14): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/products/trash-page.tsx(104,17): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/products/trash-page.tsx(108,16): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/purchase-orders/columns.tsx(5,29): error TS2307: Cannot find module '../branches/types.ts' or its corresponding type declarations.
Error: features/purchase-orders/components/supplier-selection-card.tsx(31,45): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/purchase-orders/detail-page.tsx(412,15): error TS2339: Property 'payerName' does not exist on type '(Receipt | Payment) & Record<"payerType", unknown>'.
  Property 'payerName' does not exist on type 'Payment & Record<"payerType", unknown>'.
Error: features/purchase-orders/detail-page.tsx(681,21): error TS2551: Property 'recipientType' does not exist on type 'Payment'. Did you mean 'recipientTypeName'?
Error: features/purchase-orders/detail-page.tsx(882,33): error TS2551: Property 'recipientType' does not exist on type 'Payment'. Did you mean 'recipientTypeName'?
Error: features/purchase-orders/detail-page.tsx(898,11): error TS2551: Property 'recipientType' does not exist on type 'Payment'. Did you mean 'recipientTypeName'?
Error: features/purchase-orders/detail-page.tsx(902,37): error TS2551: Property 'paymentMethod' does not exist on type 'Payment'. Did you mean 'paymentMethodName'?
Error: features/purchase-orders/detail-page.tsx(909,11): error TS2339: Property 'payerType' does not exist on type 'Receipt'.
Error: features/purchase-orders/detail-page.tsx(913,37): error TS2551: Property 'paymentMethod' does not exist on type 'Receipt'. Did you mean 'paymentMethodName'?
Error: features/purchase-orders/form-page.tsx(45,31): error TS2552: Cannot find name 'usePaymentStore'. Did you mean 'setPayments'?
Error: features/purchase-orders/form-page.tsx(181,43): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/purchase-orders/form-page.tsx(515,50): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/purchase-orders/form-page.tsx(525,25): error TS2304: Cannot find name 'newReceiptId'.
Error: features/purchase-orders/form-page.tsx(541,36): error TS2304: Cannot find name 'Payment'.
Error: features/purchase-orders/page.tsx(138,21): error TS2551: Property 'recipientType' does not exist on type 'Payment'. Did you mean 'recipientTypeName'?
Error: features/purchase-orders/page.tsx(285,25): error TS2551: Property 'recipientType' does not exist on type 'Payment'. Did you mean 'recipientTypeName'?
Error: features/purchase-orders/page.tsx(306,17): error TS2561: Object literal may only specify known properties, but 'recipientType' does not exist in type 'Omit<Payment, "systemId">'. Did you mean to write 'recipientTypeName'?
Error: features/purchase-orders/store.ts(99,29): error TS2551: Property 'recipientType' does not exist on type 'Payment'. Did you mean 'recipientTypeName'?
Error: features/purchase-orders/store.ts(279,23): error TS2551: Property 'recipientType' does not exist on type 'Payment'. Did you mean 'recipientTypeName'?
Error: features/purchase-orders/store.ts(365,21): error TS2551: Property 'recipientType' does not exist on type 'Payment'. Did you mean 'recipientTypeName'?
Error: features/purchase-orders/store.ts(384,17): error TS2353: Object literal may only specify known properties, and 'payerType' does not exist in type 'Omit<Receipt, "systemId">'.
Error: features/purchase-returns/data.ts(19,5): error TS2561: Object literal may only specify known properties, but 'purchaseOrderSystemId' does not exist in type 'PurchaseReturn'. Did you mean to write 'purchaseOrderId'?
Error: features/purchase-returns/data.ts(47,5): error TS2561: Object literal may only specify known properties, but 'purchaseOrderSystemId' does not exist in type 'PurchaseReturn'. Did you mean to write 'purchaseOrderId'?
Error: features/purchase-returns/form-page.tsx(71,38): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/purchase-returns/form-page.tsx(72,34): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/purchase-returns/form-page.tsx(76,33): error TS2304: Cannot find name 'usePaymentStore'.
Error: features/purchase-returns/form-page.tsx(197,19): error TS2304: Cannot find name 'Payment'.
Error: features/purchase-returns/store.ts(69,17): error TS2353: Object literal may only specify known properties, and 'payerType' does not exist in type 'Omit<Receipt, "systemId">'.
Error: features/sales-returns/store.ts(24,35): error TS2344: Type 'SalesReturn' does not satisfy the constraint 'ItemWithSystemId'.
  Types of property 'systemId' are incompatible.
    Type 'string' is not assignable to type 'SystemId'.
      Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/sales-returns/store.ts(222,21): error TS2561: Object literal may only specify known properties, but 'recipientType' does not exist in type 'Omit<Payment, "systemId">'. Did you mean to write 'recipientTypeName'?
Error: features/sales-returns/store.ts(265,21): error TS2353: Object literal may only specify known properties, and 'payerType' does not exist in type 'Omit<Receipt, "systemId">'.
Error: features/sales-returns/store.ts(305,65): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/sales-returns/store.ts(307,29): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/sales-returns/store.ts(340,55): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/sales-returns/store.ts(357,61): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/sales-returns/store.ts(359,25): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/sales-returns/store.ts(375,33): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/settings/branches/branch-form.tsx(34,32): error TS2339: Property 'getState' does not exist on type 'CrudState<Branch>'.
Error: features/settings/customers/credit-ratings-store.ts(5,53): error TS2344: Type 'CreditRating' does not satisfy the constraint 'ItemWithSystemId'.
  Types of property 'systemId' are incompatible.
    Type 'string' is not assignable to type 'SystemId'.
      Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/settings/customers/customer-groups-store.ts(5,54): error TS2344: Type 'CustomerGroup' does not satisfy the constraint 'ItemWithSystemId'.
  Types of property 'systemId' are incompatible.
    Type 'string' is not assignable to type 'SystemId'.
      Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/settings/customers/customer-sources-store.ts(5,55): error TS2344: Type 'CustomerSource' does not satisfy the constraint 'ItemWithSystemId'.
  Types of property 'systemId' are incompatible.
    Type 'string' is not assignable to type 'SystemId'.
      Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/settings/customers/customer-types-store.ts(5,53): error TS2344: Type 'CustomerType' does not satisfy the constraint 'ItemWithSystemId'.
  Types of property 'systemId' are incompatible.
    Type 'string' is not assignable to type 'SystemId'.
      Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/settings/customers/page.tsx(74,30): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/settings/customers/page.tsx(77,31): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/settings/customers/page.tsx(80,32): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/settings/customers/page.tsx(83,29): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/settings/customers/page.tsx(86,30): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/settings/customers/payment-terms-store.ts(5,52): error TS2344: Type 'PaymentTerm' does not satisfy the constraint 'ItemWithSystemId'.
  Types of property 'systemId' are incompatible.
    Type 'string' is not assignable to type 'SystemId'.
      Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/settings/inventory/page.tsx(65,14): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/settings/inventory/page.tsx(73,14): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/settings/job-titles/page-content.tsx(77,14): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/settings/job-titles/page-content.tsx(90,14): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/settings/job-titles/store.ts(5,49): error TS2344: Type 'JobTitle' does not satisfy the constraint 'ItemWithSystemId'.
  Types of property 'systemId' are incompatible.
    Type 'string' is not assignable to type 'SystemId'.
      Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/settings/payments/methods/columns.tsx(21,18): error TS2304: Cannot find name 'Star'.
Error: features/settings/penalties/columns.tsx(58,5): error TS2322: Type '"employeeId"' is not assignable to type 'keyof Penalty'.
Error: features/settings/penalties/columns.tsx(60,28): error TS2339: Property 'employeeId' does not exist on type 'Penalty'.
Error: features/settings/penalties/columns.tsx(72,5): error TS2322: Type '"category"' is not assignable to type 'keyof Penalty'.
Error: features/settings/penalties/columns.tsx(74,28): error TS2339: Property 'category' does not exist on type 'Penalty'.
Error: features/settings/penalties/columns.tsx(104,5): error TS2322: Type '"dueDate"' is not assignable to type 'keyof Penalty'.
Error: features/settings/penalties/columns.tsx(106,28): error TS2339: Property 'dueDate' does not exist on type 'Penalty'.
Error: features/settings/penalties/columns.tsx(106,53): error TS2339: Property 'dueDate' does not exist on type 'Penalty'.
Error: features/settings/penalties/columns.tsx(111,5): error TS2322: Type '"paidDate"' is not assignable to type 'keyof Penalty'.
Error: features/settings/penalties/columns.tsx(113,28): error TS2339: Property 'paidDate' does not exist on type 'Penalty'.
Error: features/settings/penalties/columns.tsx(113,54): error TS2339: Property 'paidDate' does not exist on type 'Penalty'.
Error: features/settings/penalties/columns.tsx(125,5): error TS2322: Type '"approverName"' is not assignable to type 'keyof Penalty'.
Error: features/settings/penalties/columns.tsx(127,28): error TS2339: Property 'approverName' does not exist on type 'Penalty'.
Error: features/settings/penalties/columns.tsx(139,5): error TS2322: Type '"notes"' is not assignable to type 'keyof Penalty'.
Error: features/settings/penalties/columns.tsx(142,58): error TS2339: Property 'notes' does not exist on type 'Penalty'.
Error: features/settings/penalties/columns.tsx(143,14): error TS2339: Property 'notes' does not exist on type 'Penalty'.
Error: features/settings/penalties/columns.tsx(150,5): error TS2322: Type '"attachments"' is not assignable to type 'keyof Penalty'.
Error: features/settings/penalties/columns.tsx(153,25): error TS2339: Property 'attachments' does not exist on type 'Penalty'.
Error: features/settings/penalties/columns.tsx(160,5): error TS2322: Type '"createdAt"' is not assignable to type 'keyof Penalty'.
Error: features/settings/penalties/columns.tsx(162,28): error TS2339: Property 'createdAt' does not exist on type 'Penalty'.
Error: features/settings/penalties/columns.tsx(162,59): error TS2339: Property 'createdAt' does not exist on type 'Penalty'.
Error: features/settings/penalties/penalty-form-page.tsx(18,60): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/settings/penalties/penalty-form-page.tsx(63,14): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/settings/penalties/penalty-form-page.tsx(73,12): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/settings/penalties/store.ts(5,48): error TS2344: Type 'Penalty' does not satisfy the constraint 'ItemWithSystemId'.
  Types of property 'systemId' are incompatible.
    Type 'string' is not assignable to type 'SystemId'.
      Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/settings/provinces/ward-district-data.ts(9,15): error TS2305: Module '"./ward-district-mapping"' has no exported member 'WardDistrictDataInput'.
Error: features/settings/sales-channels/columns.tsx(36,18): error TS2304: Cannot find name 'CheckCircle2'.
Error: features/settings/sales-channels/data.ts(5,39): error TS2353: Object literal may only specify known properties, and 'id' does not exist in type 'SalesChannel'.
Error: features/settings/sales-channels/data.ts(6,39): error TS2353: Object literal may only specify known properties, and 'id' does not exist in type 'SalesChannel'.
Error: features/settings/sales-channels/data.ts(7,39): error TS2353: Object literal may only specify known properties, and 'id' does not exist in type 'SalesChannel'.
Error: features/settings/sales-channels/data.ts(8,39): error TS2353: Object literal may only specify known properties, and 'id' does not exist in type 'SalesChannel'.
Error: features/settings/sales-channels/data.ts(9,39): error TS2353: Object literal may only specify known properties, and 'id' does not exist in type 'SalesChannel'.
Error: features/settings/sales-channels/data.ts(10,39): error TS2353: Object literal may only specify known properties, and 'id' does not exist in type 'SalesChannel'.
Error: features/settings/sales-channels/data.ts(11,39): error TS2353: Object literal may only specify known properties, and 'id' does not exist in type 'SalesChannel'.
Error: features/settings/sales-channels/data.ts(12,39): error TS2353: Object literal may only specify known properties, and 'id' does not exist in type 'SalesChannel'.
Error: features/settings/sales-channels/data.ts(13,39): error TS2353: Object literal may only specify known properties, and 'id' does not exist in type 'SalesChannel'.
Error: features/settings/sales-channels/data.ts(14,39): error TS2353: Object literal may only specify known properties, and 'id' does not exist in type 'SalesChannel'.
Error: features/settings/sales-channels/data.ts(15,39): error TS2353: Object literal may only specify known properties, and 'id' does not exist in type 'SalesChannel'.
Error: features/settings/sales-channels/data.ts(16,39): error TS2353: Object literal may only specify known properties, and 'id' does not exist in type 'SalesChannel'.
Error: features/settings/sales-channels/data.ts(17,39): error TS2353: Object literal may only specify known properties, and 'id' does not exist in type 'SalesChannel'.
Error: features/settings/shipping/data.ts(16,9): error TS2741: Property 'systemId' is missing in type '{ id: BusinessId; name: string; }' but required in type 'ShippingService'.
Error: features/settings/shipping/data.ts(17,9): error TS2741: Property 'systemId' is missing in type '{ id: BusinessId; name: string; }' but required in type 'ShippingService'.
Error: features/settings/shipping/data.ts(27,13): error TS2741: Property 'systemId' is missing in type '{ id: BusinessId; label: string; type: "radio"; options: string[]; }' but required in type 'AdditionalService'.
Error: features/settings/shipping/data.ts(28,13): error TS2741: Property 'systemId' is missing in type '{ id: BusinessId; label: string; type: "checkbox"; }' but required in type 'AdditionalService'.
Error: features/settings/shipping/data.ts(29,13): error TS2741: Property 'systemId' is missing in type '{ id: BusinessId; label: string; type: "checkbox"; }' but required in type 'AdditionalService'.
Error: features/settings/shipping/data.ts(30,13): error TS2741: Property 'systemId' is missing in type '{ id: BusinessId; label: string; type: "checkbox"; tooltip: string; }' but required in type 'AdditionalService'.
Error: features/settings/shipping/data.ts(31,13): error TS2741: Property 'systemId' is missing in type '{ id: BusinessId; label: string; type: "checkbox"; }' but required in type 'AdditionalService'.
Error: features/settings/shipping/data.ts(48,9): error TS2741: Property 'systemId' is missing in type '{ id: BusinessId; name: string; }' but required in type 'ShippingService'.
Error: features/settings/shipping/data.ts(49,9): error TS2741: Property 'systemId' is missing in type '{ id: BusinessId; name: string; }' but required in type 'ShippingService'.
Error: features/settings/shipping/data.ts(60,13): error TS2741: Property 'systemId' is missing in type '{ id: BusinessId; label: string; type: "checkbox"; }' but required in type 'AdditionalService'.
Error: features/settings/shipping/data.ts(61,13): error TS2741: Property 'systemId' is missing in type '{ id: BusinessId; label: string; type: "checkbox"; }' but required in type 'AdditionalService'.
Error: features/settings/shipping/data.ts(62,13): error TS2741: Property 'systemId' is missing in type '{ id: BusinessId; label: string; type: "checkbox"; }' but required in type 'AdditionalService'.
Error: features/settings/shipping/data.ts(63,13): error TS2741: Property 'systemId' is missing in type '{ id: BusinessId; label: string; type: "checkbox"; }' but required in type 'AdditionalService'.
Error: features/settings/shipping/data.ts(64,13): error TS2741: Property 'systemId' is missing in type '{ id: BusinessId; label: string; type: "checkbox"; }' but required in type 'AdditionalService'.
Error: features/settings/shipping/data.ts(65,13): error TS2741: Property 'systemId' is missing in type '{ id: BusinessId; label: string; type: "checkbox"; }' but required in type 'AdditionalService'.
Error: features/settings/shipping/data.ts(66,13): error TS2741: Property 'systemId' is missing in type '{ id: BusinessId; label: string; type: "checkbox"; }' but required in type 'AdditionalService'.
Error: features/settings/shipping/data.ts(67,13): error TS2741: Property 'systemId' is missing in type '{ id: BusinessId; label: string; type: "checkbox"; }' but required in type 'AdditionalService'.
Error: features/settings/shipping/data.ts(68,13): error TS2741: Property 'systemId' is missing in type '{ id: BusinessId; label: string; type: "checkbox"; }' but required in type 'AdditionalService'.
Error: features/settings/shipping/data.ts(85,9): error TS2741: Property 'systemId' is missing in type '{ id: BusinessId; name: string; }' but required in type 'ShippingService'.
Error: features/settings/shipping/data.ts(86,9): error TS2741: Property 'systemId' is missing in type '{ id: BusinessId; name: string; }' but required in type 'ShippingService'.
Error: features/settings/shipping/data.ts(95,13): error TS2741: Property 'systemId' is missing in type '{ id: BusinessId; label: string; type: "select"; options: string[]; placeholder: string; }' but required in type 'AdditionalService'.
Error: features/settings/shipping/data.ts(96,13): error TS2741: Property 'systemId' is missing in type '{ id: BusinessId; label: string; type: "select"; options: string[]; placeholder: string; }' but required in type 'AdditionalService'.
Error: features/settings/shipping/data.ts(97,13): error TS2741: Property 'systemId' is missing in type '{ id: BusinessId; label: string; type: "radio"; options: string[]; }' but required in type 'AdditionalService'.
Error: features/settings/shipping/data.ts(98,13): error TS2741: Property 'systemId' is missing in type '{ id: BusinessId; label: string; type: "checkbox"; }' but required in type 'AdditionalService'.
Error: features/settings/shipping/data.ts(99,13): error TS2741: Property 'systemId' is missing in type '{ id: BusinessId; label: string; type: "checkbox"; }' but required in type 'AdditionalService'.
Error: features/settings/shipping/data.ts(100,13): error TS2741: Property 'systemId' is missing in type '{ id: BusinessId; label: string; type: "checkbox"; }' but required in type 'AdditionalService'.
Error: features/settings/shipping/data.ts(101,13): error TS2741: Property 'systemId' is missing in type '{ id: BusinessId; label: string; type: "checkbox"; }' but required in type 'AdditionalService'.
Error: features/settings/shipping/data.ts(102,13): error TS2741: Property 'systemId' is missing in type '{ id: BusinessId; label: string; type: "checkbox"; }' but required in type 'AdditionalService'.
Error: features/settings/shipping/data.ts(103,13): error TS2741: Property 'systemId' is missing in type '{ id: BusinessId; label: string; type: "checkbox"; }' but required in type 'AdditionalService'.
Error: features/settings/shipping/data.ts(104,13): error TS2741: Property 'systemId' is missing in type '{ id: BusinessId; label: string; type: "checkbox"; }' but required in type 'AdditionalService'.
Error: features/settings/shipping/data.ts(105,13): error TS2741: Property 'systemId' is missing in type '{ id: BusinessId; label: string; type: "checkbox"; }' but required in type 'AdditionalService'.
Error: features/settings/shipping/data.ts(106,13): error TS2741: Property 'systemId' is missing in type '{ id: BusinessId; label: string; type: "checkbox"; }' but required in type 'AdditionalService'.
Error: features/settings/shipping/data.ts(107,13): error TS2741: Property 'systemId' is missing in type '{ id: BusinessId; label: string; type: "checkbox"; }' but required in type 'AdditionalService'.
Error: features/settings/shipping/data.ts(108,13): error TS2741: Property 'systemId' is missing in type '{ id: BusinessId; label: string; type: "checkbox"; }' but required in type 'AdditionalService'.
Error: features/settings/shipping/data.ts(109,13): error TS2741: Property 'systemId' is missing in type '{ id: BusinessId; label: string; type: "checkbox"; }' but required in type 'AdditionalService'.
Error: features/settings/shipping/data.ts(110,13): error TS2741: Property 'systemId' is missing in type '{ id: BusinessId; label: string; type: "checkbox"; }' but required in type 'AdditionalService'.
Error: features/settings/shipping/data.ts(111,13): error TS2741: Property 'systemId' is missing in type '{ id: BusinessId; label: string; type: "text"; gridSpan: 2; }' but required in type 'AdditionalService'.
Error: features/settings/shipping/data.ts(126,16): error TS2741: Property 'systemId' is missing in type '{ id: BusinessId; name: string; }' but required in type 'ShippingService'.
Error: features/settings/shipping/data.ts(135,13): error TS2741: Property 'systemId' is missing in type '{ id: BusinessId; label: string; type: "checkbox"; }' but required in type 'AdditionalService'.
Error: features/settings/shipping/data.ts(136,13): error TS2741: Property 'systemId' is missing in type '{ id: BusinessId; label: string; type: "checkbox"; }' but required in type 'AdditionalService'.
Error: features/settings/shipping/data.ts(137,13): error TS2741: Property 'systemId' is missing in type '{ id: BusinessId; label: string; type: "text"; gridSpan: 2; }' but required in type 'AdditionalService'.
Error: features/settings/shipping/data.ts(153,9): error TS2741: Property 'systemId' is missing in type '{ id: BusinessId; name: string; }' but required in type 'ShippingService'.
Error: features/settings/shipping/data.ts(154,9): error TS2741: Property 'systemId' is missing in type '{ id: BusinessId; name: string; }' but required in type 'ShippingService'.
Error: features/settings/shipping/data.ts(163,13): error TS2741: Property 'systemId' is missing in type '{ id: BusinessId; label: string; type: "select"; options: string[]; }' but required in type 'AdditionalService'.
Error: features/settings/shipping/data.ts(164,13): error TS2741: Property 'systemId' is missing in type '{ id: BusinessId; label: string; type: "checkbox"; }' but required in type 'AdditionalService'.
Error: features/settings/shipping/data.ts(165,13): error TS2741: Property 'systemId' is missing in type '{ id: BusinessId; label: string; type: "checkbox"; }' but required in type 'AdditionalService'.
Error: features/settings/shipping/data.ts(166,13): error TS2741: Property 'systemId' is missing in type '{ id: BusinessId; label: string; type: "checkbox"; }' but required in type 'AdditionalService'.
Error: features/settings/shipping/data.ts(167,13): error TS2741: Property 'systemId' is missing in type '{ id: BusinessId; label: string; type: "text"; gridSpan: 2; }' but required in type 'AdditionalService'.
Error: features/settings/shipping/integrations/index.ts(110,9): error TS2554: Expected 2-3 arguments, but got 4.
Error: features/settings/shipping/store.ts(22,35): error TS2344: Type 'ShippingPartner' does not satisfy the constraint 'ItemWithSystemId'.
  Types of property 'systemId' are incompatible.
    Type 'string' is not assignable to type 'SystemId'.
      Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/settings/shipping/store.ts(58,55): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/settings/store-info/store-info-page.tsx(18,89): error TS2339: Property 'setDefault' does not exist on type 'CrudState<Branch>'.
Error: features/settings/store-info/store-info-page.tsx(64,26): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/settings/target-groups/page-content.tsx(29,12): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/settings/target-groups/page-content.tsx(35,18): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/settings/target-groups/page-content.tsx(45,16): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/settings/target-groups/store.ts(5,52): error TS2344: Type 'TargetGroup' does not satisfy the constraint 'ItemWithSystemId'.
  Types of property 'systemId' are incompatible.
    Type 'string' is not assignable to type 'SystemId'.
      Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/settings/taxes/columns.tsx(58,23): error TS2339: Property 'inclusionType' does not exist on type 'Tax'.
Error: features/settings/templates/workflow-templates-page.tsx(635,17): error TS2322: Type '[] | readonly [{ readonly value: "pending"; readonly label: "Chờ xử lý"; }, { readonly value: "investigating"; readonly label: "Đang kiểm tra"; }, { readonly value: "resolved"; readonly label: "Đã giải quyết"; }, { ...; }] | readonly [...]' is not assignable to type '{ value: string; label: string; }[]'.
  The type 'readonly [{ readonly value: "pending"; readonly label: "Chờ xử lý"; }, { readonly value: "investigating"; readonly label: "Đang kiểm tra"; }, { readonly value: "resolved"; readonly label: "Đã giải quyết"; }, { ...; }]' is 'readonly' and cannot be assigned to the mutable type '{ value: string; label: string; }[]'.
Error: features/settings/units/store.ts(5,45): error TS2344: Type 'Unit' does not satisfy the constraint 'ItemWithSystemId'.
  Types of property 'systemId' are incompatible.
    Type 'string' is not assignable to type 'SystemId'.
      Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/stock-locations/page.tsx(58,56): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/stock-locations/page.tsx(62,14): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/stock-locations/store.ts(5,54): error TS2344: Type 'StockLocation' does not satisfy the constraint 'ItemWithSystemId'.
  Types of property 'systemId' are incompatible.
    Type 'string' is not assignable to type 'SystemId'.
      Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/suppliers/detail-page.tsx(61,61): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/suppliers/form-page.tsx(24,61): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/suppliers/form-page.tsx(28,14): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/suppliers/page.tsx(108,13): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/suppliers/page.tsx(150,14): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/suppliers/store.ts(7,35): error TS2344: Type 'Supplier' does not satisfy the constraint 'ItemWithSystemId'.
  Types of property 'systemId' are incompatible.
    Type 'string' is not assignable to type 'SystemId'.
      Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/suppliers/store.ts(19,48): error TS2344: Type 'Supplier' does not satisfy the constraint 'ItemWithSystemId'.
  Types of property 'systemId' are incompatible.
    Type 'string' is not assignable to type 'SystemId'.
      Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/suppliers/trash-page.tsx(20,13): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/suppliers/trash-page.tsx(26,14): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/suppliers/trash-page.tsx(69,16): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: features/warranty/components/dialogs/archive/settlement-dialog.tsx(18,8): error TS2307: Cannot find module '../../../components/ui/dialog' or its corresponding type declarations.
Error: features/warranty/components/dialogs/archive/settlement-dialog.tsx(25,8): error TS2307: Cannot find module '../../../components/ui/select' or its corresponding type declarations.
Error: features/warranty/components/dialogs/archive/settlement-dialog.tsx(26,24): error TS2307: Cannot find module '../../../components/ui/button' or its corresponding type declarations.
Error: features/warranty/components/dialogs/archive/settlement-dialog.tsx(27,23): error TS2307: Cannot find module '../../../components/ui/label' or its corresponding type declarations.
Error: features/warranty/components/dialogs/archive/settlement-dialog.tsx(28,26): error TS2307: Cannot find module '../../../components/ui/textarea' or its corresponding type declarations.
Error: features/warranty/components/dialogs/archive/settlement-dialog.tsx(30,31): error TS2307: Cannot find module '../../orders/store' or its corresponding type declarations.
Error: features/warranty/components/dialogs/archive/settlement-dialog.tsx(31,37): error TS2307: Cannot find module '../../../components/ui/virtualized-combobox' or its corresponding type declarations.
Error: features/warranty/components/dialogs/archive/settlement-dialog.tsx(32,37): error TS2307: Cannot find module '../types' or its corresponding type declarations.
Error: features/warranty/components/warranty-processing-card.tsx(14,44): error TS2307: Cannot find module './create-payment-voucher-dialog.tsx' or its corresponding type declarations.
Error: features/warranty/components/warranty-processing-card.tsx(15,44): error TS2307: Cannot find module './create-receipt-voucher-dialog.tsx' or its corresponding type declarations.
Error: features/warranty/types.ts(167,14): error TS2741: Property 'cancelled' is missing in type '{ incomplete: "pending"[]; pending: "processed"[]; processed: "returned"[]; returned: "completed"[]; completed: undefined[]; }' but required in type 'Record<WarrantyStatus, WarrantyStatus[]>'.
Error: features/warranty/warranty-card.tsx(203,15): error TS2367: This comparison appears to be unintentional because the types 'WarrantyStatus' and '"new"' have no overlap.
Error: features/warranty/warranty-card.tsx(211,15): error TS2367: This comparison appears to be unintentional because the types 'WarrantyStatus' and '"new"' have no overlap.
Error: features/warranty/warranty-list-page.tsx(27,39): error TS2307: Cannot find module './warranty-reminder-modal.tsx' or its corresponding type declarations.
Error: features/warranty/warranty-list-page.tsx(87,9): error TS2741: Property 'cancelled' is missing in type '{ incomplete: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>; pending: React.ForwardRefExoticComponent<...>; processed: React.ForwardRefExoticComponent<...>; returned: React.ForwardRefExoticComponent<...>; completed: React.ForwardRefExoticComponent<...>; }' but required in type 'Record<WarrantyStatus, ElementType<any, keyof IntrinsicElements>>'.
Error: features/warranty/warranty-tracking-page.tsx(38,9): error TS2741: Property 'cancelled' is missing in type '{ incomplete: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>; pending: React.ForwardRefExoticComponent<...>; processed: React.ForwardRefExoticComponent<...>; returned: React.ForwardRefExoticComponent<...>; completed: React.ForwardRefExoticComponent<...>; }' but required in type 'Record<WarrantyStatus, any>'.
Error: hooks/use-route-prefetch.ts(37,32): error TS2307: Cannot find module '../features/payroll/page' or its corresponding type declarations.
Error: hooks/use-route-prefetch.ts(38,28): error TS2307: Cannot find module '../features/kpi/page' or its corresponding type declarations.
Error: hooks/use-route-prefetch.ts(39,43): error TS2307: Cannot find module '../features/departments/organization-chart/page' or its corresponding type declarations.
Error: hooks/use-route-prefetch.ts(61,39): error TS2307: Cannot find module '../features/internal-tasks/page' or its corresponding type declarations.
Error: hooks/use-route-prefetch.ts(63,34): error TS2307: Cannot find module '../features/penalties/page' or its corresponding type declarations.
Error: hooks/use-route-prefetch.ts(64,38): error TS2307: Cannot find module '../features/duty-schedule/page' or its corresponding type declarations.
Error: lib/config.ts(10,25): error TS2339: Property 'env' does not exist on type 'ImportMeta'.
Error: lib/config.ts(13,24): error TS2339: Property 'env' does not exist on type 'ImportMeta'.
Error: wiki/store.ts(6,35): error TS2344: Type 'WikiArticle' does not satisfy the constraint 'ItemWithSystemId'.
  Types of property 'systemId' are incompatible.
    Type 'string' is not assignable to type 'SystemId'.
      Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.
Error: Process completed with exit code 2.