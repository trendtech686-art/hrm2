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
  metadata: string; // Smart filename metadata
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
  metadata: string; // Smart filename metadata
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
  // NOTE: employeeId MUST be the systemId (immutable), NOT the business ID
  // This ensures files remain accessible even if the employee's business ID changes
  static async confirmStagingFiles(
    sessionId: string,
    employeeId: string, // ⚠️ MUST use systemId (e.g., "NV00000001"), NOT business ID (e.g., "NV001")
    documentType: string,
    documentName: string,
    employeeData?: {
      name?: string;
      department?: string;
      [key: string]: any;
    }
  ): Promise<ServerFile[]> {
    const response = await fetch(
      `${API_BASE_URL}/staging/confirm/${sessionId}/${employeeId}/${documentType}/${encodeURIComponent(documentName)}`,
      { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ employeeData })
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
    } catch (error) {
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
    return `${API_BASE_URL.replace('/api', '')}${file.url}`;
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

  // Confirm product images from staging to permanent
  static async confirmProductImages(
    sessionId: string,
    productId: string,
    productData?: {
      name?: string;
      [key: string]: any;
    }
  ): Promise<ServerFile[]> {
    const response = await fetch(
      `${API_BASE_URL}/staging/confirm/${sessionId}/products/${productId}`,
      { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productData })
      }
    );

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Confirm product images failed');
    }

    return result.files;
  }

  // Confirm customer images from staging to permanent
  static async confirmCustomerImages(
    sessionId: string,
    customerId: string,
    customerData?: {
      name?: string;
      [key: string]: any;
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
      [key: string]: any;
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
}
