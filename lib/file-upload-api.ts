// ═══════════════════════════════════════════════════════════════
// FILE UPLOAD API - Using Next.js API Routes with Staging Support
// ═══════════════════════════════════════════════════════════════
// Full staging workflow:
// 1. Upload files to staging (default)
// 2. Confirm staging files when form is saved → permanent
// 3. Cancel staging files if user cancels form
// 4. Cleanup job deletes orphan staging files after 24h
// ═══════════════════════════════════════════════════════════════

import { generateSubEntityId } from '@/lib/id-utils';
import { logError } from '@/lib/logger'

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export type StagingFile = {
  id: string;
  sessionId: string;
  name: string;
  originalName: string;
  slug: string;
  filename: string;
  size: number;
  type: string;
  url: string;
  status: 'staging' | 'permanent';
  uploadedAt: string;
  metadata: string | Record<string, unknown>;
};

export type ServerFile = {
  id: string;
  employeeId: string;
  documentType: string;
  documentName: string;
  name: string;
  originalName: string;
  slug: string;
  filename: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
  confirmedAt?: string;
  metadata: string | Record<string, unknown>;
};

export type UploadedAsset = {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
};

export type UploadedFile = {
  id: string;
  name: string;
  filename?: string;
  type: string;
  size: number;
  url: string;
  uploadedAt?: string;
  metadata?: Record<string, unknown>;
};

// Response from /api/upload
interface UploadResponse {
  success: boolean;
  message?: string;
  data?: {
    id: string;
    fileName: string;
    originalName: string;
    mimeType: string;
    fileSize: number;
    url: string;
    thumbnailUrl?: string;
    entityType?: string;
    entityId?: string;
    documentType?: string;
    status?: 'staging' | 'permanent';
    sessionId?: string;
    createdAt?: string;
  };
}

// Response from /api/upload/confirm
interface ConfirmResponse {
  success: boolean;
  message?: string;
  data?: {
    confirmedCount: number;
    files: Array<{
      id: string;
      fileName: string;
      originalName: string;
      mimeType: string;
      fileSize: number;
      url: string;
      entityType: string;
      entityId: string;
      status: string;
    }>;
  };
}

// ═══════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════

function generateSessionId(): string {
  return generateSubEntityId('SESSION');
}

function mapResponseToStagingFile(data: UploadResponse['data'], sessionId: string): StagingFile {
  if (!data) throw new Error('No data in response');
  
  return {
    id: data.id,
    sessionId: data.sessionId || sessionId,
    name: data.originalName,
    originalName: data.originalName,
    slug: data.fileName,
    filename: data.fileName,
    size: data.fileSize,
    type: data.mimeType,
    url: data.url,
    status: data.status || 'staging',
    uploadedAt: data.createdAt || new Date().toISOString(),
    metadata: {},
  };
}

function mapResponseToServerFile(data: UploadResponse['data'], entityId: string, documentType: string, documentName: string): ServerFile {
  if (!data) throw new Error('No data in response');
  
  return {
    id: data.id,
    employeeId: entityId,
    documentType,
    documentName,
    name: data.originalName,
    originalName: data.originalName,
    slug: data.fileName,
    filename: data.fileName,
    size: data.fileSize,
    type: data.mimeType,
    url: data.url,
    uploadedAt: data.createdAt || new Date().toISOString(),
    metadata: {},
  };
}

// ═══════════════════════════════════════════════════════════════
// MAIN API CLASS
// ═══════════════════════════════════════════════════════════════

export class FileUploadAPI {
  /**
   * Upload files to staging
   * Files are uploaded with status='staging' by default
   * Call confirmStagingFiles() when form is saved to make them permanent
   */
  static async uploadToStaging(files: File[], sessionId?: string): Promise<{
    files: StagingFile[];
    sessionId: string;
  }> {
    const actualSessionId = sessionId || generateSessionId();
    const uploadedFiles: StagingFile[] = [];


    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('entityType', 'temp');
      formData.append('sessionId', actualSessionId); // Track session for later confirm/cancel
      formData.append('status', 'staging'); // Upload as staging by default
      formData.append('isImage', String(file.type.startsWith('image/')));


      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result: UploadResponse = await response.json();


      if (!result.success || !result.data) {
        throw new Error(result.message || 'Upload failed');
      }

      uploadedFiles.push(mapResponseToStagingFile(result.data, actualSessionId));
    }

    return {
      files: uploadedFiles,
      sessionId: actualSessionId,
    };
  }

  /**
   * Confirm staging files - converts them to permanent
   * Call this when user saves the form
   * 
   * @param sessionId - Session ID to confirm all files from that session
   * @param entitySystemId - Entity ID to associate files with (e.g., employee ID)
   * @param documentType - Document type for categorization
   * @param documentName - Document name (optional, for display)
   * @param metadata - Additional metadata (optional)
   */
  static async confirmStagingFiles(
    sessionId: string,
    entitySystemId: string,
    documentType: string,
    documentName: string,
    metadata?: Record<string, unknown>
  ): Promise<ServerFile[]> {
    try {
      const response = await fetch('/api/upload/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          entityType: documentType, // Use the actual entity type (customers, products, employees, etc.)
          entityId: entitySystemId,
          documentType, // Document category (legal, work-process, etc.)
          documentName, // Document name (customer-images, thumbnail, etc.)
        }),
      });

      const result: ConfirmResponse = await response.json();

      if (!result.success) {
        logError('[FileUploadAPI] confirmStagingFiles failed', null, { message: result.message });
        return [];
      }

      // API returns flat response (not wrapped in data), but ConfirmResponse type expects data wrapper
      // Handle both cases for backward compatibility
      type FlatConfirmResponse = ConfirmResponse & { confirmedCount?: number; files?: NonNullable<ConfirmResponse['data']>['files'] };
      const flatResult = result as FlatConfirmResponse;
      const _confirmedCount = flatResult.confirmedCount ?? result.data?.confirmedCount ?? 0;
      const files = flatResult.files ?? result.data?.files ?? [];

      // Map response to ServerFile format
      return files.map((f) => ({
        id: f.id,
        employeeId: entitySystemId,
        documentType,
        documentName,
        name: f.originalName,
        originalName: f.originalName,
        slug: f.fileName,
        filename: f.fileName,
        size: f.fileSize,
        type: f.mimeType,
        url: f.url,
        uploadedAt: new Date().toISOString(),
        confirmedAt: new Date().toISOString(),
        metadata: metadata || {},
      }));
    } catch (error) {
      logError('[FileUploadAPI] confirmStagingFiles error', error);
      return [];
    }
  }

  /**
   * Confirm staging files by file IDs (alternative method)
   */
  static async confirmFilesByIds(
    fileIds: string[],
    entitySystemId: string,
    documentType: string
  ): Promise<ServerFile[]> {
    try {
      const response = await fetch('/api/upload/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileIds,
          entityType: documentType,
          entityId: entitySystemId,
        }),
      });

      const result: ConfirmResponse = await response.json();

      if (!result.success) {
        logError('[FileUploadAPI] confirmFilesByIds failed', null, { message: result.message });
        return [];
      }

      // Handle flat response (API doesn't wrap in data)
      type FlatConfirmResponse = ConfirmResponse & { files?: NonNullable<ConfirmResponse['data']>['files'] };
      const flatResult = result as FlatConfirmResponse;
      const files = flatResult.files ?? result.data?.files ?? [];

      return files.map((f) => ({
        id: f.id,
        employeeId: entitySystemId,
        documentType,
        documentName: '',
        name: f.originalName,
        originalName: f.originalName,
        slug: f.fileName,
        filename: f.fileName,
        size: f.fileSize,
        type: f.mimeType,
        url: f.url,
        uploadedAt: new Date().toISOString(),
        metadata: {},
      }));
    } catch (error) {
      logError('[FileUploadAPI] confirmFilesByIds error', error);
      return [];
    }
  }

  /**
   * Cancel/delete staging files
   * Call this when user cancels the form
   */
  static async cancelStagingFiles(sessionId: string): Promise<void> {
    try {
      const response = await fetch(`/api/upload/confirm?sessionId=${sessionId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!result.success) {
        logError('[FileUploadAPI] cancelStagingFiles failed', null, { message: result.message });
      }
    } catch (error) {
      logError('[FileUploadAPI] cancelStagingFiles error', error);
    }
  }

  /**
   * Get files by entity (only permanent files by default)
   */
  static async getFiles(
    entityId: string,
    entityType?: string,
    includeStaging?: boolean
  ): Promise<ServerFile[]> {
    try {
      const params = new URLSearchParams();
      params.append('entityId', entityId);
      if (entityType) params.append('entityType', entityType);
      if (includeStaging) params.append('includeStaging', 'true');

      const response = await fetch(`/api/upload?${params}`);
      const result = await response.json();

      if (!result.success) {
        return [];
      }

      return (result.data || []).map((file: UploadResponse['data'] & { documentName?: string }) => ({
        id: file?.id || '',
        employeeId: entityId,
        documentType: file?.documentType || entityType || '',
        documentName: file?.documentName || '',
        name: file?.originalName || '',
        originalName: file?.originalName || '',
        slug: file?.fileName || '',
        filename: file?.fileName || '',
        size: file?.fileSize || 0,
        type: file?.mimeType || '',
        url: file?.url || '',
        uploadedAt: file?.createdAt || '',
        metadata: {},
      }));
    } catch (_error) {
      return [];
    }
  }

  /**
   * Batch get files for multiple entities at once
   * Returns a Map of entityId -> ServerFile[]
   */
  static async getBatchFiles(
    entityIds: string[],
    entityType?: string
  ): Promise<Map<string, ServerFile[]>> {
    const resultMap = new Map<string, ServerFile[]>();
    
    if (!entityIds.length) return resultMap;
    
    // Initialize all IDs with empty arrays
    entityIds.forEach(id => resultMap.set(id, []));
    
    try {
      const params = new URLSearchParams();
      params.append('entityIds', entityIds.join(','));
      if (entityType) params.append('entityType', entityType);

      const response = await fetch(`/api/upload?${params}`);
      const result = await response.json();

      if (!result.success || !result.data) {
        return resultMap;
      }

      // Group files by entityId
      for (const file of result.data) {
        const id = file.entityId;
        if (!id) continue;
        
        const serverFile: ServerFile = {
          id: file?.id || '',
          employeeId: id,
          documentType: file?.documentType || entityType || '',
          documentName: file?.documentName || '',
          name: file?.originalName || '',
          originalName: file?.originalName || '',
          slug: file?.fileName || '',
          filename: file?.fileName || '',
          size: file?.fileSize || 0,
          type: file?.mimeType || '',
          url: file?.url || '',
          uploadedAt: file?.createdAt || '',
          metadata: {},
        };
        
        const existing = resultMap.get(id) || [];
        existing.push(serverFile);
        resultMap.set(id, existing);
      }
      
      return resultMap;
    } catch (_error) {
      return resultMap;
    }
  }

  /**
   * Batch get product files for multiple products at once
   */
  static async getBatchProductFiles(productIds: string[]): Promise<Map<string, ServerFile[]>> {
    return this.getBatchFiles(productIds, 'products');
  }

  /**
   * Get staging files by session ID
   */
  static async getStagingFiles(sessionId: string): Promise<StagingFile[]> {
    try {
      const params = new URLSearchParams();
      params.append('sessionId', sessionId);

      const response = await fetch(`/api/upload?${params}`);
      const result = await response.json();

      if (!result.success) {
        return [];
      }

      return (result.data || []).map((file: UploadResponse['data']) => 
        mapResponseToStagingFile(file, sessionId)
      );
    } catch (_error) {
      return [];
    }
  }

  /**
   * Delete file
   */
  static async deleteFile(fileId: string): Promise<void> {
    const response = await fetch(`/api/upload/${fileId}?hard=true`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Delete failed');
    }
  }

  /**
   * Get file URL (backward compatibility)
   */
  static getFileUrl(file: StagingFile | ServerFile): string {
    return file.url;
  }

  /**
   * Generate session ID
   */
  static generateSessionId(): string {
    return generateSessionId();
  }

  // ═══════════════════════════════════════════════════════════════
  // LEGACY METHODS (kept for backward compatibility)
  // ═══════════════════════════════════════════════════════════════

  static async deleteStagingFiles(sessionId: string): Promise<void> {
    return this.cancelStagingFiles(sessionId);
  }

  static async deleteStagingSession(sessionId: string): Promise<void> {
    return this.cancelStagingFiles(sessionId);
  }

  static async uploadFiles(
    employeeId: string,
    documentType: string,
    documentName: string,
    files: File[]
  ): Promise<ServerFile[]> {
    const uploadedFiles: ServerFile[] = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('entityType', 'employees');
      formData.append('entityId', employeeId);
      formData.append('documentType', documentType);
      formData.append('status', 'permanent'); // Direct upload as permanent
      formData.append('isImage', String(file.type.startsWith('image/')));

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result: UploadResponse = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.message || 'Upload failed');
      }

      uploadedFiles.push(mapResponseToServerFile(result.data, employeeId, documentType, documentName));
    }

    return uploadedFiles;
  }

  static async getProductFiles(productId: string): Promise<ServerFile[]> {
    return this.getFiles(productId, 'products');
  }

  static async getCustomerFiles(customerId: string): Promise<ServerFile[]> {
    return this.getFiles(customerId, 'customers');
  }

  static async getCustomerContractFiles(customerId: string): Promise<ServerFile[]> {
    return this.getFiles(customerId, 'contracts');
  }

  static async confirmCustomerContractFiles(
    sessionId: string,
    customerId: string,
    _customerData?: Record<string, unknown>
  ): Promise<ServerFile[]> {
    return this.confirmStagingFiles(sessionId, customerId, 'contracts', 'customer-contracts');
  }

  static async confirmCustomerImages(
    sessionId: string,
    customerId: string,
    _customerData?: Record<string, unknown>
  ): Promise<ServerFile[]> {
    return this.confirmStagingFiles(sessionId, customerId, 'customers', 'customer-images');
  }

  static async confirmWarrantyImages(
    sessionId: string,
    warrantyId: string,
    imageType: 'received' | 'processed',
    _warrantyData?: Record<string, unknown>
  ): Promise<ServerFile[]> {
    return this.confirmStagingFiles(sessionId, warrantyId, `warranty-${imageType}`, `warranty-${imageType}-images`);
  }

  static async getStorageInfo(): Promise<{
    totalFiles: number;
    totalSize: number;
    totalSizeMB: number;
  }> {
    try {
      const response = await fetch('/api/upload/cleanup');
      const result = await response.json();
      
      if (!result.success) {
        return { totalFiles: 0, totalSize: 0, totalSizeMB: 0 };
      }
      
      const permanent = result.data?.permanent || { totalFiles: 0, totalSize: 0 };
      const staging = result.data?.staging || { totalFiles: 0, totalSize: 0 };
      
      const totalFiles = permanent.totalFiles + staging.totalFiles;
      const totalSize = permanent.totalSize + staging.totalSize;
      
      return {
        totalFiles,
        totalSize,
        totalSizeMB: Math.round(totalSize / (1024 * 1024) * 100) / 100,
      };
    } catch (_error) {
      return { totalFiles: 0, totalSize: 0, totalSizeMB: 0 };
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // EDITOR & COMMENT UPLOADS
  // ═══════════════════════════════════════════════════════════════

  static async uploadEditorImageToStaging(file: File, sessionId?: string): Promise<{
    file: StagingFile;
    sessionId: string;
  }> {
    const result = await FileUploadAPI.uploadToStaging([file], sessionId);
    return {
      file: result.files[0],
      sessionId: result.sessionId,
    };
  }

  static async confirmEditorImages(
    sessionId: string,
    entityId: string,
    entityType: string,
    htmlContent: string
  ): Promise<{ html: string; files: ServerFile[] }> {
    // Confirm all staging images from this session
    const files = await this.confirmStagingFiles(sessionId, entityId, entityType, 'editor-images');
    return {
      html: htmlContent,
      files,
    };
  }

  static async uploadCommentImage(file: File): Promise<UploadedAsset> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('entityType', 'comments');
    formData.append('status', 'permanent'); // Comments are always permanent
    formData.append('isImage', 'true');

    const response = await fetch('/api/upload/image', {
      method: 'POST',
      body: formData,
    });

    const result: UploadResponse = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Upload failed');
    }

    return {
      id: result.data.id,
      name: result.data.originalName,
      size: result.data.fileSize,
      type: result.data.mimeType,
      url: result.data.url,
      uploadedAt: result.data.createdAt || new Date().toISOString(),
    };
  }

  static async uploadPrintTemplateImage(file: File): Promise<UploadedAsset> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('entityType', 'print-templates');
    formData.append('status', 'permanent'); // Print templates are always permanent
    formData.append('isImage', 'true');

    const response = await fetch('/api/upload/image', {
      method: 'POST',
      body: formData,
    });

    const result: UploadResponse = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Upload failed');
    }

    return {
      id: result.data.id,
      name: result.data.originalName,
      size: result.data.fileSize,
      type: result.data.mimeType,
      url: result.data.url,
      uploadedAt: result.data.createdAt || new Date().toISOString(),
    };
  }

  static async uploadComplaintCommentImage(complaintId: string, file: File): Promise<UploadedAsset> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('entityType', 'complaints');
    formData.append('entityId', complaintId);
    formData.append('status', 'permanent'); // Complaint images are always permanent
    formData.append('isImage', 'true');

    const response = await fetch('/api/upload/image', {
      method: 'POST',
      body: formData,
    });

    const result: UploadResponse = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Upload failed');
    }

    return {
      id: result.data.id,
      name: result.data.originalName,
      size: result.data.fileSize,
      type: result.data.mimeType,
      url: result.data.url,
      uploadedAt: result.data.createdAt || new Date().toISOString(),
    };
  }

  static async uploadTaskEvidence(taskId: string, files: File[]): Promise<UploadedAsset[]> {
    if (files.length === 0) return [];

    const uploadedFiles: UploadedAsset[] = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('entityType', 'tasks');
      formData.append('entityId', taskId);
      formData.append('documentType', 'evidence');
      formData.append('status', 'permanent'); // Task evidence is always permanent
      formData.append('isImage', String(file.type.startsWith('image/')));

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result: UploadResponse = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.message || 'Upload failed');
      }

      uploadedFiles.push({
        id: result.data.id,
        name: result.data.originalName,
        size: result.data.fileSize,
        type: result.data.mimeType,
        url: result.data.url,
        uploadedAt: result.data.createdAt || new Date().toISOString(),
      });
    }

    return uploadedFiles;
  }
}
