'use client'
import { FeatureError } from '@/components/shared/feature-error'
export default function WarrantyError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <FeatureError error={error} reset={reset} featureName="Bảo hành" backHref="/warranty" backLabel="DS Bảo hành" />
}
