import type { Metadata } from 'next'
import { CustomerFormPage } from '@/features/customers/customer-form-page'

export const metadata: Metadata = {
  title: 'Thêm khách hàng mới',
  description: 'Tạo khách hàng mới',
}

export default function Page() {
  return <CustomerFormPage />
}
