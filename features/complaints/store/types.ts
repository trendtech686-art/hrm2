/**
 * Complaints Store - Types
 * Type definitions for the complaint store
 * 
 * @module features/complaints/store/types
 */

import type { SystemId } from '@/lib/id-types';
import type {
    Complaint,
    ComplaintStatus,
    ComplaintType,
    ComplaintResolution,
    ComplaintVerification,
    ComplaintImage,
} from '../types';

// ============================================
// FILTER TYPES
// ============================================

export interface ComplaintFilters {
    status: ComplaintStatus | 'all';
    type: ComplaintType | 'all';
    verification: ComplaintVerification | 'all';
    assignedTo: SystemId | 'all';
    dateRange?: { from: Date; to: Date };
    priority?: 'low' | 'medium' | 'high' | 'urgent' | 'all';
}

export const defaultFilters: ComplaintFilters = {
    status: 'all',
    type: 'all',
    verification: 'all',
    assignedTo: 'all',
    priority: 'all',
};

// ============================================
// STORE STATE INTERFACE
// ============================================

export interface ComplaintStore {
    // State
    complaints: Complaint[];
    filters: ComplaintFilters;
    searchQuery: string;
    selectedComplaintId: SystemId | null;

    // Actions - CRUD
    addComplaint: (complaint: Omit<Complaint, 'systemId' | 'createdAt' | 'updatedAt' | 'timeline' | 'id'> & { id?: Complaint['id'] }) => SystemId;
    updateComplaint: (systemId: SystemId, updates: Partial<Complaint>) => void;
    deleteComplaint: (systemId: SystemId) => void;
    getComplaintById: (systemId: SystemId) => Complaint | undefined;

    // Actions - Workflow
    assignComplaint: (id: SystemId, userId: SystemId, userName?: string) => void;
    startInvestigation: (id: SystemId, note: string) => void;
    submitEvidence: (id: SystemId, evidenceImages: string[], investigationNote: string, proposedSolution: string) => void;
    verifyComplaint: (id: SystemId, isCorrect: boolean, note: string) => void;
    resolveComplaint: (id: SystemId, resolution: ComplaintResolution, resolutionNote: string, responsibleUserId?: SystemId) => void;
    rejectComplaint: (id: SystemId, reason: string) => void;

    // Actions - Images
    addComplaintImage: (id: SystemId, image: ComplaintImage) => void;
    removeComplaintImage: (id: SystemId, imageId: SystemId) => void;

    // Actions - Filters & Search
    setFilters: (filters: Partial<ComplaintFilters>) => void;
    resetFilters: () => void;
    setSearchQuery: (query: string) => void;
    setSelectedComplaint: (id: SystemId | null) => void;

    // Computed
    getFilteredComplaints: () => Complaint[];
    getComplaintsByStatus: (status: ComplaintStatus) => Complaint[];
    getComplaintsByAssignee: (userId: SystemId) => Complaint[];
    getStats: () => {
        total: number;
        pending: number;
        investigating: number;
        resolved: number;
        rejected: number;
        verifiedCorrect: number;
        verifiedIncorrect: number;
    };
}
