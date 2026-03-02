import { useQuery } from '@tanstack/react-query'

interface EntityCountStats {
  count: number
  lastId?: string
}

interface EntityCounts {
  employees: EntityCountStats
  customers: EntityCountStats
  products: EntityCountStats
  orders: EntityCountStats
  complaints: EntityCountStats
  warranties: EntityCountStats
  penalties: EntityCountStats
  leaves: EntityCountStats
  suppliers: EntityCountStats
  purchaseOrders: EntityCountStats
  purchaseReturns: EntityCountStats
  inventoryReceipts: EntityCountStats
  branches: EntityCountStats
  departments: EntityCountStats
  jobTitles: EntityCountStats
  categories: EntityCountStats
  brands: EntityCountStats
  tasks: EntityCountStats
  stockTransfers: EntityCountStats
  inventoryChecks: EntityCountStats
}

async function fetchEntityCounts(): Promise<EntityCounts> {
  const res = await fetch('/api/stats/counts')
  if (!res.ok) throw new Error('Failed to fetch counts')
  const json = await res.json()
  return json.data
}

/**
 * Hook to get counts of all entities
 * Much faster than loading all records with limit=10000
 */
export function useEntityCounts() {
  return useQuery({
    queryKey: ['entity-counts'],
    queryFn: fetchEntityCounts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
