# SystemId Prefix Corrections

## Quy tắc:
- **systemIdPrefix**: ENGLISH đầy đủ (VD: EMP, CUSTOMER, ORDER, PRODUCT)
- **prefix (Business ID)**: Vietnamese ngắn (VD: NV, KH, DH, SP)

## Danh sách cần fix:

### ✅ ĐÃ FIX:
1. employees: `EMP` (was NV)
2. departments: `DEPT` (was PB)
3. branches: `BRANCH` (was CN)
4. job-titles: `JOB` (was CV)
5. penalties: `PENALTY` (was PF)
6. leaves: `LEAVE` (was PN)
7. customers: `CUSTOMER` (was KH)
8. products: `PRODUCT` (was SP)
9. orders: `ORDER` (already correct)
10. vouchers: `VOUCHER` (already correct)

### ❌ CẦN FIX:

#### HR & Organization:
- attendance: `ATTEND` (currently: CC)
- payroll: `PAYROLL` (currently: BL)

#### Customers & Partners:
- suppliers: `SUPPLIER` (currently: NCC)
- shipping-partners: `SHIPPING` (currently: DVVC)

#### Inventory:
- units: `UNIT` (currently: DVT)
- stock-locations: `STOCK` (currently: KHO)
- inventory-receipts: `RECEIPT` (currently: NK)
- stock-history: `HISTORY` (currently: LS)

#### Sales:
- sales-returns: `RETURN` (currently: TH)
- sales-channels: `CHANNEL` (currently: KENH)
- shipments: `SHIPMENT` (currently: VC)

#### Purchasing:
- purchase-orders: `PURCHASE` (currently: PO)
- purchase-returns: `PRETURN` (currently: TM)

#### Finance:
- cashbook: `CASHBOOK` (currently: SCT)
- reconciliation: `RECON` (currently: DT)
- receipt-types: `RECTYPE` (currently: LT)
- payment-types: `PAYTYPE` (currently: LC)
- cash-accounts: `ACCOUNT` (currently: TK)
- payment-methods: `METHOD` (currently: PTTT)

#### Service:
- warranty: `WARRANTY` (currently: PBH) - already good
- complaints: `COMPLAINT` (currently: KN)

#### Settings:
- provinces: `PROVINCE` (currently: TP)
- pricing-settings: `PRICING` (currently: GIA)
- customer-types: `CUSTTYPE` (currently: LKH)
- customer-groups: `CUSTGROUP` (currently: NHKH)
- customer-sources: `CUSTSOURCE` (currently: NKH)
- payment-terms: `PAYTERM` (currently: HTTT)
- credit-ratings: `CREDIT` (currently: XHTD)
- employee-types: `EMPTYPE` (currently: LNV)

#### System:
- wiki: `WIKI` (currently: TL)
- packaging: `PACKAGE` (currently: DG)
- audit-log: `LOG` (already correct)
- kpi: `KPI` (already correct)
- target-groups: `TARGET` (currently: NHOM)
- other-targets: `OTHERTARGET` (currently: MT)
- internal-tasks: `TASK` (currently: CVNB)

## Các trường hợp đặc biệt:
- `duty-schedule`: Đã dùng `DUTY` (correct)
- `receipts`, `payments`: Đã dùng `VOUCHER` (correct - cùng loại voucher)
- `warranty-system`: Đã dùng `PBH` (chưa rõ, cần check)
- `complaints-id`: Đã dùng `KN` (giống complaints)
