/**
 * Transform Prisma Product to frontend-compatible format.
 * 
 * Shared between product list (route.ts) and product detail ([systemId]/route.ts).
 * Converts Decimal → number, Date → ISO string, inventory/prices arrays → Records,
 * and maps brand/category IDs to frontend-expected field names.
 */
export function transformProduct(product: Record<string, unknown>): Record<string, unknown> {
  if (!product) return product;
  
  const result = { ...product };
  
  // Ensure thumbnailImage is populated (fallback to imageUrl)
  if (!result.thumbnailImage && product.imageUrl) {
    result.thumbnailImage = product.imageUrl;
  }
  
  // Convert Decimal fields to numbers
  if (product.costPrice != null) {
    result.costPrice = Number(product.costPrice);
  }
  if (product.lastPurchasePrice != null) {
    result.lastPurchasePrice = Number(product.lastPurchasePrice);
  }
  if (product.weight != null) {
    result.weight = Number(product.weight);
  }
  if (product.sellingPrice != null) {
    result.sellingPrice = Number(product.sellingPrice);
  }
  if (product.comboDiscount != null) {
    result.comboDiscount = Number(product.comboDiscount);
  }
  
  // Convert Date fields to ISO string for consistent frontend handling
  if (product.lastPurchaseDate != null) {
    result.lastPurchaseDate = product.lastPurchaseDate instanceof Date 
      ? product.lastPurchaseDate.toISOString() 
      : product.lastPurchaseDate;
  }
  
  // Transform productInventory array to inventoryByBranch Record
  if (Array.isArray(product.productInventory)) {
    const inventoryByBranch: Record<string, number> = {};
    const committedByBranch: Record<string, number> = {};
    const inTransitByBranch: Record<string, number> = {};
    const inDeliveryByBranch: Record<string, number> = {};
    let totalInventory = 0;
    for (const inv of product.productInventory) {
      const branchId = inv.branchId || inv.branchSystemId;
      const onHand = Number(inv.onHand || inv.quantity || 0);
      if (branchId) {
        inventoryByBranch[branchId] = onHand;
        committedByBranch[branchId] = Number(inv.committed || 0);
        inTransitByBranch[branchId] = Number(inv.inTransit || 0);
        inDeliveryByBranch[branchId] = Number(inv.inDelivery || 0);
      }
      totalInventory += onHand;
    }
    result.inventoryByBranch = inventoryByBranch;
    result.committedByBranch = committedByBranch;
    result.inTransitByBranch = inTransitByBranch;
    result.inDeliveryByBranch = inDeliveryByBranch;
    result.totalInventory = totalInventory;
  }
  
  // Transform prices from array to Record<policySystemId, number>
  const pricesArray = product.prices;
  if (Array.isArray(pricesArray)) {
    const pricesRecord: Record<string, number> = {};
    for (const pp of pricesArray) {
      if (pp.pricingPolicyId && pp.price != null) {
        pricesRecord[pp.pricingPolicyId] = Number(pp.price);
      }
    }
    result.prices = pricesRecord;
  }
  
  // Map brandId to brandSystemId (frontend expects brandSystemId)
  if (product.brandId) {
    result.brandSystemId = product.brandId;
  }
  
  // Map productCategories to categorySystemId (first one) and categorySystemIds
  if (Array.isArray(product.productCategories) && product.productCategories.length > 0) {
    result.categorySystemId = product.productCategories[0].categoryId;
    result.categorySystemIds = product.productCategories.map((pc: { categoryId: string }) => pc.categoryId);
  }
  
  return result;
}
