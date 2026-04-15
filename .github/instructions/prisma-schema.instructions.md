---
description: "Use when creating or editing Prisma schema files. Covers multi-schema organization, naming, and relation patterns."
applyTo: "prisma/schema/**/*.prisma"
---
# Prisma Schema Convention

## Organization
```
prisma/schema/
  000-base.prisma     # Generator + datasource + shared enums
  common/             # ActivityLog, TraceLog
  auth/               # User, Role
  hrm/                # Employee, Attendance, Leave, Payroll, Penalty
  sales/              # Order, Customer, Shipment
  inventory/          # Product, Stock, StockCheck
  finance/            # Payment, Cashbook, CostAdjustment
  procurement/        # Supplier, PurchaseOrder
  settings/           # SettingsData
```

## ID System
- `systemId`: UUID primary key (`@id @default(uuid())`)
- `businessId`: Branded prefix (e.g., `ORD-2025-001`) — generated in app code

## Rules
- Model names: PascalCase singular (`Employee`, NOT `Employees`)
- Fields: camelCase (`createdAt`, `isActive`)
- Relations: explicit `@relation` với `onDelete` specified
- Enum: UPPER_SNAKE_CASE values (`ORDER_PENDING`, `LEAVE_APPROVED`)
- `@@map("table_name")` cho snake_case table names
- Timestamps: `createdAt DateTime @default(now())`, `updatedAt DateTime @updatedAt`
- Soft delete: `deletedAt DateTime?` (NOT boolean `isDeleted`)
