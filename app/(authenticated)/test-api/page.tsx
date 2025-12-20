'use client'

/**
 * Test Page for React Query Integration
 * Visit: http://localhost:3000/test-api
 */

import { useEmployees } from '@/hooks/api/use-employees'
import { useProducts } from '@/hooks/api/use-products'
import { useCustomers } from '@/hooks/api/use-customers'
import { useBranches } from '@/hooks/api/use-branches'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

function ApiStatus({ 
  name, 
  isLoading, 
  error, 
  count 
}: { 
  name: string
  isLoading: boolean
  error: Error | null
  count: number 
}) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center gap-2">
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : error ? (
          <XCircle className="h-4 w-4 text-destructive" />
        ) : (
          <CheckCircle className="h-4 w-4 text-green-500" />
        )}
        <span className="font-medium">{name}</span>
      </div>
      <div className="flex items-center gap-2">
        {isLoading ? (
          <Skeleton className="h-5 w-12" />
        ) : error ? (
          <Badge variant="destructive">Error</Badge>
        ) : (
          <Badge variant="secondary">{count} records</Badge>
        )}
      </div>
    </div>
  )
}

export default function TestApiPage() {
  const employees = useEmployees()
  const products = useProducts()
  const customers = useCustomers()
  const branches = useBranches()

  const apis = [
    { name: 'Employees', ...employees, count: employees.data?.data?.length ?? 0 },
    { name: 'Products', ...products, count: products.data?.length ?? 0 },
    { name: 'Customers', ...customers, count: customers.data?.length ?? 0 },
    { name: 'Branches', ...branches, count: branches.data?.length ?? 0 },
  ]

  const allLoaded = apis.every(a => !a.isLoading)
  const anyError = apis.some(a => a.error)

  return (
    <div className="container py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔌 API Connection Test
            {allLoaded && !anyError && (
              <Badge className="bg-green-500">All Connected</Badge>
            )}
            {anyError && (
              <Badge variant="destructive">Connection Error</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {apis.map(api => (
            <ApiStatus 
              key={api.name}
              name={api.name}
              isLoading={api.isLoading}
              error={api.error}
              count={api.count}
            />
          ))}

          <div className="mt-6 p-4 bg-muted rounded-lg text-sm">
            <p className="font-medium mb-2">📋 Test Info:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Data source: PostgreSQL via Prisma</li>
              <li>• Caching: React Query (5min stale time)</li>
              <li>• API Routes: /api/[entity]</li>
            </ul>
          </div>

          {employees.data?.data && employees.data.data.length > 0 && (
            <div className="mt-4">
              <p className="font-medium mb-2">👤 Sample Employee:</p>
              <pre className="p-3 bg-muted rounded text-xs overflow-auto">
                {JSON.stringify(employees.data.data[0], null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
