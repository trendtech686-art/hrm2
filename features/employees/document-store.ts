import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { FileUploadAPI, type ServerFile, type StagingFile } from '../../lib/file-upload-api';

// Re-export types for easier importing
export type { ServerFile, StagingFile } from '../../lib/file-upload-api';

export type EmployeeDocument = {
  id: string;
  employeeSystemId: string;
  documentType: string; // 'legal', 'work-process', 'termination', 'decisions', 'kpi', 'requests'
  documentName: string; // e.g., "Sơ yếu lý lịch", "Hợp đồng lao động"
  files: ServerFile[]; // Permanent files only
  createdAt: string;
  updatedAt: string;
};

// Staging documents (temporary, in-memory only)
export type StagingDocument = {
  documentType: string;
  documentName: string;
  files: StagingFile[];
  sessionId: string;
};

type DocumentStore = {
  documents: EmployeeDocument[];
  stagingDocuments: Record<string, StagingDocument>; // Key: `${documentType}-${documentName}`
  loadedEmployees: Set<string>; // Track which employees have been loaded
  
  // Staging operations (for new employees)
  updateStagingDocument: (documentType: string, documentName: string, files: StagingFile[], sessionId: string) => void;
  getStagingDocument: (documentType: string, documentName: string) => StagingDocument | undefined;
  clearStagingDocuments: () => void;
  confirmAllStagingDocuments: (
    employeeSystemId: string,
    employeeData?: {
      name?: string;
      department?: string;
      [key: string]: any;
    }
  ) => Promise<void>;
  
  // Upload files thông qua API (existing employees)
  uploadFiles: (
    employeeSystemId: string,
    documentType: string,
    documentName: string,
    files: File[]
  ) => Promise<void>;
  
  // Get documents (từ server nếu cần)
  getDocuments: (employeeSystemId: string, documentType?: string) => EmployeeDocument[];
  refreshDocuments: (employeeSystemId: string, force?: boolean) => Promise<void>;
  
  // Get single document
  getDocument: (id: string) => EmployeeDocument | undefined;
  
  // Update files cho document (sau khi upload)
  updateDocumentFiles: (
    employeeSystemId: string, 
    documentType: string, 
    documentName: string, 
    files: ServerFile[]
  ) => void;
  
  // Delete document (và files trên server)
  deleteDocument: (id: string) => Promise<void>;
  deleteEmployeeDocuments: (employeeSystemId: string) => Promise<void>;
  
  // Storage info
  getStorageInfo: () => Promise<{ totalFiles: number; totalSizeMB: number }>;
};

export const useDocumentStore = create<DocumentStore>()(
  persist(
    (set, get) => ({
      documents: [],
      stagingDocuments: {},
      loadedEmployees: new Set<string>(),
      
      // Staging operations
      updateStagingDocument: (documentType, documentName, files, sessionId) => {
        const key = `${documentType}-${documentName}`;
        set(state => ({
          stagingDocuments: {
            ...state.stagingDocuments,
            [key]: {
              documentType,
              documentName,
              files,
              sessionId
            }
          }
        }));
      },
      
      getStagingDocument: (documentType, documentName) => {
        const key = `${documentType}-${documentName}`;
        return get().stagingDocuments[key];
      },
      
      clearStagingDocuments: () => {
        set({ stagingDocuments: {} });
      },
      
      confirmAllStagingDocuments: async (employeeSystemId, employeeData) => {
        const stagingDocs = get().stagingDocuments;
        
        try {
          for (const [key, stagingDoc] of Object.entries(stagingDocs)) {
            if (stagingDoc.files.length > 0) {
              // Confirm staging files → permanent với smart filename
              const confirmedFiles = await FileUploadAPI.confirmStagingFiles(
                stagingDoc.sessionId,
                employeeSystemId,
                stagingDoc.documentType,
                stagingDoc.documentName,
                employeeData // Gửi employee data để tạo smart filename
              );
              
              // Update local documents với confirmed files
              get().updateDocumentFiles(
                employeeSystemId,
                stagingDoc.documentType,
                stagingDoc.documentName,
                confirmedFiles
              );
            }
          }
          
          // Clear staging sau khi confirm
          get().clearStagingDocuments();
          
        } catch (error) {

          throw error;
        }
      },
      
      // Upload files lên server (for existing employees)
      uploadFiles: async (employeeSystemId, documentType, documentName, files) => {
        try {
          const uploadedFiles = await FileUploadAPI.uploadFiles(
            employeeSystemId,
            documentType,
            documentName,
            files
          );
          
          // Cập nhật local store với files đã upload
          get().updateDocumentFiles(employeeSystemId, documentType, documentName, uploadedFiles);
        } catch (error) {

          throw error;
        }
      },
      
      // Refresh documents từ server
      refreshDocuments: async (employeeSystemId, force = false) => {
        const state = get();
        
        // ✅ OPTIMIZATION: Check cache FIRST - return immediately if already loaded (unless forced)
        if (!force && state.loadedEmployees.has(employeeSystemId)) {

          return;
        }
        
        if (force) {

          // Clear cache for this employee
          set(state => {
            const newLoadedEmployees = new Set(state.loadedEmployees);
            newLoadedEmployees.delete(employeeSystemId);
            return {
              loadedEmployees: newLoadedEmployees,
              // Also clear old documents for this employee
              documents: state.documents.filter(doc => doc.employeeSystemId !== employeeSystemId)
            };
          });
        } else {

        }
        
        try {
          const serverFiles = await FileUploadAPI.getFiles(employeeSystemId);
          
          // If no files, just mark as loaded and return
          if (serverFiles.length === 0) {

            set(state => ({
              loadedEmployees: new Set([...state.loadedEmployees, employeeSystemId])
            }));
            return;
          }
          
          // Group files theo documentType và documentName
          const documentsMap = new Map<string, EmployeeDocument>();
          
          serverFiles.forEach(file => {
            const key = `${file.documentType}-${file.documentName}`;
            
            if (documentsMap.has(key)) {
              documentsMap.get(key)!.files.push(file);
            } else {
              documentsMap.set(key, {
                id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                employeeSystemId: file.employeeId,
                documentType: file.documentType,
                documentName: file.documentName,
                files: [file],
                createdAt: file.uploadedAt,
                updatedAt: file.confirmedAt || file.uploadedAt,
              });
            }
          });
          
          // Cập nhật store với documents từ server
          const serverDocuments = Array.from(documentsMap.values());
          set(state => ({
            documents: [
              ...state.documents.filter(d => d.employeeSystemId !== employeeSystemId),
              ...serverDocuments
            ],
            loadedEmployees: new Set([...state.loadedEmployees, employeeSystemId])
          }));
        } catch (error) {

          throw error;
        }
      },
      
      getDocuments: (employeeSystemId: string, documentType?: string) => {
        const docs = get().documents.filter(d => d.employeeSystemId === employeeSystemId);
        if (documentType) {
          return docs.filter(d => d.documentType === documentType);
        }
        return docs;
      },
      
      getDocument: (id: string) => {
        return get().documents.find(d => d.id === id);
      },
      
      updateDocumentFiles: (employeeSystemId, documentType, documentName, files) => {
        const existing = get().documents.find(
          d => d.employeeSystemId === employeeSystemId && 
               d.documentType === documentType && 
               d.documentName === documentName
        );
        
        if (existing) {
          set(state => ({
            documents: state.documents.map(d =>
              d.id === existing.id
                ? { ...d, files, updatedAt: new Date().toISOString() }
                : d
            ),
          }));
        } else {
          const newDoc: EmployeeDocument = {
            id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            employeeSystemId,
            documentType,
            documentName,
            files,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          set(state => ({ documents: [...state.documents, newDoc] }));
        }
      },
      
      deleteDocument: async (id: string) => {
        const doc = get().getDocument(id);
        if (doc) {
          // Xóa tất cả files trên server
          try {
            for (const file of doc.files) {
              await FileUploadAPI.deleteFile(file.id);
            }
          } catch (error) {

          }
          
          // Xóa document khỏi local store
          set(state => ({
            documents: state.documents.filter(d => d.id !== id),
          }));
        }
      },
      
      deleteEmployeeDocuments: async (employeeSystemId: string) => {
        const docs = get().getDocuments(employeeSystemId);
        
        // Xóa tất cả files trên server
        try {
          for (const doc of docs) {
            for (const file of doc.files) {
              await FileUploadAPI.deleteFile(file.id);
            }
          }
        } catch (error) {

        }
        
        // Xóa khỏi local store
        set(state => ({
          documents: state.documents.filter(d => d.employeeSystemId !== employeeSystemId),
        }));
      },
      
      getStorageInfo: async () => {
        try {
          const stats = await FileUploadAPI.getStorageInfo();
          return {
            totalFiles: stats.totalFiles,
            totalSizeMB: stats.totalSizeMB
          };
        } catch (error) {

          return { totalFiles: 0, totalSizeMB: 0 };
        }
      },
    }),
    {
      name: 'hrm-documents-metadata', // Chỉ lưu metadata, files thực tế ở server
      storage: createJSONStorage(() => localStorage),
      // Persist documents và loadedEmployees để cache hoạt động qua sessions
      partialize: (state) => ({ 
        documents: state.documents,
        loadedEmployees: Array.from(state.loadedEmployees) // Convert Set to Array for JSON
      }),
      // Rehydrate loadedEmployees từ Array về Set
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray((state as any).loadedEmployees)) {
          state.loadedEmployees = new Set((state as any).loadedEmployees);
        }
      }
    }
  )
);
