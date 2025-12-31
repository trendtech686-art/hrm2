import type { Metadata } from 'next'
import { WikiPage } from '@/features/wiki/page'

export const metadata: Metadata = {
  title: 'Wiki',
  description: 'Quản lý tài liệu nội bộ',
}

export default function Page() {
  return <WikiPage />
}
