/**
 * Complaints Store - Main Entry Point
 * Combines all slices into a single store export
 * Data is persisted in database via API, this is in-memory cache only
 * 
 * @module features/complaints/store/index
 */

import { create } from 'zustand';
import type { ComplaintStore } from './types';
import { defaultFilters } from './types';
import { createCrudSlice } from './crud-slice';
import { createWorkflowSlice } from './workflow-slice';
import { createImageSlice } from './image-slice';
import { createFilterSlice } from './filter-slice';

// ============================================
// COMBINED STORE (In-memory, no localStorage)
// ============================================

export const useComplaintStore = create<ComplaintStore>()(
    (...a) => ({
        // Initial State
        complaints: [],
        filters: defaultFilters,
        searchQuery: '',
        selectedComplaintId: null,

        // Combine all slices
        ...createCrudSlice(...a),
        ...createWorkflowSlice(...a),
        ...createImageSlice(...a),
        ...createFilterSlice(...a),
    })
);

// Re-export types
export type { ComplaintStore, ComplaintFilters } from './types';
