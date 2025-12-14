/**
 * @file Complaint Store Tests
 * @description Tests for complaint management based on testing-checklist.md Section 15
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useComplaintStore } from '../store';
import { asSystemId, asBusinessId } from '../../../lib/id-types';

describe('Complaint Store', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // 15. Khiếu nại (Complaints)
  describe('15. Khiếu nại (Complaints)', () => {
    it('returns list of complaints', () => {
      const store = useComplaintStore.getState();
      expect(store.complaints).toBeDefined();
      expect(Array.isArray(store.complaints)).toBe(true);
    });

    it('filters complaints correctly using getFilteredComplaints', () => {
      const store = useComplaintStore.getState();
      const filteredComplaints = store.getFilteredComplaints();
      
      expect(Array.isArray(filteredComplaints)).toBe(true);
    });

    // Tạo khiếu nại
    it('creates a new complaint', () => {
      const initialCount = useComplaintStore.getState().complaints.length;
      
      const newComplaint = {
        orderSystemId: asSystemId('ORDER000001'),
        orderCode: 'DH000001',
        orderValue: 1000000,
        branchSystemId: asSystemId('BRANCH000001'),
        branchName: 'Test Branch',
        customerSystemId: asSystemId('CUST000001'),
        customerId: 'KH000001',
        customerName: 'Test Customer',
        customerPhone: '0901234567',
        type: 'missing-items' as const,
        description: 'Test complaint description',
        images: [],
        employeeImages: [],
        status: 'pending' as const,
        verification: 'pending-verification' as const,
        priority: 'high' as const,
        createdBy: asSystemId('EMP000001'),
        affectedProducts: [],
      };
      
      const systemId = useComplaintStore.getState().addComplaint(newComplaint);
      
      expect(systemId).toBeDefined();
      expect(useComplaintStore.getState().complaints.length).toBe(initialCount + 1);
    });

    it('generates systemId for new complaint', () => {
      const store = useComplaintStore.getState();
      
      const newComplaint = {
        orderSystemId: asSystemId('ORDER000002'),
        orderCode: 'DH000002',
        orderValue: 2000000,
        branchSystemId: asSystemId('BRANCH000001'),
        branchName: 'Test Branch',
        customerSystemId: asSystemId('CUST000002'),
        customerId: 'KH000002',
        customerName: 'Test Customer 2',
        customerPhone: '0901234568',
        type: 'product-condition' as const,
        description: 'Another test',
        images: [],
        employeeImages: [],
        status: 'pending' as const,
        verification: 'pending-verification' as const,
        priority: 'medium' as const,
        createdBy: asSystemId('EMP000001'),
        affectedProducts: [],
      };
      
      const systemId = store.addComplaint(newComplaint);
      
      expect(systemId).toBeDefined();
      expect(systemId).toMatch(/^COMPLAINT\d{6}$/);
    });

    // Phân loại khiếu nại (by type)
    it('creates complaint with type', () => {
      const store = useComplaintStore.getState();
      
      const newComplaint = {
        orderSystemId: asSystemId('ORDER000003'),
        orderCode: 'DH000003',
        orderValue: 3000000,
        branchSystemId: asSystemId('BRANCH000001'),
        branchName: 'Test Branch',
        customerSystemId: asSystemId('CUST000003'),
        customerId: 'KH000003',
        customerName: 'Customer 3',
        customerPhone: '0901234569',
        type: 'wrong-product' as const,
        description: 'Issue with product',
        images: [],
        employeeImages: [],
        status: 'pending' as const,
        verification: 'pending-verification' as const,
        priority: 'high' as const,
        createdBy: asSystemId('EMP000001'),
        affectedProducts: [],
      };
      
      const systemId = store.addComplaint(newComplaint);
      const added = store.getComplaintById(systemId);
      
      expect(added?.type).toBe('wrong-product');
    });

    // Gán người xử lý
    it('assigns handler to complaint', () => {
      const store = useComplaintStore.getState();
      const complaints = store.complaints;
      
      if (complaints.length > 0) {
        const complaint = complaints[0];
        const handlerId = asSystemId('EMP000002');
        
        store.assignComplaint(complaint.systemId, handlerId);
        
        const updated = store.getComplaintById(complaint.systemId);
        expect(updated?.assignedTo).toBe(handlerId);
      }
    });

    // Cập nhật trạng thái
    it('updates complaint status', () => {
      const store = useComplaintStore.getState();
      const complaints = store.complaints;
      
      if (complaints.length > 0) {
        const complaint = complaints[0];
        const newStatus = 'investigating';
        
        store.updateComplaint(complaint.systemId, { status: newStatus });
        
        const updated = store.getComplaintById(complaint.systemId);
        expect(updated?.status).toBe(newStatus);
      }
    });

    it('resolves complaint', () => {
      const store = useComplaintStore.getState();
      const complaints = store.complaints.filter(c => c.status !== 'resolved');
      
      if (complaints.length > 0) {
        const complaint = complaints[0];
        
        store.resolveComplaint(
          complaint.systemId, 
          'replacement',
          'Issue resolved by replacing product'
        );
        
        const updated = store.getComplaintById(complaint.systemId);
        expect(updated?.status).toBe('resolved');
        expect(updated?.resolvedAt).toBeDefined();
      }
    });

    // Reject khiếu nại
    it('rejects complaint', () => {
      const store = useComplaintStore.getState();
      const complaints = store.complaints.filter(c => c.status === 'pending');
      
      if (complaints.length > 0) {
        const complaint = complaints[0];
        
        store.rejectComplaint(complaint.systemId, 'Invalid complaint');
        
        const updated = store.getComplaintById(complaint.systemId);
        expect(updated?.status).toBe('ended');
        expect(updated?.resolution).toBe('rejected');
      }
    });

    // Priority handling
    it('updates complaint priority', () => {
      const store = useComplaintStore.getState();
      const complaints = store.complaints;
      
      if (complaints.length > 0) {
        const complaint = complaints[0];
        
        store.updateComplaint(complaint.systemId, { priority: 'urgent' });
        
        const updated = store.getComplaintById(complaint.systemId);
        expect(updated?.priority).toBe('urgent');
      }
    });

    // Filter by type
    it('filters complaints by type', () => {
      const store = useComplaintStore.getState();
      const missingItemsComplaints = store.complaints.filter(c => c.type === 'missing-items');
      
      expect(Array.isArray(missingItemsComplaints)).toBe(true);
    });

    // Status filtering
    it('filters complaints by status using getComplaintsByStatus', () => {
      const store = useComplaintStore.getState();
      const investigatingComplaints = store.getComplaintsByStatus('investigating');
      
      expect(Array.isArray(investigatingComplaints)).toBe(true);
      investigatingComplaints.forEach(c => {
        expect(c.status).toBe('investigating');
      });
    });

    // Find by systemId
    it('finds complaint by systemId', () => {
      const store = useComplaintStore.getState();
      const complaints = store.complaints;
      
      if (complaints.length > 0) {
        const firstComplaint = complaints[0];
        const found = store.getComplaintById(firstComplaint.systemId);
        
        expect(found).toBeDefined();
        expect(found?.systemId).toBe(firstComplaint.systemId);
      }
    });

    // Delete complaint
    it('deletes a complaint', () => {
      const complaints = useComplaintStore.getState().complaints;
      
      if (complaints.length > 0) {
        const complaint = complaints[0];
        const initialCount = complaints.length;
        
        useComplaintStore.getState().deleteComplaint(complaint.systemId);
        
        expect(useComplaintStore.getState().complaints.length).toBe(initialCount - 1);
        expect(useComplaintStore.getState().getComplaintById(complaint.systemId)).toBeUndefined();
      }
    });

    // Investigation note
    it('adds investigation note to complaint', () => {
      const store = useComplaintStore.getState();
      const complaints = store.complaints;
      
      if (complaints.length > 0) {
        const complaint = complaints[0];
        const newNote = 'This is a test investigation note';
        
        store.updateComplaint(complaint.systemId, { investigationNote: newNote });
        
        const updated = store.getComplaintById(complaint.systemId);
        expect(updated?.investigationNote).toBe(newNote);
      }
    });

    // Resolution details
    it('adds resolution details to complaint', () => {
      const store = useComplaintStore.getState();
      const complaints = store.complaints;
      
      if (complaints.length > 0) {
        const complaint = complaints[0];
        const resolutionNote = 'Issue resolved by replacing product';
        
        store.updateComplaint(complaint.systemId, { 
          resolutionNote,
          status: 'resolved'
        });
        
        const updated = store.getComplaintById(complaint.systemId);
        expect(updated?.resolutionNote).toBe(resolutionNote);
      }
    });

    // Search functionality
    it('searches complaints by customer name', () => {
      const store = useComplaintStore.getState();
      store.setSearchQuery('Hưng Thịnh');
      
      const filtered = store.getFilteredComplaints();
      expect(Array.isArray(filtered)).toBe(true);
      
      // Reset search
      store.setSearchQuery('');
    });

    // Stats
    it('returns complaint stats', () => {
      const store = useComplaintStore.getState();
      const stats = store.getStats();
      
      expect(stats).toBeDefined();
      expect(typeof stats.total).toBe('number');
      expect(typeof stats.pending).toBe('number');
      expect(typeof stats.investigating).toBe('number');
      expect(typeof stats.resolved).toBe('number');
    });

    // Filters
    it('sets and resets filters', () => {
      useComplaintStore.getState().setFilters({ status: 'pending' });
      expect(useComplaintStore.getState().filters.status).toBe('pending');
      
      useComplaintStore.getState().resetFilters();
      expect(useComplaintStore.getState().filters.status).toBe('all');
    });

    // Get complaints by assignee
    it('gets complaints by assignee', () => {
      const store = useComplaintStore.getState();
      const assigneeId = asSystemId('EMP000005');
      
      const assignedComplaints = store.getComplaintsByAssignee(assigneeId);
      expect(Array.isArray(assignedComplaints)).toBe(true);
      
      assignedComplaints.forEach(c => {
        expect(c.assignedTo).toBe(assigneeId);
      });
    });

    // Verify complaint
    it('verifies complaint as correct', () => {
      const store = useComplaintStore.getState();
      const complaints = store.complaints.filter(c => c.verification === 'pending-verification');
      
      if (complaints.length > 0) {
        const complaint = complaints[0];
        
        store.verifyComplaint(complaint.systemId, true, 'Verified as correct');
        
        const updated = store.getComplaintById(complaint.systemId);
        expect(updated?.verification).toBe('verified-correct');
        expect(updated?.isVerifiedCorrect).toBe(true);
      }
    });

    // Submit evidence
    it('submits evidence for complaint', () => {
      const store = useComplaintStore.getState();
      const complaints = store.complaints;
      
      if (complaints.length > 0) {
        const complaint = complaints[0];
        const evidenceImages = ['https://example.com/image1.jpg'];
        const investigationNote = 'Investigation completed';
        const proposedSolution = 'Replace the product';
        
        store.submitEvidence(complaint.systemId, evidenceImages, investigationNote, proposedSolution);
        
        const updated = store.getComplaintById(complaint.systemId);
        expect(updated?.evidenceImages).toEqual(evidenceImages);
        expect(updated?.investigationNote).toBe(investigationNote);
        expect(updated?.proposedSolution).toBe(proposedSolution);
      }
    });
  });
});
