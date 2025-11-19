import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ENTITY_PREFIXES } from "@/lib/smart-prefix";
import { asSystemId, asBusinessId, type SystemId, type BusinessId } from "@/lib/id-types";
import type {
  Complaint,
  ComplaintStatus,
  ComplaintType,
  ComplaintResolution,
  ComplaintVerification,
  ComplaintAction,
  ComplaintImage,
} from "./types";

// =============================================
// HELPER FUNCTIONS
// =============================================

/**
 * Generate random public tracking code (10 chars: a-z, 0-9)
 * Example: rb5n8xzhrm
 */
function generatePublicTrackingCode(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// =============================================
// STORE STATE INTERFACE
// =============================================

interface ComplaintFilters {
  status: ComplaintStatus | "all";
  type: ComplaintType | "all";
  verification: ComplaintVerification | "all";
  assignedTo: SystemId | "all";  // Use SystemId for assignedTo
  dateRange?: { from: Date; to: Date };
  priority?: "low" | "medium" | "high" | "urgent" | "all";
}

interface ComplaintStore {
  // State
  complaints: Complaint[];
  filters: ComplaintFilters;
  searchQuery: string;
  selectedComplaintId: SystemId | null;

  // Actions - CRUD (sử dụng store-factory internally)
  addComplaint: (complaint: Omit<Complaint, "systemId" | "createdAt" | "updatedAt" | "timeline" | "id"> & { id?: BusinessId }) => SystemId;
  updateComplaint: (systemId: SystemId, updates: Partial<Complaint>) => void;
  deleteComplaint: (systemId: SystemId) => void;
  getComplaintById: (systemId: SystemId) => Complaint | undefined;

  // Actions - Workflow
  assignComplaint: (id: SystemId, userId: SystemId) => void;
  startInvestigation: (id: SystemId, note: string) => void;
  submitEvidence: (id: SystemId, evidenceImages: string[], investigationNote: string, proposedSolution: string) => void;
  verifyComplaint: (id: SystemId, isCorrect: boolean, note: string) => void;
  resolveComplaint: (
    id: SystemId,
    resolution: ComplaintResolution,
    resolutionNote: string,
    responsibleUserId?: SystemId
  ) => void;
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

// =============================================
// DEFAULT VALUES
// =============================================

const defaultFilters: ComplaintFilters = {
  status: "all",
  type: "all",
  verification: "all",
  assignedTo: "all",
  priority: "all",
};

// =============================================
// STORE IMPLEMENTATION
// =============================================

export const useComplaintStore = create<ComplaintStore>()(
  persist(
    (set, get) => ({
      // Initial State - Load sample data if empty
      complaints: [],
      filters: defaultFilters,
      searchQuery: "",
      selectedComplaintId: null,

      // =============================================
      // CRUD ACTIONS (Using store-factory logic)
      // =============================================

      addComplaint: (complaintData) => {
        const currentComplaints = get().complaints;
        
        const BUSINESS_PREFIX = ENTITY_PREFIXES['complaints']; // 'PKN'
        const SYSTEM_PREFIX = 'COMPLAINT';
        
        // Generate SystemId (6 digits) - COMPLAINT000001, COMPLAINT000002
        const maxSystemIdNumber = currentComplaints.length > 0
          ? Math.max(...currentComplaints.map(c => {
              const match = c.systemId.match(/COMPLAINT(\d{6})/);
              return match ? parseInt(match[1]) : 0;
            }))
          : 0;
        const systemId = asSystemId(`${SYSTEM_PREFIX}${String(maxSystemIdNumber + 1).padStart(6, '0')}`);
        
        // Generate Business ID (6 digits) - PKN000001, PKN000002 (if not provided)
        let idValue: BusinessId | null = complaintData.id ?? null;
        let id: string = idValue ? String(idValue) : '';
        if (!id) {
          const maxBusinessIdNumber = currentComplaints.length > 0
            ? Math.max(...currentComplaints.map(c => {
                const match = c.id?.match(/PKN(\d{6})/);
                return match ? parseInt(match[1]) : 0;
              }))
            : 0;
          id = `${BUSINESS_PREFIX}${String(maxBusinessIdNumber + 1).padStart(6, '0')}`;
        } else {
          // Validate unique ID (case-insensitive)
          const existingIds = currentComplaints.map(c => c.id?.toLowerCase());
          if (existingIds.includes(id.toLowerCase())) {
            throw new Error(`Mã "${id}" đã tồn tại! Vui lòng sử dụng mã khác.`);
          }
          // Sanitize ID: uppercase + remove spaces
          id = id.toUpperCase().trim().replace(/\s+/g, '');
        }
        const businessId = asBusinessId(id);
        
        // [NOTE] Generate public tracking code for customer
        const publicTrackingCode = (complaintData as any).publicTrackingCode || generatePublicTrackingCode();
        
        const now = new Date();

        const initialAction: ComplaintAction = {
          id: asSystemId(`action_${Date.now()}`),
          actionType: "created",
          performedBy: complaintData.createdBy,
          performedAt: now,
          note: complaintData.description,
        };

        const newComplaint: Complaint = {
          ...complaintData,
          systemId,
          id: businessId,
          publicTrackingCode, // [NOTE] Add tracking code
          createdAt: now,
          updatedAt: now,
          status: "pending",
          verification: "pending-verification",
          timeline: [initialAction],
        };

        set((state) => ({
          complaints: [newComplaint, ...state.complaints],
        }));

        return systemId; // Return systemId for internal use
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

      // =============================================
      // WORKFLOW ACTIONS
      // =============================================

      assignComplaint: (id, userId) => {
        const complaint = get().complaints.find((c) => c.systemId === id);
        if (!complaint) return;

        const action: ComplaintAction = {
          id: asSystemId(`action_${Date.now()}`),
          actionType: "assigned",
          performedBy: userId,
          performedAt: new Date(),
          note: `Khiếu nại được giao cho nhân viên xử lý`,
        };

        get().updateComplaint(id, {
          assignedTo: userId,
          assignedAt: new Date(),
          status: "investigating",
          timeline: [...complaint.timeline, action],
        });
      },

      startInvestigation: (id, note) => {
        const complaint = get().complaints.find((c) => c.systemId === id);
        if (!complaint) return;

        const action: ComplaintAction = {
          id: asSystemId(`action_${Date.now()}`),
          actionType: "investigated",
          performedBy: complaint.assignedTo || complaint.createdBy,
          performedAt: new Date(),
          note,
        };

        get().updateComplaint(id, {
          status: "investigating",
          timeline: [...complaint.timeline, action],
        });
      },

      submitEvidence: (id, evidenceImages, investigationNote, proposedSolution) => {
        const complaint = get().complaints.find((c) => c.systemId === id);
        if (!complaint) return;

        const action: ComplaintAction = {
          id: asSystemId(`action_${Date.now()}`),
          actionType: "investigated",
          performedBy: complaint.assignedTo || complaint.createdBy,
          performedAt: new Date(),
          note: investigationNote,
          images: evidenceImages,
        };

        get().updateComplaint(id, {
          evidenceImages,
          investigationNote,
          proposedSolution,
          timeline: [...complaint.timeline, action],
        });
      },

      verifyComplaint: (id, isCorrect, note) => {
        const complaint = get().complaints.find((c) => c.systemId === id);
        if (!complaint) return;

        const action: ComplaintAction = {
          id: asSystemId(`action_${Date.now()}`),
          actionType: "verified",
          performedBy: complaint.createdBy, // Manager verify
          performedAt: new Date(),
          note,
        };

        get().updateComplaint(id, {
          verification: isCorrect ? "verified-correct" : "verified-incorrect",
          isVerifiedCorrect: isCorrect,
          timeline: [...complaint.timeline, action],
        });
      },

      resolveComplaint: (id, resolution, resolutionNote, responsibleUserId) => {
        const complaint = get().complaints.find((c) => c.systemId === id);
        if (!complaint) return;

        const action: ComplaintAction = {
          id: asSystemId(`action_${Date.now()}`),
          actionType: "resolved",
          performedBy: complaint.createdBy, // Manager resolves
          performedAt: new Date(),
          note: resolutionNote,
        };

        get().updateComplaint(id, {
          status: "resolved",
          resolution,
          resolutionNote,
          responsibleUserId,
          resolvedBy: complaint.createdBy,
          resolvedAt: new Date(),
          timeline: [...complaint.timeline, action],
        });
      },

      rejectComplaint: (id, reason) => {
        const complaint = get().complaints.find((c) => c.systemId === id);
        if (!complaint) return;

        const action: ComplaintAction = {
          id: asSystemId(`action_${Date.now()}`),
          actionType: "rejected",
          performedBy: complaint.createdBy,
          performedAt: new Date(),
          note: reason,
        };

        get().updateComplaint(id, {
          status: "ended",
          resolution: "rejected",
          resolutionNote: reason,
          resolvedBy: complaint.createdBy,
          resolvedAt: new Date(),
          timeline: [...complaint.timeline, action],
        });
      },

      // =============================================
      // IMAGE ACTIONS
      // =============================================

      addComplaintImage: (id, image) => {
        const complaint = get().complaints.find((c) => c.systemId === id);
        if (!complaint) return;

        get().updateComplaint(id, {
          images: [...complaint.images, image],
        });
      },

      removeComplaintImage: (id, imageId) => {
        const complaint = get().complaints.find((c) => c.systemId === id);
        if (!complaint) return;

        get().updateComplaint(id, {
          images: complaint.images.filter((img) => img.id !== imageId),
        });
      },

      // =============================================
      // FILTER & SEARCH ACTIONS
      // =============================================

      setFilters: (filters) => {
        set((state) => ({
          filters: { ...state.filters, ...filters },
        }));
      },

      resetFilters: () => {
        set({ filters: defaultFilters });
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query });
      },

      setSelectedComplaint: (id) => {
        set({ selectedComplaintId: id });
      },

      // =============================================
      // COMPUTED GETTERS
      // =============================================

      getFilteredComplaints: () => {
        const { complaints, filters, searchQuery } = get();

        return complaints.filter((complaint) => {
          // Status filter
          if (filters.status !== "all" && complaint.status !== filters.status) {
            return false;
          }

          // Type filter
          if (filters.type !== "all" && complaint.type !== filters.type) {
            return false;
          }

          // Verification filter
          if (filters.verification !== "all" && complaint.verification !== filters.verification) {
            return false;
          }

          // Assignee filter
          if (filters.assignedTo !== "all" && complaint.assignedTo !== filters.assignedTo) {
            return false;
          }

          // Priority filter
          if (filters.priority !== "all" && complaint.priority !== filters.priority) {
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
              (complaint.orderCode || complaint.orderSystemId).toLowerCase().includes(query) || // [NOTE] Fallback
              complaint.customerName.toLowerCase().includes(query) ||
              complaint.customerPhone.includes(query) ||
              complaint.description.toLowerCase().includes(query) ||
              complaint.id.toLowerCase().includes(query) // Search by business ID too
            );
          }

          return true;
        });
      },

      getComplaintsByStatus: (status) => {
        return get().complaints.filter((c) => c.status === status);
      },

      getComplaintsByAssignee: (userId) => {
        return get().complaints.filter((c) => c.assignedTo === userId);
      },

      getStats: () => {
        const complaints = get().complaints;

        return {
          total: complaints.length,
          pending: complaints.filter((c) => c.status === "pending").length,
          investigating: complaints.filter((c) => c.status === "investigating").length,
          resolved: complaints.filter((c) => c.status === "resolved").length,
          rejected: complaints.filter((c) => c.resolution === "rejected").length,
          verifiedCorrect: complaints.filter((c) => c.verification === "verified-correct").length,
          verifiedIncorrect: complaints.filter((c) => c.verification === "verified-incorrect").length,
        };
      },
    }),
    {
      name: "complaint-storage",
      version: 4, // [NOTE] Updated for new ID system (COM000001)
      // Migration function to add publicTrackingCode and update ID format
      migrate: (persistedState: any, version: number) => {
        if (version < 4) {
          console.warn('[Complaints] Migrating to new ID system. Clearing old data...');
          // Clear old data and use fresh sample data
          return {
            complaints: [],
            filters: defaultFilters,
            searchQuery: "",
            selectedComplaintId: null,
          };
        }
        return persistedState;
      },
    }
  )
);
