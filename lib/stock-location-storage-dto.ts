type StockRow = {
  systemId: string
  id: string
  name: string
  description: string | null
  branchId: string
  branchSystemId: string | null
  isDefault: boolean
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

/**
 * Shape expected by features/settings/inventory (StorageLocation) — backed by `stock_locations` only.
 */
export function stockLocationToStorageDto(loc: StockRow) {
  return {
    systemId: loc.systemId,
    id: loc.id,
    name: loc.name,
    description: loc.description ?? undefined,
    branchId: loc.branchSystemId ?? loc.branchId,
    isDefault: loc.isDefault,
    isActive: loc.isActive,
    isDeleted: !loc.isActive,
    createdAt: loc.createdAt.toISOString(),
    updatedAt: loc.updatedAt.toISOString(),
  }
}
