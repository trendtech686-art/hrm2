// Re-export all complaint types from central prisma-extended
export type {
  ComplaintType,
  ComplaintStatus,
  ComplaintResolution,
  ComplaintVerification,
  ComplaintImage,
  ComplaintAction,
  Complaint,
} from '@/lib/types/prisma-extended';

export {
  complaintTypeLabels,
  complaintTypeColors,
  complaintStatusLabels,
  complaintStatusColors,
  complaintResolutionLabels,
  complaintVerificationLabels,
  complaintVerificationColors,
  complaintPriorityLabels,
  complaintPriorityColors,
  getComplaintTypeLabel,
  getComplaintStatusLabel,
  getComplaintResolutionLabel,
} from '@/lib/types/prisma-extended';
