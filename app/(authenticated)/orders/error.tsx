'use client'
import { FeatureError } from '@/components/shared/feature-error'
export default function OrdersError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <FeatureError error={error} reset={reset} featureName="Đơn hàng" backHref="/orders" backLabel="DS Đơn hàng" />
}
