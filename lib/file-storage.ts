// File Storage System - Lưu file vật lý thay vì localStorage
import { toast } from "sonner";

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
    console.log(`Ensuring directory exists: ${this.baseDir}`);
  }

  // Upload file và lưu vật lý
  async uploadFile(
    file: File, 
    employeeId: string, 
    documentType: string, 
    documentName: string
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
        id: `file_${timestamp}_${Math.random().toString(36).substr(2, 9)}`,
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
      console.error('Upload failed:', error);
      toast.error('Lỗi khi upload file', {
        description: error instanceof Error ? error.message : 'Lỗi không xác định'
      });
      return null;
    }
  }

  // Mô phỏng lưu file lên server
  private async saveFileToServer(file: File, path: string): Promise<void> {
    // Trong thực tế, đây sẽ là FormData upload lên server
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`File saved to: ${path} (${file.size} bytes)`);
        resolve();
      }, 100);
    });
  }

  // Xóa file vật lý
  async deleteFile(storedFile: StoredFile): Promise<boolean> {
    try {
      // Gọi API xóa file trên server
      console.log(`Deleting file: ${storedFile.path}`);
      return true;
    } catch (error) {
      console.error('Delete failed:', error);
      return false;
    }
  }

  // Lấy URL để hiển thị file
  getFileUrl(storedFile: StoredFile): string {
    return storedFile.url;
  }

  // Tạo cấu trúc thư mục cho nhân viên
  createEmployeeFolder(employeeId: string): string {
    const employeeDir = `${this.baseDir}/${employeeId}`;
    
    // Tạo các thư mục con theo loại tài liệu
    const subDirs = [
      'legal',        // Hồ sơ pháp lý
      'work-process', // Quy trình làm việc  
      'termination',  // Thôi việc
      'decisions',    // Quyết định
      'kpi',          // KPI
      'requests'      // Đơn từ
    ];

    subDirs.forEach(dir => {
      const fullPath = `${employeeDir}/${dir}`;
      console.log(`Creating directory: ${fullPath}`);
    });

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
