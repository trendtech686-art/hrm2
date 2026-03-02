import type { Metadata } from 'next'
import { StockLocationsPage } from '@/features/stock-locations/page'

export const metadata: Metadata = {
  title: 'Vị trí kho',
  description: 'Quản lý các vị trí trong kho',
}

export default function Page() {
  return <StockLocationsPage />
}
