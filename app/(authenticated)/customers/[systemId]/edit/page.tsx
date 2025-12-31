import type { Metadata } from 'next'
import { CustomerFormPage } from '@/features/customers/customer-form-page'

export const metadata: Metadata = {
  title: 'Chỉnh sửa khách hàng',
  description: 'Chỉnh sửa thông tin khách hàng',
}

export default function Page() {
  return <CustomerFormPage />
}
