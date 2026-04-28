import { MeiliSearch, Index } from 'meilisearch'

// ===========================================
// Meilisearch Client Configuration
// ===========================================

const MEILISEARCH_HOST = process.env.MEILISEARCH_HOST || 'http://localhost:7700'
const MEILISEARCH_API_KEY = process.env.MEILISEARCH_API_KEY || 'devMasterKey123456'

// Singleton client
let meiliClient: MeiliSearch | null = null

export function getMeiliClient(): MeiliSearch {
  if (!meiliClient) {
    meiliClient = new MeiliSearch({
      host: MEILISEARCH_HOST,
      apiKey: MEILISEARCH_API_KEY,
    })
  }
  return meiliClient
}

// ===========================================
// Index Names
// ===========================================
export const INDEXES = {
  PRODUCTS: 'products',
  CUSTOMERS: 'customers',
  ORDERS: 'orders',
  EMPLOYEES: 'employees',
  PKGX_PRODUCTS: 'pkgx_products',
  SUPPLIERS: 'suppliers',
  SHIPMENTS: 'shipments',
  WARRANTIES: 'warranties',
} as const

// ===========================================
// Index Types
// ===========================================
export interface MeiliProduct {
  id: string // systemId as primary key
  productId: string // Original product ID/SKU
  name: string
  /** Tên VAT / hóa đơn — đưa vào Meili để query kiểu "wtp 009 sam" */
  nameVat: string | null
  barcode: string | null
  brandId: string | null
  brandName: string | null
  categoryId: string | null
  categoryName: string | null
  costPrice: number
  lastPurchasePrice: number // Giá nhập cuối cùng
  price: number // Default selling price
  prices: Record<string, number> // All prices by pricingPolicyId
  unit: string // Unit of measure
  status: string
  thumbnailImage: string | null
  pkgxId: number | null
  totalStock: number // Total stock across all branches
  branchStocks: { branchId: string; branchName: string; onHand: number }[] // Stock per branch
  createdAt: number // Unix timestamp for sorting
  updatedAt: number
}

export interface MeiliCustomer {
  id: string // systemId
  customerId: string
  name: string
  phone: string | null
  email: string | null
  address: string | null
  ward: string | null
  district: string | null
  city: string | null
  totalOrders: number
  totalSpent: number
  createdAt: number
}

export interface MeiliOrder {
  id: string // systemId
  orderId: string // Display order ID
  customerName: string | null
  customerPhone: string | null
  status: string
  totalAmount: number
  branchId: string | null
  branchName: string | null
  createdAt: number
  updatedAt: number
}

export interface MeiliEmployee {
  id: string
  employeeId: string
  fullName: string
  email: string | null
  phone: string | null
  department: string | null
  position: string | null
  status: string
  createdAt: number
}

export interface MeiliPkgxProduct {
  id: number // goods_id from PKGX
  goodsSn: string | null
  goodsNumber: string | null
  name: string
  catId: number | null
  catName: string | null
  brandId: number | null
  brandName: string | null
  shopPrice: number
  hrmProductId: string | null // mapped HRM product systemId
  syncedAt: number
}

export interface MeiliSupplier {
  id: string // systemId
  supplierId: string // Display supplier ID
  name: string
  phone: string | null
  email: string | null
  address: string | null
  taxCode: string | null
  contactPerson: string | null
  totalOrders: number
  totalPurchased: number
  totalDebt: number
  isActive: boolean
  status: string
  bankName: string | null
  bankAccount: string | null
  createdAt: number
}

export interface MeiliShipment {
  id: string // systemId
  trackingCode: string | null
  trackingNumber: string | null
  carrier: string
  status: string
  service: string | null
  orderId: string | null
  orderBusinessId: string | null
  recipientName: string | null
  recipientPhone: string | null
  recipientAddress: string | null
  shippingFee: number
  weight: number | null
  createdAt: number
  pickedAt: number | null
  deliveredAt: number | null
  returnedAt: number | null
  printStatus: string
  deliveryStatus: string | null
}

export interface MeiliWarranty {
  id: string // systemId
  warrantyId: string // Display warranty ID (e.g., WRT-001)
  warrantyCode: string // Alternative code
  title: string
  customerName: string
  customerPhone: string
  customerEmail: string | null
  customerAddress: string | null
  productName: string
  serialNumber: string | null
  status: string
  priority: string
  branchName: string | null
  assigneeName: string | null
  orderId: string | null
  isUnderWarranty: boolean
  totalCost: number
  createdAt: number
  receivedAt: number
  completedAt: number | null
}

// ===========================================
// Index Configuration
// ===========================================
export async function configureIndexes() {
  const client = getMeiliClient()

  // Products index
  const productsIndex = client.index(INDEXES.PRODUCTS)
  await productsIndex.updateSettings({
    searchableAttributes: [
      'name',
      'nameVat',
      'productId',
      'barcode',
      'brandName',
      'categoryName',
    ],
    filterableAttributes: [
      'brandId',
      'categoryId',
      'status',
      'costPrice',
      'createdAt',
    ],
    sortableAttributes: [
      'name',
      'costPrice',
      'createdAt',
      'updatedAt',
    ],
    // Typo tolerance settings
    typoTolerance: {
      enabled: true,
      minWordSizeForTypos: {
        oneTypo: 2,
        twoTypos: 6,
      },
    },
    // Ranking rules
    rankingRules: [
      'words',
      'typo',
      'proximity',
      'attribute',
      'sort',
      'exactness',
    ],
    // Pagination
    pagination: {
      maxTotalHits: 10000,
    },
  })

  // Customers index
  const customersIndex = client.index(INDEXES.CUSTOMERS)
  await customersIndex.updateSettings({
    searchableAttributes: [
      'name',
      'phone',
      'email',
      'customerId',
      'address',
    ],
    filterableAttributes: [
      'city',
      'district',
      'totalOrders',
      'createdAt',
    ],
    sortableAttributes: [
      'name',
      'totalOrders',
      'totalSpent',
      'createdAt',
    ],
    typoTolerance: {
      enabled: true,
      minWordSizeForTypos: {
        oneTypo: 3,
        twoTypos: 6,
      },
    },
  })

  // Orders index
  const ordersIndex = client.index(INDEXES.ORDERS)
  await ordersIndex.updateSettings({
    searchableAttributes: [
      'orderId',
      'customerName',
      'customerPhone',
    ],
    filterableAttributes: [
      'status',
      'branchId',
      'totalAmount',
      'createdAt',
    ],
    sortableAttributes: [
      'createdAt',
      'updatedAt',
      'totalAmount',
    ],
    typoTolerance: {
      enabled: true,
    },
  })

  // Employees index
  const employeesIndex = client.index(INDEXES.EMPLOYEES)
  await employeesIndex.updateSettings({
    searchableAttributes: [
      'fullName',
      'employeeId',
      'email',
      'phone',
    ],
    filterableAttributes: [
      'department',
      'position',
      'status',
    ],
    sortableAttributes: [
      'fullName',
      'createdAt',
    ],
    typoTolerance: {
      enabled: true,
    },
  })

  // PKGX Products index
  const pkgxProductsIndex = client.index(INDEXES.PKGX_PRODUCTS)
  await pkgxProductsIndex.updateSettings({
    searchableAttributes: [
      'name',
      'goodsSn',
      'goodsNumber',
      'brandName',
      'catName',
    ],
    filterableAttributes: [
      'catId',
      'brandId',
      'hrmProductId',
    ],
    sortableAttributes: [
      'name',
      'syncedAt',
    ],
    typoTolerance: {
      enabled: true,
      minWordSizeForTypos: {
        oneTypo: 3,
        twoTypos: 6,
      },
    },
    pagination: {
      maxTotalHits: 10000,
    },
  })

  // Suppliers index
  const suppliersIndex = client.index(INDEXES.SUPPLIERS)
  await suppliersIndex.updateSettings({
    searchableAttributes: [
      'name',
      'phone',
      'email',
      'supplierId',
      'address',
      'taxCode',
      'contactPerson',
      'bankName',
      'bankAccount',
    ],
    filterableAttributes: [
      'isActive',
      'status',
      'totalOrders',
      'createdAt',
    ],
    sortableAttributes: [
      'name',
      'totalOrders',
      'totalPurchased',
      'totalDebt',
      'createdAt',
    ],
    typoTolerance: {
      enabled: true,
      minWordSizeForTypos: {
        oneTypo: 3,
        twoTypos: 6,
      },
    },
  })

  // Shipments index
  const shipmentsIndex = client.index(INDEXES.SHIPMENTS)
  await shipmentsIndex.updateSettings({
    searchableAttributes: [
      'trackingCode',
      'trackingNumber',
      'orderId',
      'orderBusinessId',
      'recipientName',
      'recipientPhone',
      'carrier',
    ],
    filterableAttributes: [
      'status',
      'carrier',
      'printStatus',
      'deliveryStatus',
      'createdAt',
    ],
    sortableAttributes: [
      'createdAt',
      'pickedAt',
      'deliveredAt',
      'shippingFee',
    ],
    typoTolerance: {
      enabled: true,
    },
  })

  // Warranties index
  const warrantiesIndex = client.index(INDEXES.WARRANTIES)
  await warrantiesIndex.updateSettings({
    searchableAttributes: [
      'warrantyId',
      'warrantyCode',
      'title',
      'customerName',
      'customerPhone',
      'customerEmail',
      'productName',
      'serialNumber',
      'orderId',
    ],
    filterableAttributes: [
      'status',
      'priority',
      'isUnderWarranty',
      'branchName',
      'assigneeName',
      'createdAt',
    ],
    sortableAttributes: [
      'createdAt',
      'receivedAt',
      'completedAt',
      'totalCost',
    ],
    typoTolerance: {
      enabled: true,
      minWordSizeForTypos: {
        oneTypo: 3,
        twoTypos: 6,
      },
    },
  })

}

// ===========================================
// Helper Functions
// ===========================================
export async function getIndex<T extends Record<string, unknown>>(
  indexName: string
): Promise<Index<T>> {
  const client = getMeiliClient()
  return client.index<T>(indexName)
}

export async function healthCheck(): Promise<boolean> {
  try {
    const client = getMeiliClient()
    const health = await client.health()
    return health.status === 'available'
  } catch {
    return false
  }
}

export async function getStats() {
  const client = getMeiliClient()
  return client.getStats()
}
