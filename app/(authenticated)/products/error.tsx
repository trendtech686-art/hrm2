'use client'
import { FeatureError } from '@/components/shared/feature-error'
export default function ProductsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <FeatureError error={error} reset={reset} featureName="Sản phẩm" backHref="/products" backLabel="DS Sản phẩm" />
}
