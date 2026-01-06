/**
 * Complaints Store - CRUD Slice
 * Basic CRUD operations for complaints
 * 
 * @module features/complaints/store/crud-slice
 */

import type { StateCreator } from 'zustand';
import type { BusinessId } from '@/lib/id-types';
import type { Complaint } from '../types';
import type { ComplaintStore } from './types';
import { 
    generatePublicTrackingCode, 
    generateComplaintSystemId, 
    generateComplaintBusinessId,
    createComplaintAction 
} from './helpers';

export type CrudSlice = Pick<
    ComplaintStore,
    'addComplaint' | 'updateComplaint' | 'deleteComplaint' | 'getComplaintById'
>;

export const createCrudSlice: StateCreator<ComplaintStore, [], [], CrudSlice> = (set, get) => ({
    addComplaint: (complaintData) => {
        const currentComplaints = get().complaints;
        
        const systemId = generateComplaintSystemId(currentComplaints);
        const idValue: BusinessId | null = complaintData.id ?? null;
        const businessId = generateComplaintBusinessId(currentComplaints, idValue);
        const publicTrackingCode = (complaintData as Partial<Complaint>).publicTrackingCode || generatePublicTrackingCode();
        
        const now = new Date();
        const initialAction = createComplaintAction('created', complaintData.createdBy, complaintData.description);

        const newComplaint: Complaint = {
            ...complaintData,
            systemId,
            id: businessId,
            publicTrackingCode,
            createdAt: now,
            updatedAt: now,
            status: 'pending',
            verification: 'pending-verification',
            timeline: [initialAction],
        };

        set((state) => ({
            complaints: [newComplaint, ...state.complaints],
        }));

        return systemId;
    },

    updateComplaint: (systemId, updates) => {
        set((state) => ({
            complaints: state.complaints.map((complaint) =>
                complaint.systemId === systemId
                    ? { ...complaint, ...updates, updatedAt: new Date() }
                    : complaint
            ),
        }));
    },

    deleteComplaint: (systemId) => {
        set((state) => ({
            complaints: state.complaints.filter((c) => c.systemId !== systemId),
        }));
    },

    getComplaintById: (systemId) => {
        return get().complaints.find((c) => c.systemId === systemId);
    },
});
