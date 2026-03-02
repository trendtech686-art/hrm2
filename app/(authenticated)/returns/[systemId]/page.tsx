import { redirect } from 'next/navigation'

type Props = {
  params: Promise<{ systemId: string }>
}

/**
 * /returns/[systemId] redirects to /sales-returns/[systemId]
 * This ensures backward compatibility with old URLs
 */
export default async function ReturnDetailPage({ params }: Props) {
  const { systemId } = await params
  redirect(`/sales-returns/${systemId}`)
}
