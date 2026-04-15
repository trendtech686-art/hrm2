import type { Metadata } from 'next'
import { CustomersTrashPage } from '@/features/customers/trash-page'

export const metadata: Metadata = {
  title: 'Khách hàng đã xóa',
  description: 'Danh sách khách hàng đã xóa - có thể khôi phục',
}

export default function Page() {
  return <CustomersTrashPage />
}
