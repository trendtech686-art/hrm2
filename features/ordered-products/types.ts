/** Type cho mỗi dòng hàng đặt */
export interface OrderedProductItem {
  systemId: string
  // PO info
  poId: string
  poSystemId: string
  poStatus: string
  orderDate: string | null
  // Supplier info
  supplierSystemId: string
  supplierName: string
  // Product info
  productId: string
  productSku: string
  productName: string
  productImage: string | null
  // Numbers
  quantity: number
  receivedQty: number
  unitPrice: number
  discount: number
  total: number
}

export interface OrderedProductsParams {
  page?: number
  limit?: number
  search?: string
  supplierId?: string
  status?: string
  dateFrom?: string
  dateTo?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
