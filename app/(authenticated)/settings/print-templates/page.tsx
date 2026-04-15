import type { Metadata } from 'next'
import PrintTemplatesClient from './client'

export const metadata: Metadata = {
  title: 'Mẫu in',
  description: 'Quản lý mẫu in hóa đơn',
}

export default function Page() {
  return <PrintTemplatesClient />
}
