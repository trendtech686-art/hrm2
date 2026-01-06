/**
 * Complaints Store - Workflow Slice
 * Workflow operations: assign, investigate, verify, resolve, reject
 * 
 * @module features/complaints/store/workflow-slice
 */

import type { StateCreator } from 'zustand';
import type { SystemId } from '@/lib/id-types';
import type { Complaint, ComplaintResolution } from '../types';
import type { ComplaintStore } from './types';
import { createComplaintAction } from './helpers';

export type WorkflowSlice = Pick<
    ComplaintStore,
    'assignComplaint' | 'startInvestigation' | 'submitEvidence' | 'verifyComplaint' | 'resolveComplaint' | 'rejectComplaint'
>;

export const createWorkflowSlice: StateCreator<ComplaintStore, [], [], WorkflowSlice> = (set, get) => ({
    assignComplaint: (id: SystemId, userId: SystemId, userName?: string) => {
        const complaint = get().complaints.find((c) => c.systemId === id);
        if (!complaint) return;

        const action = createComplaintAction(
            'assigned',
            userId,
            userName 
                ? `Khiếu nại được giao cho ${userName}` 
                : `Khiếu nại được giao cho nhân viên xử lý`
        );

        get().updateComplaint(id, {
            assignedTo: userId,
            assigneeName: userName,
            assignedAt: new Date(),
            status: 'investigating',
            timeline: [...complaint.timeline, action],
        });
    },

    startInvestigation: (id: SystemId, note: string) => {
        const complaint = get().complaints.find((c) => c.systemId === id);
        if (!complaint) return;

        const action = createComplaintAction(
            'investigated',
            complaint.assignedTo || complaint.createdBy,
            note
        );

        get().updateComplaint(id, {
            status: 'investigating',
            timeline: [...complaint.timeline, action],
        });
    },

    submitEvidence: (id: SystemId, evidenceImages: string[], investigationNote: string, proposedSolution: string) => {
        const complaint = get().complaints.find((c) => c.systemId === id);
        if (!complaint) return;

        const action = createComplaintAction(
            'investigated',
            complaint.assignedTo || complaint.createdBy,
            investigationNote,
            evidenceImages
        );

        get().updateComplaint(id, {
            evidenceImages,
            investigationNote,
            proposedSolution,
            timeline: [...complaint.timeline, action],
        });
    },

    verifyComplaint: (id: SystemId, isCorrect: boolean, note: string) => {
        const complaint = get().complaints.find((c) => c.systemId === id);
        if (!complaint) return;

        const action = createComplaintAction(
            'verified',
            complaint.createdBy,
            note
        );

        get().updateComplaint(id, {
            verification: isCorrect ? 'verified-correct' : 'verified-incorrect',
            isVerifiedCorrect: isCorrect,
            timeline: [...complaint.timeline, action],
        });
    },

    resolveComplaint: (id: SystemId, resolution: ComplaintResolution, resolutionNote: string, responsibleUserId?: SystemId) => {
        const complaint = get().complaints.find((c) => c.systemId === id);
        if (!complaint) return;

        const action = createComplaintAction(
            'resolved',
            complaint.createdBy,
            resolutionNote
        );

        const updatePayload: Partial<Complaint> = {
            status: 'resolved',
            resolution,
            resolutionNote,
            resolvedBy: complaint.createdBy,
            resolvedAt: new Date(),
            timeline: [...complaint.timeline, action],
        };
        if (responsibleUserId) {
            updatePayload.responsibleUserId = responsibleUserId;
        }
        get().updateComplaint(id, updatePayload);
    },

    rejectComplaint: (id: SystemId, reason: string) => {
        const complaint = get().complaints.find((c) => c.systemId === id);
        if (!complaint) return;

        const action = createComplaintAction(
            'rejected',
            complaint.createdBy,
            reason
        );

        get().updateComplaint(id, {
            status: 'ended',
            resolution: 'rejected',
            resolutionNote: reason,
            resolvedBy: complaint.createdBy,
            resolvedAt: new Date(),
            timeline: [...complaint.timeline, action],
        });
    },
});
