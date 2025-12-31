import type { Metadata } from 'next'
import { PkgxSettingsPage } from '@/features/settings/pkgx/pkgx-settings-page'

export const metadata: Metadata = {
  title: 'Cài đặt PKGX',
  description: 'Đồng bộ với PKGX',
}

export default function Page() {
  return <PkgxSettingsPage />
}
