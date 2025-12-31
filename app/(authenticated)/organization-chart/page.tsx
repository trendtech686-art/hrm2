import type { Metadata } from 'next'
import { OrganizationChartPage } from '@/features/settings/departments/organization-chart/page'

export const metadata: Metadata = {
  title: 'Sơ đồ tổ chức',
  description: 'Xem sơ đồ cấu trúc tổ chức công ty',
}

export default function Page() {
  return <OrganizationChartPage />
}
