import type { Metadata } from 'next'
import { CustomersPage } from '@/features/customers/page'

export const metadata: Metadata = {
  title: 'Khách hàng',
  description: 'Quản lý thông tin khách hàng',
}

export default function Page() {
  return <CustomersPage />
}
