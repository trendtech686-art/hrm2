'use client'
import { FeatureError } from '@/components/shared/feature-error'
export default function PaymentsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <FeatureError error={error} reset={reset} featureName="Thanh toán" backHref="/payments" backLabel="DS Thanh toán" />
}
