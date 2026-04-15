import type { Metadata } from 'next'
import ClientPage from './client-page'

export const metadata: Metadata = {
  title: 'Sơ đồ tổ chức',
  description: 'Xem sơ đồ cấu trúc tổ chức công ty',
}

export default function Page() {
  return <ClientPage />
}
