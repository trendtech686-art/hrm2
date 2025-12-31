import type { Metadata } from 'next'
import { PaymentSettingsPage } from '@/features/settings/payment-settings-page'

export const metadata: Metadata = {
  title: 'Cài đặt thanh toán',
  description: 'Quản lý phương thức thanh toán',
}

export default function Page() {
  return <PaymentSettingsPage />
}
