import { PublicComplaintTrackingPage } from '@/features/complaints/components/public-tracking-page';

export default async function ComplaintTrackingPage({
  params,
}: {
  params: Promise<{ complaintId: string }>;
}) {
  const { complaintId } = await params;
  return <PublicComplaintTrackingPage complaintId={complaintId} />;
}
