/**
 * Complaints Store - Filter Slice
 * Filter, search, and selection operations
 * 
 * @module features/complaints/store/filter-slice
 */

import type { StateCreator } from 'zustand';
import type { SystemId } from '@/lib/id-types';
import type { ComplaintStatus } from '../types';
import type { ComplaintStore, ComplaintFilters } from './types';
import { defaultFilters } from './types';

export type FilterSlice = Pick<
    ComplaintStore,
    | 'setFilters'
    | 'resetFilters'
    | 'setSearchQuery'
    | 'setSelectedComplaint'
    | 'getFilteredComplaints'
    | 'getComplaintsByStatus'
    | 'getComplaintsByAssignee'
    | 'getStats'
>;

export const createFilterSlice: StateCreator<ComplaintStore, [], [], FilterSlice> = (set, get) => ({
    setFilters: (filters: Partial<ComplaintFilters>) => {
        set((state) => ({
            filters: { ...state.filters, ...filters },
        }));
    },

    resetFilters: () => {
        set({ filters: defaultFilters });
    },

    setSearchQuery: (query: string) => {
        set({ searchQuery: query });
    },

    setSelectedComplaint: (id: SystemId | null) => {
        set({ selectedComplaintId: id });
    },

    getFilteredComplaints: () => {
        const { complaints, filters, searchQuery } = get();

        return complaints.filter((complaint) => {
            // Status filter
            if (filters.status !== 'all' && complaint.status !== filters.status) {
                return false;
            }

            // Type filter
            if (filters.type !== 'all' && complaint.type !== filters.type) {
                return false;
            }

            // Verification filter
            if (filters.verification !== 'all' && complaint.verification !== filters.verification) {
                return false;
            }

            // Assignee filter
            if (filters.assignedTo !== 'all' && complaint.assignedTo !== filters.assignedTo) {
                return false;
            }

            // Priority filter
            if (filters.priority !== 'all' && complaint.priority !== filters.priority) {
                return false;
            }

            // Date range filter
            if (filters.dateRange) {
                const complaintDate = new Date(complaint.createdAt);
                if (complaintDate < filters.dateRange.from || complaintDate > filters.dateRange.to) {
                    return false;
                }
            }

            // Search query
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return (
                    (complaint.orderCode || complaint.orderSystemId).toLowerCase().includes(query) ||
                    complaint.customerName.toLowerCase().includes(query) ||
                    complaint.customerPhone.includes(query) ||
                    complaint.description.toLowerCase().includes(query) ||
                    complaint.id.toLowerCase().includes(query)
                );
            }

            return true;
        });
    },

    getComplaintsByStatus: (status: ComplaintStatus) => {
        return get().complaints.filter((c) => c.status === status);
    },

    getComplaintsByAssignee: (userId: SystemId) => {
        return get().complaints.filter((c) => c.assignedTo === userId);
    },

    getStats: () => {
        const complaints = get().complaints;

        return {
            total: complaints.length,
            pending: complaints.filter((c) => c.status === 'pending').length,
            investigating: complaints.filter((c) => c.status === 'investigating').length,
            resolved: complaints.filter((c) => c.status === 'resolved').length,
            rejected: complaints.filter((c) => c.resolution === 'rejected').length,
            verifiedCorrect: complaints.filter((c) => c.verification === 'verified-correct').length,
            verifiedIncorrect: complaints.filter((c) => c.verification === 'verified-incorrect').length,
        };
    },
});
