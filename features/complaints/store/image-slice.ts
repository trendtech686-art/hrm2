/**
 * Complaints Store - Image Slice
 * Image management operations
 * 
 * @module features/complaints/store/image-slice
 */

import type { StateCreator } from 'zustand';
import type { SystemId } from '@/lib/id-types';
import type { ComplaintImage } from '../types';
import type { ComplaintStore } from './types';

export type ImageSlice = Pick<ComplaintStore, 'addComplaintImage' | 'removeComplaintImage'>;

export const createImageSlice: StateCreator<ComplaintStore, [], [], ImageSlice> = (set, get) => ({
    addComplaintImage: (id: SystemId, image: ComplaintImage) => {
        const complaint = get().complaints.find((c) => c.systemId === id);
        if (!complaint) return;

        get().updateComplaint(id, {
            images: [...complaint.images, image],
        });
    },

    removeComplaintImage: (id: SystemId, imageId: SystemId) => {
        const complaint = get().complaints.find((c) => c.systemId === id);
        if (!complaint) return;

        get().updateComplaint(id, {
            images: complaint.images.filter((img) => img.id !== imageId),
        });
    },
});
