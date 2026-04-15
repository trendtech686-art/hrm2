'use client'
import { FeatureError } from '@/components/shared/feature-error'
export default function CustomersError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <FeatureError error={error} reset={reset} featureName="Khách hàng" backHref="/customers" backLabel="DS Khách hàng" />
}
