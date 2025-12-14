import { describe, expect, it } from 'vitest';
import { useComplaintStore } from '@/features/complaints/store';
import type { Complaint, ComplaintResolution, ComplaintStatus, ComplaintVerification } from '@/features/complaints/types';
import {
  complaintStatusLabels,
  complaintStatusColors,
  complaintResolutionLabels,
  complaintVerificationLabels,
  complaintPriorityLabels,
} from '@/features/complaints/types';
import { COMPLAINT_STATUS_MAP, COMPLAINT_PRIORITY_MAP } from '@/components/StatusBadge';

// ---------------------------------------------------------------------------
// Type-level helpers
// ---------------------------------------------------------------------------
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2)
  ? ((<T>() => T extends B ? 1 : 2) extends (<T>() => T extends A ? 1 : 2) ? true : false)
  : false;
type Expect<T extends true> = T;

type ComplaintPriority = Complaint['priority'];

const COMPLAINT_STATUSES = ['pending', 'investigating', 'resolved', 'cancelled', 'ended'] as const satisfies ReadonlyArray<ComplaintStatus>;
type _EnsureComplaintStatuses = Expect<Equal<ComplaintStatus, (typeof COMPLAINT_STATUSES)[number]>>;

const COMPLAINT_VERIFICATIONS = ['verified-correct', 'verified-incorrect', 'pending-verification'] as const satisfies ReadonlyArray<ComplaintVerification>;
type _EnsureComplaintVerifications = Expect<Equal<ComplaintVerification, (typeof COMPLAINT_VERIFICATIONS)[number]>>;

const COMPLAINT_RESOLUTIONS = ['refund', 'return-shipping', 'advice-only', 'replacement', 'rejected'] as const satisfies ReadonlyArray<ComplaintResolution>;
type _EnsureComplaintResolutions = Expect<Equal<ComplaintResolution, (typeof COMPLAINT_RESOLUTIONS)[number]>>;

const COMPLAINT_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const satisfies ReadonlyArray<ComplaintPriority>;
type _EnsureComplaintPriorities = Expect<Equal<ComplaintPriority, (typeof COMPLAINT_PRIORITIES)[number]>>;

const REQUIRED_METHODS = [
  'addComplaint',
  'updateComplaint',
  'deleteComplaint',
  'getComplaintById',
  'assignComplaint',
  'startInvestigation',
  'submitEvidence',
  'verifyComplaint',
  'resolveComplaint',
  'rejectComplaint',
  'addComplaintImage',
  'removeComplaintImage',
  'setFilters',
  'resetFilters',
  'setSearchQuery',
  'setSelectedComplaint',
  'getFilteredComplaints',
  'getComplaintsByStatus',
  'getComplaintsByAssignee',
  'getStats',
] as const;

describe('complaints domain guard tests', () => {
  it('exposes workflow helpers on the complaint store', () => {
    const state = useComplaintStore.getState() as unknown as Record<string, unknown>;

    REQUIRED_METHODS.forEach((method) => {
      expect(typeof state[method]).toBe('function');
    });
  });

  it('keeps complaint statuses, resolutions, and priorities in sync with UI maps', () => {
    COMPLAINT_STATUSES.forEach((status) => {
      expect(complaintStatusLabels[status]).toBeDefined();
      expect(complaintStatusColors[status]).toBeDefined();
      expect(COMPLAINT_STATUS_MAP[status]).toBeDefined();
    });

    COMPLAINT_VERIFICATIONS.forEach((verification) => {
      expect(complaintVerificationLabels[verification]).toBeDefined();
    });

    COMPLAINT_RESOLUTIONS.forEach((resolution) => {
      expect(complaintResolutionLabels[resolution]).toBeDefined();
    });

    COMPLAINT_PRIORITIES.forEach((priority) => {
      expect(complaintPriorityLabels[priority]).toBeDefined();
      expect(COMPLAINT_PRIORITY_MAP[priority]).toBeDefined();
    });
  });
});
