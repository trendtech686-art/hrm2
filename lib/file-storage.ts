// File Storage System - Lưu file vật lý thay vì localStorage
import { toast } from "sonner";
import { logError } from '@/lib/logger'

export type StoredFile = {
  id: string;
  name: string;
  size: number;
  type: string;
  path: string; // Đường dẫn file vật lý
  url: string;  // URL để truy cập
  uploadedAt: string;
};

export class FileStorageManager {
  private baseDir = 'uploads/employees'; // Thư mục lưu file
  private baseUrl = '/uploads/employees'; // URL base để truy cập

  constructor() {
    this.ensureDirectoryExists();
  }

  // Tạo thư mục nếu chưa có
  private ensureDirectoryExists() {
    // Trong môi trường thực tế, cần tạo folder trên server
    // Ở đây chúng ta sẽ mô phỏng
  }

  // Upload file và lưu vật lý
  async uploadFile(
    file: File, 
    employeeId: string, 
    documentType: string, 
    _documentName: string
  ): Promise<StoredFile | null> {
    try {
      // Tạo đường dẫn theo cấu trúc: uploads/employees/{employeeId}/{documentType}/
      const employeeDir = `${this.baseDir}/${employeeId}`;
      const documentDir = `${employeeDir}/${documentType}`;
      
      // Tạo tên file unique
      const timestamp = Date.now();
      const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${timestamp}_${cleanName}`;
      const filePath = `${documentDir}/${fileName}`;
      const fileUrl = `${this.baseUrl}/${employeeId}/${documentType}/${fileName}`;

      // Trong môi trường thực, sẽ upload lên server/filesystem
      // Ở đây ta mô phỏng bằng cách lưu thông tin
      const storedFile: StoredFile = {
        id: `file_${timestamp}_${crypto.randomUUID().replace(/-/g, '').slice(0, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        path: filePath,
        url: fileUrl,
        uploadedAt: new Date().toISOString(),
      };

      // Mô phỏng việc upload (trong thực tế sẽ gọi API)
      await this.saveFileToServer(file, filePath);
      
      return storedFile;
    } catch (error) {
      logError('Upload failed', error);
      toast.error('Lỗi khi upload file', {
        description: error instanceof Error ? error.message : 'Lỗi không xác định'
      });
      return null;
    }
  }

  // Mô phỏng lưu file lên server
  private async saveFileToServer(_file: File, _path: string): Promise<void> {
    // Trong thực tế, đây sẽ là FormData upload lên server
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 100);
    });
  }

  // Xóa file vật lý
  async deleteFile(_storedFile: StoredFile): Promise<boolean> {
    try {
      // Gọi API xóa file trên server
      return true;
    } catch (error) {
      logError('Delete failed', error);
      return false;
    }
  }

  // Lấy URL để hiển thị file
  getFileUrl(storedFile: StoredFile): string {
    return storedFile.url;
  }

  // Create directory via server API (optional - server auto-creates on first upload)
  async createEmployeeDirectories(employeeId: string): Promise<boolean> {
    try {
      // Create directories via API
      const response = await fetch('/api/upload/directories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId,
          baseDir: this.baseDir,
          subDirs: ['legal', 'work-process', 'termination', 'decisions', 'kpi', 'requests'],
        }),
      });

      if (!response.ok) {
        // Non-fatal: server may auto-create directories
        console.warn('Directory creation API not available, server will auto-create on upload');
        return false;
      }

      return true;
    } catch (error) {
      // Non-fatal error - server auto-creates directories on first file upload
      console.warn('Directory creation skipped, server will auto-create:', error);
      return false;
    }
  }

  // Create cấu trúc thư mục cho nhân viên
  // Directories are auto-created by server on first file upload via FileUploadAPI
  // This method returns the expected directory structure for reference
  createEmployeeFolder(employeeId: string): string {
    const employeeDir = `${this.baseDir}/${employeeId}`;

    // Các thư mục con theo loại tài liệu (tạo tự động khi upload)
    const subDirs = [
      'legal',        // Hồ sơ pháp lý
      'work-process', // Quy trình làm việc
      'termination',  // Thôi việc
      'decisions',    // Quyết định
      'kpi',          // KPI
      'requests'      // Đơn từ
    ];

    // Subdirectories are auto-created by server on first file upload
    // No explicit API call needed - FileUploadAPI handles this automatically
    // Optionally call createEmployeeDirectories() for proactive creation

    return employeeDir;
  }

  // Lấy thông tin dung lượng
  getStorageInfo(): { used: number; available: number } {
    // Trong thực tế sẽ check dung lượng server
    return {
      used: 0, // MB đã dùng
      available: 1000 // MB còn lại
    };
  }
}

// Singleton instance
export const fileStorage = new FileStorageManager();
