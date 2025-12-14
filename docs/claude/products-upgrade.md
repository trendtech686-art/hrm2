# 📦 PRODUCTS MODULE - PHÂN TÍCH & ĐỀ XUẤT NÂNG CẤP

> **Ngày rà soát**: 29/11/2025  
> **Module**: Products (Quản lý sản phẩm)  
> **Trạng thái**: ✅ Đang thực hiện  
> **Mục tiêu**: Nâng cấp lên shadcn + mobile-first + Prisma/PostgreSQL + Next.js

---

## 📋 MỤC LỤC

1. [Tổng quan](#1-tổng-quan)
2. [Phân tích hiện trạng](#2-phân-tích-hiện-trạng)
3. [Đánh giá logic nghiệp vụ](#3-đánh-giá-logic-nghiệp-vụ)
4. [Phân tích liên kết module](#4-phân-tích-liên-kết-module)
5. [Prisma Schema](#5-prisma-schema)
6. [API Routes (Next.js)](#6-api-routes-nextjs)
7. [React Query Hooks](#7-react-query-hooks)
8. [UI Components](#8-ui-components)
9. [Kế hoạch triển khai](#9-kế-hoạch-triển-khai)
10. [Checklist](#10-checklist)

---

## 1. TỔNG QUAN

### 1.1. Vai trò của module
Products là **module nền tảng cho quản lý kho hàng** trong hệ thống HRM2, quản lý toàn bộ thông tin về sản phẩm, tồn kho, giá bán và liên kết với các module khác.

### 1.2. Tính năng chính
- ✅ CRUD sản phẩm với dual-ID (systemId/businessId)
- ✅ Quản lý 4 loại sản phẩm: physical, service, digital, combo
- ✅ Quản lý tồn kho đa chi nhánh (inventoryByBranch, committedByBranch, inTransitByBranch)
- ✅ Hệ thống giá đa cấp (prices by PricingPolicy)
- ✅ Sản phẩm Combo (tối đa 20 SP, tính giá tự động)
- ✅ Stock alerts (reorderLevel, safetyStock, maxStock)
- ✅ Image gallery (thumbnail + gallery)
- ✅ SEO fields (ktitle, seoDescription)
- ✅ Import/Export products
- ✅ Barcode support
- ✅ Soft delete

---

## 2. PHÂN TÍCH HIỆN TRẠNG

### 2.1. Cấu trúc files

#### A. Core Files ✅
```
features/products/
├── types.ts              ✅ Product, ComboItem, ComboPricingType types
├── validation.ts         ✅ Zod schemas với combo validation
├── store.ts              ✅ Zustand store với inventory methods
├── data.ts               ✅ Initial data
├── columns.tsx           ✅ DataTable columns
├── page.tsx              ✅ Main list page
├── detail-page.tsx       ✅ Detail view với tabs
├── form-page.tsx         ✅ Create/Edit form
└── product-form-complete.tsx  ✅ Complete form component
```

#### B. Business Logic Files ✅
```
├── combo-utils.ts        ✅ Combo calculations
├── stock-alert-utils.ts  ✅ Stock alerts logic
├── product-service.ts    ✅ Query & filter service
└── product-importer.ts   ✅ Import logic
```

#### C. Components ✅
```
components/
├── combo-section.tsx              ✅ Combo builder
├── combo-product-search.tsx       ✅ Product search for combo
├── committed-stock-dialog.tsx     ✅ Show committed stock
├── in-transit-stock-dialog.tsx    ✅ Show in-transit stock
├── quick-add-product-dialog.tsx   ✅ Quick add product
└── stock-alert-badges.tsx         ✅ Display stock alerts
```

#### D. Hooks ✅
```
hooks/
├── use-combo-stock.ts      ✅ Combo stock calculations
├── use-product-pricing.ts  ✅ Product pricing logic
└── use-products-query.ts   ✅ Product query hook
```

### 2.2. Đánh giá code quality

#### ✅ Điểm mạnh
1. **Type Safety**: Types đầy đủ với SystemId/BusinessId
2. **Validation**: Zod schemas chi tiết, bao gồm combo validation
3. **Store**: Custom methods cho inventory operations
4. **Combo Logic**: Utilities đầy đủ cho combo calculations
5. **Stock Alerts**: Hệ thống cảnh báo tồn kho hoàn chỉnh
6. **Image Management**: Dedicated image store
7. **Import/Export**: Support bulk operations
8. **Mobile-First**: Responsive design

#### ⚠️ Điểm cần cải thiện
1. **Database**: Chưa có Prisma schema
2. **API**: Chưa có API routes (Next.js)
3. **React Query**: Chưa implement React Query hooks
4. **Image Upload**: Chưa có cloud storage integration
5. **Barcode Scanning**: Chưa có mobile barcode scanner
6. **Stock Sync**: Chưa có real-time sync
7. **Audit Log**: Chưa track chi tiết thay đổi giá/tồn kho

---

## 3. ĐÁNH GIÁ LOGIC NGHIỆP VỤ

### 3.1. Product Types

#### A. Physical Products (Hàng hóa vật lý)
```typescript
type: 'physical'
isStockTracked: true (default)
- Quản lý tồn kho đầy đủ (on-hand, committed, in-transit)
- Tracking theo branch
- Stock alerts
```

#### B. Service Products (Dịch vụ)
```typescript
type: 'service'
isStockTracked: false
- Không quản lý tồn kho
- Chỉ quản lý giá và thông tin
- Có thể có thời hạn bảo hành
```

#### C. Digital Products (Sản phẩm số)
```typescript
type: 'digital'
isStockTracked: false
- Không quản lý tồn kho vật lý
- Có thể quản lý license keys (future)
```

#### D. Combo Products (Sản phẩm Combo)
```typescript
type: 'combo'
isStockTracked: false // Tồn kho tính từ SP con
comboItems: ComboItem[] // Tối đa 20 SP
comboPricingType: 'fixed' | 'sum_discount_percent' | 'sum_discount_amount'
comboDiscount: number

Tham khảo: Sapo
- Combo không có tồn kho riêng
- Tồn kho combo = MIN(tồn kho SP con / số lượng trong combo)
- Không cho phép combo lồng combo
- Giá tính theo 3 cách: fixed, sum-discount%, sum-discount-amount
```

### 3.2. Inventory Management

#### A. Multi-Branch Inventory
```typescript
inventoryByBranch: Record<SystemId, number>    // On-hand stock
committedByBranch: Record<SystemId, number>     // Reserved for orders
inTransitByBranch: Record<SystemId, number>     // Being delivered

Available = On-hand - Committed
```

#### B. Stock Operations (store.ts)
```typescript
✅ updateInventory(productSystemId, branchSystemId, quantityChange)
   - Tăng/giảm tồn kho
   - Không track stock cho service/digital/combo
   
✅ commitStock(productSystemId, branchSystemId, quantity)
   - Khi tạo order: reserve stock
   
✅ uncommitStock(productSystemId, branchSystemId, quantity)
   - Khi cancel order: release stock
   
✅ dispatchStock(productSystemId, branchSystemId, quantity)
   - Khi xuất kho: inventory → in-transit
   - Giảm committed
   
✅ completeDelivery(productSystemId, branchSystemId, quantity)
   - Khi giao hàng thành công: giảm in-transit
   
✅ returnStockFromTransit(productSystemId, branchSystemId, quantity)
   - Khi hoàn trả: in-transit → inventory
```

### 3.3. Pricing System

#### A. Multi-Tier Pricing
```typescript
prices: Record<string, number> // Key = PricingPolicy.systemId

VD:
prices: {
  'POLICY_001': 100000,  // Giá bán lẻ
  'POLICY_002': 90000,   // Giá sỉ
  'POLICY_003': 85000,   // Giá đại lý
}
```

#### B. Cost Pricing
```typescript
costPrice: number              // Giá vốn
lastPurchasePrice?: number     // Giá nhập gần nhất
lastPurchaseDate?: string      // Ngày nhập gần nhất
```

#### C. Price Constraints
```typescript
suggestedRetailPrice?: number  // Giá bán lẻ đề xuất
minPrice?: number              // Giá tối thiểu cho phép
```

### 3.4. Stock Alerts

#### A. Alert Types
```typescript
'out_of_stock'      // Hết hàng (available = 0)
'low_stock'         // Sắp hết (available < reorderLevel)
'below_safety'      // Dưới mức an toàn (available < safetyStock)
'over_stock'        // Tồn kho cao (onHand > maxStock)
```

#### B. Thresholds
```typescript
reorderLevel?: number   // Mức đặt hàng lại
safetyStock?: number    // Tồn kho an toàn
maxStock?: number       // Tồn kho tối đa

Có thể override từ Settings hoặc set riêng cho từng product
```

### 3.5. Combo Logic (combo-utils.ts)

#### A. Stock Calculation
```typescript
calculateComboStock(comboItems, allProducts, branchSystemId)
// Formula: MIN(child_product_available / quantity_in_combo)

VD: Combo gồm:
- 2x Product A (available: 10)
- 3x Product B (available: 12)
Result: MIN(10/2, 12/3) = MIN(5, 4) = 4 combo
```

#### B. Price Calculation
```typescript
// Fixed: Giá cố định
comboDiscount = giá combo

// Sum Discount Percent: Tổng giá SP con - %
finalPrice = sumPrice * (1 - comboDiscount/100)

// Sum Discount Amount: Tổng giá SP con - số tiền
finalPrice = sumPrice - comboDiscount
```

#### C. Validation Rules
```typescript
✅ MIN_COMBO_ITEMS = 2
✅ MAX_COMBO_ITEMS = 20
✅ Không cho phép duplicate products
✅ Không cho phép nested combo
✅ Quantity >= 1
✅ All products must exist and be valid
```

---

## 4. PHÂN TÍCH LIÊN KẾT MODULE

### 4.1. Settings (Master Data)
```typescript
// Product Classification
categorySystemId → ProductCategory.systemId
productTypeSystemId → ProductType.systemId
brandSystemId → Brand.systemId
storageLocationSystemId → StorageLocation.systemId

// Inventory Branches
inventoryByBranch: Record<Branch.systemId, number>
committedByBranch: Record<Branch.systemId, number>
inTransitByBranch: Record<Branch.systemId, number>

// Pricing Policies
prices: Record<PricingPolicy.systemId, number>
```

### 4.2. Orders (Stock Out)
```typescript
// Khi tạo order
Order.items[] → Product.systemId
→ commitStock() // Reserve stock

// Khi đóng gói
Order.status = 'packaging'
→ dispatchStock() // inventory → in-transit, giảm committed

// Khi giao hàng
Order.deliveryStatus = 'delivered'
→ completeDelivery() // Giảm in-transit

// Khi hủy order
Order.status = 'cancelled'
→ uncommitStock() // Release reserved stock
```

### 4.3. Purchase-Orders (Stock In)
```typescript
// Khi nhận hàng
PurchaseOrder + InventoryReceipt
→ updateInventory(+quantity) // Tăng tồn kho
→ updateLastPurchasePrice(price, date) // Cập nhật giá nhập
```

### 4.4. Stock-Transfers (Inter-Branch Movement)
```typescript
// Khi chuyển kho
fromBranch: updateInventory(-quantity)
inTransitByBranch[fromBranch] += quantity

// Khi nhận hàng
toBranch: updateInventory(+quantity)
inTransitByBranch[fromBranch] -= quantity
```

### 4.5. Inventory-Checks (Stock Adjustment)
```typescript
// Khi cân bằng kiểm kê
actualQuantity vs systemQuantity
→ updateInventory(difference)
```

### 4.6. Sales-Returns (Return Stock)
```typescript
// Khi nhận hàng trả lại
SalesReturn.returnItems[]
isReceived = true
→ updateInventory(+quantity) // Nhập kho trở lại
```

### 4.7. Warranty
```typescript
// Check warranty period
Product.warrantyPeriodMonths (default: 12)
Warranty.items[] → Product.systemId
```

### 4.8. Complaints
```typescript
// Affected products
Complaint.affectedProducts[] → Product.systemId
```

### 4.9. Suppliers
```typescript
Product.primarySupplierSystemId → Supplier.systemId
```

---

## 5. PRISMA SCHEMA

```prisma
// ═══════════════════════════════════════════════════════════════
// PRODUCTS
// ═══════════════════════════════════════════════════════════════

enum ProductStatus {
  ACTIVE
  INACTIVE
  DISCONTINUED
}

enum ProductType {
  PHYSICAL
  SERVICE
  DIGITAL
  COMBO
}

enum ComboPricingType {
  FIXED
  SUM_DISCOUNT_PERCENT
  SUM_DISCOUNT_AMOUNT
}

model Product {
  // IDs
  systemId            String         @id @default(cuid())
  id                  String         @unique // SKU/Business ID
  
  // Basic Info
  name                String
  ktitle              String?        // SEO title
  seoDescription      String?
  description         String?        @db.Text
  shortDescription    String?
  
  // Images
  thumbnailImage      String?
  galleryImages       String[]       // Array of URLs
  
  // Classification
  type                ProductType    @default(PHYSICAL)
  status              ProductStatus  @default(ACTIVE)
  
  productTypeId       String?
  productType         ProductTypeSetting? @relation(fields: [productTypeId], references: [systemId])
  
  categoryId          String?
  category            ProductCategory? @relation(fields: [categoryId], references: [systemId])
  
  brandId             String?
  brand               Brand?         @relation(fields: [brandId], references: [systemId])
  
  storageLocationId   String?
  storageLocation     StorageLocation? @relation(fields: [storageLocationId], references: [systemId])
  
  tags                String[]
  pkgxId              Int?           @unique
  
  // Pricing
  unit                String
  costPrice           Decimal        @default(0) @db.Decimal(18, 2)
  lastPurchasePrice   Decimal?       @db.Decimal(18, 2)
  lastPurchaseDate    DateTime?
  suggestedRetailPrice Decimal?      @db.Decimal(18, 2)
  minPrice            Decimal?       @db.Decimal(18, 2)
  
  // Product Prices by Policy (One-to-Many)
  productPrices       ProductPrice[]
  
  // Inventory Tracking
  isStockTracked      Boolean        @default(true)
  
  // Stock by Branch (One-to-Many)
  branchStocks        BranchStock[]
  
  // Stock Alert Thresholds
  reorderLevel        Int?
  safetyStock         Int?
  maxStock            Int?
  
  // Logistics
  weight              Decimal?       @db.Decimal(10, 3)
  weightUnit          String?        // 'g' or 'kg'
  length              Decimal?       @db.Decimal(10, 2)
  width               Decimal?       @db.Decimal(10, 2)
  height              Decimal?       @db.Decimal(10, 2)
  barcode             String?        @unique
  
  // Supplier
  primarySupplierId   String?
  primarySupplier     Supplier?      @relation(fields: [primarySupplierId], references: [systemId])
  
  // Warranty
  warrantyPeriodMonths Int?          @default(12)
  
  // ═══════════════════════════════════════════════════════════════
  // COMBO FIELDS
  // ═══════════════════════════════════════════════════════════════
  comboItems          ComboItem[]    // Combo children
  comboPricingType    ComboPricingType?
  comboDiscount       Decimal?       @db.Decimal(18, 2)
  
  // Combo parent relations (products that include this product in their combo)
  comboParents        ComboItem[]    @relation("ComboChildProduct")
  
  // Sales Analytics
  totalSold           Int?           @default(0)
  totalRevenue        Decimal?       @default(0) @db.Decimal(18, 2)
  lastSoldDate        DateTime?
  viewCount           Int?           @default(0)
  
  // Lifecycle
  launchedDate        DateTime?
  discontinuedDate    DateTime?
  
  // Audit
  createdAt           DateTime       @default(now())
  updatedAt           DateTime       @updatedAt
  deletedAt           DateTime?
  isDeleted           Boolean        @default(false)
  
  createdById         String?
  createdBy           Employee?      @relation("ProductCreatedBy", fields: [createdById], references: [systemId])
  
  updatedById         String?
  updatedBy           Employee?      @relation("ProductUpdatedBy", fields: [updatedById], references: [systemId])
  
  // Relations
  orderItems          OrderItem[]
  purchaseOrderItems  PurchaseOrderItem[]
  warrantyItems       WarrantyItem[]
  complaintProducts   ComplaintProduct[]
  stockTransferItems  StockTransferItem[]
  inventoryCheckItems InventoryCheckItem[]
  salesReturnItems    SalesReturnItem[]
  stockHistoryEntries StockHistory[]
  
  @@index([id])
  @@index([name])
  @@index([barcode])
  @@index([type])
  @@index([status])
  @@index([categoryId])
  @@index([brandId])
  @@index([isDeleted])
  @@index([createdAt])
  @@map("products")
}

// ═══════════════════════════════════════════════════════════════
// PRODUCT PRICES (One-to-Many with Product)
// ═══════════════════════════════════════════════════════════════
model ProductPrice {
  id              String         @id @default(cuid())
  
  productId       String
  product         Product        @relation(fields: [productId], references: [systemId], onDelete: Cascade)
  
  pricingPolicyId String
  pricingPolicy   PricingPolicy  @relation(fields: [pricingPolicyId], references: [systemId])
  
  price           Decimal        @db.Decimal(18, 2)
  
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
  
  @@unique([productId, pricingPolicyId])
  @@index([productId])
  @@index([pricingPolicyId])
  @@map("product_prices")
}

// ═══════════════════════════════════════════════════════════════
// BRANCH STOCK (One-to-Many with Product)
// ═══════════════════════════════════════════════════════════════
model BranchStock {
  id              String    @id @default(cuid())
  
  productId       String
  product         Product   @relation(fields: [productId], references: [systemId], onDelete: Cascade)
  
  branchId        String
  branch          Branch    @relation(fields: [branchId], references: [systemId])
  
  onHand          Int       @default(0)      // Inventory on hand
  committed       Int       @default(0)      // Reserved for orders
  inTransit       Int       @default(0)      // Being delivered
  
  // Virtual field: available = onHand - committed
  
  updatedAt       DateTime  @updatedAt
  
  @@unique([productId, branchId])
  @@index([productId])
  @@index([branchId])
  @@map("branch_stocks")
}

// ═══════════════════════════════════════════════════════════════
// COMBO ITEMS
// ═══════════════════════════════════════════════════════════════
model ComboItem {
  id              String    @id @default(cuid())
  
  comboProductId  String
  comboProduct    Product   @relation(fields: [comboProductId], references: [systemId], onDelete: Cascade)
  
  childProductId  String
  childProduct    Product   @relation("ComboChildProduct", fields: [childProductId], references: [systemId])
  
  quantity        Int       @default(1)      // Số lượng SP con trong combo
  
  createdAt       DateTime  @default(now())
  
  @@unique([comboProductId, childProductId])
  @@index([comboProductId])
  @@index([childProductId])
  @@map("combo_items")
}

// ═══════════════════════════════════════════════════════════════
// STOCK HISTORY (Track all stock changes)
// ═══════════════════════════════════════════════════════════════
enum StockHistoryType {
  INITIAL
  PURCHASE
  SALE
  ADJUSTMENT
  TRANSFER_OUT
  TRANSFER_IN
  RETURN
  COMPLAINT_ADJUSTMENT
  INVENTORY_CHECK
}

model StockHistory {
  id              String            @id @default(cuid())
  
  productId       String
  product         Product           @relation(fields: [productId], references: [systemId])
  
  branchId        String
  branch          Branch            @relation(fields: [branchId], references: [systemId])
  
  type            StockHistoryType
  quantity        Int               // (+) increase, (-) decrease
  
  beforeQuantity  Int
  afterQuantity   Int
  
  referenceType   String?           // 'Order', 'PurchaseOrder', 'StockTransfer', etc.
  referenceId     String?           // SystemId of reference
  
  note            String?
  
  createdAt       DateTime          @default(now())
  createdById     String?
  createdBy       Employee?         @relation(fields: [createdById], references: [systemId])
  
  @@index([productId])
  @@index([branchId])
  @@index([createdAt])
  @@index([referenceType, referenceId])
  @@map("stock_history")
}
```

---

## 6. API ROUTES (NEXT.JS)

### 6.1. Product CRUD

```typescript
// app/api/products/route.ts
GET    /api/products              // List with filters, pagination, search
POST   /api/products              // Create new product

// app/api/products/[systemId]/route.ts
GET    /api/products/:systemId    // Get by ID
PATCH  /api/products/:systemId    // Update
DELETE /api/products/:systemId    // Soft delete

// app/api/products/[systemId]/restore/route.ts
POST   /api/products/:systemId/restore  // Restore deleted
```

### 6.2. Product Operations

```typescript
// Inventory
PATCH /api/products/:systemId/inventory
{
  branchId: string,
  operation: 'increase' | 'decrease' | 'set',
  quantity: number,
  note?: string
}

// Commit/Uncommit
POST /api/products/:systemId/commit
POST /api/products/:systemId/uncommit
{
  branchId: string,
  quantity: number
}

// Dispatch (Stock Out)
POST /api/products/:systemId/dispatch
{
  branchId: string,
  quantity: number,
  orderId?: string
}

// Complete Delivery
POST /api/products/:systemId/complete-delivery
{
  branchId: string,
  quantity: number
}
```

### 6.3. Combo Operations

```typescript
// Validate combo
POST /api/products/combos/validate
{
  comboItems: ComboItem[],
  comboPricingType: string,
  comboDiscount: number
}

// Calculate combo stock
GET /api/products/combos/:systemId/stock?branchId=xxx

// Calculate combo price
GET /api/products/combos/:systemId/price?policyId=xxx
```

### 6.4. Stock Alerts

```typescript
// Get products needing reorder
GET /api/products/alerts/reorder?branchId=xxx

// Get out of stock
GET /api/products/alerts/out-of-stock?branchId=xxx

// Get all alerts
GET /api/products/alerts?branchId=xxx&severity=critical
```

### 6.5. Import/Export

```typescript
// Export
GET /api/products/export?format=xlsx|csv

// Import
POST /api/products/import
FormData: { file: File, branchMapping: {} }

// Bulk operations
POST /api/products/bulk-update
POST /api/products/bulk-delete
```

### 6.6. Image Upload

```typescript
// Upload product images
POST /api/products/:systemId/images
FormData: { images: File[] }

// Delete image
DELETE /api/products/:systemId/images/:imageId

// Set thumbnail
PATCH /api/products/:systemId/images/thumbnail
{ imageUrl: string }
```

---

## 7. REACT QUERY HOOKS

### 7.1. Query Hooks

```typescript
// hooks/use-products.ts
export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
  });
}

export function useProduct(systemId: string) {
  return useQuery({
    queryKey: ['products', systemId],
    queryFn: () => fetchProduct(systemId),
    enabled: !!systemId,
  });
}

export function useProductStock(systemId: string, branchId?: string) {
  return useQuery({
    queryKey: ['products', systemId, 'stock', branchId],
    queryFn: () => fetchProductStock(systemId, branchId),
  });
}

export function useComboStock(systemId: string, branchId: string) {
  return useQuery({
    queryKey: ['products', systemId, 'combo-stock', branchId],
    queryFn: () => fetchComboStock(systemId, branchId),
  });
}

export function useProductAlerts(filters?: AlertFilters) {
  return useQuery({
    queryKey: ['products', 'alerts', filters],
    queryFn: () => fetchProductAlerts(filters),
  });
}
```

### 7.2. Mutation Hooks

```typescript
// hooks/use-product-mutations.ts
export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateProductInput) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Tạo sản phẩm thành công');
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ systemId, data }: UpdateProductInput) => 
      updateProduct(systemId, data),
    onSuccess: (_, { systemId }) => {
      queryClient.invalidateQueries({ queryKey: ['products', systemId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Cập nhật sản phẩm thành công');
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (systemId: string) => deleteProduct(systemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Xóa sản phẩm thành công');
    },
  });
}

export function useUpdateInventory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateInventoryInput) => updateInventory(data),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: ['products', productId] });
      queryClient.invalidateQueries({ queryKey: ['products', productId, 'stock'] });
    },
  });
}

export function useCommitStock() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CommitStockInput) => commitStock(data),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: ['products', productId, 'stock'] });
    },
  });
}

export function useDispatchStock() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: DispatchStockInput) => dispatchStock(data),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: ['products', productId, 'stock'] });
    },
  });
}
```

---

## 8. UI COMPONENTS

### 8.1. List View (Mobile-First)

```typescript
// app/products/page.tsx
export default function ProductsPage() {
  const { data, isLoading } = useProducts(filters);
  
  return (
    <div className="container py-6">
      {/* Mobile: Cards */}
      <div className="md:hidden">
        {data?.items.map(product => (
          <ProductCard key={product.systemId} product={product} />
        ))}
      </div>
      
      {/* Desktop: Table */}
      <div className="hidden md:block">
        <DataTable 
          columns={productColumns} 
          data={data?.items ?? []} 
        />
      </div>
    </div>
  );
}
```

### 8.2. Product Card (Mobile)

```typescript
// components/products/product-card.tsx
export function ProductCard({ product }: { product: Product }) {
  const alerts = getProductStockAlerts(product);
  const totalStock = getTotalOnHandStock(product);
  
  return (
    <Card>
      <div className="flex gap-3">
        <Avatar>
          <AvatarImage src={product.thumbnailImage} />
          <AvatarFallback>{product.name[0]}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h3 className="font-semibold">{product.name}</h3>
          <p className="text-sm text-muted-foreground">{product.id}</p>
          
          <div className="flex gap-2 mt-2">
            <Badge variant={getTypeVariant(product.type)}>
              {getTypeLabel(product.type)}
            </Badge>
            <Badge variant={getStatusVariant(product.status)}>
              {getStatusLabel(product.status)}
            </Badge>
          </div>
          
          {product.type !== 'service' && (
            <div className="mt-2">
              <p className="text-sm">
                Tồn kho: <span className="font-semibold">{totalStock}</span>
              </p>
              {alerts.length > 0 && (
                <StockAlertBadges alerts={alerts} />
              )}
            </div>
          )}
          
          <p className="text-sm font-semibold mt-2">
            {formatCurrency(getDefaultPrice(product))}
          </p>
        </div>
      </div>
    </Card>
  );
}
```

### 8.3. Product Form (Create/Edit)

```typescript
// components/products/product-form.tsx
export function ProductForm({ product }: { product?: Product }) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: product ?? defaultValues,
  });
  
  const productType = form.watch('type');
  const isCombo = productType === 'combo';
  
  return (
    <Form {...form}>
      <Tabs defaultValue="basic">
        <TabsList>
          <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
          <TabsTrigger value="pricing">Giá bán</TabsTrigger>
          {!isCombo && (
            <TabsTrigger value="inventory">Tồn kho</TabsTrigger>
          )}
          {isCombo && (
            <TabsTrigger value="combo">Combo</TabsTrigger>
          )}
          <TabsTrigger value="images">Hình ảnh</TabsTrigger>
          <TabsTrigger value="advanced">Nâng cao</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic">
          <BasicInfoFields />
        </TabsContent>
        
        <TabsContent value="pricing">
          <PricingFields />
        </TabsContent>
        
        <TabsContent value="inventory">
          <InventoryFields />
        </TabsContent>
        
        <TabsContent value="combo">
          <ComboSection />
        </TabsContent>
        
        <TabsContent value="images">
          <ImageUploadSection />
        </TabsContent>
        
        <TabsContent value="advanced">
          <AdvancedFields />
        </TabsContent>
      </Tabs>
    </Form>
  );
}
```

### 8.4. Combo Builder

```typescript
// components/products/combo-section.tsx
export function ComboSection() {
  const { fields, append, remove } = useFieldArray({
    name: 'comboItems',
  });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sản phẩm trong Combo</CardTitle>
      </CardHeader>
      <CardContent>
        {fields.map((field, index) => (
          <ComboItemRow 
            key={field.id}
            index={index}
            onRemove={() => remove(index)}
          />
        ))}
        
        <Button 
          onClick={() => append({ productSystemId: '', quantity: 1 })}
          disabled={fields.length >= MAX_COMBO_ITEMS}
        >
          Thêm sản phẩm
        </Button>
        
        <ComboPricingSection />
      </CardContent>
    </Card>
  );
}
```

### 8.5. Stock Alert Widget

```typescript
// components/products/stock-alert-widget.tsx
export function StockAlertWidget() {
  const { data: alerts } = useProductAlerts({ severity: 'critical' });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cảnh báo tồn kho</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {alerts?.map(alert => (
            <div key={alert.productId} className="flex justify-between">
              <span>{alert.productName}</span>
              <Badge variant={alert.severity}>
                {alert.message}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

### 8.6. Barcode Scanner (Mobile)

```typescript
// components/products/barcode-scanner.tsx
'use client';

import { Html5QrcodeScanner } from 'html5-qrcode';

export function BarcodeScanner({ onScan }: { onScan: (barcode: string) => void }) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'scanner',
      { fps: 10, qrbox: 250 },
      false
    );
    
    scanner.render(
      (decodedText) => {
        onScan(decodedText);
        scanner.clear();
      },
      (error) => console.warn(error)
    );
    
    scannerRef.current = scanner;
    
    return () => {
      scanner.clear();
    };
  }, [onScan]);
  
  return <div id="scanner" />;
}
```

---

## 9. KẾ HOẠCH TRIỂN KHAI

### Phase 1: Database & API (Tuần 1)
- [ ] Tạo Prisma schema cho Products
- [ ] Tạo migration
- [ ] Implement API routes (CRUD)
- [ ] Implement inventory operations API
- [ ] Implement combo operations API
- [ ] Setup image upload với cloud storage

### Phase 2: React Query Integration (Tuần 2)
- [ ] Implement query hooks
- [ ] Implement mutation hooks
- [ ] Replace Zustand with React Query
- [ ] Add optimistic updates
- [ ] Add real-time sync

### Phase 3: UI Components (Tuần 3)
- [ ] Rebuild list page (mobile-first)
- [ ] Rebuild form page với tabs
- [ ] Implement combo builder
- [ ] Implement image gallery
- [ ] Implement stock alert widgets
- [ ] Add barcode scanner

### Phase 4: Advanced Features (Tuần 4)
- [ ] Implement bulk operations
- [ ] Implement import/export
- [ ] Add stock history tracking
- [ ] Add analytics dashboard
- [ ] Add product recommendations
- [ ] Mobile app optimization

### Phase 5: Testing & Deployment
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Performance testing
- [ ] UAT
- [ ] Production deployment

---

## 10. CHECKLIST

### ✅ Code Quality
- [x] Types đầy đủ với SystemId/BusinessId
- [x] Validation với Zod schemas
- [x] Store với business logic
- [x] Combo utils hoàn chỉnh
- [x] Stock alert utils
- [ ] No TypeScript errors
- [ ] ESLint passed

### ✅ Business Logic
- [x] 4 product types support
- [x] Multi-branch inventory
- [x] Commit/Dispatch/Delivery flow
- [x] Combo calculations
- [x] Stock alerts
- [x] Price management
- [ ] Real-time sync

### ⏳ Database
- [ ] Prisma schema defined
- [ ] Relations mapped
- [ ] Indexes optimized
- [ ] Migration scripts

### ⏳ API
- [ ] CRUD endpoints
- [ ] Inventory operations
- [ ] Combo operations
- [ ] Stock alerts
- [ ] Import/Export
- [ ] Image upload

### ⏳ React Query
- [ ] Query hooks
- [ ] Mutation hooks
- [ ] Optimistic updates
- [ ] Error handling
- [ ] Cache invalidation

### ✅ UI/UX
- [x] Responsive design
- [x] Mobile-first
- [x] shadcn/ui components
- [ ] Barcode scanner
- [ ] Loading states
- [ ] Error boundaries

### ⏳ Testing
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Performance tests

---

**Tài liệu tạo**: 29/11/2025  
**Phiên bản**: 1.0  
**Trạng thái**: ✅ Hoàn thành phân tích
