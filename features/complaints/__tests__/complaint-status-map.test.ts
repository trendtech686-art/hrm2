import { describe, it, expect } from 'vitest';
import type { ComplaintStatus } from '@/features/complaints/types';
import { COMPLAINT_STATUS_MAP } from '@/components/StatusBadge';

const COMPLAINT_STATUSES: ComplaintStatus[] = [
  'pending',
  'investigating',
  'resolved',
  'cancelled',
  'ended',
];

describe('Complaint status guard', () => {
  it('ensures every complaint status has a badge config', () => {
    COMPLAINT_STATUSES.forEach((status) => {
      expect(COMPLAINT_STATUS_MAP[status]).toBeDefined();
    });
  });

  it('does not expose extra statuses outside the ComplaintStatus union', () => {
    const known = new Set(COMPLAINT_STATUSES);
    Object.keys(COMPLAINT_STATUS_MAP).forEach((status) => {
      expect(known.has(status as ComplaintStatus)).toBe(true);
    });
  });
});
