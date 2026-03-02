/**
 * React Query hooks for employee document management
 * 
 * Replaces useDocumentStore (Zustand) with React Query caching.
 * - useEmployeeDocuments(systemId) — fetches & caches documents from FileUploadAPI
 * - useDocumentMutations(systemId) — upload, delete, updateFiles
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FileUploadAPI, type ServerFile } from '@/lib/file-upload-api';

// ─── Types ────────────────────────────────────────────────────
export type EmployeeDocument = {
  id: string;
  employeeSystemId: string;
  documentType: string;
  documentName: string;
  files: ServerFile[];
  createdAt: string;
  updatedAt: string;
};

// Re-export for convenience
export type { ServerFile } from '@/lib/file-upload-api';

// ─── Query Keys ───────────────────────────────────────────────
export const employeeDocumentKeys = {
  all: ['employee-documents'] as const,
  byEmployee: (id: string) => [...employeeDocumentKeys.all, id] as const,
};

// ─── Helpers ──────────────────────────────────────────────────
function groupFilesToDocuments(serverFiles: ServerFile[], _employeeSystemId: string): EmployeeDocument[] {
  const documentsMap = new Map<string, EmployeeDocument>();

  serverFiles.forEach(file => {
    const key = `${file.documentType}-${file.documentName}`;
    if (documentsMap.has(key)) {
      documentsMap.get(key)!.files.push(file);
    } else {
      documentsMap.set(key, {
        id: `doc-${key}`,
        employeeSystemId: file.employeeId,
        documentType: file.documentType,
        documentName: file.documentName,
        files: [file],
        createdAt: file.uploadedAt,
        updatedAt: file.confirmedAt || file.uploadedAt,
      });
    }
  });

  return Array.from(documentsMap.values());
}

// ─── Query Hook ───────────────────────────────────────────────
/**
 * Fetch & cache documents for a given employee.
 * Replaces: `useDocumentStore().refreshDocuments()` + `useDocumentStore().getDocuments()`
 */
export function useEmployeeDocuments(employeeSystemId: string | undefined) {
  return useQuery({
    queryKey: employeeDocumentKeys.byEmployee(employeeSystemId!),
    queryFn: async () => {
      const serverFiles = await FileUploadAPI.getFiles(employeeSystemId!);
      return groupFilesToDocuments(serverFiles, employeeSystemId!);
    },
    enabled: !!employeeSystemId,
  });
}

// ─── Mutation Hooks ───────────────────────────────────────────
/**
 * Mutations for document operations.
 * Replaces: `useDocumentStore().uploadFiles()`, `.deleteDocument()`, `.updateDocumentFiles()`
 */
export function useDocumentMutations(employeeSystemId: string | undefined) {
  const queryClient = useQueryClient();

  /** Upload files for an existing employee */
  const uploadFiles = useMutation({
    mutationFn: async (params: { documentType: string; documentName: string; files: File[] }) => {
      return FileUploadAPI.uploadFiles(employeeSystemId!, params.documentType, params.documentName, params.files);
    },
    onSuccess: () => {
      if (employeeSystemId) {
        queryClient.invalidateQueries({ queryKey: employeeDocumentKeys.byEmployee(employeeSystemId) });
      }
    },
  });

  /** Delete a document and all its files from server */
  const deleteDocument = useMutation({
    mutationFn: async (doc: EmployeeDocument) => {
      for (const file of doc.files) {
        await FileUploadAPI.deleteFile(file.id);
      }
    },
    onSuccess: () => {
      if (employeeSystemId) {
        queryClient.invalidateQueries({ queryKey: employeeDocumentKeys.byEmployee(employeeSystemId) });
      }
    },
  });

  /**
   * Optimistically update the cached document files (e.g. after confirming staging).
   * Replaces: `useDocumentStore().updateDocumentFiles()`
   */
  const updateDocumentFiles = (documentType: string, documentName: string, files: ServerFile[]) => {
    if (!employeeSystemId) return;
    queryClient.setQueryData<EmployeeDocument[]>(
      employeeDocumentKeys.byEmployee(employeeSystemId),
      (old) => {
        if (!old) {
          return [{
            id: `doc-${documentType}-${documentName}`,
            employeeSystemId,
            documentType,
            documentName,
            files,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }];
        }
        const existing = old.find(d => d.documentType === documentType && d.documentName === documentName);
        if (existing) {
          return old.map(d => d.id === existing.id ? { ...d, files, updatedAt: new Date().toISOString() } : d);
        }
        return [...old, {
          id: `doc-${documentType}-${documentName}`,
          employeeSystemId,
          documentType,
          documentName,
          files,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }];
      }
    );
  };

  /** Invalidate the cache to trigger a refetch */
  const invalidate = () => {
    if (employeeSystemId) {
      queryClient.invalidateQueries({ queryKey: employeeDocumentKeys.byEmployee(employeeSystemId) });
    }
  };

  return { uploadFiles, deleteDocument, updateDocumentFiles, invalidate };
}
