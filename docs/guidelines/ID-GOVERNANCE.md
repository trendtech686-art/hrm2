# ID Governance

## Purpose
- Giải thích vì sao mọi entity phải dùng branded types (`SystemId`, `BusinessId`, `SmartPrefix`, ...).
- Ghi lại quy trình thêm entity mới để tránh phá vỡ hệ thống đếm ID và scripts `verify-branded-ids`.

## Core Definitions
- **SystemId**: Chuỗi có prefix cố định do `createSystemId` sinh ra; dùng để tham chiếu entity trong toàn hệ thống (UI, API, seed data).
- **BusinessId**: Mã do nghiệp vụ nhập (ví dụ: mã đơn hàng, mã phiếu thu); vẫn cần tách biệt với `SystemId` để tránh trùng lặp.
- **SmartPrefix**: Cấu hình mapping entity → prefix tại `lib/id-config.ts`; mọi entity mới phải có prefix trước khi tạo data.

## Entity Prefix Reference
> Danh sách bên dưới gom toàn bộ ~60 entity đang có trong `lib/id-config.ts` (đồng bộ `lib/smart-prefix.ts`). Khi thêm entity mới, hãy cập nhật cả registry lẫn bảng này để doc luôn phản ánh đúng trạng thái code.

### HR & Organization
| Entity | Business Prefix | System Prefix | Sample Business ID | Sample System ID | Notes |
|--------|-----------------|---------------|--------------------|------------------|-------|
| Employees | `NV` | `EMP` | `NV000001` | `EMP000001` | Cho tất cả user đăng nhập/nhân sự |
| Departments | `PB` | `DEPT` | `PB000001` | `DEPT000001` | |
| Branches | `CN` | `BRANCH` | `CN000001` | `BRANCH000001` | |
| Job titles | `CV` | `JOB` | `CV000001` | `JOB000001` | |
| Attendance entries | `CC` | `ATTEND` | `CC000001` | `ATTEND000001` | |
| Duty schedule | `PC` | `DUTY` | `PC000001` | `DUTY000001` | Trùng prefix với Payments → không tái sử dụng literal giữa 2 module |
| Payroll batches | `BL` | `PAYROLL` | `BL000001` | `PAYROLL000001` | |
| Payslips | `PL` | `PAYSLIP` | `PL000001` | `PAYSLIP000001` | Sinh tự động từ payroll |
| Payroll audit log | `PAL` | `PAYROLLLOG` | `PAL000001` | `PAYROLLLOG000001` | |
| Payroll templates | `BTP` | `PAYTPL` | `BTP000001` | `PAYTPL000001` | |
| Penalties | `PF` | `PENALTY` | `PF000001` | `PENALTY000001` | |
| Leaves | `PN` | `LEAVE` | `PN000001` | `LEAVE000001` | |
| KPI | `KPI` | `KPI` | `KPI000001` | `KPI000001` | |

### Customers & Partners
| Entity | Business Prefix | System Prefix | Sample Business ID | Sample System ID |
|--------|-----------------|---------------|--------------------|------------------|
| Customers | `KH` | `CUSTOMER` | `KH000001` | `CUSTOMER000001` |
| Suppliers | `NCC` | `SUPPLIER` | `NCC000001` | `SUPPLIER000001` |
| Shipping partners | `DVVC` | `SHIPPING` | `DVVC000001` | `SHIPPING000001` |
| Customer types | `LKH` | `CUSTTYPE` | `LKH000001` | `CUSTTYPE000001` |
| Customer groups | `NHKH` | `CUSTGROUP` | `NHKH000001` | `CUSTGROUP000001` |
| Customer sources | `NKH` | `CUSTSOURCE` | `NKH000001` | `CUSTSOURCE000001` |
| Payment terms | `HTTT` | `PAYTERM` | `HTTT000001` | `PAYTERM000001` |
| Credit ratings | `XHTD` | `CREDIT` | `XHTD000001` | `CREDIT000001` |

### Products & Inventory
| Entity | Business Prefix | System Prefix | Sample Business ID | Sample System ID |
|--------|-----------------|---------------|--------------------|------------------|
| Products | `SP` | `PRODUCT` | `SP000001` | `PRODUCT000001` |
| Units | `DVT` | `UNIT` | `DVT000001` | `UNIT000001` |
| Stock locations | `KHO` | `STOCK` | `KHO000001` | `STOCK000001` |
| Inventory receipts | `NK` | `INVRECEIPT` | `NK000001` | `INVRECEIPT000001` |
| Inventory checks | `PKK` | `INVCHECK` | `PKK000001` | `INVCHECK000001` |
| Stock history | `LS` | `HISTORY` | `LS000001` | `HISTORY000001` |
| Packaging jobs | `DG` | `PACKAGE` | `DG000001` | `PACKAGE000001` |

### Sales & Fulfillment
| Entity | Business Prefix | System Prefix | Sample Business ID | Sample System ID |
|--------|-----------------|---------------|--------------------|------------------|
| Orders | `DH` | `ORDER` | `DH000001` | `ORDER000001` |
| Sales returns | `TH` | `RETURN` | `TH000001` | `RETURN000001` |
| Sales channels | `KENH` | `CHANNEL` | `KENH000001` | `CHANNEL000001` |
| Shipments | `VC` | `SHIPMENT` | `VC000001` | `SHIPMENT000001` |
| Other targets | `MT` | `OTHERTARGET` | `MT000001` | `OTHERTARGET000001` |

### Purchasing
| Entity | Business Prefix | System Prefix | Sample Business ID | Sample System ID |
|--------|-----------------|---------------|--------------------|------------------|
| Purchase orders | `PO` | `PURCHASE` | `PO000001` | `PURCHASE000001` |
| Purchase returns | `TM` | `PRETURN` | `TM000001` | `PRETURN000001` |

### Finance & Accounting
| Entity | Business Prefix | System Prefix | Sample Business ID | Sample System ID | Notes |
|--------|-----------------|---------------|--------------------|------------------|-------|
| Receipts | `PT` | `RECEIPT` | `PT000001` | `RECEIPT000001` | |
| Payments | `PC` | `PAYMENT` | `PC000001` | `PAYMENT000001` | |
| Voucher receipt | `PT` | `RECEIPT` | `PT000001` | `RECEIPT000001` | Alias cho workflow voucher-only |
| Voucher payment | `PC` | `PAYMENT` | `PC000001` | `PAYMENT000001` | Alias tương tự |
| Cashbook | `SCT` | `CASHBOOK` | `SCT000001` | `CASHBOOK000001` | |
| Reconciliation | `DT` | `RECON` | `DT000001` | `RECON000001` | |
| Receipt types | `LT` | `RECTYPE` | `LT000001` | `RECTYPE000001` | |
| Payment types | `LC` | `PAYTYPE` | `LC000001` | `PAYTYPE000001` | |
| Cash accounts | `TK` | `ACCOUNT` | `TK000001` | `ACCOUNT000001` | |
| Payment methods | `PTTT` | `METHOD` | `PTTT000001` | `METHOD000001` | |
| Pricing settings | `GIA` | `PRICING` | `GIA000001` | `PRICING000001` | |

### Service, Workflow & Knowledge
| Entity | Business Prefix | System Prefix | Sample Business ID | Sample System ID |
|--------|-----------------|---------------|--------------------|------------------|
| Warranty tickets | `BH` | `WARRANTY` | `BH000001` | `WARRANTY000001` |
| Complaints | `PKN` | `COMPLAINT` | `PKN000001` | `COMPLAINT000001` |
| Internal tasks | `CVNB` | `TASK` | `CVNB000001` | `TASK000001` |
| Task templates | `TMPL` | `TMPL` | `TMPL000001` | `TMPL000001` |
| Custom fields | `FIELD` | `FIELD` | `FIELD000001` | `FIELD000001` |
| Wiki articles | `TL` | `WIKI` | `TL000001` | `WIKI000001` |

### Settings & Workforce Catalog
| Entity | Business Prefix | System Prefix | Sample Business ID | Sample System ID |
|--------|-----------------|---------------|--------------------|------------------|
| Provinces | `TP` | `PROVINCE` | `TP000001` | `PROVINCE000001` |
| Districts | `QH` | `DISTRICT` | `QH000001` | `DISTRICT000001` |
| Wards | `PX` | `WARD` | `PX000001` | `WARD000001` |
| Target groups | `NHOM` | `TARGET` | `NHOM000001` | `TARGET000001` |
| Work shifts | `CA` | `WSHIFT` | `CA000001` | `WSHIFT000001` |
| Leave types | `LP` | `LEAVETYPE` | `LP000001` | `LEAVETYPE000001` |
| Salary components | `SC` | `SALCOMP` | `SC000001` | `SALCOMP000001` |
| Employee types | `LNV` | `EMPTYPE` | `LNV000001` | `EMPTYPE000001` |
| Employee statuses | `TTNV` | `EMPSTATUS` | `TTNV000001` | `EMPSTATUS000001` |
| Contract types | `LHD` | `CONTRACT` | `LHD000001` | `CONTRACT000001` |
| Audit log entries | `LOG` | `LOG` | `LOG000001` | `LOG000001` |
| Settings bundle | `CFG` | `CONFIG` | `CFG000001` | `CONFIG000001` |
| Users | `USER` | `USER` | `USER000001` | `USER000001` |

### PKGX Integration (phukiengiaxuong.com.vn)
| Entity | Business Prefix | System Prefix | Sample Business ID | Sample System ID | Notes |
|--------|-----------------|---------------|--------------------|------------------|-------|
| PKGX Categories | `PKGXCAT` | `PKGXCAT` | `PKGXCAT000001` | `PKGXCAT000001` | Danh mục sync từ PKGX |
| PKGX Brands | `PKGXBRAND` | `PKGXBRAND` | `PKGXBRAND000001` | `PKGXBRAND000001` | Thương hiệu sync từ PKGX |
| Category Mappings | `CATMAP` | `CATMAP` | `CATMAP000001` | `CATMAP000001` | Mapping HRM Category → PKGX |
| Brand Mappings | `BRANDMAP` | `BRANDMAP` | `BRANDMAP000001` | `BRANDMAP000001` | Mapping HRM Brand → PKGX |
| Price Mappings | `PRICEMAP` | `PRICEMAP` | `PRICEMAP000001` | `PRICEMAP000001` | Mapping bảng giá → PKGX |
| PKGX Sync Logs | `PKGXLOG` | `PKGXLOG` | `PKGXLOG000001` | `PKGXLOG000001` | Log đồng bộ |

> Ghi chú: Một số entity đặc biệt (ví dụ `audit-log`, `settings`) dùng 10 chữ số hoặc prefix dài — vẫn phải tạo ID thông qua helper `createSystemId`/`createBusinessId` thay vì viết tay.

## Adding a New Entity
1. Khai báo entity trong `lib/id-config.ts` và `lib/id-types.ts` (bao gồm prefix, counter, factory helper).
2. Bổ sung kiểu domain (ví dụ `Payment`, `Receipt`) và cập nhật toàn bộ data/mock sử dụng helper `createSystemId` thay vì literal string.
3. Thêm test/fixture vào `scripts/verify-branded-ids.ts` nếu entity có seed JSON hoặc mock file riêng.
4. Cập nhật tài liệu/breadcrumb/menu để UI có thể truy xuất entity bằng `SystemId` mới.

## PR Checklist
- [ ] Đã cập nhật `lib/id-config.ts` + `lib/id-types.ts` với entity mới và prefix hợp lệ.
- [ ] Đã dùng helper (`createSystemId`, `createBusinessId`) ở mọi mock data/store liên quan.
- [ ] Đã chạy `npx tsx scripts/verify-branded-ids.ts --skip-json` và `npx tsc --noEmit` để đảm bảo không còn lỗi branded types.
- [ ] Đã cập nhật tài liệu liên quan (README, docs/*, wiki) mô tả entity/prefix mới.
- [ ] Đã ping QA để xác nhận các màn hình sử dụng entity mới hoạt động đúng trong smoke-test.
