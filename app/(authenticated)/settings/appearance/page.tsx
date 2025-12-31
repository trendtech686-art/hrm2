import type { Metadata } from 'next'
import { AppearancePage } from '@/features/settings/appearance/appearance-page'

export const metadata: Metadata = {
  title: 'Giao diện',
  description: 'Tuỳ chỉnh giao diện và chủ đề',
}

export default function Page() {
  return <AppearancePage />
}
