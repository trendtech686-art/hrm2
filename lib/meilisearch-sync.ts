import { prisma } from '@/lib/prisma'
import { getMeiliClient, INDEXES, configureIndexes } from './meilisearch'
import type { MeiliProduct, MeiliCustomer, MeiliOrder, MeiliEmployee, MeiliPkgxProduct, MeiliSupplier, MeiliShipment, MeiliWarranty } from './meilisearch'

// ===========================================
// Sync Service: PostgreSQL → Meilisearch
// ===========================================

const BATCH_SIZE = 1000

/**
 * Sync all products from PostgreSQL to Meilisearch
 */
export async function syncProducts(_options: { fullSync?: boolean } = {}) {
  const client = getMeiliClient()
  const index = client.index<MeiliProduct>(INDEXES.PRODUCTS)
  
  // Clear stale documents before full sync
  const deleteTask = await index.deleteAllDocuments()
  await client.tasks.waitForTask(deleteTask.taskUid)
  
  // Get total count
  const _total = await prisma.product.count({ where: { isDeleted: false } })
  
  let synced = 0
  let cursor: string | undefined
  
  while (true) {
    // Fetch batch - include prices relation from ProductPrice table
    const products = await prisma.product.findMany({
      where: { isDeleted: false },
      take: BATCH_SIZE,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { systemId: cursor } : undefined,
      orderBy: { systemId: 'asc' },
      include: {
        brand: { select: { name: true } },
        prices: { select: { pricingPolicyId: true, price: true } }, // ProductPrice[]
        productInventory: { 
          select: { 
            onHand: true,
            branch: { select: { systemId: true, name: true } }
          } 
        }, // ProductInventory[] for stock per branch
      },
    })
    
    if (products.length === 0) break
    
    // Transform to Meilisearch format
    // Note: Product uses `categories` array (string[]) instead of category relation
    const documents: MeiliProduct[] = products.map(p => {
      // Build prices object from ProductPrice relation: { pricingPolicyId: price }
      const pricesNumeric: Record<string, number> = {}
      for (const pp of p.prices) {
        pricesNumeric[pp.pricingPolicyId] = Number(pp.price) || 0
      }
      // Get default selling price (first available or 0)
      const sellingPrice = Object.values(pricesNumeric)[0] || 0
      // Calculate total stock and branch stocks
      const totalStock = p.productInventory.reduce((sum, inv) => sum + (inv.onHand || 0), 0)
      const branchStocks = p.productInventory
        .map(inv => ({
          branchId: inv.branch.systemId,
          branchName: inv.branch.name,
          onHand: inv.onHand || 0,
        }))
      
      return {
        id: p.systemId,
        productId: p.id,
        name: p.name,
        nameVat: p.nameVat ?? null,
        barcode: p.barcode,
        brandId: p.brandId,
        brandName: p.brand?.name || null,
        categoryId: p.categories?.[0] || null,
        categoryName: p.categories?.[0] || null,
        costPrice: Number(p.costPrice) || 0,
        lastPurchasePrice: Number(p.lastPurchasePrice) || 0,
        price: Number(sellingPrice) || 0,
        prices: pricesNumeric, // All prices for different policies
        unit: p.unit || 'Cái',
        status: p.status,
        thumbnailImage: p.thumbnailImage,
        pkgxId: p.pkgxId,
        totalStock, // Total stock across all branches
        branchStocks, // Stock per branch with branch name
        createdAt: p.createdAt?.getTime() || 0,
        updatedAt: p.updatedAt?.getTime() || 0,
      }
    })
    
    // Index batch
    await index.addDocuments(documents, { primaryKey: 'id' })
    
    synced += products.length
    cursor = products[products.length - 1].systemId
    
  }
  
  return synced
}

/**
 * Sync all customers from PostgreSQL to Meilisearch
 */
export async function syncCustomers() {
  const client = getMeiliClient()
  const index = client.index<MeiliCustomer>(INDEXES.CUSTOMERS)
  
  // Clear stale documents before full sync
  const deleteTask = await index.deleteAllDocuments()
  await client.tasks.waitForTask(deleteTask.taskUid)
  
  const _total = await prisma.customer.count({ where: { isDeleted: false } })
  
  let synced = 0
  let cursor: string | undefined
  
  while (true) {
    const customers = await prisma.customer.findMany({
      where: { isDeleted: false },
      take: BATCH_SIZE,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { systemId: cursor } : undefined,
      orderBy: { systemId: 'asc' },
      include: {
        _count: { select: { orders: true } },
      },
    })
    
    if (customers.length === 0) break
    
    // Extract address from JSON addresses field
    const documents: MeiliCustomer[] = customers.map(c => {
      const addressData = Array.isArray(c.addresses) ? c.addresses[0] : null
      const addr = addressData as { street?: string; ward?: string; district?: string; city?: string } | null
      return {
        id: c.systemId,
        customerId: c.id,
        name: c.name,
        phone: c.phone,
        email: null,
        address: addr?.street || null,
        ward: addr?.ward || null,
        district: addr?.district || null,
        city: addr?.city || null,
        totalOrders: c._count.orders,
        totalSpent: Number(c.totalSpent) || 0,
        createdAt: c.createdAt?.getTime() || 0,
      }
    })
    
    await index.addDocuments(documents, { primaryKey: 'id' })
    
    synced += customers.length
    cursor = customers[customers.length - 1].systemId
    
  }
  
  return synced
}

/**
 * Sync all orders from PostgreSQL to Meilisearch
 */
export async function syncOrders() {
  const client = getMeiliClient()
  const index = client.index<MeiliOrder>(INDEXES.ORDERS)
  
  // Clear stale documents before full sync
  const deleteTask = await index.deleteAllDocuments()
  await client.tasks.waitForTask(deleteTask.taskUid)
  
  // Order doesn't have isDeleted field
  const _total = await prisma.order.count()
  
  let synced = 0
  let cursor: string | undefined
  
  while (true) {
    const orders = await prisma.order.findMany({
      take: BATCH_SIZE,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { systemId: cursor } : undefined,
      orderBy: { systemId: 'asc' },
      include: {
        customer: { select: { name: true, phone: true } },
        branch: { select: { name: true } },
      },
    })
    
    if (orders.length === 0) break
    
    // Use grandTotal instead of totalAmount
    const documents: MeiliOrder[] = orders.map(o => ({
      id: o.systemId,
      orderId: o.id,
      customerName: o.customer?.name || null,
      customerPhone: o.customer?.phone || null,
      status: o.status,
      totalAmount: Number(o.grandTotal) || 0,
      branchId: o.branchId,
      branchName: o.branch?.name || null,
      createdAt: o.createdAt?.getTime() || 0,
      updatedAt: o.updatedAt?.getTime() || 0,
    }))
    
    await index.addDocuments(documents, { primaryKey: 'id' })
    
    synced += orders.length
    cursor = orders[orders.length - 1].systemId
    
  }
  
  return synced
}

/**
 * Sync all employees from PostgreSQL to Meilisearch
 */
export async function syncEmployees() {
  const client = getMeiliClient()
  const index = client.index<MeiliEmployee>(INDEXES.EMPLOYEES)
  
  // Clear stale documents before full sync
  const deleteTask = await index.deleteAllDocuments()
  await client.tasks.waitForTask(deleteTask.taskUid)
  
  const _total = await prisma.employee.count({ where: { isDeleted: false } })
  
  let synced = 0
  let cursor: string | undefined
  
  while (true) {
    const employees = await prisma.employee.findMany({
      where: { isDeleted: false },
      take: BATCH_SIZE,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { systemId: cursor } : undefined,
      orderBy: { systemId: 'asc' },
      include: {
        department: { select: { name: true } },
        jobTitle: { select: { name: true } },
      },
    })
    
    if (employees.length === 0) break
    
    // Use workEmail and employmentStatus instead of email/status
    // Use jobTitle instead of position
    const documents: MeiliEmployee[] = employees.map(e => ({
      id: e.systemId,
      employeeId: e.id,
      fullName: e.fullName,
      email: e.workEmail,
      phone: e.phone,
      department: e.department?.name || null,
      position: e.jobTitle?.name || null,
      status: e.employmentStatus,
      createdAt: e.createdAt?.getTime() || 0,
    }))
    
    await index.addDocuments(documents, { primaryKey: 'id' })
    
    synced += employees.length
    cursor = employees[employees.length - 1].systemId
    
  }
  
  return synced
}

/**
 * Sync all PKGX products from PostgreSQL to Meilisearch
 */
export async function syncPkgxProducts() {
  const client = getMeiliClient()
  const index = client.index<MeiliPkgxProduct>(INDEXES.PKGX_PRODUCTS)
  
  const deleteTask = await index.deleteAllDocuments()
  await client.tasks.waitForTask(deleteTask.taskUid)
  
  let synced = 0
  let cursor: number | undefined
  
  while (true) {
    const products = await prisma.pkgxProduct.findMany({
      take: BATCH_SIZE,
      skip: cursor != null ? 1 : 0,
      cursor: cursor != null ? { id: cursor } : undefined,
      orderBy: { id: 'asc' },
    })
    
    if (products.length === 0) break
    
    const documents: MeiliPkgxProduct[] = products.map(p => ({
      id: p.id,
      goodsSn: p.goodsSn,
      goodsNumber: p.goodsNumber,
      name: p.name,
      catId: p.catId,
      catName: p.catName,
      brandId: p.brandId,
      brandName: p.brandName,
      shopPrice: Number(p.shopPrice) || 0,
      hrmProductId: p.hrmProductId,
      syncedAt: p.syncedAt?.getTime() || 0,
    }))
    
    await index.addDocuments(documents, { primaryKey: 'id' })
    
    synced += products.length
    cursor = products[products.length - 1].id
  }
  
  return synced
}

/**
 * Full sync all indexes
 */
export async function fullSync() {

  // Configure indexes first
  await configureIndexes()

  // Sync all
  const results = {
    products: await syncProducts({ fullSync: true }),
    customers: await syncCustomers(),
    orders: await syncOrders(),
    employees: await syncEmployees(),
    pkgxProducts: await syncPkgxProducts(),
    suppliers: await syncSuppliers(),
    shipments: await syncShipments(),
    warranties: await syncWarranties(),
  }


  return results
}

// ===========================================
// Single Document Sync (for real-time updates)
// ===========================================

export async function syncSingleProduct(systemId: string) {
  const client = getMeiliClient()
  const index = client.index<MeiliProduct>(INDEXES.PRODUCTS)
  
  const product = await prisma.product.findUnique({
    where: { systemId },
    include: {
      brand: { select: { name: true } },
      prices: true,
      productInventory: {
        include: {
          branch: { select: { systemId: true, name: true } },
        },
      },
    },
  })
  
  if (!product || product.isDeleted) {
    // Delete from index
    await index.deleteDocument(systemId)
    return null
  }
  
  // Build prices object from ProductPrice relation
  const pricesNumeric: Record<string, number> = {}
  for (const pp of product.prices) {
    pricesNumeric[pp.pricingPolicyId] = Number(pp.price) || 0
  }
  const sellingPrice = Object.values(pricesNumeric)[0] || 0
  
  // Calculate total stock and branch stocks
  const totalStock = product.productInventory.reduce((sum, inv) => sum + (inv.onHand || 0), 0)
  const branchStocks = product.productInventory.map(inv => ({
    branchId: inv.branch.systemId,
    branchName: inv.branch.name,
    onHand: inv.onHand || 0,
  }))
  
  // Use categories array instead of category relation
  const document: MeiliProduct = {
    id: product.systemId,
    productId: product.id,
    name: product.name,
    nameVat: product.nameVat ?? null,
    barcode: product.barcode,
    brandId: product.brandId,
    brandName: product.brand?.name || null,
    categoryId: product.categories?.[0] || null,
    categoryName: product.categories?.[0] || null,
    costPrice: Number(product.costPrice) || 0,
    lastPurchasePrice: Number(product.lastPurchasePrice) || 0,
    price: Number(sellingPrice) || 0,
    prices: pricesNumeric,
    unit: product.unit || 'Cái',
    status: product.status,
    thumbnailImage: product.thumbnailImage,
    pkgxId: product.pkgxId,
    totalStock,
    branchStocks,
    createdAt: product.createdAt?.getTime() || 0,
    updatedAt: product.updatedAt?.getTime() || 0,
  }
  
  await index.addDocuments([document])
  return document
}

/**
 * Batch sync multiple products to Meilisearch (for inventory updates)
 * Call this after inventory changes to keep Meilisearch in sync
 */
export async function syncProductsInventory(productSystemIds: string[]) {
  if (productSystemIds.length === 0) return []
  
  const client = getMeiliClient()
  const index = client.index<MeiliProduct>(INDEXES.PRODUCTS)
  
  const products = await prisma.product.findMany({
    where: { 
      systemId: { in: productSystemIds },
      isDeleted: false 
    },
    include: {
      brand: { select: { name: true } },
      prices: { select: { pricingPolicyId: true, price: true } },
      productInventory: { 
        select: { 
          onHand: true,
          branch: { select: { systemId: true, name: true } }
        } 
      },
    },
  })
  
  if (products.length === 0) return []
  
  const documents: MeiliProduct[] = products.map(product => {
    const pricesNumeric: Record<string, number> = {}
    for (const pp of product.prices) {
      pricesNumeric[pp.pricingPolicyId] = Number(pp.price) || 0
    }
    const sellingPrice = Object.values(pricesNumeric)[0] || 0
    const totalStock = product.productInventory.reduce((sum, inv) => sum + (inv.onHand || 0), 0)
    const branchStocks = product.productInventory.map(inv => ({
      branchId: inv.branch.systemId,
      branchName: inv.branch.name,
      onHand: inv.onHand || 0,
    }))
    
    return {
      id: product.systemId,
      productId: product.id,
      name: product.name,
      nameVat: product.nameVat ?? null,
      barcode: product.barcode,
      brandId: product.brandId,
      brandName: product.brand?.name || null,
      categoryId: product.categories?.[0] || null,
      categoryName: product.categories?.[0] || null,
      costPrice: Number(product.costPrice) || 0,
      lastPurchasePrice: Number(product.lastPurchasePrice) || 0,
      price: Number(sellingPrice) || 0,
      prices: pricesNumeric,
      unit: product.unit || 'Cái',
      status: product.status,
      thumbnailImage: product.thumbnailImage,
      pkgxId: product.pkgxId,
      totalStock,
      branchStocks,
      createdAt: product.createdAt?.getTime() || 0,
      updatedAt: product.updatedAt?.getTime() || 0,
    }
  })
  
  await index.addDocuments(documents, { primaryKey: 'id' })
  return documents
}

export async function syncSingleCustomer(systemId: string) {
  const client = getMeiliClient()
  const index = client.index<MeiliCustomer>(INDEXES.CUSTOMERS)
  
  const customer = await prisma.customer.findUnique({
    where: { systemId },
    include: {
      _count: { select: { orders: true } },
    },
  })
  
  if (!customer || customer.isDeleted) {
    await index.deleteDocument(systemId)
    return null
  }
  
  // Extract address from JSON addresses field
  const addressData = Array.isArray(customer.addresses) ? customer.addresses[0] : null
  const addr = addressData as { street?: string; ward?: string; district?: string; city?: string } | null
  
  const document: MeiliCustomer = {
    id: customer.systemId,
    customerId: customer.id,
    name: customer.name,
    phone: customer.phone,
    email: null,
    address: addr?.street || null,
    ward: addr?.ward || null,
    district: addr?.district || null,
    city: addr?.city || null,
    totalOrders: customer._count.orders,
    totalSpent: Number(customer.totalSpent) || 0,
    createdAt: customer.createdAt?.getTime() || 0,
  }
  
  await index.addDocuments([document])
  return document
}

export async function syncSingleOrder(systemId: string) {
  const client = getMeiliClient()
  const index = client.index<MeiliOrder>(INDEXES.ORDERS)
  
  const order = await prisma.order.findUnique({
    where: { systemId },
    include: {
      customer: { select: { name: true, phone: true } },
      branch: { select: { name: true } },
    },
  })
  
  if (!order) {
    await index.deleteDocument(systemId)
    return null
  }
  
  // Use grandTotal instead of totalAmount
  const document: MeiliOrder = {
    id: order.systemId,
    orderId: order.id,
    customerName: order.customer?.name || null,
    customerPhone: order.customer?.phone || null,
    status: order.status,
    totalAmount: Number(order.grandTotal) || 0,
    branchId: order.branchId,
    branchName: order.branch?.name || null,
    createdAt: order.createdAt?.getTime() || 0,
    updatedAt: order.updatedAt?.getTime() || 0,
  }
  
  await index.addDocuments([document])
  return document
}

export async function syncSingleEmployee(systemId: string) {
  const client = getMeiliClient()
  const index = client.index<MeiliEmployee>(INDEXES.EMPLOYEES)

  const employee = await prisma.employee.findUnique({
    where: { systemId },
    include: {
      department: { select: { name: true } },
      jobTitle: { select: { name: true } },
    },
  })

  if (!employee || employee.isDeleted) {
    await index.deleteDocument(systemId)
    return null
  }

  const document: MeiliEmployee = {
    id: employee.systemId,
    employeeId: employee.id,
    fullName: employee.fullName,
    email: employee.workEmail,
    phone: employee.phone,
    department: employee.department?.name || null,
    position: employee.jobTitle?.name || null,
    status: employee.employmentStatus,
    createdAt: employee.createdAt?.getTime() || 0,
  }

  await index.addDocuments([document])
  return document
}

export async function deleteFromIndex(indexName: string, documentId: string) {
  const client = getMeiliClient()
  const index = client.index(indexName)
  await index.deleteDocument(documentId)
}

// ===========================================
// Supplier Sync
// ===========================================

export async function syncSuppliers() {
  const client = getMeiliClient()
  const index = client.index<MeiliSupplier>(INDEXES.SUPPLIERS)

  const deleteTask = await index.deleteAllDocuments()
  await client.tasks.waitForTask(deleteTask.taskUid)

  let synced = 0
  let cursor: string | undefined

  while (true) {
    const suppliers = await prisma.supplier.findMany({
      where: { isDeleted: false },
      take: BATCH_SIZE,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { systemId: cursor } : undefined,
      orderBy: { systemId: 'asc' },
    })

    if (suppliers.length === 0) break

    const documents: MeiliSupplier[] = suppliers.map(s => ({
      id: s.systemId,
      supplierId: s.id,
      name: s.name,
      phone: s.phone,
      email: s.email,
      address: s.address,
      taxCode: s.taxCode,
      contactPerson: s.contactPerson,
      totalOrders: s.totalOrders,
      totalPurchased: Number(s.totalPurchased) || 0,
      totalDebt: Number(s.totalDebt) || 0,
      isActive: s.isActive,
      status: s.status,
      bankName: s.bankName,
      bankAccount: s.bankAccount,
      createdAt: s.createdAt?.getTime() || 0,
    }))

    await index.addDocuments(documents, { primaryKey: 'id' })
    synced += suppliers.length
    cursor = suppliers[suppliers.length - 1].systemId
  }

  return synced
}

export async function syncSingleSupplier(systemId: string) {
  const client = getMeiliClient()
  const index = client.index<MeiliSupplier>(INDEXES.SUPPLIERS)

  const supplier = await prisma.supplier.findUnique({
    where: { systemId },
  })

  if (!supplier || supplier.isDeleted) {
    await index.deleteDocument(systemId)
    return null
  }

  const document: MeiliSupplier = {
    id: supplier.systemId,
    supplierId: supplier.id,
    name: supplier.name,
    phone: supplier.phone,
    email: supplier.email,
    address: supplier.address,
    taxCode: supplier.taxCode,
    contactPerson: supplier.contactPerson,
    totalOrders: supplier.totalOrders,
    totalPurchased: Number(supplier.totalPurchased) || 0,
    totalDebt: Number(supplier.totalDebt) || 0,
    isActive: supplier.isActive,
    status: supplier.status,
    bankName: supplier.bankName,
    bankAccount: supplier.bankAccount,
    createdAt: supplier.createdAt?.getTime() || 0,
  }

  await index.addDocuments([document])
  return document
}

// ===========================================
// Shipment Sync
// ===========================================

export async function syncShipments() {
  const client = getMeiliClient()
  const index = client.index<MeiliShipment>(INDEXES.SHIPMENTS)

  const deleteTask = await index.deleteAllDocuments()
  await client.tasks.waitForTask(deleteTask.taskUid)

  let synced = 0
  let cursor: string | undefined

  while (true) {
    const shipments = await prisma.shipment.findMany({
      take: BATCH_SIZE,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { systemId: cursor } : undefined,
      orderBy: { systemId: 'asc' },
    })

    if (shipments.length === 0) break

    const documents: MeiliShipment[] = shipments.map(s => ({
      id: s.systemId,
      trackingCode: s.trackingCode,
      trackingNumber: s.trackingNumber,
      carrier: s.carrier,
      status: s.status,
      service: s.service,
      orderId: s.orderId,
      orderBusinessId: s.orderBusinessId,
      recipientName: s.recipientName,
      recipientPhone: s.recipientPhone,
      recipientAddress: s.recipientAddress,
      shippingFee: Number(s.shippingFee) || 0,
      weight: s.weight ? Number(s.weight) : null,
      createdAt: s.createdAt?.getTime() || 0,
      pickedAt: s.pickedAt?.getTime() || null,
      deliveredAt: s.deliveredAt?.getTime() || null,
      returnedAt: s.returnedAt?.getTime() || null,
      printStatus: s.printStatus,
      deliveryStatus: s.deliveryStatus,
    }))

    await index.addDocuments(documents, { primaryKey: 'id' })
    synced += shipments.length
    cursor = shipments[shipments.length - 1].systemId
  }

  return synced
}

export async function syncSingleShipment(systemId: string) {
  const client = getMeiliClient()
  const index = client.index<MeiliShipment>(INDEXES.SHIPMENTS)

  const shipment = await prisma.shipment.findUnique({
    where: { systemId },
  })

  if (!shipment) {
    await index.deleteDocument(systemId)
    return null
  }

  const document: MeiliShipment = {
    id: shipment.systemId,
    trackingCode: shipment.trackingCode,
    trackingNumber: shipment.trackingNumber,
    carrier: shipment.carrier,
    status: shipment.status,
    service: shipment.service,
    orderId: shipment.orderId,
    orderBusinessId: shipment.orderBusinessId,
    recipientName: shipment.recipientName,
    recipientPhone: shipment.recipientPhone,
    recipientAddress: shipment.recipientAddress,
    shippingFee: Number(shipment.shippingFee) || 0,
    weight: shipment.weight ? Number(shipment.weight) : null,
    createdAt: shipment.createdAt?.getTime() || 0,
    pickedAt: shipment.pickedAt?.getTime() || null,
    deliveredAt: shipment.deliveredAt?.getTime() || null,
    returnedAt: shipment.returnedAt?.getTime() || null,
    printStatus: shipment.printStatus,
    deliveryStatus: shipment.deliveryStatus,
  }

  await index.addDocuments([document])
  return document
}

// ===========================================
// Warranty Sync
// ===========================================

export async function syncWarranties() {
  const client = getMeiliClient()
  const index = client.index<MeiliWarranty>(INDEXES.WARRANTIES)

  const deleteTask = await index.deleteAllDocuments()
  await client.tasks.waitForTask(deleteTask.taskUid)

  let synced = 0
  let cursor: string | undefined

  while (true) {
    const warranties = await prisma.warranty.findMany({
      where: { isDeleted: false },
      take: BATCH_SIZE,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { systemId: cursor } : undefined,
      orderBy: { systemId: 'asc' },
    })

    if (warranties.length === 0) break

    const documents: MeiliWarranty[] = warranties.map(w => ({
      id: w.systemId,
      warrantyId: w.id,
      warrantyCode: w.id,
      title: w.title,
      customerName: w.customerName,
      customerPhone: w.customerPhone,
      customerEmail: w.customerEmail,
      customerAddress: w.customerAddress,
      productName: w.productName,
      serialNumber: w.serialNumber,
      status: w.status,
      priority: w.priority,
      branchName: w.branchName,
      assigneeName: w.employeeName,
      orderId: w.orderId,
      isUnderWarranty: w.isUnderWarranty,
      totalCost: Number(w.totalCost) || 0,
      createdAt: w.createdAt?.getTime() || 0,
      receivedAt: w.receivedAt?.getTime() || 0,
      completedAt: w.completedAt?.getTime() || null,
    }))

    await index.addDocuments(documents, { primaryKey: 'id' })
    synced += warranties.length
    cursor = warranties[warranties.length - 1].systemId
  }

  return synced
}

export async function syncSingleWarranty(systemId: string) {
  const client = getMeiliClient()
  const index = client.index<MeiliWarranty>(INDEXES.WARRANTIES)

  const warranty = await prisma.warranty.findUnique({
    where: { systemId },
  })

  if (!warranty || warranty.isDeleted) {
    await index.deleteDocument(systemId)
    return null
  }

  const document: MeiliWarranty = {
    id: warranty.systemId,
    warrantyId: warranty.id,
    warrantyCode: warranty.id,
    title: warranty.title,
    customerName: warranty.customerName,
    customerPhone: warranty.customerPhone,
    customerEmail: warranty.customerEmail,
    customerAddress: warranty.customerAddress,
    productName: warranty.productName,
    serialNumber: warranty.serialNumber,
    status: warranty.status,
    priority: warranty.priority,
    branchName: warranty.branchName,
    assigneeName: warranty.employeeName,
    orderId: warranty.orderId,
    isUnderWarranty: warranty.isUnderWarranty,
    totalCost: Number(warranty.totalCost) || 0,
    createdAt: warranty.createdAt?.getTime() || 0,
    receivedAt: warranty.receivedAt?.getTime() || 0,
    completedAt: warranty.completedAt?.getTime() || null,
  }

  await index.addDocuments([document])
  return document
}

