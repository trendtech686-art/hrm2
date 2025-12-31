// API client để giao tiếp với server - Staging System
import { getApiBaseUrl } from './api-config';

const API_BASE_URL = getApiBaseUrl();

export type StagingFile = {
  id: string;
  sessionId: string;
  name: string; // Display name (smart filename với metadata)
  originalName: string; // Tên file gốc
  slug: string; // URL-safe slug
  filename: string; // Tên file hệ thống (UUID) - cần cho preview URL
  size: number;
  type: string;
  url: string;
  status: 'staging' | 'permanent'; // ✅ Support both staging and permanent files
  uploadedAt: string;
  metadata: string | Record<string, unknown>; // Smart filename metadata - can be JSON string or object
};

export type ServerFile = {
  id: string;
  employeeId: string;
  documentType: string;
  documentName: string;
  name: string; // Display name
  originalName: string; // Tên file gốc
  slug: string; // URL-safe slug
  filename: string; // Tên file hệ thống
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
  confirmedAt?: string;
  metadata: string | Record<string, unknown>; // Smart filename metadata - can be JSON string or object
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

// Response type from file upload endpoints
type UploadedFileResponse = {
  id: string;
  name?: string;
  originalName?: string;
  size?: number;
  filesize?: number;
  type?: string;
  mimetype?: string;
  url: string;
  uploadedAt?: string;
};

export class FileUploadAPI {
  // Upload files vào staging (tạm thời)
  static async uploadToStaging(files: File[], sessionId?: string): Promise<{
    files: StagingFile[];
    sessionId: string;
  }> {
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('files', file);
    });

    // CRITICAL FIX: sessionId in FormData doesn't work with multer
    // Send via query params instead
    const url = sessionId 
      ? `${API_BASE_URL}/staging/upload?sessionId=${encodeURIComponent(sessionId)}`
      : `${API_BASE_URL}/staging/upload`;

    console.log('📤 Uploading to:', url);
    console.log('📦 Files:', files.map(f => `${f.name} (${(f.size / 1024).toFixed(1)}KB)`));

    let response;
    try {
      response = await fetch(url, {
        method: 'POST',
        body: formData,
      });
    } catch (fetchError) {
      console.error('❌ Network fetch failed:', fetchError);
      throw new Error(`Không thể kết nối đến server (${API_BASE_URL}). Vui lòng kiểm tra server có đang chạy.`);
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Server error:', response.status, errorText);
      throw new Error(`Server error (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Staging upload failed');
    }

    return {
      files: result.files,
      sessionId: result.sessionId
    };
  }

  // Confirm staging files → permanent với smart filename
  // NOTE: entitySystemId MUST be immutable (systemId) to avoid broken references
  static async confirmStagingFiles(
    sessionId: string,
    entitySystemId: string,
    documentType: string,
    documentName: string,
    metadata?: Record<string, unknown>
  ): Promise<ServerFile[]> {
    const response = await fetch(
      `${API_BASE_URL}/staging/confirm/${sessionId}/${entitySystemId}/${documentType}/${encodeURIComponent(documentName)}`,
      { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ metadata })
      }
    );

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Confirm failed');
    }

    return result.files;
  }

  // Lấy staging files theo session
  static async getStagingFiles(sessionId: string): Promise<StagingFile[]> {
    const response = await fetch(`${API_BASE_URL}/staging/files/${sessionId}`);
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch staging files');
    }

    return result.files;
  }

  // Xóa staging files (cancel)
  static async deleteStagingFiles(sessionId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/staging/${sessionId}`, {
      method: 'DELETE',
    });

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Delete staging failed');
    }
  }

  // Upload files lên server (legacy - direct permanent)
  // NOTE: employeeId MUST be the systemId (immutable), NOT the business ID
  static async uploadFiles(
    employeeId: string, // ⚠️ MUST use systemId (e.g., "NV00000001"), NOT business ID
    documentType: string,
    documentName: string,
    files: File[]
  ): Promise<ServerFile[]> {
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await fetch(
      `${API_BASE_URL}/upload/${employeeId}/${documentType}/${encodeURIComponent(documentName)}`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Upload failed');
    }

    return result.files;
  }

  // Lấy danh sách file permanent
  // NOTE: employeeId MUST be the systemId (immutable), NOT the business ID
  static async getFiles(
    employeeId: string, // ⚠️ MUST use systemId (e.g., "NV00000001"), NOT business ID
    documentType?: string
  ): Promise<ServerFile[]> {
    try {
      const url = documentType 
        ? `${API_BASE_URL}/files/${employeeId}/${documentType}`
        : `${API_BASE_URL}/files/${employeeId}`;

      const response = await fetch(url);
      
      // Check if response is ok
      if (!response.ok) {
        return []; // Return empty array instead of throwing
      }
      
      const result = await response.json();
      
      if (!result.success) {
        return []; // Return empty array instead of throwing
      }

      return result.files || [];
    } catch (_error) {
      return []; // Return empty array on network error
    }
  }

  // Xóa file permanent
  static async deleteFile(fileId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/files/${fileId}`, {
      method: 'DELETE',
    });

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Delete failed');
    }
  }

  // Lấy URL file để hiển thị (bao gồm staging và permanent)
  static getFileUrl(file: StagingFile | ServerFile): string {
    // ✅ Return relative path to use Vite proxy - avoid CORS
    // Server already returns relative path like /api/staging/files/...
    return file.url;
  }

  // Thống kê storage (chỉ permanent files)
  static async getStorageInfo(): Promise<{
    totalFiles: number;
    totalSize: number;
    totalSizeMB: number;
  }> {
    const response = await fetch(`${API_BASE_URL}/storage/info`);
    const result = await response.json();
    
    if (!result.success) {
      throw new Error('Failed to get storage info');
    }

    return result.stats;
  }

  // Helper: Generate session ID cho staging
  static generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static async getProductFiles(productId: string): Promise<ServerFile[]> {
    return this.getFiles(productId, 'products');
  }

  // Get customer files (images)
  static async getCustomerFiles(customerId: string): Promise<ServerFile[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/files/customers/${customerId}`);
      
      if (!response.ok) {
        return [];
      }
      
      const result = await response.json();
      
      if (!result.success) {
        return [];
      }

      return result.files || [];
    } catch (error) {
      console.error('Failed to get customer files:', error);
      return [];
    }
  }

  // Get customer contract files
  static async getCustomerContractFiles(customerId: string): Promise<ServerFile[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/files/customers/${customerId}/contracts`);
      
      if (!response.ok) {
        return [];
      }
      
      const result = await response.json();
      
      if (!result.success) {
        return [];
      }

      return result.files || [];
    } catch (error) {
      console.error('Failed to get customer contract files:', error);
      return [];
    }
  }

  // Confirm customer contract files from staging to permanent
  static async confirmCustomerContractFiles(
    sessionId: string,
    customerId: string,
    customerData?: Record<string, unknown>
  ): Promise<ServerFile[]> {
    const response = await fetch(
      `${API_BASE_URL}/staging/confirm/${sessionId}/customers/${customerId}/contracts`,
      { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ customerData })
      }
    );

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Confirm customer contract files failed');
    }

    return result.files;
  }

  // Confirm customer images from staging to permanent
  static async confirmCustomerImages(
    sessionId: string,
    customerId: string,
    customerData?: {
      name?: string;
      [key: string]: unknown;
    }
  ): Promise<ServerFile[]> {
    const response = await fetch(
      `${API_BASE_URL}/staging/confirm/${sessionId}/customers/${customerId}`,
      { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ customerData })
      }
    );

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Confirm customer images failed');
    }

    return result.files;
  }

  // Confirm warranty images from staging to permanent
  static async confirmWarrantyImages(
    sessionId: string,
    warrantyId: string,
    imageType: 'received' | 'processed',
    warrantyData?: {
      customerName?: string;
      [key: string]: unknown;
    }
  ): Promise<ServerFile[]> {
    const response = await fetch(
      `${API_BASE_URL}/staging/confirm/${sessionId}/warranty/${warrantyId}/${imageType}`,
      { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ warrantyData })
      }
    );

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Confirm warranty images failed');
    }

    return result.files;
  }

  // Delete staging session (cleanup on cancel)
  static async deleteStagingSession(sessionId: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/staging/${sessionId}`,
      { method: 'DELETE' }
    );

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Delete staging session failed');
    }
  }

  /**
   * Upload ảnh từ TipTap Editor vào STAGING
   * Ảnh sẽ được move sang permanent khi entity được save
   * 
   * @param file - File ảnh cần upload
   * @param sessionId - Session ID để group các ảnh cùng editor
   * @returns StagingFile với URL tạm thời
   */
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

  /**
   * Confirm ảnh editor từ staging sang permanent
   * Đồng thời replace staging URLs trong HTML content bằng permanent URLs
   * 
   * @param sessionId - Editor staging session
   * @param entityId - ID của entity (category, product, etc.)
   * @param entityType - Loại entity ('categories', 'products', etc.)
   * @param htmlContent - Nội dung HTML cần update URLs
   * @returns Updated HTML với permanent URLs
   */
  static async confirmEditorImages(
    sessionId: string,
    entityId: string,
    entityType: string,
    htmlContent: string
  ): Promise<{ html: string; files: ServerFile[] }> {
    // Confirm staging files
    const confirmedFiles = await FileUploadAPI.confirmStagingFiles(
      sessionId,
      entityId,
      entityType,
      'editor-images',
      { source: 'tiptap-editor' }
    );

    // Replace staging URLs with permanent URLs in HTML
    let updatedHtml = htmlContent;
    for (const file of confirmedFiles) {
      // Staging URL pattern: /api/staging/preview/{sessionId}/{filename}
      // Find and replace with permanent URL
      const stagingPattern = new RegExp(
        `/api/staging/preview/[^/]+/${file.filename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`,
        'g'
      );
      updatedHtml = updatedHtml.replace(stagingPattern, file.url);
    }

    return {
      html: updatedHtml,
      files: confirmedFiles,
    };
  }

  static async uploadCommentImage(file: File): Promise<UploadedAsset> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/comments/upload-image`, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Upload ảnh bình luận thất bại');
    }

    return FileUploadAPI.mapDirectUpload(result.file, file.name);
  }

  static async uploadPrintTemplateImage(file: File): Promise<UploadedAsset> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/print-templates/upload-image`, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Upload ảnh mẫu in thất bại');
    }

    return FileUploadAPI.mapDirectUpload(result.file, file.name);
  }

  static async uploadComplaintCommentImage(complaintId: string, file: File): Promise<UploadedAsset> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/complaints/${complaintId}/comments/upload`, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Upload ảnh khiếu nại thất bại');
    }

    return FileUploadAPI.mapDirectUpload(result.file, file.name);
  }

  static async uploadTaskEvidence(taskId: string, files: File[]): Promise<UploadedAsset[]> {
    if (files.length === 0) {
      return [];
    }

    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/evidence`, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Upload bằng chứng công việc thất bại');
    }

    return (result.files || []).map((file: UploadedFileResponse, index: number) =>
      FileUploadAPI.mapDirectUpload(file, files[index]?.name || `evidence-${index}`)
    );
  }

  private static mapDirectUpload(file: UploadedFileResponse, fallbackName: string): UploadedAsset {
    return {
      id: file.id,
      name: file.originalName || file.name || fallbackName,
      size: file.size || file.filesize || 0,
      type: file.mimetype || file.type || 'application/octet-stream',
      url: file.url,
      uploadedAt: file.uploadedAt || new Date().toISOString(),
    };
  }
}
